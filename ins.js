// ins
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");//文件导出
var http = require("http");
var express = require('express');

var proxyURL = "http://127.0.0.1:1087";

var app = express();

//主页面
app.get('/', function (request, response) {

    //加载html
    response.sendFile(__dirname + "/" + "ins.html", function (error) {
        if (error) {
            console.log('error = ' + error);
            response.status = 400;
            response.send(error);
        } else {
            response.status = 200;
        }
    });
});

//上传路由
app.get('/process_get', function (req, res) {

    var resContent = {
        "firstName": req.query.firstName,
    };
    console.log('response = ' + resContent.firstName);
    // response.end(JSON.stringify(res));//返回

    //请求URL   
    requestURL(resContent.firstName, function (picURL) {
        console.log('网址请求回调了 picURL = ' + picURL);

        //保存到本地
        var writeStream = fs.createWriteStream(__dirname + '/' + '图片.png');
        var readStream = request({
            url: picURL,
            proxy: proxyURL,
        }).pipe(writeStream);
        writeStream.on('end', function () {
            console.log('end');
        })
        writeStream.on('finish', function () {
            console.log('finish');

            //返回图片
            res.sendFile(__dirname + "/" + "图片.png", function (error, data) {
                if (error) {
                    res.status = 400;
                } else {
                    res.status = 200;
                }

                res.end();
            });
        })

        //返回图片网址
        // response.send(picURL);
    });
})

//网址请求
function requestURL(firstURL, callback) {

    //获取图片
    //链接
    //https://www.instagram.com/p/Bwgo86kAwon/?utm_source=ig_web_copy_link

    var req = request({
        url: firstURL,
        proxy: proxyURL,
    }, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var list = []//数组

            // console.log(body);
            let dataStr = JSON.stringify(body)
            let datarep = dataStr.replace(/(\r\n)|(\n)/g, "")
            let n = datarep.match(/(window._sharedData\s?)(=\s?)(.*?);<\/script>/)[3]
            let shareData = JSON.parse(n.replace(/\\/g, ""), function (key, value) {

                // console.log('key: ' + key , 'value: ' + value);

                if (key == 'src') {
                    // console.log(value);
                    list.push(value);
                }
            })
            // debugger;

            //图片地址
            var picURL = list[list.length - 1];
            // console.log(picURL);

            callback(picURL);
        } else {
            console.log('error' + error);
        }
    });
}

var server = app.listen(8282);

/* http模块使用
http.createServer(function (request, response) {

    console.log(123);

    fs.readFile('./ins.html', function (error, data) {

        if (error) {

            console.log('error = ' + error);
            response.writeHead(400, {"Content-type":"text/html"});
        }else {

            // console.log(data.toString());
            response.writeHead(200, {"Content-type":"text/html"});
            response.write(data.toString());
        }
        response.end();
    });

}).listen(8282);
*/

/* 代理
request({
    url:"https://scontent-nrt1-1.cdninstagram.com/vp/97190c3900da7d6992c690da02cbeebb/5D47CF4D/t51.2885-15/e35/56444894_163253794676070_621461017042360600_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com",
    proxy:proxyURL,//代理
}, function (error, response, data) {

    if (!error && response.statusCode == 200) {

        console.log("success");
    }else {
        console.log(error);
    }
})
*/

/* 写入图片
var writeStream = fs.createWriteStream("text5.png");
var readStream = request({
    url:"https://scontent-nrt1-1.cdninstagram.com/vp/97190c3900da7d6992c690da02cbeebb/5D47CF4D/t51.2885-15/e35/56444894_163253794676070_621461017042360600_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com",
    proxy:"http://localhost:1087",//代理
}).pipe(writeStream);

writeStream.on("end", function () {
    console.log("文件写入成功");
    writeStream.end()
});
writeStream.on("finish", function () {
    console.log("ok");
})
*/

/* 获取图片
//链接
//https://www.instagram.com/p/Bwgo86kAwon/?utm_source=ig_web_copy_link

var req = request({
    url:"https://www.instagram.com/p/Bwj_I6tA_u3/?utm_source=ig_web_copy_link",
    proxy:proxyURL,
}, function (error, response, body) {

    if (!error && response.statusCode == 200) {

        var list = []//数组

        // console.log(body);
        let dataStr = JSON.stringify(body)
        let datarep = dataStr.replace(/(\r\n)|(\n)/g, "")
        let n = datarep.match(/(window._sharedData\s?)(=\s?)(.*?);<\/script>/)[3]
        let shareData = JSON.parse(n.replace(/\\/g, ""), function (key, value) {

            // console.log('key: ' + key , 'value: ' + value);

            if (key == 'src') {
                // console.log(value);
                list.push(value);
            }
        })
        // debugger;

        //图片地址
        var picURL = list[list.length - 1];
        console.log(picURL);

        //保存到本地
        var writeStream = fs.createWriteStream('图片1.png');
        var readStream = request({
            url:picURL,
            proxy:proxyURL,
        }).pipe(writeStream);
        writeStream.on('end', function () {
            console.log('end');
        })
        writeStream.on('finish', function () {
            console.log('finish');
        })
    }
});
*/