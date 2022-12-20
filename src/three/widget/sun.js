import * as THREE from "three";
import { scene } from "../basic";

let sun;

export function createSun() {
  sun = new Sun(0xff0000);

  sun.setPosition(5, 250, -2);

  scene.add(sun.light);
  scene.add(sun.mesh);
}

class Sun {
  light; // 点光源
  mesh; // 球体
  constructor(color) {
    this.light = new THREE.PointLight(0xffffff, 0.5, 2048);
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshBasicMaterial({ color })
    );

    this.mesh.scale.set(0.1, 0.1, 0.1);

    // this.light.castShadow = true;
    // this.light.shadow.mapSize.width = 2048;
    // this.light.shadow.mapSize.height = 2048;
  }

  setPosition(x, y, z) {
    this.light.position.set(x, y, z);
    this.mesh.position.set(x, y, z);
  }
}

export { sun };
