const instance = axios.create();
instance.defaults.baseURL = 'http://186.12.1.1:8080';
// ...

export default instance;