import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { scene } from "../basic";
import { initWater } from "./water";
import { worldOctree, initOctreeHelper } from "../player/playerPhysics";

let envModel;
let player,
  skeleton,
  playerMixer,
  playerActions = [];

let path_prefix = import.meta.env.VITE_PUBLIC_PATH || "";

export function loadEnv() {
  new GLTFLoader().load(path_prefix + "/model/world.glb", gltf => {
    envModel = gltf.scene;
    scene.add(envModel);
    envModel.position.y -= 20;

    envModel.traverse(child => {
      // 铺设阴影
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

      if (child.name.includes("Plane003")) {
        // 水面处理
        initWater(child);
      } else {
        // child.visible = false;
      }

      // 物理模型处理
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
  new GLTFLoader().load(path_prefix + "/model/soldier.glb", gltf => {
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
