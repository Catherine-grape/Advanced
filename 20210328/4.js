/* class Modal {
    // 构造函数体：this.xxx=xxx 给实例设置的私有属性
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /!* // 这样处理也是给实例设置的私有属性
    z = 10;
    say = () => {} *!/

    // 向类的原型对象上扩充方法
    //   @1 语法上必须这样写，无法扩充公有属性
    //   @2 所有扩充的方法是没有prototype的
    //   @3 并且这些方法是实例对象不可枚举的属性「ES5中，基于“类.prototype”设置的公有方法是可枚举的」
    getX() {
        console.log(this.x);
    }
    getY() {
        console.log(this.y);
    }

    // 把其当做对象，设置静态的私有属性和方法
    static n = 200;
    static setNumber(n) {
        this.n = n;
    }
}
Modal.prototype.z = 10;

let m = new Modal(10, 20);
// Modal(10, 20); //Uncaught TypeError: Class constructor Modal cannot be invoked without 'new'，不允许当做普通函数执行，只能new执行 */


/* // **** ES5语法中创建构造函数「核心在执行时是否加new来决定」 ****
// 构造函数体
function Modal(x, y) {
    this.x = x;
    this.y = y;
}
// 原型对象上扩展的供其实例调取使用的公共属性方法  m.z/getX/getY...
Modal.prototype.z = 10;
Modal.prototype.getX = function () {
    console.log(this.x);
}
Modal.prototype.getY = function () {
    console.log(this.y);
}
// 把函数当做一个对象，给其设置的静态私有属性方法「和实例没啥关系」 Modal.n/setNumber...
Modal.n = 200;
Modal.setNumber = function (n) {
    this.n = n;
};
let m = new Modal(10, 20); */