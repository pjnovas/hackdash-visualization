
import './plugins';
import Machine from './Machine';
import Popover from './Popover';

var httpReq = new XMLHttpRequest();

httpReq.onreadystatechange = () => {
  if (httpReq.readyState == 4 && httpReq.status == 200) {
    var data = JSON.parse(httpReq.responseText);
    init(data);
  }
};

httpReq.open("GET", window.dashboards_uri, true);
httpReq.send();

function init(data){

  window.popover = new Popover({
    container: document.getElementById('popover')
  });

  window.machine = Machine({
    container: document.getElementById('container'),
    data: data
  });

  var radius = document.getElementById('radius');
  var height = document.getElementById('height');

  radius.addEventListener('change', e => {
    var val = radius.options[radius.selectedIndex].value;
    window.machine.changeMetric('radius', val);
  });

  height.addEventListener('change', e => {
    var val = height.options[height.selectedIndex].value;
    window.machine.changeMetric('height', val);
  });

  var hideOthres = document.getElementById('hide-others');
  hideOthres.addEventListener('click', e => {
    window.machine.toggleNonRelated();
    hideOthres.innerHTML = window.hideNonRelated ? '&#8593' : '&#8595';
  });

  var clearRel = document.getElementById('clear-relations');
  clearRel.addEventListener('click', e => {
    window.machine.clearRel();
  });

  var help = document.getElementById('help');
  var helpInfo = document.getElementById('help-info');
  help.addEventListener('click', e => {
    helpInfo.style.display = (helpInfo.style.display === 'none' ? 'block' : 'none');
  });

  window.machine.start();
}

