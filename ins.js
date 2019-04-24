// ins
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");//文件导出

var proxyURL = "http://localhost:1087";

/*
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