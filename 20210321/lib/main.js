let moduleB = require('./moduleB');
console.log(moduleB.handle());

// ...

let moduleA = require('./moduleA');
console.log(moduleA.sum(100, 200));