/*
 * ajax、axios、$.ajax、fetch 区别？
 *   都是基于TCP(HTTP/HTTPS)从服务器获取数据
 *   ajax、axios、$.ajax他们的核心：XMLHttpRequest
 *       ajax是原生操作
 *       axios是基于promise封装的ajax库  $ npm i axios --save  「优先推荐」
 *       $.ajax是基于回调函数的方式封装的ajax库   $ npm i jquery --save
 *   fetch是ES6新增的API，和XMLHttpRequest没有关系，这是浏览器新提供的一种和服务器通信的机制，而且默认就是基于promise管理的，但是兼容性比较差，除了EDGE新版本，其余的IE浏览器不支持
 */
import axios from './axios.js';
import instance from './axios2.js';

axios.get('/user/list', {
  params: {
    search: '',
    departmentId: 0
  }
}).then(result => {
  console.log(`最终想要的数据:`, result);
}).catch(reason => {
  console.log(`失败的原因:`, reason);
});

axios.post('/user/login', {
  account: '18310612838',
  password: md5('1234567890')
}).then(result => {
  console.log(`最终想要的数据:`, result);
});