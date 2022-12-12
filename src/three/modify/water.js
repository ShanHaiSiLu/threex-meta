import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

let water;
export function initWater(waterPlane) {
  waterPlane.material.side = THREE.DoubleSide;
  water = new Water(waterPlane.geometry, {
    waterNormals: new THREE.TextureLoader().load(
      "/textures/water/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xff0000,
    waterColor: 0xffffff,
    distortionScale: 3.7,
    fog: true,
  });
  waterPlane.material = water.material;

  water = waterPlane;
}

export { water };
