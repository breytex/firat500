import React, {useState, useEffect} from "react"
import Link from 'next/link';

interface NavigationItem {
  children: String;
  href: String;
}

interface Props {
  items?: NavigationItem[]
}

export const Navigation: React.FC<Props> = ({items})=>{
  const [finalItems, setFinalItems] = useState(items ?? [])

  useEffect(
    ()=>{
      setFinalItems((window as any).navigationProps)
    },
    []
  )

  if(!Array.isArray(finalItems) || finalItems.length === 0) return <div>{"{{navigation-placeholder}}"}</div>

  return (
    <div style={{display:"flex", maxWidth: "500px", justifyContent: "space-between", marginTop: "100px"}}>
      {finalItems.map(item => <NavigationItem {...item}/>)}
    </div>
  )
}

const NavigationItem = (props) =>(
  <Link href={props.href}>
    <a>{props.children}</a>
  </Link>  
)
