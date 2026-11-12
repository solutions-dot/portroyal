(()=>{var zp=0,Lu=1,Gp=2;var Eo=1,Hp=2,ia=3,Ci=0,un=1,Ot=2,rr=0,sa=1,ra=2,Du=3,Nu=4,Vp=5;var ar=100,Wp=101,qp=102,Xp=103,jp=104,Kp=200,Jp=201,Yp=202,Zp=203,Fu=204,Uu=205,$p=206,Qp=207,em=208,tm=209,nm=210,im=211,sm=212,rm=213,am=214,zc=0,Gc=1,Hc=2,zr=3,Vc=4,Wc=5,qc=6,Xc=7,ku=0,om=1,cm=2,Pi=0,Ou=1,Bu=2,zu=3,Ao=4,Gu=5,Hu=6,Vu=7,_u="attached",lm="detached",Wu=300,or=301,aa=302,_l=303,yl=304,Qn=1e3,vn=1001,Gr=1002,Kt=1003,vl=1004;var cr=1005;var en=1006,oa=1007;var ni=1008;var Nn=1009,qu=1010,Xu=1011,ca=1012,Ml=1013,mi=1014,Xn=1015,gi=1016,Sl=1017,wl=1018,lr=1020,ju=35902,Ku=35899,Ju=1021,Yu=1022,ii=1023,Xi=1026,is=1027,Tl=1028,El=1029,ws=1030,Al=1031;var Rl=1033,Ro=33776,Co=33777,Po=33778,Io=33779,Cl=35840,Pl=35841,Il=35842,Ll=35843,Dl=36196,Nl=37492,Fl=37496,Ul=37488,kl=37489,Lo=37490,Ol=37491,Bl=37808,zl=37809,Gl=37810,Hl=37811,Vl=37812,Wl=37813,ql=37814,Xl=37815,jl=37816,Kl=37817,Jl=37818,Yl=37819,Zl=37820,$l=37821,Ql=36492,eh=36494,th=36495,nh=36283,ih=36284,Do=36285,sh=36286,No=2200,rh=2201,hm=2202,Xs=2300,js=2301,Oc=2302,yu=2303,Vs=2400,Ws=2401,qa=2402,ah=2500,um=2501,Zu=0,Fo=1,la=2,dm=3200;var oh=0,fm=1,si="",kt="srgb",Tn="srgb-linear",Xa="linear",Rt="srgb";var Bc=7680;var pm=519,mm=512,gm=513,bm=514,$u=515,xm=516,_m=517,Qu=518,ed=519,td=35044,nd=35048;var id="300 es",$n=2e3,Hr=2001;function mg(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function gg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Vr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ym(){let i=Vr("canvas");return i.style.display="block",i}var Xf={},Wr=null;function ja(...i){let e="THREE."+i.shift();Wr?Wr("log",e,...i):console.log(e,...i)}function vm(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function We(...i){i=vm(i);let e="THREE."+i.shift();if(Wr)Wr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function et(...i){i=vm(i);let e="THREE."+i.shift();if(Wr)Wr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function qs(...i){let e=i.join(" ");e in Xf||(Xf[e]=!0,We(...i))}function Mm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Sm={[zc]:zc,[Hc]:qc,[Vc]:Vc,[zr]:Wc,[Gc]:Gc,[qc]:Hc,[Xc]:Xc,[Wc]:zr},fi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},_n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jf=1234567,Ga=Math.PI/180,Ks=180/Math.PI;function bi(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(_n[i&255]+_n[i>>8&255]+_n[i>>16&255]+_n[i>>24&255]+"-"+_n[e&255]+_n[e>>8&255]+"-"+_n[e>>16&15|64]+_n[e>>24&255]+"-"+_n[t&63|128]+_n[t>>8&255]+"-"+_n[t>>16&255]+_n[t>>24&255]+_n[n&255]+_n[n>>8&255]+_n[n>>16&255]+_n[n>>24&255]).toLowerCase()}function ft(i,e,t){return Math.max(e,Math.min(t,i))}function sd(i,e){return(i%e+e)%e}function bg(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function xg(i,e,t){return i!==e?(t-i)/(e-i):0}function Ha(i,e,t){return(1-t)*i+t*e}function _g(i,e,t,n){return Ha(i,e,1-Math.exp(-t*n))}function yg(i,e=1){return e-Math.abs(sd(i,e*2)-e)}function vg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Mg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Sg(i,e){return i+Math.floor(Math.random()*(e-i+1))}function wg(i,e){return i+Math.random()*(e-i)}function Tg(i){return i*(.5-Math.random())}function Eg(i){i!==void 0&&(jf=i);let e=jf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ag(i){return i*Ga}function Rg(i){return i*Ks}function Cg(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Pg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function rd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ig(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*f,o*h,o*c);break;default:We("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ch(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function ad(i,e){if(e.constructor===Float32Array)return i;let t=ch(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function od(i,e){if(e.constructor===Float32Array)return i;let t=ch(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var lh={DEG2RAD:Ga,RAD2DEG:Ks,generateUUID:bi,clamp:ft,euclideanModulo:sd,mapLinear:bg,inverseLerp:xg,lerp:Ha,damp:_g,pingpong:yg,smoothstep:vg,smootherstep:Mg,randInt:Sg,randFloat:wg,randFloatSpread:Tg,seededRandom:Eg,degToRad:Ag,radToDeg:Rg,isPowerOfTwo:Cg,ceilPowerOfTwo:Pg,floorPowerOfTwo:rd,setQuaternionFromProperEuler:Ig,normalize:od,denormalize:ad},fd=class fd{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};fd.prototype.isVector2=!0;var he=fd,jt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],m=r[a+2],_=r[a+3];if(u!==_||l!==d||c!==f||h!==m){let b=l*d+c*f+h*m+u*_;b<0&&(d=-d,f=-f,m=-m,_=-_,b=-b);let p=1-o;if(b<.9995){let x=Math.acos(b),v=Math.sin(x);p=Math.sin(p*x)/v,o=Math.sin(o*x)/v,l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+_*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+_*o;let x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:We("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},pd=class pd{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Kf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Kf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qh.copy(this).projectOnVector(e),this.sub(qh)}reflect(e){return this.sub(qh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ft(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};pd.prototype.isVector3=!0;var z=pd,qh=new z,Kf=new jt,md=class md{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],_=s[0],b=s[3],p=s[6],x=s[1],v=s[4],y=s[7],T=s[2],E=s[5],g=s[8];return r[0]=a*_+o*x+l*T,r[3]=a*b+o*v+l*E,r[6]=a*p+o*y+l*g,r[1]=c*_+h*x+u*T,r[4]=c*b+h*v+u*E,r[7]=c*p+h*y+u*g,r[2]=d*_+f*x+m*T,r[5]=d*b+f*v+m*E,r[8]=d*p+f*y+m*g,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return qs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xh.makeScale(e,t)),this}rotate(e){return qs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xh.makeRotation(-e)),this}translate(e,t){return qs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};md.prototype.isMatrix3=!0;var rt=md,Xh=new rt,Jf=new rt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yf=new rt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lg(){let i={enabled:!0,workingColorSpace:Tn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Rt&&(s.r=qi(s.r),s.g=qi(s.g),s.b=qi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Rt&&(s.r=Br(s.r),s.g=Br(s.g),s.b=Br(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===si?Xa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Tn]:{primaries:e,whitePoint:n,transfer:Xa,toXYZ:Jf,fromXYZ:Yf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:e,whitePoint:n,transfer:Rt,toXYZ:Jf,fromXYZ:Yf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}}),i}var bt=Lg();function qi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Br(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var vr,jc=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vr===void 0&&(vr=Vr("canvas")),vr.width=e.width,vr.height=e.height;let s=vr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=vr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Vr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=qi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(qi(t[n]/255)*255):t[n]=qi(t[n]);return{data:t,width:e.width,height:e.height}}else return We("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Dg=0,qr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Dg++}),this.uuid=bi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(jh(s[a].image)):r.push(jh(s[a]))}else r=jh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function jh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?jc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(We("Texture: Unable to serialize Texture."),{})}var Ng=0,Kh=new z,Jt=class i extends fi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=vn,s=vn,r=en,a=ni,o=ii,l=Nn,c=i.DEFAULT_ANISOTROPY,h=si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ng++}),this.uuid=bi(),this.name="",this.source=new qr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new rt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Kh).x}get height(){return this.source.getSize(Kh).y}get depth(){return this.source.getSize(Kh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){We(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){We(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qn:e.x=e.x-Math.floor(e.x);break;case vn:e.x=e.x<0?0:1;break;case Gr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qn:e.y=e.y-Math.floor(e.y);break;case vn:e.y=e.y<0?0:1;break;case Gr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Jt.DEFAULT_IMAGE=null;Jt.DEFAULT_MAPPING=Wu;Jt.DEFAULT_ANISOTROPY=1;var gd=class gd{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],_=l[2],b=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-b)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+b)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,y=(f+1)/2,T=(p+1)/2,E=(h+d)/4,g=(u+_)/4,M=(m+b)/4;return v>y&&v>T?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=E/n,r=g/n):y>T?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=E/s,r=M/s):T<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),n=g/r,s=M/r),this.set(n,s,r,t),this}let x=Math.sqrt((b-m)*(b-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(b-m)/x,this.y=(u-_)/x,this.z=(d-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ft(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};gd.prototype.isVector4=!0;var Pt=gd,Kc=class extends fi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Pt(0,0,e,t),this.scissorTest=!1,this.viewport=new Pt(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new Jt({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:en,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new qr(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Wn=class extends Kc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ka=class extends Jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Jc=class extends Jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var xl=class xl{constructor(e,t,n,s,r,a,o,l,c,h,u,d,f,m,_,b){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,d,f,m,_,b)}set(e,t,n,s,r,a,o,l,c,h,u,d,f,m,_,b){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=b,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xl().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Mr.setFromMatrixColumn(e,0).length(),r=1/Mr.setFromMatrixColumn(e,1).length(),a=1/Mr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,_=c*u;t[0]=d+_*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Fg,e,Ug)}lookAt(e,t,n){let s=this.elements;return Hn.subVectors(e,t),Hn.lengthSq()===0&&(Hn.z=1),Hn.normalize(),us.crossVectors(n,Hn),us.lengthSq()===0&&(Math.abs(n.z)===1?Hn.x+=1e-4:Hn.z+=1e-4,Hn.normalize(),us.crossVectors(n,Hn)),us.normalize(),cc.crossVectors(Hn,us),s[0]=us.x,s[4]=cc.x,s[8]=Hn.x,s[1]=us.y,s[5]=cc.y,s[9]=Hn.y,s[2]=us.z,s[6]=cc.z,s[10]=Hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],_=n[6],b=n[10],p=n[14],x=n[3],v=n[7],y=n[11],T=n[15],E=s[0],g=s[4],M=s[8],k=s[12],I=s[1],U=s[5],V=s[9],J=s[13],R=s[2],P=s[6],F=s[10],O=s[14],W=s[3],N=s[7],H=s[11],q=s[15];return r[0]=a*E+o*I+l*R+c*W,r[4]=a*g+o*U+l*P+c*N,r[8]=a*M+o*V+l*F+c*H,r[12]=a*k+o*J+l*O+c*q,r[1]=h*E+u*I+d*R+f*W,r[5]=h*g+u*U+d*P+f*N,r[9]=h*M+u*V+d*F+f*H,r[13]=h*k+u*J+d*O+f*q,r[2]=m*E+_*I+b*R+p*W,r[6]=m*g+_*U+b*P+p*N,r[10]=m*M+_*V+b*F+p*H,r[14]=m*k+_*J+b*O+p*q,r[3]=x*E+v*I+y*R+T*W,r[7]=x*g+v*U+y*P+T*N,r[11]=x*M+v*V+y*F+T*H,r[15]=x*k+v*J+y*O+T*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],_=e[7],b=e[11],p=e[15],x=l*f-c*d,v=o*f-c*u,y=o*d-l*u,T=a*f-c*h,E=a*d-l*h,g=a*u-o*h;return t*(_*x-b*v+p*y)-n*(m*x-b*T+p*E)+s*(m*v-_*T+p*g)-r*(m*y-_*E+b*g)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],_=e[13],b=e[14],p=e[15],x=t*o-n*a,v=t*l-s*a,y=t*c-r*a,T=n*l-s*o,E=n*c-r*o,g=s*c-r*l,M=h*_-u*m,k=h*b-d*m,I=h*p-f*m,U=u*b-d*_,V=u*p-f*_,J=d*p-f*b,R=x*J-v*V+y*U+T*I-E*k+g*M;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/R;return e[0]=(o*J-l*V+c*U)*P,e[1]=(s*V-n*J-r*U)*P,e[2]=(_*g-b*E+p*T)*P,e[3]=(d*E-u*g-f*T)*P,e[4]=(l*I-a*J-c*k)*P,e[5]=(t*J-s*I+r*k)*P,e[6]=(b*y-m*g-p*v)*P,e[7]=(h*g-d*y+f*v)*P,e[8]=(a*V-o*I+c*M)*P,e[9]=(n*I-t*V-r*M)*P,e[10]=(m*E-_*y+p*x)*P,e[11]=(u*y-h*E-f*x)*P,e[12]=(o*k-a*U-l*M)*P,e[13]=(t*U-n*k+s*M)*P,e[14]=(_*v-m*T-b*x)*P,e[15]=(h*T-u*v+d*x)*P,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,_=a*h,b=a*u,p=o*u,x=l*c,v=l*h,y=l*u,T=n.x,E=n.y,g=n.z;return s[0]=(1-(_+p))*T,s[1]=(f+y)*T,s[2]=(m-v)*T,s[3]=0,s[4]=(f-y)*E,s[5]=(1-(d+p))*E,s[6]=(b+x)*E,s[7]=0,s[8]=(m+v)*g,s[9]=(b-x)*g,s[10]=(1-(d+_))*g,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Mr.set(s[0],s[1],s[2]).length(),o=Mr.set(s[4],s[5],s[6]).length(),l=Mr.set(s[8],s[9],s[10]).length();r<0&&(a=-a),li.copy(this);let c=1/a,h=1/o,u=1/l;return li.elements[0]*=c,li.elements[1]*=c,li.elements[2]*=c,li.elements[4]*=h,li.elements[5]*=h,li.elements[6]*=h,li.elements[8]*=u,li.elements[9]*=u,li.elements[10]*=u,t.setFromRotationMatrix(li),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=$n,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,_;if(l)m=r/(a-r),_=a*r/(a-r);else if(o===$n)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Hr)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=$n,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,_;if(l)m=1/(a-r),_=a/(a-r);else if(o===$n)m=-2/(a-r),_=-(a+r)/(a-r);else if(o===Hr)m=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};xl.prototype.isMatrix4=!0;var tt=xl,Mr=new z,li=new tt,Fg=new z(0,0,0),Ug=new z(1,1,1),us=new z,cc=new z,Hn=new z,Zf=new tt,$f=new jt,ei=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ft(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:We("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zf,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return $f.setFromEuler(this),this.setFromQuaternion($f,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ei.DEFAULT_ORDER="XYZ";var Ja=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},kg=0,Qf=new z,Sr=new jt,Oi=new tt,lc=new z,Ra=new z,Og=new z,Bg=new jt,ep=new z(1,0,0),tp=new z(0,1,0),np=new z(0,0,1),ip={type:"added"},zg={type:"removed"},wr={type:"childadded",child:null},Jh={type:"childremoved",child:null},Ut=class i extends fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:kg++}),this.uuid=bi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new z,t=new ei,n=new jt,s=new z(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new tt},normalMatrix:{value:new rt}}),this.matrix=new tt,this.matrixWorld=new tt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ja,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Sr.setFromAxisAngle(e,t),this.quaternion.multiply(Sr),this}rotateOnWorldAxis(e,t){return Sr.setFromAxisAngle(e,t),this.quaternion.premultiply(Sr),this}rotateX(e){return this.rotateOnAxis(ep,e)}rotateY(e){return this.rotateOnAxis(tp,e)}rotateZ(e){return this.rotateOnAxis(np,e)}translateOnAxis(e,t){return Qf.copy(e).applyQuaternion(this.quaternion),this.position.add(Qf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ep,e)}translateY(e){return this.translateOnAxis(tp,e)}translateZ(e){return this.translateOnAxis(np,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Oi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?lc.copy(e):lc.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ra.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Oi.lookAt(Ra,lc,this.up):Oi.lookAt(lc,Ra,this.up),this.quaternion.setFromRotationMatrix(Oi),s&&(Oi.extractRotation(s.matrixWorld),Sr.setFromRotationMatrix(Oi),this.quaternion.premultiply(Sr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(et("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ip),wr.child=e,this.dispatchEvent(wr),wr.child=null):et("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zg),Jh.child=e,this.dispatchEvent(Jh),Jh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ip),wr.child=e,this.dispatchEvent(wr),wr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ra,e,Og),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ra,Bg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ut.DEFAULT_UP=new z(0,1,0);Ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wt=class extends Ut{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gg={type:"move"},Xr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let b=t.getJointPose(_,n),p=this._getHandJoint(c,_);b!==null&&(p.matrix.fromArray(b.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=b.radius),p.visible=b!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gg)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new wt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},wm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ds={h:0,s:0,l:0},hc={h:0,s:0,l:0};function Yh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,bt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=bt.workingColorSpace){return this.r=e,this.g=t,this.b=n,bt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=bt.workingColorSpace){if(e=sd(e,1),t=ft(t,0,1),n=ft(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Yh(a,r,e+1/3),this.g=Yh(a,r,e),this.b=Yh(a,r,e-1/3)}return bt.colorSpaceToWorking(this,s),this}setStyle(e,t=kt){function n(r){r!==void 0&&parseFloat(r)<1&&We("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:We("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);We("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let n=wm[e.toLowerCase()];return n!==void 0?this.setHex(n,t):We("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qi(e.r),this.g=qi(e.g),this.b=qi(e.b),this}copyLinearToSRGB(e){return this.r=Br(e.r),this.g=Br(e.g),this.b=Br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return bt.workingToColorSpace(yn.copy(this),e),Math.round(ft(yn.r*255,0,255))*65536+Math.round(ft(yn.g*255,0,255))*256+Math.round(ft(yn.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=bt.workingColorSpace){bt.workingToColorSpace(yn.copy(this),t);let n=yn.r,s=yn.g,r=yn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=bt.workingColorSpace){return bt.workingToColorSpace(yn.copy(this),t),e.r=yn.r,e.g=yn.g,e.b=yn.b,e}getStyle(e=kt){bt.workingToColorSpace(yn.copy(this),e);let t=yn.r,n=yn.g,s=yn.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ds),this.setHSL(ds.h+e,ds.s+t,ds.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ds),e.getHSL(hc);let n=Ha(ds.h,hc.h,t),s=Ha(ds.s,hc.s,t),r=Ha(ds.l,hc.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},yn=new qe;qe.NAMES=wm;var Ya=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new qe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Za=class extends Ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},hi=new z,Bi=new z,Zh=new z,zi=new z,Tr=new z,Er=new z,sp=new z,$h=new z,Qh=new z,eu=new z,tu=new Pt,nu=new Pt,iu=new Pt,Wi=class i{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),hi.subVectors(e,t),s.cross(hi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){hi.subVectors(s,t),Bi.subVectors(n,t),Zh.subVectors(e,t);let a=hi.dot(hi),o=hi.dot(Bi),l=hi.dot(Zh),c=Bi.dot(Bi),h=Bi.dot(Zh),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,zi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,zi.x),l.addScaledVector(a,zi.y),l.addScaledVector(o,zi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return tu.setScalar(0),nu.setScalar(0),iu.setScalar(0),tu.fromBufferAttribute(e,t),nu.fromBufferAttribute(e,n),iu.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(tu,r.x),a.addScaledVector(nu,r.y),a.addScaledVector(iu,r.z),a}static isFrontFacing(e,t,n,s){return hi.subVectors(n,t),Bi.subVectors(e,t),hi.cross(Bi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hi.subVectors(this.c,this.b),Bi.subVectors(this.a,this.b),hi.cross(Bi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Tr.subVectors(s,n),Er.subVectors(r,n),$h.subVectors(e,n);let l=Tr.dot($h),c=Er.dot($h);if(l<=0&&c<=0)return t.copy(n);Qh.subVectors(e,s);let h=Tr.dot(Qh),u=Er.dot(Qh);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(n).addScaledVector(Tr,a);eu.subVectors(e,r);let f=Tr.dot(eu),m=Er.dot(eu);if(m>=0&&f<=m)return t.copy(r);let _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Er,o);let b=h*m-f*u;if(b<=0&&u-h>=0&&f-m>=0)return sp.subVectors(r,s),o=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(sp,o);let p=1/(b+_+d);return a=_*p,o=d*p,t.copy(n).addScaledVector(Tr,a).addScaledVector(Er,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},En=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ui):ui.fromBufferAttribute(r,a),ui.applyMatrix4(e.matrixWorld),this.expandByPoint(ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),uc.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),uc.copy(n.boundingBox)),uc.applyMatrix4(e.matrixWorld),this.union(uc)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ui),ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ca),dc.subVectors(this.max,Ca),Ar.subVectors(e.a,Ca),Rr.subVectors(e.b,Ca),Cr.subVectors(e.c,Ca),fs.subVectors(Rr,Ar),ps.subVectors(Cr,Rr),Bs.subVectors(Ar,Cr);let t=[0,-fs.z,fs.y,0,-ps.z,ps.y,0,-Bs.z,Bs.y,fs.z,0,-fs.x,ps.z,0,-ps.x,Bs.z,0,-Bs.x,-fs.y,fs.x,0,-ps.y,ps.x,0,-Bs.y,Bs.x,0];return!su(t,Ar,Rr,Cr,dc)||(t=[1,0,0,0,1,0,0,0,1],!su(t,Ar,Rr,Cr,dc))?!1:(fc.crossVectors(fs,ps),t=[fc.x,fc.y,fc.z],su(t,Ar,Rr,Cr,dc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Gi=[new z,new z,new z,new z,new z,new z,new z,new z],ui=new z,uc=new En,Ar=new z,Rr=new z,Cr=new z,fs=new z,ps=new z,Bs=new z,Ca=new z,dc=new z,fc=new z,zs=new z;function su(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){zs.fromArray(i,r);let o=s.x*Math.abs(zs.x)+s.y*Math.abs(zs.y)+s.z*Math.abs(zs.z),l=e.dot(zs),c=t.dot(zs),h=n.dot(zs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var $t=new z,pc=new he,Hg=0,hn=class extends fi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Hg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=td,this.updateRanges=[],this.gpuType=Xn,this.version=0,this._normalizationScale=e!==void 0?ch(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)pc.fromBufferAttribute(this,t),pc.applyMatrix3(e),this.setXY(t,pc.x,pc.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix3(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):ad(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):od(e,this.array)}};var $a=class extends hn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Qa=class extends hn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var lt=class extends hn{constructor(e,t,n){super(new Float32Array(e),t,n)}},Vg=new En,Pa=new z,ru=new z,Ln=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Vg.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Pa.subVectors(e,this.center);let t=Pa.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Pa,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ru.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Pa.copy(e.center).add(ru)),this.expandByPoint(Pa.copy(e.center).sub(ru))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Wg=0,Zn=new tt,au=new Ut,Pr=new z,Vn=new En,Ia=new En,on=new z,Dt=class i extends fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wg++}),this.uuid=bi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mg(e)?Qa:$a)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new rt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Zn.makeRotationFromQuaternion(e),this.applyMatrix4(Zn),this}rotateX(e){return Zn.makeRotationX(e),this.applyMatrix4(Zn),this}rotateY(e){return Zn.makeRotationY(e),this.applyMatrix4(Zn),this}rotateZ(e){return Zn.makeRotationZ(e),this.applyMatrix4(Zn),this}translate(e,t,n){return Zn.makeTranslation(e,t,n),this.applyMatrix4(Zn),this}scale(e,t,n){return Zn.makeScale(e,t,n),this.applyMatrix4(Zn),this}lookAt(e){return au.lookAt(e),au.updateMatrix(),this.applyMatrix4(au.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pr).negate(),this.translate(Pr.x,Pr.y,Pr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new lt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&We("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Vn.setFromBufferAttribute(r),this.morphTargetsRelative?(on.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(on),on.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(on)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&et('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ln);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){let n=this.boundingSphere.center;if(Vn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ia.setFromBufferAttribute(o),this.morphTargetsRelative?(on.addVectors(Vn.min,Ia.min),Vn.expandByPoint(on),on.addVectors(Vn.max,Ia.max),Vn.expandByPoint(on)):(Vn.expandByPoint(Ia.min),Vn.expandByPoint(Ia.max))}Vn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)on.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(on));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)on.fromBufferAttribute(o,c),l&&(Pr.fromBufferAttribute(e,c),on.add(Pr)),s=Math.max(s,n.distanceToSquared(on))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&et('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){et("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new hn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[],c=new Uint8Array(n.count);for(let k=0;k<n.count;k++)o[k]=new z,l[k]=new z;let h=new z,u=new z,d=new z,f=new he,m=new he,_=new he,b=new z,p=new z;function x(k,I,U){c[k]=c[I]=c[U]=1,h.fromBufferAttribute(n,k),u.fromBufferAttribute(n,I),d.fromBufferAttribute(n,U),f.fromBufferAttribute(r,k),m.fromBufferAttribute(r,I),_.fromBufferAttribute(r,U),u.sub(h),d.sub(h),m.sub(f),_.sub(f);let V=1/(m.x*_.y-_.x*m.y);isFinite(V)&&(b.copy(u).multiplyScalar(_.y).addScaledVector(d,-m.y).multiplyScalar(V),p.copy(d).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(V),o[k].add(b),o[I].add(b),o[U].add(b),l[k].add(p),l[I].add(p),l[U].add(p))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let k=0,I=v.length;k<I;++k){let U=v[k],V=U.start,J=U.count;for(let R=V,P=V+J;R<P;R+=3)x(e.getX(R+0),e.getX(R+1),e.getX(R+2))}let y=new z,T=new z,E=new z,g=new z;function M(k){E.fromBufferAttribute(s,k),g.copy(E);let I=o[k];y.copy(I),y.sub(E.multiplyScalar(E.dot(I))).normalize(),T.crossVectors(g,I);let V=T.dot(l[k])<0?-1:1;a.setXYZW(k,y.x,y.y,y.z,V)}for(let k=0,I=n.count;k<I;++k)c[k]&&M(k);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new hn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new z,r=new z,a=new z,o=new z,l=new z,c=new z,h=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),_=e.getX(d+1),b=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,b),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,b),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(b,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)on.fromBufferAttribute(e,t),on.normalize(),e.setXYZ(t,on.x,on.y,on.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let _=0,b=l.length;_<b;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new hn(d,h,u)}if(this.index===null)return We("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Js=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=td,this.updateRanges=[],this.version=0,this.uuid=bi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=rp(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=rp(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function rp(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=bi()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var wn=new z,bs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?ch(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)wn.fromBufferAttribute(this,t),wn.applyMatrix4(e),this.setXYZ(t,wn.x,wn.y,wn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wn.fromBufferAttribute(this,t),wn.applyNormalMatrix(e),this.setXYZ(t,wn.x,wn.y,wn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wn.fromBufferAttribute(this,t),wn.transformDirection(e),this.setXYZ(t,wn.x,wn.y,wn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ja("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new hn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ja("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):ad(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):od(e,this.data.array)}},ou=new z,qg=new z,Xg=new rt,di=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ou.subVectors(n,t).cross(qg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(ou),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Xg.getNormalMatrix(e),s=this.coplanarPoint(ou).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},jg=0,An=class extends fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jg++}),this.uuid=bi(),this.name="",this.type="Material",this.blending=sa,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fu,this.blendDst=Uu,this.blendEquation=ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=zr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bc,this.stencilZFail=Bc,this.stencilZPass=Bc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){We(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){We(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new di().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new he().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new he().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},jr=class extends An{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ir,La=new z,Lr=new z,Dr=new z,Nr=new he,Da=new he,Tm=new tt,mc=new z,Na=new z,gc=new z,ap=new he,cu=new he,op=new he,eo=class extends Ut{constructor(e=new jr){if(super(),this.isSprite=!0,this.type="Sprite",Ir===void 0){Ir=new Dt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Js(t,5);Ir.setIndex([0,1,2,0,2,3]),Ir.setAttribute("position",new bs(n,3,0,!1)),Ir.setAttribute("uv",new bs(n,2,3,!1))}this.geometry=Ir,this.material=e,this.center=new he(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&et('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Lr.setFromMatrixScale(this.matrixWorld),Tm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Dr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Lr.multiplyScalar(-Dr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;bc(mc.set(-.5,-.5,0),Dr,a,Lr,s,r),bc(Na.set(.5,-.5,0),Dr,a,Lr,s,r),bc(gc.set(.5,.5,0),Dr,a,Lr,s,r),ap.set(0,0),cu.set(1,0),op.set(1,1);let o=e.ray.intersectTriangle(mc,Na,gc,!1,La);if(o===null&&(bc(Na.set(-.5,.5,0),Dr,a,Lr,s,r),cu.set(0,1),o=e.ray.intersectTriangle(mc,gc,Na,!1,La),o===null))return;let l=e.ray.origin.distanceTo(La);l<e.near||l>e.far||t.push({distance:l,point:La.clone(),uv:Wi.getInterpolation(La,mc,Na,gc,ap,cu,op,new he),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function bc(i,e,t,n,s,r){Nr.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Da.x=r*Nr.x-s*Nr.y,Da.y=s*Nr.x+r*Nr.y):Da.copy(Nr),i.copy(e),i.x+=Da.x,i.y+=Da.y,i.applyMatrix4(Tm)}var Hi=new z,lu=new z,xc=new z,_c=new z,Ys=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Hi.copy(this.origin).addScaledVector(this.direction,t),Hi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){lu.copy(e).add(t).multiplyScalar(.5),xc.copy(t).sub(e).normalize(),_c.copy(this.origin).sub(lu);let r=e.distanceTo(t)*.5,a=-this.direction.dot(xc),o=_c.dot(this.direction),l=-_c.dot(xc),c=_c.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(lu).addScaledVector(xc,d),f}intersectSphere(e,t){if(e.radius<0)return null;Hi.subVectors(e.center,this.origin);let n=Hi.dot(this.direction),s=Hi.dot(Hi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Hi)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,m=t.x-a.x,_=t.y-a.y,b=t.z-a.z,p=n.x-a.x,x=n.y-a.y,v=n.z-a.z,y=Math.abs(l),T=Math.abs(c),E=Math.abs(h),g,M,k,I,U,V,J,R,P,F,O,W;if(y>=T&&y>=E?(k=l,V=u,P=m,W=p,l>=0?(g=c,M=h,I=d,U=f,J=_,R=b,F=x,O=v):(g=h,M=c,I=f,U=d,J=b,R=_,F=v,O=x)):T>=E?(k=c,V=d,P=_,W=x,c>=0?(g=h,M=l,I=f,U=u,J=b,R=m,F=v,O=p):(g=l,M=h,I=u,U=f,J=m,R=b,F=p,O=v)):(k=h,V=f,P=b,W=v,h>=0?(g=l,M=c,I=u,U=d,J=m,R=_,F=p,O=x):(g=c,M=l,I=d,U=u,J=_,R=m,F=x,O=p)),k===0)return null;let N=g/k,H=M/k,q=1/k,ce=I-N*V,Pe=U-H*V,$=J-N*P,de=R-H*P,Ae=F-N*W,Xe=O-H*W,Me=Ae*de-Xe*$,je=ce*Xe-Pe*Ae,At=$*Pe-de*ce;if(s){if(Me<0||je<0||At<0)return null}else if((Me<0||je<0||At<0)&&(Me>0||je>0||At>0))return null;let Ye=Me+je+At;if(Ye===0)return null;let at=q*(Me*V+je*P+At*W);return(Ye>0?at<0:at>0)?null:this.at(at/Ye,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Mt=class extends An{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=ku,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},cp=new tt,Gs=new Ys,yc=new Ln,lp=new z,vc=new z,Mc=new z,Sc=new z,hu=new z,wc=new z,hp=new z,Tc=new z,_t=class extends Ut{constructor(e=new Dt,t=new Mt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){wc.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(hu.fromBufferAttribute(u,e),a?wc.addScaledVector(hu,h):wc.addScaledVector(hu.sub(t),h))}t.add(wc)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),yc.copy(n.boundingSphere),yc.applyMatrix4(r),Gs.copy(e.ray).recast(e.near),!(yc.containsPoint(Gs.origin)===!1&&(Gs.intersectSphere(yc,lp)===null||Gs.origin.distanceToSquared(lp)>(e.far-e.near)**2))&&(cp.copy(r).invert(),Gs.copy(e.ray).applyMatrix4(cp),!(n.boundingBox!==null&&Gs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Gs)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){let b=d[m],p=a[b.materialIndex],x=Math.max(b.start,f.start),v=Math.min(o.count,Math.min(b.start+b.count,f.start+f.count));for(let y=x,T=v;y<T;y+=3){let E=o.getX(y),g=o.getX(y+1),M=o.getX(y+2);s=Ec(this,p,e,n,c,h,u,E,g,M),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=b.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let b=m,p=_;b<p;b+=3){let x=o.getX(b),v=o.getX(b+1),y=o.getX(b+2);s=Ec(this,a,e,n,c,h,u,x,v,y),s&&(s.faceIndex=Math.floor(b/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){let b=d[m],p=a[b.materialIndex],x=Math.max(b.start,f.start),v=Math.min(l.count,Math.min(b.start+b.count,f.start+f.count));for(let y=x,T=v;y<T;y+=3){let E=y,g=y+1,M=y+2;s=Ec(this,p,e,n,c,h,u,E,g,M),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=b.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let b=m,p=_;b<p;b+=3){let x=b,v=b+1,y=b+2;s=Ec(this,a,e,n,c,h,u,x,v,y),s&&(s.faceIndex=Math.floor(b/3),t.push(s))}}}};function Kg(i,e,t,n,s,r,a,o){let l;if(e.side===un?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ci,o),l===null)return null;Tc.copy(o),Tc.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Tc);return c<t.near||c>t.far?null:{distance:c,point:Tc.clone(),object:i}}function Ec(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,vc),i.getVertexPosition(l,Mc),i.getVertexPosition(c,Sc);let h=Kg(i,e,t,n,vc,Mc,Sc,hp);if(h){let u=new z;Wi.getBarycoord(hp,vc,Mc,Sc,u),s&&(h.uv=Wi.getInterpolatedAttribute(s,o,l,c,u,new he)),r&&(h.uv1=Wi.getInterpolatedAttribute(r,o,l,c,u,new he)),a&&(h.normal=Wi.getInterpolatedAttribute(a,o,l,c,u,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new z,materialIndex:0};Wi.getNormal(vc,Mc,Sc,d.normal),h.face=d,h.barycoord=u}return h}var Fa=new Pt,up=new Pt,dp=new Pt,Jg=new Pt,fp=new tt,Ac=new z,uu=new Ln,pp=new tt,du=new Ys,to=class extends _t{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=_u,this.bindMatrix=new tt,this.bindMatrixInverse=new tt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new En),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ac),this.boundingBox.expandByPoint(Ac)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ln),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ac),this.boundingSphere.expandByPoint(Ac)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uu.copy(this.boundingSphere),uu.applyMatrix4(s),e.ray.intersectsSphere(uu)!==!1&&(pp.copy(s).invert(),du.copy(e.ray).applyMatrix4(pp),!(this.boundingBox!==null&&du.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,du)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Pt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===_u?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===lm?this.bindMatrixInverse.copy(this.bindMatrix).invert():We("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;up.fromBufferAttribute(s.attributes.skinIndex,e),dp.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Fa.copy(t),t.set(0,0,0,0)):(Fa.set(t.x,t.y,t.z,1),t.set(0,0,0)),Fa.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=dp.getComponent(r);if(a!==0){let o=up.getComponent(r);fp.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Jg.copy(Fa).applyMatrix4(fp),a)}}return t.isVector4&&(t.w=Fa.w),t.applyMatrix4(this.bindMatrixInverse)}},Kr=class extends Ut{constructor(){super(),this.isBone=!0,this.type="Bone"}},Jr=class extends Jt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Kt,h=Kt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},mp=new tt,Yg=new tt,no=class i{constructor(e=[],t=[]){this.uuid=bi(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){We("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new tt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new tt;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:Yg;mp.multiplyMatrices(o,t[r]),mp.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Jr(t,e,e,ii,Xn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(We("Skeleton: No bone found with UUID:",r),a=new Kr),this.bones.push(a),this.boneInverses.push(new tt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},ji=class extends hn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Fr=new tt,gp=new tt,Rc=[],bp=new En,Zg=new tt,Ua=new _t,ka=new Ln,Zs=class extends _t{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ji(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Zg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new En),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fr),bp.copy(e.boundingBox).applyMatrix4(Fr),this.boundingBox.union(bp)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ln),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fr),ka.copy(e.boundingSphere).applyMatrix4(Fr),this.boundingSphere.union(ka)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Ua.geometry=this.geometry,Ua.material=this.material,Ua.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ka.copy(this.boundingSphere),ka.applyMatrix4(n),e.ray.intersectsSphere(ka)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Fr),gp.multiplyMatrices(n,Fr),Ua.matrixWorld=gp,Ua.raycast(e,Rc);for(let a=0,o=Rc.length;a<o;a++){let l=Rc[a];l.instanceId=r,l.object=this,t.push(l)}Rc.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ji(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Jr(new Float32Array(s*this.count),s,this.count,Tl,Xn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Hs=new Ln,$g=new he(.5,.5),Cc=new z,xs=class{constructor(e=new di,t=new di,n=new di,s=new di,r=new di,a=new di){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=$n,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],_=r[9],b=r[10],p=r[11],x=r[12],v=r[13],y=r[14],T=r[15];if(s[0].setComponents(c-a,f-h,p-m,T-x).normalize(),s[1].setComponents(c+a,f+h,p+m,T+x).normalize(),s[2].setComponents(c+o,f+u,p+_,T+v).normalize(),s[3].setComponents(c-o,f-u,p-_,T-v).normalize(),n)s[4].setComponents(l,d,b,y).normalize(),s[5].setComponents(c-l,f-d,p-b,T-y).normalize();else if(s[4].setComponents(c-l,f-d,p-b,T-y).normalize(),t===$n)s[5].setComponents(c+l,f+d,p+b,T+y).normalize();else if(t===Hr)s[5].setComponents(l,d,b,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hs)}intersectsSprite(e){Hs.center.set(0,0,0);let t=$g.distanceTo(e.center);return Hs.radius=.7071067811865476+t,Hs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Cc.x=s.normal.x>0?e.max.x:e.min.x,Cc.y=s.normal.y>0?e.max.y:e.min.y,Cc.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Cc)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},xp=new tt,Yc=class i{constructor(){this.coordinateSystem=$n,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];xp.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new xs),n[s].setFromProjectionMatrix(xp,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new xs),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var _s=class extends An{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Zc=new z,$c=new z,_p=new tt,Oa=new Ys,Pc=new Ln,fu=new z,yp=new z,Ki=class extends Ut{constructor(e=new Dt,t=new _s){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Zc.fromBufferAttribute(t,s-1),$c.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Zc.distanceTo($c);e.setAttribute("lineDistance",new lt(n,1))}else We("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pc.copy(n.boundingSphere),Pc.applyMatrix4(s),Pc.radius+=r,e.ray.intersectsSphere(Pc)===!1)return;_p.copy(s).invert(),Oa.copy(e.ray).applyMatrix4(_p);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let _=f,b=m-1;_<b;_+=c){let p=h.getX(_),x=h.getX(_+1),v=Ic(this,e,Oa,l,p,x,_);v&&t.push(v)}if(this.isLineLoop){let _=h.getX(m-1),b=h.getX(f),p=Ic(this,e,Oa,l,_,b,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,b=m-1;_<b;_+=c){let p=Ic(this,e,Oa,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=Ic(this,e,Oa,l,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Ic(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Zc.fromBufferAttribute(o,s),$c.fromBufferAttribute(o,r),t.distanceSqToSegment(Zc,$c,fu,yp)>n)return;fu.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(fu);if(!(c<e.near||c>e.far))return{distance:c,point:yp.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var vp=new z,Mp=new z,io=class extends Ki{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)vp.fromBufferAttribute(t,s),Mp.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+vp.distanceTo(Mp);e.setAttribute("lineDistance",new lt(n,1))}else We("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},so=class extends Ki{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Yr=class extends An{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Sp=new tt,vu=new Ys,Lc=new Ln,Dc=new z,ro=class extends Ut{constructor(e=new Dt,t=new Yr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Lc.copy(n.boundingSphere),Lc.applyMatrix4(s),Lc.radius+=r,e.ray.intersectsSphere(Lc)===!1)return;Sp.copy(s).invert(),vu.copy(e.ray).applyMatrix4(Sp);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,_=f;m<_;m++){let b=c.getX(m);Dc.fromBufferAttribute(u,b),wp(Dc,b,l,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,_=f;m<_;m++)Dc.fromBufferAttribute(u,m),wp(Dc,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function wp(i,e,t,n,s,r,a){let o=vu.distanceSqToPoint(i);if(o<t){let l=new z;vu.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var ao=class extends Jt{constructor(e=[],t=or,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$s=class extends Jt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ji=class extends Jt{constructor(e,t,n=mi,s,r,a,o=Kt,l=Kt,c,h=Xi,u=1){if(h!==Xi&&h!==is)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},oo=class extends Ji{constructor(e,t=mi,n=or,s,r,a=Kt,o=Kt,l,c=Xi){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},co=class extends Jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},pt=class i extends Dt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function m(_,b,p,x,v,y,T,E,g,M,k){let I=y/g,U=T/M,V=y/2,J=T/2,R=E/2,P=g+1,F=M+1,O=0,W=0,N=new z;for(let H=0;H<F;H++){let q=H*U-J;for(let ce=0;ce<P;ce++){let Pe=ce*I-V;N[_]=Pe*x,N[b]=q*v,N[p]=R,c.push(N.x,N.y,N.z),N[_]=0,N[b]=0,N[p]=E>0?1:-1,h.push(N.x,N.y,N.z),u.push(ce/g),u.push(1-H/M),O+=1}}for(let H=0;H<M;H++)for(let q=0;q<g;q++){let ce=d+q+P*H,Pe=d+q+P*(H+1),$=d+(q+1)+P*(H+1),de=d+(q+1)+P*H;l.push(ce,Pe,de),l.push(Pe,$,de),W+=6}o.addGroup(f,W,k),f+=W,d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var lo=class i extends Dt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new z,h=new he;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(o,3)),this.setAttribute("uv",new lt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},it=class i extends Dt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,_=[],b=n/2,p=0;x(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(f,2));function x(){let y=new z,T=new z,E=0,g=(t-e)/n;for(let M=0;M<=r;M++){let k=[],I=M/r,U=I*(t-e)+e;for(let V=0;V<=s;V++){let J=V/s,R=J*l+o,P=Math.sin(R),F=Math.cos(R);T.x=U*P,T.y=-I*n+b,T.z=U*F,u.push(T.x,T.y,T.z),y.set(P,g,F).normalize(),d.push(y.x,y.y,y.z),f.push(J,1-I),k.push(m++)}_.push(k)}for(let M=0;M<s;M++)for(let k=0;k<r;k++){let I=_[k][M],U=_[k+1][M],V=_[k+1][M+1],J=_[k][M+1];(e>0||k!==0)&&(h.push(I,U,J),E+=3),(t>0||k!==r-1)&&(h.push(U,V,J),E+=3)}c.addGroup(p,E,0),p+=E}function v(y){let T=m,E=new he,g=new z,M=0,k=y===!0?e:t,I=y===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,b*I,0),d.push(0,I,0),f.push(.5,.5),m++;let U=m;for(let V=0;V<=s;V++){let R=V/s*l+o,P=Math.cos(R),F=Math.sin(R);g.x=k*F,g.y=b*I,g.z=k*P,u.push(g.x,g.y,g.z),d.push(0,I,0),E.x=P*.5+.5,E.y=F*.5*I+.5,f.push(E.x,E.y),m++}for(let V=0;V<s;V++){let J=T+V,R=U+V;y===!0?h.push(R,R+1,J):h.push(R+1,R,J),M+=3}c.addGroup(p,M,y===!0?1:2),p+=M}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ys=class i extends it{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Qc=class i extends Dt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new lt(r,3)),this.setAttribute("normal",new lt(r.slice(),3)),this.setAttribute("uv",new lt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let v=new z,y=new z,T=new z;for(let E=0;E<t.length;E+=3)f(t[E+0],v),f(t[E+1],y),f(t[E+2],T),l(v,y,T,x)}function l(x,v,y,T){let E=T+1,g=[];for(let M=0;M<=E;M++){g[M]=[];let k=x.clone().lerp(y,M/E),I=v.clone().lerp(y,M/E),U=E-M;for(let V=0;V<=U;V++)V===0&&M===E?g[M][V]=k:g[M][V]=k.clone().lerp(I,V/U)}for(let M=0;M<E;M++)for(let k=0;k<2*(E-M)-1;k++){let I=Math.floor(k/2);k%2===0?(d(g[M][I+1]),d(g[M+1][I]),d(g[M][I])):(d(g[M][I+1]),d(g[M+1][I+1]),d(g[M+1][I]))}}function c(x){let v=new z;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(x),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function h(){let x=new z;for(let v=0;v<r.length;v+=3){x.x=r[v+0],x.y=r[v+1],x.z=r[v+2];let y=b(x)/2/Math.PI+.5,T=p(x)/Math.PI+.5;a.push(y,1-T)}m(),u()}function u(){for(let x=0;x<a.length;x+=6){let v=a[x+0],y=a[x+2],T=a[x+4],E=Math.max(v,y,T),g=Math.min(v,y,T);E>.9&&g<.1&&(v<.2&&(a[x+0]+=1),y<.2&&(a[x+2]+=1),T<.2&&(a[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,v){let y=x*3;v.x=e[y+0],v.y=e[y+1],v.z=e[y+2]}function m(){let x=new z,v=new z,y=new z,T=new z,E=new he,g=new he,M=new he;for(let k=0,I=0;k<r.length;k+=9,I+=6){x.set(r[k+0],r[k+1],r[k+2]),v.set(r[k+3],r[k+4],r[k+5]),y.set(r[k+6],r[k+7],r[k+8]),E.set(a[I+0],a[I+1]),g.set(a[I+2],a[I+3]),M.set(a[I+4],a[I+5]),T.copy(x).add(v).add(y).divideScalar(3);let U=b(T);_(E,I+0,x,U),_(g,I+2,v,U),_(M,I+4,y,U)}}function _(x,v,y,T){T<0&&x.x===1&&(a[v]=x.x-1),y.x===0&&y.z===0&&(a[v]=T/2/Math.PI+.5)}function b(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var qn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){We("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new he:new z);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new z,s=[],r=[],a=[],o=new z,l=new tt;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new z)}r[0]=new z,a[0]=new z;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(ft(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(ft(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},Zr=class extends qn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new he){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},el=class extends Zr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function cd(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Tp=new z,Ep=new z,pu=new cd,mu=new cd,gu=new cd,tl=class extends qn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new z){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Ep.subVectors(s[0],s[1]).add(s[0]),c=Ep);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Tp.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Tp),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),b=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),m<1e-4&&(m=_),b<1e-4&&(b=_),pu.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,_,b),mu.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,_,b),gu.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,_,b)}else this.curveType==="catmullrom"&&(pu.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),mu.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),gu.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(pu.calc(l),mu.calc(l),gu.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new z().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ap(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Qg(i,e){let t=1-i;return t*t*e}function eb(i,e){return 2*(1-i)*i*e}function tb(i,e){return i*i*e}function Va(i,e,t,n){return Qg(i,e)+eb(i,t)+tb(i,n)}function nb(i,e){let t=1-i;return t*t*t*e}function ib(i,e){let t=1-i;return 3*t*t*i*e}function sb(i,e){return 3*(1-i)*i*i*e}function rb(i,e){return i*i*i*e}function Wa(i,e,t,n,s){return nb(i,e)+ib(i,t)+sb(i,n)+rb(i,s)}var ho=class extends qn{constructor(e=new he,t=new he,n=new he,s=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Wa(e,s.x,r.x,a.x,o.x),Wa(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},nl=class extends qn{constructor(e=new z,t=new z,n=new z,s=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new z){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Wa(e,s.x,r.x,a.x,o.x),Wa(e,s.y,r.y,a.y,o.y),Wa(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},uo=class extends qn{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},il=class extends qn{constructor(e=new z,t=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fo=class extends qn{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Va(e,s.x,r.x,a.x),Va(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},sl=class extends qn{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Va(e,s.x,r.x,a.x),Va(e,s.y,r.y,a.y),Va(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},po=class extends qn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Ap(o,l.x,c.x,h.x,u.x),Ap(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new he().fromArray(s))}return this}},Mu=Object.freeze({__proto__:null,ArcCurve:el,CatmullRomCurve3:tl,CubicBezierCurve:ho,CubicBezierCurve3:nl,EllipseCurve:Zr,LineCurve:uo,LineCurve3:il,QuadraticBezierCurve:fo,QuadraticBezierCurve3:sl,SplineCurve:po}),rl=class extends qn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Mu[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Mu[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},mo=class extends rl{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new uo(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new fo(this.currentPoint.clone(),new he(e,t),new he(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new ho(this.currentPoint.clone(),new he(e,t),new he(n,s),new he(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new po(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Zr(e,t,n,s,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ti=class extends mo{constructor(e){super(e),this.uuid=bi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new mo().fromJSON(s))}return this}};function ab(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Em(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=ub(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,u=l;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return go(r,a,t,o,l,c,0),a}function Em(i,e,t,n,s){let r;if(s===Mb(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Rp(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Rp(a/n|0,i[a],i[a+1],r);return r&&$r(r,r.next)&&(xo(r),r=r.next),r}function Qs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&($r(t,t.next)||zt(t.prev,t,t.next)===0)){if(xo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function go(i,e,t,n,s,r,a){if(!i)return;!a&&r&&gb(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?cb(i,n,s,r):ob(i)){e.push(l.i,i.i,c.i),xo(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=lb(Qs(i),e),go(i,e,t,n,s,r,2)):a===2&&hb(i,e,t,n,s,r):go(Qs(i),e,t,n,s,r,1);break}}}function ob(i){let e=i.prev,t=i,n=i.next;if(zt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Ba(s,o,r,l,a,c,m.x,m.y)&&zt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function cb(i,e,t,n){let s=i.prev,r=i,a=i.next;if(zt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,l,c),m=Math.min(h,u,d),_=Math.max(o,l,c),b=Math.max(h,u,d),p=Su(f,m,e,t,n),x=Su(_,b,e,t,n),v=i.prevZ,y=i.nextZ;for(;v&&v.z>=p&&y&&y.z<=x;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=b&&v!==s&&v!==a&&Ba(o,h,l,u,c,d,v.x,v.y)&&zt(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=f&&y.x<=_&&y.y>=m&&y.y<=b&&y!==s&&y!==a&&Ba(o,h,l,u,c,d,y.x,y.y)&&zt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=p;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=b&&v!==s&&v!==a&&Ba(o,h,l,u,c,d,v.x,v.y)&&zt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=x;){if(y.x>=f&&y.x<=_&&y.y>=m&&y.y<=b&&y!==s&&y!==a&&Ba(o,h,l,u,c,d,y.x,y.y)&&zt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function lb(i,e){let t=i;do{let n=t.prev,s=t.next.next;!$r(n,s)&&Rm(n,t,t.next,s)&&bo(n,s)&&bo(s,n)&&(e.push(n.i,t.i,s.i),xo(t),xo(t.next),t=i=s),t=t.next}while(t!==i);return Qs(t)}function hb(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&_b(a,o)){let l=Cm(a,o);a=Qs(a,a.next),l=Qs(l,l.next),go(a,e,t,n,s,r,0),go(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function ub(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Em(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(xb(c))}s.sort(db);for(let r=0;r<s.length;r++)t=fb(s[r],t);return t}function db(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function fb(i,e){let t=pb(i,e);if(!t)return e;let n=Cm(t,i);return Qs(n,n.next),Qs(t,t.next)}function pb(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if($r(i,t))return t;do{if($r(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Am(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);bo(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&mb(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function mb(i,e){return zt(i.prev,i,e.prev)<0&&zt(e.next,i,i.next)<0}function gb(i,e,t,n){let s=i;do s.z===0&&(s.z=Su(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,bb(s)}function bb(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Su(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function xb(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Am(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Ba(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Am(i,e,t,n,s,r,a,o)}function _b(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!yb(i,e)&&(bo(i,e)&&bo(e,i)&&vb(i,e)&&(zt(i.prev,i,e.prev)||zt(i,e.prev,e))||$r(i,e)&&zt(i.prev,i,i.next)>0&&zt(e.prev,e,e.next)>0)}function zt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function $r(i,e){return i.x===e.x&&i.y===e.y}function Rm(i,e,t,n){let s=Fc(zt(i,e,t)),r=Fc(zt(i,e,n)),a=Fc(zt(t,n,i)),o=Fc(zt(t,n,e));return!!(s!==r&&a!==o||s===0&&Nc(i,t,e)||r===0&&Nc(i,n,e)||a===0&&Nc(t,i,n)||o===0&&Nc(t,e,n))}function Nc(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Fc(i){return i>0?1:i<0?-1:0}function yb(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Rm(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function bo(i,e){return zt(i.prev,i,i.next)<0?zt(i,e,i.next)>=0&&zt(i,i.prev,e)>=0:zt(i,e,i.prev)<0||zt(i,i.next,e)<0}function vb(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Cm(i,e){let t=wu(i.i,i.x,i.y),n=wu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Rp(i,e,t,n){let s=wu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function xo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function wu(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mb(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Tu=class{static triangulate(e,t,n=2){return ab(e,t,n)}},Si=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Cp(e),Pp(n,e);let a=e.length;t.forEach(Cp);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Pp(n,t[l]);let o=Tu.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Cp(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Pp(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Yi=class i extends Dt{constructor(e=new ti([new he(.5,.5),new he(-.5,.5),new he(-.5,-.5),new he(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new lt(s,3)),this.setAttribute("uv",new lt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,b=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Sb,v,y=!1,T,E,g,M;if(p){v=p.getSpacedPoints(h),y=!0,d=!1;let ae=p.isCatmullRomCurve3?p.closed:!1;T=p.computeFrenetFrames(h,ae),E=new z,g=new z,M=new z}d||(b=0,f=0,m=0,_=0);let k=o.extractPoints(c),I=k.shape,U=k.holes;if(!Si.isClockWise(I)){I=I.reverse();for(let ae=0,ge=U.length;ae<ge;ae++){let me=U[ae];Si.isClockWise(me)&&(U[ae]=me.reverse())}}function J(ae){let me=10000000000000001e-36,Ie=ae[0];for(let we=1;we<=ae.length;we++){let ot=we%ae.length,De=ae[ot],D=De.x-Ie.x,Z=De.y-Ie.y,le=D*D+Z*Z,L=Math.max(Math.abs(De.x),Math.abs(De.y),Math.abs(Ie.x),Math.abs(Ie.y)),Ke=me*L*L;if(le<=Ke){ae.splice(ot,1),we--;continue}Ie=De}}J(I),U.forEach(J);let R=U.length,P=I;for(let ae=0;ae<R;ae++){let ge=U[ae];I=I.concat(ge)}function F(ae,ge,me){return ge||et("ExtrudeGeometry: vec does not exist"),ae.clone().addScaledVector(ge,me)}let O=I.length;function W(ae,ge,me){let Ie,we,ot,De=ae.x-ge.x,D=ae.y-ge.y,Z=me.x-ae.x,le=me.y-ae.y,L=De*De+D*D,Ke=De*le-D*Z;if(Math.abs(Ke)>Number.EPSILON){let Oe=Math.sqrt(L),gt=Math.sqrt(Z*Z+le*le),be=ge.x-D/Oe,Vt=ge.y+De/Oe,$e=me.x-le/gt,nt=me.y+Z/gt,C=(($e-be)*le-(nt-Vt)*Z)/(De*le-D*Z);Ie=be+De*C-ae.x,we=Vt+D*C-ae.y;let S=Ie*Ie+we*we;if(S<=2)return new he(Ie,we);ot=Math.sqrt(S/2)}else{let Oe=!1;De>Number.EPSILON?Z>Number.EPSILON&&(Oe=!0):De<-Number.EPSILON?Z<-Number.EPSILON&&(Oe=!0):Math.sign(D)===Math.sign(le)&&(Oe=!0),Oe?(Ie=-D,we=De,ot=Math.sqrt(L)):(Ie=De,we=D,ot=Math.sqrt(L/2))}return new he(Ie/ot,we/ot)}let N=[];for(let ae=0,ge=P.length,me=ge-1,Ie=ae+1;ae<ge;ae++,me++,Ie++)me===ge&&(me=0),Ie===ge&&(Ie=0),N[ae]=W(P[ae],P[me],P[Ie]);let H=[],q,ce=N.concat();for(let ae=0,ge=R;ae<ge;ae++){let me=U[ae];q=[];for(let Ie=0,we=me.length,ot=we-1,De=Ie+1;Ie<we;Ie++,ot++,De++)ot===we&&(ot=0),De===we&&(De=0),q[Ie]=W(me[Ie],me[ot],me[De]);H.push(q),ce=ce.concat(q)}let Pe;if(b===0)Pe=Si.triangulateShape(P,U);else{let ae=[],ge=[];for(let me=0;me<b;me++){let Ie=me/b,we=f*Math.cos(Ie*Math.PI/2),ot=m*Math.sin(Ie*Math.PI/2)+_;for(let De=0,D=P.length;De<D;De++){let Z=F(P[De],N[De],ot);je(Z.x,Z.y,-we),Ie===0&&ae.push(Z)}for(let De=0,D=R;De<D;De++){let Z=U[De];q=H[De];let le=[];for(let L=0,Ke=Z.length;L<Ke;L++){let Oe=F(Z[L],q[L],ot);je(Oe.x,Oe.y,-we),Ie===0&&le.push(Oe)}Ie===0&&ge.push(le)}}Pe=Si.triangulateShape(ae,ge)}let $=Pe.length,de=m+_;for(let ae=0;ae<O;ae++){let ge=d?F(I[ae],ce[ae],de):I[ae];y?(g.copy(T.normals[0]).multiplyScalar(ge.x),E.copy(T.binormals[0]).multiplyScalar(ge.y),M.copy(v[0]).add(g).add(E),je(M.x,M.y,M.z)):je(ge.x,ge.y,0)}for(let ae=1;ae<=h;ae++)for(let ge=0;ge<O;ge++){let me=d?F(I[ge],ce[ge],de):I[ge];y?(g.copy(T.normals[ae]).multiplyScalar(me.x),E.copy(T.binormals[ae]).multiplyScalar(me.y),M.copy(v[ae]).add(g).add(E),je(M.x,M.y,M.z)):je(me.x,me.y,u/h*ae)}for(let ae=b-1;ae>=0;ae--){let ge=ae/b,me=f*Math.cos(ge*Math.PI/2),Ie=m*Math.sin(ge*Math.PI/2)+_;for(let we=0,ot=P.length;we<ot;we++){let De=F(P[we],N[we],Ie);je(De.x,De.y,u+me)}for(let we=0,ot=U.length;we<ot;we++){let De=U[we];q=H[we];for(let D=0,Z=De.length;D<Z;D++){let le=F(De[D],q[D],Ie);y?je(le.x,le.y+v[h-1].y,v[h-1].x+me):je(le.x,le.y,u+me)}}}Ae(),Xe();function Ae(){let ae=s.length/3;if(d){let ge=0,me=O*ge;for(let Ie=0;Ie<$;Ie++){let we=Pe[Ie];At(we[2]+me,we[1]+me,we[0]+me)}ge=h+b*2,me=O*ge;for(let Ie=0;Ie<$;Ie++){let we=Pe[Ie];At(we[0]+me,we[1]+me,we[2]+me)}}else{for(let ge=0;ge<$;ge++){let me=Pe[ge];At(me[2],me[1],me[0])}for(let ge=0;ge<$;ge++){let me=Pe[ge];At(me[0]+O*h,me[1]+O*h,me[2]+O*h)}}n.addGroup(ae,s.length/3-ae,0)}function Xe(){let ae=s.length/3,ge=0;Me(P,ge),ge+=P.length;for(let me=0,Ie=U.length;me<Ie;me++){let we=U[me];Me(we,ge),ge+=we.length}n.addGroup(ae,s.length/3-ae,1)}function Me(ae,ge){let me=ae.length;for(;--me>=0;){let Ie=me,we=me-1;we<0&&(we=ae.length-1);for(let ot=0,De=h+b*2;ot<De;ot++){let D=O*ot,Z=O*(ot+1),le=ge+Ie+D,L=ge+we+D,Ke=ge+we+Z,Oe=ge+Ie+Z;Ye(le,L,Ke,Oe)}}}function je(ae,ge,me){l.push(ae),l.push(ge),l.push(me)}function At(ae,ge,me){at(ae),at(ge),at(me);let Ie=s.length/3,we=x.generateTopUV(n,s,Ie-3,Ie-2,Ie-1);ht(we[0]),ht(we[1]),ht(we[2])}function Ye(ae,ge,me,Ie){at(ae),at(ge),at(Ie),at(ge),at(me),at(Ie);let we=s.length/3,ot=x.generateSideWallUV(n,s,we-6,we-3,we-2,we-1);ht(ot[0]),ht(ot[1]),ht(ot[3]),ht(ot[1]),ht(ot[2]),ht(ot[3])}function at(ae){s.push(l[ae*3+0]),s.push(l[ae*3+1]),s.push(l[ae*3+2])}function ht(ae){r.push(ae.x),r.push(ae.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return wb(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Mu[s.type]().fromJSON(s)),new i(n,e.options)}},Sb={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new he(r,a),new he(o,l),new he(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],_=e[r*3],b=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new he(a,1-l),new he(c,1-u),new he(d,1-m),new he(_,1-p)]:[new he(o,1-l),new he(h,1-u),new he(f,1-m),new he(b,1-p)]}};function wb(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Ti=class i extends Dt{constructor(e=[new he(0,-.5),new he(.5,0),new he(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=ft(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],h=1/t,u=new z,d=new he,f=new z,m=new z,_=new z,b=0,p=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:b=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-b,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:_.normalize(),l.push(_.x,_.y,_.z);break;default:b=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,f.x=p*1,f.y=-b,f.z=p*0,m.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(m)}for(let x=0;x<=t;x++){let v=n+x*h*s,y=Math.sin(v),T=Math.cos(v);for(let E=0;E<=e.length-1;E++){u.x=e[E].x*y,u.y=e[E].y,u.z=e[E].x*T,a.push(u.x,u.y,u.z),d.x=x/t,d.y=E/(e.length-1),o.push(d.x,d.y);let g=l[3*E+0]*y,M=l[3*E+1],k=l[3*E+0]*T;c.push(g,M,k)}}for(let x=0;x<t;x++)for(let v=0;v<e.length-1;v++){let y=v+x*e.length,T=y,E=y+e.length,g=y+e.length+1,M=y+1;r.push(T,E,M),r.push(g,M,E)}this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("uv",new lt(o,2)),this.setAttribute("normal",new lt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},_o=class i extends Qc{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},Tt=class i extends Dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],_=[],b=[];for(let p=0;p<h;p++){let x=p*d-a;for(let v=0;v<c;v++){let y=v*u-r;m.push(y,-x,0),_.push(0,0,1),b.push(v/o),b.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){let v=x+c*p,y=x+c*(p+1),T=x+1+c*(p+1),E=x+1+c*p;f.push(v,y,E),f.push(y,T,E)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(_,3)),this.setAttribute("uv",new lt(b,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},vs=class i extends Dt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/s,f=new z,m=new he;for(let _=0;_<=s;_++){for(let b=0;b<=n;b++){let p=r+b/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<s;_++){let b=_*(n+1);for(let p=0;p<n;p++){let x=p+b,v=x,y=x+n+1,T=x+n+2,E=x+1;o.push(v,y,E),o.push(y,T,E)}}this.setIndex(o),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Ms=class i extends Dt{constructor(e=new ti([new he(0,.5),new he(-.5,-.5),new he(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new lt(s,3)),this.setAttribute("normal",new lt(r,3)),this.setAttribute("uv",new lt(a,2));function c(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,m=d.holes;Si.isClockWise(f)===!1&&(f=f.reverse());for(let b=0,p=m.length;b<p;b++){let x=m[b];Si.isClockWise(x)===!0&&(m[b]=x.reverse())}let _=Si.triangulateShape(f,m);for(let b=0,p=m.length;b<p;b++){let x=m[b];f=f.concat(x)}for(let b=0,p=f.length;b<p;b++){let x=f[b];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let b=0,p=_.length;b<p;b++){let x=_[b],v=x[0]+u,y=x[1]+u,T=x[2]+u;n.push(v,y,T),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Tb(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Tb(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Rn=class i extends Dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new z,d=new z,f=[],m=[],_=[],b=[];for(let p=0;p<=n;p++){let x=[],v=p/n,y=a+v*o,T=e*Math.cos(y),E=Math.sqrt(e*e-T*T),g=0;p===0&&a===0?g=.5/t:p===n&&l===Math.PI&&(g=-.5/t);for(let M=0;M<=t;M++){let k=M/t,I=s+k*r;u.x=-E*Math.cos(I),u.y=T,u.z=E*Math.sin(I),m.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),b.push(k+g,1-v),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){let v=h[p][x+1],y=h[p][x],T=h[p+1][x],E=h[p+1][x+1];(p!==0||a>0)&&f.push(v,y,E),(p!==n-1||l<Math.PI)&&f.push(y,T,E)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(_,3)),this.setAttribute("uv",new lt(b,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var pi=class i extends Dt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new z,f=new z,m=new z;for(let _=0;_<=n;_++){let b=a+_/n*o;for(let p=0;p<=s;p++){let x=p/s*r;f.x=(e+t*Math.cos(b))*Math.cos(x),f.y=(e+t*Math.cos(b))*Math.sin(x),f.z=t*Math.sin(b),c.push(f.x,f.y,f.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(p/s),u.push(_/n)}}for(let _=1;_<=n;_++)for(let b=1;b<=s;b++){let p=(s+1)*_+b-1,x=(s+1)*(_-1)+b-1,v=(s+1)*(_-1)+b,y=(s+1)*_+b;l.push(p,x,y),l.push(x,v,y)}this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function hr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Ip(s))s.isRenderTargetTexture?(We("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Ip(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Mn(i){let e={};for(let t=0;t<i.length;t++){let n=hr(i[t]);for(let s in n)e[s]=n[s]}return e}function Ip(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Eb(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ld(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:bt.workingColorSpace}var Pm={clone:hr,merge:Mn},Ab=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ei=class extends An{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ab,this.fragmentShader=Rb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hr(e.uniforms),this.uniformsGroups=Eb(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new qe().setHex(s.value);break;case"v2":this.uniforms[n].value=new he().fromArray(s.value);break;case"v3":this.uniforms[n].value=new z().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Pt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new rt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new tt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},al=class extends Ei{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Fe=class extends An{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oh,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Cn=class extends Fe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new he(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ft(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new qe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return qs('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){qs('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ol=class extends An{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=dm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},cl=class extends An{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function gs(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function za(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function Cb(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Lp(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function Pb(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var Ai=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break t}a=t.length;break n}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ll=class extends Ai{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Vs,endingEnd:Vs}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ws:r=e,o=2*t-n;break;case qa:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ws:a=e,l=2*n-t;break;case qa:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),_=m*m,b=_*m,p=-d*b+2*d*_-d*m,x=(1+d)*b+(-1.5-2*d)*_+(-.5+d)*m+1,v=(-1-f)*b+(1.5+f)*_+.5*m,y=f*b-f*_;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+x*a[c+T]+v*a[l+T]+y*a[u+T];return r}},yo=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},hl=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ul=class extends Ai{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(n-t)/(s-t),_=1-m;for(let b=0;b!==o;++b)r[b]=a[c+b]*_+a[l+b]*m;return r}let d=o*2,f=e-1;for(let m=0;m!==o;++m){let _=a[c+m],b=a[l+m],p=f*d+m*2,x=u[p],v=u[p+1],y=e*d+m*2,T=h[y],E=h[y+1],g=Lb(n,t,x,T,s);r[m]=Im(g,_,v,E,b)}return r}};function Im(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Ib(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Lb(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Im(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Ib(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Dn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=gs(t,this.TimeBufferType),this.values=gs(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:gs(e.times,Array),values:gs(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),za(e.settings)&&(n.settings={inTangents:gs(e.settings.inTangents,Array),outTangents:gs(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new hl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new yo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ll(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ul(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Xs:t=this.InterpolantFactoryMethodDiscrete;break;case js:t=this.InterpolantFactoryMethodLinear;break;case Oc:t=this.InterpolantFactoryMethodSmooth;break;case yu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return We("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Xs;case this.InterpolantFactoryMethodLinear:return js;case this.InterpolantFactoryMethodSmooth:return Oc;case this.InterpolantFactoryMethodBezier:return yu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;za(this.settings)&&(Dp(this.settings.inTangents,e),Dp(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;za(this.settings)&&(Np(this.settings.inTangents,e),Np(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(et("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(et("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){et("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){et("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&gg(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){et("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Oc,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let _=t[u+m];if(_!==t[d+m]||_!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,za(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Dp(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function Np(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Dn.prototype.ValueTypeName="";Dn.prototype.TimeBufferType=Float32Array;Dn.prototype.ValueBufferType=Float32Array;Dn.prototype.DefaultInterpolation=js;var Zi=class extends Dn{constructor(e,t,n){super(e,t,n)}};Zi.prototype.ValueTypeName="bool";Zi.prototype.ValueBufferType=Array;Zi.prototype.DefaultInterpolation=Xs;Zi.prototype.InterpolantFactoryMethodLinear=void 0;Zi.prototype.InterpolantFactoryMethodSmooth=void 0;var vo=class extends Dn{constructor(e,t,n,s){super(e,t,n,s)}};vo.prototype.ValueTypeName="color";var $i=class extends Dn{constructor(e,t,n,s){super(e,t,n,s)}};$i.prototype.ValueTypeName="number";var dl=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)jt.slerpFlat(r,0,a,c-o,a,c,l);return r}},Qi=class extends Dn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new dl(this.times,this.values,this.getValueSize(),e)}};Qi.prototype.ValueTypeName="quaternion";Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var es=class extends Dn{constructor(e,t,n){super(e,t,n)}};es.prototype.ValueTypeName="string";es.prototype.ValueBufferType=Array;es.prototype.DefaultInterpolation=Xs;es.prototype.InterpolantFactoryMethodLinear=void 0;es.prototype.InterpolantFactoryMethodSmooth=void 0;var Ss=class extends Dn{constructor(e,t,n,s){super(e,t,n,s)}};Ss.prototype.ValueTypeName="vector";var er=class{constructor(e="",t=-1,n=[],s=ah){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=bi(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Nb(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Dn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=Cb(l);l=Lp(l,1,h),c=Lp(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new $i(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let u=h[1],d=s[u];d||(s[u]=d=[]),d.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Db(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return $i;case"vector":case"vector2":case"vector3":case"vector4":return Ss;case"color":return vo;case"quaternion":return Qi;case"bool":case"boolean":return Zi;case"string":return es}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Nb(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Db(i.type);if(i.times===void 0){let n=[],s=[];Pb(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),za(i.settings)&&(t.settings={inTangents:gs(i.settings.inTangents,Float32Array),outTangents:gs(i.settings.outTangents,Float32Array)}),t}var wi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Fp(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Fp(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Fp(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var fl=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Lm=new fl,Ri=class{constructor(e){this.manager=e!==void 0?e:Lm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Ri.DEFAULT_MATERIAL_NAME="__DEFAULT";var Vi={},Eu=class extends Error{constructor(e,t){super(e),this.response=t}},Qr=class extends Ri{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=wi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Vi[e]!==void 0){Vi[e].push({onLoad:t,onProgress:n,onError:s});return}Vi[e]=[],Vi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&We("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Vi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,_=0,b=new ReadableStream({start(p){x();function x(){u.read().then(({done:v,value:y})=>{if(v)p.close();else{_+=y.byteLength;let T=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let E=0,g=h.length;E<g;E++){let M=h[E];M.onProgress&&M.onProgress(T)}p.enqueue(y),x()}},v=>{p.error(v)})}}});return new Response(b)}else throw new Eu(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{wi.add(`file:${e}`,c);let h=Vi[e];delete Vi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=Vi[e];if(h===void 0)throw this.manager.itemError(e),c;delete Vi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ur=new WeakMap,pl=class extends Ri{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=wi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=Ur.get(a);u===void 0&&(u=[],Ur.set(a,u)),u.push({onLoad:t,onError:s})}return a}let o=Vr("img");function l(){h(),t&&t(this);let u=Ur.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Ur.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),wi.remove(`image:${e}`);let d=Ur.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(u)}Ur.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),wi.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}};var tr=class extends Ri{constructor(e){super(e)}load(e,t,n,s){let r=new Jt,a=new pl(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},nr=class extends Ut{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Mo=class extends nr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},bu=new tt,Up=new z,kp=new z,ea=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.mapType=Nn,this.map=null,this.mapPass=null,this.matrix=new tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xs,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new Pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Up.setFromMatrixPosition(e.matrixWorld),t.position.copy(Up),kp.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kp),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){bu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(bu,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Hr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(bu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Uc=new z,kc=new jt,Mi=new z,So=class extends Ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tt,this.projectionMatrix=new tt,this.projectionMatrixInverse=new tt,this.coordinateSystem=$n,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Uc,kc,Mi),Mi.x===1&&Mi.y===1&&Mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Uc,kc,Mi.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Uc,kc,Mi),Mi.x===1&&Mi.y===1&&Mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Uc,kc,Mi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ms=new z,Op=new he,Bp=new he,Qt=class extends So{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ks*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ga*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ks*2*Math.atan(Math.tan(Ga*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ms.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ms.x,ms.y).multiplyScalar(-e/ms.z),ms.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ms.x,ms.y).multiplyScalar(-e/ms.z)}getViewSize(e,t){return this.getViewBounds(e,Op,Bp),t.subVectors(Bp,Op)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ga*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Au=class extends ea{constructor(){super(new Qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ks*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},wo=class extends nr{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.target=new Ut,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Au}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ru=class extends ea{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0}},ts=class extends nr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ru}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ir=class extends So{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Cu=class extends ea{constructor(){super(new ir(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},sr=class extends nr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.target=new Ut,this.shadow=new Cu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var ns=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var xu=new WeakMap,To=class extends Ri{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&We("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&We("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=wi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{xu.has(a)===!0?(s&&s(xu.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return wi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),xu.set(l,c),wi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});wi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var kr=-90,Or=1,ta=class extends Ut{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(kr,Or,e,t);s.layers=this.layers,this.add(s);let r=new Qt(kr,Or,e,t);r.layers=this.layers,this.add(r);let a=new Qt(kr,Or,e,t);a.layers=this.layers,this.add(a);let o=new Qt(kr,Or,e,t);o.layers=this.layers,this.add(o);let l=new Qt(kr,Or,e,t);l.layers=this.layers,this.add(l);let c=new Qt(kr,Or,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===$n)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let b=!1;e.isWebGLRenderer===!0?b=e.state.buffers.depth.getReversed():b=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=_,e.setRenderTarget(n,5,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},ml=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}};var gl=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,s=this.valueSize,r=e*s+s,a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=t}else{a+=t;let o=t/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let l=t*this._origIndex;this._mixBufferRegion(n,s,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,s);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,s=n*this._origIndex;e.getValue(t,s);for(let r=n,a=s;r!==a;++r)t[r]=t[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,s){jt.slerpFlat(e,t,e,t,e,n,s)}_slerpAdditive(e,t,n,s,r){let a=this._workIndex*r;jt.multiplyQuaternionsFlat(e,a,e,t,e,n),jt.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,n,s,r){let a=1-s;for(let o=0;o!==r;++o){let l=t+o;e[l]=e[l]*a+e[n+o]*s}}_lerpAdditive(e,t,n,s,r){for(let a=0;a!==r;++a){let o=t+a;e[o]=e[o]+e[n+a]*s}}},hd="\\[\\]\\.:\\/",Fb=new RegExp("["+hd+"]","g"),ud="[^"+hd+"]",Ub="[^"+hd.replace("\\.","")+"]",kb=/((?:WC+[\/:])*)/.source.replace("WC",ud),Ob=/(WCOD+)?/.source.replace("WCOD",Ub),Bb=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ud),zb=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ud),Gb=new RegExp("^"+kb+Ob+Bb+zb+"$"),Hb=["material","materials","bones","map"],Pu=class{constructor(e,t,n){let s=n||It.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},It=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Fb,"")}static parseTrackName(e){let t=Gb.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Hb.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){We("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){et("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){et("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){et("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){et("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){et("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){et("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){et("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;et("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){et("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){et("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};It.Composite=Pu;It.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};It.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};It.prototype.GetterByBindingType=[It.prototype._getValue_direct,It.prototype._getValue_array,It.prototype._getValue_arrayElement,It.prototype._getValue_toArray];It.prototype.SetterByBindingTypeAndVersioning=[[It.prototype._setValue_direct,It.prototype._setValue_direct_setNeedsUpdate,It.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[It.prototype._setValue_array,It.prototype._setValue_array_setNeedsUpdate,It.prototype._setValue_array_setMatrixWorldNeedsUpdate],[It.prototype._setValue_arrayElement,It.prototype._setValue_arrayElement_setNeedsUpdate,It.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[It.prototype._setValue_fromArray,It.prototype._setValue_fromArray_setNeedsUpdate,It.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var bl=class{constructor(e,t,n=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=s;let r=t.tracks,a=r.length,o=new Array(a),l={endingStart:Vs,endingEnd:Vs};for(let c=0;c!==a;++c){let h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=rh,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let s=this._mixer,r=s.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);let l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,s){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let a=this._updateTime(t),o=this._updateWeight(e);if(o>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case um:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case ah:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,s=this.time+e,r=this._loopCount,a=n===hm;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(n===No){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){let o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);let l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,n){let s=this._interpolantSettings;n?(s.endingStart=Ws,s.endingEnd=Ws):(e?s.endingStart=this.zeroSlopeAtStart?Ws:Vs:s.endingStart=qa,t?s.endingEnd=this.zeroSlopeAtEnd?Ws:Vs:s.endingEnd=qa)}_scheduleFading(e,t,n){let s=this._mixer,r=s.time,a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}},Vb=new Float32Array(1),na=class extends fi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){let d=s[u],f=d.name,m=h[f];if(m!==void 0)++m.referenceCount,a[u]=m;else{if(m=a[u],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,f));continue}let _=t&&t._propertyBindings[u].binding.parsedPath;m=new gl(It.create(n,f,_),d.ValueTypeName,d.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,f),a[u]=m}o[u].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,n)}let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let s=this._actions,r=this._actionsByClip,a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{let o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],s=e._cacheIndex;n._cacheIndex=s,t[s]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;let u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let s=this._bindingsByRootAndName,r=this._bindings,a=s[t];a===void 0&&(a={},s[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new yo(new Float32Array(2),new Float32Array(2),1,Vb),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let s=t||this._root,r=s.uuid,a=typeof e=="string"?er.findByName(s,e):e,o=a!==null?a.uuid:e,l=this._actionsByClip[o],c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=ah),l!==void 0){let u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;let h=new bl(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){let n=t||this._root,s=n.uuid,r=typeof e=="string"?er.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(s,e,r,a);let o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){let a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){let c=a[o];this._deactivateAction(c);let h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete s[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let a in n){let o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(let a in r){let o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var bd=class bd{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};bd.prototype.isMatrix2=!0;var Iu=bd;function dd(i,e,t,n){let s=Wb(n);switch(t){case Ju:return i*e;case Tl:return i*e/s.components*s.byteLength;case El:return i*e/s.components*s.byteLength;case ws:return i*e*2/s.components*s.byteLength;case Al:return i*e*2/s.components*s.byteLength;case Yu:return i*e*3/s.components*s.byteLength;case ii:return i*e*4/s.components*s.byteLength;case Rl:return i*e*4/s.components*s.byteLength;case Ro:case Co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Po:case Io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Pl:case Ll:return Math.max(i,16)*Math.max(e,8)/4;case Cl:case Il:return Math.max(i,8)*Math.max(e,8)/2;case Dl:case Nl:case Ul:case kl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Fl:case Lo:case Ol:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Gl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Hl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Wl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ql:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Xl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case jl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Kl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Jl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Yl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Zl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case $l:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ql:case eh:case th:return Math.ceil(i/4)*Math.ceil(e/4)*16;case nh:case ih:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Do:case sh:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Wb(i){switch(i){case Nn:case qu:return{byteLength:1,components:1};case ca:case Xu:case gi:return{byteLength:2,components:1};case Sl:case wl:return{byteLength:2,components:4};case mi:case Ml:case Xn:return{byteLength:4,components:1};case ju:case Ku:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?We("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function e0(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Xb(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let _=u[f];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var jb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Kb=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Jb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yb=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zb=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$b=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qb=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ex=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,nx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ix=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ax=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ox=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ux=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,px=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,mx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,gx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,bx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,xx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_x=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Mx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Tx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Ex=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ax=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Px=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ix=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Dx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Nx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ux=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Ox=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Bx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,jx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kx=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Jx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$x=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,e_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,t_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,n_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,i_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,s_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,r_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,a_=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,o_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c_=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,l_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,u_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,d_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,m_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,g_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,b_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,x_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,__=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,y_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,v_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,M_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,S_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,w_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,T_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,E_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,A_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,R_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,C_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,P_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,I_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,L_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,D_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,N_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,F_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,U_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,k_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,O_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,B_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,z_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,G_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,H_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,V_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,W_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,q_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,X_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,j_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J_=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Z_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Q_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ey=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ty=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ny=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,iy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ry=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ay=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,oy=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ly=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hy=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,uy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,py=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,my=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,by=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_y=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,vy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,My=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ty=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,mt={alphahash_fragment:jb,alphahash_pars_fragment:Kb,alphamap_fragment:Jb,alphamap_pars_fragment:Yb,alphatest_fragment:Zb,alphatest_pars_fragment:$b,aomap_fragment:Qb,aomap_pars_fragment:ex,batching_pars_vertex:tx,batching_vertex:nx,begin_vertex:ix,beginnormal_vertex:sx,bsdfs:rx,iridescence_fragment:ax,bumpmap_pars_fragment:ox,clipping_planes_fragment:cx,clipping_planes_pars_fragment:lx,clipping_planes_pars_vertex:hx,clipping_planes_vertex:ux,color_fragment:dx,color_pars_fragment:fx,color_pars_vertex:px,color_vertex:mx,common:gx,defaultnormal_vertex:bx,displacementmap_pars_vertex:xx,displacementmap_vertex:_x,emissivemap_fragment:yx,emissivemap_pars_fragment:vx,colorspace_fragment:Mx,colorspace_pars_fragment:Sx,envmap_fragment:wx,envmap_common_pars_fragment:Tx,envmap_pars_fragment:Ex,envmap_pars_vertex:Ax,envmap_physical_pars_fragment:Ox,envmap_vertex:Rx,fog_vertex:Cx,fog_pars_vertex:Px,fog_fragment:Ix,fog_pars_fragment:Lx,gradientmap_pars_fragment:Dx,lightmap_pars_fragment:Nx,lights_lambert_fragment:Fx,lights_lambert_pars_fragment:Ux,lights_pars_begin:kx,lights_toon_fragment:Bx,lights_toon_pars_fragment:zx,lights_phong_fragment:Gx,lights_phong_pars_fragment:Hx,lights_physical_fragment:Vx,lights_physical_pars_fragment:Wx,lights_fragment_begin:qx,lights_fragment_maps:Xx,lights_fragment_end:jx,lightprobes_pars_fragment:Kx,logdepthbuf_fragment:Jx,logdepthbuf_pars_fragment:Yx,logdepthbuf_pars_vertex:Zx,logdepthbuf_vertex:$x,map_fragment:Qx,map_pars_fragment:e_,map_particle_fragment:t_,map_particle_pars_fragment:n_,metalnessmap_fragment:i_,metalnessmap_pars_fragment:s_,morphinstance_vertex:r_,morphcolor_vertex:a_,morphnormal_vertex:o_,morphtarget_pars_vertex:c_,morphtarget_vertex:l_,normal_fragment_begin:h_,normal_fragment_maps:u_,normal_pars_fragment:d_,normal_pars_vertex:f_,normal_vertex:p_,normalmap_pars_fragment:m_,clearcoat_normal_fragment_begin:g_,clearcoat_normal_fragment_maps:b_,clearcoat_pars_fragment:x_,iridescence_pars_fragment:__,opaque_fragment:y_,packing:v_,premultiplied_alpha_fragment:M_,project_vertex:S_,dithering_fragment:w_,dithering_pars_fragment:T_,roughnessmap_fragment:E_,roughnessmap_pars_fragment:A_,shadowmap_pars_fragment:R_,shadowmap_pars_vertex:C_,shadowmap_vertex:P_,shadowmask_pars_fragment:I_,skinbase_vertex:L_,skinning_pars_vertex:D_,skinning_vertex:N_,skinnormal_vertex:F_,specularmap_fragment:U_,specularmap_pars_fragment:k_,tonemapping_fragment:O_,tonemapping_pars_fragment:B_,transmission_fragment:z_,transmission_pars_fragment:G_,uv_pars_fragment:H_,uv_pars_vertex:V_,uv_vertex:W_,worldpos_vertex:q_,background_vert:X_,background_frag:j_,backgroundCube_vert:K_,backgroundCube_frag:J_,cube_vert:Y_,cube_frag:Z_,depth_vert:$_,depth_frag:Q_,distance_vert:ey,distance_frag:ty,equirect_vert:ny,equirect_frag:iy,linedashed_vert:sy,linedashed_frag:ry,meshbasic_vert:ay,meshbasic_frag:oy,meshlambert_vert:cy,meshlambert_frag:ly,meshmatcap_vert:hy,meshmatcap_frag:uy,meshnormal_vert:dy,meshnormal_frag:fy,meshphong_vert:py,meshphong_frag:my,meshphysical_vert:gy,meshphysical_frag:by,meshtoon_vert:xy,meshtoon_frag:_y,points_vert:yy,points_frag:vy,shadow_vert:My,shadow_frag:Sy,sprite_vert:wy,sprite_frag:Ty},Ce={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new rt},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new rt}},envmap:{envMap:{value:null},envMapRotation:{value:new rt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new rt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new rt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new rt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new rt},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new rt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new rt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new rt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new rt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0},uvTransform:{value:new rt}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new rt},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0}}},Li={basic:{uniforms:Mn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:mt.meshbasic_vert,fragmentShader:mt.meshbasic_frag},lambert:{uniforms:Mn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:mt.meshlambert_vert,fragmentShader:mt.meshlambert_frag},phong:{uniforms:Mn([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:mt.meshphong_vert,fragmentShader:mt.meshphong_frag},standard:{uniforms:Mn([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag},toon:{uniforms:Mn([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new qe(0)}}]),vertexShader:mt.meshtoon_vert,fragmentShader:mt.meshtoon_frag},matcap:{uniforms:Mn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:mt.meshmatcap_vert,fragmentShader:mt.meshmatcap_frag},points:{uniforms:Mn([Ce.points,Ce.fog]),vertexShader:mt.points_vert,fragmentShader:mt.points_frag},dashed:{uniforms:Mn([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:mt.linedashed_vert,fragmentShader:mt.linedashed_frag},depth:{uniforms:Mn([Ce.common,Ce.displacementmap]),vertexShader:mt.depth_vert,fragmentShader:mt.depth_frag},normal:{uniforms:Mn([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:mt.meshnormal_vert,fragmentShader:mt.meshnormal_frag},sprite:{uniforms:Mn([Ce.sprite,Ce.fog]),vertexShader:mt.sprite_vert,fragmentShader:mt.sprite_frag},background:{uniforms:{uvTransform:{value:new rt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:mt.background_vert,fragmentShader:mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new rt}},vertexShader:mt.backgroundCube_vert,fragmentShader:mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:mt.cube_vert,fragmentShader:mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:mt.equirect_vert,fragmentShader:mt.equirect_frag},distance:{uniforms:Mn([Ce.common,Ce.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:mt.distance_vert,fragmentShader:mt.distance_frag},shadow:{uniforms:Mn([Ce.lights,Ce.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:mt.shadow_vert,fragmentShader:mt.shadow_frag}};Li.physical={uniforms:Mn([Li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new rt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new rt},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new rt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new rt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new rt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new rt},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new rt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new rt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new rt},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new rt},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new rt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new rt},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new rt}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag};var hh={r:0,b:0,g:0},Ey=new tt,t0=new rt;t0.set(-1,0,0,0,1,0,0,0,1);function Ay(i,e,t,n,s,r){let a=new qe(0),o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(x){let v=x.isScene===!0?x.background:null;if(v&&v.isTexture){let y=x.backgroundBlurriness>0;v=e.get(v,y)}return v}function m(x){let v=!1,y=f(x);y===null?b(a,o):y&&y.isColor&&(b(y,1),v=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||v)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(x,v){let y=f(v);y&&y.isCubeTexture?(c===void 0&&(c=new _t(new pt(1,1,1),new Ei({name:"BackgroundCubeMaterial",uniforms:hr(Li.backgroundCube.uniforms),vertexShader:Li.backgroundCube.vertexShader,fragmentShader:Li.backgroundCube.fragmentShader,side:un,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(T,E,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Ey.makeRotationFromEuler(v.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(t0),c.material.toneMapped=bt.getTransfer(y.colorSpace)!==Rt,(h!==y||u!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new _t(new Tt(2,2),new Ei({name:"BackgroundMaterial",uniforms:hr(Li.background.uniforms),vertexShader:Li.background.vertexShader,fragmentShader:Li.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=bt.getTransfer(y.colorSpace)!==Rt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function b(x,v){x.getRGB(hh,ld(i)),t.buffers.color.setClear(hh.r,hh.g,hh.b,v,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),o=v,b(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,b(a,o)},render:m,addToRenderList:_,dispose:p}}function Ry(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(U,V,J,R,P){let F=!1,O=u(U,R,J,V);r!==O&&(r=O,c(r.object)),F=f(U,R,J,P),F&&m(U,R,J,P),P!==null&&e.update(P,i.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,y(U,V,J,R),P!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(P).buffer))}function l(){return i.createVertexArray()}function c(U){return i.bindVertexArray(U)}function h(U){return i.deleteVertexArray(U)}function u(U,V,J,R){let P=R.wireframe===!0,F=n[V.id];F===void 0&&(F={},n[V.id]=F);let O=U.isInstancedMesh===!0?U.id:0,W=F[O];W===void 0&&(W={},F[O]=W);let N=W[J.id];N===void 0&&(N={},W[J.id]=N);let H=N[P];return H===void 0&&(H=d(l()),N[P]=H),H}function d(U){let V=[],J=[],R=[];for(let P=0;P<t;P++)V[P]=0,J[P]=0,R[P]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:J,attributeDivisors:R,object:U,attributes:{},index:null}}function f(U,V,J,R){let P=r.attributes,F=V.attributes,O=0,W=J.getAttributes();for(let N in W)if(W[N].location>=0){let q=P[N],ce=F[N];if(ce===void 0&&(N==="instanceMatrix"&&U.instanceMatrix&&(ce=U.instanceMatrix),N==="instanceColor"&&U.instanceColor&&(ce=U.instanceColor)),q===void 0||q.attribute!==ce||ce&&q.data!==ce.data)return!0;O++}return r.attributesNum!==O||r.index!==R}function m(U,V,J,R){let P={},F=V.attributes,O=0,W=J.getAttributes();for(let N in W)if(W[N].location>=0){let q=F[N];q===void 0&&(N==="instanceMatrix"&&U.instanceMatrix&&(q=U.instanceMatrix),N==="instanceColor"&&U.instanceColor&&(q=U.instanceColor));let ce={};ce.attribute=q,q&&q.data&&(ce.data=q.data),P[N]=ce,O++}r.attributes=P,r.attributesNum=O,r.index=R}function _(){let U=r.newAttributes;for(let V=0,J=U.length;V<J;V++)U[V]=0}function b(U){p(U,0)}function p(U,V){let J=r.newAttributes,R=r.enabledAttributes,P=r.attributeDivisors;J[U]=1,R[U]===0&&(i.enableVertexAttribArray(U),R[U]=1),P[U]!==V&&(i.vertexAttribDivisor(U,V),P[U]=V)}function x(){let U=r.newAttributes,V=r.enabledAttributes;for(let J=0,R=V.length;J<R;J++)V[J]!==U[J]&&(i.disableVertexAttribArray(J),V[J]=0)}function v(U,V,J,R,P,F,O){O===!0?i.vertexAttribIPointer(U,V,J,P,F):i.vertexAttribPointer(U,V,J,R,P,F)}function y(U,V,J,R){_();let P=R.attributes,F=J.getAttributes(),O=V.defaultAttributeValues;for(let W in F){let N=F[W];if(N.location>=0){let H=P[W];if(H===void 0&&(W==="instanceMatrix"&&U.instanceMatrix&&(H=U.instanceMatrix),W==="instanceColor"&&U.instanceColor&&(H=U.instanceColor)),H!==void 0){let q=H.normalized,ce=H.itemSize,Pe=e.get(H);if(Pe===void 0)continue;let $=Pe.buffer,de=Pe.type,Ae=Pe.bytesPerElement,Xe=de===i.INT||de===i.UNSIGNED_INT||H.gpuType===Ml;if(H.isInterleavedBufferAttribute){let Me=H.data,je=Me.isInterleavedBuffer===!0?Me.stride:Me.itemSize,At=H.offset;if(Me.isInstancedInterleavedBuffer||Me.isInstancedBufferAttribute){for(let Ye=0;Ye<N.locationSize;Ye++)p(N.location+Ye,Me.meshPerAttribute);U.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=Me.meshPerAttribute*Me.count)}else for(let Ye=0;Ye<N.locationSize;Ye++)b(N.location+Ye);i.bindBuffer(i.ARRAY_BUFFER,$);for(let Ye=0;Ye<N.locationSize;Ye++)v(N.location+Ye,ce/N.locationSize,de,q,je*Ae,(At+ce/N.locationSize*Ye)*Ae,Xe)}else{if(H.isInstancedBufferAttribute){for(let Me=0;Me<N.locationSize;Me++)p(N.location+Me,H.meshPerAttribute);U.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let Me=0;Me<N.locationSize;Me++)b(N.location+Me);i.bindBuffer(i.ARRAY_BUFFER,$);for(let Me=0;Me<N.locationSize;Me++)v(N.location+Me,ce/N.locationSize,de,q,ce*Ae,ce/N.locationSize*Me*Ae,Xe)}}else if(O!==void 0){let q=O[W];if(q!==void 0)switch(q.length){case 2:i.vertexAttrib2fv(N.location,q);break;case 3:i.vertexAttrib3fv(N.location,q);break;case 4:i.vertexAttrib4fv(N.location,q);break;default:i.vertexAttrib1fv(N.location,q)}}}}x()}function T(){k();for(let U in n){let V=n[U];for(let J in V){let R=V[J];for(let P in R){let F=R[P];for(let O in F)h(F[O].object),delete F[O];delete R[P]}}delete n[U]}}function E(U){if(n[U.id]===void 0)return;let V=n[U.id];for(let J in V){let R=V[J];for(let P in R){let F=R[P];for(let O in F)h(F[O].object),delete F[O];delete R[P]}}delete n[U.id]}function g(U){for(let V in n){let J=n[V];for(let R in J){let P=J[R];if(P[U.id]===void 0)continue;let F=P[U.id];for(let O in F)h(F[O].object),delete F[O];delete P[U.id]}}}function M(U){for(let V in n){let J=n[V],R=U.isInstancedMesh===!0?U.id:0,P=J[R];if(P!==void 0){for(let F in P){let O=P[F];for(let W in O)h(O[W].object),delete O[W];delete P[F]}delete J[R],Object.keys(J).length===0&&delete n[V]}}}function k(){I(),a=!0,r!==s&&(r=s,c(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:k,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfObject:M,releaseStatesOfProgram:g,initAttributes:_,enableAttribute:b,disableUnusedAttributes:x}}function Cy(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Py(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let g=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(g){return!(g!==ii&&n.convert(g)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){let M=g===gi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(g!==Nn&&g!==Xn&&!M&&n.convert(g)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(We("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&We("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&We("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),b=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:b,maxAttributes:p,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:y,maxSamples:T,samples:E}}function Iy(i){let e=this,t=null,n=0,s=!1,r=!1,a=new di,o=new rt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,_=u.clipIntersection,b=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!b)r?h(null):c();else{let x=r?0:n,v=x*4,y=p.clippingState||null;l.value=y,y=h(m,d,v,f);for(let T=0;T!==v;++T)y[T]=t[T];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let _=u!==null?u.length:0,b=null;if(_!==0){if(b=l.value,m!==!0||b===null){let p=f+_*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(b===null||b.length<p)&&(b=new Float32Array(p));for(let v=0,y=f;v!==_;++v,y+=4)a.copy(u[v]).applyMatrix4(x,o),a.normal.toArray(b,y),b[y+3]=a.constant}l.value=b,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,b}}var Oo=class extends Wn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ao(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new pt(5,5,5),r=new Ei({name:"CubemapFromEquirect",uniforms:hr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:un,blending:rr});r.uniforms.tEquirect.value=t;let a=new _t(s,r),o=t.minFilter;return t.minFilter===ni&&(t.minFilter=en),new ta(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},Dm=256,Ly=3,Dy=20,n0=256,i0=16,Ny=3,Fy=new z,Uy=new qe,dh=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ta(1,10,null),this._boxMesh=new _t(new pt(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Fy}=r,l=this._renderer;this._setSize(a);let c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,m=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(Uy));let b=new ta(n,s,h);return b.position.copy(o),b.update(l,e),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=m,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Um(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Dm,rd(e))}_fromTexture(e,t){e.mapping===or||e.mapping===aa?this._setSize(e.image.length===0?Dm:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Nm(e,!1,!1),n=Math.log2(e)-Ly;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Nm(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===or||e.mapping===aa?(this._cubemapMaterial===null&&(this._cubemapMaterial=Um()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Fm()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=ky(),this._integrationMaterial=Oy());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/i0);for(let a=0;a<=n;a++){let o=i.lodToRoughness(a,n);if(a>n-Ny)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{let l=o>0?Math.log2(t)+.5*Math.log2(6/(n0*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=By());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function Nm(i,e,t){return new Oo(i,{minFilter:ni,generateMipmaps:e,type:gi,colorSpace:Tn,depthBuffer:t})}function Bo(i,e,t){return new Ei({name:i,uniforms:e,vertexShader:mt.cube_vert,fragmentShader:t,side:un,blending:rr,depthTest:!1,depthWrite:!1})}function ky(){return Bo("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${n0}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Oy(){return Bo("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:i0}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function By(){return Bo("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Dy}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Fm(){return Bo("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Um(){return Bo("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function zy(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===_l||f===yl)if(e.has(d)){let m=e.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let _=new Oo(m.height);return _.fromEquirectangularTexture(i,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,m=f===_l||f===yl,_=f===or||f===aa;if(m||_){let b=t.get(d),p=b!==void 0?b.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new dh(i)),b=m?n.fromEquirectangular(d,b):n.fromCubemap(d,b),b.texture.pmremVersion=d.pmremVersion,t.set(d,b),b.texture;if(b!==void 0)return b.texture;{let x=d.image;return m&&x&&x.height>0||_&&x&&l(x)?(n===null&&(n=new dh(i)),b=m?n.fromEquirectangular(d):n.fromCubemap(d),b.texture.pmremVersion=d.pmremVersion,t.set(d,b),d.addEventListener("dispose",h),b.texture):null}}}return d}function o(d,f){return f===_l?d.mapping=or:f===yl&&(d.mapping=aa),d}function l(d){let f=0,m=6;for(let _=0;_<m;_++)d[_]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function Gy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&qs("WebGLRenderer: "+n+" extension not supported."),s}}}function Hy(i,e,t,n){let s={},r=new WeakMap,a=new FinalizationRegistry(m=>delete s[m]);function o(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(let b in m.attributes)e.remove(m.attributes[b]);m.removeEventListener("dispose",o),delete s[m.id],a.unregister(m);let _=r.get(m);_&&(e.remove(_),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,_){return s[_.id]!==void 0||(_.addEventListener("dispose",o),s[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function h(m){let _=m.attributes;for(let b in _)e.update(_[b],i.ARRAY_BUFFER)}function u(m){let _=m.index,b=m.attributes.position,p=0;if(b===void 0)return;let x=_!==null?_.array.length:b.array.length/3-1,v=b.count>=65535?Qa:$a,y=new v(Math.ceil(x/3)*6,1),T=y.array;if(_!==null){let g=_.array;p=_.version;for(let M=0,k=0;M<x;M+=3){let I=g[M+0],U=g[M+1],V=g[M+2];T[k++]=I,T[k++]=U,T[k++]=U,T[k++]=V,T[k++]=V,T[k++]=I}}else{p=b.version;for(let g=0,M=0;g<x;g+=3){let k=g+0,I=g+1,U=g+2;T[M++]=k,T[M++]=I,T[M++]=I,T[M++]=U,T[M++]=U,T[M++]=k}}y.version=p;let E=r.get(m);E&&e.remove(E),r.set(m,y)}function d(m){let _=r.get(m);if(_){let b=m.index;b!==null&&_.version<b.version&&u(m)}else u(m);return r.get(m)}function f(){for(let m in s){let _=s[m].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function Vy(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let _=0;for(let b=0;b<f;b++)_+=d[b];t.update(_,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Wy(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:et("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function qy(i,e,t){let n=new WeakMap,s=new Pt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let k=function(){g.dispose(),n.delete(o),o.removeEventListener("dispose",k)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,b=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],v=0;f===!0&&(v=1),m===!0&&(v=2),_===!0&&(v=3);let y=o.attributes.position.count*v,T=1;y>e.maxTextureSize&&(T=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let E=new Float32Array(y*T*4*u),g=new Ka(E,y,T,u);g.type=Xn,g.needsUpdate=!0;let M=v*4;for(let I=0;I<u;I++){let U=b[I],V=p[I],J=x[I],R=y*T*4*I;for(let P=0;P<U.count;P++){let F=P*M;f===!0&&(s.fromBufferAttribute(U,P),E[R+F+0]=s.x,E[R+F+1]=s.y,E[R+F+2]=s.z,E[R+F+3]=0),m===!0&&(s.fromBufferAttribute(V,P),E[R+F+4]=s.x,E[R+F+5]=s.y,E[R+F+6]=s.z,E[R+F+7]=0),_===!0&&(s.fromBufferAttribute(J,P),E[R+F+8]=s.x,E[R+F+9]=s.y,E[R+F+10]=s.z,E[R+F+11]=J.itemSize===4?s.w:1)}}d={count:u,texture:g,size:new he(y,T)},n.set(o,d),o.addEventListener("dispose",k)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Xy(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var jy={[Ou]:"LINEAR_TONE_MAPPING",[Bu]:"REINHARD_TONE_MAPPING",[zu]:"CINEON_TONE_MAPPING",[Ao]:"ACES_FILMIC_TONE_MAPPING",[Hu]:"AGX_TONE_MAPPING",[Vu]:"NEUTRAL_TONE_MAPPING",[Gu]:"CUSTOM_TONE_MAPPING"};function Ky(i,e,t,n,s,r){let a=new Wn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=null,h=new Dt;h.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new lt([0,2,0,0,2,0],2));let u=new al({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new _t(h,u),f=new ir(-1,1,1,-1,0,1),m=null,_=null,b=!1,p,x=null,v=[],y=!1;this.setSize=function(T,E){a.setSize(T,E),o!==null&&o.setSize(T,E),l!==null&&l.setSize(T,E);for(let g=0;g<v.length;g++){let M=v[g];M.setSize&&M.setSize(T,E)}},this.setEffects=function(T){v=T,y=v.length>0&&v[0].isRenderPass===!0;let E=a.width,g=a.height;v.length>0&&o===null&&(o=new Wn(E,g,{type:gi,depthBuffer:!1,stencilBuffer:!1}),l=new Wn(E,g,{type:gi,depthBuffer:!1,stencilBuffer:!1}));let M=s===!0&&v.some(k=>k.needsDepthTexture===!0);M!==(a.depthTexture!==null)&&(M===!0&&c===null&&(c=new Ji(E,g),r===!0&&(c.format=is,c.type=lr)),a.dispose(),a.depthTexture=M?c:null,a.resolveDepthBuffer=M,a.storeMultisampledDepthBuffer=M);for(let k=0;k<v.length;k++){let I=v[k];I.setSize&&I.setSize(E,g),M&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(c)}},this.begin=function(T,E){if(b||T.toneMapping===Pi&&v.length===0)return!1;if(x=E,E!==null){let g=E.width,M=E.height;(a.width!==g||a.height!==M)&&this.setSize(g,M)}return y===!1&&T.setRenderTarget(a),p=T.toneMapping,T.toneMapping=Pi,!0},this.hasRenderPass=function(){return y},this.end=function(T,E){T.toneMapping=p,b=!0;let g=a,M=o;for(let k=0;k<v.length;k++){let I=v[k];I.enabled!==!1&&(I.render(T,M,g,E),I.needsSwap!==!1&&(g=M,M=M===o?l:o))}if(m!==T.outputColorSpace||_!==T.toneMapping){m=T.outputColorSpace,_=T.toneMapping,u.defines={},bt.getTransfer(m)===Rt&&(u.defines.SRGB_TRANSFER="");let k=jy[_];k&&(u.defines[k]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=g.texture,T.setRenderTarget(x),T.render(d,f),x=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var s0=new Jt,r0=new Ji(1,1),a0=new oo(1),o0=new Ka,c0=new Jc,l0=new ao,km=[],Om=[],Bm=new Float32Array(16),zm=new Float32Array(9),Gm=new Float32Array(4);function ua(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=km[s];if(r===void 0&&(r=new Float32Array(s),km[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function tn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function nn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ph(i,e){let t=Om[e];t===void 0&&(t=new Int32Array(e),Om[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Jy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Yy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2fv(this.addr,e),nn(t,e)}}function Zy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(tn(t,e))return;i.uniform3fv(this.addr,e),nn(t,e)}}function $y(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4fv(this.addr,e),nn(t,e)}}function Qy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;Gm.set(n),i.uniformMatrix2fv(this.addr,!1,Gm),nn(t,n)}}function ev(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;zm.set(n),i.uniformMatrix3fv(this.addr,!1,zm),nn(t,n)}}function tv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(tn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,n))return;Bm.set(n),i.uniformMatrix4fv(this.addr,!1,Bm),nn(t,n)}}function nv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function iv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2iv(this.addr,e),nn(t,e)}}function sv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;i.uniform3iv(this.addr,e),nn(t,e)}}function rv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4iv(this.addr,e),nn(t,e)}}function av(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ov(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;i.uniform2uiv(this.addr,e),nn(t,e)}}function cv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;i.uniform3uiv(this.addr,e),nn(t,e)}}function lv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;i.uniform4uiv(this.addr,e),nn(t,e)}}function mh(i){return i.version===0&&(i.compareFunction=ed,i.needsUpdate=!0),i}function hv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=mh(r0):r=s0,t.setTexture2D(e||r,s)}function uv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||c0,s)}function dv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=mh(a0):r=l0,t.setTextureCube(e||r,s)}function fv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||o0,s)}function pv(i){switch(i){case 5126:return Jy;case 35664:return Yy;case 35665:return Zy;case 35666:return $y;case 35674:return Qy;case 35675:return ev;case 35676:return tv;case 5124:case 35670:return nv;case 35667:case 35671:return iv;case 35668:case 35672:return sv;case 35669:case 35673:return rv;case 5125:return av;case 36294:return ov;case 36295:return cv;case 36296:return lv;case 35678:case 36198:case 36298:case 36306:case 35682:return hv;case 35679:case 36299:case 36307:return uv;case 35680:case 36300:case 36308:case 36293:return dv;case 36289:case 36303:case 36311:case 36292:return fv}}function mv(i,e){i.uniform1fv(this.addr,e)}function gv(i,e){let t=ua(e,this.size,2);i.uniform2fv(this.addr,t)}function bv(i,e){let t=ua(e,this.size,3);i.uniform3fv(this.addr,t)}function xv(i,e){let t=ua(e,this.size,4);i.uniform4fv(this.addr,t)}function _v(i,e){let t=ua(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function yv(i,e){let t=ua(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function vv(i,e){let t=ua(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Mv(i,e){i.uniform1iv(this.addr,e)}function Sv(i,e){i.uniform2iv(this.addr,e)}function wv(i,e){i.uniform3iv(this.addr,e)}function Tv(i,e){i.uniform4iv(this.addr,e)}function Ev(i,e){i.uniform1uiv(this.addr,e)}function Av(i,e){i.uniform2uiv(this.addr,e)}function Rv(i,e){i.uniform3uiv(this.addr,e)}function Cv(i,e){i.uniform4uiv(this.addr,e)}function Pv(i,e,t){let n=this.cache,s=e.length,r=ph(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=mh(r0):a=s0;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Iv(i,e,t){let n=this.cache,s=e.length,r=ph(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||c0,r[a])}function Lv(i,e,t){let n=this.cache,s=e.length,r=ph(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));let a;this.type===i.SAMPLER_CUBE_SHADOW?a=mh(a0):a=l0;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function Dv(i,e,t){let n=this.cache,s=e.length,r=ph(t,s);tn(n,r)||(i.uniform1iv(this.addr,r),nn(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||o0,r[a])}function Nv(i){switch(i){case 5126:return mv;case 35664:return gv;case 35665:return bv;case 35666:return xv;case 35674:return _v;case 35675:return yv;case 35676:return vv;case 5124:case 35670:return Mv;case 35667:case 35671:return Sv;case 35668:case 35672:return wv;case 35669:case 35673:return Tv;case 5125:return Ev;case 36294:return Av;case 36295:return Rv;case 36296:return Cv;case 35678:case 36198:case 36298:case 36306:case 35682:return Pv;case 35679:case 36299:case 36307:return Iv;case 35680:case 36300:case 36308:case 36293:return Lv;case 36289:case 36303:case 36311:case 36292:return Dv}}var yd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=pv(t.type)}},vd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nv(t.type)}},Md=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},xd=/(\w+)(\])?(\[|\.)?/g;function Hm(i,e){i.seq.push(e),i.map[e.id]=e}function Fv(i,e,t){let n=i.name,s=n.length;for(xd.lastIndex=0;;){let r=xd.exec(n),a=xd.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Hm(t,c===void 0?new yd(o,i,e):new vd(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Md(o),Hm(t,u)),t=u}}}var ha=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Fv(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Vm(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Uv=37297,kv=0;function Ov(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Wm=new rt;function Bv(i){bt._getMatrix(Wm,bt.workingColorSpace,i);let e=`mat3( ${Wm.elements.map(t=>t.toFixed(4))} )`;switch(bt.getTransfer(i)){case Xa:return[e,"LinearTransferOETF"];case Rt:return[e,"sRGBTransferOETF"];default:return We("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function qm(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Ov(i.getShaderSource(e),o)}else return r}function zv(i,e){let t=Bv(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var Gv={[Ou]:"Linear",[Bu]:"Reinhard",[zu]:"Cineon",[Ao]:"ACESFilmic",[Hu]:"AgX",[Vu]:"Neutral",[Gu]:"Custom"};function Hv(i,e){let t=Gv[e];return t===void 0?(We("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var uh=new z;function Vv(){bt.getLuminanceCoefficients(uh);let i=uh.x.toFixed(4),e=uh.y.toFixed(4),t=uh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Wv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ko).join(`
`)}function qv(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Xv(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ko(i){return i!==""}function Xm(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function jm(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var jv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sd(i){return i.replace(jv,Kv)}function Kv(i,e){let t=mt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Sd(t)}var Jv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Km(i){return i.replace(Jv,Yv)}function Yv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Jm(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var Zv={[Eo]:"SHADOWMAP_TYPE_PCF",[ia]:"SHADOWMAP_TYPE_VSM"};function $v(i){return Zv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Qv={[aa]:"ENVMAP_MODE_REFRACTION"};function eM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Qv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var tM={[ku]:"ENVMAP_BLENDING_MULTIPLY",[om]:"ENVMAP_BLENDING_MIX",[cm]:"ENVMAP_BLENDING_ADD"};function nM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":tM[i.combine]||"ENVMAP_BLENDING_NONE"}function iM(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=$v(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=eM(t),u=nM(t),d=Wv(t),f=qv(r),m=s.createProgram(),_,b,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(ko).join(`
`),_.length>0&&(_+=`
`),b=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(ko).join(`
`),b.length>0&&(b+=`
`)):(_=[Jm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ko).join(`
`),b=[Jm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pi?"#define TONE_MAPPING":"",t.toneMapping!==Pi?mt.tonemapping_pars_fragment:"",t.toneMapping!==Pi?Hv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",mt.colorspace_pars_fragment,zv("linearToOutputTexel",t.outputColorSpace),Vv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ko).join(`
`)),a=Sd(a),a=Xm(a,t),a=jm(a,t),o=Sd(o),o=Xm(o,t),o=jm(o,t),a=Km(a),o=Km(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,b=["#define varying in",t.glslVersion===id?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===id?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);let x=p+_+a,v=p+b+o,y=Vm(s,s.VERTEX_SHADER,x),T=Vm(s,s.FRAGMENT_SHADER,v);s.attachShader(m,y),s.attachShader(m,T),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function E(I){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(m)||"",V=s.getShaderInfoLog(y)||"",J=s.getShaderInfoLog(T)||"",R=U.trim(),P=V.trim(),F=J.trim(),O=!0,W=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,y,T);else{let N=qm(s,y,"vertex"),H=qm(s,T,"fragment");et("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+R+`
`+N+`
`+H)}else R!==""?We("WebGLProgram: Program Info Log:",R):(P===""||F==="")&&(W=!1);W&&(I.diagnostics={runnable:O,programLog:R,vertexShader:{log:P,prefix:_},fragmentShader:{log:F,prefix:b}})}s.deleteShader(y),s.deleteShader(T),g=new ha(s,m),M=Xv(s,m)}let g;this.getUniforms=function(){return g===void 0&&E(this),g};let M;this.getAttributes=function(){return M===void 0&&E(this),M};let k=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return k===!1&&(k=s.getProgramParameter(m,Uv)),k},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=kv++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=y,this.fragmentShader=T,this}var sM=0,wd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Td(e),t.set(e,n)),n}},Td=class{constructor(e){this.id=sM++,this.code=e,this.usedTimes=0}};function rM(i){return i===ws||i===Lo||i===Do}function aM(i,e,t,n,s,r){let a=new Ja,o=new wd,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(g){return l.add(g),g===0?"uv":`uv${g}`}function m(g,M,k,I,U,V){let J=I.fog,R=U.geometry,P=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?I.environment:null,F=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,O=e.get(g.envMap||P,F),W=d[g.type],N=n.precision;g.precision!==null&&(N=n.getMaxPrecision(g.precision),N!==g.precision&&We("WebGLProgram.getParameters:",g.precision,"not supported, using",N,"instead."));let H=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,q=H!==void 0?H.length:0,ce=0;R.morphAttributes.position!==void 0&&(ce=1),R.morphAttributes.normal!==void 0&&(ce=2),R.morphAttributes.color!==void 0&&(ce=3);let Pe,$,de,Ae;if(W){let Re=Li[W];Pe=Re.vertexShader,$=Re.fragmentShader}else{Pe=g.vertexShader,$=g.fragmentShader;let Re=o.getVertexShaderStage(g),Ct=o.getFragmentShaderStage(g);o.update(g,Re,Ct),de=Re.id,Ae=Ct.id}let Xe=i.getRenderTarget(),Me=i.state.buffers.depth.getReversed(),je=U.isInstancedMesh===!0,At=U.isBatchedMesh===!0,Ye=!!g.map,at=!!g.matcap,ht=!!O,ae=ht&&O.isPMREMTexture===!0,ge=!!g.aoMap,me=!!g.lightMap,Ie=!!g.bumpMap&&g.wireframe===!1,we=!!g.normalMap,ot=!!g.displacementMap,De=!!g.emissiveMap,D=!!g.metalnessMap,Z=!!g.roughnessMap,le=g.anisotropy>0,L=g.clearcoat>0,Ke=g.diffuseRoughness>0,Oe=g.dispersion>0,gt=g.retroreflectivity>0,be=g.iridescence>0,Vt=g.sheen>0,$e=g.transmission>0,nt=le&&!!g.anisotropyMap,C=L&&!!g.clearcoatMap,S=L&&!!g.clearcoatNormalMap,j=L&&!!g.clearcoatRoughnessMap,ue=Ke&&!!g.diffuseRoughnessMap,oe=be&&!!g.iridescenceMap,xe=be&&!!g.iridescenceThicknessMap,Te=Vt&&!!g.sheenColorMap,te=Vt&&!!g.sheenRoughnessMap,ne=!!g.specularMap,ye=!!g.specularColorMap,B=!!g.specularIntensityMap,ie=$e&&!!g.transmissionMap,Q=$e&&!!g.thicknessMap,ve=!!g.gradientMap,pe=!!g.alphaMap,_e=g.alphaTest>0,Je=!!g.alphaHash,dt=!!g.extensions,fe=Pi;g.toneMapped&&(Xe===null||Xe.isXRRenderTarget===!0)&&(fe=i.toneMapping);let Ze=ae?O.isCompressedCubeTexture?O.image[0].mipmaps:O.mipmaps:null,ut={shaderID:W,shaderType:g.type,shaderName:g.name,vertexShader:Pe,fragmentShader:$,defines:g.defines,customVertexShaderID:de,customFragmentShaderID:Ae,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:N,batching:At,batchingColor:At&&U._colorsTexture!==null,instancing:je,instancingColor:je&&U.instanceColor!==null,instancingMorph:je&&U.morphTexture!==null,outputColorSpace:Xe===null?i.outputColorSpace:Xe.isXRRenderTarget===!0?Xe.texture.colorSpace:bt.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Ye,matcap:at,envMap:ht,envMapMode:ht&&O.mapping,envMapPMREM:ae,envMapMaxLod:ae?Ze.length-1:null,envMapSize:ae?Ze[0].width:null,aoMap:ge,lightMap:me,bumpMap:Ie,normalMap:we,displacementMap:ot,emissiveMap:De,normalMapObjectSpace:we&&g.normalMapType===fm,normalMapTangentSpace:we&&g.normalMapType===oh,packedNormalMap:we&&g.normalMapType===oh&&rM(g.normalMap.format),metalnessMap:D,roughnessMap:Z,anisotropy:le,anisotropyMap:nt,clearcoat:L,clearcoatMap:C,clearcoatNormalMap:S,clearcoatRoughnessMap:j,diffuseRoughness:Ke,diffuseRoughnessMap:ue,dispersion:Oe,retroreflection:gt,iridescence:be,iridescenceMap:oe,iridescenceThicknessMap:xe,sheen:Vt,sheenColorMap:Te,sheenRoughnessMap:te,specularMap:ne,specularColorMap:ye,specularIntensityMap:B,transmission:$e,transmissionMap:ie,thicknessMap:Q,gradientMap:ve,opaque:g.transparent===!1&&g.blending===sa&&g.alphaToCoverage===!1,alphaMap:pe,alphaTest:_e,alphaHash:Je,combine:g.combine,mapUv:Ye&&f(g.map.channel),aoMapUv:ge&&f(g.aoMap.channel),lightMapUv:me&&f(g.lightMap.channel),bumpMapUv:Ie&&f(g.bumpMap.channel),normalMapUv:we&&f(g.normalMap.channel),displacementMapUv:ot&&f(g.displacementMap.channel),emissiveMapUv:De&&f(g.emissiveMap.channel),metalnessMapUv:D&&f(g.metalnessMap.channel),roughnessMapUv:Z&&f(g.roughnessMap.channel),anisotropyMapUv:nt&&f(g.anisotropyMap.channel),clearcoatMapUv:C&&f(g.clearcoatMap.channel),clearcoatNormalMapUv:S&&f(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&f(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ue&&f(g.diffuseRoughnessMap.channel),iridescenceMapUv:oe&&f(g.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&f(g.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&f(g.sheenColorMap.channel),sheenRoughnessMapUv:te&&f(g.sheenRoughnessMap.channel),specularMapUv:ne&&f(g.specularMap.channel),specularColorMapUv:ye&&f(g.specularColorMap.channel),specularIntensityMapUv:B&&f(g.specularIntensityMap.channel),transmissionMapUv:ie&&f(g.transmissionMap.channel),thicknessMapUv:Q&&f(g.thicknessMap.channel),alphaMapUv:pe&&f(g.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(we||le),vertexNormals:!!R.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!R.attributes.uv&&(Ye||pe),fog:!!J,useFog:g.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||R.attributes.normal===void 0&&we===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:R.attributes.position!==void 0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:ce,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:V.filter(Re=>Re.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&k.length>0,shadowMapType:i.shadowMap.type,toneMapping:fe,decodeVideoTexture:Ye&&g.map.isVideoTexture===!0&&bt.getTransfer(g.map.colorSpace)===Rt,decodeVideoTextureEmissive:De&&g.emissiveMap.isVideoTexture===!0&&bt.getTransfer(g.emissiveMap.colorSpace)===Rt,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Ot,flipSided:g.side===un,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:dt&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(dt&&g.extensions.multiDraw===!0||At)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return ut.vertexUv1s=l.has(1),ut.vertexUv2s=l.has(2),ut.vertexUv3s=l.has(3),l.clear(),ut}function _(g){let M=[];if(g.shaderID?M.push(g.shaderID):(M.push(g.customVertexShaderID),M.push(g.customFragmentShaderID)),g.defines!==void 0)for(let k in g.defines)M.push(k),M.push(g.defines[k]);return g.isRawShaderMaterial===!1&&(b(M,g),p(M,g),M.push(i.outputColorSpace)),M.push(g.customProgramCacheKey),M.join()}function b(g,M){g.push(M.precision),g.push(M.outputColorSpace),g.push(M.envMapMode),g.push(M.envMapPMREM),g.push(M.envMapMaxLod),g.push(M.envMapSize),g.push(M.mapUv),g.push(M.alphaMapUv),g.push(M.lightMapUv),g.push(M.aoMapUv),g.push(M.bumpMapUv),g.push(M.normalMapUv),g.push(M.displacementMapUv),g.push(M.emissiveMapUv),g.push(M.metalnessMapUv),g.push(M.roughnessMapUv),g.push(M.anisotropyMapUv),g.push(M.clearcoatMapUv),g.push(M.clearcoatNormalMapUv),g.push(M.clearcoatRoughnessMapUv),g.push(M.diffuseRoughnessMapUv),g.push(M.iridescenceMapUv),g.push(M.iridescenceThicknessMapUv),g.push(M.sheenColorMapUv),g.push(M.sheenRoughnessMapUv),g.push(M.specularMapUv),g.push(M.specularColorMapUv),g.push(M.specularIntensityMapUv),g.push(M.transmissionMapUv),g.push(M.thicknessMapUv),g.push(M.combine),g.push(M.fogExp2),g.push(M.sizeAttenuation),g.push(M.morphTargetsCount),g.push(M.numSunLights),g.push(M.numDirLights),g.push(M.numPointLights),g.push(M.numSpotLights),g.push(M.numSpotLightMaps),g.push(M.numHemiLights),g.push(M.numRectAreaLights),g.push(M.numSunLightShadows),g.push(M.numDirLightShadows),g.push(M.numPointLightShadows),g.push(M.numSpotLightShadows),g.push(M.numSpotLightShadowsWithMaps),g.push(M.numLightProbes),g.push(M.numLightProbeGrids),g.push(M.shadowMapType),g.push(M.toneMapping),g.push(M.numClippingPlanes),g.push(M.numClipIntersection),g.push(M.depthPacking)}function p(g,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.retroreflection&&a.enable(24),M.diffuseRoughness&&a.enable(25),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),M.packedNormalMap&&a.enable(22),M.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),M.numLightProbeGrids>0&&a.enable(22),M.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function x(g){let M=d[g.type],k;if(M){let I=Li[M];k=Pm.clone(I.uniforms)}else k=g.uniforms;return k}function v(g,M){let k=h.get(M);return k!==void 0?++k.usedTimes:(k=new iM(i,M,g,s),c.push(k),h.set(M,k)),k}function y(g){if(--g.usedTimes===0){let M=c.indexOf(g);c[M]=c[c.length-1],c.pop(),h.delete(g.cacheKey),g.destroy()}}function T(g){o.remove(g)}function E(){o.dispose()}return{getParameters:m,getProgramCacheKey:_,getUniforms:x,acquireProgram:v,releaseProgram:y,releaseShaderCache:T,programs:c,dispose:E}}function oM(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function cM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Ym(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Zm(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,_,b,p){let x=i[e];return x===void 0?(x={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:b,group:p},i[e]=x):(x.id=d.id,x.object=d,x.geometry=f,x.material=m,x.materialVariant=a(d),x.groupOrder=_,x.renderOrder=d.renderOrder,x.z=b,x.group=p),e++,x}function l(d,f,m,_,b,p,x){x.reversedDepth===!0&&(b=-b);let v=o(d,f,m,_,b,p);m.transmission>0?n.push(v):m.transparent===!0?s.push(v):t.push(v)}function c(d,f,m,_,b,p){let x=o(d,f,m,_,b,p);m.transmission>0?n.unshift(x):m.transparent===!0?s.unshift(x):t.unshift(x)}function h(d,f){t.length>1&&t.sort(d||cM),n.length>1&&n.sort(f||Ym),s.length>1&&s.sort(f||Ym)}function u(){for(let d=e,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function lM(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Zm,i.set(n,[a])):s>=r.length?(a=new Zm,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function hM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new z,color:new qe};break;case"SpotLight":t={position:new z,direction:new z,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new z,halfWidth:new z,halfHeight:new z};break}return i[e.id]=t,t}}}function uM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var dM=0;function fM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function pM(i){let e=new hM,t=uM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);let s=new z,r=new tt,a=new tt;function o(c){let h=0,u=0,d=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let f=0,m=0,_=0,b=0,p=0,x=0,v=0,y=0,T=0,E=0,g=0,M=0,k=0,I=0;c.sort(fM);for(let V=0,J=c.length;V<J;V++){let R=c[V],P=R.color,F=R.intensity,O=R.distance,W=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===ws?W=R.shadow.map.texture:W=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=P.r*F,u+=P.g*F,d+=P.b*F;else if(R.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(R.sh.coefficients[N],F);I++}else if(R.isSunLight){let N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let H=R.shadow,q=t.get(R);q.shadowIntensity=H.intensity,q.shadowBias=H.bias,q.shadowNormalBias=H.normalBias,q.shadowRadius=H.radius,q.shadowMapSize.copy(H.mapSize).multiply(H.getFrameExtents()),n.sunShadow[m]=q,n.sunShadowMap[m]=W;let ce=H.getViewportCount();for(let Pe=0;Pe<ce;Pe++)n.sunShadowMatrix[_+Pe]=H.getMatrix(Pe),n.sunShadowCascade[_+Pe]=H._cascadeData[Pe];_+=ce,m++}n.sun[f]=N,f++}else if(R.isDirectionalLight){let N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let H=R.shadow,q=t.get(R);q.shadowIntensity=H.intensity,q.shadowBias=H.bias,q.shadowNormalBias=H.normalBias,q.shadowRadius=H.radius,q.shadowMapSize=H.mapSize,n.directionalShadow[b]=q,n.directionalShadowMap[b]=W,n.directionalShadowMatrix[b]=R.shadow.matrix,T++}n.directional[b]=N,b++}else if(R.isSpotLight){let N=e.get(R);N.position.setFromMatrixPosition(R.matrixWorld),N.color.copy(P).multiplyScalar(F),N.distance=O,N.coneCos=Math.cos(R.angle),N.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),N.decay=R.decay,n.spot[x]=N;let H=R.shadow;if(R.map&&(n.spotLightMap[M]=R.map,M++,H.updateMatrices(R),R.castShadow&&k++),n.spotLightMatrix[x]=H.matrix,R.castShadow){let q=t.get(R);q.shadowIntensity=H.intensity,q.shadowBias=H.bias,q.shadowNormalBias=H.normalBias,q.shadowRadius=H.radius,q.shadowMapSize=H.mapSize,n.spotShadow[x]=q,n.spotShadowMap[x]=W,g++}x++}else if(R.isRectAreaLight){let N=e.get(R);N.color.copy(P).multiplyScalar(F),N.halfWidth.set(R.width*.5,0,0),N.halfHeight.set(0,R.height*.5,0),n.rectArea[v]=N,v++}else if(R.isPointLight){let N=e.get(R);if(N.color.copy(R.color).multiplyScalar(R.intensity),N.distance=R.distance,N.decay=R.decay,R.castShadow){let H=R.shadow,q=t.get(R);q.shadowIntensity=H.intensity,q.shadowBias=H.bias,q.shadowNormalBias=H.normalBias,q.shadowRadius=H.radius,q.shadowMapSize=H.mapSize,q.shadowCameraNear=H.camera.near,q.shadowCameraFar=H.camera.far,n.pointShadow[p]=q,n.pointShadowMap[p]=W,n.pointShadowMatrix[p]=R.shadow.matrix,E++}n.point[p]=N,p++}else if(R.isHemisphereLight){let N=e.get(R);N.skyColor.copy(R.color).multiplyScalar(F),N.groundColor.copy(R.groundColor).multiplyScalar(F),n.hemi[y]=N,y++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let U=n.hash;(U.sunLength!==f||U.directionalLength!==b||U.pointLength!==p||U.spotLength!==x||U.rectAreaLength!==v||U.hemiLength!==y||U.numSunShadows!==m||U.numDirectionalShadows!==T||U.numPointShadows!==E||U.numSpotShadows!==g||U.numSpotMaps!==M||U.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=b,n.spot.length=x,n.rectArea.length=v,n.point.length=p,n.hemi.length=y,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.directionalShadowMatrix.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=g,n.spotShadowMap.length=g,n.spotLightMatrix.length=g+M-k,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=k,n.numLightProbes=I,U.sunLength=f,U.directionalLength=b,U.pointLength=p,U.spotLength=x,U.rectAreaLength=v,U.hemiLength=y,U.numSunShadows=m,U.numDirectionalShadows=T,U.numPointShadows=E,U.numSpotShadows=g,U.numSpotMaps=M,U.numLightProbes=I,n.version=dM++)}function l(c,h){let u=0,d=0,f=0,m=0,_=0,b=0,p=h.matrixWorldInverse;for(let x=0,v=c.length;x<v;x++){let y=c[x];if(y.isSunLight){let T=n.sun[u];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),u++}else if(y.isDirectionalLight){let T=n.directional[d];T.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),d++}else if(y.isSpotLight){let T=n.spot[m];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(p),m++}else if(y.isRectAreaLight){let T=n.rectArea[_];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){let T=n.point[f];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){let T=n.hemi[b];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),b++}}}return{setup:o,setupView:l,state:n}}function $m(i){let e=new pM(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):t.push(u)}function o(u){n.push(u)}function l(){e.setup(t),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function mM(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new $m(i),e.set(s,[o])):r>=a.length?(o=new $m(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var gM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,xM=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],_M=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],Qm=new tt,Uo=new z,_d=new z;function yM(i,e,t){let n=new xs,s=new he,r=new he,a=new Pt,o=new ol,l=new cl,c={},h=t.maxTextureSize,u={[Ci]:un,[un]:Ci,[Ot]:Ot},d=new Ei({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:gM,fragmentShader:bM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new Dt;m.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new _t(m,d),b=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Eo;let p=this.type;this.render=function(E,g,M){if(b.enabled===!1||b.autoUpdate===!1&&b.needsUpdate===!1||E.length===0)return;this.type===Hp&&(We("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Eo);let k=i.getRenderTarget(),I=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),V=i.state;V.setBlending(rr),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let J=p!==this.type;J&&g.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(P=>P.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,P=E.length;R<P;R++){let F=E[R],O=F.shadow;if(O===void 0){We("WebGLShadowMap:",F,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);let W=O.getFrameExtents();s.multiply(W),r.copy(O.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/W.x),s.x=r.x*W.x,O.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/W.y),s.y=r.y*W.y,O.mapSize.y=r.y));let N=i.state.buffers.depth.getReversed();if(O.camera._reversedDepth=N,O.map===null||J===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===ia){if(F.isPointLight){We("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new Wn(s.x,s.y,{format:ws,type:gi,minFilter:en,magFilter:en,generateMipmaps:!1}),O.map.texture.name=F.name+".shadowMap",O.map.depthTexture=new Ji(s.x,s.y,Xn),O.map.depthTexture.name=F.name+".shadowMapDepth",O.map.depthTexture.format=Xi,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Kt,O.map.depthTexture.magFilter=Kt}else F.isPointLight?(O.map=new Oo(s.x),O.map.depthTexture=new oo(s.x,mi)):(O.map=new Wn(s.x,s.y),O.map.depthTexture=new Ji(s.x,s.y,mi)),O.map.depthTexture.name=F.name+".shadowMap",O.map.depthTexture.format=Xi,this.type===Eo?(O.map.depthTexture.compareFunction=N?Qu:$u,O.map.depthTexture.minFilter=en,O.map.depthTexture.magFilter=en):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Kt,O.map.depthTexture.magFilter=Kt);O.camera.updateProjectionMatrix()}O.map.isWebGLCubeRenderTarget!==!0&&(O.map.width!==s.x||O.map.height!==s.y)&&O.map.setSize(s.x,s.y);let H=O.map.isWebGLCubeRenderTarget?6:O.getViewportCount();F.isPointLight!==!0&&O.updateMatrices(F,M);let q=(O.camera.layers.mask&4294967294)!==0?O.camera.layers:M.layers;for(let ce=0;ce<H;ce++){let Pe=O.getCamera(ce);if(F.isPointLight){let $=O.camera,de=O.matrix,Ae=F.distance||$.far;Ae!==$.far&&($.far=Ae,$.updateProjectionMatrix()),Uo.setFromMatrixPosition(F.matrixWorld),$.position.copy(Uo),_d.copy($.position),_d.add(xM[ce]),$.up.copy(_M[ce]),$.lookAt(_d),$.updateMatrixWorld(),de.makeTranslation(-Uo.x,-Uo.y,-Uo.z),Qm.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Qm,$.coordinateSystem,$.reversedDepth)}if(O.map.isWebGLCubeRenderTarget)i.setRenderTarget(O.map,ce),i.clear();else{ce===0&&(i.setRenderTarget(O.map),i.clear());let $=O.getViewport(ce);a.set(r.x*$.x,r.y*$.y,r.x*$.z,r.y*$.w),V.viewport(a)}n=O.getFrustum(ce),y(g,M,Pe,F,q,this.type)}O.isPointLightShadow!==!0&&this.type===ia&&x(O,M),O.needsUpdate=!1}p=this.type,b.needsUpdate=!1,i.setRenderTarget(k,I,U)};function x(E,g){let M=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Wn(s.x,s.y,{format:ws,type:gi}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(g,null,M,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(g,null,M,f,_,null)}function v(E,g,M,k){let I=null,U=M.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(U!==void 0)I=U;else if(I=M.isPointLight===!0?l:o,i.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){let V=I.uuid,J=g.uuid,R=c[V];R===void 0&&(R={},c[V]=R);let P=R[J];P===void 0&&(P=I.clone(),R[J]=P,g.addEventListener("dispose",T)),I=P}if(I.visible=g.visible,I.wireframe=g.wireframe,k===ia?I.side=g.shadowSide!==null?g.shadowSide:g.side:I.side=g.shadowSide!==null?g.shadowSide:u[g.side],I.alphaMap=g.alphaMap,I.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,I.map=g.map,I.clipShadows=g.clipShadows,I.clippingPlanes=g.clippingPlanes,I.clipIntersection=g.clipIntersection,I.displacementMap=g.displacementMap,I.displacementScale=g.displacementScale,I.displacementBias=g.displacementBias,I.wireframeLinewidth=g.wireframeLinewidth,I.linewidth=g.linewidth,M.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let V=i.properties.get(I);V.light=M}return I}function y(E,g,M,k,I,U){if(E.visible===!1)return;if(E.layers.test(I)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&U===ia)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,E.matrixWorld);let R=e.update(E),P=E.material;if(Array.isArray(P)){let F=R.groups;for(let O=0,W=F.length;O<W;O++){let N=F[O],H=P[N.materialIndex];if(H&&H.visible){let q=v(E,H,k,U);E.onBeforeShadow(i,E,g,M,R,q,N),i.renderBufferDirect(M,null,R,q,E,N),E.onAfterShadow(i,E,g,M,R,q,N)}}}else if(P.visible){let F=v(E,P,k,U);E.onBeforeShadow(i,E,g,M,R,F,null),i.renderBufferDirect(M,null,R,F,E,null),E.onAfterShadow(i,E,g,M,R,F,null)}}let J=E.children;for(let R=0,P=J.length;R<P;R++)y(J[R],g,M,k,I,U)}function T(E){E.target.removeEventListener("dispose",T);for(let M in c){let k=c[M],I=E.target.uuid;I in k&&(k[I].dispose(),delete k[I])}}}function vM(i,e){function t(){let B=!1,ie=new Pt,Q=null,ve=new Pt(0,0,0,0);return{setMask:function(pe){Q!==pe&&!B&&(i.colorMask(pe,pe,pe,pe),Q=pe)},setLocked:function(pe){B=pe},setClear:function(pe,_e,Je,dt,fe){fe===!0&&(pe*=dt,_e*=dt,Je*=dt),ie.set(pe,_e,Je,dt),ve.equals(ie)===!1&&(i.clearColor(pe,_e,Je,dt),ve.copy(ie))},reset:function(){B=!1,Q=null,ve.set(-1,0,0,0)}}}function n(){let B=!1,ie=!1,Q=null,ve=null,pe=null;return{setReversed:function(_e){if(ie!==_e){let Je=e.get("EXT_clip_control");_e?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),ie=_e;let dt=pe;pe=null,this.setClear(dt)}},getReversed:function(){return ie},setTest:function(_e){_e?Me(i.DEPTH_TEST):je(i.DEPTH_TEST)},setMask:function(_e){Q!==_e&&!B&&(i.depthMask(_e),Q=_e)},setFunc:function(_e){if(ie&&(_e=Sm[_e]),ve!==_e){switch(_e){case zc:i.depthFunc(i.NEVER);break;case Gc:i.depthFunc(i.ALWAYS);break;case Hc:i.depthFunc(i.LESS);break;case zr:i.depthFunc(i.LEQUAL);break;case Vc:i.depthFunc(i.EQUAL);break;case Wc:i.depthFunc(i.GEQUAL);break;case qc:i.depthFunc(i.GREATER);break;case Xc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=_e}},setLocked:function(_e){B=_e},setClear:function(_e){pe!==_e&&(pe=_e,ie&&(_e=1-_e),i.clearDepth(_e))},reset:function(){B=!1,Q=null,ve=null,pe=null,ie=!1}}}function s(){let B=!1,ie=null,Q=null,ve=null,pe=null,_e=null,Je=null,dt=null,fe=null;return{setTest:function(Ze){B||(Ze?Me(i.STENCIL_TEST):je(i.STENCIL_TEST))},setMask:function(Ze){ie!==Ze&&!B&&(i.stencilMask(Ze),ie=Ze)},setFunc:function(Ze,ut,Re){(Q!==Ze||ve!==ut||pe!==Re)&&(i.stencilFunc(Ze,ut,Re),Q=Ze,ve=ut,pe=Re)},setOp:function(Ze,ut,Re){(_e!==Ze||Je!==ut||dt!==Re)&&(i.stencilOp(Ze,ut,Re),_e=Ze,Je=ut,dt=Re)},setLocked:function(Ze){B=Ze},setClear:function(Ze){fe!==Ze&&(i.clearStencil(Ze),fe=Ze)},reset:function(){B=!1,ie=null,Q=null,ve=null,pe=null,_e=null,Je=null,dt=null,fe=null}}}let r=new t,a=new n,o=new s,l={},c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],_=null,b=!1,p=null,x=null,v=null,y=null,T=null,E=null,g=null,M=new qe(0,0,0),k=0,I=!1,U=null,V=null,J=null,R=null,P=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,W=0,N=i.getParameter(i.VERSION);N.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(N)[1]),O=W>=1):N.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),O=W>=2);let H=null,q={},ce=i.getParameter(i.SCISSOR_BOX),Pe=i.getParameter(i.VIEWPORT),$=new Pt().fromArray(ce),de=new Pt().fromArray(Pe);function Ae(B,ie,Q,ve){let pe=new Uint8Array(4),_e=i.createTexture();i.bindTexture(B,_e),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Je=0;Je<Q;Je++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(ie+Je,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return _e}let Xe={};Xe[i.TEXTURE_2D]=Ae(i.TEXTURE_2D,i.TEXTURE_2D,1),Xe[i.TEXTURE_CUBE_MAP]=Ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Xe[i.TEXTURE_2D_ARRAY]=Ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Xe[i.TEXTURE_3D]=Ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Me(i.DEPTH_TEST),a.setFunc(zr),Ie(!1),we(Lu),Me(i.CULL_FACE),ge(rr);function Me(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function je(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function At(B,ie){return d[B]!==ie?(i.bindFramebuffer(B,ie),d[B]=ie,B===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ie),B===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function Ye(B,ie){let Q=m,ve=!1;if(B){Q=f.get(ie),Q===void 0&&(Q=[],f.set(ie,Q));let pe=B.textures;if(Q.length!==pe.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let _e=0,Je=pe.length;_e<Je;_e++)Q[_e]=i.COLOR_ATTACHMENT0+_e;Q.length=pe.length,ve=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,ve=!0);ve&&i.drawBuffers(Q)}function at(B){return _!==B?(i.useProgram(B),_=B,!0):!1}let ht={[ar]:i.FUNC_ADD,[Wp]:i.FUNC_SUBTRACT,[qp]:i.FUNC_REVERSE_SUBTRACT};ht[Xp]=i.MIN,ht[jp]=i.MAX;let ae={[Kp]:i.ZERO,[Jp]:i.ONE,[Yp]:i.SRC_COLOR,[Fu]:i.SRC_ALPHA,[nm]:i.SRC_ALPHA_SATURATE,[em]:i.DST_COLOR,[$p]:i.DST_ALPHA,[Zp]:i.ONE_MINUS_SRC_COLOR,[Uu]:i.ONE_MINUS_SRC_ALPHA,[tm]:i.ONE_MINUS_DST_COLOR,[Qp]:i.ONE_MINUS_DST_ALPHA,[im]:i.CONSTANT_COLOR,[sm]:i.ONE_MINUS_CONSTANT_COLOR,[rm]:i.CONSTANT_ALPHA,[am]:i.ONE_MINUS_CONSTANT_ALPHA};function ge(B,ie,Q,ve,pe,_e,Je,dt,fe,Ze){if(B===rr){b===!0&&(je(i.BLEND),b=!1);return}if(b===!1&&(Me(i.BLEND),b=!0),B!==Vp){if(B!==p||Ze!==I){if((x!==ar||T!==ar)&&(i.blendEquation(i.FUNC_ADD),x=ar,T=ar),Ze)switch(B){case sa:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ra:i.blendFunc(i.ONE,i.ONE);break;case Du:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Nu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:et("WebGLState: Invalid blending: ",B);break}else switch(B){case sa:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ra:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Du:et("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Nu:et("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:et("WebGLState: Invalid blending: ",B);break}v=null,y=null,E=null,g=null,M.set(0,0,0),k=0,p=B,I=Ze}return}pe=pe||ie,_e=_e||Q,Je=Je||ve,(ie!==x||pe!==T)&&(i.blendEquationSeparate(ht[ie],ht[pe]),x=ie,T=pe),(Q!==v||ve!==y||_e!==E||Je!==g)&&(i.blendFuncSeparate(ae[Q],ae[ve],ae[_e],ae[Je]),v=Q,y=ve,E=_e,g=Je),(dt.equals(M)===!1||fe!==k)&&(i.blendColor(dt.r,dt.g,dt.b,fe),M.copy(dt),k=fe),p=B,I=!1}function me(B,ie){B.side===Ot?je(i.CULL_FACE):Me(i.CULL_FACE);let Q=B.side===un;ie&&(Q=!Q),Ie(Q),B.blending===sa&&B.transparent===!1?ge(rr):ge(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);let ve=B.stencilWrite;o.setTest(ve),ve&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),De(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?Me(i.SAMPLE_ALPHA_TO_COVERAGE):je(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ie(B){U!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),U=B)}function we(B){B!==zp?(Me(i.CULL_FACE),B!==V&&(B===Lu?i.cullFace(i.BACK):B===Gp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):je(i.CULL_FACE),V=B}function ot(B){B!==J&&(O&&i.lineWidth(B),J=B)}function De(B,ie,Q){B?(Me(i.POLYGON_OFFSET_FILL),(R!==ie||P!==Q)&&(R=ie,P=Q,a.getReversed()&&(ie=-ie,Q=-Q),i.polygonOffset(ie,Q))):je(i.POLYGON_OFFSET_FILL)}function D(B){B?Me(i.SCISSOR_TEST):je(i.SCISSOR_TEST)}function Z(B){B===void 0&&(B=i.TEXTURE0+F-1),H!==B&&(i.activeTexture(B),H=B)}function le(B,ie,Q){Q===void 0&&(H===null?Q=i.TEXTURE0+F-1:Q=H);let ve=q[Q];ve===void 0&&(ve={type:void 0,texture:void 0},q[Q]=ve),(ve.type!==B||ve.texture!==ie)&&(H!==Q&&(i.activeTexture(Q),H=Q),i.bindTexture(B,ie||Xe[B]),ve.type=B,ve.texture=ie)}function L(){let B=q[H];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Ke(){try{i.compressedTexImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function Oe(){try{i.compressedTexImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function gt(){try{i.texSubImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function be(){try{i.texSubImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function Vt(){try{i.compressedTexSubImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function $e(){try{i.compressedTexSubImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function nt(){try{i.texStorage2D(...arguments)}catch(B){et("WebGLState:",B)}}function C(){try{i.texStorage3D(...arguments)}catch(B){et("WebGLState:",B)}}function S(){try{i.texImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function j(){try{i.texImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function ue(B){return u[B]!==void 0?u[B]:i.getParameter(B)}function oe(B,ie){u[B]!==ie&&(i.pixelStorei(B,ie),u[B]=ie)}function xe(B){$.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),$.copy(B))}function Te(B){de.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),de.copy(B))}function te(B,ie){let Q=c.get(ie);Q===void 0&&(Q=new WeakMap,c.set(ie,Q));let ve=Q.get(B);ve===void 0&&(ve=i.getUniformBlockIndex(ie,B.name),i.uniformBlockBinding(ie,ve,ve),Q.set(B,ve))}function ne(B,ie,Q){let pe=c.get(ie).get(B);l[pe]!==Q&&(i.bindBufferBase(i.UNIFORM_BUFFER,pe,Q),l[pe]=Q)}function ye(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},H=null,q={},d={},l={},f=new WeakMap,m=[],_=null,b=!1,p=null,x=null,v=null,y=null,T=null,E=null,g=null,M=new qe(0,0,0),k=0,I=!1,U=null,V=null,J=null,R=null,P=null,$.set(0,0,i.canvas.width,i.canvas.height),de.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Me,disable:je,bindFramebuffer:At,drawBuffers:Ye,useProgram:at,setBlending:ge,setMaterial:me,setFlipSided:Ie,setCullFace:we,setLineWidth:ot,setPolygonOffset:De,setScissorTest:D,activeTexture:Z,bindTexture:le,unbindTexture:L,compressedTexImage2D:Ke,compressedTexImage3D:Oe,texImage2D:S,texImage3D:j,pixelStorei:oe,getParameter:ue,updateUBOMapping:te,uniformBlockBinding:ne,texStorage2D:nt,texStorage3D:C,texSubImage2D:gt,texSubImage3D:be,compressedTexSubImage2D:Vt,compressedTexSubImage3D:$e,scissor:xe,viewport:Te,reset:ye}}function MM(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new he,h=new WeakMap,u=new Set,d,f=new WeakMap,m=new Set,_=new FinalizationRegistry(C=>m.delete(C)),b=!1;try{b=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(C,S){return b?new OffscreenCanvas(C,S):Vr("canvas")}function x(C,S,j){let ue=1,oe=nt(C);if((oe.width>j||oe.height>j)&&(ue=j/Math.max(oe.width,oe.height)),ue<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let xe=Math.floor(ue*oe.width),Te=Math.floor(ue*oe.height);d===void 0&&(d=p(xe,Te));let te=S?p(xe,Te):d;return te.width=xe,te.height=Te,te.getContext("2d").drawImage(C,0,0,xe,Te),We("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+xe+"x"+Te+")."),te}else return"data"in C&&We("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),C;return C}function v(C){return C.generateMipmaps}function y(C){i.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(C,S,j,ue,oe,xe=!1){if(C!==null){if(i[C]!==void 0)return i[C];We("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Te;ue&&(Te=e.get("EXT_texture_norm16"),Te||We("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=S;if(S===i.RED&&(j===i.FLOAT&&(te=i.R32F),j===i.HALF_FLOAT&&(te=i.R16F),j===i.UNSIGNED_BYTE&&(te=i.R8),j===i.UNSIGNED_SHORT&&Te&&(te=Te.R16_EXT),j===i.SHORT&&Te&&(te=Te.R16_SNORM_EXT)),S===i.RED_INTEGER&&(j===i.UNSIGNED_BYTE&&(te=i.R8UI),j===i.UNSIGNED_SHORT&&(te=i.R16UI),j===i.UNSIGNED_INT&&(te=i.R32UI),j===i.BYTE&&(te=i.R8I),j===i.SHORT&&(te=i.R16I),j===i.INT&&(te=i.R32I)),S===i.RG&&(j===i.FLOAT&&(te=i.RG32F),j===i.HALF_FLOAT&&(te=i.RG16F),j===i.UNSIGNED_BYTE&&(te=i.RG8),j===i.UNSIGNED_SHORT&&Te&&(te=Te.RG16_EXT),j===i.SHORT&&Te&&(te=Te.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(j===i.UNSIGNED_BYTE&&(te=i.RG8UI),j===i.UNSIGNED_SHORT&&(te=i.RG16UI),j===i.UNSIGNED_INT&&(te=i.RG32UI),j===i.BYTE&&(te=i.RG8I),j===i.SHORT&&(te=i.RG16I),j===i.INT&&(te=i.RG32I)),S===i.RGB_INTEGER&&(j===i.UNSIGNED_BYTE&&(te=i.RGB8UI),j===i.UNSIGNED_SHORT&&(te=i.RGB16UI),j===i.UNSIGNED_INT&&(te=i.RGB32UI),j===i.BYTE&&(te=i.RGB8I),j===i.SHORT&&(te=i.RGB16I),j===i.INT&&(te=i.RGB32I)),S===i.RGBA_INTEGER&&(j===i.UNSIGNED_BYTE&&(te=i.RGBA8UI),j===i.UNSIGNED_SHORT&&(te=i.RGBA16UI),j===i.UNSIGNED_INT&&(te=i.RGBA32UI),j===i.BYTE&&(te=i.RGBA8I),j===i.SHORT&&(te=i.RGBA16I),j===i.INT&&(te=i.RGBA32I)),S===i.RGB&&(j===i.UNSIGNED_SHORT&&Te&&(te=Te.RGB16_EXT),j===i.SHORT&&Te&&(te=Te.RGB16_SNORM_EXT),j===i.UNSIGNED_INT_5_9_9_9_REV&&(te=i.RGB9_E5),j===i.UNSIGNED_INT_10F_11F_11F_REV&&(te=i.R11F_G11F_B10F)),S===i.RGBA){let ne=xe?Xa:bt.getTransfer(oe);j===i.FLOAT&&(te=i.RGBA32F),j===i.HALF_FLOAT&&(te=i.RGBA16F),j===i.UNSIGNED_BYTE&&(te=ne===Rt?i.SRGB8_ALPHA8:i.RGBA8),j===i.UNSIGNED_SHORT&&Te&&(te=Te.RGBA16_EXT),j===i.SHORT&&Te&&(te=Te.RGBA16_SNORM_EXT),j===i.UNSIGNED_SHORT_4_4_4_4&&(te=i.RGBA4),j===i.UNSIGNED_SHORT_5_5_5_1&&(te=i.RGB5_A1)}return(te===i.R16F||te===i.R32F||te===i.RG16F||te===i.RG32F||te===i.RGBA16F||te===i.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function g(C,S){let j;return C?S===null||S===mi||S===lr?j=i.DEPTH24_STENCIL8:S===Xn?j=i.DEPTH32F_STENCIL8:S===ca&&(j=i.DEPTH24_STENCIL8,We("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===mi||S===lr?j=i.DEPTH_COMPONENT24:S===Xn?j=i.DEPTH_COMPONENT32F:S===ca&&(j=i.DEPTH_COMPONENT16),j}function M(C,S){return v(C)===!0||C.isFramebufferTexture&&C.minFilter!==Kt&&C.minFilter!==en?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function k(C){let S=new WeakRef(C);n.get(C).__ref=S,m.add(S),_.register(C,S,S)}function I(C){let S=n.get(C).__ref;S!==void 0&&(m.delete(S),_.unregister(S))}function U(C){J(C.target)}function V(C){R(C.target)}function J(C){C.removeEventListener("dispose",U),I(C),F(C),C.isVideoTexture&&h.delete(C),C.isHTMLTexture&&u.delete(C)}function R(C){C.removeEventListener("dispose",V),I(C),W(C)}function P(){for(let C of m){let S=C.deref();S!==void 0&&(S.isRenderTarget===!0?R(S):J(S))}m.clear(),u.clear()}function F(C){let S=n.get(C);if(S.__webglInit===void 0)return;let j=C.source,ue=f.get(j);if(ue){let oe=ue[S.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&O(C),Object.keys(ue).length===0&&f.delete(j)}n.remove(C)}function O(C){let S=n.get(C);i.deleteTexture(S.__webglTexture);let j=C.source,ue=f.get(j);delete ue[S.__cacheKey],a.memory.textures--}function W(C){let S=n.get(C);S.__depthDisposeCallback&&S.__depthDisposeCallback();let j=C.depthTexture;if(j&&j.renderTarget===C&&J(j),C.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(S.__webglFramebuffer[oe]))for(let xe=0;xe<S.__webglFramebuffer[oe].length;xe++)i.deleteFramebuffer(S.__webglFramebuffer[oe][xe]);else i.deleteFramebuffer(S.__webglFramebuffer[oe]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[oe])}else{if(Array.isArray(S.__webglFramebuffer))for(let oe=0;oe<S.__webglFramebuffer.length;oe++)i.deleteFramebuffer(S.__webglFramebuffer[oe]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let oe=0;oe<S.__webglColorRenderbuffer.length;oe++)S.__webglColorRenderbuffer[oe]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[oe]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let ue=C.textures;for(let oe=0,xe=ue.length;oe<xe;oe++){let Te=n.get(ue[oe]);Te.__webglTexture&&(i.deleteTexture(Te.__webglTexture),a.memory.textures--),n.remove(ue[oe])}n.remove(C)}let N=0;function H(){N=0}function q(){return N}function ce(C){N=C}function Pe(){let C=N;return C>=s.maxTextures&&We("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,C}function $(C){let S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.mipmapsAutoUpdate),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function de(C,S){let j=n.get(C);if(C.isVideoTexture&&Vt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&j.__version!==C.version){let ue=C.image;if(ue===null)We("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)We("WebGLRenderer: Texture marked for update but image is incomplete");else{me(j,C,S);return}}else C.isExternalTexture&&(j.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,j.__webglTexture,i.TEXTURE0+S)}function Ae(C,S){let j=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&j.__version!==C.version){me(j,C,S);return}else C.isExternalTexture&&(j.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,j.__webglTexture,i.TEXTURE0+S)}function Xe(C,S){let j=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&j.__version!==C.version){me(j,C,S);return}t.bindTexture(i.TEXTURE_3D,j.__webglTexture,i.TEXTURE0+S)}function Me(C,S){let j=n.get(C);if(C.version>0&&j.__version!==C.version){Ie(j,C,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture,i.TEXTURE0+S)}let je={[Qn]:i.REPEAT,[vn]:i.CLAMP_TO_EDGE,[Gr]:i.MIRRORED_REPEAT},At={[Kt]:i.NEAREST,[vl]:i.NEAREST_MIPMAP_NEAREST,[cr]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[oa]:i.LINEAR_MIPMAP_NEAREST,[ni]:i.LINEAR_MIPMAP_LINEAR},Ye={[mm]:i.NEVER,[ed]:i.ALWAYS,[gm]:i.LESS,[$u]:i.LEQUAL,[bm]:i.EQUAL,[Qu]:i.GEQUAL,[xm]:i.GREATER,[_m]:i.NOTEQUAL};function at(C,S){if(S.type===Xn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===en||S.magFilter===oa||S.magFilter===cr||S.magFilter===ni||S.minFilter===en||S.minFilter===oa||S.minFilter===cr||S.minFilter===ni)&&We("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,je[S.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,je[S.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,je[S.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,At[S.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,At[S.minFilter]),S.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Ye[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Kt||S.minFilter!==cr&&S.minFilter!==ni||S.type===Xn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let j=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function ht(C,S){let j=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",U),k(S));let ue=S.source,oe=f.get(ue);oe===void 0&&(oe={},f.set(ue,oe));let xe=$(S);if(xe!==C.__cacheKey){oe[xe]===void 0&&(oe[xe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,j=!0),oe[xe].usedTimes++;let Te=oe[C.__cacheKey];Te!==void 0&&(oe[C.__cacheKey].usedTimes--,Te.usedTimes===0&&O(S)),C.__cacheKey=xe,C.__webglTexture=oe[xe].texture}return j}function ae(C,S,j){return Math.floor(Math.floor(C/j)/S)}function ge(C,S,j,ue){let xe=C.updateRanges;if(xe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,j,ue,S.data);else{xe.sort((B,ie)=>B.start-ie.start);let Te=0;for(let B=1;B<xe.length;B++){let ie=xe[Te],Q=xe[B],ve=ie.start+ie.count,pe=ae(Q.start,S.width,4),_e=ae(ie.start,S.width,4);Q.start<=ve+1&&pe===_e&&ae(Q.start+Q.count-1,S.width,4)===pe?ie.count=Math.max(ie.count,Q.start+Q.count-ie.start):(++Te,xe[Te]=Q)}xe.length=Te+1;let te=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),ye=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let B=0,ie=xe.length;B<ie;B++){let Q=xe[B],ve=Math.floor(Q.start/4),pe=Math.ceil(Q.count/4),_e=ve%S.width,Je=Math.floor(ve/S.width),dt=pe,fe=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,_e),t.pixelStorei(i.UNPACK_SKIP_ROWS,Je),t.texSubImage2D(i.TEXTURE_2D,0,_e,Je,dt,fe,j,ue,S.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,te),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,ye)}}function me(C,S,j){let ue=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ue=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ue=i.TEXTURE_3D);let oe=ht(C,S),xe=S.source;t.bindTexture(ue,C.__webglTexture,i.TEXTURE0+j);let Te=n.get(xe);if(xe.version!==Te.__version||oe===!0){if(t.activeTexture(i.TEXTURE0+j),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let fe=bt.getPrimaries(bt.workingColorSpace),Ze=S.colorSpace===si?null:bt.getPrimaries(S.colorSpace),ut=S.colorSpace===si||fe===Ze?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let ne=x(S.image,!1,s.maxTextureSize);ne=$e(S,ne);let ye=r.convert(S.format,S.colorSpace),B=r.convert(S.type),ie=E(S.internalFormat,ye,B,S.normalized,S.colorSpace,S.isVideoTexture);at(ue,S);let Q,ve=S.mipmaps,pe=S.isVideoTexture!==!0,_e=Te.__version===void 0||oe===!0,Je=xe.dataReady,dt=M(S,ne);if(S.isDepthTexture)ie=g(S.format===is,S.type),_e&&(pe?t.texStorage2D(i.TEXTURE_2D,1,ie,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,ie,ne.width,ne.height,0,ye,B,null));else if(S.isDataTexture)if(ve.length>0){pe&&_e&&t.texStorage2D(i.TEXTURE_2D,dt,ie,ve[0].width,ve[0].height);for(let fe=0,Ze=ve.length;fe<Ze;fe++)Q=ve[fe],pe?Je&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,Q.width,Q.height,ye,B,Q.data):t.texImage2D(i.TEXTURE_2D,fe,ie,Q.width,Q.height,0,ye,B,Q.data);S.generateMipmaps=!1}else pe?(_e&&t.texStorage2D(i.TEXTURE_2D,dt,ie,ne.width,ne.height),Je&&ge(S,ne,ye,B)):t.texImage2D(i.TEXTURE_2D,0,ie,ne.width,ne.height,0,ye,B,ne.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){pe&&_e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,dt,ie,ve[0].width,ve[0].height,ne.depth);for(let fe=0,Ze=ve.length;fe<Ze;fe++)if(Q=ve[fe],S.format!==ii)if(ye!==null)if(pe){if(Je)if(S.layerUpdates.size>0){let ut=dd(Q.width,Q.height,S.format,S.type);for(let Re of S.layerUpdates){let Ct=Q.data.subarray(Re*ut/Q.data.BYTES_PER_ELEMENT,(Re+1)*ut/Q.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,Re,Q.width,Q.height,1,ye,Ct)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,0,Q.width,Q.height,ne.depth,ye,Q.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,fe,ie,Q.width,Q.height,ne.depth,0,Q.data,0,0);else We("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else pe?Je&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,0,Q.width,Q.height,ne.depth,ye,B,Q.data):t.texImage3D(i.TEXTURE_2D_ARRAY,fe,ie,Q.width,Q.height,ne.depth,0,ye,B,Q.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{pe&&_e&&t.texStorage2D(i.TEXTURE_2D,dt,ie,ve[0].width,ve[0].height);for(let fe=0,Ze=ve.length;fe<Ze;fe++)Q=ve[fe],S.format!==ii?ye!==null?pe?Je&&t.compressedTexSubImage2D(i.TEXTURE_2D,fe,0,0,Q.width,Q.height,ye,Q.data):t.compressedTexImage2D(i.TEXTURE_2D,fe,ie,Q.width,Q.height,0,Q.data):We("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pe?Je&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,Q.width,Q.height,ye,B,Q.data):t.texImage2D(i.TEXTURE_2D,fe,ie,Q.width,Q.height,0,ye,B,Q.data)}else if(S.isDataArrayTexture)if(pe){if(_e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,dt,ie,ne.width,ne.height,ne.depth),Je)if(S.layerUpdates.size>0){let fe=dd(ne.width,ne.height,S.format,S.type);for(let Ze of S.layerUpdates){let ut=ne.data.subarray(Ze*fe/ne.data.BYTES_PER_ELEMENT,(Ze+1)*fe/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ze,ne.width,ne.height,1,ye,B,ut)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ye,B,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ie,ne.width,ne.height,ne.depth,0,ye,B,ne.data);else if(S.isData3DTexture)pe?(_e&&t.texStorage3D(i.TEXTURE_3D,dt,ie,ne.width,ne.height,ne.depth),Je&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ye,B,ne.data)):t.texImage3D(i.TEXTURE_3D,0,ie,ne.width,ne.height,ne.depth,0,ye,B,ne.data);else if(S.isFramebufferTexture){if(_e)if(pe)t.texStorage2D(i.TEXTURE_2D,dt,ie,ne.width,ne.height);else{let fe=ne.width,Ze=ne.height;for(let ut=0;ut<dt;ut++)t.texImage2D(i.TEXTURE_2D,ut,ie,fe,Ze,0,ye,B,null),fe>>=1,Ze>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){let fe=i.canvas;if(fe.hasAttribute("layoutsubtree")||fe.setAttribute("layoutsubtree","true"),ne.parentNode!==fe){fe.appendChild(ne),u.add(S),fe.onpaint=Ze=>{let ut=Ze.changedElements;for(let Re of u)ut.includes(Re.image)&&(Re.needsUpdate=!0)},fe.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{let ut=i.RGBA,Re=i.RGBA,Ct=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ut,Re,Ct,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ve.length>0){if(pe&&_e){let fe=nt(ve[0]);t.texStorage2D(i.TEXTURE_2D,dt,ie,fe.width,fe.height)}for(let fe=0,Ze=ve.length;fe<Ze;fe++)Q=ve[fe],pe?Je&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,ye,B,Q):t.texImage2D(i.TEXTURE_2D,fe,ie,ye,B,Q);S.generateMipmaps=!1}else if(pe){if(_e){let fe=nt(ne);t.texStorage2D(i.TEXTURE_2D,dt,ie,fe.width,fe.height)}Je&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ye,B,ne)}else t.texImage2D(i.TEXTURE_2D,0,ie,ye,B,ne);v(S)&&S.mipmapsAutoUpdate===!0&&y(ue),Te.__version=xe.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function Ie(C,S,j){if(S.image.length!==6)return;let ue=ht(C,S),oe=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+j);let xe=n.get(oe);if(oe.version!==xe.__version||ue===!0){t.activeTexture(i.TEXTURE0+j);let Te=bt.getPrimaries(bt.workingColorSpace),te=S.colorSpace===si?null:bt.getPrimaries(S.colorSpace),ne=S.colorSpace===si||Te===te?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let ye=S.isCompressedTexture||S.image[0].isCompressedTexture,B=S.image[0]&&S.image[0].isDataTexture,ie=[];for(let Re=0;Re<6;Re++)!ye&&!B?ie[Re]=x(S.image[Re],!0,s.maxCubemapSize):ie[Re]=B?S.image[Re].image:S.image[Re],ie[Re]=$e(S,ie[Re]);let Q=ie[0],ve=r.convert(S.format,S.colorSpace),pe=r.convert(S.type),_e=E(S.internalFormat,ve,pe,S.normalized,S.colorSpace),Je=S.isVideoTexture!==!0,dt=xe.__version===void 0||ue===!0,fe=oe.dataReady,Ze=M(S,Q);at(i.TEXTURE_CUBE_MAP,S);let ut;if(S.isDepthTexture){if(_e=g(S.format===is,S.type),dt)if(Je)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,_e,Q.width,Q.height);else for(let Re=0;Re<6;Re++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,_e,Q.width,Q.height,0,ve,pe,null)}else if(ye){Je&&dt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ze,_e,Q.width,Q.height);for(let Re=0;Re<6;Re++){ut=ie[Re].mipmaps;for(let Ct=0;Ct<ut.length;Ct++){let rn=ut[Ct];S.format!==ii?ve!==null?Je?fe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct,0,0,rn.width,rn.height,ve,rn.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct,_e,rn.width,rn.height,0,rn.data):We("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct,0,0,rn.width,rn.height,ve,pe,rn.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct,_e,rn.width,rn.height,0,ve,pe,rn.data)}}}else{if(ut=S.mipmaps,Je&&dt){ut.length>0&&Ze++;let Re=nt(ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ze,_e,Re.width,Re.height)}for(let Re=0;Re<6;Re++)if(B){Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,0,0,ie[Re].width,ie[Re].height,ve,pe,ie[Re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,_e,ie[Re].width,ie[Re].height,0,ve,pe,ie[Re].data);for(let Ct=0;Ct<ut.length;Ct++){let ls=ut[Ct].image[Re].image;Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct+1,0,0,ls.width,ls.height,ve,pe,ls.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct+1,_e,ls.width,ls.height,0,ve,pe,ls.data)}}else{Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,0,0,ve,pe,ie[Re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,_e,ve,pe,ie[Re]);for(let Ct=0;Ct<ut.length;Ct++){let rn=ut[Ct];Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct+1,0,0,ve,pe,rn.image[Re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ct+1,_e,ve,pe,rn.image[Re])}}}v(S)&&S.mipmapsAutoUpdate===!0&&y(i.TEXTURE_CUBE_MAP),xe.__version=oe.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function we(C,S,j,ue,oe,xe){let Te=r.convert(j.format,j.colorSpace),te=r.convert(j.type),ne=E(j.internalFormat,Te,te,j.normalized,j.colorSpace),ye=n.get(S),B=n.get(j);if(B.__renderTarget=S,!ye.__hasExternalTextures){let ie=Math.max(1,S.width>>xe),Q=Math.max(1,S.height>>xe);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,xe,ne,ie,Q,S.depth,0,Te,te,null):t.texImage2D(oe,xe,ne,ie,Q,0,Te,te,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),be(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ue,oe,B.__webglTexture,0,gt(S)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ue,oe,B.__webglTexture,xe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ot(C,S,j){if(i.bindRenderbuffer(i.RENDERBUFFER,C),S.depthBuffer){let ue=S.depthTexture,oe=ue&&ue.isDepthTexture?ue.type:null,xe=g(S.stencilBuffer,oe),Te=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;be(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(S),xe,S.width,S.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(S),xe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xe,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,C)}else{let ue=S.textures;for(let oe=0;oe<ue.length;oe++){let xe=ue[oe],Te=r.convert(xe.format,xe.colorSpace),te=r.convert(xe.type),ne=E(xe.internalFormat,Te,te,xe.normalized,xe.colorSpace);be(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(S),ne,S.width,S.height):j?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(S),ne,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,ne,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function De(C,S,j){let ue=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let oe=n.get(S.depthTexture);oe.__renderTarget=S;let xe=ue?S.depthTexture.image[0]:S.depthTexture.image;(!oe.__webglTexture||xe.width!==S.width||xe.height!==S.height)&&(xe.width=S.width,xe.height=S.height,S.depthTexture.needsUpdate=!0),ue?Me(S.depthTexture,0):de(S.depthTexture,0);let Te=oe.__webglTexture,te=gt(S),ne=ue?i.TEXTURE_CUBE_MAP_POSITIVE_X+j:i.TEXTURE_2D,ye=S.depthTexture.format===is?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===Xi)be(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ye,ne,Te,0,te):i.framebufferTexture2D(i.FRAMEBUFFER,ye,ne,Te,0);else if(S.depthTexture.format===is)be(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ye,ne,Te,0,te):i.framebufferTexture2D(i.FRAMEBUFFER,ye,ne,Te,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function D(C){let S=n.get(C),j=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){let ue=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ue){let oe=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ue.removeEventListener("dispose",oe)};ue.addEventListener("dispose",oe),S.__depthDisposeCallback=oe}S.__boundDepthTexture=ue}if(C.depthTexture&&!S.__autoAllocateDepthBuffer)if(j)for(let ue=0;ue<6;ue++)De(S.__webglFramebuffer[ue],C,ue);else C.texture.mipmaps.length>0?De(S.__webglFramebuffer[0],C,0):De(S.__webglFramebuffer,C,0);else if(j){S.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[ue]),S.__webglDepthbuffer[ue]===void 0)S.__webglDepthbuffer[ue]=i.createRenderbuffer(),ot(S.__webglDepthbuffer[ue],C,!1);else{let oe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=S.__webglDepthbuffer[ue];i.bindRenderbuffer(i.RENDERBUFFER,xe),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,xe)}}else if(C.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),ot(S.__webglDepthbuffer,C,!1);else{let oe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,xe),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,xe)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Z(C,S,j){let ue=n.get(C);S!==void 0&&we(ue.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),j!==void 0&&D(C)}function le(C){let S=C.texture,j=n.get(C),ue=n.get(S);C.addEventListener("dispose",V),k(C);let oe=C.textures,xe=C.isWebGLCubeRenderTarget===!0,Te=oe.length>1;if(Te||(ue.__webglTexture===void 0&&(ue.__webglTexture=i.createTexture()),ue.__version=S.version,a.memory.textures++),xe){j.__webglFramebuffer=[];for(let te=0;te<6;te++)if(S.mipmaps.length>0){j.__webglFramebuffer[te]=[];for(let ne=0;ne<S.mipmaps.length;ne++)j.__webglFramebuffer[te][ne]=i.createFramebuffer()}else j.__webglFramebuffer[te]=i.createFramebuffer()}else{if(S.mipmaps.length>0){j.__webglFramebuffer=[];for(let te=0;te<S.mipmaps.length;te++)j.__webglFramebuffer[te]=i.createFramebuffer()}else j.__webglFramebuffer=i.createFramebuffer();if(Te)for(let te=0,ne=oe.length;te<ne;te++){let ye=n.get(oe[te]);ye.__webglTexture===void 0&&(ye.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&be(C)===!1){j.__webglMultisampledFramebuffer=i.createFramebuffer(),j.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let te=0;te<oe.length;te++){let ne=oe[te];j.__webglColorRenderbuffer[te]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,j.__webglColorRenderbuffer[te]);let ye=r.convert(ne.format,ne.colorSpace),B=r.convert(ne.type),ie=E(ne.internalFormat,ye,B,ne.normalized,ne.colorSpace,C.isXRRenderTarget===!0),Q=gt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,ie,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+te,i.RENDERBUFFER,j.__webglColorRenderbuffer[te])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(j.__webglDepthRenderbuffer=i.createRenderbuffer(),ot(j.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(xe){t.bindTexture(i.TEXTURE_CUBE_MAP,ue.__webglTexture),at(i.TEXTURE_CUBE_MAP,S);for(let te=0;te<6;te++)if(S.mipmaps.length>0)for(let ne=0;ne<S.mipmaps.length;ne++)we(j.__webglFramebuffer[te][ne],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ne);else we(j.__webglFramebuffer[te],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);v(S)?y(i.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(Te){for(let te=0,ne=oe.length;te<ne;te++){let ye=oe[te],B=n.get(ye),ie=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ie=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,B.__webglTexture),at(ie,ye),we(j.__webglFramebuffer,C,ye,i.COLOR_ATTACHMENT0+te,ie,0),v(ye)&&y(ie)}t.unbindTexture()}else{let te=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(te=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(te,ue.__webglTexture),at(te,S),S.mipmaps.length>0)for(let ne=0;ne<S.mipmaps.length;ne++)we(j.__webglFramebuffer[ne],C,S,i.COLOR_ATTACHMENT0,te,ne);else we(j.__webglFramebuffer,C,S,i.COLOR_ATTACHMENT0,te,0);v(S)?y(te):S.mipmaps.length>0&&i.texParameteri(te,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}C.depthBuffer&&D(C)}function L(C){let S=C.textures;for(let j=0,ue=S.length;j<ue;j++){let oe=S[j];if(v(oe)&&oe.mipmapsAutoUpdate===!0){let xe=T(C),Te=n.get(oe).__webglTexture;t.bindTexture(xe,Te),y(xe),t.unbindTexture()}}}let Ke=[];function Oe(C){if(C.samples>0){if(be(C)===!1){let S=C.textures,j=C.width,ue=C.height,oe=i.COLOR_BUFFER_BIT,xe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(C),te=S.length>1;if(te)for(let ye=0;ye<S.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ye=0;ye<S.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),te){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);let B=n.get(S[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,B,0)}i.blitFramebuffer(0,0,j,ue,0,0,j,ue,oe,i.NEAREST),l===!0&&(Ke.length=0,Ke.push(i.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&Ke.push(xe),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ke))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),te)for(let ye=0;ye<S.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);let B=n.get(S[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,B,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let S=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function gt(C){return Math.min(s.maxSamples,C.samples)}function be(C){let S=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Vt(C){let S=a.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function $e(C,S){let j=C.colorSpace,ue=C.format,oe=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||j!==Tn&&j!==si&&(bt.getTransfer(j)===Rt?(ue!==ii||oe!==Nn)&&We("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):et("WebGLTextures: Unsupported texture color space:",j)),S}function nt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=Pe,this.resetTextureUnits=H,this.getTextureUnits=q,this.setTextureUnits=ce,this.setTexture2D=de,this.setTexture2DArray=Ae,this.setTexture3D=Xe,this.setTextureCube=Me,this.rebindTextures=Z,this.setupRenderTarget=le,this.updateRenderTargetMipmap=L,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=D,this.setupFrameBufferTexture=we,this.useMultisampledRTT=be,this.dispose=P}function SM(i,e){function t(n,s=si){let r,a=bt.getTransfer(s);if(n===Nn)return i.UNSIGNED_BYTE;if(n===Sl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===wl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ju)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ku)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===qu)return i.BYTE;if(n===Xu)return i.SHORT;if(n===ca)return i.UNSIGNED_SHORT;if(n===Ml)return i.INT;if(n===mi)return i.UNSIGNED_INT;if(n===Xn)return i.FLOAT;if(n===gi)return i.HALF_FLOAT;if(n===Ju)return i.ALPHA;if(n===Yu)return i.RGB;if(n===ii)return i.RGBA;if(n===Xi)return i.DEPTH_COMPONENT;if(n===is)return i.DEPTH_STENCIL;if(n===Tl)return i.RED;if(n===El)return i.RED_INTEGER;if(n===ws)return i.RG;if(n===Al)return i.RG_INTEGER;if(n===Rl)return i.RGBA_INTEGER;if(n===Ro||n===Co||n===Po||n===Io)if(a===Rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ro)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ro)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Io)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Cl||n===Pl||n===Il||n===Ll)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dl||n===Nl||n===Fl||n===Ul||n===kl||n===Lo||n===Ol)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dl||n===Nl)return a===Rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Fl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ul)return r.COMPRESSED_R11_EAC;if(n===kl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Lo)return r.COMPRESSED_RG11_EAC;if(n===Ol)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Bl||n===zl||n===Gl||n===Hl||n===Vl||n===Wl||n===ql||n===Xl||n===jl||n===Kl||n===Jl||n===Yl||n===Zl||n===$l)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Bl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Gl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Hl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Vl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ql)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Xl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Kl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Yl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Zl)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$l)return a===Rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ql||n===eh||n===th)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ql)return a===Rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===eh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===th)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nh||n===ih||n===Do||n===sh)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===nh)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ih)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Do)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===lr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var wM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ed=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new co(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ei({vertexShader:wM,fragmentShader:TM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _t(new Tt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ad=class extends fi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,_=typeof XRWebGLBinding<"u",b=new Ed,p={},x=t.getContextAttributes(),v=null,y=null,T=[],E=[],g=new he,M=null,k=null,I=new Qt;I.viewport=new Pt;let U=new Qt;U.viewport=new Pt;let V=[I,U],J=new ml,R=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let de=T[$];return de===void 0&&(de=new Xr,T[$]=de),de.getTargetRaySpace()},this.getControllerGrip=function($){let de=T[$];return de===void 0&&(de=new Xr,T[$]=de),de.getGripSpace()},this.getHand=function($){let de=T[$];return de===void 0&&(de=new Xr,T[$]=de),de.getHandSpace()};function F($){let de=E.indexOf($.inputSource);if(de===-1)return;let Ae=T[de];Ae!==void 0&&(Ae.update($.inputSource,$.frame,c||a),Ae.dispatchEvent({type:$.type,data:$.inputSource}))}function O(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",W);for(let $=0;$<T.length;$++){let de=E[$];de!==null&&(E[$]=null,T[$].disconnect(de))}R=null,P=null,b.reset();for(let $ in p)delete p[$];if(e.setRenderTarget(v),f=null,d=null,u=null,s=null,y=null,Pe.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(g.width,g.height,!1),k!==null){let $=k.camera;$.fov=k.fov,$.zoom=k.zoom,$.updateProjectionMatrix(),k=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&We("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&We("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",O),s.addEventListener("inputsourceschange",W),x.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(g),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,Xe=null,Me=null;x.depth&&(Me=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=x.stencil?is:Xi,Xe=x.stencil?lr:mi);let je={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(je),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Wn(d.textureWidth,d.textureHeight,{format:ii,type:Nn,depthTexture:new Ji(d.textureWidth,d.textureHeight,Xe,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let Ae={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Wn(f.framebufferWidth,f.framebufferHeight,{format:ii,type:Nn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Pe.setContext(s),Pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function W($){for(let de=0;de<$.removed.length;de++){let Ae=$.removed[de],Xe=E.indexOf(Ae);Xe>=0&&(E[Xe]=null,T[Xe].disconnect(Ae))}for(let de=0;de<$.added.length;de++){let Ae=$.added[de],Xe=E.indexOf(Ae);if(Xe===-1){for(let je=0;je<T.length;je++)if(je>=E.length){E.push(Ae),Xe=je;break}else if(E[je]===null){E[je]=Ae,Xe=je;break}if(Xe===-1)break}let Me=T[Xe];Me&&Me.connect(Ae)}}function N($,de){de===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(de.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let de=$.near,Ae=$.far;b.texture!==null&&(b.depthNear>0&&(de=b.depthNear),b.depthFar>0&&(Ae=b.depthFar)),J.near=U.near=I.near=de,J.far=U.far=I.far=Ae,(R!==J.near||P!==J.far)&&(s.updateRenderState({depthNear:J.near,depthFar:J.far}),R=J.near,P=J.far),J.layers.mask=$.layers.mask|6,I.layers.mask=J.layers.mask&-5,U.layers.mask=J.layers.mask&-3;let Xe=$.parent,Me=J.cameras;N(J,Xe);for(let je=0;je<Me.length;je++)N(Me[je],Xe);J.projectionMatrix.copy(I.projectionMatrix),J.projectionMatrixInverse.copy(I.projectionMatrixInverse),k===null&&$.isPerspectiveCamera&&(k={camera:$,fov:$.fov,zoom:$.zoom}),H($,J,Xe)};function H($,de,Ae){Ae===null?$.matrix.copy(de.matrixWorld):($.matrix.copy(Ae.matrixWorld),$.matrix.invert(),$.matrix.multiply(de.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(de.projectionMatrix),$.projectionMatrixInverse.copy(de.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Ks*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(J)},this.getCameraTexture=function($){return p[$]};let q=null;function ce($,de){if(h=de.getViewerPose(c||a),m=de,h!==null){let Ae=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Xe=!1;Ae.length!==J.cameras.length&&(J.cameras.length=0,Xe=!0);for(let Ye=0;Ye<Ae.length;Ye++){let at=Ae[Ye],ht=null;if(f!==null)ht=f.getViewport(at);else{let ge=u.getViewSubImage(d,at);ht=ge.viewport,Ye===0&&(e.setRenderTargetTextures(y,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(y))}let ae=V[Ye];ae===void 0&&(ae=new Qt,ae.layers.enable(Ye),ae.viewport=new Pt,V[Ye]=ae),ae.matrix.fromArray(at.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(at.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(ht.x,ht.y,ht.width,ht.height),Ye===0&&(J.matrix.copy(ae.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),Xe===!0&&J.cameras.push(ae)}let Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let Ye=u.getDepthInformation(Ae[0]);Ye&&Ye.isValid&&Ye.texture&&b.init(Ye,s.renderState)}if(Me&&Me.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ye=0;Ye<Ae.length;Ye++){let at=Ae[Ye].camera;if(at){let ht=p[at];ht||(ht=new co,p[at]=ht);let ae=u.getCameraImage(at);ht.sourceTexture=ae}}}}for(let Ae=0;Ae<T.length;Ae++){let Xe=E[Ae],Me=T[Ae];Xe!==null&&Me!==void 0&&Me.update(Xe,de,c||a)}q&&q($,de),de.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:de}),m=null}let Pe=new e0;Pe.setAnimationLoop(ce),this.setAnimationLoop=function($){q=$},this.dispose=function(){}}},EM=new tt,h0=new rt;h0.set(-1,0,0,0,1,0,0,0,1);function AM(i,e){function t(b,p){b.matrixAutoUpdate===!0&&b.updateMatrix(),p.value.copy(b.matrix)}function n(b,p){p.color.getRGB(b.fogColor.value,ld(i)),p.isFog?(b.fogNear.value=p.near,b.fogFar.value=p.far):p.isFogExp2&&(b.fogDensity.value=p.density)}function s(b,p,x,v,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(b,p):p.isMeshLambertMaterial?(r(b,p),p.envMap&&(b.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(b,p),u(b,p)):p.isMeshPhongMaterial?(r(b,p),h(b,p),p.envMap&&(b.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(b,p),d(b,p),p.isMeshPhysicalMaterial&&f(b,p,y)):p.isMeshMatcapMaterial?(r(b,p),m(b,p)):p.isMeshDepthMaterial?r(b,p):p.isMeshDistanceMaterial?(r(b,p),_(b,p)):p.isMeshNormalMaterial?r(b,p):p.isLineBasicMaterial?(a(b,p),p.isLineDashedMaterial&&o(b,p)):p.isPointsMaterial?l(b,p,x,v):p.isSpriteMaterial?c(b,p):p.isShadowMaterial?(b.color.value.copy(p.color),b.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(b,p){b.opacity.value=p.opacity,p.color&&b.diffuse.value.copy(p.color),p.emissive&&b.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(b.map.value=p.map,t(p.map,b.mapTransform)),p.alphaMap&&(b.alphaMap.value=p.alphaMap,t(p.alphaMap,b.alphaMapTransform)),p.bumpMap&&(b.bumpMap.value=p.bumpMap,t(p.bumpMap,b.bumpMapTransform),b.bumpScale.value=p.bumpScale,p.side===un&&(b.bumpScale.value*=-1)),p.normalMap&&(b.normalMap.value=p.normalMap,t(p.normalMap,b.normalMapTransform),b.normalScale.value.copy(p.normalScale),p.side===un&&b.normalScale.value.negate()),p.displacementMap&&(b.displacementMap.value=p.displacementMap,t(p.displacementMap,b.displacementMapTransform),b.displacementScale.value=p.displacementScale,b.displacementBias.value=p.displacementBias),p.emissiveMap&&(b.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,b.emissiveMapTransform)),p.specularMap&&(b.specularMap.value=p.specularMap,t(p.specularMap,b.specularMapTransform)),p.alphaTest>0&&(b.alphaTest.value=p.alphaTest);let x=e.get(p),v=x.envMap,y=x.envMapRotation;v&&(b.envMap.value=v,b.envMapRotation.value.setFromMatrix4(EM.makeRotationFromEuler(y)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&b.envMapRotation.value.premultiply(h0),b.reflectivity.value=p.reflectivity,b.ior.value=p.ior,b.refractionRatio.value=p.refractionRatio),p.lightMap&&(b.lightMap.value=p.lightMap,b.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,b.lightMapTransform)),p.aoMap&&(b.aoMap.value=p.aoMap,b.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,b.aoMapTransform))}function a(b,p){b.diffuse.value.copy(p.color),b.opacity.value=p.opacity,p.map&&(b.map.value=p.map,t(p.map,b.mapTransform))}function o(b,p){b.dashSize.value=p.dashSize,b.totalSize.value=p.dashSize+p.gapSize,b.scale.value=p.scale}function l(b,p,x,v){b.diffuse.value.copy(p.color),b.opacity.value=p.opacity,b.size.value=p.size*x,b.scale.value=v*.5,p.map&&(b.map.value=p.map,t(p.map,b.uvTransform)),p.alphaMap&&(b.alphaMap.value=p.alphaMap,t(p.alphaMap,b.alphaMapTransform)),p.alphaTest>0&&(b.alphaTest.value=p.alphaTest)}function c(b,p){b.diffuse.value.copy(p.color),b.opacity.value=p.opacity,b.rotation.value=p.rotation,p.map&&(b.map.value=p.map,t(p.map,b.mapTransform)),p.alphaMap&&(b.alphaMap.value=p.alphaMap,t(p.alphaMap,b.alphaMapTransform)),p.alphaTest>0&&(b.alphaTest.value=p.alphaTest)}function h(b,p){b.specular.value.copy(p.specular),b.shininess.value=Math.max(p.shininess,1e-4)}function u(b,p){p.gradientMap&&(b.gradientMap.value=p.gradientMap)}function d(b,p){b.metalness.value=p.metalness,p.metalnessMap&&(b.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,b.metalnessMapTransform)),b.roughness.value=p.roughness,p.roughnessMap&&(b.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,b.roughnessMapTransform)),p.envMap&&(b.envMapIntensity.value=p.envMapIntensity)}function f(b,p,x){b.ior.value=p.ior,p.diffuseRoughness>0&&(b.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(b.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,b.diffuseRoughnessMapTransform))),p.sheen>0&&(b.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),b.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(b.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,b.sheenColorMapTransform)),p.sheenRoughnessMap&&(b.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,b.sheenRoughnessMapTransform))),p.clearcoat>0&&(b.clearcoat.value=p.clearcoat,b.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(b.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,b.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(b.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,b.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(b.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,b.clearcoatNormalMapTransform),b.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===un&&b.clearcoatNormalScale.value.negate())),p.dispersion>0&&(b.dispersion.value=p.dispersion),p.retroreflectivity>0&&(b.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(b.iridescence.value=p.iridescence,b.iridescenceIOR.value=p.iridescenceIOR,b.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,b.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(b.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,b.iridescenceMapTransform)),p.iridescenceThicknessMap&&(b.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,b.iridescenceThicknessMapTransform))),p.transmission>0&&(b.transmission.value=p.transmission,b.transmissionSamplerMap.value=x.texture,b.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(b.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,b.transmissionMapTransform)),b.thickness.value=p.thickness,p.thicknessMap&&(b.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,b.thicknessMapTransform)),b.attenuationDistance.value=p.attenuationDistance,b.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(b.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(b.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,b.anisotropyMapTransform))),b.specularIntensity.value=p.specularIntensity,b.specularColor.value.copy(p.specularColor),p.specularColorMap&&(b.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,b.specularColorMapTransform)),p.specularIntensityMap&&(b.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,b.specularIntensityMapTransform))}function m(b,p){p.matcap&&(b.matcap.value=p.matcap)}function _(b,p){let x=e.get(p).light;b.referencePosition.value.setFromMatrixPosition(x.matrixWorld),b.nearDistance.value=x.shadow.camera.near,b.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function RM(i,e,t,n){let s={},r={};function a(x,v){let y=v.program;n.uniformBlockBinding(x,y,s[x.id])}function o(x,v){let y=s[x.id];y===void 0&&(m(x),y=l(x),s[x.id]=y,x.addEventListener("dispose",b));let T=v.program;n.updateUBOMapping(x,T);let E=e.render.frame;r[x.id]!==E&&(c(x),r[x.id]=E)}function l(x){let v=i.createBuffer(),y=x.__size,T=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,y,T),i.bindBuffer(i.UNIFORM_BUFFER,null),v}function c(x){let v=s[x.id],y=x.uniforms,T=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let E=0,g=y.length;E<g;E++){let M=y[E];if(Array.isArray(M))for(let k=0,I=M.length;k<I;k++)h(M[k],E,k,T);else h(M,E,0,T)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(x,v,y,T){if(d(x,v,y,T)===!0){let E=x.__offset,g=x.value;if(Array.isArray(g)){let M=0;for(let k=0;k<g.length;k++){let I=g[k],U=_(I,!0);u(I,x.__data,M),M+=U.storage/Float32Array.BYTES_PER_ELEMENT}}else u(g,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,E,x.__data)}}function u(x,v,y){typeof x=="number"||typeof x=="boolean"?v[y]=x:x.isMatrix3?(v[y]=x.elements[0],v[y+1]=x.elements[1],v[y+2]=x.elements[2],v[y+3]=0,v[y+4]=x.elements[3],v[y+5]=x.elements[4],v[y+6]=x.elements[5],v[y+7]=0,v[y+8]=x.elements[6],v[y+9]=x.elements[7],v[y+10]=x.elements[8],v[y+11]=0):ArrayBuffer.isView(x)?v.set(x.subarray(0,v.length-y),y):x.toArray(v,y)}function d(x,v,y,T){let E=x.value,g=v+"_"+y;if(Array.isArray(E)){T[g]===void 0&&(T[g]=[]);let M=T[g],k=!1;for(let I=0;I<E.length;I++)f(E[I],M,I)===!0&&(k=!0);return k}return f(E,T,g)}function f(x,v,y){if(v[y]===void 0)return typeof x=="number"||typeof x=="boolean"?v[y]=x:ArrayBuffer.isView(x)?v[y]=x.slice():v[y]=x.clone(),!0;{let T=v[y];if(typeof x=="number"||typeof x=="boolean"){if(T!==x)return v[y]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(T.equals(x)===!1)return T.copy(x),!0}}return!1}function m(x){let v=x.uniforms,y=0,T=16;for(let g=0,M=v.length;g<M;g++){let k=Array.isArray(v[g])?v[g]:[v[g]];for(let I=0,U=k.length;I<U;I++){let V=k[I],J=Array.isArray(V.value)?V.value:[V.value],R=Array.isArray(v[g])||Array.isArray(V.value),P=y;for(let O=0,W=J.length;O<W;O++){let N=J[O],H=_(N,R),q=y%T,ce=q%H.boundary,Pe=q+ce;y+=ce,Pe!==0&&T-Pe<H.storage&&(y+=T-Pe),O===0&&(P=y),y+=H.storage}let F=V.type==="int"?Int32Array:V.type==="uint"?Uint32Array:Float32Array;V.__data=new F((y-P)/Float32Array.BYTES_PER_ELEMENT),V.__offset=P}}let E=y%T;return E>0&&(y+=T-E),x.__size=y,x.__cache={},this}function _(x,v){let y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=16,y.storage=48):x.isMatrix4?(y.boundary=16,y.storage=64):x.isTexture?We("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(y.boundary=16,y.storage=x.byteLength):We("WebGLRenderer: Unsupported uniform value type.",x),v===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function b(x){let v=x.target;v.removeEventListener("dispose",b),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(let x in s)i.deleteBuffer(s[x]);s={},r={}}return{bind:a,update:o,dispose:p}}var CM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ii=null;function PM(){return Ii===null&&(Ii=new Jr(CM,16,16,ws,gi),Ii.name="DFG_LUT",Ii.minFilter=en,Ii.magFilter=en,Ii.wrapS=vn,Ii.wrapT=vn,Ii.generateMipmaps=!1,Ii.needsUpdate=!0),Ii}var fh=class{constructor(e={}){let{canvas:t=ym(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Nn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let _=f,b=new Set([Rl,Al,El]),p=new Set([Nn,mi,ca,lr,Sl,wl]),x=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},T=null,E=null,g=[],M=[],k=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,U=!1,V=null,J=null,R=null,P=null;this._outputColorSpace=kt;let F=0,O=0,W=null,N=-1,H=null,q=new Pt,ce=new Pt,Pe=null,$=new qe(0),de=0,Ae=t.width,Xe=t.height,Me=1,je=null,At=null,Ye=new Pt(0,0,Ae,Xe),at=new Pt(0,0,Ae,Xe),ht=!1,ae=new xs,ge=new Yc,me=!1,Ie=!1,we=new tt,ot=new z,De=new Pt,D={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Z=!1;function le(){return W===null?Me:1}let L=n;function Ke(w,G){return t.getContext(w,G)}let Oe,gt,be,Vt,$e,nt,C,S,j,ue,oe,xe,Te,te,ne,ye,B,ie,Q,ve,pe,_e,Je;try{let w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Ze,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",Re,!1),L===null){let G="webgl2";if(L=Ke(G,w),L===null)throw Ke(G)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}dt()}catch(w){throw t.removeEventListener("webglcontextlost",Ze,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",Re,!1),et("WebGLRenderer: "+w.message),w}function dt(){Oe=new Gy(L),Oe.init(),pe=new SM(L,Oe),gt=new Py(L,Oe,e,pe),be=new vM(L,Oe),gt.reversedDepthBuffer&&d&&be.buffers.depth.setReversed(!0),J=L.createFramebuffer(),R=L.createFramebuffer(),P=L.createFramebuffer(),Vt=new Wy(L),$e=new oM,nt=new MM(L,Oe,be,$e,gt,pe,Vt),C=new zy(I),S=new Xb(L),_e=new Ry(L,S),j=new Hy(L,S,Vt,_e),ue=new Xy(L,j,S,_e,Vt),ie=new qy(L,gt,nt),ne=new Iy($e),oe=new aM(I,C,Oe,gt,_e,ne),xe=new AM(I,$e),Te=new lM,te=new mM(Oe),B=new Ay(I,C,be,ue,m,l),ye=new yM(I,ue,gt),Je=new RM(L,Vt,gt,be),Q=new Cy(L,Oe,Vt),ve=new Vy(L,Oe,Vt),Vt.programs=oe.programs,I.capabilities=gt,I.extensions=Oe,I.properties=$e,I.renderLists=Te,I.shadowMap=ye,I.state=be,I.info=Vt}_!==Nn&&(k=new Ky(_,t.width,t.height,o,s,r));let fe=new Ad(I,L);this.xr=fe,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let w=Oe.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=Oe.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(w){w!==void 0&&(Me=w,this.setSize(Ae,Xe,!1))},this.getSize=function(w){return w.set(Ae,Xe)},this.setSize=function(w,G,Y=!0){if(fe.isPresenting){We("WebGLRenderer: Can't change size while VR device is presenting.");return}Ae=w,Xe=G,t.width=Math.floor(w*Me),t.height=Math.floor(G*Me),Y===!0&&(t.style.width=w+"px",t.style.height=G+"px"),k!==null&&k.setSize(t.width,t.height),this.setViewport(0,0,w,G)},this.getDrawingBufferSize=function(w){return w.set(Ae*Me,Xe*Me).floor()},this.setDrawingBufferSize=function(w,G,Y){Ae=w,Xe=G,Me=Y,t.width=Math.floor(w*Y),t.height=Math.floor(G*Y),this.setViewport(0,0,w,G)},this.setEffects=function(w){if(_===Nn){et("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let G=0;G<w.length;G++)if(w[G].isOutputPass===!0){We("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}k.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(q)},this.getViewport=function(w){return w.copy(Ye)},this.setViewport=function(w,G,Y,X){w.isVector4?Ye.set(w.x,w.y,w.z,w.w):Ye.set(w,G,Y,X),be.viewport(q.copy(Ye).multiplyScalar(le()).round())},this.getScissor=function(w){return w.copy(at)},this.setScissor=function(w,G,Y,X){w.isVector4?at.set(w.x,w.y,w.z,w.w):at.set(w,G,Y,X),be.scissor(ce.copy(at).multiplyScalar(le()).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(w){be.setScissorTest(ht=w)},this.setOpaqueSort=function(w){je=w},this.setTransparentSort=function(w){At=w},this.getClearColor=function(w){return w.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor(...arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha(...arguments)},this.clear=function(w=!0,G=!0,Y=!0){let X=0;if(w){let K=!1;if(W!==null){let Ee=W.texture.format;K=b.has(Ee)}if(K){let Ee=W.texture.type,ke=p.has(Ee),Se=B.getClearColor(),Le=B.getClearAlpha(),Ve=Se.r,ct=Se.g,yt=Se.b;ke?(x[0]=Ve,x[1]=ct,x[2]=yt,x[3]=Le,L.clearBufferuiv(L.COLOR,0,x)):(v[0]=Ve,v[1]=ct,v[2]=yt,v[3]=Le,L.clearBufferiv(L.COLOR,0,v))}else X|=L.COLOR_BUFFER_BIT}G&&(X|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(X|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&L.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),V=w},this.dispose=function(){t.removeEventListener("webglcontextlost",Ze,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",Re,!1),B.dispose(),Te.dispose(),te.dispose(),nt.dispose(),$e.dispose(),C.dispose(),ue.dispose(),j.dispose(),_e.dispose(),Je.dispose(),oe.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Uf),fe.removeEventListener("sessionend",kf),Us.stop()};function Ze(w){w.preventDefault(),ja("WebGLRenderer: Context Lost."),U=!0}function ut(){ja("WebGLRenderer: Context Restored."),U=!1;let w=Vt.autoReset,G=ye.enabled,Y=ye.autoUpdate,X=ye.needsUpdate,K=ye.type;dt(),Vt.autoReset=w,ye.enabled=G,ye.autoUpdate=Y,ye.needsUpdate=X,ye.type=K}function Re(w){et("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ct(w){let G=w.target;G.removeEventListener("dispose",Ct),rn(G)}function rn(w){ls(w),$e.remove(w)}function ls(w){let G=$e.get(w).programs;G!==void 0&&(G.forEach(function(Y){oe.releaseProgram(Y)}),w.isShaderMaterial&&oe.releaseShaderCache(w))}this.renderBufferDirect=function(w,G,Y,X,K,Ee){G===null&&(G=D);let ke=K.isMesh&&K.matrixWorld.determinantAffine()<0,Se=dg(w,G,Y,X,K);be.setMaterial(X,ke);let Le=Y.index,Ve=1;if(X.wireframe===!0){if(Le=j.getWireframeAttribute(Y),Le===void 0)return;Ve=2}let ct=Y.drawRange,yt=Y.attributes.position,Be=ct.start*Ve,vt=(ct.start+ct.count)*Ve;Ee!==null&&(Be=Math.max(Be,Ee.start*Ve),vt=Math.min(vt,(Ee.start+Ee.count)*Ve)),Le!==null?(Be=Math.max(Be,0),vt=Math.min(vt,Le.count)):yt!=null&&(Be=Math.max(Be,0),vt=Math.min(vt,yt.count));let Zt=vt-Be;if(Zt<0||Zt===1/0)return;_e.setup(K,X,Se,Y,Le);let Ft,Lt=Q;if(Le!==null&&(Ft=S.get(Le),Lt=ve,Lt.setIndex(Ft)),K.isMesh)X.wireframe===!0?(be.setLineWidth(X.wireframeLinewidth*le()),Lt.setMode(L.LINES)):Lt.setMode(L.TRIANGLES);else if(K.isLine){let bn=X.linewidth;bn===void 0&&(bn=1),be.setLineWidth(bn*le()),K.isLineSegments?Lt.setMode(L.LINES):K.isLineLoop?Lt.setMode(L.LINE_LOOP):Lt.setMode(L.LINE_STRIP)}else K.isPoints?Lt.setMode(L.POINTS):K.isSprite&&Lt.setMode(L.TRIANGLES);if(K.isBatchedMesh)if(Oe.get("WEBGL_multi_draw"))Lt.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let bn=K._multiDrawStarts,ze=K._multiDrawCounts,Sn=K._multiDrawCount,Et=Le?S.get(Le).bytesPerElement:1,ks=$e.get(X).currentProgram.getUniforms();for(let xn=0;xn<Sn;xn++)ks.setValue(L,"_gl_DrawID",xn),Lt.render(bn[xn]/Et,ze[xn])}else if(K.isInstancedMesh)Lt.renderInstances(Be,Zt,K.count);else if(Y.isInstancedBufferGeometry){let bn=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,ze=Math.min(Y.instanceCount,bn);Lt.renderInstances(Be,Zt,ze)}else Lt.render(Be,Zt)};function Ff(w,G,Y,X){V!==null&&w.isNodeMaterial&&V.setObject(X,w),me===!0&&ne.setState(w,Y,!1),w.transparent===!0&&w.side===Ot&&w.forceSinglePass===!1?(w.side=un,w.needsUpdate=!0,Aa(w,G,X),w.side=Ci,w.needsUpdate=!0,Aa(w,G,X),w.side=Ot):Aa(w,G,X)}this.compile=function(w,G,Y=null){Y===null&&(Y=w),V!==null&&V.renderStart(w,G,Y),E=te.get(Y),E.init(G),M.push(E),Y.traverseVisible(function(K){K.isLight&&K.layers.test(G.layers)&&(E.pushLight(K),K.castShadow&&E.pushShadow(K))}),w!==Y&&w.traverseVisible(function(K){K.isLight&&K.layers.test(G.layers)&&(E.pushLight(K),K.castShadow&&E.pushShadow(K))}),E.setupLights(),V!==null&&V.updateLights(E.state.lightsArray),Ie=this.localClippingEnabled,me=ne.init(this.clippingPlanes,Ie),me===!0&&ne.setGlobalState(this.clippingPlanes,G),V!==null&&ye.render(E.state.shadowsArray,Y,G);let X=new Set;return w.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Ee=K.material;if(Ee)if(Array.isArray(Ee))for(let ke=0;ke<Ee.length;ke++){let Se=Ee[ke];Ff(Se,Y,G,K),X.add(Se)}else Ff(Ee,Y,G,K),X.add(Ee)}),E=M.pop(),V!==null&&V.renderEnd(),X},this.compileAsync=function(w,G,Y=null){let X=this.compile(w,G,Y);return new Promise(K=>{function Ee(){if(X.forEach(function(ke){let Le=$e.get(ke).currentProgram;(Le===void 0||Le.isReady())&&X.delete(ke)}),X.size===0){K(w);return}setTimeout(Ee,10)}Oe.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Vh=null;function hg(w){Vh&&Vh(w)}function Uf(){Us.stop()}function kf(){Us.start()}let Us=new e0;Us.setAnimationLoop(hg),typeof self<"u"&&Us.setContext(self),this.setAnimationLoop=function(w){Vh=w,fe.setAnimationLoop(w),w===null?Us.stop():Us.start()},fe.addEventListener("sessionstart",Uf),fe.addEventListener("sessionend",kf),this.render=function(w,G){if(G!==void 0&&G.isCamera!==!0){et("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;V!==null&&V.renderStart(w,G);let Y=fe.enabled===!0&&fe.isPresenting===!0,X=k!==null&&(W===null||Y)&&k.begin(I,W);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(G),G=fe.getCamera()),w.isScene===!0&&w.onBeforeRender(I,w,G,W),E=te.get(w,M.length),E.init(G),E.state.textureUnits=nt.getTextureUnits(),M.push(E),we.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),G.isArrayCamera?ge.setFromArrayCamera(G):ae.setFromProjectionMatrix(we,$n,G.reversedDepth),Ie=this.localClippingEnabled,me=ne.init(this.clippingPlanes,Ie),T=Te.get(w,g.length),T.init(),g.push(T),this.info.render.frame++,fe.enabled===!0&&fe.isPresenting===!0){let ke=I.xr.getDepthSensingMesh();ke!==null&&Wh(ke,G,-1/0,I.sortObjects)}Wh(w,G,0,I.sortObjects),T.finish(),V!==null&&V.updateLights(E.state.lightsArray),I.sortObjects===!0&&T.sort(je,At),Z=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,Z&&B.addToRenderList(T,w),this.info.autoReset===!0&&this.info.reset(),me===!0&&ne.beginShadows();let K=E.state.shadowsArray;if(ye.render(K,w,G),me===!0&&ne.endShadows(),(X&&k.hasRenderPass())===!1){let ke=T.opaque,Se=T.transmissive;if(E.setupLights(),G.isArrayCamera){let Le=G.cameras;if(Se.length>0)for(let Ve=0,ct=Le.length;Ve<ct;Ve++){let yt=Le[Ve];Bf(ke,Se,w,yt)}Z&&B.render(w);for(let Ve=0,ct=Le.length;Ve<ct;Ve++){let yt=Le[Ve];Of(T,w,yt,yt.viewport)}}else Se.length>0&&Bf(ke,Se,w,G),Z&&B.render(w),Of(T,w,G)}W!==null&&O===0&&(nt.updateMultisampleRenderTarget(W),nt.updateRenderTargetMipmap(W)),X&&k.end(I),w.isScene===!0&&w.onAfterRender(I,w,G),_e.resetDefaultState(),N=-1,H=null,M.pop(),M.length>0?(E=M[M.length-1],nt.setTextureUnits(E.state.textureUnits),me===!0&&ne.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,g.pop(),g.length>0?T=g[g.length-1]:T=null,V!==null&&V.renderEnd()};function Wh(w,G,Y,X){if(w.visible===!1)return;if(w.layers.test(G.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(G);else if(w.isLight)E.pushLight(w),w.castShadow&&E.pushShadow(w);else if(w.isSprite){let ke=G.isArrayCamera?ge:ae;if(!w.frustumCulled||w.intersectsFrustum(ke)){X&&De.setFromMatrixPosition(w.matrixWorld).applyMatrix4(we);let Se=ue.update(w),Le=w.material;Le.visible&&T.push(w,Se,Le,Y,De.z,null,G)}}else if(w.isMesh||w.isLine||w.isPoints){let ke=G.isArrayCamera?ge:ae;if(!w.frustumCulled||w.intersectsFrustum(ke)){let Se=ue.update(w),Le=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),De.copy(w.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),De.copy(Se.boundingSphere.center)),De.applyMatrix4(w.matrixWorld).applyMatrix4(we)),Array.isArray(Le)){let Ve=Se.groups;for(let ct=0,yt=Ve.length;ct<yt;ct++){let Be=Ve[ct],vt=Le[Be.materialIndex];vt&&vt.visible&&T.push(w,Se,vt,Y,De.z,Be,G)}}else Le.visible&&T.push(w,Se,Le,Y,De.z,null,G)}}}let Ee=w.children;for(let ke=0,Se=Ee.length;ke<Se;ke++)Wh(Ee[ke],G,Y,X)}function Of(w,G,Y,X){let{opaque:K,transmissive:Ee,transparent:ke}=w;E.setupLightsView(Y),me===!0&&ne.setGlobalState(I.clippingPlanes,Y),X&&be.viewport(q.copy(X)),K.length>0&&ac(K,G,Y),Ee.length>0&&ac(Ee,G,Y),ke.length>0&&ac(ke,G,Y),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function Bf(w,G,Y,X){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[X.id]===void 0){let Be=Oe.has("EXT_color_buffer_half_float")||Oe.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[X.id]=new Wn(1,1,{generateMipmaps:!0,type:Be?gi:Nn,minFilter:ni,samples:Math.max(4,gt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:bt.workingColorSpace})}let Ee=E.state.transmissionRenderTarget[X.id],ke=X.viewport||q;Ee.setSize(ke.z*I.transmissionResolutionScale,ke.w*I.transmissionResolutionScale);let Se=I.getRenderTarget(),Le=I.getActiveCubeFace(),Ve=I.getActiveMipmapLevel();I.setRenderTarget(Ee),I.getClearColor($),de=I.getClearAlpha(),de<1&&I.setClearColor(16777215,.5),I.clear(),Z&&B.render(Y);let ct=I.toneMapping;I.toneMapping=Pi;let yt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),E.setupLightsView(X),me===!0&&ne.setGlobalState(I.clippingPlanes,X),ac(w,Y,X),nt.updateMultisampleRenderTarget(Ee),nt.updateRenderTargetMipmap(Ee),Oe.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let vt=0,Zt=G.length;vt<Zt;vt++){let Ft=G[vt],{object:Lt,geometry:bn,material:ze,group:Sn}=Ft;if(ze.side===Ot&&Lt.layers.test(X.layers)){let Et=ze.side;ze.side=un,ze.needsUpdate=!0,zf(Lt,Y,X,bn,ze,Sn),ze.side=Et,ze.needsUpdate=!0,Be=!0}}Be===!0&&(nt.updateMultisampleRenderTarget(Ee),nt.updateRenderTargetMipmap(Ee))}I.setRenderTarget(Se,Le,Ve),I.setClearColor($,de),yt!==void 0&&(X.viewport=yt),I.toneMapping=ct}function ac(w,G,Y){let X=G.isScene===!0?G.overrideMaterial:null;for(let K=0,Ee=w.length;K<Ee;K++){let ke=w[K],{object:Se,geometry:Le,group:Ve}=ke,ct=ke.material;ct.allowOverride===!0&&X!==null&&(ct=X),Se.layers.test(Y.layers)&&zf(Se,G,Y,Le,ct,Ve)}}function zf(w,G,Y,X,K,Ee){V!==null&&K.isNodeMaterial&&V.setObject(w,K),w.onBeforeRender(I,G,Y,X,K,Ee),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),K.onBeforeRender(I,G,Y,X,w,Ee),K.transparent===!0&&K.side===Ot&&K.forceSinglePass===!1?(K.side=un,K.needsUpdate=!0,I.renderBufferDirect(Y,G,X,K,w,Ee),K.side=Ci,K.needsUpdate=!0,I.renderBufferDirect(Y,G,X,K,w,Ee),K.side=Ot):I.renderBufferDirect(Y,G,X,K,w,Ee),w.onAfterRender(I,G,Y,X,K,Ee)}function Gf(w){let G=0;for(let Y of w)Y.texture!==null&&G++;return G}function Aa(w,G,Y){G.isScene!==!0&&(G=D);let X=$e.get(w),K=E.state.lights,Ee=E.state.shadowsArray,ke=K.state.version,Se=oe.getParameters(w,K.state,Ee,G,Y,E.state.lightProbeGridArray),Le=oe.getProgramCacheKey(Se),Ve=X.programs;X.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?G.environment:null,X.fog=G.fog;let ct=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;X.envMap=C.get(w.envMap||X.environment,ct),X.envMapRotation=X.environment!==null&&w.envMap===null?G.environmentRotation:w.envMapRotation,Ve===void 0&&(w.addEventListener("dispose",Ct),Ve=new Map,X.programs=Ve,X.programVariants=new Map);let yt=Ve.get(Le);if(yt!==void 0){if(X.currentProgram===yt&&X.lightsStateVersion===ke)return Vf(w,Se),yt}else Se.uniforms=oe.getUniforms(w),V!==null&&w.isNodeMaterial&&V.build(w,Y,Se),w.onBeforeCompile(Se,I),yt=oe.acquireProgram(Se,Le),Ve.set(Le,yt),X.uniforms=Se.uniforms;let Be=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Be.clippingPlanes=ne.uniform),Vf(w,Se),X.needsLights=pg(w),X.lightsStateVersion=ke,X.needsLights&&(Be.ambientLightColor.value=K.state.ambient,Be.lightProbe.value=K.state.probe,Be.sunLights.value=K.state.sun,Be.sunLightShadows.value=K.state.sunShadow,Be.directionalLights.value=K.state.directional,Be.directionalLightShadows.value=K.state.directionalShadow,Be.spotLights.value=K.state.spot,Be.spotLightShadows.value=K.state.spotShadow,Be.rectAreaLights.value=K.state.rectArea,Be.ltc_1.value=K.state.rectAreaLTC1,Be.ltc_2.value=K.state.rectAreaLTC2,Be.pointLights.value=K.state.point,Be.pointLightShadows.value=K.state.pointShadow,Be.hemisphereLights.value=K.state.hemi,Be.sunShadowMatrix.value=K.state.sunShadowMatrix,Be.sunShadowCascade.value=K.state.sunShadowCascade,Be.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Be.spotLightMatrix.value=K.state.spotLightMatrix,Be.spotLightMap.value=K.state.spotLightMap,Be.pointShadowMatrix.value=K.state.pointShadowMatrix),X.numLightProbeGrids=Gf(E.state.lightProbeGridArray),X.currentProgram=yt,X.uniformsList=null,yt}function ug(w,G,Y,X,K){let Ee=$e.get(w),ke=Ee.currentProgram.id+","+X+","+K,Se=Ee.programVariants.get(ke);return Se===void 0?(Se=Aa(w,G,Y),Ee.programVariants.set(ke,Se)):(Ee.currentProgram=Se,Ee.uniformsList=null,Ee.outputColorSpace=X,Ee.toneMapping=K),Se}function Hf(w){if(w.uniformsList===null){let G=w.currentProgram.getUniforms();w.uniformsList=ha.seqWithValue(G.seq,w.uniforms)}return w.uniformsList}function Vf(w,G){let Y=$e.get(w);Y.outputColorSpace=G.outputColorSpace,Y.batching=G.batching,Y.batchingColor=G.batchingColor,Y.instancing=G.instancing,Y.instancingColor=G.instancingColor,Y.instancingMorph=G.instancingMorph,Y.skinning=G.skinning,Y.morphTargets=G.morphTargets,Y.morphNormals=G.morphNormals,Y.morphColors=G.morphColors,Y.morphTargetsCount=G.morphTargetsCount,Y.numClippingPlanes=G.numClippingPlanes,Y.numIntersection=G.numClipIntersection,Y.vertexAlphas=G.vertexAlphas,Y.vertexTangents=G.vertexTangents,Y.toneMapping=G.toneMapping}function dg(w,G,Y,X,K){G.isScene!==!0&&(G=D),nt.resetTextureUnits();let Ee=G.fog,ke=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?G.environment:null,Se=W===null?I.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:bt.workingColorSpace,Le=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Ve=C.get(X.envMap||ke,Le),ct=X.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,yt=!!Y.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Be=!!Y.morphAttributes.position,vt=!!Y.morphAttributes.normal,Zt=!!Y.morphAttributes.color,Ft=Pi;X.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(Ft=I.toneMapping);let Lt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,bn=Lt!==void 0?Lt.length:0,ze=$e.get(X),Sn=E.state.lights;if(me===!0&&(Ie===!0||w!==H)){let Bt=w===H&&X.id===N;ne.setState(X,w,Bt)}let Et=!1,ks=!1;X.version===ze.__version?ze.needsLights&&ze.lightsStateVersion!==Sn.state.version||K.isBatchedMesh&&ze.batching===!1||!K.isBatchedMesh&&ze.batching===!0||K.isBatchedMesh&&ze.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&ze.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&ze.instancing===!1||!K.isInstancedMesh&&ze.instancing===!0||K.isSkinnedMesh&&ze.skinning===!1||!K.isSkinnedMesh&&ze.skinning===!0||K.isInstancedMesh&&ze.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&ze.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&ze.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&ze.instancingMorph===!1&&K.morphTexture!==null||ze.envMap!==Ve||X.fog===!0&&ze.fog!==Ee||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ne.numPlanes||ze.numIntersection!==ne.numIntersection)||ze.vertexAlphas!==ct||ze.vertexTangents!==yt||ze.morphTargets!==Be||ze.morphNormals!==vt||ze.morphColors!==Zt||ze.morphTargetsCount!==bn||ze.numLightProbeGrids!==Gf(E.state.lightProbeGridArray)?Et=!0:(ze.outputColorSpace!==Se||ze.toneMapping!==Ft)&&(ks=!0):(Et=!0,ze.__version=X.version);let xn=ze.currentProgram;(Et===!0||ks===!0)&&(xn=ks===!0?ug(X,G,K,Se,Ft):Aa(X,G,K),V&&X.isNodeMaterial&&V.onUpdateProgram(X,xn,ze));let oc=!1,hs=!1,Os=!1,St=xn.getUniforms(),ln=ze.uniforms;if(be.useProgram(xn.program)&&(oc=!0,hs=!0,Os=!0),X.id!==N&&(N=X.id,hs=!0),oc||H!==w){be.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),St.setValue(L,"projectionMatrix",w.projectionMatrix),St.setValue(L,"viewMatrix",w.matrixWorldInverse);let an=St.map.cameraPosition;an!==void 0&&an.setValue(L,ot.setFromMatrixPosition(w.matrixWorld)),gt.logarithmicDepthBuffer&&St.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&St.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),H!==w&&(H=w,hs=!0,Os=!0)}if(ze.needsLights&&(Sn.state.sunShadowMap.length>0&&St.setValue(L,"sunShadowMap",Sn.state.sunShadowMap,nt),Sn.state.directionalShadowMap.length>0&&St.setValue(L,"directionalShadowMap",Sn.state.directionalShadowMap,nt),Sn.state.spotShadowMap.length>0&&St.setValue(L,"spotShadowMap",Sn.state.spotShadowMap,nt),Sn.state.pointShadowMap.length>0&&St.setValue(L,"pointShadowMap",Sn.state.pointShadowMap,nt)),K.isSkinnedMesh){St.setOptional(L,K,"bindMatrix"),St.setOptional(L,K,"bindMatrixInverse");let Bt=K.skeleton;Bt&&(Bt.boneTexture===null&&Bt.computeBoneTexture(),St.setValue(L,"boneTexture",Bt.boneTexture,nt))}K.isBatchedMesh&&(St.setOptional(L,K,"batchingTexture"),St.setValue(L,"batchingTexture",K._matricesTexture,nt),St.setOptional(L,K,"batchingIdTexture"),St.setValue(L,"batchingIdTexture",K._indirectTexture,nt),St.setOptional(L,K,"batchingColorTexture"),K._colorsTexture!==null&&St.setValue(L,"batchingColorTexture",K._colorsTexture,nt));let ci=Y.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&ie.update(K,Y,xn),(hs||ze.receiveShadow!==K.receiveShadow)&&(ze.receiveShadow=K.receiveShadow,St.setValue(L,"receiveShadow",K.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&G.environment!==null&&(ln.envMapIntensity.value=G.environmentIntensity),ln.dfgLUT!==void 0&&(ln.dfgLUT.value=PM()),hs){if(St.setValue(L,"toneMappingExposure",I.toneMappingExposure),ze.needsLights&&fg(ln,Os),Ee&&X.fog===!0&&xe.refreshFogUniforms(ln,Ee),xe.refreshMaterialUniforms(ln,X,Me,Xe,E.state.transmissionRenderTarget[w.id]),ze.needsLights&&ze.numLightProbeGrids>0){let Bt=y,an=0;for(let ki of E.state.lightProbeGridArray)ki.texture!==null&&(Bt.textures[an]=ki.texture,Bt.min[an]=ki.boundingBox.min,Bt.max[an]=ki.boundingBox.max,Bt.resolution[an]=ki.resolution,an++);for(let ki in Bt)Bt[ki].length=an;ln.probesSH.value=Bt.textures,ln.probesMin.value=Bt.min,ln.probesMax.value=Bt.max,ln.probesResolution.value=Bt.resolution}ha.upload(L,Hf(ze),ln,nt)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ha.upload(L,Hf(ze),ln,nt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&St.setValue(L,"center",K.center),St.setValue(L,"modelViewMatrix",K.modelViewMatrix),St.setValue(L,"normalMatrix",K.normalMatrix),St.setValue(L,"modelMatrix",K.matrixWorld),X.uniformsGroups!==void 0){let Bt=X.uniformsGroups;for(let an=0,ki=Bt.length;an<ki;an++){let qf=Bt[an];Je.update(qf,xn),Je.bind(qf,xn)}}return xn}function fg(w,G){w.ambientLightColor.needsUpdate=G,w.lightProbe.needsUpdate=G,w.sunLights.needsUpdate=G,w.sunLightShadows.needsUpdate=G,w.directionalLights.needsUpdate=G,w.directionalLightShadows.needsUpdate=G,w.pointLights.needsUpdate=G,w.pointLightShadows.needsUpdate=G,w.spotLights.needsUpdate=G,w.spotLightShadows.needsUpdate=G,w.rectAreaLights.needsUpdate=G,w.hemisphereLights.needsUpdate=G}function pg(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(w,G,Y){let X=$e.get(w);X.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),$e.get(w.texture).__webglTexture=G,$e.get(w.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:Y,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,G){let Y=$e.get(w);Y.__webglFramebuffer=G,Y.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(w,G=0,Y=0){W=w,F=G,O=Y;let X=null,K=!1,Ee=!1;if(w){let Se=$e.get(w);if(Se.__useDefaultFramebuffer!==void 0){be.bindFramebuffer(L.FRAMEBUFFER,Se.__webglFramebuffer),q.copy(w.viewport),ce.copy(w.scissor),Pe=w.scissorTest,be.viewport(q),be.scissor(ce),be.setScissorTest(Pe),N=-1;return}else if(Se.__webglFramebuffer===void 0)nt.setupRenderTarget(w);else if(Se.__hasExternalTextures)nt.rebindTextures(w,$e.get(w.texture).__webglTexture,$e.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let ct=w.depthTexture;if(Se.__boundDepthTexture!==ct){if(ct!==null&&$e.has(ct)&&(w.width!==ct.image.width||w.height!==ct.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");nt.setupDepthRenderbuffer(w)}}let Le=w.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(Ee=!0);let Ve=$e.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ve[G])?X=Ve[G][Y]:X=Ve[G],K=!0):w.samples>0&&nt.useMultisampledRTT(w)===!1?X=$e.get(w).__webglMultisampledFramebuffer:Array.isArray(Ve)?X=Ve[Y]:X=Ve,q.copy(w.viewport),ce.copy(w.scissor),Pe=w.scissorTest}else q.copy(Ye).multiplyScalar(Me).floor(),ce.copy(at).multiplyScalar(Me).floor(),Pe=ht;if(Y!==0&&(X=J),be.bindFramebuffer(L.FRAMEBUFFER,X)&&be.drawBuffers(w,X),be.viewport(q),be.scissor(ce),be.setScissorTest(Pe),K){let Se=$e.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+G,Se.__webglTexture,Y)}else if(Ee){let Se=G;for(let Le=0;Le<w.textures.length;Le++){let Ve=$e.get(w.textures[Le]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Le,Ve.__webglTexture,Y,Se)}}else if(w!==null&&Y!==0){let Se=$e.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Se.__webglTexture,Y)}N=-1};function Wf(w){let G=$e.get(w);return(G.__readFormat!==w.format||G.__readType!==w.type)&&(G.__readFormat=w.format,G.__readType=w.type,G.__formatReadable=gt.textureFormatReadable(w.format),G.__typeReadable=gt.textureTypeReadable(w.type)),G}this.readRenderTargetPixels=function(w,G,Y,X,K,Ee,ke,Se=0){if(!(w&&w.isWebGLRenderTarget)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Le=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ke!==void 0&&(Le=Le[ke],Array.isArray(Le)&&(Le=Le[0])),Le){be.bindFramebuffer(L.FRAMEBUFFER,Le);try{let Ve=w.textures[Se],ct=Ve.format,yt=Ve.type;w.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Se);let Be=Wf(Ve);if(Be.__formatReadable===!1){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Be.__typeReadable===!1){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=w.width-X&&Y>=0&&Y<=w.height-K&&L.readPixels(G,Y,X,K,pe.convert(ct),pe.convert(yt),Ee)}finally{let Ve=W!==null?$e.get(W).__webglFramebuffer:null;be.bindFramebuffer(L.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(w,G,Y,X,K,Ee,ke,Se=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Le=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ke!==void 0&&(Le=Le[ke],Array.isArray(Le)&&(Le=Le[0])),Le)if(G>=0&&G<=w.width-X&&Y>=0&&Y<=w.height-K){be.bindFramebuffer(L.FRAMEBUFFER,Le);let Ve=w.textures[Se],ct=Ve.format,yt=Ve.type;w.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Se);let Be=Wf(Ve);if(Be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let vt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,vt),L.bufferData(L.PIXEL_PACK_BUFFER,Ee.byteLength,L.STREAM_READ),L.readPixels(G,Y,X,K,pe.convert(ct),pe.convert(yt),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let Zt=W!==null?$e.get(W).__webglFramebuffer:null;be.bindFramebuffer(L.FRAMEBUFFER,Zt);let Ft=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Mm(L,Ft,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,vt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Ee),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(vt),L.deleteSync(Ft),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,G=null,Y=0){let X=Math.pow(2,-Y),K=Math.floor(w.image.width*X),Ee=Math.floor(w.image.height*X),ke=G!==null?G.x:0,Se=G!==null?G.y:0;nt.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,Y,0,0,ke,Se,K,Ee),be.unbindTexture()},this.copyTextureToTexture=function(w,G,Y=null,X=null,K=0,Ee=0){let ke,Se,Le,Ve,ct,yt,Be,vt,Zt,Ft=w.isCompressedTexture?w.mipmaps[Ee]:w.image;if(Y!==null)ke=Y.max.x-Y.min.x,Se=Y.max.y-Y.min.y,Le=Y.isBox3?Y.max.z-Y.min.z:1,Ve=Y.min.x,ct=Y.min.y,yt=Y.isBox3?Y.min.z:0;else{let St=Math.pow(2,-K);ke=Math.floor(Ft.width*St),Se=Math.floor(Ft.height*St),w.isDataArrayTexture?Le=Ft.depth:w.isData3DTexture?Le=Math.floor(Ft.depth*St):Le=1,Ve=0,ct=0,yt=0}X!==null?(Be=X.x,vt=X.y,Zt=X.z):(Be=0,vt=0,Zt=0);let Lt=pe.convert(G.format),bn=pe.convert(G.type),ze;G.isData3DTexture?(nt.setTexture3D(G,0),ze=L.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(nt.setTexture2DArray(G,0),ze=L.TEXTURE_2D_ARRAY):(nt.setTexture2D(G,0),ze=L.TEXTURE_2D),be.activeTexture(L.TEXTURE0),be.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,G.flipY),be.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),be.pixelStorei(L.UNPACK_ALIGNMENT,G.unpackAlignment);let Sn=be.getParameter(L.UNPACK_ROW_LENGTH),Et=be.getParameter(L.UNPACK_IMAGE_HEIGHT),ks=be.getParameter(L.UNPACK_SKIP_PIXELS),xn=be.getParameter(L.UNPACK_SKIP_ROWS),oc=be.getParameter(L.UNPACK_SKIP_IMAGES);be.pixelStorei(L.UNPACK_ROW_LENGTH,Ft.width),be.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ft.height),be.pixelStorei(L.UNPACK_SKIP_PIXELS,Ve),be.pixelStorei(L.UNPACK_SKIP_ROWS,ct),be.pixelStorei(L.UNPACK_SKIP_IMAGES,yt);let hs=w.isDataArrayTexture||w.isData3DTexture,Os=G.isDataArrayTexture||G.isData3DTexture;if(w.isDepthTexture){let St=$e.get(w),ln=$e.get(G),ci=$e.get(St.__renderTarget),Bt=$e.get(ln.__renderTarget);be.bindFramebuffer(L.READ_FRAMEBUFFER,ci.__webglFramebuffer),be.bindFramebuffer(L.DRAW_FRAMEBUFFER,Bt.__webglFramebuffer);for(let an=0;an<Le;an++)hs&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,$e.get(w).__webglTexture,K,yt+an),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,$e.get(G).__webglTexture,Ee,Zt+an)),L.blitFramebuffer(Ve,ct,Ve+ke,ct+Se,Be,vt,Be+ke,vt+Se,L.DEPTH_BUFFER_BIT,L.NEAREST);be.bindFramebuffer(L.READ_FRAMEBUFFER,null),be.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(K!==0||w.isRenderTargetTexture||$e.has(w)){let St=$e.get(w),ln=$e.get(G);be.bindFramebuffer(L.READ_FRAMEBUFFER,R),be.bindFramebuffer(L.DRAW_FRAMEBUFFER,P);for(let ci=0;ci<Le;ci++)hs?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,St.__webglTexture,K,yt+ci):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,St.__webglTexture,K),Os?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ln.__webglTexture,Ee,Zt+ci):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ln.__webglTexture,Ee),K!==0?L.blitFramebuffer(Ve,ct,Ve+ke,ct+Se,Be,vt,Be+ke,vt+Se,L.COLOR_BUFFER_BIT,L.NEAREST):Os?L.copyTexSubImage3D(ze,Ee,Be,vt,Zt+ci,Ve,ct,ke,Se):L.copyTexSubImage2D(ze,Ee,Be,vt,Ve,ct,ke,Se);be.bindFramebuffer(L.READ_FRAMEBUFFER,null),be.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Os?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(ze,Ee,Be,vt,Zt,ke,Se,Le,Lt,bn,Ft.data):G.isCompressedArrayTexture?L.compressedTexSubImage3D(ze,Ee,Be,vt,Zt,ke,Se,Le,Lt,Ft.data):L.texSubImage3D(ze,Ee,Be,vt,Zt,ke,Se,Le,Lt,bn,Ft):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Ee,Be,vt,ke,Se,Lt,bn,Ft.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Ee,Be,vt,Ft.width,Ft.height,Lt,Ft.data):L.texSubImage2D(L.TEXTURE_2D,Ee,Be,vt,ke,Se,Lt,bn,Ft);be.pixelStorei(L.UNPACK_ROW_LENGTH,Sn),be.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Et),be.pixelStorei(L.UNPACK_SKIP_PIXELS,ks),be.pixelStorei(L.UNPACK_SKIP_ROWS,xn),be.pixelStorei(L.UNPACK_SKIP_IMAGES,oc),Ee===0&&G.generateMipmaps===!0&&G.mipmapsAutoUpdate===!0&&L.generateMipmap(ze),be.unbindTexture()},this.initRenderTarget=function(w){$e.get(w).__webglFramebuffer===void 0&&nt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?nt.setTextureCube(w,0):w.isData3DTexture?nt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?nt.setTexture2DArray(w,0):nt.setTexture2D(w,0),be.unbindTexture()},this.resetState=function(){F=0,O=0,W=null,be.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=bt._getDrawingBufferColorSpace(e),t.unpackColorSpace=bt._getUnpackColorSpace()}};function Rd(i,e){if(e===Zu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===la||e===Fo){let t=i.getIndex();if(t===null){let r=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===la)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function gh(i){let e=new Map,t=new Map,n=i.clone();return u0(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function u0(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)u0(i.children[n],e.children[n],t)}var bh=class extends Ri{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Fd(t)}),this.register(function(t){return new Ud(t)}),this.register(function(t){return new kd(t)}),this.register(function(t){return new Xd(t)}),this.register(function(t){return new jd(t)}),this.register(function(t){return new Kd(t)}),this.register(function(t){return new Bd(t)}),this.register(function(t){return new zd(t)}),this.register(function(t){return new Gd(t)}),this.register(function(t){return new Hd(t)}),this.register(function(t){return new Nd(t)}),this.register(function(t){return new Vd(t)}),this.register(function(t){return new Od(t)}),this.register(function(t){return new qd(t)}),this.register(function(t){return new Wd(t)}),this.register(function(t){return new Ld(t)}),this.register(function(t){return new xh(t,xt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new xh(t,xt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Jd(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=ns.extractUrlBase(e);a=ns.resolveURL(c,this.path)}else a=ns.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Qr(this.manager);l.setPriority(this.priority),l.setCache(this.cache),l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===g0){try{a[xt.KHR_BINARY_GLTF]=new Yd(e)}catch(u){s&&s(u);return}r=JSON.parse(a[xt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new sf(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case xt.KHR_MATERIALS_UNLIT:a[u]=new Dd;break;case xt.KHR_DRACO_MESH_COMPRESSION:a[u]=new Zd(r,this.dracoLoader);break;case xt.KHR_TEXTURE_TRANSFORM:a[u]=new $d;break;case xt.KHR_MESH_QUANTIZATION:a[u]=new Qd;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function LM(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Gt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var xt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Ld=class{constructor(e){this.parser=e,this.name=xt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new qe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Tn);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new sr(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new ts(h),c.distance=u;break;case"spot":c=new wo(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Di(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Dd=class{constructor(){this.name=xt.KHR_MATERIALS_UNLIT}getMaterialType(){return Mt}extendParams(e,t,n){let s=[];e.color=new qe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Tn),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,kt))}return Promise.all(s)}},Nd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Fd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new he(r,r)}return Promise.all(s)}},Ud=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(s)}},kd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Od=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Bd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new qe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Tn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,kt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},zd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},Gd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new qe().setRGB(r[0],r[1],r[2],Tn),Promise.all(s)}},Hd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_IOR}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Vd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new qe().setRGB(r[0],r[1],r[2],Tn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,kt)),Promise.all(s)}},Wd=class{constructor(e){this.parser=e,this.name=xt.EXT_MATERIALS_BUMP}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},qd=class{constructor(e){this.parser=e,this.name=xt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Gt(this.parser,e,this.name)!==null?Cn:null}extendMaterialParams(e,t){let n=Gt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},Xd=class{constructor(e){this.parser=e,this.name=xt.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},jd=class{constructor(e){this.parser=e,this.name=xt.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Kd=class{constructor(e){this.parser=e,this.name=xt.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},xh=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}},Jd=class{constructor(e){this.name=xt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==ri.TRIANGLES&&c.mode!==ri.TRIANGLE_STRIP&&c.mode!==ri.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let m of u){let _=new tt,b=new z,p=new jt,x=new z(1,1,1),v=new Zs(m.geometry,m.material,d);for(let T=0;T<d;T++)l.TRANSLATION&&b.fromBufferAttribute(l.TRANSLATION,T),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,T),l.SCALE&&x.fromBufferAttribute(l.SCALE,T),v.setMatrixAt(T,_.compose(b,p,x));let y=null;for(let T in l)if(T==="_COLOR_0"){let E=l[T];v.instanceColor=new ji(E.array,E.itemSize,E.normalized)}else if(T!=="TRANSLATION"&&T!=="ROTATION"&&T!=="SCALE"){if(y===null){let g=v.geometry;y=new Dt,y.name=g.name;for(let M in g.attributes)y.setAttribute(M,g.attributes[M]);for(let M in g.morphAttributes)y.morphAttributes[M]=g.morphAttributes[M];g.index!==null&&y.setIndex(g.index),y.morphTargetsRelative=g.morphTargetsRelative;for(let M of g.groups)y.addGroup(M.start,M.count,M.materialIndex);g.boundingBox!==null&&(y.boundingBox=g.boundingBox.clone()),g.boundingSphere!==null&&(y.boundingSphere=g.boundingSphere.clone()),y.drawRange.start=g.drawRange.start,y.drawRange.count=g.drawRange.count,y.userData=Object.assign({},g.userData),v.geometry=y}let E=l[T];y.setAttribute(T,new ji(E.array,E.itemSize,E.normalized))}Ut.prototype.copy.call(v,m),this.parser.assignFinalMaterial(v),f.push(v)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},g0="glTF",zo=12,d0={JSON:1313821514,BIN:5130562},Yd=class{constructor(e){this.name=xt.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,zo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==g0)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-zo,r=new DataView(e,zo),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===d0.JSON){let c=new Uint8Array(e,zo+a,o);this.content=n.decode(c)}else if(l===d0.BIN){let c=zo+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Zd=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=xt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let u=tf[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=tf[h]||h.toLowerCase();if(a[h]!==void 0){let d=n.accessors[e.attributes[h]],f=da[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(let m in f.attributes){let _=f.attributes[m],b=l[m];b!==void 0&&(_.normalized=b)}u(f)},o,c,Tn,d)})})}},$d=class{constructor(){this.name=xt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Qd=class{constructor(){this.name=xt.KHR_MESH_QUANTIZATION}},_h=class extends Ai{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(n-t)/h,d=u*u,f=d*u,m=e*c,_=m-c,b=-2*f+3*d,p=f-d,x=1-b,v=p-d+u;for(let y=0;y!==o;y++){let T=a[_+y+o],E=a[_+y+l]*h,g=a[m+y+o],M=a[m+y]*h;r[y]=x*T+v*E+b*g+p*M}return r}},DM=new jt,ef=class extends _h{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return DM.fromArray(r).normalize().toArray(r),r}},ri={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},da={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},f0={9728:Kt,9729:en,9984:vl,9985:oa,9986:cr,9987:ni},p0={33071:vn,33648:Gr,10497:Qn},Cd={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},tf={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ts={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},NM={CUBICSPLINE:void 0,LINEAR:js,STEP:Xs},Pd={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function FM(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Fe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ci})),i.DefaultMaterial}function ur(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Di(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function UM(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;a.push(d)}if(s){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;o.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function kM(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function OM(i){let e,t=i.extensions&&i.extensions[xt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Id(t.attributes):e=i.indices+":"+Id(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Id(i.targets[n]);return e}function Id(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function nf(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function BM(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var zM=new tt,sf=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new LM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?(this.textureLoader=new tr(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new To(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Qr(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return ur(r,o,s),Di(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[xt.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(ns.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=Cd[s.type],o=da[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new hn(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Cd[s.type],c=da[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,_,b;if(f&&f!==u){let p=Math.floor(d/f),x="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,v=t.cache.get(x);v||(_=new c(o,p*f,s.count*f/h),v=new Js(_,f/h),t.cache.add(x,v)),b=new bs(v,l,d%f/h,m)}else o===null?_=new c(s.count*l):_=new c(o,d,s.count*l),b=new hn(_,l,m);if(s.sparse!==void 0){let p=Cd.SCALAR,x=da[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,T=new x(a[1],v,s.sparse.count*p),E=new c(a[2],y,s.sparse.count*l);o!==null&&(b=new hn(b.array.slice(),b.itemSize,b.normalized)),b.normalized=!1;for(let g=0,M=T.length;g<M;g++){let k=T[g];if(b.setX(k,E[g*l]),l>=2&&b.setY(k,E[g*l+1]),l>=3&&b.setZ(k,E[g*l+2]),l>=4&&b.setW(k,E[g*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}b.normalized=m}return b})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let d=(r.samplers||{})[a.sampler]||{};return h.magFilter=f0[d.magFilter]||en,h.minFilter=f0[d.minFilter]||ni,h.wrapS=p0[d.wrapS]||Qn,h.wrapT=p0[d.wrapT]||Qn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Kt&&h.minFilter!==en,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1,h;if(t.isKTX2Loader===!0&&a.bufferView!==void 0)h=n.getDependency("bufferView",a.bufferView).then(function(d){return new Promise(function(f,m){t.parse(d,f,m)})});else{if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;let f=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");h=Promise.resolve(l).then(function(d){return new Promise(function(f,m){let _=f;t.isImageBitmapLoader===!0&&(_=function(b){let p=new Jt(b);p.needsUpdate=!0,f(p)}),t.load(ns.resolveURL(d,r.path),_,void 0,m)})})}let u=h.then(function(d){return c===!0&&o.revokeObjectURL(l),Di(d,a),d.userData.mimeType=a.mimeType||BM(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[xt.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[xt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[xt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Yr,An.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new _s,An.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Fe}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[xt.KHR_MATERIALS_UNLIT]){let u=s[xt.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{let u=r.pbrMetallicRoughness||{};if(o.color=new qe(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Tn),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,kt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Ot);let h=r.alphaMode||Pd.OPAQUE;if(h===Pd.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Pd.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new he(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Mt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Mt){let u=r.emissiveFactor;o.emissive=new qe().setRGB(u[0],u[1],u[2],Tn)}return r.emissiveTexture!==void 0&&a!==Mt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,kt)),Promise.all(c).then(function(){let u=new a(o);return r.name&&(u.name=r.name),Di(u,r),t.associations.set(u,{materials:e}),r.extensions&&ur(s,u,r),u})}createUniqueName(e){let t=It.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[xt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return m0(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=OM(c),u=s[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[xt.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=m0(new Dt,c,t),c.mode===ri.TRIANGLE_STRIP?d=d.then(f=>Rd(f,Fo)):c.mode===ri.TRIANGLE_FAN&&(d=d.then(f=>Rd(f,la))),s[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?FM(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,m=h.length;f<m;f++){let _=h[f],b=a[f],p,x=c[f];if(b.mode===ri.TRIANGLES||b.mode===ri.TRIANGLE_STRIP||b.mode===ri.TRIANGLE_FAN||b.mode===void 0){let v=r.isSkinnedMesh===!0,y=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");v&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=v&&y?new to(_,x):new _t(_,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(b.mode===ri.LINES)p=new io(_,x);else if(b.mode===ri.LINE_STRIP)p=new Ki(_,x);else if(b.mode===ri.LINE_LOOP)p=new so(_,x);else if(b.mode===ri.POINTS)p=new ro(_,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+b.mode);Object.keys(p.geometry.morphAttributes).length>0&&kM(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Di(p,r),b.extensions&&ur(s,p,b),t.assignFinalMaterial(p),u.push(p)}for(let f=0,m=u.length;f<m;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&ur(s,u[0],r),u[0];let d=new wt;r.extensions&&ur(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=u.length;f<m;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Qt(lh.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new ir(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Di(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let u=a[c];if(u){o.push(u);let d=new tt;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new no(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){let f=s.channels[u],m=s.samplers[f.sampler],_=f.target,b=_.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,x=s.parameters!==void 0?s.parameters[m.output]:m.output;_.node!==void 0&&(a.push(this.getDependency("node",b)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",x)),c.push(m),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],m=u[2],_=u[3],b=u[4],p=[];for(let v=0,y=d.length;v<y;v++){let T=d[v],E=f[v],g=m[v],M=_[v],k=b[v];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();let I=n._createAnimationTracks(T,E,g,M,k);if(I)for(let U=0;U<I.length;U++)p.push(I[U])}let x=new er(r,void 0,p);return Di(x,s),x})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,zM)});for(let f=0,m=u.length;f<m;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,m=u[0];h.pivot=new z().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],m.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Kr:c.length>1?h=new wt:c.length===1?h=c[0]:h=new Ut,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Di(h,r),r.extensions&&ur(n,h,r),r.matrix!==void 0){let u=new tt;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new wt;n.name&&(r.name=s.createUniqueName(n.name)),Di(r,n),n.extensions&&ur(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){let d=l[h];d.parent!==null?r.add(gh(d)):r.add(d)}let c=h=>{let u=new Map;for(let[d,f]of s.associations)(d instanceof An||d instanceof Jt)&&u.set(d,f);return h.traverse(d=>{let f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ts[r.path]===Ts.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Ts[r.path]){case Ts.weights:h=$i;break;case Ts.rotation:h=Qi;break;case Ts.translation:case Ts.scale:h=Ss;break;default:n.itemSize===1?h=$i:h=Ss;break}let u=s.interpolation!==void 0?NM[s.interpolation]:js,d=this._getArrayFromAccessor(n);for(let f=0,m=l.length;f<m;f++){let _=new h(l[f]+"."+Ts[r.path],t.array,d,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=nf(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Qi?ef:_h;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function GM(i,e,t){let n=e.attributes,s=new En;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new z(l[0],l[1],l[2]),new z(c[0],c[1],c[2])),o.normalized){let h=nf(da[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new z,l=new z;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let _=nf(da[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new Ln;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function m0(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=tf[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return bt.workingColorSpace!==Tn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${bt.workingColorSpace}" not supported.`),Di(i,e),GM(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?UM(i,e.targets,t):i})}var b0=(function(){var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var s=WebAssembly.validate(t)?o(e):o(i),r,a=WebAssembly.instantiate(s,{}).then(function(p){r=p.instance,r.exports.__wasm_call_ctors()});function o(p){for(var x=new Uint8Array(p.length),v=0;v<p.length;++v){var y=p.charCodeAt(v);x[v]=y>96?y-97:y>64?y-39:y+4}for(var T=0,v=0;v<p.length;++v)x[T++]=x[v]<60?n[x[v]]:(x[v]-60)*64+x[++v];return x.buffer.slice(0,T)}function l(p,x,v,y,T,E,g){var M=p.exports.sbrk,k=y+3&-4,I=M(k*T),U=M(E.length),V=new Uint8Array(p.exports.memory.buffer);V.set(E,U);var J=x(I,y,T,U,E.length);if(J==0&&g&&g(I,k,T),v.set(V.subarray(I,I+y*T)),M(I-M(0)),J!=0)throw new Error("Malformed buffer data: "+J)}var c={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp",COLOR:"meshopt_decodeFilterColor"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function f(p){var x={object:new Worker(p),pending:0,requests:{}};return x.object.onmessage=function(v){var y=v.data;x.pending-=y.count,x.requests[y.id][y.action](y.value),delete x.requests[y.id]},x}function m(p){for(var x="self.ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(s)+"]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = "+b.name+";"+l.toString()+b.toString(),v=new Blob([x],{type:"text/javascript"}),y=URL.createObjectURL(v),T=u.length;T<p;++T)u[T]=f(y);for(var T=p;T<u.length;++T)u[T].object.postMessage({});u.length=p,URL.revokeObjectURL(y)}function _(p,x,v,y,T){for(var E=u[0],g=1;g<u.length;++g)u[g].pending<E.pending&&(E=u[g]);return new Promise(function(M,k){var I=new Uint8Array(v),U=++d;E.pending+=p,E.requests[U]={resolve:M,reject:k},E.object.postMessage({id:U,count:p,size:x,source:I,mode:y,filter:T},[I.buffer])})}function b(p){var x=p.data;self.ready.then(function(v){if(!x.id)return self.close();try{var y=new Uint8Array(x.count*x.size);l(v,v.exports[x.mode],y,x.count,x.size,x.source,v.exports[x.filter]),self.postMessage({id:x.id,count:x.count,action:"resolve",value:y},[y.buffer])}catch(T){self.postMessage({id:x.id,count:x.count,action:"reject",value:T})}})}return{ready:a,supported:!0,useWorkers:function(p){m(p)},decodeVertexBuffer:function(p,x,v,y,T){l(r,r.exports.meshopt_decodeVertexBuffer,p,x,v,y,r.exports[c[T]])},decodeIndexBuffer:function(p,x,v,y){l(r,r.exports.meshopt_decodeIndexBuffer,p,x,v,y)},decodeIndexSequence:function(p,x,v,y){l(r,r.exports.meshopt_decodeIndexSequence,p,x,v,y)},decodeGltfBuffer:function(p,x,v,y,T,E){l(r,r.exports[h[T]],p,x,v,y,r.exports[c[E]])},decodeGltfBufferAsync:function(p,x,v,y,T){return u.length>0?_(p,x,v,h[y],c[T]):a.then(function(){var E=new Uint8Array(p*x);return l(r,r.exports[h[y]],E,p,x,v,r.exports[c[T]]),E})}}})();var Zo=[{id:"galdy",title:"Who is Lewis Galdy?",simple:["Lewis Galdy was a real person. He was born in France in 1659.","His family were Huguenots. That means French Protestants. In France they were punished for their religion, so Lewis sailed across the ocean to Jamaica."],deeper:["We know this from the words carved on his tombstone. You can still read it at St Peter\u2019s Church in Port Royal.","Nobody wrote down the year he arrived. This game starts his story in 1690. That date is our best guess, not a fact."]},{id:"town",title:"The town on the sand",simple:["Port Royal sat on a thin strip of sand in Kingston Harbour. About 6,500 people lived here, packed close together.","There was not much land, so people built upward. Some brick houses were four floors high."],deeper:["Around 1690, Port Royal was about the same size as Boston. It was one of the busiest English ports in the Americas, and brick houses were a sign of money.","From 1981 to 1990, archaeologists dug up five buildings that now lie under the sea. The houses in this game are based on what they found, and on paintings made from their work."]},{id:"coins",title:"Pieces of eight",simple:["People in Port Royal paid with silver coins from Spanish lands.","The big coin was called a piece of eight. It was worth eight smaller coins called reales."],deeper:["In most English colonies, people swapped goods like sugar or tobacco. Port Royal was different. So much Spanish silver arrived, through trade and through raids on Spanish ships and towns, that people used coins every day."]},{id:"people",title:"Who lived here?",simple:["People came to Port Royal from England, France, Africa and many other places.","Not everyone chose to come, and not everyone was free. Many African people here were enslaved. That means they were forced to work, were not paid, and were not allowed to leave.","Abba is a free woman. That was rare."],deeper:["About 2,500 of the people in the town were enslaved Africans. Part of Port Royal\u2019s wealth came from buying and selling human beings. This game will not hide that.","Abba is a character we made up. She stands for the free Black and mixed-race people who really lived in Jamaica at this time. Church records list a free Black couple, Peter Moore and Black Betty, who married in 1677."]},{id:"harbour",title:"The busy harbour",simple:["Port Royal had one of the busiest harbours in the Americas. In the year 1688, 213 ships came here.","Ships left Jamaica full of sugar, rum, cotton, ginger and wood."],deeper:["In that same year, 226 ships visited all of New England put together. One small town in Jamaica was almost as busy as a whole region.","Ships also carried enslaved African people here to be sold. The money and the cruelty came in through the same harbour."]},{id:"change",title:"Making change",simple:["A piece of eight was worth eight reales. Abba\u2019s stew cost two reales, so you got six back.","Sometimes people cut a coin into smaller pieces to make change. The pieces were called bits."],deeper:["The prices in this game are made up. Nobody wrote down what a bowl of stew cost in a Port Royal tavern in 1690."]},{id:"bottle",title:"Onion bottles",simple:["This round bottle is called an onion bottle, because of its shape. It held wine or other drinks.","Divers found a huge number of bottles like this under the sea at Port Royal."],deeper:["Some bottles came up still sealed, with liquid inside, after more than 250 years under the sea.","You can see real objects from Port Royal at the National Museum of Jamaica in Kingston."]},{id:"pewter",title:"Pewter plates",simple:["Pewter is a soft grey metal. Many people ate from pewter plates.","In one sunken building, archaeologists found about 25 pewter plates stacked in a cupboard under the stairs."],deeper:["Port Royal has given the world its largest collection of pewter from the late 1600s.","A pewter maker named Simon Benning was working in Jamaica by the 1660s. His son carried on the shop."]},{id:"pipes",title:"Clay pipes",simple:["Many people in Port Royal smoked tobacco in long clay pipes. Divers found so many pipes that it seemed the whole town smoked.","Today we know that smoking harms the body. People in 1690 did not know that."],deeper:["Archaeologists found white clay pipes that had never been used, still waiting to be sold.","Some pipes were made in Jamaica from local red clay. African craftspeople, both free and enslaved, made them."]},{id:"turtle",title:"The turtle-shell box",simple:["This little box is covered in turtle shell. A box like it was found under the sea at Port Royal.","Sea turtles were easy to find near the town. People ate turtle meat and made things from the shells."],deeper:["In one sunken building, archaeologists found sea turtle shells in a room used for cutting up meat.","Today sea turtles are in danger and are protected by law. Nobody should hunt them now."]},{id:"quake",title:"The earthquake",simple:["On 7 June 1692, just before noon, a huge earthquake hit Port Royal.","In about three minutes, most of the town was gone."],deeper:["As many as 2,000 people died that day. Thousands more died in the days and weeks after.","A news sheet printed in London that year lists what people saw: houses falling, the great church and its tower coming down, the wharf covered by the sea, and a boat coming to save people."]},{id:"sand",title:"Why the ground swallowed the town",simple:["Port Royal was built on loose, wet sand.","When loose, wet sand is shaken very hard, it stops acting like solid ground. It flows like a liquid. Heavy brick houses sank straight down into it."],deeper:["Scientists call this liquefaction.","It is why divers found some buildings under the sea with their brick floors still in place."]},{id:"watch",title:"The stopped watch",simple:["In 1959, divers found a brass pocket watch under the sea at Port Royal.","Its hands had stopped at 17 minutes before noon."],deeper:["The watch was made in Amsterdam in 1686. People believe it stopped when the earthquake struck. That is how we know the time: about 11:43 in the morning."]},{id:"tomb",title:"Swallowed, and saved",simple:["This part of the story is true. Lewis Galdy was swallowed by the ground. A second shock threw him out into the sea.","He swam until a boat picked him up."],deeper:["His tombstone says he was \u201Cmiraculously saved by swimming until a boat took him up.\u201D He lived for 47 more years.","In this game, Abba is in the boat. We made that part up. Nobody wrote down who was in the boat that saved him."]},{id:"after",title:"The days after",simple:["The earthquake lasted about three minutes. The hard days came after.","People had little food and no clean water. Many who lived through the earthquake became sick. Thousands more died."],deeper:["At night, thieves robbed the broken houses. The town\u2019s minister wrote about them in a letter.","The camp in this game is made up. The hunger, the sickness and the thieves were real."]},{id:"tentp",title:"Church in a tent",simple:["The great church fell down in the earthquake.","So the minister held church in a tent."],deeper:["A news sheet printed in London in 1692 shows him preaching in a tent, with ruined houses all around."]},{id:"kingston",title:"A new town across the water",simple:["Most people who lived left Port Royal. They crossed the harbour and began a new town.","That town became Kingston, the capital of Jamaica today."],deeper:["Port Royal was built again, but smaller. It was never again the great trading town it had been.","A few merchants and fishermen stayed. Lewis Galdy was one of them."]},{id:"fortune",title:"Where the money came from",simple:["Lewis Galdy became rich again. He sold wine and cocoa. He also sold people.","He worked for a company that shipped enslaved African people to Spanish lands. This game does not look away from that."],deeper:["That trade was called the Asiento. Galdy was one of its agents in Jamaica.","He also sat in Jamaica\u2019s Assembly, which made the island\u2019s laws."]},{id:"stone",title:"The tombstone",simple:["Lewis Galdy died in 1739. He was 80 years old.","His tombstone tells how the earthquake swallowed him and how he was saved. You can visit it today at St Peter\u2019s Church in Port Royal."],deeper:["As a churchwarden, he helped to get this church built again. It was finished in 1725.","His tomb was first at a place called Green Bay, across the harbour. It was moved here in 1953.","The stone tells his story. The people he bought and sold have no stones, and most of their names were never written down."]},{id:"sugar",title:"Sugar",simple:["These big casks are full of sugar. Sugar was the main thing Jamaica sold to the world.","Enslaved African people grew the sugar cane and made the sugar. The work was very hard and very dangerous."],deeper:["A big cask like this is called a hogshead.","Sugar made planters and merchants rich. The people who made it were paid nothing."]},{id:"cocoa",title:"Cocoa",simple:["These sacks hold cocoa beans. People ground them up to make a chocolate drink.","We know that Lewis Galdy traded in cocoa."],deeper:["In the 1600s, chocolate was a drink, not a bar. People drank it hot, often with spices."]},{id:"logwood",title:"Logwood",simple:["This dark red wood is called logwood. It was not for building.","People boiled it to make dye for cloth."],deeper:["Many old privateers became logwood cutters on the coast of Central America. Much of their wood was shipped through Jamaica to Europe."]},{id:"scales",title:"Weighing coins",simple:["Merchants did not just count coins. They weighed them.","Some people shaved silver off the edges of coins and kept it. A scale showed if a coin was too light."],deeper:["Shaving coins was called clipping. It was a crime."]},{id:"market",title:"The slave market",simple:["Ships brought enslaved African people to Port Royal to be sold.","Families were split apart on the wharf. The law allowed this. It was still wrong."],deeper:["Until 1698, one company, the Royal African Company, was the only English company allowed to bring enslaved people from Africa.","We do not know the year Lewis Galdy began to buy and sell people. We know that he did. The letter in this game is made up, to show the choice in front of him.","Abba\u2019s mother is made up too. Thousands of real mothers were sold in Port Royal."]},{id:"swan",title:"The ship over the houses",simple:["When the earthquake struck, the sea rushed over the wharf.","A ship called the Swan was being repaired by the shore. The water lifted it and carried it over the tops of the sunken houses."],deeper:["People in the water climbed onto the Swan and were saved.","Sam is a character we made up, but people who were there wrote about the Swan."]},{id:"kofi",title:"Kofi\u2019s name",simple:["Many enslaved people in Jamaica were taken from West Africa. Kofi is an Akan name from West Africa. It is given to a boy born on a Friday.","Owners often gave enslaved people new names. Many people kept their own names among themselves."],deeper:["Enslaved Africans did much of the hardest work in Port Royal: loading ships, carrying goods, building and rowing.","Kofi is a character we made up. About 2,500 enslaved people lived in Port Royal, and most of their names were never written down."]},{id:"privateer",title:"Pirates and privateers",simple:["A privateer had a paper from the government that allowed him to attack enemy ships. A pirate had no paper, and attacked anyone.","In the 1660s, English leaders let privateers sail from Port Royal to raid Spanish ships and towns."],deeper:["The most famous was Henry Morgan. He later became Lieutenant Governor of Jamaica.","By the 1680s the government had turned against the raiders. Pirates caught by the law were hanged at Gallows Point, just outside the town.","Sam is a character we made up."]},{id:"benning",title:"The Bennings, pewterers",simple:["Simon Benning was a real pewterer: he made plates, spoons and cups from pewter. He came from England by way of Barbados, and was working in Jamaica by the 1660s.","He died in 1687. His son, also called Symon, carried on the shop. He was still a pewterer in Port Royal when the earthquake struck in 1692."],deeper:["Their mark was a pineapple with the letters S and B. Pewter with this mark has been found under the sea at Port Royal.","Marks like these help archaeologists work out who made the things they find.","The words of Symon Benning in this game are made up."]},{id:"heath",title:"The Reverend Emmanuel Heath",simple:["Emmanuel Heath was a real person. He was the minister of St Paul\u2019s Church in Port Royal.","He lived through the earthquake and wrote letters about it. Much of what we know about that day comes from him."],deeper:["He wrote from a ship called the Granada, out in the harbour. He went ashore to pray with the hurt and dying, and to christen children.","Like many people then, he believed the earthquake was God\u2019s punishment. Today, scientists explain it with loose, wet sand turning to liquid.","His words in this game are made up, but they follow what he wrote."]}],HM=[{who:"You",text:"A ship\u2019s cook wants a sack of cocoa. The price is 20 reales."},{who:"You",text:"He gives me 3 pieces of eight. Each one is worth 8 reales. How many reales do I give back?",choices:[{t:"2 reales"},{t:"4 reales",ok:!0},{t:"6 reales"}],hint:"Not quite. Three eights are 24. Take away 20."},{who:"You",text:"Four reales. But first I weigh his coins. One is too light. Someone has shaved its edge.",unlock:"scales"}],O0=[{who:"Abba",text:"Good day, Lewis. I need a cask of wine for The Turtle."},{who:"You",text:"Take the one by the door. You can pay me on Friday."},{who:"Abba",text:"There is a letter on your desk. The captain of the slave ship left it. I know what it asks."},{who:"Abba",text:"My mother was sold on that wharf, Lewis. Read it. Then decide what kind of merchant you are.",unlock:"market"},{who:"You",text:"Abba, wait. I have not said yes to anything."},{who:"Abba",text:"I know. That is why I came to tell you. I will send a boy for the wine."},{who:"Abba",text:"Good day, Lewis."}],Ma=[{id:"kofi",label:"Talk to the dockworker",who:"Kofi",x:21.7,z:2.35,ry:Math.PI+.5,route:[[21.2,2.5],[31,.7]],talk:[{who:"Kofi",text:"Mind the casks. They are heavy, and the captain wants them on board by noon."},{who:"You",text:"Do you work for the captain?"},{who:"Kofi",text:"No. I am enslaved. A merchant in this town says he owns me. I work, and I am not paid."},{who:"Kofi",text:"My mother named me Kofi, because I was born on a Friday. Here they call me something else. I keep my own name.",unlock:"kofi"}],again:[{who:"Kofi",text:"I have work to do. Go well."}]},{id:"sailor",label:"Talk to the sailor",who:"Sam",x:34.5,z:.55,y:.06,ry:Math.PI/2,talk:[{who:"Sam",anim:"Point",text:"Fine sloop, isn\u2019t she? Built of Jamaica cedar. Fast enough to catch anything on the sea."},{who:"You",text:"Are you a pirate?"},{who:"Sam",text:"Hush! Years ago the governor gave us papers to attack Spanish ships. That made us privateers, not pirates."},{who:"Sam",text:"Now the law has changed. Attack a ship without papers and they hang you at Gallows Point.",unlock:"privateer"}],again:[{who:"Sam",text:"We sail with the tide. Keep your purse close in the taverns."}]},{id:"benning",label:"Talk to the pewterer",who:"Symon Benning",x:8.6,z:4,ry:Math.PI,talk:[{who:"Symon Benning",text:"Good day! Symon Benning, pewterer. Plates, spoons, tankards. All made right here in Port Royal."},{who:"You",text:"You make them here, not in England?"},{who:"Symon Benning",text:"My father started this shop. I melt the metal and pour it into moulds, then scrape and polish, just as he taught me."},{who:"Symon Benning",text:"Look underneath for our mark: a pineapple, with an S and a B. Ships bring the metal. We do the rest.",unlock:"benning"}],again:[{who:"Symon Benning",text:"Come back when you need plates. Good pewter lasts a lifetime."}]}],pr={x:-9.65,z:1.75,ry:Math.PI/2},Es=[[-2.6,-1.3,-.6,"sailor"],[-13.4,-1.6,.4,"benning"],[-7.2,3.9,Math.PI+.3,"kofi"]],VM=[{who:"Sam",text:"Mr Galdy! You\u2019re alive. I saw the ground take you."},{who:"Sam",text:"The sea came up over the wharf. A big ship, the Swan, was washed right over the tops of the houses. I saw it with my own eyes."},{who:"Sam",text:"Our sloop broke her ropes and was gone. I have nothing now but these clothes.",unlock:"swan"}],WM=[{who:"Kofi",text:"My leg is bad. A wall came down by the wharf."},{who:"Kofi",text:"Many of us were working there when the sea came in. Nobody will write down their names."},{who:"Kofi",text:"So I say them. Every night, I say them."}],qM=[{who:"Symon Benning",text:"My shop is under the sea. The moulds, the metal, the plates. My father\u2019s work, gone in a minute."},{who:"You",text:"I am sorry, Symon."},{who:"Symon Benning",text:"Maybe one day someone will find our plates down there and see the pineapple mark. Then they will know we were here."}],XM=[{who:"Emmanuel Heath",text:"I am Emmanuel Heath, minister of this town. My church fell in the earthquake. I heard the tower come down."},{who:"Emmanuel Heath",text:"I sleep on a ship in the harbour now. I come ashore to pray with the sick, and to christen the babies."},{who:"Emmanuel Heath",text:"Many people say God punished this town for its wickedness. I fear they are right. Pray for us.",unlock:"heath"}],jM=[{who:"Abba",text:"You are alive! I pulled so many from the water. Not enough."},{who:"Abba",text:"It has been three days. There is little food, the water is bad, and people are getting sick.",unlock:"after"},{who:"Abba",text:"At night, thieves go through the broken houses. In the day, we share what we have."},{who:"Abba",text:"Look around. Then come back and tell me what you will do."}],KM=[{who:"Abba",text:"Most people are leaving. They are crossing the harbour to build a new town."},{who:"Abba",text:"You are a merchant, Lewis. You will be rich again. Ask yourself what you will sell to get there."}],Tf=[{who:"Abba",text:"Morning! You look lost. Are you new in Port Royal?",choices:["Yes. I just got off the ship.","Is it that easy to tell?"]},{who:"Abba",text:"Everyone here came from somewhere else. Where is home?"},{who:"You",text:"France. A town called Montpellier. It was not safe for my family to pray the way we do. So we left.",unlock:"galdy"},{who:"Abba",text:"Then you are in good company. This town is full of people starting again. I am Abba. I keep this tavern.",unlock:"people"},{who:"Abba",text:"Here is some advice. Money in this town is Spanish silver. People call the coins pieces of eight. Learn what things cost before you spend one.",unlock:"coins"},{who:"Abba",text:"And look around you. Brick houses four floors high, on a strip of sand! Come inside when you are hungry. My turtle stew is the best on Lime Street.",unlock:"town"}],JM=[{who:"Abba",text:"Welcome to The Turtle! A bowl of turtle stew is two reales."},{who:"You",text:"I only have this. One piece of eight."},{who:"Abba",text:"A piece of eight is worth eight reales. The stew is two. How many reales do I give you back?",choices:[{t:"Four reales"},{t:"Six reales",ok:!0},{t:"Eight reales"}],hint:"Not quite. Start with eight and take away two."},{who:"Abba",text:"Six it is. Here is your change, and here is your stew. Eat while it is hot!",unlock:"change"},{who:"Abba",text:"Look around while you eat. Almost everything in this room came here on a ship."}],x0=[{who:"Abba",text:"Take your time. Look around. Port Royal will still be here tomorrow."}],Ls=[{id:"bottle",label:"Look at the bottle",x:-198.8,z:-2.15,y:1.02},{id:"pewter",label:"Look at the plates",x:-198.2,z:1.3,y:.78},{id:"pipes",label:"Look at the pipes",x:-201.6,z:1,y:.78},{id:"turtle",label:"Look at the little box",x:-195.9,z:2.3,y:.78}],A={started:!1,x:43,z:0,yaw:Math.PI/2,pitch:0,unlocked:[],talked:!1,step:0,place:"out",ate:!1,done:!1,ch:{}},se=i=>document.getElementById(i),Go=matchMedia("(prefers-reduced-motion: reduce)").matches,YM=matchMedia("(pointer: coarse)").matches,On=se("stage"),as=new fh({canvas:On,antialias:!0,powerPreference:"high-performance"}),pf=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,qo=Math.min(devicePixelRatio||1,pf?1.25:1.75);as.setPixelRatio(qo);var rf=16,af=0;as.toneMapping=Ao;as.toneMappingExposure=1.12;var Qe=new Za,Oh=new qe(13624298);Qe.fog=new Ya(Oh,70,900);var Fi=new Qt(68,1,.1,3e3);Fi.rotation.order="YXZ";var B0=new Mo(15135231,11770488,2.3);Qe.add(B0);var ga=new sr(16773592,2.6);ga.position.set(-.35,1,.75);Qe.add(ga);var mr=null;{let i=new Rn(2500,24,12),e=[],t=new qe(4163273),n=new qe;for(let s=0;s<i.attributes.position.count;s++){let r=Math.max(0,i.attributes.position.getY(s)/2500);n.copy(Oh).lerp(t,Math.pow(r,.55)),e.push(n.r,n.g,n.b)}i.setAttribute("color",new lt(e,3)),mr=new _t(i,new Mt({vertexColors:!0,side:un,fog:!1,depthWrite:!1})),mr.userData.far=!0,Qe.add(mr)}function Bn(i,e,t){let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createImageData(128,128);for(let o=0;o<r.data.length;o+=4){let l=(Math.random()-.5)*e;r.data[o]=i[0]+l,r.data[o+1]=i[1]+l,r.data[o+2]=i[2]+l*.8,r.data[o+3]=255}s.putImageData(r,0,0);let a=new $s(n);return a.wrapS=a.wrapT=Qn,a.repeat.set(t,t),a.colorSpace=kt,a}var Jn=5.2,fn=-17.9,Ds=17.9,Ge=23,dr=new Fe({color:2854560,roughness:.22,metalness:.15});{let i=new _t(new Tt(160,160),new Fe({map:Bn([203,180,138],34,60),roughness:1}));i.rotation.x=-Math.PI/2,i.position.set(Ge-80,0,0),Qe.add(i);let e=new _t(new Tt(5e3,5e3),dr);e.rotation.x=-Math.PI/2,e.position.y=-.62,Qe.add(e);for(let[t,n,s,r]of[[1500,230,8364966,1],[1150,120,6262662,2]]){let a=[];for(let u=0;u<=160;u++){let d=-Math.PI+2*Math.PI*u/160,f=Math.abs(Math.atan2(Math.sin(d-1.45),Math.cos(d-1.45))),m=Math.max(0,Math.min(1,(f-.95)/.7)),_=m*n*(.45+.3*Math.sin(u*.21+r)+.18*Math.sin(u*.63+r*3)+.07*Math.sin(u*1.7));a.push(Math.cos(d)*t,-2,Math.sin(d)*t,Math.cos(d)*t,Math.max(0,_)-1,Math.sin(d)*t)}let l=[];for(let u=0;u<160;u++){let d=u*2;l.push(d,d+1,d+2,d+1,d+3,d+2)}let c=new Dt;c.setAttribute("position",new lt(a,3)),c.setIndex(l);let h=new _t(c,new Mt({color:s,side:Ot,fog:!1}));h.userData.far=!0,Qe.add(h)}}var nc=new wt;nc.visible=!1;Qe.add(nc);var sn=Qe;function ee(i,e,t,n,s,r){let a=new _t(i,e);return a.position.set(t,n,s),(r||sn).add(a),a}var fr=null,ba=null,Bh=[],cn={};function ZM(){let i=(P,F)=>new Fe({map:P,roughness:F===void 0?.9:F}),e=(P,F,O,W,N,H,q,ce)=>ee(new pt(P,F,O),W,N,H,q,ce),t=Ht([138,120,96],5,21,3),n=i(t),s=i(Ht([84,66,48],3,1,2)),r=i(Ht([70,56,42],4,1,2)),a=new Fe({color:1842206,roughness:.6,metalness:.7}),o=new Fe({map:Bn([168,146,104],30,4),roughness:1}),l=new Fe({map:Bn([156,136,100],30,3),roughness:1}),c=Ge-2.5,h=Ge+23,u=h-c,d=(c+h)/2;e(u,.1,3.4,n,d,0,0);for(let P of[-1.62,1.62])e(u,.22,.2,s,d,-.14,P),e(u,.12,.16,s,d,.1,P*1.02);for(let P=c+1;P<h;P+=2.6){e(.2,.22,3.2,s,P,-.16,0);for(let F of[-1.72,1.72]){let O=Math.round((P-c)/2.6)%2===0,W=ee(new it(.15,.17,O?3.3:2.4,9),r,P,O?-.25:-.9,F);O&&ee(new it(.17,.15,.06,9),s,P,1.42,F)}if(P<h-2)for(let F of[-1,1]){let O=e(.1,.1,3.6,s,P,-.85,0);O.rotation.x=F*.5}}for(let[P,F]of[[Ge+6,1.72],[Ge+11.2,1.72],[Ge+8.6,-1.72],[Ge+16.4,-1.72]]){let O=ee(new pi(.24,.045,6,14),o,P,.75,F);O.rotation.x=Math.PI/2,ee(new pi(.25,.045,6,14),o,P,.84,F).rotation.x=Math.PI/2}let f=(P,F,O)=>{for(let W=0;W<3;W++)ee(new pi(O-W*.02,.04,6,16),o,P,.09+W*.07,F).rotation.x=Math.PI/2};f(Ge+4,-1.2,.3),f(Ge+19,1.15,.34);let m=cn.merchant;m.position.set(Ge+17.5,-.35,-5.9),Qe.add(m);let _=cn.sloop;_.position.set(Ge+17.5,-.35,4.9),_.rotation.y=Math.PI,Qe.add(_);let b=e(1,.07,2.3,n,Ge+17.6,.66,-2.1);b.rotation.x=-.56;for(let P=0;P<5;P++){let F=e(1,.03,.05,s,Ge+17.6,.2+P*.25,-1.4-P*.4);F.rotation.x=-.56}let p=(P,F)=>{let O=new Dt().setFromPoints([new z(...P),new z((P[0]+F[0])/2,Math.min(P[1],F[1])-.25,(P[2]+F[2])/2),new z(...F)]);Qe.add(new Ki(O,new _s({color:9073742})))};p([Ge+8.6,.8,-1.72],[Ge+6,3.2,-3.6]),p([Ge+16.4,.8,-1.72],[Ge+21.5,2.2,-3.4]),p([Ge+11.2,.8,1.72],[Ge+10.5,1.5,3.4]),p([Ge+19,.6,1.72],[Ge+24.5,1.9,3.3]);let x=new Ti([[0,-.45],[.27,-.45],[.33,-.25],[.36,0],[.33,.25],[.27,.45],[0,.45]].map(([P,F])=>new he(P,F)),14),v=i(Ht([122,90,56],10,2,1),.8),y=[[-.38,.292],[-.2,.342],[.2,.342],[.38,.292]].map(([P,F])=>[P,new it(F,F,.035,14,1,!0)]),T=(P,F,O,W)=>{let N=new wt;N.position.set(P,F+(W?.36:.45),O),W&&(N.rotation.z=Math.PI/2,N.rotation.y=P*2.3),Qe.add(N),ee(x,v,0,0,0,N);for(let[H,q]of y)ee(q,a,0,H,0,N)},E=i(Ht([150,118,78],4,1,1)),g=(P,F,O,W,N)=>{let H=new wt;H.position.set(P,F+W/2,O),H.rotation.y=N,Qe.add(H),e(W,W,W,E,0,0,0,H);for(let q of[-1,1])for(let ce of[-1,1])e(.07,W+.03,.07,s,q*W/2,0,ce*W/2,H),e(W+.03,.07,.07,s,0,q*W/2,ce*W/2,H),e(.07,.07,W+.03,s,q*W/2,ce*W/2,0,H)},M=(P,F,O,W)=>{let N=ee(new Rn(.32,10,8),l,P,F+.2*W,O);N.scale.set(W*1.2,.7*W,W*.85),N.rotation.y=P};T(Ge+2.2,.05,1),T(Ge+2.9,.05,1.15),T(Ge+2.5,.05,.45,!0),g(Ge+14.6,.05,1.1,.8,.2),g(Ge+15.5,.05,1.2,.6,.6),g(Ge+14.7,.85,1.1,.55,.5),M(Ge+13.7,.05,1.2,1);for(let[P,F,O]of[[20.2,2.8,0],[20.9,3,0],[20.4,3.6,2],[19.6,-3.2,1],[20.6,-2.8,0],[21.5,-3.3,1],[20.3,-3.9,3],[21.1,-4.1,3],[20.7,-4,4]])O===0?T(P,0,F):O===2?T(P,0,F,!0):O===1?g(P,0,F,.75,P):O===3?M(P,0,F,1):M(P,.3,F,.9);let k=Qe.children.length;for(let[P,F,O]of[[-9.6,-4.4,0],[3.4,4.35,0],[4.15,4.4,1],[-13.2,4.4,0],[11.6,-4.4,1],[12.3,-4.45,0]])O?g(P,.12,F,.65,.1):T(P,.12,F);Bh.push(...Qe.children.slice(k));{let O=new ti;O.moveTo(-4.6/2,-1.5*.36),O.quadraticCurveTo(0,-1.5*.56,4.6*.3,-1.5*.4),O.quadraticCurveTo(4.6*.45,-1.5*.2,4.6/2,0),O.quadraticCurveTo(4.6*.45,1.5*.2,4.6*.3,1.5*.4),O.quadraticCurveTo(0,1.5*.56,-4.6/2,1.5*.36),O.closePath();let W=new Yi(O,{depth:.62,bevelEnabled:!1,curveSegments:8});W.rotateX(-Math.PI/2);let N=W.attributes.position;for(let ce=0;ce<N.count;ce++)N.getY(ce)<.3&&(N.setZ(ce,N.getZ(ce)*.45),N.setX(ce,N.getX(ce)*.9));W.computeVertexNormals();let H=new wt;H.position.set(Ge-2.6,0,7.2),H.rotation.set(0,.5,.12),Qe.add(H);let q=i(Ht([96,80,62],6,3,1));q.side=Ot,ee(W,q,0,0,0,H),e(4.6*.86,.03,1.5*.78,new Fe({color:3812384,roughness:1}),-.1,.34,0,H);for(let ce of[-1.2,-.2,.9])e(.22,.04,1.5*.86,s,ce,.5,0,H);for(let ce of[-.2,.15]){let Pe=ee(new it(.025,.025,3.2,6),s,-.2,.56,ce,H);Pe.rotation.z=Math.PI/2+.03,e(.6,.02,.14,s,1.5,.52,ce,H)}}{let P=Un(128,128,q=>{q.clearRect(0,0,128,128),q.strokeStyle="rgba(96,84,60,0.95)",q.lineWidth=1.4;for(let ce=-128;ce<256;ce+=12)q.beginPath(),q.moveTo(ce,0),q.lineTo(ce+128,128),q.stroke(),q.beginPath(),q.moveTo(ce,0),q.lineTo(ce-128,128),q.stroke()});P.repeat.set(3,1.4);let F=Ge-3.2,O=-8.4;for(let q of[-2,2])ee(new it(.05,.06,2.3,6),s,F+q,1.15,O);let W=ee(new it(.04,.04,4.3,6),s,F,2.2,O);W.rotation.z=Math.PI/2;let H=ee(new Tt(3.9,1.9,8,1),new Mt({map:P,transparent:!0,side:Ot,alphaTest:.3}),F,1.25,O).geometry.attributes.position;for(let q=0;q<H.count;q++)H.setZ(q,Math.sin(H.getX(q)*2.2)*.12*(1-(H.getY(q)+.95)/1.9))}let I=ee(new Tt(3.2,160),new Mt({color:7298372,transparent:!0,opacity:.35}),Ge-1.4,.006,0);I.rotation.x=-Math.PI/2;let U=Un(64,256,P=>{P.clearRect(0,0,64,256);for(let F=0;F<256;F+=2){let O=14+Math.sin(F*.11)*8+Math.sin(F*.37)*5+Math.random()*6,W=P.createLinearGradient(32-O,0,32+O,0);W.addColorStop(0,"rgba(255,255,255,0)"),W.addColorStop(.6,"rgba(255,255,255,0.75)"),W.addColorStop(1,"rgba(255,255,255,0)"),P.fillStyle=W,P.fillRect(32-O,F,O*2,2)}});U.repeat.set(1,6);let V=ee(new Tt(1.6,160),new Mt({map:U,transparent:!0,depthWrite:!1}),Ge+.2,-.33,0);V.rotation.x=-Math.PI/2;let J=ee(new Tt(1.2,160),new Fe({map:Bn([176,152,112],30,30),roughness:1}),Ge+.45,-.19,0);J.rotation.set(-Math.PI/2+0,0,0),J.rotation.y=.33,fr=Un(128,128,P=>{let F=P.createImageData(128,128),O=new Float32Array(16384);for(let W=0;W<O.length;W++){let N=W%128,H=W/128|0;O[W]=Math.sin(N*.196+Math.sin(H*.147)*2)+Math.sin(H*.245+Math.sin(N*.098)*1.5)*.7+Math.sin((N+H)*.393)*.3}for(let W=0;W<128;W++)for(let N=0;N<128;N++){let H=W*128+N,q=O[W*128+(N+1)%128]-O[H],ce=O[(W+1)%128*128+N]-O[H];F.data[H*4]=128+q*150,F.data[H*4+1]=128+ce*150,F.data[H*4+2]=255,F.data[H*4+3]=255}P.putImageData(F,0,0)});let R=new Tt(300,300,60,60);R.rotateX(-Math.PI/2),ba=ee(R,dr,Ge+60,-.35,0),ba.userData.base=R.attributes.position.array.slice(),fr.colorSpace=si,fr.repeat.set(160,160),dr.normalMap=fr,dr.normalScale.set(.55,.55),dr.needsUpdate=!0}var Ue={x0:-205,x1:-195,z0:-3.5,z1:3.5,h:2.8},Ef={},mf=null,$o=null,wh=null,ss=null,Qo=[];function Un(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new $s(n);return s.colorSpace=kt,s.wrapS=s.wrapT=Qn,s.anisotropy=Af,s}function gf(i,e,t,n){let s=i.getImageData(0,0,e,t);for(let r=0;r<s.data.length;r+=4){let a=(Math.random()-.5)*n;s.data[r]+=a,s.data[r+1]+=a,s.data[r+2]+=a*.8}i.putImageData(s,0,0)}function Ht(i,e,t,n){let s=Un(256,256,(r,a,o)=>{let l=a/e;for(let c=0;c<e;c++){let h=(Math.random()-.5)*26;r.fillStyle=`rgb(${i[0]+h|0},${i[1]+h|0},${i[2]+h*.8|0})`,r.fillRect(c*l,0,l,o),r.strokeStyle="rgba(30,18,10,0.25)",r.lineWidth=1;for(let u=0;u<9;u++){let d=c*l+3+Math.random()*(l-6);r.beginPath(),r.moveTo(d,0),r.bezierCurveTo(d+3,o*.3,d-3,o*.6,d+1,o),r.stroke()}r.fillStyle="rgba(15,9,5,0.75)",r.fillRect(c*l,0,2,o),Math.random()<.5&&(r.fillStyle="rgba(25,14,8,0.6)",r.beginPath(),r.ellipse(c*l+l/2,Math.random()*o,3,5,0,0,7),r.fill())}gf(r,a,o,18)});return s.repeat.set(t||1,n||1),s}function $M(){sn=nc;let i=(D,Z)=>new Fe({map:D,roughness:Z===void 0?.9:Z}),e=i(Ht([104,76,50],4,1,1)),t=i(Ht([62,45,31],3,1,1)),n=i(Ht([122,92,62],5,1,1),.8),s=i(Ht([74,54,38],8,3,2)),r=new Fe({color:3811869,roughness:.95}),a=Un(512,256,(D,Z,le)=>{let L=D.createLinearGradient(0,0,0,le);L.addColorStop(0,"#d9ceb4"),L.addColorStop(.55,"#d2c6aa"),L.addColorStop(1,"#a7997c"),D.fillStyle=L,D.fillRect(0,0,Z,le);for(let Ke=0;Ke<26;Ke++)D.fillStyle=`rgba(${90+Math.random()*40|0},${74+Math.random()*30|0},50,${.012+Math.random()*.025})`,D.beginPath(),D.ellipse(Math.random()*Z,Math.random()*le,20+Math.random()*70,10+Math.random()*40,Math.random()*3,0,7),D.fill();gf(D,Z,le,14)});a.wrapT=vn;let o=new Fe({map:a,roughness:1}),l=Un(256,256,(D,Z,le)=>{D.fillStyle="#9b917e",D.fillRect(0,0,Z,le);for(let L=0;L<8;L++)for(let Ke=-1;Ke<4;Ke++){let Oe=Math.random();D.fillStyle=`rgb(${150+Oe*36|0},${80+Oe*22|0},${54+Oe*14|0})`,D.fillRect(Ke*64+L%2*32+2,L*32+2,60,28)}for(let L=0;L<14;L++)D.fillStyle=`rgba(40,28,20,${.06+Math.random()*.1})`,D.beginPath(),D.ellipse(Math.random()*Z,Math.random()*le,20+Math.random()*50,14+Math.random()*30,0,0,7),D.fill();gf(D,Z,le,24)}),c=i(l),h=l.clone();h.repeat.set(5,3.5),h.needsUpdate=!0;let u=l.clone();u.repeat.set(1.2,1.6),u.needsUpdate=!0;let d=i(u),f=new Fe({color:10658979,roughness:.38,metalness:.85}),m=new Fe({color:11569722,roughness:.4,metalness:.8}),_=new Fe({color:1842206,roughness:.6,metalness:.7}),b=new Fe({color:2046506,roughness:.18,metalness:.15}),p=new Fe({color:15328472,roughness:.8}),x=new Fe({color:9071172,roughness:.5}),v=new Fe({color:10135696,roughness:.35}),y=new Fe({color:15260864,roughness:.7}),T=new Mt({color:16762474}),E=new Fe({map:Bn([150,130,96],30,3),roughness:1}),g=(D,Z,le,L,Ke,Oe,gt,be)=>ee(new pt(D,Z,le),L,Ke,Oe,gt,be),M=(Ue.x0+Ue.x1)/2,k=Ue.x1-Ue.x0,I=Ue.z1-Ue.z0,U=Ue.h;ee(new Tt(k,I),i(h),M,0,0).rotation.x=-Math.PI/2,ee(new Tt(k,I),s,M,U,0).rotation.x=Math.PI/2;let V=(D,Z,le,L,Ke)=>{let Oe=o.clone();Oe.map=a.clone(),Oe.map.repeat.set(Ke,1),Oe.map.needsUpdate=!0;let gt=ee(new Tt(D,U),Oe,Z,U/2,le);gt.rotation.y=L};V(k,M,Ue.z0,0,3),V(k,M,Ue.z1,Math.PI,3),V(I,Ue.x0,0,Math.PI/2,2),V(I,Ue.x1,0,-Math.PI/2,2);for(let D=Ue.x0+.06;D<=Ue.x1;D+=(k-.12)/8)g(.13,U,.07,r,D,U/2,Ue.z0+.035);for(let D of[Ue.x0+.06,-204,-201.75,-198.8,-195.9,Ue.x1-.06])g(.13,U,.07,r,D,U/2,Ue.z1-.035);for(let D=Ue.z0+.06;D<=Ue.z1;D+=(I-.12)/6)g(.07,U,.13,r,Ue.x0+.035,U/2,D),g(.07,U,.13,r,Ue.x1-.035,U/2,D);g(k,.14,.08,r,M,.07,Ue.z0+.04),g(k,.14,.08,r,M,.07,Ue.z1-.04),g(.08,.14,I,r,Ue.x0+.04,.07,0),g(.08,.14,I,r,Ue.x1-.04,.07,0),g(k,.16,.09,r,M,U-.08,Ue.z0+.045),g(k,.16,.09,r,M,U-.08,Ue.z1-.045);for(let D=Ue.x0+.5;D<Ue.x1;D+=.62)g(.1,.15,I,r,D,U-.075,0);g(k,.26,.28,r,M,U-.28,.4);let J=Un(256,160,(D,Z,le)=>{let L=D.createLinearGradient(0,0,0,le);L.addColorStop(0,"#f4f6ea"),L.addColorStop(1,"#cfdccf"),D.fillStyle=L,D.fillRect(0,0,Z,le),D.strokeStyle="rgba(52,56,58,0.9)",D.lineWidth=2.2;for(let Ke=-le;Ke<Z+le;Ke+=22)D.beginPath(),D.moveTo(Ke,0),D.lineTo(Ke+le*.62,le),D.stroke(),D.beginPath(),D.moveTo(Ke,0),D.lineTo(Ke-le*.62,le),D.stroke()}),R=new Mt({map:J}),P=new Mt({map:J,transparent:!0,opacity:.2,blending:ra,depthWrite:!1});for(let D of[-200.3,-197.3]){ee(new Tt(1.9,1.2),R,D,1.72,Ue.z1-.012).rotation.y=Math.PI;for(let le of[-.475,.475])g(.05,1.2,.05,r,D+le/1,1.72,Ue.z1-.03);g(.06,1.2,.06,r,D,1.72,Ue.z1-.03);for(let le of[1.09,2.35])g(2.06,.08,.09,r,D,le,Ue.z1-.04);for(let le of[-.99,.99])g(.08,1.34,.09,r,D+le,1.72,Ue.z1-.04);g(2.1,.05,.2,e,D,1.04,Ue.z1-.1);let Z=ee(new Tt(2,2.3),P,D-.3,.012,1.7);Z.rotation.x=-Math.PI/2}g(1.15,2.2,.06,e,-203,1.1,Ue.z1-.05);for(let D of[.45,1.75])g(.9,.06,.02,_,-203.05,D,Ue.z1-.09);g(.05,.14,.04,_,-202.55,1.1,Ue.z1-.1);for(let D of[-.63,.63])g(.1,2.3,.1,r,-203+D,1.15,Ue.z1-.05);g(1.36,.12,.1,r,-203,2.3,Ue.z1-.05),g(5.4,.95,.65,e,-200.9,.475,-2.2),g(5.6,.07,.8,n,-200.9,.985,-2.2);for(let D=-203.4;D<-198.3;D+=.9)g(.07,.8,.02,t,D,.5,-1.866);g(5.4,.08,.02,t,-200.9,.86,-1.866),g(5.4,.1,.03,t,-200.9,.05,-1.86);for(let D of[1.2,1.7,2.2])g(4.6,.045,.3,t,-201.2,D,Ue.z0+.2);for(let D of[-203.5,-201.2,-198.9])g(.05,1.5,.3,t,D,1.65,Ue.z0+.2);let F=[[0,0],[.085,0],[.105,.04],[.1,.09],[.06,.13],[.022,.17],[.02,.24],[.028,.245],[0,.245]].map(([D,Z])=>new he(D,Z)),O=new Ti(F,14),W=new Ti([[0,0],[.07,0],[.1,.08],[.095,.17],[.05,.23],[.045,.29],[.055,.3],[0,.3]].map(([D,Z])=>new he(D,Z)),14),N=new Ti([[0,0],[.06,0],[.11,.1],[.115,.17],[.07,.24],[.075,.26],[0,.26]].map(([D,Z])=>new he(D,Z)),16),H=Un(128,128,D=>{D.fillStyle="#1b3f8a",D.fillRect(0,0,128,128),D.fillStyle="#eef0ea",D.beginPath(),D.arc(64,64,62,0,7),D.fill(),D.strokeStyle="#2a4f9c",D.lineWidth=3;for(let Z of[56,40])D.beginPath(),D.arc(64,64,Z,0,7),D.stroke();D.lineWidth=2;for(let Z=0;Z<6.28;Z+=.52)D.beginPath(),D.moveTo(64+Math.cos(Z)*42,64+Math.sin(Z)*42),D.quadraticCurveTo(64+Math.cos(Z+.2)*50,64+Math.sin(Z+.2)*50,64+Math.cos(Z+.26)*55,64+Math.sin(Z+.26)*55),D.stroke();for(let Z=0;Z<6.28;Z+=1.05)D.beginPath(),D.ellipse(64+Math.cos(Z)*18,64+Math.sin(Z)*18,9,4,Z,0,7),D.stroke()}),q=[new Fe({color:15263968,roughness:.3}),new Fe({map:H,roughness:.25}),new Fe({color:15263968,roughness:.3})],ce=new it(.125,.11,.014,22),Pe=new it(.04,.048,.12,12),$=new pi(.03,.007,6,10,Math.PI),de=(D,Z,le,L)=>{let Ke=new wt;Ke.position.set(D,Z,le),Ke.rotation.y=L||0,sn.add(Ke),ee(Pe,f,0,.06,0,Ke);let Oe=ee($,f,.045,.06,0,Ke);Oe.rotation.z=-Math.PI/2},Ae=Ue.z0+.2;for(let D=0;D<5;D++)ee(O,b,-203.2+D*.4,1.2225,Ae);for(let D=0;D<4;D++){let Z=ee(ce,q,-200.8+D*.42,1.345,Ae-.06);Z.rotation.x=Math.PI/2-.22}for(let D=0;D<4;D++)ee(W,x,-203.1+D*.5,1.7225,Ae);ee(N,v,-200.6,1.7225,Ae);for(let D=0;D<5;D++)de(-200.05+D*.22,1.7225,Ae,.5*D);for(let D=0;D<6;D++)ee(O,b,-203.2+D*.36,2.2225,Ae);for(let D=0;D<3;D++){let Z=ee(ce,f,-200.6+D*.5,2.345,Ae-.06);Z.rotation.x=Math.PI/2-.22}ee(new Tt(.6,.45),new Fe({map:Un(128,96,D=>{D.fillStyle="#23262a",D.fillRect(0,0,128,96),D.strokeStyle="#d8d8d0",D.lineWidth=2;for(let Z=0;Z<3;Z++)for(let le=0;le<4+Z*2;le++)D.beginPath(),D.moveTo(12+le*9,14+Z*26),D.lineTo(14+le*9,30+Z*26),D.stroke();D.strokeStyle="#6b4a2c",D.lineWidth=6,D.strokeRect(0,0,128,96)}),roughness:.9}),-198.3,1.7,Ue.z0+.012);let Xe=Un(128,128,D=>{D.fillStyle="#6a4a24",D.fillRect(0,0,128,128),D.strokeStyle="#2c1c0c",D.lineWidth=3;for(let Z=0;Z<4;Z++)for(let le=0;le<4;le++){let L=le*34+Z%2*17-6,Ke=Z*34;D.fillStyle=`rgb(${120+Math.random()*40|0},${84+Math.random()*24|0},40)`,D.beginPath();for(let Oe=0;Oe<6;Oe++)D.lineTo(L+17+Math.cos(Oe*1.047)*19,Ke+17+Math.sin(Oe*1.047)*19);D.closePath(),D.fill(),D.stroke()}}),Me=ee(new Rn(.42,18,10,0,6.3,0,1.2),i(Xe,.45),Ue.x1-.62,2.1,-.6);Me.scale.set(.8,.5,1.05),Me.rotation.z=Math.PI/2;let je=new Ti([[0,-.52],[.34,-.52],[.4,-.3],[.44,0],[.4,.3],[.34,.52],[0,.52]].map(([D,Z])=>new he(D,Z)),18),At=i(Ht([118,86,52],10,2,1),.8),Ye=(D,Z,le)=>{let L=new wt;L.position.set(D,Z,le),L.rotation.z=Math.PI/2,sn.add(L),ee(je,At,0,0,0,L);for(let[Oe,gt]of[[-.45,.362],[-.24,.416],[.24,.416],[.45,.362]])ee(new it(gt,gt,.04,18,1,!0),_,0,Oe,0,L);let Ke=g(.14,.03,.03,m,D+.58,Z-.26,le);return g(.03,.07,.03,m,D+.62,Z-.22,le),Ke};for(let D of[-2.85,-1.9]){Ye(-204.35,.8,D),g(.9,.08,.1,t,-204.35,.32,D-.25),g(.9,.08,.1,t,-204.35,.32,D+.25);for(let Z of[-.38,.38])g(.1,.3,.7,t,-204.35+Z,.15,D)}let at=(D,Z,le,L)=>{g(le,.05,L,n,D,.745,Z);for(let Ke of[-1,1]){let Oe=D+Ke*(le/2-.28);for(let gt of[-1,1]){let be=g(.07,.76,.07,t,Oe,.36,Z+gt*.17);be.rotation.x=-gt*.3}g(.07,.07,L*.7,t,Oe,.69,Z)}g(le-.5,.06,.05,t,D,.3,Z)},ht=(D,Z,le)=>{g(le,.05,.28,n,D,.45,Z);for(let L of[-1,1])g(.05,.45,.26,t,D+L*(le/2-.16),.225,Z);g(le-.3,.07,.04,t,D,.3,Z)},ae=(D,Z,le)=>{let L=new wt;L.position.set(D,0,Z),L.rotation.y=le,sn.add(L),g(.34,.04,.26,n,0,.47,0,L);for(let Ke of[-1,1])for(let Oe of[-1,1]){let gt=g(.04,.47,.04,t,Ke*.13,.235,Oe*.09,L);gt.rotation.z=-Ke*.1}g(.26,.05,.03,t,0,.36,.09,L),g(.26,.05,.03,t,0,.36,-.09,L)};at(-198.2,1.3,1.9,.8),ht(-198.2,.58,1.7),ht(-198.2,2.02,1.7),at(-201.6,1,1.9,.8),ht(-201.6,.28,1.7),ht(-201.6,1.72,1.7),g(.7,.04,.7,n,-195.9,.75,2.3);for(let D of[-1,1])for(let Z of[-1,1])g(.05,.74,.05,t,-195.9+D*.28,.37,2.3+Z*.28);ae(-202.6,-1.25,.3),ae(-200.2,-1.3,-.2),ae(-196.9,-1.7,.9),g(.4,.05,1.7,n,-204.72,.45,2),g(.05,1.5,1.7,e,-204.9,.75,2);for(let D of[-.85,.85])g(.42,1.05,.05,e,-204.72,.525,2+D);g(.38,.4,1.66,t,-204.72,.2,2);for(let D of[-1,1])g(.6,1.45,.4,d,Ue.x1-.3,.725,-.6+D*.9);g(.6,1.25,2.2,d,Ue.x1-.3,2.175,-.6),g(.12,1.45,1.4,new Mt({color:919815}),Ue.x1-.07,.725,-.6),g(.62,.2,2.3,r,Ue.x1-.3,1.5,-.6),g(.75,.05,2.4,e,Ue.x1-.36,1.62,-.6),g(.7,.06,1.5,d,Ue.x1-.42,.03,-.6),g(.03,1.1,.03,_,Ue.x1-.2,.75,-1.2),g(.03,.03,.7,_,Ue.x1-.2,1.2,-.87),g(.015,.4,.015,_,Ue.x1-.2,1,-.6);let ge=ee(new Rn(.22,14,10),_,Ue.x1-.2,.72,-.6);ge.scale.y=.8,mf=ee(new ys(.22,.5,7),new Mt({color:16751150}),Ue.x1-.22,.3,-.6);let me=ee(new ys(.13,.32,6),T,Ue.x1-.26,.22,-.42);Qo.push(me);for(let[D,Z]of[[-.2,.3],[.15,-.4],[0,1.2]])ee(new it(.05,.05,.5,7),t,Ue.x1-.25,.09,-.6+D).rotation.set(Math.PI/2,0,Z);for(let D=0;D<7;D++){let Z=ee(new it(.055,.055,.55,7),e,Ue.x1-.45,.06+(D>3?.11:0),.95+D%4*.12+(D>3?.06:0));Z.rotation.z=Math.PI/2}for(let D=0;D<3;D++)ee(ce,f,Ue.x1-.5,1.77,-1.2+D*.32).rotation.set(0,0,Math.PI/2-.22);ee(N,v,Ue.x1-.42,1.645,.1),$o=new ts(16751946,0,8,1.7),$o.position.set(Ue.x1-.9,.8,-.6),sn.add($o);let Ie=(D,Z,le)=>{ee(new it(.075,.06,.015,14),m,D,Z+.008,le),ee(new it(.02,.024,.05,8),m,D,Z+.04,le),g(.1,.008,.025,m,D+.1,Z+.012,le),ee(new it(.011,.011,.12,6),y,D,Z+.12,le);let L=ee(new Rn(.016,6,6),T,D,Z+.2,le);L.scale.y=1.9,Qo.push(L)};Ie(-198.75,.77,1.3),Ie(-201,.77,1.05),Ie(-202.9,1.02,-2.2),Ie(Ue.x1-.4,1.645,-1.5);{let le=U-.95;g(.012,.5,.012,_,-200.2,le+.42,.4),g(.18,.02,.18,_,-200.2,le+.17,.4),g(.18,.02,.18,_,-200.2,le-.13,.4);for(let L of[-1,1])for(let Ke of[-1,1])g(.015,.3,.015,_,-200.2+L*.08,le+.02,.4+Ke*.08);g(.14,.26,.14,new Mt({color:16766346,transparent:!0,opacity:.55}),-200.2,le+.02,.4),wh=new ts(16767392,0,9,1.6),wh.position.set(-200.2,le,.4),sn.add(wh)}de(-198.7,.77,1.08,1),de(-197.75,.77,1.5,3),de(-202.15,.77,.85,2),de(-201.3,.77,1.2,4.5),de(-201.9,1.02,-2.3,.6),ee(W,x,-202.3,1.02,-2.05),ee(W,x,-197.6,.77,1.12);for(let[D,Z]of[[0,0],[.05,.03],[-.03,.05],[.09,-.02]])ee(new it(.018,.018,.004,10),f,-200+D,1.022,-2+Z);for(let[D,Z,le]of[[-195.6,-2.9,1],[-196.1,-3,.85],[-195.7,-2.4,.9]])ee(new Rn(.3,10,8),E,D,.24*le,Z).scale.set(le,.85*le,le*.9);let we=ee(new pi(.2,.04,6,16),E,-204.4,.05,-.7);we.rotation.x=Math.PI/2;let ot=g(.03,1.4,.03,e,-204.8,.72,.6);ot.rotation.z=-.12,g(.1,.25,.18,E,-204.7,.13,.6);let De={};for(let D of Ls)De[D.id]=new wt,De[D.id].position.set(D.x,D.y,D.z),sn.add(De[D.id]);ee(O,b,0,0,0,De.bottle).scale.setScalar(1.25),ee(O,b,.26,0,.05,De.bottle);for(let D=0;D<6;D++)ee(ce,f,0,.009+D*.016,0,De.pewter);for(let[D,Z]of[[-.06,.2],[.05,-.15],[.14,.05]]){let le=new wt;le.position.set(0,.012,D),le.rotation.y=Z,De.pipes.add(le);let L=ee(new it(.006,.008,.34,6),p,0,0,0,le);L.rotation.z=Math.PI/2,ee(new it(.016,.012,.045,8),p,.175,.015,0,le)}{let D=Un(64,64,L=>{L.fillStyle="#c8873a",L.fillRect(0,0,64,64),L.fillStyle="#4a2412";for(let Ke=0;Ke<46;Ke++)L.beginPath(),L.ellipse(Math.random()*64,Math.random()*64,3+Math.random()*7,2+Math.random()*5,Math.random()*3,0,7),L.fill()}),Z=new Fe({map:D,roughness:.3}),le=new Fe({color:15260864,roughness:.5});g(.2,.11,.14,Z,0,.065,0,De.turtle),g(.21,.012,.15,le,0,.126,0,De.turtle),g(.19,.05,.13,Z,0,.157,0,De.turtle),g(.22,.012,.16,Z,0,.006,0,De.turtle),g(.02,.03,.004,le,0,.07,.072,De.turtle)}for(let D of Ls){let Z=new _t(new vs(.27,.3,32),new Mt({color:14263361,side:Ot}));Z.rotation.x=-Math.PI/2,Z.position.y=.004,De[D.id].add(Z),Ef[D.id]=Z}ss=new wt,ss.position.set(-200.4,1.02,-2.05),ss.visible=!1,sn.add(ss),ee(new it(.11,.06,.07,16),f,0,.035,0,ss),ee(new it(.1,.1,.01,16),new Fe({color:8014370,roughness:.6}),0,.066,0,ss),g(.012,.01,.16,f,.16,.006,.02,ss),sn=Qe}function os(i){A.place=i;let e=i!=="out",t=i==="in"?nc:i==="ware"?Ni:Qe;for(let n of Qe.children)n.isLight||(n===nc?n.visible=i==="in":n===Ni?n.visible=i==="ware":n===jn||n===Ps?n.visible=!1:n.visible=!e||i==="ware"&&n.userData.far===!0);t.add(He),He.visible=i!=="ware",kn&&t.add(kn),B0.intensity=e?.5:2.3,ga.intensity=e?1.5:2.6,i==="in"?ga.position.set(.3,.75,1):i==="ware"?ga.position.set(1,.7,.2):ga.position.set(-.35,1,.75),$o.intensity=i==="in"?16:0,wh.intensity=i==="in"?9:0,tc&&(tc.intensity=i==="ware"?14:0),i==="in"?(st.x=-201,st.z=-2.95,He.position.set(st.x,0,st.z)):i==="ware"?(st.x=9999,st.z=0):(st.x=-5.25,st.z=-Jn+1.05,He.position.set(st.x,.12,st.z)),He.rotation.y=0,gn&&(gn.visible=!e&&!A.talked)}var Xo={h1:6,h2:5,h3:7.2,h4:6.6,h5:5.4,h6:5.6},QM=["h2","h6","h1","h4","h5","h3"],eS=["h3","h1","h5","h2","h4","h6"],z0=new bh;z0.setMeshoptDecoder(b0);var xr=!1;function G0(i){se("loadnote").hidden=!1,se("loadnote").textContent="Part of the game did not load ("+i+"). Reload the page to try again."}function H0(i){return new Promise((e,t)=>{let n=document.createElement("script");n.src="models/"+i+".js",n.onload=e,n.onerror=()=>{G0(i),t(i)},document.head.appendChild(n)})}function bf(i){return H0(i).then(()=>new Promise((e,t)=>{let n=atob(window.__models[i]),s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);delete window.__models[i],z0.parse(s.buffer,"",e,()=>{G0(i),t(i)})}))}async function _0(i,e){let t=0;await Promise.all(i.map(n=>(n.startsWith("tex_")?H0(n):bf(n).then(s=>{window.__got=window.__got||{},window.__got[n]=s})).then(()=>{t++,e&&e(t/i.length)})))}var V0={},He=null,st={x:-5.25,z:-Jn+1.05},Af=as.capabilities.getMaxAnisotropy(),y0={Brick:["brick","brick_n"],Shingle:["shingle","shingle_n"],ClayTile:["clay","clay_n"],Wood:["wood","wood_n"],Stone:["stone","stone_n"],Plaster:["plaster","plaster_n"],LeadedGlass:["glass","glass_n"],Hull:["hull","hull_n"],Spar:["hull","hull_n"],Tar:["hull","hull_n"],Ochre:["hull","hull_n"],Red:["hull","hull_n"],Deck:["deck","deck_n"],Sail:["canvas"],Glass:["glass"],Flag:["ensign"]},of={},cf={},PT=new tr,Ih={};async function v0(){await Promise.all(Object.keys(window.__tex||{}).filter(i=>!Ih[i]).map(i=>new Promise(e=>{let t=new Image;t.onload=()=>{Ih[i]=t,e()},t.onerror=()=>e(),t.src=window.__tex[i]})))}function Lh(i,e){if(!of[i]&&Ih[i]){let t=new Jt(Ih[i]);t.needsUpdate=!0,t.flipY=!1,t.wrapS=t.wrapT=Qn,t.colorSpace=e?kt:si,t.anisotropy=Af,of[i]=t}return of[i]||null}function fa(i){return i.traverse(e=>{if(e.isMesh&&y0[e.material.name]){let t=e.material.name;if(!cf[t]){let n=e.material,[s,r]=y0[t];n.map=Lh(s,!0),n.color.set(16777215),r&&(n.normalMap=Lh(r,!1)),n.needsUpdate=!0,cf[t]=n}e.material=cf[t]}}),tS(i)}function tS(i){return i.traverse(e=>{if(e.isMesh){let t=e.material;t.map&&(t.map.anisotropy=Af),t.name==="LeadedGlass"&&(t.emissive=new qe(4875376),t.emissiveMap=t.map,t.roughness=.2),e.isSkinnedMesh&&(e.frustumCulled=!1)}}),i}var As=null,Kn=null,ai=null,Th=null,Ns={},kn=null,jo=!1,lf=!1,Xt={},W0=[],mn={},nS=/^(Sit|Injured|StumbleBack|JogStumble|Terrified)/;function Eh(i,e){let t=mn[i];if(!t)return null;let n=t.clone();return e=e||nS.test(i),n.tracks=n.tracks.filter(s=>{if(s.name.endsWith(".scale"))return!1;if(!s.name.endsWith(".position"))return!0;if(!e||!/Hips/.test(s.name))return!1;let r=s.values,a=r[0],o=r[2];for(let l=0;l<r.length;l+=3)r[l]=a,r[l+2]=o;return!0}),n}function ec(i,e,t,n){let s=e&&Eh(e)||Eh("Idle")||Th;if(!s&&!n)return;let r=t||new na(i),a=n||r.clipAction(s);n||(a.play(),a.time=Math.random()*s.duration),t||W0.push(r);let o={},l={mx:r,base:a,cur:a,timer:0,get(c){if(!o[c]){let h=Eh(c);if(!h)return null;o[c]=r.clipAction(h)}return o[c]},play(c,h,u){let d=c?this.get(c):this.base;!d||d===this.cur||(d.reset(),d.setLoop(h?No:rh),d.clampWhenFinished=!!h,d.fadeIn(.35).play(),this.cur.fadeOut(.35),this.cur=d,this.timer=h?Math.max(.5,d.getClip().duration-.35):u||0)},rest(){this.play(null)},tick(c){this.timer>0&&(this.timer-=c,this.timer<=0&&this.cur!==this.base&&this.rest())}};return i.userData.anim=l,l}var iS=["Talk1","Talk2","Talk3"],sS=0,dn=null;function rS(i){return i==="Abba"?He:i==="Kofi"?A.place==="after"?Ns.kofi:Xt.kofi:i==="Emmanuel Heath"?Xt.heath:i==="Sam"?A.place==="after"?Ns.sailor:Xt.sailor:i==="Symon Benning"?A.place==="after"?Ns.benning:Xt.benning:null}function aS(i,e){let t=rS(i);if(e&&t&&t.userData.anim&&mn[e]){dn&&dn!==t&&dn.userData.anim&&dn.userData.anim.rest(),dn=t,t.userData.anim.play(e,!0);return}dn&&dn!==t&&dn.userData.anim&&dn.userData.anim.rest(),dn=t,t&&t.userData.anim&&mn.Talk1&&t.userData.anim.play(t.userData.sits&&mn.SitTalk?"SitTalk":iS[sS++%3])}function oS(i){dn&&dn.userData.anim&&(i&&mn.Wave?dn.userData.anim.play("Wave",!0):dn.userData.anim.rest()),dn=null}var Nt={leg:0,wait:1.5,box:null};function cS(i){let e=Ma[0],t=Xt.kofi,n=t.userData.anim;if(!n)return;Nt.go||(Nt.go=!0,n.play("CarryIdle"));let[s,r]=e.route,a=Nt.leg===0?r:s;if(Nt.box||(Nt.box=new _t(new pt(.44,.32,.34),new Fe({map:Ht([150,118,80],3,1,2),roughness:.9})),Qe.add(Nt.box),Nt.hl=t.getObjectByName("mixamorigLeftHand"),Nt.hr=t.getObjectByName("mixamorigRightHand")),Nt.hl&&Nt.hr){let m=Nt.hl.getWorldPosition(Q0),_=Nt.hr.getWorldPosition($0);Nt.box.position.copy(m).add(_).multiplyScalar(.5),Nt.box.position.y-=.02,Nt.box.rotation.y=t.rotation.y}Nt.box.visible=t.visible&&Nt.leg===0;let o=Math.hypot(A.x-e.x,A.z-e.z)<3.2||dn===t;if(o||Nt.wait>0){e.walking&&(e.walking=!1,n.play(Nt.leg===0?"CarryIdle":null)),o||(Nt.wait-=i),Nt.wait<=0&&!o&&(e.walking=!0,n.play(Nt.leg===0?"Carry":"Walk"));return}e.walking||(e.walking=!0,n.play(Nt.leg===0?"Carry":"Walk"));let l=a[0]-e.x,c=a[1]-e.z,h=Math.hypot(l,c),u=1.25*i,f=Math.atan2(l,c)-t.rotation.y;f=Math.atan2(Math.sin(f),Math.cos(f)),t.rotation.y+=f*Math.min(1,i*5),e.ry=t.rotation.y,h<=u?(e.x=a[0],e.z=a[1],Nt.leg=1-Nt.leg,Nt.wait=1.6,e.walking=!1,n.play(Nt.leg===0?"CarryIdle":null)):(e.x+=l/h*u,e.z+=c/h*u),t.position.set(e.x,e.x>Ge-2.5&&Math.abs(e.z)<1.75?.06:0,e.z)}function zh(i){for(let e of Ma)Xt[e.id]&&(Xt[e.id].visible=i)}function lS(){let i=document.createElement("canvas");i.width=264,i.height=200;let e=i.getContext("2d");e.fillStyle="#5d4a36",e.fillRect(0,0,264,200),e.strokeStyle="#d9a441",e.lineWidth=6,e.strokeRect(8,8,248,184),e.fillStyle="#3f7a5c",e.beginPath(),e.ellipse(132,86,62,40,0,0,7),e.fill(),e.beginPath(),e.ellipse(206,80,18,13,0,0,7),e.fill();for(let[n,s]of[[88,50],[176,50],[88,122],[176,122]])e.beginPath(),e.ellipse(n,s,20,10,(n<132?-1:1)*(s<86?.6:-.6),0,7),e.fill();e.strokeStyle="#2a563f",e.lineWidth=3,e.beginPath(),e.moveTo(132,48),e.lineTo(132,124),e.moveTo(74,86),e.lineTo(190,86),e.stroke(),e.fillStyle="#f1ead9",e.font="600 30px Georgia, serif",e.textAlign="center",e.fillText("THE TURTLE",132,174);let t=new $s(i);return t.colorSpace=kt,t}var gn=null,Sa=[];function hS(){let i=(t,n,s,r)=>{let a=V0[t].clone(!0);a.position.set(n,0,s),a.rotation.y=r,Qe.add(a);let o=Math.max(0,Math.min(1,(n-fn)/(Ds-fn))),l=Math.sin(n*12.9+s*78.2)*43758.5%1,c=Math.abs(l);return Sa.push({m:a,ry:r,sink:n<fn?1.2+c*1.5:c>.72?13:2.2+o*4.5+c*2.5,tx:(c-.5)*.3,tz:(c*7%1-.5)*.24,delay:(1-o)*4.5+c*2,dur:4.5+c*3}),a},e=fn;for(let t of QM){let n=i(t,e+Xo[t]/2,-Jn-4,0);if(t==="h1"){let s=new Mt({map:lS()});for(let r of[-1,1]){let a=new _t(new Tt(.68,.52),s);a.position.set(r*.028,3.94,4.67),a.rotation.y=r*Math.PI/2,n.add(a)}}e+=Xo[t]}e=fn;for(let t of eS)i(t,e+Xo[t]/2,Jn+4,Math.PI),e+=Xo[t];i("h4",fn-5.9,-3.4,Math.PI/2),i("h2",fn-5.9,2.4,Math.PI/2),i("h6",fn-5.9,8,Math.PI/2),i("h3",fn-5.9,-10.5,Math.PI/2),He.position.set(st.x,.12,st.z),Qe.add(He),gn=new _t(new vs(.75,.9,40),new Mt({color:14263361,transparent:!0,opacity:.8,side:Ot})),gn.rotation.x=-Math.PI/2,gn.position.set(st.x,.14,st.z+.2),Qe.add(gn)}var hf=!1,Pn=new Set,pn={id:null,ox:0,oy:0,x:0,y:0},_i={id:null,lx:0,ly:0},oi=!1;addEventListener("keydown",i=>{let e=i.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e)&&A.started&&i.preventDefault(),Pn.add(e),!!A.started)if(e==="escape"&&(_r(),Y0()),se("dialogue").hidden===!1&&(e==="enter"||e===" ")){let t=se("next");t.hidden||t.click()}else(e==="e"||e==="enter")&&!se("talk").hidden?se("talk").click():e==="j"&&(se("journal").hidden?Cf():_r())});addEventListener("keyup",i=>Pn.delete(i.key.toLowerCase()));addEventListener("blur",()=>Pn.clear());On.addEventListener("pointerdown",i=>{if(!(!A.started||oi))if(On.setPointerCapture(i.pointerId),i.pointerType==="touch"&&i.clientX<innerWidth*.42&&pn.id===null){pn.id=i.pointerId,pn.ox=i.clientX,pn.oy=i.clientY,pn.x=pn.y=0;let e=se("stick");e.hidden=!1,e.style.left=i.clientX+"px",e.style.top=i.clientY+"px",se("nub").style.transform="translate(-50%,-50%)"}else _i.id===null&&(_i.id=i.pointerId,_i.lx=i.clientX,_i.ly=i.clientY)});On.addEventListener("pointermove",i=>{if(i.pointerId===pn.id){let e=i.clientX-pn.ox,t=i.clientY-pn.oy,n=Math.hypot(e,t),s=48;n>s&&(e*=s/n,t*=s/n),pn.x=e/s,pn.y=t/s,se("nub").style.transform=`translate(calc(-50% + ${e}px), calc(-50% + ${t}px))`}else if(i.pointerId===_i.id){let e=i.pointerType==="touch"?.0052:.0034;A.yaw-=(i.clientX-_i.lx)*e,A.pitch=Math.max(-.9,Math.min(.9,A.pitch-(i.clientY-_i.ly)*e)),_i.lx=i.clientX,_i.ly=i.clientY}});var q0=i=>{i.pointerId===pn.id&&(pn.id=null,pn.x=pn.y=0,se("stick").hidden=!0),i.pointerId===_i.id&&(_i.id=null)};On.addEventListener("pointerup",q0);On.addEventListener("pointercancel",q0);var Dh=null;function uS(){Dh=[];let i=new En;for(let e of Bh){if(!e.visible&&!e.isGroup&&!e.isMesh||(i.setFromObject(e),i.isEmpty()))continue;let t=i.max.x-i.min.x,n=i.max.z-i.min.z,s=i.max.y-i.min.y;i.min.y>1.2||s<.25||t>4||n>4||t*n<.05||Dh.push([i.min.x,i.min.z,i.max.x,i.max.z])}}function dS(i,e){return i>Ge-2.5&&Math.abs(e)<1.75?.06:i>fn&&i<Ds&&Math.abs(e)>Jn-1.7&&Math.abs(e)<Jn+.1?.12:0}function M0(i,e){return A.place!=="out"||re.ruin?0:i>Ge-2.5&&Math.abs(e)<1.75?.06:i>fn&&i<Ds&&Math.abs(e)>Jn-1.7&&Math.abs(e)<Jn+.1?.12:0}function fS(i,e){if(A.place==="ware"){i=Math.max(ma+.5,Math.min(Yt-.6,i)),e=Math.max(-1.4,Math.min(4.4,e));for(let[t,n,s]of[[-258.6,2.9,1.5],[-252.5,1.2,1]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(A.place==="after"){i=Math.max(fn+.6,Math.min(.4,i)),e=Math.max(-3.4,Math.min(3.4,e));for(let t of ig)[i,e]=FS(i,e,t[0],t[1],t[2]/2+.35,t[4]/2+.35,t[5]);for(let[t,n,s]of[[Ko,Jo,.75],[st.x,st.z,.65],[pr.x,pr.z,.65],...Es.map(r=>[r[0],r[1],.6])]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(A.place==="yard"){i=Math.max(Wt+.8,Math.min(Wt+13,i)),e=Math.max(qt-13,Math.min(qt+4.5,e));let t=i-(Wt+6),n=e-(qt-2),s=Math.hypot(t,n);return s<1.7&&s>0&&(i=Wt+6+t/s*1.7,e=qt-2+n/s*1.7),[i,e]}if(A.place==="sea")return[Math.max(Ge+4,Math.min(Ge+75,i)),Math.max(9,Math.min(75,e))];if(A.place==="in"){i=Math.max(Ue.x0+.45,Math.min(Ue.x1-.95,i)),e=Math.max(-1.5,Math.min(Ue.z1-.45,e));for(let[t,n,s]of[[-198.2,1.3,1.25],[-201.6,1,1.25],[-195.9,2.3,.75]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}i=Math.max(fn-.2,Math.min(Ge+23,i)),!xr&&i<Ds+2.5&&(i=Ds+2.5,hf||(hf=!0,Gn("The town is still loading."),setTimeout(()=>{hf=!1},4e3))),i=Math.min(Ge+21.5,i),i>Ge-1.5?A.x<=Ge-1.5&&Math.abs(e)>1.4?i=Ge-1.5:e=Math.max(-1.4,Math.min(1.4,e)):i>Ds+.3?e=Math.max(-9,Math.min(9,e)):e=Math.max(-(Jn-.45),Math.min(Jn-.45,e));for(let[t,n,s]of[[st.x,st.z,.75],...xr&&!re.on?Ma.map(r=>[r.x,r.z,r.id==="kofi"?1.05:.8]):[]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}if(!re.ruin){Dh||uS();for(let[t,n,s,r]of Dh){let a=Math.max(t,Math.min(s,i)),o=Math.max(n,Math.min(r,e)),l=i-a,c=e-o,h=Math.hypot(l,c),u=.32;h<u&&(h>1e-4?(i=a+l/h*u,e=o+c/h*u):(i=A.x,e=A.z))}}return[i,e]}var S0=0;function Gn(i){let e=se("toast");e.textContent=i,e.hidden=!1,clearTimeout(S0),S0=setTimeout(()=>{e.hidden=!0},2600)}function rs(i){if(A.unlocked.includes(i))return;A.unlocked.push(i),wa();let e=Zo.find(t=>t.id===i);se("jcount").textContent=A.unlocked.length,se("jcount").hidden=!1,Gn("Journal: "+e.title)}var Yn="",w0=0,T0=0;function cs(i){let e=se("goal");e.textContent=Yn,e.classList.remove("folded"),e.setAttribute("aria-expanded","true"),clearTimeout(w0),w0=setTimeout(()=>{e.textContent="Goal",e.classList.add("folded"),e.setAttribute("aria-expanded","false")},6500),i&&X0()}function X0(){se("hint").hidden=!1,clearTimeout(T0),T0=setTimeout(()=>{se("hint").hidden=!0},6e3)}se("goal").onclick=()=>cs(!0);function uf(){return Ls.filter(i=>A.unlocked.includes(i.id)).length}function vi(){if(re.on||A.place==="ware")return;let i;A.unlocked.includes("harbour")?A.talked?A.place==="out"&&!A.ate?i="Go into The Turtle. The door is right beside Abba.":A.ate?uf()<Ls.length?i="Look around the tavern. Things found: "+uf()+" of "+Ls.length+".":i="You have finished the first part. Open your journal for the next part of the story.":i="Abba is behind the counter. Ask her for some stew.":i="Find the woman in the white head wrap. She keeps the tavern with the turtle sign.":i="Walk down the pier and into the town.",i!==Yn&&(Yn=i,cs()),A.ate&&uf()===Ls.length&&!A.done&&(A.done=!0,setTimeout(()=>Gn("Well done! Your journal now has "+A.unlocked.length+" pages."),3800))}var xa=Tf,xf=null;function j0(){let i=xa[A.step];i.who!=="You"&&aS(i.who,i.anim),se("who").textContent=i.who,se("line").textContent=i.text;let e=se("choices");if(e.replaceChildren(),i.choices){se("next").hidden=!0;for(let t of i.choices){let n=typeof t=="string"?{t,ok:!0}:t,s=document.createElement("button");s.className="btn ghost",s.textContent=n.t,s.onclick=()=>{n.ok?Rf():(se("line").textContent=i.hint+" "+i.text.split(". ").pop(),s.disabled=!0)},e.appendChild(s)}e.firstChild.focus()}else se("next").hidden=!1,se("next").textContent=A.step===xa.length-1?xa===Tf?"Goodbye for now":"Thank you":"Next",se("next").focus();i.unlock&&rs(i.unlock)}function Rf(){if(A.step++,A.step>=xa.length){oS(xa!==O0),se("dialogue").hidden=!0,se("goal").hidden=!1,oi=!1,A.step=0;let i=xf;xf=null,i&&i(),vi(),On.focus();return}j0()}function xi(i,e){xa=i,xf=e,oi=!0,Pn.clear(),se("talk").hidden=!0,se("hint").hidden=!0,se("goal").hidden=!0,se("dialogue").hidden=!1,A.step=0,j0()}se("next").onclick=Rf;var pS=[...["sugar","cocoa","logwood"].map((i,e)=>({label:["Look at the casks","Look at the sacks","Look at the red wood"][e],r:2.6,where:()=>A.place==="ware"&&!A.unlocked.includes(i)&&Ch[i],go:()=>{rs(i),ag[i].visible=!1,Ph()}})),{label:"Sit at the desk",r:2.4,where:()=>A.place==="ware"&&og()&&!Ui.coins&&[-258.6,2.9],go:()=>xi(HM,()=>{Ui.coins=!0,He.visible=!0,st.x=-250.2,st.z=.4,He.position.set(st.x,0,st.z),Gn("Abba has come in."),Ph()})},{label:"Talk to Abba",r:3,where:()=>A.place==="ware"&&Ui.coins&&!Ui.talked&&[st.x,st.z],go:()=>xi(O0,()=>{Ui.talked=!0;let i=He.userData.anim;i&&mn.WaveSlow&&i.play("WaveSlow",!0),setTimeout(()=>{A.place==="ware"&&(He.visible=!1,st.x=9999,Gn("Abba goes out to the wharf."))},2600),Ph()})},{label:"Go out to the wharf",r:1.8,where:()=>A.place==="ware"&&[Yt-.7,.8],go:()=>zn("Leave the warehouse?",["Lewis can come back to 1691 any time from the Chapters menu."],[{t:"Back to the town",go:kh},{t:"Stay",go:In}])},{label:"Read the letter",r:2.4,where:()=>A.place==="ware"&&Ui.talked&&[-258.6,2.9],go:VS},{label:"Talk to Abba",r:3.2,where:()=>A.place==="after"&&[st.x,st.z],go:()=>{rg()&&re.aTalk?xi(KM,kS):xi(jM,()=>{re.aTalk=!0,Rh()})}},{label:"Look at the big tent",r:3.6,where:()=>A.place==="after"&&!A.unlocked.includes("tentp")&&[-12.5,.8],go:()=>{rs("tentp"),Rh()}},{label:"Look across the water",r:2.6,where:()=>A.place==="after"&&!A.unlocked.includes("kingston")&&[.2,0],go:()=>{rs("kingston"),Rh()}},{label:"Read the tombstone",r:3.2,where:()=>A.place==="yard"&&[Wt+6,qt-2],go:BS},...Ma.map(i=>({label:i.label,r:2.6,where:()=>xr&&!re.on&&A.place==="out"&&Xt[i.id]&&[i.x,i.z],go:()=>xi(A.unlocked.includes(i.id)?i.again:i.talk)})),{label:"Talk to Sam",r:2.4,where:()=>A.place==="after"&&Ns.sailor&&[Es[0][0],Es[0][1]],go:()=>xi(A.unlocked.includes("swan")?[{who:"Sam",text:"I keep looking at the water. I can\u2019t stop."}]:VM)},{label:"Talk to Kofi",r:2.4,where:()=>A.place==="after"&&Ns.kofi&&[Es[2][0],Es[2][1]],go:()=>xi(WM)},{label:"Talk to Symon Benning",r:2.4,where:()=>A.place==="after"&&Ns.benning&&[Es[1][0],Es[1][1]],go:()=>xi(qM)},{label:"Talk to the minister",r:2.6,where:()=>A.place==="after"&&Xt.heath&&Xt.heath.parent&&[pr.x,pr.z],go:()=>xi(A.unlocked.includes("heath")?[{who:"Emmanuel Heath",text:"God keep you, Mr Galdy."}]:XM)},{label:"Reach for the boat",r:3.6,where:()=>A.place==="sea"&&re.boat&&[re.boat.position.x,re.boat.position.z],go:()=>Df(!1)},{label:"Talk to her",r:3.4,where:()=>xr&&!re.on&&A.place==="out"&&[st.x,st.z],go:()=>xi(A.talked?x0:Tf,()=>{A.talked=!0,gn&&(gn.visible=!1)})},{label:"Go into the tavern",r:2,where:()=>va&&!re.on&&A.place==="out"&&A.talked&&[-6.18,-4.5],go:()=>{os("in"),A.x=-203,A.z=2.3,A.yaw=0,A.pitch=0,vi()}},{label:"Go back to the street",r:1.3,where:()=>A.place==="in"&&[-203,3.3],go:()=>{os("out"),A.x=-6.18,A.z=-3.4,A.yaw=Math.PI,A.pitch=0,vi()}},{label:"Talk to Abba",r:2.3,where:()=>A.place==="in"&&[-201,-1.9],go:()=>xi(A.ate?x0:JM,()=>{A.ate||(A.ate=!0,ss.visible=!0)})},...Ls.map(i=>({label:i.label,r:1.9,where:()=>A.place==="in"&&!A.unlocked.includes(i.id)&&[i.x,i.z],go:()=>{rs(i.id),Ef[i.id].visible=!1,vi()}}))],Rs=null;se("talk").onclick=()=>{Rs&&Rs.go()};function K0(i){let e=se("jtabs");e.replaceChildren();let t=i||A.unlocked[A.unlocked.length-1];Zo.filter(c=>A.unlocked.includes(c.id)).forEach(c=>{let h=document.createElement("button");h.className="tab"+(c.id===t?" on":""),h.textContent=c.title,h.onclick=()=>K0(c.id),e.appendChild(h)});let n=Zo.length-A.unlocked.length;if(n>0){let c=document.createElement("button");c.className="tab",c.disabled=!0,c.textContent=n+" more to find",e.appendChild(c)}let s=se("jpage");s.replaceChildren();let r=Zo.find(c=>c.id===t);if(!r){let c=document.createElement("p");c.textContent="Your journal is empty. Talk to people in the town to fill it.",s.appendChild(c);return}let a=document.createElement("h3");a.textContent=r.title,s.appendChild(a);for(let c of r.simple){let h=document.createElement("p");h.textContent=c,s.appendChild(h)}let o=document.createElement("details"),l=document.createElement("summary");l.textContent="Dig deeper",o.appendChild(l);for(let c of r.deeper){let h=document.createElement("p");h.textContent=c,o.appendChild(h)}s.appendChild(o)}function Cf(){se("dialogue").hidden&&(oi=!0,Pn.clear(),K0(),se("journal").hidden=!1,se("jclose").focus())}function _r(){se("journal").hidden||(se("journal").hidden=!0,oi=!1)}se("jbtn").onclick=Cf;se("jclose").onclick=_r;function J0(){Lf(),A.started=!0,se("title").hidden=!0,se("hud").hidden=!1,A.unlocked.length&&(se("jcount").textContent=A.unlocked.length,se("jcount").hidden=!1),vi(),se("hint").textContent=YM?"Left thumb walks. Drag to look.":"W A S D to walk. Drag to look. E to use.",X0(),On.focus()}se("start").onclick=()=>{J0(),Ta("begin")};var Gh="portroyal-save-v1",_f=!1,E0=0;function wa(){try{localStorage.setItem(Gh,JSON.stringify({unlocked:A.unlocked,talked:A.talked,ate:A.ate,done:A.done,ch:A.ch,pos:A.place==="out"&&!re.on?[A.x,A.z,A.yaw]:null}))}catch{}}function mS(){try{return JSON.parse(localStorage.getItem(Gh)||"null")}catch{return null}}function gS(i){if(!i||!Array.isArray(i.unlocked))return;A.unlocked=i.unlocked.filter(t=>Zo.some(n=>n.id===t)),A.talked=!!i.talked,A.ate=!!i.ate,A.done=!!i.done,A.ch=i.ch&&typeof i.ch=="object"?i.ch:{};let e=i.pos;Array.isArray(e)&&e.every(Number.isFinite)&&e[0]>fn-1&&e[0]<Ge+24&&Math.abs(e[1])<9.5&&!(e[0]<Ds+.3&&Math.abs(e[1])>Jn)&&(A.x=e[0],A.z=e[1],A.yaw=e[2]),_f=A.unlocked.length>0}addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&A.started&&wa()});var bS={goArrive:["1690","Port Royal, Jamaica"],leaveWare:["1690","Back in the town"],beginWare:["1691","Lewis Galdy\u2019s warehouse"],beginQuake:["7 June 1692","A hot, still morning"],beginAfter:["Three days later","The camp on the beach"],toYard:["Many years later","St Peter\u2019s Church, Port Royal"],leaveQuake:["1690","Before the earthquake"]},Ah=!1;function yr(i,e){return function(...t){if(Ah)return;if(new URLSearchParams(location.search).has("shot"))return e.apply(this,t);Ah=!0;let n=se("fade"),[s,r]=bS[i];se("fadeT").textContent=s,se("fadeS").textContent=r,se("card").hidden=!0,se("dialogue").hidden=!0,n.hidden=!1,requestAnimationFrame(()=>{n.classList.add("on")}),setTimeout(()=>{e.apply(this,t),n.classList.add("txt")},750),setTimeout(()=>{n.classList.remove("txt")},2500),setTimeout(()=>{n.classList.remove("on")},2900),setTimeout(()=>{n.hidden=!0,Ah=!1},3800)}}function yf(){In(),re.on&&(Ea(),re.on=!1),os("out"),A.x=43,A.z=0,A.yaw=Math.PI/2,A.pitch=0,Yn="",vi(),Ta("begin")}var vf=[{year:"1690",name:"Arrival",go:()=>yf(),done:()=>A.ate},{year:"1691",name:"The warehouse",go:()=>HS(),done:()=>!!A.ch.ware},{year:"7 June 1692",name:"The earthquake",go:()=>tg(),done:()=>A.unlocked.includes("tomb")},{year:"1692",name:"The days after",go:()=>Is(),done:()=>!!A.ch.after},{year:"1739 and today",name:"The tombstone",go:()=>Fs(),done:()=>A.unlocked.includes("stone")}];function Pf(){let i=se("chlist");i.replaceChildren(),vf.forEach((e,t)=>{let n=t===0||A.ch.all||vf[t-1].done(),s=e.done(),r=document.createElement("li"),a=document.createElement("button");a.className="chbtn"+(s?" done":""),a.disabled=!n||!va;for(let[o,l]of[["yr",e.year],["nm",e.name],["st",va?s?"Done":n?"Play":"Locked":"Loading"]]){let c=document.createElement("span");c.className=o,c.textContent=l,a.appendChild(c)}a.onclick=()=>xS(e),r.appendChild(a),i.appendChild(r)}),se("chteach").hidden=!!A.ch.all,se("chreset").textContent="Start again",se("chreset").dataset.armed=""}function If(){_r(),oi=!0,Pn.clear(),Pf(),se("chapters").hidden=!1,(se("chlist").querySelector("button:not(:disabled)")||se("chclose")).focus()}function Y0(){se("chapters").hidden||(se("chapters").hidden=!0,oi=!se("card").hidden,A.started&&On.focus())}function xS(i){se("chapters").hidden=!0,oi=!1,A.started||J0(),i.go()}se("chclose").onclick=Y0;se("tchap").onclick=If;se("jchap").onclick=If;se("chteach").onclick=()=>{A.ch.all=!0,wa(),Pf()};se("chreset").onclick=()=>{let i=se("chreset");if(!i.dataset.armed){i.dataset.armed="1",i.textContent="Tap again to erase all progress";return}try{localStorage.removeItem(Gh)}catch{}location.reload()};var Ne={ctx:null,master:null,on:!0,ch:{},crack:null};try{Ne.on=localStorage.getItem("portroyal-sound")!=="off"}catch{}function _S(i){let e=Ne.ctx,t=e.sampleRate*3,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0),r=0;for(let o=0;o<t;o++){let l=Math.random()*2-1;i==="brown"?(r=(r+.02*l)/1.02,s[o]=r*3.5):s[o]=l*.5}let a=e.createBufferSource();return a.buffer=n,a.loop=!0,a.start(),a}function Ho(i,e,t,n){let s=Ne.ctx,r=s.createBiquadFilter(),a=s.createGain();return r.type=e,r.frequency.value=t,n&&(r.Q.value=n),a.gain.value=0,_S(i).connect(r),r.connect(a),a.connect(Ne.master),a.f=r,a}function Lf(){try{if(!Ne.ctx){let i=window.AudioContext||window.webkitAudioContext;if(!i)return;Ne.ctx=new i,Ne.master=Ne.ctx.createGain(),Ne.master.gain.value=Ne.on?.8:0,Ne.master.connect(Ne.ctx.destination),Ne.ch.sea=Ho("brown","lowpass",800),Ne.ch.surf=Ho("white","bandpass",2200,.4),Ne.ch.wind=Ho("white","bandpass",650,.6),Ne.ch.crowd=Ho("white","bandpass",480,2.2),Ne.ch.room=Ho("brown","lowpass",160);let e=Ne.ctx.sampleRate*.03,t=Ne.ctx.createBuffer(1,e,Ne.ctx.sampleRate),n=t.getChannelData(0);for(let s=0;s<e;s++)n[s]=(Math.random()*2-1)*(1-s/e);Ne.crack=t;{let s=Ne.ctx.sampleRate*.22|0,r=Ne.ctx.createBuffer(1,s,Ne.ctx.sampleRate),a=r.getChannelData(0),o=0;for(let l=0;l<s;l++){Math.random()<.004&&(o=.6+Math.random()*.4),o*=.992;let c=Math.min(1,l/(s*.15))*Math.pow(1-l/s,1.6);a[l]=(Math.random()*2-1)*(.35+o)*c}Ne.step=r}}Ne.ctx.resume()}catch{Ne.ctx=null}}function Hh(i){let e=Ne.ctx,t=e.createGain();if(e.createStereoPanner){let n=e.createStereoPanner();n.pan.value=i,t.connect(n),n.connect(Ne.master)}else t.connect(Ne.master);return t}function yS(){let i=Ne.ctx,e=i.currentTime+.05,t=Hh(Math.random()*1.6-.8),n=i.createBiquadFilter();n.type="bandpass",n.frequency.value=1500,n.Q.value=1.4,n.connect(t),t.gain.value=.35+Math.random()*.4;for(let s=0,r=2+(Math.random()*2|0);s<r;s++){let a=e+s*.42,o=i.createOscillator(),l=i.createGain(),c=i.createOscillator(),h=i.createGain();o.type="triangle",o.frequency.setValueAtTime(1300,a),o.frequency.linearRampToValueAtTime(1750,a+.06),o.frequency.exponentialRampToValueAtTime(950,a+.34),c.frequency.value=28,h.gain.value=45,c.connect(h),h.connect(o.frequency),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(.16,a+.03),l.gain.exponentialRampToValueAtTime(1e-4,a+.36),o.connect(l),l.connect(n),o.start(a),c.start(a),o.stop(a+.4),c.stop(a+.4)}}var yh=0,df=1,A0=0,ff=0;function vS(){let i=A.place,e=A.x,t=A.z;return i==="in"?"wood":i==="ware"?Math.abs(e-(Yt-.7))<.6?"wood":"stone":i==="sea"?"water":re.on&&re.phase==="yard"?"grass":e>Ge-2.5&&Math.abs(t)<1.75?"wood":!(re.on&&re.ruin)&&e>fn&&e<Ds&&Math.abs(t)<Jn-.6?"stone":"sand"}function MS(){if(!Ne.ctx||!Ne.on||Ne.ctx.state!=="running")return;let i=vS();if(!i)return;let e=Ne.ctx,t=e.currentTime+.005;df=-df;let n=Hh(df*.12),s=.85+Math.random()*.3,r=e.createBufferSource();r.buffer=(i==="sand"||i==="grass")&&Ne.step?Ne.step:Ne.crack;let a=e.createBiquadFilter();if(i==="sand"||i==="grass")a.type="lowpass",a.frequency.value=i==="sand"?700+Math.random()*300:1600,r.playbackRate.value=.9+Math.random()*.2,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.16*s,t+.045),n.gain.exponentialRampToValueAtTime(1e-4,t+.24);else if(i==="water"){a.type="bandpass",a.Q.value=.7,a.frequency.setValueAtTime(500,t),a.frequency.exponentialRampToValueAtTime(1800,t+.12),a.frequency.exponentialRampToValueAtTime(700,t+.5),r.buffer=Ne.step||Ne.crack,r.playbackRate.value=.55+Math.random()*.15,r.loop=!0,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.3*s,t+.08),n.gain.exponentialRampToValueAtTime(1e-4,t+.6),r.connect(a),a.connect(n),r.start(t),r.stop(t+.65);return}else if(i==="wood"){a.type="bandpass",a.frequency.value=420+Math.random()*120,a.Q.value=1.4,r.playbackRate.value=.5,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.26*s,t+.012),n.gain.exponentialRampToValueAtTime(1e-4,t+.2);let o=e.createOscillator(),l=e.createGain();o.frequency.setValueAtTime(130,t),o.frequency.exponentialRampToValueAtTime(70,t+.09),l.gain.setValueAtTime(.16*s,t),l.gain.exponentialRampToValueAtTime(1e-4,t+.16),o.connect(l),l.connect(n),o.start(t),o.stop(t+.2)}else a.type="bandpass",a.frequency.value=1100+Math.random()*400,a.Q.value=.9,r.playbackRate.value=.8,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.17*s,t+.008),n.gain.exponentialRampToValueAtTime(1e-4,t+.11);r.connect(a),a.connect(n),r.start(t),r.stop(t+.3)}function SS(){let i=Ne.ctx,e=i.currentTime,t=i.createBufferSource(),n=i.createBiquadFilter(),s=Hh(.3);t.buffer=Ne.crack,t.playbackRate.value=.6+Math.random(),n.type="highpass",n.frequency.value=1400,s.gain.value=.05+Math.random()*.12,t.connect(n),n.connect(s),t.start(e)}function wS(){let i=Ne.ctx,e=i.currentTime+.02,t=Hh(Math.random()*1.4-.7);t.gain.value=.5;for(let n=0;n<3;n++){let s=e+n*.13,r=i.createOscillator(),a=i.createGain();r.frequency.setValueAtTime(2600,s),r.frequency.exponentialRampToValueAtTime(3700,s+.07),a.gain.setValueAtTime(1e-4,s),a.gain.exponentialRampToValueAtTime(.05,s+.015),a.gain.exponentialRampToValueAtTime(1e-4,s+.08),r.connect(a),a.connect(t),r.start(s),r.stop(s+.1)}}function Ta(i){if(!Ne.ctx)return;let e=Ne.ctx,t=e.currentTime+.05,n={begin:[[293.66,0],[369.99,.35],[440,.7],[587.33,1.05]],sad:[[293.66,0],[349.23,.5],[440,1],[392,1.6]],end:[[440,0],[369.99,.6],[329.63,1.2],[293.66,1.8]]}[i],s=e.createBiquadFilter();s.type="lowpass",s.frequency.value=1400,s.connect(Ne.master);for(let[r,a]of n)for(let o of[0,7]){let l=e.createOscillator(),c=e.createGain();l.type="triangle",l.frequency.value=r,l.detune.value=o,c.gain.setValueAtTime(1e-4,t+a),c.gain.exponentialRampToValueAtTime(.05,t+a+.08),c.gain.exponentialRampToValueAtTime(1e-4,t+a+2.4),l.connect(c),c.connect(s),l.start(t+a),l.stop(t+a+2.5)}}var R0=0,C0=2,P0=0,I0=0,vh=.6;function Vo(i,e,t){i.gain.setTargetAtTime(e,Ne.ctx.currentTime,t||.5)}function TS(i){if(!Ne.ctx||!A.started||i<R0)return;R0=i+.1;let e=A.place,t=re.on&&["tremor","main","swallow"].includes(re.phase),n=.72+.28*Math.sin(i*.55)+.1*Math.sin(i*1.7),s=0,r=0,a=0,o=0,l=0,c=!1,h=!1,u=!1;if(e==="out"){let d=Math.max(0,Math.min(1,(A.x+5)/(Ge+10)));s=(.15+.55*d)*n,r=.04*d*n,a=re.ruin?.1:.05,c=!re.ruin&&A.x>-2}else e==="in"?(o=.3,h=!0,s=.03):e==="ware"?(l=.14,s=.16*n,c=!0):e==="sea"?(s=.8*n,r=.08*n,a=.12):e==="after"?(s=.22*n,a=.14):e==="yard"&&(a=.07,s=.08*n,u=!0);t&&(s*=.4,r=0,o=0,c=u=!1),Vo(Ne.ch.sea,s),Vo(Ne.ch.surf,r),Vo(Ne.ch.wind,a),Vo(Ne.ch.room,l),vh=Math.max(.3,Math.min(1,vh+(Math.random()-.5)*.3)),Vo(Ne.ch.crowd,o*vh,.12),Ne.ch.crowd.f.frequency.setTargetAtTime(380+vh*260,Ne.ctx.currentTime,.2),c&&i>C0&&(C0=i+6+Math.random()*10,yS()),h&&i>P0&&(P0=i+.05+Math.random()*.35,SS()),u&&i>I0&&(I0=i+3+Math.random()*6,wS())}function Z0(){let i=se("snd");i.setAttribute("aria-pressed",Ne.on?"true":"false"),i.setAttribute("aria-label",Ne.on?"Sound on. Tap to turn off.":"Sound off. Tap to turn on."),se("sndon").style.display=Ne.on?"":"none",se("sndoff").style.display=Ne.on?"none":""}se("snd").onclick=()=>{Ne.on=!Ne.on;try{localStorage.setItem("portroyal-sound",Ne.on?"on":"off")}catch{}Lf(),Ne.master&&Ne.master.gain.setTargetAtTime(Ne.on?.8:0,Ne.ctx.currentTime,.1),Z0()};Z0();addEventListener("pointerdown",()=>{Ne.ctx&&Ne.ctx.state!=="running"&&Ne.ctx.resume()});var ic=2.7,Nh=1.62,gr=-.35,re={on:!1,phase:"",t:0,shake:0,ruin:!1,boat:null,debris:[],T:0,ac:null,gain:null},sc=new qe(12167304),Mf=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i));function zn(i,e,t){oi=!0,Pn.clear(),se("ctitle").textContent=i;let n=se("cbody");n.replaceChildren();for(let r of e){let a=document.createElement("p");a.textContent=r,n.appendChild(a)}let s=se("cbtns");s.replaceChildren(),t.forEach((r,a)=>{let o=document.createElement("button");o.className="btn"+(a?" ghost":""),o.textContent=r.t,o.onclick=r.go,s.appendChild(o)}),se("card").hidden=!1,se("talk").hidden=!0,s.firstChild.focus()}function In(){se("card").hidden=!0,oi=!1,On.focus()}var Fn=null,Fh=[],_a=[],Sf=520,L0=new tt,ES=new jt,AS=new ei,$0=new z,Q0=new z,eg=null;function RS(){if(Fn)return;Fn=new Zs(new pt(.24,.08,.12),(()=>{let e=Lh("brick",!0).clone();return e.repeat.set(.18,.12),e.needsUpdate=!0,new Fe({map:e,roughness:.95})})(),Sf),Fn.instanceMatrix.setUsage(nd),Fn.frustumCulled=!1,Fn.count=0,Qe.add(Fn);let i=new qe;for(let e=0;e<Sf;e++){let t=Math.random();i.setRGB(.7+t*.3,.66+t*.3,.62+t*.3),e%9===0&&i.setRGB(1.3,1.3,1.25),Fn.setColorAt(e,i)}Fn.instanceColor.needsUpdate=!0,eg=Un(64,64,e=>{let t=e.createRadialGradient(32,32,2,32,32,31);t.addColorStop(0,"rgba(255,255,255,0.9)"),t.addColorStop(.5,"rgba(255,255,255,0.35)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64)})}function CS(i){RS();let e=i.m.position,t=e.z<0?1:-1,n=2.4,s=e.z+t*3.9;for(let r=0;r<34&&Fh.length<Sf;r++){let a=r<3;Fh.push({x:e.x+(Math.random()-.5)*n*2,y:4+Math.random()*6,z:s+t*Math.random()*.4,vx:(Math.random()-.5)*1.2,vy:Math.random()*1.5,vz:t*(.8+Math.random()*2.6),rx:Math.random()*6,ry:Math.random()*6,rz:Math.random()*6,w:(Math.random()-.5)*12,s:a?1.7+Math.random()*.8:1,rest:!1,delay:Math.random()*1.6})}for(let r=0;r<3;r++){let a=new eo(new jr({map:eg,color:sc,transparent:!0,opacity:0,depthWrite:!1}));a.position.set(e.x+(r-1)*2.2,1.2,s+t*1.2),a.userData={age:-r*.4,life:5+Math.random()*2},Qe.add(a),_a.push(a)}}function PS(i){if(re.phase==="main"||re.phase==="swallow")for(let e of Sa)!e.broke&&re.T>e.delay+.4&&e.m.position.x>fn-1&&(e.broke=!0,CS(e));if(Fn){let e=0;for(let t of Fh){if(t.delay>0){t.delay-=i;continue}if(!t.rest){t.vy-=9.8*i,t.x+=t.vx*i,t.y+=t.vy*i,t.z+=t.vz*i,t.rx+=t.w*i,t.rz+=t.w*.7*i;let n=.04*t.s;t.y<n&&(t.y=n,Math.abs(t.vy)<1.2&&(t.rest=!0,t.rx=Math.round(t.rx/Math.PI)*Math.PI,t.rz=Math.round(t.rz/Math.PI)*Math.PI),t.vy=-t.vy*.28,t.vx*=.45,t.vz*=.45,t.w*=.4)}L0.compose(Q0.set(t.x,t.y,t.z),ES.setFromEuler(AS.set(t.rx,t.ry,t.rz)),$0.setScalar(t.s)),Fn.setMatrixAt(e++,L0)}Fn.count=e,Fn.instanceMatrix.needsUpdate=!0}for(let e=_a.length-1;e>=0;e--){let t=_a[e],n=t.userData;if(n.age+=i,n.age<0)continue;let s=n.age/n.life;t.scale.setScalar(2+s*9),t.position.y=1.2+s*3,t.material.opacity=Math.min(.55,n.age*1.2)*(1-s),s>=1&&(Qe.remove(t),t.material.dispose(),_a.splice(e,1))}}function IS(){Fh.length=0,Fn&&(Fn.count=0);for(let i of _a)Qe.remove(i),i.material.dispose();_a.length=0;for(let i of Sa)i.broke=!1}function rc(i,e){for(let t of Sa){let n=e===void 0?Mf((i-t.delay)/t.dur):e;t.m.position.y=-t.sink*n+(n>0&&n<1?Math.sin(i*40+t.delay*9)*.03:0),t.m.rotation.set(t.tx*n,t.ry,t.tz*n)}}function LS(){if(Lf(),!Ne.ctx||re.gain)return;let i=Ne.ctx,e=i.sampleRate*2,t=i.createBuffer(1,e,i.sampleRate),n=t.getChannelData(0),s=0;for(let o=0;o<e;o++)s=(s+.02*(Math.random()*2-1))/1.02,n[o]=s*3.5;let r=i.createBufferSource();r.buffer=t,r.loop=!0;let a=i.createBiquadFilter();a.type="lowpass",a.frequency.value=150,re.gain=i.createGain(),re.gain.gain.value=0,r.connect(a),a.connect(re.gain),re.gain.connect(Ne.master),r.start()}function br(i){re.phase=i,re.t=0}function tg(){if(Ta("sad"),!xr||!va){Gn("The town is still loading.");return}_r(),se("card").hidden=!0,se("dialogue").hidden=!0,se("goal").hidden=!1,zn("7 June 1692",["Two years have passed. Lewis Galdy is now a merchant in Port Royal.","This part of the story shows the great earthquake. It is loud, and it can be scary."],[{t:"Begin",go:Cs},{t:"Read what happened instead",go:()=>Df(!0)}])}function Cs(){In(),LS(),A.place!=="out"&&os("out"),Ea(),re.on=!0,br("calm"),A.place="out",A.x=1,A.z=.6,A.yaw=-Math.PI/2,A.pitch=0,gn&&(gn.visible=!1),zh(!1),Yn="It is a hot, still morning. Walk down to the harbour.",cs(),Gn("7 June 1692, late morning")}function Ea(){if(re.abbaHit=re.abbaTrip=!1,IS(),He&&He.userData.anim){let t=He.userData.anim.get("JogStumble");t&&t.stop()}if(re.abbaRun||ai&&ai.isRunning()||He&&He.userData.anim&&He.userData.anim.cur!==Kn){re.abbaRun=!1,ai&&ai.stop();let t=He.userData.anim;t&&t.cur!==Kn&&(t.cur.stop(),t.cur=Kn,t.timer=0),Kn.reset().setEffectiveWeight(1).play()}re.ruin=!1,re.shake=0,re.T=0,rc(0,0),gr=-.35,ic=2.7,Nh=1.62,Qe.fog.color.copy(Oh),Qe.fog.near=70,Qe.fog.far=900,mr.material.color.set(16777215),se("vig").style.opacity=0;let i=cn.merchant,e=cn.sloop;i.position.set(Ge+17.5,-.35,-5.9),i.rotation.set(0,0,0),e.position.set(Ge+17.5,-.35,4.9),e.rotation.set(0,Math.PI,0),jn&&(jn.visible=!1),Ps&&(Ps.visible=!1);for(let t of Bh)t.visible=!0;zh(!0);for(let t of Sa)t.m.visible=!0;cn.merchant.visible=cn.sloop.visible=!0,re.aTalk=!1,re.boat&&(re.boat.visible=!1);for(let t of re.debris)t.visible=!1;st.x=-5.25,st.z=-Jn+1.05,He.position.set(st.x,.12,st.z),He.visible=!0,re.gain&&(re.gain.gain.value=0)}function ng(){if(re.boat)return;let i=new Fe({map:Ht([96,80,62],6,3,1),roughness:.9,side:Ot}),e=new Fe({map:Ht([110,86,60],3,1,1),roughness:.9}),t=5.2,n=1.7,s=new ti;s.moveTo(-t/2,-n*.36),s.quadraticCurveTo(0,-n*.56,t*.3,-n*.4),s.quadraticCurveTo(t*.45,-n*.2,t/2,0),s.quadraticCurveTo(t*.45,n*.2,t*.3,n*.4),s.quadraticCurveTo(0,n*.56,-t/2,n*.36),s.closePath();let r=new Yi(s,{depth:.7,bevelEnabled:!1,curveSegments:8});r.rotateX(-Math.PI/2);let a=r.attributes.position;for(let c=0;c<a.count;c++)a.getY(c)<.3&&(a.setZ(c,a.getZ(c)*.45),a.setX(c,a.getX(c)*.9));r.computeVertexNormals();let o=new wt;Qe.add(o),ee(r,i,0,-.3,0,o),ee(new pt(t*.86,.03,n*.78),e,-.1,.02,0,o);for(let c of[-1.5,1.2])ee(new pt(.24,.04,n*.86),e,c,.2,0,o);let l=ee(new _o(.28),new Mt({color:14263361}),0,3.3,0,o);o.userData.mark=l,re.boat=o;for(let c=0;c<12;c++){let h=c%3,u=ee(h===0?new it(.3,.3,.9,10):h===1?new pt(.7,.6,.7):new pt(2.6,.12,.3),e,Ge+8+c*37%50,0,12+c*53%55);h===0&&(u.rotation.z=Math.PI/2),u.rotation.y=c*1.3,u.userData.ph=c*1.7,re.debris.push(u)}}function DS(){if(!He||!Kn)return;ai&&ai.stop();let i=He.userData.anim;if(i){for(let e of["JogStumble","StumbleBack","Terrified"]){let t=i.get(e);t&&t.stop()}i.cur!==Kn&&i.cur.stop(),i.cur=Kn,i.timer=0}Kn.reset().setEffectiveWeight(1).fadeIn(.2).play()}function wf(){In(),ng(),re.ruin=!0,rc(0,1),gr=.2,ic=1.5,se("vig").style.opacity=0,Qe.fog.color.copy(sc),Qe.fog.near=25,Qe.fog.far=320,mr.material.color.set(14273972);let i=cn.merchant,e=cn.sloop;i.position.set(Ge+19,-1.2,-7),i.rotation.set(.42,.15,.05),e.position.set(Ge-6,.5,13),e.rotation.set(-.5,2.2,.08),A.place="sea",A.x=Ge+12,A.z=22,re.boat.position.set(Ge+30,gr,46),re.boat.rotation.y=.6,re.boat.visible=!0;for(let t of re.debris)t.visible=!0;A.yaw=Math.atan2(-(re.boat.position.x-A.x),-(re.boat.position.z-A.z)),A.pitch=0,st.x=re.boat.position.x,st.z=re.boat.position.z,He.visible=!0,re.abbaRun=!1,DS(),He.rotation.y=Math.atan2(A.x-st.x,A.z-st.z),br("sea"),Yn="Swim to the boat with the gold marker.",cs(),Gn("A second shock throws you into the sea.")}function Df(i){for(let e of["quake","sand","watch","tomb"])rs(e);re.shake=0,re.gain&&(re.gain.gain.value=0),re.phase="end",zn(i?"What happened":"Saved",i?["Just before noon, an earthquake shook Port Royal. The wet sand under the town turned to liquid, and most of the town sank into the sea.","Lewis Galdy was swallowed by the ground, thrown out into the sea by a second shock, and saved by a boat.","Four new pages are in your journal."]:["Hands pull you over the side of the boat. You are alive.","Behind you, most of Port Royal is under the sea.","Four new pages are in your journal."],[{t:"Go on: the days after",go:Is},{t:"Play the earthquake again",go:Cs},{t:"Go back to 1690",go:Uh}])}function Uh(){In(),Ea(),re.on=!1,A.place="out",A.x=17,A.z=.4,A.yaw=Math.PI/2,A.pitch=0,vi(),Yn="",vi()}function NS(i,e){re.t+=i;let t=re.t;if(re.phase==="calm")(t>9||A.x>9)&&(br("tremor"),Gn("Abba: \u201CDid you feel that?\u201D"));else if(re.phase==="tremor")re.shake=t<2.6?.22*Math.sin(t/2.6*Math.PI):0,He.userData.anim&&mn.Terrified&&He.userData.anim.cur===He.userData.anim.base&&t>.6&&He.userData.anim.play("Terrified"),t>4.6&&(br("main"),Yn="Run! Get away from the houses!",cs());else if(re.phase==="main"){!re.abbaHit&&He.visible&&He.userData.anim&&mn.StumbleBack&&(re.abbaHit=!0,He.userData.anim.play("StumbleBack",!0)),re.shake=Math.min(1,t/1.5),re.T=t,rc(t);let n=Mf(t/5);if(Qe.fog.color.copy(Oh).lerp(sc,n),Qe.fog.near=70-62*n,Qe.fog.far=900-830*n,mr.material.color.set(16777215).lerp(sc,n*.8),t>2.5&&He.visible&&!re.abbaRun)if(Gn("Abba: \u201CRun! To the boats!\u201D"),ai){re.abbaRun=!0,st.x=9999;let s=He.userData.anim;(s?s.cur:Kn).fadeOut(.25),ai.reset().fadeIn(.25).play(),s&&(s.cur=ai,s.timer=0)}else He.visible=!1;if(re.abbaRun){if(!re.abbaTrip&&He.position.x>6&&mn.JogStumble&&He.userData.anim){re.abbaTrip=!0;let s=He.userData.anim,r=s.get("JogStumble");r.reset().setLoop(No).fadeIn(.15).play(),r.clampWhenFinished=!1,ai.fadeOut(.15),setTimeout(()=>{re.abbaRun&&(ai.reset().fadeIn(.2).play(),r.fadeOut(.2))},(r.getClip().duration-.2)*1e3)}He.rotation.y=Math.PI/2-.08,He.position.x+=4.6*i,He.position.z+=.35*i,He.position.x>Ge+4&&(He.visible=!1,re.abbaRun=!1)}t>8.5&&(br("swallow"),Yn="The sand is pulling you down!",cs())}else if(re.phase==="swallow"){re.shake=1,re.T+=i,rc(re.T);let n=Mf(t/3.6);Nh=1.62-1.25*n,ic=2.7*(1-.9*n),se("vig").style.opacity=n,t>4&&se("card").hidden&&(re.shake=.3,zn("Swallowed",["The wet sand has turned to liquid. It closes around you, up to your neck.","You cannot move. Then the ground shakes again."],[{t:"Next",go:wf}]))}else if(re.phase==="sea"){re.shake=t<1.5?.6*(1-t/1.5):Math.sin(e*.5)>.96?.25:0,Nh=gr+.32+Math.sin(e*1.6)*.07;let n=re.boat;n.position.y=gr+.12+Math.sin(e*1.2)*.06,n.rotation.z=Math.sin(e*.9)*.05,n.userData.mark.rotation.y=e*1.5,He.position.set(n.position.x-.3,n.position.y+.05,n.position.z);for(let s of re.debris)s.position.y=gr+Math.sin(e*1.1+s.userData.ph)*.07,s.rotation.x=Math.sin(e*.7+s.userData.ph)*.12;Math.hypot(A.x-n.position.x,A.z-n.position.z)<2.3&&se("card").hidden&&Df(!1)}re.gain&&(re.gain.gain.value=Math.min(1,re.shake)*.9)}var jn=null,Ps=null,ig=[[-12.5,.8,3.6,3,4.6,Math.PI/2],[-7.6,-1.75,2.4,1.9,2.7,.08],[-5.2,1.8,2.2,1.8,2.5,-.1],[-16,-1.9,2.2,1.9,2.8,0]],Ko=-9.8,Jo=-1.7;function FS(i,e,t,n,s,r,a){let o=Math.cos(a),l=Math.sin(a),c=i-t,h=e-n,u=c*o-h*l,d=c*l+h*o;if(Math.abs(u)>=s||Math.abs(d)>=r)return[i,e];let f=u,m=d;return s-Math.abs(u)<r-Math.abs(d)?f=Math.sign(u||1)*s:m=Math.sign(d||1)*r,[t+f*o+m*l,n-f*l+m*o]}var Wt=-100,qt=70;function yi(i,e){let t=Lh("brick",!0).clone();return t.repeat.set(i,e),t.needsUpdate=!0,new Fe({map:t,roughness:.95})}function US(){if(jn)return;jn=new wt,Qe.add(jn),sn=jn;let i=new Fe({map:Bn([206,194,166],26,3),roughness:1,side:Ot}),e=new Fe({map:Ht([92,72,52],3,1,2),roughness:.95}),t=new Fe({map:Bn([150,130,100],30,3),roughness:1}),n=new Fe({color:1842206,roughness:.6,metalness:.7}),s=(c,h,u,d,f,m)=>{let _=new wt;_.position.set(c,0,h),_.rotation.y=m,jn.add(_);let b=new ti;b.moveTo(-u/2,0),b.lineTo(0,d),b.lineTo(u/2,0);let p=new Yi(b,{depth:f,bevelEnabled:!1});p.translate(0,0,-f/2);let x=ee(p,i,0,0,0,_);x.material=[new Mt({visible:!1}),i];let v=ee(new it(.04,.04,f+.5,6),e,0,d,0,_);v.rotation.x=Math.PI/2;for(let T of[-1,1])ee(new it(.05,.05,d,6),e,0,d/2,T*f/2,_);let y=new ti;y.moveTo(-u/2,0),y.lineTo(0,d),y.lineTo(u/2,0),y.closePath(),ee(new Ms(y),i,0,0,-f/2,_)};for(let c of ig)s(c[0],c[1],c[2],c[3],c[4],c[5]);for(let[c,h,u]of[[-.2,0,.3],[.15,.1,-.5],[0,-.15,1.3]])ee(new it(.06,.06,.7,7),e,Ko+c,.08,Jo+h).rotation.set(Math.PI/2,0,u);ee(new ys(.2,.5,7),new Mt({color:16751150}),Ko,.33,Jo);for(let c of[-1,1]){let h=ee(new it(.02,.02,1.3,5),n,Ko+c*.3,.6,Jo);h.rotation.z=c*.45}let r=ee(new Rn(.16,10,8),n,Ko,.7,Jo);r.scale.y=.8;for(let[c,h,u]of[[-11.4,-2.4,1],[-12.3,-2.6,.85],[-6.4,-.1,.85],[-3.2,2.5,1],[-13.6,-2.5,1]])ee(new Rn(.3,10,8),t,c,.2*u,h).scale.set(1.2*u,.7*u,.9*u);let a=yi(1.5,.5);for(let[c,h,u,d,f,m]of[[-2,-2.4,2.2,.7,.15,1.2],[-1,2.4,2,.9,-.2,1.2],[-15.9,2.5,1.8,.5,.1,1]])ee(new pt(u,d,m),a,c,d/2-.1,h).rotation.set(.12,f,.1);for(let[c,h,u,d,f]of[[-4.3,-2.9,3,.15,.18],[-3.6,.2,2.6,-1.25,.12],[-9.6,2.8,3,.05,.3],[-10.8,-2.9,2.4,-.05,.1]])ee(new pt(u,.2,.2),e,c,.35,h).rotation.set(0,d,f);let o=ee(new Tt(160,160),dr,81.2,.07,0);o.rotation.x=-Math.PI/2;let l=ee(new Tt(3,14),new Mt({color:6245944,transparent:!0,opacity:.4}),-.2,.012,0);l.rotation.x=-Math.PI/2,sg();for(let[c,h,u,d]of Es){if(!Xt[d])continue;let f=Xt[d].userData.anim;delete Xt[d].userData.anim;let m=gh(Xt[d]);if(Xt[d].userData.anim=f,m.traverse(_=>{_.isMesh&&(_.material=_.material.clone(),_.material.color.setRGB(.78,.74,.68))}),m.visible=!0,m.position.set(c,0,h),m.rotation.y=u,jn.add(m),ec(m,d==="sailor"?"Sad1":d==="kofi"?"Injured":mn.SitDisbelief?"SitDisbelief":"Sad2"),Ns[d]=m,d==="benning"&&mn.SitDisbelief){m.userData.sits=!0;let _=new _t(new pt(.55,.42,.45),new Fe({map:Ht([132,100,70],3,1,2),roughness:.9}));_.position.set(c-Math.sin(u)*.18,.21,h-Math.cos(u)*.18),_.rotation.y=u,jn.add(_)}}sn=Qe}function sg(){let i=Xt.heath;!i||!jn||i.parent||(i.position.set(pr.x,0,pr.z),i.rotation.y=pr.ry,jn.add(i),ec(i,"Pray"))}function rg(){return A.unlocked.includes("tentp")&&A.unlocked.includes("kingston")}function Rh(){Yn=re.aTalk?rg()?"Go back to Abba.":"Look around: the big tent, and the edge of the water.":"Find Abba in the camp.",cs()}function Is(){Ta("sad"),In(),US(),ng(),A.place!=="out"&&os("out"),Ea(),re.on=!0,re.phase="after",re.ruin=!0,rc(0,1),jn.visible=!0;let i=cn.merchant,e=cn.sloop;i.position.set(Ge+19,-1.2,-7),i.rotation.set(.42,.15,.05),e.position.set(Ge-6,.5,13),e.rotation.set(-.5,2.2,.08),Qe.fog.color.copy(sc),Qe.fog.near=35,Qe.fog.far=420,mr.material.color.set(14866626),A.place="after",A.x=-1.6,A.z=0,A.yaw=Math.PI/2,A.pitch=0,st.x=-8.9,st.z=.7;for(let t of Bh)t.visible=!1;He.position.set(st.x,0,st.z),He.visible=!0,gn&&(gn.visible=!1),zh(!1),Rh(),Gn("Three days later")}function kS(){zn("Stay, or go?",["The town you knew is under the sea. Across the harbour, people are starting again.","What will you do?"],[{t:"Stay and build again",go:()=>zn("He stayed",["The real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church."],[{t:"Go to the church",go:Fs}])},{t:"Cross the harbour",go:()=>zn("Most people left",["Most survivors crossed the harbour, and their new town became Kingston.","But the real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church."],[{t:"Go to the church",go:Fs}])}])}function OS(){if(Ps)return;Ps=new wt,Qe.add(Ps),sn=Ps;let i=new Fe({map:Bn([176,172,160],26,2),roughness:.9}),e=new Fe({map:Bn([96,84,74],30,6),roughness:.95}),t=new Fe({color:1776152,roughness:.9}),n=new Fe({map:Ht([84,62,44],4,1,1),roughness:.9}),s=ee(new Tt(30,30),new Fe({map:Bn([126,138,92],36,10),roughness:1}),Wt,.02,qt-4);s.rotation.x=-Math.PI/2;let r=yi(16,2.4);for(let[N,H,q,ce]of[[Wt,qt-19,30,.5],[Wt,qt+11,30,.5],[Wt-15,qt-4,.5,30],[Wt+15,qt-4,.5,30]])ee(new pt(q,2.6,ce),r,N,1.3,H),ee(new pt(q+.2,.14,ce+.2),i,N,2.67,H);let a=Wt-4,o=qt-6,l=8,c=15,h=6,u=new Fe({color:15328212,roughness:.85}),d=new Fe({color:1909544,roughness:.3,metalness:.3});ee(new pt(l,h,c),yi(8,5.5),a,h/2,o),ee(new pt(l+.3,.45,c+.3),i,a,.22,o),ee(new pt(l+.35,.28,c+.35),u,a,h-.1,o);for(let N of[-1,1])for(let H of[-1,1])for(let q=.6;q<h-.4;q+=.62)ee(new pt(q%1.24<.62?.62:.42,.28,.12),u,a+N*(l/2+.05)-N*.2,q,o+H*(c/2+.01)).rotation.y=0;let f=(N,H)=>{let q=new ti;return q.moveTo(-N/2,0),q.lineTo(N/2,0),q.lineTo(N/2,H-N/2),q.absarc(0,H-N/2,N/2,0,Math.PI,!1),q.lineTo(-N/2,0),q},m=(N,H,q,ce,Pe,$)=>{let de=new wt;de.position.set(N,H,q),de.rotation.y=ce,sn.add(de);let Ae=f(Pe+.36,$+.18);Ae.holes.push(f(Pe,$));let Xe=new _t(new Yi(Ae,{depth:.08,bevelEnabled:!1,curveSegments:14}),u);Xe.position.set(0,-.09,0),de.add(Xe);let Me=new _t(new Ms(f(Pe,$),14),d);Me.position.z=-.02,de.add(Me);for(let Ye of[$*.33,$*.62]){let at=new _t(new pt(Pe,.04,.03),u);at.position.set(0,Ye,.01),de.add(at)}let je=new _t(new pt(.04,$-Pe/2,.03),u);je.position.set(0,($-Pe/2)/2,.01),de.add(je);let At=new _t(new pt(.26,.34,.12),u);At.position.set(0,$+.06,.03),de.add(At)};for(let N of[-5,-1.7,1.6])for(let H of[-1,1])m(a+H*(l/2+.02),1.5,o+N,H*Math.PI/2,1.3,3.2);let _=Math.atan2(3.2,l/2),b=Math.hypot(l/2,3.2)+.4;for(let N of[-1,1]){let H=ee(new pt(b,.14,c+.6),e,a+N*(l/4+.1),h+1.55,o);H.rotation.z=-N*_}for(let N of[-1,1]){let H=new ti;H.moveTo(-l/2,0),H.lineTo(0,3.2),H.lineTo(l/2,0),H.closePath();let q=ee(new Ms(H),yi(.25,.3),a,h,o+N*c/2+N*.01);q.material.side=Ot}let p=ee(new pi(.55,.12,8,24),u,a,h+1.25,o-c/2-.05);ee(new lo(.55,24),d,a,h+1.25,o-c/2-.03).rotation.y=Math.PI,m(a,1.6,o-c/2-.02,Math.PI,1.8,3.6);let x=4.2,v=o+c/2+x/2-.2,y=10;ee(new pt(x,y,x),yi(4.2,9.5),a,y/2,v);for(let N of[.22,4.2,7.4])ee(new pt(x+.2,N<1?.45:.22,x+.2),N<1?i:u,a,N,v);for(let[N,H,q]of[[0,1,0],[0,-1,Math.PI],[1,0,Math.PI/2],[-1,0,-Math.PI/2]])H!==-1&&m(a+N*(x/2+.02),8,v+H*(x/2+.02),q,1,1.6),H===1&&m(a,4.8,v+x/2+.02,0,.8,1.6);ee(new pt(x+.45,.32,x+.45),u,a,y+.1,v);for(let N of[-1,1])for(let H of[-1,1])ee(new pt(.42,.75,.42),u,a+N*(x/2-.05),y+.6,v+H*(x/2-.05));let T=new wt;T.position.set(a,y+.26,v),sn.add(T);for(let N=0;N<8;N++){let H=new _t(new pt(.12,1.3,.12),u),q=N/8*Math.PI*2;H.position.set(Math.cos(q)*.75,.65,Math.sin(q)*.75),T.add(H)}let E=new _t(new Rn(.95,16,8,0,Math.PI*2,0,Math.PI/2),new Fe({color:6253158,roughness:.6,metalness:.4}));E.position.y=1.3,T.add(E);let g=new _t(new it(.03,.03,1.1,6),t);g.position.y=2.6,T.add(g);let M=new _t(new pt(.5,.05,.05),t);M.position.y=2.75,T.add(M);let k=new wt;k.position.set(a,0,v+x/2+.03),sn.add(k);let I=f(2,3);I.holes.push(f(1.5,2.75)),k.add(new _t(new Yi(I,{depth:.1,bevelEnabled:!1,curveSegments:14}),u));let U=new _t(new Ms(f(1.5,2.75),14),n);U.position.z=-.01,k.add(U);let V=Wt+6,J=qt-2;ee(new pt(1.2,.2,2.5),i,V,.1,J),ee(new pt(1,.7,2.3),yi(2.3,.7),V,.55,J);let R=Un(512,1024,N=>{N.fillStyle="#c9c5b8",N.fillRect(0,0,512,1024);for(let ce=0;ce<2500;ce++)N.fillStyle=`rgba(${90+Math.random()*60|0},${88+Math.random()*50|0},80,${Math.random()*.12})`,N.fillRect(Math.random()*512,Math.random()*1024,2+Math.random()*6,2+Math.random()*6);N.strokeStyle="rgba(70,66,58,0.7)",N.lineWidth=3,N.strokeRect(22,22,468,980),N.fillStyle="rgba(60,56,50,0.85)",N.beginPath(),N.arc(256,112,58,0,7),N.lineWidth=5,N.stroke(),N.font="600 26px Georgia, serif",N.textAlign="center",N.fillText("L G",256,122);let H=["Here Lyes the Body of","LEWIS GALDY Esq.","who departed this Life at","Port Royal the 22d December 1739","Aged 80.","He was Born at Montpelier in France","but left that Country for his Religion","and came to settle in this Island","where he was swallowed up","in the Great Earthquake in the Year 1692","and By the Providence of God","was by another Shock thrown into the Sea","and Miraculously saved by swimming","until a Boat took him up.","He lived many Years after","in great Reputation,","Beloved by all that knew him","and much Lamented at his Death."],q=214;for(let ce of H){let Pe=ce.startsWith("LEWIS");N.font=(Pe?"700 31px":"italic 21px")+" Georgia, serif",N.fillStyle="rgba(255,255,255,0.35)",N.fillText(ce,257,q+1.5),N.fillStyle="rgba(48,44,38,0.92)",N.fillText(ce,256,q),q+=Pe?46:41}});R.wrapS=R.wrapT=vn;let P=ee(new pt(1.25,.12,2.55),[i,i,new Fe({map:R,roughness:.85}),i,i,i],V,.96,J),F=ee(new vs(1.75,1.9,40),new Mt({color:14263361,side:Ot}),V,.05,J);F.rotation.x=-Math.PI/2;for(let[N,H]of[[Wt+3,qt-9],[Wt+9.5,qt-7],[Wt+1.5,qt+3]])ee(new pt(.7,1,.14),i,N,.5,H).rotation.z=.06;let O=new Fe({color:5208636,roughness:.9,side:Ot}),W=new Fe({map:Bn([120,100,78],30,2),roughness:1});for(let[N,H,q]of[[Wt+11,qt-13,7],[Wt+12,qt+6,6],[Wt-12,qt+7,7.5]]){let ce=ee(new it(.16,.24,q,8),W,N,q/2,H);ce.rotation.z=.06;for(let Pe=0;Pe<9;Pe++){let $=ee(new Tt(.7,3.4),O,N+.3,q,H);$.geometry.translate(0,1.7,0),$.rotation.set(1.15+Pe%3*.18,Pe*.7,0,"YXZ")}}sn=Qe}function Fs(){In(),A.place!=="out"&&os("out"),A.ch.after=!0,wa(),OS(),Ea(),re.on=!0,re.phase="yard";for(let i of Sa)i.m.visible=!1;cn.merchant.visible=cn.sloop.visible=!1,He.visible=!1,zh(!1),Ps.visible=!0,A.place="yard",A.x=Wt+11,A.z=qt+3.5,A.yaw=.95,A.pitch=.06,st.x=9999,Yn="Find the tomb beside the church.",cs(),Gn("St Peter\u2019s Church, Port Royal")}function BS(){zn("Here lies Lewis Galdy",["\u201CHere Lyes the Body of LEWIS GALDY Esq. who departed this Life at Port Royal the 22d December 1739, Aged 80.","He was Born at Montpelier in France, but left that Country for his Religion, and came to settle in this Island, where he was swallowed up in the Great Earthquake in the Year 1692,","and By the Providence of God was by another Shock thrown into the Sea, and Miraculously saved by swimming until a Boat took him up.","He lived many Years after in great Reputation, Beloved by all that knew him, and much Lamented at his Death.\u201D"],[{t:"Go on",go:zS}])}function zS(){Ta("end"),rs("fortune"),rs("stone"),zn("The end of the story",["Lewis Galdy lived for 47 more years. His tombstone tells of his escape, and says that everyone loved him.","It does not say what he sold to grow rich. Abba would have told it another way.","Two new pages are in your journal."],[{t:"Read the journal",go:()=>{In(),Cf()}},{t:"Credits",go:()=>{In(),se("credits").hidden=!1}},{t:"Go back to 1690",go:Uh}])}var Ni=null,tc=null,ma=-262,Yt=-248,Ui={coins:!1,talked:!1},ag={},Ch={sugar:[-259.5,-2.6],cocoa:[-254.6,-2.9],logwood:[-250.4,-2.9]};function og(){return["sugar","cocoa","logwood"].every(i=>A.unlocked.includes(i))}function Ph(){Yn=og()?Ui.coins?Ui.talked?"Read the letter on your desk.":"Abba is at the door. Talk to her.":"Sit at your desk and serve a customer.":"Check today\u2019s cargo: the casks, the sacks and the red wood.",cs()}function GS(){if(Ni)return;Ni=new wt,Ni.visible=!1,Qe.add(Ni),sn=Ni;let i=(R,P,F,O,W,N,H,q)=>ee(new pt(R,P,F),O,W,N,H,q),e=(R,P)=>new Fe({map:R,roughness:P===void 0?.9:P}),t=e(Ht([104,76,50],4,1,1)),n=new Fe({color:3811869,roughness:.95}),s=e(Ht([122,92,62],5,1,1),.8),r=new Fe({color:1842206,roughness:.6,metalness:.7}),a=new Fe({color:11569722,roughness:.4,metalness:.8}),o=new Fe({color:12172216,roughness:.4,metalness:.85}),l=new Fe({map:Bn([150,126,92],30,3),roughness:1}),c=new Fe({color:15129792,roughness:.9}),h=(ma+Yt)/2,u=Yt-ma,d=10,f=3.8;ee(new Tt(u,d),yi(7,5),h,0,0).rotation.x=-Math.PI/2,ee(new Tt(u,d),e(Ht([70,52,38],8,4,3)),h,f,0).rotation.x=Math.PI/2,ee(new Tt(u,f),yi(14,4),h,f/2,-5),ee(new Tt(u,f),yi(14,4),h,f/2,5).rotation.y=Math.PI,ee(new Tt(d,f),yi(10,4),ma,f/2,0).rotation.y=Math.PI/2;for(let[R,P,F,O]of[[4.1,-2.95,f,f/2],[2.5,3.75,f,f/2],[3.4,.8,f-3,3+(f-3)/2]])ee(new Tt(R,F),yi(R,F),Yt,O,P).rotation.y=-Math.PI/2;for(let R=ma+1;R<Yt;R+=2)i(.22,.26,d,n,R,f-.13,0);for(let R of[-2.2,2.2])for(let P of[ma+4.6,Yt-4.6])i(.28,f,.28,n,P,f/2,R);for(let R of[-1,1]){let P=new wt;P.position.set(Yt-.05,0,.8+R*1.7),P.rotation.y=R*1.48,Ni.add(P),i(.07,3,1.7,t,0,1.5,-R*.85,P);for(let F of[.5,2.5])i(.02,.06,1.2,r,-.045,F,-R*.75,P)}for(let R of[-.95,2.55])i(.2,3,.15,n,Yt-.05,1.5,R);i(.25,.25,3.8,n,Yt-.05,3.1,.8);let m=new wt;Ni.add(m);{let R=e(Ht([150,132,106],6,4,2)),P=e(Ht([84,66,48],3,1,2)),F=(W,N,H,q,ce,Pe,$)=>ee(new pt(W,N,H),q,ce,Pe,$,m);F(7,.1,30,R,Yt+3.5,-.05,.8),F(.25,.3,30,P,Yt+7,-.15,.8);for(let W=-13;W<=15;W+=2.4)ee(new it(.16,.18,2.2,9),P,Yt+7.05,-.9,W,m),Math.abs(W-.8)>2&&Math.round(W)%2===0&&ee(new it(.13,.15,.55,9),P,Yt+6.6,.27,W,m);for(let[W,N]of[[Yt+2.2,-3.4],[Yt+2.9,-2.6],[Yt+1.9,5.2]])ee(new it(.34,.34,.85,14),P,W,.42,N,m);let O=ee(new Tt(400,400),dr,Yt+207,-.45,.8,m);if(O.rotation.x=-Math.PI/2,cn.sloop){let W=cn.sloop.clone();W.position.set(Yt+17,-.35,1.5),W.rotation.y=Math.PI/2,W.visible=!0,W.traverse(N=>{N.isMesh&&N.material&&N.material.isMeshStandardMaterial&&(N.material=N.material.clone(),N.material.emissive.set(16777215),N.material.emissiveMap=N.material.map,N.material.emissiveIntensity=.55)}),m.add(W)}}let _=ee(new Tt(4.5,3.2),new Mt({color:16773839,transparent:!0,opacity:.16,blending:ra,depthWrite:!1}),Yt-2.6,.012,.8);_.rotation.x=-Math.PI/2,ee(new Tt(1.4,.9),new Mt({color:14674402}),h-2,2.9,4.99).rotation.y=Math.PI;for(let R of[-.35,0,.35])i(.04,.9,.04,r,h-2+R,2.9,4.96);let b=new Ti([[0,-.6],[.4,-.6],[.48,-.32],[.52,0],[.48,.32],[.4,.6],[0,.6]].map(([R,P])=>new he(R,P)),16),p=e(Ht([126,94,58],10,2,1),.8),x=(R,P,F)=>{let O=new wt;O.position.set(R,P+.6,F),Ni.add(O),ee(b,p,0,0,0,O);for(let[W,N]of[[-.5,.435],[-.25,.497],[.25,.497],[.5,.435]])ee(new it(N,N,.045,16,1,!0),r,0,W,0,O)};for(let R=0;R<3;R++)x(-261.2+R*1.1,0,-4.2),x(-260.65+R*1.1,0,-3.15);x(-260.65,1.2,-4),x(-259.55,1.2,-4);let v=0;for(let[R,P,F]of[[-255.4,0,-4.2],[-254.5,0,-4.3],[-253.6,0,-4.2],[-255,0,-3.5],[-254,0,-3.5],[-255,.42,-4.1],[-254.1,.42,-4.15],[-254.5,.8,-4.1],[-253.3,0,-3.4]]){let O=ee(new Rn(.42,10,8),l,R,P+.26,F);O.scale.set(1.15,.62,.85),O.rotation.y=v++*.7}let y=new Fe({map:Bn([214,208,192],22,2),roughness:1});for(let[R,P,F]of[[-256.9,0,-4.3],[-256.9,.8,-4.3],[-257.9,0,-4.3]]){i(.9,.78,1.1,y,R,P+.4,F);for(let O of[-.3,.3])i(.93,.81,.04,l,R,P+.4,F+O)}let T=new Fe({map:Bn([118,44,40],34,2),roughness:.9});for(let R=0;R<4;R++)for(let P=0;P<6-R;P++){let F=ee(new it(.14,.15,1.7,7),T,-251.6+P*.3+R*.15,.15+R*.26,-4);F.rotation.x=Math.PI/2,F.rotation.z=((P*7+R)%5-2)*.03}for(let[R,P,F,O]of[[-249.2,3.6,.9,.2],[-250.45,4.05,.7,.35],[-249.3,3.7,.6,.9]]){let W=i(F,F,F,s,R,F/2+(O>.8?.9:0),P);W.rotation.y=O}let E=ee(new pi(.32,.05,6,16),l,-252.5,1.9,-4.93);i(.05,.05,.2,r,-252.5,2.2,-4.9);let g=-258.6,M=2.9;i(2,.07,1,s,g,.9,M);for(let R of[-1,1])for(let P of[-1,1])i(.08,.88,.08,t,g+R*.9,.44,M+P*.42);i(1.9,.5,.05,t,g,.6,M+.45);let k=Un(256,160,R=>{R.fillStyle="#e9dfc4",R.fillRect(0,0,256,160),R.strokeStyle="#8a7a5c",R.beginPath(),R.moveTo(128,0),R.lineTo(128,160),R.stroke(),R.strokeStyle="#3a3026",R.lineWidth=1.3;for(let P=0;P<2;P++)for(let F=0;F<12;F++)R.beginPath(),R.moveTo(14+P*128,16+F*12),R.lineTo(70+P*128+F*37%30,16+F*12),R.stroke(),R.beginPath(),R.moveTo(98+P*128,16+F*12),R.lineTo(116+P*128,16+F*12),R.stroke()});k.wrapS=k.wrapT=vn,i(.72,.05,.46,[t,t,new Fe({map:k,roughness:.9}),t,t,t],g-.35,.96,M-.05),ee(new it(.09,.11,.02,12),a,g+.45,.945,M-.15),ee(new it(.012,.012,.42,6),a,g+.45,1.15,M-.15);let I=ee(new it(.008,.008,.5,6),a,g+.45,1.35,M-.15);I.rotation.z=Math.PI/2+.08;for(let R of[-1,1])ee(new it(.08,.06,.015,12),a,g+.45+R*.24,1.14-R*.02,M-.15),ee(new it(.003,.003,.2,4),a,g+.45+R*.24,1.25-R*.02,M-.15);for(let[R,P,F]of[[.75,.1,5],[.84,.16,3],[.7,.22,1],[.21,-.14,1]])ee(new it(.019,.019,.005*F,10),o,g+R,.937+.0025*F+(R<.3?.21:0),M+P);ee(new it(.07,.055,.015,12),a,g-.85,.943,M+.3),ee(new it(.011,.011,.13,6),c,g-.85,1.02,M+.3);let U=ee(new Rn(.016,6,6),new Mt({color:16762474}),g-.85,1.1,M+.3);U.scale.y=1.9;let V=i(.24,.004,.17,c,g+.1,.938,M+.25);V.rotation.y=.3,ee(new it(.018,.018,.006,10),new Fe({color:10231583,roughness:.5}),g+.1,.943,M+.25);let J=ee(new ys(.012,.3,5),c,g-.05,1.02,M-.2);J.rotation.z=.5,ee(new it(.03,.035,.05,8),r,g-.12,.96,M-.25),i(.4,.04,.3,s,g,.5,M+1);for(let R of[-1,1])for(let P of[-1,1])i(.04,.5,.04,t,g+R*.16,.25,M+1+P*.11);i(.9,.55,.55,n,-261.3,.275,3.9);for(let R of[-.3,0,.3])i(.05,.57,.57,r,-261.3+R,.275,3.9);i(.1,.12,.03,a,-261.3,.35,3.61);for(let R of[1.3,1.9])i(2.2,.04,.3,t,-259,R,4.83);for(let R=0;R<7;R++)i(.09+R%3*.02,.3,.22,R%2?t:n,-259.9+R*.13,1.47,4.83);for(let R=0;R<4;R++)ee(new it(.07,.07,.2,10),c,-258.6+R*.2,2.02,4.83);{let F=f-1;i(.012,.6,.012,r,-256,F+.45,.6),i(.18,.02,.18,r,-256,F+.17,.6),i(.18,.02,.18,r,-256,F-.13,.6),i(.14,.26,.14,new Mt({color:16766346,transparent:!0,opacity:.55}),-256,F+.02,.6),tc=new ts(16767392,0,14,1.4),tc.position.set(-256,F,.6),Qe.add(tc)}for(let R in Ch){let P=ee(new vs(.75,.86,36),new Mt({color:14263361,side:Ot}),Ch[R][0],.02,Ch[R][1]+.9);P.rotation.x=-Math.PI/2,ag[R]=P,A.unlocked.includes(R)&&(P.visible=!1)}sn=Qe}function HS(){if(Ta("begin"),!xr||!va){Gn("The town is still loading.");return}_r(),se("dialogue").hidden=!0,se("goal").hidden=!1,zn("1691",["A year has passed. Lewis Galdy now has a warehouse of his own, close to the wharf.","Ships bring goods in. He sells them on. This is how a merchant gets rich."],[{t:"Begin",go:ya},{t:"Not now",go:In}])}function ya(){In(),re.on&&(Ea(),re.on=!1),GS(),Ui.coins=Ui.talked=!1,os("ware"),A.x=-249,A.z=-.4,A.yaw=Math.PI/2-.12,A.pitch=0,Ph()}function VS(){zn("The letter",["\u201CMr Galdy. Spanish buyers will pay well for enslaved people from Jamaica. Put your money in with mine, and we will both be rich.\u201D","It is signed by the captain of a ship in the harbour."],[{t:"Say yes",go:()=>D0("You said yes",["In later years, the real Lewis Galdy made this choice. It made him rich.","The people who were sold had no choice at all."])},{t:"Say no",go:()=>D0("You said no",["That was the right thing to do.","In later years, the real Lewis Galdy said yes. It made him rich. The people who were sold had no choice at all."])}])}function D0(i,e){A.ch.ware=!0,wa(),zn(i,e,[{t:"Go on to 7 June 1692",go:tg},{t:"Go back to 1690",go:kh}])}function kh(){In(),os("out"),A.x=17,A.z=.4,A.yaw=Math.PI/2,A.pitch=0,Yn="",vi()}function WS(){let i=On.clientWidth,e=On.clientHeight;(On.width!==Math.floor(i*as.getPixelRatio())||On.height!==Math.floor(e*as.getPixelRatio()))&&(as.setSize(i,e,!1),Fi.aspect=i/e,Fi.updateProjectionMatrix())}var va=!1,N0=performance.now(),F0=0,Yo=!1,Mh=0,Wo=0,pa=null,U0=0,Sh=new Map,qS=new jt,XS=new ei;function cg(i){let e=Math.min(.05,(i-N0)/1e3);if(N0=i,WS(),A.started&&!oi){let s=0,r=0;(Pn.has("w")||Pn.has("arrowup"))&&(s+=1),(Pn.has("s")||Pn.has("arrowdown"))&&(s-=1),Pn.has("d")&&(r+=1),Pn.has("a")&&(r-=1),Pn.has("arrowleft")&&(A.yaw+=1.9*e),Pn.has("arrowright")&&(A.yaw-=1.9*e),s-=pn.y,r+=pn.x;let a=Math.hypot(s,r);a>1&&(s/=a,r/=a);let o=ic*e,l=Math.sin(A.yaw),c=Math.cos(A.yaw),[h,u]=fS(A.x+(-l*s+c*r)*o,A.z+(-c*s-l*r)*o);a>.05&&!Go&&(F0+=e*8.5*Math.min(1,a)),yh+=Math.hypot(h-A.x,u-A.z),(h!==A.x||u!==A.z)&&(A0=performance.now()),yh>1.35&&(yh=0,MS()),A.x=h,A.z=u}else A.started||(A.yaw=Math.PI/2-.12+Math.sin(i/5200)*.14);ff+=(M0(A.x,A.z)-ff)*Math.min(1,e*10),rf+=(e*1e3-rf)*.05,af+=e,af>3&&A.started&&(af=0,rf>26&&qo>.8&&(qo=Math.max(.8,qo-.2),as.setPixelRatio(qo))),re.on&&(NS(e,i/1e3),PS(e));let t=re.shake*(Go?.15:1),n=i/1e3;if(kn){let s=jo&&A.started&&A.place!=="sea"&&!(re.on&&re.phase==="swallow");if(kn.visible=s,s){kn.position.set(A.x,M0(A.x,A.z),A.z),kn.rotation.y=A.yaw+Math.PI;let r=yh>0&&performance.now()-A0<250,a=kn.userData.anim;a&&r!==lf&&(lf=r,r?a.play(mn.Walk?"Walk":null):a.rest()),a&&lf&&a.cur!==a.base&&(a.cur.timeScale=Math.max(.6,Math.min(1.6,ic/1.5)))}}if(Fi.position.set(A.x+Math.sin(n*31)*.06*t,Nh+ff+(Go?0:Math.sin(F0)*.035)+Math.sin(n*37)*.05*t,A.z+Math.sin(n*27)*.05*t),Fi.rotation.set(A.pitch+Math.sin(n*29)*.015*t,A.yaw,Math.sin(n*23)*.03*t),kn&&kn.visible){let s=A.place==="out"?2.6:1.9;Fi.position.x+=Math.sin(A.yaw)*s,Fi.position.z+=Math.cos(A.yaw)*s,Fi.position.y+=.35,Fi.rotation.x-=.12}for(let[s,r]of Sh)s.quaternion.copy(r);if(fr&&A.place!=="in"&&A.place!=="ware"){let s=i/1e3;fr.offset.x=s*.02,fr.offset.y=s*.013;let r=ba.geometry.attributes.position,a=ba.userData.base;if(!pf||(U0&1)===0)for(let c=0;c<r.count;c++){let h=a[c*3],u=a[c*3+2];r.setY(c,Math.sin(h*.42+s*1.3)*.07+Math.sin(u*.31+s*.9)*.06+Math.sin((h+u)*.9+s*2.1)*.025)}r.needsUpdate=!0,(U0++&(pf?7:3))===0&&ba.geometry.computeVertexNormals(),ba.position.y=gr;let o=re.ruin?null:cn.merchant,l=re.ruin?null:cn.sloop;o&&(o.position.y=-.35+Math.sin(s*.8)*.05,o.rotation.x=Math.sin(s*.6)*.012,o.rotation.z=Math.sin(s*.45)*.004),l&&(l.position.y=-.35+Math.sin(s*1+1)*.07,l.rotation.x=Math.sin(s*.75+2)*.025);for(let c of lg){for(let h=0;h<c.p.count;h++){let u=c.uv.getX(h);c.p.setZ(h,c.base[h*3+2]+(Math.sin(u*5.5-s*5.2)*.2+Math.sin(u*11-s*8.3)*.05)*u),c.p.setY(h,c.base[h*3+1]+Math.sin(u*4-s*3.1)*.05*u)}c.p.needsUpdate=!0}}TS(i/1e3),A.started&&i-E0>5e3&&(E0=i,wa()),As&&As.update(e);for(let s of W0){let r=s.getRoot(),a=r.visible,o=r.parent;for(;a&&o;)a=o.visible,o=o.parent;a&&s.update(e)}for(let s of[He,...Object.values(Xt),...Object.values(Ns)])s&&s.userData.anim&&s.userData.anim.tick(e);if(Yo&&Xt.kofi&&Xt.kofi.visible&&mn.Carry&&cS(e),Yo)for(let s of Ma){let r=Xt[s.id];if(!r||!r.visible||s.walking)continue;let a=A.x-s.x,o=A.z-s.z,l=s.ry;if(Math.hypot(a,o)<4.5){let u=Math.atan2(a,o)-s.ry;u=Math.atan2(Math.sin(u),Math.cos(u)),l=s.ry+u}let c=l-r.rotation.y;c=Math.atan2(Math.sin(c),Math.cos(c)),r.rotation.y+=c*Math.min(1,e*3);let h=r.userData.anim;h&&mn.TurnL&&Math.abs(c)>.75&&h.cur===h.base&&dn!==r&&h.play(c>0?"TurnL":"TurnR",!0)}if(Yo&&He){let s=i/1e3,r=He.getObjectByName("mixamorigSpine"),a=He.getObjectByName("mixamorigSpine2"),o=He.getObjectByName("mixamorigHead"),l=He.getObjectByName("mixamorigNeck");for(let m of[r,a,l,o])m&&(Sh.has(m)||Sh.set(m,new jt),Sh.get(m).copy(m.quaternion));let c=(m,_,b,p)=>{m&&m.quaternion.multiply(qS.setFromEuler(XS.set(_,b,p)))};c(r,0,Math.sin(s*.35)*.05,Math.sin(s*.5)*.03),c(a,Math.sin(s*1.5)*.01,0,0);let h=A.x-st.x,u=A.z-st.z,d=!re.abbaRun&&(Math.hypot(h,u)<4.5||!se("dialogue").hidden);if(Wo+=((d?1:0)-Wo)*Math.min(1,e*3),!pa&&l&&o){let m=null;if(He.traverse(_=>{!m&&_.isSkinnedMesh&&(m=_.skeleton)}),m){pa={};let _=b=>new tt().copy(m.boneInverses[m.bones.indexOf(b)]).invert();for(let b of[l,o]){let p=new tt().copy(_(b.parent)).invert().multiply(_(b));pa[b.name]=new jt().setFromRotationMatrix(p)}}}pa&&(l.quaternion.slerp(pa[l.name],Wo*.5),o.quaternion.slerp(pa[o.name],Wo*.5));let f=Math.atan2(h,u)-He.rotation.y;f=Math.max(-.7,Math.min(.7,Math.atan2(Math.sin(f),Math.cos(f))))*Wo,Mh+=(f-Mh)*Math.min(1,e*4),c(l,0,Mh*.4,0),c(o,Math.sin(s*.9)*.02,Mh*.6,0)}if(Yo){let s=A.x-st.x,r=A.z-st.z,a=Math.hypot(s,r),o=A.place==="sea"?Math.atan2(s,r):a<9?Math.max(-1.1,Math.min(1.1,Math.atan2(s,r))):A.place==="in"?0:.25;if(!re.abbaRun){let l=o-He.rotation.y;He.rotation.y+=l*Math.min(1,e*3);let c=He.userData.anim;c&&mn.TurnLW&&Math.abs(l)>.8&&c.cur===c.base&&He.visible&&!re.on&&c.play(l>0?"TurnLW":"TurnRW",!0)}if(gn&&gn.visible){let l=1+(Go?0:Math.sin(i/420)*.08);gn.scale.set(l,l,l)}if(A.started){Rs=null;let l=1e9;if(!oi)for(let c of pS){let h=c.where();if(!h)continue;let u=Math.hypot(A.x-h[0],A.z-h[1]);u<c.r&&u<l&&(l=u,Rs=c)}se("talk").hidden=!Rs,Rs&&se("talk").textContent!==Rs.label&&(se("talk").textContent=Rs.label),!A.unlocked.includes("harbour")&&A.x<Ge-2&&(rs("harbour"),vi())}if(A.place==="in"&&mf&&!Go){let l=.85+Math.sin(i/90)*.08+Math.sin(i/37)*.07;mf.scale.set(1,l,1),$o.intensity=16*l;for(let c=0;c<Qo.length;c++){let h=1.75+Math.sin(i/70+c*2.1)*.25;Qo[c].scale.y=Qo[c].geometry.type==="SphereGeometry"?h:.9+(h-1.75)}}}as.render(Qe,Fi),requestAnimationFrame(cg)}var lg=[];async function jS(){await _0(["tex_harbour","merchant","sloop"],e=>{se("bar").style.width=Math.round(e*100)+"%"}),await v0();for(let e of["merchant","sloop"])cn[e]=fa(window.__got[e].scene),cn[e].traverse(t=>{if(t.isMesh&&t.material.name==="Flag"){let n=t.geometry.attributes.position;lg.push({p:n,base:n.array.slice(),uv:t.geometry.attributes.uv})}});ZM(),se("start").disabled=!1,se("start").textContent=_f?"Continue":"Step ashore",se("savenote").hidden=!_f,se("loadnote").hidden=!0,document.querySelector(".track").hidden=!0,await _0(["tex_town","h1","h2","h3","h4","h5","h6","abba","kofi","sailor","benning","anims"]),await v0();for(let e in window.__tex)window.__tex[e]="";for(let e of Object.keys(Xo))V0[e]=fa(window.__got[e].scene);let i=window.__got.abba;if(He=fa(i.scene),i.animations.length&&(As=new na(He),Kn=As.clipAction(i.animations[0]),Kn.play(),Th=i.animations[0].clone(),Th.tracks=Th.tracks.filter(e=>e.name.endsWith(".quaternion"))),window.__got.anims)for(let e of window.__got.anims.animations)mn[e.name]=e;As&&mn.Run&&(ai=As.clipAction(Eh("Run",!0))),As&&Kn&&ec(He,null,As,Kn);for(let e of Ma){let t=fa(window.__got[e.id].scene);t.position.set(e.x,e.y||dS(e.x,e.z),e.z),t.rotation.y=e.ry,Qe.add(t),Xt[e.id]=t,ec(t)}hS(),gn&&(gn.visible=!A.talked),window.__got=null,xr=!0,Yo=!0,setTimeout(()=>{$M();for(let t of Ls)A.unlocked.includes(t.id)&&(Ef[t.id].visible=!1);A.ate&&(ss.visible=!0),va=!0,se("tchap").hidden=!1,bf("heath").then(t=>{Xt.heath=fa(t.scene),sg()}).catch(()=>{}),bf("galdy").then(t=>{kn=fa(t.scene),kn.visible=!1,Qe.add(kn),ec(kn,"Idle"),se("view").hidden=!1}).catch(()=>{}),se("chapters").hidden||Pf();let e=new URLSearchParams(location.search);e.has("shot")&&(se("start").click(),e.get("shot")==="talk"&&(A.x=-3.6,A.z=-1.4,A.yaw=.62,A.pitch=-.02,setTimeout(()=>se("talk").click(),300)),e.get("shot")==="abbarun"&&(Cs(),br("main"),re.t=1.6,A.x=5,A.z=-.5,A.yaw=Math.PI/2-.3),e.get("shot")==="quake1"&&(Cs(),br("main"),re.t=6.5,A.x=6,A.yaw=Math.PI/2+.3),e.get("shot")==="quake2"&&(Cs(),wf(),A.yaw+=0),e.get("shot")==="quake3"&&(Cs(),wf(),A.x=Ge+14,A.z=20,A.yaw=Math.PI/2+.35,A.pitch=.1),e.get("shot")==="after"&&(Is(),A.x=-2,A.z=-1,A.yaw=Math.PI/2-.1),e.get("shot")==="after2"&&(Is(),A.x=-12,A.z=-1,A.yaw=-Math.PI/2-.15),e.get("shot")==="yard"&&Fs(),e.get("shot")==="yard2"&&(Fs(),A.x=Wt+6,A.z=qt-.2,A.yaw=0,A.pitch=-1.1),e.get("shot")==="church"&&(Fs(),A.x=Wt+9,A.z=qt+9,A.yaw=Math.atan2(-(Wt-4-A.x),-(qt-6-A.z)),A.pitch=.18),e.get("shot")==="ware"&&ya(),e.get("shot")==="door"&&(ya(),A.x=-253,A.z=.6,A.yaw=-Math.PI/2,A.pitch=0),e.get("shot")==="ware2"&&(ya(),A.x=-256.6,A.z=.2,A.yaw=.62+Math.PI*0,A.yaw=Math.atan2(-(-258.6-A.x),-(2.9-A.z)),A.pitch=-.25),e.get("shot")==="chapters"&&If(),e.get("shot")==="third"&&(A.x=12,A.z=.3,A.yaw=Math.PI/2,setTimeout(()=>Nf(),4500)),e.get("shot")==="kofi2"&&(A.x=33,A.z=-.6,A.yaw=Math.PI/2+.2),e.get("shot")==="npc1"&&(A.x=23.6,A.z=.6,A.yaw=Math.atan2(-(21.7-23.6),-(2.35-.6))),e.get("shot")==="npc2"&&(A.x=37.2,A.z=.2,A.yaw=Math.PI/2-.25),e.get("shot")==="npc3"&&(A.x=8.6,A.z=.9,A.yaw=Math.PI,A.pitch=.05),e.get("shot")==="camp3"&&(Is(),A.x=-4.2,A.z=3.4,A.yaw=Math.PI/2-.2),e.get("shot")==="npc4"&&(Is(),A.x=-7.4,A.z=3.2,A.yaw=Math.atan2(-(-9.65+7.4),-(1.75-3.2))),e.get("shot")==="street"&&(A.x=17,A.z=.4),e.get("shot")==="ships"&&(A.x=Ge+1,A.z=.9,A.yaw=-Math.PI/2+.25,A.pitch=.22),e.get("shot")==="beach"&&(A.x=Ge-6,A.z=1,A.yaw=-Math.PI/2-.9,A.pitch=-.05),e.get("shot")==="beach2"&&(A.x=Ge-7,A.z=-2,A.yaw=-Math.PI/2+.8,A.pitch=.05),(e.get("shot")==="in"||e.get("shot")==="stew")&&(A.talked=!0,A.unlocked.push("harbour"),os("in"),A.x=-199.6,A.z=2.6,A.yaw=.25,A.pitch=-.12,vi(),e.get("shot")==="stew"&&(A.x=-200.6,A.z=-.6,A.yaw=.1,setTimeout(()=>{se("talk").click(),A.step=1,Rf()},400))))},300)}function k0(i){i&&i.started||gS(mS()),jS().catch(()=>{}),i&&i.started&&(Object.assign(A,i),(A.place!=="out"||A.x>Ge+24||A.x<fn-1||Math.abs(A.z)>9.5)&&(A.place="out",A.x=17,A.z=.4,A.yaw=Math.PI/2,A.pitch=0),se("start").addEventListener("click",()=>{A.unlocked.length&&(se("jcount").textContent=A.unlocked.length,se("jcount").hidden=!1)},{once:!0})),requestAnimationFrame(cg)}window.claude?.hot?.snapshot?.(()=>A.place==="out"&&!re.on?{...A,step:0}:{...A,step:0,place:"out",x:17,z:.4,yaw:Math.PI/2,pitch:0});window.claude?.hot?.ready?window.claude.hot.ready(k0):k0(window.claude?.hot?.data??{});yf=yr("goArrive",yf);kh=yr("leaveWare",kh);ya=yr("beginWare",ya);Cs=yr("beginQuake",Cs);Is=yr("beginAfter",Is);Fs=yr("toYard",Fs);Uh=yr("leaveQuake",Uh);se("dev").onclick=()=>{se("credits").hidden=!1};se("crclose").onclick=()=>{se("credits").hidden=!0};se("chcred").onclick=()=>{se("credits").hidden=!1};function Nf(){kn&&(jo=!jo,se("view").setAttribute("aria-pressed",String(jo)),Gn(jo?"You can see Lewis Galdy. Press V to look through his eyes again.":"You see through Galdy\u2019s eyes."))}se("view").onclick=Nf;addEventListener("keydown",i=>{(i.key==="v"||i.key==="V")&&!i.repeat&&document.activeElement?.tagName!=="INPUT"&&Nf()});function KS(){return A.place==="ware"?1:re.on&&re.phase==="yard"?4:re.on&&(re.phase==="after"||A.place==="after")?3:re.on?2:0}se("reset").onclick=()=>{if(Ah)return;_r();let i=KS(),e=vf[i];zn("Reset",["Go back to the start of this chapter, or begin the whole story again."],[{t:"Restart \u201C"+e.name+"\u201D",go:()=>{In(),i===0&&(A.x=43,A.z=0),e.go()}},{t:"Start the whole story again",go:()=>zn("Start again?",["This erases everything you have found, including your journal pages."],[{t:"Yes, start again",go:()=>{try{localStorage.removeItem(Gh)}catch{}location.reload()}},{t:"No, keep playing",go:In}])},{t:"Cancel",go:In}])};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
