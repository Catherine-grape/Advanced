(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function factory(window, noGlobal) {

    var version = "3.6.0",
        jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context);
        };
    jQuery.fn = jQuery.prototype = {
        jquery: version,
        constructor: jQuery,
        length: 0,
    };

    // ----------
    var rootjQuery = jQuery(document),
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
        init = jQuery.fn.init = function init(selector, context, root) {
            var match, elem;

            // $(""/null/undefined/false...) 返回一个空的JQ实例对象
            if (!selector) return this;

            // selector支持三种不同的类型：字符串、原生DOM对象{浏览器内置方法获取的DOM元素对象}、函数...
            root = root || rootjQuery;
            if (typeof selector === "string") {
                if (selector[0] === "<" &&
                    selector[selector.length - 1] === ">" &&
                    selector.length >= 3) {
                    // 传递的是HTML字符串：创建一个DOM元素对象「JQ实例对象」
                    match = [null, selector, null];
                } else {
                    // 传递选择器字符串：获取DOM元素对象「JQ实例对象」
                    match = rquickExpr.exec(selector);
                }
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        jQuery.merge(this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ));
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                if (isFunction(this[match])) {
                                    this[match](context[match]);
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }
                        return this;
                    } else {
                        elem = document.getElementById(match[2]);
                        if (elem) {
                            this[0] = elem;
                            this.length = 1;
                        }
                        return this;
                    }
                } else if (!context || context.jquery) {
                    return (context || root).find(selector);
                } else {
                    return this.constructor(context).find(selector);
                }
            } else if (selector.nodeType) {
                // 原生DOM对象：把DOM元素对象变为JQ对象「类数组集合」
                this[0] = selector;
                this.length = 1;
                return this;
            } else if (isFunction(selector)) {
                // 传递的是函数：$(document).ready(function(){}) === $(function(){})
                //   + 等待页面DOM结构加载完成触发执行回调函数
                //   + document.addEventListener('DOMContentLoaded', function () {})
                //   思考？ window.onload=function(){} 所有资源都加载完才会触发执行
                return root.ready !== undefined ?
                    root.ready(selector) :
                    selector(jQuery);
            }

            // 处理HTMLCollection/NodeList等DOM元素集合的
            return jQuery.makeArray(selector, this);
        };
    init.prototype = jQuery.fn;

    // ----------
    jQuery.makeArray = function makeArray(arr, results) {
        var ret = results || [];
        if (arr != null) {
            if (isArrayLike(Object(arr))) {
                jQuery.merge(ret,
                    typeof arr === "string" ? [arr] : arr
                );
            } else {
                push.call(ret, arr);
            }
        }
        return ret;
    };

    // 合并两个集合{把第二个集合放在第一个集合的末尾，返回第一个集合}「数组集合&类数组集合」
    jQuery.merge = function (first, second) {
        var len = +second.length,
            j = 0,
            i = first.length;
        for (; j < len; j++) {
            first[i++] = second[j];
        }
        first.length = i;
        return first;
    };

    // ----------
    jQuery.each = function (obj, callback) {
        var length, i = 0;
        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }
        return obj;
    };

    //-----------
    // @1 向 $.fn/$ 扩展方法  $.fn.extend(obj) OR $.extend(obj)
    //    其实就是合并 把obj和$.fn/$对象合并   类似于 $.extend($/$.fn,obj)   “JQ插件”
    // @2 实现两个及多个对象的合并「支持深度比较合并」
    //    $.extend(obj1,obj2,obj3,...)  返回的是obj1   类似于Object.assign
    //    $.extend(true,obj1,obj2,obj3,...) 深度合并
    jQuery.extend = jQuery.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !isFunction(target)) target = {};
        // deep 是布尔类型的值「深浅合并的切换」 target 第一个传递进来的要合并的对象

        // 是想要向$/$.fn上扩充方法  target:jQuery对象或者jQuery.fn原型对象
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {

                // Extend the base object
                for (name in options) {
                    copy = options[name];

                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if (name === "__proto__" || target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {
                        src = target[name];

                        // Ensure proper type for the source value
                        if (copyIsArray && !Array.isArray(src)) {
                            clone = [];
                        } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                            clone = {};
                        } else {
                            clone = src;
                        }
                        copyIsArray = false;

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };

    // ----------
    if (typeof noGlobal === "undefined") {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
});

/* 
 // jQuery===$

 // 把jQuery当做一个普通函数 $([selector]) JQ选择器:返回的结果是一个JQ类的实例对象，所以也称为“JQ对象”  
 let $box = $('.box');

 // 把jQuery当做一个普通对象，使用其静态的私有属性方法
 $.ajax({
     url:'/api',
     ...
 });
*/


/* 
// 工厂设计模式：把一个构造函数当做普通函数执行，最后还可以获取到当前构造函数的实例
function Fn() {
    return new init();
}
Fn.prototype = {
    constructor: Fn
};
const init = function init() {
    this.xxx='xxx';
};
init.prototype = Fn.prototype;
Fn(); 
*/

/* 
// 生成器函数本身具备这个特点：当做普通函数执行，返回一个迭代器对象itor，并且 itor.__proto__===fn.prototype
function* fn() {}
fn.prototype = {
    constructor: fn,
    name: 'fn'
};
let itor = fn();
console.log(itor); 
*/