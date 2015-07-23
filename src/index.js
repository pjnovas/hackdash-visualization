
import './plugins';
import Machine from './Machine';
import Popover from './Popover';

$(function(){
  $.ajax(window.dashboards_uri).done(init);
});

function init(data){

  window.popover = new Popover({
    container: $('#popover').get(0)
  });

  window.machine = Machine({
    container: $('#container').get(0),
    data: data
  });

  $('#radius').on('change', function(e) {
    window.machine.changeMetric('radius', $(this).val());
  });

  $('#height').on('change', function(e) {
    window.machine.changeMetric('height', $(this).val());
  });

  $('#hide-others').on('click', function(){
    window.machine.toggleNonRelated();
    $(this).html(window.hideNonRelated ? '&#8593' : '&#8595');
  });

  $('#clear-relations').on('click', window.machine.clearRel);

  $('#help').on('click', function(){
    $('#help-info').toggle();
  });

  window.machine.start();
}

