// 自己按照规范实现的Iterator，支持迭代所有的数组/类数组集合
/* 
class Iterator {
    constructor(assemble) {
        let self = this;
        self.assemble = assemble;
        self.index = 0;
    }
    next() {
        let self = this,
            assemble = self.assemble;
        if (self.index > assemble.length - 1) {
            return {
                done: true,
                value: undefined
            };
        }
        return {
            done: false,
            value: assemble[self.index++]
        };
    }
}
let itor = new Iterator([10, 20, 30, 40]);
console.log(itor.next());
console.log(itor.next());
console.log(itor.next());
console.log(itor.next());
console.log(itor.next()); 
*/

// 虽然浏览器没有内置的Iterator类，但是它给很多数据结构，都提供了迭代的接口方法 Symbol.iterator
//   + 数组结构、部分类数组「arguments/NodeList/HTMLCollection」、字符串、Set/Map、generator object...
// Object.prototype上是不具备 Symbol.iterator
// 具备这个接口的数据结构，就可以基于 “for of” 进行循环迭代了
/* Array.prototype[Symbol.iterator] = function () {
    let assemble = this,
        index = 0;
    return {
        next() {
            if (index > assemble.length - 1) {
                return {
                    done: true,
                    value: undefined
                };
            }
            return {
                done: false,
                value: assemble[index++]
            };
        }
    };
}; */
/*
 * let itor = arr[Symbol.iterator]; 
 *    itor.next()
 *    itor.next()
 *    ...
 * FOR OF遍历的时候，先调用“对象[Symbol.iterator]”，获取一个迭代器实例“itor”
 * 每一轮循环，都是 itor.next() 执行，并且把返回对象中的value值拿到「所以FOR OR迭代的是数据结构中的值」
 * 当返回对象中 done:true 的时候，则结束循环
 */
// let arr = [10, 20, 30];
// for (let value of arr) {
//     console.log(value);
// }

//===================
// 面试题：FOR OF是否可以迭代普通的对象？「不可以，因为不具备Symbol.iterator迭代器接口规范」
// 如果想让它可以迭代普通对象，我们应该咋做？
/* 
Object.prototype[Symbol.iterator] = function values() {
    let assemble = this,
        keys = Object.keys(assemble).concat(Object.getOwnPropertySymbols(assemble)),
        index = 0;
    return {
        next() {
            if (index > keys.length - 1) {
                return {
                    done: true,
                    value: undefined
                };
            }
            let key = keys[index++];
            return {
                done: false,
                value: assemble[key]
            };
        }
    };
};
let obj = {
    name: 'zhufeng',
    age: 12,
    0: 100,
    1: 200
};
for (let value of obj) {
    console.log(value);
} 
*/

//======
// 真实项目中，我们更多期望的是 类数组普通对象 能够使用FOR OF迭代即可
let obj = {
    0: 10,
    1: 20,
    2: 30,
    3: 40,
    length: 4
};
obj[Symbol.iterator] = Array.prototype[Symbol.iterator];
for (let value of obj) {
    console.log(value);
}
/* 
if (typeof Symbol === "function") {
    jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
}
*/