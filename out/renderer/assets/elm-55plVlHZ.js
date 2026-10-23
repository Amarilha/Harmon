var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function switchState(source, setState, f) {
  setState(f);
  return f(source, setState);
}
__name(switchState, "switchState");
var lowerRE = /[a-z]/;
var upperRE = /[A-Z]/;
var innerRE = /[a-zA-Z0-9_]/;
var digitRE = /[0-9]/;
var hexRE = /[0-9A-Fa-f]/;
var symbolRE = /[-&*+.\\/<>=?^|:]/;
var specialRE = /[(),[\]{}]/;
var spacesRE = /[ \v\f]/;
function normal() {
  return function(source, setState) {
    if (source.eatWhile(spacesRE)) {
      return null;
    }
    var char = source.next();
    if (specialRE.test(char)) {
      return char === "{" && source.eat("-") ? switchState(source, setState, chompMultiComment(1)) : char === "[" && source.match("glsl|") ? switchState(source, setState, chompGlsl) : "builtin";
    }
    if (char === "'") {
      return switchState(source, setState, chompChar);
    }
    if (char === '"') {
      return source.eat('"') ? source.eat('"') ? switchState(source, setState, chompMultiString) : "string" : switchState(source, setState, chompSingleString);
    }
    if (upperRE.test(char)) {
      source.eatWhile(innerRE);
      return "type";
    }
    if (lowerRE.test(char)) {
      var isDef = source.pos === 1;
      source.eatWhile(innerRE);
      return isDef ? "def" : "variable";
    }
    if (digitRE.test(char)) {
      if (char === "0") {
        if (source.eat(/[xX]/)) {
          source.eatWhile(hexRE);
          return "number";
        }
      } else {
        source.eatWhile(digitRE);
      }
      if (source.eat(".")) {
        source.eatWhile(digitRE);
      }
      if (source.eat(/[eE]/)) {
        source.eat(/[-+]/);
        source.eatWhile(digitRE);
      }
      return "number";
    }
    if (symbolRE.test(char)) {
      if (char === "-" && source.eat("-")) {
        source.skipToEnd();
        return "comment";
      }
      source.eatWhile(symbolRE);
      return "keyword";
    }
    if (char === "_") {
      return "keyword";
    }
    return "error";
  };
}
__name(normal, "normal");
function chompMultiComment(nest) {
  if (nest == 0) {
    return normal();
  }
  return function(source, setState) {
    while (!source.eol()) {
      var char = source.next();
      if (char == "{" && source.eat("-")) {
        ++nest;
      } else if (char == "-" && source.eat("}")) {
        --nest;
        if (nest === 0) {
          setState(normal());
          return "comment";
        }
      }
    }
    setState(chompMultiComment(nest));
    return "comment";
  };
}
__name(chompMultiComment, "chompMultiComment");
function chompMultiString(source, setState) {
  while (!source.eol()) {
    var char = source.next();
    if (char === '"' && source.eat('"') && source.eat('"')) {
      setState(normal());
      return "string";
    }
  }
  return "string";
}
__name(chompMultiString, "chompMultiString");
function chompSingleString(source, setState) {
  while (source.skipTo('\\"')) {
    source.next();
    source.next();
  }
  if (source.skipTo('"')) {
    source.next();
    setState(normal());
    return "string";
  }
  source.skipToEnd();
  setState(normal());
  return "error";
}
__name(chompSingleString, "chompSingleString");
function chompChar(source, setState) {
  while (source.skipTo("\\'")) {
    source.next();
    source.next();
  }
  if (source.skipTo("'")) {
    source.next();
    setState(normal());
    return "string";
  }
  source.skipToEnd();
  setState(normal());
  return "error";
}
__name(chompChar, "chompChar");
function chompGlsl(source, setState) {
  while (!source.eol()) {
    var char = source.next();
    if (char === "|" && source.eat("]")) {
      setState(normal());
      return "string";
    }
  }
  return "string";
}
__name(chompGlsl, "chompGlsl");
var wellKnownWords = {
  case: 1,
  of: 1,
  as: 1,
  if: 1,
  then: 1,
  else: 1,
  let: 1,
  in: 1,
  type: 1,
  alias: 1,
  module: 1,
  where: 1,
  import: 1,
  exposing: 1,
  port: 1
};
const elm = {
  name: "elm",
  startState: /* @__PURE__ */ __name(function() {
    return { f: normal() };
  }, "startState"),
  copyState: /* @__PURE__ */ __name(function(s) {
    return { f: s.f };
  }, "copyState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    var type = state.f(stream, function(s) {
      state.f = s;
    });
    var word = stream.current();
    return wellKnownWords.hasOwnProperty(word) ? "keyword" : type;
  }, "token"),
  languageData: {
    commentTokens: { line: "--" }
  }
};
export {
  elm
};
