/* global Candle Entity Artifact Bot */

var God = function(canvas, artifacts, bots, size, grids){
  this._canvas = canvas;
  this._artifacts = artifacts;
  this._bots = bots;
  this._pool = [];
  this._render = [];

  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      if(grids[i][j] > 0){
        var tag = grids[i][j];
        var Fn = this.spawnFn(tag);

        if(Fn === Artifact){
          var name = artifacts.info[tag].name;
          var entity = new Fn(name, tag);
          entity.setPosition(i + 0.5, j + 0.5);
          this.pool.push(entity);
        }else if(Fn === Bot){
          console.log('bot');
        }
      }
    }
  }
};

God.prototype = {
  get artifacts(){
    return this._artifacts;
  }
, get pool(){
    return this._pool;
  }
, get canvas(){
    return this._canvas;
  }
};

God.prototype.spawnFn = function(tag){
  if(tag === 1){
    return Entity;
  }else if(tag === 2){
    return Artifact;
  }else if(tag === 3){
    return Bot;
  }else if(tag >= 23 && tag < 23 + 48){
    return Artifact;
  }else{
    console.log(tag + ' Entity Not Found');
    return function(){};
  }
};

God.prototype.render = function(){
  return this._render;
};

God.prototype.viewFrom = function(player, focus){
  var ppos = player.position;
  var texture = this.artifacts.texture;
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

      var sx = Candle.PPU * (entity.tag - 23);
      var sy = 0;
      var sw = Candle.PPU;
      var sh = Candle.PPU;

      var dx = p.left;
      var dy = p.top;
      var dw = p.wallHeight;
      var dh = p.wallHeight;

      this._render[i] = {
        distance: distance
      , texture: texture
      , sx: sx
      , sy: sy
      , sw: sw
      , sh: sh
      , dx: dx
      , dy: dy
      , dw: dw
      , dh: dh
      };
    }
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

