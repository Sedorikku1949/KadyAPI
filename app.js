global["client"] = {}
const { getAllFiles } = require("./API/utils.js");

global["database"] = {
  users: new Map(),
  ws: new (require("./API/ws"))(),
  web: new (require("./API/web"))(),
  views: getAllFiles("views", null, ["ejs"]),
  routes: getAllFiles("routes", null, ["js"]),
  localDB: new (require("enmap"))({ dataDir: "./database/local", name: "LocalDatabase"})
}

database.web.RoutesManager = new (require("./API/RoutesManager"))();









/* IN APP EVAL */
process.stdin.resume();
process.stdin.on("data", function(data){
    data = data.toString().trim()
    if (data.length == "\n") return process.stdout.write("> ");
    if (data === ".clear") { console.clear(); return process.stdout.write("> "); }
    let send;
    try {
        console.log(`[ \x1b[1;32meval\x1b[0m ]: ${require("util").inspect(eval(data), {colors:true, depth:0})}`);
    } catch(err) {
        console.log(`[ \x1b[1;32meval\x1b[0m ]: \x1b[1;31m<ERROR> ${err}\x1b[0m`);
    }
    process.stdout.write("> ");
});