/* global $ loadJS Input Loop God Player Camera Plane */

var Candle = function (assets, canvasConfig){
  this._about = 'This project is based on candle.js';
  this._entities = [];
  this._images = {};
  this._jsons = {};
  this._sounds = {};
  this._assets = assets;
  this.setCanvas(canvasConfig);
};

Candle.PPU = 128;

Candle.prototype = {
  get assets(){
    return this._assets;
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
, get sounds(){
    return this._sounds;
  }
, get ctx(){
    return this._ctx;
  }
, get loop(){
    return this._loop;
  }
, get input(){
    return this._input;
  }
};

Candle.prototype.setCanvas = function(opt){
  this._canvas = document.getElementById(opt.id || 'display');
  this._canvas.width = opt.width || 640;
  this._canvas.height = opt.height || 480;
  this._canvas.style.position = opt.position;
  this._canvas.style.top = opt.top;
  this._canvas.style.left = opt.left;
  this._canvas.style.display = 'block';
  // this._canvas.style.margin = 'auto';
  this._canvas.style.background = '#f0f0f0';
  this._ctx = this._canvas.getContext('2d');
};

Candle.prototype.about = function(){
  console.log(this._about);
};

Candle.prototype.scriptsDidLoad = function(){
  this._input = new Input();
  this._loop = new Loop();
};


Candle.prototype.loadScripts = function(callback){
  var scriptSrcs = $.map(this.assets.scriptFiles, function(file){
    return self.assets.scriptFolder + file;
  });
  var progress = 0;
  var script = scriptSrcs[progress];
  var internalCallback = function () {
    if (++progress === scriptSrcs.length) {
      callback();
    }else{
      script = scriptSrcs[progress];
      loadJS(script, internalCallback);
    }
  };
  loadJS(script, internalCallback);
};

Candle.prototype.loadImages = function(callback) {
  var imageFolder = this.assets.imageFolder;
  var imageFiles = this.assets.imageFiles;
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

Candle.prototype.loadJsons = function(callback){
  var jsonFolder = this.assets.jsonFolder;
  var jsonFiles = this.assets.jsonFiles;
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

Candle.prototype.loadSounds = function(callback){
  var soundFiles = this.assets.soundFiles;
  var soundFolder = this.assets.soundFolder;
  var remaining = soundFiles.length;
  var oncanplaythrough = function(){
    remaining--;
    console.log(remaining);
    if(remaining === 0){
      callback();
    }
  };
  for (var i = 0; i < soundFiles.length; i++){
    var fileName = soundFiles[i];
    var soundPath = soundFolder + fileName;
    var audioElm = document.createElement('audio');
    audioElm.src = soundPath;
    audioElm.oncanplaythrough = oncanplaythrough;
    document.body.appendChild(audioElm);
    this._sounds[fileName] = audioElm;
  }
};


Candle.prototype.load = function(callback){
  var self = this;
  self.about();
  self.test();
  self.loadSounds(function(){
    self.loadScripts(function(){
      self.loadImages(function(){
        self.loadJsons(function(){
          self.scriptsDidLoad();
          callback.call(self);
        });
      });
    });
  });
};

Candle.prototype.test = function(){
  if (this.assets.scriptFolder === undefined ) { console.log('scriptFolder: ', this.assets.scriptFolder); }
  if (this.assets.scriptFiles === undefined ) { console.log('scriptFiles: ', this.assets.scriptFiles); }
  if (this.assets.imageFolder === undefined ) { console.log('imageFolder: ', this.assets.imageFolder); }
  if (this.assets.imageFiles === undefined ) { console.log('imageFiles: ', this.assets.imageFiles); }
  if (this.assets.jsonFolder === undefined ) { console.log('jsonFolder: ', this.assets.jsonFolder); }
  if (this.assets.jsonFiles === undefined ) { console.log('jsonFiles: ', this.assets.jsonFiles); }
  if (this.assets.soundFolder === undefined ) { console.log('soundFolder: ', this.assets.soundFolder); }
  if (this.assets.soundFiles === undefined ) { console.log('soundFiles: ', this.assets.soundFiles); }
};

Candle.prototype.render = function(ws, es){
  var ctx = this.ctx;
  var rs = [];
  for(var i in ws){
    var w = ws[i];
    if(w){
      rs.push(w);
    }
  }
  for(var j in es){
    var e = es[j];
    if(e){
      rs.push(e);
    }
  }

  function compare(a, b){
    if(a.distance < b.distance) {
      return 1;
    }
    if(a.distance > b.distance) {
      return -1;
    }
    return 0;
  }

  rs.sort(compare);

  for(var k in rs){
    var r = rs[k];
    ctx.drawImage(r.texture, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh);
  }
};


Candle.prototype.wolf3d = function(){
  var level = this.jsons['gangnamLevel.json'];
  var input = new Input();
  var loop = new Loop();
  var player = new Player('larry');
  player.setPosition(12, 12);
  player.setTheta(Math.PI);

  player.control = function(){
    var states = input.states;
    var speed = (states.up - states.down) * 0.005;
    var omega = (states.right - states.left) * 0.002;
    this.setOmega(omega);
    this.setSpeed(speed);
  };

  var canvas = this.canvas;
  // var sky = new Sky(canvas, this.images['sky1.jpg']);
  var plane = new Plane(canvas, level.ceiling, level.floor, this.images['tiles.png'], 64, level.grids);

  var camera = new Camera(canvas, 2, 32, 0.8, plane);
  var artifactsInfo = {
    info: this.jsons['artifacts.json']
  , texture: this.images['artifacts.png']
  };
  var botsInfo = {
  '500': {
      name: 'Gangnam'
    , tag: 500
    , texture: this.images['gangnam.png']
    , atlas: this.jsons['gangnamAtlas.json']
    , animations: this.jsons['gangnamAnimations.json']
    }
  };
  var god = new God(canvas, artifactsInfo, botsInfo, 64, level.grids);
  var bots = god.bots;
  for(var i = 0; i < bots.length; i++){
    var bot = bots[i];
    if(bot.tag === 500){
      bot.setAnimation('step1');
    }
  }
  this.sounds['gangnam.mp3'].play();

  player.bindActionKey('space', 1000, function(){
    god.render();
  });

  loop.start(function(ms){
    player.control();
    player.motion(ms);
    player.onActionKey('space', input.states.space, ms);
    // sky.render(ms, player.theta, canvas.height / 2);
    plane.render();
    camera.castRays(player, plane);
    god.animate(ms);
    god.viewFrom(player, 0.8);
    var ws = camera.render();
    var es = god.render();
    this.render(ws, es);
  }.bind(this));
};

