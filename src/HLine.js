
import moment from 'moment';
import PIXI from 'pixi.js';

export default class HLine {

  constructor(stage, posA, posB, options) {
    this.from = posA;
    this.to = posB;

    this.text = options.text;

    this.stage = stage;

    this.lineColor = options.lineColor || '0xffffff';
    this.lineSize = 2;

    this.radius = options.radius || 5;
    this.create();
  }

  create(){
    if (!this.graphics) {
      this.graphics = new PIXI.Graphics();
    }
    else {
      this.graphics.clear();
    }

    this.draw();

    this.stage.addChild(this.graphics);

    var text = new PIXI.Text(this.text, {font:'20px monospace', fill:'white'});

    text.position.x = this.from.x - (this.text.length * 10);
    text.position.y = this.to.y - 25;

    this.stage.addChild(text);
  }

  update(dt) {

  }

  draw(){
    this.graphics.clear();

    this.graphics.alpha = this.alpha || 0.8;
    this.graphics.position.x = this.from.x;
    this.graphics.position.y = this.from.y;

    this.graphics.lineStyle(this.lineSize, this.lineColor, 1);

    this.graphics.beginFill();

    this.graphics.moveTo(0, 0);
    this.graphics.lineTo(this.to.x - this.from.x, this.to.y - this.from.y);

    this.graphics.endFill();
  }

};
