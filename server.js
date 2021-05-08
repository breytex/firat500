const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const getNavigationProps = async ()=>{
  console.log("NAVIGATION GET CALLED")
  const res = await fetch("http://localhost:3000/navigation")
  const data = await res.json()
  return data.html
}

app.prepare().then(() => {
  const server = express();

  // static assets
  server.get("/_next/*", handle);
  
  server.get("/navigation", (req, res)=>{
    res.json({"html": "<h1>THIS IS MY ONE TIME FETCHED NAVIGATION</h1>"})
  })

  server.all("*", async (req, res) => {
    const html = await app.renderToHTML(req, res, req.path, req.query);
    const navigationHtml = await getNavigationProps()

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
