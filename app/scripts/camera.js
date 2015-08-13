var Camera = function(canvas, ppc, range, focus){
  this._canvas = canvas;
  this._ctx = canvas.getContext('2d');
  this._width = canvas.width;
  this._height = canvas.height;
  this._ppc = ppc;
  this._resolution = Math.floor(this._width / this._ppc);
  this._range = range;
  this._focus = focus;
  this._columns = [];
  this._rays = [];
};

Camera.prototype = {
  get canvas(){
    return this._canvas;
  }
, get ctx(){
    return this._ctx;
  }
, get width(){
    return this._width;
  }
, get height(){
    return this._height;
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
, get columns(){
    return this._columns;
  }
, get rays(){
    return this._rays;
  }
};


Camera.prototype.render = function(){
  // var position = this._holder.position;
  // var theta = this._holder.theta;
  // console.log(position.x, position.y, theta);
  // this.drawSky(theta, this.plane.skyImage);
  // console.log(this.theta);
};

Camera.prototype.castRays = function(holder, plane){
  for(var i = 0; i < this.resolution; i++){
    var y = i / this.resolution - 0.5;
    var angle = Math.atan2(y, this.focus);
    var ray = this.castRay(holder.position, holder.theta + angle, plane);
    this.rays[i] = ray;
    console.log(ray);
  }
};

Camera.prototype.castRay = function(position, angle, plane){
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  var self = this;

  var step = function (rise, run, x, y, inverted) {
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

  var inspect = function(s, shiftX, shiftY, distance, offset) {
    var dx = cos < 0 ? shiftX : 0;
    var dy = sin < 0 ? shiftY : 0;
    s.height = plane.getGrid(Math.floor(s.x - dx), Math.floor(s.y - dy));
    s.distance = distance + Math.sqrt(s.length2);
    if (shiftX) {
      s.shading = cos < 0 ? 2 : 0;
    }else{
      s.shading = sin < 0 ? 2 : 1;
    }
    s.offset = offset - Math.floor(offset);
    return s;
  };

  var ray = function(origin) {
    var stepX = step(sin, cos, origin.x, origin.y, false);
    var stepY = step(cos, sin, origin.y, origin.x, true);
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



