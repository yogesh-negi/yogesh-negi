import style from "./header.module.css"
export function Header (props) {
    
    return (<header className={style.header}>
        <div className={style.menu}>
        {
            props.menuitems.map(item=>{
                return (<p onClick={item.method}>{item.text}</p>)
            })
        }
        </div>
    </header>
    )
} 