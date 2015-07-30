/*global $ loadJS Input Loop Entity Camera Plane*/


var Candle = function (){
  this._about = 'This project is based on candle.js';
  this.setCanvas({});
  this._entities = [];
  this._images = [];
  this._sounds = [];
  this._imageFiles = ['sky1.jpg'];
  this._imageFoler = 'images/';
  this._scriptFolder = 'scripts/';
  this._scriptFiles = ['input.js', 'loop.js', 'entity.js', 'plane.js', 'camera.js'];
};

Candle.prototype = {
  get scriptSrcs(){
    var self = this;
    var scripts = $.map(this._scriptFiles, function(file){
      return self._scriptFolder + file;
    });
    return scripts;
  }
, get imageFolder(){
    return this._imageFoler;
  }
, get imageFiles(){
    return this._imageFiles;
  }
, get imageSrcs(){
    var self = this;
    var images = $.map(this._imageFiles, function(file){
      return self._imageFoler + file;
    });
    return images;
  }
, get canvas(){
    return this._canvas;
  }
, get images(){
    return this._images;
  }
};

Candle.prototype.setCanvas = function(opt){
  this._canvas = document.getElementById(opt.id || 'display');
  this._canvas.width = opt.width || 640;
  this._canvas.height = opt.height || 480;
  this._canvas.style.display = 'block';
  this._canvas.style.margin = 'auto';
  this._canvas.style.background = '#f0f0f0';
};

Candle.prototype.about = function(){
  console.log(this._about);
};

Candle.prototype.init = function(scripts){
  this._scripts.push.apply(this._scripts, scripts);
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

Candle.prototype.loadImages = function(imageFolder, imageFiles, callback) {
  var remaining = imageFiles.length;
  var onload = function() {
    remaining--;
    if (remaining === 0) {
      callback();
    }
  };
  for (var i = 0; i < imageFiles.length; i++) {
    var img = new Image();
    console.log(img);
    var file = imageFiles[i];
    this._images[file] = img;
    img.onload = onload;
    img.src = imageFolder + file;
  }
};

Candle.prototype.load = function(){
  var self = this;
  self.about();
  self.loadScripts(self.scriptSrcs, function(){
    self.loadImages(self.imageFolder, self.imageFiles, function(){
      self.wolf3d();
    });
  });
};

Candle.prototype.wolf3d = function(){
  var input = new Input();
  var loop = new Loop();
  var player = new Entity();
  player.control = function(){
    var states = input.states;
    var speed = (states.forward - states.backward) * 0.1;
    var omega = (states.right - states.left) * 0.002;
    this.setOmega(omega);
    this.setSpeed(speed);
  };
  var canvas = this.canvas;
  var plane = new Plane(this.images);
  var camera = new Camera(canvas, player, plane);
  loop.start(function(ms){
    player.control();
    player.motion(ms);
    camera.render(ms);
  });
};

