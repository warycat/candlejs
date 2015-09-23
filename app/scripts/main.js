/* global Candle $ God Player Loop Label Camera Plane Sprite mobileAndTabletcheck */

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

document.ontouchstart = function(e){
  e.preventDefault();
};

/*eslint-disable */

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

/*eslint-enable */


var assets = {
  scriptFolder: 'scripts/'
, scriptFiles: ['input.js', 'loop.js', 'level.js', 'entity.js', 'artifact.js', 'bot.js', 'god.js', 'sky.js', 'plane.js', 'camera.js', 'player.js', 'label.js', 'sprite.js']
, soundFolder: 'sounds/'
, soundFiles: ['gangnam.mp3', 'shotgun-reload.mp3', 'shotgun-fire.mp3']
, jsonFolder: 'jsons/'
, jsonFiles: ['levels.json', 'Wolf08.json', 'artifacts.json', 'gangnamAtlas.json', 'gangnamLevel.json', 'gangnamAnimations.json']
, imageFolder: 'images/'
, imageFiles: ['sky1.jpg', 'wall_texture.jpg', 'tiles.png', 'artifacts.png', 'gangnam.png', 'pistol.png']
};

var canvasConfig;

if(mobileAndTabletcheck()){
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


var gangnam = function(){
  var self = this;
  var canvas = self.canvas;
  var input = self.input;
  self.scoreLable = new Label(canvas, canvas.width / 2, canvas.height / 10, '20px Arial', 'center', 'white');
  self.score = 0;
  self.scoreText = 'Score: ';
  self.sounds['gangnam.mp3'].play();
  var pistol = new Sprite(canvas, this.images['pistol.png'], 5, 50, 128, 128, canvas.width / 2, canvas.height, 0.5, 1);
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


  player.bindActionKey('space', 1000, function(){
    for(i = 0; i < bots.length; i++){
      bot = bots[i];
      if(bot.tag === 500){
        if (player.alpha(bot.position) < 0.1){
          bot.damage();
        }
      }
    }
    pistol.animateOnce();
    // self.sounds['shotgun-fire.mp3'].play();
    // setTimeout(function(){
    //   self.sounds['shotgun-reload.mp3'].play();
    // }, 1000);
  });

  var loop = new Loop(function(ms){
    player.control();
    player.motion(ms);
    player.onActionKey('space', input.states.space, ms);
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

(function(){
  loadJS('scripts/candle.js', function(){
    var candle = new Candle(assets, canvasConfig);
    function onProgress(message){
      $('#message').text('Loading: ' + message);
    }
    candle.load(gangnam, onProgress, function(){
      if(mobileAndTabletcheck()){
        $('#message').text('Candle.js Ready.');

      }else{
        $('#message').text('Candle.js Ready.');
        $('#loader').click(function(){
          $('#message').remove();
          $('#loader').remove();
          candle.loop.start();
        });
      }
    });
  });
})();

