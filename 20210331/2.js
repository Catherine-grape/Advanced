/* var a = ?;
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

// 歪思路
//   var a;  全局上下文   => window.a=xxx  「但凡是let/const声明的，就没有这个线索了」
//   ==比较而不是===「严格比较、绝对相等」  => ==比较两边类型如果不一致可以转换数据类型
//   a==1  获取a的值，和1进行比较  ...  a的值要分别获取三次
//   ...

// Q2 利用数据类型转换  对象->数字
/* var a = {
    i: 0,
    // Symbol.toPrimitive / valueOf / toString
    [Symbol.toPrimitive]() {
        // this -> a
        return ++this.i;
    }
};
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

/* var a = [1, 2, 3];
a.toString = a.shift;
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
} */

// Q1 每一次获取a的时候，可以让其分别等于1/2/3即可  ->  Object.defineProperty {getter/setter}
/* var i = 0;
Object.defineProperty(window, 'a', {
    get() {
        return ++i;
    }
});
if (a == 1 && a == 2 && a == 3) {
    console.log('条件成立');
} */