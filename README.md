# msg-router
Simple intermediate layer router for data messages in JSON format


## usage
```
const route_aaa = new MsgRouter();
const route_bbb = new MsgRouter();
const route_ccc = new MsgRouter();

route_aaa.use((msg, next) => {
  console.log('route_aaa', 0, msg);
  next();
});


route_aaa.use('/aaa/bbb/:action*', route_bbb);

route_aaa.use((msg, next) => {
  console.log('route_aaa', 1, msg);
  // throw 456;
  next();

});

route_aaa.use('/aaa/:other*',(msg, next) => {
  console.log('route_aaa', 2, msg);
  // throw 456;
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

route_bbb.use(':action*',(msg, next)=>{
  console.log("route_bbb", 1, msg);
  next();
});

route_bbb.use((err, msg, next) => {
  console.log('route_bbb', "ERROR", err, msg);
  next(err);
});


// /*************************************** */

route_ccc.use((msg, next) => {
  console.log('route_ccc', 0, msg);
  next();
});

route_ccc.use('/:action', (msg, next) => {
  console.log('route_ccc', 1, msg);
  next();
});

route_ccc.use((err, msg, next) => {
  console.log('route_ccc', "ERROR", err, msg);
  next(err);
});


route_aaa.process({ targetPath: '/aaa', data: 'aaa' });
```