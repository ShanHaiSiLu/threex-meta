import * as THREE from "three";

export default class MiniAngleCurvePath {
  // 静态变量，path
  path = new THREE.CurvePath();
  // 半径
  r;
  // 起点
  start;
  // 终点
  end;
  // 映射出的全部点
  arr_point = [];
  //映射出的全部半径
  arr_prev_r = [];
  arr_next_r = [];
  // 控制点（原始点）和其映射出的接触点
  contactPoints = [];
  // 控制点们映射出的接触点们
  showPoints = [];

  /**
   * @param {ObjectArray: [{Object: {point,prevR,nextR}}]} points 点的数组
   * @param {float} r 默认半径
   */
  constructor(pointInfos, r = 1) {
    this.r = r;
    pointInfos.forEach((item) => {
      this.arr_point.push(item.point || item);
      this.arr_prev_r.push(item.prevR || r);
      this.arr_next_r.push(item.nextR || r);
    });

    this.start = this.arr_point[0];
    this.end = this.arr_point[this.arr_point.length - 1];

    if (this.arr_point.length === 2) {
      this.path.add(new THREE.LineCurve3(this.start, this.end));
      return;
    }

    let prev, next;
    let vecP, vecN;
    let surplusArr = this.arr_point.slice(1, -1);
    // 找到每个点的上一个点和下一个点，得到方向向量，与r运算后得到接触点
    this.contactPoints = surplusArr.map((point, i) => {
      prev = !i ? this.start : surplusArr[i - 1];
      next = i + 1 === surplusArr.length ? this.end : surplusArr[i + 1];

      vecP = new THREE.Vector3().subVectors(prev, point).normalize();
      vecP.multiplyScalar(this.arr_prev_r[i + 1]);
      vecN = new THREE.Vector3().subVectors(next, point).normalize();
      vecN.multiplyScalar(this.arr_next_r[i + 1]);

      return {
        pp: point.clone().add(vecP),
        np: point.clone().add(vecN),
        p: point,
      };
    });

    this.showPoints = this.contactPoints.map((i) => [i.pp, i.np]);

    this.contactPoints.forEach((item, i) => {
      if (!i) {
        // 第一个点的话还需要额外连接起始点
        this.path.add(new THREE.LineCurve3(this.start, item.pp));
      }

      this.path.add(new THREE.QuadraticBezierCurve3(item.pp, item.p, item.np));

      let nextLinePoint =
        i === this.contactPoints.length - 1
          ? this.end
          : this.contactPoints[i + 1].pp;
      this.path.add(new THREE.LineCurve3(item.np, nextLinePoint));
    });
  }

  /**
   * 更新起点
   * @param {Object: {point,prevR,nextR}} pointInfo
   */
  pushTop(_point) {
    let point = _point.point || _point,
      prevR = _point.prevR || this.r,
      nextR = _point.nextR || this.r;

    this.arr_point.unshift(point);
    this.arr_prev_r.unshift(prevR);
    this.arr_next_r.unshift(nextR);

    if (!this.start.distanceTo(this.end)) {
      this.start = point;
      this.path.curves = [new THREE.LineCurve3(this.start, this.end)];

      return;
    }

    let isTwoPoint = !this.contactPoints.length;

    let prevStart = this.start;
    this.start = point;
    let next = isTwoPoint ? this.end : this.contactPoints[0].p;
    let prevContactPoint = isTwoPoint ? null : this.contactPoints[0].pp;

    let vecP = new THREE.Vector3()
      .subVectors(this.start, prevStart)
      .normalize()
      .multiplyScalar(prevR);
    let vecN = new THREE.Vector3()
      .subVectors(next, prevStart)
      .normalize()
      .multiplyScalar(nextR);

    let pointMap = {
      pp: prevStart.clone().add(vecP),
      np: prevStart.clone().add(vecN),
      p: prevStart,
    };
    this.contactPoints.unshift(pointMap);

    this.showPoints.unshift([pointMap.pp, pointMap.np]);

    this.path.curves.shift();
    this.path.curves.unshift(
      new THREE.LineCurve3(pointMap.np, prevContactPoint || this.end)
    );
    this.path.curves.unshift(
      new THREE.QuadraticBezierCurve3(pointMap.pp, pointMap.p, pointMap.np)
    );
    this.path.curves.unshift(new THREE.LineCurve3(this.start, pointMap.pp));
  }

  /**
   * 删除起点
   */
  popTop() {
    this.arr_point.shift();
    this.arr_prev_r.shift();
    this.arr_next_r.shift();

    if (this.contactPoints.length === 1) {
      this.start = this.contactPoints.shift().p;
      this.showPoints.shift();
      this.path.curves.length = 0;

      this.path.curves.unshift(new THREE.LineCurve3(this.start, this.end));
      return;
    }
    if (this.contactPoints.length === 0) {
      return new Error("不能低于两个点！");
    }
    let contact1 = this.contactPoints.shift();

    this.start = contact1.p;

    this.showPoints.shift();

    this.path.curves.shift();
    this.path.curves.shift();
    this.path.curves.shift();

    this.path.curves.unshift(
      new THREE.LineCurve3(this.start, this.contactPoints[0].pp)
    );
  }

  /**
   * 更新终点
   * @param {Object: {point,prevR,nextR}} pointInfo
   */
  pushTail(_point) {
    let point = _point.point || _point,
      prevR = _point.prevR || this.r,
      nextR = _point.nextR || this.r;

    this.arr_point.push(point);
    this.arr_prev_r.push(prevR);
    this.arr_next_r.push(nextR);

    if (this.start === this.end) {
      this.end = point;
      this.path.curves = [new THREE.LineCurve3(this.start, this.end)];

      return;
    }
    let isTwoPoint = !this.contactPoints.length;

    let prevEnd = this.end;
    this.end = point;
    let lastBackP = isTwoPoint
      ? this.start
      : this.contactPoints[this.contactPoints.length - 1].p;
    let lastContact = isTwoPoint
      ? null
      : this.contactPoints[this.contactPoints.length - 1].np;

    let vecP = new THREE.Vector3()
      .subVectors(lastBackP, prevEnd)
      .normalize()
      .multiplyScalar(prevR);
    let vecN = new THREE.Vector3()
      .subVectors(this.end, prevEnd)
      .normalize()
      .multiplyScalar(nextR);

    let pointMap = {
      pp: prevEnd.clone().add(vecP),
      np: prevEnd.clone().add(vecN),
      p: prevEnd,
    };
    this.contactPoints.push(pointMap);

    this.showPoints.push([pointMap.pp, pointMap.np]);

    this.path.curves.pop();

    this.path.curves.push(
      new THREE.LineCurve3(lastContact || this.start, pointMap.pp)
    );
    this.path.curves.push(
      new THREE.QuadraticBezierCurve3(pointMap.pp, pointMap.p, pointMap.np)
    );

    this.path.curves.push(new THREE.LineCurve3(pointMap.np, this.end));
  }

  /**
   * 删除终点
   */
  popTail() {
    this.arr_point.pop();
    this.arr_prev_r.pop();
    this.arr_next_r.pop();

    if (this.contactPoints.length === 1) {
      this.end = this.contactPoints.shift().p;
      this.showPoints.shift();
      this.path.curves.length = 0;

      this.path.curves.unshift(new THREE.LineCurve3(this.start, this.end));
      return;
    }
    if (this.contactPoints.length === 0) {
      return new Error("不能低于两个点！");
    }

    let contactTail = this.contactPoints.pop();

    this.end = contactTail.p;

    this.showPoints.pop();

    this.path.curves.pop();
    this.path.curves.pop();
    this.path.curves.pop();

    this.path.curves.push(
      new THREE.LineCurve3(
        this.contactPoints[this.contactPoints.length - 1].np,
        this.end
      )
    );
  }
}
