// myExpress.js
let http = require('http');
const url = require('url');
function createApplication() {
    let app = {};
    app.routes = [];
    let index = 0;

    app.use = function (path, handler) {
        if(typeof path !== "string") { // 第一个参数不是字符串，说明不是路径，而是方法
            handler = path;
            path = "/"
        }
        let layer = {
            method: "middle",
            path,
            handler
        }
        app.routes.push(layer)
    }
    app.all = function (path, handler) {
        let layer = {
            method: "all",
            path,
            handler
        }
        app.routes.push(layer)
    }
    http.METHODS.forEach(method => {
        method = method.toLocaleLowerCase()
        app[method] = function (path, handler) {
            let layer = {
                method,
                path,
                handler
            }
            app.routes.push(layer)
        }
    });
    app.listen = function () {
        let server = http.createServer(function (req, res) {
            // 取出layer 
            // 1. 获取请求的方法
            let m = req.method.toLocaleLowerCase();
            let { pathname } = url.parse(req.url, true);

            // 2.找到对应的路由，执行回调方法
            function next(err) {
                // 已经迭代完整个数组，还是没有找到匹配的路径
                if (index === app.routes.length) return res.end('Cannot find ')
                let { method, path, handler } = app.routes[index++] // 每次调用next就去下一个layer
                if( err ){ // 如果有错误，应该寻找中间件执行。
                    if(handler.length === 4) { //找到错误中间件
                        handler(err,req,res,next)
                    }else { // 继续徐州
                        next(err) 
                    }
                }else {
                    if (method === 'middle') { // 处理中间件
                        if (path === '/' || path === pathname || pathname.starWidth(path + '/')) {
                            handler(req, res, next)
                        } else { // 继续遍历
                            next();
                        }
                    } else { // 处理路由
                        if ((method === m || method === 'all') && (path === pathname || path === "*")) {
                            handler(req, res);
                        } else {
                            next();
                        }
                    }
                }
            }

            next()
            res.end('hahha')
        })
        server.listen(...arguments);
    }
    return app;
}

module.exports = createApplication;