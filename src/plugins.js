
import 'babel-core/polyfill';
import Handlebars from 'hbsfy/runtime';
import moment from 'moment';

Handlebars.registerHelper('parseDate', unixTime => {
  return moment.unix(unixTime).format('DD MM YYYY');
});