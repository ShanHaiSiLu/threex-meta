const keyupCallbackFunctions = [];

export function initKeyupListen() {
  window.addEventListener("keyup", (event) => {
    keyupCallbackFunctions.forEach((f) => f(event.code));
  });
}

export function addKeyupFun(f) {
  if (typeof f === "function") keyupCallbackFunctions.push(f);
}
