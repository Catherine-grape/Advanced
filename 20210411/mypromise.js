(function () {
    "use strict";

    // 构造函数
    function Promise(execute) {
        var self = this,
            delayTimer = null;
        if (typeof execute !== "function") throw new TypeError('Promise resolver is not a function');
        if (!(self instanceof Promise)) throw new TypeError('undefined is not a promise');

        self.state = 'pending';
        self.value = undefined;
        self.onfulfilledCallbacks = [];
        self.onrejectedCallbacks = [];
        var change = function change(state, value) {
            if (self.state !== "pending") return;
            self.state = state;
            self.value = value;
            delayTimer = setTimeout(function () {
                clearTimeout(delayTimer);
                delayTimer = null;
                var callbacks = state === 'fulfilled' ? self.onfulfilledCallbacks : self.onrejectedCallbacks,
                    i = 0;
                for (; i < callbacks.length; i++) {
                    callbacks[i](self.value);
                }
            });
        };

        try {
            execute(function resolve(result) {
                change('fulfilled', result);
            }, function reject(reason) {
                change('rejected', reason);
            });
        } catch (err) {
            change('rejected', err.message);
        }
    }

    // 原型对象
    function resolvePromise(promise, x, resolve, reject) {
        if (x === promise) throw new TypeError('Chaining cycle detected for promise #<Promise>');
        if (x !== null && /^(object|function)$/i.test(typeof x)) {
            var then;
            try {
                then = x.then;
            } catch (err) {
                reject(err);
            }
            if (typeof then === "function") {
                // x是一个Promise/like-Promise实例
                var called = false;
                try {
                    then.call(
                        x,
                        function onfulfilled(y) {
                            if (called) return;
                            called = true;
                            resolvePromise(promise, y, resolve, reject);
                        },
                        function onrejected(r) {
                            if (called) return;
                            called = true;
                            reject(r);
                        }
                    );
                } catch (err) {
                    if (called) return;
                    reject(err);
                }
                return;
            }
        }
        resolve(x);
    }

    function common(callback, value, promise, resolve, reject) {
        try {
            var x = callback(value);
            resolvePromise(promise, x, resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    Promise.prototype = {
        constructor: Promise,
        then: function then(onfulfilled, onrejected) {
            var self = this,
                promise;
            if (typeof onfulfilled !== "function") {
                onfulfilled = function onfulfilled(result) {
                    return result;
                };
            }
            if (typeof onrejected !== "function") {
                onrejected = function onrejected(reason) {
                    throw reason;
                };
            }
            promise = new Promise(function (resolve, reject) {
                switch (self.state) {
                    case 'fulfilled':
                        setTimeout(function () {
                            common(onfulfilled, self.value, promise, resolve, reject);
                        });
                        break;
                    case 'rejected':
                        setTimeout(function () {
                            common(onrejected, self.value, promise, resolve, reject);
                        });
                        break;
                    default:
                        self.onfulfilledCallbacks.push(function (result) {
                            common(onfulfilled, result, promise, resolve, reject);
                        });
                        self.onrejectedCallbacks.push(function (reason) {
                            common(onrejected, reason, promise, resolve, reject);
                        });
                }
            });
            return promise;
        },
        catch: function mycatch(onrejected) {
            return this.then(null, onrejected);
        }
    };
    if (typeof Symbol !== "undefined") Promise.prototype[Symbol.toStringTag] = 'Promise';

    // 静态属性
    Promise.resolve = function resolve(result) {
        return new Promise(function (resolve) {
            resolve(result);
        });
    };
    Promise.reject = function reject(reason) {
        return new Promise(function (_, reject) {
            reject(reason);
        });
    };

    function isPromise(x) {
        if (x !== null && /^(object|function)$/i.test(typeof x)) {
            if (typeof x.then === "function") {
                return true;
            }
        }
        return false;
    }

    Promise.all = function all(promises) {
        if (!Array.isArray(promises)) throw new TypeError('promises must be an Array');
        var n = 0,
            results = [];
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                (function (i) {
                    var promise = promises[i];
                    if (!isPromise(promise)) promise = Promise.resolve(promise);
                    promise.then(function (result) {
                        n++;
                        results[i] = result;
                        if (n >= promises.length) resolve(results);
                    }).catch(function (reason) {
                        reject(reason);
                    });
                })(i);
            }
        });
    };

    // 测试专用
    Promise.deferred = function deferred() {
        var result = {};
        result.promise = new Promise(function (resolve, reject) {
            result.resolve = resolve;
            result.reject = reject;
        });
        return result;
    };

    /* 暴露PAI */
    if (typeof window !== "undefined") window.Promise = Promise;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();