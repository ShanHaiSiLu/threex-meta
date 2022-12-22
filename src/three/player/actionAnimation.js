import * as THREE from "three";
import gsap from "gsap";

import {
  player,
  playerMixer as mixer,
  playerActions as actions,
} from "../modify/loadModel";

import { scene, camera } from "../basic";

import { addKeydownFun } from "../listen/keydown";
import { addKeyupFun } from "../listen/keyup";

// FIXME: 这个模型的Z轴朝向是模型的背后的方向！
const modelZisPlayerFace = false;

// 上一个动作，新动作（切换到的动作）
let prevAction, currentAction;

// 键盘指向
let keyAnimationDirection = new THREE.Vector3();
// 摄像机指向（动画用）
let animationCameraDirection = new THREE.Vector3();
// 角色指向
let playerAnimationDirection = new THREE.Vector3();

// 标记：修改角色指向的动画
let editPlayerDirectionTag;

// 键盘监测
let keyAnimationStates = {},
  // 因为键盘的按下事件会持续触发，所以使用此对象作为对比
  keyStatesAnimation = {};
let keyAnimations = ["KeyW", "KeyS", "KeyA", "KeyD"];

// 动画动作淡入淡出的动作时长
let switchSpeed = 0.2;

// 按下键盘后模型旋转的动作时长
let animationDuration = 0.2;

// 以player模型为中心，模型的朝向
let meshDirection = new THREE.Vector3();

// 是否正在动画转向
let isAnimationTurnTo = false;

// 模型的朝向目标
let lookatMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.1),
  new THREE.MeshStandardMaterial({ color: 0x0ff })
);
lookatMesh.visible = false;

// 初始化角色动画
export function initPlayerActionAnimation() {
  addKeydownFun((keyCode) => {
    keyAnimationStates[keyCode] = true;
  });
  addKeyupFun((keyCode) => {
    keyAnimationStates[keyCode] = false;
  });

  scene.add(lookatMesh);
}

// 切换模型法动画
function changeAction(num) {
  // 如果新动画和当前动画一致，则无动作
  if (actions[num] === currentAction) return;
  // 保存旧动画，确定新动画
  prevAction = currentAction;
  currentAction = actions[num];

  // 旧动画淡出
  prevAction.fadeOut(switchSpeed);

  // 新动作淡入
  currentAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(10)
    .fadeIn(switchSpeed)
    .play();
}

// 更新角色动画，每次场景更新时调用
export function updatePlayerAnimation() {
  if (player) {
    // 执行模型的默认动画，并惰性更新函数
    currentAction = actions[0];
    currentAction.play();

    updatePlayerAnimation = () => {
      // 更新模型动作
      if (
        keyAnimationStates["KeyW"] ||
        keyAnimationStates["KeyS"] ||
        keyAnimationStates["KeyA"] ||
        keyAnimationStates["KeyD"]
      ) {
        if (keyAnimationStates["ShiftLeft"]) changeAction(2);
        else changeAction(1);
      } else {
        return changeAction(0);
      }

      let to = updatePlayerAnimationDirection();

      updatePlayerDirectionAnimation(to);
    };
  }
}

// 获取目标方向
function updatePlayerAnimationDirection() {
  // 获取键盘指向
  if (modelZisPlayerFace) {
    keyAnimationDirection.x =
      Number(keyAnimationStates["KeyA"] || 0) -
      Number(keyAnimationStates["KeyD"] || 0);
    keyAnimationDirection.z =
      Number(keyAnimationStates["KeyW"] || 0) -
      Number(keyAnimationStates["KeyS"] || 0);
  } else {
    keyAnimationDirection.x =
      Number(keyAnimationStates["KeyD"] || 0) -
      Number(keyAnimationStates["KeyA"] || 0);
    keyAnimationDirection.z =
      Number(keyAnimationStates["KeyS"] || 0) -
      Number(keyAnimationStates["KeyW"] || 0);
  }

  // 获取摄像机的指向
  camera.getWorldDirection(animationCameraDirection);

  animationCameraDirection.y = 0;
  animationCameraDirection.x *= keyAnimationDirection.z || 1;
  animationCameraDirection.z *= keyAnimationDirection.z || 1;
  animationCameraDirection.normalize();

  let angle =
    keyAnimationStates["KeyW"] || keyAnimationStates["KeyS"]
      ? Math.PI / 4
      : Math.PI / 2;

  angle *= keyAnimationDirection.x || 1;
  angle *= keyAnimationStates[modelZisPlayerFace ? "KeyS" : "KeyW"] ? -1 : 1;

  if (keyAnimationStates["KeyA"] || keyAnimationStates["KeyD"]) {
    animationCameraDirection.applyEuler(new THREE.Euler(0, angle, 0));
  }

  return animationCameraDirection.clone();
}

// 通过模型方向和按键变动判定是否需要动画
function updatePlayerDirectionAnimation(_to) {
  // 更新角色的Z轴正方向朝向，也就是模型朝向
  player.getWorldDirection(playerAnimationDirection);

  let from = playerAnimationDirection.clone().setY(0).normalize();
  let to = _to.clone();
  let duration = animationDuration;

  let isInverse = new THREE.Vector3().addVectors(from, to);

  // 是否需要通过动画旋转模型的方向
  let isAnimation = false;

  keyAnimations.forEach((k) => {
    if (keyStatesAnimation[k] !== keyAnimationStates[k]) {
      isAnimation = true;
      keyStatesAnimation[k] = keyAnimationStates[k];
    }
  });

  /**
   * 1、常规情况下仅键盘变动时触发动画，例如某个按键按下或抬起
   * 2、如果触发动画时摄像机所视角度与模型Z轴正方向夹角过大，可能会产生模型的无动画转向问题，考虑解决方案如下：
   此方案可能出现常规切换键盘按键时也被触发等问题
   */

  if (!isAnimation) {
    // 正在动画转向则不处理
    if (isAnimationTurnTo) return;

    let angle = (from.angleTo(to) * 180) / Math.PI;
    // 这个角度设置的太小的话，很可能稍微旋转鼠标就触发了
    // 但是也不能太大，否则很明显的角度瞬移也很刺眼
    if (angle > 30) {
      // W方向与模型Z轴方向角度差过大，需要一个迅速完成的动画
      duration = 0.05;
      // console.log("夹角：" + angle + "°，需要迅速反应的动画");
    } else {
      return meshDirection.copy(to);
    }
  }

  // 反向旋转需要分两段完成
  if (isInverse.length() < 10 ** -5) {
    // 目标方向与模型Z轴方向的向量和的欧几里得长度过小，判定为角度制180°旋转
    let medianVec3 = to.clone().applyEuler(new THREE.Euler(0, Math.PI / 2, 0));

    return rotationAnimationPromise(from, medianVec3, duration / 2).then(() => {
      rotationAnimationPromise(medianVec3, to, duration / 2);
    });
  } else {
    // 可以一次动画就完成的旋转
    rotationAnimationPromise(from, to, duration);
  }
}

// Promise化的通过动画旋转模型
function rotationAnimationPromise(_from, _to, duration) {
  return new Promise((res) => {
    let from = _from.clone();
    let to = _to.clone();
    // 模型当前朝向（Z轴正方向）和目标方向之间进行插值计算时的差值因数
    let params = {
      alpha: 0,
    };

    // 新动画开始时直接将上一个动画的状态强制置位完成状态
    if (editPlayerDirectionTag) editPlayerDirectionTag.kill();
    isAnimationTurnTo = true;

    editPlayerDirectionTag = gsap.to(params, {
      alpha: 1,
      ease: "none",
      duration,
      onUpdate() {
        // 保存当前方向和目标方向之间进行插值计算的计算结果的中间量
        meshDirection.lerpVectors(from, to, params.alpha);
      },
      onComplete() {
        isAnimationTurnTo = false;
        res();
      },
    });
  });
}

export function updatePlayerLookat() {
  if (lookatMesh?.position && player?.position)
    updatePlayerLookat = () => {
      lookatMesh.position.copy(player.position.clone().add(meshDirection));
      player.lookAt(lookatMesh.position);
    };
}

export { lookatMesh };
