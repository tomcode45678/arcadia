/* eslint-disable no-console */
import app from './lib/arcadia';

// Ajax Examples
const ajaxSettings = {
  url: 'index.html',
  type: 'get',
  success: data => console.log(`Response Length: ${data.length}`)
};

const ajax = new app.Ajax(ajaxSettings);

ajax.call(ajaxSettings);

delete ajaxSettings.type;

ajax.get(ajaxSettings);

ajax.get(ajaxSettings);


// DOMHelper examples
const body = new app.DOMHelper('body');

function test () {
  console.log('Clicked!');
  body.off('click', test);
}

body.on('click', test);
