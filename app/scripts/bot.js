/*global Entity*/

var Bot = function(name){
  console.log(name + ' Spawned');
  this._name = name;
  Entity.call(this);
};

Bot.prototype = new Entity();

Object.defineProperty(Bot.prototype, 'name', {
  get: function(){
    return this._name;
  }
});
