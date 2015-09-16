var Sprite = function(canvas, image, x, y, w, h){
  this._x = x;
  this._y = y;
  this._w = w;
  this._h = h;
  this._canvas = canvas;
  this._image = image;
};

Sprite.prototype = {
  get x(){
    return this._x;
  }
, get y(){
    return this._y;
  }
, get w(){
    return this._w;
  }
, get h(){
    return this._h;
  }
, get ctx(){
    return this._canvas.getContext('2d');
  }
, get canvas(){
    return this._canvas;
  }
};

Sprite.prototype.render = function(){
  var ctx = this.ctx;
  ctx.save();
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('Score', this.canvas.width / 2, this.canvas.height);
  ctx.restore();
};
