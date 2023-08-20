import { createEffect, onCleanup } from 'solid-js'
import style from "./UI.module.css"
import { CharacterCreator } from './CharacterCreator'
import { Card } from './components/Card'



export default function InventoryUI(){ 
    return(
        <>
            <div>
                
            </div>
            <CharacterCreator file="GirlAnimation.glb"/>
            <div class={style.playerName}>bsdacres</div>
            
        </>
            
    )
}