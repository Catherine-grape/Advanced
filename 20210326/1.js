/*
 * 什么是面向对象「OOP」 
 *   + 对象、类、实例
 *   + JS本身就是基于面向对象研发出来的编程语言「内置类」
 * 构造函数执行 VS 普通函数执行
 * prototype & __proto__
 */
// 平时开发的时候，JS内置类不能满足我们需求，而我们也想按照面向对象的伟大思想，构建一个自定义类，并且创建类的很多实例「好处：实例和实例之间既可以有独立的私有属性方法，也可以拥有类赋予他们的公共属性方法」
// 创造自定义类：构造函数设计模式  “内置类/自定义类都是函数数据类型的值”
/* function Fn(x, y) {
    let sum = 10;
    this.total = x + y;
    this.say = function () {
        console.log(`我计算的和是:${this.total}`);
    };
}
// let res = Fn(10, 20); //普通函数执行
let f1 = new Fn(10, 20); //构造函数执行
let f2 = new Fn;
console.log(f1.sum); //undefined  sum只是上下文中的私有变量，只有this.xxx=xxx才是给实例设置的私有属性
console.log(f1.total); //30
console.log(f1.say === f2.say); //false */

/* function Fn(x, y) {
    this.total = x + y;
    return {
        name: 'xxx'
    };
}
let f = new Fn(10, 20);
console.log(f); //->{name:'xxx'} 不再是Fn这个类的实例对象了 */
 

/* 
面向对象是一种非常方便的、强大的，用来构建和管理整个知识体系的思想
  具象化OOP
    + 类
    + 实例 
    @1 每个实例都有自己私有的属性和方法「私有化」
    @2 每个实例也都具备类赋予他们的公共的属性和方法「公有化」

JS语言本身就是基于类和实例构建和组成的 =>内置类
  数据类型所属的类
     Number  每一个number类型的值都是这个类的一个实例
     String
     Boolean
     Symbol
     BigInt
     Object 每一个对象都是Object类的实例
        + Object
        + Array
        + RegExp
        + Date
        + Error
        + Function
     .....

  DOM元素/集合所属的类 
     #box元素对象 -> HTMLDivElement
                -> HTMLParagraphElement  -> HTMLElement -> Element -> Node -> EventTarget -> Object
                -> ...
     document文档对象 -> HTMLDocument -> Document -> Node ...
     节点集合 -> NodeList -> Object
     ...

     每一个元素标签对象基本都有自己所属的类
  ...
*/