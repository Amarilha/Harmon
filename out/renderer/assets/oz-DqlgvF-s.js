var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function wordRegexp(words) {
  return new RegExp("^((" + words.join(")|(") + "))\\b");
}
__name(wordRegexp, "wordRegexp");
var singleOperators = /[\^@!\|<>#~\.\*\-\+\\/,=]/;
var doubleOperators = /(<-)|(:=)|(=<)|(>=)|(<=)|(<:)|(>:)|(=:)|(\\=)|(\\=:)|(!!)|(==)|(::)/;
var tripleOperators = /(:::)|(\.\.\.)|(=<:)|(>=:)/;
var middle = [
  "in",
  "then",
  "else",
  "of",
  "elseof",
  "elsecase",
  "elseif",
  "catch",
  "finally",
  "with",
  "require",
  "prepare",
  "import",
  "export",
  "define",
  "do"
];
var end = ["end"];
var atoms = wordRegexp(["true", "false", "nil", "unit"]);
var commonKeywords = wordRegexp([
  "andthen",
  "at",
  "attr",
  "declare",
  "feat",
  "from",
  "lex",
  "mod",
  "div",
  "mode",
  "orelse",
  "parser",
  "prod",
  "prop",
  "scanner",
  "self",
  "syn",
  "token"
]);
var openingKeywords = wordRegexp([
  "local",
  "proc",
  "fun",
  "case",
  "class",
  "if",
  "cond",
  "or",
  "dis",
  "choice",
  "not",
  "thread",
  "try",
  "raise",
  "lock",
  "for",
  "suchthat",
  "meth",
  "functor"
]);
var middleKeywords = wordRegexp(middle);
var endKeywords = wordRegexp(end);
function tokenBase(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  if (stream.match(/[{}]/)) {
    return "bracket";
  }
  if (stream.match("[]")) {
    return "keyword";
  }
  if (stream.match(tripleOperators) || stream.match(doubleOperators)) {
    return "operator";
  }
  if (stream.match(atoms)) {
    return "atom";
  }
  var matched = stream.match(openingKeywords);
  if (matched) {
    if (!state.doInCurrentLine)
      state.currentIndent++;
    else
      state.doInCurrentLine = false;
    if (matched[0] == "proc" || matched[0] == "fun")
      state.tokenize = tokenFunProc;
    else if (matched[0] == "class")
      state.tokenize = tokenClass;
    else if (matched[0] == "meth")
      state.tokenize = tokenMeth;
    return "keyword";
  }
  if (stream.match(middleKeywords) || stream.match(commonKeywords)) {
    return "keyword";
  }
  if (stream.match(endKeywords)) {
    state.currentIndent--;
    return "keyword";
  }
  var ch = stream.next();
  if (ch == '"' || ch == "'") {
    state.tokenize = tokenString(ch);
    return state.tokenize(stream, state);
  }
  if (/[~\d]/.test(ch)) {
    if (ch == "~") {
      if (!/^[0-9]/.test(stream.peek()))
        return null;
      else if (stream.next() == "0" && stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^[0-9]*(\.[0-9]+)?([eE][~+]?[0-9]+)?/))
        return "number";
    }
    if (ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^[0-9]*(\.[0-9]+)?([eE][~+]?[0-9]+)?/))
      return "number";
    return null;
  }
  if (ch == "%") {
    stream.skipToEnd();
    return "comment";
  } else if (ch == "/") {
    if (stream.eat("*")) {
      state.tokenize = tokenComment;
      return tokenComment(stream, state);
    }
  }
  if (singleOperators.test(ch)) {
    return "operator";
  }
  stream.eatWhile(/\w/);
  return "variable";
}
__name(tokenBase, "tokenBase");
function tokenClass(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  stream.match(/([A-Z][A-Za-z0-9_]*)|(`.+`)/);
  state.tokenize = tokenBase;
  return "type";
}
__name(tokenClass, "tokenClass");
function tokenMeth(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  stream.match(/([a-zA-Z][A-Za-z0-9_]*)|(`.+`)/);
  state.tokenize = tokenBase;
  return "def";
}
__name(tokenMeth, "tokenMeth");
function tokenFunProc(stream, state) {
  if (stream.eatSpace()) {
    return null;
  }
  if (!state.hasPassedFirstStage && stream.eat("{")) {
    state.hasPassedFirstStage = true;
    return "bracket";
  } else if (state.hasPassedFirstStage) {
    stream.match(/([A-Z][A-Za-z0-9_]*)|(`.+`)|\$/);
    state.hasPassedFirstStage = false;
    state.tokenize = tokenBase;
    return "def";
  } else {
    state.tokenize = tokenBase;
    return null;
  }
}
__name(tokenFunProc, "tokenFunProc");
function tokenComment(stream, state) {
  var maybeEnd = false, ch;
  while (ch = stream.next()) {
    if (ch == "/" && maybeEnd) {
      state.tokenize = tokenBase;
      break;
    }
    maybeEnd = ch == "*";
  }
  return "comment";
}
__name(tokenComment, "tokenComment");
function tokenString(quote) {
  return function(stream, state) {
    var escaped = false, next, end2 = false;
    while ((next = stream.next()) != null) {
      if (next == quote && !escaped) {
        end2 = true;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    if (end2 || !escaped)
      state.tokenize = tokenBase;
    return "string";
  };
}
__name(tokenString, "tokenString");
function buildElectricInputRegEx() {
  var allClosings = middle.concat(end);
  return new RegExp("[\\[\\]]|(" + allClosings.join("|") + ")$");
}
__name(buildElectricInputRegEx, "buildElectricInputRegEx");
const oz = {
  name: "oz",
  startState: /* @__PURE__ */ __name(function() {
    return {
      tokenize: tokenBase,
      currentIndent: 0,
      doInCurrentLine: false,
      hasPassedFirstStage: false
    };
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    if (stream.sol())
      state.doInCurrentLine = 0;
    return state.tokenize(stream, state);
  }, "token"),
  indent: /* @__PURE__ */ __name(function(state, textAfter, cx) {
    var trueText = textAfter.replace(/^\s+|\s+$/g, "");
    if (trueText.match(endKeywords) || trueText.match(middleKeywords) || trueText.match(/(\[])/))
      return cx.unit * (state.currentIndent - 1);
    if (state.currentIndent < 0)
      return 0;
    return state.currentIndent * cx.unit;
  }, "indent"),
  languageData: {
    indentOnInut: buildElectricInputRegEx(),
    commentTokens: { line: "%", block: { open: "/*", close: "*/" } }
  }
};
export {
  oz
};
