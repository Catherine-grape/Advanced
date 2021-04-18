/*
   客户端地址（Web服务器）：http://127.0.0.1:5500/index.html 
   数据接口地址（数据服务器）：https://www.jianshu.com/asimov/subscriptions/recommended_collections

   协议、域名、端口：三者有一个不一样都是跨域请求
 */
//=======Proxy
fetch('/subscriptions/recommended_collections')
    .then(response => response.json())
    .then(result => {
        console.log(result);
    });

//======CORS的原理：服务器设置允许源
/* fetch('http://127.0.0.1:1001/test', {
    credentials: 'include'
}).then(response => response.json()).then(result => {
    console.log(result);
}); */

//===========
/* 
fetch('https://www.jianshu.com/asimov/subscriptions/recommended_collections')
    .then(response => response.json())
    .then(result => {
        console.log(result);
    });
// Access to fetch at 'https://www.jianshu.com/asimov/subscriptions/recommended_collections' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.   浏览器默认存在跨域的限制『基于AJAX/FETCH发送请求』，为了保证安全性 
*/

//=======JSONP：只能发送GET请求 “script标签只能发送get请求”
/* 
jsonp({
    url: 'https://www.baidu.com/sugrec',
    params: {
        prod: 'pc',
        wd: 'zhufeng'
    },
    jsonpName: 'cb',
    success: function (result) {
        console.log(result);
    }
});

jsonp({
    url: 'http://127.0.0.1:1001/jsonpTest',
    success(result) {
        console.log(result);
    }
}); 
*/