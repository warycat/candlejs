/* global Candle  God Player Camera Plane  */

var loadJS = function(file, callback) {
  // DOM: Create the script element
  var jsElm = document.createElement('script');
  // set the type attribute
  jsElm.type = 'application/javascript';
  jsElm.onload = callback;
  // make the script element load file
  jsElm.src = file;
  // finally insert the element to the body element in order to load the script
  document.body.appendChild(jsElm);
};


var assets = {
  scriptFolder: 'scripts/'
, scriptFiles: ['input.js', 'loop.js', 'level.js', 'entity.js', 'artifact.js', 'bot.js', 'god.js', 'sky.js', 'plane.js', 'camera.js', 'player.js', 'label.js']
, soundFolder: 'sounds/'
, soundFiles: ['gangnam.mp3', 'shotgun-reload.mp3', 'shotgun-fire.mp3']
, jsonFolder: 'jsons/'
, jsonFiles: ['levels.json', 'Wolf08.json', 'artifacts.json', 'gangnamAtlas.json', 'gangnamLevel.json', 'gangnamAnimations.json']
, imageFolder: 'images/'
, imageFiles: ['sky1.jpg', 'wall_texture.jpg', 'tiles.png', 'artifacts.png', 'gangnam.png', 'pistol.png']
};

var canvasConfig = {
  id: 'display'
, width: 290
, height: 506
, position: 'relative'
, top: '-622px'
, left: '224px'
//, width: $(window).width()
//, height: $(window).height()
};

var gangnam = function(){
  var self = this;
  var canvas = self.canvas;
  var input = self.input;
  var loop = self.loop;
  // self.scoreLable = new Label(canvas, 0, canvas.height / 2, canvas.width / 2, '60px Arial', 'center', 'white');
  // self.scoreText = 'Score: 1000';
  self.sounds['gangnam.mp3'].play();
  var level = this.jsons['gangnamLevel.json'];
  var plane = new Plane(canvas, level.ceiling, level.floor, this.images['tiles.png'], 64, level.grids);
  var camera = new Camera(canvas, 2, 32, 0.8, plane);

  var player = new Player('larry');
  player.setPosition(12, 12);
  player.setTheta(Math.PI);

  player.control = function(){
    var states = input.states;
    var speed = (states.up - states.down) * 0.005;
    var omega = (states.right - states.left) * 0.002;
    this.setOmega(omega);
    this.setSpeed(speed);
  };

  var artifactsInfo = {
    info: this.jsons['artifacts.json']
  , texture: this.images['artifacts.png']
  };

  var botsInfo = {
  '500': {
      name: 'Gangnam'
    , tag: 500
    , texture: this.images['gangnam.png']
    , atlas: this.jsons['gangnamAtlas.json']
    , animations: this.jsons['gangnamAnimations.json']
    }
  };
  var god = new God(canvas, artifactsInfo, botsInfo, 64, level.grids);

  var bots = god.bots;

  for(var i = 0; i < bots.length; i++){
    var bot = bots[i];
    if(bot.tag === 500){
      bot.setAnimation('step1');
    }
  }

  player.bindActionKey('space', 1000, function(){
    self.sounds['shotgun-fire.mp3'].play();
    setTimeout(function(){
      self.sounds['shotgun-reload.mp3'].play();
    }, 1000);
  });

  loop.start(function(ms){
    player.control();
    player.motion(ms);
    player.onActionKey('space', input.states.space, ms);
    // sky.render(ms, player.theta, canvas.height / 2);
    plane.render();
    camera.castRays(player, plane);
    god.animate(ms);
    god.viewFrom(player, 0.8);
    var ws = camera.render();
    var es = god.render();
    self.render(ws, es);
    // self.scoreLable.render(self.scoreText);
  });
};


loadJS('scripts/candle.js', function(){
  var candle = new Candle(assets, canvasConfig);
  candle.load(gangnam);
});
