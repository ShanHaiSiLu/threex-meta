import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

import vertexShader from "../shader/water/vertex.glsl?raw";
import fragmentShader from "../shader/water/fragment.glsl?raw";

let water;
export function initWater3(waterPlane) {
  water = waterPlane;
  water.material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(1000, 1000) },
      iMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader,
    fragmentShader,
  });

  console.log(water);
}

export function updateWater() {
  if (water)
    updateWater = () => {
      // water.material.uniforms.iTime.value += 0.005;
      water.material.uniforms.time.value += 1 / 60;
    };
}

// 使用threejs官方water类，效果不好，废弃
export function initWater(waterPlane) {
  waterPlane.material.side = THREE.DoubleSide;
  water = new Water(waterPlane.geometry, {
    waterNormals: new THREE.TextureLoader().load(
      "/textures/water/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      },
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
