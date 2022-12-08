<template>
  <div :ref="getRendererDom" class="three-wrapper" @click="pointerLock"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";

import { init, animationRender } from "./three/init";
import { pointerLock } from "./three/player/playerPhysics";

let threeWrapper;

function getRendererDom(el) {
  threeWrapper = el;
}

onMounted(() => {
  init(threeWrapper);
  animationRender();
});
</script>

<style>
.three-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
