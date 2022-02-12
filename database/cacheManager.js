const { writeFileSync, existsSync, readFileSync, unlinkSync } = require('fs');

class CacheManager {
  constructor(dir){
    if (!existsSync(dir)) throw new Error("Cache directory does not exist!");
    this.dir = dir;
  }

  get(key){
    if (!existsSync(`${this.dir}/${key}.json`)) return null;
    else return JSON.parse(readFileSync(`${this.dir}/${key}.json`, "utf8"));
  }

  set(key, data){
    if (typeof key !== "string" || data == undefined) throw new Error("Key must be a string and data must be non undefined!");
    let rawData = { "@timestamp": Date.now(), data: null };
    rawData.data = data;
    writeFileSync(`${this.dir}/${key}.json`, JSON.stringify(rawData), "utf8");
    return data;
  }
}

module.exports = CacheManager;