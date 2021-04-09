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
    Promise.prototype = {
        constructor: Promise,
        then: function then(onfulfilled, onrejected) {
            var self = this,
                delayTimer = null;
            switch (self.state) {
                case 'fulfilled':
                    delayTimer = setTimeout(function () {
                        clearTimeout(delayTimer);
                        delayTimer = null;
                        onfulfilled(self.value);
                    });
                    break;
                case 'rejected':
                    delayTimer = setTimeout(function () {
                        clearTimeout(delayTimer);
                        delayTimer = null;
                        onrejected(self.value);
                    });
                    break;
                default:
                    self.onfulfilledCallbacks.push(onfulfilled);
                    self.onrejectedCallbacks.push(onrejected);
            }
        },
        catch: function mycatch() {}
    };
    if (typeof Symbol !== "undefined") Promise.prototype[Symbol.toStringTag] = 'Promise';

    // 静态属性
    Promise.resolve = function resolve() {};
    Promise.reject = function reject() {};
    Promise.all = function all() {};

    /* 暴露PAI */
    if (typeof window !== "undefined") window.Promise = Promise;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();



let p1 = new Promise((resolve, reject) => {
    // console.log(a);
    // resolve(100);
    // reject(0);
    console.log(1);
    setTimeout(() => {
        resolve(100);
        console.log(4);
    }, 1000);
});
console.log(2);
p1.then(result => {
    console.log(`成功：${result}`);
}, reason => {
    console.log(`失败：${reason}`);
});
p1.then(result => {
    console.log(`成功：${result}`);
}, reason => {
    console.log(`失败：${reason}`);
});
console.log(3);



/*
 * 每一个promise实例具备：
 *    state:pending/fulfilled(resolved)/rejected 
 *    value:值
 * 
 * execute function
 *    + 传递的如果不是函数：Uncaught TypeError: Promise resolver ？ is not a function
 *    + 立即把函数执行
 *    + 形参：resolve/reject 两个函数「立即修改promise实例的state/value」
 *    + 函数执行报错，则实例是失败态，并且结果是报错的原因
 * 
 * 不允许不使用new来执行，必须 new Promise
 */
/* let p1 = new Promise((resolve, reject) => {
    // console.log(a);
    setTimeout(() => {
        resolve(10);
        reject();
    }, 1000);
});
// 执行THEN的时候，如果知道了实例状态，直接执行「不是立即的，也是一个异步微任务」对应的方法
// 此时还不知道实例的状态，则先把方法存储取来，等到后期知道状态的时候「resolve/reject执行」，再通知之前存储的方法执行即可「异步微任务」
p1.then(result => {}, reason => {});
p1.then(result => {}, reason => {}); */