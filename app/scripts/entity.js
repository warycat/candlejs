var Entity = function(states){
  this._position = {x: 0, y: 0};
  this._velocity = {x: 0, y: 0};
  this._angular = {theta: 0, omega: 0};
  this._states = states;
};

Entity.prototype = {
  get position() {
    return this._position;
  }
, get velocity() {
    return this._velocity;
  }
, get theta() {
    return this._angular.theta;
  }
, get omega() {
    return this._angular.omega;
  }
, get direction(){
    var x = Math.cos(this._angular.theta);
    var y = Math.sin(this._angular.theta);
    return {x: x, y: y};
  }
};

Entity.prototype.setPosition = function(x, y){
  this._position.x = x;
  this._position.y = y;
};

Entity.prototype.setSpeed = function(speed){
  var direction = this.direction;
  this._velocity.x = direction.x * speed;
  this._velocity.y = direction.y * speed;
};

Entity.prototype.setTheta = function(theta){
  this._angular.theta = theta;
};

Entity.prototype.setOmega = function(omega){
  this._angular.omega = omega;
};

Entity.prototype.motion = function(ms){
  this.rotate(ms);
  this.move(ms);
};

Entity.prototype.move = function(ms){
  this._position.x = this._position.x + this._velocity.x * ms;
  this._position.y = this._position.y + this._velocity.y * ms;
};

Entity.prototype.rotate = function(ms){
  this._angular.theta = this._angular.theta + this._angular.omega * ms;
};
