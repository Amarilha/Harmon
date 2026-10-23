var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
import { _ as __name2 } from "./mermaid.core-BeYOr_ll.js";
var ImperativeState = class {
  static {
    __name(this, "ImperativeState");
  }
  /**
   * @param init - Function that creates the default state.
   */
  constructor(init) {
    this.init = init;
    this.records = this.init();
  }
  static {
    __name2(this, "ImperativeState");
  }
  reset() {
    this.records = this.init();
  }
};
export {
  ImperativeState as I
};
