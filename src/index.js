
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

httpReq.open("GET", "/js/dashboards.json", true);
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

  var toggleRel = document.getElementById('toggle-relations');
  toggleRel.addEventListener('click', e => {
    window.machine.toggleNonRel();
  });

  var toggleRelLines = document.getElementById('toggle-rel-lines');
  toggleRelLines.addEventListener('click', e => {
    window.machine.toggleRelLines();
  });

  var help = document.getElementById('help');
  help.addEventListener('click', e => {
    window.alert('Shows people inside one dashboard on which other dashboards are also in.');
  });

  window.machine.start();
}

