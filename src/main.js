import Arcadia from './lib/arcadia';

let ajaxSettings = {
  url: 'index.html',
  type: 'get',
  success: (data) => {
    console.log(`Response Length: ${data.length}`);
  }
};

Arcadia.ajax(ajaxSettings);

Arcadia.ajax().call(ajaxSettings);

delete ajaxSettings.type;

Arcadia.ajax().get(ajaxSettings);
