import * as THREE from "three";
import { scene } from "./scene";

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20480
);
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

scene.add(camera);

export { camera };
