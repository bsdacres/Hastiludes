import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import { createSignal } from 'solid-js'
import HK from '@babylonjs/havok';
import * as Mat from "@babylonjs/materials"

// Create a Solid.js signal for the scene to share with the entire app
export const [getScene, setScene] = createSignal(createScene())


// Function to create a new scene
export async function createScene() {

  console.log('CREATE SCENE')

  // If the canvas element does not exist, create it
  let canvas = document.getElementById('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'canvas'

    // Make the canvas fill the window
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'

    // Decrease Z index of the canvas to make it appear behind the DOM UI
    canvas.style.zIndex = '-1'

    // Add the canvas to the DOM body as the first child
    document.body.insertBefore(canvas, document.body.firstChild)
  }

  const engine = new BABYLON.WebGPUEngine(canvas, {antialias:true});
  await engine.initAsync()
  const scene = new BABYLON.Scene(await engine)
 
  
  const havokInstance = await HK();

  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.HavokPlugin(undefined,havokInstance));
 


  console.log(scene.getPhysicsEngine())

      // Set up new rendering pipeline
  

  // Render the scene whenever the active camera changes
  scene.onActiveCameraChanged.add(async () => {
    engine.runRenderLoop(async () => {
     scene.render()
    })
  })

  // Handle window resize
  window.addEventListener('resize', () => {
    engine.resize()
  })

  return scene
}