var Candle=function(){this._about="This project is based on candle.js",this._entities=[],this._images={},this._jsons={},this._sounds={},this._loop=null,this._startX=0,this._startY=0,this._endX=0,this._endY=0,this._touchKey=0,this._touchCount=0,this._touchStatus={UP:0,DOWN:0,LEFT:0,RIGHT:0},document.ontouchstart=this.touchstart.bind(this),document.ontouchmove=this.touchmove.bind(this),document.ontouchend=this.touchend.bind(this),document.ontouchcancel=this.touchcancel.bind(this),this._onTap=function(){}};Candle.PPU=128,Candle.prototype={get assets(){return this._assets},get canvas(){return this._canvas},get images(){return this._images},get jsons(){return this._jsons},get sounds(){return this._sounds},get ctx(){return this._ctx},get input(){return this._input},get loop(){return this._loop},get deltaX(){return this._endX-this._startX},get deltaY(){return this._endY-this._startY},get touchSquare(){return this.deltaX*this.deltaX+this.deltaY*this.deltaY},get keyboard(){return this._keyboard},get touchStatus(){switch(this.touchKey()){case 0:this._touchStatus.UP=0,this._touchStatus.DOWN=0,this._touchStatus.LEFT=0,this._touchStatus.RIGHT=0;break;case 1:this._touchStatus.UP=0,this._touchStatus.DOWN=0,this._touchStatus.LEFT=1,this._touchStatus.RIGHT=0;break;case 2:this._touchStatus.UP=1,this._touchStatus.DOWN=0,this._touchStatus.LEFT=1,this._touchStatus.RIGHT=0;break;case 3:this._touchStatus.UP=1,this._touchStatus.DOWN=0,this._touchStatus.LEFT=0,this._touchStatus.RIGHT=0;break;case 4:this._touchStatus.UP=1,this._touchStatus.DOWN=0,this._touchStatus.LEFT=0,this._touchStatus.RIGHT=1;break;case 5:this._touchStatus.UP=0,this._touchStatus.DOWN=0,this._touchStatus.LEFT=0,this._touchStatus.RIGHT=1;break;case 6:this._touchStatus.UP=0,this._touchStatus.DOWN=1,this._touchStatus.LEFT=0,this._touchStatus.RIGHT=1;break;case 7:this._touchStatus.UP=0,this._touchStatus.DOWN=1,this._touchStatus.LEFT=0,this._touchStatus.RIGHT=0;break;case 8:this._touchStatus.UP=0,this._touchStatus.DOWN=1,this._touchStatus.LEFT=1,this._touchStatus.RIGHT=0}return this._touchStatus}},Candle.prototype.setAssets=function(t){this._assets=t},Candle.prototype.setCanvas=function(t){this._canvas=document.getElementById(t.id||"display"),this._canvas.width=t.width||640,this._canvas.height=t.height||480,this._canvas.style.position=t.position,this._canvas.style.top=t.top,this._canvas.style.left=t.left,this._canvas.style.display="block",this._canvas.style.background="#000000",this._ctx=this._canvas.getContext("2d")},Candle.prototype.about=function(){console.log(this._about)},Candle.prototype.loadScripts=function(t,s){var o=this,e=$.map(this.assets.scriptFiles,function(t){return o.assets.scriptFolder+t}),i=0,a=e[i],n=function(){++i===e.length?s():(t(o.assets.scriptFiles[i]),a=e[i],o.loadJS(a,n))};o.loadJS(a,n)},Candle.prototype.loadImages=function(t,s){for(var o=this,e=this.assets.imageFolder,i=this.assets.imageFiles,a=i.length,n=function(){a--,t(o.assets.imageFiles[a]),0===a&&s()},c=0;c<i.length;c++){var h=new Image,u=i[c];this._images[u]=h,h.onload=n,h.src=e+u}},Candle.prototype.loadJsons=function(t,s){for(var o=this,e=this.assets.jsonFolder,i=this.assets.jsonFiles,a=i.length,n=function(){o._jsons[this.fileName]=JSON.parse(this.responseText),a--,t(o.assets.jsonFiles[a]),0===a&&s()},c=0;c<i.length;c++){var h=i[c],u=e+h,l=new XMLHttpRequest;l.fileName=h,l.onload=n,l.open("GET",u),l.send()}},Candle.prototype.loadSounds=function(t,s){for(var o=this,e=this.assets.soundFiles,i=this.assets.soundFolder,a=e.length,n=function(){a--,t(o.assets.soundFiles[a]),0===a&&s()},c=0;c<e.length;c++){var h=e[c],u=i+h,l=new Audio;l.addEventListener("canplaythrough",n,!1),l.src=u,l.load(),document.body.appendChild(l),this._sounds[h]=l}},Candle.prototype.load=function(t,s,o){var e=this;e.about(),e.test(),e.loadScripts(s,function(){console.log("scripts did load"),e.loadImages(s,function(){console.log("images did load"),e.loadJsons(s,function(){console.log("jsons did load"),e.loadSounds(s,function(){console.log("sounds did load"),e._keyboard=new Keyboard,e._loop=t.call(e),o()})})})})},Candle.prototype.test=function(){void 0===this.assets.scriptFolder&&console.log("scriptFolder: ",this.assets.scriptFolder),void 0===this.assets.scriptFiles&&console.log("scriptFiles: ",this.assets.scriptFiles),void 0===this.assets.imageFolder&&console.log("imageFolder: ",this.assets.imageFolder),void 0===this.assets.imageFiles&&console.log("imageFiles: ",this.assets.imageFiles),void 0===this.assets.jsonFolder&&console.log("jsonFolder: ",this.assets.jsonFolder),void 0===this.assets.jsonFiles&&console.log("jsonFiles: ",this.assets.jsonFiles),void 0===this.assets.soundFolder&&console.log("soundFolder: ",this.assets.soundFolder),void 0===this.assets.soundFiles&&console.log("soundFiles: ",this.assets.soundFiles)},Candle.prototype.render=function(t,s){function o(t,s){return t.distance<s.distance?1:t.distance>s.distance?-1:0}var e=this.ctx;e.save();var i=[];for(var a in t){var n=t[a];n&&i.push(n)}for(var c in s){var h=s[c];h&&i.push(h)}i.sort(o);for(var u in i){var l=i[u];e.drawImage(l.texture,l.sx,l.sy,l.sw,l.sh,l.dx,l.dy,l.dw,l.dh)}e.restore()},Candle.prototype.mobileAndTabletcheck=function(){var t=!1;return function(s){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(s)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(s.substr(0,4)))&&(t=!0)}(navigator.userAgent||navigator.vendor||window.opera),t},Candle.prototype.loadJS=function(t,s){var o=document.createElement("script");o.type="application/javascript",o.onload=s,o.src=t,document.body.appendChild(o)},Candle.prototype.touchstart=function(t){t.preventDefault(),this._touchCount++,this._startX=t.touches[0].clientX,this._startY=t.touches[0].clientY,this._endX=t.touches[0].clientX,this._endY=t.touches[0].clientY},Candle.prototype.touchmove=function(t){t.preventDefault(),this._endX=t.touches[0].clientX,this._endY=t.touches[0].clientY},Candle.prototype.touchend=function(t){t.preventDefault(),this._touchCount--,0===this._touchCount&&this.onTap(),this._startX=0,this._startY=0,this._endX=0,this._endY=0},Candle.prototype.touchcancel=function(t){t.preventDefault(),this._touchCount--,0===this._touchCount&&this.onTap(),this._startX=0,this._startY=0,this._endX=0,this._endY=0},Candle.prototype.touchKey=function(){return this._touchKey=0===this._touchCount||this.touchSquare<100?0:Math.ceil(Math.atan2(this.deltaY,this.deltaX)/Math.PI*4+3.5)%8+1,this._touchKey},Candle.prototype.onTap=function(){this._onTap.call(this)},Candle.prototype.bindTapAction=function(t){this._onTap=t};