/*global Candle Entity*/

var Artifact = function(name, tag, texture){
  // console.log(name + ' Spawned');
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

Object.defineProperty(Artifact.prototype, 'texture', {
  get: function(){
    return this._texture;
  }
});

Artifact.prototype.rect = function(){
  var x = Candle.PPU * (this.tag - 23);
  var y = 0;
  var w = Candle.PPU;
  var h = Candle.PPU;
  return {x: x, y: y, w: w, h: h};
};
