
import Color from 'color';
import Circle from './Circle';

export default class Dashboard extends Circle {

  constructor(pos, options) {

    var c = Color('#DE8D14');
    c.saturate(pos.y / 1000);
    c.luminosity(pos.y / 1000);

    options.fillColor = c.hexString();

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
