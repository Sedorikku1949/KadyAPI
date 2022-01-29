const http = require("http");
const port = 8000;
const ejs = require("ejs");

class WebSite {
  constructor(){
    this.server = http.createServer(function (req, res) {
      console.log(`[WebSite] ${req.method} ${req.url}`);
      console.log(req.url);
      console.log(req.method);
      /**
       * res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        data: 'Hello World!'
      }));
       */

      // send a ejs file
      if (req.url == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(ejs.render(`<!DOCTYPE html>
        <html>
        <head>
          <title>Hello World</title>
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
        </html>`));
      }
    });

    this._start();
  }

  _start(){
    this.server.listen(port, () => {
      console.log(`[WebSite] Server started on port ${port} at http://localhost:${port}`);
    });
  }
}

module.exports = WebSite;