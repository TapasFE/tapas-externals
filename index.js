(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _cdnInfo = __webpack_require__(1);

	var _cdnInfo2 = _interopRequireDefault(_cdnInfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	exports.default = (function (win, doc, undef) {
	  function getCurrentScript() {
	    //取得正在解析的script节点
	    if (doc.currentScript) {
	      //firefox 4+
	      return doc.currentScript.src;
	    }
	    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
	    var stack;
	    try {
	      a.b.c(); //强制报错,以便捕获e.stack
	    } catch (e) {
	      //safari的错误对象只有line,sourceId,sourceURL
	      stack = e.stack;
	      if (!stack && window.opera) {
	        //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
	        stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
	      }
	    }
	    if (stack) {
	      /**e.stack最后一行在所有支持的浏览器大致如下:
	       *chrome23:
	       * at http://113.93.50.63/data.js:4:1
	       *firefox17:
	       *@http://113.93.50.63/query.js:4
	       *opera12:
	       *@http://113.93.50.63/data.js:4
	       *IE10:
	       *  at Global code (http://113.93.50.63/data.js:4:1)
	       */
	      stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
	      stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
	      return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
	    }
	    var nodes = doc.getElementsByTagName("script"); //只在head标签中寻找
	    for (var i = 0, node; node = nodes[i++];) {
	      if (node.readyState === "interactive") {
	        return node.className = node.src;
	      }
	    }
	  }

	  var cache = {},
	      loadings = {},
	      uncompiled = {};

	  function Module(path, deps, factory) {
	    function loadScript(path, cb) {
	      loadings[path] = 1;
	      var script = doc.createElement('script'),
	          parent = doc.getElementsByTagName('head')[0];
	      script.onload = script.onreadystatechange = script.onerror = function () {
	        if (/loaded|complete|undefined/.test(script.readyState)) {
	          script.onload = script.onerror = script.onreadystatechange = null;
	          script.parentNode.removeChild(script);
	          script = undef;
	          if (cb) cb();
	        }
	      };
	      script.src = path;
	      parent.appendChild(script);
	    }
	    function loadDeps() {
	      self.deps.forEach(function (dep, index) {
	        if (loadings[dep] === undefined) {
	          loadings[dep] = 0;
	          loadScript(dep, function () {
	            return loadings[dep] = 2;
	          });
	        }
	      });
	    }
	    function checkDepsReady(module) {
	      return module.deps.reduce(function (prev, current) {
	        return prev && cache[current];
	      }, true);
	    }
	    function compileReadyModules() {
	      var l = Object.keys(uncompiled).length;
	      for (var id in uncompiled) {
	        var module = uncompiled[id];
	        if (checkDepsReady(module)) module.depsCompiled();
	      }
	      if (l > Object.keys(uncompiled).length) compileReadyModules();
	    }
	    var self = this;
	    this.id = path;
	    this.deps = deps;
	    this.factory = factory;
	    uncompiled[this.id] = this;
	    this.depsCompiled = function () {
	      delete uncompiled[this.id];
	      cache[this.id] = self;
	      return self.exports = factory.apply(undefined, _toConsumableArray(this.deps.map(function (dep) {
	        return cache[dep].exports;
	      })));
	    };
	    if (deps.length === 0) {
	      this.depsCompiled();
	      compileReadyModules();
	    }
	    loadDeps();
	  }

	  Module.prototype = {
	    constructor: Module
	  };

	  win.define = function (path, deps, factory) {
	    var p, d, f;
	    if (typeof path !== 'string') {
	      p = getCurrentScript();
	      d = path;
	      f = deps;
	    } else {
	      p = path;
	      d = deps;
	      f = factory;
	    }
	    d = d.map(function (dep) {
	      if (!/^http:|https:/i.test(dep)) {
	        if (_cdnInfo2.default[dep]) return _cdnInfo2.default[dep].minUrl;else throw new Error('Can\'t find dependency in cdn');
	      }
	      return dep;
	    });
	    new Module(p, d, f);
	  };
	  win.define.amd = true;
	})(window, document);

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  "react": {
	    "name": "react",
	    "global": "React",
	    "url": "http://cdn.bootcss.com/react/0.14.3/react.js",
	    "minUrl": "http://cdn.bootcss.com/react/0.14.3/react.min.js",
	    "version": "0.14.3"
	  },
	  "react-dom": {
	    "name": "react-dom",
	    "global": "ReactDOM",
	    "url": "http://cdn.bootcss.com/react/0.14.3/react-dom.js",
	    "minUrl": "http://cdn.bootcss.com/react/0.14.3/react-dom.min.js",
	    "version": "0.14.3"
	  },
	  "superagent": {
	    "name": "superagent",
	    "global": "superagent",
	    "url": "http://cdn.bootcss.com/superagent/1.2.0/superagent.js",
	    "minUrl": "http://cdn.bootcss.com/superagent/1.2.0/superagent.min.js",
	    "version": "1.2.0"
	  },
	  "lodash": {
	    "name": "lodash",
	    "global": "_",
	    "url": "http://cdn.bootcss.com/lodash.js/3.10.1/lodash.js",
	    "minUrl": "http://cdn.bootcss.com/lodash.js/3.10.1/lodash.min.js",
	    "version": "3.10.1"
	  },
	  "immuntable": {
	    "name": "immuntable",
	    "global": "Immuntable",
	    "url": "http://cdn.bootcss.com/immutable/3.7.5/immutable.js",
	    "minUrl": "http://cdn.bootcss.com/immutable/3.7.5/immutable.min.js",
	    "version": "3.7.5"
	  },
	  "react-router": {
	    "name": "react-router",
	    "global": "ReactRouter",
	    "url": "http://cdn.bootcss.com/react-router/1.0.2/ReactRouter.js",
	    "minUrl": "http://cdn.bootcss.com/react-router/1.0.2/ReactRouter.min.js",
	    "version": "1.0.2"
	  },
	  "jquery": {
	    "name": "jquery",
	    "global": "$",
	    "url": "http://cdn.bootcss.com/jquery/3.0.0-alpha1/jquery.js",
	    "minUrl": "http://cdn.bootcss.com/jquery/3.0.0-alpha1/jquery.min.js",
	    "version": "3.0.0-alpha1"
	  }
	};

/***/ }
/******/ ])
});
;