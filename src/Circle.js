
import moment from 'moment';
import PIXI from 'pixi.js';

export default class Circle {

  constructor(stage, pos, options) {
    this.position = pos;

    this.time = moment.unix(options.tm);
    this.tm = options.tm;

    this.stage = stage;

    this.fillColor = options.fillColor || '0xf8f8f8';
    this.lineColor = options.lineColor || '0xffffff';
    //this.lineSize = options.lineSize;
    this.lineSize = 0;

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

    this.graphics.mouseover = () => {
      this.lineSize = 5;
      this.draw();
    };

    this.graphics.mouseout = () => {
      this.lineSize = 0;
      this.draw();
    };
  }

  update(dt) {

  }

  draw(){

    this.graphics.clear();

    this.graphics.alpha = this.alpha || 0.8;
    this.graphics.position.x = this.position.x;
    this.graphics.position.y = this.position.y;

    if (this.lineSize) {
      this.graphics.lineStyle(this.lineSize, this.lineColor, 1);
    }
    else {
      this.graphics.lineStyle(0, '0x000000', 0);
    }

    this.graphics.beginFill(this.fillColor);

    var shape = this.graphics.drawCircle(0, 0, this.radius);

    shape.hitArea = new PIXI.Circle(0, 0, this.radius);
    shape.interactive = true;

    this.graphics.endFill();
  }

};
