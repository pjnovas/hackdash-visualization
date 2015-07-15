
import Point from 'point2js';
import moment from 'moment';
import _ from 'lodash';
import PIXI from 'pixi.js';

import Dashboard from './Dashboard';
import Line from './Line';
import HLine from './HLine';

export default class World {

  constructor(container, data, options) {
    this.container = container;
    this.data = data;

    this.size = options && options.size ||
      new Point(this.container.offsetWidth, this.container.offsetHeight);

    this.padding = new Point(150, 150);

    this.vel = options && options.vel || 0; //0.15;
    this.cVel = this.vel;

    this.entityIndex = 0;

    this.zoom = 1;
    this.maxZoom = 3;
    this.minZoom = 1;

    this.dashboards = new Map();

    this.vars = {
      radius: 'us',
      height: 'pc'
    };
  }

  changeMetric(type, value) {
    this.vars[type] = value;

    this.stage.removeChildren();
    this.entityIndex = 0;
    this.dashboards = new Map();
    this.setTimeLine();
  }

  create() {
    var renderer = new PIXI.autoDetectRenderer(this.size.x, this.size.y);
    this.container.appendChild(renderer.view);

    this.renderer = renderer;
    this.stage = new PIXI.Container();

    //this.stage.hitArea = new PIXI.Rectangle(0, 0, this.size.x, this.size.y);
    this.stage.interactive = true;

    this.setTimeLine();
    //this.attachEvents();
  }

  attachEvents() {
    this.dragging = false;
    this.mousePressPoint = new Point();

    this.container.addEventListener('wheel', e => {
      var p = new Point(e.clientX, e.clientY);
      if (e.wheelDelta > 0) this.zoomIn(p);
      else this.zoomOut(p);
    });

    this.stage.mousedown = this.stage.touchstart = data => {
      this.dragging = true;

      this.mousePressPoint = new Point(
        data.data.global.x - this.stage.position.x,
        data.data.global.y - this.stage.position.y);
    };

    this.stage.mouseup =
      this.stage.mouseupoutside =
      this.stage.touchend =
      this.stage.touchendoutside = data => {
        this.dragging = false;
      };

    this.stage.mousemove = this.stage.touchmove = data => {
      if(!this.dragging) {
        return;
      }

      var p = new Point(data.data.global);
      this.stage.position.x = p.x - this.mousePressPoint.x;
      this.stage.position.y = p.y - this.mousePressPoint.y;

      this.constrainWorld();
    };

  }

  zoomIn(p){
    var zoomPA = this.screenToWorld(p);

    this.zoom = Math.min(this.zoom * 1.5, this.maxZoom);
    this.stage.scale.x = this.stage.scale.y = this.zoom;

    var zoomPB = this.worldToScreen(p);
    this.stage.position.x = (zoomPB.x - p.x) / this.zoom;
    this.stage.position.y = (zoomPB.y - p.y) / this.zoom;

    this.constrainWorld();
  }

  zoomOut(p){
    var zoomPA = this.screenToWorld(p);

    this.zoom = Math.max(this.zoom / 1.5, this.minZoom);
    this.stage.scale.x = this.stage.scale.y = this.zoom;

    var zoomPB = this.worldToScreen(zoomPA);
    this.stage.position.x = (zoomPB.x - zoomPA.x) / this.zoom;
    this.stage.position.y = (zoomPB.y - zoomPA.y) / this.zoom;

    this.constrainWorld();
  }

  screenToWorld(p) {
    return new Point(
      this.stage.position.x + p.x / this.zoom,
      this.stage.position.y + p.y / this.zoom
    );
  }

  worldToScreen(p) {
    return new Point(
      (p.x - this.stage.position.x) * this.zoom,
      (p.y - this.stage.position.y) * this.zoom
    );
  }

  constrainWorld(){
    var p = this.stage.position;
    p.x = Math.min(Math.max(p.x, -1 * this.zoom * this.size.x), 0);
    p.y = Math.min(Math.max(p.y, -1 * this.zoom * this.size.y), 0);
  }

  setTimeLine() {

    var first = moment.unix(_.first(this.data).t);
    var last = moment.unix(_.last(this.data).t);

    var ystart = first.year();
    var yend = last.year();

    this.startYear = ystart;
    this.startMonth = first.month();

    this.months = ((yend - ystart) * 12) + last.month() + 2; // total of months
    this.months -= this.startMonth;

    var maxDash = 0;
    this.data.forEach(dash => {
      if (dash[this.vars.height] > maxDash) maxDash = dash[this.vars.height];
    });

    this.maxY = maxDash; // Max row = 100%
    this.maxY *= 1.15; // plus 15% so it won't get out of screen

    this.col = new Point(
      (this.size.x - this.padding.x) / this.months, // this.col.x month separation in px
      (this.size.y - this.padding.y) / this.maxY); // this.col.y projects count height separation

    this.createTimeBars();
    this.createHeightBars();
  }

  createHeightBars() {
    var gap = 20;
    var times = 100 / gap;
    var x = parseInt(this.padding.x/2, 10);
    var width = 30, width2 = width*2;
    var totH = this.size.y - (this.padding.y/2);

    _.times(times, (i) => {

      var p = (totH * i * gap) / 100;
      var y = parseInt(totH - p, 10);
      var val = (i * gap * this.maxY) / 100;

      var l = new HLine(
        this.stage,
        new Point(x - 10, y),
        new Point(x - width2, y), {
          lineColor: '0xffffff',
          text: parseInt(val ? val : 1, 10).toString()
        });

    });
  }

  createTimeBars() {
    var halfPadX = this.padding.x/2;
    var y = parseInt(this.size.y - (this.padding.y/2), 10);
    var height = 10, height2 = height*2;

    var fMonth = this.startMonth;
    var year = this.startYear;
    var lastYear = 0;
    var cMonth = fMonth;

    _.times(this.months, (i) => {
      var x = parseInt((i * this.col.x) + halfPadX, 10);

      var m2 = '';
      var m = i + fMonth;

      if (lastYear !== year){
        m2 = year;
        lastYear = year;
      }

      var h = height2;
      var cm = (cMonth < 10 ? '0' + cMonth : ''+cMonth);
      if (m2){
        h = height2*3;
        cm = '';
      }

      var l = new Line(
        this.stage,
        new Point(x, y + height),
        new Point(x, y + h), {
          lineColor: '0xffffff',
          text: cm,
          text2: m2
        });

      if (m % 12 === 0){
        year++;
        cMonth = 0;
      }

      cMonth++;
    });
  }

  update(dt) {

    this.cVel -= dt;

    if (this.cVel <= 0){
      this.cVel = this.vel;
      this.nextEntity();
    }
  }

  draw() {
    this.renderer.render(this.stage);
  }

  nextEntity() {
    var idx = this.entityIndex;

    if (!this.data[idx]){
      //window.machine.end();
      return;
    }

    var dash = this.data[idx];

    var time = moment.unix(dash.t);
    var m = time.month() + 1;
    var month = ((time.year() - this.startYear) * 12) + m - this.startMonth;

    var totH = this.size.y - (this.padding.y/2);
    var percHeight = (dash[this.vars.height] * 100)/this.maxY;
    //var y = totH - (percHeight * this.col.y);
    var y = totH - (totH * percHeight / 100);
    var x = (month * this.col.x) + (this.padding.x/2);

    function rnd(p, radius){ // random point whithin a circle
      var r = Math.random() * radius;
      var a = Math.random()* 2 * Math.PI;
      return new Point(p.x + (r * Math.cos(a)), p.y + (r * Math.sin(a)));
    }

    var d = new Dashboard(this.stage, rnd(new Point(x, y), 10), {
      dash: dash,
      radius: dash[this.vars.radius]
    });

    this.dashboards.set(d.domain, d);

    this.entityIndex++;
  }

};


