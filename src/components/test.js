import { useContext } from "react"
import { MyContext } from "./grid/layout"

export  function T(){
  const myCtx = useContext(MyContext);
  return<p>{myCtx?myCtx:0}</p>
}