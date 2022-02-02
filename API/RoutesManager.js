const { getAllFiles, getObjPath } = require("./utils.js");
const { readFile, existsSync } = require("fs");
const type = require("../allTypes.json");

class RouteManager {
  constructor(){
    this.routes = [];
    this._loadRoutes();
  }

  execute(req, res){
    if (!req || !res) throw new Error("req and res are required");
    const { url } = req;
    if (!url || res.writableEnded) return;
    if (url.match(/^\/cdn/)) {
      try {
        readFile(url.slice(1), function(err, data){
          if (err) {
            res.statusCode = 404;
            res.end("404 Not Found");
          } else {
            const contentType = (Object.entries(type).map(t => t[1].includes(url.match(/\.([A-Za-z0-9\.]+)$/gm)?.[0]?.slice(1)) ? t[0] : false).filter(Boolean)[0] ?? "text/plain")
            res.setHeader("Content-Type", contentType)
            res.writeHead(200);
          };
          res.end(data);
        });
      } catch(err) {
        console.log(err)
        res.statusCode = 404;
        res.end("404 Not Found");
      }
    } else {
      const route = this.getRoute(url);
      if (!route) {
        if (res.writableEnded) return;
        res.statusCode = 404;
        res.end("404 Not Found");
      } else {
        try {
          const contentType = (Object.entries(type).map(t => t[1].includes(url.match(/\.([A-Za-z0-9\.]+)$/gm)?.[0]?.slice(1)) ? t[0] : false).filter(Boolean)[0] ?? "text/html")
          res.setHeader("Content-Type", contentType)
          route.exec(req, res);
          console.log(`[ \x1b[1;32mWebSite\x1b[0m ] \x1b[33m${req.socket.remoteAddress}\x1b[0m - \x1b[34m${req.method}\x1b[0m \x1b[36m${res.statusCode}\x1b[0m -- \x1b[35m${req.url}\x1b[0m`);
        } catch(err) {
          console.log(err);
        }
      }
    }
  }

  _reloadCommand(){
    global["database"]["views"] = getAllFiles("views", null, ["ejs"]);
    global["database"]["routes"] = getAllFiles("routes", null, ["js"]);
    return true;
  }

  _loadRoutes(){
    global["database"].routes.forEach(routeDir => {
      if (!existsSync(routeDir)) return;
      let Route = require(`../${routeDir}`);
      Route.exec.bind(Route);
      this.routes.push(Route);
    });
    return true;
  }

  getRoute(urlPath){
    return this.routes.find((route) => route.url == urlPath);
  }
}

module.exports = RouteManager;