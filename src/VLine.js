import Line from './Line';

export default class VLine extends Line {

  constructor(posA, posB, options) {
    super(posA, posB, options);
    this.text = options.text;
    this.text2 = options.text2;
  }

  update(dt) {

  }

  draw(ctx){

    //ctx.globalAlpha = this.alpha || 1;

    super.draw(ctx);

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
