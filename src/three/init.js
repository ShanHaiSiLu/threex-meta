import * as THREE from "three";
import { createScene } from "./basic/scene";
import { createCamera } from "./basic/camera";
import { createRenderer } from "./basic/renderer";

let scene, camera, renderer;

export function init(threeWrapper) {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer(threeWrapper);
}

export function animationRender() {
  requestAnimationFrame(animationRender);

  renderer.render(scene, camera);
}

export { scene, camera, renderer };
