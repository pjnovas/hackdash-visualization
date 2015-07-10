
import moment from 'moment';
import PIXI from 'pixi.js';

export default class Line {

  constructor(stage, posA, posB, options) {
    this.from = posA;
    this.to = posB;

    this.text = options.text;
    this.text2 = options.text2;

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

    var xT = this.to.x - (this.text.length * 5);

    var text = new PIXI.Text(this.text, {font:'16px Arial', fill:'white'});

    text.position.x = xT;
    text.position.y = this.to.y;

    this.stage.addChild(text);

    var text2 = new PIXI.Text(this.text2, {font:'20px Arial', fill:'white'});

    text2.position.x = this.to.x + 10;
    text2.position.y = this.to.y - 20;

    this.stage.addChild(text2);
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
