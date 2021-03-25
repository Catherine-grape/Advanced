// 导入模块中暴露的API
//   + @1 必须放在当前模块最开始的位置
//   + @2 如果是浏览器端直接使用ES6Module，则必须加 .js 后缀名「如果在webpack中使用，则无需增加」
import sum from './moduleA.js';

const handle = () => {
    return sum(10, 20);
};

export default handle;