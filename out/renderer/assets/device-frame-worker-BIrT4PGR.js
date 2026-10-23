var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
(function() {
  "use strict";
  class AnnexBParser {
    static {
      __name(this, "AnnexBParser");
    }
    constructor(onNalUnit) {
      this.onNalUnit = onNalUnit;
    }
    onNalUnit;
    buffer = new Uint8Array(0);
    consume(chunk) {
      const combined = new Uint8Array(this.buffer.byteLength + chunk.byteLength);
      combined.set(this.buffer);
      combined.set(chunk, this.buffer.byteLength);
      const starts = findNalStarts(combined);
      if (starts.length < 2) {
        this.buffer = combined;
        return;
      }
      for (let index = 0; index + 1 < starts.length; index += 1) {
        const start = starts[index];
        const next = starts[index + 1];
        if (start === void 0 || next === void 0) continue;
        this.onNalUnit(fourByteStartCode(combined.slice(start, next)));
      }
      const trailingStart = starts[starts.length - 1];
      this.buffer = trailingStart === void 0 ? combined : combined.slice(trailingStart);
    }
    reset() {
      this.buffer = new Uint8Array(0);
    }
  }
  function nalUnitType(unit) {
    const prefixLength = startCodeLength(unit);
    if (prefixLength === null || unit.byteLength <= prefixLength) return null;
    const header = unit[prefixLength];
    return header === void 0 ? null : header & 31;
  }
  __name(nalUnitType, "nalUnitType");
  function avcCodecFromSps(unit) {
    const prefixLength = startCodeLength(unit);
    if (prefixLength === null) return null;
    const profile = unit[prefixLength + 1];
    const constraints = unit[prefixLength + 2];
    const level = unit[prefixLength + 3];
    if (profile === void 0 || constraints === void 0 || level === void 0) return null;
    return `avc1.${hexByte(profile)}${hexByte(constraints)}${hexByte(level)}`;
  }
  __name(avcCodecFromSps, "avcCodecFromSps");
  function joinNalUnits(units) {
    const byteLength = units.reduce((total, unit) => total + unit.byteLength, 0);
    const joined = new Uint8Array(byteLength);
    let offset = 0;
    for (const unit of units) {
      joined.set(unit, offset);
      offset += unit.byteLength;
    }
    return joined;
  }
  __name(joinNalUnits, "joinNalUnits");
  function findNalStarts(data) {
    const starts = [];
    for (let index = 0; index + 3 <= data.byteLength; ) {
      if (index + 4 <= data.byteLength && data[index] === 0 && data[index + 1] === 0 && data[index + 2] === 0 && data[index + 3] === 1) {
        starts.push(index);
        index += 4;
        continue;
      }
      if (data[index] === 0 && data[index + 1] === 0 && data[index + 2] === 1) {
        starts.push(index);
        index += 3;
        continue;
      }
      index += 1;
    }
    return starts;
  }
  __name(findNalStarts, "findNalStarts");
  function startCodeLength(unit) {
    if (unit[0] !== 0 || unit[1] !== 0) return null;
    if (unit[2] === 1) return 3;
    return unit[2] === 0 && unit[3] === 1 ? 4 : null;
  }
  __name(startCodeLength, "startCodeLength");
  function fourByteStartCode(unit) {
    if (startCodeLength(unit) !== 3) return unit;
    const normalized = new Uint8Array(unit.byteLength + 1);
    normalized.set([0, 0, 0, 1]);
    normalized.set(unit.subarray(3), 4);
    return normalized;
  }
  __name(fourByteStartCode, "fourByteStartCode");
  function hexByte(value) {
    return value.toString(16).padStart(2, "0");
  }
  __name(hexByte, "hexByte");
  class NewestFrameMailbox {
    static {
      __name(this, "NewestFrameMailbox");
    }
    constructor(schedule, present, onDrop) {
      this.schedule = schedule;
      this.present = present;
      this.onDrop = onDrop;
    }
    schedule;
    present;
    onDrop;
    pending = null;
    scheduled = false;
    push(frame) {
      if (this.pending) {
        this.pending.close();
        this.onDrop();
      }
      this.pending = frame;
      if (this.scheduled) return;
      this.scheduled = true;
      this.schedule(() => this.drain());
    }
    clear() {
      this.pending?.close();
      this.pending = null;
    }
    drain() {
      this.scheduled = false;
      const frame = this.pending;
      this.pending = null;
      if (!frame) return;
      try {
        this.present(frame);
      } finally {
        frame.close();
      }
      if (!this.pending || this.scheduled) return;
      this.scheduled = true;
      this.schedule(() => this.drain());
    }
  }
  const surfaces = /* @__PURE__ */ new Map();
  const metrics = {
    streamBytes: 0,
    streamChunks: 0,
    decodedFrames: 0,
    paintedFrames: 0,
    droppedFrames: 0,
    decodeQueueSize: 0,
    frameWidth: 0,
    frameHeight: 0,
    firstChunkAt: null,
    firstFrameAt: null,
    lastFrameAt: null
  };
  let streamPort = null;
  let decoder = null;
  let codec = null;
  let sps = null;
  let pps = null;
  const accessUnit = [];
  let accessUnitFrameType = null;
  let awaitingKeyFrame = true;
  let timestamp = 0;
  let lastFrame = null;
  let lastMetricsSentAt = 0;
  let streamLive = false;
  let screenRegion = null;
  let reportedFrameSize = null;
  const mailbox = new NewestFrameMailbox(
    (callback) => setTimeout(callback, 0),
    (frame) => {
      lastFrame?.close();
      lastFrame = frame.clone();
      reportFrameSize(frame);
      const visible = visibleRect(frame);
      metrics.frameWidth = visible.width;
      metrics.frameHeight = visible.height;
      metrics.paintedFrames += 1;
      metrics.lastFrameAt = nowEpochMs();
      for (const surface of surfaces.values()) drawFrame(surface, frame);
      if (!streamLive) {
        streamLive = true;
        const status = { type: "status", status: "live", failure: null };
        self.postMessage(status);
      }
      emitMetrics();
    },
    () => {
      metrics.droppedFrames += 1;
    }
  );
  const parser = new AnnexBParser((unit) => handleNalUnit(unit));
  self.onmessage = (event) => {
    const message = readWorkerMessage(event.data);
    if (!message) return;
    if (message.type === "connect") {
      streamPort?.close();
      parser.reset();
      sps = null;
      pps = null;
      accessUnit.length = 0;
      accessUnitFrameType = null;
      awaitingKeyFrame = true;
      if (decoder?.state === "configured") decoder.reset();
      streamLive = false;
      screenRegion = null;
      reportedFrameSize = null;
      streamPort = message.port;
      streamPort.onmessage = (streamEvent) => handleStreamEvent(streamEvent.data);
      streamPort.start();
      return;
    }
    if (message.type === "attachSurface") {
      const context = message.canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!context) return;
      message.canvas.width = message.width;
      message.canvas.height = message.height;
      const surface = { canvas: message.canvas, context };
      surfaces.set(message.portalId, surface);
      if (lastFrame) drawFrame(surface, lastFrame);
      return;
    }
    if (message.type === "resizeSurface") {
      const surface = surfaces.get(message.portalId);
      if (!surface) return;
      surface.canvas.width = message.width;
      surface.canvas.height = message.height;
      if (lastFrame) drawFrame(surface, lastFrame);
      return;
    }
    if (message.type === "snapshot") {
      void captureSnapshot(message.requestId, message.maxLongSide);
      return;
    }
    if (message.type === "frame") {
      void captureFrame(message.requestId);
      return;
    }
    if (message.type === "detachSurface") {
      surfaces.delete(message.portalId);
      return;
    }
    shutdown();
  };
  function handleStreamEvent(value) {
    if (!isRecord(value)) return;
    const type = value["type"];
    if (type === "status") {
      streamLive = value["status"] === "live";
      self.postMessage(value);
      return;
    }
    if (type === "region") {
      applyRegion(value);
      return;
    }
    const data = value["data"];
    if (type !== "chunk" || !(data instanceof ArrayBuffer)) return;
    const rawReceivedAt = value["receivedAt"];
    const receivedAt = typeof rawReceivedAt === "number" ? rawReceivedAt : nowEpochMs();
    metrics.streamBytes += data.byteLength;
    metrics.streamChunks += 1;
    metrics.firstChunkAt ??= receivedAt;
    parser.consume(new Uint8Array(data));
    emitMetrics();
  }
  __name(handleStreamEvent, "handleStreamEvent");
  function handleNalUnit(unit) {
    const type = nalUnitType(unit);
    if (type === 1 || type === 5) {
      if (accessUnitFrameType !== null && isFirstSlice(unit)) decodeAccessUnit();
      accessUnit.push(unit);
      if (type === 5) accessUnitFrameType = "key";
      else accessUnitFrameType ??= "delta";
      return;
    }
    if (type !== 6 && type !== 7 && type !== 8 && type !== 9) return;
    if (accessUnitFrameType !== null) decodeAccessUnit();
    accessUnit.push(unit);
    if (type === 7 || type === 8) {
      if (type === 7) sps = unit.slice();
      else pps = unit.slice();
      configureDecoder();
    }
  }
  __name(handleNalUnit, "handleNalUnit");
  function decodeAccessUnit() {
    const frameType = accessUnitFrameType;
    if (frameType === null) return;
    const data = joinNalUnits(accessUnit);
    accessUnit.length = 0;
    accessUnitFrameType = null;
    if (!decoder || decoder.state !== "configured") return;
    if (awaitingKeyFrame && frameType !== "key") {
      metrics.droppedFrames += 1;
      emitMetrics();
      return;
    }
    timestamp += 33333;
    try {
      decoder.decode(new EncodedVideoChunk({
        type: frameType,
        timestamp,
        data
      }));
      awaitingKeyFrame = false;
      metrics.decodeQueueSize = decoder.decodeQueueSize;
    } catch {
      metrics.droppedFrames += 1;
      awaitingKeyFrame = true;
    }
    emitMetrics();
  }
  __name(decodeAccessUnit, "decodeAccessUnit");
  function isFirstSlice(unit) {
    const prefixLength = unit[2] === 1 ? 3 : 4;
    const firstPayloadByte = unit[prefixLength + 1];
    return firstPayloadByte !== void 0 && (firstPayloadByte & 128) !== 0;
  }
  __name(isFirstSlice, "isFirstSlice");
  function configureDecoder() {
    if (!sps || !pps) return;
    const nextCodec = avcCodecFromSps(sps);
    if (!nextCodec) return;
    if (!decoder || decoder.state === "closed") {
      decoder = new VideoDecoder({
        output: /* @__PURE__ */ __name((frame) => {
          metrics.decodedFrames += 1;
          metrics.decodeQueueSize = decoder?.decodeQueueSize ?? 0;
          metrics.firstFrameAt ??= nowEpochMs();
          mailbox.push(frame);
        }, "output"),
        error: /* @__PURE__ */ __name((error) => {
          console.error(`[device] H.264 decoder failed: ${error.message}`);
          metrics.droppedFrames += 1;
          awaitingKeyFrame = true;
          emitMetrics(true);
        }, "error")
      });
    }
    if (codec === nextCodec && decoder.state === "configured") return;
    if (decoder.state === "configured") decoder.reset();
    codec = nextCodec;
    decoder.configure({ codec, optimizeForLatency: true });
    awaitingKeyFrame = true;
  }
  __name(configureDecoder, "configureDecoder");
  function drawFrame(surface, frame) {
    const canvasWidth = surface.canvas.width;
    const canvasHeight = surface.canvas.height;
    const source = visibleRect(frame);
    if (canvasWidth <= 0 || canvasHeight <= 0 || source.width <= 0 || source.height <= 0) return;
    const scale = Math.min(canvasWidth / source.width, canvasHeight / source.height);
    const width = source.width * scale;
    const height = source.height * scale;
    const x = (canvasWidth - width) / 2;
    const y = (canvasHeight - height) / 2;
    surface.context.clearRect(0, 0, canvasWidth, canvasHeight);
    surface.context.drawImage(frame, source.x, source.y, source.width, source.height, x, y, width, height);
  }
  __name(drawFrame, "drawFrame");
  function visibleRect(frame) {
    const region = screenRegion;
    if (region?.region && region.frame.width === frame.displayWidth && region.frame.height === frame.displayHeight) return region.region;
    return { x: 0, y: 0, width: frame.displayWidth, height: frame.displayHeight };
  }
  __name(visibleRect, "visibleRect");
  function reportFrameSize(frame) {
    const width = frame.displayWidth;
    const height = frame.displayHeight;
    if (width <= 0 || height <= 0) return;
    if (reportedFrameSize?.width === width && reportedFrameSize.height === height) return;
    reportedFrameSize = { width, height };
    const message = { type: "frameSize", width, height };
    streamPort?.postMessage(message);
  }
  __name(reportFrameSize, "reportFrameSize");
  function applyRegion(value) {
    const frame = value["frame"];
    const region = value["region"];
    if (!isSize(frame)) return;
    if (region !== null && !isRegion(region)) return;
    screenRegion = {
      frame: { width: frame.width, height: frame.height },
      region: region === null ? null : { x: region.x, y: region.y, width: region.width, height: region.height }
    };
    if (!lastFrame) return;
    const visible = visibleRect(lastFrame);
    metrics.frameWidth = visible.width;
    metrics.frameHeight = visible.height;
    for (const surface of surfaces.values()) drawFrame(surface, lastFrame);
    emitMetrics(true);
  }
  __name(applyRegion, "applyRegion");
  async function captureSnapshot(requestId, maxLongSide) {
    const answer = /* @__PURE__ */ __name((result) => {
      const message = { type: "snapshot", requestId, result };
      self.postMessage(message, result ? { transfer: [result.data] } : {});
    }, "answer");
    const frame = lastFrame;
    if (!frame) {
      answer(null);
      return;
    }
    try {
      const source = visibleRect(frame);
      const scale = Math.min(1, maxLongSide / Math.max(source.width, source.height));
      const width = Math.max(1, Math.round(source.width * scale));
      const height = Math.max(1, Math.round(source.height * scale));
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        console.warn("[device] the snapshot has no 2D context");
        answer(null);
        return;
      }
      context.drawImage(frame, source.x, source.y, source.width, source.height, 0, 0, width, height);
      const blob = await canvas.convertToBlob({ type: "image/png" });
      const data = await blob.arrayBuffer();
      answer({
        data,
        emittedSize: { width, height },
        physicalSize: { width: source.width, height: source.height },
        maxLongSide
      });
    } catch (cause) {
      console.warn("[device] the snapshot could not be encoded", cause);
      answer(null);
    }
  }
  __name(captureSnapshot, "captureSnapshot");
  async function captureFrame(requestId) {
    const answer = /* @__PURE__ */ __name((frame2) => {
      const message = { type: "frame", requestId, frame: frame2 };
      self.postMessage(message, frame2 ? { transfer: [frame2] } : {});
    }, "answer");
    const frame = lastFrame?.clone() ?? null;
    if (!frame) {
      answer(null);
      return;
    }
    let bitmap = null;
    try {
      const source = visibleRect(frame);
      bitmap = await createImageBitmap(frame, source.x, source.y, source.width, source.height);
      answer(bitmap);
    } catch (cause) {
      console.warn("[device] the frame could not be captured", cause);
      bitmap?.close();
      answer(null);
    } finally {
      frame.close();
    }
  }
  __name(captureFrame, "captureFrame");
  function emitMetrics(force = false) {
    const now = performance.now();
    if (!force && now - lastMetricsSentAt < 250) return;
    lastMetricsSentAt = now;
    const message = { type: "metrics", metrics: { ...metrics } };
    self.postMessage(message);
  }
  __name(emitMetrics, "emitMetrics");
  function shutdown() {
    mailbox.clear();
    lastFrame?.close();
    lastFrame = null;
    streamPort?.postMessage({ type: "close" });
    streamPort?.close();
    streamPort = null;
    if (decoder && decoder.state !== "closed") decoder.close();
    streamLive = false;
    decoder = null;
    parser.reset();
    surfaces.clear();
  }
  __name(shutdown, "shutdown");
  function readWorkerMessage(value) {
    if (!isRecord(value)) return null;
    const type = value["type"];
    if (typeof type !== "string") return null;
    const port = value["port"];
    if (type === "connect" && port instanceof MessagePort) {
      return { type: "connect", port };
    }
    const portalId = value["portalId"];
    const canvas = value["canvas"];
    const width = value["width"];
    const height = value["height"];
    if (type === "attachSurface" && typeof portalId === "string" && canvas instanceof OffscreenCanvas && typeof width === "number" && typeof height === "number") {
      return {
        type: "attachSurface",
        portalId,
        canvas,
        width,
        height
      };
    }
    if (type === "resizeSurface" && typeof portalId === "string" && typeof width === "number" && typeof height === "number") return { type: "resizeSurface", portalId, width, height };
    if (type === "detachSurface" && typeof portalId === "string") {
      return { type: "detachSurface", portalId };
    }
    const requestId = value["requestId"];
    const maxLongSide = value["maxLongSide"];
    if (type === "snapshot" && typeof requestId === "string" && typeof maxLongSide === "number") return { type: "snapshot", requestId, maxLongSide };
    if (type === "frame" && typeof requestId === "string") return { type: "frame", requestId };
    if (type === "close") return { type: "close" };
    return null;
  }
  __name(readWorkerMessage, "readWorkerMessage");
  function isRecord(value) {
    return typeof value === "object" && value !== null;
  }
  __name(isRecord, "isRecord");
  function isSize(value) {
    return isRecord(value) && isPositive(value["width"]) && isPositive(value["height"]);
  }
  __name(isSize, "isSize");
  function isRegion(value) {
    return isRecord(value) && isNonNegative(value["x"]) && isNonNegative(value["y"]) && isPositive(value["width"]) && isPositive(value["height"]);
  }
  __name(isRegion, "isRegion");
  function isPositive(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  }
  __name(isPositive, "isPositive");
  function isNonNegative(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
  }
  __name(isNonNegative, "isNonNegative");
  function nowEpochMs() {
    return performance.timeOrigin + performance.now();
  }
  __name(nowEpochMs, "nowEpochMs");
})();
