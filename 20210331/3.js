/* function Fn() {
    let a = 1;
    this.a = a;
}
Fn.prototype.say = function () {
    this.a = 2;
}
Fn.prototype = new Fn;
let f1 = new Fn;
Fn.prototype.b = function () {
    this.a = 3;
};
console.log(f1.a);
console.log(f1.prototype);
console.log(f1.b);
console.log(f1.hasOwnProperty('b'));
console.log('b' in f1);
console.log(f1.constructor == Fn); */

//===============
/* function Fn() {
    this.x = 100;
    this.y = 200;
}
// 向默认的原型对象上扩充方法
//    @1 麻烦，每一次都要写Fn.prototype 「ES6中的class不存在这个问题」
//    @2 分散，设置的方法可能会分散开，不方便管理
Fn.prototype.getX = function getX() {};
// ...
Fn.prototype.getY = function getY() {}; */

/* // 重定向后，解决了上述的问题，但是衍生了新的问题：
//    @1 原型对象上没有constuctor了
//    @2 在原本内置原型对象上设置的sum方法，在重定向后也没有了
function Fn() {
    this.x = 100;
    this.y = 200;
}
Fn.prototype.sum = function sum() {};
Fn.prototype = {
    getX() {},
    getY() {}
}; */

/* // 解决：原型对象上没有constuctor了「手动设置一个即可」
// 解决：方法丢失的问题 「原始内置的原型对象和需要重定向的新原型对象合并在一起 Object.assign」
function Fn() {
    this.x = 100;
    this.y = 200;
}
Fn.prototype.sum = function sum() {};
Fn.prototype = Object.assign({}, Fn.prototype, {
    constructor: Fn,
    getX() {},
    getY() {}
});

// Object.assign(A,B) //用B中的内容替换A「B有的，A没有，把B的东西放在A里；B没有的，A有，则不处理；B和A都有的，以B为主...」，重点是最后返回的是A这个对象「堆内存地址」
// Object.assign({},A,B) //最后返回的是一个新的堆内存，和A/B都不是一个地址；先拿A和{}合并，再拿B和{}合并
// Object.assign合并的时候，对于不可枚举的属性是处理不了的 */

// ========
/* function fun() {
    this.a = 0;
    this.b = function () {
        alert(this.a);
    }
}
fun.prototype = {
    b: function () {
        this.a = 20;
        alert(this.a);
    },
    c: function () {
        this.a = 30;
        alert(this.a)
    }
};
var my_fun = new fun();
my_fun.b(); //私有b  this->my_fun  alert(my_fun.a)  “0”
my_fun.c(); //公有c  this->my_fun  my_fun.a = 30{私有a赋值30}  alert(my_fun.a) “30” */