<template>
  <div :ref="getRendererDom" class="three-wrapper" @click="pointerLock" />

  <div class="load-animation" v-if="!isLoadEnd">
    <div class="plan">
      <span>Loading...</span>
      <div class="circle">
        <div class="ring"></div>
      </div>
    </div>
  </div>

  <div class="tab-tips" v-show="!isTab">按Tab查看操作提示</div>
  <div class="tab-tips-plane" v-show="isTab">
    <li>
      <span class="key-code">W</span>
      <span class="text">前进</span>
    </li>
    <li>
      <span class="key-code">S</span>
      <span class="text">后退</span>
    </li>
    <li>
      <span class="key-code">A</span>
      <span class="text">左移</span>
    </li>
    <li>
      <span class="key-code">D</span>
      <span class="text">右移</span>
    </li>
    <li>
      <span class="key-code">空格</span>
      <span class="text">跳跃</span>
    </li>
    <li>
      <span class="key-code">Shift</span>
      <span class="text">加速</span>
    </li>
    <li>
      <span class="key-code">Ctrl</span>
      <span class="add">+</span>
      <span class="key-code">B</span>
      <span class="text">移动到高处</span>
    </li>
    <li>
      <span class="key-code">Ctrl</span>
      <span class="add">+</span>
      <span class="key-code">Y</span>
      <span class="text">切换天气</span>
    </li>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

import { init, animationRender } from "./three/init";
import { pointerLock } from "./three/player/playerPhysics";
import { loadingEndFun } from "./three/widget/loading";
import { addKeydownFun } from "./three/listen/keydown";
import { addKeyupFun } from "./three/listen/keyup";

let isLoadEnd = ref(false);
let isTab = ref(false);

loadingEndFun.push(() => {
  isLoadEnd.value = true;
});

let threeWrapper;

function getRendererDom(el) {
  threeWrapper = el;
}

onMounted(() => {
  init(threeWrapper);
  animationRender();

  addTabKeyFun();
});

function addTabKeyFun() {
  addKeydownFun(code => {
    if (!isLoadEnd.value) return;

    if (code === "Tab") isTab.value = true;
  });

  addKeyupFun(code => {
    if (code === "Tab") isTab.value = false;
  });
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

.load-animation {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #1f212694;
  z-index: 100000;
}
.load-animation .plan {
  position: absolute;
  left: 45%;
  top: 30%;
  height: 150px;
  width: 250px;
  transform: scale(2);
  -webkit-box-reflect: below 1px linear-gradient(transparent, rgb(7, 15, 26));
}
.load-animation .plan span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: rgb(20, 129, 202);
  text-shadow: 0 0 10px rgb(20, 129, 202), 0 0 30px rgb(20, 129, 202),
    0 0 60px rgb(20, 129, 202), 0 0 100px rgb(20, 129, 202);
  font-size: 18px;
  z-index: 1;
}

.load-animation .plan .circle {
  position: relative;
  margin: 0 auto;
  height: 150px;
  width: 150px;
  background-color: rgb(13, 10, 37);
  border-radius: 50%;
  animation: zhuan 2s linear infinite;
}
.load-animation .plan .circle::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-color: rgb(7, 15, 26);
  border-radius: 50%;
}
.load-animation .plan .ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 75px;
  height: 150px;
  background-image: linear-gradient(180deg, rgb(22, 121, 252), transparent 80%);
  border-radius: 75px 0 0 75px;
}
.load-animation .plan .ring::after {
  content: "";
  position: absolute;
  right: -5px;
  top: -2.5px;
  width: 15px;
  height: 15px;
  background-color: rgb(40, 124, 202);
  box-shadow: 0 0 5px rgb(40, 151, 202), 0 0 10px rgb(40, 124, 202),
    0 0 20px rgb(40, 124, 202), 0 0 30px rgb(40, 124, 202),
    0 0 40px rgb(40, 124, 202), 0 0 50px rgb(40, 124, 202),
    0 0 60px rgb(40, 124, 202), 0 0 60px rgb(40, 124, 202);
  border-radius: 50%;
  z-index: 1;
}

@keyframes zhuan {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tab-tips {
  position: absolute;
  z-index: 10;
  left: 0;
  bottom: 0;

  background-color: #0005;
  color: #fff;
  padding: 5px 7px;
  border-radius: 0 10px 0 0;
}
.tab-tips-plane {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #000;
  padding: 15px 20px 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 3px #9ba2b1;
  width: 300px;
}
.tab-tips-plane li {
  font-size: 0;
  margin-bottom: 15px;
}
.tab-tips-plane li:last-child {
  margin-bottom: 0;
}
.tab-tips-plane li span.key-code {
  text-align: center;
  margin-left: 2px;
  background: #eff0f2;
  box-shadow: inset 0 0 25px #e8e8e8, 0 1px 0 #c3c3c3, 0 2px 0 #c9c9c9,
    0 2px 3px #000;
  color: #111;
  border-radius: 2px;
  font-size: 14px;
  font-family: "Cutive Mono", monospace;
  padding: 2px 5px;
  margin-right: 2px;
}
.tab-tips-plane li span.add {
  font-size: 16px;
  color: #fff;
}
.tab-tips-plane li span.text {
  /* margin-left: 50px; */
  font-size: 14px;
  color: #fff;
  float: right;
}
</style>
