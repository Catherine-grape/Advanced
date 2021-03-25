/*
 * 数组是特殊对象「对象：由零到多组键值对组成的」
 *    特殊：对象的键(属性名)不能是一个对象类型 ，如果是对象，会默认转换为字符串（toString）作为属性名
 *    以数字作为索引{属性名}，逐级递增，内置length属性，存储数组长度
 * 
 * Set/Map ? 自己回去扩展ES6新增的数据结构
 */
/* let obj = {
    // [{name: 'xxx'}]: 10
    // -> "[object Object]":10
    [Symbol(0)]: 100
}; */
/* let a={name:'zhufeng'};
let b={name:'zhouxiaotian'};
let obj={
    [a]:10
};
obj[b]=20;
// {"[object Object]": 20} */

// let arr1 = [10, 20, 30, 40];


/*
 * 栈结构
 *   特点：后进先出 或者 先进后出
 *   @1 新进栈的内容在栈的顶端，这样会把之前进栈的压缩到栈的底部 
 *   @2 出栈也是需要从顶端开始出，上面的不出去，下面的也出不去
 */
class Stack {
    container = [];
    enter(element) {
        // 进栈
        this.container.unshift(element);
    }
    leave() {
        // 出栈
        return this.container.shift();
    }
    size() {
        // 查看大小
        return this.container.length;
    }
    value() {
        // 获取栈的内容 slice实现浅克隆，目的是保证外部接受到的内容，在进行操作的时候，不会直接影响container
        return this.container.slice(0);
    }
}
// let sk1 = new Stack; //每一次new创建一个新的栈结构「新的容器」
// let sk2 = new Stack;

// 面试题：十进制转二进制
//   + 十进制  正常JS中使用的数字类型就是10进制「包含:0-9」
//   + 二进制  包含：0/1
// [Number].toString([radix])  [radix]默认值是10
/* let num = 45;
console.log(num.toString()); //->'45' 十进制字符串
console.log(num.toString(2)); //->'101101' 二进制字符串 */

function decimal2binary(decimal) {
    if (decimal === 0) return 0;
    let negative = decimal < 0;
    decimal = Math.abs(decimal);
    let merchant = Math.floor(decimal / 2),
        remainder = decimal % 2,
        sk = new Stack;
    sk.enter(remainder);
    while (merchant > 0) {
        remainder = merchant % 2;
        sk.enter(remainder);
        merchant = Math.floor(merchant / 2);
    }
    return `${negative?'-':''}${sk.value().join('')}`;
}
let num = 45;
console.log(decimal2binary(num));