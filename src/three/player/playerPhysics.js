import * as THREE from "three";
import { Octree } from "three/examples/jsm/math/Octree.js";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";
import { Capsule } from "three/examples/jsm/math/Capsule.js";

import { PointerLockOrbitControls } from "../tools/PointerLockOrbitControls";

import { scene, camera, renderer, orbitController } from "../basic";

import { envModel, player } from "../modify/loadModel";

import { addKeydownFun } from "../listen/keydown";
import { addKeyupFun } from "../listen/keyup";

// 八叉树物理世界
const worldOctree = new Octree();
let worldOctreeHelper;

// 第三人称控制器
let pointerOrbitController;

const playerCollider = new Capsule(
  new THREE.Vector3(0, 0.45, 0),
  new THREE.Vector3(0, 1.45, 0),
  0.45
);
const GRAVITY = 30;
// 胶囊体形状
const geometry = new THREE.CapsuleGeometry(0.45, 1);
const material = new THREE.MeshLambertMaterial({
  color: 0xffff00,
  wireframe: true,
});
const playerCapsule = new THREE.Mesh(geometry, material);
playerCapsule.visible = false;

// 每一帧更新多少次世界
const STEPS_PER_FRAME = 15;

// 速度向量
const playerVelocity = new THREE.Vector3();
// 方向向量
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;

const keyMovementStates = {};

// 初始化角色物理世界
export function initPlayerPhysics() {
  addKeydownFun((keyCode) => {
    keyMovementStates[keyCode] = true;
  });
  addKeyupFun((keyCode) => {
    keyMovementStates[keyCode] = false;
  });

  // 胶囊实体加入场景中
  scene.add(playerCapsule);

  // 初始化第三人称控制器
  initPointerLockOrbit();
}

// 初始化第三人称控制器
function initPointerLockOrbit() {
  pointerOrbitController = new PointerLockOrbitControls(
    camera,
    renderer.domElement,
    playerCollider.end
  );

  // 垂直角度限制
  //   pointerOrbitController.maxPolarAngle = Math.PI / 2;

  // R限制
  pointerOrbitController.minDistance = 1;
  pointerOrbitController.maxDistance = 10;

  pointerOrbitController.addEventListener("lock", () => {
    orbitController.enabled = false;
  });
  pointerOrbitController.addEventListener("unlock", () => {
    orbitController.enabled = true;
  });
}

// 锁定指针，进入控制状态
export function pointerLock() {
  pointerOrbitController.lock();
}

// 更新角色位置（胶囊位置）
export function updatePlayerCapsulePosition() {
  if ((envModel, player))
    updatePlayerCapsulePosition = (deltaTimes) => {
      const deltaTime = Math.min(0.05, deltaTimes) / STEPS_PER_FRAME;

      for (let i = 0; i < STEPS_PER_FRAME; i++) {
        updateControlsForKey(deltaTime);

        updatePlayer(deltaTime);
      }
    };
}

// 得到向前向量
function getForwardVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();

  return playerDirection;
}

// 得到边向量
function getSideVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(camera.up);

  return playerDirection;
}

// 根据键盘更新趋向的方向
function updateControlsForKey(deltaTime) {
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

  if (keyMovementStates["KeyW"]) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  }

  if (keyMovementStates["KeyS"]) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
  }

  if (keyMovementStates["KeyA"]) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
  }

  if (keyMovementStates["KeyD"]) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
  }

  if (playerOnFloor) {
    if (keyMovementStates["Space"]) {
      playerVelocity.y = 15;
    }
  }
}

// 更新摄像机位置
function updatePlayer(deltaTime) {
  // 阻尼
  let damping = Math.exp(-4 * deltaTime) - 1;

  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;

    damping *= 0.1;
  }

  playerVelocity.addScaledVector(playerVelocity, damping * 10);

  const deltaPosition = playerVelocity
    .clone()
    .multiplyScalar(deltaTime * (keyMovementStates["ShiftLeft"] ? 10 : 5));
  playerCollider.translate(deltaPosition);

  playerCollisions();

  playerCapsule.position.lerpVectors(
    playerCollider.end,
    playerCollider.start,
    0.5
  );
  player.position.copy(playerCollider.start);
  player.position.y -= 0.45;
}

// 用户碰撞检测
function playerCollisions() {
  const result = worldOctree.capsuleIntersect(playerCollider);

  playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;

    if (!playerOnFloor) {
      playerVelocity.addScaledVector(
        result.normal,
        -result.normal.dot(playerVelocity)
      );
    }

    playerCollider.translate(result.normal.multiplyScalar(result.depth));
  }
}

// 跌落世界处理
export function teleportPlayerIfOob() {
  if (player)
    teleportPlayerIfOob = () => {
      if (player.position.y <= -25) {
        playerCollider.start.set(0, 0.45, 0);
        playerCollider.end.set(0, 1.45, 0);

        // camera.position.copy(playerCollider.end);
        // camera.position.y += 3;
        // camera.rotation.set(0, 0, 0);
      }
    };
}

// 创建八叉树辅助元素
export function initOctreeHelper() {
  worldOctreeHelper = new OctreeHelper(worldOctree);
  worldOctreeHelper.visible = false;
  scene.add(worldOctreeHelper);
}

export {
  worldOctree,
  pointerOrbitController,
  worldOctreeHelper,
  playerCapsule,
};
