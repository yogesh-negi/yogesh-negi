import { Header } from "./header"
import { useEffect, useState } from "react"
import formating from "./userdashboard.module.css"


export function Userdashboard(){
let activeuser = localStorage.getItem("activeuser")
let [fetcheddata,setfetcheddata] = useState({})
let [datearray,setDatearray] = useState([])

useEffect(()=>{
    fetch(`https://expenseapp-4d103-default-rtdb.firebaseio.com/database/${activeuser}/plan.json`)
    .then(response=>{
        return response.json()
    })
    .then(data=>{
        setfetcheddata(data)
        setDatearray(()=>{
            return Object.keys(data).map(plandate=>new Date(plandate).toISOString())
        })
    })
},[])

return (
    <section className={formating.wrapper}>
        <table className={formating.table}>
        <tr><td>Plan Date</td><td>Canteen Name</td><td>Location</td><td>Visit Status</td><td>Days Stay</td><td>Food and Lodging</td><td>Local Travel Expense</td><td>Misc Exp</td><td>Local Travel Distance</td><td>Up Down Travel Expense</td><td>Remarks</td></tr>
        {            
            datearray.sort().map((plandate,i)=>{
                let date = new Date(plandate).toDateString()
                let visitstatus = fetcheddata[date].visitstatus
                let formdata = fetcheddata[date].formdata
                if(formdata == undefined) formdata = {"daysstay":0,"foodandlodging":0,"localexpense":0,"miscexp":0,"remarks":"","traveldistance":0,"travelexp":0}
                if(visitstatus == undefined) return []
               return visitstatus.map(obj=>{
                    return (<tr><td>{obj.plandate}</td> <td>{obj.canteenname}</td><td>{obj.location}</td><td>{obj.visitstatus}</td><td>{formdata.daysstay}</td><td>{formdata.foodandlodging}</td><td>{formdata.localexpense}</td><td>{formdata.miscexp}</td><td>{formdata.traveldistance}</td><td>{formdata.travelexp}</td><td>{formdata.remarks}</td></tr>)
               })

            })
        }
        </table>
    </section>
)

} 