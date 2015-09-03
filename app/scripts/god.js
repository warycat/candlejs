/* global Artifact Bot */

var God = function(canvas, artifactsInfo, botsInfo, size, grids){
  this._canvas = canvas;
  this._artifactsInfo = artifactsInfo;
  this._botsInfo = botsInfo;
  this._bots = [];
  this._artifacts = [];
  this._pool = [];
  this._render = [];

  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      if(grids[i][j] > 0){
        var tag = grids[i][j];
        var entity = this.spawnFn(tag, artifactsInfo, botsInfo);
        if(entity){
          entity.setPosition(i + 0.5, j + 0.5);
          this.pool.push(entity);
        }
      }
    }
  }
};

God.prototype = {
  get artifactsInfo(){
    return this._artifactsInfo;
  }
, get botsInfo(){
    return this._botsInfo;
  }
, get artifacts(){
    return this._artifacts;
  }
, get bots(){
    return this._bots;
  }
, get pool(){
    return this._pool;
  }
, get canvas(){
    return this._canvas;
  }
};

God.prototype.spawnFn = function(tag, artifacts, bots){
  var name;
  var texture;
  if(tag >= 23 && tag < 72){
    name = artifacts.info[tag].name;
    texture = this.artifactsInfo.texture;
    var artifact = new Artifact(name, tag, texture);
    this.artifacts.push(artifacts);
    return artifact;
  }else if(tag === 500){
    name = bots[tag].name;
    texture = bots[tag].texture;
    var atlas = bots[tag].atlas;
    var animations = bots[tag].animations;
    var bot = new Bot(name, tag, texture, atlas, animations);
    this.bots.push(bot);
    return bot;
  }else{
    console.log(tag + ' Entity Not Found');
    return null;
  }
};

God.prototype.render = function(){
  return this._render;
};

God.prototype.viewFrom = function(player, focus){
  var ppos = player.position;
  var viewDist = this.canvas.width * focus;
  for (var i = this.pool.length - 1; i >= 0; i--) {
    var entity = this.pool[i];
    var epos = entity.position;
    var xx = epos.x - ppos.x;
    var yy = epos.y - ppos.y;
    var distance = Math.sqrt(xx * xx + yy * yy);
    var angle = Math.atan2(yy, xx) - player.theta;

    var delta = (angle + 3 * Math.PI) % (Math.PI * 2) - Math.PI;
    if(delta > Math.PI / 3 || delta < -Math.PI / 3) {
      this._render[i] = null;
    }else{
      var p = this.project(angle, distance, viewDist);

      var texture = entity.texture;
      var rect = entity.rect();

      var dx = p.left;
      var dy = p.top;
      var dw = p.wallHeight;
      var dh = p.wallHeight;

      this._render[i] = {
        distance: distance
      , texture: texture
      , sx: rect.x
      , sy: rect.y
      , sw: rect.w
      , sh: rect.h
      , dx: dx
      , dy: dy
      , dw: dw
      , dh: dh
      };
    }
  }
};

God.prototype.animate = function(ms){
  for(var i = this.bots.length - 1; i >= 0; i--){
    var bot = this.bots[i];
    bot.animate(ms);
  }
};

God.prototype.project = function(angle, distance, viewDist) {
  var z = distance * Math.cos(angle);
  var wallHeight = this.canvas.height / z;
  var bottom = this.canvas.height / 2 * (1 + 1 / z);
  var top = bottom - wallHeight;
  var x = Math.tan(angle) * viewDist;
  var left = this.canvas.width / 2 + x - wallHeight / 2;
  return {
    top: top,
    left: left,
    wallHeight: wallHeight
  };
};

