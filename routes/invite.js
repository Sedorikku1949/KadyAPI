module.exports = {
  exec: async function(req, res){
    res.writeHead(302, {
      "Location": "https://discord.com/api/oauth2/authorize?client_id=858766319506554899&permissions=8&redirect_uri=https%3A%2F%2Fkady.tlkoe.xyz&response_type=code&scope=bot%20applications.commands%20guilds%20identify"
    });
    res.end();
  },
  url: "/invite",
  method: "GET",
  viewPath: null
}