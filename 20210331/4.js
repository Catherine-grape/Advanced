/*
 * 编写queryURLParams方法实现如下的效果（至少两种方案）
 *   @1 获取URL地址中，问号参数值「或者哈希值」
 *   {
 *      lx:'1',
 *      from:'wx',
 *      _HASH:'video'
 *   }
 * 
 * 课外东西
 *   @2 'lx=1&from=wx'  被叫做 urlencoded 格式字符串「x-www-form-urlencoded」
 *      类库：Qs.stringify/parse 实现urlencoded格式字符串和对象之间的转换
 *      URLSearchParams
 */
/* String.prototype.queryURLParams = function queryURLParams(attr) {
    // this -> url
    let self = this,
        link = document.createElement('a'),
        obj = {};
    link.href = self;
    let {
        search,
        hash
    } = link;
    if (hash) obj['_HASH'] = hash.substring(1);
    if (search) {
        search = search.substring(1).split('&');
        search.forEach(item => {
            let [key, value] = item.split('=');
            obj[key] = value;
        });
    }
    return typeof attr !== "undefined" ? obj[attr] : obj;
}; */

String.prototype.queryURLParams = function queryURLParams(attr) {
    // this -> url
    let self = this,
        obj = {};
    self.replace(/#([^?=&#]+)/g, (_, $1) => obj['_HASH'] = $1);
    self.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, $1, $2) => obj[$1] = $2);
    return typeof attr !== "undefined" ? obj[attr] : obj;
};

let url = "http://www.zhufengpeixun.cn/?lx=1&from=wx#video";
console.log(url.queryURLParams("from")); //=>"wx"
console.log(url.queryURLParams("_HASH")); //=>"video"
console.log(url.queryURLParams());