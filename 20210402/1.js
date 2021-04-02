/*
 * 箭头函数 VS 普通函数
 *   1.语法区别
 *   2.THIS区别：箭头函数没有自己的THIS
 *   3.原型区别：箭头函数没有prototype属性，不能被new执行 
 *   4.箭头函数中没有arguments实参集合
 *   ......
 */
/* let obj = {
    name: 'obj',
    fn: function () {
        // this -> obj
        /!* let self = this;
        setTimeout(function () {
            // this -> window
            self.name = 'zhufeng';
        }, 1000); *!/

        setTimeout(() => {
            this.name = 'zhufeng';
            console.log(this);
        }, 1000);
    }
};
obj.fn(); */

/* 
 * Function.prototype
 *    call
 *    apply  都是能够把函数立即执行的，在执行的时候，改变函数中的THIS指向；区别在于传递实参的方式不一样：call是一个个传递实参，apply需要把实参放在一个数组中传递给函数...
 *    ---
 *    bind  不是立即把函数执行，而是预先处理函数中的THIS指向和参数的
 * 都是用来强制改变函数中的THIS指向的
 */
window.name = 'window';
const fn = function fn(x, y, ev) {
    console.log(this.name, x + y, ev);
    return '@zhufeng';
};
let obj = {
    name: 'obj'
};

// submit.onclick = fn; // 事件绑定的时候fn并没有执行，点击submit的时候，触发了click事件行为，fn才会执行: this->submit，并且浏览器会默认给fn传递一个实参“事件对象 MouseEvent...”
// submit.onclick = fn.call(obj, 10, 20); // 这样不行，还不等按钮点击，fn就立即执行了「call的特点就是把函数立即执行」

/* submit.onclick = function anonymous(ev) {
    // 思路：先把anonymous绑定给submit.onclick，这样点击按钮的时候，先执行的是anonymous「ev是事件对象，anonymous中的this是submit」；我们在anonymous执行的时候，再把fn执行，完成this和相关参数的处理即可
    fn.call(obj, 10, 20, ev);
}; */
Function.prototype.bind = function bind(context, ...params) {
    // this:fn  context:obj  params:[10,20]
    let self = this;
    return function anonymous(...args) {
        // args:[ev]
        params = params.concat(args);
        return self.call(context, ...params);
    };
};
submit.onclick = fn.bind(obj, 10, 20);

//======================
// obj.fn(10, 20); // "obj" & 30  事实：Uncaught TypeError: obj.fn is not a function
// 简述：把fn执行，让其THIS指向OBJ，并且给fn函数传递10/20，最后接收函数执行的返回值
// 详细：首先fn基于__proto__找到Function.prototype.call方法，并且把call方法执行；执行call方法传递了三个实参，第一个实参context{obj}存储为了fn函数中this指向的值，其余参数都是未来给fn执行传递的实参params；在call方法内部做了很多事情：把fn执行，让其this指向context{obj}，并且给fn函数传递params[10/20]，最后接收fn执行的返回值...
/* Function.prototype.call = function call(context, ...params) {
    if (context == null) context = window;
    if (!/^(object|function)$/i.test(typeof context)) context = Object(context);
    let key = Symbol('KEY'),
        result;
    context[key] = this;
    result = context[key](...params);
    delete context[key];
    return result;
}; */
// let res = fn.call(obj, 10, 20); // fn.apply(obj,[10,20])  apply的性能略低于call
// console.log(res);