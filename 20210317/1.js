/*
 * EC(G)
 *   VO(G)/GO
 *     a
 *     fn -> 0x000 [[scope]]:EC(G)
 */
/* console.log(a); //undefined
var a = 12; // 全局a=12
function fn() {
    /!*
     *  EC(FN)
     *    AO(FN)
     *      a  
     * 作用域链:<EC(FN),EC(G)>
     * 形参赋值:--
     * 变量提升:var a;
     *!/
    console.log(a); //undefined
    var a = 13; //私有a=13
}
fn();
console.log(a); //12 */


/*
 * EC(G)
 *   VO(G)/GO
 *     a
 *     fn -> 0x000 [[scope]]:EC(G) 
 */
/* console.log(a); //undefined
var a = 12;
function fn() {
    /!*
     * EC(FN)
     *    AO(FN)
     * 作用域链:<EC(FN),EC(G)>
     * 形参赋值:--
     * 变量提升:--
     *!/
    console.log(a); //a不是自己私有的，是上级上下文中的   12
    a = 13;
}
fn();
console.log(a); //13 */


/*
 * EC(G)
 *   VO(G)/GO
 *     fn -> 0x000 [[scope]]:EC(G) 
 */
try {
    console.log(a); //报错：ReferenceError a is not defined
} catch (err) {}
a = 12;  //全局上下文中遇到一个变量，我们分别在VO(G)和GO中找，找到则拿来用即可，没找到：如果是输出则报错，如果是赋值操作，则相当于给GO加了一个属性  => window.a=12
function fn() {
    console.log(a); //12
    a = 13;
}
fn();
console.log(a); //13