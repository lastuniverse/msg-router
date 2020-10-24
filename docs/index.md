## Classes

<dl>
<dt><a href="#MsgRouter">MsgRouter</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#PathToRegex">PathToRegex</a></dt>
<dd><p>Данный модуль реализует роутинг сообщений по типу express.js</p>
</dd>
</dl>

<a name="MsgRouter"></a>

## MsgRouter
**Kind**: global class  

* [MsgRouter](#MsgRouter)
    * [new MsgRouter(separator)](#new_MsgRouter_new)
    * [.use(path, ...handlers)](#MsgRouter+use)
    * [.process(message)](#MsgRouter+process)

<a name="new_MsgRouter_new"></a>

### new MsgRouter(separator)
создает объект роутера от класса MsgRouter


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| separator | <code>\*</code> | <code>/</code> | похволяет установить разделитель используемый в path |

<a name="MsgRouter+use"></a>

### msgRouter.use(path, ...handlers)
Установить middleware

**Kind**: instance method of [<code>MsgRouter</code>](#MsgRouter)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | путь по аналогии с express-ом (реализовано с использованием модуля path-to-regex) |
| ...handlers | <code>function</code> \| [<code>MsgRouter</code>](#MsgRouter) | обработчик(и). Mогут быть экземплярами класса MsgRouter либо функциями.          Функция обработчик принимает 2 параметра:         - переданный на обработку объект         - функция next() работает аналогично функции next() в express         Функция обработчик ошибок принимает 3 параметра:         - объект ошибки         - переданный на обработку объект         - функция next() работает аналогично функции next() в express |

<a name="MsgRouter+process"></a>

### msgRouter.process(message)
Принимает на обработку объект сообщения

**Kind**: instance method of [<code>MsgRouter</code>](#MsgRouter)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Обрабатываемый объект, должен содержать свойство targetPath |

<a name="PathToRegex"></a>

## PathToRegex
Данный модуль реализует роутинг сообщений по типу express.js

**Kind**: global constant  
