var Entity=function(t){this._position={x:0,y:0},this._velocity={x:0,y:0},this._angular={theta:0,omega:0},this._states=t||{},this._bindings={}};Entity.prototype={get position(){return this._position},get velocity(){return this._velocity},get theta(){return this._angular.theta},get omega(){return this._angular.omega},get bindings(){return this._bindings},get direction(){var t=Math.cos(this._angular.theta),i=Math.sin(this._angular.theta);return{x:t,y:i}}},Entity.prototype.setPosition=function(t,i){this._position.x=t,this._position.y=i},Entity.prototype.setSpeed=function(t){var i=this.direction;this._velocity.x=i.x*t,this._velocity.y=i.y*t},Entity.prototype.setTheta=function(t){this._angular.theta=t%(2*Math.PI)},Entity.prototype.setOmega=function(t){this._angular.omega=t},Entity.prototype.motion=function(t){this.rotate(t),this.move(t)},Entity.prototype.move=function(t){this._position.x=this._position.x+this._velocity.x*t,this._position.y=this._position.y+this._velocity.y*t},Entity.prototype.rotate=function(t){this._angular.theta=this._angular.theta+this._angular.omega*t};