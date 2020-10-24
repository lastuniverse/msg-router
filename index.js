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
    this.handlers =[];
    this.count=0;
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

    if (typeof path === 'function') {
      handlers.push(path);
      path = this.separator;
    }
    if (!handlers.length) return null;
    if (!path) path = this.separator;
    const self = this;    
    const parser = (path === this.separator) ? ({ match: () => ({}) }) : new PathToRegex(path, { separators: this.separator, toEnd: false });
    

    handlers.forEach(handler=>{
      if(typeof handler !== "function" && !(handler instanceof MsgRouter))
        return null;

        // создали замыкание на index текущего обработчика
        let count = this.count;

        function next(error){
          // контекст данной вункции переопределяется в методе .process(...)

          const params = parser.match(this.message.targetPath);
        //   const list = this.message.targetPath.split(self.separator).filter(a=>a);
        //   console.log(this.message.targetPath, params, list, path, parser.regexp)

        //   const first = list.shift();

          const nextitem = self.handlers[count+1];
          const cb = nextitem?nextitem.next.bind(this):this.cbEnd;

          const message = { ...this.message };
          message.targetPath = message.targetPath.slice(path.length);
          // console.log(message.targetPath, path.length, path, params,parser.regexp);
      

          
        //   if (!params && !parser.match(first)) return cb();
          if (!params) return cb();

          if(error){
            
            if (typeof handler === 'function'&& handler.length===3) {
              try {
                handler(error,{ ...this.message, params: {...params} }, cb);  
              } catch (e) {
                cb(e);
              }
            }else{
              cb(error)
            }

          }else{
            if (handler instanceof MsgRouter) {
            //   const message = { ...this.message };
            // //   message.targetPath = list.join(self.separator);
            //   message.targetPath = message.targetPath.slice(0, path.length);
            //   console.log(message.targetPath);
              
              handler.process(message, cb);
            }else if (typeof handler === 'function'&& handler.length<3) {
              try {
                handler({ ...this.message, params }, cb);
              } catch (e) {
                cb(e);
              }
            }else{
              cb();
            }
          }
        }
        

        if(!this.isSetStart){
          this.isSetStart = true;
          this.start = next;
        }

        this.handlers[this.count]={
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
  process(message,cbEnd=()=>{}) {
    if (!message && !message.targetPath) return cbEnd();
    if (!this.handlers.length) return cbEnd();
    const first = this.handlers[0];
    const start = first.next.bind({message,cbEnd});
    start();
  }  
}


module.exports = exports = MsgRouter;






const route_aaa = new MsgRouter();
const route_bbb = new MsgRouter();
const route_ccc = new MsgRouter();

// route_aaa.use((msg, next) => {
//   console.log('route_aaa', 0, msg);
//   next();
// });


// route_aaa.use('/aaa/bbb', route_bbb);

// route_aaa.use('/aaa',(msg, next) => {
//   console.log('route_aaa', 1, msg);
//   next();
// });

// route_aaa.use('/aaa/Aparam',(msg, next) => {
//   console.log('route_aaa', 1, msg);
//   next();
// });


// route_aaa.use((err, msg, next) => {
//   console.log('route_aaa', "ERROR", err, msg);
//   next();
// });

// // /*************************************** */

// route_bbb.use((msg, next) => {
//   console.log('route_bbb', 0, msg);
//   // throw 456;
//   next();
// });

// route_bbb.use('/ccc', route_ccc);

// route_bbb.use(':Bparam*',(msg, next)=>{
//   console.log("route_bbb", 1, msg);
//   next();
// });

// route_bbb.use((err, msg, next) => {
//   console.log('route_bbb', "ERROR", err, msg);
//   next(err);
// });


// // /*************************************** */

// route_ccc.use((msg, next) => {
//   console.log('route_ccc', 0, msg);
//   next();
// });

// route_ccc.use('/:action', (msg, next) => {
//   console.log('route_ccc', 1, msg);
//   next();
// });

// route_ccc.use((err, msg, next) => {
//   console.log('route_ccc', "ERROR", err, msg);
//   next(err);
// });





// route_aaa.process({ targetPath: '/aaa', data: 'aaa' });
// route_aaa.process({ targetPath: '/aaa/bbb/ccc', data: 'aaa' });
