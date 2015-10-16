/*global Entity*/

// Constructor
var Player = function(name){
  this._name = name;
  this._bindings = {};
  Entity.call(this);
};

Player.prototype = new Entity();

// Properties
Object.defineProperty(Player.prototype, 'name', {
  get: function(){
    return this._name;
  }
});

Object.defineProperty(Player.prototype, 'bindings', {
  get: function(){
    return this._bindings;
  }
});

// Bind action with key to player
Player.prototype.bindActionKey = function(key, cooldown, action){
  this._bindings[key] = { key: key, action: action, cooldown: cooldown, timer: 0};
};

// Action event handle
Player.prototype.onActionKey = function(key, pressed, ms){
  var binding = this.bindings[key];
  if(pressed === false){
    binding.timer = 0;
  }else{
    if(binding.timer === 0){
      binding.action.call(this);
    }
    binding.timer += ms;
    if (binding.timer > binding.cooldown){
      binding.timer = 0;
    }
  }
};

// Angle between player's direction and vector direction between player and object
Player.prototype.alpha = function(position){
  var dy = position.y - this.position.y;
  var dx = position.x - this.position.x;
  var theta1 = Math.atan2(dy, dx);
  var theta2 = this.theta;
  return Math.abs(theta1 - theta2);
};
