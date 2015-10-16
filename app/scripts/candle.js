/* global $ Keyboard */

// Constructor
var Candle = function (){
  this._about = 'This project is based on candle.js';
  this._entities = [];
  this._images = {};
  this._jsons = {};
  this._sounds = {};
  this._loop = null;
  this._startX = 0;
  this._startY = 0;
  this._endX = 0;
  this._endY = 0;
  this._touchKey = 0;
  this._touchCount = 0;
  this._touchStatus = {UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0};
  document.ontouchstart = this.touchstart.bind(this);
  document.ontouchmove = this.touchmove.bind(this);
  document.ontouchend = this.touchend.bind(this);
  document.ontouchcancel = this.touchcancel.bind(this);
  this._onTap = function(){};
};

// Pixel Per Unit (the size of a block)
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
, get deltaX(){
    return this._endX - this._startX;
  }
, get deltaY(){
    return this._endY - this._startY;
  }
, get touchSquare(){
    return this.deltaX * this.deltaX + this.deltaY * this.deltaY;
  }
, get keyboard(){
    return this._keyboard;
  }
, get touchStatus(){
    switch(this.touchKey()){
    case 0:
      this._touchStatus.UP = 0;
      this._touchStatus.DOWN = 0;
      this._touchStatus.LEFT = 0;
      this._touchStatus.RIGHT = 0;
      break;
    case 1:
      this._touchStatus.UP = 0;
      this._touchStatus.DOWN = 0;
      this._touchStatus.LEFT = 1;
      this._touchStatus.RIGHT = 0;
      break;
    case 2:
      this._touchStatus.UP = 1;
      this._touchStatus.DOWN = 0;
      this._touchStatus.LEFT = 1;
      this._touchStatus.RIGHT = 0;
      break;
    case 3:
      this._touchStatus.UP = 1;
      this._touchStatus.DOWN = 0;
      this._touchStatus.LEFT = 0;
      this._touchStatus.RIGHT = 0;
      break;
    case 4:
      this._touchStatus.UP = 1;
      this._touchStatus.DOWN = 0;
      this._touchStatus.LEFT = 0;
      this._touchStatus.RIGHT = 1;
      break;
    case 5:
      this._touchStatus.UP = 0;
      this._touchStatus.DOWN = 0;
      this._touchStatus.LEFT = 0;
      this._touchStatus.RIGHT = 1;
      break;
    case 6:
      this._touchStatus.UP = 0;
      this._touchStatus.DOWN = 1;
      this._touchStatus.LEFT = 0;
      this._touchStatus.RIGHT = 1;
      break;
    case 7:
      this._touchStatus.UP = 0;
      this._touchStatus.DOWN = 1;
      this._touchStatus.LEFT = 0;
      this._touchStatus.RIGHT = 0;
      break;
    case 8:
      this._touchStatus.UP = 0;
      this._touchStatus.DOWN = 1;
      this._touchStatus.LEFT = 1;
      this._touchStatus.RIGHT = 0;
      break;
    }
    return this._touchStatus;
  }
};

// Assets setter
Candle.prototype.setAssets = function(assets){
  this._assets = assets;
};

// Canvas setter
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

// About
Candle.prototype.about = function(){
  console.log(this._about);
};

// Load all scripts with progress callback
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
      self.loadJS(script, internalCallback);
    }
  };
  self.loadJS(script, internalCallback);
};

// Load all images with progress callback
Candle.prototype.loadImages = function(onProgress, callback) {
  var self = this;
  var imageFolder = this.assets.imageFolder;
  var imageFiles = this.assets.imageFiles;
  var remaining = imageFiles.length;
  var onload = function() {
    remaining--;
    onProgress(self.assets.imageFiles[remaining]);
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

// Load all jsons with progress callback
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

// Load all sounds with progress callback
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

// Load game and everything
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
          self._keyboard = new Keyboard();
          self._loop = game.call(self);
          onEnd();
        });
      });
    });
  });
};

// Testing assets folder and files
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

// Render all objects in 3d space
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

// Mobile and tablet check
/*eslint-disable */
Candle.prototype.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
/*eslint-enable */

// Load Javascript function
Candle.prototype.loadJS = function(file, callback) {
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

// Touch start event handle
Candle.prototype.touchstart = function(e){
  e.preventDefault();
  this._touchCount++;
  this._startX = e.touches[0].clientX;
  this._startY = e.touches[0].clientY;
  this._endX = e.touches[0].clientX;
  this._endY = e.touches[0].clientY;
};

// Touch move event handle
Candle.prototype.touchmove = function(e){
  e.preventDefault();
  this._endX = e.touches[0].clientX;
  this._endY = e.touches[0].clientY;
};

// Touch end event handle
Candle.prototype.touchend = function(e){
  e.preventDefault();
  this._touchCount--;
  if(this._touchCount === 0) {
    this.onTap();
  }
  this._startX = 0;
  this._startY = 0;
  this._endX = 0;
  this._endY = 0;
};

// Touch cancel event handle
Candle.prototype.touchcancel = function(e){
  e.preventDefault();
  this._touchCount--;
  if(this._touchCount === 0) {
    this.onTap();
  }
  this._startX = 0;
  this._startY = 0;
  this._endX = 0;
  this._endY = 0;
};

// Create a virtual touch key based on touch displacement value form 1 to 8. 0 for not touching.
Candle.prototype.touchKey = function(){
  if(this._touchCount === 0 || this.touchSquare < 100){
    this._touchKey = 0;
  }else{
    this._touchKey = Math.ceil(Math.atan2(this.deltaY, this.deltaX) / Math.PI * 4 + 3.5) % 8 + 1;
  }
  return this._touchKey;
};

Candle.prototype.onTap = function(){
  this._onTap.call(this);
};

Candle.prototype.bindTapAction = function(fn){
  this._onTap = fn;
};
