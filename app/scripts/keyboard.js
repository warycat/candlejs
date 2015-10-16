/*global $*/

// Constructor
var Keyboard = function(){
  var self = this;
  this._codes = { 8: 'backspace', 9: 'tab', 13: 'enter', 16: 'shift', 17: 'ctrl', 18: 'alt', 20: 'escape', 32: 'space', 37: 'left', 39: 'right', 38: 'up', 40: 'down', 48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z' };
  this._states = { };
  $.each(this._codes, function(key, value){
    self._states[value] = false;
  });
  document.addEventListener('keydown', this.onKey.bind(this, true), false);
  document.addEventListener('keyup', this.onKey.bind(this, false), false);
};

// Properties
Keyboard.prototype = {
  get states(){
    return this._states;
  }
};

// On Key event handle
Keyboard.prototype.onKey = function(val, e){
  var state = this._codes[e.keyCode];
  if (typeof state === 'undefined') {
    return;
  }
  this._states[state] = val;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
};
