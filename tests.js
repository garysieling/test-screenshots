var fs = require('fs'),
    system = require('system');

String.prototype.hashCode = function(){
  var hash = 0;

  var primes = [
      3,     5,     7,    11,    13,    17,    19,    23,    29,
     31,    37,    41,    43,    47,    53,    59,    61,    67,    71, 
     73,    79,    83,    89,    97,   101,   103,   107,   109,   113, 
    127,   131,   137,   139,   149,   151,   157,   163,   167,   173, 
    179,   181,   191,   193,   197,   199,   211,   223,   227,   229, 
    233,   239,   241,   251,   257,   263,   269,   271,   277,   281, 
    283,   293,   307,   311,   313,   317,   331,   337,   347,   349, 
    353,   359,   367,   373,   379,   383,   389,   397,   401,   409, 
    419,   421,   431,   433,   439,   443,   449,   457,   461,   463, 
    467,   479,   487,   491,   499,   503,   509,   521,   523,   541, 
    547,   557,   563,   569,   571,   577,   587,   593,   599,   601, 
    607,   613,   617,   619,   631,   641,   643,   647,   653,   659, 
    661,   673,   677,   683,   691,   701,   709,   719,   727,   733, 
    739,   743,   751,   757,   761,   769,   773,   787,   797,   809, 
    811,   821,   823,   827,   829,   839,   853,   857,   859,   863, 
    877,   881,   883,   887,   907,   911,   919,   929,   937,   941, 
    947,   953,   967,   971,   977,   983,   991,   997,  1009,  1013, 
   1019,  1021,  1031,  1033,  1039,  1049,  1051,  1061,  1063,  1069, 
   1087,  1091,  1093,  1097,  1103,  1109,  1117,  1123,  1129,  1151, 
   1153,  1163,  1171,  1181,  1187,  1193,  1201,  1213,  1217,  1223,
   1229,  1231,  1237,  1249,  1259,  1277,  1279,  1283,  1289,  1291
  ];
 
  if (this.length == 0) return hash;
  for (var i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash ^= char * primes[i % primes.length];
  }
  hash = (Math.abs(hash) + '');
  hash = hash.substring(hash.length - 6, hash.length);
  return hash;
}

var today = new Date();
var dateStr = 
  today.getFullYear().toString() + '-' +
  today.getMonth().toString() + '-' +
  today.getDate().toString() + '-' +
  today.getHours().toString() + '-' +
  today.getMinutes().toString();

var f = fs.open(system.args[1], "r");
var conf = f.read();
f.close();

var conf = JSON.parse(conf);
var urls = conf.urls;

function render(url, file, yield) {
  var page = require('webpage').create();

  if (!!conf.auth) {
    var user = Object.keys(conf.auth)[0];
    page.settings.userName = user;
    page.settings.password = conf.auth[user];
  }

  if (!!conf.config && !!conf.config.cookies) {
    for (var key in conf.config.cookies) {
      phantom.addCookie({
        'name'     : key,
        'value'    : conf.config.cookies[key],
        'domain'   : conf.config.domain,
        'path'     : url.substring(url.indexOf('/')),
        'httponly' : true,
        'secure'   : false,
        'expires'  : (new Date()).getTime() + (1000 * 60 * 60)  
      });
    };
  }

  return function() {
    console.log('Loading ' + url + '...');
    var me = this;
    page.open(url, function() {
      var pause = 0;
      if (!!conf.config && !!conf.config.pause) 
        pause = conf.config.pause;

      window.setTimeout(function() {
        console.log('Rendering ' + file + '...');
        page.render(file);
        page.close();

        yield();
      }, pause * 1000);
    });
  };
}

var fn = 
  function() { 
    phantom.exit(); 
  };

var prefix = system.args[1].replace(".", "_");
fs.makeTree('screenshots/' + prefix);

for (var i = 0; i < urls.length; i++) {
  fn = render(urls[i], 'screenshots/' + prefix + '/' + JSON.stringify(urls[i]).hashCode() + '-' + dateStr + '.png', fn);
}

fn();
