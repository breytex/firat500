import React, {useState, useEffect} from "react"
import Link from 'next/link';
import { useFetchContext } from "../src/FetchProvider";
import { myFetch } from "../src/myFetch";

interface NavigationItem {
  children: String;
  href: String;
}

interface Props {
  items?: NavigationItem[]
}

type SSRComponent = React.FC<Props> & {getSsrData: (e:string)=>Promise<any>}

const fetchNavigationData = ()=> myFetch("http://localhost:3000/api/navigation")

export const Navigation: SSRComponent = ()=>{
  const [navigationProps, setNavigationProps] = useState([])

  useEffect(
    ()=>{
      fetchNavigationData().then(data =>{
        setNavigationProps(data)
      })
    },
    []
  )

  return (
    <div style={{display:"flex", maxWidth: "500px", justifyContent: "space-between", marginTop: "100px"}}>
      {navigationProps.map(item => <NavigationItem {...item}/>)}
    </div>
  )
}

// Adding datafetch function to be visited on server side prepass
Navigation.getSsrData = fetchNavigationData

const NavigationItem = (props) =>(
  <Link href={props.href}>
    <a>{props.children}</a>
  </Link>  
)


