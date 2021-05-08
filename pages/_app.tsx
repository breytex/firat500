import { Navigation } from '../components/Navigation';
import '../styles/globals.css';
import { useEffect } from 'react';

let navigationPropsCache
function MyApp({ Component, pageProps, navigationProps }) {

  useEffect(
    ()=>{
      navigationPropsCache = navigationProps
    }
  )
  
  return <>
      <Navigation items={navigationProps}/>
      <Component {...pageProps} />
  </>
}

MyApp.getInitialProps = async () => {
  if(navigationPropsCache) {
    console.log("Served from cache")
    return {navigationProps: navigationPropsCache}
  }

  const res = await fetch("http://localhost:3000/api/navigation")
  const navigationProps = await res.json()
  navigationPropsCache = navigationProps
  console.count("data fetched")

  return {navigationProps}
}

export default MyApp
