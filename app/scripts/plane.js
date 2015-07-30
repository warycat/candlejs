var Plane = function(images){
  this._skyImage = images['sky1.jpg'];
};

Plane.prototype = {
  get skyImage(){
    return this._skyImage;
  }
};
