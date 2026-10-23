var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
var isStringChar = /[^\s\|\!\+\-\*\?\~\^\&\:\(\)\[\]\{\}\"\\]/;
var isOperatorChar = /[\|\!\+\-\*\?\~\^\&]/;
var isOperatorString = /^(OR|AND|NOT|TO)$/;
function isNumber(word) {
  return parseFloat(word).toString() === word;
}
__name(isNumber, "isNumber");
function tokenString(quote) {
  return function(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (next == quote && !escaped) break;
      escaped = !escaped && next == "\\";
    }
    if (!escaped) state.tokenize = tokenBase;
    return "string";
  };
}
__name(tokenString, "tokenString");
function tokenOperator(operator) {
  return function(stream, state) {
    if (operator == "|")
      stream.eat(/\|/);
    else if (operator == "&")
      stream.eat(/\&/);
    state.tokenize = tokenBase;
    return "operator";
  };
}
__name(tokenOperator, "tokenOperator");
function tokenWord(ch) {
  return function(stream, state) {
    var word = ch;
    while ((ch = stream.peek()) && ch.match(isStringChar) != null) {
      word += stream.next();
    }
    state.tokenize = tokenBase;
    if (isOperatorString.test(word))
      return "operator";
    else if (isNumber(word))
      return "number";
    else if (stream.peek() == ":")
      return "propertyName";
    else
      return "string";
  };
}
__name(tokenWord, "tokenWord");
function tokenBase(stream, state) {
  var ch = stream.next();
  if (ch == '"')
    state.tokenize = tokenString(ch);
  else if (isOperatorChar.test(ch))
    state.tokenize = tokenOperator(ch);
  else if (isStringChar.test(ch))
    state.tokenize = tokenWord(ch);
  return state.tokenize != tokenBase ? state.tokenize(stream, state) : null;
}
__name(tokenBase, "tokenBase");
const solr = {
  name: "solr",
  startState: /* @__PURE__ */ __name(function() {
    return {
      tokenize: tokenBase
    };
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  }, "token")
};
export {
  solr
};
