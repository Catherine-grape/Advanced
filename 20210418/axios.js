/*
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
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = function (data, headers) {
  if (data === null || typeof data !== "object") return data;
  let conType = headers['Content-Type'] || headers.post['Content-Type'];
  if (/urlencoded/i.test(conType)) data = Qs.stringify(data);
  if (/json/i.test(conType)) data = JSON.stringify(data);
  return data;
};
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300;
};
axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('token');
  if (token) config.headers['Authorization'] = token;
  return config;
});
axios.interceptors.response.use(function onfulfilled(response) {
  return response.data;
}, function onrejected(reason) {
  let response = reason.response;
  if (response) {
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