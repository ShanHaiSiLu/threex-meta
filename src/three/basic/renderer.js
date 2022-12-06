import * as THREE from "three";

export function createRenderer(threeWrapper) {
  let renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(threeWrapper.offsetWidth, threeWrapper.offsetHeight);
  renderer.shadowMap.enabled = true;

  renderer.background = 0x000000; 

  threeWrapper.appendChild(renderer.domElement);

  return renderer;
}
