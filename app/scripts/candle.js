/*global $ loadJS Input Loop Entity Camera*/

var Candle = function (){
  this._about = 'This project is based on candle.js';
  this._canvas = document.getElementById('display');
  this._canvas.width = 640;
  this._canvas.height = 480;
  this._canvas.style.background = '#f0f0f0';
  this._entities = [];
  this._images = [];
  this._sounds = [];
  this._scriptsPath = 'scripts/';
  this._scripts = ['input.js', 'loop.js', 'entity.js', 'camera.js'];
};

Candle.prototype.about = function(){
  console.log(this._about);
};

Candle.prototype.init = function(scripts){
  this._scripts.push.apply(this._scripts, scripts);
};

Candle.prototype.getScripts = function(){
  var self = this;
  var scripts = $.map(this._scripts, function(script){
    return self._scriptsPath + script;
  });
  return scripts;
};

Candle.prototype.loadScripts = function(scripts, callback){
  var progress = 0;
  var internalCallback = function () {
    if (++progress === scripts.length) {
      callback();
    }
  };
  scripts.forEach(function(script) {
    loadJS(script, internalCallback);
  });
};

Candle.prototype.load = function(){
  this.about();
  var scripts = this.getScripts();
  this.loadScripts(scripts, this.wolf3d.bind(this));
};

Candle.prototype.getCanvas = function(){
  return this._canvas;
};

Candle.prototype.wolf3d = function(){
  var input = new Input();
  var loop = new Loop();
  var player = new Entity();
  player.control = function(){
    var states = input.states;
    var speed = states.forward - states.backward * 1;
    var omega = states.right - states.left * 1;
    this.setOmega(omega);
    this.setSpeed(speed);
  };
  var canvas = this.getCanvas();
  var camera = new Camera(canvas, player);

  loop.start(function(ms){
    player.control();
    player.motion(ms);
    camera.render(ms);
  });
};

