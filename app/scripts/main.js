/* global Candle*/

var loadJS = function(file, callback) {
  // DOM: Create the script element
  var jsElm = document.createElement('script');
  // set the type attribute
  jsElm.type = 'application/javascript';
  jsElm.onload = callback;
  // make the script element load file
  jsElm.src = file;
  // finally insert the element to the body element in order to load the script
  document.body.appendChild(jsElm);
};

loadJS('scripts/candle.js', function(){
  var candle = new Candle();
  candle.load('wolf3d');
});
