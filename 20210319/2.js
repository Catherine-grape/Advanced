/*
 * THIS 函数执行的主体,和函数在哪定义以及在哪执行都没有关系
 *   @1 给元素的某一个事件行为绑定方法，当事件行为触发方法执行，方法中的this是当前元素本身
 *      box.onclick=function(){};
 *      box.addEventListener('click',function(){});
 *      ----排除
 *      box.attachEvent('onclick',function(){ this是window })
 *   @2 方法执行，看方法前面是否有“点”，有“点”，“点”前面是谁this就是谁，没有“点”，this是window「严格模式下是undefined」；大部分情况下，匿名函数（尤其是回调函数）执行，this都是window/undefined；
 */
/* (function () {
    "use strict";
    console.log(this);
})(); */

/* setTimeout(function () {
    console.log(this); //window
}, 1000); */

/* [10].forEach(function () {
    console.log(this); //第二个参数不传，就是window，传递的的第二个参数，forEach内部做了特殊的处理，会让回调函数中的this变为第二个参数值
}, 'zhufeng'); */
/* 
let obj = {
    // 在给obj.fn赋值的时候，先把自执行函数执行的返回结果赋值给属性
    // obj.fn=0x000
    fn: (function () {
        // this->window
        return function () { //=>0x000
            console.log(this);
        }
    })()
};
obj.fn(); //->this:obj
let fn = obj.fn;
fn(); //->this:window */

/* var fullName = 'language';
var obj = {
    fullName: 'javascript',
    prop: {
        getFullName: function () {
            return this.fullName;
        }
    }
};
console.log(obj.prop.getFullName());
// this->obj.prop
// obj.prop.fullName => undefined
var test = obj.prop.getFullName;
console.log(test());
// this->window
// window.fullName => 'language' */

/* var name = 'window';
var Tom = {
    name: "Tom",
    show: function () {
        // this->window
        console.log(this.name);
    },
    wait: function () {
        // this->Tom
        var fun = this.show;
        fun();
    }
};
Tom.wait(); */

/* window.val = 1;
var json = {
    val: 10,
    dbl: function () {
        this.val *= 2;
    }
}
json.dbl();
// this->json
// json.val = json.val * 2;  => json.val=20
var dbl = json.dbl;
dbl();
// this->window
// window.val = window.val * 2;  => window.val=2
json.dbl.call(window);
// this被强制改变为window
// window.val = window.val * 2;  => window.val=4
alert(window.val + json.val); //=>"24" */

/* (function () {
    // this->window
    var val = 1;
    var json = {
        val: 10,
        dbl: function () {
            // this->json
            val *= 2; //val = val * 2  让私有变量val=2
        }
    };
    json.dbl();
    alert(json.val + val); //=>"12"
})(); */

var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);
var fn = obj.fn;
fn(5);
obj.fn(10);
console.log(num, obj.num);