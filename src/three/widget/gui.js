import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import { worldOctreeHelper, playerCapsule } from "../player/playerPhysics";
import { skeleton } from "../modify/loadModel";
import { lookatMesh } from "../player/actionAnimation";
import { changeTimeCoefficient } from "../init";
import { changeTH, changeSD } from "../player/playerPhysics";

import { playerToHeight } from "../player/playerPhysics";
import { toggleSky } from "../basic/scene";

const gui = new GUI();

export function initGui() {
  initHelpGui();

  initWorldGui();

  initPlayerGui();

  initFunGui();
}

function initHelpGui() {
  const help = gui.addFolder("辅助工具");
  let params = {
    八叉树: false,
    角色胶囊: playerCapsule.visible,
    角色骨骼: false,
    角色方向指示球: lookatMesh.visible,
  };
  help.add(params, "八叉树").onChange(val => {
    worldOctreeHelper.visible = val;
  });
  help.add(params, "角色胶囊").onChange(val => {
    playerCapsule.visible = val;
  });
  help.add(params, "角色骨骼").onChange(val => {
    skeleton.visible = val;
  });
  help.add(params, "角色方向指示球").onChange(val => {
    lookatMesh.visible = val;
  });

  help.close();
}

function initWorldGui() {
  const world = gui.addFolder("世界参数");
  let params = {
    时间系数: 1,
  };

  world.add(params, "时间系数", 0, 2, 0.00001).onChange(changeTimeCoefficient);

  world.close();
}

function initPlayerGui() {
  const player = gui.addFolder("角色参数");
  let params = {
    移动速度: 5,
    跳跃高度: 15,
    动画速度: 1,
  };

  player.add(params, "移动速度", 0, 10, 1).onChange(changeSD);
  player.add(params, "跳跃高度", 0, 30, 1).onChange(changeTH);

  player.close();
}

function initFunGui() {
  const fun = gui.addFolder("辅助功能");

  let params = {
    "移动到高处（快捷键：ctrl + B）": playerToHeight,
    "切换天空（快捷键：ctrl + Y）": toggleSky,
  };

  fun.add(params, "移动到高处（快捷键：ctrl + B）");
  fun.add(params, "切换天空（快捷键：ctrl + Y）");

  fun.close();
}

export { gui };
