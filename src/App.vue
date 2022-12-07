<template>
  <div :ref="getRendererDom" class="three-wrapper"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { init, animationRender } from "./three/init";
import * as THREE from "three";

let threeWrapper;

function getRendererDom(el) {
  threeWrapper = el;
}

onMounted(() => {
  init(threeWrapper);
  animationRender();
  // test();
});

function test() {
 
}
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
