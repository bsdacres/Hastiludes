import { createEffect, onCleanup } from 'solid-js'
import { getScene } from '../../Scene'
import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
import * as Material from "@babylonjs/materials"

export const CharacterCreator = (props) => {
    createEffect(async() => {
      console.log('Model.tsx: createEffect')
  
      const scene = await getScene()
      let canvas = document.getElementById('canvas')
      var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 1.2, 2.5), scene);
      camera.attachControl(canvas, true);
      camera.fov= .9
      camera.attachControl(canvas, false);

      canvas.style.zIndex = '-1'

      scene.fogEnabled = true;
      scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      scene.fogDensity = 0.8;
      scene.fogColor = new BABYLON.Color3(0.0, 0.0, 0.0);
      scene.clearColor = scene.fogColor;
      scene.fogStart = 50.0;
      scene.fogEnd = 100.0;


      var helper = scene.createDefaultEnvironment({
        enableGroundShadow: true,
        enableGroundMirror: true,
        groundMirrorFallOffDistance: 0,
        createGround:true,
        groundSize:600,
        groundTexture: "/StoneFloorTexture.png",
        createSkybox:true
    });


        
    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, -6, -2), scene);
    light.position = new BABYLON.Vector3(20, 60, 20);
    light.shadowMinZ = 50;
    light.shadowMaxZ = 180;
    light.intensity = 3;
    light.radius=.2

    var light2 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-2, 2, 0), scene);
    light2.position = new BABYLON.Vector3(30, 20, 20);
    light2.shadowMinZ = 50;
    light2.shadowMaxZ = 180;
    light2.intensity = 2;
    var generator = new BABYLON.ShadowGenerator(512, light);

      var addShadows = function(mesh){
        mesh.receiveShadows = true;
        generator.addShadowCaster(mesh);
    }

    var addToMirror = function(mesh){
        helper.groundMirrorRenderList.push(mesh);
    }

    
    
    const mirrorTexture = new BABYLON.RenderTargetTexture('mirrorTexture', { width: 1024, height: 1024 }, scene);
    scene.customRenderTargets.push(mirrorTexture);

    // Set the mirrorPlane's material to use the RenderTargetTexture as a reflection
    const mirrorMaterial = new BABYLON.StandardMaterial('mirrorMaterial', scene);
    mirrorMaterial.reflectionTexture = mirrorTexture;
  mirrorMaterial.reflectionFresnelParameters = new BABYLON.FresnelParameters();
  mirrorMaterial.reflectionFresnelParameters.bias = 0.1;
  mirrorMaterial.reflectionFresnelParameters.power = 2;
  mirrorMaterial.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
  mirrorMaterial.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();
  
  
  var gradientMaterial = new Material.GradientMaterial("grad", scene);
  gradientMaterial.topColor = new BABYLON.Color3(0.09, 0.09, 0.09);
  gradientMaterial.bottomColor = new BABYLON.Color3(0.21, 0.21, 0.21);
  gradientMaterial.offset = 0.5;
  gradientMaterial.smoothness = 1;
  gradientMaterial.scale = 0.1
  gradientMaterial.backFaceCulling=false
  
  helper.ground.material = gradientMaterial;
  helper.skybox.material = gradientMaterial;
  
  

     
  
      // Create mutable variables for anything that needs to be accessed in the cleanup function
      let player = []
      let animationGroups = []
      let skeletons = []
      BABYLON.SceneLoader.ImportMeshAsync(
        '',
        '/',
        props.file,
        await scene,
        event => {}
      ).then(async (res) => {
        player = res.meshes;
        let hero = player[0];
        skeletons = res.skeleton;


        light.diffuse = new BABYLON.Color3(0, 0, 1);
        var smallLight = new BABYLON.PointLight("boxLight", BABYLON.Vector3.Zero(), scene);
        smallLight.diffuse = new BABYLON.Color3(0.3, 0.5, 0.8);
        smallLight.specular = smallLight.specular;
        smallLight.intensity = 2;
        smallLight.range = 5;


        
        console.log(player[0].position)
        console.log(player)
        var cameraTarget = new BABYLON.Mesh("cameraTarget", scene);
        cameraTarget.position = new BABYLON.Vector3(player[0].position.x, player[0].position.y+1, player[0].position.z);
        player[0].addChild(cameraTarget);
        camera.lockedTarget = cameraTarget
        animationGroups = res.animationGroups
        animationGroups[0].stop()
        animationGroups[1].play(true)
        let walkAnim = animationGroups[3];
        let walkBackAnim = animationGroups[3]
        let sambaAnim = animationGroups[4]
        console.log(animationGroups)
           
        addToMirror(hero);
        addShadows(hero);
  
     
      generator.useContactHardeningShadow = true;
      generator.bias = 0.01;
      generator.normalBias= 0.01;
      generator.contactHardeningLightSizeUVRatio = 0.08;
      generator.getShadowMapForRendering(true)
      generator.useBlurExponentialShadowMap = true;
      generator.blurKernel = 64;
      generator.addShadowCaster(player[0], true);
      hero.receiveShadows = true;

      
 
    
      })

      await scene.registerBeforeRender(function(){
        player.rotate += 1;
        
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
  