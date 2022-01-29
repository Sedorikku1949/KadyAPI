const { getAllFiles } = require("./utils.js");
const { readFileSync } = require("fs");

class RouteManager {
  execute(req, res){
    
  }

  _reloadCommand(){
    database["views"] = getAllFiles("views", null, ["ejs"]);
    database["routes"] = getAllFiles("routes", null, ["js"]);
    return true;
  }
}

module.exports = RouteManager;