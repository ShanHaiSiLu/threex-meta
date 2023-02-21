/**
 * fetch 事件会拦截页面上所有的网络资源请求，但我们通常只对部分资源请求进行处理，其余的请求会继续走浏览器默认的资源请求流程。因此需要对当前的资源请求进行判断分类。

 * fetch 事件回调参数的 event.request 属性描述了当前被拦截的资源请求，可以通过它来进行判断分类。event.request 是 Request 对象的实例，包含了资源请求的 URL、请求模式、请求头等全部信息。
 */

console.log("工作者线程开始工作");
self.addEventListener("fetch", function (event) {
  if (!event.request.url.match(/.glb$|.gltf$|.fbx$|.hdr$/)) return; // 非指定类型文件的请求，可以直接放行
  event.respondWith(
    new Promise(async (res) => {
      let _tmp = false;
      await caches.match(event.request.url).then((module) => {
        if (module) {
          console.log("当前模型已缓存，调取缓存数据");
          _tmp = true;
          return res(module);
        } else {
          console.log("模型未存储，开始请求");
          return;
        }
      });

      if (_tmp) return;

      caches
        .open(event.request.url)
        .then((caches) => {
          console.log("open cache完成", caches);
          return caches.add(event.request.url);
        })
        .then((mod) => {
          console.log("请求存储结束！", mod);
          caches.match(event.request.url).then(res);
        });
    })
  );
});
