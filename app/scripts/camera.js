var Camera = function(canvas, holder, plane){
  this._canvas = canvas;
  this._holder = holder;
  this._plane = plane;
  this._ctx = canvas.getContext('2d');
  this.callback = function(){};
  this._width = canvas.width;
  this._height = canvas.height;
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
, get holder(){
    return this._holder;
  }
, get plane(){
    return this._plane;
  }
};

Camera.prototype.render = function(){
  // var position = this._holder.position;
  // var theta = this._holder.theta;
  // console.log(position.x, position.y, theta);
  // this.drawSky(theta, this.plane.skyImage);
};

