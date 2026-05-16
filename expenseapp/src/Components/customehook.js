import React from "react"
import { useEffect,useState } from "react"

function useFetchData (url,userid) {
 let [canteendata,setCanteendata] = useState({"canteenlist":"",status:"",error:""})

 useEffect(()=>{
    fetch(`${url}/canteenlist/${userid}`).then(res=>res.json()).then(data=>{
        setCanteendata({"canteenlist":[data[userid].canteendetails],status:"",error:""})
        return data[userid]
    }).catch(error=>{
        console.log(error.message)
    })
 },[])

 return canteendata

 }

 export default useFetchData