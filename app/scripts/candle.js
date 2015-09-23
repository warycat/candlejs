/* global $ loadJS Input  */

var Candle = function (assets, canvasConfig){
  this._about = 'This project is based on candle.js';
  this._entities = [];
  this._images = {};
  this._jsons = {};
  this._sounds = {};
  this._assets = assets;
  this.setCanvas(canvasConfig);
  this._loop = null;
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
, get input(){
    return this._input;
  }
, get loop(){
    return this._loop;
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
  this._canvas.style.background = '#000000';
  this._ctx = this._canvas.getContext('2d');
};

Candle.prototype.about = function(){
  console.log(this._about);
};


Candle.prototype.loadScripts = function(onProgress, callback){
  var self = this;
  var scriptSrcs = $.map(this.assets.scriptFiles, function(file){
    return self.assets.scriptFolder + file;
  });
  var progress = 0;
  var script = scriptSrcs[progress];
  var internalCallback = function () {
    if (++progress === scriptSrcs.length) {
      callback();
    }else{
      onProgress(self.assets.scriptFiles[progress]);
      script = scriptSrcs[progress];
      loadJS(script, internalCallback);
    }
  };
  loadJS(script, internalCallback);
};

Candle.prototype.loadImages = function(onProgress, callback) {
  var self = this;
  var imageFolder = this.assets.imageFolder;
  var imageFiles = this.assets.imageFiles;
  var remaining = imageFiles.length;
  var onload = function() {
    onProgress(self.assets.imageFiles[remaining]);
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

Candle.prototype.loadJsons = function(onProgress, callback){
  var self = this;
  var jsonFolder = this.assets.jsonFolder;
  var jsonFiles = this.assets.jsonFiles;
  var remaining = jsonFiles.length;
  var onload = function(){
    self._jsons[this.fileName] = JSON.parse(this.responseText);
    remaining--;
    onProgress(self.assets.jsonFiles[remaining]);
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

Candle.prototype.loadSounds = function(onProgress, callback){
  var self = this;
  var soundFiles = this.assets.soundFiles;
  var soundFolder = this.assets.soundFolder;
  var remaining = soundFiles.length;
  var oncanplaythrough = function(){
    remaining--;
    onProgress(self.assets.soundFiles[remaining]);
    // console.log(remaining);
    if(remaining === 0){
      callback();
    }
  };
  for (var i = 0; i < soundFiles.length; i++){
    var fileName = soundFiles[i];
    var soundPath = soundFolder + fileName;
    var audioElm = new Audio();
    audioElm.addEventListener('canplaythrough', oncanplaythrough, false);
    audioElm.src = soundPath;
    audioElm.load();
    document.body.appendChild(audioElm);
    this._sounds[fileName] = audioElm;
  }
};


Candle.prototype.load = function(game, onProgress, onEnd){
  var self = this;
  self.about();
  self.test();
  self.loadScripts(onProgress, function(){
    console.log('scripts did load');
    self.loadImages(onProgress, function(){
      console.log('images did load');
      self.loadJsons(onProgress, function(){
        console.log('jsons did load');
        self.loadSounds(onProgress, function(){
          console.log('sounds did load');
          self._input = new Input();
          self._loop = game.call(self);
          onEnd();
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
  ctx.save();
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
  ctx.restore();
};


