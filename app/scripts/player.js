/*global Entity*/

var Player = function(name){
  this._name = name;
  this._bindings = {};
  Entity.call(this);
};

Player.prototype = new Entity();

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

Player.prototype.bindActionKey = function(key, cooldown, action){
  this._bindings[key] = { key: key, action: action, cooldown: cooldown, timer: 0};
};

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

