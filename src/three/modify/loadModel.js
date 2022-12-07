import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { scene } from "../basic";

export function loadEnv() {
  new GLTFLoader().load(
    "/model/dungeon_low_poly_game_level_challenge/scene.gltf",
    (gltf) => {
      let dungeon = gltf.scene;
      dungeon.scale.set(0.01, 0.01, 0.01);
      dungeon.position.set(0, 1, 0);
      dungeon.position.z += 75;

      scene.add(dungeon);
    }
  );
}
