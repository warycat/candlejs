// **Aritifact** is non animatable object in 3d scent. It is derived from **Entity**

/*global Candle Entity*/

// Constructor
var Artifact = function(name, tag, texture){
  // console.log(name + ' Spawned');
  this._name = name;
  this._tag = tag;
  this._texture = texture;
  Entity.call(this);
};

Artifact.prototype = new Entity();

// Name getter
Object.defineProperty(Artifact.prototype, 'name', {
  get: function(){
    return this._name;
  }
});

// Tag getter
Object.defineProperty(Artifact.prototype, 'tag', {
  get: function(){
    return this._tag;
  }
});

// Texture getter
Object.defineProperty(Artifact.prototype, 'texture', {
  get: function(){
    return this._texture;
  }
});

// Get the rectangle from the big arifact texture.
Artifact.prototype.rect = function(){
  var x = Candle.PPU * (this.tag - 23);
  var y = 0;
  var w = Candle.PPU;
  var h = Candle.PPU;
  return {x: x, y: y, w: w, h: h};
};
