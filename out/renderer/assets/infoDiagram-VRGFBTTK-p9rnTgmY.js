globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
import { _ as __name, l as log, T as selectSvgElement, d as configureSvgSize } from "./mermaid.core-BeYOr_ll.js";
import { p as parse } from "./cynefin-OW5HDTMX-CtRSj8yg.js";
import "./index-vw3N6KH1.js";
import "./global-DRL_rtBl.js";
var parser = {
  parse: /* @__PURE__ */ __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: "12.0.0"
};
var getVersion = /* @__PURE__ */ __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = /* @__PURE__ */ __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
