var i = 0;

function A() {
    var i = 10;

    function x() {
        console.log(i);
    }
    return x;
}
var y = A();
y();

function B() {
    var i = 20;
    y();
}
B();

/*
 * 内存释放(优化)
 *  「堆内存」
 *     看当前堆内存地址是否被其他事物（变量/事件绑定）所占用，如果被占用就不能释放「因为一但释放，以后别的东西基于这个地址就找不到堆了」，如果没有被占用，则可以释放...
 *     手动释放：变量 = null
 *  「栈内存：执行上下文」
 *     全局上下文，只有在页面关闭的时候才会释放
 *     函数执行形成的私有上下文，一般情况下，在函数代码执行完毕后，私有上下文会自动出栈释放；但是有一些特殊的情况是无法出栈释放的“情况：当前上下文中的某些内容，被上下文以外的事物占用了，则不能出栈释放”
 */

// // obj = 0x001
// let obj = {};
// obj = null;


let x = 5;

function fn(x) {
    return function (y) {
        console.log(y + (++x));
    }
}
let f = fn(6);
f(7);
fn(8)(9);
f(10);
console.log(x);

/* let i = 1;
console.log(5 + (i++));
// 先运算 5 + i => 6
// 再累加 i++ => i=2

i = 1;
console.log(5 + (++i));
// 先累加 ++i => i=2
// 再运算 5+i => 7 */

/* 
// 变量提升：func=0x000
func();
function func(){
    // ...
}
func(); 
*/

/* 
// 函数表达式「推荐」
const func = function () {
    // ...
};
func(); 
*/