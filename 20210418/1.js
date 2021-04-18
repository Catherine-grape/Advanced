import request from './fetch.js';

/* request('/user/info', {
    params: {
        userId: 1
    }
}).then(result => {
    console.log('成功:', result);
}).catch(reason => {
    console.log('失败:', reason);
}); */

request('/user/login', {
    method: 'POST',
    body: {
        account: '18310612838',
        password: md5('1234567890')
    }
}).then(result => {
    console.log('成功:', result);
}).catch(reason => {
    console.log('失败:', reason);
});


/* fetch('http://127.0.0.1:9999/user/info?userId=1', {
    // 请求方式
    method: 'GET',
    // 自定义请求头信息
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // 是否有缓存
    cache: 'no-cache',
    // 是否允许携带资源凭证   'same-origin'同源   'include'跨域请求中也允许
    credentials: 'include'
}).then(response => {
    // 已经从服务器获取结果，不论状态码是以什么开始的，FETCH都认为是成功的(返回的promise是fulfilled)
    //   + status/statusText：返回的HTTP网络状态码
    //   + Response.prototype : json/text/blob/arrayBuffer... 把服务器返回的响应主体信息变为我们想要的格式，执行这些方法返回对应的promise实例
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }
    return Promise.reject({
        code: 'STATUS ERROR',
        status: response.status,
        statusText: response.statusText
    });
    // 如何获取响应头信息
    // response.headers.forEach((item, key) => {
    //     console.log(item, key);
    // });
    // let itor = response.headers.keys();
    // for (let val of itor) {
    //     console.log(val);
    // }
    // console.log(response.headers.get('content-type'));
}).then(result => {
    console.log('成功:', result);
}).catch(reason => {
    // 服务器没有返回任何的信息
    console.log(reason);
}); */

/* fetch('http://127.0.0.1:9999/user/login', {
    method: 'POST',
    body: Qs.stringify({
        account: '18310612838',
        password: md5('1234567890')
    }),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include'
}).then(response => response.json()).then(result => {
    console.log(result);
}); */