import cdnInfo from '../cdnInfo';
export default ((win, doc, undef) => {
  function getCurrentScript() {
    //取得正在解析的script节点
    if (doc.currentScript) { //firefox 4+
      return doc.currentScript.src;
    }
    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
    var stack;
    try {
      a.b.c(); //强制报错,以便捕获e.stack
    } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
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
      script.onload = script.onreadystatechange = script.onerror = function() {
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
      self.deps.forEach((dep, index) => {
        if(loadings[dep] === undefined) {
          loadings[dep] = 0;
          loadScript(dep, () => loadings[dep] = 2);
        }
      });
    }
    function checkDepsReady(module) {
      return module.deps.reduce((prev, current) => prev && cache[current], true);
    }
    function compileReadyModules() {
      const l = Object.keys(uncompiled).length;
      for(const id in uncompiled) {
        let module = uncompiled[id];
        if(checkDepsReady(module)) module.depsCompiled();
      }
      if (l > Object.keys(uncompiled).length) compileReadyModules();
    }
    var self = this;
    this.id = path;
    this.deps = deps;
    this.factory = factory;
    uncompiled[this.id] = this;
    this.depsCompiled = function() {
      delete uncompiled[this.id];
      cache[this.id] = self;
      return self.exports = factory(...this.deps.map(dep => cache[dep].exports));
    }
    if (deps.length === 0) {
      this.depsCompiled();
      compileReadyModules();
    }
    loadDeps();
  }

  Module.prototype = {
    constructor: Module,
  };

  win.define = function(path, deps, factory) {
    var p, d, f;
    switch(arguments.length){
      case 0:
        throw new Error('Must provide at least 1 argument');
      case 1:
        p = getCurrentScript();
        d = [];
        f = arguments[0];
        break;
      case 2:
        p = getCurrentScript();
        d = arguments[0];
        f = arguments[1];
        break;
      case 3:
        p = arguments[0];
        d = arguments[1];
        f = arguments[2];
        break;
    }
    d = d.map(dep => {
      if(!/^http:|https:/i.test(dep)) {
        if(cdnInfo[dep]) return cdnInfo[dep].minUrl;
        else throw new Error('Can\'t find dependency in cdn');
      }
      return dep;
    });
    new Module(p, d, f);
  };
  win.define.amd = true;
})(window, document);

export cdnInfo;
