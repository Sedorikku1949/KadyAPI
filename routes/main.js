const { render } = require("ejs");
const { readFileSync, existsSync } = require("fs");

module.exports = {
  exec: async function(req, res){
    if (!existsSync(this.viewPath)) { res.statusCode = 404; res.end("404 Not Found"); }
    else {
      // EXECUTABLE
      res.statusCode = 200;
      res.end(render(readFileSync(this.viewPath, "utf8"), {
          hello: true,
          footer: readFileSync("views/footer.html", "utf8"),
          header: readFileSync("views/head.html", "utf8"),
          navbar: render(readFileSync("views/nav.ejs", "utf8"), { logged: false }),
        }
      ));
    }
  },
  url: "/",
  method: "GET",
  viewPath: "views/main.ejs"
}