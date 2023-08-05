import { createEffect, onCleanup } from 'solid-js'
import { getScene } from '../../Scene'
import * as BABYLON from "@babylonjs/core"
import * as Mat from "@babylonjs/materials"
import "@babylonjs/loaders"





export const Model = (props) => {
  createEffect(async() => {
    console.log('Model.tsx: createEffect')

    const scene = await getScene()
    let canvas = document.getElementById('canvas')
  	var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 2, -4), scene);
	  camera.attachControl(canvas, true);
    camera.fov= 1


    // Create mutable variables for anything that needs to be accessed in the cleanup function
    let hero = []
    let animationGroups = []
    let skeletons = []
    scene.actionManager = new BABYLON.ActionManager(await scene);
    let heroSpeed = .2;
    let heroSpeedBackwards = .1
    let heroRotationSpeed = .1

    var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, );
    scene.imageProcessingConfiguration.toneMappingEnabled = true;
    scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    scene.imageProcessingConfiguration.exposure = 3;
    pipeline.glowLayerEnabled = true
    pipeline.glowLayer.intensity = 0.5

    const box = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 0.75, depth: 0.25});
    box.position = new BABYLON.Vector3(0, 1, 10)

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

         
	    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, -0.5, -1.0), scene);
	    light.intensity = 0.7;
	    light.specular = BABYLON.Color3.Black();

    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    light2.position = new BABYLON.Vector3(0, 4, 3);
    light2.radius = 10;

    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 64;
    shadowGenerator.addShadowCaster(player, true);
    shadowGenerator.forceBackFacesOnly = true;
    player.receiveShadows = true;
    let cameraTarget = new BABYLON.TransformNode("root")
    cameraTarget.rotation = new BABYLON.Vector3(player.rotation) 
   
   
   
    
      

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
    var alpha = (3 * Math.PI) / 2 - player.rotation.y;
    var beta = 1.25;

  
    console.log(hero)

    
    const updateCamera = (camera, target) => {
      const offset = new BABYLON.Vector3(0, .2, -3);
      const desiredPosition = target.position.add(offset);

      // Use interpolation (lerping) to smoothly move the camera to the desired position
      camera.position = BABYLON.Vector3.Lerp(camera.position, desiredPosition, 0.05);
      
      // Make the camera look at the target
      target.position = new BABYLON.Vector3(player.position.x, player.position.y + 1.3, player.position.z);
  };

  var point = new BABYLON.Vector3(8, 1, 1);

    //Set axis in world space to rotate around
    var axis = BABYLON.Axis.X; 
    scene.registerBeforeRender(function(){

    updateCamera(camera, cameraTarget )
    cameraTarget.position = new BABYLON.Vector3(player.position.x,player.position.y +1.3,player.position.z)
  
    player.rotation.y = camera.alpha + Math.PI;
    
    });


    
    await scene.registerBeforeRender(function(){
      
      
      
      if (inputMap["w"]) {
        player.moveWithCollisions(new BABYLON.Vector3(0,0,.1));
        keydown = true;
       
       // const dir = scene.activeCamera.getForwardRay().direction;
       // dir.y = 0;
       // dir.normalize();
       // const angle = BABYLON.Vector3.GetAngleBetweenVectors(dir, BABYLON.Vector3.Forward(), BABYLON.Vector3.Up());
       // player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), -angle);

      }
      if (inputMap["s"]) {
        player.moveWithCollisions(new BABYLON.Vector3(0,0,-.1));
        keydown = true;
      }
      if (inputMap["a"]) {
        player.moveWithCollisions(new BABYLON.Vector3(-.1,0,0))
        
        keydown = true;
      }
      if (inputMap["d"]) {
        player.moveWithCollisions(new BABYLON.Vector3(.1,0,0))
        
        keydown = true;
      }
      if (inputMap[" "]) {
        player.moveWithCollisions(new BABYLON.Vector3(0,1,0))
        keydown = true;
      }
      
      if (keydown) {
        if (!animating) {
          animating = true;
          if (inputMap["s"]) {
            //Walk backwards
            walkBackAnim.start(true);
          } else if (inputMap[" "]) {
            //Samba!
            sambaAnim.start(true);
          } else {
            //Walk
            walkAnim.start(true);
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
