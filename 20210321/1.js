/*
 * let & const & var
 *   1.变量提升  var存在变量提升 & let不存在变量提升「但是两者在词法解析阶段都进行过分析」
 *   2.重复声明  在相同的上下文中，var可以重复声明一个变量 & 但是let不允许重复声明「不论之前基于何种方式，只要在当前当前上下文中声明过这个变量，那么则不能再基于let/const重复声明了」
 *   3.和全局GO的关系  全局上下文中，基于let声明的变量存储到VO(G)中，而基于var声明的变量，存储到GO中
 *   4.块级上下文  除函数和对象的{}外，如果{}中出现 let/const/function 则会产生块级上下文，块级私有上下文和var没有任何的关系「var不会产生块级上下文，也不会受块级上下文的影响」
 *   5.暂时性死区
 *   ......
 */

/* 
// 不行？
// 事件绑定也是异步的
// i也是全局的
let box = document.querySelector('.box'),
    buttons = box.querySelectorAll('button');
let i = 0;
for (; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        console.log(`索引是:${i}`);
    };
} 
*/

// 解决方案3：事件委托
let box = document.querySelector('.box');
box.onclick = function (ev) {
    let target = ev.target;
    if (target.tagName === 'BUTTON') {
        // 点击的是BOX盒子中的按钮
        console.log(`当前点击按钮的索引是:${target.getAttribute('data-index')}`);
    }
};

/* // 解决方案2：自定义属性
// buttons是一个节点集合NodeList，集合中的每一项是一个元素对象「对象/堆内存：内置的属性和方法」
let box = document.querySelector('.box'),
    buttons = box.querySelectorAll('button');
let i = 0;
for (; i < buttons.length; i++) {
    // 每一轮循环的时候，我们把当前这一轮的索引，基于自定义属性myIndex，存储到元素对象的堆内存中
    buttons[i].myIndex = i;
    buttons[i].onclick = function () {
        // this:当前点击的这个元素对象
        console.log(`索引是:${this.myIndex}`);
    };
} */

// 解决方案1：闭包
/* for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
        console.log(`索引是:${i}`);
    };
} */

/* let i = 0;
for (; i < buttons.length; i++) {
    (function (i) {
        buttons[i].onclick = function () {
            console.log(`索引是:${i}`);
        };
    })(i);
} */

/* let i = 0;
for (; i < buttons.length; i++) {
    buttons[i].onclick = (function (i) {
        return function () {
            console.log(`索引是:${i}`);
        };
    })(i);
} */

/* let i = 0;
for (; i < buttons.length; i++) {
    let fn = function (i) {
        console.log(`索引是:${i}`);
    };
    buttons[i].onclick = fn.bind(null, i);
} */

/* buttons.forEach(function (item, index) {
    // 回调函数被执行五次「闭包」
    // item:当前迭代的按钮
    // index:当前迭代的按钮的索引
    item.onclick = function () {
        console.log(`索引是:${index}`);
    };
}); */


//==========================
/* var n = 10;
let m = 20; 
{
    // 块级私有上下文  m是私有变量  n是全局的
    var n = 30;
    let m = 40;
    console.log(n,m); //30 40
}
console.log(n,m); //30 20 */


/* 
// 为啥?
// @1 循环中的i都是全局上下文中的
// @2 定时器是异步的「第一轮循环设置一个定时器，不需要等待定时器触发执行，继续下一轮循环...」
// @3 循环结束了「全局的i->5」，设置了五个定时器，然后到时间后，再分别把五个定时器触发执行
// @4 定时中设置的回调函数执行，形成私有上下文，遇到的i不是自己的私有变量，是全局的，而此时全局的i是5
for (var i = 0; i < 5; i++) {
    // 循环五次设置五个定时器
    setTimeout(function () {
        console.log(i); // 5 5 5 5 5
    }, 0);
} 
*/

// 咋解决？ -> 闭包「let & 自己写闭包 & 第三个参数」
/* 
for (let i = 0; i < 5; i++) {
    // @1 每一轮循环产生一个私有的块级上下文「每一个块级上下文中的函数被全局中的setTimeout占用 -> “不被释放|闭包”」
    // @2 每一个块中都有一个私有变量 i,存储的是每一轮循环i的值 0 1 2 3 4
    let timer = setTimeout(function () {
        console.log(i); // 0 1 2 3 4
        // 清除使用过的定时器，这样把每一个块级上下文中，创建的函数以及其引用移除掉，让浏览器空闲的时候，回收这些不被释放的内存
        clearTimeout(timer);
        timer = null;
    }, 0);
} 
*/

/* 
let i = 0;
for (; i < 5; i++) {
    // 自己在每一轮循环构建私有上下文「闭包」
    (function (i) {
        // i私有变量「形参」0 1 2 3 4 
        setTimeout(function () {
            console.log(i);
        }, 0);
    })(i); //把每一轮循环时候i的值，作为实参传递给私有上下文中的i
} 
*/

/* 
let i = 0;
for (; i < 5; i++) {
    // setTimeout(function (i) {
    //     console.log(i);
    // }, 0, i);
    // 定时器第三个参数，是传递给定时器设定回调函数的形参的值「定时器内部其实也是按照闭包的机制处理的：把每一次传递的值，预先存储起来，后期定时器触发执行，再从之前存储的值中拿出来用即可」
    let fn = function (i) {
        console.log(i);
    };
    setTimeout(fn.bind(null, i), 0);
} 
*/


//==========================
// let新语法规范 VS var老语法规范
// 代码执行之前的第一件事情：词法分析 -> AST词法解析树
/*
 * EC(G)
 *   VO(G)
 *      m -> 20
 *   GO(window)
 *      n -> 10
 *   变量提升:var n;
 */
// console.log(n); // undefined
// console.log(m); // Uncaught ReferenceError: Cannot access 'm' before initialization
// var n = 10;
// let m = 20;
// console.log(n, m); //先找VO(G)，没有再找GO   10/20
// console.log(window.n, window.m); //直接GO中查找  10/undefined

// // Uncaught SyntaxError: Identifier 'n' has already been declared  在所有代码没有执行之前，就会报错「词法解析阶段就已经分析出有语法错误：重复声明了」
// console.log(n);
// var n = 10;
// var n = 20;
// let n = 30;

// 浏览器暂时有一个BUG{暂时性死区}：基于typeof检测一个未被声明的变量，不会报错，结果是“undefined”
// console.log(n); // Uncaught ReferenceError: n is not defined
// console.log(typeof n); // "undefined"

// 基于let/const可以消除这个暂时性死去问题
// console.log(typeof n); //Uncaught ReferenceError: Cannot access 'n' before initialization
// let n = 10;

//==========================
// let VS const
//   变量:可变的量，其实就是一个名字，用来关联一个值「指针指向」，而且关联的值是可以改变的
//   常量:不可变的量，其实就是一个值
// let n = 10;
// n = 20;

// const m = 10;
// m = 20; //Uncaught TypeError: Assignment to constant variable 基于const声明的变量是不允许指针重新指向

// const m; //Uncaught SyntaxError: Missing initializer in const declaration
// m = 10;

// const m = { //m -> 0x000
//     name: 'zhufeng'
// };
// m.name = 'peixun'; //这样操作是可以的