var Loop = function(){
  this.frame = this.frame.bind(this);
  this.lastTime = 0;
};

Loop.prototype.start = function(callback){
  this.callback = callback;
  requestAnimationFrame(this.frame);
};

Loop.prototype.frame = function(time) {
  var ms = time - this.lastTime;
  this.lastTime = time;
  if (ms < 2000) {
    this.callback(ms);
  }
  requestAnimationFrame(this.frame);
};
