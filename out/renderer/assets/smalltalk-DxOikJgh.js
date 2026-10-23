var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
var specialChars = /[+\-\/\\*~<>=@%|&?!.,:;^]/;
var keywords = /true|false|nil|self|super|thisContext/;
var Context = /* @__PURE__ */ __name(function(tokenizer, parent) {
  this.next = tokenizer;
  this.parent = parent;
}, "Context");
var Token = /* @__PURE__ */ __name(function(name, context, eos) {
  this.name = name;
  this.context = context;
  this.eos = eos;
}, "Token");
var State = /* @__PURE__ */ __name(function() {
  this.context = new Context(next, null);
  this.expectVariable = true;
  this.indentation = 0;
  this.userIndentationDelta = 0;
}, "State");
State.prototype.userIndent = function(indentation, indentUnit) {
  this.userIndentationDelta = indentation > 0 ? indentation / indentUnit - this.indentation : 0;
};
var next = /* @__PURE__ */ __name(function(stream, context, state) {
  var token = new Token(null, context, false);
  var aChar = stream.next();
  if (aChar === '"') {
    token = nextComment(stream, new Context(nextComment, context));
  } else if (aChar === "'") {
    token = nextString(stream, new Context(nextString, context));
  } else if (aChar === "#") {
    if (stream.peek() === "'") {
      stream.next();
      token = nextSymbol(stream, new Context(nextSymbol, context));
    } else {
      if (stream.eatWhile(/[^\s.{}\[\]()]/))
        token.name = "string.special";
      else
        token.name = "meta";
    }
  } else if (aChar === "$") {
    if (stream.next() === "<") {
      stream.eatWhile(/[^\s>]/);
      stream.next();
    }
    token.name = "string.special";
  } else if (aChar === "|" && state.expectVariable) {
    token.context = new Context(nextTemporaries, context);
  } else if (/[\[\]{}()]/.test(aChar)) {
    token.name = "bracket";
    token.eos = /[\[{(]/.test(aChar);
    if (aChar === "[") {
      state.indentation++;
    } else if (aChar === "]") {
      state.indentation = Math.max(0, state.indentation - 1);
    }
  } else if (specialChars.test(aChar)) {
    stream.eatWhile(specialChars);
    token.name = "operator";
    token.eos = aChar !== ";";
  } else if (/\d/.test(aChar)) {
    stream.eatWhile(/[\w\d]/);
    token.name = "number";
  } else if (/[\w_]/.test(aChar)) {
    stream.eatWhile(/[\w\d_]/);
    token.name = state.expectVariable ? keywords.test(stream.current()) ? "keyword" : "variable" : null;
  } else {
    token.eos = state.expectVariable;
  }
  return token;
}, "next");
var nextComment = /* @__PURE__ */ __name(function(stream, context) {
  stream.eatWhile(/[^"]/);
  return new Token("comment", stream.eat('"') ? context.parent : context, true);
}, "nextComment");
var nextString = /* @__PURE__ */ __name(function(stream, context) {
  stream.eatWhile(/[^']/);
  return new Token("string", stream.eat("'") ? context.parent : context, false);
}, "nextString");
var nextSymbol = /* @__PURE__ */ __name(function(stream, context) {
  stream.eatWhile(/[^']/);
  return new Token("string.special", stream.eat("'") ? context.parent : context, false);
}, "nextSymbol");
var nextTemporaries = /* @__PURE__ */ __name(function(stream, context) {
  var token = new Token(null, context, false);
  var aChar = stream.next();
  if (aChar === "|") {
    token.context = context.parent;
    token.eos = true;
  } else {
    stream.eatWhile(/[^|]/);
    token.name = "variable";
  }
  return token;
}, "nextTemporaries");
const smalltalk = {
  name: "smalltalk",
  startState: /* @__PURE__ */ __name(function() {
    return new State();
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    state.userIndent(stream.indentation(), stream.indentUnit);
    if (stream.eatSpace()) {
      return null;
    }
    var token = state.context.next(stream, state.context, state);
    state.context = token.context;
    state.expectVariable = token.eos;
    return token.name;
  }, "token"),
  blankLine: /* @__PURE__ */ __name(function(state, indentUnit) {
    state.userIndent(0, indentUnit);
  }, "blankLine"),
  indent: /* @__PURE__ */ __name(function(state, textAfter, cx) {
    var i = state.context.next === next && textAfter && textAfter.charAt(0) === "]" ? -1 : state.userIndentationDelta;
    return (state.indentation + i) * cx.unit;
  }, "indent"),
  languageData: {
    indentOnInput: /^\s*\]$/
  }
};
export {
  smalltalk
};
