"use strict"

// const Handlers = require("./handlers.js");
const PathToRegex = {};//require("path-to-regex");



module.exports = Router;

/**
 * Класс Router [description].
 * @constructor
 * @param {Object} options [description].
 */
function Router( options ) {
	this.handlers = [];
	this.methods = {};
	this.init( typeof options === "object"?options:{} );
	//console.log(this.methods);
	return this;
}

/**
 * Метод инициализирует объект класса Router.
 * @param  {Object} options.          Объект с параметрами инициализации.
 * @param  {Array}  options.methods   Список методов, обрабатываемых экземпляром класса. По умолчанию это ["get","put","update","delete"].
 */
Router.prototype.init = function({
	methods=["get","put","update","delete"],
}) {
	this.addMethod("use");
	this.addMethod("all");
	this.addMethods(methods);
};

/**
 * Метод добавляет методы обработки данных.
 * @param {Array}  methods   Список методов, обрабатываемых экземпляром класса. По умолчанию это ["get","put","update","delete"].
 */
Router.prototype.addMethods = function(methods=["get","put","update","delete"]) {
	if(!Array.isArray(methods)) return;
	methods.forEach(method=>{
		this.addMethod(method);
	});
};

/**
 * Метод добавляет метод обработки данных. 
 * Если метод с таким именем уже существует, то запрос на добавление метода инорируется.
 * @param {string}  method   Наименование добавляемого метода.
 */
Router.prototype.addMethod = function(method) {
	if( typeof method !== "string" ) return;
	if( this[method] ) return;
	
	// создаем для метода функцию-обработчик
	this.methods[method] = this[method] = (...args)=>{
		const params = this.restructArguments(...args);
		//console.log("handlers 01:", params.handlers);
		this.handlers.push({type:"method", method:method, path:params.regex, handlers:params.handlers});
	};
};


/**
 * Метод систематизирует аргументы, используемые при создании слушателей событий. 
 * @param  {...(string|RegExp|function|function[])} args список аргументов может содержать название метода, путь а также функцию обработчик и/или массив таких функций
 * @return {Object} return.         Объект содержащий реструктурированные данные. 
 * @return {string} return.method   Наименование метода обработки данных.
 * @return {Object} return.path     Объект содержащий данные для сопоставления пути.
 * @return {RegExp} return.path.regexp     Регулярное выражение для сопоставления пути.
 * @return {Object} return.path.keys  Список ключей.
 * @return {Array}  return.handlers Массив функций-обработчиков.
 */
Router.prototype.restructArguments = function(...args) {
	//console.log("args:", args);
	const restruct = {
		// method: "use",
		handlers: []
	};
	
	// if( Object.keys(this.methods).some( method=>{return method===args[0]} ) ){
	// 	restruct.method = args.shift();
	// }
	if( args[0] instanceof RegExp ){
		restruct.regex = new PathToRegex(args.shift());
	}else if( typeof args[0] === "string" ){
		restruct.regex = new PathToRegex(args.shift());
	}

	restruct.handlers = this.findHandlers(args);
	//console.log("handlers 00:", restruct.handlers)

	return restruct
}



/**
 * Метод производит поиск всех функций переданных в аргументах и формирует из них плоский массив.
 * @param  {...(string|function|function[])} args Массив аргументов, может содержать строки, функции и массивы функций.
 * @return {function[]}         Плоский массив всех найденых функций.
 */
Router.prototype.findHandlers = function(args) {
	const handlers = [];
	args.forEach(item=>{
		if(typeof item === "function"){
			//console.log("findHandlers 00:",item);
			handlers.push(item);
		}else if(Array.isArray(item)){
			this.findHandlers(item).forEach(handler=>{
				//console.log("findHandlers 01:",handler);
				handlers.push(handler);
			});
		}
	});
	return handlers;
}


Router.prototype.input = function(data) {
	// body...
};

Router.prototype.output = function(data) {
	// body...
};

