// 真实项目中，我们也会基于NODE环境变量，设置不同的请求前缀{和AXIOS处理类似}
let baseURL = 'http://127.0.0.1:9999',
    inital = {
        method: 'GET',
        params: null,
        body: null,
        credentials: 'include',
        cache: 'no-cache',
        responseType: 'JSON',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

// 验证是否为纯粹的对象
const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
};

export default function request(url, config) {
    /* init params */
    if (typeof url !== "string") throw new TypeError('url must be required!');
    if (!isPlainObject(config)) config = {};
    // 针对于HEADERS单独处理
    if (config.headers) {
        // 保证用户传递的HEADERS是个对象
        if (!isPlainObject(config.headers)) config.headers = {};
        config.headers = Object.assign({}, inital.headers, config.headers);
    }
    let {
        method,
        params,
        body,
        credentials,
        cache,
        responseType,
        headers
    } = Object.assign({}, inital, config);

    /* 处理URL「问号拼接 & 公共前缀」 依赖QS库 */
    if (!/^http(s?):\/\//i.test(url)) url = baseURL + url;
    if (params != null) {
        if (isPlainObject(params)) params = Qs.stringify(params);
        url += `${url.includes('?')?'&':'?'}${params}`;
    }

    /* 处理请求主体信息「必须POST系列请求 & 根据HEADERS中的CONTENT-TYPE处理BODY的格式」 */
    let isPost = /^(POST|PUT|PATCH)$/i.test(method),
        conType = headers['Content-Type'] || 'application/json';
    if (isPost && isPlainObject(body)) {
        if (/urlencoded/i.test(conType)) body = Qs.stringify(body);
        if (/json/i.test(conType)) body = JSON.stringify(body);
    }

    /* 发送请求之前，在HEADERS中携带一些东西（例如：TOKEN）给服务器 */
    let token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    /* 校正发送请求前的配置项 */
    config = {
        method: method.toUpperCase(),
        credentials,
        cache,
        headers
    };
    if (isPost) config.body = body;

    /* 正常基于FETCH发送请求 */
    return fetch(url, config).then(response => {
        let {
            status,
            statusText
        } = response;
        if (status >= 200 & status < 400) {
            // 真正的成功:根据RESPONSE-TYPE返回对应格式的数据
            let result;
            switch (responseType.toUpperCase()) {
                case 'JSON':
                    result = response.json();
                    break;
                case 'TEXT':
                    result = response.text();
                    break;
                case 'BLOB':
                    result = response.blob();
                    break;
                case 'ARRAYBUFFER':
                    result = response.arrayBuffer();
                    break;
            }
            return result;
        }
        // 服务器有返回信息，但是状态码是不对的:失败
        return Promise.reject({
            code: 'STATUS ERROR',
            status,
            statusText
        });
    }).catch(reason => {
        // 做一些当前项目中，失败状况下的公共提示和处理
        // @1 状态码错误
        if (reason && reason.code === "STATUS ERROR") {
            switch (reason.status) {
                case 400:
                    // ...
                    break;
            }
        }
        // @2 断网处理
        if (!navigator.onLine) {
            // ...
        }
        return Promise.reject(reason);
    });
};