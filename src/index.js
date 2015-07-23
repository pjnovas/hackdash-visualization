
import './plugins';
import Machine from './Machine';
import Popover from './Popover';

$(function(){
  $('.search').hide();
  $.getJSON(window.dashboards_uri, init);
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

  var dashes = data.filter( dash => {
    return dash.rels.length;
  });

  dashes = dashes.map( dash => {
    return { value: dash.d + ' [' + dash.rels.length + ']', data: dash };
  });

  $('#search').autocomplete({
    lookupLimit: 5,
    lookup: dashes,
    onSelect: function (suggestion) {
      if (suggestion && suggestion.value){
        window.machine.showRelationsFor(suggestion.data.d);
        $('#search').val('');
      }
    }
  });

/*
  // Removed API call since there are dashboards wich are not on the visualization.

  $('#search').autocomplete({
    serviceUrl: 'https://hackdash.org/api/v2/dashboards',
    deferRequestBy: 300,
    paramName: 'q',
    params: { limit: 5 },
    transformResult: function(response) {
      var list = JSON.parse(response);

      return {
        suggestions: $.map(list, function(dashboard) {
          return { value: dashboard.domain, data: dashboard.domain };
        })
      };
    },
    onSelect: function (suggestion) {
      if (suggestion && suggestion.value){
        window.machine.showRelationsFor(suggestion.value);
      }
    }
  });
*/
  window.machine.start();
}

