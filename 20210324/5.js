/*
 * jQuery部分源码分析
 *   @1 整体架子「环境区分 & 全局暴露」
 *   @2 冲突处理 noConflict
 */
(function (global, factory) {
    // global:window OR global(模块)
    // factory:回调函数
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        // 支持CommonJS模块规范{node || webpack}
        // global.document成立说明global是window，因为window.document是存在的；如果是node环境，global存储的是global，global对象没有document这个属性的；
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        // 浏览器(webview)
        factory(global);
    }
})(
    // 浏览器(webview)或者webpack环境下是window，node环境下运行是global(或者模块)
    typeof window !== "undefined" ? window : this,
    // 回调函数
    function (window, noGlobal) {
        // 如果是浏览器(webview)环境下运行JS，window===window && noGlobal===undefined
        // 如果是webpack环境下编译JS，window===window && noGlobal=true
        // ...
        var version = "3.6.0",
            jQuery = function (selector, context) {
                // return new jQuery.fn.init(selector, context);
            };

        // 多库共存，全局暴露名字冲突后的解决方案
        var _jQuery = window.jQuery,
            _$ = window.$;
        jQuery.noConflict = function (deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }
            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }
            return jQuery;
        };

        // 暴露API
        if (typeof noGlobal === "undefined") {
            window.jQuery = window.$ = jQuery;
        }
        return jQuery;
    }
);