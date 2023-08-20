import { createEffect, onCleanup } from 'solid-js'
import { getScene } from '../../Scene'
import * as BABYLON from "@babylonjs/core"
import * as Mat from "@babylonjs/materials"
import "@babylonjs/loaders"


const m4URL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/m4a1.obj';
const ybotURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/ybot.babylon';
const towerURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/tower%20obj/Tower-House%20Design.obj';
const streetURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/street/Street%20environment_V01.obj';



export const Character = () => {
    createEffect(async () => {
        const m4URL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/m4a1.obj';
        const ybotURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/ybot.babylon';
        const towerURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/tower%20obj/Tower-House%20Design.obj';
        const streetURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/street/Street%20environment_V01.obj';
        
        
        
        var firstPerson = false;
        
        //animations
        var skeleton = null;
        var ak47 = null;
        
        var idleAnim = null;
        var walkAnim = null;
        var runAnim = null;
        var sprintAnim = null;
        var jumpAnim = null;
        
        //variables
        var animationBlend = 0.005;
        var mouseSensitivity = 0.005;
        var cameraSpeed = 0.0075;
        var walkSpeed = 0.001;
        var runSpeed = 0.005;
        var sprintSpeed = 0.008;
        var jumpSpeed = 0.1;
        var jumpHeight = 0.5;
        var gravity = new BABYLON.Vector3(0, -0.5, 0);
        
        //in-game changed variables
        var speed = 0;
        var vsp = 0;
        var jumped = false;
        var mouseX = 0, mouseY = 0;
        var mouseMin = -35, mouseMax = 45;
        
        let scene = await getScene();
        let engine = await scene.getEngine()   
        
        
            // This creates a basic Babylon Scene object (non-mesh)
            
            scene.collisionsEnabled = true;
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        
            scene.fogEnabled = true;
            scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
            scene.fogDensity = 0.01;
            scene.fogColor = new BABYLON.Color3(0.8, 0.9, 1.0);
            scene.clearColor = scene.fogColor;
        
        
        
            // This creates and positions a free camera (non-mesh)
            var camera = new BABYLON.UniversalCamera("camera", BABYLON.Vector3.Zero(), scene);
            camera.inputs.clear();
            camera.minZ = 0;
        
        
        
            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var hemLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            hemLight.intensity = 0.7;
            hemLight.specular = BABYLON.Color3.Black();
            hemLight.groundColor = scene.clearColor.scale(0.75);
        
            var dirLight = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
            dirLight.position = new BABYLON.Vector3(0, 130, 130);

            var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
            let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("environment4.env", scene);
            lighting.name = "runyonCanyon";
            scene.environmentTexture = lighting;
            console.log(scene.environmentIntensity)
            scene.createDefaultSkybox(scene.environmentTexture, true, (scene.activeCamera.maxZ - scene.activeCamera.minZ)/2, 0.3, false);
        
            // Shadows
            var shadowGenerator = new BABYLON.ShadowGenerator(3072, dirLight);
            shadowGenerator.usePercentageCloserFiltering = true;
        
        
            var helper = scene.createDefaultEnvironment({
                enableGroundShadow: true,
                enableGroundMirror: true,
                groundMirrorFallOffDistance: 0,
                groundSize: 150,
            });
            helper.setMainColor(scene.clearColor);
            helper.groundMaterial.diffuseTexture = null;
            helper.groundMaterial.alpha = 1;
            helper.groundMaterial.fogEnabled = true;
        
        
            var addShadows = function(mesh){
                mesh.receiveShadows = true;
                shadowGenerator.addShadowCaster(mesh);
            }
        
            var addToMirror = function(mesh){
                helper.groundMirrorRenderList.push(mesh);
            }
            
        
        
        
        
        
        
        
        
        
        
            //tps
            const dsm = new BABYLON.DeviceSourceManager(engine);
            var deltaTime = 0;
        
        
        
        
            //character nodes
            var main = new BABYLON.Mesh("parent", scene);
            var target = new BABYLON.TransformNode();
            var character = new BABYLON.Mesh("character", scene);
        
        
        
        
            //camera setups
            var firstPersonCamera = {
                middle: {
                    position: new BABYLON.Vector3(0, 1.75, 0.25),
                    fov: 1.25,
                    mouseMin: -45,
                    mouseMax: 45
                }
            };
        
            var thirdPersonCamera = {
                middle: {
                    position: new BABYLON.Vector3(0, 1.35, -5),
                    fov: 0.8,
                    mouseMin: -5,
                    mouseMax: 45
                },
                leftRun: {
                    position: new BABYLON.Vector3(0.7, 1.35, -4),
                    fov: 0.8,
                    mouseMin: -35,
                    mouseMax: 45
                },
                rightRun: {
                    position: new BABYLON.Vector3(-0.7, 1.35, -4),
                    fov: 0.8,
                    mouseMin: -35,
                    mouseMax: 45
                },
                far: {
                    position: new BABYLON.Vector3(0, 1.5, -6),
                    fov: 1.5,
                    mouseMin: -5,
                    mouseMax: 45
                }
            };
        
            function switchCamera(type){
                camera.position = type.position.divide(camera.parent.scaling);
                camera.fov = type.fov;
                mouseMin = type.mouseMin,
                mouseMax = type.mouseMax
            }
        
        
        
        
        
            var smallLight = new BABYLON.PointLight("boxLight", BABYLON.Vector3.Zero(), scene);
            smallLight.diffuse = new BABYLON.Color3(0.3, 0.5, 0.8);
            smallLight.specular = smallLight.specular;
            smallLight.intensity = 1;
            smallLight.range = 5;
        
        
        
            
        
        
        
            //character
            engine.displayLoadingUI();
            
            BABYLON.SceneLoader.ImportMeshAsync("", "/", "GirlAnimation.glb" , scene).then((res)=>{
                skeleton = res.skeletons[0];
                var body = res.meshes[0];
                
                body.parent = character;
        
                // BABYLON.SceneLoader.ImportMesh("", "", m4URL, scene, function (newMeshes)
                // {
                //     m4 = newMeshes[0];
                //     m4.scaling = new BABYLON.Vector3(3, 3, 3);
                //     m4.setPivotPoint(new BABYLON.Vector3(4.5, 0.5, -2), BABYLON.Space.Local);
        
                //     m4.detachFromBone();
                //     skeleton.prepare();
                //     m4.attachToBone(skeleton.bones[37], body);
        
                //     //m4.position = new BABYLON.Vector3(0.45, -0.05, -0.2).divide(body.scaling);
                //     m4.rotation = new BABYLON.Vector3(
                //         BABYLON.Tools.ToRadians(180),
                //         BABYLON.Tools.ToRadians(-90),
                //         BABYLON.Tools.ToRadians(90),
                //     );
                // });
                
        
        
          
        
        
                addToMirror(character);
                addShadows(character);
        
        

        
                idleAnim = res.animationGroups[1];
                walkAnim = res.animationGroups[3];
                runAnim = res.animationGroups[3];
                sprintAnim = res.animationGroups[3];
                //jumpAnim = scene.beginWeightedAnimation(skeleton, jumpRange.from+1, jumpRange.to, 0, true);
                
        
                main.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
                main.ellipsoidOffset = new BABYLON.Vector3(0, main.ellipsoid.y, 0);
                main.checkCollisions = true;
                //debug: 
                //drawEllipsoid(main);
        
        
                smallLight.parent = main;
                character.parent = main;
                target.parent = main;
        
                if (firstPerson == true){
                    camera.parent = character;
                    switchCamera(firstPersonCamera.middle);
                }else{
                    camera.parent = target;
                    switchCamera(thirdPersonCamera.middle);
                }
        
                main.position = new BABYLON.Vector3(10,0,10);
        
        
                engine.hideLoadingUI();
            }) 
       
        
        
        
        
            scene.registerBeforeRender(function()
            {
                deltaTime = engine.getDeltaTime();
        
                updateCamera();
                
                if (character != null){
                    var keyboard = dsm.getDeviceSource(BABYLON.DeviceType.Keyboard);
                    var mouse = dsm.getDeviceSource(BABYLON.DeviceType.Mouse);
                    if (keyboard)
                    {
                        if (firstPerson == true){
                            firstPersonMovement(
                                keyboard.getInput(87), //W
                                keyboard.getInput(83), //S
                                keyboard.getInput(65), //A
                                keyboard.getInput(68), //D
                                keyboard.getInput(16), //Shift
                            );
                        }else{
                            thirdPersonMovement(
                                keyboard.getInput(87), //W
                                keyboard.getInput(83), //S
                                keyboard.getInput(65), //A
                                keyboard.getInput(68), //D
                                keyboard.getInput(32), //Space
                                keyboard.getInput(16), //Shift
                            );
                        }
                    }
                }
            });
        
        
        
            
            var mouseMove = function(e)
            {
                var movementX = e.movementX ||
                        e.mozMovementX ||
                        e.webkitMovementX ||
                        0;
        
                var movementY = e.movementY ||
                        e.mozMovementY ||
                        e.webkitMovementY ||
                        0;
                
                mouseX += movementX * mouseSensitivity * deltaTime;
                mouseY += movementY * mouseSensitivity * deltaTime;
                mouseY = clamp(mouseY, mouseMin, mouseMax);
            }
            
        
        
        
      
        
              function updateCamera()
            {
                target.rotation = lerp3(
                    target.rotation, 
                    new BABYLON.Vector3(
                        BABYLON.Tools.ToRadians(mouseY),
                        BABYLON.Tools.ToRadians(mouseX), 0
                    ), cameraSpeed*deltaTime
                );
            }
        
     
            function thirdPersonMovement(up, down, left, right, jump, run)
            {
                var directionZ = up-down;
                var directionX = right-left;
        
                var vectorMove = BABYLON.Vector3.Zero();
                var direction = Math.atan2(directionX, directionZ);
        
                var currentState = idleAnim;
                
        
                //move
                if (directionX != 0 || directionZ != 0)
                {
                    if (run != 1)
                    {
                        currentState = runAnim;
                        speed = lerp(speed, runSpeed, runAnim.weight);
                    }else{
                        currentState = sprintAnim;
                        speed = lerp(speed, sprintSpeed, sprintAnim.weight);
                    }
        
                    var rotation = (target.rotation.y+direction) % 360;
                    character.rotation.y = lerp(
                        character.rotation.y, rotation, 0.25
                    );
                    
                    vectorMove = new BABYLON.Vector3(
                        (Math.sin(rotation)), 0,
                        (Math.cos(rotation))
                    );
                }else{
                    speed = lerp(speed, 0, 0.001);
                }
        
        
                //jump
                // if (jump == 1 && jumped == false)
                // {
                //     jumped = true;
                // }
                // if (jumped == true)
                // {
                //     // if (vsp < jumpHeight){
                //     //     vsp += jumpHeight/10;
                //     // }else{
                //     //     vsp += gravity.y/10;
                //     //     vsp = Math.min(vsp, gravity.y);
                //     //     if (vsp == gravity.y){
                //     //         vsp = gravity.y;
                //     //         jumped = false;
                //     //     }
                //     // }
                //     var rr = skeleton.getAnimationRange("None_Jump");
                //     var a = scene.beginAnimation(skeleton, rr.from+1, rr.to, false, 1, function(){
                //         jumped = false;console.log("stopped "+rr.from+1+" "+rr.to);
                //     });
                // }else{
                //     vsp = gravity.y;
                // }
        
        
                var m = vectorMove.multiply(new BABYLON.Vector3().setAll( speed*deltaTime ));
                main.moveWithCollisions( m.add(new BABYLON.Vector3(0, vsp, 0)) );
                
        
                switchAnimation(currentState);
            }
        
        
        
        
            function firstPersonMovement(up, down, left, right, run)
            {
                var directionZ = up-down;
                var directionX = right-left;
        
                var vectorMove = BABYLON.Vector3.Zero();
                var direction = Math.atan2(directionX, directionZ);
        
                var currentState = idleAnim;
        
        
                if (directionX != 0 || directionZ != 0){
                    if (up == 1){
                        if (run != 1)
                        {
                            currentState = walkAnim;
                            speed = lerp(speed, walkSpeed, walkAnim.weight);
                        }else{
                            currentState = runAnim;
                            speed = lerp(speed, runSpeed, runAnim.weight);
                        }
                    }else{
                        // currentState = "walk";
                        // speed = lerp(speed, walkSpeed, walkAnim.weight);
                    }
        
                    vectorMove = new BABYLON.Vector3(
                        (Math.sin( (target.rotation.y + direction) - BABYLON.Tools.ToRadians(180) )), 0,
                        (Math.cos( (target.rotation.y + direction) - BABYLON.Tools.ToRadians(180) ))
                    );
                }
        
                character.rotation.y = target.rotation.y - BABYLON.Tools.ToRadians(180);
                camera.rotation.x = target.rotation.x;
        
                var m = vectorMove.multiply(new BABYLON.Vector3().setAll( speed*deltaTime ));
                main.moveWithCollisions( m.add(gravity) );
        
                switchAnimation(currentState);
            }
        
        
        
        
            function switchAnimation(anim)
            {
                var anims = [idleAnim, runAnim, walkAnim, sprintAnim];
                
                if (idleAnim != undefined){
                    for (var i=0; i<anims.length; i++)
                    {
                        if (anims[i] == anim){
                            anims[i].weight += animationBlend * deltaTime;
                        }else{
                            anims[i].weight -= animationBlend * deltaTime;
                        }
        
                        anims[i].weight = clamp(anims[i].weight, 0.0, 1.0);
                    }
                }
            }
        
        
        
        
            //tools
            function clamp(value, min, max)
            {
                return (Math.max(Math.min(value, max), min));
            }
        
            function lerp(start, end, speed)
            {
                return (start + ((end - start) * speed));
            }
        
            function lerp3(p1, p2, t)
            {
                    var x = lerp(p1.x, p2.x, t);
                    var y = lerp(p1.y, p2.y, t);
                    var z = lerp(p1.z, p2.z, t);
        
                    return new BABYLON.Vector3(x, y, z);
            }
        
        
        
        
            
            //mouse lock
            // Configure all the pointer lock stuff
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
        
        
            setupPointerLock();
            scene.detachControl();
        
        
        
        
        
        
        
        
        
        
            //scenery
            var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
            box.position = new BABYLON.Vector3(8, 1, 8);
            addToMirror(box);
            addShadows(box);
            box.material = new BABYLON.StandardMaterial("lightBox", scene);
            box.material.emissiveColor = smallLight.diffuse;
        
            var boxLight = smallLight.clone();
            boxLight.parent = box;
        
            // var tower = null;
            BABYLON.SceneLoader.ImportMesh("", "", towerURL, scene, function (newMeshes)
            {
                tower = BABYLON.Mesh.MergeMeshes(newMeshes, true, true, false, false, false);
                tower.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
                tower.position = new BABYLON.Vector3(0, -0.1, 2);
                addToMirror(tower);
                addShadows(tower);
        
                tower.checkCollisions = true;
            });
        
            var street = null;
            BABYLON.SceneLoader.ImportMesh("", "", streetURL, scene, function (newMeshes)
            {
                street = BABYLON.Mesh.MergeMeshes(newMeshes, true, true, false, false, false);
                street.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
                street.position = new BABYLON.Vector3(0, -0.1, 0);
                addToMirror(street);
                addShadows(street);
        
                street.checkCollisions = true;
            });
            
        
        
            
            helper.ground.checkCollisions = true;
            helper.skybox.checkCollisions = true;
            box.checkCollisions = true;
        
        
        
            
        
        
            
        
            var gl = new BABYLON.GlowLayer("gl", scene);
         
            
        
        
        
        
        
        
        
        
        
        
        //shaders
        
        
        
        
        
        //debug
        // Ellipsoid 
        function drawEllipsoid(mesh) {
            mesh.computeWorldMatrix(true);
            var ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
            if (! ellipsoidMat) { 
                ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
                ellipsoidMat.wireframe = true;
                ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
                ellipsoidMat.specularColor = BABYLON.Color3.Black();
            }
            var ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
            ellipsoid.scaling = mesh.ellipsoid.clone();
            ellipsoid.scaling.y *= 2;
            ellipsoid.scaling.x *= 2;
            ellipsoid.scaling.z *= 2;
            ellipsoid.material = ellipsoidMat;
            ellipsoid.parent = mesh;
            ellipsoid.position = mesh.ellipsoidOffset.clone();
            ellipsoid.computeWorldMatrix(true);
        }
      onCleanup(() => {
        console.log('Light.tsx: onCleanup')
        light.dispose()
      })
    })
  
    return null
  }