import Arcadia from 'lib/arcadia';

let arcadia = new Arcadia();

arcadia.ajax().get({
  url: 'index.html',
  success: (data) => {
    console.log(`Response Length: ${data.length}`);
  }
});
