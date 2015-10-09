// This is the main file of the Demo Game. You can write your game in multiple JavaScript files and load them dynamically.

// This line of comment is used by es-lint.
/* global Candle $ God Player Loop Label Camera Plane Sprite*/

// Create a Candle Object. It has some useful tool to detect the browser. That help you to config the game before it is loaded.
var candle = new Candle();

// All asset files in the game are put in one json object and passed to the Candle to load the properly.
var assets = {

  // **Script** files are loaded one by one, so you manage scripts dependencies by puting the depended one first.
  scriptFolder: 'scripts/'
, scriptFiles: ['keyboard.js', 'loop.js', 'level.js', 'entity.js', 'artifact.js', 'bot.js', 'god.js', 'sky.js', 'plane.js', 'camera.js', 'player.js', 'label.js', 'sprite.js']

  // **Mp3** sound files are supported. on mobile safari, you can only play sound after touch events.
, soundFolder: 'sounds/'
, soundFiles: ['gangnam.mp3', 'shotgun-reload.mp3', 'shotgun-fire.mp3']

  // **Json** files are used to repersent game levels and animation, or any data that is not convient to put inside a JavaScript file
, jsonFolder: 'jsons/'
, jsonFiles: ['levels.json', 'Wolf08.json', 'artifacts.json', 'gangnamAtlas.json', 'gangnamLevel.json', 'gangnamAnimations.json']

  // **Image** files are loaded.
, imageFolder: 'images/'
, imageFiles: ['sky1.jpg', 'wall_texture.jpg', 'tiles.png', 'artifacts.png', 'gangnam.png', 'pistol.png']
};

// Pass assets to Candle.
candle.setAssets(assets);

// Canvas are configure according to different browser size.
var canvasConfig;

if(candle.mobileAndTabletcheck()){

// Mobile branch config.
  canvasConfig = {
    id: 'mobile-display'
  , width: $(window).width()
  , height: $(window).height()
  };
  $('#web').remove();

}else{

// Desktop branch config.
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

// Pass canvas config to candle.
candle.setCanvas(canvasConfig);

// The **Game** object is a function which will be exec by candle once and return a loop function which will be exec by by candle on each frame.
var gangnam = function(){
  var self = this;

  // Get **canvas** object from candle.
  var canvas = self.canvas;

  // Get **keyboard** object from candle.
  var keyboard = self.keyboard;

  // Create a **Label** object to display score in the game.
  self.scoreLable = new Label(canvas, canvas.width / 2, canvas.height / 10, '20px Arial', 'center', 'white');
  self.score = 0;
  self.scoreText = 'Score: ';

  // Create a **Sprite** object to display a weapon.
  var pistol = new Sprite(canvas, this.images['pistol.png'], 5, 50, 128, 128, canvas.width / 2, canvas.height, 0.5, 1);

  // Get loaded json data file from candle. It is a level file. For more info you can read the json file in jsons folder.
  var level = this.jsons['gangnamLevel.json'];

  // Create **Plane** of wall of the game.
  var plane = new Plane(canvas, level.ceiling, level.floor, this.images['tiles.png'], 64, level.grids);

  // Create a **Camera** object.
  var camera = new Camera(canvas, 4, 25, 0.8, plane);

  // Create **aritifacts** info with loaded artifacts info json file and texture image file.
  var artifactsInfo = {
    info: this.jsons['artifacts.json']
  , texture: this.images['artifacts.png']
  };

  // Create **bot** info with loaded bot image and image atlas created by texture packer and animation file.
  var botsInfo = {

  // bot tag in level file
  '500': {

    // Bot name.
      name: 'Gangnam'

    // Bot tag
    , tag: 500

    // Big texture image generated by texture packer.
    , texture: this.images['gangnam.png']

    // Atalas data generated by texture packer.
    , atlas: this.jsons['gangnamAtlas.json']

    // Key framed animation data file.
    , animations: this.jsons['gangnamAnimations.json']
    }
  };

  // Create **God** object to hold all objects in 3d scene.
  var god = new God(canvas, artifactsInfo, botsInfo, 64, level.grids);

  var bots = god.bots;

  var dancers = [];

  // Dance autometa used for the dancing AI.
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

  // Init all bots.
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

  // Create **Player** named larry.
  var player = new Player('larry');

  // Set its init position.
  player.setPosition(12, 12);

  // Set its init direction.
  player.setTheta(Math.PI);


  // Create player control function to move and rotate player according to keyboard input and touch input.
  player.control = function(){

    // Get touch status from candle.
    var touchStatus = candle.touchStatus;

    // Get keyboard status.
    var states = keyboard.states;

    // Caculate speed.
    var speed = (states.up - states.down + touchStatus.UP - touchStatus.DOWN) * 0.005;

    // Caculate angular speed.
    var omega = (states.right - states.left + touchStatus.RIGHT - touchStatus.LEFT) * 0.002;

    // Move and rotate player.
    // For the simplicity of the demo, physics is not added here.
    this.setOmega(omega);
    this.setSpeed(speed);
  };

  // Fire function for player to animate weapon and play a gun shot sound.
  player.fire = function(){

    // Find a bot in fire range.
    for(i = 0; i < bots.length; i++){
      bot = bots[i];
      if(bot.tag === 500){
        if (player.alpha(bot.position) < 0.1){
          bot.damage();
        }
      }
    }

    // Animate pistol.
    pistol.animateOnce();

    // Play Gangnam Style BGM.
    // Mobile safari only allow sounds to be played after touch event.
    self.sounds['gangnam.mp3'].play();

    // Play Gun Shot sound.
    self.sounds['shotgun-fire.mp3'].play();

    // Play Gun Reload sound after 1000 ms.
    setTimeout(function(){
      self.sounds['shotgun-reload.mp3'].play();
    }, 1000);
  };

  // On desktop bind fire action to SPACE key.
  player.bindActionKey('space', 1000, player.fire);

  // On mobile bind fire action to tap event.
  candle.bindTapAction(player.fire);

  // Main **Loop** object returned by Game.
  var loop = new Loop(function(ms){

    // Caculate player control.
    player.control();

    // Move and rotate player.
    player.motion(ms);

    // Trigger action key event.
    player.onActionKey('space', keyboard.states.space, ms);

    // Iterate dancers.
    for(i = 0; i < dancers.length; i++){
      var dancer = dancers[i];
      dancer.dance(ms);
      dancer.move(ms);
    }

    // Render plane.
    plane.render();

    // Camera cast ray from player.
    camera.castRays(player, plane);

    // Animate all object in 3d scene.
    god.animate(ms);

    // View all objects from player.
    god.viewFrom(player, 0.8);

    // Get wall strips from camera.
    var ws = camera.render();

    // Get objects from god.
    var es = god.render();

    // Render walls and objects.
    self.render(ws, es);

    // Render score lable.
    self.scoreLable.render(self.scoreText + self.score);

    // Render pistol.
    pistol.render(ms);
  });

  return loop;
};


// Display loading progress.
function onProgress(message){
  $('#message').text('Loading: ' + message);
}

// Candle load game, hook loading progress and loaded event.
candle.load(gangnam, onProgress, function(){

  if(candle.mobileAndTabletcheck()){

    // Mobile branch.
    $('#message').text('Candle.js Ready. Touch to Fire');
    document.addEventListener('touchend', function(){
      $('#message').remove();
      $('#loader').remove();

      // Start Candle main loop.
      candle.loop.start();
    });
  }else{

    // Desktop branch.
    $('#message').text('Candle.js Ready. SPACE to Fire');
    $('#loader').click(function(){
      $('#message').remove();
      $('#loader').remove();

      // Start Candle main loop.
      candle.loop.start();
    });
  }
});



