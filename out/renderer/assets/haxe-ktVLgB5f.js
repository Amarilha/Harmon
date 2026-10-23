var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function kw(type2) {
  return { type: type2, style: "keyword" };
}
__name(kw, "kw");
var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
var operator = kw("operator"), atom = { type: "atom", style: "atom" }, attribute = { type: "attribute", style: "attribute" };
var type = kw("typedef");
var keywords = {
  "if": A,
  "while": A,
  "else": B,
  "do": B,
  "try": B,
  "return": C,
  "break": C,
  "continue": C,
  "new": C,
  "throw": C,
  "var": kw("var"),
  "inline": attribute,
  "static": attribute,
  "using": kw("import"),
  "public": attribute,
  "private": attribute,
  "cast": kw("cast"),
  "import": kw("import"),
  "macro": kw("macro"),
  "function": kw("function"),
  "catch": kw("catch"),
  "untyped": kw("untyped"),
  "callback": kw("cb"),
  "for": kw("for"),
  "switch": kw("switch"),
  "case": kw("case"),
  "default": kw("default"),
  "in": operator,
  "never": kw("property_access"),
  "trace": kw("trace"),
  "class": type,
  "abstract": type,
  "enum": type,
  "interface": type,
  "typedef": type,
  "extends": type,
  "implements": type,
  "dynamic": type,
  "true": atom,
  "false": atom,
  "null": atom
};
var isOperatorChar = /[+\-*&%=<>!?|]/;
function chain(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
__name(chain, "chain");
function toUnescaped(stream, end) {
  var escaped = false, next;
  while ((next = stream.next()) != null) {
    if (next == end && !escaped)
      return true;
    escaped = !escaped && next == "\\";
  }
}
__name(toUnescaped, "toUnescaped");
var type, content;
function ret(tp, style, cont2) {
  type = tp;
  content = cont2;
  return style;
}
__name(ret, "ret");
function haxeTokenBase(stream, state) {
  var ch = stream.next();
  if (ch == '"' || ch == "'") {
    return chain(stream, state, haxeTokenString(ch));
  } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
    return ret(ch);
  } else if (ch == "0" && stream.eat(/x/i)) {
    stream.eatWhile(/[\da-f]/i);
    return ret("number", "number");
  } else if (/\d/.test(ch) || ch == "-" && stream.eat(/\d/)) {
    stream.match(/^\d*(?:\.\d*(?!\.))?(?:[eE][+\-]?\d+)?/);
    return ret("number", "number");
  } else if (state.reAllowed && (ch == "~" && stream.eat(/\//))) {
    toUnescaped(stream, "/");
    stream.eatWhile(/[gimsu]/);
    return ret("regexp", "string.special");
  } else if (ch == "/") {
    if (stream.eat("*")) {
      return chain(stream, state, haxeTokenComment);
    } else if (stream.eat("/")) {
      stream.skipToEnd();
      return ret("comment", "comment");
    } else {
      stream.eatWhile(isOperatorChar);
      return ret("operator", null, stream.current());
    }
  } else if (ch == "#") {
    stream.skipToEnd();
    return ret("conditional", "meta");
  } else if (ch == "@") {
    stream.eat(/:/);
    stream.eatWhile(/[\w_]/);
    return ret("metadata", "meta");
  } else if (isOperatorChar.test(ch)) {
    stream.eatWhile(isOperatorChar);
    return ret("operator", null, stream.current());
  } else {
    var word;
    if (/[A-Z]/.test(ch)) {
      stream.eatWhile(/[\w_<>]/);
      word = stream.current();
      return ret("type", "type", word);
    } else {
      stream.eatWhile(/[\w_]/);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return known && state.kwAllowed ? ret(known.type, known.style, word) : ret("variable", "variable", word);
    }
  }
}
__name(haxeTokenBase, "haxeTokenBase");
function haxeTokenString(quote) {
  return function(stream, state) {
    if (toUnescaped(stream, quote))
      state.tokenize = haxeTokenBase;
    return ret("string", "string");
  };
}
__name(haxeTokenString, "haxeTokenString");
function haxeTokenComment(stream, state) {
  var maybeEnd = false, ch;
  while (ch = stream.next()) {
    if (ch == "/" && maybeEnd) {
      state.tokenize = haxeTokenBase;
      break;
    }
    maybeEnd = ch == "*";
  }
  return ret("comment", "comment");
}
__name(haxeTokenComment, "haxeTokenComment");
var atomicTypes = { "atom": true, "number": true, "variable": true, "string": true, "regexp": true };
function HaxeLexical(indented, column, type2, align, prev, info) {
  this.indented = indented;
  this.column = column;
  this.type = type2;
  this.prev = prev;
  this.info = info;
  if (align != null) this.align = align;
}
__name(HaxeLexical, "HaxeLexical");
function inScope(state, varname) {
  for (var v = state.localVars; v; v = v.next)
    if (v.name == varname) return true;
}
__name(inScope, "inScope");
function parseHaxe(state, style, type2, content2, stream) {
  var cc = state.cc;
  cx.state = state;
  cx.stream = stream;
  cx.marked = null, cx.cc = cc;
  if (!state.lexical.hasOwnProperty("align"))
    state.lexical.align = true;
  while (true) {
    var combinator = cc.length ? cc.pop() : statement;
    if (combinator(type2, content2)) {
      while (cc.length && cc[cc.length - 1].lex)
        cc.pop()();
      if (cx.marked) return cx.marked;
      if (type2 == "variable" && inScope(state, content2)) return "variableName.local";
      if (type2 == "variable" && imported(state, content2)) return "variableName.special";
      return style;
    }
  }
}
__name(parseHaxe, "parseHaxe");
function imported(state, typename) {
  if (/[a-z]/.test(typename.charAt(0)))
    return false;
  var len = state.importedtypes.length;
  for (var i = 0; i < len; i++)
    if (state.importedtypes[i] == typename) return true;
}
__name(imported, "imported");
function registerimport(importname) {
  var state = cx.state;
  for (var t = state.importedtypes; t; t = t.next)
    if (t.name == importname) return;
  state.importedtypes = { name: importname, next: state.importedtypes };
}
__name(registerimport, "registerimport");
var cx = { state: null, marked: null, cc: null };
function pass() {
  for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
}
__name(pass, "pass");
function cont() {
  pass.apply(null, arguments);
  return true;
}
__name(cont, "cont");
function inList(name, list) {
  for (var v = list; v; v = v.next)
    if (v.name == name) return true;
  return false;
}
__name(inList, "inList");
function register(varname) {
  var state = cx.state;
  if (state.context) {
    cx.marked = "def";
    if (inList(varname, state.localVars)) return;
    state.localVars = { name: varname, next: state.localVars };
  } else if (state.globalVars) {
    if (inList(varname, state.globalVars)) return;
    state.globalVars = { name: varname, next: state.globalVars };
  }
}
__name(register, "register");
var defaultVars = { name: "this", next: null };
function pushcontext() {
  if (!cx.state.context) cx.state.localVars = defaultVars;
  cx.state.context = { prev: cx.state.context, vars: cx.state.localVars };
}
__name(pushcontext, "pushcontext");
function popcontext() {
  cx.state.localVars = cx.state.context.vars;
  cx.state.context = cx.state.context.prev;
}
__name(popcontext, "popcontext");
popcontext.lex = true;
function pushlex(type2, info) {
  var result = /* @__PURE__ */ __name(function() {
    var state = cx.state;
    state.lexical = new HaxeLexical(state.indented, cx.stream.column(), type2, null, state.lexical, info);
  }, "result");
  result.lex = true;
  return result;
}
__name(pushlex, "pushlex");
function poplex() {
  var state = cx.state;
  if (state.lexical.prev) {
    if (state.lexical.type == ")")
      state.indented = state.lexical.indented;
    state.lexical = state.lexical.prev;
  }
}
__name(poplex, "poplex");
poplex.lex = true;
function expect(wanted) {
  function f(type2) {
    if (type2 == wanted) return cont();
    else if (wanted == ";") return pass();
    else return cont(f);
  }
  __name(f, "f");
  return f;
}
__name(expect, "expect");
function statement(type2) {
  if (type2 == "@") return cont(metadef);
  if (type2 == "var") return cont(pushlex("vardef"), vardef1, expect(";"), poplex);
  if (type2 == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
  if (type2 == "keyword b") return cont(pushlex("form"), statement, poplex);
  if (type2 == "{") return cont(pushlex("}"), pushcontext, block, poplex, popcontext);
  if (type2 == ";") return cont();
  if (type2 == "attribute") return cont(maybeattribute);
  if (type2 == "function") return cont(functiondef);
  if (type2 == "for") return cont(
    pushlex("form"),
    expect("("),
    pushlex(")"),
    forspec1,
    expect(")"),
    poplex,
    statement,
    poplex
  );
  if (type2 == "variable") return cont(pushlex("stat"), maybelabel);
  if (type2 == "switch") return cont(
    pushlex("form"),
    expression,
    pushlex("}", "switch"),
    expect("{"),
    block,
    poplex,
    poplex
  );
  if (type2 == "case") return cont(expression, expect(":"));
  if (type2 == "default") return cont(expect(":"));
  if (type2 == "catch") return cont(
    pushlex("form"),
    pushcontext,
    expect("("),
    funarg,
    expect(")"),
    statement,
    poplex,
    popcontext
  );
  if (type2 == "import") return cont(importdef, expect(";"));
  if (type2 == "typedef") return cont(typedef);
  return pass(pushlex("stat"), expression, expect(";"), poplex);
}
__name(statement, "statement");
function expression(type2) {
  if (atomicTypes.hasOwnProperty(type2)) return cont(maybeoperator);
  if (type2 == "type") return cont(maybeoperator);
  if (type2 == "function") return cont(functiondef);
  if (type2 == "keyword c") return cont(maybeexpression);
  if (type2 == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeoperator);
  if (type2 == "operator") return cont(expression);
  if (type2 == "[") return cont(pushlex("]"), commasep(maybeexpression, "]"), poplex, maybeoperator);
  if (type2 == "{") return cont(pushlex("}"), commasep(objprop, "}"), poplex, maybeoperator);
  return cont();
}
__name(expression, "expression");
function maybeexpression(type2) {
  if (type2.match(/[;\}\)\],]/)) return pass();
  return pass(expression);
}
__name(maybeexpression, "maybeexpression");
function maybeoperator(type2, value) {
  if (type2 == "operator" && /\+\+|--/.test(value)) return cont(maybeoperator);
  if (type2 == "operator" || type2 == ":") return cont(expression);
  if (type2 == ";") return;
  if (type2 == "(") return cont(pushlex(")"), commasep(expression, ")"), poplex, maybeoperator);
  if (type2 == ".") return cont(property, maybeoperator);
  if (type2 == "[") return cont(pushlex("]"), expression, expect("]"), poplex, maybeoperator);
}
__name(maybeoperator, "maybeoperator");
function maybeattribute(type2) {
  if (type2 == "attribute") return cont(maybeattribute);
  if (type2 == "function") return cont(functiondef);
  if (type2 == "var") return cont(vardef1);
}
__name(maybeattribute, "maybeattribute");
function metadef(type2) {
  if (type2 == ":") return cont(metadef);
  if (type2 == "variable") return cont(metadef);
  if (type2 == "(") return cont(pushlex(")"), commasep(metaargs, ")"), poplex, statement);
}
__name(metadef, "metadef");
function metaargs(type2) {
  if (type2 == "variable") return cont();
}
__name(metaargs, "metaargs");
function importdef(type2, value) {
  if (type2 == "variable" && /[A-Z]/.test(value.charAt(0))) {
    registerimport(value);
    return cont();
  } else if (type2 == "variable" || type2 == "property" || type2 == "." || value == "*") return cont(importdef);
}
__name(importdef, "importdef");
function typedef(type2, value) {
  if (type2 == "variable" && /[A-Z]/.test(value.charAt(0))) {
    registerimport(value);
    return cont();
  } else if (type2 == "type" && /[A-Z]/.test(value.charAt(0))) {
    return cont();
  }
}
__name(typedef, "typedef");
function maybelabel(type2) {
  if (type2 == ":") return cont(poplex, statement);
  return pass(maybeoperator, expect(";"), poplex);
}
__name(maybelabel, "maybelabel");
function property(type2) {
  if (type2 == "variable") {
    cx.marked = "property";
    return cont();
  }
}
__name(property, "property");
function objprop(type2) {
  if (type2 == "variable") cx.marked = "property";
  if (atomicTypes.hasOwnProperty(type2)) return cont(expect(":"), expression);
}
__name(objprop, "objprop");
function commasep(what, end) {
  function proceed(type2) {
    if (type2 == ",") return cont(what, proceed);
    if (type2 == end) return cont();
    return cont(expect(end));
  }
  __name(proceed, "proceed");
  return function(type2) {
    if (type2 == end) return cont();
    else return pass(what, proceed);
  };
}
__name(commasep, "commasep");
function block(type2) {
  if (type2 == "}") return cont();
  return pass(statement, block);
}
__name(block, "block");
function vardef1(type2, value) {
  if (type2 == "variable") {
    register(value);
    return cont(typeuse, vardef2);
  }
  return cont();
}
__name(vardef1, "vardef1");
function vardef2(type2, value) {
  if (value == "=") return cont(expression, vardef2);
  if (type2 == ",") return cont(vardef1);
}
__name(vardef2, "vardef2");
function forspec1(type2, value) {
  if (type2 == "variable") {
    register(value);
    return cont(forin, expression);
  } else {
    return pass();
  }
}
__name(forspec1, "forspec1");
function forin(_type, value) {
  if (value == "in") return cont();
}
__name(forin, "forin");
function functiondef(type2, value) {
  if (type2 == "variable" || type2 == "type") {
    register(value);
    return cont(functiondef);
  }
  if (value == "new") return cont(functiondef);
  if (type2 == "(") return cont(pushlex(")"), pushcontext, commasep(funarg, ")"), poplex, typeuse, statement, popcontext);
}
__name(functiondef, "functiondef");
function typeuse(type2) {
  if (type2 == ":") return cont(typestring);
}
__name(typeuse, "typeuse");
function typestring(type2) {
  if (type2 == "type") return cont();
  if (type2 == "variable") return cont();
  if (type2 == "{") return cont(pushlex("}"), commasep(typeprop, "}"), poplex);
}
__name(typestring, "typestring");
function typeprop(type2) {
  if (type2 == "variable") return cont(typeuse);
}
__name(typeprop, "typeprop");
function funarg(type2, value) {
  if (type2 == "variable") {
    register(value);
    return cont(typeuse);
  }
}
__name(funarg, "funarg");
const haxe = {
  name: "haxe",
  startState: /* @__PURE__ */ __name(function(indentUnit) {
    var defaulttypes = ["Int", "Float", "String", "Void", "Std", "Bool", "Dynamic", "Array"];
    var state = {
      tokenize: haxeTokenBase,
      reAllowed: true,
      kwAllowed: true,
      cc: [],
      lexical: new HaxeLexical(-indentUnit, 0, "block", false),
      importedtypes: defaulttypes,
      context: null,
      indented: 0
    };
    return state;
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    if (stream.sol()) {
      if (!state.lexical.hasOwnProperty("align"))
        state.lexical.align = false;
      state.indented = stream.indentation();
    }
    if (stream.eatSpace()) return null;
    var style = state.tokenize(stream, state);
    if (type == "comment") return style;
    state.reAllowed = !!(type == "operator" || type == "keyword c" || type.match(/^[\[{}\(,;:]$/));
    state.kwAllowed = type != ".";
    return parseHaxe(state, style, type, content, stream);
  }, "token"),
  indent: /* @__PURE__ */ __name(function(state, textAfter, cx2) {
    if (state.tokenize != haxeTokenBase) return 0;
    var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
    if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
    var type2 = lexical.type, closing = firstChar == type2;
    if (type2 == "vardef") return lexical.indented + 4;
    else if (type2 == "form" && firstChar == "{") return lexical.indented;
    else if (type2 == "stat" || type2 == "form") return lexical.indented + cx2.unit;
    else if (lexical.info == "switch" && !closing)
      return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? cx2.unit : 2 * cx2.unit);
    else if (lexical.align) return lexical.column + (closing ? 0 : 1);
    else return lexical.indented + (closing ? 0 : cx2.unit);
  }, "indent"),
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } }
  }
};
const hxml = {
  name: "hxml",
  startState: /* @__PURE__ */ __name(function() {
    return {
      define: false,
      inString: false
    };
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    var ch = stream.peek();
    var sol = stream.sol();
    if (ch == "#") {
      stream.skipToEnd();
      return "comment";
    }
    if (sol && ch == "-") {
      var style = "variable-2";
      stream.eat(/-/);
      if (stream.peek() == "-") {
        stream.eat(/-/);
        style = "keyword a";
      }
      if (stream.peek() == "D") {
        stream.eat(/[D]/);
        style = "keyword c";
        state.define = true;
      }
      stream.eatWhile(/[A-Z]/i);
      return style;
    }
    var ch = stream.peek();
    if (state.inString == false && ch == "'") {
      state.inString = true;
      stream.next();
    }
    if (state.inString == true) {
      if (stream.skipTo("'")) ;
      else {
        stream.skipToEnd();
      }
      if (stream.peek() == "'") {
        stream.next();
        state.inString = false;
      }
      return "string";
    }
    stream.next();
    return null;
  }, "token"),
  languageData: {
    commentTokens: { line: "#" }
  }
};
export {
  haxe,
  hxml
};
