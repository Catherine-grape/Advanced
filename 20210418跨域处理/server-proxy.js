/*-CREATE SERVER-*/
const express = require('express'),
    app = express();
app.listen(1001, () => {
    console.log(`THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT：1001`);
});

// 代理
const request = require('request');
app.get('/subscriptions/recommended_collections', (req, res) => {
    let jianURL = `https://www.jianshu.com/asimov${req.url}`;
    req.pipe(request(jianURL)).pipe(res);
});

/* STATIC WEB */
app.use(express.static('./'));