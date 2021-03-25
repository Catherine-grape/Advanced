// 新建一个JS，就是创建一个模块
let name = 'zhufeng';
const sum = function sum(x, y) {
    return x + y;
};

// 暴露API
module.exports = {
    sum
};