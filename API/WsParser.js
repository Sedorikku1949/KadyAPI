function getValueType(value){
  if ([null, undefined].some((e) => value == e)) return String(value).toLowerCase();
  else return(value.constructor.name.toLowerCase());
};

module.exports = async(obj) => {
  return new Promise(function(resolve, reject){
    if (getValueType(obj) !== "object") return resolve({"error": "Invalid JSON", "state": "400 bad request"});
    else {
      switch(obj["@type"]){
        case "COMMANDS_GET": {
          if (!obj.ctg) resolve({"error": "Missing ctg", "state": "400 bad request"});
          else {
            const commands = [...global["database"].cache.get("commands")].filter(({category}) => category.match(new RegExp(`^${obj.ctg}`, "i")));
            resolve(
              {
                "commands": commands.map(
                  (commandData) => ({
                    name: commandData.name,
                    desc: commandData.desc,
                    category: commandData.category,
                    use: commandData.use.split(/\n/g).filter((str) => (new RegExp(`^${"="}|\/[a-zA-Z0-9]+`, "")).test(str)).join(" / "),
                    aliase: commandData.aliase,
                  })
                ),
                "state": 200,
                "ctg": obj.ctg,
                "ctgFullName": global["database"].cache.get("categorys").find(({defaultName}) => defaultName.toLowerCase() == obj.ctg.toLowerCase()).name,
                "@type": "COMMANDS_GET",
              }
            );
          }
          break;
        };
        default: resolve({"error": "Invalid type", "state": "400 bad request"});
      }
    }
    resolve(obj);
  })
}