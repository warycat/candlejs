var Camera = function(canvas, holder){
  this._canvas = canvas;
  this._holder = holder;
  this.callback = function(){};
};

Camera.prototype.render = function(){
  var position = this._holder.position;
  var theta = this._holder.theta;
  console.log(position.x, position.y, theta);
};

