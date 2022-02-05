const { render } = require("ejs");
const { readFileSync, existsSync } = require("fs");
const { error404, getUrlPath } = require("../API/utils.js");

module.exports = {
  exec: async function(req, res){
    if (!existsSync(this.viewPath)) return error404(req, res);
    else {
      // EXECUTABLE
      res.statusCode = 200;
      res.end(render(readFileSync(this.viewPath, "utf8"), {
          hello: true,
          logged: false,
          footer: readFileSync("views/footer.html", "utf8"),
          header: readFileSync("views/head.html", "utf8"),
          navbar: render(readFileSync("views/nav.ejs", "utf8"), { logged: false, url: req.url }),
        }
      ));
    }
  },
  url: "/about",
  method: "GET",
  viewPath: "views/mainPages/about.ejs"
}