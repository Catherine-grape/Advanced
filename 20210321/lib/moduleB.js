// require:导入需要依赖的模块
let moduleA = require('./moduleA');
const handle = function handle() {
    let result = moduleA.sum(10, 20);
    return result;
};
module.exports = {
    handle
};