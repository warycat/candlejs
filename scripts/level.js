function readPlaneData(t,e,i,n){t.position=e;var r=readUInt16(t),a=readBytes(t,i-2),o=carmackExpand(a,r);return rlewExpand(o.slice(1),8192,n)}function carmackExpand(t,e){var i,n,r,a,o,s,h,l,c=167,d=168;for(e/=2,o=0,a=0,l=[];e;)if(s=t[o]+(t[o+1]<<8),o+=2,i=s>>8,i==c)if(h=255&s)for(n=t[o++],r=a-n,e-=h;h--;)l[a++]=l[r++];else s|=t[o++],l[a++]=s,e--;else if(i==d)if(h=255&s)for(n=t[o]+(t[o+1]<<8),o+=2,r=n,e-=h;h--;)l[a++]=l[r++];else s|=t[o++],l[a++]=s,e--;else l[a++]=s,e--;return l}function rlewExpand(t,e,i){var n,r,a,o,s=0,h=0,l=[];o=h+(e>>1);do if(n=t[s++],n!=i)l[h++]=n;else for(r=t[s++],n=t[s++],a=1;r>=a;++a)l[h++]=n;while(o>h);return l}function readUInt8(t){var e=255&t.data.charCodeAt(t.position);return t.position++,e}function readInt8(t){var e=readUInt8(t);return e>127?e-256:e}function readUInt16(t){var e=readUInt8(t)+(readUInt8(t)<<8);return 0>e?e+65536:e}function readInt16(t){var e=readUInt16(t);return e>32767?e-65536:e}function readUInt32(t){var e=readUInt8(t),i=readUInt8(t),n=readUInt8(t),r=readUInt8(t),a=(((r<<8)+n<<8)+i<<8)+e;return 0>a?a+4294967296:a}function readInt32(t){var e=readUInt32(t);return e>2147483647?e-4294967296:e}function readString(t,e){var i=t.data.substr(t.position,e);return t.position+=e,i}function readBytes(t,e){for(var i=[],n=0;e>n;n++)i[n]=255&t.data.charCodeAt(t.position+n);return t.position+=e,i}function componentToHex(t){var e=t.toString(16);return 1==e.length?"0"+e:e}function rgbToHex(t,e,i){return"#"+componentToHex(t)+componentToHex(e)+componentToHex(i)}function pad(t,e){var i="      "+t;return i.substr(i.length-e)}var Level=function(t){this._b64=t;var e=atob(t);this._file={data:e,position:0,size:e.length};var i=this._file;for(this._signature=readUInt32(i),rle=readUInt16(i),this._width=readUInt16(i),this._height=readUInt16(i),this._ceiling=[readUInt8(i),readUInt8(i),readUInt8(i),readUInt8(i)],this._ceiling=rgbToHex(this._ceiling[0],this._ceiling[1],this._ceiling[2]),this._floor=[readUInt8(i),readUInt8(i),readUInt8(i),readUInt8(i)],this._floor=rgbToHex(this._floor[0],this._floor[1],this._floor[2]),console.log(this._ceiling,this._floor),length=[readUInt16(i),readUInt16(i),readUInt16(i)],offset=[readUInt32(i),readUInt32(i),readUInt32(i)],console.log(length,offset),this._mapNameLength=readUInt16(i),this._musicNameLength=readUInt16(i),console.log(this._mapNameLength,this._musicNameLength),i.position+=4,this._sParTime=readString(i,5),console.log(this._sParTime),this._levelName=this._mapName=readString(i,this._mapNameLength),this._music=readString(i,this._musicNameLength),console.log(this._levelName,this._music),this._plane1=readPlaneData(i,offset[0],length[0],rle),this._plane2=readPlaneData(i,offset[1],length[1],rle),this._plane3=readPlaneData(i,offset[2],length[2],rle),this.areas=[],this.tileMap=[],this.wallTexX=[],this.wallTexY=[],x=0;x<64;x++)for(this.areas[x]=[],this.tileMap[x]=[],this.wallTexX[x]=[],this.wallTexY[x]=[],y=0;y<64;y++)this.areas[x][y]=0,this.tileMap[x][y]=0,this.wallTexX[x][y]=0,this.wallTexY[x][y]=0;for(y0=0;y0<64;++y0)for(x=0;x<64;++x)y=63-y0,layer1=this._plane1[64*y0+x],layer2=this._plane2[64*y0+x],layer3=this._plane3[64*y0+x],0==layer1||(layer1<106?layer1>=90&&layer1<=95||100==layer1||101==layer1||(this.tileMap[x][y]=-layer1,21==layer1):106==layer1),layer2&&(this.tileMap[x][y]=layer2)};Level.prototype={get name(){return this._levelName},get file(){return this._file},get width(){return this._width},get height(){return this._height},get ceiling(){return this._ceiling},get floor(){return this._floor},get music(){return this._music},get json(){var t={name:this._levelName,music:this._music,width:this._width,height:this._height,ceiling:this._ceiling,floor:this._floor,grid:this.tileMap};return t}},Level.prototype.print=function(){var t=(this.json,"{\n  ");t+='"name": ',t+='"'+this.name+'", ',t+='"music": ',t+='"'+this.music+'", ',t+='"width": ',t+=""+this.width+", ",t+='"height": ',t+=""+this.height+", ",t+='"ceiling": ',t+='"'+this.ceiling+'", ',t+='"floor":',t+='"'+this.floor+'", ',t+='"grid": [';for(var e=0;e<this.width;e++){t+=0==e?"\n  [":"\n, [";for(var i=0;i<this.height;i++)t+=0==i?"":",",t+=pad(this.tileMap[e][i],3);t+="]"}t+="\n]}",console.log(t)};