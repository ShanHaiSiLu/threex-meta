import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import { worldOctreeHelper, playerCapsule } from "../player/playerPhysics";
import { skeleton } from "../modify/loadModel";
import { lookatMesh } from "../player/actionAnimation";

const gui = new GUI();

export function initGui() {
  initHelpGui();
}

function initHelpGui() {
  const help = gui.addFolder("Help");
  let params = {
    八叉树: false,
    角色胶囊: playerCapsule.visible,
    角色骨骼: false,
    角色方向指示球: lookatMesh.visible,
  };
  help.add(params, "八叉树").onChange((val) => {
    worldOctreeHelper.visible = val;
  });
  help.add(params, "角色胶囊").onChange((val) => {
    playerCapsule.visible = val;
  });
  help.add(params, "角色骨骼").onChange((val) => {
    skeleton.visible = val;
  });
  help.add(params, "角色方向指示球").onChange((val) => {
    lookatMesh.visible = val;
  });

  help.close();
}

export { gui };
