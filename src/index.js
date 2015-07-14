
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

httpReq.open("GET", "/dashboards.json", true);
httpReq.send();

function init(data){

  window.popover = new Popover({
    container: document.getElementById('popover')
  });

  window.machine = Machine({
    container: document.getElementById('container'),
    data: data
  });

  window.machine.start();
}

