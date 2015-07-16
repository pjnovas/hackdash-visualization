
import TWEEN from 'tween.js';

export default class Circle {

  constructor(pos, options) {
    this.position = pos;

    this.fillColor = options.fillColor || '#f8f8f8';
    this.lineColor = options.lineColor || '#ffffff';
    this.lineSize = 0;

    this.radius = options.radius || 5;

    this.tweenPos = null;
    this.tweenRadius = null;
  }
/*
  create(){

    this.graphics.mouseover = () => {
      this.lineSize = 5;
      this.draw();
      this.onOver();
    };

    this.graphics.mouseout = () => {
      this.lineSize = 0;
      this.draw();
      this.onOut();
    };

    this.graphics.mouseup = this.onClick.bind(this);
  }
*/
  tweenTo(pos, radius, duration, easing) {
    this.clearTween('tweenPos');
    this.clearTween('tweenRadius');

    if (easing){
      var props = easing.split('.');
      easing = TWEEN.Easing[props[0]][props[1]];
    }

    var t = duration*1000;

    this.tweenPos = new TWEEN.Tween(this.position).to(pos, t).easing(easing);
    this.tweenPos.onComplete(() => { this.clearTween('tweenPos'); });
    this.tweenPos.start(0);

    if (this.radius !== radius){
      this.tweenRadius = new TWEEN.Tween(this).to({ radius: radius }, t).easing(easing);
      this.tweenRadius.onComplete(() => { this.clearTween('tweenRadius'); });
      this.tweenRadius.start(0);
    }

    this.dtAccum = 0;
  }

  clearTween(tweenName) {
    if (this[tweenName]){
      TWEEN.remove(this[tweenName]);
      this[tweenName] = null;
    }
  }

  onClick(){
    // override
  }

  onOver(){
    // override
  }

  onOut(){
    // override
  }

  update(dt){
    this.dtAccum += dt;
    var acc = this.dtAccum * 1000;

    if (this.tweenPos){
      this.tweenPos.update(acc);
    }

    if (this.tweenRadius){
      this.tweenRadius.update(acc);
      this.radius = parseInt(this.radius, 10);
    }

  }

  draw(ctx) {

    ctx.globalAlpha = this.alpha || 0.8;

    ctx.beginPath();

    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.fillColor;

    ctx.fill();

    if (this.lineSize) {
      ctx.lineWidth = this.lineSize;
      ctx.strokeStyle = this.lineColor;
      ctx.stroke();
    }

  }

};
