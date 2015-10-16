// This is used to render a sky box. It is currently removed.

// var kPI = Math.PI;
// var k2PI = 2 * kPI;

// var Sky = function(canvas, image){
//   this._canvas = canvas;
//   this._ctx = canvas.getContext('2d');
//   this._image = image;
//   this._width = canvas.width;
// };

// Sky.prototype = {
//   get ctx(){
//     return this._ctx;
//   }
// , get canvas(){
//     return this._canvas;
//   }
// , get width(){
//     return this._width;
//   }
// , get height(){
//     return this._height;
//   }
// , get image(){
//     return this._image;
//   }
// };

// Sky.prototype.render = function(ms, theta, height){
//   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   this.ctx.save();
//   var width = this.width;
//   var left = (theta % k2PI + k2PI) % k2PI / k2PI * -width;
//   this.ctx.drawImage(this.image, left, 0, width, height);
//   if (left < width - this.width) {
//     this.ctx.drawImage(this.image, left + width, 0, width, height);
//   }
//   this.ctx.restore();
// };


