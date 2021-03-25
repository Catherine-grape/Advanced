/* {
    function foo() {}
    foo = 1;
}
console.log(foo); */

/* 
/!*
 * EC(G)
 *   foo
 * 变量提升:
 *   function foo;
 *   function foo;
 *!/
{
    /!*
     * EC(BLOCK)
     *    foo -> 0x000 [[scope]]:EC(BLOCK)
     *        -> 0x001 [[scope]]:EC(BLOCK)
     * 作用域链: <EC(BLOCK),EC(G)>
     * 变量提升: 
     *    function foo() {}
     *    function foo() {}
     *!/
    function foo() {} //把之前对foo的操作同步给全局一份  window.foo=0x001
    foo = 1; //私有的foo=1
    function foo() {} //把之前对foo的操作同步给全局一份  window.foo=1
    // 之后再有代码和全局无关了
}
console.log(foo); //1 
*/

/* {
    function foo() {}
    foo = 1;
    function foo() {}
    foo = 2;
}
console.log(foo); */