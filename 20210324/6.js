/*
 * 函数 防抖debounce & 节流throttle  
 *   频繁的频率自己来设定
 *   防抖:在用户频繁触发某个行为的时候，我们只识别一次即可「开始边界：第一次点击触发  结束边界：等到最后一次触发」
 *   节流:在频繁操作的时候，我们能降低触发的频率
 */

// 模拟从服务器获取数据{需要1000MS}
let submit = document.querySelector('#submit');
const queryData = callback => {
    setTimeout(function () {
        callback('OK');
    }, 1000);
};
const handle = function handle(ev) {
    queryData(result => {
        console.log(result, ev, this);
    });
};
const handle2 = function handle2(ev) {
    console.log('OK');
};

/*
 * 函数防抖处理
 *  @params
 *    func:最终要执行的函数「必传」
 *    wait:频繁操作的设定时间「默认300MS」
 *    immediate:设置边界「默认false:结束边界触发  true:开始边界触发」
 */
const debounce = function debounce(func, wait, immediate) {
    if (typeof func !== "function") throw new TypeError('func must be an function');
    if (typeof wait === "boolean") {
        immediate = wait;
        wait = 300;
    }
    if (typeof wait !== "number") wait = 300;
    if (typeof immediate !== "boolean") immediate = false;
    let timer;
    return function proxy(...params) {
        let runNow = !timer && immediate,
            self = this,
            result;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            // 结束边界触发
            if (!immediate) result = func.call(self, ...params);
        }, wait);
        // 开始边界触发
        if (runNow) result = func.call(self, ...params);
        return result;
    };
};

/*
 * 函数节流处理 
 *  @params
 *    func:最终要执行的函数「必传」
 *    wait:设定的触发频率「默认300MS」
 */
const throttle = function throttle(func, wait) {
    if (typeof func !== "function") throw new TypeError('func must be an function');
    if (typeof wait !== "number") wait = 300;
    let timer,
        previous = 0;
    return function proxy(...params) {
        let now = +new Date(),
            remaining = wait - (now - previous),
            self = this,
            result;
        if (remaining <= 0) {
            // 间隔时间已经超过WAIT「包含第一次触发」，无需等待，立即执行
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            result = func.call(self, ...params);
            previous = now;
        } else if (!timer) {
            timer = setTimeout(() => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                result = func.call(self, ...params);
                previous = +new Date();
            }, remaining);
        }
        return result;
    };
};


// 浏览器有一个最短的反应时间「谷歌5~7MS IE10~17MS」
// 默认：每间隔5MS左右，只要滚动条在滚动，我们就会把handle2执行一次「触发频率是5MS」
// window.onscroll = handle2;
window.onscroll = throttle(handle2, 300);
/* window.onscroll = function proxy() {
    // 每间隔5MS触发执行proxy，proxy内部需要控制每间隔300ms触发执行一次handle2
}; */



// submit.onclick = debounce(handle, 300, true);
// debounce(handle, 300);
// debounce(handle, true);
// debounce(handle);
/*
submit.onclick = function proxy(ev) {
    // 每点击一次，proxy都会被触发执行一次；但是我们需要在proxy中，按照规律，控制真正要执行的方法handle只执行一次
};

// 原本
submit.onclick = handle;  //this:submit  默认传递事件对象
*/

/* 
// 最简单的防抖处理「设置标识判断」
let running = false;
submit.onclick = function () {
    if (running) return;
    running = true;
    queryData(result => {
        console.log(result);
        running = false;
    });
}; 
*/