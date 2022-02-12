module.exports = {
  exec: async function(...args){
    return require("../middleware/auth.js").login(...args);
  },
  url: "/auth/login",
  method: "GET",
  viewPath: null
}