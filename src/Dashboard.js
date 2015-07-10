
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
  }

  set(prop, value){
    this[prop] = value;
    this.create();
  }

  update(dt) {

  }

};
