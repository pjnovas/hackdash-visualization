
import Color from 'color';
import Circle from './Circle';

export default class Dashboard extends Circle {

  constructor(pos, options) {

    super(pos, options);
    this.dash = options.dash;
  }

  onClick(){
    window.open('https://hackdash.org/dashboards/' + this.dash.d, '_blank');
  }

  onOver(){
    window.popover.show(this, this.dash);
  }

  onOut(){
    window.popover.hide();
  }

};
