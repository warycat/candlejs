var Sprite = function(canvas, image, count, inteval, width, height, positionX, positionY, anchorX, anchorY){
  this._canvas = canvas;
  this._image = image;
  this._count = count;
  this._inteval = inteval;
  this._ms = 0;
  this._frame = 0;

  this._width = width;
  this._height = height;
  this._positionX = positionX;
  this._positionY = positionY;
  this._anchorX = anchorX;
  this._anchorY = anchorY;
  this._animate = false;
};

Sprite.prototype = {
  get frame(){
    return this._frame;
  }
, get inteval(){
    return this._inteval;
  }
, get count(){
    return this._count;
  }
, get width(){
    return this._width;
  }
, get height(){
    return this._height;
  }
, get positionX(){
    return this._positionX;
  }
, get positionY(){
    return this._positionY;
  }
, get anchorX(){
    return this._anchorX;
  }
, get anchorY(){
    return this._anchorY;
  }
, get ctx(){
    return this._canvas.getContext('2d');
  }
, get canvas(){
    return this._canvas;
  }
};

Sprite.prototype.animateOnce = function(){
  this._animate = true;
};


Sprite.prototype.render = function(ms){
  if(this._animate){
    if(this._ms > this.inteval){
      this._ms -= this.inteval;
      this._frame += 1;
      this._animate = (this._frame === this._count) ? false : true;
      this._frame = (this._frame === this._count) ? 0 : this._frame;
    }
    this._ms += ms;
  }

  var ctx = this.ctx;
  ctx.save();
  var sx = this.frame * this.width;
  var sy = 0;
  var sw = this.width;
  var sh = this.height;
  var dx = this.positionX - this.anchorX * this.width;
  var dy = this.positionY - this.anchorY * this.height;
  var dw = this.width;
  var dh = this.height;
  ctx.drawImage(this._image, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
};
