/*global Entity*/

var Artifact = function(name, tag, texture){
  console.log(name + ' Spawned');
  this._name = name;
  this._tag = tag;
  this._texture = texture;
  Entity.call(this);
};

Artifact.prototype = new Entity();

Object.defineProperty(Artifact.prototype, 'name', {
  get: function(){
    return this._name;
  }
});

Object.defineProperty(Artifact.prototype, 'tag', {
  get: function(){
    return this._tag;
  }
});
