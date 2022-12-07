import * as THREE from "three";

import { scene } from "./basic";
import { camera } from "./basic";
import { renderer } from "./basic";
import { orbitController } from "./basic";

import { createLight } from "./widget/light";
import { initResizeListen } from "./listen/resize";
import { loadEnv } from "./modify/loadModel";

export function init(threeWrapper) {
  threeWrapper.appendChild(renderer.domElement);
  createLight();

  // 添加事件监听
  initResizeListen(threeWrapper);
  // 加载环境模型
  loadEnv();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

export function animationRender() {
  requestAnimationFrame(animationRender);
  console.log("更新");

  renderer.render(scene, camera);
}
