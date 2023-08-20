import { createEffect, onCleanup } from 'solid-js'
import { getScene } from '../../Scene'
import * as BABYLON from "@babylonjs/core"
import * as Mat from "@babylonjs/materials"
import "@babylonjs/loaders"

let delta = 0;
function lerp(start, end, speed)
{
    return (start + ((end - start) * speed));
}
        
export const Model = (props) => {
  createEffect(async() => {
    console.log('Model.tsx: createEffect')
    const scene = await getScene()
    let canvas = document.getElementById('canvas')
   // const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,2,5), scene)
   const camera = new BABYLON.ArcRotateCamera("camera", 3 * Math.PI/2, Math.PI/2, 5, new BABYLON.Vector3(0, 2, 0), scene)
	camera.attachControl(canvas, true);
  camera.wheelPrecision = 50
  

   
function setupPointerLock()
          {
              // register the callback when a pointerlock event occurs
              document.addEventListener('pointerlockchange', changeCallback, false);
              document.addEventListener('mozpointerlockchange', changeCallback, false);
              document.addEventListener('webkitpointerlockchange', changeCallback, false);
      
              // when element is clicked, we're going to request a
              // pointerlock
              canvas.onclick = function(){
                  canvas.requestPointerLock = 
                      canvas.requestPointerLock ||
                      canvas.mozRequestPointerLock ||
                      canvas.webkitRequestPointerLock
                  ;
      
                  // Ask the browser to lock the pointer)
                  canvas.requestPointerLock();
              };
      
          }
      
      
          // called when the pointer lock has changed. Here we check whether the
          // pointerlock was initiated on the element we want.
          function changeCallback(e)
          {
              if (document.pointerLockElement === canvas ||
                  document.mozPointerLockElement === canvas ||
                  document.webkitPointerLockElement === canvas
              ){
                  // we've got a pointerlock for our element, add a mouselistener
                  document.addEventListener("mousemove", mouseMove, false);
              } else {
                  // pointer lock is no longer active, remove the callback
                  document.removeEventListener("mousemove", mouseMove, false);
              }
          };
      
      
          setupPointerLock
    const ground = BABYLON.MeshBuilder.CreateGround("ground",{width: 1000, height: 1000}, scene)
    var groundmat = new BABYLON.PBRMaterial("mat", scene)
    groundmat.albedoTexture = new BABYLON.Texture("/textures/stone_tiles_03_diff_2k.jpg", scene)
    groundmat.bumpTexture = new BABYLON.Texture("/textures/stone_tiles_03_nor_gl_2k.jpg", scene)
    

    ground.receiveShadows = true
    ground.material = groundmat
    groundmat.metallic = 0;
    groundmat.roughness = 1;
    groundmat.albedoTexture.uScale = 200;
    groundmat.albedoTexture.vScale = 200;


    // Create mutable variables for anything that needs to be accessed in the cleanup function
    let hero = []
    let animationGroups = []
    let skeletons = []
    scene.actionManager = new BABYLON.ActionManager(await scene);

    canvas.addEventListener('click', () => {
      if (!scene.getEngine().isPointerLock) {
        canvas.requestPointerLock();
      }
    });
  
    // Pointer lock change event handler
    const pointerLockChange = () => {
      if (document.pointerLockElement === canvas) {
        // Pointer is locked, hide the cursor or perform any action you want
        console.log('Pointer is locked.');
      } else {
        // Pointer is unlocked, show the cursor or perform any action you want
        console.log('Pointer is unlocked.');
      }
    };
  // Attach the pointer lock change event
   document.addEventListener('pointerlockchange', pointerLockChange);
   document.addEventListener('mozpointerlockchange', pointerLockChange); // Firefox
   document.addEventListener('webkitpointerlockchange', pointerLockChange); // Chrome, Safari



 var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
 light2.position = new BABYLON.Vector3(0, 4, 3);
 light2.radius = 50;
 light2.intensity = 3

 // Shadows
 var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
 shadowGenerator.useBlurExponentialShadowMap = true;
 shadowGenerator.blurKernel = 64;

 shadowGenerator.forceBackFacesOnly = true;

    const box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 0.75, depth: 0.25});
    box.position = new BABYLON.Vector3(0, 1, 10)
    
    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
    defaultPipeline.bloomEnabled = true;
    defaultPipeline.fxaaEnabled = true;
    defaultPipeline.bloomWeight = 0.5;
    defaultPipeline.cameraFov = camera.fov;

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("environment4.env", scene);
    lighting.name = "runyonCanyon";
    scene.environmentTexture = lighting;
    console.log(scene.environmentIntensity)
    scene.createDefaultSkybox(scene.environmentTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ)/2, 0.3, false);
  
   
    
    BABYLON.SceneLoader.ImportMeshAsync(
      '',
      '/',
      "ruins.glb",
      await scene,
      event => {}
    ).then(async(res) =>{
     let ruins = res.meshes[0]
     ruins.position.z = 10;
     ruins.checkCollisions = true
     shadowGenerator.addShadowCaster(ruins, true);  
     ruins.receiveShadows = true;
     ruins.scaling = new BABYLON.Vector3(3,3,3)
    })

    BABYLON.SceneLoader.ImportMeshAsync(
      '',
      '/',
      props.file,
      await scene,
      event => {}
    ).then(async (res) => {
      hero = res.meshes;
      let player = hero[0];
      skeletons = res.skeletons[0];
     
    
      animationGroups = res.animationGroups
      animationGroups[0].stop()
      animationGroups[1].play(true)
      let walkAnim = animationGroups[3];
      let walkBackAnim = animationGroups[3]
      let sambaAnim = animationGroups[4]
      console.log(animationGroups)
      player.checkCollisions=true
   

         
    shadowGenerator.addShadowCaster(player, true);  
    player.receiveShadows = true;
   
    

    let cameraTarget = new BABYLON.TransformNode("root")
  

    scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case BABYLON.PointerEventTypes.POINTERDOWN:
      console.log("POINTER DOWN");
      break;
    case BABYLON.PointerEventTypes.POINTERUP:
      console.log("POINTER UP");
      break;
    case BABYLON.PointerEventTypes.POINTERMOVE:
      console.log("POINTER MOVE");
      break;
    case BABYLON.PointerEventTypes.POINTERWHEEL:
      console.log("POINTER WHEEL");
      break;
    case BABYLON.PointerEventTypes.POINTERPICK:
      console.log("POINTER PICK");
      break;
    case BABYLON.PointerEventTypes.POINTERTAP:
      console.log("POINTER TAP");
      break;
    case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
      console.log("POINTER DOUBLE-TAP");
      break;
  }
});
   

      

    const inputMap = {};
    let keydown;
    let animating = false;
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      }),
    );
    scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      }),
    );
 
      
    console.log(hero)

    camera.cameraDirection
    const updateCamera = (camera, target) => {
      const offset = new BABYLON.Vector3(0, 1.5, -4);
      const desiredPosition = target.position.add(offset);
      
      var distance = BABYLON.Vector3.Distance(target.position, camera.position);
     // if(distance>4.5){
      
      camera.lockedTarget = target.position
     // }

 
      
   
  };

var movementX = 0;
var movementY = 0;



//var mouseMove = function(e)
//            {
//                var movementX = e.movementX ||
//                        e.mozMovementX ||
//                        e.webkitMovementX ||
//                        0;
//        
//                var movementY = e.movementY ||
//                        e.mozMovementY ||
//                        e.webkitMovementY ||
//                        0;
//                
//                mouseX += movementX * mouseSensitivity * deltaTime;
//                mouseY += movementY * mouseSensitivity * deltaTime;
//                mouseY = clamp(mouseY, mouseMin, mouseMax);
//            }
//
//            function clamp(value, min, max)
//            {
//                return (Math.max(Math.min(value, max), min));
//            }

  scene.registerBeforeRender(function(){
      cameraTarget.position = new BABYLON.Vector3(player.position.x, player.position.y + 1.8, player.position.z-.5);
      updateCamera(camera, cameraTarget)

    });
    
    scene.onBeforeRenderObservable.add(() => {
      if(keydown){
       const angle = BABYLON.Vector3.GetAngleBetweenVectorsOnPlane(scene.activeCamera.getForwardRay().direction, BABYLON.Vector3.Forward(), BABYLON.Vector3.Up());
       player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), -angle);
      }

  });


    
    await scene.registerBeforeRender(function(e){
      delta = e.deltaTime/1000;
      if (inputMap["w"]) {
        const dir = player.getDirection(BABYLON.Axis.Z);
          player.position.addInPlace(dir.scaleInPlace(10* delta));
        keydown = true;
   
       // dir.y = 0;
       // dir.normalize();
       // const angle = BABYLON.Vector3.GetAngleBetweenVectors(dir, BABYLON.Vector3.Forward(), BABYLON.Vector3.Up());
       // player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), -angle);

      }
      if (inputMap["s"]) {
        
        player.moveWithCollisions(player.forward.scaleInPlace(.1));
        keydown = true;
      }
      if (inputMap["a"]) {
        const dir = player.getDirection(BABYLON.Axis.X);
        player.position.addInPlace(dir.scaleInPlace(lerp(.1,1,.1)));
        
        
        keydown = true;
      }
      if (inputMap["d"]) {
        player.moveWithCollisions(new BABYLON.Vector3(-.1,0,0))
        
        keydown = true;
      }
      if (inputMap[" "]) {
        player.moveWithCollisions(new BABYLON.Vector3(0,.1,0))
        keydown = true;
      }
      
      if (keydown) {
        if (!animating) {
          
          if (inputMap["s"]) {
            //Walk backwards
            animating = true;
            walkBackAnim.start(true);
          } else if (inputMap[" "]) {
            animating = true;
            sambaAnim.start(true);
          }else if( inputMap["w"]){
            animating = true;
            walkAnim.play(true)
          } else {
            animating = false
          }
        }
      }
    })
      
    })
    
    
    onCleanup(() => {
      console.log('Model.tsx: onCleanup')
      meshes.forEach(mesh => mesh.dispose())
      animationGroups.forEach(animationGroup => animationGroup.dispose())
      skeletons.forEach(skeleton => skeleton.dispose())
    })
  })

  return <></>
}
