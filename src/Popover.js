
import Point from 'point2js';
import popoverTmpl from './templates/dashboard.hbs';

export default class Popover {

  constructor(options) {
    this.container = options.container;
    this.container.style.display = 'none';
  }

  show(obj, data){
    var css = this.container.style;

    if (data.d === this.currentD && css.display === 'block'){
      return;
    }

    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.currentD = data.d;
      css.display = 'block';
    }, 100);

    this.container.innerHTML = popoverTmpl(data);
    this.setPosition(obj);
  }

  hide(){
    this.container.style.display = 'none';
  }

  setPosition(obj) {
    var ctn = this.container;
    var bounds = window.world.size;
    var size = new Point(ctn.clientWidth || 200, ctn.clientHeight || 150);

    var r = obj.radius;
    var center = obj.position.add(new Point(r+10, -r));

    var sum = center.add(size);
    if (sum.x > bounds.x){
      center.x -= size.x;
    }
    if (sum.y > bounds.y){
      center.y -= size.y;
    }
    if (center.y < 0){
      center.y += size.y;
    }

    ctn.style.left = parseInt(center.x, 10) + 'px';
    ctn.style.top = parseInt(center.y, 10) + 'px';
  }
};
