
import Point from 'point2js';
import popoverTmpl from './templates/dashboard.hbs';

export default class Popover {

  constructor(options) {
    this.container = options.container;
    this.container.style.display = 'none';

    this.showing = null;
    this.showingId = null;
  }

  select(){
    if (this.showing){
      this.showing.onClick();
    }
  }

  show(obj, data){
    if (this.showingId !== data.d){
      this.showing = obj;
      this.showingId = data.d;
      var css = this.container.style;

      if (data.d === this.currentD && css.display === 'block'){
        return;
      }

      this.currentD = data.d;
      css.display = 'block';

      this.container.innerHTML = popoverTmpl(data);
    }

    this.setPosition(obj);
  }

  hide(data){
    if (!data || this.showingId === data.d){
      this.container.style.display = 'none';
      this.showingId = null;
      this.showing = null;
    }
  }

  setPosition(obj) {
    var p = window.input.position;
    var ctn = this.container;
    var bounds = window.world.size;
    var size = new Point(ctn.clientWidth || 200, ctn.clientHeight || 150);

    var gap = new Point(1.2, 1.1);

    var r = obj.radius;
    var center = p.clone();

    var sum = center.add(size);
    sum.x *= gap.x;
    sum.y *= gap.y;

    if (sum.x > bounds.x){
      center.x -= size.x*2;
    }
    else {
      center.x += size.x;
    }

    if (sum.y > bounds.y){
      center.y -= size.y*gap.y;
    }
    if (center.y < 0){
      center.y += size.y;
    }

    ctn.style.left = parseInt(center.x, 10) + 'px';
    ctn.style.top = parseInt(center.y, 10) + 'px';
  }
};
