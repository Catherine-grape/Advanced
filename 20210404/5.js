let obj1 = {
    url: '/api/list',
    method: 'GET',
    headers: {
        'X-Token': '123456',
        'Content-Type': 'application/json'
    }
};
let obj2 = {
    method: 'POST',
    data: {
        lx: 'test',
        from: 'weixin'
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};
obj2.obj2 = obj2;

// 返回及处理的是obj1  浅合并：浅比较，只对对象的第一级进行比较，用obj2中的每一项直接替换obj1中相同的这一项
// console.log(Object.assign(obj1, obj2));
// 先拿obj1替换{}中的每一项「把obj1复制一份过去」，接下来在拿obj2替换对象中的每一项
// console.log(Object.assign({}, obj1, obj2));