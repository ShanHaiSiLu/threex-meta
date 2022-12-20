import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import { addKeydownFun } from "../listen/keydown";
import { addKeyupFun } from "../listen/keyup";

let skys = [];

let SkyNum = 0;

let scene = new THREE.Scene();

// 迷雾
// scene.fog = new THREE.FogExp2(0x000000, 0.02);
// new THREE.Fog(0x9a9a9a, 0, 128);

// 增加天空贴图
let akyLoader = new RGBELoader();
for (let i = 1; i <= 5; i++) {
  akyLoader.load(`/hdr/sky${i}.hdr`, texture => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    skys.push(texture);

    if (i === 1) {
      scene.background = texture;
      scene.environment = texture;
    }
  });
}

export function toggleSky() {
  SkyNum = SkyNum + 1 >= skys.length ? 0 : ++SkyNum;
  scene.background = skys[SkyNum];
  scene.environment = skys[SkyNum];
}

export function initToggleSky() {
  let k = {};
  addKeydownFun(code => {
    k[code] = true;

    if (k["KeyY"] && (k["ControlLeft"] || k["ControlRight"])) toggleSky();
  });
  addKeyupFun(code => {
    k[code] = false;
  });
}

export { scene };
