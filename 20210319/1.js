/* var a = 9;
function fn() {
    a = 0;
    return function (b) {
        return b + a++;
    }
}
var f = fn();
console.log(f(5));
console.log(fn()(5));
console.log(f(5));
console.log(a); */

/* var x = 5,
    y = 6;
function func() {
    x += y;
    func = function (y) {
        console.log(y + (--x));
    };
    console.log(x, y);
}
func(4);
func(3);
console.log(x, y); */

// 实名函数/具名函数: 具备名字的
// function func() {}
// class A{}
// 匿名函数：没有名字的
// (function (x) {})(10); //自执行函数
// const fn = function () {}; //函数表达式：把函数作为值，赋值给别的东西「变量、事件、回调函数...」
// document.onclick = function () {};
// setTimeout(function () {}, 1000);
// function xxx() {
//     return function () {};
// }
// [].forEach(function () {});
// const fn = () => {}; //箭头函数也是匿名的

// 递归:函数执行中，调用自己再执行“自己调用自己”
/* let index = 0;
function fn() {
    index++;
    if (index > 5) return;
    fn();
}
fn(); */

/* const fn = () => {
    // ...
    fn();
};
fn(); */

// 在没有外物接收这个函数，并且还需要递归执行的时候，我们如何处理？
/* 
"use strict";
let index = 0;
(function () {
    index++;
    if (index > 5) return;
    console.log(index, this);
    // arguments.callee 当前执行函数的本身
    // arguments.callee.caller 当前函数执行所在的环境（全局下执行是null）
    arguments.callee();
    // 问题:
    // @1 arguments.callee() 再次执行，方法中的this是arguments，之前第一次执行，this是window
    // @2 严格模式下，第一次执行this是undefined；arguments.call在严格模式下无法使用「Uncaught TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them」
})();
*/

// 匿名函数具名化：原本应该是匿名函数，但是现在我们设置了名字
//   和正式的实名函数还是有很大区别的
//   @1 具名化的名字，不允许在所处上下文中使用「不能在外部使用」，因为所处上下文中并不会声明这个变量
//   @2 但是可以在函数内部使用「相当于在函数私有上下文的AO中，声明一个b变量，赋值为当前的函数」
//   @3 并且直接修改这个名字的值是不生效的
//   @4 但是这个名字的值默认是函数本身，这个的优先级比较低，但凡当前函数上下文中，基于let/var/function/const重新声明过这个b，都是以重新声明的为主
/* (function b() {
    b = 20;
    console.log(b); //函数
})();
console.log(b); //Uncaught ReferenceError: b is not defined */

/* (function b() {
    var b = 20;
    console.log(b); //20
})(); */


/* 
//=>套娃的题:不难就是多，自己回去看视频
function fun(n, o) {
    console.log(o);
    return {
        fun: function (m) {
            return fun(m, n);
        }
    };
}
var c = fun(0).fun(1);
c.fun(2);
c.fun(3);
*/