/*global $ loadJS Input Loop Player Camera Plane */


var Candle = function (){
  this._about = 'This project is based on candle.js';
  this.setCanvas({});
  this._entities = [];
  this._images = [];
  this._jsons = [];
  this._sounds = [];

  this._imageFiles = ['sky1.jpg', 'wall_texture.jpg', 'tiles.png'];
  this._imageFoler = 'images/';

  this._jsonFiles = ['levels.json', 'Wolf00.json'];
  this._jsonFolder = 'jsons/';

  this._scriptFiles = ['input.js', 'loop.js', 'entity.js', 'level.js', 'plane.js', 'sky.js', 'camera.js', 'player.js'];
  this._scriptFolder = 'scripts/';
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
, get jsonFiles(){
    return this._jsonFiles;
  }
, get jsonFolder(){
    return this._jsonFolder;
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
, get jsons(){
    return this._jsons;
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

Candle.prototype.loadJsons = function(jsonFolder, jsonFiles, callback){
  var remaining = jsonFiles.length;
  var self = this;
  var onload = function(){
    self._jsons[this.fileName] = JSON.parse(this.responseText);
    remaining--;
    if(remaining === 0){
      callback();
    }
  };
  for (var i = 0; i < jsonFiles.length; i++) {
    var fileName = jsonFiles[i];
    var jsonPath = jsonFolder + fileName;
    var xhr = new XMLHttpRequest();
    xhr.fileName = fileName;
    xhr.onload = onload;
    xhr.open('GET', jsonPath);
    xhr.send();
  }
};


Candle.prototype.load = function(){
  var self = this;
  self.about();
  self.loadScripts(self.scriptSrcs, function(){
    self.loadImages(self.imageFolder, self.imageFiles, function(){
      self.loadJsons(self.jsonFolder, self.jsonFiles, function(){
        self.wolf3d();
      });
    });
  });
};

Candle.prototype.wolf3d = function(){
  // var level = new Level(this.jsons['levels.json']['maps/w00.map']);
  // var newlevels = {};
  // for(var i=0; i<3; i++){
  //   for(var j=0; j<10; j++){
  //     var key = 'maps/w' + i + j + '.map';
  //     var str = this.jsons['levels.json'][key];
  //     var level = new Level(str);
  //     console.log('Wolf'+i+j+'.json');
  //     level.print();
  //   }
  // }
  var level = this.jsons['Wolf00.json'];
  var input = new Input();
  var loop = new Loop();
  var player = new Player('larry');

  player.control = function(){
    var states = input.states;
    var speed = (states.up - states.down) * 0.005;
    var omega = (states.right - states.left) * 0.002;
    this.setOmega(omega);
    this.setSpeed(speed);
  };

  var canvas = this.canvas;
  // var sky = new Sky(canvas, this.images['sky1.jpg']);
  var plane = new Plane(canvas, level.ceiling, level.floor, 64, this.images['tiles.png'], level.grids);
  var camera = new Camera(canvas, 8, 32, 0.8, plane);

  player.bindActionKey('space', 1000, function(){
    // camera.render();
  });

  loop.start(function(ms){
    player.control();
    player.motion(ms);
    // console.log(player.position.x, player.position.y);
    player.onActionKey('space', input.states.space, ms);
    // sky.render(ms, player.theta, canvas.height / 2);
    plane.render();
    camera.castRays(player, plane);
    camera.render(ms);
  });
};

