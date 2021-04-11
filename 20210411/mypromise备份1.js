(function () {
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
        // promise：每一次THEN要返回的新的Promise实例
        // x：onfulfilled/onrejected返回的结果
        // resolve/reject：他两个执行，可以决定promise是成功还是失败
        if (x === promise) throw new TypeError('Chaining cycle detected for promise #<Promise>');
        if (x !== null && /^(object|function)$/i.test(typeof x)) {
            var then;
            try {
                then = x.then;
            } catch (err) {
                reject(err);
            }
            if (typeof then === "function") {
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

    function common(callback, isTimeout, value, promise, resolve, reject) {
        var run = function run() {
            try {
                var x = callback(value);
                resolvePromise(promise, x, resolve, reject);
            } catch (err) {
                reject(err);
            }
        };
        if (isTimeout) {
            var delayTimer = setTimeout(function () {
                clearTimeout(delayTimer);
                delayTimer = null;
                run();
            });
            return;
        }
        run();
    }

    Promise.prototype = {
        constructor: Promise,
        then: function then(onfulfilled, onrejected) {
            var self = this,
                promise;
            // promise是返回的新的实例，执行resolve/reject控制他的状态和结果；但是具体执行哪一个方法，由onfulfilled/onrejected执行决定{是否报错、是否返回新的Promise实例...}
            promise = new Promise(function (resolve, reject) {
                switch (self.state) {
                    case 'fulfilled':
                        common(onfulfilled, true, self.value, promise, resolve, reject);
                        break;
                    case 'rejected':
                        common(onrejected, true, self.value, promise, resolve, reject);
                        break;
                    default:
                        // 向集合中存储的是一个匿名函数，后期执行change方法，先把匿名函数执行，而在匿名函数执行的时候，我们再执行onfulfilled{监听是否报错以及返回值}
                        self.onfulfilledCallbacks.push(function (result) {
                            common(onfulfilled, false, result, promise, resolve, reject);
                        });
                        self.onrejectedCallbacks.push(function (reason) {
                            common(onrejected, false, reason, promise, resolve, reject);
                        });
                }
            });
            return promise;
        },
        catch: function mycatch() {}
    };
    if (typeof Symbol !== "undefined") Promise.prototype[Symbol.toStringTag] = 'Promise';

    // 静态属性
    Promise.resolve = function resolve() {};
    Promise.reject = function reject() {};
    Promise.all = function all() {};

    /* 暴露PAI */
    // if (typeof window !== "undefined") window.Promise = Promise;
    // if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();


let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('OK');
        // reject('NO');
    }, 1000);
});
// 每一次执行THEN都会返回一个新的Promise实例“p2”，“p2”的状态和结果：
//   + 由p1.then传入的 onfulfilled/onrejected 两个方法执行决定
//   + @1 不论哪个方法执行，如果没有返回新的Promise实例，直接看方法执行是否报错，如果没有报错，则“p2”是成功的，return的值是“p2”的结果
//   + @2 有返回一个新的Promise实例“AA”，则“AA”的状态和结果直接影响了“p2”的结果
let p2 = p1.then(result => {
    console.log(`成功：${result}`);
    return new Promise(resolve => {
        resolve(100);
    });
}, reason => {
    console.log(`失败：${reason}`);
    return 0;
});

p2.then(result => {
    console.log(`成功：${result}`);
}, reason => {
    console.log(`失败：${reason}`);
});