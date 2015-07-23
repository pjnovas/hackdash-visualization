
import 'babel-core/polyfill';
import jQuery from 'jquery';
import Handlebars from 'hbsfy/runtime';
import moment from 'moment';

window.jQuery = jQuery;
window.$ = jQuery;

import 'devbridge-autocomplete';

Handlebars.registerHelper('parseDate', unixTime => {
  return moment.unix(unixTime).format('DD/MM/YYYY');
});

// helper function to round floats before drawing
window.f = function(v){
  return Math.floor(v);
};