const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./mermaid.core-BeYOr_ll.js","./index-vw3N6KH1.js","./global-DRL_rtBl.js","./global-B1Ub1_5h.css","./index-DEiDQjj7.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
import { D as DIAGRAM_ID_TOKEN, _ as __vitePreload } from "./index-vw3N6KH1.js";
import "./global-DRL_rtBl.js";
function parseColor(css2) {
  const text = css2.trim();
  const hex = /^#([0-9a-f]{3,8})$/i.exec(text)?.[1];
  if (hex !== void 0) {
    const expand = /* @__PURE__ */ __name((value) => Number.parseInt(value.repeat(2), 16) / 255, "expand");
    if (hex.length === 3 || hex.length === 4) {
      return { r: expand(hex[0] ?? ""), g: expand(hex[1] ?? ""), b: expand(hex[2] ?? "") };
    }
    if (hex.length === 6 || hex.length === 8) {
      const pair = /* @__PURE__ */ __name((at) => Number.parseInt(hex.slice(at, at + 2), 16) / 255, "pair");
      return { r: pair(0), g: pair(2), b: pair(4) };
    }
    return null;
  }
  const body = /^rgba?\(([^)]*)\)$/i.exec(text)?.[1];
  if (body === void 0) return null;
  const parts = body.split("/")[0]?.split(/[\s,]+/).filter((part) => part.length > 0);
  if (!parts || parts.length < 3) return null;
  const channel = /* @__PURE__ */ __name((raw) => {
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return Number.NaN;
    return raw.endsWith("%") ? value / 100 : value / 255;
  }, "channel");
  const rgb = { r: channel(parts[0] ?? ""), g: channel(parts[1] ?? ""), b: channel(parts[2] ?? "") };
  if (!Number.isFinite(rgb.r) || !Number.isFinite(rgb.g) || !Number.isFinite(rgb.b)) return null;
  return rgb;
}
__name(parseColor, "parseColor");
function css(color, alpha = 1) {
  const channel = /* @__PURE__ */ __name((value) => Math.round(clamp(value, 0, 1) * 255), "channel");
  const parts = `${channel(color.r)}, ${channel(color.g)}, ${channel(color.b)}`;
  return alpha >= 1 ? `rgb(${parts})` : `rgba(${parts}, ${alpha})`;
}
__name(css, "css");
function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
__name(clamp, "clamp");
function luminance(color) {
  const linear = /* @__PURE__ */ __name((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4, "linear");
  return 0.2126 * linear(color.r) + 0.7152 * linear(color.g) + 0.0722 * linear(color.b);
}
__name(luminance, "luminance");
function contrast(first, second) {
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
__name(contrast, "contrast");
function blend(color, over, amount) {
  const mix = /* @__PURE__ */ __name((top, base) => base * (1 - amount) + top * amount, "mix");
  return { r: mix(color.r, over.r), g: mix(color.g, over.g), b: mix(color.b, over.b) };
}
__name(blend, "blend");
function rgbToHsb(color) {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const span = max - min;
  let hue = 0;
  if (span > 0) {
    if (max === color.r) hue = ((color.g - color.b) / span + 6) % 6;
    else if (max === color.g) hue = (color.b - color.r) / span + 2;
    else hue = (color.r - color.g) / span + 4;
    hue /= 6;
  }
  return { hue, saturation: max === 0 ? 0 : span / max, brightness: max };
}
__name(rgbToHsb, "rgbToHsb");
function hsbToRgb(hue, saturation, brightness) {
  const sector = (hue % 1 + 1) % 1 * 6;
  const index = Math.floor(sector);
  const fraction = sector - index;
  const p = brightness * (1 - saturation);
  const q = brightness * (1 - saturation * fraction);
  const t = brightness * (1 - saturation * (1 - fraction));
  switch (index % 6) {
    case 0:
      return { r: brightness, g: t, b: p };
    case 1:
      return { r: q, g: brightness, b: p };
    case 2:
      return { r: p, g: brightness, b: t };
    case 3:
      return { r: p, g: q, b: brightness };
    case 4:
      return { r: t, g: p, b: brightness };
    default:
      return { r: brightness, g: p, b: q };
  }
}
__name(hsbToRgb, "hsbToRgb");
const MINIMUM_CONTRAST = 3;
function accentStroke(accent, ground, isDarkSurface2) {
  const { hue, saturation, brightness } = rgbToHsb(accent);
  const isGrey = saturation < 0.08;
  let stroke = hsbToRgb(
    hue,
    isGrey ? saturation : Math.max(saturation, isDarkSurface2 ? 0.4 : 0.5),
    isDarkSurface2 ? Math.max(brightness, 0.78) : Math.min(brightness, 0.62)
  );
  const groundLuminance = luminance(ground);
  const toward = isDarkSurface2 ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 };
  let steps = 0;
  while (contrast(luminance(stroke), groundLuminance) < MINIMUM_CONTRAST && steps < 12) {
    stroke = blend(toward, stroke, 0.12);
    steps += 1;
  }
  return stroke;
}
__name(accentStroke, "accentStroke");
const LIGHT_GROUND = { r: 1, g: 1, b: 1 };
const DARK_GROUND = { r: 0.118, g: 0.118, b: 0.118 };
function isDarkSurface(request) {
  const text = parseColor(request.textColor);
  return text === null ? false : luminance(text) > 0.5;
}
__name(isDarkSurface, "isDarkSurface");
function groundFor(request) {
  return parseColor(request.surface) ?? (isDarkSurface(request) ? DARK_GROUND : LIGHT_GROUND);
}
__name(groundFor, "groundFor");
function themeVariables(request) {
  const dark = isDarkSurface(request);
  const ground = groundFor(request);
  const text = parseColor(request.textColor) ?? (dark ? LIGHT_GROUND : DARK_GROUND);
  const textCss = css(text);
  const accent = request.accent === void 0 ? ground : parseColor(request.accent) ?? ground;
  const stroke = accentStroke(accent, ground, dark);
  const fill = css(stroke, dark ? 0.22 : 0.12);
  const faint = css(stroke, dark ? 0.1 : 0.06);
  const softStroke = css(stroke, 0.6);
  const strokeCss = css(stroke);
  return {
    // Mermaid's own light or dark set under everything below. It belongs HERE
    // rather than only in the config: the theme applies its overrides before it
    // derives anything, so this is what every derivation reads.
    darkMode: dark,
    // `background` is never painted — mermaid's SVG is transparent, and the
    // block draws its own slab under it, which is mac's transparent palette
    // background. It is here because mermaid derives the edge and arrowhead
    // colours by inverting it, and inverting the real surface is what puts
    // those lines where they can be seen.
    background: css(ground),
    fontFamily: request.fontFamily,
    fontSize: request.fontSize,
    // The surface's foreground, everywhere text is drawn. The last three are
    // ours rather than mac's, and they are a guard, not a flourish: mermaid
    // derives them by INVERTING the box colours, and a box colour of ours is
    // translucent, so the inversion would come back nearly invisible.
    textColor: textCss,
    primaryTextColor: textCss,
    nodeTextColor: textCss,
    actorTextColor: textCss,
    signalTextColor: textCss,
    pieTitleTextColor: textCss,
    secondaryTextColor: textCss,
    tertiaryTextColor: textCss,
    titleColor: textCss,
    // The boxes take the accent.
    primaryColor: fill,
    primaryBorderColor: strokeCss,
    mainBkg: fill,
    nodeBorder: strokeCss,
    clusterBkg: faint,
    clusterBorder: softStroke,
    actorBkg: fill,
    actorBorder: strokeCss,
    labelBoxBkgColor: fill,
    labelBoxBorderColor: strokeCss,
    attributeBackgroundColorOdd: faint,
    attributeBackgroundColorEven: fill,
    activationBkgColor: faint,
    activationBorderColor: strokeCss,
    // Edge labels sit ON a line, so their background has to be opaque: its job
    // is to hide the line under the label, which a translucent fill cannot do.
    // Mixed from the surface, because Mermaid's neutral grey reads cold on a
    // warm note.
    edgeLabelBackground: css(blend(stroke, ground, dark ? 0.25 : 0.15))
  };
}
__name(themeVariables, "themeVariables");
function configFor(request) {
  return {
    startOnLoad: false,
    // Sanitises the diagram's own text and forbids HTML labels. A note's text
    // is written by whoever is holding the keyboard — a person or an agent —
    // and it is rendered into our document, so this is not optional.
    securityLevel: "strict",
    // Labels as SVG `<text>` rather than foreignObject HTML. Two reasons, and
    // the second is the one that would bite: a foreignObject does not survive
    // being rasterised through an `<img>`, so "Copy as Image" would hand over a
    // diagram with every label missing.
    htmlLabels: false,
    // A parse failure is answered with a failed availability and the block
    // stays a code block; mermaid must not also plant its own error diagram in
    // the document while we do that.
    suppressErrorRendering: true,
    theme: "base",
    darkMode: isDarkSurface(request),
    themeVariables: themeVariables(request)
  };
}
__name(configFor, "configFor");
let mermaidPromise = null;
function loadMermaid() {
  mermaidPromise ??= __vitePreload(() => import("./mermaid.core-BeYOr_ll.js").then((n) => n.bz), true ? __vite__mapDeps([0,1,2,3,4]) : void 0, import.meta.url).then((module) => module.default);
  return mermaidPromise;
}
__name(loadMermaid, "loadMermaid");
let queue = Promise.resolve();
let renderCount = 0;
async function renderDiagram(request) {
  const run = queue.then(async () => {
    const mermaid = await loadMermaid();
    mermaid.initialize(configFor(request));
    renderCount += 1;
    const id = `maestri-diagram-${renderCount}-${Math.random().toString(36).slice(2, 10)}`;
    const { svg } = await mermaid.render(id, request.source);
    return svg.split(id).join(DIAGRAM_ID_TOKEN);
  });
  queue = run.catch(() => void 0);
  return run;
}
__name(renderDiagram, "renderDiagram");
const DIAGRAM_PADDING = 12;
const MAXIMUM_EXPORT_PIXELS = 2e7;
async function diagramPng(svg, request) {
  const box = svg.viewBox.baseVal;
  const width = box.width > 0 ? box.width : svg.getBoundingClientRect().width;
  const height = box.height > 0 ? box.height : svg.getBoundingClientRect().height;
  if (!(width > 0) || !(height > 0)) return null;
  const size = {
    width: width + DIAGRAM_PADDING * 2,
    height: height + DIAGRAM_PADDING * 2
  };
  const scale = Math.min(2, Math.sqrt(MAXIMUM_EXPORT_PIXELS / (size.width * size.height)));
  if (!(scale > 0) || !Number.isFinite(scale)) return null;
  const drawing = svg.cloneNode(true);
  if (!(drawing instanceof SVGSVGElement)) return null;
  drawing.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  drawing.setAttribute("width", `${width}`);
  drawing.setAttribute("height", `${height}`);
  drawing.removeAttribute("style");
  const source = new XMLSerializer().serializeToString(drawing);
  const image = new Image();
  image.decoding = "sync";
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  try {
    await image.decode();
  } catch {
    return null;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(size.width * scale);
  canvas.height = Math.ceil(size.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.scale(scale, scale);
  context.fillStyle = css(isDarkSurface(request) ? DARK_GROUND : LIGHT_GROUND);
  context.fillRect(0, 0, size.width, size.height);
  context.drawImage(image, DIAGRAM_PADDING, DIAGRAM_PADDING, width, height);
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!blob) return null;
  return new Uint8Array(await blob.arrayBuffer());
}
__name(diagramPng, "diagramPng");
export {
  diagramPng,
  renderDiagram
};
