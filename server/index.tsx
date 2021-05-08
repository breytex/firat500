import {renderToString} from 'react-dom/server'
import {Navigation} from '../components/Navigation'
import React from 'react'
import express from 'express'
import next from 'next'

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const getNavigationProps = async ()=>{
  console.log("NAVIGATION GET CALLED")
  const res = await fetch("http://localhost:3000/navigation")
  const data = await res.json()
  return data
}

app.prepare().then(() => {
  const server = express();

  // static assets
  server.get("/_next/*", handle);
  
  server.get("/navigation", (req, res)=>{
    res.json([
      {children: "Mainpage", href: "/"},
      {children: "Page", href: "/page"},
      {children: "Page2", href: "/page2"}
    ])
  })

  server.all("*", async (req, res) => {
    const html = await app.renderToHTML(req, res, req.path, req.query);
    const navigationProps = await getNavigationProps()

    const navigationHtml = renderToString(React.createElement(Navigation, {items: navigationProps}))
    console.log({navigationProps, navigationHtml})

    const finalHtml = html
                        .replace("</body>", `<script>window.navigationProps = ${JSON.stringify(navigationProps)};</script></body>`)
                        .replace("{{navigation-placeholder}}", navigationHtml)

    return res.send(finalHtml);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

export {}
