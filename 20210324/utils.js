(function () {
    /*
     * 函数防抖处理
     */
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

    /*
     * 函数节流处理 
     */
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

    // 利用闭包的保护作用，把自己写的方法写在私有上下文中，防止全局变量污染
    let utils = {
        debounce,
        throttle
    };

    // 多库共存
    let _$ = window.$;
    utils.noConflict = function noConflict() {
        if (window.$ === utils) {
            window.$ = _$;
        }
        return utils;
    };

    // 暴露API「支持：浏览器直接导入、webpack环境编译、Node环境执行」
    if (typeof window !== "undefined") {
        window.utils = window.$ = utils;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = utils;
    }
})();