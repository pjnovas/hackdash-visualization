import Point from 'point2js';
import _ from 'lodash';

export default class Input {

  constructor(container) {
    this.container = container || window && window.document;

    this.position = new Point();
    this.isDown = false;

    this.enabled = true;
    this.attachEvents();
  }

  attachEvents(){
    if (this.events){
      this._clearEvents();
    }

    this.events = {
      mouseup: this.onmouseup.bind(this),
      mousedown: this.onmousedown.bind(this),
      mousemove: this.onmousemove.bind(this),
      mouseover: this.onmousemove.bind(this),
    };

    _.forIn(this.events, (event, type) => {
      this.container.addEventListener(type, event);
    });
  }

  clearEvents(){
    _.forIn(this.events, (event, type) => {
      this.container.removeEventListener(type, event);
    });
  }

  updatePosition(e) {
    this.position = this.getEventPosition(e);
  }

  onmouseup(e){
    if (!this.enabled) return;
    this.updatePosition(e);
    this.isDown = false;
  }

  onmousedown(e){
    if (!this.enabled) return;
    this.updatePosition(e);
    this.isDown = true;
  }

  onmousemove(e){
    this.updatePosition(e);
  }

  getEventPosition(e){
    var x = 0, y = 0,
      doc = document,
      body = doc.body,
      docEle = doc.documentElement,
      ele = this.container,
      parent = ele.parentNode || body;

    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + body.scrollLeft + docEle.scrollLeft;
      y = e.clientY + body.scrollTop + docEle.scrollTop;
    }

    x -= (ele.offsetLeft || 0) + parent.offsetLeft;
    y -= (ele.offsetTop || 0) + parent.offsetTop;

    x += parent.scrollLeft;
    y += parent.scrollTop;

    x = Math.round(x);
    y = Math.round(y);

    return new Point(x, y);
  }

}