const uuid = require("uuid");

function newUserId(){
  const idList = [...[...global["database"].users].map(user => user[0])];
  let id = uuid.v4();
  while (idList.includes(id)) id = uuid.v4();
  return id;
};

module.exports = {
  getAllFiles: function getAllFiles(dir, callback = null, fileExtension = ["js"]){
    if (typeof dir !== "string" || dir.match(/(?:\.(?:.+)+)+$/)) throw new Error("dir must be a string and a path to a folder");
    let fileList = [];
    const regexFile = Array.isArray(fileExtension) && fileExtension.every((f) => typeof f == "string") ? fileExtension : ["js"];
    readdirSync(dir).forEach((subDir) => {
      if (callback && typeof callback == "function") callback.call(this, subDir);
      else {
        if (subDir.match(/^[a-zA-Z0-9]+$/)) getAllFiles(`${dir}/${subDir}`, callback, fileExtension).forEach((f) => fileList.push(f))
        else if (subDir.match(new RegExp(`^(?:[a-zA-Z0-9]+)(?:\.(?:${regexFile.join("|")})+)+$`, ""))) return fileList.push(`${dir}/${subDir}`);
        else return;
      }
    });
    return fileList;
  },
  createUser(ws, ip) {
    const id = newUserId();
    const data = ({ createdTimestamp: new Date(), ip });
    global["database"].users.set(id, data);
    return data;
  },
  parseGuildData(rawData) {
    return ({
      id: rawData.id,
    })
  },
  parseUserData(rawData) {
    return ({
      id: rawData.id,
    })
  }
}