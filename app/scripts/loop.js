// Constructor
var Loop = function(fn){
  this._started = false;
  this._fn = fn;
  this.frame = this.frame.bind(this);
  this.lastTime = 0;
};

// Start game loop
Loop.prototype.start = function(){
  if(this._started) { return; }
  this._started = true;
  requestAnimationFrame(this.frame);
};

// Skip frame when too slow.
Loop.prototype.frame = function(time) {
  var ms = time - this.lastTime;
  this.lastTime = time;
  if (ms < 2000) {
    this._fn(ms);
  }
  requestAnimationFrame(this.frame);
};
