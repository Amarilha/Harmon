var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
import { U as Utils, C as Color } from "./mermaid.core-BeYOr_ll.js";
const channel = /* @__PURE__ */ __name((color, channel2) => {
  return Utils.lang.round(Color.parse(color)[channel2]);
}, "channel");
export {
  channel as c
};
