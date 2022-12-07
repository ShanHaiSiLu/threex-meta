import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { camera } from "./";
import { renderer } from "./";

let orbitController = new OrbitControls(camera, renderer.domElement);

export { orbitController };
