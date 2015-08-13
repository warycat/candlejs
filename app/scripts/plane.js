var Plane = function(size){
  this._size = size;
  this._size2 = size * size;
  this._grids = new Uint8Array(size * size);
  this.randomize();
  this.print();
};

Plane.prototype = {
  get size(){
    return this._size;
  }
, get size2(){
    return this._size2;
  }
};

Plane.prototype.getGrid = function(i, j){
  var index = this.index(i, j);
  return (index !== -1) ? this._grids[index] : 0;
};

Plane.prototype.setGrid = function(i, j, val){
  var index = this.index(i, j);
  if (index !== -1){
    this._grids[index] = val;
  }
};

Plane.prototype.index = function(i, j){
  var index = i * this.size + j;
  return (index > 0 && index < this.size2) ? index : -1;
};

Plane.prototype.randomize = function() {
  for (var i = 0; i < this.size2; i++) {
    var val = Math.random() < 0.3 ? 111 : 0;
    this._grids[i] = val;
  }
};

Plane.prototype.print = function(){
  // function pad(num, size) {
  //   var s = '      ' + num;
  //   return s.substr(s.length - size);
  // }

  var line = '';
  for (var i = 0; i < this.size; i++){
    for (var j = 0; j < this.size; j++){
      line = line + (this.getGrid(i, j) ? '#' : ' ');
    }
    line = line + '\n';
  }
  console.log(line);

};

