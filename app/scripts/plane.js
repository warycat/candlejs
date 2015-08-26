var Plane = function(canvas, ceiling, floor, image, size, grids){
  this._canvas = canvas;
  this._ctx = canvas.getContext('2d');
  this._width = canvas.width;
  this._height = canvas.height;
  this._height2 = this._height / 2;
  this._size = size;
  this._size2 = size * size;
  this._image = image;
  this._walls = new Uint8Array(size * size);
  this._ceiling = ceiling;
  this._floor = floor;
  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      if(grids[i][j] < 0){
        this.setWall(i, j, -grids[i][j]);
      }
    }
  }
  this.print();
};

Plane.prototype = {
  get ctx(){
    return this._ctx;
  }
, get canvas(){
    return this._canvas;
  }
, get width(){
    return this._width;
  }
, get height(){
    return this._height;
  }
, get height2(){
    return this._height2;
  }
, get size(){
    return this._size;
  }
, get size2(){
    return this._size2;
  }
, get image(){
    return this._image;
  }
, get ceiling(){
    return this._ceiling;
  }
, get floor(){
    return this._floor;
  }
, get pool(){
    return this._pool;
  }
};

Plane.prototype.render = function(){
  this.ctx.fillStyle = this.ceiling;
  this.ctx.fillRect(0, 0, this.width, this.height2);
  this.ctx.fillStyle = this.floor;
  this.ctx.fillRect(0, this.height2, this.width, this.height2);
};

Plane.prototype.getWall = function(i, j){
  var index = this.index(i, j);
  return (index !== -1) ? this._walls[index] : 0;
};

Plane.prototype.setWall = function(i, j, val){
  var index = this.index(i, j);
  if (index !== -1){
    this._walls[index] = val;
  }
};

Plane.prototype.index = function(i, j){
  var index = i * this.size + j;
  if(i < 0 || i >= this.size){
    return -1;
  }
  if(j < 0 || j >= this.size){
    return -1;
  }
  return (index >= 0 && index < this.size2) ? index : -1;
};


// Plane.prototype.randomize = function() {
//   for (var i = 0; i < this.size2; i++) {
//     var val = Math.random() < 0.3 ? 1 : 0;
//     this._grids[i] = val;
//   }
// };

Plane.prototype.print = function(){
  // function pad(num, size) {
  //   var s = '      ' + num;
  //   return s.substr(s.length - size);
  // }

  var line = '';
  for (var i = 0; i < this.size; i++){
    for (var j = 0; j < this.size; j++){
      line = line + (this.getWall(i, j) ? '#' : ' ');
    }
    line = line + '\n';
  }
  console.log(line);

};

