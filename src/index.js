
import './plugins';
import Machine from './Machine';
import Popover from './Popover';
import _ from 'lodash';

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
    var icon = $(this).children('.icon');

    if (window.hideNonRelated){
      icon.removeClass('icon-down-big').addClass('icon-up-big');
    }
    else {
      icon.removeClass('icon-up-big').addClass('icon-down-big');
    }
  });

  $('#clear-relations').on('click', window.machine.clearRel);

  $('#help').on('click', function(){
    $('#help-info').toggle();
  });

  $('.relations-options > a').on('click', function(){
    var rels = this.id.split('-');
    window.machine.showRelated(rels[0], rels[1]);
  });

  var dashesByDomain = {};
  var dashes = data.forEach( dash => {
    if(dash.rels.length){
      dashesByDomain[dash.d] = dash;
    }
  });

  $('#search').autocomplete({
    serviceUrl: 'https://hackdash.org/api/v2/dashboards',
    deferRequestBy: 300,
    paramName: 'q',
    params: { limit: 10 },
    transformResult: function(response) {
      var list = JSON.parse(response);

      list = list.filter( dashboard => {
        return dashesByDomain[dashboard.domain] ? true : false;
      });

      return {
        suggestions: $.map(_.take(list, 5), function(dashboard) {
          var rels = ' [' + dashesByDomain[dashboard.domain].rels.length + ']';

          return {
            value: (dashboard.title || dashboard.domain) + rels,
            data: dashboard
          };
        })
      };
    },
    onSelect: function (suggestion) {
      if (suggestion && suggestion.value){
        window.machine.showRelationsFor(suggestion.data.domain);
      }
    }
  });

  /*

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
  */

  window.machine.start();
}

