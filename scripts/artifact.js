var Artifact=function(t,e,r){this._name=t,this._tag=e,this._texture=r,Entity.call(this)};Artifact.prototype=new Entity,Object.defineProperty(Artifact.prototype,"name",{get:function(){return this._name}}),Object.defineProperty(Artifact.prototype,"tag",{get:function(){return this._tag}}),Object.defineProperty(Artifact.prototype,"texture",{get:function(){return this._texture}}),Artifact.prototype.rect=function(){var t=Candle.PPU*(this.tag-23),e=0,r=Candle.PPU,n=Candle.PPU;return{x:t,y:e,w:r,h:n}};