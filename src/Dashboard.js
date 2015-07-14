
import moment from 'moment';
import Color from 'color';
import Circle from './Circle';

export default class Dashboard extends Circle {

  constructor(stage, pos, options) {

    var c = Color('#DE8D14');
    c.saturate(pos.y / 1000);
    c.luminosity(pos.y / 1000);
    options.fillColor = '0x' + c.hexString().replace('#', '');

    super(stage, pos, options);
    this.dash = options.dash;
  }

  onOver(){
    window.popover.show(this, this.dash);
  }

  onOut(){
    window.popover.hide();
  }

};
