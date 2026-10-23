var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
import { javascript } from "./javascript-wRa6oqqd.js";
var ATTRS_NEST = {
  "{": "}",
  "(": ")",
  "[": "]"
};
function defaultCopyState(state) {
  if (typeof state != "object") return state;
  let newState = {};
  for (let prop in state) {
    let val = state[prop];
    newState[prop] = val instanceof Array ? val.slice() : val;
  }
  return newState;
}
__name(defaultCopyState, "defaultCopyState");
class State {
  static {
    __name(this, "State");
  }
  constructor(indentUnit) {
    this.indentUnit = indentUnit;
    this.javaScriptLine = false;
    this.javaScriptLineExcludesColon = false;
    this.javaScriptArguments = false;
    this.javaScriptArgumentsDepth = 0;
    this.isInterpolating = false;
    this.interpolationNesting = 0;
    this.jsState = javascript.startState(indentUnit);
    this.restOfLine = "";
    this.isIncludeFiltered = false;
    this.isEach = false;
    this.lastTag = "";
    this.isAttrs = false;
    this.attrsNest = [];
    this.inAttributeName = true;
    this.attributeIsType = false;
    this.attrValue = "";
    this.indentOf = Infinity;
    this.indentToken = "";
  }
  copy() {
    var res = new State(this.indentUnit);
    res.javaScriptLine = this.javaScriptLine;
    res.javaScriptLineExcludesColon = this.javaScriptLineExcludesColon;
    res.javaScriptArguments = this.javaScriptArguments;
    res.javaScriptArgumentsDepth = this.javaScriptArgumentsDepth;
    res.isInterpolating = this.isInterpolating;
    res.interpolationNesting = this.interpolationNesting;
    res.jsState = (javascript.copyState || defaultCopyState)(this.jsState);
    res.restOfLine = this.restOfLine;
    res.isIncludeFiltered = this.isIncludeFiltered;
    res.isEach = this.isEach;
    res.lastTag = this.lastTag;
    res.isAttrs = this.isAttrs;
    res.attrsNest = this.attrsNest.slice();
    res.inAttributeName = this.inAttributeName;
    res.attributeIsType = this.attributeIsType;
    res.attrValue = this.attrValue;
    res.indentOf = this.indentOf;
    res.indentToken = this.indentToken;
    return res;
  }
}
function javaScript(stream, state) {
  if (stream.sol()) {
    state.javaScriptLine = false;
    state.javaScriptLineExcludesColon = false;
  }
  if (state.javaScriptLine) {
    if (state.javaScriptLineExcludesColon && stream.peek() === ":") {
      state.javaScriptLine = false;
      state.javaScriptLineExcludesColon = false;
      return;
    }
    var tok = javascript.token(stream, state.jsState);
    if (stream.eol()) state.javaScriptLine = false;
    return tok || true;
  }
}
__name(javaScript, "javaScript");
function javaScriptArguments(stream, state) {
  if (state.javaScriptArguments) {
    if (state.javaScriptArgumentsDepth === 0 && stream.peek() !== "(") {
      state.javaScriptArguments = false;
      return;
    }
    if (stream.peek() === "(") {
      state.javaScriptArgumentsDepth++;
    } else if (stream.peek() === ")") {
      state.javaScriptArgumentsDepth--;
    }
    if (state.javaScriptArgumentsDepth === 0) {
      state.javaScriptArguments = false;
      return;
    }
    var tok = javascript.token(stream, state.jsState);
    return tok || true;
  }
}
__name(javaScriptArguments, "javaScriptArguments");
function yieldStatement(stream) {
  if (stream.match(/^yield\b/)) {
    return "keyword";
  }
}
__name(yieldStatement, "yieldStatement");
function doctype(stream) {
  if (stream.match(/^(?:doctype) *([^\n]+)?/)) return "meta";
}
__name(doctype, "doctype");
function interpolation(stream, state) {
  if (stream.match("#{")) {
    state.isInterpolating = true;
    state.interpolationNesting = 0;
    return "punctuation";
  }
}
__name(interpolation, "interpolation");
function interpolationContinued(stream, state) {
  if (state.isInterpolating) {
    if (stream.peek() === "}") {
      state.interpolationNesting--;
      if (state.interpolationNesting < 0) {
        stream.next();
        state.isInterpolating = false;
        return "punctuation";
      }
    } else if (stream.peek() === "{") {
      state.interpolationNesting++;
    }
    return javascript.token(stream, state.jsState) || true;
  }
}
__name(interpolationContinued, "interpolationContinued");
function caseStatement(stream, state) {
  if (stream.match(/^case\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
__name(caseStatement, "caseStatement");
function when(stream, state) {
  if (stream.match(/^when\b/)) {
    state.javaScriptLine = true;
    state.javaScriptLineExcludesColon = true;
    return "keyword";
  }
}
__name(when, "when");
function defaultStatement(stream) {
  if (stream.match(/^default\b/)) {
    return "keyword";
  }
}
__name(defaultStatement, "defaultStatement");
function extendsStatement(stream, state) {
  if (stream.match(/^extends?\b/)) {
    state.restOfLine = "string";
    return "keyword";
  }
}
__name(extendsStatement, "extendsStatement");
function append(stream, state) {
  if (stream.match(/^append\b/)) {
    state.restOfLine = "variable";
    return "keyword";
  }
}
__name(append, "append");
function prepend(stream, state) {
  if (stream.match(/^prepend\b/)) {
    state.restOfLine = "variable";
    return "keyword";
  }
}
__name(prepend, "prepend");
function block(stream, state) {
  if (stream.match(/^block\b *(?:(prepend|append)\b)?/)) {
    state.restOfLine = "variable";
    return "keyword";
  }
}
__name(block, "block");
function include(stream, state) {
  if (stream.match(/^include\b/)) {
    state.restOfLine = "string";
    return "keyword";
  }
}
__name(include, "include");
function includeFiltered(stream, state) {
  if (stream.match(/^include:([a-zA-Z0-9\-]+)/, false) && stream.match("include")) {
    state.isIncludeFiltered = true;
    return "keyword";
  }
}
__name(includeFiltered, "includeFiltered");
function includeFilteredContinued(stream, state) {
  if (state.isIncludeFiltered) {
    var tok = filter(stream, state);
    state.isIncludeFiltered = false;
    state.restOfLine = "string";
    return tok;
  }
}
__name(includeFilteredContinued, "includeFilteredContinued");
function mixin(stream, state) {
  if (stream.match(/^mixin\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
__name(mixin, "mixin");
function call(stream, state) {
  if (stream.match(/^\+([-\w]+)/)) {
    if (!stream.match(/^\( *[-\w]+ *=/, false)) {
      state.javaScriptArguments = true;
      state.javaScriptArgumentsDepth = 0;
    }
    return "variable";
  }
  if (stream.match("+#{", false)) {
    stream.next();
    state.mixinCallAfter = true;
    return interpolation(stream, state);
  }
}
__name(call, "call");
function callArguments(stream, state) {
  if (state.mixinCallAfter) {
    state.mixinCallAfter = false;
    if (!stream.match(/^\( *[-\w]+ *=/, false)) {
      state.javaScriptArguments = true;
      state.javaScriptArgumentsDepth = 0;
    }
    return true;
  }
}
__name(callArguments, "callArguments");
function conditional(stream, state) {
  if (stream.match(/^(if|unless|else if|else)\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
__name(conditional, "conditional");
function each(stream, state) {
  if (stream.match(/^(- *)?(each|for)\b/)) {
    state.isEach = true;
    return "keyword";
  }
}
__name(each, "each");
function eachContinued(stream, state) {
  if (state.isEach) {
    if (stream.match(/^ in\b/)) {
      state.javaScriptLine = true;
      state.isEach = false;
      return "keyword";
    } else if (stream.sol() || stream.eol()) {
      state.isEach = false;
    } else if (stream.next()) {
      while (!stream.match(/^ in\b/, false) && stream.next()) {
      }
      return "variable";
    }
  }
}
__name(eachContinued, "eachContinued");
function whileStatement(stream, state) {
  if (stream.match(/^while\b/)) {
    state.javaScriptLine = true;
    return "keyword";
  }
}
__name(whileStatement, "whileStatement");
function tag(stream, state) {
  var captures;
  if (captures = stream.match(/^(\w(?:[-:\w]*\w)?)\/?/)) {
    state.lastTag = captures[1].toLowerCase();
    return "tag";
  }
}
__name(tag, "tag");
function filter(stream, state) {
  if (stream.match(/^:([\w\-]+)/)) {
    setStringMode(stream, state);
    return "atom";
  }
}
__name(filter, "filter");
function code(stream, state) {
  if (stream.match(/^(!?=|-)/)) {
    state.javaScriptLine = true;
    return "punctuation";
  }
}
__name(code, "code");
function id(stream) {
  if (stream.match(/^#([\w-]+)/)) {
    return "builtin";
  }
}
__name(id, "id");
function className(stream) {
  if (stream.match(/^\.([\w-]+)/)) {
    return "className";
  }
}
__name(className, "className");
function attrs(stream, state) {
  if (stream.peek() == "(") {
    stream.next();
    state.isAttrs = true;
    state.attrsNest = [];
    state.inAttributeName = true;
    state.attrValue = "";
    state.attributeIsType = false;
    return "punctuation";
  }
}
__name(attrs, "attrs");
function attrsContinued(stream, state) {
  if (state.isAttrs) {
    if (ATTRS_NEST[stream.peek()]) {
      state.attrsNest.push(ATTRS_NEST[stream.peek()]);
    }
    if (state.attrsNest[state.attrsNest.length - 1] === stream.peek()) {
      state.attrsNest.pop();
    } else if (stream.eat(")")) {
      state.isAttrs = false;
      return "punctuation";
    }
    if (state.inAttributeName && stream.match(/^[^=,\)!]+/)) {
      if (stream.peek() === "=" || stream.peek() === "!") {
        state.inAttributeName = false;
        state.jsState = javascript.startState(2);
        if (state.lastTag === "script" && stream.current().trim().toLowerCase() === "type") {
          state.attributeIsType = true;
        } else {
          state.attributeIsType = false;
        }
      }
      return "attribute";
    }
    var tok = javascript.token(stream, state.jsState);
    if (state.attrsNest.length === 0 && (tok === "string" || tok === "variable" || tok === "keyword")) {
      try {
        Function("", "var x " + state.attrValue.replace(/,\s*$/, "").replace(/^!/, ""));
        state.inAttributeName = true;
        state.attrValue = "";
        stream.backUp(stream.current().length);
        return attrsContinued(stream, state);
      } catch (ex) {
      }
    }
    state.attrValue += stream.current();
    return tok || true;
  }
}
__name(attrsContinued, "attrsContinued");
function attributesBlock(stream, state) {
  if (stream.match(/^&attributes\b/)) {
    state.javaScriptArguments = true;
    state.javaScriptArgumentsDepth = 0;
    return "keyword";
  }
}
__name(attributesBlock, "attributesBlock");
function indent(stream) {
  if (stream.sol() && stream.eatSpace()) {
    return "indent";
  }
}
__name(indent, "indent");
function comment(stream, state) {
  if (stream.match(/^ *\/\/(-)?([^\n]*)/)) {
    state.indentOf = stream.indentation();
    state.indentToken = "comment";
    return "comment";
  }
}
__name(comment, "comment");
function colon(stream) {
  if (stream.match(/^: */)) {
    return "colon";
  }
}
__name(colon, "colon");
function text(stream, state) {
  if (stream.match(/^(?:\| ?| )([^\n]+)/)) {
    return "string";
  }
  if (stream.match(/^(<[^\n]*)/, false)) {
    setStringMode(stream, state);
    stream.skipToEnd();
    return state.indentToken;
  }
}
__name(text, "text");
function dot(stream, state) {
  if (stream.eat(".")) {
    setStringMode(stream, state);
    return "dot";
  }
}
__name(dot, "dot");
function fail(stream) {
  stream.next();
  return null;
}
__name(fail, "fail");
function setStringMode(stream, state) {
  state.indentOf = stream.indentation();
  state.indentToken = "string";
}
__name(setStringMode, "setStringMode");
function restOfLine(stream, state) {
  if (stream.sol()) {
    state.restOfLine = "";
  }
  if (state.restOfLine) {
    stream.skipToEnd();
    var tok = state.restOfLine;
    state.restOfLine = "";
    return tok;
  }
}
__name(restOfLine, "restOfLine");
function startState(indentUnit) {
  return new State(indentUnit);
}
__name(startState, "startState");
function copyState(state) {
  return state.copy();
}
__name(copyState, "copyState");
function nextToken(stream, state) {
  var tok = restOfLine(stream, state) || interpolationContinued(stream, state) || includeFilteredContinued(stream, state) || eachContinued(stream, state) || attrsContinued(stream, state) || javaScript(stream, state) || javaScriptArguments(stream, state) || callArguments(stream, state) || yieldStatement(stream) || doctype(stream) || interpolation(stream, state) || caseStatement(stream, state) || when(stream, state) || defaultStatement(stream) || extendsStatement(stream, state) || append(stream, state) || prepend(stream, state) || block(stream, state) || include(stream, state) || includeFiltered(stream, state) || mixin(stream, state) || call(stream, state) || conditional(stream, state) || each(stream, state) || whileStatement(stream, state) || tag(stream, state) || filter(stream, state) || code(stream, state) || id(stream) || className(stream) || attrs(stream, state) || attributesBlock(stream, state) || indent(stream) || text(stream, state) || comment(stream, state) || colon(stream) || dot(stream, state) || fail(stream);
  return tok === true ? null : tok;
}
__name(nextToken, "nextToken");
const pug = {
  startState,
  copyState,
  token: nextToken
};
export {
  pug
};
