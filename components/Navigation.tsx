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


export const Navigation: React.FC<Props> = ({items})=>{
  
  return (
    <div style={{display:"flex", maxWidth: "500px", justifyContent: "space-between", marginTop: "100px"}}>
      {items && items.map(item => <NavigationItem key={item.href} {...item}/>)}
    </div>
  )
}

const NavigationItem = (props) =>(
  <Link href={props.href}>
    <a>{props.children}</a>
  </Link>  
)


