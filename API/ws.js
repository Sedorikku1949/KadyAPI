const WebSocket  = require("ws");
const Utils = require("./utils.js");

class WebSocketAPI {
  constructor(){
    this._Database = global["database"];
    this._Client = global["client"];

    this.client = new WebSocket.Server({ port: 9000 });
    this.client.on("connection", (ws, req, res) => {
      console.log("[WS] Client connected");
      console.log(req.socket.remoteAddress)
      console.log([...[...global["database"].users].map(user => user[1]?.ip)])
      if ([...[...global["database"].users].map(user => user[1]?.ip)].some((ip) => ip == req.socket.remoteAddress)) return ws.terminate();
      Utils.createUser(this.client, req.socket.remoteAddress)

      ws.on("message", (rawData) => {
        console.log("[WS] Client message received");
        const user = [...global["database"].users].filter(user => user[1]?.ip == req.socket.remoteAddress)[0];
        console.log(user)
        if (!user || !global["database"].users.has(user[0])) return ws.send(JSON.stringify(({"error": "User not found", "state": "403 forbidden"}))) && ws.terminate();
        console.log(rawData.toString("utf-8"));
        try {
          const data = JSON.parse(rawData.toString("utf-8"));
          console.log(data);

          ws.send(JSON.stringify({ "state": "200 ok", "data": data }));
        } catch(err) {
          console.log("an error as occured")
          console.log(err)
          ws.send(JSON.stringify({error: "Invalid JSON", state: "400 bad request"}))
        }
      });

      ws.on("close", () => {
        console.log("[WS] Client disconnected");
        const user = [...global["database"].users].filter(user => user[1]?.ip == req.socket.remoteAddress)[0];
        if (!user || !global["database"].users.has(user[0])) return;
        global["database"].users.delete(user[0]);
      });
  
      ws.on("error", (err) => {
        console.log("[WS] Client error");
        console.log(err);
      });

    });
  }
}

module.exports = WebSocketAPI;
