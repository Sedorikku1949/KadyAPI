const { getAllFiles, getObjPath, error404 } = require("./utils.js");
const { readFile, existsSync } = require("fs");
const type = require("../allTypes.json");
const { parse } = require("querystring");
function fetchArguments(str){ return Object(parse(str)); };

class RouteManager {
  constructor(){
    this.routes = [];
    this._loadRoutes();
  }

  execute(req, res){
    if (!req || !res) throw new Error("req and res are required");
    const { url } = req;
    if (!url || res.writableEnded) return;
    if (url.match(/^\/cdn\//)) {
      try {
        readFile(url.slice(1), function(err, data){
          if (err) return error404(req, res);
          else {
            const contentType = (Object.entries(type).map(t => t[1].includes(url.match(/\.([A-Za-z0-9\.]+)$/gm)?.[0]?.slice(1)) ? t[0] : false).filter(Boolean)[0] ?? "text/plain")
            res.setHeader("Content-Type", contentType)
            res.writeHead(200);
          };
          res.end(data);
        });
      } catch(err) {
        console.log(err)
        return error404(req, res);
      }
    } else {
      const route = this.getRoute(url);
      if (!route) return error404(req, res);
      else {
        
        try {
          const contentType = (Object.entries(type).map(t => t[1].includes(url.match(/\.([A-Za-z0-9\.]+)$/gm)?.[0]?.slice(1)) ? t[0] : false).filter(Boolean)[0] ?? "text/html")
          res.setHeader("Content-Type", contentType)
          route.exec(req, res, fetchArguments(url.replace(/(?:\/[a-zA-Z0-9_]+)+\?((?:&?[a-zA-Z0-9_]+=[^\s&]+)+)/, "$1")));
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
    return this.routes.find(({ url }) => urlPath.replace(/((?:(?:\/[a-zA-Z0-9]+\/?)+)|\/)\??(?:(?:&?[a-zA-Z0-9_]+=[^&\s]+)+)?$/, "$1") == url);
  }
}

module.exports = RouteManager;