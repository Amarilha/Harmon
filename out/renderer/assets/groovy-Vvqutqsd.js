var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function words(str) {
  var obj = {}, words2 = str.split(" ");
  for (var i = 0; i < words2.length; ++i) obj[words2[i]] = true;
  return obj;
}
__name(words, "words");
var keywords = words(
  "abstract as assert boolean break byte case catch char class const continue def default do double else enum extends final finally float for goto if implements import in instanceof int interface long native new package private protected public return short static strictfp super switch synchronized threadsafe throw throws trait transient try void volatile while"
);
var blockKeywords = words("catch class def do else enum finally for if interface switch trait try while");
var standaloneKeywords = words("return break continue");
var atoms = words("null true false this");
var curPunc;
function tokenBase(stream, state) {
  var ch = stream.next();
  if (ch == '"' || ch == "'") {
    return startString(ch, stream, state);
  }
  if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
    curPunc = ch;
    return null;
  }
  if (/\d/.test(ch)) {
    stream.eatWhile(/[\w\.]/);
    if (stream.eat(/eE/)) {
      stream.eat(/\+\-/);
      stream.eatWhile(/\d/);
    }
    return "number";
  }
  if (ch == "/") {
    if (stream.eat("*")) {
      state.tokenize.push(tokenComment);
      return tokenComment(stream, state);
    }
    if (stream.eat("/")) {
      stream.skipToEnd();
      return "comment";
    }
    if (expectExpression(state.lastToken, false)) {
      return startString(ch, stream, state);
    }
  }
  if (ch == "-" && stream.eat(">")) {
    curPunc = "->";
    return null;
  }
  if (/[+\-*&%=<>!?|\/~]/.test(ch)) {
    stream.eatWhile(/[+\-*&%=<>|~]/);
    return "operator";
  }
  stream.eatWhile(/[\w\$_]/);
  if (ch == "@") {
    stream.eatWhile(/[\w\$_\.]/);
    return "meta";
  }
  if (state.lastToken == ".") return "property";
  if (stream.eat(":")) {
    curPunc = "proplabel";
    return "property";
  }
  var cur = stream.current();
  if (atoms.propertyIsEnumerable(cur)) {
    return "atom";
  }
  if (keywords.propertyIsEnumerable(cur)) {
    if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
    else if (standaloneKeywords.propertyIsEnumerable(cur)) curPunc = "standalone";
    return "keyword";
  }
  return "variable";
}
__name(tokenBase, "tokenBase");
tokenBase.isBase = true;
function startString(quote, stream, state) {
  var tripleQuoted = false;
  if (quote != "/" && stream.eat(quote)) {
    if (stream.eat(quote)) tripleQuoted = true;
    else return "string";
  }
  function t(stream2, state2) {
    var escaped = false, next, end = !tripleQuoted;
    while ((next = stream2.next()) != null) {
      if (next == quote && !escaped) {
        if (!tripleQuoted) {
          break;
        }
        if (stream2.match(quote + quote)) {
          end = true;
          break;
        }
      }
      if (quote == '"' && next == "$" && !escaped) {
        if (stream2.eat("{")) {
          state2.tokenize.push(tokenBaseUntilBrace());
          return "string";
        } else if (stream2.match(/^\w/, false)) {
          state2.tokenize.push(tokenVariableDeref);
          return "string";
        }
      }
      escaped = !escaped && next == "\\";
    }
    if (end) state2.tokenize.pop();
    return "string";
  }
  __name(t, "t");
  state.tokenize.push(t);
  return t(stream, state);
}
__name(startString, "startString");
function tokenBaseUntilBrace() {
  var depth = 1;
  function t(stream, state) {
    if (stream.peek() == "}") {
      depth--;
      if (depth == 0) {
        state.tokenize.pop();
        return state.tokenize[state.tokenize.length - 1](stream, state);
      }
    } else if (stream.peek() == "{") {
      depth++;
    }
    return tokenBase(stream, state);
  }
  __name(t, "t");
  t.isBase = true;
  return t;
}
__name(tokenBaseUntilBrace, "tokenBaseUntilBrace");
function tokenVariableDeref(stream, state) {
  var next = stream.match(/^(\.|[\w\$_]+)/);
  if (!next || !stream.match(next[0] == "." ? /^[\w$_]/ : /^\./)) state.tokenize.pop();
  if (!next) return state.tokenize[state.tokenize.length - 1](stream, state);
  return next[0] == "." ? null : "variable";
}
__name(tokenVariableDeref, "tokenVariableDeref");
function tokenComment(stream, state) {
  var maybeEnd = false, ch;
  while (ch = stream.next()) {
    if (ch == "/" && maybeEnd) {
      state.tokenize.pop();
      break;
    }
    maybeEnd = ch == "*";
  }
  return "comment";
}
__name(tokenComment, "tokenComment");
function expectExpression(last, newline) {
  return !last || last == "operator" || last == "->" || /[\.\[\{\(,;:]/.test(last) || last == "newstatement" || last == "keyword" || last == "proplabel" || last == "standalone" && !newline;
}
__name(expectExpression, "expectExpression");
function Context(indented, column, type, align, prev) {
  this.indented = indented;
  this.column = column;
  this.type = type;
  this.align = align;
  this.prev = prev;
}
__name(Context, "Context");
function pushContext(state, col, type) {
  return state.context = new Context(state.indented, col, type, null, state.context);
}
__name(pushContext, "pushContext");
function popContext(state) {
  var t = state.context.type;
  if (t == ")" || t == "]" || t == "}")
    state.indented = state.context.indented;
  return state.context = state.context.prev;
}
__name(popContext, "popContext");
const groovy = {
  name: "groovy",
  startState: /* @__PURE__ */ __name(function(indentUnit) {
    return {
      tokenize: [tokenBase],
      context: new Context(-indentUnit, 0, "top", false),
      indented: 0,
      startOfLine: true,
      lastToken: null
    };
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    var ctx = state.context;
    if (stream.sol()) {
      if (ctx.align == null) ctx.align = false;
      state.indented = stream.indentation();
      state.startOfLine = true;
      if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) {
        popContext(state);
        ctx = state.context;
      }
    }
    if (stream.eatSpace()) return null;
    curPunc = null;
    var style = state.tokenize[state.tokenize.length - 1](stream, state);
    if (style == "comment") return style;
    if (ctx.align == null) ctx.align = true;
    if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
    else if (curPunc == "->" && ctx.type == "statement" && ctx.prev.type == "}") {
      popContext(state);
      state.context.align = false;
    } else if (curPunc == "{") pushContext(state, stream.column(), "}");
    else if (curPunc == "[") pushContext(state, stream.column(), "]");
    else if (curPunc == "(") pushContext(state, stream.column(), ")");
    else if (curPunc == "}") {
      while (ctx.type == "statement") ctx = popContext(state);
      if (ctx.type == "}") ctx = popContext(state);
      while (ctx.type == "statement") ctx = popContext(state);
    } else if (curPunc == ctx.type) popContext(state);
    else if (ctx.type == "}" || ctx.type == "top" || ctx.type == "statement" && curPunc == "newstatement")
      pushContext(state, stream.column(), "statement");
    state.startOfLine = false;
    state.lastToken = curPunc || style;
    return style;
  }, "token"),
  indent: /* @__PURE__ */ __name(function(state, textAfter, cx) {
    if (!state.tokenize[state.tokenize.length - 1].isBase) return null;
    var firstChar = textAfter && textAfter.charAt(0), ctx = state.context;
    if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) ctx = ctx.prev;
    var closing = firstChar == ctx.type;
    if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : cx.unit);
    else if (ctx.align) return ctx.column + (closing ? 0 : 1);
    else return ctx.indented + (closing ? 0 : cx.unit);
  }, "indent"),
  languageData: {
    indentOnInput: /^\s*[{}]$/,
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "'''", '"""'] }
  }
};
export {
  groovy
};
