import * as THREE from "three";

export let loadingEndFun = [];

export function initLoadManager() {
  THREE.DefaultLoadingManager.onStart = function () {};

  THREE.DefaultLoadingManager.onLoad = function () {
    console.log("加载完成！");
    loadingEndFun.forEach(f => f());
  };

  THREE.DefaultLoadingManager.onProgress = function () {};

  THREE.DefaultLoadingManager.onError = function (url) {
    console.log("加载错误： " + url);
  };
}