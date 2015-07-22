
import Circle from './Circle';
import Point from 'point2js';

export default class Dashboard extends Circle {

  constructor(pos, options) {
    super(pos, options);
    this.dash = options.dash;
    this.hidden = false;
  }

  onClick(){
    window.dselected = true;
    world.showRelations(this);
  }

  onOver(){
    window.popover.show(this, this.dash);
  }

  onOut(){
    window.popover.hide(this.dash);
  }

  setPos(to, toR) {
    this.showPos = new Point(to).clone();

    if (!this.hidden){
      this.tweenTo({ x: to.x, y: to.y }, toR, 1, 'Quartic.Out');
    }
  }

  hide(idx) {
    //if (!this.hidden){
      var delay = (idx >= 0) ? idx * 0.001 : null;

      if (window.hideNonRelated){
        this.tweenTo({ y: world.size.y + this.radius }, null, 1, 'Back.In', delay);
      }
      else {
        this.tweenTo({ y: this.showPos.y }, null, 1, 'Back.Out', delay);
      }

      this.hidden = true;
    //}
  }

  show(idx) {
    //if (this.hidden){
      var delay = (idx >= 0) ? idx * 0.001 : null;

      this.tweenTo({ y: this.showPos.y }, null, 1, 'Back.Out', delay);
      this.hidden = false;
    //}
  }

};
