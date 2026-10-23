var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
function failFirstLine(stream, state) {
  stream.skipToEnd();
  state.cur = header;
  return "error";
}
__name(failFirstLine, "failFirstLine");
function start(stream, state) {
  if (stream.match(/^HTTP\/\d\.\d/)) {
    state.cur = responseStatusCode;
    return "keyword";
  } else if (stream.match(/^[A-Z]+/) && /[ \t]/.test(stream.peek())) {
    state.cur = requestPath;
    return "keyword";
  } else {
    return failFirstLine(stream, state);
  }
}
__name(start, "start");
function responseStatusCode(stream, state) {
  var code = stream.match(/^\d+/);
  if (!code) return failFirstLine(stream, state);
  state.cur = responseStatusText;
  var status = Number(code[0]);
  if (status >= 100 && status < 400) {
    return "atom";
  } else {
    return "error";
  }
}
__name(responseStatusCode, "responseStatusCode");
function responseStatusText(stream, state) {
  stream.skipToEnd();
  state.cur = header;
  return null;
}
__name(responseStatusText, "responseStatusText");
function requestPath(stream, state) {
  stream.eatWhile(/\S/);
  state.cur = requestProtocol;
  return "string.special";
}
__name(requestPath, "requestPath");
function requestProtocol(stream, state) {
  if (stream.match(/^HTTP\/\d\.\d$/)) {
    state.cur = header;
    return "keyword";
  } else {
    return failFirstLine(stream, state);
  }
}
__name(requestProtocol, "requestProtocol");
function header(stream) {
  if (stream.sol() && !stream.eat(/[ \t]/)) {
    if (stream.match(/^.*?:/)) {
      return "atom";
    } else {
      stream.skipToEnd();
      return "error";
    }
  } else {
    stream.skipToEnd();
    return "string";
  }
}
__name(header, "header");
function body(stream) {
  stream.skipToEnd();
  return null;
}
__name(body, "body");
const http = {
  name: "http",
  token: /* @__PURE__ */ __name(function(stream, state) {
    var cur = state.cur;
    if (cur != header && cur != body && stream.eatSpace()) return null;
    return cur(stream, state);
  }, "token"),
  blankLine: /* @__PURE__ */ __name(function(state) {
    state.cur = body;
  }, "blankLine"),
  startState: /* @__PURE__ */ __name(function() {
    return { cur: start };
  }, "startState")
};
export {
  http
};
