
export default class HLine {

  constructor(posA, posB, options) {
    this.from = posA;
    this.to = posB;

    this.text = options.text;

    this.lineColor = options.lineColor || '#ffffff';
    this.lineSize = 2;
  }

  update(dt) {

  }

  draw(ctx){

    ctx.globalAlpha = this.alpha || 1;

    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.lineWidth = this.lineSize;
    ctx.strokeStyle = this.lineColor;
    ctx.stroke();

    ctx.font = '16px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = this.lineColor;
    ctx.fillText(this.text, this.from.x, this.to.y);

  }

};
