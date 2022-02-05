const ApiProtocalWssExample = {
  "@types": "COMMANDS_GET",
  key: null
}

const WebProtocalWssExample = {
  "@types": "GUILD_GENERAL_UPDATE",
  body: {
    nickname: "Kady",
    prefix: "=",
    lang: "fr",
    settings: {}
  },
  header: {
    guild_id: "12345678901234567890123456789012",
    user_id: "12345678901234567890123456789012",
    timestamp: Date.now(),
  }
}