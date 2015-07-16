
import Point from 'point2js';
import moment from 'moment';
import _ from 'lodash';

import Dashboard from './Dashboard';
import Line from './Line';
import HLine from './HLine';

var colors = {
  lines: '#666'
};

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
    this.linesV = [];
    this.linesH = [];

    this.vars = {
      radius: 'us',
      height: 'pc'
    };
  }

  changeMetric(type, value) {
    this.vars[type] = value;

    this.entityIndex = 0;
    this.setTimeLine();
  }

  create() {

    var canvas = document.createElement('canvas');

    //canvas.setAttribute("moz-opaque", true);
    canvas.width = this.size.x;
    canvas.height = this.size.y;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.container.appendChild(this.canvas);

    var grd = this.context.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, '#F161A3');
    grd.addColorStop(1, '#4939E4');

    this.context.globalCompositeOperation = 'darker';

    //grd.addColorStop(0, 'rgb(227, 99, 150)');
    //grd.addColorStop(1, 'rgb(103, 71, 218)');

    this.gradient = grd;

    this.setTimeLine();
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
    var width = 30, width2 = width*2;
    var totH = this.size.y - (this.padding.y/2);

    var canvasW = this.padding.x/2;
    var x = canvasW;

    this.linesH = [];

    _.times(times, (i) => {

      var p = (totH * i * gap) / 100;
      var y = parseInt(totH - p, 10);
      var val = (i * gap * this.maxY) / 100;

      var l = new HLine(
        new Point(x - 10, y),
        new Point(x - width2, y), {
          lineColor: colors.lines,
          text: parseInt(val ? val : 1, 10).toString()
        });

      this.linesH.push(l);

    });

    if (!this.contextHeightBar){

      // create a Canvas for the bar
      var canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = this.size.y;

      canvas.style.position = 'absolute';
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.zIndex = 2;

      this.contextHeightBar = canvas.getContext('2d');
      this.container.appendChild(canvas);
    }

    // draw
    this.contextHeightBar.clearRect(0, 0, canvasW, this.size.y);
    this.linesH.forEach( l => { l.draw(this.contextHeightBar); });

  }

  createTimeBars() {

    if (this.contextTimeBar){
      // draw only once
      return;
    }

    var halfPadX = this.padding.x/2;
    var height = 10, height2 = height*2;

    var fMonth = this.startMonth;
    var year = this.startYear;
    var lastYear = 0;
    var cMonth = fMonth;

    var canvasH = this.padding.y/2;
    var y = 0; //parseInt(this.size.y - (canvasH), 10);

    this.linesV = [];

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
        new Point(x, y + height),
        new Point(x, y + h), {
          lineColor: colors.lines,
          text: cm,
          text2: m2
        });

      this.linesV.push(l);

      if (m % 12 === 0){
        year++;
        cMonth = 0;
      }

      cMonth++;
    });

    if (!this.contextTimeBar){

      // create a Canvas for the bar
      var canvas = document.createElement('canvas');
      canvas.width = this.size.x;
      canvas.height = canvasH;

      canvas.style.position = 'absolute';
      canvas.style.bottom = 0;
      canvas.style.left = 0;
      canvas.style.zIndex = 3;

      this.contextTimeBar = canvas.getContext('2d');
      this.container.appendChild(canvas);
    }

    // draw
    this.contextTimeBar.clearRect(0, 0, this.size.x, canvasH);
    this.linesV.forEach( l => { l.draw(this.contextTimeBar); });

  }

  update(dt) {

    this.cVel -= dt;

    if (this.cVel <= 0){
      this.cVel = this.vel;
      this.nextEntity();
    }

    this.dashboards.forEach( dash => {
      dash.update(dt);
    });

  }

  draw() {

    var ctx = this.context;

    ctx.clearRect(0, 0, this.size.x, this.size.y);

    ctx.globalAlpha = 0.7;

    this.dashboards.forEach( dash => {
      dash.draw(ctx);
    });

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

    var y = totH - (totH * percHeight / 100);
    var x = (month * this.col.x) + (this.padding.x/2);

    function rnd(p, radius){ // random point whithin a circle
      var r = Math.random() * radius;
      var a = Math.random()* 2 * Math.PI;
      return new Point(p.x + (r * Math.cos(a)), p.y + (r * Math.sin(a)));
    }

    var pStart = new Point(x, totH);
    var rStart = 1;

    var to = rnd(new Point(x, y), 10);
    var toR = dash[this.vars.radius];

    var d = this.dashboards.get(dash.d);
    if (!d){

      d = new Dashboard(pStart, {
        dash: dash,
        radius: rStart,
        fillColor: this.gradient,
        lineColor: colors.lines
      });

      this.dashboards.set(dash.d, d);
    }

    d.tweenTo({ x: to.x, y: to.y }, toR, 3, 'Quartic.Out');

    this.entityIndex++;
  }

};


