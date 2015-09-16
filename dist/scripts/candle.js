var Candle=function(s,t){this._about="This project is based on candle.js",this._entities=[],this._images={},this._jsons={},this._sounds={},this._assets=s,this.setCanvas(t)};Candle.PPU=128,Candle.prototype={get assets(){return this._assets},get canvas(){return this._canvas},get images(){return this._images},get jsons(){return this._jsons},get sounds(){return this._sounds},get ctx(){return this._ctx},get loop(){return this._loop},get input(){return this._input}},Candle.prototype.setCanvas=function(s){this._canvas=document.getElementById(s.id||"display"),this._canvas.width=s.width||640,this._canvas.height=s.height||480,this._canvas.style.position=s.position,this._canvas.style.top=s.top,this._canvas.style.left=s.left,this._canvas.style.display="block",this._canvas.style.background="#f0f0f0",this._ctx=this._canvas.getContext("2d")},Candle.prototype.about=function(){console.log(this._about)},Candle.prototype.scriptsDidLoad=function(){this._input=new Input,this._loop=new Loop},Candle.prototype.loadScripts=function(s){var t=$.map(this.assets.scriptFiles,function(s){return self.assets.scriptFolder+s}),e=0,n=t[e],o=function(){++e===t.length?s():(n=t[e],loadJS(n,o))};loadJS(n,o)},Candle.prototype.loadImages=function(s){for(var t=this.assets.imageFolder,e=this.assets.imageFiles,n=e.length,o=function(){n--,0===n&&s()},i=0;i<e.length;i++){var a=new Image,r=e[i];this._images[r]=a,a.onload=o,a.src=t+r}},Candle.prototype.loadJsons=function(s){for(var t=this.assets.jsonFolder,e=this.assets.jsonFiles,n=e.length,o=this,i=function(){o._jsons[this.fileName]=JSON.parse(this.responseText),n--,0===n&&s()},a=0;a<e.length;a++){var r=e[a],l=t+r,c=new XMLHttpRequest;c.fileName=r,c.onload=i,c.open("GET",l),c.send()}},Candle.prototype.loadSounds=function(s){for(var t=this.assets.soundFiles,e=this.assets.soundFolder,n=t.length,o=function(){n--,console.log(n),0===n&&s()},i=0;i<t.length;i++){var a=t[i],r=e+a,l=document.createElement("audio");l.src=r,l.oncanplaythrough=o,document.body.appendChild(l),this._sounds[a]=l}},Candle.prototype.load=function(s){var t=this;t.about(),t.test(),t.loadSounds(function(){t.loadScripts(function(){t.loadImages(function(){t.loadJsons(function(){t.scriptsDidLoad(),s.call(t)})})})})},Candle.prototype.test=function(){void 0===this.assets.scriptFolder&&console.log("scriptFolder: ",this.assets.scriptFolder),void 0===this.assets.scriptFiles&&console.log("scriptFiles: ",this.assets.scriptFiles),void 0===this.assets.imageFolder&&console.log("imageFolder: ",this.assets.imageFolder),void 0===this.assets.imageFiles&&console.log("imageFiles: ",this.assets.imageFiles),void 0===this.assets.jsonFolder&&console.log("jsonFolder: ",this.assets.jsonFolder),void 0===this.assets.jsonFiles&&console.log("jsonFiles: ",this.assets.jsonFiles),void 0===this.assets.soundFolder&&console.log("soundFolder: ",this.assets.soundFolder),void 0===this.assets.soundFiles&&console.log("soundFiles: ",this.assets.soundFiles)},Candle.prototype.render=function(s,t){function e(s,t){return s.distance<t.distance?1:s.distance>t.distance?-1:0}var n=this.ctx,o=[];for(var i in s){var a=s[i];a&&o.push(a)}for(var r in t){var l=t[r];l&&o.push(l)}o.sort(e);for(var c in o){var d=o[c];n.drawImage(d.texture,d.sx,d.sy,d.sw,d.sh,d.dx,d.dy,d.dw,d.dh)}},Candle.prototype.wolf3d=function(){var s=this.jsons["gangnamLevel.json"],t=new Input,e=new Loop,n=new Player("larry");n.setPosition(12,12),n.setTheta(Math.PI),n.control=function(){var s=t.states,e=.005*(s.up-s.down),n=.002*(s.right-s.left);this.setOmega(n),this.setSpeed(e)};for(var o=this.canvas,i=new Plane(o,s.ceiling,s.floor,this.images["tiles.png"],64,s.grids),a=new Camera(o,2,32,.8,i),r={info:this.jsons["artifacts.json"],texture:this.images["artifacts.png"]},l={500:{name:"Gangnam",tag:500,texture:this.images["gangnam.png"],atlas:this.jsons["gangnamAtlas.json"],animations:this.jsons["gangnamAnimations.json"]}},c=new God(o,r,l,64,s.grids),d=c.bots,h=0;h<d.length;h++){var u=d[h];500===u.tag&&u.setAnimation("step1")}this.sounds["gangnam.mp3"].play(),n.bindActionKey("space",1e3,function(){c.render()}),e.start(function(s){n.control(),n.motion(s),n.onActionKey("space",t.states.space,s),i.render(),a.castRays(n,i),c.animate(s),c.viewFrom(n,.8);var e=a.render(),o=c.render();this.render(e,o)}.bind(this))};