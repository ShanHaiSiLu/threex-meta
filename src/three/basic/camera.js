import * as THREE from "three";

export function createCamera() {
  let camera = new THREE.PerspectiveCamera(
    75,
    window.offsetWidth / window.offsetHeight,
    2 ** -10,
    10 ** 8
  );
  camera.position.set(5, 10, 15);

  return camera;
}
