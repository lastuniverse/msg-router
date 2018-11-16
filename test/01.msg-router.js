const chai = require('chai');
const expect  = chai.expect;
const assert  = chai.assert;
const should  = chai.should;


const Router = require('../lib/router.js');


describe("Тестируем класс кастомизируемого роутера", function() {

  const default_router = new Router();
  it("создаем роутер", function() {
    assert.equal( default_router instanceof Router, true);
  });

  it("проверяем набор методов обработки данных устанавливаемых по умолчанию", function() {
    assert.equal( JSON.stringify(Object.keys(default_router.methods)), JSON.stringify(["use","all","get","put","update","delete"]) );
  });

  const custom_router = new Router({methods:["foo","bar"]});
  it("проверяем набор методов обработки данных заданный пользователем", function() {
    assert.equal( JSON.stringify(Object.keys(custom_router.methods)), JSON.stringify(["use","all","foo","bar"]) );
  });

  custom_router.use("/",function(){return 1;});
  custom_router.all("/all/:id",function(){return 1;},function(){return 2;});
  custom_router.foo("/foo_(.*?)/:id/:record",function(){return 1;},[function(){return 2;},function(){return 3;}]);
  custom_router.bar(/^bar_(.*?)$/,function(){return 1;},[function(){return 2;},function(){return 3;}],function(){return 4;});
  //custom_router.handlers[0].path.regexp = /\//;
  it("проверяем набор обработчиков созданных пользователем", function() {
    //assert.equal( JSON.stringify(custom_router.handlers[0]), JSON.stringify({"type":"method","method":"use","path":{"keys":[],"path":"/","regstr":"/","regexp":{}},"handlers":[null]}) );
    assert.equal( ""+custom_router.handlers[0].path.regexp , ""+/^\/$/ );
    assert.equal( custom_router.handlers[0].handlers.join(), "function(){return 1;}" );

    //assert.equal( JSON.stringify(custom_router.handlers[1]), JSON.stringify({"type":"method","method":"all","path":{"keys":[{"key":"id","pattern":"[^/]+?"}],"path":"/all/:id","regstr":"/all/(?<id>[^/]+?)","regexp":{}},"handlers":[null,null]}) );
    assert.equal( ""+custom_router.handlers[1].path.regexp , ""+/^\/all\/(?<id>[^\/]+?)$/ );
    assert.equal( custom_router.handlers[1].handlers.join(), "function(){return 1;},function(){return 2;}" );

    //assert.equal( JSON.stringify(custom_router.handlers[2]), JSON.stringify({"type":"method","method":"foo","path":{"keys":[{"key":"id","pattern":"[^/]+?"},{"key":"record","pattern":"[^/]+?"}],"path":"/foo_(.*?)/:id/:record","regstr":"/foo_(\\.*?)/(?<id>[^/]+?)/(?<record>[^/]+?)","regexp":{}},"handlers":[null,null,null]}) );
    assert.equal( ""+custom_router.handlers[2].path.regexp , ""+/^\/foo_(\.*?)\/(?<id>[^\/]+?)\/(?<record>[^\/]+?)$/ );
    assert.equal( custom_router.handlers[2].handlers.join(), "function(){return 1;},function(){return 2;},function(){return 3;}" );

    //assert.equal( JSON.stringify(custom_router.handlers[3]), JSON.stringify({"type":"method","method":"bar","path":{"keys":[],"regexp":{}},"handlers":[null,null,null,null]}) );
    assert.equal( ""+custom_router.handlers[3].path.regexp , ""+/^bar_(.*?)$/ );
    assert.equal( custom_router.handlers[3].handlers.join(), "function(){return 1;},function(){return 2;},function(){return 3;},function(){return 4;}" );
  });

});