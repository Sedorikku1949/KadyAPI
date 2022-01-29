const http = require("http");
const port = 8000;
const ejs = require("ejs");

class WebSite {
  constructor(){
    const that = this;
    this.server = http.createServer(function (req, res) {
      that.RoutesManager.execute(req, res);
    });

    this._start();
  }

  _start(){
    this.server.listen(port, () => {
      console.log(`[ \x1b[1;32mWebSite\x1b[0m ] Server started on port ${port} at http://localhost:${port}`);
    });
  }
}

module.exports = WebSite;