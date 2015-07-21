
import Circle from './Circle';

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

  hide(idx) {
    var delay = (idx >= 0) ? idx * 0.001 : null;

    this.prevPos = this.position.clone();
    this.tweenTo({ y: world.size.y + this.radius }, null, 1, 'Back.In', delay);
    this.hidden = true;
  }

  show(idx) {
    var delay = (idx >= 0) ? idx * 0.001 : null;
    this.tweenTo({ y: this.prevPos.y }, null, 1, 'Back.Out', delay);
  }

};
