var Loop = function(fn){
  this._fn = fn;
  this.frame = this.frame.bind(this);
  this.lastTime = 0;
};

Loop.prototype.start = function(){
  requestAnimationFrame(this.frame);
};

Loop.prototype.frame = function(time) {
  var ms = time - this.lastTime;
  this.lastTime = time;
  if (ms < 2000) {
    this._fn(ms);
  }
  requestAnimationFrame(this.frame);
};
