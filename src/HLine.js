import Line from './Line';

export default class HLine extends Line {

  constructor(posA, posB, options) {
    super(posA, posB, options);
    this.text = options.text;
  }

  update(dt) {

  }

  draw(ctx){

    //ctx.globalAlpha = this.alpha || 1;

    super.draw(ctx);

    ctx.font = '16px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = this.lineColor;
    ctx.fillText(this.text, this.from.x, this.to.y);

  }

};
