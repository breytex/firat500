export default (req, res) => {
  res.status(200).json([
    {children: "Mainpage", href: "/"},
    {children: "Page", href: "/page"},
    {children: "Page2", href: "/page2"}
  ])
}
