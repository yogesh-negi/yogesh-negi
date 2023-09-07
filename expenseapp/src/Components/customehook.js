import React from "react"
import { useEffect,useState } from "react"

function useFetchData (url,userid) {
 let [canteendata,setCanteendata] = useState({"canteenlist":"",status:"",error:""})

 useEffect(()=>{
    fetch(`${url}/${userid}/canteendetails.json`).then(res=>res.json()).then(data=>{
        console.log(data)
        setCanteendata({"canteenlist":[data],status:"",error:""})
        return data
    }).catch(error=>{
        console.log(error.message)
    })
 },[])

 return canteendata

 }

 export default useFetchData