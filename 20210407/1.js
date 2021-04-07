/*
 * 进程 & 线程 
 *   进程：一般是一个运行的程序「例如：浏览器打开一个页面，就是开辟一个进程」
 *   线程：进程中具体干事的东西，如果一个进程中我们同时做多个事情，需要开辟多个线程「进程包含线程」
 * 
 * 浏览器是多线程的
 *   GUI渲染线程：渲染页面「加载和识别HTML/CSS这些代码的，到最后可以渲染出对应的页面」
 *   JS引擎线程：渲染解析JS代码的
 *   事件触发线程：设置了一个事件绑定，事件触发线程监听DOM的操作，控制事件是否触发，绑定的方法是否执行
 *   定时触发器线程：设置一个定时器，我们有一个线程去监听，到时间后执行对应的方法
 *   异步HTTP请求线程：页面中从服务器请求资源文件信息或者基于Ajax从服务器获取数据，都是这个线程处理的
 *   ......
 * 
 * JS是单线程的：因为浏览器只分配一个线程去渲染解析JS代码
 *   渲染JS代码的时候，上一个任务/代码没有处理完，下一个任务是不能去执行的，同时只能做一件事「同步编程」
 *   JS代码中，也有一些操作是异步编程的：“单线程异步编程”
 *     + EventQueue 事件队列：等待执行的任务
 *     + WebAPI  监听区域：监听哪些任务可以去执行了
 *     + EventLoop 事件循环机制
 * 
 * JS中的那些操作是异步编程的
 *   @1 宏任务
 *     setTimeout/setInterval 定时器
 *     事件绑定/队列      
 *     XMLHttpRequest(ajax/axios)/Fetch 数据通信   
 *     MessageChannel
 *     setImmediate「Node」    
 *     ...
 * 
 *   @2 微任务
 *     requestAnimationFrame「有争议」
 *     Promise.then/catch/finally
 *     async/await
 *     queueMicrotask  基于这个方法可以创建一个异步的微任务(ES6 兼容性比较差)
 *     MutationObserver 监听DOM的改变
 *     IntersectionObserver 监听元素与当前视口交叉信息「图片延迟加载基于这个可以实现」
 *     process.nextTick「Node」
 *     ...
 */

/* let i = 10;
while (i > 1) {
    // ...
    // 死循环：这个任务永远结束不了，那么其他的JS代码永远也不会被执行了
}
console.log(i); */


/* setTimeout(() => {
    console.log(1);
}, 20);
console.log(2);
setTimeout(() => {
    console.log(3);
}, 10);
console.log(4);
// console.time('AA');
for (let i = 0; i < 90000000; i++) {}
// console.timeEnd('AA'); //=>AA: 79ms 左右
console.log(5);
setTimeout(() => {
    console.log(6);
}, 8);
console.log(7);
setTimeout(() => {
    console.log(8);
}, 15);
console.log(9); */

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function () {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});
console.log('script end');


/* // let p = new Promise([execute function])
//   + 立即把[execute function]这个函数执行
//   + p是Promise实例
//     [[PromiseState]]:pending / resolved{fulfilled} / rejected
//     [[PromiseResult]]:undefined
let p1 = new Promise((resolve, reject) => {
    // 修改状态和值是立即处理的，而且一但状态改变了，则不能再改变
    resolve(10); //[[PromiseState]]:resolved{fulfilled}    [[PromiseResult]]:10
    reject(0); //[[PromiseState]]:rejected    [[PromiseResult]]:0
});
// 当我们执行then的时候，传递onfulfilled、onrejected方法
//   @1 如果此时已经知道p1的状态，会把对应的函数执行「不是立即执行，而是创建异步的微任务 {先放在WebAPI中，但是此时已经知道是可以执行的，所以紧接着就挪至到EventQueue中}」
p1.then(function onfulfilled() {

}, function onrejected() {

}); */

/* let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // 后期执行resolve的时候：
        //    立即改变状态和结果
        //    然后再通知对应的事件池以及其中的方法执行「异步的微任务：先放置到WebAPI中，但是也知道是可以执行的，随后直接挪至到EventQueue中」
        resolve(10);
    }, 1000);
});
//@1 如果此时不知道p1的状态，会把onfulfilled、onrejected存储到对应的事件池中
p1.then(function onfulfilled(result) {
    console.log(`成功：${result}`);
}, function onrejected(reason) {
    console.log(`失败：${reason}`);
});
p1.then(function onfulfilled(result) {
    console.log(`成功：${result}`);
}, function onrejected(reason) {
    console.log(`失败：${reason}`);
}); */

/* Promise.resolve(10)
    // 每一次THEN都会返回一个新的PROMISE实例「AA」
    //   @1 onfulfilled/onrejected执行是否抱错，如果不报错，AA是成功的
    //   @2 如果方法执行返回的是一个全新的PROMISE实例「BB」，那BB最后的状态，直接决定AA的状态
    .then(function onfulfilled(result) {
        console.log(`成功：${result}`);
        return Promise.reject(0);
    }, function onrejected(reason) {
        console.log(`失败：${reason}`);
    })
    .then(function onfulfilled(result) {
        console.log(`成功：${result}`);
    }, function onrejected(reason) {
        console.log(`失败：${reason}`);
    }); */

/* const fn = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('OK');
        }, 1000);
    });
};
(async function () {
    let n = 10;
    await 100; //=> await Promise.resolve(100)  创建一个异步任务 WebAPI「如果await后面是成功的promises实例，则执行当前上下文中await下面的代码」；因为当前案例，我们知道await后面是成功的，所以直接挪至到EventQueue中等着执行即可；

    let m = 20;
    await fn(); //=>先把fn立即执行，返回一个promise实例{CC}「此时还不知道状态」  创造一个异步的任务WebAPI，只有当CC是成功的，我们才能确定下面代码执行，此时再挪至到EventQueue中，等待异步微任务执行

    console.log(n + m);
})(); */