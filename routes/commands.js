const { render } = require("ejs");
const { readFileSync, existsSync } = require("fs");
const { error404, getUrlPat, isLogged } = require("../API/utils.js");

module.exports = {
  exec: async function(req, res){
    if (!existsSync(this.viewPath)) return error404(req, res);
    else {
      const commands = [];
      const ctg = "info";
      database.cache.get("commands").forEach(commandConfig => {
        if (commandConfig.category === ctg) commands.push(commandConfig);
      })
      // EXECUTABLE
      res.statusCode = 200;
      res.end(render(readFileSync(this.viewPath, "utf8"), {
          commands: commands.map(({ name, category, desc, use, aliase }) => ({
            name, category, desc, aliase,
            use: use.split(/\n/g).filter((str) => (new RegExp(`^${"="}|\/[a-zA-Z0-9]+`, "")).test(str)).join(" / "),
          })), ctg,
          prefix: "=",
          wsUrl: database.ws.urlPort,
          allCommmands: database.cache.get("commands"),
          categorys: database.cache.get("categorys") || [],
          logged: isLogged(req, res),
          footer: readFileSync("views/footer.html", "utf8"),
          header: readFileSync("views/head.html", "utf8"),
          navbar: render(readFileSync("views/nav.ejs", "utf8"), { logged: isLogged(req, res), url: req.url }),
        }
      ));
    }
  },
  url: "/commands",
  method: "GET",
  viewPath: "views/mainPages/commands.ejs"
}