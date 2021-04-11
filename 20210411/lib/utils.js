(function () {
    let class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,
        fnToString = hasOwn.toString,
        ObjectFunctionString = fnToString.call(Object),
        getProto = Object.getPrototypeOf;

    // 检测是否为函数
    const isFunction = function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" &&
            typeof obj.item !== "function";
    };

    // 检测是否为WINDOW
    const isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // 检测数据类型
    const toType = function toType(obj) {
        if (obj == null) return obj + "";
        let type = typeof obj;
        if (/(object|function)/i.test(type)) {
            type = toString.call(obj);
            let [, $1 = "object"] = type.match(/^\[object (\w+)\]$/) || [];
            return $1.toLowerCase();
        }
        return type;
    };

    // 检测是否为一个纯粹的对象
    const isPlainObject = function isPlainObject(obj) {
        let proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") return false;
        proto = getProto(obj);
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    // 检测是否为空对象
    const isEmptyObject = function isEmptyObject(obj) {
        if (!obj || !/(object|function)/i.test(typeof obj)) return false;
        let keys = Object.keys(obj);
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
        return keys.length === 0;
    };

    // 检测是否为有效数字
    const isNumeric = function isNumeric(obj) {
        let type = toType(obj);
        return (type === "number" || type === "string") && !isNaN(obj);
    };

    // 检测是否为数组或者类数组
    const isArrayLike = function isArrayLike(obj) {
        let length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };

    // 函数防抖处理
    const debounce = function debounce(func, wait, immediate) {
        if (typeof func !== "function") throw new TypeError('func must be an function');
        if (typeof wait === "boolean") {
            immediate = wait;
            wait = 300;
        }
        if (typeof wait !== "number") wait = 300;
        if (typeof immediate !== "boolean") immediate = false;
        let timer;
        return function proxy(...params) {
            let runNow = !timer && immediate,
                self = this,
                result;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (!immediate) result = func.call(self, ...params);
            }, wait);
            if (runNow) result = func.call(self, ...params);
            return result;
        };
    };

    // 函数节流处理 
    const throttle = function throttle(func, wait) {
        if (typeof func !== "function") throw new TypeError('func must be an function');
        if (typeof wait !== "number") wait = 300;
        let timer,
            previous = 0;
        return function proxy(...params) {
            let now = +new Date(),
                remaining = wait - (now - previous),
                self = this,
                result;
            if (remaining <= 0) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                result = func.call(self, ...params);
                previous = now;
            } else if (!timer) {
                timer = setTimeout(() => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    result = func.call(self, ...params);
                    previous = +new Date();
                }, remaining);
            }
            return result;
        };
    };

    // 迭代数组/类数组/对象
    const each = function each(obj, callback) {
        if (obj == null || typeof obj !== "object") throw new TypeError('obj must be an array/like-array/object');
        if (typeof callback !== "function") callback = function () {};
        if (isArrayLike(obj)) {
            let i = 0,
                length = obj.length,
                item;
            for (; i < length; i++) {
                item = obj[i];
                if (callback.call(item, item, i) === false) break;
            }
        } else {
            let keys = Object.keys(obj),
                i = 0,
                length = keys.length,
                key,
                item;
            if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
            for (; i < length; i++) {
                key = keys[i];
                item = obj[key];
                if (callback.call(item, item, key) === false) break;
            }
        }
        return obj;
    };

    // 实现数组/纯粹对象的深浅合并
    const merge = function merge() {
        let options,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            treated = arguments[length - 1];
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (Array.isArray(treated) && treated.treated) {
            length--;
        } else {
            treated = [];
            treated.treated = true;
        }
        if (typeof target !== "object" && !isFunction(target)) target = {};
        for (; i < length; i++) {
            options = arguments[i];
            if (options == null) continue;
            if (treated.includes(options)) return options;
            treated.push(options);
            each(options, function (copy, name) {
                let copyIsArray = Array.isArray(copy),
                    copyIsObject = isPlainObject(copy),
                    clone = target[name];
                if (deep && copy && (copyIsArray || copyIsObject)) {
                    if (copyIsArray && !Array.isArray(clone)) clone = [];
                    if (copyIsObject && !isPlainObject(clone)) clone = {};
                    target[name] = merge(deep, clone, copy, treated);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            });
        }
        return target;
    };

    // 实现数组/对象的深浅克隆
    const clone = function clone() {
        let target = arguments[0],
            deep = false,
            type,
            isArray,
            isObject,
            result,
            Ctor,
            treated = arguments[arguments.length - 1];
        !Array.isArray(treated) || !treated.treated ? (treated = [], treated.treated = true) : null;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1];
        }
        if (treated.indexOf(target) > -1) return target;
        treated.push(target);
        type = toType(target);
        isArray = Array.isArray(target);
        isObject = isPlainObject(target);
        if (target == null) return target;
        Ctor = target.constructor;
        if (/^(regexp|date)$/i.test(type)) return new Ctor(target);
        if (/^(error)$/i.test(type)) return new Ctor(target.message);
        if (/^(function|generatorfunction)$/i.test(type)) {
            return function proxy() {
                var args = Array.from(arguments);
                return target.apply(this, args);
            };
        }
        if (!isArray && !isObject) return target;
        result = new Ctor();
        each(target, function (copy, name) {
            if (deep) {
                result[name] = clone(deep, copy, treated);
                return;
            }
            result[name] = copy;
        });
        return result;
    };

    /* 暴露API */
    let utils = {
        toType,
        isFunction,
        isWindow,
        isPlainObject,
        isEmptyObject,
        isNumeric,
        isArrayLike,
        debounce,
        throttle,
        each,
        merge,
        clone
    };
    let _$ = window.$;
    utils.noConflict = function noConflict() {
        if (window.$ === utils) window.$ = _$;
        return utils;
    };
    if (typeof window !== "undefined") window.utils = window.$ = utils;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
})();