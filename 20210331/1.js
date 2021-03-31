/* 
Array.prototype.push = function push(item) {
    // this -> arr
    // 向末尾新增一项
    this[this.length] = item;
    // 对于数组来讲，新增一项后，它的length也会自动的累加“数组结构特点”
    this.length++;
    return this.length;
};
let arr = [10, 20, 30];
// console.log(arr.push(40)); 
*/

/* // 正常情况下，只有数组才能使用push方法（数组才是Array类的实例），其余的像类数组、普通对象等是无法调取这个方法的（基于__proto__招找不到Array.prototype.push）;
let obj = {
    2: 3, //1
    3: 4, //2
    length: 2, //4
    // 把需要借用的方法当做值赋值给对象的私有属性push，后期基于obj.push()其实就是调用Array.prototype.push方法执行「真实项目中，我们也会基于这种简单粗暴的模式，实现“某个实例借用其它类原型上的某些方法”」
    push: Array.prototype.push
};
obj.push(1);
// this:obj  item:1  ->  obj[2] = 1;  obj.length++;
obj.push(2);
// this:obj  item:2  ->  obj[3] = 2;  obj.length++;
console.log(obj); */

//============
/* 
// 模拟一下数组的浅克隆
Array.prototype.slice = function slice() {
    // this -> arr
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(this[i]);
    }
    return result;
};
let arr = [10, 20, 30];
console.log(arr.slice()); 
*/
let utils = (function () {
    /* function toArray(...params) {
        return params;
    } */
    function toArray() {
        // arguments获取的实参集合是类数组集合 arguments.__proto__===Object.prototype
        // 需求：把类数组集合变为数组集合?
        // @1 return [...arguments];
        // @2 return Array.from(arguments);
        // ----
        // @3 自己写循环
        // let result = [];
        // for (let i = 0; i < arguments.length; i++) {
        //     result.push(arguments[i]);
        // }
        // return result;
        // ----
        // @4 基于对比发现，只要能够让slice方法执行，并且让方法中的this变为要操作的类数组集合arguments，就相当于自己写了个循环，把arguments类数组集合中的每一项，赋值给了一个新数组“类数组->数组”「方法借用」
        // arguments.slice = Array.prototype.slice;
        // return arguments.slice();

        // [].slice()
        // Array.prototype.slice()
        return [].slice.call(arguments);
    }

    return {
        toArray
    };
})();
let ary = utils.toArray(10, 20, 30); //=>[10,20,30]
console.log(ary);
ary = utils.toArray('A', 10, 20, 30); //=>['A',10,20,30]
console.log(ary);