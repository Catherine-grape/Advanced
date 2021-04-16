/*
 * Axios的二次封装:把所有请求的公共部分进行提取 
 */

/* 
   @1 配置公共的URL地址 
     + 如果业务层自己发送请求的时候，请求的URL中包含了 http(s):// 这样的前缀，则baseURL不生效
     + 真实项目中，我们经常配合webpack设置的环境变量，让前缀地址不同
       + 开发环境  development    http://127.0.0.1:9999    $ num run serve
       + 测试环境  test       http://192.168.1.23:8080    $ num run test
       + 灰度环境  huidu      http://huidu.xxx.com/api    $ num run build & ...
       + 生产环境  production   http://www.xxx.com/api    $ num run build & ...
       + ...

    let env = process.env.NODE_ENV || 'development',
        baseURL = 'http://127.0.0.1:9999';
    switch (env) {
        case 'development':
            baseURL = 'http://127.0.0.1:9999';
            break;
        case 'test':
            baseURL = 'http://192.168.1.23:8080';
            break;
        case 'huidu':
            baseURL = 'http://huidu.xxx.com/api';
            break;
        case 'production':
            baseURL = 'http://www.xxx.com/api';
            break;
    }
    axios.defaults.baseURL = baseURL;
 */
axios.defaults.baseURL = 'http://127.0.0.1:9999';

/* 
  @2 其它的一些二额外配置 
    + 设置超时 
    + 设置CORS跨域的时候，是否允许携带资源凭证(cookie) ：客户端和服务器端需要保持统一
*/
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

/* 
  @3 针对于POST系列请求的一些公共配置 
    + 设置请求头信息  例如：Content-Type「application/x-www-form-urlencoded & application/json & myltipart/form-data & ...」
       + axios.defaults.headers.xxx='xxx' 所有请求都设置
       + axios.defaults.headers.common.xxx='xxx' 
       + axios.defaults.headers.post.xxx='xxx' 指定某个请求下才设置
       + ...
      新版本浏览器中，如果我们请求主体传递的信息，其格式处理好了，那么Content-Type我们自己不设置，浏览器也会帮助我们进行处理
    + transformRequest 把POST系列请求中，我们传递的data数据，在发送请求之前，变为指定的数据格式「默认是把data对象变为JSON格式的字符串传递给服务器的」
*/
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = function (data, headers) {
    if (data === null || typeof data !== "object") return data;
    let conType = headers['Content-Type'] || headers.post['Content-Type'];
    if (/urlencoded/i.test(conType)) data = Qs.stringify(data);
    if (/json/i.test(conType)) data = JSON.stringify(data);
    // ...
    return data;
};

/*
  @4 设置请求成功或者失败的状态码校验规则 
    基于axios发送请求，返回一个promise实例，如果知道实例是成功还是失败呢？
    + 失败
      + 服务器正常返回信息，但是并没有经过validateStatus的校验
      + 请求超时或者请求中断 reason.code==='ECONNABORTED'
      + 服务器没有返回任何信息「可能是断网了」
      + ...
    + 成功
      + 服务器正常返回信息，并且HTTP状态码是经过validateStatus校验成功的「默认是以2开头的」
 */
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 300;
};

/*
  @5 请求拦截器 
    在向服务器发送请求之前，我们做的拦截，通过拦截，可以修改config配置中的信息
    例如：携带Token
 */
axios.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('token');
    if (token) config.headers['Authorization'] = token;
    return config;
});

/* 
  @6 响应拦截器
    服务器把信息给客户端之后，在业务层自己使用数据之前
    + 成功
      + 把响应主体的信息返回到业务层
    + 失败
      + 根据不同的失败状况，做统一提示信息
*/
axios.interceptors.response.use(function onfulfilled(response) {
    return response.data;
}, function onrejected(reason) {
    let response = reason.response;
    if (response) {
        // 服务器正常返回信息，只不过状态码不对
        switch (response.status) {
            case 400:
                // ...
                break;
            case 401:
                // ...
                break;
            case 404:
                // ...
                break;
        }
    } else {
        if (reason && reason.code === "ECONNABORTED") {
            // 请求中断或者超时
        }
        if (!navigator.onLine) {
            // 断网
        }
    }
    return Promise.reject(reason);
});

export default axios;