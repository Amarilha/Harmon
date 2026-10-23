var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function parseWords(str) {
  var obj = {}, words = str.split(" ");
  for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
  return obj;
}
__name(parseWords, "parseWords");
var keywords = parseWords("Tcl safe after append array auto_execok auto_import auto_load auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror binary break catch cd close concat continue dde eof encoding error eval exec exit expr fblocked fconfigure fcopy file fileevent filename filename flush for foreach format gets glob global history http if incr info interp join lappend lindex linsert list llength load lrange lreplace lsearch lset lsort memory msgcat namespace open package parray pid pkg::create pkg_mkIndex proc puts pwd re_syntax read regex regexp registry regsub rename resource return scan seek set socket source split string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord tcl_wordBreakAfter tcl_startOfPreviousWord tcl_wordBreakBefore tcltest tclvars tell time trace unknown unset update uplevel upvar variable vwait");
var functions = parseWords("if elseif else and not or eq ne in ni for foreach while switch");
var isOperatorChar = /[+\-*&%=<>!?^\/\|]/;
function chain(stream, state, f) {
  state.tokenize = f;
  return f(stream, state);
}
__name(chain, "chain");
function tokenBase(stream, state) {
  var beforeParams = state.beforeParams;
  state.beforeParams = false;
  var ch = stream.next();
  if ((ch == '"' || ch == "'") && state.inParams) {
    return chain(stream, state, tokenString(ch));
  } else if (/[\[\]{}\(\),;\.]/.test(ch)) {
    if (ch == "(" && beforeParams) state.inParams = true;
    else if (ch == ")") state.inParams = false;
    return null;
  } else if (/\d/.test(ch)) {
    stream.eatWhile(/[\w\.]/);
    return "number";
  } else if (ch == "#") {
    if (stream.eat("*"))
      return chain(stream, state, tokenComment);
    if (ch == "#" && stream.match(/ *\[ *\[/))
      return chain(stream, state, tokenUnparsed);
    stream.skipToEnd();
    return "comment";
  } else if (ch == '"') {
    stream.skipTo(/"/);
    return "comment";
  } else if (ch == "$") {
    stream.eatWhile(/[$_a-z0-9A-Z\.{:]/);
    stream.eatWhile(/}/);
    state.beforeParams = true;
    return "builtin";
  } else if (isOperatorChar.test(ch)) {
    stream.eatWhile(isOperatorChar);
    return "comment";
  } else {
    stream.eatWhile(/[\w\$_{}\xa1-\uffff]/);
    var word = stream.current().toLowerCase();
    if (keywords && keywords.propertyIsEnumerable(word))
      return "keyword";
    if (functions && functions.propertyIsEnumerable(word)) {
      state.beforeParams = true;
      return "keyword";
    }
    return null;
  }
}
__name(tokenBase, "tokenBase");
function tokenString(quote) {
  return function(stream, state) {
    var escaped = false, next, end = false;
    while ((next = stream.next()) != null) {
      if (next == quote && !escaped) {
        end = true;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    if (end) state.tokenize = tokenBase;
    return "string";
  };
}
__name(tokenString, "tokenString");
function tokenComment(stream, state) {
  var maybeEnd = false, ch;
  while (ch = stream.next()) {
    if (ch == "#" && maybeEnd) {
      state.tokenize = tokenBase;
      break;
    }
    maybeEnd = ch == "*";
  }
  return "comment";
}
__name(tokenComment, "tokenComment");
function tokenUnparsed(stream, state) {
  var maybeEnd = 0, ch;
  while (ch = stream.next()) {
    if (ch == "#" && maybeEnd == 2) {
      state.tokenize = tokenBase;
      break;
    }
    if (ch == "]")
      maybeEnd++;
    else if (ch != " ")
      maybeEnd = 0;
  }
  return "meta";
}
__name(tokenUnparsed, "tokenUnparsed");
const tcl = {
  name: "tcl",
  startState: /* @__PURE__ */ __name(function() {
    return {
      tokenize: tokenBase,
      beforeParams: false,
      inParams: false
    };
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    if (stream.eatSpace()) return null;
    return state.tokenize(stream, state);
  }, "token"),
  languageData: {
    commentTokens: { line: "#" }
  }
};
export {
  tcl
};
