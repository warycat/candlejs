var Bot=function(t,e,i,n,o){console.log(t+" Spawned"),this._name=t,this._tag=e,this._texture=i,this._atlas=n,this._animations=o,this._animation=null,this._frames=n.frames,this._file=Object.keys(n.frames)[0],this._ms=0,Entity.call(this)};Bot.prototype=new Entity,Object.defineProperty(Bot.prototype,"name",{get:function(){return this._name}}),Object.defineProperty(Bot.prototype,"tag",{get:function(){return this._tag}}),Object.defineProperty(Bot.prototype,"texture",{get:function(){return this._texture}}),Object.defineProperty(Bot.prototype,"atlas",{get:function(){return this._atlas}}),Object.defineProperty(Bot.prototype,"file",{get:function(){return this._file}}),Object.defineProperty(Bot.prototype,"frame",{get:function(){return this._frames[this.file].frame}}),Object.defineProperty(Bot.prototype,"animations",{get:function(){return this._animations}}),Object.defineProperty(Bot.prototype,"animation",{get:function(){return this._animation}}),Bot.prototype.rect=function(){return this.frame},Bot.prototype.setFile=function(t){this._file=t},Bot.prototype.setAnimation=function(t){var e=this.animations[t];this._animation=e,this._animationFrameIndex=0,this._animationFrameCount=e.files.length},Bot.prototype.animate=function(t){var e=this.animation;this._ms>e.ms&&(this._ms-=e.ms,this._animationFrameIndex+=1,this._animationFrameIndex=this._animationFrameIndex===this._animationFrameCount?0:this._animationFrameIndex);var i=e.files[this._animationFrameIndex];this.setFile(i),this._ms+=t};