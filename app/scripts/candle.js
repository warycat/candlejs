/*global $ loadJS Input Loop Player Camera Plane Sky*/


var Candle = function (){
  this._about = 'This project is based on candle.js';
  this.setCanvas({});
  this._entities = [];
  this._images = [];
  this._sounds = [];
  this._imageFiles = ['sky1.jpg'];
  this._imageFoler = 'images/';
  this._scriptFolder = 'scripts/';
  this._scriptFiles = ['input.js', 'loop.js', 'entity.js', 'player.js', 'plane.js', 'sky.js', 'camera.js'];
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
, get ctx(){
    return this._ctx;
  }
};

Candle.prototype.setCanvas = function(opt){
  this._canvas = document.getElementById(opt.id || 'display');
  this._canvas.width = opt.width || 640;
  this._canvas.height = opt.height || 480;
  this._canvas.style.display = 'block';
  this._canvas.style.margin = 'auto';
  this._canvas.style.background = '#f0f0f0';
  this._ctx = this._canvas.getContext('2d');
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
  var player = new Player('larry');

  player.control = function(){
    var states = input.states;
    var speed = (states.up - states.down) * 0.1;
    var omega = (states.right - states.left) * 0.002;
    this.setOmega(omega);
    this.setSpeed(speed);
  };

  var canvas = this.canvas;
  var sky = new Sky(canvas, this.images['sky1.jpg']);
  var plane = new Plane(32);
  var camera = new Camera(canvas, 2, 7, 0.8);

  player.bindActionKey('space', 1000, function(){
    console.log('cast');
    camera.castRays(player, plane);
  });

  loop.start(function(ms){
    player.control();
    player.motion(ms);
    player.onActionKey('space', input.states.space, ms);
    sky.render(ms, player.theta, canvas.height / 2);
    camera.render(ms);
  });
};

