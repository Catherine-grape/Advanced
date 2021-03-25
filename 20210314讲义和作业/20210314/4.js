/*
 * 在ES6中，除了全局上下文和函数执行的私有上下文，还多了一种上下文机制：“块级私有上下文「作用域」” 
 *   在除函数/对象等之外的大括号中「例如：判断体、循环体...」，如果出现“let/const/function”这些关键词，那么当前大括号所处的代码块，就会产生一个私有的块级上下文；在此块级上下文中，基于let/const/function声明的变量都是私有变量；特殊性：function会在块级上下文和其上级上下文中都会被声明处理，基于var关键字声明的变量，即不会产生块级上下文，也不会受到块级上下文的影响...
 */
/* console.log(c, d); //undefined undefined
{
    console.log(d); //函数
    let a = 10;
    const b = 20;
    var c = 30;

    function d() {}
    d = 100;
    console.log(a, b, c, d); //10 20 30{全局} 100
}
console.log(c, d); //30 函数
console.log(a, b); //报错  */


// 这样处理 i 都是全局的
/* let i = 0;
for (; i < 5; i++) {
    // ...
    // console.log(i);
}
console.log(i); //5 */

for (let i = 0; i < 5; i++) {
    
}
// console.log(i); //Uncaught ReferenceError: i is not defined