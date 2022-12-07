import * as THREE from "three";
import { scene } from "../basic";

export function createLight() {
  // 环境光
  const amblight = new THREE.AmbientLight(0x404040, 2);
  scene.add(amblight);
  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(0, -1, 3);
  scene.add(directionalLight2);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(1, 1.5, 1).multiplyScalar(50);
  light.shadow.mapSize.setScalar(2048);
  light.shadow.bias = -1e-4;
  light.shadow.normalBias = 0.05;
  light.castShadow = true;

  const shadowCam = light.shadow.camera;
  shadowCam.bottom = shadowCam.left = -30;
  shadowCam.top = 30;
  shadowCam.right = 45;

  scene.add(light);
}
