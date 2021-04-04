let class2type = {},
    toString = class2type.toString, //Object.prototype.toString
    hasOwn = class2type.hasOwnProperty, //Object.prototype.hasOwnProperty
    fnToString = hasOwn.toString, //Function.prototype.toString
    ObjectFunctionString = fnToString.call(Object), //"function Object() { [native code] }"
    getProto = Object.getPrototypeOf;

// 检测是否为函数数据类型的值
const isFunction = function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number" &&
        typeof obj.item !== "function";
};

// 检测是否为window对象
const isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
};

// 检测数据类型的统一处理方法
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

// 检测是否为一个纯粹的对象「obj.__proto__===Object.prototype || Object.create(null)」
const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") return false;
    proto = getProto(obj);
    if (!proto) return true;
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
};

// 检测当前对象是否是空对象
const isEmptyObject = function isEmptyObject(obj) {
    if (!obj || !/(object|function)/i.test(typeof obj)) return false;
    let keys = Object.keys(obj);
    if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
    return keys.length === 0;
};

// 检测是否为一个有效数字「支持原始值{数字&字符串}&&构造函数创造的Number实例」
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