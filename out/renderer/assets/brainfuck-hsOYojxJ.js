var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
var reserve = "><+-.,[]".split("");
const brainfuck = {
  name: "brainfuck",
  startState: /* @__PURE__ */ __name(function() {
    return {
      commentLine: false,
      left: 0,
      right: 0,
      commentLoop: false
    };
  }, "startState"),
  token: /* @__PURE__ */ __name(function(stream, state) {
    if (stream.eatSpace()) return null;
    if (stream.sol()) {
      state.commentLine = false;
    }
    var ch = stream.next().toString();
    if (reserve.indexOf(ch) !== -1) {
      if (state.commentLine === true) {
        if (stream.eol()) {
          state.commentLine = false;
        }
        return "comment";
      }
      if (ch === "]" || ch === "[") {
        if (ch === "[") {
          state.left++;
        } else {
          state.right++;
        }
        return "bracket";
      } else if (ch === "+" || ch === "-") {
        return "keyword";
      } else if (ch === "<" || ch === ">") {
        return "atom";
      } else if (ch === "." || ch === ",") {
        return "def";
      }
    } else {
      state.commentLine = true;
      if (stream.eol()) {
        state.commentLine = false;
      }
      return "comment";
    }
    if (stream.eol()) {
      state.commentLine = false;
    }
  }, "token")
};
export {
  brainfuck
};
