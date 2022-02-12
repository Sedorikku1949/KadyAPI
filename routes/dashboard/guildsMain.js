const { render } = require("ejs");
const { readFileSync, existsSync } = require("fs");
const { error404, getUrlPath, isLogged } = require("../../API/utils.js");

module.exports = {
  exec: async function(req, res){
    if (!existsSync(this.viewPath)) return error404(req, res);
    else {
      if (!isLogged(req, res) || !database.auth[req.socket.remoteAddress]) {
        res.writeHead(302, {
          "Location": "/auth/login"
        });
        res.end();
      } else {
        // EXECUTABLE
        res.statusCode = 200;
        res.end(render(readFileSync(this.viewPath, "utf8"), {
            guilds: database.auth[req.socket.remoteAddress].data.guilds,
            user: database.auth[req.socket.remoteAddress].data.user,
            badge: "dev",
            logged: true,
            footer: readFileSync("views/footer.html", "utf8"),
            header: readFileSync("views/head.html", "utf8"),
            navbar: render(readFileSync("views/nav.ejs", "utf8"), { logged: true, url: req.url }),
          }
        ));
      }
    }
  },
  url: "/guilds",
  method: "GET",
  viewPath: "views/dashboard/guilds.ejs"
}