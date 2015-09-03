/*global Entity*/

var Bot = function(name, tag, texture, atlas, animations){
  console.log(name + ' Spawned');
  this._name = name;
  this._tag = tag;
  this._texture = texture;
  this._atlas = atlas;
  this._animations = animations;
  this._animation = null;
  this._frames = atlas.frames;
  this._file = Object.keys(atlas.frames)[0];
  this._ms = 0;
  Entity.call(this);
};

Bot.prototype = new Entity();

Object.defineProperty(Bot.prototype, 'name', {
  get: function(){
    return this._name;
  }
});

Object.defineProperty(Bot.prototype, 'tag', {
  get: function(){
    return this._tag;
  }
});

Object.defineProperty(Bot.prototype, 'texture', {
  get: function(){
    return this._texture;
  }
});

Object.defineProperty(Bot.prototype, 'atlas', {
  get: function(){
    return this._atlas;
  }
});

Object.defineProperty(Bot.prototype, 'file', {
  get: function(){
    return this._file;
  }
});

Object.defineProperty(Bot.prototype, 'frame', {
  get: function(){
    return this._frames[this.file].frame;
  }
});

Object.defineProperty(Bot.prototype, 'animations', {
  get: function(){
    return this._animations;
  }
});

Object.defineProperty(Bot.prototype, 'animation', {
  get: function(){
    return this._animation;
  }
});

Bot.prototype.rect = function(){
  return this.frame;
};

Bot.prototype.setFile = function(file){
  this._file = file;
};

Bot.prototype.setAnimation = function(name){
  var animation = this.animations[name];
  this._animation = animation;
  this._animationFrameIndex = 0;
  this._animationFrameCount = animation.files.length;
};

Bot.prototype.animate = function(ms){
  var animation = this.animation;
  if(this._ms > animation.ms){
    this._ms -= animation.ms;
    this._animationFrameIndex += 1;
    this._animationFrameIndex = (this._animationFrameIndex === this._animationFrameCount) ? 0 : this._animationFrameIndex;
  }
  var file = animation.files[this._animationFrameIndex];
  this.setFile(file);
  this._ms += ms;
  // console.log(this._animationFrameCount);
};
