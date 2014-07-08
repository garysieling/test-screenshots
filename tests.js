var page = require('webpage').create();

var today = new Date();
var dateStr = 
  today.getFullYear().toString() + '-' +
  today.getMonth().toString() + '-' +
  today.getDate().toString() + '-' +
  today.getHours().toString() + '-' +
  today.getMinutes().toString();

var urls = [ 
  'http://time.gov/HTML5/',
  'http://time.gov/HTML5/',
  'http://time.gov/HTML5/',
  'http://time.gov/HTML5/',
  'http://time.gov/HTML5/'
]

function render(url, file, yield) {
  return function() {
    console.log('Loading ' + url + '...');
    var me = this;
    page.open(url, function() {
      console.log('Rendering ' + file + '...');
      page.render(file);

      yield();
    });
  };
}

var fn = 
  function() { 
    phantom.exit(); 
  };

for (var i = 0; i < urls.length; i++) {
  fn = render(urls[i], i + '-' + dateStr + '.png', fn);
}

fn();
