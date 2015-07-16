
export default class Line {

  constructor(posA, posB, options) {
    this.from = posA;
    this.to = posB;

    this.text = options.text;
    this.text2 = options.text2;

    this.lineColor = options.lineColor || '#ffffff';
    this.lineSize = 2;
  }

  update(dt) {

  }

  draw(ctx){

    //ctx.globalAlpha = this.alpha || 1;

    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.lineWidth = this.lineSize;
    ctx.strokeStyle = this.lineColor;
    ctx.stroke();

    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = this.lineColor;
    ctx.fillText(this.text, this.to.x, this.to.y);

    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = this.lineColor;
    ctx.fillText(this.text2, this.to.x + 10, this.to.y);

  }

};
