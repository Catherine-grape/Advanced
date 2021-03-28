/*
 * 检测公有和私有的属性
 *   + 检测是否为私有属性：Object.prototype.hasOwnProperty
 *   + in 检测当前对象是否有这个属性「私有或者公有」: 原理是检测私有属性中是否有，没有的话，按照原型链一级级的向上查找，直到Object.prototype为止，只要能找到结果就是true...
 * 
 * 面试题：检测一个属性是否是对象的公有属性
 *   思路一：是它的一个属性，但是还不是私有的属性，则一定是公有的属性「不完善：如果私有和公有上都有这个属性，结果就是不准确的」
 *   思路二：跳过私有的查找，直接到对象的原型链上去查找，一直找到Object.prototype为止，某一个原型对象上有这个属性，结果就是true
 */
/* Object.prototype.hasPubProperty = function hasPubProperty(attr) {
    // this -> obj
    let self = this;
    return (attr in self) && !self.hasOwnProperty(attr);
}; */

// Object.getPrototypeOf(obj):获取当前对象的原型链「其所属类的原型对象」，类似于obj.__proto__「__proto__在IE浏览器中被保护起来了，不允许我们直接操作」
/* Object.prototype.hasPubProperty = function hasPubProperty(attr) {
    let self = this,
        proto = Object.getPrototypeOf(self);
    while (proto) {
        if (proto.hasOwnProperty(attr)) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false;
};

let obj = {
    name: 'zhufeng',
    age: 12,
    toString() {}
};
console.log(obj.hasPubProperty('name')); //false
console.log(obj.hasPubProperty('toString')); //true */

// console.log(obj.hasOwnProperty('name')); //true
// console.log(obj.hasOwnProperty('toString')); //false

// console.log('name' in obj); //true
// console.log('toString' in obj); //true

// 扩展的小知识点：遍历对象，我们使用for in循环，但是for in循环有很多问题
//  @1 性能比较差的「for in在迭代的时候，除了迭代所有的私有属性，其原型上的公有属性也会被迭代 -> 前提：能够被迭代的属性都应该是可枚举的属性{粗略认为，内置属性一般是不可枚举的，自定义的属性是可枚举的}」  => 所以使用for in循环的时候，我们需要手动的去除对公有属性的迭代
//  @2 优先迭代所有的数字属性名「从小到大」，其次才是迭代非数字的，与自己编写的属性顺序不完全一致；不能迭代Symbol类型的私有属性；
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
    let self = this,
        proto = Object.getPrototypeOf(self);
    while (proto) {
        if (proto.hasOwnProperty(attr)) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false;
};

/* // Object.keys(obj):获取obj对象所有非Symbol且可枚举的私有属性「数组」
// Object.getOwnPropertyNames(obj):获取obj对象所有非Symbol的私有属性「数组」
// Object.getOwnPropertySymbols(obj):获取obj对象所有Symbol类型的私有属性「数组」
let obj = {
    name: 'zhufeng',
    age: 12,
    [Symbol('AA')]: 100,
    10: 10,
    0: 0
};
let keys = Object.keys(obj);
if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    console.log(key, obj[key]);
}
// keys.forEach(key => {
//     console.log(key, obj[key]);
// }); */

// 能不用for in就不用「可以用 for/for of...」，即使用了，“if (!obj.hasOwnProperty(key)) break;” 这个判断操作一定要处理!!!
/* for (let key in obj) {
    if (!obj.hasOwnProperty(key)) break;
    console.log(key);
} */
/* let arr = new Array(9999999).fill(0);
console.time('AA');
for (let i = 0; i < arr.length; i++) {}
console.timeEnd('AA'); //AA: 10.7978515625 ms
console.time('BB');
for (let key in arr) {}
console.timeEnd('BB'); //BB: 3271.56201171875 ms */