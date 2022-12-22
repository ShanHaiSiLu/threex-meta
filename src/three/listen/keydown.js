const keydownCallbackFunctions = [];

export function initKeydownListen() {
  window.addEventListener("keydown", (event) => {
    keydownCallbackFunctions.forEach((f) => f(event.code));

    if(event.code !== "F5") event.preventDefault();
  });
}

export function addKeydownFun(f) {
  if (typeof f === "function") keydownCallbackFunctions.push(f);
}
