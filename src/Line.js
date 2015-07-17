
export default class Line {

  constructor(posA, posB, options) {
    this.from = posA;
    this.to = posB;

    this.lineColor = options.lineColor || '#ffffff';
    this.lineSize = options.lineSize || 2;
    this.alpha = options.alpha;
  }

  update(dt) {

  }

  draw(ctx){

    if (this.alpha){
      ctx.globalAlpha = this.alpha || 1;
    }

    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.lineWidth = this.lineSize;
    ctx.strokeStyle = this.lineColor;
    ctx.stroke();

  }

};
