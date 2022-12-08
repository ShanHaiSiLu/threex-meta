import * as THREE from "three";

import { scene } from "./basic";
import { camera } from "./basic";
import { renderer } from "./basic";
import { orbitController } from "./basic";

import { createLight } from "./widget/light";
import { initResizeListen } from "./listen/resize";
import { loadEnv, loadPlayer, playerMixer } from "./modify/loadModel";
import { initGui, gui } from "./widget/gui";

import { initKeydownListen } from "./listen/keydown";
import { initKeyupListen } from "./listen/keyup";

import {
  initPlayerActionAnimation,
  updatePlayerAnimation,
  updatePlayerLookat,
} from "./player/actionAnimation";
import {
  initPlayerPhysics,
  updatePlayerCapsulePosition,
  pointerOrbitController,
  teleportPlayerIfOob,
} from "./player/playerPhysics";

let clock = new THREE.Clock();

export function init(threeWrapper) {
  threeWrapper.appendChild(renderer.domElement);
  createLight();

  // 添加事件监听
  initResizeListen(threeWrapper);
  initKeydownListen();
  initKeyupListen();
  // 加载环境模型
  loadEnv();
  // 加载角色
  loadPlayer();

  // 初始化角色动画
  initPlayerActionAnimation();
  // 初始化角色物理世界
  initPlayerPhysics();

  // 初始化gui控件
  initGui();

  let axesHelper = new THREE.AxesHelper(3.3);
  scene.add(axesHelper);
}

export function animationRender() {
  requestAnimationFrame(animationRender);

  // 更新渲染器
  renderer.render(scene, camera);

  let deltaTimes = clock.getDelta();

  // 更新角色的动画动作
  updatePlayerAnimation();
  // 更新角色位置
  updatePlayerCapsulePosition(deltaTimes);
  // 更新模型朝向
  updatePlayerLookat();
  // 模型跌落处理
  teleportPlayerIfOob();

  // 更新模型动画
  playerMixer && playerMixer.update(deltaTimes);
  // 更新第三人称控制器
  if (pointerOrbitController.isLocked) {
    pointerOrbitController.update();
  }
}
