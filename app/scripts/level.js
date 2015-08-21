// function readPlaneData(file, offset, length, rle) {
//     file.position = offset;
//     var expandedLength = readUInt16(file),
//         carmackData = readBytes(file, length - 2),
//         expandedData = carmackExpand(carmackData, expandedLength);
//     return rlewExpand(expandedData.slice(1), 64*64*2, rle);
// }


// /**
//  * @description Expand Carmackized data
//  * @private
//  * @param {array} source The source data
//  * @param {number} length The length of the expanded data
//  * @returns {array} The expanded data
//  */
// function carmackExpand(source, length) {
//     var NEARTAG = 0xA7,
//         FARTAG  = 0xA8;

//     var chhigh, offset, /* W32 */
//         copyptr, outptr, /* W16 */
//         inptr, /* W8 */
//         ch, count, /* W16 */
//         dest;

//     length /= 2;

//     inptr = 0;
//     outptr = 0;
//     dest = [];
//     function W16(b, i) {
//         return b[i] + (b[i+1] << 8);
//     }

//     while (length) {
//         ch = source[inptr] + (source[inptr+1] << 8);
//         //ch = W16(source, inptr);
//         inptr += 2;
//         chhigh = ch >> 8;
//         if (chhigh == NEARTAG) {
//             count = ch & 0xff;
//             if (!count) {
//                 // have to insert a word containing the tag byte
//                 ch |= source[inptr++];
//                 dest[outptr++] = ch;
//                 length--;
//             } else {
//                 offset = source[inptr++];
//                 copyptr = outptr - offset;
//                 length -= count;
//                 while (count--) {
//                     dest[outptr++] = dest[copyptr++];
//                 }
//             }
//         } else if (chhigh == FARTAG) {
//             count = ch & 0xff;
//             if (!count)    {
//                 // have to insert a word containing the tag byte
//                 ch |= source[inptr++];
//                 dest[outptr++] = ch;
//                 length--;
//             } else {
//                 offset = source[inptr] + (source[inptr+1] << 8);
//                 //offset = W16(source, inptr);
//                 inptr += 2;
//                 copyptr = offset;
//                 length -= count;
//                 while (count--) {
//                     dest[outptr++] = dest[copyptr++];
//                 }
//             }
//         } else {
//             dest[outptr++] = ch;
//             length--;
//         }
//     }
//     return dest;
// }

// /**
//  * @description Expand RLE data
//  * @private
//  * @param {array} source The source data
//  * @param {number} length The length of the expanded data
//  * @param {number} rlewtag The RLE tag
//  * @returns {array} The expanded data
//  */
// function rlewExpand(source, length, rlewtag) {
//     var value,
//         count,
//         i,
//         end, /* W16 */
//         inptr = 0,
//         outptr = 0,
//         dest = [];

//     end = outptr + (length >> 1);
//     do {
//         value = source[inptr++];
//         if (value != rlewtag) {
//             // uncompressed
//             dest[outptr++] = value;
//         } else {
//             // compressed string
//             count = source[inptr++];
//             value = source[inptr++];
//             for (i=1;i<=count;++i) {
//                 dest[outptr++] = value;
//             }
//         }
//     } while (outptr < end);

//     return dest;
// }


// function readUInt8(f) {
//     var b = f.data.charCodeAt(f.position) & 0xFF
//     f.position++;
//     return b;
// }

// /**
//  * @description Read a signed 8-bit integer from a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @returns {number}
//  */
// function readInt8(f) {
//     var v = readUInt8(f);
//     return v > 127 ? v - 256 : v;
// }

// /**
//  * @description Read an unsigned 16-bit integer from a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @returns {number}
//  */
// function readUInt16(f) {
// var v = readUInt8(f) + (readUInt8(f) << 8);
// return (v < 0) ? v + 0x10000 : v;
// }

// /**
//  * @description Read a signed 16-bit integer from a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @returns {number}
//  */
// function readInt16(f) {
// var v = readUInt16(f);
//     return (v > 0x7fff) ? v - 0x10000 : v;
// }

// /**
//  * @description Read an unsigned 32-bit integer from a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @returns {number}
//  */
// function readUInt32(f) {
//     var b0 = readUInt8(f),
//         b1 = readUInt8(f),
//         b2 = readUInt8(f),
//         b3 = readUInt8(f),
//         v = ((((b3 << 8) + b2) << 8) + b1 << 8) + b0;
// return (v < 0) ? v + 0x100000000 : v;
// }

// /**
//  * @description Read a signed 32-bit int from a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @returns {number}
//  */
// function readInt32(f) {
// var v = readUInt32(f);
//     return (v > 0x7fffffff) ? v - 0x100000000 : v;
// }

// /**
//  * @description Read a string from a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @param {number} length The length of the string
//  * @returns {string}
//  */
// function readString(f, length) {
//     var str = f.data.substr(f.position, length);
//     f.position += length;
//     return str;
// }

// /**
//  * @description Read an array of bytes a file and advance the file position.
//  * @memberOf Wolf.File
//  * @param {object} f The file
//  * @param {number} num The number of bytes to read
//  * @returns {array}
//  */
// function readBytes(f, num) {
//     var b = [];
//     for (var i=0;i<num;i++) {
//         b[i] = f.data.charCodeAt(f.position+i) & 0xFF;
//     }
//     f.position += num;
//     return b;
// }

// function componentToHex(c) {
//     var hex = c.toString(16);
//     return hex.length == 1 ? "0" + hex : hex;
// }

// function rgbToHex(r, g, b) {
//     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
// }

// var Level = function(b64){
//   this._b64 = b64;
//   var data = atob(b64);
//   this._file = {data:data, position:0, size:data.length};
//   var file = this._file;
//   this._signature = readUInt32(file);
//   // console.log(this._signature);
//   rle = readUInt16(file);
//   // console.log(rle);
//   this._width = readUInt16(file);
//   this._height = readUInt16(file);
//   // console.log(this.width, this.height);
//   this._ceiling = [readUInt8(file), readUInt8(file), readUInt8(file), readUInt8(file)];
//   this._ceiling = rgbToHex(this._ceiling[0], this._ceiling[1], this._ceiling[2]);
//   this._floor = [readUInt8(file), readUInt8(file), readUInt8(file), readUInt8(file)];
//   this._floor = rgbToHex(this._floor[0], this._floor[1], this._floor[2])
//   console.log(this._ceiling, this._floor);
//   length = [
//       readUInt16(file),
//       readUInt16(file),
//       readUInt16(file)
//   ];
//   offset = [
//       readUInt32(file),
//       readUInt32(file),
//       readUInt32(file)
//   ];
//   console.log(length, offset);
//   this._mapNameLength = readUInt16(file);
//   this._musicNameLength = readUInt16(file);
//   console.log(this._mapNameLength, this._musicNameLength);
//   file.position += 4;
//   this._sParTime = readString(file, 5);
//   console.log(this._sParTime);
//   this._levelName = this._mapName = readString(file, this._mapNameLength);
//   this._music = readString(file, this._musicNameLength);
//   console.log(this._levelName, this._music);
//   this._plane1 = readPlaneData(file, offset[0], length[0], rle);
//   this._plane2 = readPlaneData(file, offset[1], length[1], rle);
//   // this._plane2 = Array.prototype.slice.call(this._plane2);
//   this._plane3 = readPlaneData(file, offset[2], length[2], rle);
//   // console.log(this._plane1);
//   // console.log(this._plane2);
//   // console.log(this._plane3);

//   this.areas = [];
//   this.tileMap = [];
//   this.wallTexX = [];
//   this.wallTexY = [];

//   for (x=0;x<64;x++) {
//       this.areas[x] = [];
//       this.tileMap[x] = [];
//       this.wallTexX[x] = [];
//       this.wallTexY[x] = [];
//       for (y=0;y<64;y++) {
//           this.areas[x][y] = 0;
//           this.tileMap[x][y] = 0;
//           this.wallTexX[x][y] = 0;
//           this.wallTexY[x][y] = 0;
//       }
//   }


//   for (y0 = 0; y0 < 64; ++y0) {
//       for (x = 0; x < 64; ++x) {
//           y = 63 - y0;
//           layer1 = this._plane1[y0 * 64 + x];
//           layer2 = this._plane2[y0 * 64 + x];
//           layer3 = this._plane3[y0 * 64 + x];

//           // if server, process obj layer!


//           // Map data layer
//           if (layer1 == 0) {
//           //    level.areas[x][y] = -3; // unknown area
//           } else if (layer1 < 0x6a) { // solid map object

//               if ((layer1 >= 0x5A && layer1 <= 0x5F) || layer1 == 0x64 || layer1 == 0x65) { // door
//                  // this.tileMap[x][y] |= layer1;

//           //        level.tileMap[x][y] |= Wolf.DOOR_TILE;
//           //        Wolf.Doors.spawn(level, x, y, layer1);
//           //        level.areas[x][y] = -2; // door area
//               } else {
//                  this.tileMap[x][y] = - layer1;
//           //        level.wallTexX[x][y] = (layer1-1) * 2 + 1;
//           //        level.wallTexY[x][y] = (layer1-1) * 2;
//           //        level.areas[x][y] = -1; // wall area
//                   if (layer1 == 0x15) { // elevator
//           //            level.tileMap[x][y] |= Wolf.ELEVATOR_TILE;
//                   }
//               }
//           } else if (layer1 == 0x6a) { // Ambush floor tile
//           //    level.tileMap[x][y] |= Wolf.AMBUSH_TILE;
//           //    level.areas[x][y] = -3; // unknown area
//           // } else if (layer1 >= Wolf.FIRSTAREA && layer1 < (Wolf.FIRSTAREA + Wolf.NUMAREAS)) { // area
//               // if (layer1 == Wolf.FIRSTAREA) { // secret level
//           //        level.tileMap[x][y] |= Wolf.SECRETLEVEL_TILE;
//               // }
//           //    level.areas[x][y] = layer1 - Wolf.FIRSTAREA;// spawn area
//           } else {
//           //    level.areas[x][y] = -3; // unknown area
//           }
//           if (layer2) {

//             this.tileMap[x][y] = layer2;
//             // console.log(layer2, -layer2);
//             // console.log(this.tileMap[x][y]);
//             //  spawnObj(level, layer2, x, y);
//           }
//           // End of the map data layer
//       }
//   }
//   // JDC: try to replace all the unknown areas with an adjacent area, to
//   // avoid the silent attack / no damage problem when you get an ambush
//   // guard stuck on their original tile
//   // for (x=1;x<63;x++) {
//   //     for (y=1;y<63;y++) {
//   //         if (level.areas[x][y] != -3) {
//   //             continue;
//   //         }
//   //         if (level.areas[x-1][y] >= 0) {
//   //             level.areas[x][y] = level.areas[x-1][y];
//   //         } else if (level.areas[x+1][y] >= 0) {
//   //             level.areas[x][y] = level.areas[x+1][y];
//   //         } else if (level.areas[x][y-1] >= 0) {
//   //             level.areas[x][y] = level.areas[x][y-1];
//   //         } else if (level.areas[x+1][y+1] >= 0) {
//   //             level.areas[x][y] = level.areas[x][y+1];
//   //         }
//   //     }
//   // }

//   // Wolf.Doors.setAreas(level);



// };

// Level.prototype = {
//   get name(){
//     return this._levelName
//   }
// , get file(){
//     return this._file;
//   }
// , get width(){
//     return this._width;
//   }
// , get height(){
//     return this._height;
//   }
// , get ceiling(){
//     return this._ceiling;
//   }
// , get floor(){
//     return this._floor;
//   }
// , get music(){
//     return this._music;
//   }
// , get json(){
//     var json = {
//       name:this._levelName
//     , music:this._music
//     , width:this._width
//     , height:this._height
//     , ceiling:this._ceiling
//     , floor:this._floor
//     , grid:this.tileMap
//     };
//     return json;
//   }
// };

// function pad(num, size) {
//   var s = '      ' + num;
//   return s.substr(s.length - size);
// }


// Level.prototype.print = function(){
//   var json = this.json;
//   var str = '{\n  ';
//   str += '"name": ';
//   str += '"' + this.name + '", ';
//   str += '"music": ';
//   str += '"' + this.music + '", ';
//   str += '"width": ';
//   str += '' + this.width + ', ';
//   str += '"height": ';
//   str += '' + this.height + ', ';
//   str += '"ceiling": ';
//   str += '"' + this.ceiling + '", ';
//   str += '"floor":';
//   str += '"' + this.floor + '", ';
//   str += '"grid": [';
//   for(var i=0;i<this.width;i++){
//     str += (i==0)? '\n  [':'\n, [';
//     for(var j=0;j<this.height;j++){
//       str += (j==0)?'':',';
//       str += pad(this.tileMap[i][j],3);
//     }
//     str += ']';
//   }
//   str += '\n]}';
//   console.log(str);
// }
