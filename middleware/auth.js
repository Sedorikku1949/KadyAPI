const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const base64 = (str) => Buffer.from(str).toString('base64');
const getCallbackURl = () => (database.cache.get("client")?.id!=="858766319506554899" ? "http://localhost:8000/auth/login" : "https://kady.tlkoe.xyz/auth/login");
const { getValueType } = require("../API/utils.js");
const Permissions = require("../Utils/Permissions.js");

function redirectToDiscord(req, res){
  res.writeHead(302, {
    Location: `https://discord.com/api/oauth2/authorize?client_id=${database.cache.get("client")?.id}&redirect_uri=${encodeURIComponent(getCallbackURl())}&response_type=code&scope=identify`
  });
  res.end();
  return true;
}

const uuid = require("uuid");

function generateId(){
  let id = uuid.v4();
  while(Object.values(auth).some((u) => u.id == id)) id = uuid.v4();
  return id;
}

const auth = {};

module.exports = {
  login: async function(req, res, query){
    if (query?.code) {
      // Get the token
      const params = new URLSearchParams();
      params.set('grant_type', 'authorization_code');
			params.set('code', query.code);
			params.set('redirect_uri', getCallbackURl());
      let callbackRes = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST', body: params.toString(),
				headers: { Authorization: `Basic ${base64(`${database.cache.get("client")?.id}:${database.cache.get("client")?.secret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' }
			});
      // Fetch tokens (used to fetch user informations)
			const tokens = await callbackRes.json();
      // If the code isn't valid
			if(tokens.error || !tokens.access_token) return redirectToDiscord(req, res);
			let userData = {
				infos: null,
				guilds: null
			};
      // test data
      while(!userData.infos || !userData.guilds){
        // User infos 
        if(!userData.infos){
          response = await fetch('http://discordapp.com/api/users/@me', { method: 'GET', headers: { Authorization: `Bearer ${tokens.access_token}` } });
          const json = await response.json();
          if (json.retry_after) await delay(json.retry_after);
          else userData.infos = json;
        }
        // User guilds 
        if(!userData.guilds){
          response = await fetch('https://discordapp.com/api/users/@me/guilds', { method: 'GET', headers: { Authorization: `Bearer ${tokens.access_token}` } });
          const json = await response.json();
          if (json.retry_after) await delay(json.retry_after);
          else userData.guilds = json;
        }
      }

      database.auth[req.socket.remoteAddress] = ({
        id: generateId(),
        data: {
          user: userData.infos,
          guilds: userData.guilds
            .filter(({ permissions_new }) => new Permissions(permissions_new).has("MANAGE_GUILD"))
            .sort((a,b) => a.memberCount - b.memberCount)
            .map(({ id, name, icon, permissions_new }) => ({ permissions_new, id, name, icon: icon ? `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=1024` : null }))
            .sort((a,b) => (new Permissions(b.permissions_new).has("MANAGE_GUILD") ? -1 : 1)),
          requestData: tokens
        },
        timestamp: Date.now()
      })

      res.writeHead(302, {
        Location: "/guilds"
      });
      res.end();
    } else {
      // redirect to discord authentification page
      return redirectToDiscord(req, res);
    }
    
  }
}