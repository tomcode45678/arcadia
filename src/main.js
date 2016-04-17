/* globals console */
import Arcadia from './lib/arcadia';

// Ajax Examples
let ajaxSettings = {
  url: 'index.html',
  type: 'get',
  success: data => console.log(`Response Length: ${data.length}`)
};

Arcadia.ajax(ajaxSettings);

Arcadia.ajax().call(ajaxSettings);

delete ajaxSettings.type;

let ajax = Arcadia.ajax();

ajax.get(ajaxSettings);

ajax.get(ajaxSettings);


// domTraverse examples
let app = Arcadia.find('body');

function test () {
  console.log('Clicked!');
  app.off('click', test);
}

app.add('body').on('click', test);
