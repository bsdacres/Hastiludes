import logo from './logo.svg';
import styles from './App.module.css';
import { Model } from './components/babylon/Model';
import { Light } from './components/babylon/Light';
import { Character } from './components/babylon/Character';
import { CharacterCreator } from './components/UI/CharacterCreator';
import InventoryUI from './components/UI/InventoryUI';


function App() {
  return (
    <>
      <Character file = "GirlAnimation.glb"/>
    </>
  );
}

export default App;
