var Plane=function(t,i,e,h,n,s){this._canvas=t,this._ctx=t.getContext("2d"),this._width=t.width,this._height=t.height,this._height2=this._height/2,this._size=h,this._size2=h*h,this._image=n,this._grids=new Uint8Array(h*h),this._ceiling=i,this._floor=e;for(var r=0;h>r;r++)for(var o=0;h>o;o++)s[r][o]>0||this.setGrid(r,o,-s[r][o]);this.print()};Plane.prototype={get ctx(){return this._ctx},get canvas(){return this._canvas},get width(){return this._width},get height(){return this._height},get height2(){return this._height2},get size(){return this._size},get size2(){return this._size2},get image(){return this._image},get ceiling(){return this._ceiling},get floor(){return this._floor}},Plane.prototype.render=function(){this.ctx.fillStyle=this.ceiling,this.ctx.fillRect(0,0,this.width,this.height2),this.ctx.fillStyle=this.floor,this.ctx.fillRect(0,this.height2,this.width,this.height2)},Plane.prototype.getGrid=function(t,i){var e=this.index(t,i);return-1!==e?this._grids[e]:0},Plane.prototype.setGrid=function(t,i,e){var h=this.index(t,i);-1!==h&&(this._grids[h]=e)},Plane.prototype.index=function(t,i){var e=t*this.size+i;return 0>t||t>=this.size?-1:0>i||i>=this.size?-1:e>0&&e<this.size2?e:-1},Plane.prototype.randomize=function(){for(var t=0;t<this.size2;t++){var i=Math.random()<.3?1:0;this._grids[t]=i}},Plane.prototype.print=function(){for(var t="",i=0;i<this.size;i++){for(var e=0;e<this.size;e++)t+=this.getGrid(i,e)?"#":" ";t+="\n"}console.log(t)};