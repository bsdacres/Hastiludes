import { createEffect, onCleanup } from 'solid-js'
import { getScene } from '../../Scene'
import * as BABYLON from "@babylonjs/core"
import "@babylonjs/loaders"
import * as Material from "@babylonjs/materials"
import { Inspector } from '@babylonjs/inspector';
import style from "./UI.module.css"

export const CharacterCreator = (props) => {
    createEffect(async() => {
      console.log('Model.tsx: createEffect')
  
      const scene = await getScene()
      let canvas = document.getElementById('canvas')
      let camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, .9, -2.5), scene);
      camera.inputs.clear();
     // camera.fov= 1.2
      camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5)
      camera.speed =.01

      canvas.className = "canvas"
      canvas.style.zIndex = '-1'
   



     
  
      // Create mutable variables for anything that needs to be accessed in the cleanup function
      let player = []
      let animationGroups = []
      let skeletons = []
    
      const hdrRotation = 10; // in degrees

      
      
      let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("environment4.env", scene);
      lighting.name = "runyonCanyon";
      scene.environmentTexture = lighting;
      console.log(scene.environmentIntensity)
      var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
      light2.position = new BABYLON.Vector3(0, 4, 3);
      light2.radius = 10;
      scene.clearColor = new BABYLON.Color4(0,0,0,.99);
      scene.environmentIntensity = .7
    



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
        hero.rotation.y  =  Math.PI
        hero.position.x = +.75
        hero.lookAt(camera.position)
        hero.rotation.x =0
        
        console.log(player[0].position)
        console.log(player)
        var cameraTarget = new BABYLON.Mesh("cameraTarget", scene);
        cameraTarget.position = new BABYLON.Vector3(player[0].position.x, player[0].position.y+1, player[0].position.z);
        player[0].addChild(cameraTarget);
      
        animationGroups = res.animationGroups
        animationGroups[0].stop()
        animationGroups[1].play(true)
        let walkAnim = animationGroups[3];
        let walkBackAnim = animationGroups[3]
        let sambaAnim = animationGroups[4]
        console.log(animationGroups)


        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 64;
        shadowGenerator.addShadowCaster(hero, true);
        shadowGenerator.forceBackFacesOnly = true;
        

        const ground = BABYLON.MeshBuilder.CreateGround("ground",{width: 1000, height: 1000}, scene)
        var groundmat = new BABYLON.PBRMaterial("mat", scene)
        groundmat.albedoTexture = new BABYLON.Texture("/textures/older-wood-flooring_albedo.png", scene)
        groundmat.bumpTexture = new BABYLON.Texture("/textures/older-wood-flooring_normal-ogl.png", scene)
        
    
        ground.receiveShadows = true
        ground.material = groundmat
        groundmat.metallic = 0;
        groundmat.roughness = 1;
        groundmat.albedoTexture.uScale = 200;
        groundmat.albedoTexture.vScale = 200;
    //  
    //    ground.material.needAlphaBlending = () => true;
    //
    //    ground.material._saveCustomShaderNameResolve = ground.material.customShaderNameResolve.bind(ground.material);
    //    ground.material.customShaderNameResolve = function(shaderName, uniforms, uniformBuffers, samplers, defines, attributes, options) {
    //        options.processFinalCode = (type, code) => {
    //            if (type === "vertex") {
    //                return code;
    //            }-.5
    //            code = code.replace(/float shadow=1.;/, "float shadow=1.;\r\nfloat globalShadow = 0.;\r\nfloat shadowLightCount = 0.;");
    //            code = code.replace(
    //                    /diffuseBase\+=info\.diffuse\*shadow;/g,
    //                    "globalShadow += shadow;\r\nshadowLightCount += 1.;\r\ndiffuseBase+=info.diffuse*shadow;"
    //                );
    //            return code;
    //        };
    //
    //        return ground.material._saveCustomShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attributes, options);
    //    }
    //
//
    //
//
    //
    //const enableTransparent = (ground, scene) => {
    //    const groundTexture = "https://i.ibb.co/M2fY1Gc/transparent-Ground-Diffuse.png"
    //
    //    ground.material.Fragment_Before_FragColor(`
    //        globalShadow = globalShadow / shadowLightCount;
    //        if (globalShadow < 1.) {
    //            color = mix(vec4(0., 0., 0., 1. - globalShadow), vec4(color.rgb, reflectionColor.a), pow(globalShadow, 0.25));
    //        } else {
    //            color.a = reflectionColor.a;
    //        }
    //    `);
    //
    //    ground.material.diffuseColor = new BABYLON.Color4(0, 1, 0, 1);
    //    //ground.material.diffuseTexture = new BABYLON.Texture(groundTexture, scene)
    //}
    //
    //const enableGradient = (ground, scene) => {
    //    const groundTexture = "https://assets.babylonjs.com/environments/backgroundGround.png"
    //
    //    ground.material.diffuseTexture = new BABYLON.Texture(groundTexture, scene)
    //    ground.material.diffuseTexture.gammaSpace = false
    //    ground.material.diffuseTexture.hasAlpha = true
    //    ground.material.useAlphaFromDiffuseTexture = true;
    //}
    //
    //const enableMirror = (model, ground, scene) => {
    //    ground.material.reflectionTexture = new BABYLON.MirrorTexture("mirrorTexture", 1024, scene, true)
    //    ground.material.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -4, 0, 0)
    //
    //    ground.material.reflectionTexture.adaptiveBlurKernel = 64
    //    ground.material.reflectionTexture.level = 1
    //    
    //    ground.material.reflectionTexture.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    //  
    //    for (let index = 0; index < model.length; index++) {
    //      ground.material.reflectionTexture.renderList.push(model[index])
    //    }
    //}
  
   // enableTransparent(ground, scene)
    //enableGradient(ground, scene)
   // enableMirror(player, ground, scene)
    
         
       
         
   
 
    
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
  