var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function mkStex(mathMode) {
  function pushCommand(state, command) {
    state.cmdState.push(command);
  }
  __name(pushCommand, "pushCommand");
  function peekCommand(state) {
    if (state.cmdState.length > 0) {
      return state.cmdState[state.cmdState.length - 1];
    } else {
      return null;
    }
  }
  __name(peekCommand, "peekCommand");
  function popCommand(state) {
    var plug = state.cmdState.pop();
    if (plug) {
      plug.closeBracket();
    }
  }
  __name(popCommand, "popCommand");
  function getMostPowerful(state) {
    var context = state.cmdState;
    for (var i = context.length - 1; i >= 0; i--) {
      var plug = context[i];
      if (plug.name == "DEFAULT") {
        continue;
      }
      return plug;
    }
    return { styleIdentifier: /* @__PURE__ */ __name(function() {
      return null;
    }, "styleIdentifier") };
  }
  __name(getMostPowerful, "getMostPowerful");
  function addPluginPattern(pluginName, cmdStyle, styles) {
    return function() {
      this.name = pluginName;
      this.bracketNo = 0;
      this.style = cmdStyle;
      this.styles = styles;
      this.argument = null;
      this.styleIdentifier = function() {
        return this.styles[this.bracketNo - 1] || null;
      };
      this.openBracket = function() {
        this.bracketNo++;
        return "bracket";
      };
      this.closeBracket = function() {
      };
    };
  }
  __name(addPluginPattern, "addPluginPattern");
  var plugins = {};
  plugins["importmodule"] = addPluginPattern("importmodule", "tag", ["string", "builtin"]);
  plugins["documentclass"] = addPluginPattern("documentclass", "tag", ["", "atom"]);
  plugins["usepackage"] = addPluginPattern("usepackage", "tag", ["atom"]);
  plugins["begin"] = addPluginPattern("begin", "tag", ["atom"]);
  plugins["end"] = addPluginPattern("end", "tag", ["atom"]);
  plugins["label"] = addPluginPattern("label", "tag", ["atom"]);
  plugins["ref"] = addPluginPattern("ref", "tag", ["atom"]);
  plugins["eqref"] = addPluginPattern("eqref", "tag", ["atom"]);
  plugins["cite"] = addPluginPattern("cite", "tag", ["atom"]);
  plugins["bibitem"] = addPluginPattern("bibitem", "tag", ["atom"]);
  plugins["Bibitem"] = addPluginPattern("Bibitem", "tag", ["atom"]);
  plugins["RBibitem"] = addPluginPattern("RBibitem", "tag", ["atom"]);
  plugins["DEFAULT"] = function() {
    this.name = "DEFAULT";
    this.style = "tag";
    this.styleIdentifier = this.openBracket = this.closeBracket = function() {
    };
  };
  function setState(state, f) {
    state.f = f;
  }
  __name(setState, "setState");
  function normal(source, state) {
    var plug;
    if (source.match(/^\\[a-zA-Z@\xc0-\u1fff\u2060-\uffff]+/)) {
      var cmdName = source.current().slice(1);
      plug = plugins.hasOwnProperty(cmdName) ? plugins[cmdName] : plugins["DEFAULT"];
      plug = new plug();
      pushCommand(state, plug);
      setState(state, beginParams);
      return plug.style;
    }
    if (source.match(/^\\[$&%#{}_]/)) {
      return "tag";
    }
    if (source.match(/^\\[,;!\/\\]/)) {
      return "tag";
    }
    if (source.match("\\[")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "\\]");
      });
      return "keyword";
    }
    if (source.match("\\(")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "\\)");
      });
      return "keyword";
    }
    if (source.match("$$")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "$$");
      });
      return "keyword";
    }
    if (source.match("$")) {
      setState(state, function(source2, state2) {
        return inMathMode(source2, state2, "$");
      });
      return "keyword";
    }
    var ch = source.next();
    if (ch == "%") {
      source.skipToEnd();
      return "comment";
    } else if (ch == "}" || ch == "]") {
      plug = peekCommand(state);
      if (plug) {
        plug.closeBracket(ch);
        setState(state, beginParams);
      } else {
        return "error";
      }
      return "bracket";
    } else if (ch == "{" || ch == "[") {
      plug = plugins["DEFAULT"];
      plug = new plug();
      pushCommand(state, plug);
      return "bracket";
    } else if (/\d/.test(ch)) {
      source.eatWhile(/[\w.%]/);
      return "atom";
    } else {
      source.eatWhile(/[\w\-_]/);
      plug = getMostPowerful(state);
      if (plug.name == "begin") {
        plug.argument = source.current();
      }
      return plug.styleIdentifier();
    }
  }
  __name(normal, "normal");
  function inMathMode(source, state, endModeSeq) {
    if (source.eatSpace()) {
      return null;
    }
    if (endModeSeq && source.match(endModeSeq)) {
      setState(state, normal);
      return "keyword";
    }
    if (source.match(/^\\[a-zA-Z@]+/)) {
      return "tag";
    }
    if (source.match(/^[a-zA-Z]+/)) {
      return "variableName.special";
    }
    if (source.match(/^\\[$&%#{}_]/)) {
      return "tag";
    }
    if (source.match(/^\\[,;!\/]/)) {
      return "tag";
    }
    if (source.match(/^[\^_&]/)) {
      return "tag";
    }
    if (source.match(/^[+\-<>|=,\/@!*:;'"`~#?]/)) {
      return null;
    }
    if (source.match(/^(\d+\.\d*|\d*\.\d+|\d+)/)) {
      return "number";
    }
    var ch = source.next();
    if (ch == "{" || ch == "}" || ch == "[" || ch == "]" || ch == "(" || ch == ")") {
      return "bracket";
    }
    if (ch == "%") {
      source.skipToEnd();
      return "comment";
    }
    return "error";
  }
  __name(inMathMode, "inMathMode");
  function beginParams(source, state) {
    var ch = source.peek(), lastPlug;
    if (ch == "{" || ch == "[") {
      lastPlug = peekCommand(state);
      lastPlug.openBracket(ch);
      source.eat(ch);
      setState(state, normal);
      return "bracket";
    }
    if (/[ \t\r]/.test(ch)) {
      source.eat(ch);
      return null;
    }
    setState(state, normal);
    popCommand(state);
    return normal(source, state);
  }
  __name(beginParams, "beginParams");
  return {
    name: "stex",
    startState: /* @__PURE__ */ __name(function() {
      var f = mathMode ? function(source, state) {
        return inMathMode(source, state);
      } : normal;
      return {
        cmdState: [],
        f
      };
    }, "startState"),
    copyState: /* @__PURE__ */ __name(function(s) {
      return {
        cmdState: s.cmdState.slice(),
        f: s.f
      };
    }, "copyState"),
    token: /* @__PURE__ */ __name(function(stream, state) {
      return state.f(stream, state);
    }, "token"),
    blankLine: /* @__PURE__ */ __name(function(state) {
      state.f = normal;
      state.cmdState.length = 0;
    }, "blankLine"),
    languageData: {
      commentTokens: { line: "%" }
    }
  };
}
__name(mkStex, "mkStex");
const stex = mkStex(false);
const stexMath = mkStex(true);
export {
  stex,
  stexMath
};
