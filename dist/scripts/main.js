var loadJS=function(n,s){var a=document.createElement("script");a.type="application/javascript",a.onload=s,a.src=n,document.body.appendChild(a)},assets={scriptFolder:"scripts/",scriptFiles:["input.js","loop.js","level.js","entity.js","artifact.js","bot.js","god.js","sky.js","plane.js","camera.js","player.js","label.js"],soundFolder:"sounds/",soundFiles:["gangnam.mp3","shotgun-reload.mp3","shotgun-fire.mp3"],jsonFolder:"jsons/",jsonFiles:["levels.json","Wolf08.json","artifacts.json","gangnamAtlas.json","gangnamLevel.json","gangnamAnimations.json"],imageFolder:"images/",imageFiles:["sky1.jpg","wall_texture.jpg","tiles.png","artifacts.png","gangnam.png","pistol.png"]},canvasConfig={id:"display",width:290,height:506,position:"relative",top:"-622px",left:"224px"},gangnam=function(){var n=this,s=n.canvas,a=n.input,t=n.loop;n.sounds["gangnam.mp3"].play();var e=this.jsons["gangnamLevel.json"],o=new Plane(s,e.ceiling,e.floor,this.images["tiles.png"],64,e.grids),i=new Camera(s,2,32,.8,o),r=new Player("larry");r.setPosition(12,12),r.setTheta(Math.PI),r.control=function(){var n=a.states,s=.005*(n.up-n.down),t=.002*(n.right-n.left);this.setOmega(t),this.setSpeed(s)};for(var g={info:this.jsons["artifacts.json"],texture:this.images["artifacts.png"]},l={500:{name:"Gangnam",tag:500,texture:this.images["gangnam.png"],atlas:this.jsons["gangnamAtlas.json"],animations:this.jsons["gangnamAnimations.json"]}},p=new God(s,g,l,64,e.grids),m=p.bots,c=0;c<m.length;c++){var d=m[c];500===d.tag&&d.setAnimation("step1")}r.bindActionKey("space",1e3,function(){n.sounds["shotgun-fire.mp3"].play(),setTimeout(function(){n.sounds["shotgun-reload.mp3"].play()},1e3)}),t.start(function(s){r.control(),r.motion(s),r.onActionKey("space",a.states.space,s),o.render(),i.castRays(r,o),p.animate(s),p.viewFrom(r,.8);var t=i.render(),e=p.render();n.render(t,e)})};loadJS("scripts/candle.js",function(){var n=new Candle(assets,canvasConfig);n.load(gangnam)});