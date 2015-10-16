// Constuctor
var Label = function(canvas, x, y, font, textAlign, fillStyle){
  this._canvas = canvas;
  this._x = x;
  this._y = y;
  this._font = font;
  this._textAlign = textAlign;
  this._fillStyle = fillStyle;
};

// Properties
Label.prototype = {
  get x(){
    return this._x;
  }
, get y(){
    return this._y;
  }
, get font(){
    return this._font;
  }
, get textAlign(){
    return this._textAlign;
  }
, get fillStyle(){
    return this._fillStyle;
  }
, get ctx(){
    return this._canvas.getContext('2d');
  }
, get canvas(){
    return this._canvas;
  }
};

// Render function
Label.prototype.render = function(text){
  var ctx = this.ctx;
  ctx.save();
  ctx.font = this.font;
  ctx.fillStyle = this.fillStyle;
  ctx.textAlign = this.textAlign;
  ctx.fillText(text, this.x, this.y);
  ctx.restore();
};
