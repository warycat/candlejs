var Loop=function(t){this._fn=t,this.frame=this.frame.bind(this),this.lastTime=0};Loop.prototype.start=function(){requestAnimationFrame(this.frame)},Loop.prototype.frame=function(t){var i=t-this.lastTime;this.lastTime=t,2e3>i&&this._fn(i),requestAnimationFrame(this.frame)};