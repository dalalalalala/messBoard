var http = require('http')
var fs = require('fs')
var template = require('art-template')
var url = require('url')
var comments=[
    {
        name:'张三1',
        message:'天气好',
        dateTime:'2020-9-26'
    }, {
        name: '李四2',
        message: '天气好fd',
        dateTime: '2020-9-26'
    }, {
        name: '小红',
        message: '天气好fdsa',
        dateTime: '2020-9-26'
    }, {
        name: '小明',
        message: '天气好gret',
        dateTime: '2020-9-26'
    },
]
http
    .createServer(function (req,res){
        // var url = req.url
        var parseObj = url.parse(req.url,true)
        var pathname = parseObj.pathname
        if (pathname==='/'){
            fs.readFile('./views/index.html',function(err,data){
                if (err){
                    return res.end('404')
                }
                var htmlStr = template.render(data.toString(),{
                    comments:comments
                })
                res.end(htmlStr)
            })
        } else if (pathname.indexOf('/public/')===0){
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })
        } else if (pathname === '/post'){
            fs.readFile('./views/post.html', function (err, data) {
                if (err) {
                    return res.end('404')
                }
                res.end(data)
            })
        } else if (pathname === '/pinglun') {
            //注意:这个时候，/ping.0x0xxxxx后面是什么，对我们来讲都无所谓了
            // 一次请求对应一次响应，响应结束
            // res.setHeader('Content-Type','text/plain;charset=utf-8')
            // res.end(JSON.stringify(parseObj.query))

            //我们已经获得了用户输入的内容，接下来，我们要让用户跳转到首页，并且显示所有的评论，包括他的那一条
            var comment=parseObj.query
            var date = new Date()
            // comment.dateTime = new Date().toLocaleDateString()
            comment.dateTime = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
            comments.unshift(comment)

            //此时，我们已经将数据存到了comments里面,接下来就是让用户重新请求"/"首页，这样可以看到新的留言了

            //如何通过服务器让客户端重定向
            // 1、状态码设置为302
                // statusCode 
                res.statusCode=302
            //2.在响应头中，通过location告诉客户端往哪定向
            // setHeader
            res.setHeader('location','/')
            //如果客户端收到服务器的响应状态码是302，就会自动去响应头中去找location进行重定向
            res.end()
        }
        else{
            // 其他处理为404页面
            fs.readFile('./views/404.html',function(err,data){
                if(err){
                    return res.end('404')
                }res.end(data)
            })
        }
    })
    .listen(3000,function(){
        console.log('running')
    })