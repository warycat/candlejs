/* global Candle $ God Player Loop Label Camera Plane Sprite*/

var candle = new Candle();

var assets = {
  scriptFolder: 'scripts/'
, scriptFiles: ['keyboard.js', 'loop.js', 'level.js', 'entity.js', 'artifact.js', 'bot.js', 'god.js', 'sky.js', 'plane.js', 'camera.js', 'player.js', 'label.js', 'sprite.js']
, soundFolder: 'sounds/'
, soundFiles: ['gangnam.mp3', 'shotgun-reload.mp3', 'shotgun-fire.mp3']
, jsonFolder: 'jsons/'
, jsonFiles: ['levels.json', 'Wolf08.json', 'artifacts.json', 'gangnamAtlas.json', 'gangnamLevel.json', 'gangnamAnimations.json']
, imageFolder: 'images/'
, imageFiles: ['sky1.jpg', 'wall_texture.jpg', 'tiles.png', 'artifacts.png', 'gangnam.png', 'pistol.png']
};

candle.setAssets(assets);

var canvasConfig;

if(candle.mobileAndTabletcheck()){
  canvasConfig = {
    id: 'mobile-display'
  , width: $(window).width()
  , height: $(window).height()
  };
  $('#web').remove();
}else{
  canvasConfig = {
    id: 'web-display'
  , width: 290
  , height: 506
  , position: 'relative'
  , top: '-622px'
  , left: '224px'
  };
  $('#mobile').remove();
}

candle.setCanvas(canvasConfig);


var gangnam = function(){
  var self = this;
  var canvas = self.canvas;
  var keyboard = self.keyboard;


  self.scoreLable = new Label(canvas, canvas.width / 2, canvas.height / 10, '20px Arial', 'center', 'white');
  self.score = 0;
  self.scoreText = 'Score: ';
  var pistol = new Sprite(canvas, this.images['pistol.png'], 5, 50, 128, 128, canvas.width / 2, canvas.height, 0.5, 1);
  var level = this.jsons['gangnamLevel.json'];
  var plane = new Plane(canvas, level.ceiling, level.floor, this.images['tiles.png'], 64, level.grids);
  var camera = new Camera(canvas, 4, 16, 0.8, plane);


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

  var dancers = [];

  var dance = function(ms){
    switch(this.state){
      case 0:
        this.damaged = false;
        this.state = 1;
        this.setAnimation('step1');
        this.setSpeed(0.003);
        this.ms = 0;
        break;
      case 1:
        this.damaged = false;
        if(this.ms > 5000){
          this.ms = 0;
          this.state = 2;
          this.setAnimation('step2');
          this.setSpeed(-0.003);
        }
        this.ms += ms;
        break;
      case 2:
        this.damaged = false;
        if(this.ms > 5000){
          this.ms = 0;
          this.state = 3;
          this.setAnimation('step3');
          this.setSpeed(0);
        }
        this.ms += ms;
        break;
      case 3:
        if(this.damaged){
          self.score += Math.ceil(this.duration);
          this.duration *= 0.8;
          this.state = 4;
          this.setAnimation('step4');
          this.setSpeed(0);
          break;
        }
        if(this.ms > this.duration){
          this.ms = 0;
          this.state = 1;
          this.setAnimation('step1');
          this.setSpeed(0.003);
        }
        this.ms += ms;
        break;
      case 4:
        this.damaged = false;
        if(this.ms > 2000){
          this.ms = 0;
          this.state = 3;
          this.setAnimation('step3');
          this.setSpeed(0);
        }
        this.ms += ms;
        break;
    }
  };

  var damage = function(){
    this.damaged = true;
  };

  var i;
  for(i = 0; i < bots.length; i++){
    var bot = bots[i];
    if(bot.tag === 500){
      bot.state = 0;
      bot.dance = dance;
      bot.duration = 10000;
      bot.damage = damage;
      dancers.push(bot);
    }
  }

  var player = new Player('larry');
  player.setPosition(12, 12);
  player.setTheta(Math.PI);

  player.control = function(){
    var touchStatus = candle.touchStatus;
    var states = keyboard.states;
    var speed = (states.up - states.down + touchStatus.UP - touchStatus.DOWN) * 0.005;
    var omega = (states.right - states.left + touchStatus.RIGHT - touchStatus.LEFT) * 0.002;
    this.setOmega(omega);
    this.setSpeed(speed);
  };

  player.fire = function(){
    for(i = 0; i < bots.length; i++){
      bot = bots[i];
      if(bot.tag === 500){
        if (player.alpha(bot.position) < 0.1){
          bot.damage();
        }
      }
    }
    pistol.animateOnce();
    self.sounds['gangnam.mp3'].play();
    self.sounds['shotgun-fire.mp3'].play();
    setTimeout(function(){
      self.sounds['shotgun-reload.mp3'].play();
    }, 1000);
  };

  player.bindActionKey('space', 1000, player.fire);
  candle.bindTapAction(player.fire);

  var loop = new Loop(function(ms){
    player.control();
    player.motion(ms);
    player.onActionKey('space', keyboard.states.space, ms);
    for(i = 0; i < dancers.length; i++){
      var dancer = dancers[i];
      dancer.dance(ms);
      dancer.move(ms);
    }
    plane.render();
    camera.castRays(player, plane);
    god.animate(ms);
    god.viewFrom(player, 0.8);
    var ws = camera.render();
    var es = god.render();
    self.render(ws, es);
    self.scoreLable.render(self.scoreText + self.score);
    pistol.render(ms);
  });

  return loop;
};

function onProgress(message){
  $('#message').text('Loading: ' + message);
}

candle.load(gangnam, onProgress, function(){
  if(candle.mobileAndTabletcheck()){
    $('#message').text('Candle.js Ready. Touch to Fire');
    document.addEventListener('touchend', function(){
      $('#message').remove();
      $('#loader').remove();
      candle.loop.start();
    });
  }else{
    $('#message').text('Candle.js Ready. SPACE to Fire');
    $('#loader').click(function(){
      $('#message').remove();
      $('#loader').remove();
      candle.loop.start();
    });
  }
});




