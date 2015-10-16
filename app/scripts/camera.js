/* global Candle */

// Constructor
var Camera = function(canvas, ppc, range, focus, plane){
  this._canvas = canvas;
  this._ctx = canvas.getContext('2d');
  this._ppc = ppc;
  this._resolution = Math.floor(canvas.width / this._ppc);
  this._range = range;
  this._focus = focus;
  this._plane = plane;
  this._columns = [];
  this._rays = [];
  this._render = [];
};

// Properties
Camera.prototype = {
  get canvas(){
    return this._canvas;
  }
, get ctx(){
    return this._ctx;
  }
, get ppc(){
    return this._ppc;
  }
, get resolution(){
    return this._resolution;
  }
, get range(){
    return this._range;
  }
, get focus(){
    return this._focus;
  }
, get plane(){
    return this._plane;
  }
, get columns(){
    return this._columns;
  }
, get rays(){
    return this._rays;
  }
};

// Render function
Camera.prototype.render = function(){
  return this._render;
};

// Camera cast all rays from holder
Camera.prototype.castRays = function(holder){
  var texture = this.plane.image;
  var width = this.ppc;

  for(var i = 0; i < this.resolution; i++){
    var y = i / this.resolution - 0.5;
    var angle = Math.atan2(y, this.focus);
    var ray = this.castRay(holder.position, holder.theta + angle);
    this.rays[i] = ray;
    var left = this.ppc * i;
    var hit = 0;

    while (hit < ray.length && ray[hit].height <= 0){
      hit++;
    }
    for (var s = ray.length - 1; s >= 0; s--) {
      var step = ray[s];
      if (s === hit) {
        var wall = this.project(step.height, angle, step.distance);
        var textureX = Math.floor(Candle.PPU * (step.texture - 1 + step.offset));
        this._render[i] = {
          distance: step.distance
        , texture: texture
        , sx: textureX
        , sy: 0
        , sw: 1
        , sh: Candle.PPU
        , dx: left
        , dy: wall.top
        , dw: width
        , dh: wall.height
        };
        break;
      }else{
        this._render[i] = null;
      }
    }
  }
};

// Camera cast a single ray
Camera.prototype.castRay = function(position, angle){
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  var self = this;

  var step_ = function (rise, run, x, y, inverted) {
    if (run === 0) {
      return { length2: Infinity };
    }

    var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
    var dy = dx * (rise / run);
    return {
      x: inverted ? y + dy : x + dx,
      y: inverted ? x + dx : y + dy,
      length2: dx * dx + dy * dy
    };
  };

  var inspect = function(step, shiftX, shiftY, distance, offset) {
    var dx = cos < 0 ? shiftX : 0;
    var dy = sin < 0 ? shiftY : 0;
    var grid = self.plane.getWall(Math.floor(step.x - dx), Math.floor(step.y - dy));
    step.texture = grid > 0 ? grid : 0;
    step.height = grid > 0 ? 1 : 0;
    step.distance = distance + Math.sqrt(step.length2);
    if (shiftX) {
      step.shading = cos < 0 ? 2 : 0;
    }else{
      step.shading = sin < 0 ? 2 : 1;
    }
    step.offset = offset - Math.floor(offset);
    return step;
  };

  var ray = function(origin) {
    var stepX = step_(sin, cos, origin.x, origin.y, false);
    var stepY = step_(cos, sin, origin.y, origin.x, true);
    var nextStep = stepX.length2 < stepY.length2 ? inspect(stepX, 1, 0, origin.distance, stepX.y) : inspect(stepY, 0, 1, origin.distance, stepY.x);

    if (nextStep.distance > self.range){
      return [origin];
    }
    return [origin].concat(ray(nextStep));
  };

  var point = {
    x: position.x
  , y: position.y
  , height: 0
  , distance: 0
  };

  return ray(point);
};


// Fisheye fix
Camera.prototype.project = function(height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = this.canvas.height * height / z;
  var bottom = this.canvas.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};



