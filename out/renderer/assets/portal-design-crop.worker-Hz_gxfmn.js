var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
(function() {
  "use strict";
  const isFiniteNumber = /* @__PURE__ */ __name((value) => typeof value === "number" && Number.isFinite(value), "isFiniteNumber");
  const isDesignRect = /* @__PURE__ */ __name((value) => {
    if (typeof value !== "object" || value === null) return false;
    const record = { ...value };
    return isFiniteNumber(record["x"]) && isFiniteNumber(record["y"]) && isFiniteNumber(record["width"]) && isFiniteNumber(record["height"]);
  }, "isDesignRect");
  const isCropRequest = /* @__PURE__ */ __name((value) => {
    if (typeof value !== "object" || value === null) return false;
    const record = { ...value };
    return typeof record["requestId"] === "string" && (record["image"] instanceof Blob || record["image"] instanceof ImageBitmap) && isDesignRect(record["region"]);
  }, "isCropRequest");
  const integral = /* @__PURE__ */ __name((rect) => {
    const minX = Math.floor(rect.x);
    const minY = Math.floor(rect.y);
    const maxX = Math.ceil(rect.x + rect.width);
    const maxY = Math.ceil(rect.y + rect.height);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, "integral");
  const encodeBase64 = /* @__PURE__ */ __name((bytes) => {
    const chunk = 32768;
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += chunk) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
    }
    return btoa(binary);
  }, "encodeBase64");
  async function annotatedCrop(image, region) {
    const bitmap = image instanceof ImageBitmap ? image : await createImageBitmap(image);
    try {
      const width = bitmap.width;
      const height = bitmap.height;
      const clipped = {
        x: Math.max(0, region.x),
        y: Math.max(0, region.y),
        maxX: Math.min(1, region.x + region.width),
        maxY: Math.min(1, region.y + region.height)
      };
      const pixels = {
        x: clipped.x * width,
        y: clipped.y * height,
        width: (clipped.maxX - clipped.x) * width,
        height: (clipped.maxY - clipped.y) * height
      };
      if (!(pixels.width > 0) || !(pixels.height > 0)) return null;
      const margin = Math.max(
        32,
        Math.min(width, height) * 0.04,
        Math.max(pixels.width, pixels.height) * 0.18
      );
      const padded = integral({
        x: pixels.x - margin,
        y: pixels.y - margin,
        width: pixels.width + margin * 2,
        height: pixels.height + margin * 2
      });
      const cropX = Math.max(0, padded.x);
      const cropY = Math.max(0, padded.y);
      const cropRect = {
        x: cropX,
        y: cropY,
        width: Math.min(width, padded.x + padded.width) - cropX,
        height: Math.min(height, padded.y + padded.height) - cropY
      };
      if (!(cropRect.width > 0) || !(cropRect.height > 0)) return null;
      const canvas = new OffscreenCanvas(cropRect.width, cropRect.height);
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.drawImage(
        bitmap,
        cropRect.x,
        cropRect.y,
        cropRect.width,
        cropRect.height,
        0,
        0,
        cropRect.width,
        cropRect.height
      );
      const box = {
        x: pixels.x - cropRect.x + 2,
        y: pixels.y - cropRect.y + 2,
        width: pixels.width - 4,
        height: pixels.height - 4
      };
      if (box.width > 0 && box.height > 0) {
        const path = new Path2D();
        path.roundRect(box.x, box.y, box.width, box.height, 8);
        context.lineJoin = "round";
        context.strokeStyle = "rgba(255, 255, 255, 0.95)";
        context.lineWidth = 6;
        context.stroke(path);
        context.strokeStyle = "rgb(204, 20, 115)";
        context.lineWidth = 3;
        context.stroke(path);
      }
      const blob = await canvas.convertToBlob({ type: "image/png" });
      const buffer = await blob.arrayBuffer();
      return { png: buffer, base64: encodeBase64(new Uint8Array(buffer)) };
    } finally {
      bitmap.close();
    }
  }
  __name(annotatedCrop, "annotatedCrop");
  self.addEventListener("message", (event) => {
    const request = event.data;
    if (!isCropRequest(request)) return;
    void annotatedCrop(request.image, request.region).then((result) => {
      const answer = {
        requestId: request.requestId,
        png: result?.png ?? null,
        base64: result?.base64 ?? null
      };
      self.postMessage(answer, result ? { transfer: [result.png] } : {});
    }).catch((cause) => {
      console.warn("[portal-design] crop failed", cause);
      const answer = { requestId: request.requestId, png: null, base64: null };
      self.postMessage(answer);
    });
  });
})();
