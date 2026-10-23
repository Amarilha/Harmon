var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
var TOKEN_NAMES = {
  "+": "inserted",
  "-": "deleted",
  "@": "meta"
};
const diff = {
  name: "diff",
  token: /* @__PURE__ */ __name(function(stream) {
    var tw_pos = stream.string.search(/[\t ]+?$/);
    if (!stream.sol() || tw_pos === 0) {
      stream.skipToEnd();
      return ("error " + (TOKEN_NAMES[stream.string.charAt(0)] || "")).replace(/ $/, "");
    }
    var token_name = TOKEN_NAMES[stream.peek()] || stream.skipToEnd();
    if (tw_pos === -1) {
      stream.skipToEnd();
    } else {
      stream.pos = tw_pos;
    }
    return token_name;
  }, "token")
};
export {
  diff
};
