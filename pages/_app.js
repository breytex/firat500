import { useEffect, useState } from 'react'
import '../styles/globals.css'

const Navigation = ()=>{
  const [content, setContent] = useState("{{navigation-placeholder}}")

  useEffect(
    ()=>{
      setContent(window.navigationHtml)
    },
    []
  )

  return <div dangerouslySetInnerHTML={{__html:content}}/>
}

function MyApp({ Component, pageProps }) {
  return <>
    <Navigation/>
    <Component {...pageProps} />
  </>
}

export default MyApp
