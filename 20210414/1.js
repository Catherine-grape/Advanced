/* 
 从输入URL到看到页面 “CRP关键节点的性能优化「HTTP网络层面」”
   @1 URL解析
   @2 缓存检查「强缓存 & 协商缓存304t
   @3 DNS解析
   @4 TCP的三次握手
   @5 HTTP传输「请求 & 响应」
   @6 TCP的四次挥手
   @7 渲染页面


 URL解析
   传输协议：HTTP / HTTPS（SSL）/ FTP（文件上传）...
   域名：顶级、一级、二级...
   端口号：0~65535  区分同一台服务器上的不同服务「HTTP:80  HTTPS:443  FTP:21  默认端口号是浏览器处理的」
   问号参数：可以把一些信息传递给服务器“GET系列” ；也可以实现两个页面之间的信息通信；SPA单页面中，实现组件和组件之间的通信；...
   HASH哈希值：锚点定位；HASH路由；...
   ---
   编码问题：URL中特殊内容的编码
      encodeURI  decodeURI  编译能力弱，只是把URL地址中的中文或者空格等编译 “用于整个URL的编译”
      encodeURIComponent decodeURIComponent 编译能力强，还可以多编译一些特殊符号“用于传递参数的每个值编译”
      escape unescape 只适合客户端之间的通信和编码
      axios.get(`http://www.xxx.com/api/list?name=${encodeURIComponent('珠峰')}&from=${encodeURIComponent('http://www.weixin.com/')}&lx=1`);
 
 缓存检查 ->针对于静态资源文件“例如：html/css/js/图片...”
   缓存位置:内存、硬盘
   F5普通刷新「TAB页卡没关闭」：内存->硬盘
   重新打开页面：硬盘
   CTRL+F5强制刷新：不检测任何缓存，直接向服务器发送请求

   @1 强缓存
      + 先检测本地是否有强缓存，有、且没过期，直接本地获取，然后渲染「HTTP状态码：200」 
      + 如果没有或者过期了，则重新向服务器发送请求，拉取回最新的结果，渲染的同时，把本次结果缓存起来
      + ...
      优势：性能优化的重要手段，可以保证第二次及以后再访问产品，速度会很快...
      弊端：可能无法保证能本地获取的资源是最新的...
        + HTML是不能做强缓存的
        + 只要HTML不处理强缓存，我们就可以保证其余资源的及时更新：请求资源后面设置时间戳 或者 文件名字根据内容生成HASH名 ...
      服务器设置的强缓存：在每一次重新从服务器拉取最新资源文件的时候，都在响应头中携带 Cache-Control / Expires “缓存有效期”，客户端浏览器自动帮助我们把信息缓存起来，包含它的有效期...以后再访问这些资源，就可以看看本地是否有，以及是否过期了

   @2 协商缓存304「只有强缓存失效后，才会校验协商缓存」
      + 如果啥缓存都没有，直接从服务器获取最新的资源信息 “把信息缓存起来；强缓存:把Cache-Control/Expires存储起来；协商缓存:把Last-Modified/ETag存储起来...” Last-Modified:当前资源文件在服务器端最后修改的时间  ETag:每一次修改文件都会生成一个标志
      + 再次请求这个页面，强缓存不生效，则开始协商缓存
        + 向服务器发送请求，同时带上 if-Modifyed-Since:Last-Modified 或者 if-None-Match:ETag 传递给服务器；服务器根据传递的时间/标志，和服务器本身资源文件最后修改的时间/标志，进行对比，如果一样，说明文件没有更新过，直接反返回304即可，无需返回内容；如果不一样，说明更新过，那么则返回最新的内容和最新的Last-Modified/ETag...
        + 如果接收的是304，直接从本地缓存总获取信息渲染即可
      ---
      HTML文件资源是可以使用协商缓存的

    @3 数据缓存「AJAX/FETCH...」


  DNS解析「域名解析」
    在DNS服务器上，基于域名找到服务器的外网IP，后面我就可以基于服务器的外网IP找到服务器...

  TCP三次握手
    在拿到外网IP后，我们开始建立客户端和服务器端连接的通道“TCP通道”
      TCP：稳定的网络通信协议「图稳定」
      UDP：不稳定的网络通信协议「图个快，例如音视频的传输」

  数据传输

  TCP四次挥手
    断开TCP连接通道
 */