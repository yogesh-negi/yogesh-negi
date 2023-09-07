import { Fragment, useEffect, useState } from "react";
import {useLocation} from "react-router-dom"
import styles from "./userscreen.module.css"
import useFetchData from "./customehook"
import {Header} from "./header"
import { Userdashboard } from "./userdashboard";


function UserScreen (props) {

    let toggleadditionalplan = false;
    let location = useLocation()
    let [additionalplan, setadditionalplan] = useState([])
    let [plandate,setPlandate] = useState(new Date().toDateString())
    let currentuser = props.user//location.pathname.split("/")[1]
    let fetchedcanteenlist = useFetchData("https://expenseapp-4d103-default-rtdb.firebaseio.com/alluserscanteenlist",currentuser)
    let allcanteenlist

    if(fetchedcanteenlist.canteenlist[0] == undefined){
        allcanteenlist = []
    } else {
        allcanteenlist = fetchedcanteenlist.canteenlist[0]
    }


    let [filteruser,setFilteruser] = useState([])
    let [visitstatus, setVisitstatus] = useState([])
    let [currentscreen, setcurrentscreen] = useState("updateexpense")
    let [formdata, setformdata] = useState({"daysstay":0,"travelexp":0,"foodandlodging":0,"traveldistance":0,"miscexp":0,"localexpense":0})
    let [docuploadSection, setdocuploadSection] = useState({"showsection":"none","daysstay":true,"travelexp":true,"foodandlodging":true,"bills":true,"miscexp":false,"localexpense":true,"traveldistance":true})
    let onchangehandler = (e) =>{
        let value = e.target.value
        let key = e.target.name
        setformdata(prevState => {
            return {...prevState,
            [key]:value
            }
              })
    }

    let showhidesection = (e) => {
        let value = e.target.value
        if(value == "Ex-HQ"){
            setdocuploadSection({"showsection":"block","daysstay":true,"travelexp":false,"foodandlodging":true,"bills":true,"localexpense":false,"traveldistance":false,"table":"none"})
        } else if (value == "Other") {
            setdocuploadSection({"showsection":"block","daysstay":true,"travelexp":true,"foodandlodging":true,"bills":true,"localexpense":true,"traveldistance":true,"table":"none"})
        } else if(value == "OS") {
            setdocuploadSection({"showsection":"block","daysstay":false,"travelexp":false,"foodandlodging":false,"bills":false,"localexpense":false,"traveldistance":false,"table":"none"})
        } else {
            setdocuploadSection({"showsection":"none","daysstay":true,"travelexp":true,"foodandlodging":true,"bills":true,"traveldistance":true,"travelexp":true,"localexpense":true})
        }
    }


    let visitstatushandler = (e,updateddata) => {
        let status = e.target.value
        console.log(visitstatus)
        visitstatus.forEach((obj,i)=>{
            let condition = obj.canteenname == updateddata.canteenname
            if(condition){
                setVisitstatus(()=>{
                    visitstatus[i].visitstatus = status
                    return visitstatus
                })
             }
        })

    }


let sendformdata = (e) =>{
    e.preventDefault()
    let completeformdata =  {visitstatus,formdata}
   
    fetch(`https://expenseapp-4d103-default-rtdb.firebaseio.com/database/${currentuser}/plan/${plandate}.json`,{
        method:"put",
        body:JSON.stringify(completeformdata)
    }).then((response)=>{
        return response.json()
    }).then(data=>{
        setFilteruser([])
        setVisitstatus([])
        setformdata({"daysstay":0,"travelexp":0,"foodandlodging":0,"traveldistance":0,"miscexp":0,"remarks":"","localexpense":""})
        setdocuploadSection({"showsection":"none","daysstay":true,"travelexp":true,"foodandlodging":true,"bills":true,"miscexp":true,"localexpense":true,"traveldistance":true})
        alert("your data saved successfully")
    }).catch(err=>{
        throw new Error("something went wrong")
    })
}

let addtoplan = (e) => {
    e.preventDefault()
    if(additionalplan.length == 0) return false
        let array = additionalplan.split("=")
        let addcanteen = array[0];
        let addlocation = array[1]
        setFilteruser((prevState)=>{
            return [...prevState,{"canteenname":addcanteen,"location":addlocation,"plandate":plandate}]
        })

        setVisitstatus((prevState)=>[...prevState,{"canteenname":addcanteen,"location":addlocation,"plandate":plandate}])
}

useEffect(()=>{
    fetch(`https://expenseapp-4d103-default-rtdb.firebaseio.com/database/${currentuser}/plan/${plandate}/visitstatus.json`)
    .then(res=>{
        return res.json()
    }).then(resdata=>{
        if(resdata !== null){
            setFilteruser(resdata)
            setVisitstatus(resdata)
            
        } else {
            setFilteruser([])
            setVisitstatus([])
        }
    })
},[plandate])

let logouthandler = () => {
    localStorage.clear()
    window.location.reload()
}

let viewdashboard = () => {
    localStorage.setItem("screen","userdashboard")
    setcurrentscreen("userdashboard")
}


    return (
        <>            {
                currentscreen == "updateexpense" ? (
            <section className={styles.userscreenwraper}>
            <Header menuitems={[{text:"Log Out",method:logouthandler},{text:"Dashboard",method:viewdashboard}]}/>
                <center><h3>VISIT PLAN</h3></center>
                <div className={styles.head}>
                    <span>
                <p htmlFor="selectplan"> select date</p>
                <input className={styles.input} name="selectplan" type="date" onChange={(e)=>{setPlandate(new Date(e.target.value).toDateString())}}/>
                </span>
                </div>
            <table style={{display:docuploadSection.table}} className={styles.table}>
                <thead>
                <tr>
                 <th>Canteen Name</th>
                <th>Location</th>
                <th>Status</th>
                 </tr>
                 </thead>
                 <tbody>
            {
            filteruser==undefined ? false: filteruser.map(object =>{
                let updateddata = {"plandate":object.plandate,"canteenname":object.canteenname,"location":object.location}
                return (
                        <tr>
                        <td>{object.canteenname}</td>
                        <td>{object.location}</td>
                        <td><select className={styles.input} onChange={(e)=>visitstatushandler(e,updateddata)} name="visit status">
                            <option value="not visited">not visited</option>
                            <option value="visited"> visited</option>
                            </select></td>
                        </tr>
                )
            })
            }
            </tbody>
            </table>
            <section className={styles.addtoplan}>
            <div>
            <form onSubmit={addtoplan}>
                <h4> ADD NEW PLAN </h4>
                <select className={styles.select} onChange={(e)=>setadditionalplan(e.target.value)}>
                {
                   allcanteenlist.map(obj=>{
                    return (<option value={obj.canteenname+"="+obj.location}>{obj.canteenname} :- {obj.location}</option>)
                })}
                </select>
                {console.log("showing "+allcanteenlist.length +" canteens in dropdown")}
                <p><input type="submit" value="add to plan"/></p>
            </form>
            <div>
            <p>Local Travel Distance (in KM)</p>
            <input disabled={docuploadSection.traveldistance} className={styles.input} type="number" onChange = {onchangehandler} value= {formdata.traveldistance} min={0} id="traveldistance" name="traveldistance"/>
            <p>Local Travel Expense</p>
            <input disabled={docuploadSection.localexpense} className={styles.input} type="number" onChange = {onchangehandler} value= {formdata.localexpense} min={0} id="localexpense" name="localexpense"/>
            </div>
            </div>
            </section>
            <div className={styles.expensesection}>
            <span><h4>Expense section</h4></span>
            <span className={styles.formsection}>
            <select name="location" onChange={showhidesection}>
                <option value=""> Select Location</option>
                <option value="Other"> Other </option>
                <option value="Ex-HQ"> Ex-HQ </option>
                <option value="OS"> OS </option>
            </select>
            </span>
            <form className={styles.form} onSubmit={sendformdata}>
            <section className={styles.section} style={{display:docuploadSection.showsection}}>
            <p><label className={styles.label} htmlFor="daysstay" >No of Days Stay</label></p>
            <input className={styles.label} type="number" disabled={docuploadSection.daysstay} onChange = {onchangehandler} value= {formdata.daysstay} min={0} id="daysstay" name="daysstay"/>
            <p><label className={styles.label} htmlFor="travelexp">Travel Exp (Up & Down)</label></p>
            <input type="number" className={styles.label} disabled={docuploadSection.travelexp} onChange = {onchangehandler} value= {formdata.travelexp} min={0} id="travelexp" name="travelexp"/>
            <p><label className={styles.label} htmlFor="foodandlodging" >Food and Lodging</label></p>
            <input className={styles.label} type="number" disabled={docuploadSection.foodandlodging} onChange = {onchangehandler} value= {formdata.foodandlodging} min={0} id="foodandlodging" name="foodandlodging"/>
            <p><label className={styles.label} htmlFor="miscexp" >Misc Expense</label></p>
            <input className={styles.label} type="number" disabled={docuploadSection.miscexp} onChange = {onchangehandler} value= {formdata.miscexp} min={0} id="miscexp" name="miscexp"/>
            <p><label className={styles.label} htmlFor="remarks" >Remarks</label></p>
            <textarea className={styles.label} disabled={docuploadSection.miscexp} onChange = {onchangehandler} id="remarks" value= {formdata.remarks} name="remarks"/>
            {/* <label className={styles.label} htmlFor="bills" >Upload Bills</label>
            <input className={styles.label} type="file" disabled={docuploadSection.foodandlodging} id="bills" name="bills"/> */}
            </section>
            <input className={styles.input} type="submit" value="submit"/>
            </form>
            </div>
            </section>):<Userdashboard/>
            }
            </>
    )

}

export default UserScreen