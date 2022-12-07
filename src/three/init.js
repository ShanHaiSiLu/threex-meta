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
}

export function animationRender() {
  requestAnimationFrame(animationRender);

  renderer.render(scene, camera);
}
