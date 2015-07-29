var Input = function(){
  this._codes = { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward' };
  this._states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
  document.addEventListener('keydown', this.onKey.bind(this, true), false);
  document.addEventListener('keyup', this.onKey.bind(this, false), false);
};

Input.prototype = {
  get states(){
    return this._states;
  }
};

Input.prototype.onKey = function(val, e){
  var state = this._codes[e.keyCode];
  if (typeof state === 'undefined') {
    return;
  }
  this._states[state] = val;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
};

