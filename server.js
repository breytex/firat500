const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const getNavigationProps = ()=>{
  console.log("NAVIGATION GET CALLED")
  return "<h1>THIS IS MY ONE TIME FETCHED NAVIGATION</h1>"
}

app.prepare().then(() => {
  const server = express();

  // static assets
  server.get("/_next/*", handle);

  server.all("*", async (req, res) => {
    const html = await app.renderToHTML(req, res, req.path, req.query);
    const navigationHtml = getNavigationProps()
    
    const finalHtml = html
                        .replace("</body>", `<script>window.navigationHtml = "${navigationHtml}";</script></body>`)
                        .replace("{{navigation-placeholder}}", navigationHtml)

    return res.send(finalHtml);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
