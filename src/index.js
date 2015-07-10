
import 'babel-core/polyfill';
import Machine from './Machine';

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

  window.machine = Machine({
    container: document.getElementById('container'),
    data: data
  });

  window.machine.start();
}

