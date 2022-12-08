import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { scene } from "../basic";
import { worldOctree, initOctreeHelper } from "../player/playerPhysics";

let envModel;
let player,
  skeleton,
  playerMixer,
  playerActions = [];

export function loadEnv() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  new GLTFLoader()
    .setDRACOLoader(dracoLoader)
    .load("/model/world.glb", (gltf) => {
      envModel = gltf.scene;
      scene.add(envModel);
      envModel.position.y -= 20;

      envModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

        if (child.hasOwnProperty("userData")) {
          if (child.userData.hasOwnProperty("data")) {
            if (child.userData.data === "physics") {
              child.visible = false;
              worldOctree.fromGraphNode(child);
            }
          }
        }
      });

      initOctreeHelper();
    });
}

export function loadPlayer() {
  new GLTFLoader().load("/model/soldier.glb", (gltf) => {
    player = gltf.scene;
    scene.add(player);

    player.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });

    // 添加骨骼辅助
    skeleton = new THREE.SkeletonHelper(player);
    skeleton.visible = false;
    scene.add(skeleton);

    // 模型动画动作提取
    const animations = gltf.animations;

    playerMixer = new THREE.AnimationMixer(player);

    playerActions.push(playerMixer.clipAction(animations[0]));
    playerActions.push(playerMixer.clipAction(animations[3]));
    playerActions.push(playerMixer.clipAction(animations[1]));
  });
}

export { envModel, player, playerMixer, playerActions, skeleton };
