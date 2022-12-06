<template>
  <div :ref="getRendererDom" class="three-wrapper"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { init, animationRender } from "./three/init";

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
}
</style>
