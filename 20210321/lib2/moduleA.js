const sum = (x, y) => {
    return x + y;
};
// ES6Module规范中，模块暴露API
export default sum;

/*
  export default func;  当前只模块导出一个
  export default {
      func,
      sum
      ...
  };
  ----
  import func from './xxx.js';
     func();
  import utils,{sum} from './xxx.js';
     utils.func();
     sum();

  ===========

  export const sum=function(){};   一个模块导出多个方法
  export const handle=function(){};
  ----
  import * as utils from './xxx.js';
     utils.sum();
 */