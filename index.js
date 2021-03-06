"use strict"
/**
 * Данный модуль реализует роутинг сообщений по типу express.js
 */
const PathToRegex = require('path-to-regex');

/**
 * 
 */
class MsgRouter {
  /**
   * создает объект роутера от класса MsgRouter
   * @param {*} separator похволяет установить разделитель используемый в path
   */
  constructor(separator = '/') {
    this.separator = separator;
    this.handlers = [];
    this.count = 0;
    // this.parser = new pathToRegex(':path*', { separators: '/.' });
  }

  /**
   * Установить middleware
   * @param {String} path   путь по аналогии с express-ом (реализовано с использованием модуля path-to-regex)
   * @param  {...(Function|MsgRouter)} handlers обработчик(и). Mогут быть экземплярами класса MsgRouter либо функциями. 
   *         Функция обработчик принимает 2 параметра:
   *         - переданный на обработку объект
   *         - функция next() работает аналогично функции next() в express
   *         Функция обработчик ошибок принимает 3 параметра:
   *         - объект ошибки
   *         - переданный на обработку объект
   *         - функция next() работает аналогично функции next() в express
   */
  use(path, ...handlers) {

    if (typeof path === 'function' || path instanceof MsgRouter) {
      handlers.push(path);
      path = this.separator;
    }
    if (!handlers.length) return null;
    if (!path) path = this.separator;
    const self = this;
    const parser = (path === this.separator) ? ({ match: () => ({}) }) : new PathToRegex(path, { separators: this.separator, case: false, toEnd: false });

    const tokens = path.split(self.separator).filter(a => a);

    handlers.forEach(handler => {
      if (typeof handler !== "function" && !(handler instanceof MsgRouter))
        return null;

      // создали замыкание на index текущего обработчика
      let count = this.count;

      function next(error) {
        // контекст данной вункции переопределяется в методе .process(...)
        const nextitem = self.handlers[count + 1];

        // console.log(this.message.targetPath, self.handlers[count].parser.path, nextitem.parser.path)


        const params = parser.match(this.message.targetPath);



        const cb = (err, isRestorePath) => {
          const targetPath = this.message.targetPath;
          setImmediate(() => {
            (nextitem ? nextitem.next.bind(this) : this.next)(err);
            if (isRestorePath)
              this.message.targetPath = targetPath;
          })
        }

        if (!params) return cb(error);

        if (error) {

          if (typeof handler === 'function' && handler.length === 3) {
            try {
              this.message.params = params;
              handler(error, this.message, cb);
              // handler(error, { ...this.message, params: { ...params } }, cb);
            } catch (e) {
              cb(e);
            }
          } else {
            cb(error)
          }

        } else {
          if (handler instanceof MsgRouter) {
            // const message = { ...this.message };
            const list = this.message.targetPath
              .split(self.separator)
              .filter(a => a);
            list.splice(0, tokens.length)
            this.message.targetPath = list.join(self.separator);

            handler.process(this.message, cb);
          } else if (typeof handler === 'function' && handler.length < 3) {
            try {
              this.message.params = params;
              handler(this.message, cb);
              // handler({ ...this.message, params }, cb);
            } catch (e) {
              cb(e);
            }
          } else {
            cb(error);
          }
        }
      }


      if (!this.isSetStart) {
        this.isSetStart = true;
        this.start = next;
      }

      this.handlers[this.count] = {
        handler,
        parser,
        next
      }

      this.count++;


    });
  }
  /**
   * Принимает на обработку объект сообщения
   * @param {Object} message Обрабатываемый объект, должен содержать свойство targetPath
   */
  process(message, next = () => { }) {
    if (!message && !message.targetPath) return next(null, true);
    if (!this.handlers.length) return next(null, true);

    const first = this.handlers[0];
    const start = first.next.bind({ message, next: e => next(e, true) });
    start();
  }
}


module.exports = exports = MsgRouter;
