var Camera=function(t,e,n,r,i){this._canvas=t,this._ctx=t.getContext("2d"),this._ppc=e,this._resolution=Math.floor(t.width/this._ppc),this._range=n,this._focus=r,this._plane=i,this._columns=[],this._rays=[],this._render=[]};Camera.prototype={get canvas(){return this._canvas},get ctx(){return this._ctx},get ppc(){return this._ppc},get resolution(){return this._resolution},get range(){return this._range},get focus(){return this._focus},get plane(){return this._plane},get columns(){return this._columns},get rays(){return this._rays}},Camera.prototype.render=function(){return this._render},Camera.prototype.castRays=function(t){for(var e=this.plane.image,n=this.ppc,r=0;r<this.resolution;r++){var i=r/this.resolution-.5,a=Math.atan2(i,this.focus),o=this.castRay(t.position,t.theta+a);this.rays[r]=o;for(var h=this.ppc*r,s=0;s<o.length&&o[s].height<=0;)s++;for(var c=o.length-1;c>=0;c--){var u=o[c];if(c===s){var f=this.project(u.height,a,u.distance),g=Math.floor(Candle.PPU*(u.texture-1+u.offset));this._render[r]={distance:u.distance,texture:e,sx:g,sy:0,sw:1,sh:Candle.PPU,dx:h,dy:f.top,dw:n,dh:f.height};break}this._render[r]=null}}},Camera.prototype.castRay=function(t,e){var n=Math.sin(e),r=Math.cos(e),i=this,a=function(t,e,n,r,i){if(0===e)return{length2:1/0};var a=e>0?Math.floor(n+1)-n:Math.ceil(n-1)-n,o=a*(t/e);return{x:i?r+o:n+a,y:i?n+a:r+o,length2:a*a+o*o}},o=function(t,e,a,o,h){var s=0>r?e:0,c=0>n?a:0,u=i.plane.getWall(Math.floor(t.x-s),Math.floor(t.y-c));return t.texture=u>0?u:0,t.height=u>0?1:0,t.distance=o+Math.sqrt(t.length2),t.shading=e?0>r?2:0:0>n?2:1,t.offset=h-Math.floor(h),t},h=function(t){var e=a(n,r,t.x,t.y,!1),s=a(r,n,t.y,t.x,!0),c=e.length2<s.length2?o(e,1,0,t.distance,e.y):o(s,0,1,t.distance,s.x);return c.distance>i.range?[t]:[t].concat(h(c))},s={x:t.x,y:t.y,height:0,distance:0};return h(s)},Camera.prototype.project=function(t,e,n){var r=n*Math.cos(e),i=this.canvas.height*t/r,a=this.canvas.height/2*(1+1/r);return{top:a-i,height:i}};