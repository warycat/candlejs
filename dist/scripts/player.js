var Player=function(t){this._name=t,this._bindings={},Entity.call(this)};Player.prototype=new Entity,Object.defineProperty(Player.prototype,"name",{get:function(){return this._name}}),Object.defineProperty(Player.prototype,"bindings",{get:function(){return this._bindings}}),Player.prototype.bindActionKey=function(t,i,n){this._bindings[t]={key:t,action:n,cooldown:i,timer:0}},Player.prototype.onActionKey=function(t,i,n){var e=this.bindings[t];i===!1?e.timer=0:(0===e.timer&&e.action.call(this),e.timer+=n,e.timer>e.cooldown&&(e.timer=0))},Player.prototype.alpha=function(t){var i=t.y-this.position.y,n=t.x-this.position.x,e=Math.atan2(i,n),o=this.theta;return Math.abs(e-o)};