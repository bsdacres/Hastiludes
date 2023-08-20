
import style from "../UI.module.css"


const styles ={
    "border-radius": "10px",
    "height": "95%",
    "width": "90%",
    "position": "relative",
    "text-align": "center",
    "top": "2.5%",
    "left": "5%",
    
   // "background-color": "purple"
    

}

export const Card = () =>{
    return(
        <div style={{ "height": "70vh","width": "50vh","margin-left": "10vw", "border-radius":"10px","background-image": "url(https://cdn.discordapp.com/attachments/883034757376639036/1127265946751479968/IMG_2633.jpg)","background-size": "cover","background-position":"center" }}>
            <div style={styles}>
                <div class={style.card}>
                    <div class={style.classType}>class</div>
                    <p>Malkera, the Forgotten Queen</p>
                    <hr style={{color:"white", width: "85%"}}/>
                    <div class={style.ability}>
                        <p >bewitch</p>
                        <p >Miasma</p>
                        <p >Bewilder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

