import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./homescreen.module.css"
import UserScreen from "./UserScreen";

function HomeScreen () {
let location = useLocation()
let [showuserscreen,setShowuserscreen] = useState(false)
let [users,setUserlist] = useState([]);
let [activeuser, setActiveuser] = useState({"password":0,"empid":""}) 

let onchangehandler = (e) => {
    setActiveuser(prevState=>{
        return {...prevState,[e.target.name]:e.target.value}
    })
}

let validationhandler = (e) => {
    e.preventDefault()
    if(activeuser.empid=='' || users[activeuser.empid] == undefined){
        alert("invalid credetials")
        return false
    } 
    let validate = users[activeuser.empid].password == activeuser.password
    if(validate){
        setShowuserscreen(true)
    } else {
        alert("invalid credetials")
        return false
    }
    
}

    useEffect(()=>{
        fetch("https://expenseapp-4d103-default-rtdb.firebaseio.com/employeedetails.json")
        .then(response=>{
            return response.json()
        }).then(data=>{
            setUserlist(data)
        })
    },[])

    return (
        <section className={styles.wrapper}>
        {!showuserscreen ? 
            <form className={styles.form} onSubmit={validationhandler}>
            <h1>Login</h1>
            <label className={styles.label} htmlFor="empid"> Emp Id </label>
            <input type="text" className={styles.select} id="empid" name="empid" onChange={onchangehandler}/>
            <label className={styles.label} htmlFor="password"> Password </label>
            <input type="text" className={styles.select} id="password" name="password" onChange={onchangehandler}/>
            <input className={styles.input} type="submit" value="Validate"/>
            </form>
        :<UserScreen user={activeuser.empid}/>}
        </section>
    )
}

export default HomeScreen