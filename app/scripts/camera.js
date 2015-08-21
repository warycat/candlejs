var Camera = function(canvas, ppc, range, focus, plane){
  this._canvas = canvas;
  this._ctx = canvas.getContext('2d');
  this._width = canvas.width;
  this._height = canvas.height;
  this._ppc = ppc;
  this._resolution = Math.floor(this._width / this._ppc);
  this._range = range;
  this._focus = focus;
  this._plane = plane;
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


Camera.prototype.render = function(){
  // var position = this._holder.position;
  // var theta = this._holder.theta;
  // console.log(position.x, position.y, theta);
  // this.drawSky(theta, this.plane.skyImage);
  // console.log(this.theta);
  // for(var i = 0; i < this.resolution; i++){
  //   var ray = this.rays[i];
  //   console.log(ray.length);
  // }
};

Camera.prototype.castRays = function(holder){

  var ctx = this.ctx;

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
      // var rainDrops = Math.pow(Math.random(), 3) * s;
      // var rain = (rainDrops > 0) && this.project(0.1, angle, step.distance);

      if (s === hit) {
        var texture = this.plane.image;
        // var textureX = Math.floor(texture.width * step.offset);
        // var textureX = texture.width * step.offset;
        var wall = this.project(step.height, angle, step.distance);

        // ctx.globalAlpha = 1;
        var textureX = Math.floor(128 * (step.texture - 1 + step.offset));
        ctx.drawImage(texture, textureX, 0, 1, texture.height / 2, left, wall.top, width, wall.height);
        // ctx.drawImage(texture.image, textureX, 0, 2, texture.height, left, wall.top, width, wall.height);
        // ctx.fillStyle = '#000000';
        // ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - 1, 0);
        // ctx.fillRect(left, wall.top, width, wall.height);
      }
      // ctx.fillStyle = '#ffffff';
      // ctx.globalAlpha = 0.15;
      // while (--rainDrops > 0) ctx.fillRect(left, Math.random() * rain.top, 1, rain.height);
    }
  }
};

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
    var grid = self.plane.getGrid(Math.floor(step.x - dx), Math.floor(step.y - dy));
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

Camera.prototype.project = function(height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = this.height * height / z;
  var bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};



