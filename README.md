# msg-router
> Simple intermediate layer router for data messages in JSON format

[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

## Installation

```
npm install msg-route --save
```

## usage
This module can be used to route any data to their handlers. For more glkbokog understanding, consider the following example of routing telegram bot messages.


### Eхample for telegram bot

stc/bot.main.js
```javascript
const { Telegraf } = require('telegraf');
const MsgRouter = require('msg-router');

const bot = new Telegraf("your telegram token");
const router = new MsgRouter();

// connect routers
const routerForHelp = require('./routers/command.help.js')
router.use("/help", routerForHelp);

const routerForWeather = require('./routers/command.weather.js')
router.use("/weather", routerForWeather);



// the error handler must be the last in the handler chain. 
// The error handler function, unlike a regular handler, takes three arguments:
//  error   - an object with information about the error
//  message - the message, the processing of which led to the generation of an exception
//  next    - a function whose call will result in the transfer of control to the next 
//            handler (if when calling next (argument) the argument is not defined, 
//            then the next handler will be called, if defined, then the next error 
//            handler will be called
router.use((err, msg, next) => {
    // тут можно обработать ошибки
    console.log('bot.main.js', 0, msg.ctx.text);

    // или передать их на обработку дальше
    next(err);
});



// install a message handler that starts routing via MsgRouter
bot.on("message", (ctx) => {
    // form the path from the message text
    const targetPath = ctx.message.text.replace(/\s+/g,"/")

    // pass the path and object with the bot context to the router
    router.process({
        targetPath, 
        ctx
    });
})

// launch the bot
bot.launch()

```

the router files (src/routers/command.help.js and src/routers/command.weather.js) will be something like this:
```javascript
const MsgRouter = require('msg-router');
const router = new MsgRouter();


// handler argument to / help command
router.use("/:args*", (msg, next) => {
    // this handler is called for all messages starting with "help" or "/help"
    // command arguments will be in an array in msg.params.args
    // for a more complete understanding of the syntax used 
    // for path see the module description https://www.npmjs.com/package/path-to-regex

    ...
    your handler code
    ... 

    // we can also reply to the user with msg.ctx.reply ("...")
    msg.ctx.reply("Српавку еще не завезли");
    
    // call next (); if we want to transfer processing to the next handlers. 
    // If next (argument); will be called with an argument, this will ignore
    // subsequent handlers and the next error handler will be called.
    // You can achieve the same behavior by calling an error with throw
    next();
});


// Error handler
router.use((err, msg, next) => {
    // This handler will be called when an error occurs in the code of the previous 
    // handlers of this router, as well as its sub-routers if you send an error 
    // in their error handlers with the next (error) command
    ...
    your error handler code
    ... 

    next(err);
});

// exporting the router
module.exports = exports = router;
```




### Another, simple, abstracted example
```javascript
const MsgRouter = require('msg-router');


/*************************************** */
const route_aaa = new MsgRouter();
const route_bbb = new MsgRouter();
const route_ccc = new MsgRouter();


/*************************************** */
route_aaa.use((msg, next) => {
  console.log('route_aaa', 0, msg);
  next();
});


route_aaa.use('/aaa/bbb', route_bbb);

route_aaa.use('/aaa',(msg, next) => {
  console.log('route_aaa', 1, msg);
  next();
});

route_aaa.use('/aaa/:Aparam*',(msg, next) => {
  console.log('route_aaa', 1, msg);
  next();
});


route_aaa.use((err, msg, next) => {
  console.log('route_aaa', "ERROR", err, msg);
  next();
});


/*************************************** */
route_bbb.use((msg, next) => {
  console.log('route_bbb', 0, msg);
  // throw 456;
  next();
});

route_bbb.use('/ccc', route_ccc);

route_bbb.use(':Bparam*',(msg, next)=>{
  console.log("route_bbb", 1, msg);
  next();
});

route_bbb.use((err, msg, next) => {
  console.log('route_bbb', "ERROR", err, msg);
  next(err);
});



/*************************************** */
route_ccc.use((msg, next) => {
  console.log('route_ccc', 0, msg);
  next();
});

route_ccc.use('/:Cparam', (msg, next) => {
  console.log('route_ccc', 1, msg);
  next();
});

route_ccc.use((err, msg, next) => {
  console.log('route_ccc', "ERROR", err, msg);
  next(err);
});


/*************************************** */
// route_aaa.process({ targetPath: '/aaa', data: 'aaa' });
route_aaa.process({ targetPath: '/aaa/bbb/ccc', data: 'aaa' });
```

... documentation in processed


## Participation in development
```
https://github.com/lastuniverse/msg-router/issues
```
## License

MIT

[![NPM](https://nodei.co/npm/msg-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/msg-router/)

[npm-image]: https://img.shields.io/npm/v/msg-router.svg?style=flat
[npm-url]: https://npmjs.org/package/msg-router
[david-image]: http://img.shields.io/david/lastuniverse/msg-router.svg?style=flat
[david-url]: https://david-dm.org/lastuniverse/msg-router
[license-image]: http://img.shields.io/npm/l/msg-router.svg?style=flat
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/msg-router.svg?style=flat
[downloads-url]: https://npmjs.org/package/msg-router
