var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
globalThis.__MAESTRI_BUILD_SHA__ = "1bf806c58255ee745382a65848e9698af74aba67";
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var Symbol$1 = root.Symbol;
var objectProto$c = Object.prototype;
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;
var nativeObjectToString$1 = objectProto$c.toString;
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$9.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
__name(getRawTag, "getRawTag");
var objectProto$b = Object.prototype;
var nativeObjectToString = objectProto$b.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
__name(objectToString, "objectToString");
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
__name(baseGetTag, "baseGetTag");
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
__name(isObjectLike, "isObjectLike");
var symbolTag$1 = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$1;
}
__name(isSymbol, "isSymbol");
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
__name(arrayMap, "arrayMap");
var isArray = Array.isArray;
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
__name(baseToString, "baseToString");
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
__name(isObject, "isObject");
function identity(value) {
  return value;
}
__name(identity, "identity");
var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
__name(isFunction, "isFunction");
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
})();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
__name(isMasked, "isMasked");
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
__name(toSource, "toSource");
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$a = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty$8).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
__name(baseIsNative, "baseIsNative");
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
__name(getValue, "getValue");
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
__name(getNative, "getNative");
var WeakMap = getNative(root, "WeakMap");
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
__name(apply, "apply");
function noop() {
}
__name(noop, "noop");
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
__name(shortOut, "shortOut");
function constant(value) {
  return function() {
    return value;
  };
}
__name(constant, "constant");
var defineProperty = (function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
})();
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var setToString = shortOut(baseSetToString);
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
__name(arrayEach, "arrayEach");
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + -1;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
__name(baseFindIndex, "baseFindIndex");
function baseIsNaN(value) {
  return value !== value;
}
__name(baseIsNaN, "baseIsNaN");
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
__name(strictIndexOf, "strictIndexOf");
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
__name(baseIndexOf, "baseIndexOf");
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
__name(arrayIncludes, "arrayIncludes");
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
__name(isIndex, "isIndex");
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
__name(eq, "eq");
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}
__name(overRest, "overRest");
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + "");
}
__name(baseRest, "baseRest");
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
__name(isLength, "isLength");
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
__name(isArrayLike, "isArrayLike");
var objectProto$9 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$9;
  return value === proto;
}
__name(isPrototype, "isPrototype");
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
__name(baseTimes, "baseTimes");
var argsTag$2 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$2;
}
__name(baseIsArguments, "baseIsArguments");
var objectProto$8 = Object.prototype;
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable;
var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
  return arguments;
})()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$7.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
function stubFalse() {
  return false;
}
__name(stubFalse, "stubFalse");
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var Buffer2 = moduleExports$1 ? root.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", mapTag$3 = "[object Map]", numberTag$1 = "[object Number]", objectTag$2 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$1 = "[object String]", weakMapTag$1 = "[object WeakMap]";
var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag] = typedArrayTags[mapTag$3] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$3] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
__name(baseIsTypedArray, "baseIsTypedArray");
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
__name(baseUnary, "baseUnary");
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal.process;
var nodeUtil = (function() {
  try {
    var types = freeModule && freeModule.require && freeModule.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
})();
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
__name(arrayLikeKeys, "arrayLikeKeys");
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
__name(overArg, "overArg");
var nativeKeys = overArg(Object.keys, Object);
var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$5.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
__name(baseKeys, "baseKeys");
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
__name(keys, "keys");
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
__name(isKey, "isKey");
var nativeCreate = getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
__name(hashClear, "hashClear");
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
__name(hashDelete, "hashDelete");
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$4.call(data, key) ? data[key] : void 0;
}
__name(hashGet, "hashGet");
var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty$3.call(data, key);
}
__name(hashHas, "hashHas");
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
__name(hashSet, "hashSet");
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
__name(Hash, "Hash");
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
__name(listCacheClear, "listCacheClear");
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
__name(assocIndexOf, "assocIndexOf");
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
__name(listCacheDelete, "listCacheDelete");
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
__name(listCacheGet, "listCacheGet");
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
__name(listCacheHas, "listCacheHas");
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
__name(listCacheSet, "listCacheSet");
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
__name(ListCache, "ListCache");
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map = getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map || ListCache)(),
    "string": new Hash()
  };
}
__name(mapCacheClear, "mapCacheClear");
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
__name(isKeyable, "isKeyable");
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
__name(getMapData, "getMapData");
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
__name(mapCacheDelete, "mapCacheDelete");
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
__name(mapCacheGet, "mapCacheGet");
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
__name(mapCacheHas, "mapCacheHas");
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
__name(mapCacheSet, "mapCacheSet");
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
__name(MapCache, "MapCache");
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = /* @__PURE__ */ __name(function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  }, "memoized");
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
__name(memoize, "memoize");
memoize.Cache = MapCache;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
__name(memoizeCapped, "memoizeCapped");
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
function toString(value) {
  return value == null ? "" : baseToString(value);
}
__name(toString, "toString");
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}
__name(castPath, "castPath");
function toKey(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
__name(toKey, "toKey");
function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : void 0;
}
__name(baseGet, "baseGet");
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet(object, path);
  return result === void 0 ? defaultValue : result;
}
__name(get, "get");
function arrayPush(array, values2) {
  var index = -1, length = values2.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values2[index];
  }
  return array;
}
__name(arrayPush, "arrayPush");
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
__name(isFlattenable, "isFlattenable");
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (predicate(value)) {
      {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
__name(baseFlatten, "baseFlatten");
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1, length = array == null ? 0 : array.length;
  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}
__name(arrayReduce, "arrayReduce");
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}
__name(stackClear, "stackClear");
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
__name(stackDelete, "stackDelete");
function stackGet(key) {
  return this.__data__.get(key);
}
__name(stackGet, "stackGet");
function stackHas(key) {
  return this.__data__.has(key);
}
__name(stackHas, "stackHas");
var LARGE_ARRAY_SIZE$1 = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE$1 - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
__name(stackSet, "stackSet");
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}
__name(Stack, "Stack");
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
__name(arrayFilter, "arrayFilter");
function stubArray() {
  return [];
}
__name(stubArray, "stubArray");
var objectProto$3 = Object.prototype;
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
__name(baseGetAllKeys, "baseGetAllKeys");
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}
__name(getAllKeys, "getAllKeys");
var DataView = getNative(root, "DataView");
var Promise$1 = getNative(root, "Promise");
var Set = getNative(root, "Set");
var mapTag$2 = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag$2 = "[object Set]", weakMapTag = "[object WeakMap]";
var dataViewTag$1 = "[object DataView]";
var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
var getTag = baseGetTag;
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1 || Map && getTag(new Map()) != mapTag$2 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$2 || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = /* @__PURE__ */ __name(function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$1;
        case mapCtorString:
          return mapTag$2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$2;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  }, "getTag");
}
var Uint8Array2 = root.Uint8Array;
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
__name(setCacheAdd, "setCacheAdd");
function setCacheHas(value) {
  return this.__data__.has(value);
}
__name(setCacheHas, "setCacheHas");
function SetCache(values2) {
  var index = -1, length = values2 == null ? 0 : values2.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values2[index]);
  }
}
__name(SetCache, "SetCache");
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function arraySome(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
__name(arraySome, "arraySome");
function cacheHas(cache, key) {
  return cache.has(key);
}
__name(cacheHas, "cacheHas");
var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome(other, function(othValue2, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
__name(equalArrays, "equalArrays");
function mapToArray(map) {
  var index = -1, result = Array(map.size);
  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
__name(mapToArray, "mapToArray");
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
__name(setToArray, "setToArray");
var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag$1 = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
        return false;
      }
      return true;
    case boolTag:
    case dateTag:
    case numberTag:
      return eq(+object, +other);
    case errorTag:
      return object.name == other.name && object.message == other.message;
    case regexpTag:
    case stringTag:
      return object == other + "";
    case mapTag$1:
      var convert = mapToArray;
    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
      convert || (convert = setToArray);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$2;
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
__name(equalByTag, "equalByTag");
var COMPARE_PARTIAL_FLAG$3 = 1;
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$2.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
__name(equalObjects, "equalObjects");
var COMPARE_PARTIAL_FLAG$2 = 1;
var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
    var objIsWrapped = objIsObj && hasOwnProperty$1.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$1.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
__name(baseIsEqualDeep, "baseIsEqualDeep");
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
__name(baseIsEqual, "baseIsEqual");
var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length, length = index;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object[key], srcValue = data[1];
    if (data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack();
      var result;
      if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
__name(baseIsMatch, "baseIsMatch");
function isStrictComparable(value) {
  return value === value && !isObject(value);
}
__name(isStrictComparable, "isStrictComparable");
function getMatchData(object) {
  var result = keys(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}
__name(getMatchData, "getMatchData");
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
__name(matchesStrictComparable, "matchesStrictComparable");
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}
__name(baseMatches, "baseMatches");
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
__name(baseHasIn, "baseHasIn");
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}
__name(hasPath, "hasPath");
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
__name(hasIn, "hasIn");
var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}
__name(baseMatchesProperty, "baseMatchesProperty");
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
__name(baseProperty, "baseProperty");
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}
__name(basePropertyDeep, "basePropertyDeep");
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
__name(property, "property");
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == "object") {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}
__name(baseIteratee, "baseIteratee");
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
__name(createBaseFor, "createBaseFor");
var baseFor = createBaseFor();
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}
__name(baseForOwn, "baseForOwn");
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = -1, iterable = Object(collection);
    while (++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
__name(createBaseEach, "createBaseEach");
var baseEach = createBaseEach(baseForOwn);
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
__name(isArrayLikeObject, "isArrayLikeObject");
function castFunction(value) {
  return typeof value == "function" ? value : identity;
}
__name(castFunction, "castFunction");
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}
__name(forEach, "forEach");
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection2) {
    if (predicate(value, index, collection2)) {
      result.push(value);
    }
  });
  return result;
}
__name(baseFilter, "baseFilter");
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate));
}
__name(filter, "filter");
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}
__name(baseValues, "baseValues");
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}
__name(values, "values");
var mapTag = "[object Map]", setTag = "[object Set]";
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
__name(isEmpty, "isEmpty");
function isUndefined(value) {
  return value === void 0;
}
__name(isUndefined, "isUndefined");
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection2) {
    accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
  });
  return accumulator;
}
__name(baseReduce, "baseReduce");
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
  return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEach);
}
__name(reduce, "reduce");
var INFINITY = 1 / 0;
var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values2) {
  return new Set(values2);
};
var LARGE_ARRAY_SIZE = 200;
function baseUniq(array, iteratee, comparator) {
  var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
  if (length >= LARGE_ARRAY_SIZE) {
    var set = createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = result;
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = value;
      value = value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes(seen, computed, comparator)) {
        if (seen !== result) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
__name(baseUniq, "baseUniq");
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});
var DEFAULT_EDGE_NAME = "\0";
var GRAPH_NODE = "\0";
var EDGE_KEY_DELIM = "";
class Graph {
  static {
    __name(this, "Graph");
  }
  /**
   * @param {GraphOptions} [opts] - Graph options.
   */
  constructor(opts = {}) {
    this._isDirected = Object.prototype.hasOwnProperty.call(opts, "directed") ? opts.directed : true;
    this._isMultigraph = Object.prototype.hasOwnProperty.call(opts, "multigraph") ? opts.multigraph : false;
    this._isCompound = Object.prototype.hasOwnProperty.call(opts, "compound") ? opts.compound : false;
    this._label = void 0;
    this._defaultNodeLabelFn = constant(void 0);
    this._defaultEdgeLabelFn = constant(void 0);
    this._nodes = {};
    if (this._isCompound) {
      this._parent = {};
      this._children = {};
      this._children[GRAPH_NODE] = {};
    }
    this._in = {};
    this._preds = {};
    this._out = {};
    this._sucs = {};
    this._edgeObjs = {};
    this._edgeLabels = {};
  }
  /* === Graph functions ========= */
  /**
   *
   * @returns {boolean} `true` if the graph is [directed](https://en.wikipedia.org/wiki/Directed_graph).
   * A directed graph treats the order of nodes in an edge as significant whereas an
   * [undirected](https://en.wikipedia.org/wiki/Graph_(mathematics)#Undirected_graph)
   * graph does not.
   * This example demonstrates the difference:
   *
   * @example
   *
   * ```js
   * var directed = new Graph({ directed: true });
   * directed.setEdge("a", "b", "my-label");
   * directed.edge("a", "b"); // returns "my-label"
   * directed.edge("b", "a"); // returns undefined
   *
   * var undirected = new Graph({ directed: false });
   * undirected.setEdge("a", "b", "my-label");
   * undirected.edge("a", "b"); // returns "my-label"
   * undirected.edge("b", "a"); // returns "my-label"
   * ```
   */
  isDirected() {
    return this._isDirected;
  }
  /**
   * @returns {boolean} `true` if the graph is a multigraph.
   */
  isMultigraph() {
    return this._isMultigraph;
  }
  /**
   * @returns {boolean} `true` if the graph is compound.
   */
  isCompound() {
    return this._isCompound;
  }
  /**
   * Sets the label for the graph to `label`.
   *
   * @param {GraphLabel} label - Label for the graph.
   * @returns {this}
   */
  setGraph(label) {
    this._label = label;
    return this;
  }
  /**
   * @returns {GraphLabel | undefined} the currently assigned label for the graph.
   * If no label has been assigned, returns `undefined`.
   *
   * @example
   *
   * ```js
   * var g = new Graph();
   * g.graph(); // returns undefined
   * g.setGraph("graph-label");
   *  g.graph(); // returns "graph-label"
   * ```
   */
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  /**
   * Sets a new default value that is assigned to nodes that are created without
   * a label.
   *
   * @param {typeof this._defaultNodeLabelFn | NodeLabel} newDefault - If a function,
   * it is called with the id of the node being created.
   * Otherwise, it is assigned as the label directly.
   * @returns {this}
   */
  setDefaultNodeLabel(newDefault) {
    if (!isFunction(newDefault)) {
      newDefault = constant(newDefault);
    }
    this._defaultNodeLabelFn = newDefault;
    return this;
  }
  /**
   * @returns {number} the number of nodes in the graph.
   */
  nodeCount() {
    return this._nodeCount;
  }
  /**
   * @returns {NodeID[]} the ids of the nodes in the graph.
   *
   * @remarks
   * Use {@link node()} to get the label for each node.
   * Takes `O(|V|)` time.
   */
  nodes() {
    return keys(this._nodes);
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no in-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sources() {
    var self2 = this;
    return filter(this.nodes(), function(v) {
      return isEmpty(self2._in[v]);
    });
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no out-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sinks() {
    var self2 = this;
    return filter(this.nodes(), function(v) {
      return isEmpty(self2._out[v]);
    });
  }
  /**
   * Invokes setNode method for each node in `vs` list.
   *
   * @param {Collection<NodeID | number>} vs - List of node IDs to create/set.
   * @param {NodeLabel} [value] - If set, update all nodes with this value.
   * @returns {this}
   * @remarks Complexity: O(|names|).
   */
  setNodes(vs, value) {
    var args = arguments;
    var self2 = this;
    forEach(vs, function(v) {
      if (args.length > 1) {
        self2.setNode(v, value);
      } else {
        self2.setNode(v);
      }
    });
    return this;
  }
  /**
   * Creates or updates the value for the node `v` in the graph.
   *
   * @param {NodeID | number} v - ID of the node to create/set.
   * @param {NodeLabel} [value] - If supplied, it is set as the value for the node.
   * If not supplied and the node was created by this call then
   * {@link setDefaultNodeLabel} will be used to set the node's value.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  setNode(v, value) {
    if (Object.prototype.hasOwnProperty.call(this._nodes, v)) {
      if (arguments.length > 1) {
        this._nodes[v] = value;
      }
      return this;
    }
    this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
    if (this._isCompound) {
      this._parent[v] = GRAPH_NODE;
      this._children[v] = {};
      this._children[GRAPH_NODE][v] = true;
    }
    this._in[v] = {};
    this._preds[v] = {};
    this._out[v] = {};
    this._sucs[v] = {};
    ++this._nodeCount;
    return this;
  }
  /**
   * Gets the label of node with specified name.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeLabel | undefined} the label assigned to the node with the id `v`
   * if it is in the graph.
   * Otherwise returns `undefined`.
   * @remarks Takes `O(1)` time.
   */
  node(v) {
    return this._nodes[v];
  }
  /**
   * Detects whether graph has a node with specified name or not.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {boolean} Returns `true` the graph has a node with the id.
   * @remarks Takes `O(1)` time.
   */
  hasNode(v) {
    return Object.prototype.hasOwnProperty.call(this._nodes, v);
  }
  /**
   * Remove the node with the id `v` in the graph or do nothing if the node is
   * not in the graph.
   *
   * If the node was removed this function also removes any incident edges.
   *
   * @param {NodeID | number} v - Node ID to remove.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(|E|)` time.
   */
  removeNode(v) {
    if (Object.prototype.hasOwnProperty.call(this._nodes, v)) {
      var removeEdge = /* @__PURE__ */ __name((e) => this.removeEdge(this._edgeObjs[e]), "removeEdge");
      delete this._nodes[v];
      if (this._isCompound) {
        this._removeFromParentsChildList(v);
        delete this._parent[v];
        forEach(this.children(v), (child) => {
          this.setParent(child);
        });
        delete this._children[v];
      }
      forEach(keys(this._in[v]), removeEdge);
      delete this._in[v];
      delete this._preds[v];
      forEach(keys(this._out[v]), removeEdge);
      delete this._out[v];
      delete this._sucs[v];
      --this._nodeCount;
    }
    return this;
  }
  /**
   * Sets the parent for `v` to `parent` if it is defined or removes the parent
   * for `v` if `parent` is undefined.
   *
   * @param {NodeID | number} v - Node ID to set the parent for.
   * @param {NodeID | number} [parent] - Parent node ID. If not defined, removes the parent.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @throws if the graph is not compound.
   * @throws if setting the parent would create a cycle.
   * @remarks Takes `O(1)` time.
   */
  setParent(v, parent) {
    if (!this._isCompound) {
      throw new Error("Cannot set parent in a non-compound graph");
    }
    if (isUndefined(parent)) {
      parent = GRAPH_NODE;
    } else {
      parent += "";
      for (var ancestor = parent; !isUndefined(ancestor); ancestor = this.parent(ancestor)) {
        if (ancestor === v) {
          throw new Error("Setting " + parent + " as parent of " + v + " would create a cycle");
        }
      }
      this.setNode(parent);
    }
    this.setNode(v);
    this._removeFromParentsChildList(v);
    this._parent[v] = parent;
    this._children[parent][v] = true;
    return this;
  }
  /**
   * @private
   * @param {NodeID | number} v - Node ID.
   */
  _removeFromParentsChildList(v) {
    delete this._children[this._parent[v]][v];
  }
  /**
   * Get parent node for node `v`.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID | undefined} the node that is a parent of node `v`
   * or `undefined` if node `v` does not have a parent or is not a member of
   * the graph.
   * Always returns `undefined` for graphs that are not compound.
   * @remarks Takes `O(1)` time.
   */
  parent(v) {
    if (this._isCompound) {
      var parent = this._parent[v];
      if (parent !== GRAPH_NODE) {
        return parent;
      }
    }
  }
  /**
   * Gets list of direct children of node v.
   *
   * @param {NodeID | number} [v] - Node ID. If not specified, gets nodes
   * with no parent (top-level nodes).
   * @returns {NodeID[] | undefined} all nodes that are children of node `v` or
   * `undefined` if node `v` is not in the graph.
   * Always returns `[]` for graphs that are not compound.
   * @remarks Takes `O(|V|)` time.
   */
  children(v) {
    if (isUndefined(v)) {
      v = GRAPH_NODE;
    }
    if (this._isCompound) {
      var children = this._children[v];
      if (children) {
        return keys(children);
      }
    } else if (v === GRAPH_NODE) {
      return this.nodes();
    } else if (this.hasNode(v)) {
      return [];
    }
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are predecessors of the
   * specified node or `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link neighbors} instead.
   * Takes `O(|V|)` time.
   */
  predecessors(v) {
    var predsV = this._preds[v];
    if (predsV) {
      return keys(predsV);
    }
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are successors of the
   * specified node or `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link neighbors} instead.
   * Takes `O(|V|)` time.
   */
  successors(v) {
    var sucsV = this._sucs[v];
    if (sucsV) {
      return keys(sucsV);
    }
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are predecessors or
   * successors of the specified node
   * or `undefined` if node `v` is not in the graph.
   * @remarks Takes `O(|V|)` time.
   */
  neighbors(v) {
    var preds = this.predecessors(v);
    if (preds) {
      return union(preds, this.successors(v));
    }
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {boolean} True if the node is a leaf (has no successors), false otherwise.
   */
  isLeaf(v) {
    var neighbors;
    if (this.isDirected()) {
      neighbors = this.successors(v);
    } else {
      neighbors = this.neighbors(v);
    }
    return neighbors.length === 0;
  }
  /**
     * Creates new graph with nodes filtered via `filter`.
     * Edges incident to rejected node
     * are also removed.
     * 
     * In case of compound graph, if parent is rejected by `filter`,
     * than all its children are rejected too.
  
     * @param {(v: NodeID) => boolean} filter - Function that returns `true` for nodes to keep.
     * @returns {Graph<GraphLabel, NodeLabel, EdgeLabel>} A new graph containing only the nodes for which `filter` returns `true`.
     * @remarks Average-case complexity: O(|E|+|V|).
     */
  filterNodes(filter2) {
    var copy = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    copy.setGraph(this.graph());
    var self2 = this;
    forEach(this._nodes, function(value, v) {
      if (filter2(v)) {
        copy.setNode(v, value);
      }
    });
    forEach(this._edgeObjs, function(e) {
      if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
        copy.setEdge(e, self2.edge(e));
      }
    });
    var parents = {};
    function findParent(v) {
      var parent = self2.parent(v);
      if (parent === void 0 || copy.hasNode(parent)) {
        parents[v] = parent;
        return parent;
      } else if (parent in parents) {
        return parents[parent];
      } else {
        return findParent(parent);
      }
    }
    __name(findParent, "findParent");
    if (this._isCompound) {
      forEach(copy.nodes(), function(v) {
        copy.setParent(v, findParent(v));
      });
    }
    return copy;
  }
  /* === Edge functions ========== */
  /**
   * Sets a new default value that is assigned to edges that are created without
   * a label.
   *
   * @param {typeof this._defaultEdgeLabelFn | EdgeLabel} newDefault - If a function,
   * it is called with the parameters `(v, w, name)`.
   * Otherwise, it is assigned as the label directly.
   * @returns {this}
   */
  setDefaultEdgeLabel(newDefault) {
    if (!isFunction(newDefault)) {
      newDefault = constant(newDefault);
    }
    this._defaultEdgeLabelFn = newDefault;
    return this;
  }
  /**
   * @returns {number} the number of edges in the graph.
   * @remarks Complexity: O(1).
   */
  edgeCount() {
    return this._edgeCount;
  }
  /**
   * Gets edges of the graph.
   *
   * @returns {EdgeObj[]} the {@link EdgeObj} for each edge in the graph.
   *
   * @remarks
   * In case of compound graph subgraphs are not considered.
   * Use {@link edge()} to get the label for each edge.
   * Takes `O(|E|)` time.
   */
  edges() {
    return values(this._edgeObjs);
  }
  /**
   * Establish an edges path over the nodes in nodes list.
   *
   * If some edge is already exists, it will update its label, otherwise it will
   * create an edge between pair of nodes with label provided or default label
   * if no label provided.
   *
   * @param {Collection<NodeID>} vs - List of node IDs to create edges between.
   * @param {EdgeLabel} [value] - If set, update all edges with this value.
   * @returns {this}
   * @remarks Complexity: O(|nodes|).
   */
  setPath(vs, value) {
    var self2 = this;
    var args = arguments;
    reduce(vs, function(v, w) {
      if (args.length > 1) {
        self2.setEdge(v, w, value);
      } else {
        self2.setEdge(v, w);
      }
      return w;
    });
    return this;
  }
  /**
   * Creates or updates the label for the edge (`v`, `w`) with the optionally
   * supplied `name`.
   *
   * @overload
   * @param {EdgeObj} arg0 - Edge object.
   * @param {EdgeLabel} [value] - If supplied, it is set as the label for the edge.
   * If not supplied and the edge was created by this call then
   * {@link setDefaultEdgeLabel} will be used to assign the edge's label.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  /**
   * Creates or updates the label for the edge (`v`, `w`) with the optionally
   * supplied `name`.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID. Number values will be coerced to strings.
   * @param {NodeID | number} w - Target node ID. Number values will be coerced to strings.
   * @param {EdgeLabel} [value] - If supplied, it is set as the label for the edge.
   * If not supplied and the edge was created by this call then
   * {@link setDefaultEdgeLabel} will be used to assign the edge's label.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  setEdge() {
    var v, w, name, value;
    var valueSpecified = false;
    var arg0 = arguments[0];
    if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
      v = arg0.v;
      w = arg0.w;
      name = arg0.name;
      if (arguments.length === 2) {
        value = arguments[1];
        valueSpecified = true;
      }
    } else {
      v = arg0;
      w = arguments[1];
      name = arguments[3];
      if (arguments.length > 2) {
        value = arguments[2];
        valueSpecified = true;
      }
    }
    v = "" + v;
    w = "" + w;
    if (!isUndefined(name)) {
      name = "" + name;
    }
    var e = edgeArgsToId(this._isDirected, v, w, name);
    if (Object.prototype.hasOwnProperty.call(this._edgeLabels, e)) {
      if (valueSpecified) {
        this._edgeLabels[e] = value;
      }
      return this;
    }
    if (!isUndefined(name) && !this._isMultigraph) {
      throw new Error("Cannot set a named edge when isMultigraph = false");
    }
    this.setNode(v);
    this.setNode(w);
    this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);
    var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
    v = edgeObj.v;
    w = edgeObj.w;
    Object.freeze(edgeObj);
    this._edgeObjs[e] = edgeObj;
    incrementOrInitEntry(this._preds[w], v);
    incrementOrInitEntry(this._sucs[v], w);
    this._in[w][e] = edgeObj;
    this._out[v][e] = edgeObj;
    this._edgeCount++;
    return this;
  }
  /**
   * Gets the label for the specified edge.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {EdgeLabel | undefined} the label for the edge (`v`, `w`) if the
   * graph has an edge between `v` and `w` with the optional `name`.
   * Returned `undefined` if there is no such edge in the graph.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  /**
   * Gets the label for the specified edge.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {EdgeLabel | undefined} the label for the edge (`v`, `w`) if the
   * graph has an edge between `v` and `w` with the optional `name`.
   * Returned `undefined` if there is no such edge in the graph.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  edge(v, w, name) {
    var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
    return this._edgeLabels[e];
  }
  /**
   * Detects whether the graph contains specified edge or not.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {boolean} `true` if the graph has an edge between `v` and `w`
   * with the optional `name`.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  /**
   * Detects whether the graph contains specified edge or not.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {boolean} `true` if the graph has an edge between `v` and `w`
   * with the optional `name`.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  hasEdge(v, w, name) {
    var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
    return Object.prototype.hasOwnProperty.call(this._edgeLabels, e);
  }
  /**
   * Removes the edge (`v`, `w`) if the graph has an edge between `v` and `w`
   * with the optional `name`. If not this function does nothing.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {this}
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  /**
   * Removes the edge (`v`, `w`) if the graph has an edge between `v` and `w`
   * with the optional `name`. If not this function does nothing.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {this}
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  removeEdge(v, w, name) {
    var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
    var edge = this._edgeObjs[e];
    if (edge) {
      v = edge.v;
      w = edge.w;
      delete this._edgeLabels[e];
      delete this._edgeObjs[e];
      decrementOrRemoveEntry(this._preds[w], v);
      decrementOrRemoveEntry(this._sucs[v], w);
      delete this._in[w][e];
      delete this._out[v][e];
      this._edgeCount--;
    }
    return this;
  }
  /**
   * @param {NodeID | number} v - Target node ID.
   * @param {NodeID | number} [u] - Optionally filters edges down to just those
   * coming from node `u`.
   * @returns {EdgeObj[] | undefined} all edges that point to the node `v`.
   * Returns `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link nodeEdges} instead.
   * Takes `O(|E|)` time.
   */
  inEdges(v, u) {
    var inV = this._in[v];
    if (inV) {
      var edges = values(inV);
      if (!u) {
        return edges;
      }
      return filter(edges, function(edge) {
        return edge.v === u;
      });
    }
  }
  /**
   * @param {NodeID | number} v - Target node ID.
   * @param {NodeID | number} [w] - Optionally filters edges down to just those
   * that point to `w`.
   * @returns {EdgeObj[] | undefined} all edges that point to the node `v`.
   * Returns `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link nodeEdges} instead.
   * Takes `O(|E|)` time.
   */
  outEdges(v, w) {
    var outV = this._out[v];
    if (outV) {
      var edges = values(outV);
      if (!w) {
        return edges;
      }
      return filter(edges, function(edge) {
        return edge.w === w;
      });
    }
  }
  /**
   * @param {NodeID | number} v - Target Node ID.
   * @param {NodeID | number} [w] - If set, filters those edges down to just
   * those between nodes `v` and `w` regardless of direction
   * @returns {EdgeObj[] | undefined} all edges to or from node `v` regardless
   * of direction. Returns `undefined` if node `v` is not in the graph.
   * @remarks Takes `O(|E|)` time.
   */
  nodeEdges(v, w) {
    var inEdges = this.inEdges(v, w);
    if (inEdges) {
      return inEdges.concat(this.outEdges(v, w));
    }
  }
}
Graph.prototype._nodeCount = 0;
Graph.prototype._edgeCount = 0;
function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}
__name(incrementOrInitEntry, "incrementOrInitEntry");
function decrementOrRemoveEntry(map, k) {
  if (!--map[k]) {
    delete map[k];
  }
}
__name(decrementOrRemoveEntry, "decrementOrRemoveEntry");
function edgeArgsToId(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}
__name(edgeArgsToId, "edgeArgsToId");
function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = "" + v_;
  var w = "" + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj = { v, w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}
__name(edgeArgsToObj, "edgeArgsToObj");
function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
__name(edgeObjToId, "edgeObjToId");
export {
  isArguments as A,
  isFunction as B,
  baseFor as C,
  baseIteratee as D,
  keys as E,
  baseFindIndex as F,
  Graph as G,
  baseEach as H,
  arrayMap as I,
  castFunction as J,
  baseForOwn as K,
  hasPath as L,
  identity as M,
  castPath as N,
  toKey as O,
  baseGet as P,
  hasIn as Q,
  toString as R,
  Symbol$1 as S,
  forEach as T,
  Uint8Array2 as U,
  constant as V,
  isUndefined as W,
  filter as X,
  values as Y,
  reduce as Z,
  isObject as a,
  isArrayLike as b,
  isIndex as c,
  defineProperty as d,
  eq as e,
  baseRest as f,
  isPrototype as g,
  arrayLikeKeys as h,
  isSymbol as i,
  baseFlatten as j,
  overArg as k,
  isObjectLike as l,
  baseGetTag as m,
  getTag as n,
  overRest as o,
  baseUnary as p,
  nodeUtil as q,
  root as r,
  setToString as s,
  isBuffer as t,
  Stack as u,
  arrayEach as v,
  isArray as w,
  getAllKeys as x,
  isTypedArray as y,
  isArrayLikeObject as z
};
