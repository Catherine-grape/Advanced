/*
 * 进阶应用之“单例设计模式”
 *   模块化编程发展历史:JavaScript本身是弱化命名空间概念的，只有全局作用域和函数的私有作用域（ES6中新增块作用域），而模块化开发，从某种意义上来说，是强化了命名空间的概念
 *    + 有利于代码分离、解耦以及复用
 *    + 团队并行开发
 *    + 避免命名冲突
 *    + 相互引用，按需加载
 *    -----
 *    @1 单例设计模式
 *    @2 AMD require.js 
 *    @3 CommonJS Node.js「基于JS编写后台程序」
 *    @4 CMD sea.js  把CommonJS规范搬到浏览器端
 *    @5 ES6Module
 *    
 *    webpack：支持CommonJS/ES6Module规范，基于webpack编译后，会把CommonJS/ES6Module进行处理，处理后的结果浏览器也是可以支持的「浏览器预览的结果是基于webpack编译的」
 */
// CommonJS：Node自带的模块化管理规范「浏览器端是不支持的」

//=====================
// AMD：即可以实现模块化开发，也能有效解决模块之间的依赖问题
// define创建一个模块 AModule
/* define([
    // 设定此模块需要依赖的其它模块
    'BModule'
], function (require, factory) {
    'use strict';
    // ... 模块中私有的内容

    return {
        // 供其他模块调用的内容「暴露API」
    };
}); */

//=====================
// 每一个对象都是一个单独的内存空间，我们把描述同一件事物的属性和方法存储到这个空间中：避免全局变量污染，而且也可以实现相互之间的引用 => 最简单的“单例设计模式”「设计模式就是一种思想，用来解决某一类问题：单例设计模式解决的问题是，每一个模块和每个模块之间相互独立，避免全局变量的污染，而且还可以相互调用」
// @1 每一个对象都是Object这个类的一个单独实例
// @2 每一个对象都是一个堆内存空间，存储自己的私有键值对「私有化」
// @3 person1/person2 除了被称为对象名，也可以称为“命名空间 nameSpace”
// @4 我们后期可以基于命名空间，访问到指定空间中的内容「相互引用」
/* let person1 = {
    name: '李浩浩',
    age: 62,
    fn() {}
};

let person2 = {
    name: '张娟',
    age: 18,
    handle() {
        person1.fn();
    }
}; */

/* // 真实项目中的应用：闭包+单例=高级单例设计模式
let AModule = (function () {
    let name = '李浩浩';
    let age = 62;
    const fn = function fn() {};
    const sum = function sum() {};

    // 基于RETURN的方式，把当前模块中需要供其他模块调用的内容暴露出去
    return {
        sum
    };
})();

let BModule = (function () {
    let name = '张娟';
    let age = 18;
    const fn = function fn() {};
    AModule.sum();

    return {
        name,
        fn
    };
})(); */

/* 
// 基于闭包的方式，保证了私有性「想实现相互之间的调用，则可以基于window.xxx把其暴露到全局上{局限性：不适合向全局暴露太多内容，暴露内容多了也可能会导致冲突}」
(function () {
    let name = '李浩浩';
    let age = 62;
    const fn = function fn() {};
    window.fn = fn;
})();

(function () {
    let name = '张娟';
    let age = 18;
    fn();
})(); 
*/