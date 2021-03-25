/*
 * 真正的编程应从堆栈内存分析开始
 *   堆 Heap
 *   栈 Stack
 *   -------都是从电脑内存条中分配出来的内存「优化手段：内存优化处理“内存回收/垃圾回收机制 GC”」
 *   上下文 EC「Execution Context」
 *   全局对象 GO
 *   变量对象 VO
 */

/* var a = 12;
var b = a;
b = 13;
console.log(a); */

/* var a = {
    n: 12
};
var b = a;
b['n'] = 13;
console.log(a.n);

var a = {
    n: 12
};
var b = a;
b = {
    n: 13
};
console.log(a.n); */


// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
var a = {
    n: 1
};
var b = a;
a.x = a = {
    n: 2
};
console.log(a.x);
console.log(b);

// a.x 成员访问 优先级最高
/* // 正常从右到左
a = b = 12;
// 创建12 
// b->12
// a->12 */

/* a.x = a = 12;
// 创建12
// a.x -> 12
// a -> 12 */