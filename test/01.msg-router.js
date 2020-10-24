const chai = require('chai');
const expect  = chai.expect;
const assert  = chai.assert;
const should  = chai.should;


const Router = require('../index.js');


describe("Тестируем класс кастомизируемого роутера", function() {

  const router = new Router();
  it("создаем роутер", function() {
    assert.equal( router instanceof Router, true);
  });

  it("проверяем набор свойств устанавливаемых по умолчанию", function() {
    assert.equal( JSON.stringify(Object.keys(router)), JSON.stringify(["separator","handlers","count","isSetStart","start"]) );
  });

  it("проверяем набор методов обработки данных устанавливаемых по умолчанию", function() {
    assert.equal( !!router.use && router.use.length===1 , true );
    assert.equal( !!router.process && router.use.length===1 , true );
  });

  router.use("/",function(){return 1;});
  router.use("/all/:id",function(){return 1;},function(){return 2;});
  router.use("/foo_(.*?)/:id/:record",function(){return 1;},[function(){return 2;},function(){return 3;}]);
  router.use(/^bar_(.*?)$/,function(){return 1;},[function(){return 2;},function(){return 3;}],function(){return 4;});
  //custom_router.handlers[0].path.regexp = /\//;
  it("проверяем набор обработчиков созданных пользователем", function() {
    //assert.equal( JSON.stringify(custom_router.handlers[0]), JSON.stringify({"type":"method","method":"use","path":{"keys":[],"path":"/","regstr":"/","regexp":{}},"handlers":[null]}) );
    // assert.equal( ""+router.handlers[0].parser.regexp , ""+/^\/$/ );
    // assert.equal( router.handlers[0].handler.toString() , "function(){return 1;}" );

    //assert.equal( JSON.stringify(custom_router.handlers[1]), JSON.stringify({"type":"method","method":"all","path":{"keys":[{"key":"id","pattern":"[^/]+?"}],"path":"/all/:id","regstr":"/all/(?<id>[^/]+?)","regexp":{}},"handlers":[null,null]}) );
    // assert.equal( ""+router.handlers[1].parser.regexp , ""+/^\/all\/(?<id>[^\/]+?)$/ );

    //assert.equal( JSON.stringify(custom_router.handlers[2]), JSON.stringify({"type":"method","method":"foo","path":{"keys":[{"key":"id","pattern":"[^/]+?"},{"key":"record","pattern":"[^/]+?"}],"path":"/foo_(.*?)/:id/:record","regstr":"/foo_(\\.*?)/(?<id>[^/]+?)/(?<record>[^/]+?)","regexp":{}},"handlers":[null,null,null]}) );
    // assert.equal( ""+router.handlers[2].path.regexp , ""+/^\/foo_(\.*?)\/(?<id>[^\/]+?)\/(?<record>[^\/]+?)$/ );
    // assert.equal( router.handlers[2].handlers.join(), "function(){return 1;},function(){return 2;},function(){return 3;}" );

    //assert.equal( JSON.stringify(custom_router.handlers[3]), JSON.stringify({"type":"method","method":"bar","path":{"keys":[],"regexp":{}},"handlers":[null,null,null,null]}) );
    // assert.equal( ""+router.handlers[3].path.regexp , ""+/^bar_(.*?)$/ );
    // assert.equal( router.handlers[3].handlers.join(), "function(){return 1;},function(){return 2;},function(){return 3;},function(){return 4;}" );
  });

});