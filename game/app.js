(()=>{var Wf=0,qh=1,qf=2;var Ja=1,Xf=2,Ir=3,xi=0,on=1,Ot=2,zs=0,Lr=1,Dr=2,Xh=3,jh=4,jf=5;var Gs=100,Kf=101,Jf=102,Yf=103,Zf=104,$f=200,Qf=201,ep=202,tp=203,Kh=204,Jh=205,np=206,ip=207,sp=208,rp=209,ap=210,op=211,cp=212,lp=213,hp=214,ac=0,oc=1,cc=2,dr=3,lc=4,hc=5,uc=6,dc=7,Yh=0,up=1,dp=2,_i=0,Zh=1,$h=2,Qh=3,Ya=4,eu=5,tu=6,nu=7,Lh="attached",fp="detached",iu=300,Hs=301,Nr=302,Bc=303,zc=304,zn=1e3,rn=1001,fr=1002,Ht=1003,Gc=1004;var Vs=1005;var Jt=1006,Fr=1007;var Gn=1008;var En=1009,su=1010,ru=1011,Ur=1012,Hc=1013,ii=1014,Fn=1015,si=1016,Vc=1017,Wc=1018,Ws=1020,au=35902,ou=35899,cu=1021,lu=1022,Hn=1023,Ni=1026,Wi=1027,qc=1028,Xc=1029,hs=1030,jc=1031;var Kc=1033,Za=33776,$a=33777,Qa=33778,eo=33779,Jc=35840,Yc=35841,Zc=35842,$c=35843,Qc=36196,el=37492,tl=37496,nl=37488,il=37489,to=37490,sl=37491,rl=37808,al=37809,ol=37810,cl=37811,ll=37812,hl=37813,ul=37814,dl=37815,fl=37816,pl=37817,ml=37818,gl=37819,bl=37820,xl=37821,_l=36492,yl=36494,vl=36495,Ml=36283,Sl=36284,no=36285,wl=36286,pp=2200,mp=2201,gp=2202,Rs=2300,Cs=2301,sc=2302,Dh=2303,Ts=2400,Es=2401,ga=2402,Tl=2500,bp=2501,hu=0,io=1,Or=2,xp=3200;var El=0,_p=1,Vn="",Nt="srgb",_n="srgb-linear",ba="linear",St="srgb";var rc=7680;var yp=519,vp=512,Mp=513,Sp=514,uu=515,wp=516,Tp=517,du=518,fu=519,pu=35044;var mu="300 es",Bn=2e3,pr=2001;function b0(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function x0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function mr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ep(){let i=mr("canvas");return i.style.display="block",i}var Zd={},gr=null;function xa(...i){let e="THREE."+i.shift();gr?gr("log",e,...i):console.log(e,...i)}function Ap(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ze(...i){i=Ap(i);let e="THREE."+i.shift();if(gr)gr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function $e(...i){i=Ap(i);let e="THREE."+i.shift();if(gr)gr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function As(...i){let e=i.join(" ");e in Zd||(Zd[e]=!0,ze(...i))}function Rp(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Cp={[ac]:ac,[cc]:uc,[lc]:lc,[dr]:hc,[oc]:oc,[uc]:cc,[dc]:dc,[hc]:dr},ei=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],$d=1234567,da=Math.PI/180,Ps=180/Math.PI;function ri(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(dn[i&255]+dn[i>>8&255]+dn[i>>16&255]+dn[i>>24&255]+"-"+dn[e&255]+dn[e>>8&255]+"-"+dn[e>>16&15|64]+dn[e>>24&255]+"-"+dn[t&63|128]+dn[t>>8&255]+"-"+dn[t>>16&255]+dn[t>>24&255]+dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]).toLowerCase()}function dt(i,e,t){return Math.max(e,Math.min(t,i))}function gu(i,e){return(i%e+e)%e}function _0(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function y0(i,e,t){return i!==e?(t-i)/(e-i):0}function fa(i,e,t){return(1-t)*i+t*e}function v0(i,e,t,n){return fa(i,e,1-Math.exp(-t*n))}function M0(i,e=1){return e-Math.abs(gu(i,e*2)-e)}function S0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function w0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function T0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function E0(i,e){return i+Math.random()*(e-i)}function A0(i){return i*(.5-Math.random())}function R0(i){i!==void 0&&($d=i);let e=$d+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function C0(i){return i*da}function P0(i){return i*Ps}function I0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function L0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function bu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function D0(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*u,l*f,o*c);break;case"YZY":i.set(l*f,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*f,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*d,o*c);break;case"YXY":i.set(l*d,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*d,o*h,o*c);break;default:ze("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Al(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function xu(i,e){if(e.constructor===Float32Array)return i;let t=Al(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function _u(i,e){if(e.constructor===Float32Array)return i;let t=Al(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var Rl={DEG2RAD:da,RAD2DEG:Ps,generateUUID:ri,clamp:dt,euclideanModulo:gu,mapLinear:_0,inverseLerp:y0,lerp:fa,damp:v0,pingpong:M0,smoothstep:S0,smootherstep:w0,randInt:T0,randFloat:E0,randFloatSpread:A0,seededRandom:R0,degToRad:C0,radToDeg:P0,isPowerOfTwo:I0,ceilPowerOfTwo:L0,floorPowerOfTwo:bu,setQuaternionFromProperEuler:D0,normalize:_u,denormalize:xu},Tu=class Tu{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=dt(this.x,e.x,t.x),this.y=dt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=dt(this.x,e,t),this.y=dt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(dt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Tu.prototype.isVector2=!0;var le=Tu,Xt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],f=r[a+0],d=r[a+1],g=r[a+2],_=r[a+3];if(u!==_||l!==f||c!==d||h!==g){let b=l*f+c*d+h*g+u*_;b<0&&(f=-f,d=-d,g=-g,_=-_,b=-b);let p=1-o;if(b<.9995){let x=Math.acos(b),M=Math.sin(x);p=Math.sin(p*x)/M,o=Math.sin(o*x)/M,l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+_*o}else{l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+_*o;let x=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=x,c*=x,h*=x,u*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],f=r[a+1],d=r[a+2],g=r[a+3];return e[t]=o*g+h*u+l*d-c*f,e[t+1]=l*g+h*f+c*u-o*d,e[t+2]=c*g+h*d+o*f-l*u,e[t+3]=h*g-o*u-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),f=l(n/2),d=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:ze("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>u){let d=2*Math.sqrt(1+n-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>u){let d=2*Math.sqrt(1+o-n-u);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(dt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Eu=class Eu{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=dt(this.x,e.x,t.x),this.y=dt(this.y,e.y,t.y),this.z=dt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=dt(this.x,e,t),this.y=dt(this.y,e,t),this.z=dt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(dt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return rh.copy(this).projectOnVector(e),this.sub(rh)}reflect(e){return this.sub(rh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Eu.prototype.isVector3=!0;var B=Eu,rh=new B,Qd=new Xt,Au=class Au{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],g=n[8],_=s[0],b=s[3],p=s[6],x=s[1],M=s[4],y=s[7],A=s[2],w=s[5],m=s[8];return r[0]=a*_+o*x+l*A,r[3]=a*b+o*M+l*w,r[6]=a*p+o*y+l*m,r[1]=c*_+h*x+u*A,r[4]=c*b+h*M+u*w,r[7]=c*p+h*y+u*m,r[2]=f*_+d*x+g*A,r[5]=f*b+d*M+g*w,r[8]=f*p+d*y+g*m,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,d=c*r-a*l,g=t*u+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(s*c-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=f*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=d*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return As("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ah.makeScale(e,t)),this}rotate(e){return As("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ah.makeRotation(-e)),this}translate(e,t){return As("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ah.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Au.prototype.isMatrix3=!0;var tt=Au,ah=new tt,ef=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tf=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function N0(){let i={enabled:!0,workingColorSpace:_n,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===St&&(s.r=Di(s.r),s.g=Di(s.g),s.b=Di(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===St&&(s.r=ur(s.r),s.g=ur(s.g),s.b=ur(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vn?ba:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[_n]:{primaries:e,whitePoint:n,transfer:ba,toXYZ:ef,fromXYZ:tf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Nt},outputColorSpaceConfig:{drawingBufferColorSpace:Nt}},[Nt]:{primaries:e,whitePoint:n,transfer:St,toXYZ:ef,fromXYZ:tf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Nt}}}),i}var mt=N0();function Di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ur(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Zs,fc=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Zs===void 0&&(Zs=mr("canvas")),Zs.width=e.width,Zs.height=e.height;let s=Zs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Zs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=mr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Di(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Di(t[n]/255)*255):t[n]=Di(t[n]);return{data:t,width:e.width,height:e.height}}else return ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},F0=0,br=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:F0++}),this.uuid=ri(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(oh(s[a].image)):r.push(oh(s[a]))}else r=oh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function oh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?fc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ze("Texture: Unable to serialize Texture."),{})}var U0=0,ch=new B,Vt=class i extends ei{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=rn,s=rn,r=Jt,a=Gn,o=Hn,l=En,c=i.DEFAULT_ANISOTROPY,h=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:U0++}),this.uuid=ri(),this.name="",this.source=new br(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ch).x}get height(){return this.source.getSize(ch).y}get depth(){return this.source.getSize(ch).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ze(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==iu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zn:e.x=e.x-Math.floor(e.x);break;case rn:e.x=e.x<0?0:1;break;case fr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zn:e.y=e.y-Math.floor(e.y);break;case rn:e.y=e.y<0?0:1;break;case fr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=iu;Vt.DEFAULT_ANISOTROPY=1;var Ru=class Ru{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],_=l[2],b=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-b)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+b)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,y=(d+1)/2,A=(p+1)/2,w=(h+f)/4,m=(u+_)/4,v=(g+b)/4;return M>y&&M>A?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=w/n,r=m/n):y>A?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=v/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=m/r,s=v/r),this.set(n,s,r,t),this}let x=Math.sqrt((b-g)*(b-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(b-g)/x,this.y=(u-_)/x,this.z=(f-h)/x,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=dt(this.x,e.x,t.x),this.y=dt(this.y,e.y,t.y),this.z=dt(this.z,e.z,t.z),this.w=dt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=dt(this.x,e,t),this.y=dt(this.y,e,t),this.z=dt(this.z,e,t),this.w=dt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(dt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ru.prototype.isVector4=!0;var At=Ru,pc=class extends ei{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new Vt({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Jt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new br(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ln=class extends pc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},_a=class extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var mc=class extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var kc=class kc{constructor(e,t,n,s,r,a,o,l,c,h,u,f,d,g,_,b){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,f,d,g,_,b)}set(e,t,n,s,r,a,o,l,c,h,u,f,d,g,_,b){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=_,p[15]=b,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new kc().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/$s.setFromMatrixColumn(e,0).length(),r=1/$s.setFromMatrixColumn(e,1).length(),a=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=a*h,d=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){let f=l*h,d=l*u,g=c*h,_=c*u;t[0]=f+_*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){let f=l*h,d=l*u,g=c*h,_=c*u;t[0]=f-_*o,t[4]=-a*u,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*h,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let f=a*h,d=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=g*c-d,t[8]=f*c+_,t[1]=l*u,t[5]=_*c+f,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let f=a*l,d=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-f*u,t[8]=g*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*u+g,t[10]=f-_*u}else if(e.order==="XZY"){let f=a*l,d=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+_,t[5]=a*h,t[9]=d*u-g,t[2]=g*u-d,t[6]=o*h,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(O0,e,k0)}lookAt(e,t,n){let s=this.elements;return Pn.subVectors(e,t),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),$i.crossVectors(n,Pn),$i.lengthSq()===0&&(Math.abs(n.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),$i.crossVectors(n,Pn)),$i.normalize(),Io.crossVectors(Pn,$i),s[0]=$i.x,s[4]=Io.x,s[8]=Pn.x,s[1]=$i.y,s[5]=Io.y,s[9]=Pn.y,s[2]=$i.z,s[6]=Io.z,s[10]=Pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],g=n[2],_=n[6],b=n[10],p=n[14],x=n[3],M=n[7],y=n[11],A=n[15],w=s[0],m=s[4],v=s[8],F=s[12],L=s[1],U=s[5],H=s[9],J=s[13],k=s[2],T=s[6],I=s[10],C=s[14],V=s[3],G=s[7],W=s[11],K=s[15];return r[0]=a*w+o*L+l*k+c*V,r[4]=a*m+o*U+l*T+c*G,r[8]=a*v+o*H+l*I+c*W,r[12]=a*F+o*J+l*C+c*K,r[1]=h*w+u*L+f*k+d*V,r[5]=h*m+u*U+f*T+d*G,r[9]=h*v+u*H+f*I+d*W,r[13]=h*F+u*J+f*C+d*K,r[2]=g*w+_*L+b*k+p*V,r[6]=g*m+_*U+b*T+p*G,r[10]=g*v+_*H+b*I+p*W,r[14]=g*F+_*J+b*C+p*K,r[3]=x*w+M*L+y*k+A*V,r[7]=x*m+M*U+y*T+A*G,r[11]=x*v+M*H+y*I+A*W,r[15]=x*F+M*J+y*C+A*K,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],d=e[14],g=e[3],_=e[7],b=e[11],p=e[15],x=l*d-c*f,M=o*d-c*u,y=o*f-l*u,A=a*d-c*h,w=a*f-l*h,m=a*u-o*h;return t*(_*x-b*M+p*y)-n*(g*x-b*A+p*w)+s*(g*M-_*A+p*m)-r*(g*y-_*w+b*m)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],d=e[11],g=e[12],_=e[13],b=e[14],p=e[15],x=t*o-n*a,M=t*l-s*a,y=t*c-r*a,A=n*l-s*o,w=n*c-r*o,m=s*c-r*l,v=h*_-u*g,F=h*b-f*g,L=h*p-d*g,U=u*b-f*_,H=u*p-d*_,J=f*p-d*b,k=x*J-M*H+y*U+A*L-w*F+m*v;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/k;return e[0]=(o*J-l*H+c*U)*T,e[1]=(s*H-n*J-r*U)*T,e[2]=(_*m-b*w+p*A)*T,e[3]=(f*w-u*m-d*A)*T,e[4]=(l*L-a*J-c*F)*T,e[5]=(t*J-s*L+r*F)*T,e[6]=(b*y-g*m-p*M)*T,e[7]=(h*m-f*y+d*M)*T,e[8]=(a*H-o*L+c*v)*T,e[9]=(n*L-t*H-r*v)*T,e[10]=(g*w-_*y+p*x)*T,e[11]=(u*y-h*w-d*x)*T,e[12]=(o*F-a*U-l*v)*T,e[13]=(t*U-n*F+s*v)*T,e[14]=(_*M-g*A-b*x)*T,e[15]=(h*A-u*M+f*x)*T,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,d=r*h,g=r*u,_=a*h,b=a*u,p=o*u,x=l*c,M=l*h,y=l*u,A=n.x,w=n.y,m=n.z;return s[0]=(1-(_+p))*A,s[1]=(d+y)*A,s[2]=(g-M)*A,s[3]=0,s[4]=(d-y)*w,s[5]=(1-(f+p))*w,s[6]=(b+x)*w,s[7]=0,s[8]=(g+M)*m,s[9]=(b-x)*m,s[10]=(1-(f+_))*m,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=$s.set(s[0],s[1],s[2]).length(),o=$s.set(s[4],s[5],s[6]).length(),l=$s.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Yn.copy(this);let c=1/a,h=1/o,u=1/l;return Yn.elements[0]*=c,Yn.elements[1]*=c,Yn.elements[2]*=c,Yn.elements[4]*=h,Yn.elements[5]*=h,Yn.elements[6]*=h,Yn.elements[8]*=u,Yn.elements[9]*=u,Yn.elements[10]*=u,t.setFromRotationMatrix(Yn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Bn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s),g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===Bn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===pr)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Bn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),d=-(n+s)/(n-s),g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===Bn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===pr)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};kc.prototype.isMatrix4=!0;var et=kc,$s=new B,Yn=new et,O0=new B(0,0,0),k0=new B(1,1,1),$i=new B,Io=new B,Pn=new B,nf=new et,sf=new Xt,ti=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-dt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(dt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-dt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(dt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-dt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return nf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(nf,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sf.setFromEuler(this),this.setFromQuaternion(sf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ti.DEFAULT_ORDER="XYZ";var ya=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},B0=0,rf=new B,Qs=new Xt,Ai=new et,Lo=new B,na=new B,z0=new B,G0=new Xt,af=new B(1,0,0),of=new B(0,1,0),cf=new B(0,0,1),lf={type:"added"},H0={type:"removed"},er={type:"childadded",child:null},lh={type:"childremoved",child:null},Ft=class i extends ei{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:B0++}),this.uuid=ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new B,t=new ti,n=new Xt,s=new B(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new et},normalMatrix:{value:new tt}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ya,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qs.setFromAxisAngle(e,t),this.quaternion.multiply(Qs),this}rotateOnWorldAxis(e,t){return Qs.setFromAxisAngle(e,t),this.quaternion.premultiply(Qs),this}rotateX(e){return this.rotateOnAxis(af,e)}rotateY(e){return this.rotateOnAxis(of,e)}rotateZ(e){return this.rotateOnAxis(cf,e)}translateOnAxis(e,t){return rf.copy(e).applyQuaternion(this.quaternion),this.position.add(rf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(af,e)}translateY(e){return this.translateOnAxis(of,e)}translateZ(e){return this.translateOnAxis(cf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Lo.copy(e):Lo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(na,Lo,this.up):Ai.lookAt(Lo,na,this.up),this.quaternion.setFromRotationMatrix(Ai),s&&(Ai.extractRotation(s.matrixWorld),Qs.setFromRotationMatrix(Ai),this.quaternion.premultiply(Qs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(lf),er.child=e,this.dispatchEvent(er),er.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(H0),lh.child=e,this.dispatchEvent(lh),lh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(lf),er.child=e,this.dispatchEvent(er),er.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,z0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,G0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ft.DEFAULT_UP=new B(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Et=class extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}},V0={type:"move"},xr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let b=t.getJointPose(_,n),p=this._getHandJoint(c,_);b!==null&&(p.matrix.fromArray(b.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=b.radius),p.visible=b!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(V0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Et;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qi={h:0,s:0,l:0},Do={h:0,s:0,l:0};function hh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Xe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,mt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=mt.workingColorSpace){return this.r=e,this.g=t,this.b=n,mt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=mt.workingColorSpace){if(e=gu(e,1),t=dt(t,0,1),n=dt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=hh(a,r,e+1/3),this.g=hh(a,r,e),this.b=hh(a,r,e-1/3)}return mt.colorSpaceToWorking(this,s),this}setStyle(e,t=Nt){function n(r){r!==void 0&&parseFloat(r)<1&&ze("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ze("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Nt){let n=Pp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}copyLinearToSRGB(e){return this.r=ur(e.r),this.g=ur(e.g),this.b=ur(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Nt){return mt.workingToColorSpace(fn.copy(this),e),Math.round(dt(fn.r*255,0,255))*65536+Math.round(dt(fn.g*255,0,255))*256+Math.round(dt(fn.b*255,0,255))}getHexString(e=Nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=mt.workingColorSpace){mt.workingToColorSpace(fn.copy(this),t);let n=fn.r,s=fn.g,r=fn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=mt.workingColorSpace){return mt.workingToColorSpace(fn.copy(this),t),e.r=fn.r,e.g=fn.g,e.b=fn.b,e}getStyle(e=Nt){mt.workingToColorSpace(fn.copy(this),e);let t=fn.r,n=fn.g,s=fn.b;return e!==Nt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Qi),this.setHSL(Qi.h+e,Qi.s+t,Qi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Qi),e.getHSL(Do);let n=fa(Qi.h,Do.h,t),s=fa(Qi.s,Do.s,t),r=fa(Qi.l,Do.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fn=new Xe;Xe.NAMES=Pp;var va=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Xe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ma=class extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ti,this.environmentIntensity=1,this.environmentRotation=new ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Zn=new B,Ri=new B,uh=new B,Ci=new B,tr=new B,nr=new B,hf=new B,dh=new B,fh=new B,ph=new B,mh=new At,gh=new At,bh=new At,ss=class i{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Zn.subVectors(e,t),s.cross(Zn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Zn.subVectors(s,t),Ri.subVectors(n,t),uh.subVectors(e,t);let a=Zn.dot(Zn),o=Zn.dot(Ri),l=Zn.dot(uh),c=Ri.dot(Ri),h=Ri.dot(uh),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ci)===null?!1:Ci.x>=0&&Ci.y>=0&&Ci.x+Ci.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Ci)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ci.x),l.addScaledVector(a,Ci.y),l.addScaledVector(o,Ci.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return mh.setScalar(0),gh.setScalar(0),bh.setScalar(0),mh.fromBufferAttribute(e,t),gh.fromBufferAttribute(e,n),bh.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(mh,r.x),a.addScaledVector(gh,r.y),a.addScaledVector(bh,r.z),a}static isFrontFacing(e,t,n,s){return Zn.subVectors(n,t),Ri.subVectors(e,t),Zn.cross(Ri).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zn.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),Zn.cross(Ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;tr.subVectors(s,n),nr.subVectors(r,n),dh.subVectors(e,n);let l=tr.dot(dh),c=nr.dot(dh);if(l<=0&&c<=0)return t.copy(n);fh.subVectors(e,s);let h=tr.dot(fh),u=nr.dot(fh);if(h>=0&&u<=h)return t.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(n).addScaledVector(tr,a);ph.subVectors(e,r);let d=tr.dot(ph),g=nr.dot(ph);if(g>=0&&d<=g)return t.copy(r);let _=d*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(nr,o);let b=h*g-d*u;if(b<=0&&u-h>=0&&d-g>=0)return hf.subVectors(r,s),o=(u-h)/(u-h+(d-g)),t.copy(s).addScaledVector(hf,o);let p=1/(b+_+f);return a=_*p,o=f*p,t.copy(n).addScaledVector(tr,a).addScaledVector(nr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Dn=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint($n.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint($n.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=$n.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,$n):$n.fromBufferAttribute(r,a),$n.applyMatrix4(e.matrixWorld),this.expandByPoint($n);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),No.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),No.copy(n.boundingBox)),No.applyMatrix4(e.matrixWorld),this.union(No)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$n),$n.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ia),Fo.subVectors(this.max,ia),ir.subVectors(e.a,ia),sr.subVectors(e.b,ia),rr.subVectors(e.c,ia),es.subVectors(sr,ir),ts.subVectors(rr,sr),vs.subVectors(ir,rr);let t=[0,-es.z,es.y,0,-ts.z,ts.y,0,-vs.z,vs.y,es.z,0,-es.x,ts.z,0,-ts.x,vs.z,0,-vs.x,-es.y,es.x,0,-ts.y,ts.x,0,-vs.y,vs.x,0];return!xh(t,ir,sr,rr,Fo)||(t=[1,0,0,0,1,0,0,0,1],!xh(t,ir,sr,rr,Fo))?!1:(Uo.crossVectors(es,ts),t=[Uo.x,Uo.y,Uo.z],xh(t,ir,sr,rr,Fo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$n).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($n).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Pi=[new B,new B,new B,new B,new B,new B,new B,new B],$n=new B,No=new Dn,ir=new B,sr=new B,rr=new B,es=new B,ts=new B,vs=new B,ia=new B,Fo=new B,Uo=new B,Ms=new B;function xh(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ms.fromArray(i,r);let o=s.x*Math.abs(Ms.x)+s.y*Math.abs(Ms.y)+s.z*Math.abs(Ms.z),l=e.dot(Ms),c=t.dot(Ms),h=n.dot(Ms);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var qt=new B,Oo=new le,W0=0,an=class extends ei{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:W0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=pu,this.updateRanges=[],this.gpuType=Fn,this.version=0,this._normalizationScale=e!==void 0?Al(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Oo.fromBufferAttribute(this,t),Oo.applyMatrix3(e),this.setXY(t,Oo.x,Oo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):xu(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):_u(e,this.array)}};var Sa=class extends an{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var wa=class extends an{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ht=class extends an{constructor(e,t,n){super(new Float32Array(e),t,n)}},q0=new Dn,sa=new B,_h=new B,Mn=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):q0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;sa.subVectors(e,this.center);let t=sa.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(sa,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_h.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(sa.copy(e.center).add(_h)),this.expandByPoint(sa.copy(e.center).sub(_h))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},X0=0,kn=new et,yh=new Ft,ar=new B,In=new Dn,ra=new Dn,nn=new B,Dt=class i extends ei{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:X0++}),this.uuid=ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(b0(e)?wa:Sa)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new tt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return kn.makeRotationFromQuaternion(e),this.applyMatrix4(kn),this}rotateX(e){return kn.makeRotationX(e),this.applyMatrix4(kn),this}rotateY(e){return kn.makeRotationY(e),this.applyMatrix4(kn),this}rotateZ(e){return kn.makeRotationZ(e),this.applyMatrix4(kn),this}translate(e,t,n){return kn.makeTranslation(e,t,n),this.applyMatrix4(kn),this}scale(e,t,n){return kn.makeScale(e,t,n),this.applyMatrix4(kn),this}lookAt(e){return yh.lookAt(e),yh.updateMatrix(),this.applyMatrix4(yh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ar).negate(),this.translate(ar.x,ar.y,ar.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ht(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];In.setFromBufferAttribute(r),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let n=this.boundingSphere.center;if(In.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];ra.setFromBufferAttribute(o),this.morphTargetsRelative?(nn.addVectors(In.min,ra.min),In.expandByPoint(nn),nn.addVectors(In.max,ra.max),In.expandByPoint(nn)):(In.expandByPoint(ra.min),In.expandByPoint(ra.max))}In.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)nn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(nn));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)nn.fromBufferAttribute(o,c),l&&(ar.fromBufferAttribute(e,c),nn.add(ar)),s=Math.max(s,n.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new an(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[],c=new Uint8Array(n.count);for(let F=0;F<n.count;F++)o[F]=new B,l[F]=new B;let h=new B,u=new B,f=new B,d=new le,g=new le,_=new le,b=new B,p=new B;function x(F,L,U){c[F]=c[L]=c[U]=1,h.fromBufferAttribute(n,F),u.fromBufferAttribute(n,L),f.fromBufferAttribute(n,U),d.fromBufferAttribute(r,F),g.fromBufferAttribute(r,L),_.fromBufferAttribute(r,U),u.sub(h),f.sub(h),g.sub(d),_.sub(d);let H=1/(g.x*_.y-_.x*g.y);isFinite(H)&&(b.copy(u).multiplyScalar(_.y).addScaledVector(f,-g.y).multiplyScalar(H),p.copy(f).multiplyScalar(g.x).addScaledVector(u,-_.x).multiplyScalar(H),o[F].add(b),o[L].add(b),o[U].add(b),l[F].add(p),l[L].add(p),l[U].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let F=0,L=M.length;F<L;++F){let U=M[F],H=U.start,J=U.count;for(let k=H,T=H+J;k<T;k+=3)x(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let y=new B,A=new B,w=new B,m=new B;function v(F){w.fromBufferAttribute(s,F),m.copy(w);let L=o[F];y.copy(L),y.sub(w.multiplyScalar(w.dot(L))).normalize(),A.crossVectors(m,L);let H=A.dot(l[F])<0?-1:1;a.setXYZW(F,y.x,y.y,y.z,H)}for(let F=0,L=n.count;F<L;++F)c[F]&&v(F);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new an(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let s=new B,r=new B,a=new B,o=new B,l=new B,c=new B,h=new B,u=new B;if(e)for(let f=0,d=e.count;f<d;f+=3){let g=e.getX(f+0),_=e.getX(f+1),b=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,b),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,b),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(b,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)nn.fromBufferAttribute(e,t),nn.normalize(),e.setXYZ(t,nn.x,nn.y,nn.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h),d=0,g=0;for(let _=0,b=l.length;_<b;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new an(f,h,u)}if(this.index===null)return ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=e(f,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},_r=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=pu,this.updateRanges=[],this.version=0,this.uuid=ri()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=uf(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=uf(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function uf(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=ri()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var xn=new B,yr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?Al(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyMatrix4(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyNormalMatrix(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.transformDirection(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){xa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new an(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){xa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):xu(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):_u(e,this.data.array)}},vh=new B,j0=new B,K0=new tt,Qn=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=vh.subVectors(n,t).cross(j0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(vh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||K0.getNormalMatrix(e),s=this.coplanarPoint(vh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},J0=0,Sn=class extends ei{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:J0++}),this.uuid=ri(),this.name="",this.type="Material",this.blending=Lr,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kh,this.blendDst=Jh,this.blendEquation=Gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=dr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rc,this.stencilZFail=rc,this.stencilZPass=rc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){ze(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Xe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Qn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new le().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new le().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Ii=new B,Mh=new B,ko=new B,Bo=new B,Is=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ii)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ii.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ii.copy(this.origin).addScaledVector(this.direction,t),Ii.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Mh.copy(e).add(t).multiplyScalar(.5),ko.copy(t).sub(e).normalize(),Bo.copy(this.origin).sub(Mh);let r=e.distanceTo(t)*.5,a=-this.direction.dot(ko),o=Bo.dot(this.direction),l=-Bo.dot(ko),c=Bo.lengthSq(),h=Math.abs(1-a*a),u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let _=1/h;u*=_,f*=_,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Mh).addScaledVector(ko,f),d}intersectSphere(e,t){if(e.radius<0)return null;Ii.subVectors(e.center,this.origin);let n=Ii.dot(this.direction),s=Ii.dot(Ii)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ii)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,f=e.y-a.y,d=e.z-a.z,g=t.x-a.x,_=t.y-a.y,b=t.z-a.z,p=n.x-a.x,x=n.y-a.y,M=n.z-a.z,y=Math.abs(l),A=Math.abs(c),w=Math.abs(h),m,v,F,L,U,H,J,k,T,I,C,V;if(y>=A&&y>=w?(F=l,H=u,T=g,V=p,l>=0?(m=c,v=h,L=f,U=d,J=_,k=b,I=x,C=M):(m=h,v=c,L=d,U=f,J=b,k=_,I=M,C=x)):A>=w?(F=c,H=f,T=_,V=x,c>=0?(m=h,v=l,L=d,U=u,J=b,k=g,I=M,C=p):(m=l,v=h,L=u,U=d,J=g,k=b,I=p,C=M)):(F=h,H=d,T=b,V=M,h>=0?(m=l,v=c,L=u,U=f,J=g,k=_,I=p,C=x):(m=c,v=l,L=f,U=u,J=_,k=g,I=x,C=p)),F===0)return null;let G=m/F,W=v/F,K=1/F,ce=L-G*H,We=U-W*H,Q=J-G*T,be=k-W*T,Ce=I-G*V,je=C-W*V,Ee=Ce*be-je*Q,Ke=ce*je-We*Ce,Pt=Q*We-be*ce;if(s){if(Ee<0||Ke<0||Pt<0)return null}else if((Ee<0||Ke<0||Pt<0)&&(Ee>0||Ke>0||Pt>0))return null;let Ye=Ee+Ke+Pt;if(Ye===0)return null;let ot=K*(Ee*H+Ke*T+Pt*V);return(Ye>0?ot<0:ot>0)?null:this.at(ot/Ye,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},bt=class extends Sn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.combine=Yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},df=new et,Ss=new Is,zo=new Mn,ff=new B,Go=new B,Ho=new B,Vo=new B,Sh=new B,Wo=new B,pf=new B,qo=new B,Ut=class extends Ft{constructor(e=new Dt,t=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Wo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(Sh.fromBufferAttribute(u,e),a?Wo.addScaledVector(Sh,h):Wo.addScaledVector(Sh.sub(t),h))}t.add(Wo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zo.copy(n.boundingSphere),zo.applyMatrix4(r),Ss.copy(e.ray).recast(e.near),!(zo.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(zo,ff)===null||Ss.origin.distanceToSquared(ff)>(e.far-e.near)**2))&&(df.copy(r).invert(),Ss.copy(e.ray).applyMatrix4(df),!(n.boundingBox!==null&&Ss.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ss)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){let b=f[g],p=a[b.materialIndex],x=Math.max(b.start,d.start),M=Math.min(o.count,Math.min(b.start+b.count,d.start+d.count));for(let y=x,A=M;y<A;y+=3){let w=o.getX(y),m=o.getX(y+1),v=o.getX(y+2);s=Xo(this,p,e,n,c,h,u,w,m,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=b.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let b=g,p=_;b<p;b+=3){let x=o.getX(b),M=o.getX(b+1),y=o.getX(b+2);s=Xo(this,a,e,n,c,h,u,x,M,y),s&&(s.faceIndex=Math.floor(b/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){let b=f[g],p=a[b.materialIndex],x=Math.max(b.start,d.start),M=Math.min(l.count,Math.min(b.start+b.count,d.start+d.count));for(let y=x,A=M;y<A;y+=3){let w=y,m=y+1,v=y+2;s=Xo(this,p,e,n,c,h,u,w,m,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=b.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let b=g,p=_;b<p;b+=3){let x=b,M=b+1,y=b+2;s=Xo(this,a,e,n,c,h,u,x,M,y),s&&(s.faceIndex=Math.floor(b/3),t.push(s))}}}};function Y0(i,e,t,n,s,r,a,o){let l;if(e.side===on?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===xi,o),l===null)return null;qo.copy(o),qo.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(qo);return c<t.near||c>t.far?null:{distance:c,point:qo.clone(),object:i}}function Xo(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Go),i.getVertexPosition(l,Ho),i.getVertexPosition(c,Vo);let h=Y0(i,e,t,n,Go,Ho,Vo,pf);if(h){let u=new B;ss.getBarycoord(pf,Go,Ho,Vo,u),s&&(h.uv=ss.getInterpolatedAttribute(s,o,l,c,u,new le)),r&&(h.uv1=ss.getInterpolatedAttribute(r,o,l,c,u,new le)),a&&(h.normal=ss.getInterpolatedAttribute(a,o,l,c,u,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a:o,b:l,c,normal:new B,materialIndex:0};ss.getNormal(Go,Ho,Vo,f.normal),h.face=f,h.barycoord=u}return h}var aa=new At,mf=new At,gf=new At,Z0=new At,bf=new et,jo=new B,wh=new Mn,xf=new et,Th=new Is,Ta=class extends Ut{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Lh,this.bindMatrix=new et,this.bindMatrixInverse=new et,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Dn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,jo),this.boundingBox.expandByPoint(jo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Mn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,jo),this.boundingSphere.expandByPoint(jo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wh.copy(this.boundingSphere),wh.applyMatrix4(s),e.ray.intersectsSphere(wh)!==!1&&(xf.copy(s).invert(),Th.copy(e.ray).applyMatrix4(xf),!(this.boundingBox!==null&&Th.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Th)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new At,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Lh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===fp?this.bindMatrixInverse.copy(this.bindMatrix).invert():ze("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;mf.fromBufferAttribute(s.attributes.skinIndex,e),gf.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(aa.copy(t),t.set(0,0,0,0)):(aa.set(t.x,t.y,t.z,1),t.set(0,0,0)),aa.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=gf.getComponent(r);if(a!==0){let o=mf.getComponent(r);bf.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Z0.copy(aa).applyMatrix4(bf),a)}}return t.isVector4&&(t.w=aa.w),t.applyMatrix4(this.bindMatrixInverse)}},vr=class extends Ft{constructor(){super(),this.isBone=!0,this.type="Bone"}},Mr=class extends Vt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Ht,h=Ht,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},_f=new et,$0=new et,Ea=class i{constructor(e=[],t=[]){this.uuid=ri(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ze("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new et)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new et;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:$0;_f.multiplyMatrices(o,t[r]),_f.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Mr(t,e,e,Hn,Fn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(ze("Skeleton: No bone found with UUID:",r),a=new vr),this.bones.push(a),this.boneInverses.push(new et().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},Fi=class extends an{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},or=new et,yf=new et,Ko=[],vf=new Dn,Q0=new et,oa=new Ut,ca=new Mn,Aa=class extends Ut{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Fi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Q0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Dn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),vf.copy(e.boundingBox).applyMatrix4(or),this.boundingBox.union(vf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,or),ca.copy(e.boundingSphere).applyMatrix4(or),this.boundingSphere.union(ca)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(oa.geometry=this.geometry,oa.material=this.material,oa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ca.copy(this.boundingSphere),ca.applyMatrix4(n),e.ray.intersectsSphere(ca)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,or),yf.multiplyMatrices(n,or),oa.matrixWorld=yf,oa.raycast(e,Ko);for(let a=0,o=Ko.length;a<o;a++){let l=Ko[a];l.instanceId=r,l.object=this,t.push(l)}Ko.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Fi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Mr(new Float32Array(s*this.count),s,this.count,qc,Fn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ws=new Mn,eg=new le(.5,.5),Jo=new B,rs=class{constructor(e=new Qn,t=new Qn,n=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],_=r[9],b=r[10],p=r[11],x=r[12],M=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-a,d-h,p-g,A-x).normalize(),s[1].setComponents(c+a,d+h,p+g,A+x).normalize(),s[2].setComponents(c+o,d+u,p+_,A+M).normalize(),s[3].setComponents(c-o,d-u,p-_,A-M).normalize(),n)s[4].setComponents(l,f,b,y).normalize(),s[5].setComponents(c-l,d-f,p-b,A-y).normalize();else if(s[4].setComponents(c-l,d-f,p-b,A-y).normalize(),t===Bn)s[5].setComponents(c+l,d+f,p+b,A+y).normalize();else if(t===pr)s[5].setComponents(l,f,b,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ws.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(e){ws.center.set(0,0,0);let t=eg.distanceTo(e.center);return ws.radius=.7071067811865476+t,ws.applyMatrix4(e.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Jo.x=s.normal.x>0?e.max.x:e.min.x,Jo.y=s.normal.y>0?e.max.y:e.min.y,Jo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Jo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Mf=new et,gc=class i{constructor(){this.coordinateSystem=Bn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];Mf.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new rs),n[s].setFromProjectionMatrix(Mf,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new rs),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var as=class extends Sn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},bc=new B,xc=new B,Sf=new et,la=new Is,Yo=new Mn,Eh=new B,wf=new B,Ui=class extends Ft{constructor(e=new Dt,t=new as){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)bc.fromBufferAttribute(t,s-1),xc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=bc.distanceTo(xc);e.setAttribute("lineDistance",new ht(n,1))}else ze("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Yo.copy(n.boundingSphere),Yo.applyMatrix4(s),Yo.radius+=r,e.ray.intersectsSphere(Yo)===!1)return;Sf.copy(s).invert(),la.copy(e.ray).applyMatrix4(Sf);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=d,b=g-1;_<b;_+=c){let p=h.getX(_),x=h.getX(_+1),M=Zo(this,e,la,l,p,x,_);M&&t.push(M)}if(this.isLineLoop){let _=h.getX(g-1),b=h.getX(d),p=Zo(this,e,la,l,_,b,g-1);p&&t.push(p)}}else{let d=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=d,b=g-1;_<b;_+=c){let p=Zo(this,e,la,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=Zo(this,e,la,l,g-1,d,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Zo(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(bc.fromBufferAttribute(o,s),xc.fromBufferAttribute(o,r),t.distanceSqToSegment(bc,xc,Eh,wf)>n)return;Eh.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Eh);if(!(c<e.near||c>e.far))return{distance:c,point:wf.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Tf=new B,Ef=new B,Ra=class extends Ui{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Tf.fromBufferAttribute(t,s),Ef.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Tf.distanceTo(Ef);e.setAttribute("lineDistance",new ht(n,1))}else ze("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ca=class extends Ui{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Sr=class extends Sn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Af=new et,Nh=new Is,$o=new Mn,Qo=new B,Pa=class extends Ft{constructor(e=new Dt,t=new Sr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$o.copy(n.boundingSphere),$o.applyMatrix4(s),$o.radius+=r,e.ray.intersectsSphere($o)===!1)return;Af.copy(s).invert(),Nh.copy(e.ray).applyMatrix4(Af);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=f,_=d;g<_;g++){let b=c.getX(g);Qo.fromBufferAttribute(u,b),Rf(Qo,b,l,s,e,t,this)}}else{let f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let g=f,_=d;g<_;g++)Qo.fromBufferAttribute(u,g),Rf(Qo,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Rf(i,e,t,n,s,r,a){let o=Nh.distanceSqToPoint(i);if(o<t){let l=new B;Nh.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Ia=class extends Vt{constructor(e=[],t=Hs,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ls=class extends Vt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Oi=class extends Vt{constructor(e,t,n=ii,s,r,a,o=Ht,l=Ht,c,h=Ni,u=1){if(h!==Ni&&h!==Wi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new br(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},La=class extends Oi{constructor(e,t=ii,n=Hs,s,r,a=Ht,o=Ht,l,c=Ni){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Da=class extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},wt=class i extends Dt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(u,2));function g(_,b,p,x,M,y,A,w,m,v,F){let L=y/m,U=A/v,H=y/2,J=A/2,k=w/2,T=m+1,I=v+1,C=0,V=0,G=new B;for(let W=0;W<I;W++){let K=W*U-J;for(let ce=0;ce<T;ce++){let We=ce*L-H;G[_]=We*x,G[b]=K*M,G[p]=k,c.push(G.x,G.y,G.z),G[_]=0,G[b]=0,G[p]=w>0?1:-1,h.push(G.x,G.y,G.z),u.push(ce/m),u.push(1-W/v),C+=1}}for(let W=0;W<v;W++)for(let K=0;K<m;K++){let ce=f+K+T*W,We=f+K+T*(W+1),Q=f+(K+1)+T*(W+1),be=f+(K+1)+T*W;l.push(ce,We,be),l.push(We,Q,be),V+=6}o.addGroup(d,V,F),d+=V,f+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var rt=class i extends Dt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,_=[],b=n/2,p=0;x(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new ht(u,3)),this.setAttribute("normal",new ht(f,3)),this.setAttribute("uv",new ht(d,2));function x(){let y=new B,A=new B,w=0,m=(t-e)/n;for(let v=0;v<=r;v++){let F=[],L=v/r,U=L*(t-e)+e;for(let H=0;H<=s;H++){let J=H/s,k=J*l+o,T=Math.sin(k),I=Math.cos(k);A.x=U*T,A.y=-L*n+b,A.z=U*I,u.push(A.x,A.y,A.z),y.set(T,m,I).normalize(),f.push(y.x,y.y,y.z),d.push(J,1-L),F.push(g++)}_.push(F)}for(let v=0;v<s;v++)for(let F=0;F<r;F++){let L=_[F][v],U=_[F+1][v],H=_[F+1][v+1],J=_[F][v+1];(e>0||F!==0)&&(h.push(L,U,J),w+=3),(t>0||F!==r-1)&&(h.push(U,H,J),w+=3)}c.addGroup(p,w,0),p+=w}function M(y){let A=g,w=new le,m=new B,v=0,F=y===!0?e:t,L=y===!0?1:-1;for(let H=1;H<=s;H++)u.push(0,b*L,0),f.push(0,L,0),d.push(.5,.5),g++;let U=g;for(let H=0;H<=s;H++){let k=H/s*l+o,T=Math.cos(k),I=Math.sin(k);m.x=F*I,m.y=b*L,m.z=F*T,u.push(m.x,m.y,m.z),f.push(0,L,0),w.x=T*.5+.5,w.y=I*.5*L+.5,d.push(w.x,w.y),g++}for(let H=0;H<s;H++){let J=A+H,k=U+H;y===!0?h.push(k,k+1,J):h.push(k+1,k,J),v+=3}c.addGroup(p,v,y===!0?1:2),p+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},os=class i extends rt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},_c=class i extends Dt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new ht(r,3)),this.setAttribute("normal",new ht(r.slice(),3)),this.setAttribute("uv",new ht(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let M=new B,y=new B,A=new B;for(let w=0;w<t.length;w+=3)d(t[w+0],M),d(t[w+1],y),d(t[w+2],A),l(M,y,A,x)}function l(x,M,y,A){let w=A+1,m=[];for(let v=0;v<=w;v++){m[v]=[];let F=x.clone().lerp(y,v/w),L=M.clone().lerp(y,v/w),U=w-v;for(let H=0;H<=U;H++)H===0&&v===w?m[v][H]=F:m[v][H]=F.clone().lerp(L,H/U)}for(let v=0;v<w;v++)for(let F=0;F<2*(w-v)-1;F++){let L=Math.floor(F/2);F%2===0?(f(m[v][L+1]),f(m[v+1][L]),f(m[v][L])):(f(m[v][L+1]),f(m[v+1][L+1]),f(m[v+1][L]))}}function c(x){let M=new B;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(x),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function h(){let x=new B;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];let y=b(x)/2/Math.PI+.5,A=p(x)/Math.PI+.5;a.push(y,1-A)}g(),u()}function u(){for(let x=0;x<a.length;x+=6){let M=a[x+0],y=a[x+2],A=a[x+4],w=Math.max(M,y,A),m=Math.min(M,y,A);w>.9&&m<.1&&(M<.2&&(a[x+0]+=1),y<.2&&(a[x+2]+=1),A<.2&&(a[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function d(x,M){let y=x*3;M.x=e[y+0],M.y=e[y+1],M.z=e[y+2]}function g(){let x=new B,M=new B,y=new B,A=new B,w=new le,m=new le,v=new le;for(let F=0,L=0;F<r.length;F+=9,L+=6){x.set(r[F+0],r[F+1],r[F+2]),M.set(r[F+3],r[F+4],r[F+5]),y.set(r[F+6],r[F+7],r[F+8]),w.set(a[L+0],a[L+1]),m.set(a[L+2],a[L+3]),v.set(a[L+4],a[L+5]),A.copy(x).add(M).add(y).divideScalar(3);let U=b(A);_(w,L+0,x,U),_(m,L+2,M,U),_(v,L+4,y,U)}}function _(x,M,y,A){A<0&&x.x===1&&(a[M]=x.x-1),y.x===0&&y.z===0&&(a[M]=A/2/Math.PI+.5)}function b(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var Nn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ze("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],f=n[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new le:new B);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new B,s=[],r=[],a=[],o=new B,l=new et;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new B)}r[0]=new B,a[0]=new B;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(dt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(dt(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},wr=class extends Nn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},yc=class extends wr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function yu(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Cf=new B,Pf=new B,Ah=new yu,Rh=new yu,Ch=new yu,vc=class extends Nn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new B){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Pf.subVectors(s[0],s[1]).add(s[0]),c=Pf);let u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Cf.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Cf),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),b=Math.pow(f.distanceToSquared(h),d);_<1e-4&&(_=1),g<1e-4&&(g=_),b<1e-4&&(b=_),Ah.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,_,b),Rh.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,_,b),Ch.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,_,b)}else this.curveType==="catmullrom"&&(Ah.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Rh.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Ch.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(Ah.calc(l),Rh.calc(l),Ch.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new B().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function If(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function tg(i,e){let t=1-i;return t*t*e}function ng(i,e){return 2*(1-i)*i*e}function ig(i,e){return i*i*e}function pa(i,e,t,n){return tg(i,e)+ng(i,t)+ig(i,n)}function sg(i,e){let t=1-i;return t*t*t*e}function rg(i,e){let t=1-i;return 3*t*t*i*e}function ag(i,e){return 3*(1-i)*i*i*e}function og(i,e){return i*i*i*e}function ma(i,e,t,n,s){return sg(i,e)+rg(i,t)+ag(i,n)+og(i,s)}var Na=class extends Nn{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ma(e,s.x,r.x,a.x,o.x),ma(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Mc=class extends Nn{constructor(e=new B,t=new B,n=new B,s=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new B){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ma(e,s.x,r.x,a.x,o.x),ma(e,s.y,r.y,a.y,o.y),ma(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Fa=class extends Nn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Sc=class extends Nn{constructor(e=new B,t=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ua=class extends Nn{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(pa(e,s.x,r.x,a.x),pa(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},wc=class extends Nn{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(pa(e,s.x,r.x,a.x),pa(e,s.y,r.y,a.y),pa(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oa=class extends Nn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(If(o,l.x,c.x,h.x,u.x),If(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},Fh=Object.freeze({__proto__:null,ArcCurve:yc,CatmullRomCurve3:vc,CubicBezierCurve:Na,CubicBezierCurve3:Mc,EllipseCurve:wr,LineCurve:Fa,LineCurve3:Sc,QuadraticBezierCurve:Ua,QuadraticBezierCurve3:wc,SplineCurve:Oa}),Tc=class extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Fh[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},ka=class extends Tc{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Fa(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ua(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new Na(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Oa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new wr(e,t,n,s,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ni=class extends ka{constructor(e){super(e),this.uuid=ri(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ka().fromJSON(s))}return this}};function cg(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Ip(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=fg(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,u=l;for(let f=t;f<s;f+=t){let d=i[f],g=i[f+1];d<o&&(o=d),g<l&&(l=g),d>h&&(h=d),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Ba(r,a,t,o,l,c,0),a}function Ip(i,e,t,n,s){let r;if(s===wg(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Lf(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Lf(a/n|0,i[a],i[a+1],r);return r&&Tr(r,r.next)&&(Ga(r),r=r.next),r}function Ds(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Tr(t,t.next)||Bt(t.prev,t,t.next)===0)){if(Ga(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ba(i,e,t,n,s,r,a){if(!i)return;!a&&r&&xg(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?hg(i,n,s,r):lg(i)){e.push(l.i,i.i,c.i),Ga(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=ug(Ds(i),e),Ba(i,e,t,n,s,r,2)):a===2&&dg(i,e,t,n,s,r):Ba(Ds(i),e,t,n,s,r,1);break}}}function lg(i){let e=i.prev,t=i,n=i.next;if(Bt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),u=Math.min(o,l,c),f=Math.max(s,r,a),d=Math.max(o,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&ha(s,o,r,l,a,c,g.x,g.y)&&Bt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function hg(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Bt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,l,c),g=Math.min(h,u,f),_=Math.max(o,l,c),b=Math.max(h,u,f),p=Uh(d,g,e,t,n),x=Uh(_,b,e,t,n),M=i.prevZ,y=i.nextZ;for(;M&&M.z>=p&&y&&y.z<=x;){if(M.x>=d&&M.x<=_&&M.y>=g&&M.y<=b&&M!==s&&M!==a&&ha(o,h,l,u,c,f,M.x,M.y)&&Bt(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=d&&y.x<=_&&y.y>=g&&y.y<=b&&y!==s&&y!==a&&ha(o,h,l,u,c,f,y.x,y.y)&&Bt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=p;){if(M.x>=d&&M.x<=_&&M.y>=g&&M.y<=b&&M!==s&&M!==a&&ha(o,h,l,u,c,f,M.x,M.y)&&Bt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=x;){if(y.x>=d&&y.x<=_&&y.y>=g&&y.y<=b&&y!==s&&y!==a&&ha(o,h,l,u,c,f,y.x,y.y)&&Bt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function ug(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Tr(n,s)&&Dp(n,t,t.next,s)&&za(n,s)&&za(s,n)&&(e.push(n.i,t.i,s.i),Ga(t),Ga(t.next),t=i=s),t=t.next}while(t!==i);return Ds(t)}function dg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&vg(a,o)){let l=Np(a,o);a=Ds(a,a.next),l=Ds(l,l.next),Ba(a,e,t,n,s,r,0),Ba(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function fg(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Ip(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(yg(c))}s.sort(pg);for(let r=0;r<s.length;r++)t=mg(s[r],t);return t}function pg(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function mg(i,e){let t=gg(i,e);if(!t)return e;let n=Np(t,i);return Ds(n,n.next),Ds(t,t.next)}function gg(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(Tr(i,t))return t;do{if(Tr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Lp(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);za(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&bg(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function bg(i,e){return Bt(i.prev,i,e.prev)<0&&Bt(e.next,i,i.next)<0}function xg(i,e,t,n){let s=i;do s.z===0&&(s.z=Uh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,_g(s)}function _g(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Uh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function yg(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Lp(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function ha(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Lp(i,e,t,n,s,r,a,o)}function vg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Mg(i,e)&&(za(i,e)&&za(e,i)&&Sg(i,e)&&(Bt(i.prev,i,e.prev)||Bt(i,e.prev,e))||Tr(i,e)&&Bt(i.prev,i,i.next)>0&&Bt(e.prev,e,e.next)>0)}function Bt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Tr(i,e){return i.x===e.x&&i.y===e.y}function Dp(i,e,t,n){let s=tc(Bt(i,e,t)),r=tc(Bt(i,e,n)),a=tc(Bt(t,n,i)),o=tc(Bt(t,n,e));return!!(s!==r&&a!==o||s===0&&ec(i,t,e)||r===0&&ec(i,n,e)||a===0&&ec(t,i,n)||o===0&&ec(t,e,n))}function ec(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function tc(i){return i>0?1:i<0?-1:0}function Mg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Dp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function za(i,e){return Bt(i.prev,i,i.next)<0?Bt(i,e,i.next)>=0&&Bt(i,i.prev,e)>=0:Bt(i,e,i.prev)<0||Bt(i,i.next,e)<0}function Sg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Np(i,e){let t=Oh(i.i,i.x,i.y),n=Oh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Lf(i,e,t,n){let s=Oh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ga(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Oh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function wg(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var kh=class{static triangulate(e,t,n=2){return cg(e,t,n)}},ui=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Df(e),Nf(n,e);let a=e.length;t.forEach(Df);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Nf(n,t[l]);let o=kh.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Df(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Nf(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Ns=class i extends Dt{constructor(e=new ni([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new ht(s,3)),this.setAttribute("uv",new ht(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,b=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Tg,M,y=!1,A,w,m,v;if(p){M=p.getSpacedPoints(h),y=!0,f=!1;let se=p.isCatmullRomCurve3?p.closed:!1;A=p.computeFrenetFrames(h,se),w=new B,m=new B,v=new B}f||(b=0,d=0,g=0,_=0);let F=o.extractPoints(c),L=F.shape,U=F.holes;if(!ui.isClockWise(L)){L=L.reverse();for(let se=0,pe=U.length;se<pe;se++){let fe=U[se];ui.isClockWise(fe)&&(U[se]=fe.reverse())}}function J(se){let fe=10000000000000001e-36,Pe=se[0];for(let Se=1;Se<=se.length;Se++){let nt=Se%se.length,Le=se[nt],N=Le.x-Pe.x,Z=Le.y-Pe.y,ae=N*N+Z*Z,D=Math.max(Math.abs(Le.x),Math.abs(Le.y),Math.abs(Pe.x),Math.abs(Pe.y)),He=fe*D*D;if(ae<=He){se.splice(nt,1),Se--;continue}Pe=Le}}J(L),U.forEach(J);let k=U.length,T=L;for(let se=0;se<k;se++){let pe=U[se];L=L.concat(pe)}function I(se,pe,fe){return pe||$e("ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(pe,fe)}let C=L.length;function V(se,pe,fe){let Pe,Se,nt,Le=se.x-pe.x,N=se.y-pe.y,Z=fe.x-se.x,ae=fe.y-se.y,D=Le*Le+N*N,He=Le*ae-N*Z;if(Math.abs(He)>Number.EPSILON){let Fe=Math.sqrt(D),pt=Math.sqrt(Z*Z+ae*ae),me=pe.x-N/Fe,Gt=pe.y+Le/Fe,Ze=fe.x-ae/pt,Qe=fe.y+Z/pt,R=((Ze-me)*ae-(Qe-Gt)*Z)/(Le*ae-N*Z);Pe=me+Le*R-se.x,Se=Gt+N*R-se.y;let S=Pe*Pe+Se*Se;if(S<=2)return new le(Pe,Se);nt=Math.sqrt(S/2)}else{let Fe=!1;Le>Number.EPSILON?Z>Number.EPSILON&&(Fe=!0):Le<-Number.EPSILON?Z<-Number.EPSILON&&(Fe=!0):Math.sign(N)===Math.sign(ae)&&(Fe=!0),Fe?(Pe=-N,Se=Le,nt=Math.sqrt(D)):(Pe=Le,Se=N,nt=Math.sqrt(D/2))}return new le(Pe/nt,Se/nt)}let G=[];for(let se=0,pe=T.length,fe=pe-1,Pe=se+1;se<pe;se++,fe++,Pe++)fe===pe&&(fe=0),Pe===pe&&(Pe=0),G[se]=V(T[se],T[fe],T[Pe]);let W=[],K,ce=G.concat();for(let se=0,pe=k;se<pe;se++){let fe=U[se];K=[];for(let Pe=0,Se=fe.length,nt=Se-1,Le=Pe+1;Pe<Se;Pe++,nt++,Le++)nt===Se&&(nt=0),Le===Se&&(Le=0),K[Pe]=V(fe[Pe],fe[nt],fe[Le]);W.push(K),ce=ce.concat(K)}let We;if(b===0)We=ui.triangulateShape(T,U);else{let se=[],pe=[];for(let fe=0;fe<b;fe++){let Pe=fe/b,Se=d*Math.cos(Pe*Math.PI/2),nt=g*Math.sin(Pe*Math.PI/2)+_;for(let Le=0,N=T.length;Le<N;Le++){let Z=I(T[Le],G[Le],nt);Ke(Z.x,Z.y,-Se),Pe===0&&se.push(Z)}for(let Le=0,N=k;Le<N;Le++){let Z=U[Le];K=W[Le];let ae=[];for(let D=0,He=Z.length;D<He;D++){let Fe=I(Z[D],K[D],nt);Ke(Fe.x,Fe.y,-Se),Pe===0&&ae.push(Fe)}Pe===0&&pe.push(ae)}}We=ui.triangulateShape(se,pe)}let Q=We.length,be=g+_;for(let se=0;se<C;se++){let pe=f?I(L[se],ce[se],be):L[se];y?(m.copy(A.normals[0]).multiplyScalar(pe.x),w.copy(A.binormals[0]).multiplyScalar(pe.y),v.copy(M[0]).add(m).add(w),Ke(v.x,v.y,v.z)):Ke(pe.x,pe.y,0)}for(let se=1;se<=h;se++)for(let pe=0;pe<C;pe++){let fe=f?I(L[pe],ce[pe],be):L[pe];y?(m.copy(A.normals[se]).multiplyScalar(fe.x),w.copy(A.binormals[se]).multiplyScalar(fe.y),v.copy(M[se]).add(m).add(w),Ke(v.x,v.y,v.z)):Ke(fe.x,fe.y,u/h*se)}for(let se=b-1;se>=0;se--){let pe=se/b,fe=d*Math.cos(pe*Math.PI/2),Pe=g*Math.sin(pe*Math.PI/2)+_;for(let Se=0,nt=T.length;Se<nt;Se++){let Le=I(T[Se],G[Se],Pe);Ke(Le.x,Le.y,u+fe)}for(let Se=0,nt=U.length;Se<nt;Se++){let Le=U[Se];K=W[Se];for(let N=0,Z=Le.length;N<Z;N++){let ae=I(Le[N],K[N],Pe);y?Ke(ae.x,ae.y+M[h-1].y,M[h-1].x+fe):Ke(ae.x,ae.y,u+fe)}}}Ce(),je();function Ce(){let se=s.length/3;if(f){let pe=0,fe=C*pe;for(let Pe=0;Pe<Q;Pe++){let Se=We[Pe];Pt(Se[2]+fe,Se[1]+fe,Se[0]+fe)}pe=h+b*2,fe=C*pe;for(let Pe=0;Pe<Q;Pe++){let Se=We[Pe];Pt(Se[0]+fe,Se[1]+fe,Se[2]+fe)}}else{for(let pe=0;pe<Q;pe++){let fe=We[pe];Pt(fe[2],fe[1],fe[0])}for(let pe=0;pe<Q;pe++){let fe=We[pe];Pt(fe[0]+C*h,fe[1]+C*h,fe[2]+C*h)}}n.addGroup(se,s.length/3-se,0)}function je(){let se=s.length/3,pe=0;Ee(T,pe),pe+=T.length;for(let fe=0,Pe=U.length;fe<Pe;fe++){let Se=U[fe];Ee(Se,pe),pe+=Se.length}n.addGroup(se,s.length/3-se,1)}function Ee(se,pe){let fe=se.length;for(;--fe>=0;){let Pe=fe,Se=fe-1;Se<0&&(Se=se.length-1);for(let nt=0,Le=h+b*2;nt<Le;nt++){let N=C*nt,Z=C*(nt+1),ae=pe+Pe+N,D=pe+Se+N,He=pe+Se+Z,Fe=pe+Pe+Z;Ye(ae,D,He,Fe)}}}function Ke(se,pe,fe){l.push(se),l.push(pe),l.push(fe)}function Pt(se,pe,fe){ot(se),ot(pe),ot(fe);let Pe=s.length/3,Se=x.generateTopUV(n,s,Pe-3,Pe-2,Pe-1);ct(Se[0]),ct(Se[1]),ct(Se[2])}function Ye(se,pe,fe,Pe){ot(se),ot(pe),ot(Pe),ot(pe),ot(fe),ot(Pe);let Se=s.length/3,nt=x.generateSideWallUV(n,s,Se-6,Se-3,Se-2,Se-1);ct(nt[0]),ct(nt[1]),ct(nt[3]),ct(nt[1]),ct(nt[2]),ct(nt[3])}function ot(se){s.push(l[se*3+0]),s.push(l[se*3+1]),s.push(l[se*3+2])}function ct(se){r.push(se.x),r.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Eg(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Fh[s.type]().fromJSON(s)),new i(n,e.options)}},Tg={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new le(r,a),new le(o,l),new le(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],f=e[s*3],d=e[s*3+1],g=e[s*3+2],_=e[r*3],b=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new le(a,1-l),new le(c,1-u),new le(f,1-g),new le(_,1-p)]:[new le(o,1-l),new le(h,1-u),new le(d,1-g),new le(b,1-p)]}};function Eg(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var fi=class i extends Dt{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=dt(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],h=1/t,u=new B,f=new le,d=new B,g=new B,_=new B,b=0,p=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:b=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,d.x=p*1,d.y=-b,d.z=p*0,_.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:_.normalize(),l.push(_.x,_.y,_.z);break;default:b=e[x+1].x-e[x].x,p=e[x+1].y-e[x].y,d.x=p*1,d.y=-b,d.z=p*0,g.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),l.push(d.x,d.y,d.z),_.copy(g)}for(let x=0;x<=t;x++){let M=n+x*h*s,y=Math.sin(M),A=Math.cos(M);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*y,u.y=e[w].y,u.z=e[w].x*A,a.push(u.x,u.y,u.z),f.x=x/t,f.y=w/(e.length-1),o.push(f.x,f.y);let m=l[3*w+0]*y,v=l[3*w+1],F=l[3*w+0]*A;c.push(m,v,F)}}for(let x=0;x<t;x++)for(let M=0;M<e.length-1;M++){let y=M+x*e.length,A=y,w=y+e.length,m=y+e.length+1,v=y+1;r.push(A,w,v),r.push(m,v,w)}this.setIndex(r),this.setAttribute("position",new ht(a,3)),this.setAttribute("uv",new ht(o,2)),this.setAttribute("normal",new ht(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Ha=class i extends _c{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},yt=class i extends Dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,d=[],g=[],_=[],b=[];for(let p=0;p<h;p++){let x=p*f-a;for(let M=0;M<c;M++){let y=M*u-r;g.push(y,-x,0),_.push(0,0,1),b.push(M/o),b.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){let M=x+c*p,y=x+c*(p+1),A=x+1+c*(p+1),w=x+1+c*p;d.push(M,y,w),d.push(y,A,w)}this.setIndex(d),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(_,3)),this.setAttribute("uv",new ht(b,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},cs=class i extends Dt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],h=[],u=e,f=(t-e)/s,d=new B,g=new le;for(let _=0;_<=s;_++){for(let b=0;b<=n;b++){let p=r+b/n*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/t+1)/2,g.y=(d.y/t+1)/2,h.push(g.x,g.y)}u+=f}for(let _=0;_<s;_++){let b=_*(n+1);for(let p=0;p<n;p++){let x=p+b,M=x,y=x+n+1,A=x+n+2,w=x+1;o.push(M,y,w),o.push(y,A,w)}}this.setIndex(o),this.setAttribute("position",new ht(l,3)),this.setAttribute("normal",new ht(c,3)),this.setAttribute("uv",new ht(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Er=class i extends Dt{constructor(e=new ni([new le(0,.5),new le(-.5,-.5),new le(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ht(s,3)),this.setAttribute("normal",new ht(r,3)),this.setAttribute("uv",new ht(a,2));function c(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,g=f.holes;ui.isClockWise(d)===!1&&(d=d.reverse());for(let b=0,p=g.length;b<p;b++){let x=g[b];ui.isClockWise(x)===!0&&(g[b]=x.reverse())}let _=ui.triangulateShape(d,g);for(let b=0,p=g.length;b<p;b++){let x=g[b];d=d.concat(x)}for(let b=0,p=d.length;b<p;b++){let x=d[b];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let b=0,p=_.length;b<p;b++){let x=_[b],M=x[0]+u,y=x[1]+u,A=x[2]+u;n.push(M,y,A),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Ag(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Ag(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var wn=class i extends Dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new B,f=new B,d=[],g=[],_=[],b=[];for(let p=0;p<=n;p++){let x=[],M=p/n,y=a+M*o,A=e*Math.cos(y),w=Math.sqrt(e*e-A*A),m=0;p===0&&a===0?m=.5/t:p===n&&l===Math.PI&&(m=-.5/t);for(let v=0;v<=t;v++){let F=v/t,L=s+F*r;u.x=-w*Math.cos(L),u.y=A,u.z=w*Math.sin(L),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),b.push(F+m,1-M),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){let M=h[p][x+1],y=h[p][x],A=h[p+1][x],w=h[p+1][x+1];(p!==0||a>0)&&d.push(M,y,w),(p!==n-1||l<Math.PI)&&d.push(y,A,w)}this.setIndex(d),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(_,3)),this.setAttribute("uv",new ht(b,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var pi=class i extends Dt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],u=[],f=new B,d=new B,g=new B;for(let _=0;_<=n;_++){let b=a+_/n*o;for(let p=0;p<=s;p++){let x=p/s*r;d.x=(e+t*Math.cos(b))*Math.cos(x),d.y=(e+t*Math.cos(b))*Math.sin(x),d.z=t*Math.sin(b),c.push(d.x,d.y,d.z),f.x=e*Math.cos(x),f.y=e*Math.sin(x),g.subVectors(d,f).normalize(),h.push(g.x,g.y,g.z),u.push(p/s),u.push(_/n)}}for(let _=1;_<=n;_++)for(let b=1;b<=s;b++){let p=(s+1)*_+b-1,x=(s+1)*(_-1)+b-1,M=(s+1)*(_-1)+b,y=(s+1)*_+b;l.push(p,x,y),l.push(x,M,y)}this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function qs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Ff(s))s.isRenderTargetTexture?(ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Ff(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function pn(i){let e={};for(let t=0;t<i.length;t++){let n=qs(i[t]);for(let s in n)e[s]=n[s]}return e}function Ff(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Rg(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function vu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:mt.workingColorSpace}var Fp={clone:qs,merge:pn},Cg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,mi=class extends Sn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cg,this.fragmentShader=Pg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qs(e.uniforms),this.uniformsGroups=Rg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Xe().setHex(s.value);break;case"v2":this.uniforms[n].value=new le().fromArray(s.value);break;case"v3":this.uniforms[n].value=new B().fromArray(s.value);break;case"v4":this.uniforms[n].value=new At().fromArray(s.value);break;case"m3":this.uniforms[n].value=new tt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new et().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ec=class extends mi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ke=class extends Sn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=El,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},yn=class extends ke{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new le(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return dt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Xe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Xe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Xe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return As('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){As('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ac=class extends Sn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Rc=class extends Sn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function is(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ua(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function Ig(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Uf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function Lg(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var gi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break t}a=t.length;break n}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Cc=class extends gi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ts,endingEnd:Ts}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Es:r=e,o=2*t-n;break;case ga:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Es:a=e,l=2*n-t;break;case ga:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(n-t)/(s-t),_=g*g,b=_*g,p=-f*b+2*f*_-f*g,x=(1+f)*b+(-1.5-2*f)*_+(-.5+f)*g+1,M=(-1-d)*b+(1.5+d)*_+.5*g,y=d*b-d*_;for(let A=0;A!==o;++A)r[A]=p*a[h+A]+x*a[c+A]+M*a[l+A]+y*a[u+A];return r}},Va=class extends gi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[c+f]*u+a[l+f]*h;return r}},Pc=class extends gi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Ic=class extends gi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let g=(n-t)/(s-t),_=1-g;for(let b=0;b!==o;++b)r[b]=a[c+b]*_+a[l+b]*g;return r}let f=o*2,d=e-1;for(let g=0;g!==o;++g){let _=a[c+g],b=a[l+g],p=d*f+g*2,x=u[p],M=u[p+1],y=e*f+g*2,A=h[y],w=h[y+1],m=Ng(n,t,x,A,s);r[g]=Up(m,_,M,w,b)}return r}};function Up(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Dg(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function Ng(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Up(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Dg(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var Tn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=is(t,this.TimeBufferType),this.values=is(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:is(e.times,Array),values:is(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),ua(e.settings)&&(n.settings={inTangents:is(e.settings.inTangents,Array),outTangents:is(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Pc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Cc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ic(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Rs:t=this.InterpolantFactoryMethodDiscrete;break;case Cs:t=this.InterpolantFactoryMethodLinear;break;case sc:t=this.InterpolantFactoryMethodSmooth;break;case Dh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ze("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Rs;case this.InterpolantFactoryMethodLinear:return Cs;case this.InterpolantFactoryMethodSmooth:return sc;case this.InterpolantFactoryMethodBezier:return Dh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;ua(this.settings)&&(Of(this.settings.inTangents,e),Of(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;ua(this.settings)&&(kf(this.settings.inTangents,e),kf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&($e("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&($e("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){$e("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){$e("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&x0(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){$e("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===sc,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,f=u-n,d=u+n;for(let g=0;g!==n;++g){let _=t[u+g];if(_!==t[f+g]||_!==t[d+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,ua(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Of(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function kf(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Tn.prototype.ValueTypeName="";Tn.prototype.TimeBufferType=Float32Array;Tn.prototype.ValueBufferType=Float32Array;Tn.prototype.DefaultInterpolation=Cs;var ki=class extends Tn{constructor(e,t,n){super(e,t,n)}};ki.prototype.ValueTypeName="bool";ki.prototype.ValueBufferType=Array;ki.prototype.DefaultInterpolation=Rs;ki.prototype.InterpolantFactoryMethodLinear=void 0;ki.prototype.InterpolantFactoryMethodSmooth=void 0;var Wa=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}};Wa.prototype.ValueTypeName="color";var Bi=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}};Bi.prototype.ValueTypeName="number";var Lc=class extends gi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Xt.slerpFlat(r,0,a,c-o,a,c,l);return r}},zi=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Lc(this.times,this.values,this.getValueSize(),e)}};zi.prototype.ValueTypeName="quaternion";zi.prototype.InterpolantFactoryMethodSmooth=void 0;var Gi=class extends Tn{constructor(e,t,n){super(e,t,n)}};Gi.prototype.ValueTypeName="string";Gi.prototype.ValueBufferType=Array;Gi.prototype.DefaultInterpolation=Rs;Gi.prototype.InterpolantFactoryMethodLinear=void 0;Gi.prototype.InterpolantFactoryMethodSmooth=void 0;var ls=class extends Tn{constructor(e,t,n,s){super(e,t,n,s)}};ls.prototype.ValueTypeName="vector";var Fs=class{constructor(e="",t=-1,n=[],s=Tl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=ri(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Ug(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Tn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=Ig(l);l=Uf(l,1,h),c=Uf(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Bi(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let u=h[1],f=s[u];f||(s[u]=f=[]),f.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Fg(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Bi;case"vector":case"vector2":case"vector3":case"vector4":return ls;case"color":return Wa;case"quaternion":return zi;case"bool":case"boolean":return ki;case"string":return Gi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Ug(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Fg(i.type);if(i.times===void 0){let n=[],s=[];Lg(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),ua(i.settings)&&(t.settings={inTangents:is(i.settings.inTangents,Float32Array),outTangents:is(i.settings.outTangents,Float32Array)}),t}var di={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Bf(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Bf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Bf(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Dc=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Op=new Dc,bi=class{constructor(e){this.manager=e!==void 0?e:Op,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};bi.DEFAULT_MATERIAL_NAME="__DEFAULT";var Li={},Bh=class extends Error{constructor(e,t){super(e),this.response=t}},Ar=class extends bi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=di.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Li[e]!==void 0){Li[e].push({onLoad:t,onProgress:n,onError:s});return}Li[e]=[],Li[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ze("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Li[e],u=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=f?parseInt(f):0,g=d!==0,_=0,b=new ReadableStream({start(p){x();function x(){u.read().then(({done:M,value:y})=>{if(M)p.close();else{_+=y.byteLength;let A=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:d});for(let w=0,m=h.length;w<m;w++){let v=h[w];v.onProgress&&v.onProgress(A)}p.enqueue(y),x()}},M=>{p.error(M)})}}});return new Response(b)}else throw new Bh(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{di.add(`file:${e}`,c);let h=Li[e];delete Li[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{let h=Li[e];if(h===void 0)throw this.manager.itemError(e),c;delete Li[e];for(let u=0,f=h.length;u<f;u++){let d=h[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var cr=new WeakMap,Nc=class extends bi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=di.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=cr.get(a);u===void 0&&(u=[],cr.set(a,u)),u.push({onLoad:t,onError:s})}return a}let o=mr("img");function l(){h(),t&&t(this);let u=cr.get(this)||[];for(let f=0;f<u.length;f++){let d=u[f];d.onLoad&&d.onLoad(this)}cr.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),di.remove(`image:${e}`);let f=cr.get(this)||[];for(let d=0;d<f.length;d++){let g=f[d];g.onError&&g.onError(u)}cr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),di.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}};var Us=class extends bi{constructor(e){super(e)}load(e,t,n,s){let r=new Vt,a=new Nc(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Os=class extends Ft{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},qa=class extends Os{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ph=new et,zf=new B,Gf=new B,Rr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rs,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;zf.setFromMatrixPosition(e.matrixWorld),t.position.copy(zf),Gf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Gf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Ph.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ph,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===pr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ph)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},nc=new B,ic=new Xt,hi=new B,Xa=class extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(nc,ic,hi),hi.x===1&&hi.y===1&&hi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nc,ic,hi.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(nc,ic,hi),hi.x===1&&hi.y===1&&hi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nc,ic,hi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ns=new B,Hf=new le,Vf=new le,Kt=class extends Xa{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(da*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ps*2*Math.atan(Math.tan(da*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,t){return this.getViewBounds(e,Hf,Vf),t.subVectors(Vf,Hf)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(da*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},zh=class extends Rr{constructor(){super(new Kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ps*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},ja=class extends Os{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new zh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Gh=class extends Rr{constructor(){super(new Kt(90,1,.5,500)),this.isPointLightShadow=!0}},Hi=class extends Os{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Gh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ks=class extends Xa{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Hh=class extends Rr{constructor(){super(new ks(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Bs=class extends Os{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new Hh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Vi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Ih=new WeakMap,Ka=class extends bi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ze("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ze("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=di.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Ih.has(a)===!0?(s&&s(Ih.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return di.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Ih.set(l,c),di.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});di.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var lr=-90,hr=1,Cr=class extends Ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Kt(lr,hr,e,t);s.layers=this.layers,this.add(s);let r=new Kt(lr,hr,e,t);r.layers=this.layers,this.add(r);let a=new Kt(lr,hr,e,t);a.layers=this.layers,this.add(a);let o=new Kt(lr,hr,e,t);o.layers=this.layers,this.add(o);let l=new Kt(lr,hr,e,t);l.layers=this.layers,this.add(l);let c=new Kt(lr,hr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let b=!1;e.isWebGLRenderer===!0?b=e.state.buffers.depth.getReversed():b=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=_,e.setRenderTarget(n,5,s),b&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Fc=class extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}};var Uc=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,s=this.valueSize,r=e*s+s,a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=t}else{a+=t;let o=t/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let l=t*this._origIndex;this._mixBufferRegion(n,s,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,s);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,s=n*this._origIndex;e.getValue(t,s);for(let r=n,a=s;r!==a;++r)t[r]=t[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,s){Xt.slerpFlat(e,t,e,t,e,n,s)}_slerpAdditive(e,t,n,s,r){let a=this._workIndex*r;Xt.multiplyQuaternionsFlat(e,a,e,t,e,n),Xt.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,n,s,r){let a=1-s;for(let o=0;o!==r;++o){let l=t+o;e[l]=e[l]*a+e[n+o]*s}}_lerpAdditive(e,t,n,s,r){for(let a=0;a!==r;++a){let o=t+a;e[o]=e[o]+e[n+a]*s}}},Mu="\\[\\]\\.:\\/",Og=new RegExp("["+Mu+"]","g"),Su="[^"+Mu+"]",kg="[^"+Mu.replace("\\.","")+"]",Bg=/((?:WC+[\/:])*)/.source.replace("WC",Su),zg=/(WCOD+)?/.source.replace("WCOD",kg),Gg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Su),Hg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Su),Vg=new RegExp("^"+Bg+zg+Gg+Hg+"$"),Wg=["material","materials","bones","map"],Vh=class{constructor(e,t,n){let s=n||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ct=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Og,"")}static parseTrackName(e){let t=Vg.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Wg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ze("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){$e("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){$e("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){$e("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){$e("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){$e("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;$e("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=Vh;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Oc=class{constructor(e,t,n=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=s;let r=t.tracks,a=r.length,o=new Array(a),l={endingStart:Ts,endingEnd:Ts};for(let c=0;c!==a;++c){let h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=mp,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let s=this._mixer,r=s.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);let l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,s){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let a=this._updateTime(t),o=this._updateWeight(e);if(o>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case bp:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Tl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,s=this.time+e,r=this._loopCount,a=n===gp;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(n===pp){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){let o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);let l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,n){let s=this._interpolantSettings;n?(s.endingStart=Es,s.endingEnd=Es):(e?s.endingStart=this.zeroSlopeAtStart?Es:Ts:s.endingStart=ga,t?s.endingEnd=this.zeroSlopeAtEnd?Es:Ts:s.endingEnd=ga)}_scheduleFading(e,t,n){let s=this._mixer,r=s.time,a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}},qg=new Float32Array(1),Pr=class extends ei{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){let f=s[u],d=f.name,g=h[d];if(g!==void 0)++g.referenceCount,a[u]=g;else{if(g=a[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,d));continue}let _=t&&t._propertyBindings[u].binding.parsedPath;g=new Uc(Ct.create(n,d,_),f.ValueTypeName,f.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,d),a[u]=g}o[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,n)}let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let s=this._actions,r=this._actionsByClip,a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{let o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],s=e._cacheIndex;n._cacheIndex=s,t[s]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;let u=o.actionByRoot,f=(e._localRoot||this._root).uuid;delete u[f],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let s=this._bindingsByRootAndName,r=this._bindings,a=s[t];a===void 0&&(a={},s[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new Va(new Float32Array(2),new Float32Array(2),1,qg),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let s=t||this._root,r=s.uuid,a=typeof e=="string"?Fs.findByName(s,e):e,o=a!==null?a.uuid:e,l=this._actionsByClip[o],c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Tl),l!==void 0){let u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;let h=new Oc(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){let n=t||this._root,s=n.uuid,r=typeof e=="string"?Fs.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(s,e,r,a);let o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){let a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){let c=a[o];this._deactivateAction(c);let h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete s[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let a in n){let o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(let a in r){let o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Cu=class Cu{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Cu.prototype.isMatrix2=!0;var Wh=Cu;function wu(i,e,t,n){let s=Xg(n);switch(t){case cu:return i*e;case qc:return i*e/s.components*s.byteLength;case Xc:return i*e/s.components*s.byteLength;case hs:return i*e*2/s.components*s.byteLength;case jc:return i*e*2/s.components*s.byteLength;case lu:return i*e*3/s.components*s.byteLength;case Hn:return i*e*4/s.components*s.byteLength;case Kc:return i*e*4/s.components*s.byteLength;case Za:case $a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Qa:case eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Yc:case $c:return Math.max(i,16)*Math.max(e,8)/4;case Jc:case Zc:return Math.max(i,8)*Math.max(e,8)/2;case Qc:case el:case nl:case il:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case tl:case to:case sl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case al:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ol:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case cl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ll:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case hl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ul:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case dl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case fl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case pl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ml:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case gl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case bl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case xl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case _l:case yl:case vl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ml:case Sl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case no:case wl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xg(i){switch(i){case En:case su:return{byteLength:1,components:1};case Ur:case ru:case si:return{byteLength:2,components:1};case Vc:case Wc:return{byteLength:2,components:4};case ii:case Hc:case Fn:return{byteLength:4,components:1};case au:case ou:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function rm(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Kg(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){let g=u[f],_=u[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){let _=u[d];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Jg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yg=`#ifdef USE_ALPHAHASH
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
#endif`,Zg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$g=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,eb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tb=`#ifdef USE_AOMAP
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
#endif`,nb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ib=`#ifdef USE_BATCHING
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
#endif`,sb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ab=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ob=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,cb=`#ifdef USE_IRIDESCENCE
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
#endif`,lb=`#ifdef USE_BUMPMAP
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
#endif`,hb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ub=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,db=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,fb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,pb=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,mb=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,gb=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,bb=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,xb=`#define PI 3.141592653589793
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
} // validated`,_b=`vec3 transformedNormal = objectNormal;
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
#endif`,yb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vb=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wb="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Eb=`#ifdef USE_ENVMAP
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
#endif`,Ab=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Rb=`#ifdef USE_ENVMAP
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
#endif`,Cb=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pb=`#ifdef USE_ENVMAP
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
#endif`,Ib=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Db=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Nb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fb=`#ifdef USE_GRADIENTMAP
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
}`,Ub=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ob=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,kb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bb=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,zb=`#ifdef USE_ENVMAP
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
#endif`,Gb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qb=`PhysicalMaterial material;
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
#endif`,Xb=`uniform sampler2D dfgLUT;
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
}`,jb=`
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
#endif`,Kb=`#if defined( RE_IndirectDiffuse )
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
#endif`,Jb=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yb=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,Zb=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$b=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ex=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ix=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,sx=`#if defined( USE_POINTS_UV )
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
#endif`,rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ax=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ox=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cx=`#if defined( USE_MORPHCOLORS )
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
#endif`,lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hx=`#ifdef USE_MORPHTARGETS
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
#endif`,ux=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,fx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,bx=`#ifdef USE_NORMALMAP
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
#endif`,xx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_x=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,wx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ex=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ax=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Px=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ix=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Lx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Dx=`float getShadowMask() {
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
}`,Nx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fx=`#ifdef USE_SKINNING
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
#endif`,Ux=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ox=`#ifdef USE_SKINNING
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
#endif`,kx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hx=`#ifdef USE_TRANSMISSION
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
#endif`,Vx=`#ifdef USE_TRANSMISSION
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
#endif`,Wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Kx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jx=`uniform sampler2D t2D;
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
}`,Yx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zx=`uniform float backgroundBlurriness;
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
}`,$x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e_=`#include <common>
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
}`,t_=`#if DEPTH_PACKING == 3200
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
}`,n_=`#define DISTANCE
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
}`,i_=`#define DISTANCE
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
}`,s_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,r_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a_=`uniform float scale;
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
}`,o_=`uniform vec3 diffuse;
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
}`,c_=`#include <common>
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
}`,l_=`uniform vec3 diffuse;
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
}`,h_=`#define LAMBERT
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
}`,u_=`#define LAMBERT
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
}`,d_=`#define MATCAP
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
}`,f_=`#define MATCAP
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
}`,p_=`#define NORMAL
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
}`,m_=`#define NORMAL
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
}`,g_=`#define PHONG
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
}`,b_=`#define PHONG
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
}`,x_=`#define STANDARD
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
}`,__=`#define STANDARD
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
}`,y_=`#define TOON
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
}`,v_=`#define TOON
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
}`,M_=`uniform float size;
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
}`,S_=`uniform vec3 diffuse;
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
}`,w_=`#include <common>
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
}`,T_=`uniform vec3 color;
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
}`,E_=`uniform float rotation;
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
}`,A_=`uniform vec3 diffuse;
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
}`,ft={alphahash_fragment:Jg,alphahash_pars_fragment:Yg,alphamap_fragment:Zg,alphamap_pars_fragment:$g,alphatest_fragment:Qg,alphatest_pars_fragment:eb,aomap_fragment:tb,aomap_pars_fragment:nb,batching_pars_vertex:ib,batching_vertex:sb,begin_vertex:rb,beginnormal_vertex:ab,bsdfs:ob,iridescence_fragment:cb,bumpmap_pars_fragment:lb,clipping_planes_fragment:hb,clipping_planes_pars_fragment:ub,clipping_planes_pars_vertex:db,clipping_planes_vertex:fb,color_fragment:pb,color_pars_fragment:mb,color_pars_vertex:gb,color_vertex:bb,common:xb,defaultnormal_vertex:_b,displacementmap_pars_vertex:yb,displacementmap_vertex:vb,emissivemap_fragment:Mb,emissivemap_pars_fragment:Sb,colorspace_fragment:wb,colorspace_pars_fragment:Tb,envmap_fragment:Eb,envmap_common_pars_fragment:Ab,envmap_pars_fragment:Rb,envmap_pars_vertex:Cb,envmap_physical_pars_fragment:zb,envmap_vertex:Pb,fog_vertex:Ib,fog_pars_vertex:Lb,fog_fragment:Db,fog_pars_fragment:Nb,gradientmap_pars_fragment:Fb,lightmap_pars_fragment:Ub,lights_lambert_fragment:Ob,lights_lambert_pars_fragment:kb,lights_pars_begin:Bb,lights_toon_fragment:Gb,lights_toon_pars_fragment:Hb,lights_phong_fragment:Vb,lights_phong_pars_fragment:Wb,lights_physical_fragment:qb,lights_physical_pars_fragment:Xb,lights_fragment_begin:jb,lights_fragment_maps:Kb,lights_fragment_end:Jb,lightprobes_pars_fragment:Yb,logdepthbuf_fragment:Zb,logdepthbuf_pars_fragment:$b,logdepthbuf_pars_vertex:Qb,logdepthbuf_vertex:ex,map_fragment:tx,map_pars_fragment:nx,map_particle_fragment:ix,map_particle_pars_fragment:sx,metalnessmap_fragment:rx,metalnessmap_pars_fragment:ax,morphinstance_vertex:ox,morphcolor_vertex:cx,morphnormal_vertex:lx,morphtarget_pars_vertex:hx,morphtarget_vertex:ux,normal_fragment_begin:dx,normal_fragment_maps:fx,normal_pars_fragment:px,normal_pars_vertex:mx,normal_vertex:gx,normalmap_pars_fragment:bx,clearcoat_normal_fragment_begin:xx,clearcoat_normal_fragment_maps:_x,clearcoat_pars_fragment:yx,iridescence_pars_fragment:vx,opaque_fragment:Mx,packing:Sx,premultiplied_alpha_fragment:wx,project_vertex:Tx,dithering_fragment:Ex,dithering_pars_fragment:Ax,roughnessmap_fragment:Rx,roughnessmap_pars_fragment:Cx,shadowmap_pars_fragment:Px,shadowmap_pars_vertex:Ix,shadowmap_vertex:Lx,shadowmask_pars_fragment:Dx,skinbase_vertex:Nx,skinning_pars_vertex:Fx,skinning_vertex:Ux,skinnormal_vertex:Ox,specularmap_fragment:kx,specularmap_pars_fragment:Bx,tonemapping_fragment:zx,tonemapping_pars_fragment:Gx,transmission_fragment:Hx,transmission_pars_fragment:Vx,uv_pars_fragment:Wx,uv_pars_vertex:qx,uv_vertex:Xx,worldpos_vertex:jx,background_vert:Kx,background_frag:Jx,backgroundCube_vert:Yx,backgroundCube_frag:Zx,cube_vert:$x,cube_frag:Qx,depth_vert:e_,depth_frag:t_,distance_vert:n_,distance_frag:i_,equirect_vert:s_,equirect_frag:r_,linedashed_vert:a_,linedashed_frag:o_,meshbasic_vert:c_,meshbasic_frag:l_,meshlambert_vert:h_,meshlambert_frag:u_,meshmatcap_vert:d_,meshmatcap_frag:f_,meshnormal_vert:p_,meshnormal_frag:m_,meshphong_vert:g_,meshphong_frag:b_,meshphysical_vert:x_,meshphysical_frag:__,meshtoon_vert:y_,meshtoon_frag:v_,points_vert:M_,points_frag:S_,shadow_vert:w_,shadow_frag:T_,sprite_vert:E_,sprite_frag:A_},Re={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},vi={basic:{uniforms:pn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.fog]),vertexShader:ft.meshbasic_vert,fragmentShader:ft.meshbasic_frag},lambert:{uniforms:pn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,Re.lights,{emissive:{value:new Xe(0)},envMapIntensity:{value:1}}]),vertexShader:ft.meshlambert_vert,fragmentShader:ft.meshlambert_frag},phong:{uniforms:pn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,Re.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ft.meshphong_vert,fragmentShader:ft.meshphong_frag},standard:{uniforms:pn([Re.common,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.roughnessmap,Re.metalnessmap,Re.fog,Re.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ft.meshphysical_vert,fragmentShader:ft.meshphysical_frag},toon:{uniforms:pn([Re.common,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.gradientmap,Re.fog,Re.lights,{emissive:{value:new Xe(0)}}]),vertexShader:ft.meshtoon_vert,fragmentShader:ft.meshtoon_frag},matcap:{uniforms:pn([Re.common,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,{matcap:{value:null}}]),vertexShader:ft.meshmatcap_vert,fragmentShader:ft.meshmatcap_frag},points:{uniforms:pn([Re.points,Re.fog]),vertexShader:ft.points_vert,fragmentShader:ft.points_frag},dashed:{uniforms:pn([Re.common,Re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ft.linedashed_vert,fragmentShader:ft.linedashed_frag},depth:{uniforms:pn([Re.common,Re.displacementmap]),vertexShader:ft.depth_vert,fragmentShader:ft.depth_frag},normal:{uniforms:pn([Re.common,Re.bumpmap,Re.normalmap,Re.displacementmap,{opacity:{value:1}}]),vertexShader:ft.meshnormal_vert,fragmentShader:ft.meshnormal_frag},sprite:{uniforms:pn([Re.sprite,Re.fog]),vertexShader:ft.sprite_vert,fragmentShader:ft.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ft.background_vert,fragmentShader:ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:ft.backgroundCube_vert,fragmentShader:ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ft.cube_vert,fragmentShader:ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ft.equirect_vert,fragmentShader:ft.equirect_frag},distance:{uniforms:pn([Re.common,Re.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ft.distance_vert,fragmentShader:ft.distance_frag},shadow:{uniforms:pn([Re.lights,Re.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:ft.shadow_vert,fragmentShader:ft.shadow_frag}};vi.physical={uniforms:pn([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new tt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:ft.meshphysical_vert,fragmentShader:ft.meshphysical_frag};var Cl={r:0,b:0,g:0},R_=new et,am=new tt;am.set(-1,0,0,0,1,0,0,0,1);function C_(i,e,t,n,s,r){let a=new Xe(0),o=s===!0?0:1,l,c,h=null,u=0,f=null;function d(x){let M=x.isScene===!0?x.background:null;if(M&&M.isTexture){let y=x.backgroundBlurriness>0;M=e.get(M,y)}return M}function g(x){let M=!1,y=d(x);y===null?b(a,o):y&&y.isColor&&(b(y,1),M=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(x,M){let y=d(M);y&&y.isCubeTexture?(c===void 0&&(c=new Ut(new wt(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:qs(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,w,m){this.matrixWorld.copyPosition(m.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(R_.makeRotationFromEuler(M.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(am),c.material.toneMapped=mt.getTransfer(y.colorSpace)!==St,(h!==y||u!==y.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,f=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Ut(new yt(2,2),new mi({name:"BackgroundMaterial",uniforms:qs(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=mt.getTransfer(y.colorSpace)!==St,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,f=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function b(x,M){x.getRGB(Cl,vu(i)),t.buffers.color.setClear(Cl.r,Cl.g,Cl.b,M,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,M=1){a.set(x),o=M,b(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,b(a,o)},render:g,addToRenderList:_,dispose:p}}function P_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(U,H,J,k,T){let I=!1,C=u(U,k,J,H);r!==C&&(r=C,c(r.object)),I=d(U,k,J,T),I&&g(U,k,J,T),T!==null&&e.update(T,i.ELEMENT_ARRAY_BUFFER),(I||a)&&(a=!1,y(U,H,J,k),T!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(T).buffer))}function l(){return i.createVertexArray()}function c(U){return i.bindVertexArray(U)}function h(U){return i.deleteVertexArray(U)}function u(U,H,J,k){let T=k.wireframe===!0,I=n[H.id];I===void 0&&(I={},n[H.id]=I);let C=U.isInstancedMesh===!0?U.id:0,V=I[C];V===void 0&&(V={},I[C]=V);let G=V[J.id];G===void 0&&(G={},V[J.id]=G);let W=G[T];return W===void 0&&(W=f(l()),G[T]=W),W}function f(U){let H=[],J=[],k=[];for(let T=0;T<t;T++)H[T]=0,J[T]=0,k[T]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:H,enabledAttributes:J,attributeDivisors:k,object:U,attributes:{},index:null}}function d(U,H,J,k){let T=r.attributes,I=H.attributes,C=0,V=J.getAttributes();for(let G in V)if(V[G].location>=0){let K=T[G],ce=I[G];if(ce===void 0&&(G==="instanceMatrix"&&U.instanceMatrix&&(ce=U.instanceMatrix),G==="instanceColor"&&U.instanceColor&&(ce=U.instanceColor)),K===void 0||K.attribute!==ce||ce&&K.data!==ce.data)return!0;C++}return r.attributesNum!==C||r.index!==k}function g(U,H,J,k){let T={},I=H.attributes,C=0,V=J.getAttributes();for(let G in V)if(V[G].location>=0){let K=I[G];K===void 0&&(G==="instanceMatrix"&&U.instanceMatrix&&(K=U.instanceMatrix),G==="instanceColor"&&U.instanceColor&&(K=U.instanceColor));let ce={};ce.attribute=K,K&&K.data&&(ce.data=K.data),T[G]=ce,C++}r.attributes=T,r.attributesNum=C,r.index=k}function _(){let U=r.newAttributes;for(let H=0,J=U.length;H<J;H++)U[H]=0}function b(U){p(U,0)}function p(U,H){let J=r.newAttributes,k=r.enabledAttributes,T=r.attributeDivisors;J[U]=1,k[U]===0&&(i.enableVertexAttribArray(U),k[U]=1),T[U]!==H&&(i.vertexAttribDivisor(U,H),T[U]=H)}function x(){let U=r.newAttributes,H=r.enabledAttributes;for(let J=0,k=H.length;J<k;J++)H[J]!==U[J]&&(i.disableVertexAttribArray(J),H[J]=0)}function M(U,H,J,k,T,I,C){C===!0?i.vertexAttribIPointer(U,H,J,T,I):i.vertexAttribPointer(U,H,J,k,T,I)}function y(U,H,J,k){_();let T=k.attributes,I=J.getAttributes(),C=H.defaultAttributeValues;for(let V in I){let G=I[V];if(G.location>=0){let W=T[V];if(W===void 0&&(V==="instanceMatrix"&&U.instanceMatrix&&(W=U.instanceMatrix),V==="instanceColor"&&U.instanceColor&&(W=U.instanceColor)),W!==void 0){let K=W.normalized,ce=W.itemSize,We=e.get(W);if(We===void 0)continue;let Q=We.buffer,be=We.type,Ce=We.bytesPerElement,je=be===i.INT||be===i.UNSIGNED_INT||W.gpuType===Hc;if(W.isInterleavedBufferAttribute){let Ee=W.data,Ke=Ee.isInterleavedBuffer===!0?Ee.stride:Ee.itemSize,Pt=W.offset;if(Ee.isInstancedInterleavedBuffer||Ee.isInstancedBufferAttribute){for(let Ye=0;Ye<G.locationSize;Ye++)p(G.location+Ye,Ee.meshPerAttribute);U.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=Ee.meshPerAttribute*Ee.count)}else for(let Ye=0;Ye<G.locationSize;Ye++)b(G.location+Ye);i.bindBuffer(i.ARRAY_BUFFER,Q);for(let Ye=0;Ye<G.locationSize;Ye++)M(G.location+Ye,ce/G.locationSize,be,K,Ke*Ce,(Pt+ce/G.locationSize*Ye)*Ce,je)}else{if(W.isInstancedBufferAttribute){for(let Ee=0;Ee<G.locationSize;Ee++)p(G.location+Ee,W.meshPerAttribute);U.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let Ee=0;Ee<G.locationSize;Ee++)b(G.location+Ee);i.bindBuffer(i.ARRAY_BUFFER,Q);for(let Ee=0;Ee<G.locationSize;Ee++)M(G.location+Ee,ce/G.locationSize,be,K,ce*Ce,ce/G.locationSize*Ee*Ce,je)}}else if(C!==void 0){let K=C[V];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(G.location,K);break;case 3:i.vertexAttrib3fv(G.location,K);break;case 4:i.vertexAttrib4fv(G.location,K);break;default:i.vertexAttrib1fv(G.location,K)}}}}x()}function A(){F();for(let U in n){let H=n[U];for(let J in H){let k=H[J];for(let T in k){let I=k[T];for(let C in I)h(I[C].object),delete I[C];delete k[T]}}delete n[U]}}function w(U){if(n[U.id]===void 0)return;let H=n[U.id];for(let J in H){let k=H[J];for(let T in k){let I=k[T];for(let C in I)h(I[C].object),delete I[C];delete k[T]}}delete n[U.id]}function m(U){for(let H in n){let J=n[H];for(let k in J){let T=J[k];if(T[U.id]===void 0)continue;let I=T[U.id];for(let C in I)h(I[C].object),delete I[C];delete T[U.id]}}}function v(U){for(let H in n){let J=n[H],k=U.isInstancedMesh===!0?U.id:0,T=J[k];if(T!==void 0){for(let I in T){let C=T[I];for(let V in C)h(C[V].object),delete C[V];delete T[I]}delete J[k],Object.keys(J).length===0&&delete n[H]}}}function F(){L(),a=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:F,resetDefaultState:L,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfObject:v,releaseStatesOfProgram:m,initAttributes:_,enableAttribute:b,disableUnusedAttributes:x}}function I_(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let f=0;for(let d=0;d<h;d++)f+=c[d];t.update(f,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function L_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let m=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(m.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(m){return!(m!==Hn&&n.convert(m)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(m){let v=m===si&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(m!==En&&m!==Fn&&!v&&n.convert(m)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(m){if(m==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";m="mediump"}return m==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(ze("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&ze("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),b=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:b,maxAttributes:p,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:y,maxSamples:A,samples:w}}function D_(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Qn,o=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,_=u.clipIntersection,b=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!b)r?h(null):c();else{let x=r?0:n,M=x*4,y=p.clippingState||null;l.value=y,y=h(g,f,M,d);for(let A=0;A!==M;++A)y[A]=t[A];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,g){let _=u!==null?u.length:0,b=null;if(_!==0){if(b=l.value,g!==!0||b===null){let p=d+_*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(b===null||b.length<p)&&(b=new Float32Array(p));for(let M=0,y=d;M!==_;++M,y+=4)a.copy(u[M]).applyMatrix4(x,o),a.normal.toArray(b,y),b[y+3]=a.constant}l.value=b,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,b}}var ao=class extends Ln{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ia(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new wt(5,5,5),r=new mi({name:"CubemapFromEquirect",uniforms:qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:zs});r.uniforms.tEquirect.value=t;let a=new Ut(s,r),o=t.minFilter;return t.minFilter===Gn&&(t.minFilter=Jt),new Cr(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},kp=256,N_=3,F_=20,om=256,cm=16,U_=3,O_=new B,k_=new Xe,Il=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Cr(1,10,null),this._boxMesh=new Ut(new wt(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=O_}=r,l=this._renderer;this._setSize(a);let c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,f=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,_=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(e.background=l.getClearColor(k_));let b=new Cr(n,s,h);return b.position.copy(o),b.update(l,e),l.autoClear=u,l.autoClearColor=f,l.autoClearDepth=d,l.autoClearStencil=g,e.background=_,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(kp,bu(e))}_fromTexture(e,t){e.mapping===Hs||e.mapping===Nr?this._setSize(e.image.length===0?kp:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=Bp(e,!1,!1),n=Math.log2(e)-N_;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Bp(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Hs||e.mapping===Nr?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gp()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=zp()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=B_(),this._integrationMaterial=z_());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/cm);for(let a=0;a<=n;a++){let o=i.lodToRoughness(a,n);if(a>n-U_)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{let l=o>0?Math.log2(t)+.5*Math.log2(6/(om*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=G_());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function Bp(i,e,t){return new ao(i,{minFilter:Gn,generateMipmaps:e,type:si,colorSpace:_n,depthBuffer:t})}function oo(i,e,t){return new mi({name:i,uniforms:e,vertexShader:ft.cube_vert,fragmentShader:t,side:on,blending:zs,depthTest:!1,depthWrite:!1})}function B_(){return oo("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${om}u

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
	`)}function z_(){return oo("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:cm}},`

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
	`)}function G_(){return oo("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${F_}
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
	`)}function zp(){return oo("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Gp(){return oo("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function H_(i){let e=new WeakMap,t=new WeakMap,n=null;function s(f,d=!1){return f==null?null:d?a(f):r(f)}function r(f){if(f&&f.isTexture){let d=f.mapping;if(d===Bc||d===zc)if(e.has(f)){let g=e.get(f).texture;return o(g,f.mapping)}else{let g=f.image;if(g&&g.height>0){let _=new ao(g.height);return _.fromEquirectangularTexture(i,f),e.set(f,_),f.addEventListener("dispose",c),o(_.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){let d=f.mapping,g=d===Bc||d===zc,_=d===Hs||d===Nr;if(g||_){let b=t.get(f),p=b!==void 0?b.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return n===null&&(n=new Il(i)),b=g?n.fromEquirectangular(f,b):n.fromCubemap(f,b),b.texture.pmremVersion=f.pmremVersion,t.set(f,b),b.texture;if(b!==void 0)return b.texture;{let x=f.image;return g&&x&&x.height>0||_&&x&&l(x)?(n===null&&(n=new Il(i)),b=g?n.fromEquirectangular(f):n.fromCubemap(f),b.texture.pmremVersion=f.pmremVersion,t.set(f,b),f.addEventListener("dispose",h),b.texture):null}}}return f}function o(f,d){return d===Bc?f.mapping=Hs:d===zc&&(f.mapping=Nr),f}function l(f){let d=0,g=6;for(let _=0;_<g;_++)f[_]!==void 0&&d++;return d===g}function c(f){let d=f.target;d.removeEventListener("dispose",c);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function h(f){let d=f.target;d.removeEventListener("dispose",h);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function V_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&As("WebGLRenderer: "+n+" extension not supported."),s}}}function W_(i,e,t,n){let s={},r=new WeakMap,a=new FinalizationRegistry(g=>delete s[g]);function o(g){l(g.target)}function l(g){g.index!==null&&e.remove(g.index);for(let b in g.attributes)e.remove(g.attributes[b]);g.removeEventListener("dispose",o),delete s[g.id],a.unregister(g);let _=r.get(g);_&&(e.remove(_),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function c(g,_){return s[_.id]!==void 0||(_.addEventListener("dispose",o),s[_.id]=new WeakRef(_),a.register(_,_.id,_),t.memory.geometries++),_}function h(g){let _=g.attributes;for(let b in _)e.update(_[b],i.ARRAY_BUFFER)}function u(g){let _=g.index,b=g.attributes.position,p=0;if(b===void 0)return;let x=_!==null?_.array.length:b.array.length/3-1,M=b.count>=65535?wa:Sa,y=new M(Math.ceil(x/3)*6,1),A=y.array;if(_!==null){let m=_.array;p=_.version;for(let v=0,F=0;v<x;v+=3){let L=m[v+0],U=m[v+1],H=m[v+2];A[F++]=L,A[F++]=U,A[F++]=U,A[F++]=H,A[F++]=H,A[F++]=L}}else{p=b.version;for(let m=0,v=0;m<x;m+=3){let F=m+0,L=m+1,U=m+2;A[v++]=F,A[v++]=L,A[v++]=L,A[v++]=U,A[v++]=U,A[v++]=F}}y.version=p;let w=r.get(g);w&&e.remove(w),r.set(g,y)}function f(g){let _=r.get(g);if(_){let b=g.index;b!==null&&_.version<b.version&&u(g)}else u(g);return r.get(g)}function d(){for(let g in s){let _=s[g].deref();_!==void 0&&l(_)}}return{get:c,update:h,getWireframeAttribute:f,dispose:d}}function q_(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*a),t.update(f,n,1)}function c(u,f,d){d!==0&&(i.drawElementsInstanced(n,f,r,u*a,d),t.update(f,n,d))}function h(u,f,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,d);let _=0;for(let b=0;b<d;b++)_+=f[b];t.update(_,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function X_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:$e("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function j_(i,e,t){let n=new WeakMap,s=new At;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(o);if(f===void 0||f.count!==u){let F=function(){m.dispose(),n.delete(o),o.removeEventListener("dispose",F)};f!==void 0&&f.texture.dispose();let d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,b=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],M=0;d===!0&&(M=1),g===!0&&(M=2),_===!0&&(M=3);let y=o.attributes.position.count*M,A=1;y>e.maxTextureSize&&(A=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let w=new Float32Array(y*A*4*u),m=new _a(w,y,A,u);m.type=Fn,m.needsUpdate=!0;let v=M*4;for(let L=0;L<u;L++){let U=b[L],H=p[L],J=x[L],k=y*A*4*L;for(let T=0;T<U.count;T++){let I=T*v;d===!0&&(s.fromBufferAttribute(U,T),w[k+I+0]=s.x,w[k+I+1]=s.y,w[k+I+2]=s.z,w[k+I+3]=0),g===!0&&(s.fromBufferAttribute(H,T),w[k+I+4]=s.x,w[k+I+5]=s.y,w[k+I+6]=s.z,w[k+I+7]=0),_===!0&&(s.fromBufferAttribute(J,T),w[k+I+8]=s.x,w[k+I+9]=s.y,w[k+I+10]=s.z,w[k+I+11]=J.itemSize===4?s.w:1)}}f={count:u,texture:m,size:new le(y,A)},n.set(o,f),o.addEventListener("dispose",F)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];let g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function K_(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,u=c.geometry,f=e.get(c,u);if(r.get(f)!==h&&(e.update(f),r.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return f}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var J_={[Zh]:"LINEAR_TONE_MAPPING",[$h]:"REINHARD_TONE_MAPPING",[Qh]:"CINEON_TONE_MAPPING",[Ya]:"ACES_FILMIC_TONE_MAPPING",[tu]:"AGX_TONE_MAPPING",[nu]:"NEUTRAL_TONE_MAPPING",[eu]:"CUSTOM_TONE_MAPPING"};function Y_(i,e,t,n,s,r){let a=new Ln(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=null,h=new Dt;h.setAttribute("position",new ht([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new ht([0,2,0,0,2,0],2));let u=new Ec({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new Ut(h,u),d=new ks(-1,1,1,-1,0,1),g=null,_=null,b=!1,p,x=null,M=[],y=!1;this.setSize=function(A,w){a.setSize(A,w),o!==null&&o.setSize(A,w),l!==null&&l.setSize(A,w);for(let m=0;m<M.length;m++){let v=M[m];v.setSize&&v.setSize(A,w)}},this.setEffects=function(A){M=A,y=M.length>0&&M[0].isRenderPass===!0;let w=a.width,m=a.height;M.length>0&&o===null&&(o=new Ln(w,m,{type:si,depthBuffer:!1,stencilBuffer:!1}),l=new Ln(w,m,{type:si,depthBuffer:!1,stencilBuffer:!1}));let v=s===!0&&M.some(F=>F.needsDepthTexture===!0);v!==(a.depthTexture!==null)&&(v===!0&&c===null&&(c=new Oi(w,m),r===!0&&(c.format=Wi,c.type=Ws)),a.dispose(),a.depthTexture=v?c:null,a.resolveDepthBuffer=v,a.storeMultisampledDepthBuffer=v);for(let F=0;F<M.length;F++){let L=M[F];L.setSize&&L.setSize(w,m),v&&L.needsDepthTexture===!0&&L.setDepthTexture&&L.setDepthTexture(c)}},this.begin=function(A,w){if(b||A.toneMapping===_i&&M.length===0)return!1;if(x=w,w!==null){let m=w.width,v=w.height;(a.width!==m||a.height!==v)&&this.setSize(m,v)}return y===!1&&A.setRenderTarget(a),p=A.toneMapping,A.toneMapping=_i,!0},this.hasRenderPass=function(){return y},this.end=function(A,w){A.toneMapping=p,b=!0;let m=a,v=o;for(let F=0;F<M.length;F++){let L=M[F];L.enabled!==!1&&(L.render(A,v,m,w),L.needsSwap!==!1&&(m=v,v=v===o?l:o))}if(g!==A.outputColorSpace||_!==A.toneMapping){g=A.outputColorSpace,_=A.toneMapping,u.defines={},mt.getTransfer(g)===St&&(u.defines.SRGB_TRANSFER="");let F=J_[_];F&&(u.defines[F]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=m.texture,A.setRenderTarget(x),A.render(f,d),x=null,b=!1},this.isCompositing=function(){return b},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var lm=new Vt,hm=new Oi(1,1),um=new La(1),dm=new _a,fm=new mc,pm=new Ia,Hp=[],Vp=[],Wp=new Float32Array(16),qp=new Float32Array(9),Xp=new Float32Array(4);function Br(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Hp[s];if(r===void 0&&(r=new Float32Array(s),Hp[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Yt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Zt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Dl(i,e){let t=Vp[e];t===void 0&&(t=new Int32Array(e),Vp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Z_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function $_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2fv(this.addr,e),Zt(t,e)}}function Q_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;i.uniform3fv(this.addr,e),Zt(t,e)}}function ey(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4fv(this.addr,e),Zt(t,e)}}function ty(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Zt(t,e)}else{if(Yt(t,n))return;Xp.set(n),i.uniformMatrix2fv(this.addr,!1,Xp),Zt(t,n)}}function ny(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Zt(t,e)}else{if(Yt(t,n))return;qp.set(n),i.uniformMatrix3fv(this.addr,!1,qp),Zt(t,n)}}function iy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Zt(t,e)}else{if(Yt(t,n))return;Wp.set(n),i.uniformMatrix4fv(this.addr,!1,Wp),Zt(t,n)}}function sy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ry(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2iv(this.addr,e),Zt(t,e)}}function ay(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3iv(this.addr,e),Zt(t,e)}}function oy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4iv(this.addr,e),Zt(t,e)}}function cy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ly(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2uiv(this.addr,e),Zt(t,e)}}function hy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3uiv(this.addr,e),Zt(t,e)}}function uy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4uiv(this.addr,e),Zt(t,e)}}function Nl(i){return i.version===0&&(i.compareFunction=fu,i.needsUpdate=!0),i}function dy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Nl(hm):r=lm,t.setTexture2D(e||r,s)}function fy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||fm,s)}function py(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Nl(um):r=pm,t.setTextureCube(e||r,s)}function my(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||dm,s)}function gy(i){switch(i){case 5126:return Z_;case 35664:return $_;case 35665:return Q_;case 35666:return ey;case 35674:return ty;case 35675:return ny;case 35676:return iy;case 5124:case 35670:return sy;case 35667:case 35671:return ry;case 35668:case 35672:return ay;case 35669:case 35673:return oy;case 5125:return cy;case 36294:return ly;case 36295:return hy;case 36296:return uy;case 35678:case 36198:case 36298:case 36306:case 35682:return dy;case 35679:case 36299:case 36307:return fy;case 35680:case 36300:case 36308:case 36293:return py;case 36289:case 36303:case 36311:case 36292:return my}}function by(i,e){i.uniform1fv(this.addr,e)}function xy(i,e){let t=Br(e,this.size,2);i.uniform2fv(this.addr,t)}function _y(i,e){let t=Br(e,this.size,3);i.uniform3fv(this.addr,t)}function yy(i,e){let t=Br(e,this.size,4);i.uniform4fv(this.addr,t)}function vy(i,e){let t=Br(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function My(i,e){let t=Br(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Sy(i,e){let t=Br(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function wy(i,e){i.uniform1iv(this.addr,e)}function Ty(i,e){i.uniform2iv(this.addr,e)}function Ey(i,e){i.uniform3iv(this.addr,e)}function Ay(i,e){i.uniform4iv(this.addr,e)}function Ry(i,e){i.uniform1uiv(this.addr,e)}function Cy(i,e){i.uniform2uiv(this.addr,e)}function Py(i,e){i.uniform3uiv(this.addr,e)}function Iy(i,e){i.uniform4uiv(this.addr,e)}function Ly(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Nl(hm):a=lm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Dy(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||fm,r[a])}function Ny(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));let a;this.type===i.SAMPLER_CUBE_SHADOW?a=Nl(um):a=pm;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function Fy(i,e,t){let n=this.cache,s=e.length,r=Dl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||dm,r[a])}function Uy(i){switch(i){case 5126:return by;case 35664:return xy;case 35665:return _y;case 35666:return yy;case 35674:return vy;case 35675:return My;case 35676:return Sy;case 5124:case 35670:return wy;case 35667:case 35671:return Ty;case 35668:case 35672:return Ey;case 35669:case 35673:return Ay;case 5125:return Ry;case 36294:return Cy;case 36295:return Py;case 36296:return Iy;case 35678:case 36198:case 36298:case 36306:case 35682:return Ly;case 35679:case 36299:case 36307:return Dy;case 35680:case 36300:case 36308:case 36293:return Ny;case 36289:case 36303:case 36311:case 36292:return Fy}}var Lu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gy(t.type)}},Du=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Uy(t.type)}},Nu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Pu=/(\w+)(\])?(\[|\.)?/g;function jp(i,e){i.seq.push(e),i.map[e.id]=e}function Oy(i,e,t){let n=i.name,s=n.length;for(Pu.lastIndex=0;;){let r=Pu.exec(n),a=Pu.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){jp(t,c===void 0?new Lu(o,i,e):new Du(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Nu(o),jp(t,u)),t=u}}}var kr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Oy(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Kp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var ky=37297,By=0;function zy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Jp=new tt;function Gy(i){mt._getMatrix(Jp,mt.workingColorSpace,i);let e=`mat3( ${Jp.elements.map(t=>t.toFixed(4))} )`;switch(mt.getTransfer(i)){case ba:return[e,"LinearTransferOETF"];case St:return[e,"sRGBTransferOETF"];default:return ze("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Yp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+zy(i.getShaderSource(e),o)}else return r}function Hy(i,e){let t=Gy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var Vy={[Zh]:"Linear",[$h]:"Reinhard",[Qh]:"Cineon",[Ya]:"ACESFilmic",[tu]:"AgX",[nu]:"Neutral",[eu]:"Custom"};function Wy(i,e){let t=Vy[e];return t===void 0?(ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Pl=new B;function qy(){mt.getLuminanceCoefficients(Pl);let i=Pl.x.toFixed(4),e=Pl.y.toFixed(4),t=Pl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ro).join(`
`)}function jy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Ky(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ro(i){return i!==""}function Zp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function $p(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Jy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fu(i){return i.replace(Jy,Yy)}function Yy(i,e){let t=ft[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Fu(t)}var Zy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qp(i){return i.replace(Zy,$y)}function $y(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function em(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var Qy={[Ja]:"SHADOWMAP_TYPE_PCF",[Ir]:"SHADOWMAP_TYPE_VSM"};function ev(i){return Qy[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var tv={[Nr]:"ENVMAP_MODE_REFRACTION"};function nv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":tv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var iv={[Yh]:"ENVMAP_BLENDING_MULTIPLY",[up]:"ENVMAP_BLENDING_MIX",[dp]:"ENVMAP_BLENDING_ADD"};function sv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":iv[i.combine]||"ENVMAP_BLENDING_NONE"}function rv(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=ev(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=nv(t),u=sv(t),f=Xy(t),d=jy(r),g=s.createProgram(),_,b,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(ro).join(`
`),_.length>0&&(_+=`
`),b=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(ro).join(`
`),b.length>0&&(b+=`
`)):(_=[em(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ro).join(`
`),b=[em(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==_i?"#define TONE_MAPPING":"",t.toneMapping!==_i?ft.tonemapping_pars_fragment:"",t.toneMapping!==_i?Wy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ft.colorspace_pars_fragment,Hy("linearToOutputTexel",t.outputColorSpace),qy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ro).join(`
`)),a=Fu(a),a=Zp(a,t),a=$p(a,t),o=Fu(o),o=Zp(o,t),o=$p(o,t),a=Qp(a),o=Qp(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,_=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,b=["#define varying in",t.glslVersion===mu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===mu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);let x=p+_+a,M=p+b+o,y=Kp(s,s.VERTEX_SHADER,x),A=Kp(s,s.FRAGMENT_SHADER,M);s.attachShader(g,y),s.attachShader(g,A),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function w(L){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(g)||"",H=s.getShaderInfoLog(y)||"",J=s.getShaderInfoLog(A)||"",k=U.trim(),T=H.trim(),I=J.trim(),C=!0,V=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(C=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,y,A);else{let G=Yp(s,y,"vertex"),W=Yp(s,A,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+k+`
`+G+`
`+W)}else k!==""?ze("WebGLProgram: Program Info Log:",k):(T===""||I==="")&&(V=!1);V&&(L.diagnostics={runnable:C,programLog:k,vertexShader:{log:T,prefix:_},fragmentShader:{log:I,prefix:b}})}s.deleteShader(y),s.deleteShader(A),m=new kr(s,g),v=Ky(s,g)}let m;this.getUniforms=function(){return m===void 0&&w(this),m};let v;this.getAttributes=function(){return v===void 0&&w(this),v};let F=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=s.getProgramParameter(g,ky)),F},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=By++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=y,this.fragmentShader=A,this}var av=0,Uu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ou(e),t.set(e,n)),n}},Ou=class{constructor(e){this.id=av++,this.code=e,this.usedTimes=0}};function ov(i){return i===hs||i===to||i===no}function cv(i,e,t,n,s,r){let a=new ya,o=new Uu,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(m){return l.add(m),m===0?"uv":`uv${m}`}function g(m,v,F,L,U,H){let J=L.fog,k=U.geometry,T=m.isMeshStandardMaterial||m.isMeshLambertMaterial||m.isMeshPhongMaterial?L.environment:null,I=m.isMeshStandardMaterial||m.isMeshLambertMaterial&&!m.envMap||m.isMeshPhongMaterial&&!m.envMap,C=e.get(m.envMap||T,I),V=f[m.type],G=n.precision;m.precision!==null&&(G=n.getMaxPrecision(m.precision),G!==m.precision&&ze("WebGLProgram.getParameters:",m.precision,"not supported, using",G,"instead."));let W=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,K=W!==void 0?W.length:0,ce=0;k.morphAttributes.position!==void 0&&(ce=1),k.morphAttributes.normal!==void 0&&(ce=2),k.morphAttributes.color!==void 0&&(ce=3);let We,Q,be,Ce;if(V){let Ae=vi[V];We=Ae.vertexShader,Q=Ae.fragmentShader}else{We=m.vertexShader,Q=m.fragmentShader;let Ae=o.getVertexShaderStage(m),Tt=o.getFragmentShaderStage(m);o.update(m,Ae,Tt),be=Ae.id,Ce=Tt.id}let je=i.getRenderTarget(),Ee=i.state.buffers.depth.getReversed(),Ke=U.isInstancedMesh===!0,Pt=U.isBatchedMesh===!0,Ye=!!m.map,ot=!!m.matcap,ct=!!C,se=ct&&C.isPMREMTexture===!0,pe=!!m.aoMap,fe=!!m.lightMap,Pe=!!m.bumpMap&&m.wireframe===!1,Se=!!m.normalMap,nt=!!m.displacementMap,Le=!!m.emissiveMap,N=!!m.metalnessMap,Z=!!m.roughnessMap,ae=m.anisotropy>0,D=m.clearcoat>0,He=m.diffuseRoughness>0,Fe=m.dispersion>0,pt=m.retroreflectivity>0,me=m.iridescence>0,Gt=m.sheen>0,Ze=m.transmission>0,Qe=ae&&!!m.anisotropyMap,R=D&&!!m.clearcoatMap,S=D&&!!m.clearcoatNormalMap,X=D&&!!m.clearcoatRoughnessMap,he=He&&!!m.diffuseRoughnessMap,re=me&&!!m.iridescenceMap,xe=me&&!!m.iridescenceThicknessMap,we=Gt&&!!m.sheenColorMap,ee=Gt&&!!m.sheenRoughnessMap,ne=!!m.specularMap,ye=!!m.specularColorMap,O=!!m.specularIntensityMap,ie=Ze&&!!m.transmissionMap,$=Ze&&!!m.thicknessMap,ve=!!m.gradientMap,de=!!m.alphaMap,_e=m.alphaTest>0,qe=!!m.alphaHash,ut=!!m.extensions,ue=_i;m.toneMapped&&(je===null||je.isXRRenderTarget===!0)&&(ue=i.toneMapping);let Je=se?C.isCompressedCubeTexture?C.image[0].mipmaps:C.mipmaps:null,lt={shaderID:V,shaderType:m.type,shaderName:m.name,vertexShader:We,fragmentShader:Q,defines:m.defines,customVertexShaderID:be,customFragmentShaderID:Ce,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:G,batching:Pt,batchingColor:Pt&&U._colorsTexture!==null,instancing:Ke,instancingColor:Ke&&U.instanceColor!==null,instancingMorph:Ke&&U.morphTexture!==null,outputColorSpace:je===null?i.outputColorSpace:je.isXRRenderTarget===!0?je.texture.colorSpace:mt.workingColorSpace,alphaToCoverage:!!m.alphaToCoverage,map:Ye,matcap:ot,envMap:ct,envMapMode:ct&&C.mapping,envMapPMREM:se,envMapMaxLod:se?Je.length-1:null,envMapSize:se?Je[0].width:null,aoMap:pe,lightMap:fe,bumpMap:Pe,normalMap:Se,displacementMap:nt,emissiveMap:Le,normalMapObjectSpace:Se&&m.normalMapType===_p,normalMapTangentSpace:Se&&m.normalMapType===El,packedNormalMap:Se&&m.normalMapType===El&&ov(m.normalMap.format),metalnessMap:N,roughnessMap:Z,anisotropy:ae,anisotropyMap:Qe,clearcoat:D,clearcoatMap:R,clearcoatNormalMap:S,clearcoatRoughnessMap:X,diffuseRoughness:He,diffuseRoughnessMap:he,dispersion:Fe,retroreflection:pt,iridescence:me,iridescenceMap:re,iridescenceThicknessMap:xe,sheen:Gt,sheenColorMap:we,sheenRoughnessMap:ee,specularMap:ne,specularColorMap:ye,specularIntensityMap:O,transmission:Ze,transmissionMap:ie,thicknessMap:$,gradientMap:ve,opaque:m.transparent===!1&&m.blending===Lr&&m.alphaToCoverage===!1,alphaMap:de,alphaTest:_e,alphaHash:qe,combine:m.combine,mapUv:Ye&&d(m.map.channel),aoMapUv:pe&&d(m.aoMap.channel),lightMapUv:fe&&d(m.lightMap.channel),bumpMapUv:Pe&&d(m.bumpMap.channel),normalMapUv:Se&&d(m.normalMap.channel),displacementMapUv:nt&&d(m.displacementMap.channel),emissiveMapUv:Le&&d(m.emissiveMap.channel),metalnessMapUv:N&&d(m.metalnessMap.channel),roughnessMapUv:Z&&d(m.roughnessMap.channel),anisotropyMapUv:Qe&&d(m.anisotropyMap.channel),clearcoatMapUv:R&&d(m.clearcoatMap.channel),clearcoatNormalMapUv:S&&d(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:X&&d(m.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:he&&d(m.diffuseRoughnessMap.channel),iridescenceMapUv:re&&d(m.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&d(m.iridescenceThicknessMap.channel),sheenColorMapUv:we&&d(m.sheenColorMap.channel),sheenRoughnessMapUv:ee&&d(m.sheenRoughnessMap.channel),specularMapUv:ne&&d(m.specularMap.channel),specularColorMapUv:ye&&d(m.specularColorMap.channel),specularIntensityMapUv:O&&d(m.specularIntensityMap.channel),transmissionMapUv:ie&&d(m.transmissionMap.channel),thicknessMapUv:$&&d(m.thicknessMap.channel),alphaMapUv:de&&d(m.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Se||ae),vertexNormals:!!k.attributes.normal,vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!k.attributes.uv&&(Ye||de),fog:!!J,useFog:m.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:m.wireframe===!1&&(m.flatShading===!0||k.attributes.normal===void 0&&Se===!1&&(m.isMeshLambertMaterial||m.isMeshPhongMaterial||m.isMeshStandardMaterial||m.isMeshPhysicalMaterial)),sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ee,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:ce,numSunLights:v.sun.length,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numSunLightShadows:v.sunShadowMap.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numLightProbeGrids:H.filter(Ae=>Ae.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:m.dithering,shadowMapEnabled:i.shadowMap.enabled&&F.length>0,shadowMapType:i.shadowMap.type,toneMapping:ue,decodeVideoTexture:Ye&&m.map.isVideoTexture===!0&&mt.getTransfer(m.map.colorSpace)===St,decodeVideoTextureEmissive:Le&&m.emissiveMap.isVideoTexture===!0&&mt.getTransfer(m.emissiveMap.colorSpace)===St,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===Ot,flipSided:m.side===on,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionClipCullDistance:ut&&m.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ut&&m.extensions.multiDraw===!0||Pt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()};return lt.vertexUv1s=l.has(1),lt.vertexUv2s=l.has(2),lt.vertexUv3s=l.has(3),l.clear(),lt}function _(m){let v=[];if(m.shaderID?v.push(m.shaderID):(v.push(m.customVertexShaderID),v.push(m.customFragmentShaderID)),m.defines!==void 0)for(let F in m.defines)v.push(F),v.push(m.defines[F]);return m.isRawShaderMaterial===!1&&(b(v,m),p(v,m),v.push(i.outputColorSpace)),v.push(m.customProgramCacheKey),v.join()}function b(m,v){m.push(v.precision),m.push(v.outputColorSpace),m.push(v.envMapMode),m.push(v.envMapPMREM),m.push(v.envMapMaxLod),m.push(v.envMapSize),m.push(v.mapUv),m.push(v.alphaMapUv),m.push(v.lightMapUv),m.push(v.aoMapUv),m.push(v.bumpMapUv),m.push(v.normalMapUv),m.push(v.displacementMapUv),m.push(v.emissiveMapUv),m.push(v.metalnessMapUv),m.push(v.roughnessMapUv),m.push(v.anisotropyMapUv),m.push(v.clearcoatMapUv),m.push(v.clearcoatNormalMapUv),m.push(v.clearcoatRoughnessMapUv),m.push(v.diffuseRoughnessMapUv),m.push(v.iridescenceMapUv),m.push(v.iridescenceThicknessMapUv),m.push(v.sheenColorMapUv),m.push(v.sheenRoughnessMapUv),m.push(v.specularMapUv),m.push(v.specularColorMapUv),m.push(v.specularIntensityMapUv),m.push(v.transmissionMapUv),m.push(v.thicknessMapUv),m.push(v.combine),m.push(v.fogExp2),m.push(v.sizeAttenuation),m.push(v.morphTargetsCount),m.push(v.numSunLights),m.push(v.numDirLights),m.push(v.numPointLights),m.push(v.numSpotLights),m.push(v.numSpotLightMaps),m.push(v.numHemiLights),m.push(v.numRectAreaLights),m.push(v.numSunLightShadows),m.push(v.numDirLightShadows),m.push(v.numPointLightShadows),m.push(v.numSpotLightShadows),m.push(v.numSpotLightShadowsWithMaps),m.push(v.numLightProbes),m.push(v.numLightProbeGrids),m.push(v.shadowMapType),m.push(v.toneMapping),m.push(v.numClippingPlanes),m.push(v.numClipIntersection),m.push(v.depthPacking)}function p(m,v){a.disableAll(),v.instancing&&a.enable(0),v.instancingColor&&a.enable(1),v.instancingMorph&&a.enable(2),v.matcap&&a.enable(3),v.envMap&&a.enable(4),v.normalMapObjectSpace&&a.enable(5),v.normalMapTangentSpace&&a.enable(6),v.clearcoat&&a.enable(7),v.iridescence&&a.enable(8),v.alphaTest&&a.enable(9),v.vertexColors&&a.enable(10),v.vertexAlphas&&a.enable(11),v.vertexUv1s&&a.enable(12),v.vertexUv2s&&a.enable(13),v.vertexUv3s&&a.enable(14),v.vertexTangents&&a.enable(15),v.anisotropy&&a.enable(16),v.alphaHash&&a.enable(17),v.batching&&a.enable(18),v.dispersion&&a.enable(19),v.retroreflection&&a.enable(24),v.diffuseRoughness&&a.enable(25),v.batchingColor&&a.enable(20),v.gradientMap&&a.enable(21),v.packedNormalMap&&a.enable(22),v.vertexNormals&&a.enable(23),m.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),v.numLightProbeGrids>0&&a.enable(22),v.hasPositionAttribute&&a.enable(23),m.push(a.mask)}function x(m){let v=f[m.type],F;if(v){let L=vi[v];F=Fp.clone(L.uniforms)}else F=m.uniforms;return F}function M(m,v){let F=h.get(v);return F!==void 0?++F.usedTimes:(F=new rv(i,v,m,s),c.push(F),h.set(v,F)),F}function y(m){if(--m.usedTimes===0){let v=c.indexOf(m);c[v]=c[c.length-1],c.pop(),h.delete(m.cacheKey),m.destroy()}}function A(m){o.remove(m)}function w(){o.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:x,acquireProgram:M,releaseProgram:y,releaseShaderCache:A,programs:c,dispose:w}}function lv(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function hv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function tm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function nm(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function o(f,d,g,_,b,p){let x=i[e];return x===void 0?(x={id:f.id,object:f,geometry:d,material:g,materialVariant:a(f),groupOrder:_,renderOrder:f.renderOrder,z:b,group:p},i[e]=x):(x.id=f.id,x.object=f,x.geometry=d,x.material=g,x.materialVariant=a(f),x.groupOrder=_,x.renderOrder=f.renderOrder,x.z=b,x.group=p),e++,x}function l(f,d,g,_,b,p,x){x.reversedDepth===!0&&(b=-b);let M=o(f,d,g,_,b,p);g.transmission>0?n.push(M):g.transparent===!0?s.push(M):t.push(M)}function c(f,d,g,_,b,p){let x=o(f,d,g,_,b,p);g.transmission>0?n.unshift(x):g.transparent===!0?s.unshift(x):t.unshift(x)}function h(f,d){t.length>1&&t.sort(f||hv),n.length>1&&n.sort(d||tm),s.length>1&&s.sort(d||tm)}function u(){for(let f=e,d=i.length;f<d;f++){let g=i[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function uv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new nm,i.set(n,[a])):s>=r.length?(a=new nm,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function dv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new B,color:new Xe};break;case"SpotLight":t={position:new B,direction:new B,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new B,halfWidth:new B,halfHeight:new B};break}return i[e.id]=t,t}}}function fv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var pv=0;function mv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function gv(i){let e=new dv,t=fv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new B);let s=new B,r=new et,a=new et;function o(c){let h=0,u=0,f=0;for(let H=0;H<9;H++)n.probe[H].set(0,0,0);let d=0,g=0,_=0,b=0,p=0,x=0,M=0,y=0,A=0,w=0,m=0,v=0,F=0,L=0;c.sort(mv);for(let H=0,J=c.length;H<J;H++){let k=c[H],T=k.color,I=k.intensity,C=k.distance,V=null;if(k.shadow&&k.shadow.map&&(k.shadow.map.texture.format===hs?V=k.shadow.map.texture:V=k.shadow.map.depthTexture||k.shadow.map.texture),k.isAmbientLight)h+=T.r*I,u+=T.g*I,f+=T.b*I;else if(k.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(k.sh.coefficients[G],I);L++}else if(k.isSunLight){let G=e.get(k);if(G.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){let W=k.shadow,K=t.get(k);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),n.sunShadow[g]=K,n.sunShadowMap[g]=V;let ce=W.getViewportCount();for(let We=0;We<ce;We++)n.sunShadowMatrix[_+We]=W.getMatrix(We),n.sunShadowCascade[_+We]=W._cascadeData[We];_+=ce,g++}n.sun[d]=G,d++}else if(k.isDirectionalLight){let G=e.get(k);if(G.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){let W=k.shadow,K=t.get(k);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,n.directionalShadow[b]=K,n.directionalShadowMap[b]=V,n.directionalShadowMatrix[b]=k.shadow.matrix,A++}n.directional[b]=G,b++}else if(k.isSpotLight){let G=e.get(k);G.position.setFromMatrixPosition(k.matrixWorld),G.color.copy(T).multiplyScalar(I),G.distance=C,G.coneCos=Math.cos(k.angle),G.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),G.decay=k.decay,n.spot[x]=G;let W=k.shadow;if(k.map&&(n.spotLightMap[v]=k.map,v++,W.updateMatrices(k),k.castShadow&&F++),n.spotLightMatrix[x]=W.matrix,k.castShadow){let K=t.get(k);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,n.spotShadow[x]=K,n.spotShadowMap[x]=V,m++}x++}else if(k.isRectAreaLight){let G=e.get(k);G.color.copy(T).multiplyScalar(I),G.halfWidth.set(k.width*.5,0,0),G.halfHeight.set(0,k.height*.5,0),n.rectArea[M]=G,M++}else if(k.isPointLight){let G=e.get(k);if(G.color.copy(k.color).multiplyScalar(k.intensity),G.distance=k.distance,G.decay=k.decay,k.castShadow){let W=k.shadow,K=t.get(k);K.shadowIntensity=W.intensity,K.shadowBias=W.bias,K.shadowNormalBias=W.normalBias,K.shadowRadius=W.radius,K.shadowMapSize=W.mapSize,K.shadowCameraNear=W.camera.near,K.shadowCameraFar=W.camera.far,n.pointShadow[p]=K,n.pointShadowMap[p]=V,n.pointShadowMatrix[p]=k.shadow.matrix,w++}n.point[p]=G,p++}else if(k.isHemisphereLight){let G=e.get(k);G.skyColor.copy(k.color).multiplyScalar(I),G.groundColor.copy(k.groundColor).multiplyScalar(I),n.hemi[y]=G,y++}}M>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Re.LTC_FLOAT_1,n.rectAreaLTC2=Re.LTC_FLOAT_2):(n.rectAreaLTC1=Re.LTC_HALF_1,n.rectAreaLTC2=Re.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let U=n.hash;(U.sunLength!==d||U.directionalLength!==b||U.pointLength!==p||U.spotLength!==x||U.rectAreaLength!==M||U.hemiLength!==y||U.numSunShadows!==g||U.numDirectionalShadows!==A||U.numPointShadows!==w||U.numSpotShadows!==m||U.numSpotMaps!==v||U.numLightProbes!==L)&&(n.sun.length=d,n.directional.length=b,n.spot.length=x,n.rectArea.length=M,n.point.length=p,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.directionalShadowMatrix.length=A,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=m,n.spotShadowMap.length=m,n.spotLightMatrix.length=m+v-F,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=F,n.numLightProbes=L,U.sunLength=d,U.directionalLength=b,U.pointLength=p,U.spotLength=x,U.rectAreaLength=M,U.hemiLength=y,U.numSunShadows=g,U.numDirectionalShadows=A,U.numPointShadows=w,U.numSpotShadows=m,U.numSpotMaps=v,U.numLightProbes=L,n.version=pv++)}function l(c,h){let u=0,f=0,d=0,g=0,_=0,b=0,p=h.matrixWorldInverse;for(let x=0,M=c.length;x<M;x++){let y=c[x];if(y.isSunLight){let A=n.sun[u];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(p),u++}else if(y.isDirectionalLight){let A=n.directional[f];A.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(p),f++}else if(y.isSpotLight){let A=n.spot[g];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),A.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(p),g++}else if(y.isRectAreaLight){let A=n.rectArea[_];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),A.halfWidth.set(y.width*.5,0,0),A.halfHeight.set(0,y.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){let A=n.point[d];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){let A=n.hemi[b];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(p),b++}}}return{setup:o,setupView:l,state:n}}function im(i){let e=new gv(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):t.push(u)}function o(u){n.push(u)}function l(){e.setup(t),s.sort((u,f)=>u.priority-f.priority||u.id-f.id)}function c(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function bv(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new im(i),e.set(s,[o])):r>=a.length?(o=new im(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var xv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_v=`uniform sampler2D shadow_pass;
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
}`,yv=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],vv=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],sm=new et,so=new B,Iu=new B;function Mv(i,e,t){let n=new rs,s=new le,r=new le,a=new At,o=new Ac,l=new Rc,c={},h=t.maxTextureSize,u={[xi]:on,[on]:xi,[Ot]:Ot},f=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:xv,fragmentShader:_v}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new Dt;g.setAttribute("position",new an(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ut(g,f),b=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ja;let p=this.type;this.render=function(w,m,v){if(b.enabled===!1||b.autoUpdate===!1&&b.needsUpdate===!1||w.length===0)return;this.type===Xf&&(ze("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ja);let F=i.getRenderTarget(),L=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),H=i.state;H.setBlending(zs),H.buffers.depth.getReversed()===!0?H.buffers.color.setClear(0,0,0,0):H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);let J=p!==this.type;J&&m.traverse(function(k){k.material&&(Array.isArray(k.material)?k.material.forEach(T=>T.needsUpdate=!0):k.material.needsUpdate=!0)});for(let k=0,T=w.length;k<T;k++){let I=w[k],C=I.shadow;if(C===void 0){ze("WebGLShadowMap:",I,"has no shadow.");continue}if(C.autoUpdate===!1&&C.needsUpdate===!1)continue;s.copy(C.mapSize);let V=C.getFrameExtents();s.multiply(V),r.copy(C.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/V.x),s.x=r.x*V.x,C.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/V.y),s.y=r.y*V.y,C.mapSize.y=r.y));let G=i.state.buffers.depth.getReversed();if(C.camera._reversedDepth=G,C.map===null||J===!0){if(C.map!==null&&(C.map.depthTexture!==null&&(C.map.depthTexture.dispose(),C.map.depthTexture=null),C.map.dispose()),this.type===Ir){if(I.isPointLight){ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}C.map=new Ln(s.x,s.y,{format:hs,type:si,minFilter:Jt,magFilter:Jt,generateMipmaps:!1}),C.map.texture.name=I.name+".shadowMap",C.map.depthTexture=new Oi(s.x,s.y,Fn),C.map.depthTexture.name=I.name+".shadowMapDepth",C.map.depthTexture.format=Ni,C.map.depthTexture.compareFunction=null,C.map.depthTexture.minFilter=Ht,C.map.depthTexture.magFilter=Ht}else I.isPointLight?(C.map=new ao(s.x),C.map.depthTexture=new La(s.x,ii)):(C.map=new Ln(s.x,s.y),C.map.depthTexture=new Oi(s.x,s.y,ii)),C.map.depthTexture.name=I.name+".shadowMap",C.map.depthTexture.format=Ni,this.type===Ja?(C.map.depthTexture.compareFunction=G?du:uu,C.map.depthTexture.minFilter=Jt,C.map.depthTexture.magFilter=Jt):(C.map.depthTexture.compareFunction=null,C.map.depthTexture.minFilter=Ht,C.map.depthTexture.magFilter=Ht);C.camera.updateProjectionMatrix()}C.map.isWebGLCubeRenderTarget!==!0&&(C.map.width!==s.x||C.map.height!==s.y)&&C.map.setSize(s.x,s.y);let W=C.map.isWebGLCubeRenderTarget?6:C.getViewportCount();I.isPointLight!==!0&&C.updateMatrices(I,v);let K=(C.camera.layers.mask&4294967294)!==0?C.camera.layers:v.layers;for(let ce=0;ce<W;ce++){let We=C.getCamera(ce);if(I.isPointLight){let Q=C.camera,be=C.matrix,Ce=I.distance||Q.far;Ce!==Q.far&&(Q.far=Ce,Q.updateProjectionMatrix()),so.setFromMatrixPosition(I.matrixWorld),Q.position.copy(so),Iu.copy(Q.position),Iu.add(yv[ce]),Q.up.copy(vv[ce]),Q.lookAt(Iu),Q.updateMatrixWorld(),be.makeTranslation(-so.x,-so.y,-so.z),sm.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),C._frustum.setFromProjectionMatrix(sm,Q.coordinateSystem,Q.reversedDepth)}if(C.map.isWebGLCubeRenderTarget)i.setRenderTarget(C.map,ce),i.clear();else{ce===0&&(i.setRenderTarget(C.map),i.clear());let Q=C.getViewport(ce);a.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),H.viewport(a)}n=C.getFrustum(ce),y(m,v,We,I,K,this.type)}C.isPointLightShadow!==!0&&this.type===Ir&&x(C,v),C.needsUpdate=!1}p=this.type,b.needsUpdate=!1,i.setRenderTarget(F,L,U)};function x(w,m){let v=e.update(_);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null?w.mapPass=new Ln(s.x,s.y,{format:hs,type:si}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),f.uniforms.shadow_pass.value=w.map.depthTexture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(m,null,v,f,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(m,null,v,d,_,null)}function M(w,m,v,F){let L=null,U=v.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(U!==void 0)L=U;else if(L=v.isPointLight===!0?l:o,i.localClippingEnabled&&m.clipShadows===!0&&Array.isArray(m.clippingPlanes)&&m.clippingPlanes.length!==0||m.displacementMap&&m.displacementScale!==0||m.alphaMap&&m.alphaTest>0||m.map&&m.alphaTest>0||m.alphaToCoverage===!0){let H=L.uuid,J=m.uuid,k=c[H];k===void 0&&(k={},c[H]=k);let T=k[J];T===void 0&&(T=L.clone(),k[J]=T,m.addEventListener("dispose",A)),L=T}if(L.visible=m.visible,L.wireframe=m.wireframe,F===Ir?L.side=m.shadowSide!==null?m.shadowSide:m.side:L.side=m.shadowSide!==null?m.shadowSide:u[m.side],L.alphaMap=m.alphaMap,L.alphaTest=m.alphaToCoverage===!0?.5:m.alphaTest,L.map=m.map,L.clipShadows=m.clipShadows,L.clippingPlanes=m.clippingPlanes,L.clipIntersection=m.clipIntersection,L.displacementMap=m.displacementMap,L.displacementScale=m.displacementScale,L.displacementBias=m.displacementBias,L.wireframeLinewidth=m.wireframeLinewidth,L.linewidth=m.linewidth,v.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let H=i.properties.get(L);H.light=v}return L}function y(w,m,v,F,L,U){if(w.visible===!1)return;if(w.layers.test(L)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&U===Ir)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,w.matrixWorld);let k=e.update(w),T=w.material;if(Array.isArray(T)){let I=k.groups;for(let C=0,V=I.length;C<V;C++){let G=I[C],W=T[G.materialIndex];if(W&&W.visible){let K=M(w,W,F,U);w.onBeforeShadow(i,w,m,v,k,K,G),i.renderBufferDirect(v,null,k,K,w,G),w.onAfterShadow(i,w,m,v,k,K,G)}}}else if(T.visible){let I=M(w,T,F,U);w.onBeforeShadow(i,w,m,v,k,I,null),i.renderBufferDirect(v,null,k,I,w,null),w.onAfterShadow(i,w,m,v,k,I,null)}}let J=w.children;for(let k=0,T=J.length;k<T;k++)y(J[k],m,v,F,L,U)}function A(w){w.target.removeEventListener("dispose",A);for(let v in c){let F=c[v],L=w.target.uuid;L in F&&(F[L].dispose(),delete F[L])}}}function Sv(i,e){function t(){let O=!1,ie=new At,$=null,ve=new At(0,0,0,0);return{setMask:function(de){$!==de&&!O&&(i.colorMask(de,de,de,de),$=de)},setLocked:function(de){O=de},setClear:function(de,_e,qe,ut,ue){ue===!0&&(de*=ut,_e*=ut,qe*=ut),ie.set(de,_e,qe,ut),ve.equals(ie)===!1&&(i.clearColor(de,_e,qe,ut),ve.copy(ie))},reset:function(){O=!1,$=null,ve.set(-1,0,0,0)}}}function n(){let O=!1,ie=!1,$=null,ve=null,de=null;return{setReversed:function(_e){if(ie!==_e){let qe=e.get("EXT_clip_control");_e?qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.ZERO_TO_ONE_EXT):qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.NEGATIVE_ONE_TO_ONE_EXT),ie=_e;let ut=de;de=null,this.setClear(ut)}},getReversed:function(){return ie},setTest:function(_e){_e?Ee(i.DEPTH_TEST):Ke(i.DEPTH_TEST)},setMask:function(_e){$!==_e&&!O&&(i.depthMask(_e),$=_e)},setFunc:function(_e){if(ie&&(_e=Cp[_e]),ve!==_e){switch(_e){case ac:i.depthFunc(i.NEVER);break;case oc:i.depthFunc(i.ALWAYS);break;case cc:i.depthFunc(i.LESS);break;case dr:i.depthFunc(i.LEQUAL);break;case lc:i.depthFunc(i.EQUAL);break;case hc:i.depthFunc(i.GEQUAL);break;case uc:i.depthFunc(i.GREATER);break;case dc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=_e}},setLocked:function(_e){O=_e},setClear:function(_e){de!==_e&&(de=_e,ie&&(_e=1-_e),i.clearDepth(_e))},reset:function(){O=!1,$=null,ve=null,de=null,ie=!1}}}function s(){let O=!1,ie=null,$=null,ve=null,de=null,_e=null,qe=null,ut=null,ue=null;return{setTest:function(Je){O||(Je?Ee(i.STENCIL_TEST):Ke(i.STENCIL_TEST))},setMask:function(Je){ie!==Je&&!O&&(i.stencilMask(Je),ie=Je)},setFunc:function(Je,lt,Ae){($!==Je||ve!==lt||de!==Ae)&&(i.stencilFunc(Je,lt,Ae),$=Je,ve=lt,de=Ae)},setOp:function(Je,lt,Ae){(_e!==Je||qe!==lt||ut!==Ae)&&(i.stencilOp(Je,lt,Ae),_e=Je,qe=lt,ut=Ae)},setLocked:function(Je){O=Je},setClear:function(Je){ue!==Je&&(i.clearStencil(Je),ue=Je)},reset:function(){O=!1,ie=null,$=null,ve=null,de=null,_e=null,qe=null,ut=null,ue=null}}}let r=new t,a=new n,o=new s,l={},c=new WeakMap,h={},u={},f={},d=new WeakMap,g=[],_=null,b=!1,p=null,x=null,M=null,y=null,A=null,w=null,m=null,v=new Xe(0,0,0),F=0,L=!1,U=null,H=null,J=null,k=null,T=null,I=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),C=!1,V=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(G)[1]),C=V>=1):G.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),C=V>=2);let W=null,K={},ce=i.getParameter(i.SCISSOR_BOX),We=i.getParameter(i.VIEWPORT),Q=new At().fromArray(ce),be=new At().fromArray(We);function Ce(O,ie,$,ve){let de=new Uint8Array(4),_e=i.createTexture();i.bindTexture(O,_e),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let qe=0;qe<$;qe++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,de):i.texImage2D(ie+qe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,de);return _e}let je={};je[i.TEXTURE_2D]=Ce(i.TEXTURE_2D,i.TEXTURE_2D,1),je[i.TEXTURE_CUBE_MAP]=Ce(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),je[i.TEXTURE_2D_ARRAY]=Ce(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),je[i.TEXTURE_3D]=Ce(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Ee(i.DEPTH_TEST),a.setFunc(dr),Pe(!1),Se(qh),Ee(i.CULL_FACE),pe(zs);function Ee(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function Ke(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function Pt(O,ie){return f[O]!==ie?(i.bindFramebuffer(O,ie),f[O]=ie,O===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ie),O===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function Ye(O,ie){let $=g,ve=!1;if(O){$=d.get(ie),$===void 0&&($=[],d.set(ie,$));let de=O.textures;if($.length!==de.length||$[0]!==i.COLOR_ATTACHMENT0){for(let _e=0,qe=de.length;_e<qe;_e++)$[_e]=i.COLOR_ATTACHMENT0+_e;$.length=de.length,ve=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,ve=!0);ve&&i.drawBuffers($)}function ot(O){return _!==O?(i.useProgram(O),_=O,!0):!1}let ct={[Gs]:i.FUNC_ADD,[Kf]:i.FUNC_SUBTRACT,[Jf]:i.FUNC_REVERSE_SUBTRACT};ct[Yf]=i.MIN,ct[Zf]=i.MAX;let se={[$f]:i.ZERO,[Qf]:i.ONE,[ep]:i.SRC_COLOR,[Kh]:i.SRC_ALPHA,[ap]:i.SRC_ALPHA_SATURATE,[sp]:i.DST_COLOR,[np]:i.DST_ALPHA,[tp]:i.ONE_MINUS_SRC_COLOR,[Jh]:i.ONE_MINUS_SRC_ALPHA,[rp]:i.ONE_MINUS_DST_COLOR,[ip]:i.ONE_MINUS_DST_ALPHA,[op]:i.CONSTANT_COLOR,[cp]:i.ONE_MINUS_CONSTANT_COLOR,[lp]:i.CONSTANT_ALPHA,[hp]:i.ONE_MINUS_CONSTANT_ALPHA};function pe(O,ie,$,ve,de,_e,qe,ut,ue,Je){if(O===zs){b===!0&&(Ke(i.BLEND),b=!1);return}if(b===!1&&(Ee(i.BLEND),b=!0),O!==jf){if(O!==p||Je!==L){if((x!==Gs||A!==Gs)&&(i.blendEquation(i.FUNC_ADD),x=Gs,A=Gs),Je)switch(O){case Lr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Dr:i.blendFunc(i.ONE,i.ONE);break;case Xh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case jh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:$e("WebGLState: Invalid blending: ",O);break}else switch(O){case Lr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Dr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Xh:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case jh:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",O);break}M=null,y=null,w=null,m=null,v.set(0,0,0),F=0,p=O,L=Je}return}de=de||ie,_e=_e||$,qe=qe||ve,(ie!==x||de!==A)&&(i.blendEquationSeparate(ct[ie],ct[de]),x=ie,A=de),($!==M||ve!==y||_e!==w||qe!==m)&&(i.blendFuncSeparate(se[$],se[ve],se[_e],se[qe]),M=$,y=ve,w=_e,m=qe),(ut.equals(v)===!1||ue!==F)&&(i.blendColor(ut.r,ut.g,ut.b,ue),v.copy(ut),F=ue),p=O,L=!1}function fe(O,ie){O.side===Ot?Ke(i.CULL_FACE):Ee(i.CULL_FACE);let $=O.side===on;ie&&($=!$),Pe($),O.blending===Lr&&O.transparent===!1?pe(zs):pe(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let ve=O.stencilWrite;o.setTest(ve),ve&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Le(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?Ee(i.SAMPLE_ALPHA_TO_COVERAGE):Ke(i.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(O){U!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),U=O)}function Se(O){O!==Wf?(Ee(i.CULL_FACE),O!==H&&(O===qh?i.cullFace(i.BACK):O===qf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ke(i.CULL_FACE),H=O}function nt(O){O!==J&&(C&&i.lineWidth(O),J=O)}function Le(O,ie,$){O?(Ee(i.POLYGON_OFFSET_FILL),(k!==ie||T!==$)&&(k=ie,T=$,a.getReversed()&&(ie=-ie,$=-$),i.polygonOffset(ie,$))):Ke(i.POLYGON_OFFSET_FILL)}function N(O){O?Ee(i.SCISSOR_TEST):Ke(i.SCISSOR_TEST)}function Z(O){O===void 0&&(O=i.TEXTURE0+I-1),W!==O&&(i.activeTexture(O),W=O)}function ae(O,ie,$){$===void 0&&(W===null?$=i.TEXTURE0+I-1:$=W);let ve=K[$];ve===void 0&&(ve={type:void 0,texture:void 0},K[$]=ve),(ve.type!==O||ve.texture!==ie)&&(W!==$&&(i.activeTexture($),W=$),i.bindTexture(O,ie||je[O]),ve.type=O,ve.texture=ie)}function D(){let O=K[W];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function He(){try{i.compressedTexImage2D(...arguments)}catch(O){$e("WebGLState:",O)}}function Fe(){try{i.compressedTexImage3D(...arguments)}catch(O){$e("WebGLState:",O)}}function pt(){try{i.texSubImage2D(...arguments)}catch(O){$e("WebGLState:",O)}}function me(){try{i.texSubImage3D(...arguments)}catch(O){$e("WebGLState:",O)}}function Gt(){try{i.compressedTexSubImage2D(...arguments)}catch(O){$e("WebGLState:",O)}}function Ze(){try{i.compressedTexSubImage3D(...arguments)}catch(O){$e("WebGLState:",O)}}function Qe(){try{i.texStorage2D(...arguments)}catch(O){$e("WebGLState:",O)}}function R(){try{i.texStorage3D(...arguments)}catch(O){$e("WebGLState:",O)}}function S(){try{i.texImage2D(...arguments)}catch(O){$e("WebGLState:",O)}}function X(){try{i.texImage3D(...arguments)}catch(O){$e("WebGLState:",O)}}function he(O){return u[O]!==void 0?u[O]:i.getParameter(O)}function re(O,ie){u[O]!==ie&&(i.pixelStorei(O,ie),u[O]=ie)}function xe(O){Q.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),Q.copy(O))}function we(O){be.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),be.copy(O))}function ee(O,ie){let $=c.get(ie);$===void 0&&($=new WeakMap,c.set(ie,$));let ve=$.get(O);ve===void 0&&(ve=i.getUniformBlockIndex(ie,O.name),i.uniformBlockBinding(ie,ve,ve),$.set(O,ve))}function ne(O,ie,$){let de=c.get(ie).get(O);l[de]!==$&&(i.bindBufferBase(i.UNIFORM_BUFFER,de,$),l[de]=$)}function ye(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},W=null,K={},f={},l={},d=new WeakMap,g=[],_=null,b=!1,p=null,x=null,M=null,y=null,A=null,w=null,m=null,v=new Xe(0,0,0),F=0,L=!1,U=null,H=null,J=null,k=null,T=null,Q.set(0,0,i.canvas.width,i.canvas.height),be.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Ee,disable:Ke,bindFramebuffer:Pt,drawBuffers:Ye,useProgram:ot,setBlending:pe,setMaterial:fe,setFlipSided:Pe,setCullFace:Se,setLineWidth:nt,setPolygonOffset:Le,setScissorTest:N,activeTexture:Z,bindTexture:ae,unbindTexture:D,compressedTexImage2D:He,compressedTexImage3D:Fe,texImage2D:S,texImage3D:X,pixelStorei:re,getParameter:he,updateUBOMapping:ee,uniformBlockBinding:ne,texStorage2D:Qe,texStorage3D:R,texSubImage2D:pt,texSubImage3D:me,compressedTexSubImage2D:Gt,compressedTexSubImage3D:Ze,scissor:xe,viewport:we,reset:ye}}function wv(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap,u=new Set,f,d=new WeakMap,g=new Set,_=new FinalizationRegistry(R=>g.delete(R)),b=!1;try{b=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(R,S){return b?new OffscreenCanvas(R,S):mr("canvas")}function x(R,S,X){let he=1,re=Qe(R);if((re.width>X||re.height>X)&&(he=X/Math.max(re.width,re.height)),he<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let xe=Math.floor(he*re.width),we=Math.floor(he*re.height);f===void 0&&(f=p(xe,we));let ee=S?p(xe,we):f;return ee.width=xe,ee.height=we,ee.getContext("2d").drawImage(R,0,0,xe,we),ze("WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+xe+"x"+we+")."),ee}else return"data"in R&&ze("WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),R;return R}function M(R){return R.generateMipmaps}function y(R){i.generateMipmap(R)}function A(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(R,S,X,he,re,xe=!1){if(R!==null){if(i[R]!==void 0)return i[R];ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let we;he&&(we=e.get("EXT_texture_norm16"),we||ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=S;if(S===i.RED&&(X===i.FLOAT&&(ee=i.R32F),X===i.HALF_FLOAT&&(ee=i.R16F),X===i.UNSIGNED_BYTE&&(ee=i.R8),X===i.UNSIGNED_SHORT&&we&&(ee=we.R16_EXT),X===i.SHORT&&we&&(ee=we.R16_SNORM_EXT)),S===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(ee=i.R8UI),X===i.UNSIGNED_SHORT&&(ee=i.R16UI),X===i.UNSIGNED_INT&&(ee=i.R32UI),X===i.BYTE&&(ee=i.R8I),X===i.SHORT&&(ee=i.R16I),X===i.INT&&(ee=i.R32I)),S===i.RG&&(X===i.FLOAT&&(ee=i.RG32F),X===i.HALF_FLOAT&&(ee=i.RG16F),X===i.UNSIGNED_BYTE&&(ee=i.RG8),X===i.UNSIGNED_SHORT&&we&&(ee=we.RG16_EXT),X===i.SHORT&&we&&(ee=we.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(ee=i.RG8UI),X===i.UNSIGNED_SHORT&&(ee=i.RG16UI),X===i.UNSIGNED_INT&&(ee=i.RG32UI),X===i.BYTE&&(ee=i.RG8I),X===i.SHORT&&(ee=i.RG16I),X===i.INT&&(ee=i.RG32I)),S===i.RGB_INTEGER&&(X===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),X===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),X===i.UNSIGNED_INT&&(ee=i.RGB32UI),X===i.BYTE&&(ee=i.RGB8I),X===i.SHORT&&(ee=i.RGB16I),X===i.INT&&(ee=i.RGB32I)),S===i.RGBA_INTEGER&&(X===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),X===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),X===i.UNSIGNED_INT&&(ee=i.RGBA32UI),X===i.BYTE&&(ee=i.RGBA8I),X===i.SHORT&&(ee=i.RGBA16I),X===i.INT&&(ee=i.RGBA32I)),S===i.RGB&&(X===i.UNSIGNED_SHORT&&we&&(ee=we.RGB16_EXT),X===i.SHORT&&we&&(ee=we.RGB16_SNORM_EXT),X===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),X===i.UNSIGNED_INT_10F_11F_11F_REV&&(ee=i.R11F_G11F_B10F)),S===i.RGBA){let ne=xe?ba:mt.getTransfer(re);X===i.FLOAT&&(ee=i.RGBA32F),X===i.HALF_FLOAT&&(ee=i.RGBA16F),X===i.UNSIGNED_BYTE&&(ee=ne===St?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT&&we&&(ee=we.RGBA16_EXT),X===i.SHORT&&we&&(ee=we.RGBA16_SNORM_EXT),X===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function m(R,S){let X;return R?S===null||S===ii||S===Ws?X=i.DEPTH24_STENCIL8:S===Fn?X=i.DEPTH32F_STENCIL8:S===Ur&&(X=i.DEPTH24_STENCIL8,ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ii||S===Ws?X=i.DEPTH_COMPONENT24:S===Fn?X=i.DEPTH_COMPONENT32F:S===Ur&&(X=i.DEPTH_COMPONENT16),X}function v(R,S){return M(R)===!0||R.isFramebufferTexture&&R.minFilter!==Ht&&R.minFilter!==Jt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function F(R){let S=new WeakRef(R);n.get(R).__ref=S,g.add(S),_.register(R,S,S)}function L(R){let S=n.get(R).__ref;S!==void 0&&(g.delete(S),_.unregister(S))}function U(R){J(R.target)}function H(R){k(R.target)}function J(R){R.removeEventListener("dispose",U),L(R),I(R),R.isVideoTexture&&h.delete(R),R.isHTMLTexture&&u.delete(R)}function k(R){R.removeEventListener("dispose",H),L(R),V(R)}function T(){for(let R of g){let S=R.deref();S!==void 0&&(S.isRenderTarget===!0?k(S):J(S))}g.clear(),u.clear()}function I(R){let S=n.get(R);if(S.__webglInit===void 0)return;let X=R.source,he=d.get(X);if(he){let re=he[S.__cacheKey];re.usedTimes--,re.usedTimes===0&&C(R),Object.keys(he).length===0&&d.delete(X)}n.remove(R)}function C(R){let S=n.get(R);i.deleteTexture(S.__webglTexture);let X=R.source,he=d.get(X);delete he[S.__cacheKey],a.memory.textures--}function V(R){let S=n.get(R);S.__depthDisposeCallback&&S.__depthDisposeCallback();let X=R.depthTexture;if(X&&X.renderTarget===R&&J(X),R.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(S.__webglFramebuffer[re]))for(let xe=0;xe<S.__webglFramebuffer[re].length;xe++)i.deleteFramebuffer(S.__webglFramebuffer[re][xe]);else i.deleteFramebuffer(S.__webglFramebuffer[re]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[re])}else{if(Array.isArray(S.__webglFramebuffer))for(let re=0;re<S.__webglFramebuffer.length;re++)i.deleteFramebuffer(S.__webglFramebuffer[re]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let re=0;re<S.__webglColorRenderbuffer.length;re++)S.__webglColorRenderbuffer[re]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[re]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let he=R.textures;for(let re=0,xe=he.length;re<xe;re++){let we=n.get(he[re]);we.__webglTexture&&(i.deleteTexture(we.__webglTexture),a.memory.textures--),n.remove(he[re])}n.remove(R)}let G=0;function W(){G=0}function K(){return G}function ce(R){G=R}function We(){let R=G;return R>=s.maxTextures&&ze("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),G+=1,R}function Q(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.mipmapsAutoUpdate),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function be(R,S){let X=n.get(R);if(R.isVideoTexture&&Gt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&X.__version!==R.version){let he=R.image;if(he===null)ze("WebGLRenderer: Texture marked for update but no image data found.");else if(he.complete===!1)ze("WebGLRenderer: Texture marked for update but image is incomplete");else{fe(X,R,S);return}}else R.isExternalTexture&&(X.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+S)}function Ce(R,S){let X=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&X.__version!==R.version){fe(X,R,S);return}else R.isExternalTexture&&(X.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+S)}function je(R,S){let X=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&X.__version!==R.version){fe(X,R,S);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+S)}function Ee(R,S){let X=n.get(R);if(R.version>0&&X.__version!==R.version){Pe(X,R,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+S)}let Ke={[zn]:i.REPEAT,[rn]:i.CLAMP_TO_EDGE,[fr]:i.MIRRORED_REPEAT},Pt={[Ht]:i.NEAREST,[Gc]:i.NEAREST_MIPMAP_NEAREST,[Vs]:i.NEAREST_MIPMAP_LINEAR,[Jt]:i.LINEAR,[Fr]:i.LINEAR_MIPMAP_NEAREST,[Gn]:i.LINEAR_MIPMAP_LINEAR},Ye={[vp]:i.NEVER,[fu]:i.ALWAYS,[Mp]:i.LESS,[uu]:i.LEQUAL,[Sp]:i.EQUAL,[du]:i.GEQUAL,[wp]:i.GREATER,[Tp]:i.NOTEQUAL};function ot(R,S){if(S.type===Fn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Jt||S.magFilter===Fr||S.magFilter===Vs||S.magFilter===Gn||S.minFilter===Jt||S.minFilter===Fr||S.minFilter===Vs||S.minFilter===Gn)&&ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,Ke[S.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,Ke[S.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,Ke[S.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Pt[S.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Pt[S.minFilter]),S.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ye[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ht||S.minFilter!==Vs&&S.minFilter!==Gn||S.type===Fn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function ct(R,S){let X=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",U),F(S));let he=S.source,re=d.get(he);re===void 0&&(re={},d.set(he,re));let xe=Q(S);if(xe!==R.__cacheKey){re[xe]===void 0&&(re[xe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,X=!0),re[xe].usedTimes++;let we=re[R.__cacheKey];we!==void 0&&(re[R.__cacheKey].usedTimes--,we.usedTimes===0&&C(S)),R.__cacheKey=xe,R.__webglTexture=re[xe].texture}return X}function se(R,S,X){return Math.floor(Math.floor(R/X)/S)}function pe(R,S,X,he){let xe=R.updateRanges;if(xe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,X,he,S.data);else{xe.sort((O,ie)=>O.start-ie.start);let we=0;for(let O=1;O<xe.length;O++){let ie=xe[we],$=xe[O],ve=ie.start+ie.count,de=se($.start,S.width,4),_e=se(ie.start,S.width,4);$.start<=ve+1&&de===_e&&se($.start+$.count-1,S.width,4)===de?ie.count=Math.max(ie.count,$.start+$.count-ie.start):(++we,xe[we]=$)}xe.length=we+1;let ee=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),ye=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let O=0,ie=xe.length;O<ie;O++){let $=xe[O],ve=Math.floor($.start/4),de=Math.ceil($.count/4),_e=ve%S.width,qe=Math.floor(ve/S.width),ut=de,ue=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,_e),t.pixelStorei(i.UNPACK_SKIP_ROWS,qe),t.texSubImage2D(i.TEXTURE_2D,0,_e,qe,ut,ue,X,he,S.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ee),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,ye)}}function fe(R,S,X){let he=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(he=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(he=i.TEXTURE_3D);let re=ct(R,S),xe=S.source;t.bindTexture(he,R.__webglTexture,i.TEXTURE0+X);let we=n.get(xe);if(xe.version!==we.__version||re===!0){if(t.activeTexture(i.TEXTURE0+X),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let ue=mt.getPrimaries(mt.workingColorSpace),Je=S.colorSpace===Vn?null:mt.getPrimaries(S.colorSpace),lt=S.colorSpace===Vn||ue===Je?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let ne=x(S.image,!1,s.maxTextureSize);ne=Ze(S,ne);let ye=r.convert(S.format,S.colorSpace),O=r.convert(S.type),ie=w(S.internalFormat,ye,O,S.normalized,S.colorSpace,S.isVideoTexture);ot(he,S);let $,ve=S.mipmaps,de=S.isVideoTexture!==!0,_e=we.__version===void 0||re===!0,qe=xe.dataReady,ut=v(S,ne);if(S.isDepthTexture)ie=m(S.format===Wi,S.type),_e&&(de?t.texStorage2D(i.TEXTURE_2D,1,ie,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,ie,ne.width,ne.height,0,ye,O,null));else if(S.isDataTexture)if(ve.length>0){de&&_e&&t.texStorage2D(i.TEXTURE_2D,ut,ie,ve[0].width,ve[0].height);for(let ue=0,Je=ve.length;ue<Je;ue++)$=ve[ue],de?qe&&t.texSubImage2D(i.TEXTURE_2D,ue,0,0,$.width,$.height,ye,O,$.data):t.texImage2D(i.TEXTURE_2D,ue,ie,$.width,$.height,0,ye,O,$.data);S.generateMipmaps=!1}else de?(_e&&t.texStorage2D(i.TEXTURE_2D,ut,ie,ne.width,ne.height),qe&&pe(S,ne,ye,O)):t.texImage2D(i.TEXTURE_2D,0,ie,ne.width,ne.height,0,ye,O,ne.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){de&&_e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ut,ie,ve[0].width,ve[0].height,ne.depth);for(let ue=0,Je=ve.length;ue<Je;ue++)if($=ve[ue],S.format!==Hn)if(ye!==null)if(de){if(qe)if(S.layerUpdates.size>0){let lt=wu($.width,$.height,S.format,S.type);for(let Ae of S.layerUpdates){let Tt=$.data.subarray(Ae*lt/$.data.BYTES_PER_ELEMENT,(Ae+1)*lt/$.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ue,0,0,Ae,$.width,$.height,1,ye,Tt)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ue,0,0,0,$.width,$.height,ne.depth,ye,$.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ue,ie,$.width,$.height,ne.depth,0,$.data,0,0);else ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else de?qe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ue,0,0,0,$.width,$.height,ne.depth,ye,O,$.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ue,ie,$.width,$.height,ne.depth,0,ye,O,$.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{de&&_e&&t.texStorage2D(i.TEXTURE_2D,ut,ie,ve[0].width,ve[0].height);for(let ue=0,Je=ve.length;ue<Je;ue++)$=ve[ue],S.format!==Hn?ye!==null?de?qe&&t.compressedTexSubImage2D(i.TEXTURE_2D,ue,0,0,$.width,$.height,ye,$.data):t.compressedTexImage2D(i.TEXTURE_2D,ue,ie,$.width,$.height,0,$.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):de?qe&&t.texSubImage2D(i.TEXTURE_2D,ue,0,0,$.width,$.height,ye,O,$.data):t.texImage2D(i.TEXTURE_2D,ue,ie,$.width,$.height,0,ye,O,$.data)}else if(S.isDataArrayTexture)if(de){if(_e&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ut,ie,ne.width,ne.height,ne.depth),qe)if(S.layerUpdates.size>0){let ue=wu(ne.width,ne.height,S.format,S.type);for(let Je of S.layerUpdates){let lt=ne.data.subarray(Je*ue/ne.data.BYTES_PER_ELEMENT,(Je+1)*ue/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Je,ne.width,ne.height,1,ye,O,lt)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ye,O,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ie,ne.width,ne.height,ne.depth,0,ye,O,ne.data);else if(S.isData3DTexture)de?(_e&&t.texStorage3D(i.TEXTURE_3D,ut,ie,ne.width,ne.height,ne.depth),qe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ye,O,ne.data)):t.texImage3D(i.TEXTURE_3D,0,ie,ne.width,ne.height,ne.depth,0,ye,O,ne.data);else if(S.isFramebufferTexture){if(_e)if(de)t.texStorage2D(i.TEXTURE_2D,ut,ie,ne.width,ne.height);else{let ue=ne.width,Je=ne.height;for(let lt=0;lt<ut;lt++)t.texImage2D(i.TEXTURE_2D,lt,ie,ue,Je,0,ye,O,null),ue>>=1,Je>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){let ue=i.canvas;if(ue.hasAttribute("layoutsubtree")||ue.setAttribute("layoutsubtree","true"),ne.parentNode!==ue){ue.appendChild(ne),u.add(S),ue.onpaint=Je=>{let lt=Je.changedElements;for(let Ae of u)lt.includes(Ae.image)&&(Ae.needsUpdate=!0)},ue.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{let lt=i.RGBA,Ae=i.RGBA,Tt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,lt,Ae,Tt,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ve.length>0){if(de&&_e){let ue=Qe(ve[0]);t.texStorage2D(i.TEXTURE_2D,ut,ie,ue.width,ue.height)}for(let ue=0,Je=ve.length;ue<Je;ue++)$=ve[ue],de?qe&&t.texSubImage2D(i.TEXTURE_2D,ue,0,0,ye,O,$):t.texImage2D(i.TEXTURE_2D,ue,ie,ye,O,$);S.generateMipmaps=!1}else if(de){if(_e){let ue=Qe(ne);t.texStorage2D(i.TEXTURE_2D,ut,ie,ue.width,ue.height)}qe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ye,O,ne)}else t.texImage2D(i.TEXTURE_2D,0,ie,ye,O,ne);M(S)&&S.mipmapsAutoUpdate===!0&&y(he),we.__version=xe.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Pe(R,S,X){if(S.image.length!==6)return;let he=ct(R,S),re=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+X);let xe=n.get(re);if(re.version!==xe.__version||he===!0){t.activeTexture(i.TEXTURE0+X);let we=mt.getPrimaries(mt.workingColorSpace),ee=S.colorSpace===Vn?null:mt.getPrimaries(S.colorSpace),ne=S.colorSpace===Vn||we===ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let ye=S.isCompressedTexture||S.image[0].isCompressedTexture,O=S.image[0]&&S.image[0].isDataTexture,ie=[];for(let Ae=0;Ae<6;Ae++)!ye&&!O?ie[Ae]=x(S.image[Ae],!0,s.maxCubemapSize):ie[Ae]=O?S.image[Ae].image:S.image[Ae],ie[Ae]=Ze(S,ie[Ae]);let $=ie[0],ve=r.convert(S.format,S.colorSpace),de=r.convert(S.type),_e=w(S.internalFormat,ve,de,S.normalized,S.colorSpace),qe=S.isVideoTexture!==!0,ut=xe.__version===void 0||he===!0,ue=re.dataReady,Je=v(S,$);ot(i.TEXTURE_CUBE_MAP,S);let lt;if(S.isDepthTexture){if(_e=m(S.format===Wi,S.type),ut)if(qe)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,_e,$.width,$.height);else for(let Ae=0;Ae<6;Ae++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,_e,$.width,$.height,0,ve,de,null)}else if(ye){qe&&ut&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Je,_e,$.width,$.height);for(let Ae=0;Ae<6;Ae++){lt=ie[Ae].mipmaps;for(let Tt=0;Tt<lt.length;Tt++){let en=lt[Tt];S.format!==Hn?ve!==null?qe?ue&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt,0,0,en.width,en.height,ve,en.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt,_e,en.width,en.height,0,en.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qe?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt,0,0,en.width,en.height,ve,de,en.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt,_e,en.width,en.height,0,ve,de,en.data)}}}else{if(lt=S.mipmaps,qe&&ut){lt.length>0&&Je++;let Ae=Qe(ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Je,_e,Ae.width,Ae.height)}for(let Ae=0;Ae<6;Ae++)if(O){qe?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,0,0,ie[Ae].width,ie[Ae].height,ve,de,ie[Ae].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,_e,ie[Ae].width,ie[Ae].height,0,ve,de,ie[Ae].data);for(let Tt=0;Tt<lt.length;Tt++){let Yi=lt[Tt].image[Ae].image;qe?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt+1,0,0,Yi.width,Yi.height,ve,de,Yi.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt+1,_e,Yi.width,Yi.height,0,ve,de,Yi.data)}}else{qe?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,0,0,ve,de,ie[Ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,_e,ve,de,ie[Ae]);for(let Tt=0;Tt<lt.length;Tt++){let en=lt[Tt];qe?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt+1,0,0,ve,de,en.image[Ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,Tt+1,_e,ve,de,en.image[Ae])}}}M(S)&&S.mipmapsAutoUpdate===!0&&y(i.TEXTURE_CUBE_MAP),xe.__version=re.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Se(R,S,X,he,re,xe){let we=r.convert(X.format,X.colorSpace),ee=r.convert(X.type),ne=w(X.internalFormat,we,ee,X.normalized,X.colorSpace),ye=n.get(S),O=n.get(X);if(O.__renderTarget=S,!ye.__hasExternalTextures){let ie=Math.max(1,S.width>>xe),$=Math.max(1,S.height>>xe);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,xe,ne,ie,$,S.depth,0,we,ee,null):t.texImage2D(re,xe,ne,ie,$,0,we,ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),me(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,he,re,O.__webglTexture,0,pt(S)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,he,re,O.__webglTexture,xe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(R,S,X){if(i.bindRenderbuffer(i.RENDERBUFFER,R),S.depthBuffer){let he=S.depthTexture,re=he&&he.isDepthTexture?he.type:null,xe=m(S.stencilBuffer,re),we=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;me(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt(S),xe,S.width,S.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt(S),xe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xe,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,R)}else{let he=S.textures;for(let re=0;re<he.length;re++){let xe=he[re],we=r.convert(xe.format,xe.colorSpace),ee=r.convert(xe.type),ne=w(xe.internalFormat,we,ee,xe.normalized,xe.colorSpace);me(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt(S),ne,S.width,S.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt(S),ne,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,ne,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(R,S,X){let he=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let re=n.get(S.depthTexture);re.__renderTarget=S;let xe=he?S.depthTexture.image[0]:S.depthTexture.image;(!re.__webglTexture||xe.width!==S.width||xe.height!==S.height)&&(xe.width=S.width,xe.height=S.height,S.depthTexture.needsUpdate=!0),he?Ee(S.depthTexture,0):be(S.depthTexture,0);let we=re.__webglTexture,ee=pt(S),ne=he?i.TEXTURE_CUBE_MAP_POSITIVE_X+X:i.TEXTURE_2D,ye=S.depthTexture.format===Wi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===Ni)me(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ye,ne,we,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,ye,ne,we,0);else if(S.depthTexture.format===Wi)me(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ye,ne,we,0,ee):i.framebufferTexture2D(i.FRAMEBUFFER,ye,ne,we,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function N(R){let S=n.get(R),X=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let he=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),he){let re=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,he.removeEventListener("dispose",re)};he.addEventListener("dispose",re),S.__depthDisposeCallback=re}S.__boundDepthTexture=he}if(R.depthTexture&&!S.__autoAllocateDepthBuffer)if(X)for(let he=0;he<6;he++)Le(S.__webglFramebuffer[he],R,he);else R.texture.mipmaps.length>0?Le(S.__webglFramebuffer[0],R,0):Le(S.__webglFramebuffer,R,0);else if(X){S.__webglDepthbuffer=[];for(let he=0;he<6;he++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[he]),S.__webglDepthbuffer[he]===void 0)S.__webglDepthbuffer[he]=i.createRenderbuffer(),nt(S.__webglDepthbuffer[he],R,!1);else{let re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=S.__webglDepthbuffer[he];i.bindRenderbuffer(i.RENDERBUFFER,xe),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,xe)}}else if(R.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),nt(S.__webglDepthbuffer,R,!1);else{let re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,xe),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,xe)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Z(R,S,X){let he=n.get(R);S!==void 0&&Se(he.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&N(R)}function ae(R){let S=R.texture,X=n.get(R),he=n.get(S);R.addEventListener("dispose",H),F(R);let re=R.textures,xe=R.isWebGLCubeRenderTarget===!0,we=re.length>1;if(we||(he.__webglTexture===void 0&&(he.__webglTexture=i.createTexture()),he.__version=S.version,a.memory.textures++),xe){X.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(S.mipmaps.length>0){X.__webglFramebuffer[ee]=[];for(let ne=0;ne<S.mipmaps.length;ne++)X.__webglFramebuffer[ee][ne]=i.createFramebuffer()}else X.__webglFramebuffer[ee]=i.createFramebuffer()}else{if(S.mipmaps.length>0){X.__webglFramebuffer=[];for(let ee=0;ee<S.mipmaps.length;ee++)X.__webglFramebuffer[ee]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(we)for(let ee=0,ne=re.length;ee<ne;ee++){let ye=n.get(re[ee]);ye.__webglTexture===void 0&&(ye.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&me(R)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let ee=0;ee<re.length;ee++){let ne=re[ee];X.__webglColorRenderbuffer[ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[ee]);let ye=r.convert(ne.format,ne.colorSpace),O=r.convert(ne.type),ie=w(ne.internalFormat,ye,O,ne.normalized,ne.colorSpace,R.isXRRenderTarget===!0),$=pt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,$,ie,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ee,i.RENDERBUFFER,X.__webglColorRenderbuffer[ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),nt(X.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(xe){t.bindTexture(i.TEXTURE_CUBE_MAP,he.__webglTexture),ot(i.TEXTURE_CUBE_MAP,S);for(let ee=0;ee<6;ee++)if(S.mipmaps.length>0)for(let ne=0;ne<S.mipmaps.length;ne++)Se(X.__webglFramebuffer[ee][ne],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ne);else Se(X.__webglFramebuffer[ee],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);M(S)?y(i.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}else if(we){for(let ee=0,ne=re.length;ee<ne;ee++){let ye=re[ee],O=n.get(ye),ie=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ie=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,O.__webglTexture),ot(ie,ye),Se(X.__webglFramebuffer,R,ye,i.COLOR_ATTACHMENT0+ee,ie,0),M(ye)&&y(ie)}t.unbindTexture()}else{let ee=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ee=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,he.__webglTexture),ot(ee,S),S.mipmaps.length>0)for(let ne=0;ne<S.mipmaps.length;ne++)Se(X.__webglFramebuffer[ne],R,S,i.COLOR_ATTACHMENT0,ee,ne);else Se(X.__webglFramebuffer,R,S,i.COLOR_ATTACHMENT0,ee,0);M(S)?y(ee):S.mipmaps.length>0&&i.texParameteri(ee,i.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),t.unbindTexture()}R.depthBuffer&&N(R)}function D(R){let S=R.textures;for(let X=0,he=S.length;X<he;X++){let re=S[X];if(M(re)&&re.mipmapsAutoUpdate===!0){let xe=A(R),we=n.get(re).__webglTexture;t.bindTexture(xe,we),y(xe),t.unbindTexture()}}}let He=[];function Fe(R){if(R.samples>0){if(me(R)===!1){let S=R.textures,X=R.width,he=R.height,re=i.COLOR_BUFFER_BIT,xe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(R),ee=S.length>1;if(ee)for(let ye=0;ye<S.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),R.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ye=0;ye<S.length;ye++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[ye]);let O=n.get(S[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,O,0)}i.blitFramebuffer(0,0,X,he,0,0,X,he,re,i.NEAREST),l===!0&&(He.length=0,He.push(i.COLOR_ATTACHMENT0+ye),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&He.push(xe),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,He))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ee)for(let ye=0;ye<S.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,we.__webglColorRenderbuffer[ye]);let O=n.get(S[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,O,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let S=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function pt(R){return Math.min(s.maxSamples,R.samples)}function me(R){let S=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Gt(R){let S=a.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function Ze(R,S){let X=R.colorSpace,he=R.format,re=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||X!==_n&&X!==Vn&&(mt.getTransfer(X)===St?(he!==Hn||re!==En)&&ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",X)),S}function Qe(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=We,this.resetTextureUnits=W,this.getTextureUnits=K,this.setTextureUnits=ce,this.setTexture2D=be,this.setTexture2DArray=Ce,this.setTexture3D=je,this.setTextureCube=Ee,this.rebindTextures=Z,this.setupRenderTarget=ae,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Fe,this.setupDepthRenderbuffer=N,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=me,this.dispose=T}function Tv(i,e){function t(n,s=Vn){let r,a=mt.getTransfer(s);if(n===En)return i.UNSIGNED_BYTE;if(n===Vc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Wc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===au)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ou)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===su)return i.BYTE;if(n===ru)return i.SHORT;if(n===Ur)return i.UNSIGNED_SHORT;if(n===Hc)return i.INT;if(n===ii)return i.UNSIGNED_INT;if(n===Fn)return i.FLOAT;if(n===si)return i.HALF_FLOAT;if(n===cu)return i.ALPHA;if(n===lu)return i.RGB;if(n===Hn)return i.RGBA;if(n===Ni)return i.DEPTH_COMPONENT;if(n===Wi)return i.DEPTH_STENCIL;if(n===qc)return i.RED;if(n===Xc)return i.RED_INTEGER;if(n===hs)return i.RG;if(n===jc)return i.RG_INTEGER;if(n===Kc)return i.RGBA_INTEGER;if(n===Za||n===$a||n===Qa||n===eo)if(a===St)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Za)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Za)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jc||n===Yc||n===Zc||n===$c)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Jc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Yc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$c)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Qc||n===el||n===tl||n===nl||n===il||n===to||n===sl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Qc||n===el)return a===St?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===tl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===nl)return r.COMPRESSED_R11_EAC;if(n===il)return r.COMPRESSED_SIGNED_R11_EAC;if(n===to)return r.COMPRESSED_RG11_EAC;if(n===sl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===rl||n===al||n===ol||n===cl||n===ll||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===bl||n===xl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===rl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===al)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ol)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===cl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ll)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===hl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ul)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===dl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ml)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===gl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===xl)return a===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_l||n===yl||n===vl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===_l)return a===St?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===yl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===vl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ml||n===Sl||n===no||n===wl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ml)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Sl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===no)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===wl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ws?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Ev=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Av=`
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

}`,ku=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Da(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new mi({vertexShader:Ev,fragmentShader:Av,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ut(new yt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bu=class extends ei{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null,_=typeof XRWebGLBinding<"u",b=new ku,p={},x=t.getContextAttributes(),M=null,y=null,A=[],w=[],m=new le,v=null,F=null,L=new Kt;L.viewport=new At;let U=new Kt;U.viewport=new At;let H=[L,U],J=new Fc,k=null,T=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let be=A[Q];return be===void 0&&(be=new xr,A[Q]=be),be.getTargetRaySpace()},this.getControllerGrip=function(Q){let be=A[Q];return be===void 0&&(be=new xr,A[Q]=be),be.getGripSpace()},this.getHand=function(Q){let be=A[Q];return be===void 0&&(be=new xr,A[Q]=be),be.getHandSpace()};function I(Q){let be=w.indexOf(Q.inputSource);if(be===-1)return;let Ce=A[be];Ce!==void 0&&(Ce.update(Q.inputSource,Q.frame,c||a),Ce.dispatchEvent({type:Q.type,data:Q.inputSource}))}function C(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",C),s.removeEventListener("inputsourceschange",V);for(let Q=0;Q<A.length;Q++){let be=w[Q];be!==null&&(w[Q]=null,A[Q].disconnect(be))}k=null,T=null,b.reset();for(let Q in p)delete p[Q];if(e.setRenderTarget(M),d=null,f=null,u=null,s=null,y=null,We.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(m.width,m.height,!1),F!==null){let Q=F.camera;Q.fov=F.fov,Q.zoom=F.zoom,Q.updateProjectionMatrix(),F=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",C),s.addEventListener("inputsourceschange",V),x.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(m),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ce=null,je=null,Ee=null;x.depth&&(Ee=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ce=x.stencil?Wi:Ni,je=x.stencil?Ws:ii);let Ke={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ke),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new Ln(f.textureWidth,f.textureHeight,{format:Hn,type:En,depthTexture:new Oi(f.textureWidth,f.textureHeight,je,void 0,void 0,void 0,void 0,void 0,void 0,Ce),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let Ce={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,Ce),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new Ln(d.framebufferWidth,d.framebufferHeight,{format:Hn,type:En,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),We.setContext(s),We.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function V(Q){for(let be=0;be<Q.removed.length;be++){let Ce=Q.removed[be],je=w.indexOf(Ce);je>=0&&(w[je]=null,A[je].disconnect(Ce))}for(let be=0;be<Q.added.length;be++){let Ce=Q.added[be],je=w.indexOf(Ce);if(je===-1){for(let Ke=0;Ke<A.length;Ke++)if(Ke>=w.length){w.push(Ce),je=Ke;break}else if(w[Ke]===null){w[Ke]=Ce,je=Ke;break}if(je===-1)break}let Ee=A[je];Ee&&Ee.connect(Ce)}}function G(Q,be){be===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(be.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let be=Q.near,Ce=Q.far;b.texture!==null&&(b.depthNear>0&&(be=b.depthNear),b.depthFar>0&&(Ce=b.depthFar)),J.near=U.near=L.near=be,J.far=U.far=L.far=Ce,(k!==J.near||T!==J.far)&&(s.updateRenderState({depthNear:J.near,depthFar:J.far}),k=J.near,T=J.far),J.layers.mask=Q.layers.mask|6,L.layers.mask=J.layers.mask&-5,U.layers.mask=J.layers.mask&-3;let je=Q.parent,Ee=J.cameras;G(J,je);for(let Ke=0;Ke<Ee.length;Ke++)G(Ee[Ke],je);J.projectionMatrix.copy(L.projectionMatrix),J.projectionMatrixInverse.copy(L.projectionMatrixInverse),F===null&&Q.isPerspectiveCamera&&(F={camera:Q,fov:Q.fov,zoom:Q.zoom}),W(Q,J,je)};function W(Q,be,Ce){Ce===null?Q.matrix.copy(be.matrixWorld):(Q.matrix.copy(Ce.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(be.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(be.projectionMatrix),Q.projectionMatrixInverse.copy(be.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Ps*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Q)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(J)},this.getCameraTexture=function(Q){return p[Q]};let K=null;function ce(Q,be){if(h=be.getViewerPose(c||a),g=be,h!==null){let Ce=h.views;d!==null&&(e.setRenderTargetFramebuffer(y,d.framebuffer),e.setRenderTarget(y));let je=!1;Ce.length!==J.cameras.length&&(J.cameras.length=0,je=!0);for(let Ye=0;Ye<Ce.length;Ye++){let ot=Ce[Ye],ct=null;if(d!==null)ct=d.getViewport(ot);else{let pe=u.getViewSubImage(f,ot);ct=pe.viewport,Ye===0&&(e.setRenderTargetTextures(y,pe.colorTexture,pe.depthStencilTexture),e.setRenderTarget(y))}let se=H[Ye];se===void 0&&(se=new Kt,se.layers.enable(Ye),se.viewport=new At,H[Ye]=se),se.matrix.fromArray(ot.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(ot.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(ct.x,ct.y,ct.width,ct.height),Ye===0&&(J.matrix.copy(se.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),je===!0&&J.cameras.push(se)}let Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let Ye=u.getDepthInformation(Ce[0]);Ye&&Ye.isValid&&Ye.texture&&b.init(Ye,s.renderState)}if(Ee&&Ee.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ye=0;Ye<Ce.length;Ye++){let ot=Ce[Ye].camera;if(ot){let ct=p[ot];ct||(ct=new Da,p[ot]=ct);let se=u.getCameraImage(ot);ct.sourceTexture=se}}}}for(let Ce=0;Ce<A.length;Ce++){let je=w[Ce],Ee=A[Ce];je!==null&&Ee!==void 0&&Ee.update(je,be,c||a)}K&&K(Q,be),be.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:be}),g=null}let We=new rm;We.setAnimationLoop(ce),this.setAnimationLoop=function(Q){K=Q},this.dispose=function(){}}},Rv=new et,mm=new tt;mm.set(-1,0,0,0,1,0,0,0,1);function Cv(i,e){function t(b,p){b.matrixAutoUpdate===!0&&b.updateMatrix(),p.value.copy(b.matrix)}function n(b,p){p.color.getRGB(b.fogColor.value,vu(i)),p.isFog?(b.fogNear.value=p.near,b.fogFar.value=p.far):p.isFogExp2&&(b.fogDensity.value=p.density)}function s(b,p,x,M,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(b,p):p.isMeshLambertMaterial?(r(b,p),p.envMap&&(b.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(b,p),u(b,p)):p.isMeshPhongMaterial?(r(b,p),h(b,p),p.envMap&&(b.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(b,p),f(b,p),p.isMeshPhysicalMaterial&&d(b,p,y)):p.isMeshMatcapMaterial?(r(b,p),g(b,p)):p.isMeshDepthMaterial?r(b,p):p.isMeshDistanceMaterial?(r(b,p),_(b,p)):p.isMeshNormalMaterial?r(b,p):p.isLineBasicMaterial?(a(b,p),p.isLineDashedMaterial&&o(b,p)):p.isPointsMaterial?l(b,p,x,M):p.isSpriteMaterial?c(b,p):p.isShadowMaterial?(b.color.value.copy(p.color),b.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(b,p){b.opacity.value=p.opacity,p.color&&b.diffuse.value.copy(p.color),p.emissive&&b.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(b.map.value=p.map,t(p.map,b.mapTransform)),p.alphaMap&&(b.alphaMap.value=p.alphaMap,t(p.alphaMap,b.alphaMapTransform)),p.bumpMap&&(b.bumpMap.value=p.bumpMap,t(p.bumpMap,b.bumpMapTransform),b.bumpScale.value=p.bumpScale,p.side===on&&(b.bumpScale.value*=-1)),p.normalMap&&(b.normalMap.value=p.normalMap,t(p.normalMap,b.normalMapTransform),b.normalScale.value.copy(p.normalScale),p.side===on&&b.normalScale.value.negate()),p.displacementMap&&(b.displacementMap.value=p.displacementMap,t(p.displacementMap,b.displacementMapTransform),b.displacementScale.value=p.displacementScale,b.displacementBias.value=p.displacementBias),p.emissiveMap&&(b.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,b.emissiveMapTransform)),p.specularMap&&(b.specularMap.value=p.specularMap,t(p.specularMap,b.specularMapTransform)),p.alphaTest>0&&(b.alphaTest.value=p.alphaTest);let x=e.get(p),M=x.envMap,y=x.envMapRotation;M&&(b.envMap.value=M,b.envMapRotation.value.setFromMatrix4(Rv.makeRotationFromEuler(y)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&b.envMapRotation.value.premultiply(mm),b.reflectivity.value=p.reflectivity,b.ior.value=p.ior,b.refractionRatio.value=p.refractionRatio),p.lightMap&&(b.lightMap.value=p.lightMap,b.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,b.lightMapTransform)),p.aoMap&&(b.aoMap.value=p.aoMap,b.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,b.aoMapTransform))}function a(b,p){b.diffuse.value.copy(p.color),b.opacity.value=p.opacity,p.map&&(b.map.value=p.map,t(p.map,b.mapTransform))}function o(b,p){b.dashSize.value=p.dashSize,b.totalSize.value=p.dashSize+p.gapSize,b.scale.value=p.scale}function l(b,p,x,M){b.diffuse.value.copy(p.color),b.opacity.value=p.opacity,b.size.value=p.size*x,b.scale.value=M*.5,p.map&&(b.map.value=p.map,t(p.map,b.uvTransform)),p.alphaMap&&(b.alphaMap.value=p.alphaMap,t(p.alphaMap,b.alphaMapTransform)),p.alphaTest>0&&(b.alphaTest.value=p.alphaTest)}function c(b,p){b.diffuse.value.copy(p.color),b.opacity.value=p.opacity,b.rotation.value=p.rotation,p.map&&(b.map.value=p.map,t(p.map,b.mapTransform)),p.alphaMap&&(b.alphaMap.value=p.alphaMap,t(p.alphaMap,b.alphaMapTransform)),p.alphaTest>0&&(b.alphaTest.value=p.alphaTest)}function h(b,p){b.specular.value.copy(p.specular),b.shininess.value=Math.max(p.shininess,1e-4)}function u(b,p){p.gradientMap&&(b.gradientMap.value=p.gradientMap)}function f(b,p){b.metalness.value=p.metalness,p.metalnessMap&&(b.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,b.metalnessMapTransform)),b.roughness.value=p.roughness,p.roughnessMap&&(b.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,b.roughnessMapTransform)),p.envMap&&(b.envMapIntensity.value=p.envMapIntensity)}function d(b,p,x){b.ior.value=p.ior,p.diffuseRoughness>0&&(b.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(b.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,b.diffuseRoughnessMapTransform))),p.sheen>0&&(b.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),b.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(b.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,b.sheenColorMapTransform)),p.sheenRoughnessMap&&(b.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,b.sheenRoughnessMapTransform))),p.clearcoat>0&&(b.clearcoat.value=p.clearcoat,b.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(b.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,b.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(b.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,b.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(b.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,b.clearcoatNormalMapTransform),b.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===on&&b.clearcoatNormalScale.value.negate())),p.dispersion>0&&(b.dispersion.value=p.dispersion),p.retroreflectivity>0&&(b.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(b.iridescence.value=p.iridescence,b.iridescenceIOR.value=p.iridescenceIOR,b.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,b.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(b.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,b.iridescenceMapTransform)),p.iridescenceThicknessMap&&(b.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,b.iridescenceThicknessMapTransform))),p.transmission>0&&(b.transmission.value=p.transmission,b.transmissionSamplerMap.value=x.texture,b.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(b.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,b.transmissionMapTransform)),b.thickness.value=p.thickness,p.thicknessMap&&(b.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,b.thicknessMapTransform)),b.attenuationDistance.value=p.attenuationDistance,b.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(b.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(b.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,b.anisotropyMapTransform))),b.specularIntensity.value=p.specularIntensity,b.specularColor.value.copy(p.specularColor),p.specularColorMap&&(b.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,b.specularColorMapTransform)),p.specularIntensityMap&&(b.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,b.specularIntensityMapTransform))}function g(b,p){p.matcap&&(b.matcap.value=p.matcap)}function _(b,p){let x=e.get(p).light;b.referencePosition.value.setFromMatrixPosition(x.matrixWorld),b.nearDistance.value=x.shadow.camera.near,b.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pv(i,e,t,n){let s={},r={};function a(x,M){let y=M.program;n.uniformBlockBinding(x,y,s[x.id])}function o(x,M){let y=s[x.id];y===void 0&&(g(x),y=l(x),s[x.id]=y,x.addEventListener("dispose",b));let A=M.program;n.updateUBOMapping(x,A);let w=e.render.frame;r[x.id]!==w&&(c(x),r[x.id]=w)}function l(x){let M=i.createBuffer(),y=x.__size,A=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,y,A),i.bindBuffer(i.UNIFORM_BUFFER,null),M}function c(x){let M=s[x.id],y=x.uniforms,A=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let w=0,m=y.length;w<m;w++){let v=y[w];if(Array.isArray(v))for(let F=0,L=v.length;F<L;F++)h(v[F],w,F,A);else h(v,w,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(x,M,y,A){if(f(x,M,y,A)===!0){let w=x.__offset,m=x.value;if(Array.isArray(m)){let v=0;for(let F=0;F<m.length;F++){let L=m[F],U=_(L,!0);u(L,x.__data,v),v+=U.storage/Float32Array.BYTES_PER_ELEMENT}}else u(m,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,w,x.__data)}}function u(x,M,y){typeof x=="number"||typeof x=="boolean"?M[y]=x:x.isMatrix3?(M[y]=x.elements[0],M[y+1]=x.elements[1],M[y+2]=x.elements[2],M[y+3]=0,M[y+4]=x.elements[3],M[y+5]=x.elements[4],M[y+6]=x.elements[5],M[y+7]=0,M[y+8]=x.elements[6],M[y+9]=x.elements[7],M[y+10]=x.elements[8],M[y+11]=0):ArrayBuffer.isView(x)?M.set(x.subarray(0,M.length-y),y):x.toArray(M,y)}function f(x,M,y,A){let w=x.value,m=M+"_"+y;if(Array.isArray(w)){A[m]===void 0&&(A[m]=[]);let v=A[m],F=!1;for(let L=0;L<w.length;L++)d(w[L],v,L)===!0&&(F=!0);return F}return d(w,A,m)}function d(x,M,y){if(M[y]===void 0)return typeof x=="number"||typeof x=="boolean"?M[y]=x:ArrayBuffer.isView(x)?M[y]=x.slice():M[y]=x.clone(),!0;{let A=M[y];if(typeof x=="number"||typeof x=="boolean"){if(A!==x)return M[y]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(A.equals(x)===!1)return A.copy(x),!0}}return!1}function g(x){let M=x.uniforms,y=0,A=16;for(let m=0,v=M.length;m<v;m++){let F=Array.isArray(M[m])?M[m]:[M[m]];for(let L=0,U=F.length;L<U;L++){let H=F[L],J=Array.isArray(H.value)?H.value:[H.value],k=Array.isArray(M[m])||Array.isArray(H.value),T=y;for(let C=0,V=J.length;C<V;C++){let G=J[C],W=_(G,k),K=y%A,ce=K%W.boundary,We=K+ce;y+=ce,We!==0&&A-We<W.storage&&(y+=A-We),C===0&&(T=y),y+=W.storage}let I=H.type==="int"?Int32Array:H.type==="uint"?Uint32Array:Float32Array;H.__data=new I((y-T)/Float32Array.BYTES_PER_ELEMENT),H.__offset=T}}let w=y%A;return w>0&&(y+=A-w),x.__size=y,x.__cache={},this}function _(x,M){let y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=16,y.storage=48):x.isMatrix4?(y.boundary=16,y.storage=64):x.isTexture?ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(y.boundary=16,y.storage=x.byteLength):ze("WebGLRenderer: Unsupported uniform value type.",x),M===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function b(x){let M=x.target;M.removeEventListener("dispose",b),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(let x in s)i.deleteBuffer(s[x]);s={},r={}}return{bind:a,update:o,dispose:p}}var Iv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),yi=null;function Lv(){return yi===null&&(yi=new Mr(Iv,16,16,hs,si),yi.name="DFG_LUT",yi.minFilter=Jt,yi.magFilter=Jt,yi.wrapS=rn,yi.wrapT=rn,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}var Ll=class{constructor(e={}){let{canvas:t=Ep(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=En}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let _=d,b=new Set([Kc,jc,Xc]),p=new Set([En,ii,Ur,Ws,Vc,Wc]),x=new Uint32Array(4),M=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},A=null,w=null,m=[],v=[],F=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=_i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,U=!1,H=null,J=null,k=null,T=null;this._outputColorSpace=Nt;let I=0,C=0,V=null,G=-1,W=null,K=new At,ce=new At,We=null,Q=new Xe(0),be=0,Ce=t.width,je=t.height,Ee=1,Ke=null,Pt=null,Ye=new At(0,0,Ce,je),ot=new At(0,0,Ce,je),ct=!1,se=new rs,pe=new gc,fe=!1,Pe=!1,Se=new et,nt=new B,Le=new At,N={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Z=!1;function ae(){return V===null?Ee:1}let D=n;function He(E,z){return t.getContext(E,z)}let Fe,pt,me,Gt,Ze,Qe,R,S,X,he,re,xe,we,ee,ne,ye,O,ie,$,ve,de,_e,qe;try{let E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",Je,!1),t.addEventListener("webglcontextrestored",lt,!1),t.addEventListener("webglcontextcreationerror",Ae,!1),D===null){let z="webgl2";if(D=He(z,E),D===null)throw He(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ut()}catch(E){throw t.removeEventListener("webglcontextlost",Je,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),$e("WebGLRenderer: "+E.message),E}function ut(){Fe=new V_(D),Fe.init(),de=new Tv(D,Fe),pt=new L_(D,Fe,e,de),me=new Sv(D,Fe),pt.reversedDepthBuffer&&f&&me.buffers.depth.setReversed(!0),J=D.createFramebuffer(),k=D.createFramebuffer(),T=D.createFramebuffer(),Gt=new X_(D),Ze=new lv,Qe=new wv(D,Fe,me,Ze,pt,de,Gt),R=new H_(L),S=new Kg(D),_e=new P_(D,S),X=new W_(D,S,Gt,_e),he=new K_(D,X,S,_e,Gt),ie=new j_(D,pt,Qe),ne=new D_(Ze),re=new cv(L,R,Fe,pt,_e,ne),xe=new Cv(L,Ze),we=new uv,ee=new bv(Fe),O=new C_(L,R,me,he,g,l),ye=new Mv(L,he,pt),qe=new Pv(D,Gt,pt,me),$=new I_(D,Fe,Gt),ve=new q_(D,Fe,Gt),Gt.programs=re.programs,L.capabilities=pt,L.extensions=Fe,L.properties=Ze,L.renderLists=we,L.shadowMap=ye,L.state=me,L.info=Gt}_!==En&&(F=new Y_(_,t.width,t.height,o,s,r));let ue=new Bu(L,D);this.xr=ue,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=Fe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Fe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Ee},this.setPixelRatio=function(E){E!==void 0&&(Ee=E,this.setSize(Ce,je,!1))},this.getSize=function(E){return E.set(Ce,je)},this.setSize=function(E,z,Y=!0){if(ue.isPresenting){ze("WebGLRenderer: Can't change size while VR device is presenting.");return}Ce=E,je=z,t.width=Math.floor(E*Ee),t.height=Math.floor(z*Ee),Y===!0&&(t.style.width=E+"px",t.style.height=z+"px"),F!==null&&F.setSize(t.width,t.height),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(Ce*Ee,je*Ee).floor()},this.setDrawingBufferSize=function(E,z,Y){Ce=E,je=z,Ee=Y,t.width=Math.floor(E*Y),t.height=Math.floor(z*Y),this.setViewport(0,0,E,z)},this.setEffects=function(E){if(_===En){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let z=0;z<E.length;z++)if(E[z].isOutputPass===!0){ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}F.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(K)},this.getViewport=function(E){return E.copy(Ye)},this.setViewport=function(E,z,Y,q){E.isVector4?Ye.set(E.x,E.y,E.z,E.w):Ye.set(E,z,Y,q),me.viewport(K.copy(Ye).multiplyScalar(ae()).round())},this.getScissor=function(E){return E.copy(ot)},this.setScissor=function(E,z,Y,q){E.isVector4?ot.set(E.x,E.y,E.z,E.w):ot.set(E,z,Y,q),me.scissor(ce.copy(ot).multiplyScalar(ae()).round())},this.getScissorTest=function(){return ct},this.setScissorTest=function(E){me.setScissorTest(ct=E)},this.setOpaqueSort=function(E){Ke=E},this.setTransparentSort=function(E){Pt=E},this.getClearColor=function(E){return E.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor(...arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha(...arguments)},this.clear=function(E=!0,z=!0,Y=!0){let q=0;if(E){let j=!1;if(V!==null){let Te=V.texture.format;j=b.has(Te)}if(j){let Te=V.texture.type,Ne=p.has(Te),Me=O.getClearColor(),Ie=O.getClearAlpha(),Be=Me.r,st=Me.g,xt=Me.b;Ne?(x[0]=Be,x[1]=st,x[2]=xt,x[3]=Ie,D.clearBufferuiv(D.COLOR,0,x)):(M[0]=Be,M[1]=st,M[2]=xt,M[3]=Ie,D.clearBufferiv(D.COLOR,0,M))}else q|=D.COLOR_BUFFER_BIT}z&&(q|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(q|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&D.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),H=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Je,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),O.dispose(),we.dispose(),ee.dispose(),Qe.dispose(),Ze.dispose(),R.dispose(),he.dispose(),X.dispose(),_e.dispose(),qe.dispose(),re.dispose(),ue.dispose(),ue.removeEventListener("sessionstart",Gd),ue.removeEventListener("sessionend",Hd),xs.stop()};function Je(E){E.preventDefault(),xa("WebGLRenderer: Context Lost."),U=!0}function lt(){xa("WebGLRenderer: Context Restored."),U=!1;let E=Gt.autoReset,z=ye.enabled,Y=ye.autoUpdate,q=ye.needsUpdate,j=ye.type;ut(),Gt.autoReset=E,ye.enabled=z,ye.autoUpdate=Y,ye.needsUpdate=q,ye.type=j}function Ae(E){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Tt(E){let z=E.target;z.removeEventListener("dispose",Tt),en(z)}function en(E){Yi(E),Ze.remove(E)}function Yi(E){let z=Ze.get(E).programs;z!==void 0&&(z.forEach(function(Y){re.releaseProgram(Y)}),E.isShaderMaterial&&re.releaseShaderCache(E))}this.renderBufferDirect=function(E,z,Y,q,j,Te){z===null&&(z=N);let Ne=j.isMesh&&j.matrixWorld.determinantAffine()<0,Me=p0(E,z,Y,q,j);me.setMaterial(q,Ne);let Ie=Y.index,Be=1;if(q.wireframe===!0){if(Ie=X.getWireframeAttribute(Y),Ie===void 0)return;Be=2}let st=Y.drawRange,xt=Y.attributes.position,Ue=st.start*Be,_t=(st.start+st.count)*Be;Te!==null&&(Ue=Math.max(Ue,Te.start*Be),_t=Math.min(_t,(Te.start+Te.count)*Be)),Ie!==null?(Ue=Math.max(Ue,0),_t=Math.min(_t,Ie.count)):xt!=null&&(Ue=Math.max(Ue,0),_t=Math.min(_t,xt.count));let Wt=_t-Ue;if(Wt<0||Wt===1/0)return;_e.setup(j,q,Me,Y,Ie);let Lt,It=$;if(Ie!==null&&(Lt=S.get(Ie),It=ve,It.setIndex(Lt)),j.isMesh)q.wireframe===!0?(me.setLineWidth(q.wireframeLinewidth*ae()),It.setMode(D.LINES)):It.setMode(D.TRIANGLES);else if(j.isLine){let hn=q.linewidth;hn===void 0&&(hn=1),me.setLineWidth(hn*ae()),j.isLineSegments?It.setMode(D.LINES):j.isLineLoop?It.setMode(D.LINE_LOOP):It.setMode(D.LINE_STRIP)}else j.isPoints?It.setMode(D.POINTS):j.isSprite&&It.setMode(D.TRIANGLES);if(j.isBatchedMesh)if(Fe.get("WEBGL_multi_draw"))It.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{let hn=j._multiDrawStarts,Oe=j._multiDrawCounts,bn=j._multiDrawCount,Mt=Ie?S.get(Ie).bytesPerElement:1,_s=Ze.get(q).currentProgram.getUniforms();for(let un=0;un<bn;un++)_s.setValue(D,"_gl_DrawID",un),It.render(hn[un]/Mt,Oe[un])}else if(j.isInstancedMesh)It.renderInstances(Ue,Wt,j.count);else if(Y.isInstancedBufferGeometry){let hn=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Oe=Math.min(Y.instanceCount,hn);It.renderInstances(Ue,Wt,Oe)}else It.render(Ue,Wt)};function zd(E,z,Y,q){H!==null&&E.isNodeMaterial&&H.setObject(q,E),fe===!0&&ne.setState(E,Y,!1),E.transparent===!0&&E.side===Ot&&E.forceSinglePass===!1?(E.side=on,E.needsUpdate=!0,ta(E,z,q),E.side=xi,E.needsUpdate=!0,ta(E,z,q),E.side=Ot):ta(E,z,q)}this.compile=function(E,z,Y=null){Y===null&&(Y=E),H!==null&&H.renderStart(E,z,Y),w=ee.get(Y),w.init(z),v.push(w),Y.traverseVisible(function(j){j.isLight&&j.layers.test(z.layers)&&(w.pushLight(j),j.castShadow&&w.pushShadow(j))}),E!==Y&&E.traverseVisible(function(j){j.isLight&&j.layers.test(z.layers)&&(w.pushLight(j),j.castShadow&&w.pushShadow(j))}),w.setupLights(),H!==null&&H.updateLights(w.state.lightsArray),Pe=this.localClippingEnabled,fe=ne.init(this.clippingPlanes,Pe),fe===!0&&ne.setGlobalState(this.clippingPlanes,z),H!==null&&ye.render(w.state.shadowsArray,Y,z);let q=new Set;return E.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;let Te=j.material;if(Te)if(Array.isArray(Te))for(let Ne=0;Ne<Te.length;Ne++){let Me=Te[Ne];zd(Me,Y,z,j),q.add(Me)}else zd(Te,Y,z,j),q.add(Te)}),w=v.pop(),H!==null&&H.renderEnd(),q},this.compileAsync=function(E,z,Y=null){let q=this.compile(E,z,Y);return new Promise(j=>{function Te(){if(q.forEach(function(Ne){let Ie=Ze.get(Ne).currentProgram;(Ie===void 0||Ie.isReady())&&q.delete(Ne)}),q.size===0){j(E);return}setTimeout(Te,10)}Fe.get("KHR_parallel_shader_compile")!==null?Te():setTimeout(Te,10)})};let ih=null;function d0(E){ih&&ih(E)}function Gd(){xs.stop()}function Hd(){xs.start()}let xs=new rm;xs.setAnimationLoop(d0),typeof self<"u"&&xs.setContext(self),this.setAnimationLoop=function(E){ih=E,ue.setAnimationLoop(E),E===null?xs.stop():xs.start()},ue.addEventListener("sessionstart",Gd),ue.addEventListener("sessionend",Hd),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;H!==null&&H.renderStart(E,z);let Y=ue.enabled===!0&&ue.isPresenting===!0,q=F!==null&&(V===null||Y)&&F.begin(L,V);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),ue.enabled===!0&&ue.isPresenting===!0&&(F===null||F.isCompositing()===!1)&&(ue.cameraAutoUpdate===!0&&ue.updateCamera(z),z=ue.getCamera()),E.isScene===!0&&E.onBeforeRender(L,E,z,V),w=ee.get(E,v.length),w.init(z),w.state.textureUnits=Qe.getTextureUnits(),v.push(w),Se.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),z.isArrayCamera?pe.setFromArrayCamera(z):se.setFromProjectionMatrix(Se,Bn,z.reversedDepth),Pe=this.localClippingEnabled,fe=ne.init(this.clippingPlanes,Pe),A=we.get(E,m.length),A.init(),m.push(A),this.info.render.frame++,ue.enabled===!0&&ue.isPresenting===!0){let Ne=L.xr.getDepthSensingMesh();Ne!==null&&sh(Ne,z,-1/0,L.sortObjects)}sh(E,z,0,L.sortObjects),A.finish(),H!==null&&H.updateLights(w.state.lightsArray),L.sortObjects===!0&&A.sort(Ke,Pt),Z=ue.enabled===!1||ue.isPresenting===!1||ue.hasDepthSensing()===!1,Z&&O.addToRenderList(A,E),this.info.autoReset===!0&&this.info.reset(),fe===!0&&ne.beginShadows();let j=w.state.shadowsArray;if(ye.render(j,E,z),fe===!0&&ne.endShadows(),(q&&F.hasRenderPass())===!1){let Ne=A.opaque,Me=A.transmissive;if(w.setupLights(),z.isArrayCamera){let Ie=z.cameras;if(Me.length>0)for(let Be=0,st=Ie.length;Be<st;Be++){let xt=Ie[Be];Wd(Ne,Me,E,xt)}Z&&O.render(E);for(let Be=0,st=Ie.length;Be<st;Be++){let xt=Ie[Be];Vd(A,E,xt,xt.viewport)}}else Me.length>0&&Wd(Ne,Me,E,z),Z&&O.render(E),Vd(A,E,z)}V!==null&&C===0&&(Qe.updateMultisampleRenderTarget(V),Qe.updateRenderTargetMipmap(V)),q&&F.end(L),E.isScene===!0&&E.onAfterRender(L,E,z),_e.resetDefaultState(),G=-1,W=null,v.pop(),v.length>0?(w=v[v.length-1],Qe.setTextureUnits(w.state.textureUnits),fe===!0&&ne.setGlobalState(L.clippingPlanes,w.state.camera)):w=null,m.pop(),m.length>0?A=m[m.length-1]:A=null,H!==null&&H.renderEnd()};function sh(E,z,Y,q){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLight)w.pushLight(E),E.castShadow&&w.pushShadow(E);else if(E.isSprite){let Ne=z.isArrayCamera?pe:se;if(!E.frustumCulled||E.intersectsFrustum(Ne)){q&&Le.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Se);let Me=he.update(E),Ie=E.material;Ie.visible&&A.push(E,Me,Ie,Y,Le.z,null,z)}}else if(E.isMesh||E.isLine||E.isPoints){let Ne=z.isArrayCamera?pe:se;if(!E.frustumCulled||E.intersectsFrustum(Ne)){let Me=he.update(E),Ie=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Le.copy(E.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Le.copy(Me.boundingSphere.center)),Le.applyMatrix4(E.matrixWorld).applyMatrix4(Se)),Array.isArray(Ie)){let Be=Me.groups;for(let st=0,xt=Be.length;st<xt;st++){let Ue=Be[st],_t=Ie[Ue.materialIndex];_t&&_t.visible&&A.push(E,Me,_t,Y,Le.z,Ue,z)}}else Ie.visible&&A.push(E,Me,Ie,Y,Le.z,null,z)}}}let Te=E.children;for(let Ne=0,Me=Te.length;Ne<Me;Ne++)sh(Te[Ne],z,Y,q)}function Vd(E,z,Y,q){let{opaque:j,transmissive:Te,transparent:Ne}=E;w.setupLightsView(Y),fe===!0&&ne.setGlobalState(L.clippingPlanes,Y),q&&me.viewport(K.copy(q)),j.length>0&&Co(j,z,Y),Te.length>0&&Co(Te,z,Y),Ne.length>0&&Co(Ne,z,Y),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function Wd(E,z,Y,q){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[q.id]===void 0){let Ue=Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[q.id]=new Ln(1,1,{generateMipmaps:!0,type:Ue?si:En,minFilter:Gn,samples:Math.max(4,pt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:mt.workingColorSpace})}let Te=w.state.transmissionRenderTarget[q.id],Ne=q.viewport||K;Te.setSize(Ne.z*L.transmissionResolutionScale,Ne.w*L.transmissionResolutionScale);let Me=L.getRenderTarget(),Ie=L.getActiveCubeFace(),Be=L.getActiveMipmapLevel();L.setRenderTarget(Te),L.getClearColor(Q),be=L.getClearAlpha(),be<1&&L.setClearColor(16777215,.5),L.clear(),Z&&O.render(Y);let st=L.toneMapping;L.toneMapping=_i;let xt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),w.setupLightsView(q),fe===!0&&ne.setGlobalState(L.clippingPlanes,q),Co(E,Y,q),Qe.updateMultisampleRenderTarget(Te),Qe.updateRenderTargetMipmap(Te),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let _t=0,Wt=z.length;_t<Wt;_t++){let Lt=z[_t],{object:It,geometry:hn,material:Oe,group:bn}=Lt;if(Oe.side===Ot&&It.layers.test(q.layers)){let Mt=Oe.side;Oe.side=on,Oe.needsUpdate=!0,qd(It,Y,q,hn,Oe,bn),Oe.side=Mt,Oe.needsUpdate=!0,Ue=!0}}Ue===!0&&(Qe.updateMultisampleRenderTarget(Te),Qe.updateRenderTargetMipmap(Te))}L.setRenderTarget(Me,Ie,Be),L.setClearColor(Q,be),xt!==void 0&&(q.viewport=xt),L.toneMapping=st}function Co(E,z,Y){let q=z.isScene===!0?z.overrideMaterial:null;for(let j=0,Te=E.length;j<Te;j++){let Ne=E[j],{object:Me,geometry:Ie,group:Be}=Ne,st=Ne.material;st.allowOverride===!0&&q!==null&&(st=q),Me.layers.test(Y.layers)&&qd(Me,z,Y,Ie,st,Be)}}function qd(E,z,Y,q,j,Te){H!==null&&j.isNodeMaterial&&H.setObject(E,j),E.onBeforeRender(L,z,Y,q,j,Te),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),j.onBeforeRender(L,z,Y,q,E,Te),j.transparent===!0&&j.side===Ot&&j.forceSinglePass===!1?(j.side=on,j.needsUpdate=!0,L.renderBufferDirect(Y,z,q,j,E,Te),j.side=xi,j.needsUpdate=!0,L.renderBufferDirect(Y,z,q,j,E,Te),j.side=Ot):L.renderBufferDirect(Y,z,q,j,E,Te),E.onAfterRender(L,z,Y,q,j,Te)}function Xd(E){let z=0;for(let Y of E)Y.texture!==null&&z++;return z}function ta(E,z,Y){z.isScene!==!0&&(z=N);let q=Ze.get(E),j=w.state.lights,Te=w.state.shadowsArray,Ne=j.state.version,Me=re.getParameters(E,j.state,Te,z,Y,w.state.lightProbeGridArray),Ie=re.getProgramCacheKey(Me),Be=q.programs;q.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?z.environment:null,q.fog=z.fog;let st=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;q.envMap=R.get(E.envMap||q.environment,st),q.envMapRotation=q.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,Be===void 0&&(E.addEventListener("dispose",Tt),Be=new Map,q.programs=Be,q.programVariants=new Map);let xt=Be.get(Ie);if(xt!==void 0){if(q.currentProgram===xt&&q.lightsStateVersion===Ne)return Kd(E,Me),xt}else Me.uniforms=re.getUniforms(E),H!==null&&E.isNodeMaterial&&H.build(E,Y,Me),E.onBeforeCompile(Me,L),xt=re.acquireProgram(Me,Ie),Be.set(Ie,xt),q.uniforms=Me.uniforms;let Ue=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ue.clippingPlanes=ne.uniform),Kd(E,Me),q.needsLights=g0(E),q.lightsStateVersion=Ne,q.needsLights&&(Ue.ambientLightColor.value=j.state.ambient,Ue.lightProbe.value=j.state.probe,Ue.sunLights.value=j.state.sun,Ue.sunLightShadows.value=j.state.sunShadow,Ue.directionalLights.value=j.state.directional,Ue.directionalLightShadows.value=j.state.directionalShadow,Ue.spotLights.value=j.state.spot,Ue.spotLightShadows.value=j.state.spotShadow,Ue.rectAreaLights.value=j.state.rectArea,Ue.ltc_1.value=j.state.rectAreaLTC1,Ue.ltc_2.value=j.state.rectAreaLTC2,Ue.pointLights.value=j.state.point,Ue.pointLightShadows.value=j.state.pointShadow,Ue.hemisphereLights.value=j.state.hemi,Ue.sunShadowMatrix.value=j.state.sunShadowMatrix,Ue.sunShadowCascade.value=j.state.sunShadowCascade,Ue.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Ue.spotLightMatrix.value=j.state.spotLightMatrix,Ue.spotLightMap.value=j.state.spotLightMap,Ue.pointShadowMatrix.value=j.state.pointShadowMatrix),q.numLightProbeGrids=Xd(w.state.lightProbeGridArray),q.currentProgram=xt,q.uniformsList=null,xt}function f0(E,z,Y,q,j){let Te=Ze.get(E),Ne=Te.currentProgram.id+","+q+","+j,Me=Te.programVariants.get(Ne);return Me===void 0?(Me=ta(E,z,Y),Te.programVariants.set(Ne,Me)):(Te.currentProgram=Me,Te.uniformsList=null,Te.outputColorSpace=q,Te.toneMapping=j),Me}function jd(E){if(E.uniformsList===null){let z=E.currentProgram.getUniforms();E.uniformsList=kr.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}function Kd(E,z){let Y=Ze.get(E);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}function p0(E,z,Y,q,j){z.isScene!==!0&&(z=N),Qe.resetTextureUnits();let Te=z.fog,Ne=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?z.environment:null,Me=V===null?L.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:mt.workingColorSpace,Ie=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,Be=R.get(q.envMap||Ne,Ie),st=q.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,xt=!!Y.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ue=!!Y.morphAttributes.position,_t=!!Y.morphAttributes.normal,Wt=!!Y.morphAttributes.color,Lt=_i;q.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(Lt=L.toneMapping);let It=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,hn=It!==void 0?It.length:0,Oe=Ze.get(q),bn=w.state.lights;if(fe===!0&&(Pe===!0||E!==W)){let kt=E===W&&q.id===G;ne.setState(q,E,kt)}let Mt=!1,_s=!1;q.version===Oe.__version?Oe.needsLights&&Oe.lightsStateVersion!==bn.state.version||j.isBatchedMesh&&Oe.batching===!1||!j.isBatchedMesh&&Oe.batching===!0||j.isBatchedMesh&&Oe.batchingColor===!0&&j._colorsTexture===null||j.isBatchedMesh&&Oe.batchingColor===!1&&j._colorsTexture!==null||j.isInstancedMesh&&Oe.instancing===!1||!j.isInstancedMesh&&Oe.instancing===!0||j.isSkinnedMesh&&Oe.skinning===!1||!j.isSkinnedMesh&&Oe.skinning===!0||j.isInstancedMesh&&Oe.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Oe.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&Oe.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&Oe.instancingMorph===!1&&j.morphTexture!==null||Oe.envMap!==Be||q.fog===!0&&Oe.fog!==Te||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==ne.numPlanes||Oe.numIntersection!==ne.numIntersection)||Oe.vertexAlphas!==st||Oe.vertexTangents!==xt||Oe.morphTargets!==Ue||Oe.morphNormals!==_t||Oe.morphColors!==Wt||Oe.morphTargetsCount!==hn||Oe.numLightProbeGrids!==Xd(w.state.lightProbeGridArray)?Mt=!0:(Oe.outputColorSpace!==Me||Oe.toneMapping!==Lt)&&(_s=!0):(Mt=!0,Oe.__version=q.version);let un=Oe.currentProgram;(Mt===!0||_s===!0)&&(un=_s===!0?f0(q,z,j,Me,Lt):ta(q,z,j),H&&q.isNodeMaterial&&H.onUpdateProgram(q,un,Oe));let Po=!1,Zi=!1,ys=!1,vt=un.getUniforms(),sn=Oe.uniforms;if(me.useProgram(un.program)&&(Po=!0,Zi=!0,ys=!0),q.id!==G&&(G=q.id,Zi=!0),Po||W!==E){me.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),vt.setValue(D,"projectionMatrix",E.projectionMatrix),vt.setValue(D,"viewMatrix",E.matrixWorldInverse);let tn=vt.map.cameraPosition;tn!==void 0&&tn.setValue(D,nt.setFromMatrixPosition(E.matrixWorld)),pt.logarithmicDepthBuffer&&vt.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&vt.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),W!==E&&(W=E,Zi=!0,ys=!0)}if(Oe.needsLights&&(bn.state.sunShadowMap.length>0&&vt.setValue(D,"sunShadowMap",bn.state.sunShadowMap,Qe),bn.state.directionalShadowMap.length>0&&vt.setValue(D,"directionalShadowMap",bn.state.directionalShadowMap,Qe),bn.state.spotShadowMap.length>0&&vt.setValue(D,"spotShadowMap",bn.state.spotShadowMap,Qe),bn.state.pointShadowMap.length>0&&vt.setValue(D,"pointShadowMap",bn.state.pointShadowMap,Qe)),j.isSkinnedMesh){vt.setOptional(D,j,"bindMatrix"),vt.setOptional(D,j,"bindMatrixInverse");let kt=j.skeleton;kt&&(kt.boneTexture===null&&kt.computeBoneTexture(),vt.setValue(D,"boneTexture",kt.boneTexture,Qe))}j.isBatchedMesh&&(vt.setOptional(D,j,"batchingTexture"),vt.setValue(D,"batchingTexture",j._matricesTexture,Qe),vt.setOptional(D,j,"batchingIdTexture"),vt.setValue(D,"batchingIdTexture",j._indirectTexture,Qe),vt.setOptional(D,j,"batchingColorTexture"),j._colorsTexture!==null&&vt.setValue(D,"batchingColorTexture",j._colorsTexture,Qe));let Jn=Y.morphAttributes;if((Jn.position!==void 0||Jn.normal!==void 0||Jn.color!==void 0)&&ie.update(j,Y,un),(Zi||Oe.receiveShadow!==j.receiveShadow)&&(Oe.receiveShadow=j.receiveShadow,vt.setValue(D,"receiveShadow",j.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&z.environment!==null&&(sn.envMapIntensity.value=z.environmentIntensity),sn.dfgLUT!==void 0&&(sn.dfgLUT.value=Lv()),Zi){if(vt.setValue(D,"toneMappingExposure",L.toneMappingExposure),Oe.needsLights&&m0(sn,ys),Te&&q.fog===!0&&xe.refreshFogUniforms(sn,Te),xe.refreshMaterialUniforms(sn,q,Ee,je,w.state.transmissionRenderTarget[E.id]),Oe.needsLights&&Oe.numLightProbeGrids>0){let kt=y,tn=0;for(let Ei of w.state.lightProbeGridArray)Ei.texture!==null&&(kt.textures[tn]=Ei.texture,kt.min[tn]=Ei.boundingBox.min,kt.max[tn]=Ei.boundingBox.max,kt.resolution[tn]=Ei.resolution,tn++);for(let Ei in kt)kt[Ei].length=tn;sn.probesSH.value=kt.textures,sn.probesMin.value=kt.min,sn.probesMax.value=kt.max,sn.probesResolution.value=kt.resolution}kr.upload(D,jd(Oe),sn,Qe)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(kr.upload(D,jd(Oe),sn,Qe),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&vt.setValue(D,"center",j.center),vt.setValue(D,"modelViewMatrix",j.modelViewMatrix),vt.setValue(D,"normalMatrix",j.normalMatrix),vt.setValue(D,"modelMatrix",j.matrixWorld),q.uniformsGroups!==void 0){let kt=q.uniformsGroups;for(let tn=0,Ei=kt.length;tn<Ei;tn++){let Yd=kt[tn];qe.update(Yd,un),qe.bind(Yd,un)}}return un}function m0(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.sunLights.needsUpdate=z,E.sunLightShadows.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}function g0(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(E,z,Y){let q=Ze.get(E);q.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),Ze.get(E.texture).__webglTexture=z,Ze.get(E.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:Y,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,z){let Y=Ze.get(E);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(E,z=0,Y=0){V=E,I=z,C=Y;let q=null,j=!1,Te=!1;if(E){let Me=Ze.get(E);if(Me.__useDefaultFramebuffer!==void 0){me.bindFramebuffer(D.FRAMEBUFFER,Me.__webglFramebuffer),K.copy(E.viewport),ce.copy(E.scissor),We=E.scissorTest,me.viewport(K),me.scissor(ce),me.setScissorTest(We),G=-1;return}else if(Me.__webglFramebuffer===void 0)Qe.setupRenderTarget(E);else if(Me.__hasExternalTextures)Qe.rebindTextures(E,Ze.get(E.texture).__webglTexture,Ze.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let st=E.depthTexture;if(Me.__boundDepthTexture!==st){if(st!==null&&Ze.has(st)&&(E.width!==st.image.width||E.height!==st.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Qe.setupDepthRenderbuffer(E)}}let Ie=E.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(Te=!0);let Be=Ze.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Be[z])?q=Be[z][Y]:q=Be[z],j=!0):E.samples>0&&Qe.useMultisampledRTT(E)===!1?q=Ze.get(E).__webglMultisampledFramebuffer:Array.isArray(Be)?q=Be[Y]:q=Be,K.copy(E.viewport),ce.copy(E.scissor),We=E.scissorTest}else K.copy(Ye).multiplyScalar(Ee).floor(),ce.copy(ot).multiplyScalar(Ee).floor(),We=ct;if(Y!==0&&(q=J),me.bindFramebuffer(D.FRAMEBUFFER,q)&&me.drawBuffers(E,q),me.viewport(K),me.scissor(ce),me.setScissorTest(We),j){let Me=Ze.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+z,Me.__webglTexture,Y)}else if(Te){let Me=z;for(let Ie=0;Ie<E.textures.length;Ie++){let Be=Ze.get(E.textures[Ie]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ie,Be.__webglTexture,Y,Me)}}else if(E!==null&&Y!==0){let Me=Ze.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Me.__webglTexture,Y)}G=-1};function Jd(E){let z=Ze.get(E);return(z.__readFormat!==E.format||z.__readType!==E.type)&&(z.__readFormat=E.format,z.__readType=E.type,z.__formatReadable=pt.textureFormatReadable(E.format),z.__typeReadable=pt.textureTypeReadable(E.type)),z}this.readRenderTargetPixels=function(E,z,Y,q,j,Te,Ne,Me=0){if(!(E&&E.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=Ze.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ne!==void 0&&(Ie=Ie[Ne],Array.isArray(Ie)&&(Ie=Ie[0])),Ie){me.bindFramebuffer(D.FRAMEBUFFER,Ie);try{let Be=E.textures[Me],st=Be.format,xt=Be.type;E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Me);let Ue=Jd(Be);if(Ue.__formatReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ue.__typeReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-q&&Y>=0&&Y<=E.height-j&&D.readPixels(z,Y,q,j,de.convert(st),de.convert(xt),Te)}finally{let Be=V!==null?Ze.get(V).__webglFramebuffer:null;me.bindFramebuffer(D.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(E,z,Y,q,j,Te,Ne,Me=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=Ze.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ne!==void 0&&(Ie=Ie[Ne],Array.isArray(Ie)&&(Ie=Ie[0])),Ie)if(z>=0&&z<=E.width-q&&Y>=0&&Y<=E.height-j){me.bindFramebuffer(D.FRAMEBUFFER,Ie);let Be=E.textures[Me],st=Be.format,xt=Be.type;E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Me);let Ue=Jd(Be);if(Ue.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ue.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let _t=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,_t),D.bufferData(D.PIXEL_PACK_BUFFER,Te.byteLength,D.STREAM_READ),D.readPixels(z,Y,q,j,de.convert(st),de.convert(xt),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let Wt=V!==null?Ze.get(V).__webglFramebuffer:null;me.bindFramebuffer(D.FRAMEBUFFER,Wt);let Lt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Rp(D,Lt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,_t),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,Te),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(_t),D.deleteSync(Lt),Te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,z=null,Y=0){let q=Math.pow(2,-Y),j=Math.floor(E.image.width*q),Te=Math.floor(E.image.height*q),Ne=z!==null?z.x:0,Me=z!==null?z.y:0;Qe.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,Y,0,0,Ne,Me,j,Te),me.unbindTexture()},this.copyTextureToTexture=function(E,z,Y=null,q=null,j=0,Te=0){let Ne,Me,Ie,Be,st,xt,Ue,_t,Wt,Lt=E.isCompressedTexture?E.mipmaps[Te]:E.image;if(Y!==null)Ne=Y.max.x-Y.min.x,Me=Y.max.y-Y.min.y,Ie=Y.isBox3?Y.max.z-Y.min.z:1,Be=Y.min.x,st=Y.min.y,xt=Y.isBox3?Y.min.z:0;else{let vt=Math.pow(2,-j);Ne=Math.floor(Lt.width*vt),Me=Math.floor(Lt.height*vt),E.isDataArrayTexture?Ie=Lt.depth:E.isData3DTexture?Ie=Math.floor(Lt.depth*vt):Ie=1,Be=0,st=0,xt=0}q!==null?(Ue=q.x,_t=q.y,Wt=q.z):(Ue=0,_t=0,Wt=0);let It=de.convert(z.format),hn=de.convert(z.type),Oe;z.isData3DTexture?(Qe.setTexture3D(z,0),Oe=D.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(Qe.setTexture2DArray(z,0),Oe=D.TEXTURE_2D_ARRAY):(Qe.setTexture2D(z,0),Oe=D.TEXTURE_2D),me.activeTexture(D.TEXTURE0),me.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,z.flipY),me.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),me.pixelStorei(D.UNPACK_ALIGNMENT,z.unpackAlignment);let bn=me.getParameter(D.UNPACK_ROW_LENGTH),Mt=me.getParameter(D.UNPACK_IMAGE_HEIGHT),_s=me.getParameter(D.UNPACK_SKIP_PIXELS),un=me.getParameter(D.UNPACK_SKIP_ROWS),Po=me.getParameter(D.UNPACK_SKIP_IMAGES);me.pixelStorei(D.UNPACK_ROW_LENGTH,Lt.width),me.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Lt.height),me.pixelStorei(D.UNPACK_SKIP_PIXELS,Be),me.pixelStorei(D.UNPACK_SKIP_ROWS,st),me.pixelStorei(D.UNPACK_SKIP_IMAGES,xt);let Zi=E.isDataArrayTexture||E.isData3DTexture,ys=z.isDataArrayTexture||z.isData3DTexture;if(E.isDepthTexture){let vt=Ze.get(E),sn=Ze.get(z),Jn=Ze.get(vt.__renderTarget),kt=Ze.get(sn.__renderTarget);me.bindFramebuffer(D.READ_FRAMEBUFFER,Jn.__webglFramebuffer),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let tn=0;tn<Ie;tn++)Zi&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ze.get(E).__webglTexture,j,xt+tn),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ze.get(z).__webglTexture,Te,Wt+tn)),D.blitFramebuffer(Be,st,Be+Ne,st+Me,Ue,_t,Ue+Ne,_t+Me,D.DEPTH_BUFFER_BIT,D.NEAREST);me.bindFramebuffer(D.READ_FRAMEBUFFER,null),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(j!==0||E.isRenderTargetTexture||Ze.has(E)){let vt=Ze.get(E),sn=Ze.get(z);me.bindFramebuffer(D.READ_FRAMEBUFFER,k),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,T);for(let Jn=0;Jn<Ie;Jn++)Zi?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,vt.__webglTexture,j,xt+Jn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,vt.__webglTexture,j),ys?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,sn.__webglTexture,Te,Wt+Jn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,sn.__webglTexture,Te),j!==0?D.blitFramebuffer(Be,st,Be+Ne,st+Me,Ue,_t,Ue+Ne,_t+Me,D.COLOR_BUFFER_BIT,D.NEAREST):ys?D.copyTexSubImage3D(Oe,Te,Ue,_t,Wt+Jn,Be,st,Ne,Me):D.copyTexSubImage2D(Oe,Te,Ue,_t,Be,st,Ne,Me);me.bindFramebuffer(D.READ_FRAMEBUFFER,null),me.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else ys?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(Oe,Te,Ue,_t,Wt,Ne,Me,Ie,It,hn,Lt.data):z.isCompressedArrayTexture?D.compressedTexSubImage3D(Oe,Te,Ue,_t,Wt,Ne,Me,Ie,It,Lt.data):D.texSubImage3D(Oe,Te,Ue,_t,Wt,Ne,Me,Ie,It,hn,Lt):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,Te,Ue,_t,Ne,Me,It,hn,Lt.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,Te,Ue,_t,Lt.width,Lt.height,It,Lt.data):D.texSubImage2D(D.TEXTURE_2D,Te,Ue,_t,Ne,Me,It,hn,Lt);me.pixelStorei(D.UNPACK_ROW_LENGTH,bn),me.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Mt),me.pixelStorei(D.UNPACK_SKIP_PIXELS,_s),me.pixelStorei(D.UNPACK_SKIP_ROWS,un),me.pixelStorei(D.UNPACK_SKIP_IMAGES,Po),Te===0&&z.generateMipmaps===!0&&z.mipmapsAutoUpdate===!0&&D.generateMipmap(Oe),me.unbindTexture()},this.initRenderTarget=function(E){Ze.get(E).__webglFramebuffer===void 0&&Qe.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Qe.setTextureCube(E,0):E.isData3DTexture?Qe.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Qe.setTexture2DArray(E,0):Qe.setTexture2D(E,0),me.unbindTexture()},this.resetState=function(){I=0,C=0,V=null,me.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=mt._getDrawingBufferColorSpace(e),t.unpackColorSpace=mt._getUnpackColorSpace()}};function zu(i,e){if(e===hu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Or||e===io){let t=i.getIndex();if(t===null){let r=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Or)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function Fl(i){let e=new Map,t=new Map,n=i.clone();return gm(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function gm(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)gm(i.children[n],e.children[n],t)}var Ul=class extends bi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new ju(t)}),this.register(function(t){return new Ku(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new ad(t)}),this.register(function(t){return new Zu(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new Xu(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new Yu(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new Wu(t)}),this.register(function(t){return new Ol(t,gt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ol(t,gt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new od(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=Vi.extractUrlBase(e);a=Vi.resolveURL(c,this.path)}else a=Vi.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Ar(this.manager);l.setPriority(this.priority),l.setCache(this.cache),l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===vm){try{a[gt.KHR_BINARY_GLTF]=new cd(e)}catch(u){s&&s(u);return}r=JSON.parse(a[gt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new md(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],f=r.extensionsRequired||[];switch(u){case gt.KHR_MATERIALS_UNLIT:a[u]=new qu;break;case gt.KHR_DRACO_MESH_COMPRESSION:a[u]=new ld(r,this.dracoLoader);break;case gt.KHR_TEXTURE_TRANSFORM:a[u]=new hd;break;case gt.KHR_MESH_QUANTIZATION:a[u]=new ud;break;default:f.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function Nv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function zt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var gt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Wu=class{constructor(e){this.parser=e,this.name=gt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new Xe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],_n);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Bs(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Hi(h),c.distance=u;break;case"spot":c=new ja(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Mi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},qu=class{constructor(){this.name=gt.KHR_MATERIALS_UNLIT}getMaterialType(){return bt}extendParams(e,t,n){let s=[];e.color=new Xe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],_n),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Nt))}return Promise.all(s)}},Xu=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},ju=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new le(r,r)}return Promise.all(s)}},Ku=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(s)}},Ju=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Yu=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Zu=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_SHEEN}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Xe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],_n)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Nt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},$u=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},Qu=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_VOLUME}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Xe().setRGB(r[0],r[1],r[2],_n),Promise.all(s)}},ed=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_IOR}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},td=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Xe().setRGB(r[0],r[1],r[2],_n),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Nt)),Promise.all(s)}},nd=class{constructor(e){this.parser=e,this.name=gt.EXT_MATERIALS_BUMP}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},id=class{constructor(e){this.parser=e,this.name=gt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return zt(this.parser,e,this.name)!==null?yn:null}extendMaterialParams(e,t){let n=zt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},sd=class{constructor(e){this.parser=e,this.name=gt.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},rd=class{constructor(e){this.parser=e,this.name=gt.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},ad=class{constructor(e){this.parser=e,this.name=gt.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Ol=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,f,s.mode,s.filter).then(function(d){return d.buffer}):a.ready.then(function(){let d=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(d),h,u,f,s.mode,s.filter),d})})}else return null}},od=class{constructor(e){this.name=gt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==Wn.TRIANGLES&&c.mode!==Wn.TRIANGLE_STRIP&&c.mode!==Wn.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],f=c[0].count,d=[];for(let g of u){let _=new et,b=new B,p=new Xt,x=new B(1,1,1),M=new Aa(g.geometry,g.material,f);for(let A=0;A<f;A++)l.TRANSLATION&&b.fromBufferAttribute(l.TRANSLATION,A),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,A),l.SCALE&&x.fromBufferAttribute(l.SCALE,A),M.setMatrixAt(A,_.compose(b,p,x));let y=null;for(let A in l)if(A==="_COLOR_0"){let w=l[A];M.instanceColor=new Fi(w.array,w.itemSize,w.normalized)}else if(A!=="TRANSLATION"&&A!=="ROTATION"&&A!=="SCALE"){if(y===null){let m=M.geometry;y=new Dt,y.name=m.name;for(let v in m.attributes)y.setAttribute(v,m.attributes[v]);for(let v in m.morphAttributes)y.morphAttributes[v]=m.morphAttributes[v];m.index!==null&&y.setIndex(m.index),y.morphTargetsRelative=m.morphTargetsRelative;for(let v of m.groups)y.addGroup(v.start,v.count,v.materialIndex);m.boundingBox!==null&&(y.boundingBox=m.boundingBox.clone()),m.boundingSphere!==null&&(y.boundingSphere=m.boundingSphere.clone()),y.drawRange.start=m.drawRange.start,y.drawRange.count=m.drawRange.count,y.userData=Object.assign({},m.userData),M.geometry=y}let w=l[A];y.setAttribute(A,new Fi(w.array,w.itemSize,w.normalized))}Ft.prototype.copy.call(M,g),this.parser.assignFinalMaterial(M),d.push(M)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}},vm="glTF",co=12,bm={JSON:1313821514,BIN:5130562},cd=class{constructor(e){this.name=gt.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,co),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==vm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-co,r=new DataView(e,co),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===bm.JSON){let c=new Uint8Array(e,co+a,o);this.content=n.decode(c)}else if(l===bm.BIN){let c=co+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},ld=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=gt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let u=fd[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=fd[h]||h.toLowerCase();if(a[h]!==void 0){let f=n.accessors[e.attributes[h]],d=zr[f.componentType];c[u]=d.name,l[u]=f.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,f){s.decodeDracoFile(h,function(d){for(let g in d.attributes){let _=d.attributes[g],b=l[g];b!==void 0&&(_.normalized=b)}u(d)},o,c,_n,f)})})}},hd=class{constructor(){this.name=gt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},ud=class{constructor(){this.name=gt.KHR_MESH_QUANTIZATION}},kl=class extends gi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,u=(n-t)/h,f=u*u,d=f*u,g=e*c,_=g-c,b=-2*d+3*f,p=d-f,x=1-b,M=p-f+u;for(let y=0;y!==o;y++){let A=a[_+y+o],w=a[_+y+l]*h,m=a[g+y+o],v=a[g+y]*h;r[y]=x*A+M*w+b*m+p*v}return r}},Fv=new Xt,dd=class extends kl{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return Fv.fromArray(r).normalize().toArray(r),r}},Wn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},zr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},xm={9728:Ht,9729:Jt,9984:Gc,9985:Fr,9986:Vs,9987:Gn},_m={33071:rn,33648:fr,10497:zn},Gu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},fd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},us={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Uv={CUBICSPLINE:void 0,LINEAR:Cs,STEP:Rs},Hu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Ov(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new ke({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:xi})),i.DefaultMaterial}function Xs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Mi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function kv(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let f=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;a.push(f)}if(s){let f=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;o.push(f)}if(r){let f=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],f=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=f),i.morphTargetsRelative=!0,i})}function Bv(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function zv(i){let e,t=i.extensions&&i.extensions[gt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Vu(t.attributes):e=i.indices+":"+Vu(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Vu(i.targets[n]);return e}function Vu(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function pd(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Gv(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Hv=new et,md=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Nv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?(this.textureLoader=new Us(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new Ka(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ar(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return Xs(r,o,s),Mi(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[gt.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(Vi.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=Gu[s.type],o=zr[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new an(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Gu[s.type],c=zr[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,f=s.byteOffset||0,d=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,_,b;if(d&&d!==u){let p=Math.floor(f/d),x="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,M=t.cache.get(x);M||(_=new c(o,p*d,s.count*d/h),M=new _r(_,d/h),t.cache.add(x,M)),b=new yr(M,l,f%d/h,g)}else o===null?_=new c(s.count*l):_=new c(o,f,s.count*l),b=new an(_,l,g);if(s.sparse!==void 0){let p=Gu.SCALAR,x=zr[s.sparse.indices.componentType],M=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,A=new x(a[1],M,s.sparse.count*p),w=new c(a[2],y,s.sparse.count*l);o!==null&&(b=new an(b.array.slice(),b.itemSize,b.normalized)),b.normalized=!1;for(let m=0,v=A.length;m<v;m++){let F=A[m];if(b.setX(F,w[m*l]),l>=2&&b.setY(F,w[m*l+1]),l>=3&&b.setZ(F,w[m*l+2]),l>=4&&b.setW(F,w[m*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}b.normalized=g}return b})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let f=(r.samplers||{})[a.sampler]||{};return h.magFilter=xm[f.magFilter]||Jt,h.minFilter=xm[f.minFilter]||Gn,h.wrapS=_m[f.wrapS]||zn,h.wrapT=_m[f.wrapT]||zn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Ht&&h.minFilter!==Jt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1,h;if(t.isKTX2Loader===!0&&a.bufferView!==void 0)h=n.getDependency("bufferView",a.bufferView).then(function(f){return new Promise(function(d,g){t.parse(f,d,g)})});else{if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(f){c=!0;let d=new Blob([f],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");h=Promise.resolve(l).then(function(f){return new Promise(function(d,g){let _=d;t.isImageBitmapLoader===!0&&(_=function(b){let p=new Vt(b);p.needsUpdate=!0,d(p)}),t.load(Vi.resolveURL(f,r.path),_,void 0,g)})})}let u=h.then(function(f){return c===!0&&o.revokeObjectURL(l),Mi(f,a),f.userData.mimeType=a.mimeType||Gv(a.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),f});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[gt.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[gt.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[gt.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Sr,Sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new as,Sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ke}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[gt.KHR_MATERIALS_UNLIT]){let u=s[gt.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{let u=r.pbrMetallicRoughness||{};if(o.color=new Xe(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let f=u.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],_n),o.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,Nt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Ot);let h=r.alphaMode||Hu.OPAQUE;if(h===Hu.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Hu.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new le(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==bt){let u=r.emissiveFactor;o.emissive=new Xe().setRGB(u[0],u[1],u[2],_n)}return r.emissiveTexture!==void 0&&a!==bt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Nt)),Promise.all(c).then(function(){let u=new a(o);return r.name&&(u.name=r.name),Mi(u,r),t.associations.set(u,{materials:e}),r.extensions&&Xs(s,u,r),u})}createUniqueName(e){let t=Ct.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[gt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return ym(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=zv(c),u=s[h];if(u)a.push(u.promise);else{let f;c.extensions&&c.extensions[gt.KHR_DRACO_MESH_COMPRESSION]?f=r(c):f=ym(new Dt,c,t),c.mode===Wn.TRIANGLE_STRIP?f=f.then(d=>zu(d,io)):c.mode===Wn.TRIANGLE_FAN&&(f=f.then(d=>zu(d,Or))),s[h]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?Ov(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let d=0,g=h.length;d<g;d++){let _=h[d],b=a[d],p,x=c[d];if(b.mode===Wn.TRIANGLES||b.mode===Wn.TRIANGLE_STRIP||b.mode===Wn.TRIANGLE_FAN||b.mode===void 0){let M=r.isSkinnedMesh===!0,y=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");M&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=M&&y?new Ta(_,x):new Ut(_,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(b.mode===Wn.LINES)p=new Ra(_,x);else if(b.mode===Wn.LINE_STRIP)p=new Ui(_,x);else if(b.mode===Wn.LINE_LOOP)p=new Ca(_,x);else if(b.mode===Wn.POINTS)p=new Pa(_,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+b.mode);Object.keys(p.geometry.morphAttributes).length>0&&Bv(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Mi(p,r),b.extensions&&Xs(s,p,b),t.assignFinalMaterial(p),u.push(p)}for(let d=0,g=u.length;d<g;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return r.extensions&&Xs(s,u[0],r),u[0];let f=new Et;r.extensions&&Xs(s,f,r),t.associations.set(f,{meshes:e});for(let d=0,g=u.length;d<g;d++)f.add(u[d]);return f})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Kt(Rl.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new ks(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Mi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let u=a[c];if(u){o.push(u);let f=new et;r!==null&&f.fromArray(r.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ea(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,f=s.channels.length;u<f;u++){let d=s.channels[u],g=s.samplers[d.sampler],_=d.target,b=_.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,x=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",b)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",x)),c.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let f=u[0],d=u[1],g=u[2],_=u[3],b=u[4],p=[];for(let M=0,y=f.length;M<y;M++){let A=f[M],w=d[M],m=g[M],v=_[M],F=b[M];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();let L=n._createAnimationTracks(A,w,m,v,F);if(L)for(let U=0;U<L.length;U++)p.push(L[U])}let x=new Fs(r,void 0,p);return Mi(x,s),x})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],u=c[1],f=c[2];f!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(f,Hv)});for(let d=0,g=u.length;d<g;d++)h.add(u[d]);if(h.userData.pivot!==void 0&&u.length>0){let d=h.userData.pivot,g=u[0];h.pivot=new B().fromArray(d),h.position.x-=d[0],h.position.y-=d[1],h.position.z-=d[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new vr:c.length>1?h=new Et:c.length===1?h=c[0]:h=new Ft,h!==c[0])for(let u=0,f=c.length;u<f;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Mi(h,r),r.extensions&&Xs(n,h,r),r.matrix!==void 0){let u=new et;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Et;n.name&&(r.name=s.createUniqueName(n.name)),Mi(r,n),n.extensions&&Xs(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){let f=l[h];f.parent!==null?r.add(Fl(f)):r.add(f)}let c=h=>{let u=new Map;for(let[f,d]of s.associations)(f instanceof Sn||f instanceof Vt)&&u.set(f,d);return h.traverse(f=>{let d=s.associations.get(f);d!=null&&u.set(f,d)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}us[r.path]===us.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(us[r.path]){case us.weights:h=Bi;break;case us.rotation:h=zi;break;case us.translation:case us.scale:h=ls;break;default:n.itemSize===1?h=Bi:h=ls;break}let u=s.interpolation!==void 0?Uv[s.interpolation]:Cs,f=this._getArrayFromAccessor(n);for(let d=0,g=l.length;d<g;d++){let _=new h(l[d]+"."+us[r.path],t.array,f,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),a.push(_)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=pd(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof zi?dd:kl;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Vv(i,e,t){let n=e.attributes,s=new Dn;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new B(l[0],l[1],l[2]),new B(c[0],c[1],c[2])),o.normalized){let h=pd(zr[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new B,l=new B;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let f=t.json.accessors[u.POSITION],d=f.min,g=f.max;if(d!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),f.normalized){let _=pd(zr[f.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new Mn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function ym(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=fd[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return mt.workingColorSpace!==_n&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${mt.workingColorSpace}" not supported.`),Mi(i,e),Vv(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?kv(i,e.targets,t):i})}var Mm=(function(){var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var s=WebAssembly.validate(t)?o(e):o(i),r,a=WebAssembly.instantiate(s,{}).then(function(p){r=p.instance,r.exports.__wasm_call_ctors()});function o(p){for(var x=new Uint8Array(p.length),M=0;M<p.length;++M){var y=p.charCodeAt(M);x[M]=y>96?y-97:y>64?y-39:y+4}for(var A=0,M=0;M<p.length;++M)x[A++]=x[M]<60?n[x[M]]:(x[M]-60)*64+x[++M];return x.buffer.slice(0,A)}function l(p,x,M,y,A,w,m){var v=p.exports.sbrk,F=y+3&-4,L=v(F*A),U=v(w.length),H=new Uint8Array(p.exports.memory.buffer);H.set(w,U);var J=x(L,y,A,U,w.length);if(J==0&&m&&m(L,F,A),M.set(H.subarray(L,L+y*A)),v(L-v(0)),J!=0)throw new Error("Malformed buffer data: "+J)}var c={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp",COLOR:"meshopt_decodeFilterColor"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],f=0;function d(p){var x={object:new Worker(p),pending:0,requests:{}};return x.object.onmessage=function(M){var y=M.data;x.pending-=y.count,x.requests[y.id][y.action](y.value),delete x.requests[y.id]},x}function g(p){for(var x="self.ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(s)+"]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = "+b.name+";"+l.toString()+b.toString(),M=new Blob([x],{type:"text/javascript"}),y=URL.createObjectURL(M),A=u.length;A<p;++A)u[A]=d(y);for(var A=p;A<u.length;++A)u[A].object.postMessage({});u.length=p,URL.revokeObjectURL(y)}function _(p,x,M,y,A){for(var w=u[0],m=1;m<u.length;++m)u[m].pending<w.pending&&(w=u[m]);return new Promise(function(v,F){var L=new Uint8Array(M),U=++f;w.pending+=p,w.requests[U]={resolve:v,reject:F},w.object.postMessage({id:U,count:p,size:x,source:L,mode:y,filter:A},[L.buffer])})}function b(p){var x=p.data;self.ready.then(function(M){if(!x.id)return self.close();try{var y=new Uint8Array(x.count*x.size);l(M,M.exports[x.mode],y,x.count,x.size,x.source,M.exports[x.filter]),self.postMessage({id:x.id,count:x.count,action:"resolve",value:y},[y.buffer])}catch(A){self.postMessage({id:x.id,count:x.count,action:"reject",value:A})}})}return{ready:a,supported:!0,useWorkers:function(p){g(p)},decodeVertexBuffer:function(p,x,M,y,A){l(r,r.exports.meshopt_decodeVertexBuffer,p,x,M,y,r.exports[c[A]])},decodeIndexBuffer:function(p,x,M,y){l(r,r.exports.meshopt_decodeIndexBuffer,p,x,M,y)},decodeIndexSequence:function(p,x,M,y){l(r,r.exports.meshopt_decodeIndexSequence,p,x,M,y)},decodeGltfBuffer:function(p,x,M,y,A,w){l(r,r.exports[h[A]],p,x,M,y,r.exports[c[w]])},decodeGltfBufferAsync:function(p,x,M,y,A){return u.length>0?_(p,x,M,h[y],c[A]):a.then(function(){var w=new Uint8Array(p*x);return l(r,r.exports[h[y]],w,p,x,M,r.exports[c[A]]),w})}}})();var xo=[{id:"galdy",title:"Who is Lewis Galdy?",simple:["Lewis Galdy was a real person. He was born in France in 1659.","His family were Huguenots. That means French Protestants. In France they were punished for their religion, so Lewis sailed across the ocean to Jamaica."],deeper:["We know this from the words carved on his tombstone. You can still read it at St Peter\u2019s Church in Port Royal.","Nobody wrote down the year he arrived. This game starts his story in 1690. That date is our best guess, not a fact."]},{id:"town",title:"The town on the sand",simple:["Port Royal sat on a thin strip of sand in Kingston Harbour. About 6,500 people lived here, packed close together.","There was not much land, so people built upward. Some brick houses were four floors high."],deeper:["Around 1690, Port Royal was about the same size as Boston. It was one of the busiest English ports in the Americas, and brick houses were a sign of money.","From 1981 to 1990, archaeologists dug up five buildings that now lie under the sea. The houses in this game are based on what they found, and on paintings made from their work."]},{id:"coins",title:"Pieces of eight",simple:["People in Port Royal paid with silver coins from Spanish lands.","The big coin was called a piece of eight. It was worth eight smaller coins called reales."],deeper:["In most English colonies, people swapped goods like sugar or tobacco. Port Royal was different. So much Spanish silver arrived, through trade and through raids on Spanish ships and towns, that people used coins every day."]},{id:"people",title:"Who lived here?",simple:["People came to Port Royal from England, France, Africa and many other places.","Not everyone chose to come, and not everyone was free. Many African people here were enslaved. That means they were forced to work, were not paid, and were not allowed to leave.","Abba is a free woman. That was rare."],deeper:["About 2,500 of the people in the town were enslaved Africans. Part of Port Royal\u2019s wealth came from buying and selling human beings. This game will not hide that.","Abba is a character we made up. She stands for the free Black and mixed-race people who really lived in Jamaica at this time. Church records list a free Black couple, Peter Moore and Black Betty, who married in 1677."]},{id:"harbour",title:"The busy harbour",simple:["Port Royal had one of the busiest harbours in the Americas. In the year 1688, 213 ships came here.","Ships left Jamaica full of sugar, rum, cotton, ginger and wood."],deeper:["In that same year, 226 ships visited all of New England put together. One small town in Jamaica was almost as busy as a whole region.","Ships also carried enslaved African people here to be sold. The money and the cruelty came in through the same harbour."]},{id:"change",title:"Making change",simple:["A piece of eight was worth eight reales. Abba\u2019s stew cost two reales, so you got six back.","Sometimes people cut a coin into smaller pieces to make change. The pieces were called bits."],deeper:["The prices in this game are made up. Nobody wrote down what a bowl of stew cost in a Port Royal tavern in 1690."]},{id:"bottle",title:"Onion bottles",simple:["This round bottle is called an onion bottle, because of its shape. It held wine or other drinks.","Divers found a huge number of bottles like this under the sea at Port Royal."],deeper:["In 1959 a diver named Edwin Link brought up a bottle that still had liquid in it. He tested what was inside. It tasted terrible.","You can see real objects from Port Royal at the National Museum of Jamaica in Kingston."]},{id:"pewter",title:"Pewter plates",simple:["Pewter is a soft grey metal. Many people ate from pewter plates.","In one sunken building, archaeologists found about 25 pewter plates stacked in a cupboard under the stairs."],deeper:["Port Royal has given the world its largest collection of pewter from the late 1600s.","A pewter maker named Simon Benning had a workshop in the town from 1667 or even earlier."]},{id:"pipes",title:"Clay pipes",simple:["Many people in Port Royal smoked tobacco in long clay pipes. Divers found so many pipes that it seemed the whole town smoked.","Today we know that smoking harms the body. People in 1690 did not know that."],deeper:["Archaeologists found white clay pipes that had never been used, still waiting to be sold.","Some pipes were made in Jamaica from local red clay. African craftspeople, both free and enslaved, made them."]},{id:"turtle",title:"The turtle-shell box",simple:["This little box is covered in turtle shell. A box like it was found under the sea at Port Royal.","Sea turtles were easy to find near the town. People ate turtle meat and made things from the shells."],deeper:["In one sunken building, archaeologists found sea turtle shells in a room used for cutting up meat.","Today sea turtles are in danger and are protected by law. Nobody should hunt them now."]},{id:"quake",title:"The earthquake",simple:["On 7 June 1692, just before noon, a huge earthquake hit Port Royal.","In about three minutes, most of the town was gone."],deeper:["As many as 2,000 people died that day. Thousands more died in the days and weeks after.","A news sheet printed in London that year lists what people saw: houses falling, the great church and its tower coming down, the wharf covered by the sea, and a boat coming to save people."]},{id:"sand",title:"Why the ground swallowed the town",simple:["Port Royal was built on loose, wet sand.","When loose, wet sand is shaken very hard, it stops acting like solid ground. It flows like a liquid. Heavy brick houses sank straight down into it."],deeper:["Scientists call this liquefaction.","It is why divers found some buildings under the sea with their brick floors still in place."]},{id:"watch",title:"The stopped watch",simple:["In 1959, divers found a brass pocket watch under the sea at Port Royal.","Its hands had stopped at 17 minutes before noon."],deeper:["The watch was made in Amsterdam in 1686. People believe it stopped when the earthquake struck. That is how we know the time: about 11:43 in the morning."]},{id:"tomb",title:"Swallowed, and saved",simple:["This part of the story is true. Lewis Galdy was swallowed by the ground. A second shock threw him out into the sea.","He swam until a boat picked him up."],deeper:["His tombstone says he was \u201Cmiraculously saved by swimming until a boat took him up.\u201D He lived for 47 more years.","In this game, Abba is in the boat. We made that part up. Nobody wrote down who was in the boat that saved him."]},{id:"after",title:"The days after",simple:["The earthquake lasted about three minutes. The hard days came after.","People had little food and no clean water. Many who lived through the earthquake became sick. Thousands more died."],deeper:["At night, thieves robbed the broken houses. The town\u2019s minister wrote about them in a letter.","The camp in this game is made up. The hunger, the sickness and the thieves were real."]},{id:"tentp",title:"Church in a tent",simple:["The great church fell down in the earthquake.","So the minister held church in a tent."],deeper:["A news sheet printed in London in 1692 shows him preaching in a tent, with ruined houses all around."]},{id:"kingston",title:"A new town across the water",simple:["Most people who lived left Port Royal. They crossed the harbour and began a new town.","That town became Kingston, the capital of Jamaica today."],deeper:["Port Royal was built again, but smaller. It was never again the great trading town it had been.","A few merchants and fishermen stayed. Lewis Galdy was one of them."]},{id:"fortune",title:"Where the money came from",simple:["Lewis Galdy became rich again. He sold wine and cocoa. He also sold people.","He worked for a company that shipped enslaved African people to Spanish lands. This game does not look away from that."],deeper:["That trade was called the Asiento. Galdy was one of its agents in Jamaica.","He also sat in Jamaica\u2019s Assembly, which made the island\u2019s laws, and he chased pirates for the governor."]},{id:"stone",title:"The tombstone",simple:["Lewis Galdy died in 1739. He was 80 years old.","His tombstone tells how the earthquake swallowed him and how he was saved. You can visit it today at St Peter\u2019s Church in Port Royal."],deeper:["He helped to build this church in 1726.","His tomb was first at a place called Green Bay, across the harbour. It was moved here in 1953.","The stone tells his story. The people he bought and sold have no stones, and most of their names were never written down."]},{id:"sugar",title:"Sugar",simple:["These big casks are full of sugar. Sugar was the main thing Jamaica sold to the world.","Enslaved African people grew the sugar cane and made the sugar. The work was very hard and very dangerous."],deeper:["A big cask like this is called a hogshead.","Sugar made planters and merchants rich. The people who made it were paid nothing."]},{id:"cocoa",title:"Cocoa",simple:["These sacks hold cocoa beans. People ground them up to make a chocolate drink.","We know that Lewis Galdy traded in cocoa."],deeper:["In the 1600s, chocolate was a drink, not a bar. People drank it hot, often with spices."]},{id:"logwood",title:"Logwood",simple:["This dark red wood is called logwood. It was not for building.","People boiled it to make dye for cloth."],deeper:["Many old privateers became logwood cutters on the coast of Central America. Much of their wood was shipped through Jamaica to Europe."]},{id:"scales",title:"Weighing coins",simple:["Merchants did not just count coins. They weighed them.","Some people shaved silver off the edges of coins and kept it. A scale showed if a coin was too light."],deeper:["Shaving coins was called clipping. It was a crime."]},{id:"market",title:"The slave market",simple:["Ships brought enslaved African people to Port Royal to be sold.","Families were split apart on the wharf. The law allowed this. It was still wrong."],deeper:["Until 1698, one company, the Royal African Company, was the only English company allowed to bring enslaved people from Africa.","We do not know the year Lewis Galdy began to buy and sell people. We know that he did. The letter in this game is made up, to show the choice in front of him.","Abba\u2019s mother is made up too. Thousands of real mothers were sold in Port Royal."]}],Wv=[{who:"You",text:"A ship\u2019s cook wants a sack of cocoa. The price is 20 reales."},{who:"You",text:"He gives me 3 pieces of eight. Each one is worth 8 reales. How many reales do I give back?",choices:[{t:"2 reales"},{t:"4 reales",ok:!0},{t:"6 reales"}],hint:"Not quite. Three eights are 24. Take away 20."},{who:"You",text:"Four reales. But first I weigh his coins. One is too light. Someone has shaved its edge.",unlock:"scales"}],qv=[{who:"Abba",text:"Good day, Lewis. I need a cask of wine for The Turtle."},{who:"You",text:"Take the one by the door. You can pay me on Friday."},{who:"Abba",text:"There is a letter on your desk. The captain of the slave ship left it. I know what it asks."},{who:"Abba",text:"My mother was sold on that wharf, Lewis. Read it. Then decide what kind of merchant you are.",unlock:"market"},{id:"kofi",title:"Kofi\u2019s name",simple:["Many enslaved people in Jamaica were taken from West Africa. Kofi is an Akan name from West Africa. It is given to a boy born on a Friday.","Owners often gave enslaved people new names. Many people kept their own names among themselves."],deeper:["Enslaved Africans did much of the hardest work in Port Royal: loading ships, carrying goods, building and rowing.","Kofi is a character we made up. About 2,500 enslaved people lived in Port Royal, and most of their names were never written down."]},{id:"privateer",title:"Pirates and privateers",simple:["A privateer had a paper from the government that allowed him to attack enemy ships. A pirate had no paper, and attacked anyone.","In the 1660s, English leaders let privateers sail from Port Royal to raid Spanish ships and towns."],deeper:["The most famous was Henry Morgan. He later became Lieutenant Governor of Jamaica.","By the 1680s the government had turned against the raiders. Pirates caught by the law were hanged at Gallows Point, just outside the town.","Sam is a character we made up."]},{id:"benning",title:"Simon Benning, pewterer",simple:["Simon Benning was a real person. He was a pewterer: he made plates, spoons and cups from pewter.","He had a workshop in Port Royal from 1667 or even earlier."],deeper:["Pewter makers stamped their mark on what they made. Marks like these help archaeologists work out who made the things they find.","His words in this game are made up. We know about his trade from records and from objects found at Port Royal."]},{id:"heath",title:"The Reverend Emmanuel Heath",simple:["Emmanuel Heath was a real person. He was the minister of St Paul\u2019s Church in Port Royal.","He lived through the earthquake and wrote letters about it. Much of what we know about that day comes from him."],deeper:["He wrote from a ship called the Granada, out in the harbour. He went ashore to pray with the hurt and dying, and to christen children.","Like many people then, he believed the earthquake was God\u2019s punishment. Today, scientists explain it with loose, wet sand turning to liquid.","His words in this game are made up, but they follow what he wrote."]}],Ro=[{id:"kofi",label:"Talk to the dockworker",who:"Kofi",x:21.7,z:2.35,ry:Math.PI+.5,talk:[{who:"Kofi",text:"Mind the casks. They are heavy, and the captain wants them on board by noon."},{who:"You",text:"Do you work for the captain?"},{who:"Kofi",text:"No. I am enslaved. A merchant in this town says he owns me. I work, and I am not paid."},{who:"Kofi",text:"My mother named me Kofi, because I was born on a Friday. Here they call me something else. I keep my own name.",unlock:"kofi"}],again:[{who:"Kofi",text:"I have work to do. Go well."}]},{id:"sailor",label:"Talk to the sailor",who:"Sam",x:34.5,z:.55,ry:Math.PI/2,talk:[{who:"Sam",text:"Fine sloop, isn\u2019t she? Built of Jamaica cedar. Fast enough to catch anything on the sea."},{who:"You",text:"Are you a pirate?"},{who:"Sam",text:"Hush! Years ago the governor gave us papers to attack Spanish ships. That made us privateers, not pirates."},{who:"Sam",text:"Now the law has changed. Attack a ship without papers and they hang you at Gallows Point.",unlock:"privateer"}],again:[{who:"Sam",text:"We sail with the tide. Keep your purse close in the taverns."}]},{id:"benning",label:"Talk to the pewterer",who:"Simon Benning",x:8.6,z:3.55,ry:Math.PI,talk:[{who:"Simon Benning",text:"Good day! Simon Benning, pewterer. Plates, spoons, tankards. All made right here in Port Royal."},{who:"You",text:"You make them here, not in England?"},{who:"Simon Benning",text:"I melt the metal and pour it into moulds. Then I scrape and polish. Look for my mark stamped underneath."},{who:"Simon Benning",text:"This town is full of makers: silversmiths, pipe makers, carpenters. Ships bring the metal. We do the rest.",unlock:"benning"}],again:[{who:"Simon Benning",text:"Come back when you need plates. Good pewter lasts a lifetime."}]}],Ks={x:-9.65,z:1.75,ry:Math.PI/2},Gm=[[-2.6,-1.3,-.6,"kofi"],[-13.4,-1.6,.4,"sailor"]],Xv=[{who:"Emmanuel Heath",text:"I am Emmanuel Heath, minister of this town. My church fell in the earthquake. I heard the tower come down."},{who:"Emmanuel Heath",text:"I sleep on a ship in the harbour now. I come ashore to pray with the sick, and to christen the babies."},{who:"Emmanuel Heath",text:"Many people say God punished this town for its wickedness. I fear they are right. Pray for us.",unlock:"heath"}],jv=[{who:"Abba",text:"You are alive! I pulled so many from the water. Not enough."},{who:"Abba",text:"It has been three days. There is little food, the water is bad, and people are getting sick.",unlock:"after"},{who:"Abba",text:"At night, thieves go through the broken houses. In the day, we share what we have."},{who:"Abba",text:"Look around. Then come back and tell me what you will do."}],Kv=[{who:"Abba",text:"Most people are leaving. They are crossing the harbour to build a new town."},{who:"Abba",text:"You are a merchant, Lewis. You will be rich again. Ask yourself what you will sell to get there."}],Ad=[{who:"Abba",text:"Morning! You look lost. Are you new in Port Royal?",choices:["Yes. I just got off the ship.","Is it that easy to tell?"]},{who:"Abba",text:"Everyone here came from somewhere else. Where is home?"},{who:"You",text:"France. A town called Montpellier. It was not safe for my family to pray the way we do. So we left.",unlock:"galdy"},{who:"Abba",text:"Then you are in good company. This town is full of people starting again. I am Abba. I keep this tavern.",unlock:"people"},{who:"Abba",text:"Here is some advice. Money in this town is Spanish silver. People call the coins pieces of eight. Learn what things cost before you spend one.",unlock:"coins"},{who:"Abba",text:"And look around you. Brick houses four floors high, on a strip of sand! Come inside when you are hungry. My turtle stew is the best on Lime Street.",unlock:"town"}],Jv=[{who:"Abba",text:"Welcome to The Turtle! A bowl of turtle stew is two reales."},{who:"You",text:"I only have this. One piece of eight."},{who:"Abba",text:"A piece of eight is worth eight reales. The stew is two. How many reales do I give you back?",choices:[{t:"Four reales"},{t:"Six reales",ok:!0},{t:"Eight reales"}],hint:"Not quite. Start with eight and take away two."},{who:"Abba",text:"Six it is. Here is your change, and here is your stew. Eat while it is hot!",unlock:"change"},{who:"Abba",text:"Look around while you eat. Almost everything in this room came here on a ship."}],Sm=[{who:"Abba",text:"Take your time. Look around. Port Royal will still be here tomorrow."}],ms=[{id:"bottle",label:"Look at the bottle",x:-198.8,z:-2.15,y:1.02},{id:"pewter",label:"Look at the plates",x:-198.2,z:1.3,y:.78},{id:"pipes",label:"Look at the pipes",x:-201.6,z:1,y:.78},{id:"turtle",label:"Look at the little box",x:-195.9,z:2.3,y:.78}],P={started:!1,x:43,z:0,yaw:Math.PI/2,pitch:0,unlocked:[],talked:!1,step:0,place:"out",ate:!1,done:!1,ch:{}},oe=i=>document.getElementById(i),lo=matchMedia("(prefers-reduced-motion: reduce)").matches,Yv=matchMedia("(pointer: coarse)").matches,Rn=oe("stage"),gs=new Ll({canvas:Rn,antialias:!0,powerPreference:"high-performance"});gs.setPixelRatio(Math.min(devicePixelRatio||1,1.75));gs.toneMapping=Ya;gs.toneMappingExposure=1.12;var it=new Ma,Ql=new Xe(13624298);it.fog=new va(Ql,70,900);var Xr=new Kt(68,1,.1,3e3);Xr.rotation.order="YXZ";var Hm=new qa(15135231,11770488,2.3);it.add(Hm);var Vr=new Bs(16773592,2.6);Vr.position.set(-.35,1,.75);it.add(Vr);var Jr=null;{let i=new wn(2500,24,12),e=[],t=new Xe(4163273),n=new Xe;for(let s=0;s<i.attributes.position.count;s++){let r=Math.max(0,i.attributes.position.getY(s)/2500);n.copy(Ql).lerp(t,Math.pow(r,.55)),e.push(n.r,n.g,n.b)}i.setAttribute("color",new ht(e,3)),Jr=new Ut(i,new bt({vertexColors:!0,side:on,fog:!1,depthWrite:!1})),it.add(Jr)}function Cn(i,e,t){let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createImageData(128,128);for(let o=0;o<r.data.length;o+=4){let l=(Math.random()-.5)*e;r.data[o]=i[0]+l,r.data[o+1]=i[1]+l,r.data[o+2]=i[2]+l*.8,r.data[o+3]=255}s.putImageData(r,0,0);let a=new Ls(n);return a.wrapS=a.wrapT=zn,a.repeat.set(t,t),a.colorSpace=Nt,a}var bs=5.2,Un=-17.9,_o=17.9,Ve=23,Wr=new ke({color:2854560,roughness:.22,metalness:.15});{let i=new Ut(new yt(160,160),new ke({map:Cn([203,180,138],34,60),roughness:1}));i.rotation.x=-Math.PI/2,i.position.set(Ve-80,0,0),it.add(i);let e=new Ut(new yt(5e3,5e3),Wr);e.rotation.x=-Math.PI/2,e.position.y=-.62,it.add(e);for(let[t,n,s,r]of[[1500,230,8364966,1],[1150,120,6262662,2]]){let a=[];for(let h=0;h<=160;h++){let u=-Math.PI+2*Math.PI*h/160,f=Math.abs(Math.atan2(Math.sin(u-1.45),Math.cos(u-1.45))),d=Math.max(0,Math.min(1,(f-.95)/.7)),g=d*n*(.45+.3*Math.sin(h*.21+r)+.18*Math.sin(h*.63+r*3)+.07*Math.sin(h*1.7));a.push(Math.cos(u)*t,-2,Math.sin(u)*t,Math.cos(u)*t,Math.max(0,g)-1,Math.sin(u)*t)}let l=[];for(let h=0;h<160;h++){let u=h*2;l.push(u,u+1,u+2,u+1,u+3,u+2)}let c=new Dt;c.setAttribute("position",new ht(a,3)),c.setIndex(l),it.add(new Ut(c,new bt({color:s,side:Ot,fog:!1})))}}var Eo=new Et;Eo.visible=!1;it.add(Eo);var mn=it;function te(i,e,t,n,s,r){let a=new Ut(i,e);return a.position.set(t,n,s),(r||mn).add(a),a}var js=null,qr=null,Rd=[],gn={};function Zv(){let i=(T,I)=>new ke({map:T,roughness:I===void 0?.9:I}),e=(T,I,C,V,G,W,K,ce)=>te(new wt(T,I,C),V,G,W,K,ce),t=jt([138,120,96],5,21,3),n=i(t),s=i(jt([84,66,48],3,1,2)),r=i(jt([70,56,42],4,1,2)),a=new ke({color:1842206,roughness:.6,metalness:.7}),o=new ke({map:Cn([168,146,104],30,4),roughness:1}),l=new ke({map:Cn([156,136,100],30,3),roughness:1}),c=Ve-2.5,h=Ve+23,u=h-c,f=(c+h)/2;e(u,.1,3.4,n,f,0,0);for(let T of[-1.62,1.62])e(u,.22,.2,s,f,-.14,T),e(u,.12,.16,s,f,.1,T*1.02);for(let T=c+1;T<h;T+=2.6){e(.2,.22,3.2,s,T,-.16,0);for(let I of[-1.72,1.72]){let C=Math.round((T-c)/2.6)%2===0,V=te(new rt(.15,.17,C?3.3:2.4,9),r,T,C?-.25:-.9,I);C&&te(new rt(.17,.15,.06,9),s,T,1.42,I)}if(T<h-2)for(let I of[-1,1]){let C=e(.1,.1,3.6,s,T,-.85,0);C.rotation.x=I*.5}}for(let[T,I]of[[Ve+6,1.72],[Ve+11.2,1.72],[Ve+8.6,-1.72],[Ve+16.4,-1.72]]){let C=te(new pi(.24,.045,6,14),o,T,.75,I);C.rotation.x=Math.PI/2,te(new pi(.25,.045,6,14),o,T,.84,I).rotation.x=Math.PI/2}let d=(T,I,C)=>{for(let V=0;V<3;V++)te(new pi(C-V*.02,.04,6,16),o,T,.09+V*.07,I).rotation.x=Math.PI/2};d(Ve+4,-1.2,.3),d(Ve+19,1.15,.34);let g=gn.merchant;g.position.set(Ve+17.5,-.35,-5.9),it.add(g);let _=gn.sloop;_.position.set(Ve+17.5,-.35,4.9),_.rotation.y=Math.PI,it.add(_);let b=e(1,.07,2.3,n,Ve+17.6,.66,-2.1);b.rotation.x=-.56;for(let T=0;T<5;T++){let I=e(1,.03,.05,s,Ve+17.6,.2+T*.25,-1.4-T*.4);I.rotation.x=-.56}let p=(T,I)=>{let C=new Dt().setFromPoints([new B(...T),new B((T[0]+I[0])/2,Math.min(T[1],I[1])-.25,(T[2]+I[2])/2),new B(...I)]);it.add(new Ui(C,new as({color:9073742})))};p([Ve+8.6,.8,-1.72],[Ve+6,3.2,-3.6]),p([Ve+16.4,.8,-1.72],[Ve+21.5,2.2,-3.4]),p([Ve+11.2,.8,1.72],[Ve+10.5,1.5,3.4]),p([Ve+19,.6,1.72],[Ve+24.5,1.9,3.3]);let x=new fi([[0,-.45],[.27,-.45],[.33,-.25],[.36,0],[.33,.25],[.27,.45],[0,.45]].map(([T,I])=>new le(T,I)),14),M=i(jt([122,90,56],10,2,1),.8),y=[[-.38,.292],[-.2,.342],[.2,.342],[.38,.292]].map(([T,I])=>[T,new rt(I,I,.035,14,1,!0)]),A=(T,I,C,V)=>{let G=new Et;G.position.set(T,I+(V?.36:.45),C),V&&(G.rotation.z=Math.PI/2,G.rotation.y=T*2.3),it.add(G),te(x,M,0,0,0,G);for(let[W,K]of y)te(K,a,0,W,0,G)},w=i(jt([150,118,78],4,1,1)),m=(T,I,C,V,G)=>{let W=new Et;W.position.set(T,I+V/2,C),W.rotation.y=G,it.add(W),e(V,V,V,w,0,0,0,W);for(let K of[-1,1])for(let ce of[-1,1])e(.07,V+.03,.07,s,K*V/2,0,ce*V/2,W),e(V+.03,.07,.07,s,0,K*V/2,ce*V/2,W),e(.07,.07,V+.03,s,K*V/2,ce*V/2,0,W)},v=(T,I,C,V)=>{let G=te(new wn(.32,10,8),l,T,I+.2*V,C);G.scale.set(V*1.2,.7*V,V*.85),G.rotation.y=T};A(Ve+2.2,.05,1),A(Ve+2.9,.05,1.15),A(Ve+2.5,.05,.45,!0),m(Ve+14.6,.05,1.1,.8,.2),m(Ve+15.5,.05,1.2,.6,.6),m(Ve+14.7,.85,1.1,.55,.5),v(Ve+13.7,.05,1.2,1);for(let[T,I,C]of[[20.2,2.8,0],[20.9,3,0],[20.4,3.6,2],[19.6,-3.2,1],[20.6,-2.8,0],[21.5,-3.3,1],[20.3,-3.9,3],[21.1,-4.1,3],[20.7,-4,4]])C===0?A(T,0,I):C===2?A(T,0,I,!0):C===1?m(T,0,I,.75,T):C===3?v(T,0,I,1):v(T,.3,I,.9);let F=it.children.length;for(let[T,I,C]of[[-9.6,-4.4,0],[3.4,4.35,0],[4.15,4.4,1],[-13.2,4.4,0],[11.6,-4.4,1],[12.3,-4.45,0]])C?m(T,.12,I,.65,.1):A(T,.12,I);Rd.push(...it.children.slice(F));{let C=new ni;C.moveTo(-4.6/2,-1.5*.36),C.quadraticCurveTo(0,-1.5*.56,4.6*.3,-1.5*.4),C.quadraticCurveTo(4.6*.45,-1.5*.2,4.6/2,0),C.quadraticCurveTo(4.6*.45,1.5*.2,4.6*.3,1.5*.4),C.quadraticCurveTo(0,1.5*.56,-4.6/2,1.5*.36),C.closePath();let V=new Ns(C,{depth:.62,bevelEnabled:!1,curveSegments:8});V.rotateX(-Math.PI/2);let G=V.attributes.position;for(let ce=0;ce<G.count;ce++)G.getY(ce)<.3&&(G.setZ(ce,G.getZ(ce)*.45),G.setX(ce,G.getX(ce)*.9));V.computeVertexNormals();let W=new Et;W.position.set(Ve-2.6,0,7.2),W.rotation.set(0,.5,.12),it.add(W);let K=i(jt([96,80,62],6,3,1));K.side=Ot,te(V,K,0,0,0,W),e(4.6*.86,.03,1.5*.78,new ke({color:3812384,roughness:1}),-.1,.34,0,W);for(let ce of[-1.2,-.2,.9])e(.22,.04,1.5*.86,s,ce,.5,0,W);for(let ce of[-.2,.15]){let We=te(new rt(.025,.025,3.2,6),s,-.2,.56,ce,W);We.rotation.z=Math.PI/2+.03,e(.6,.02,.14,s,1.5,.52,ce,W)}}{let T=An(128,128,K=>{K.clearRect(0,0,128,128),K.strokeStyle="rgba(96,84,60,0.95)",K.lineWidth=1.4;for(let ce=-128;ce<256;ce+=12)K.beginPath(),K.moveTo(ce,0),K.lineTo(ce+128,128),K.stroke(),K.beginPath(),K.moveTo(ce,0),K.lineTo(ce-128,128),K.stroke()});T.repeat.set(3,1.4);let I=Ve-3.2,C=-8.4;for(let K of[-2,2])te(new rt(.05,.06,2.3,6),s,I+K,1.15,C);let V=te(new rt(.04,.04,4.3,6),s,I,2.2,C);V.rotation.z=Math.PI/2;let W=te(new yt(3.9,1.9,8,1),new bt({map:T,transparent:!0,side:Ot,alphaTest:.3}),I,1.25,C).geometry.attributes.position;for(let K=0;K<W.count;K++)W.setZ(K,Math.sin(W.getX(K)*2.2)*.12*(1-(W.getY(K)+.95)/1.9))}let L=te(new yt(3.2,160),new bt({color:7298372,transparent:!0,opacity:.35}),Ve-1.4,.006,0);L.rotation.x=-Math.PI/2;let U=An(64,256,T=>{T.clearRect(0,0,64,256);for(let I=0;I<256;I+=2){let C=14+Math.sin(I*.11)*8+Math.sin(I*.37)*5+Math.random()*6,V=T.createLinearGradient(32-C,0,32+C,0);V.addColorStop(0,"rgba(255,255,255,0)"),V.addColorStop(.6,"rgba(255,255,255,0.75)"),V.addColorStop(1,"rgba(255,255,255,0)"),T.fillStyle=V,T.fillRect(32-C,I,C*2,2)}});U.repeat.set(1,6);let H=te(new yt(1.6,160),new bt({map:U,transparent:!0,depthWrite:!1}),Ve+.2,-.33,0);H.rotation.x=-Math.PI/2;let J=te(new yt(1.2,160),new ke({map:Cn([176,152,112],30,30),roughness:1}),Ve+.45,-.19,0);J.rotation.set(-Math.PI/2+0,0,0),J.rotation.y=.33,js=An(128,128,T=>{let I=T.createImageData(128,128),C=new Float32Array(16384);for(let V=0;V<C.length;V++){let G=V%128,W=V/128|0;C[V]=Math.sin(G*.196+Math.sin(W*.147)*2)+Math.sin(W*.245+Math.sin(G*.098)*1.5)*.7+Math.sin((G+W)*.393)*.3}for(let V=0;V<128;V++)for(let G=0;G<128;G++){let W=V*128+G,K=C[V*128+(G+1)%128]-C[W],ce=C[(V+1)%128*128+G]-C[W];I.data[W*4]=128+K*150,I.data[W*4+1]=128+ce*150,I.data[W*4+2]=255,I.data[W*4+3]=255}T.putImageData(I,0,0)});let k=new yt(300,300,60,60);k.rotateX(-Math.PI/2),qr=te(k,Wr,Ve+60,-.35,0),qr.userData.base=k.attributes.position.array.slice(),js.colorSpace=Vn,js.repeat.set(160,160),Wr.normalMap=js,Wr.normalScale.set(.55,.55),Wr.needsUpdate=!0}var De={x0:-205,x1:-195,z0:-3.5,z1:3.5,h:2.8},Cd={},yd=null,yo=null,Hl=null,qi=null,vo=[];function An(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new Ls(n);return s.colorSpace=Nt,s.wrapS=s.wrapT=zn,s.anisotropy=Pd,s}function vd(i,e,t,n){let s=i.getImageData(0,0,e,t);for(let r=0;r<s.data.length;r+=4){let a=(Math.random()-.5)*n;s.data[r]+=a,s.data[r+1]+=a,s.data[r+2]+=a*.8}i.putImageData(s,0,0)}function jt(i,e,t,n){let s=An(256,256,(r,a,o)=>{let l=a/e;for(let c=0;c<e;c++){let h=(Math.random()-.5)*26;r.fillStyle=`rgb(${i[0]+h|0},${i[1]+h|0},${i[2]+h*.8|0})`,r.fillRect(c*l,0,l,o),r.strokeStyle="rgba(30,18,10,0.25)",r.lineWidth=1;for(let u=0;u<9;u++){let f=c*l+3+Math.random()*(l-6);r.beginPath(),r.moveTo(f,0),r.bezierCurveTo(f+3,o*.3,f-3,o*.6,f+1,o),r.stroke()}r.fillStyle="rgba(15,9,5,0.75)",r.fillRect(c*l,0,2,o),Math.random()<.5&&(r.fillStyle="rgba(25,14,8,0.6)",r.beginPath(),r.ellipse(c*l+l/2,Math.random()*o,3,5,0,0,7),r.fill())}vd(r,a,o,18)});return s.repeat.set(t||1,n||1),s}function $v(){mn=Eo;let i=(N,Z)=>new ke({map:N,roughness:Z===void 0?.9:Z}),e=i(jt([104,76,50],4,1,1)),t=i(jt([62,45,31],3,1,1)),n=i(jt([122,92,62],5,1,1),.8),s=i(jt([74,54,38],8,3,2)),r=new ke({color:3811869,roughness:.95}),a=An(512,256,(N,Z,ae)=>{let D=N.createLinearGradient(0,0,0,ae);D.addColorStop(0,"#d9ceb4"),D.addColorStop(.55,"#d2c6aa"),D.addColorStop(1,"#a7997c"),N.fillStyle=D,N.fillRect(0,0,Z,ae);for(let He=0;He<26;He++)N.fillStyle=`rgba(${90+Math.random()*40|0},${74+Math.random()*30|0},50,${.012+Math.random()*.025})`,N.beginPath(),N.ellipse(Math.random()*Z,Math.random()*ae,20+Math.random()*70,10+Math.random()*40,Math.random()*3,0,7),N.fill();vd(N,Z,ae,14)});a.wrapT=rn;let o=new ke({map:a,roughness:1}),l=An(256,256,(N,Z,ae)=>{N.fillStyle="#9b917e",N.fillRect(0,0,Z,ae);for(let D=0;D<8;D++)for(let He=-1;He<4;He++){let Fe=Math.random();N.fillStyle=`rgb(${150+Fe*36|0},${80+Fe*22|0},${54+Fe*14|0})`,N.fillRect(He*64+D%2*32+2,D*32+2,60,28)}for(let D=0;D<14;D++)N.fillStyle=`rgba(40,28,20,${.06+Math.random()*.1})`,N.beginPath(),N.ellipse(Math.random()*Z,Math.random()*ae,20+Math.random()*50,14+Math.random()*30,0,0,7),N.fill();vd(N,Z,ae,24)}),c=i(l),h=l.clone();h.repeat.set(5,3.5),h.needsUpdate=!0;let u=l.clone();u.repeat.set(1.2,1.6),u.needsUpdate=!0;let f=i(u),d=new ke({color:10658979,roughness:.38,metalness:.85}),g=new ke({color:11569722,roughness:.4,metalness:.8}),_=new ke({color:1842206,roughness:.6,metalness:.7}),b=new ke({color:2046506,roughness:.18,metalness:.15}),p=new ke({color:15328472,roughness:.8}),x=new ke({color:9071172,roughness:.5}),M=new ke({color:10135696,roughness:.35}),y=new ke({color:15260864,roughness:.7}),A=new bt({color:16762474}),w=new ke({map:Cn([150,130,96],30,3),roughness:1}),m=(N,Z,ae,D,He,Fe,pt,me)=>te(new wt(N,Z,ae),D,He,Fe,pt,me),v=(De.x0+De.x1)/2,F=De.x1-De.x0,L=De.z1-De.z0,U=De.h;te(new yt(F,L),i(h),v,0,0).rotation.x=-Math.PI/2,te(new yt(F,L),s,v,U,0).rotation.x=Math.PI/2;let H=(N,Z,ae,D,He)=>{let Fe=o.clone();Fe.map=a.clone(),Fe.map.repeat.set(He,1),Fe.map.needsUpdate=!0;let pt=te(new yt(N,U),Fe,Z,U/2,ae);pt.rotation.y=D};H(F,v,De.z0,0,3),H(F,v,De.z1,Math.PI,3),H(L,De.x0,0,Math.PI/2,2),H(L,De.x1,0,-Math.PI/2,2);for(let N=De.x0+.06;N<=De.x1;N+=(F-.12)/8)m(.13,U,.07,r,N,U/2,De.z0+.035);for(let N of[De.x0+.06,-204,-201.75,-198.8,-195.9,De.x1-.06])m(.13,U,.07,r,N,U/2,De.z1-.035);for(let N=De.z0+.06;N<=De.z1;N+=(L-.12)/6)m(.07,U,.13,r,De.x0+.035,U/2,N),m(.07,U,.13,r,De.x1-.035,U/2,N);m(F,.14,.08,r,v,.07,De.z0+.04),m(F,.14,.08,r,v,.07,De.z1-.04),m(.08,.14,L,r,De.x0+.04,.07,0),m(.08,.14,L,r,De.x1-.04,.07,0),m(F,.16,.09,r,v,U-.08,De.z0+.045),m(F,.16,.09,r,v,U-.08,De.z1-.045);for(let N=De.x0+.5;N<De.x1;N+=.62)m(.1,.15,L,r,N,U-.075,0);m(F,.26,.28,r,v,U-.28,.4);let J=An(256,160,(N,Z,ae)=>{let D=N.createLinearGradient(0,0,0,ae);D.addColorStop(0,"#f4f6ea"),D.addColorStop(1,"#cfdccf"),N.fillStyle=D,N.fillRect(0,0,Z,ae),N.strokeStyle="rgba(52,56,58,0.9)",N.lineWidth=2.2;for(let He=-ae;He<Z+ae;He+=22)N.beginPath(),N.moveTo(He,0),N.lineTo(He+ae*.62,ae),N.stroke(),N.beginPath(),N.moveTo(He,0),N.lineTo(He-ae*.62,ae),N.stroke()}),k=new bt({map:J}),T=new bt({map:J,transparent:!0,opacity:.2,blending:Dr,depthWrite:!1});for(let N of[-200.3,-197.3]){te(new yt(1.9,1.2),k,N,1.72,De.z1-.012).rotation.y=Math.PI;for(let ae of[-.475,.475])m(.05,1.2,.05,r,N+ae/1,1.72,De.z1-.03);m(.06,1.2,.06,r,N,1.72,De.z1-.03);for(let ae of[1.09,2.35])m(2.06,.08,.09,r,N,ae,De.z1-.04);for(let ae of[-.99,.99])m(.08,1.34,.09,r,N+ae,1.72,De.z1-.04);m(2.1,.05,.2,e,N,1.04,De.z1-.1);let Z=te(new yt(2,2.3),T,N-.3,.012,1.7);Z.rotation.x=-Math.PI/2}m(1.15,2.2,.06,e,-203,1.1,De.z1-.05);for(let N of[.45,1.75])m(.9,.06,.02,_,-203.05,N,De.z1-.09);m(.05,.14,.04,_,-202.55,1.1,De.z1-.1);for(let N of[-.63,.63])m(.1,2.3,.1,r,-203+N,1.15,De.z1-.05);m(1.36,.12,.1,r,-203,2.3,De.z1-.05),m(5.4,.95,.65,e,-200.9,.475,-2.2),m(5.6,.07,.8,n,-200.9,.985,-2.2);for(let N=-203.4;N<-198.3;N+=.9)m(.07,.8,.02,t,N,.5,-1.866);m(5.4,.08,.02,t,-200.9,.86,-1.866),m(5.4,.1,.03,t,-200.9,.05,-1.86);for(let N of[1.2,1.7,2.2])m(4.6,.045,.3,t,-201.2,N,De.z0+.2);for(let N of[-203.5,-201.2,-198.9])m(.05,1.5,.3,t,N,1.65,De.z0+.2);let I=[[0,0],[.085,0],[.105,.04],[.1,.09],[.06,.13],[.022,.17],[.02,.24],[.028,.245],[0,.245]].map(([N,Z])=>new le(N,Z)),C=new fi(I,14),V=new fi([[0,0],[.07,0],[.1,.08],[.095,.17],[.05,.23],[.045,.29],[.055,.3],[0,.3]].map(([N,Z])=>new le(N,Z)),14),G=new fi([[0,0],[.06,0],[.11,.1],[.115,.17],[.07,.24],[.075,.26],[0,.26]].map(([N,Z])=>new le(N,Z)),16),W=An(128,128,N=>{N.fillStyle="#1b3f8a",N.fillRect(0,0,128,128),N.fillStyle="#eef0ea",N.beginPath(),N.arc(64,64,62,0,7),N.fill(),N.strokeStyle="#2a4f9c",N.lineWidth=3;for(let Z of[56,40])N.beginPath(),N.arc(64,64,Z,0,7),N.stroke();N.lineWidth=2;for(let Z=0;Z<6.28;Z+=.52)N.beginPath(),N.moveTo(64+Math.cos(Z)*42,64+Math.sin(Z)*42),N.quadraticCurveTo(64+Math.cos(Z+.2)*50,64+Math.sin(Z+.2)*50,64+Math.cos(Z+.26)*55,64+Math.sin(Z+.26)*55),N.stroke();for(let Z=0;Z<6.28;Z+=1.05)N.beginPath(),N.ellipse(64+Math.cos(Z)*18,64+Math.sin(Z)*18,9,4,Z,0,7),N.stroke()}),K=[new ke({color:15263968,roughness:.3}),new ke({map:W,roughness:.25}),new ke({color:15263968,roughness:.3})],ce=new rt(.125,.11,.014,22),We=new rt(.04,.048,.12,12),Q=new pi(.03,.007,6,10,Math.PI),be=(N,Z,ae,D)=>{let He=new Et;He.position.set(N,Z,ae),He.rotation.y=D||0,mn.add(He),te(We,d,0,.06,0,He);let Fe=te(Q,d,.045,.06,0,He);Fe.rotation.z=-Math.PI/2},Ce=De.z0+.2;for(let N=0;N<5;N++)te(C,b,-203.2+N*.4,1.2225,Ce);for(let N=0;N<4;N++){let Z=te(ce,K,-200.8+N*.42,1.345,Ce-.06);Z.rotation.x=Math.PI/2-.22}for(let N=0;N<4;N++)te(V,x,-203.1+N*.5,1.7225,Ce);te(G,M,-200.6,1.7225,Ce);for(let N=0;N<5;N++)be(-200.05+N*.22,1.7225,Ce,.5*N);for(let N=0;N<6;N++)te(C,b,-203.2+N*.36,2.2225,Ce);for(let N=0;N<3;N++){let Z=te(ce,d,-200.6+N*.5,2.345,Ce-.06);Z.rotation.x=Math.PI/2-.22}te(new yt(.6,.45),new ke({map:An(128,96,N=>{N.fillStyle="#23262a",N.fillRect(0,0,128,96),N.strokeStyle="#d8d8d0",N.lineWidth=2;for(let Z=0;Z<3;Z++)for(let ae=0;ae<4+Z*2;ae++)N.beginPath(),N.moveTo(12+ae*9,14+Z*26),N.lineTo(14+ae*9,30+Z*26),N.stroke();N.strokeStyle="#6b4a2c",N.lineWidth=6,N.strokeRect(0,0,128,96)}),roughness:.9}),-198.3,1.7,De.z0+.012);let je=An(128,128,N=>{N.fillStyle="#6a4a24",N.fillRect(0,0,128,128),N.strokeStyle="#2c1c0c",N.lineWidth=3;for(let Z=0;Z<4;Z++)for(let ae=0;ae<4;ae++){let D=ae*34+Z%2*17-6,He=Z*34;N.fillStyle=`rgb(${120+Math.random()*40|0},${84+Math.random()*24|0},40)`,N.beginPath();for(let Fe=0;Fe<6;Fe++)N.lineTo(D+17+Math.cos(Fe*1.047)*19,He+17+Math.sin(Fe*1.047)*19);N.closePath(),N.fill(),N.stroke()}}),Ee=te(new wn(.42,18,10,0,6.3,0,1.2),i(je,.45),De.x1-.62,2.1,-.6);Ee.scale.set(.8,.5,1.05),Ee.rotation.z=Math.PI/2;let Ke=new fi([[0,-.52],[.34,-.52],[.4,-.3],[.44,0],[.4,.3],[.34,.52],[0,.52]].map(([N,Z])=>new le(N,Z)),18),Pt=i(jt([118,86,52],10,2,1),.8),Ye=(N,Z,ae)=>{let D=new Et;D.position.set(N,Z,ae),D.rotation.z=Math.PI/2,mn.add(D),te(Ke,Pt,0,0,0,D);for(let[Fe,pt]of[[-.45,.362],[-.24,.416],[.24,.416],[.45,.362]])te(new rt(pt,pt,.04,18,1,!0),_,0,Fe,0,D);let He=m(.14,.03,.03,g,N+.58,Z-.26,ae);return m(.03,.07,.03,g,N+.62,Z-.22,ae),He};for(let N of[-2.85,-1.9]){Ye(-204.35,.8,N),m(.9,.08,.1,t,-204.35,.32,N-.25),m(.9,.08,.1,t,-204.35,.32,N+.25);for(let Z of[-.38,.38])m(.1,.3,.7,t,-204.35+Z,.15,N)}let ot=(N,Z,ae,D)=>{m(ae,.05,D,n,N,.745,Z);for(let He of[-1,1]){let Fe=N+He*(ae/2-.28);for(let pt of[-1,1]){let me=m(.07,.76,.07,t,Fe,.36,Z+pt*.17);me.rotation.x=-pt*.3}m(.07,.07,D*.7,t,Fe,.69,Z)}m(ae-.5,.06,.05,t,N,.3,Z)},ct=(N,Z,ae)=>{m(ae,.05,.28,n,N,.45,Z);for(let D of[-1,1])m(.05,.45,.26,t,N+D*(ae/2-.16),.225,Z);m(ae-.3,.07,.04,t,N,.3,Z)},se=(N,Z,ae)=>{let D=new Et;D.position.set(N,0,Z),D.rotation.y=ae,mn.add(D),m(.34,.04,.26,n,0,.47,0,D);for(let He of[-1,1])for(let Fe of[-1,1]){let pt=m(.04,.47,.04,t,He*.13,.235,Fe*.09,D);pt.rotation.z=-He*.1}m(.26,.05,.03,t,0,.36,.09,D),m(.26,.05,.03,t,0,.36,-.09,D)};ot(-198.2,1.3,1.9,.8),ct(-198.2,.58,1.7),ct(-198.2,2.02,1.7),ot(-201.6,1,1.9,.8),ct(-201.6,.28,1.7),ct(-201.6,1.72,1.7),m(.7,.04,.7,n,-195.9,.75,2.3);for(let N of[-1,1])for(let Z of[-1,1])m(.05,.74,.05,t,-195.9+N*.28,.37,2.3+Z*.28);se(-202.6,-1.25,.3),se(-200.2,-1.3,-.2),se(-196.9,-1.7,.9),m(.4,.05,1.7,n,-204.72,.45,2),m(.05,1.5,1.7,e,-204.9,.75,2);for(let N of[-.85,.85])m(.42,1.05,.05,e,-204.72,.525,2+N);m(.38,.4,1.66,t,-204.72,.2,2);for(let N of[-1,1])m(.6,1.45,.4,f,De.x1-.3,.725,-.6+N*.9);m(.6,1.25,2.2,f,De.x1-.3,2.175,-.6),m(.12,1.45,1.4,new bt({color:919815}),De.x1-.07,.725,-.6),m(.62,.2,2.3,r,De.x1-.3,1.5,-.6),m(.75,.05,2.4,e,De.x1-.36,1.62,-.6),m(.7,.06,1.5,f,De.x1-.42,.03,-.6),m(.03,1.1,.03,_,De.x1-.2,.75,-1.2),m(.03,.03,.7,_,De.x1-.2,1.2,-.87),m(.015,.4,.015,_,De.x1-.2,1,-.6);let pe=te(new wn(.22,14,10),_,De.x1-.2,.72,-.6);pe.scale.y=.8,yd=te(new os(.22,.5,7),new bt({color:16751150}),De.x1-.22,.3,-.6);let fe=te(new os(.13,.32,6),A,De.x1-.26,.22,-.42);vo.push(fe);for(let[N,Z]of[[-.2,.3],[.15,-.4],[0,1.2]])te(new rt(.05,.05,.5,7),t,De.x1-.25,.09,-.6+N).rotation.set(Math.PI/2,0,Z);for(let N=0;N<7;N++){let Z=te(new rt(.055,.055,.55,7),e,De.x1-.45,.06+(N>3?.11:0),.95+N%4*.12+(N>3?.06:0));Z.rotation.z=Math.PI/2}for(let N=0;N<3;N++)te(ce,d,De.x1-.5,1.77,-1.2+N*.32).rotation.set(0,0,Math.PI/2-.22);te(G,M,De.x1-.42,1.645,.1),yo=new Hi(16751946,0,8,1.7),yo.position.set(De.x1-.9,.8,-.6),mn.add(yo);let Pe=(N,Z,ae)=>{te(new rt(.075,.06,.015,14),g,N,Z+.008,ae),te(new rt(.02,.024,.05,8),g,N,Z+.04,ae),m(.1,.008,.025,g,N+.1,Z+.012,ae),te(new rt(.011,.011,.12,6),y,N,Z+.12,ae);let D=te(new wn(.016,6,6),A,N,Z+.2,ae);D.scale.y=1.9,vo.push(D)};Pe(-198.75,.77,1.3),Pe(-201,.77,1.05),Pe(-202.9,1.02,-2.2),Pe(De.x1-.4,1.645,-1.5);{let ae=U-.95;m(.012,.5,.012,_,-200.2,ae+.42,.4),m(.18,.02,.18,_,-200.2,ae+.17,.4),m(.18,.02,.18,_,-200.2,ae-.13,.4);for(let D of[-1,1])for(let He of[-1,1])m(.015,.3,.015,_,-200.2+D*.08,ae+.02,.4+He*.08);m(.14,.26,.14,new bt({color:16766346,transparent:!0,opacity:.55}),-200.2,ae+.02,.4),Hl=new Hi(16767392,0,9,1.6),Hl.position.set(-200.2,ae,.4),mn.add(Hl)}be(-198.7,.77,1.08,1),be(-197.75,.77,1.5,3),be(-202.15,.77,.85,2),be(-201.3,.77,1.2,4.5),be(-201.9,1.02,-2.3,.6),te(V,x,-202.3,1.02,-2.05),te(V,x,-197.6,.77,1.12);for(let[N,Z]of[[0,0],[.05,.03],[-.03,.05],[.09,-.02]])te(new rt(.018,.018,.004,10),d,-200+N,1.022,-2+Z);for(let[N,Z,ae]of[[-195.6,-2.9,1],[-196.1,-3,.85],[-195.7,-2.4,.9]])te(new wn(.3,10,8),w,N,.24*ae,Z).scale.set(ae,.85*ae,ae*.9);let Se=te(new pi(.2,.04,6,16),w,-204.4,.05,-.7);Se.rotation.x=Math.PI/2;let nt=m(.03,1.4,.03,e,-204.8,.72,.6);nt.rotation.z=-.12,m(.1,.25,.18,w,-204.7,.13,.6);let Le={};for(let N of ms)Le[N.id]=new Et,Le[N.id].position.set(N.x,N.y,N.z),mn.add(Le[N.id]);te(C,b,0,0,0,Le.bottle).scale.setScalar(1.25),te(C,b,.26,0,.05,Le.bottle);for(let N=0;N<6;N++)te(ce,d,0,.009+N*.016,0,Le.pewter);for(let[N,Z]of[[-.06,.2],[.05,-.15],[.14,.05]]){let ae=new Et;ae.position.set(0,.012,N),ae.rotation.y=Z,Le.pipes.add(ae);let D=te(new rt(.006,.008,.34,6),p,0,0,0,ae);D.rotation.z=Math.PI/2,te(new rt(.016,.012,.045,8),p,.175,.015,0,ae)}{let N=An(64,64,D=>{D.fillStyle="#c8873a",D.fillRect(0,0,64,64),D.fillStyle="#4a2412";for(let He=0;He<46;He++)D.beginPath(),D.ellipse(Math.random()*64,Math.random()*64,3+Math.random()*7,2+Math.random()*5,Math.random()*3,0,7),D.fill()}),Z=new ke({map:N,roughness:.3}),ae=new ke({color:15260864,roughness:.5});m(.2,.11,.14,Z,0,.065,0,Le.turtle),m(.21,.012,.15,ae,0,.126,0,Le.turtle),m(.19,.05,.13,Z,0,.157,0,Le.turtle),m(.22,.012,.16,Z,0,.006,0,Le.turtle),m(.02,.03,.004,ae,0,.07,.072,Le.turtle)}for(let N of ms){let Z=new Ut(new cs(.27,.3,32),new bt({color:14263361,side:Ot}));Z.rotation.x=-Math.PI/2,Z.position.y=.004,Le[N.id].add(Z),Cd[N.id]=Z}qi=new Et,qi.position.set(-200.4,1.02,-2.05),qi.visible=!1,mn.add(qi),te(new rt(.11,.06,.07,16),d,0,.035,0,qi),te(new rt(.1,.1,.01,16),new ke({color:8014370,roughness:.6}),0,.066,0,qi),m(.012,.01,.16,d,.16,.006,.02,qi),mn=it}function Ki(i){P.place=i;let e=i!=="out",t=i==="in"?Eo:i==="ware"?Xi:it;for(let n of it.children)n.isLight||(n===Eo?n.visible=i==="in":n===Xi?n.visible=i==="ware":n===Xn||n===ps?n.visible=!1:n.visible=!e);t.add(Rt),Rt.visible=i!=="ware",Hm.intensity=e?.5:2.3,Vr.intensity=e?1.5:2.6,i==="in"?Vr.position.set(.3,.75,1):i==="ware"?Vr.position.set(1,.7,.2):Vr.position.set(-.35,1,.75),yo.intensity=i==="in"?16:0,Hl.intensity=i==="in"?9:0,To&&(To.intensity=i==="ware"?14:0),i==="in"?(at.x=-201,at.z=-2.95,Rt.position.set(at.x,0,at.z)):i==="ware"?(at.x=9999,at.z=0):(at.x=-5.25,at.z=-bs+1.05,Rt.position.set(at.x,.12,at.z)),Rt.rotation.y=0,ln&&(ln.visible=!e&&!P.talked)}var mo={h1:6,h2:5,h3:7.2,h4:6.6,h5:5.4,h6:5.6},Qv=["h2","h6","h1","h4","h5","h3"],eM=["h3","h1","h5","h2","h4","h6"],Vm=new Ul;Vm.setMeshoptDecoder(Mm);var Ys=!1;function Wm(i){oe("loadnote").hidden=!1,oe("loadnote").textContent="Part of the game did not load ("+i+"). Reload the page to try again."}function qm(i){return new Promise((e,t)=>{let n=document.createElement("script");n.src="models/"+i+".js",n.onload=e,n.onerror=()=>{Wm(i),t(i)},document.head.appendChild(n)})}function Xm(i){return qm(i).then(()=>new Promise((e,t)=>{let n=atob(window.__models[i]),s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);delete window.__models[i],Vm.parse(s.buffer,"",e,()=>{Wm(i),t(i)})}))}async function wm(i,e){let t=0;await Promise.all(i.map(n=>(n.startsWith("tex_")?qm(n):Xm(n).then(s=>{window.__got=window.__got||{},window.__got[n]=s})).then(()=>{t++,e&&e(t/i.length)})))}var jm={},Rt=null,at={x:-5.25,z:-bs+1.05},Pd=gs.capabilities.getMaxAnisotropy(),Tm={Brick:["brick","brick_n"],Shingle:["shingle","shingle_n"],ClayTile:["clay","clay_n"],Wood:["wood","wood_n"],Stone:["stone","stone_n"],Plaster:["plaster","plaster_n"],LeadedGlass:["glass","glass_n"],Hull:["hull","hull_n"],Spar:["hull","hull_n"],Tar:["hull","hull_n"],Ochre:["hull","hull_n"],Red:["hull","hull_n"],Deck:["deck","deck_n"],Sail:["canvas"],Glass:["glass"],Flag:["ensign"]},gd={},bd={},gT=new Us,Kl={};async function Em(){await Promise.all(Object.keys(window.__tex||{}).filter(i=>!Kl[i]).map(i=>new Promise(e=>{let t=new Image;t.onload=()=>{Kl[i]=t,e()},t.onerror=()=>e(),t.src=window.__tex[i]})))}function Md(i,e){if(!gd[i]&&Kl[i]){let t=new Vt(Kl[i]);t.needsUpdate=!0,t.flipY=!1,t.wrapS=t.wrapT=zn,t.colorSpace=e?Nt:Vn,t.anisotropy=Pd,gd[i]=t}return gd[i]||null}function ho(i){return i.traverse(e=>{if(e.isMesh&&Tm[e.material.name]){let t=e.material.name;if(!bd[t]){let n=e.material,[s,r]=Tm[t];n.map=Md(s,!0),n.color.set(16777215),r&&(n.normalMap=Md(r,!1)),n.needsUpdate=!0,bd[t]=n}e.material=bd[t]}}),tM(i)}function tM(i){return i.traverse(e=>{if(e.isMesh){let t=e.material;t.map&&(t.map.anisotropy=Pd),t.name==="LeadedGlass"&&(t.emissive=new Xe(4875376),t.emissiveMap=t.map,t.roughness=.2),e.isSkinnedMesh&&(e.frustumCulled=!1)}}),i}var Jl=null,Am=null,jr=null,ci={},Km=[];function Id(i){if(!jr)return;let e=new Pr(i),t=e.clipAction(jr);t.play(),t.time=Math.random()*jr.duration,Km.push(e)}function eh(i){for(let e of Ro)ci[e.id]&&(ci[e.id].visible=i)}function nM(){let i=document.createElement("canvas");i.width=264,i.height=200;let e=i.getContext("2d");e.fillStyle="#5d4a36",e.fillRect(0,0,264,200),e.strokeStyle="#d9a441",e.lineWidth=6,e.strokeRect(8,8,248,184),e.fillStyle="#3f7a5c",e.beginPath(),e.ellipse(132,86,62,40,0,0,7),e.fill(),e.beginPath(),e.ellipse(206,80,18,13,0,0,7),e.fill();for(let[n,s]of[[88,50],[176,50],[88,122],[176,122]])e.beginPath(),e.ellipse(n,s,20,10,(n<132?-1:1)*(s<86?.6:-.6),0,7),e.fill();e.strokeStyle="#2a563f",e.lineWidth=3,e.beginPath(),e.moveTo(132,48),e.lineTo(132,124),e.moveTo(74,86),e.lineTo(190,86),e.stroke(),e.fillStyle="#f1ead9",e.font="600 30px Georgia, serif",e.textAlign="center",e.fillText("THE TURTLE",132,174);let t=new Ls(i);return t.colorSpace=Nt,t}var ln=null,th=[];function iM(){let i=(t,n,s,r)=>{let a=jm[t].clone(!0);a.position.set(n,0,s),a.rotation.y=r,it.add(a);let o=Math.max(0,Math.min(1,(n-Un)/(_o-Un))),l=Math.sin(n*12.9+s*78.2)*43758.5%1,c=Math.abs(l);return th.push({m:a,ry:r,sink:n<Un?1.2+c*1.5:c>.72?13:2.2+o*4.5+c*2.5,tx:(c-.5)*.3,tz:(c*7%1-.5)*.24,delay:(1-o)*4.5+c*2,dur:4.5+c*3}),a},e=Un;for(let t of Qv){let n=i(t,e+mo[t]/2,-bs-4,0);if(t==="h1"){let s=new bt({map:nM()});for(let r of[-1,1]){let a=new Ut(new yt(.68,.52),s);a.position.set(r*.028,3.94,4.67),a.rotation.y=r*Math.PI/2,n.add(a)}}e+=mo[t]}e=Un;for(let t of eM)i(t,e+mo[t]/2,bs+4,Math.PI),e+=mo[t];i("h4",Un-5.9,-3.4,Math.PI/2),i("h2",Un-5.9,2.4,Math.PI/2),i("h6",Un-5.9,8,Math.PI/2),i("h3",Un-5.9,-10.5,Math.PI/2),Rt.position.set(at.x,.12,at.z),it.add(Rt),ln=new Ut(new cs(.75,.9,40),new bt({color:14263361,transparent:!0,opacity:.8,side:Ot})),ln.rotation.x=-Math.PI/2,ln.position.set(at.x,.14,at.z+.2),it.add(ln)}var xd=!1,vn=new Set,cn={id:null,ox:0,oy:0,x:0,y:0},ai={id:null,lx:0,ly:0},jn=!1;addEventListener("keydown",i=>{let e=i.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e)&&P.started&&i.preventDefault(),vn.add(e),!!P.started)if(e==="escape"&&(Yr(),e0()),oe("dialogue").hidden===!1&&(e==="enter"||e===" ")){let t=oe("next");t.hidden||t.click()}else(e==="e"||e==="enter")&&!oe("talk").hidden?oe("talk").click():e==="j"&&(oe("journal").hidden?Dd():Yr())});addEventListener("keyup",i=>vn.delete(i.key.toLowerCase()));addEventListener("blur",()=>vn.clear());Rn.addEventListener("pointerdown",i=>{if(!(!P.started||jn))if(Rn.setPointerCapture(i.pointerId),i.pointerType==="touch"&&i.clientX<innerWidth*.42&&cn.id===null){cn.id=i.pointerId,cn.ox=i.clientX,cn.oy=i.clientY,cn.x=cn.y=0;let e=oe("stick");e.hidden=!1,e.style.left=i.clientX+"px",e.style.top=i.clientY+"px",oe("nub").style.transform="translate(-50%,-50%)"}else ai.id===null&&(ai.id=i.pointerId,ai.lx=i.clientX,ai.ly=i.clientY)});Rn.addEventListener("pointermove",i=>{if(i.pointerId===cn.id){let e=i.clientX-cn.ox,t=i.clientY-cn.oy,n=Math.hypot(e,t),s=48;n>s&&(e*=s/n,t*=s/n),cn.x=e/s,cn.y=t/s,oe("nub").style.transform=`translate(calc(-50% + ${e}px), calc(-50% + ${t}px))`}else if(i.pointerId===ai.id){let e=i.pointerType==="touch"?.0052:.0034;P.yaw-=(i.clientX-ai.lx)*e,P.pitch=Math.max(-.9,Math.min(.9,P.pitch-(i.clientY-ai.ly)*e)),ai.lx=i.clientX,ai.ly=i.clientY}});var Jm=i=>{i.pointerId===cn.id&&(cn.id=null,cn.x=cn.y=0,oe("stick").hidden=!0),i.pointerId===ai.id&&(ai.id=null)};Rn.addEventListener("pointerup",Jm);Rn.addEventListener("pointercancel",Jm);function sM(i,e){if(P.place==="ware"){i=Math.max(Hr+.5,Math.min(qn-.6,i)),e=Math.max(-1.4,Math.min(4.4,e));for(let[t,n,s]of[[-258.6,2.9,1.5],[-252.5,1.2,1]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(P.place==="after"){i=Math.max(Un+.6,Math.min(.4,i)),e=Math.max(-3.4,Math.min(3.4,e));for(let t of r0)[i,e]=bM(i,e,t[0],t[1],t[2]/2+.35,t[4]/2+.35,t[5]);for(let[t,n,s]of[[go,bo,.75],[at.x,at.z,.65],[Ks.x,Ks.z,.65],...Gm.map(r=>[r[0],r[1],.6])]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(P.place==="yard"){i=Math.max($t+.8,Math.min($t+13,i)),e=Math.max(Qt-13,Math.min(Qt+4.5,e));let t=i-($t+6),n=e-(Qt-2),s=Math.hypot(t,n);return s<1.7&&s>0&&(i=$t+6+t/s*1.7,e=Qt-2+n/s*1.7),[i,e]}if(P.place==="sea")return[Math.max(Ve+4,Math.min(Ve+75,i)),Math.max(9,Math.min(75,e))];if(P.place==="in"){i=Math.max(De.x0+.45,Math.min(De.x1-.95,i)),e=Math.max(-1.5,Math.min(De.z1-.45,e));for(let[t,n,s]of[[-198.2,1.3,1.25],[-201.6,1,1.25],[-195.9,2.3,.75]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}i=Math.max(Un-.2,Math.min(Ve+23,i)),!Ys&&i<_o+2.5&&(i=_o+2.5,xd||(xd=!0,Kn("The town is still loading."),setTimeout(()=>{xd=!1},4e3))),i=Math.min(Ve+21.5,i),i>Ve-1.5?P.x<=Ve-1.5&&Math.abs(e)>1.4?i=Ve-1.5:e=Math.max(-1.4,Math.min(1.4,e)):i>_o+.3?e=Math.max(-9,Math.min(9,e)):e=Math.max(-(bs-.45),Math.min(bs-.45,e));for(let[t,n]of[[at.x,at.z],...Ys&&!ge.on?Ro.map(s=>[s.x,s.z]):[]]){let s=i-t,r=e-n,a=Math.hypot(s,r);a<.75&&a>0&&(i=t+s/a*.75,e=n+r/a*.75)}return[i,e]}var Rm=0;function Kn(i){let e=oe("toast");e.textContent=i,e.hidden=!1,clearTimeout(Rm),Rm=setTimeout(()=>{e.hidden=!0},2600)}function ji(i){if(P.unlocked.includes(i))return;P.unlocked.push(i),$r();let e=xo.find(t=>t.id===i);oe("jcount").textContent=P.unlocked.length,oe("jcount").hidden=!1,Kn("Journal: "+e.title)}var On="",Cm=0,Pm=0;function Ji(i){let e=oe("goal");e.textContent=On,e.classList.remove("folded"),e.setAttribute("aria-expanded","true"),clearTimeout(Cm),Cm=setTimeout(()=>{e.textContent="Goal",e.classList.add("folded"),e.setAttribute("aria-expanded","false")},6500),i&&Ym()}function Ym(){oe("hint").hidden=!1,clearTimeout(Pm),Pm=setTimeout(()=>{oe("hint").hidden=!0},6e3)}oe("goal").onclick=()=>Ji(!0);function _d(){return ms.filter(i=>P.unlocked.includes(i.id)).length}function li(){if(ge.on||P.place==="ware")return;let i;P.unlocked.includes("harbour")?P.talked?P.place==="out"&&!P.ate?i="Go into The Turtle. The door is right beside Abba.":P.ate?_d()<ms.length?i="Look around the tavern. Things found: "+_d()+" of "+ms.length+".":i="You have finished the first part. Open your journal for the next part of the story.":i="Abba is behind the counter. Ask her for some stew.":i="Find the woman in the white head wrap. She keeps the tavern with the turtle sign.":i="Walk down the pier and into the town.",i!==On&&(On=i,Ji()),P.ate&&_d()===ms.length&&!P.done&&(P.done=!0,setTimeout(()=>Kn("Well done! Your journal now has "+P.unlocked.length+" pages."),3800))}var Mo=Ad,Sd=null;function Zm(){let i=Mo[P.step];oe("who").textContent=i.who,oe("line").textContent=i.text;let e=oe("choices");if(e.replaceChildren(),i.choices){oe("next").hidden=!0;for(let t of i.choices){let n=typeof t=="string"?{t,ok:!0}:t,s=document.createElement("button");s.className="btn ghost",s.textContent=n.t,s.onclick=()=>{n.ok?Ld():(oe("line").textContent=i.hint+" "+i.text.split(". ").pop(),s.disabled=!0)},e.appendChild(s)}e.firstChild.focus()}else oe("next").hidden=!1,oe("next").textContent=P.step===Mo.length-1?Mo===Ad?"Goodbye for now":"Thank you":"Next",oe("next").focus();i.unlock&&ji(i.unlock)}function Ld(){if(P.step++,P.step>=Mo.length){oe("dialogue").hidden=!0,oe("goal").hidden=!1,jn=!1,P.step=0;let i=Sd;Sd=null,i&&i(),li(),Rn.focus();return}Zm()}function ds(i,e){Mo=i,Sd=e,jn=!0,vn.clear(),oe("talk").hidden=!0,oe("hint").hidden=!0,oe("goal").hidden=!0,oe("dialogue").hidden=!1,P.step=0,Zm()}oe("next").onclick=Ld;var rM=[...["sugar","cocoa","logwood"].map((i,e)=>({label:["Look at the casks","Look at the sacks","Look at the red wood"][e],r:2.6,where:()=>P.place==="ware"&&!P.unlocked.includes(i)&&Wl[i],go:()=>{ji(i),c0[i].visible=!1,ql()}})),{label:"Sit at the desk",r:2.4,where:()=>P.place==="ware"&&l0()&&!Si.coins&&[-258.6,2.9],go:()=>ds(Wv,()=>{Si.coins=!0,Rt.visible=!0,at.x=-250.2,at.z=.4,Rt.position.set(at.x,0,at.z),Kn("Abba has come in."),ql()})},{label:"Talk to Abba",r:3,where:()=>P.place==="ware"&&Si.coins&&!Si.talked&&[at.x,at.z],go:()=>ds(qv,()=>{Si.talked=!0,ql()})},{label:"Read the letter",r:2.4,where:()=>P.place==="ware"&&Si.talked&&[-258.6,2.9],go:wM},{label:"Talk to Abba",r:3.2,where:()=>P.place==="after"&&[at.x,at.z],go:()=>{o0()&&ge.aTalk?ds(Kv,_M):ds(jv,()=>{ge.aTalk=!0,Vl()})}},{label:"Look at the big tent",r:3.6,where:()=>P.place==="after"&&!P.unlocked.includes("tentp")&&[-12.5,.8],go:()=>{ji("tentp"),Vl()}},{label:"Look across the water",r:2.6,where:()=>P.place==="after"&&!P.unlocked.includes("kingston")&&[.2,0],go:()=>{ji("kingston"),Vl()}},{label:"Read the tombstone",r:3.2,where:()=>P.place==="yard"&&[$t+6,Qt-2],go:vM},...Ro.map(i=>({label:i.label,r:2.6,where:()=>Ys&&!ge.on&&P.place==="out"&&ci[i.id]&&[i.x,i.z],go:()=>ds(P.unlocked.includes(i.id)?i.again:i.talk)})),{label:"Talk to the minister",r:2.6,where:()=>P.place==="after"&&ci.heath&&ci.heath.parent&&[Ks.x,Ks.z],go:()=>ds(P.unlocked.includes("heath")?[{who:"Emmanuel Heath",text:"God keep you, Mr Galdy."}]:Xv)},{label:"Reach for the boat",r:3.6,where:()=>P.place==="sea"&&ge.boat&&[ge.boat.position.x,ge.boat.position.z],go:()=>Bd(!1)},{label:"Talk to her",r:3.4,where:()=>Ys&&!ge.on&&P.place==="out"&&[at.x,at.z],go:()=>ds(P.talked?Sm:Ad,()=>{P.talked=!0,ln&&(ln.visible=!1)})},{label:"Go into the tavern",r:2,where:()=>Zr&&!ge.on&&P.place==="out"&&P.talked&&[-6.18,-4.5],go:()=>{Ki("in"),P.x=-203,P.z=2.3,P.yaw=0,P.pitch=0,li()}},{label:"Go back to the street",r:1.3,where:()=>P.place==="in"&&[-203,3.3],go:()=>{Ki("out"),P.x=-6.18,P.z=-3.4,P.yaw=Math.PI,P.pitch=0,li()}},{label:"Talk to Abba",r:2.3,where:()=>P.place==="in"&&[-201,-1.9],go:()=>ds(P.ate?Sm:Jv,()=>{P.ate||(P.ate=!0,qi.visible=!0)})},...ms.map(i=>({label:i.label,r:1.9,where:()=>P.place==="in"&&!P.unlocked.includes(i.id)&&[i.x,i.z],go:()=>{ji(i.id),Cd[i.id].visible=!1,li()}}))],fs=null;oe("talk").onclick=()=>{fs&&fs.go()};function $m(i){let e=oe("jtabs");e.replaceChildren();let t=i||P.unlocked[P.unlocked.length-1];xo.filter(c=>P.unlocked.includes(c.id)).forEach(c=>{let h=document.createElement("button");h.className="tab"+(c.id===t?" on":""),h.textContent=c.title,h.onclick=()=>$m(c.id),e.appendChild(h)});let n=xo.length-P.unlocked.length;if(n>0){let c=document.createElement("button");c.className="tab",c.disabled=!0,c.textContent=n+" more to find",e.appendChild(c)}let s=oe("jpage");s.replaceChildren();let r=xo.find(c=>c.id===t);if(!r){let c=document.createElement("p");c.textContent="Your journal is empty. Talk to people in the town to fill it.",s.appendChild(c);return}let a=document.createElement("h3");a.textContent=r.title,s.appendChild(a);for(let c of r.simple){let h=document.createElement("p");h.textContent=c,s.appendChild(h)}let o=document.createElement("details"),l=document.createElement("summary");l.textContent="Dig deeper",o.appendChild(l);for(let c of r.deeper){let h=document.createElement("p");h.textContent=c,o.appendChild(h)}s.appendChild(o)}function Dd(){oe("dialogue").hidden&&(jn=!0,vn.clear(),$m(),oe("journal").hidden=!1,oe("jclose").focus())}function Yr(){oe("journal").hidden||(oe("journal").hidden=!0,jn=!1)}oe("jbtn").onclick=Dd;oe("jclose").onclick=Yr;function Qm(){Od(),P.started=!0,oe("title").hidden=!0,oe("hud").hidden=!1,P.unlocked.length&&(oe("jcount").textContent=P.unlocked.length,oe("jcount").hidden=!1),li(),oe("hint").textContent=Yv?"Left thumb walks. Drag to look.":"W A S D to walk. Drag to look. E to use.",Ym(),Rn.focus()}oe("start").onclick=()=>{Qm(),Qr("begin")};var Nd="portroyal-save-v1",wd=!1,Im=0;function $r(){try{localStorage.setItem(Nd,JSON.stringify({unlocked:P.unlocked,talked:P.talked,ate:P.ate,done:P.done,ch:P.ch,pos:P.place==="out"&&!ge.on?[P.x,P.z,P.yaw]:null}))}catch{}}function aM(){try{return JSON.parse(localStorage.getItem(Nd)||"null")}catch{return null}}function oM(i){if(!i||!Array.isArray(i.unlocked))return;P.unlocked=i.unlocked.filter(t=>xo.some(n=>n.id===t)),P.talked=!!i.talked,P.ate=!!i.ate,P.done=!!i.done,P.ch=i.ch&&typeof i.ch=="object"?i.ch:{};let e=i.pos;Array.isArray(e)&&e.every(Number.isFinite)&&e[0]>Un-1&&e[0]<Ve+24&&Math.abs(e[1])<9.5&&!(e[0]<_o+.3&&Math.abs(e[1])>bs)&&(P.x=e[0],P.z=e[1],P.yaw=e[2]),wd=P.unlocked.length>0}addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&P.started&&$r()});function cM(){Ti(),ge.on&&(ea(),ge.on=!1),Ki("out"),P.x=43,P.z=0,P.yaw=Math.PI/2,P.pitch=0,On="",li(),Qr("begin")}var Lm=[{year:"1690",name:"Arrival",go:cM,done:()=>P.ate},{year:"1691",name:"The warehouse",go:()=>SM(),done:()=>!!P.ch.ware},{year:"7 June 1692",name:"The earthquake",go:()=>n0(),done:()=>P.unlocked.includes("tomb")},{year:"1692",name:"The days after",go:()=>wo(),done:()=>!!P.ch.after},{year:"1739 and today",name:"The tombstone",go:()=>$l(),done:()=>P.unlocked.includes("stone")}];function Fd(){let i=oe("chlist");i.replaceChildren(),Lm.forEach((e,t)=>{let n=t===0||P.ch.all||Lm[t-1].done(),s=e.done(),r=document.createElement("li"),a=document.createElement("button");a.className="chbtn"+(s?" done":""),a.disabled=!n||!Zr;for(let[o,l]of[["yr",e.year],["nm",e.name],["st",Zr?s?"Done":n?"Play":"Locked":"Loading"]]){let c=document.createElement("span");c.className=o,c.textContent=l,a.appendChild(c)}a.onclick=()=>lM(e),r.appendChild(a),i.appendChild(r)}),oe("chteach").hidden=!!P.ch.all,oe("chreset").textContent="Start again",oe("chreset").dataset.armed=""}function Ud(){Yr(),jn=!0,vn.clear(),Fd(),oe("chapters").hidden=!1,(oe("chlist").querySelector("button:not(:disabled)")||oe("chclose")).focus()}function e0(){oe("chapters").hidden||(oe("chapters").hidden=!0,jn=!oe("card").hidden,P.started&&Rn.focus())}function lM(i){oe("chapters").hidden=!0,jn=!1,P.started||Qm(),i.go()}oe("chclose").onclick=e0;oe("tchap").onclick=Ud;oe("jchap").onclick=Ud;oe("chteach").onclick=()=>{P.ch.all=!0,$r(),Fd()};oe("chreset").onclick=()=>{let i=oe("chreset");if(!i.dataset.armed){i.dataset.armed="1",i.textContent="Tap again to erase all progress";return}try{localStorage.removeItem(Nd)}catch{}location.reload()};var Ge={ctx:null,master:null,on:!0,ch:{},crack:null};try{Ge.on=localStorage.getItem("portroyal-sound")!=="off"}catch{}function hM(i){let e=Ge.ctx,t=e.sampleRate*3,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0),r=0;for(let o=0;o<t;o++){let l=Math.random()*2-1;i==="brown"?(r=(r+.02*l)/1.02,s[o]=r*3.5):s[o]=l*.5}let a=e.createBufferSource();return a.buffer=n,a.loop=!0,a.start(),a}function uo(i,e,t,n){let s=Ge.ctx,r=s.createBiquadFilter(),a=s.createGain();return r.type=e,r.frequency.value=t,n&&(r.Q.value=n),a.gain.value=0,hM(i).connect(r),r.connect(a),a.connect(Ge.master),a.f=r,a}function Od(){try{if(!Ge.ctx){let i=window.AudioContext||window.webkitAudioContext;if(!i)return;Ge.ctx=new i,Ge.master=Ge.ctx.createGain(),Ge.master.gain.value=Ge.on?.8:0,Ge.master.connect(Ge.ctx.destination),Ge.ch.sea=uo("brown","lowpass",800),Ge.ch.surf=uo("white","bandpass",2200,.4),Ge.ch.wind=uo("white","bandpass",650,.6),Ge.ch.crowd=uo("white","bandpass",480,2.2),Ge.ch.room=uo("brown","lowpass",160);let e=Ge.ctx.sampleRate*.03,t=Ge.ctx.createBuffer(1,e,Ge.ctx.sampleRate),n=t.getChannelData(0);for(let s=0;s<e;s++)n[s]=(Math.random()*2-1)*(1-s/e);Ge.crack=t}Ge.ctx.resume()}catch{Ge.ctx=null}}function kd(i){let e=Ge.ctx,t=e.createGain();if(e.createStereoPanner){let n=e.createStereoPanner();n.pan.value=i,t.connect(n),n.connect(Ge.master)}else t.connect(Ge.master);return t}function uM(){let i=Ge.ctx,e=i.currentTime+.05,t=kd(Math.random()*1.6-.8),n=i.createBiquadFilter();n.type="bandpass",n.frequency.value=1500,n.Q.value=1.4,n.connect(t),t.gain.value=.35+Math.random()*.4;for(let s=0,r=2+(Math.random()*2|0);s<r;s++){let a=e+s*.42,o=i.createOscillator(),l=i.createGain(),c=i.createOscillator(),h=i.createGain();o.type="triangle",o.frequency.setValueAtTime(1300,a),o.frequency.linearRampToValueAtTime(1750,a+.06),o.frequency.exponentialRampToValueAtTime(950,a+.34),c.frequency.value=28,h.gain.value=45,c.connect(h),h.connect(o.frequency),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(.16,a+.03),l.gain.exponentialRampToValueAtTime(1e-4,a+.36),o.connect(l),l.connect(n),o.start(a),c.start(a),o.stop(a+.4),c.stop(a+.4)}}function dM(){let i=Ge.ctx,e=i.currentTime,t=i.createBufferSource(),n=i.createBiquadFilter(),s=kd(.3);t.buffer=Ge.crack,t.playbackRate.value=.6+Math.random(),n.type="highpass",n.frequency.value=1400,s.gain.value=.05+Math.random()*.12,t.connect(n),n.connect(s),t.start(e)}function fM(){let i=Ge.ctx,e=i.currentTime+.02,t=kd(Math.random()*1.4-.7);t.gain.value=.5;for(let n=0;n<3;n++){let s=e+n*.13,r=i.createOscillator(),a=i.createGain();r.frequency.setValueAtTime(2600,s),r.frequency.exponentialRampToValueAtTime(3700,s+.07),a.gain.setValueAtTime(1e-4,s),a.gain.exponentialRampToValueAtTime(.05,s+.015),a.gain.exponentialRampToValueAtTime(1e-4,s+.08),r.connect(a),a.connect(t),r.start(s),r.stop(s+.1)}}function Qr(i){if(!Ge.ctx)return;let e=Ge.ctx,t=e.currentTime+.05,n={begin:[[293.66,0],[369.99,.35],[440,.7],[587.33,1.05]],sad:[[293.66,0],[349.23,.5],[440,1],[392,1.6]],end:[[440,0],[369.99,.6],[329.63,1.2],[293.66,1.8]]}[i],s=e.createBiquadFilter();s.type="lowpass",s.frequency.value=1400,s.connect(Ge.master);for(let[r,a]of n)for(let o of[0,7]){let l=e.createOscillator(),c=e.createGain();l.type="triangle",l.frequency.value=r,l.detune.value=o,c.gain.setValueAtTime(1e-4,t+a),c.gain.exponentialRampToValueAtTime(.05,t+a+.08),c.gain.exponentialRampToValueAtTime(1e-4,t+a+2.4),l.connect(c),c.connect(s),l.start(t+a),l.stop(t+a+2.5)}}var Dm=0,Nm=2,Fm=0,Um=0,Bl=.6;function fo(i,e,t){i.gain.setTargetAtTime(e,Ge.ctx.currentTime,t||.5)}function pM(i){if(!Ge.ctx||!P.started||i<Dm)return;Dm=i+.1;let e=P.place,t=ge.on&&["tremor","main","swallow"].includes(ge.phase),n=.72+.28*Math.sin(i*.55)+.1*Math.sin(i*1.7),s=0,r=0,a=0,o=0,l=0,c=!1,h=!1,u=!1;if(e==="out"){let f=Math.max(0,Math.min(1,(P.x+5)/(Ve+10)));s=(.15+.55*f)*n,r=.04*f*n,a=ge.ruin?.1:.05,c=!ge.ruin&&P.x>-2}else e==="in"?(o=.3,h=!0,s=.03):e==="ware"?(l=.14,s=.16*n,c=!0):e==="sea"?(s=.8*n,r=.08*n,a=.12):e==="after"?(s=.22*n,a=.14):e==="yard"&&(a=.07,s=.08*n,u=!0);t&&(s*=.4,r=0,o=0,c=u=!1),fo(Ge.ch.sea,s),fo(Ge.ch.surf,r),fo(Ge.ch.wind,a),fo(Ge.ch.room,l),Bl=Math.max(.3,Math.min(1,Bl+(Math.random()-.5)*.3)),fo(Ge.ch.crowd,o*Bl,.12),Ge.ch.crowd.f.frequency.setTargetAtTime(380+Bl*260,Ge.ctx.currentTime,.2),c&&i>Nm&&(Nm=i+6+Math.random()*10,uM()),h&&i>Fm&&(Fm=i+.05+Math.random()*.35,dM()),u&&i>Um&&(Um=i+3+Math.random()*6,fM())}function t0(){let i=oe("snd");i.setAttribute("aria-pressed",Ge.on?"true":"false"),i.setAttribute("aria-label",Ge.on?"Sound on. Tap to turn off.":"Sound off. Tap to turn on."),oe("sndon").style.display=Ge.on?"":"none",oe("sndoff").style.display=Ge.on?"none":""}oe("snd").onclick=()=>{Ge.on=!Ge.on;try{localStorage.setItem("portroyal-sound",Ge.on?"on":"off")}catch{}Od(),Ge.master&&Ge.master.gain.setTargetAtTime(Ge.on?.8:0,Ge.ctx.currentTime,.1),t0()};t0();addEventListener("pointerdown",()=>{Ge.ctx&&Ge.ctx.state!=="running"&&Ge.ctx.resume()});var nh=2.7,Yl=1.62,Js=-.35,ge={on:!1,phase:"",t:0,shake:0,ruin:!1,boat:null,debris:[],T:0,ac:null,gain:null},Zl=new Xe(12167304),Td=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i));function wi(i,e,t){jn=!0,vn.clear(),oe("ctitle").textContent=i;let n=oe("cbody");n.replaceChildren();for(let r of e){let a=document.createElement("p");a.textContent=r,n.appendChild(a)}let s=oe("cbtns");s.replaceChildren(),t.forEach((r,a)=>{let o=document.createElement("button");o.className="btn"+(a?" ghost":""),o.textContent=r.t,o.onclick=r.go,s.appendChild(o)}),oe("card").hidden=!1,oe("talk").hidden=!0,s.firstChild.focus()}function Ti(){oe("card").hidden=!0,jn=!1,Rn.focus()}function Ao(i,e){for(let t of th){let n=e===void 0?Td((i-t.delay)/t.dur):e;t.m.position.y=-t.sink*n+(n>0&&n<1?Math.sin(i*40+t.delay*9)*.03:0),t.m.rotation.set(t.tx*n,t.ry,t.tz*n)}}function mM(){if(Od(),!Ge.ctx||ge.gain)return;let i=Ge.ctx,e=i.sampleRate*2,t=i.createBuffer(1,e,i.sampleRate),n=t.getChannelData(0),s=0;for(let o=0;o<e;o++)s=(s+.02*(Math.random()*2-1))/1.02,n[o]=s*3.5;let r=i.createBufferSource();r.buffer=t,r.loop=!0;let a=i.createBiquadFilter();a.type="lowpass",a.frequency.value=150,ge.gain=i.createGain(),ge.gain.gain.value=0,r.connect(a),a.connect(ge.gain),ge.gain.connect(Ge.master),r.start()}function Kr(i){ge.phase=i,ge.t=0}function n0(){if(Qr("sad"),!Ys||!Zr){Kn("The town is still loading.");return}Yr(),oe("card").hidden=!0,oe("dialogue").hidden=!0,oe("goal").hidden=!1,wi("7 June 1692",["Two years have passed. Lewis Galdy is now a merchant in Port Royal.","This part of the story shows the great earthquake. It is loud, and it can be scary."],[{t:"Begin",go:So},{t:"Read what happened instead",go:()=>Bd(!0)}])}function So(){Ti(),mM(),P.place!=="out"&&Ki("out"),ea(),ge.on=!0,Kr("calm"),P.place="out",P.x=1,P.z=.6,P.yaw=-Math.PI/2,P.pitch=0,ln&&(ln.visible=!1),eh(!1),On="It is a hot, still morning. Walk down to the harbour.",Ji(),Kn("7 June 1692, late morning")}function ea(){ge.ruin=!1,ge.shake=0,ge.T=0,Ao(0,0),Js=-.35,nh=2.7,Yl=1.62,it.fog.color.copy(Ql),it.fog.near=70,it.fog.far=900,Jr.material.color.set(16777215),oe("vig").style.opacity=0;let i=gn.merchant,e=gn.sloop;i.position.set(Ve+17.5,-.35,-5.9),i.rotation.set(0,0,0),e.position.set(Ve+17.5,-.35,4.9),e.rotation.set(0,Math.PI,0),Xn&&(Xn.visible=!1),ps&&(ps.visible=!1);for(let t of Rd)t.visible=!0;eh(!0);for(let t of th)t.m.visible=!0;gn.merchant.visible=gn.sloop.visible=!0,ge.aTalk=!1,ge.boat&&(ge.boat.visible=!1);for(let t of ge.debris)t.visible=!1;at.x=-5.25,at.z=-bs+1.05,Rt.position.set(at.x,.12,at.z),Rt.visible=!0,ge.gain&&(ge.gain.gain.value=0)}function i0(){if(ge.boat)return;let i=new ke({map:jt([96,80,62],6,3,1),roughness:.9,side:Ot}),e=new ke({map:jt([110,86,60],3,1,1),roughness:.9}),t=5.2,n=1.7,s=new ni;s.moveTo(-t/2,-n*.36),s.quadraticCurveTo(0,-n*.56,t*.3,-n*.4),s.quadraticCurveTo(t*.45,-n*.2,t/2,0),s.quadraticCurveTo(t*.45,n*.2,t*.3,n*.4),s.quadraticCurveTo(0,n*.56,-t/2,n*.36),s.closePath();let r=new Ns(s,{depth:.7,bevelEnabled:!1,curveSegments:8});r.rotateX(-Math.PI/2);let a=r.attributes.position;for(let c=0;c<a.count;c++)a.getY(c)<.3&&(a.setZ(c,a.getZ(c)*.45),a.setX(c,a.getX(c)*.9));r.computeVertexNormals();let o=new Et;it.add(o),te(r,i,0,-.3,0,o),te(new wt(t*.86,.03,n*.78),e,-.1,.02,0,o);for(let c of[-1.5,1.2])te(new wt(.24,.04,n*.86),e,c,.2,0,o);let l=te(new Ha(.28),new bt({color:14263361}),0,3.3,0,o);o.userData.mark=l,ge.boat=o;for(let c=0;c<12;c++){let h=c%3,u=te(h===0?new rt(.3,.3,.9,10):h===1?new wt(.7,.6,.7):new wt(2.6,.12,.3),e,Ve+8+c*37%50,0,12+c*53%55);h===0&&(u.rotation.z=Math.PI/2),u.rotation.y=c*1.3,u.userData.ph=c*1.7,ge.debris.push(u)}}function Ed(){Ti(),i0(),ge.ruin=!0,Ao(0,1),Js=.2,nh=1.5,oe("vig").style.opacity=0,it.fog.color.copy(Zl),it.fog.near=25,it.fog.far=320,Jr.material.color.set(14273972);let i=gn.merchant,e=gn.sloop;i.position.set(Ve+19,-1.2,-7),i.rotation.set(.42,.15,.05),e.position.set(Ve-6,.5,13),e.rotation.set(-.5,2.2,.08),P.place="sea",P.x=Ve+12,P.z=22,ge.boat.position.set(Ve+30,Js,46),ge.boat.rotation.y=.6,ge.boat.visible=!0;for(let t of ge.debris)t.visible=!0;P.yaw=Math.atan2(-(ge.boat.position.x-P.x),-(ge.boat.position.z-P.z)),P.pitch=0,at.x=ge.boat.position.x,at.z=ge.boat.position.z,Rt.visible=!0,Kr("sea"),On="Swim to the boat with the gold marker.",Ji(),Kn("A second shock throws you into the sea.")}function Bd(i){for(let e of["quake","sand","watch","tomb"])ji(e);ge.shake=0,ge.gain&&(ge.gain.gain.value=0),ge.phase="end",wi(i?"What happened":"Saved",i?["Just before noon, an earthquake shook Port Royal. The wet sand under the town turned to liquid, and most of the town sank into the sea.","Lewis Galdy was swallowed by the ground, thrown out into the sea by a second shock, and saved by a boat.","Four new pages are in your journal."]:["Hands pull you over the side of the boat. You are alive.","Behind you, most of Port Royal is under the sea.","Four new pages are in your journal."],[{t:"Go on: the days after",go:wo},{t:"Play the earthquake again",go:So},{t:"Go back to 1690",go:s0}])}function s0(){Ti(),ea(),ge.on=!1,P.place="out",P.x=17,P.z=.4,P.yaw=Math.PI/2,P.pitch=0,li(),On="",li()}function gM(i,e){ge.t+=i;let t=ge.t;if(ge.phase==="calm")(t>9||P.x>9)&&(Kr("tremor"),Kn("Abba: \u201CDid you feel that?\u201D"));else if(ge.phase==="tremor")ge.shake=t<2.6?.22*Math.sin(t/2.6*Math.PI):0,t>4.6&&(Kr("main"),On="Run! Get away from the houses!",Ji());else if(ge.phase==="main"){ge.shake=Math.min(1,t/1.5),ge.T=t,Ao(t);let n=Td(t/5);it.fog.color.copy(Ql).lerp(Zl,n),it.fog.near=70-62*n,it.fog.far=900-830*n,Jr.material.color.set(16777215).lerp(Zl,n*.8),t>2.5&&Rt.visible&&(Rt.visible=!1,Kn("Abba: \u201CRun! To the boats!\u201D")),t>8.5&&(Kr("swallow"),On="The sand is pulling you down!",Ji())}else if(ge.phase==="swallow"){ge.shake=1,ge.T+=i,Ao(ge.T);let n=Td(t/3.6);Yl=1.62-1.25*n,nh=2.7*(1-.9*n),oe("vig").style.opacity=n,t>4&&oe("card").hidden&&(ge.shake=.3,wi("Swallowed",["The wet sand has turned to liquid. It closes around you, up to your neck.","You cannot move. Then the ground shakes again."],[{t:"Next",go:Ed}]))}else if(ge.phase==="sea"){ge.shake=t<1.5?.6*(1-t/1.5):Math.sin(e*.5)>.96?.25:0,Yl=Js+.32+Math.sin(e*1.6)*.07;let n=ge.boat;n.position.y=Js+.12+Math.sin(e*1.2)*.06,n.rotation.z=Math.sin(e*.9)*.05,n.userData.mark.rotation.y=e*1.5,Rt.position.set(n.position.x-.3,n.position.y+.05,n.position.z);for(let s of ge.debris)s.position.y=Js+Math.sin(e*1.1+s.userData.ph)*.07,s.rotation.x=Math.sin(e*.7+s.userData.ph)*.12;Math.hypot(P.x-n.position.x,P.z-n.position.z)<2.3&&oe("card").hidden&&Bd(!1)}ge.gain&&(ge.gain.gain.value=Math.min(1,ge.shake)*.9)}var Xn=null,ps=null,r0=[[-12.5,.8,3.6,3,4.6,Math.PI/2],[-7.6,-1.75,2.4,1.9,2.7,.08],[-5.2,1.8,2.2,1.8,2.5,-.1],[-16,-1.9,2.2,1.9,2.8,0]],go=-9.8,bo=-1.7;function bM(i,e,t,n,s,r,a){let o=Math.cos(a),l=Math.sin(a),c=i-t,h=e-n,u=c*o-h*l,f=c*l+h*o;if(Math.abs(u)>=s||Math.abs(f)>=r)return[i,e];let d=u,g=f;return s-Math.abs(u)<r-Math.abs(f)?d=Math.sign(u||1)*s:g=Math.sign(f||1)*r,[t+d*o+g*l,n-d*l+g*o]}var $t=-100,Qt=70;function oi(i,e){let t=Md("brick",!0).clone();return t.repeat.set(i,e),t.needsUpdate=!0,new ke({map:t,roughness:.95})}function xM(){if(Xn)return;Xn=new Et,it.add(Xn),mn=Xn;let i=new ke({map:Cn([206,194,166],26,3),roughness:1,side:Ot}),e=new ke({map:jt([92,72,52],3,1,2),roughness:.95}),t=new ke({map:Cn([150,130,100],30,3),roughness:1}),n=new ke({color:1842206,roughness:.6,metalness:.7}),s=(c,h,u,f,d,g)=>{let _=new Et;_.position.set(c,0,h),_.rotation.y=g,Xn.add(_);let b=new ni;b.moveTo(-u/2,0),b.lineTo(0,f),b.lineTo(u/2,0);let p=new Ns(b,{depth:d,bevelEnabled:!1});p.translate(0,0,-d/2);let x=te(p,i,0,0,0,_);x.material=[new bt({visible:!1}),i];let M=te(new rt(.04,.04,d+.5,6),e,0,f,0,_);M.rotation.x=Math.PI/2;for(let A of[-1,1])te(new rt(.05,.05,f,6),e,0,f/2,A*d/2,_);let y=new ni;y.moveTo(-u/2,0),y.lineTo(0,f),y.lineTo(u/2,0),y.closePath(),te(new Er(y),i,0,0,-d/2,_)};for(let c of r0)s(c[0],c[1],c[2],c[3],c[4],c[5]);for(let[c,h,u]of[[-.2,0,.3],[.15,.1,-.5],[0,-.15,1.3]])te(new rt(.06,.06,.7,7),e,go+c,.08,bo+h).rotation.set(Math.PI/2,0,u);te(new os(.2,.5,7),new bt({color:16751150}),go,.33,bo);for(let c of[-1,1]){let h=te(new rt(.02,.02,1.3,5),n,go+c*.3,.6,bo);h.rotation.z=c*.45}let r=te(new wn(.16,10,8),n,go,.7,bo);r.scale.y=.8;for(let[c,h,u]of[[-11.4,-2.4,1],[-12.3,-2.6,.85],[-6.4,-.1,.85],[-3.2,2.5,1],[-13.6,-2.5,1]])te(new wn(.3,10,8),t,c,.2*u,h).scale.set(1.2*u,.7*u,.9*u);let a=oi(1.5,.5);for(let[c,h,u,f,d,g]of[[-2,-2.4,2.2,.7,.15,1.2],[-1,2.4,2,.9,-.2,1.2],[-15.9,2.5,1.8,.5,.1,1]])te(new wt(u,f,g),a,c,f/2-.1,h).rotation.set(.12,d,.1);for(let[c,h,u,f,d]of[[-4.3,-2.9,3,.15,.18],[-3.6,.2,2.6,-1.25,.12],[-9.6,2.8,3,.05,.3],[-10.8,-2.9,2.4,-.05,.1]])te(new wt(u,.2,.2),e,c,.35,h).rotation.set(0,f,d);let o=te(new yt(160,160),Wr,81.2,.07,0);o.rotation.x=-Math.PI/2;let l=te(new yt(3,14),new bt({color:6245944,transparent:!0,opacity:.4}),-.2,.012,0);l.rotation.x=-Math.PI/2,a0();for(let[c,h,u,f]of Gm){if(!ci[f])continue;let d=Fl(ci[f]);d.traverse(g=>{g.isMesh&&(g.material=g.material.clone(),g.material.color.setRGB(.78,.74,.68))}),d.position.set(c,0,h),d.rotation.y=u,Xn.add(d),Id(d)}mn=it}function a0(){let i=ci.heath;!i||!Xn||i.parent||(i.position.set(Ks.x,0,Ks.z),i.rotation.y=Ks.ry,Xn.add(i),Id(i))}function o0(){return P.unlocked.includes("tentp")&&P.unlocked.includes("kingston")}function Vl(){On=ge.aTalk?o0()?"Go back to Abba.":"Look around: the big tent, and the edge of the water.":"Find Abba in the camp.",Ji()}function wo(){Qr("sad"),Ti(),xM(),i0(),P.place!=="out"&&Ki("out"),ea(),ge.on=!0,ge.phase="after",ge.ruin=!0,Ao(0,1),Xn.visible=!0;let i=gn.merchant,e=gn.sloop;i.position.set(Ve+19,-1.2,-7),i.rotation.set(.42,.15,.05),e.position.set(Ve-6,.5,13),e.rotation.set(-.5,2.2,.08),it.fog.color.copy(Zl),it.fog.near=35,it.fog.far=420,Jr.material.color.set(14866626),P.place="after",P.x=-1.6,P.z=0,P.yaw=Math.PI/2,P.pitch=0,at.x=-8.9,at.z=.7;for(let t of Rd)t.visible=!1;Rt.position.set(at.x,0,at.z),Rt.visible=!0,ln&&(ln.visible=!1),eh(!1),Vl(),Kn("Three days later")}function _M(){wi("Stay, or go?",["The town you knew is under the sea. Across the harbour, people are starting again.","What will you do?"],[{t:"Stay and build again",go:()=>wi("He stayed",["The real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church."],[{t:"Go to the church",go:$l}])},{t:"Cross the harbour",go:()=>wi("Most people left",["Most survivors crossed the harbour, and their new town became Kingston.","But the real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church."],[{t:"Go to the church",go:$l}])}])}function yM(){if(ps)return;ps=new Et,it.add(ps),mn=ps;let i=new ke({map:Cn([176,172,160],26,2),roughness:.9}),e=new ke({map:Cn([96,84,74],30,6),roughness:.95}),t=new ke({color:1776152,roughness:.9}),n=new ke({map:jt([84,62,44],4,1,1),roughness:.9}),s=te(new yt(30,30),new ke({map:Cn([126,138,92],36,10),roughness:1}),$t,.02,Qt-4);s.rotation.x=-Math.PI/2;let r=oi(16,2.4);for(let[w,m,v,F]of[[$t,Qt-19,30,.5],[$t,Qt+11,30,.5],[$t-15,Qt-4,.5,30],[$t+15,Qt-4,.5,30]])te(new wt(v,2.6,F),r,w,1.3,m),te(new wt(v+.2,.14,F+.2),i,w,2.67,m);let a=$t-4,o=Qt-6,l=8,c=15,h=6;te(new wt(l,h,c),oi(8,5.5),a,h/2,o);let u=Math.atan2(3.2,l/2),f=Math.hypot(l/2,3.2)+.4;for(let w of[-1,1]){let m=te(new wt(f,.14,c+.6),e,a+w*(l/4+.1),h+1.55,o);m.rotation.z=-w*u}for(let w of[-1,1]){let m=new ni;m.moveTo(-l/2,0),m.lineTo(0,3.2),m.lineTo(l/2,0),m.closePath();let v=te(new Er(m),oi(.25,.3),a,h,o+w*c/2);v.material.side=Ot}for(let w of[-4.5,0,4.5])for(let m of[-1,1])te(new wt(.1,2.8,1.2),t,a+m*(l/2+.01),3.2,o+w),te(new rt(.6,.6,.1,12,1,!1,0,Math.PI),t,a+m*(l/2+.01),4.6,o+w).rotation.set(0,0,Math.PI/2*m+(m>0?0:Math.PI));let d=4.6,g=o+c/2+d/2-.3;te(new wt(d,11,d),oi(4.5,10),a,5.5,g),te(new wt(d+.4,.3,d+.4),i,a,11.1,g);for(let w of[-1,1])for(let m of[-1,1])te(new wt(.5,.9,.5),i,a+w*(d/2-.1),11.7,g+m*(d/2-.1));te(new wt(1.6,2.6,.12),n,a,1.3,g+d/2+.02),te(new wt(1.2,1.6,.1),t,a,7.5,g+d/2+.02);let _=$t+6,b=Qt-2;te(new wt(1.2,.2,2.5),i,_,.1,b),te(new wt(1,.7,2.3),oi(2.3,.7),_,.55,b);let p=An(128,256,w=>{w.fillStyle="#b9b6aa",w.fillRect(0,0,128,256),w.strokeStyle="#6f6c62",w.lineWidth=2,w.beginPath(),w.arc(64,44,22,0,7),w.stroke(),w.strokeRect(46,30,36,30),w.lineWidth=1.5;for(let m=0;m<17;m++)w.beginPath(),w.moveTo(16+m%3*3,84+m*9.5),w.lineTo(112-m%4*5,84+m*9.5),w.stroke()});p.wrapS=p.wrapT=rn;let x=te(new wt(1.25,.12,2.55),[i,i,new ke({map:p,roughness:.85}),i,i,i],_,.96,b),M=te(new cs(1.75,1.9,40),new bt({color:14263361,side:Ot}),_,.05,b);M.rotation.x=-Math.PI/2;for(let[w,m]of[[$t+3,Qt-9],[$t+9.5,Qt-7],[$t+1.5,Qt+3]])te(new wt(.7,1,.14),i,w,.5,m).rotation.z=.06;let y=new ke({color:5208636,roughness:.9,side:Ot}),A=new ke({map:Cn([120,100,78],30,2),roughness:1});for(let[w,m,v]of[[$t+11,Qt-13,7],[$t+12,Qt+6,6],[$t-12,Qt+7,7.5]]){let F=te(new rt(.16,.24,v,8),A,w,v/2,m);F.rotation.z=.06;for(let L=0;L<9;L++){let U=te(new yt(.7,3.4),y,w+.3,v,m);U.geometry.translate(0,1.7,0),U.rotation.set(1.15+L%3*.18,L*.7,0,"YXZ")}}mn=it}function $l(){Ti(),P.place!=="out"&&Ki("out"),P.ch.after=!0,$r(),yM(),ea(),ge.on=!0,ge.phase="yard";for(let i of th)i.m.visible=!1;gn.merchant.visible=gn.sloop.visible=!1,Rt.visible=!1,eh(!1),ps.visible=!0,P.place="yard",P.x=$t+11,P.z=Qt+3.5,P.yaw=.95,P.pitch=.06,at.x=9999,On="Find the tomb beside the church.",Ji(),Kn("St Peter\u2019s Church, Port Royal")}function vM(){Qr("end"),ji("fortune"),ji("stone"),wi("The end of the story",["Lewis Galdy lived for 47 more years. His tombstone tells of his escape, and says that everyone loved him.","It does not say what he sold to grow rich. Abba would have told it another way.","Two new pages are in your journal."],[{t:"Read the journal",go:()=>{Ti(),Dd()}},{t:"Go back to 1690",go:s0}])}var Xi=null,To=null,Hr=-262,qn=-248,Si={coins:!1,talked:!1},c0={},Wl={sugar:[-259.5,-2.6],cocoa:[-254.6,-2.9],logwood:[-250.4,-2.9]};function l0(){return["sugar","cocoa","logwood"].every(i=>P.unlocked.includes(i))}function ql(){On=l0()?Si.coins?Si.talked?"Read the letter on your desk.":"Abba is at the door. Talk to her.":"Sit at your desk and serve a customer.":"Check today\u2019s cargo: the casks, the sacks and the red wood.",Ji()}function MM(){if(Xi)return;Xi=new Et,Xi.visible=!1,it.add(Xi),mn=Xi;let i=(T,I,C,V,G,W,K,ce)=>te(new wt(T,I,C),V,G,W,K,ce),e=(T,I)=>new ke({map:T,roughness:I===void 0?.9:I}),t=e(jt([104,76,50],4,1,1)),n=new ke({color:3811869,roughness:.95}),s=e(jt([122,92,62],5,1,1),.8),r=new ke({color:1842206,roughness:.6,metalness:.7}),a=new ke({color:11569722,roughness:.4,metalness:.8}),o=new ke({color:12172216,roughness:.4,metalness:.85}),l=new ke({map:Cn([150,126,92],30,3),roughness:1}),c=new ke({color:15129792,roughness:.9}),h=(Hr+qn)/2,u=qn-Hr,f=10,d=3.8;te(new yt(u,f),oi(7,5),h,0,0).rotation.x=-Math.PI/2,te(new yt(u,f),e(jt([70,52,38],8,4,3)),h,d,0).rotation.x=Math.PI/2,te(new yt(u,d),oi(14,4),h,d/2,-5),te(new yt(u,d),oi(14,4),h,d/2,5).rotation.y=Math.PI,te(new yt(f,d),oi(10,4),Hr,d/2,0).rotation.y=Math.PI/2;for(let[T,I,C,V]of[[4.1,-2.95,d,d/2],[2.5,3.75,d,d/2],[3.4,.8,d-3,3+(d-3)/2]])te(new yt(T,C),oi(T,C),qn,V,I).rotation.y=-Math.PI/2;for(let T=Hr+1;T<qn;T+=2)i(.22,.26,f,n,T,d-.13,0);for(let T of[-2.2,2.2])for(let I of[Hr+4.6,qn-4.6])i(.28,d,.28,n,I,d/2,T);for(let T of[-1,1]){let I=new Et;I.position.set(qn-.05,0,.8+T*1.7),I.rotation.y=T*1.48,Xi.add(I),i(.07,3,1.7,t,0,1.5,-T*.85,I);for(let C of[.5,2.5])i(.02,.06,1.2,r,-.045,C,-T*.75,I)}for(let T of[-.95,2.55])i(.2,3,.15,n,qn-.05,1.5,T);i(.25,.25,3.8,n,qn-.05,3.1,.8);let g=te(new yt(4,6),new bt({map:jt([150,132,106],6,4,2)}),qn+2,.005,.8);g.rotation.x=-Math.PI/2;let _=An(768,512,(T,I,C)=>{let V=T.createLinearGradient(0,0,0,C*.55);V.addColorStop(0,"#7fb3dc"),V.addColorStop(1,"#d9e7ee"),T.fillStyle=V,T.fillRect(0,0,I,C),T.fillStyle="#9db7b2",T.beginPath(),T.moveTo(0,C*.5);for(let G=0;G<=24;G++)T.lineTo(G*I/24,C*(.42+.06*Math.sin(G*.9)+.03*Math.sin(G*2.3)));T.lineTo(I,C*.56),T.lineTo(0,C*.56),T.fill(),V=T.createLinearGradient(0,C*.55,0,C),V.addColorStop(0,"#2c94a4"),V.addColorStop(1,"#1d6f7e"),T.fillStyle=V,T.fillRect(0,C*.55,I,C*.45),T.strokeStyle="rgba(255,255,255,0.25)",T.lineWidth=2;for(let G=0;G<40;G++){let W=C*.58+Math.random()*C*.38,K=Math.random()*I;T.beginPath(),T.moveTo(K,W),T.lineTo(K+20+Math.random()*30,W),T.stroke()}T.fillStyle="#4b3423",T.beginPath(),T.moveTo(I*.2,C*.6),T.lineTo(I*.82,C*.6),T.quadraticCurveTo(I*.86,C*.66,I*.78,C*.73),T.lineTo(I*.27,C*.73),T.quadraticCurveTo(I*.19,C*.68,I*.2,C*.6),T.fill(),T.fillStyle="#c99a4a",T.fillRect(I*.2,C*.6,I*.62,C*.018),T.fillStyle="#1e1712",T.fillRect(I*.24,C*.66,I*.54,C*.012),T.strokeStyle="#3b2a1c",T.lineWidth=6;for(let G of[.35,.52,.68])T.beginPath(),T.moveTo(I*G,C*.6),T.lineTo(I*G,C*.08),T.stroke();T.lineWidth=4;for(let[G,W,K]of[[.35,.3,.14],[.52,.22,.17],[.52,.4,.2],[.68,.32,.14]])T.beginPath(),T.moveTo(I*(G-K/2),C*W),T.lineTo(I*(G+K/2),C*W),T.stroke();T.strokeStyle="rgba(40,30,20,0.6)",T.lineWidth=1;for(let G of[.35,.52,.68])for(let W of[-.07,.07])T.beginPath(),T.moveTo(I*G,C*.12),T.lineTo(I*(G+W),C*.6),T.stroke();T.fillStyle="#8a6c4c",T.fillRect(0,C*.8,I,C*.2),T.fillStyle="#5c4632";for(let G=0;G<9;G++)T.fillRect(G*I/8,C*.8,8,C*.2);T.fillStyle="#6b513a",T.fillRect(0,C*.8,I,6)});_.wrapS=_.wrapT=rn,te(new yt(9,6),new bt({map:_,fog:!1}),qn+4,2.4,.8).rotation.y=-Math.PI/2;let b=te(new yt(4.5,3.2),new bt({color:16773839,transparent:!0,opacity:.16,blending:Dr,depthWrite:!1}),qn-2.6,.012,.8);b.rotation.x=-Math.PI/2,te(new yt(1.4,.9),new bt({color:14674402}),h-2,2.9,4.99).rotation.y=Math.PI;for(let T of[-.35,0,.35])i(.04,.9,.04,r,h-2+T,2.9,4.96);let p=new fi([[0,-.6],[.4,-.6],[.48,-.32],[.52,0],[.48,.32],[.4,.6],[0,.6]].map(([T,I])=>new le(T,I)),16),x=e(jt([126,94,58],10,2,1),.8),M=(T,I,C)=>{let V=new Et;V.position.set(T,I+.6,C),Xi.add(V),te(p,x,0,0,0,V);for(let[G,W]of[[-.5,.435],[-.25,.497],[.25,.497],[.5,.435]])te(new rt(W,W,.045,16,1,!0),r,0,G,0,V)};for(let T=0;T<3;T++)M(-261.2+T*1.1,0,-4.2),M(-260.65+T*1.1,0,-3.15);M(-260.65,1.2,-4),M(-259.55,1.2,-4);let y=0;for(let[T,I,C]of[[-255.4,0,-4.2],[-254.5,0,-4.3],[-253.6,0,-4.2],[-255,0,-3.5],[-254,0,-3.5],[-255,.42,-4.1],[-254.1,.42,-4.15],[-254.5,.8,-4.1],[-253.3,0,-3.4]]){let V=te(new wn(.42,10,8),l,T,I+.26,C);V.scale.set(1.15,.62,.85),V.rotation.y=y++*.7}let A=new ke({map:Cn([214,208,192],22,2),roughness:1});for(let[T,I,C]of[[-256.9,0,-4.3],[-256.9,.8,-4.3],[-257.9,0,-4.3]]){i(.9,.78,1.1,A,T,I+.4,C);for(let V of[-.3,.3])i(.93,.81,.04,l,T,I+.4,C+V)}let w=new ke({map:Cn([118,44,40],34,2),roughness:.9});for(let T=0;T<4;T++)for(let I=0;I<6-T;I++){let C=te(new rt(.14,.15,1.7,7),w,-251.6+I*.3+T*.15,.15+T*.26,-4);C.rotation.x=Math.PI/2,C.rotation.z=((I*7+T)%5-2)*.03}for(let[T,I,C,V]of[[-249.2,3.6,.9,.2],[-250.45,4.05,.7,.35],[-249.3,3.7,.6,.9]]){let G=i(C,C,C,s,T,C/2+(V>.8?.9:0),I);G.rotation.y=V}let m=te(new pi(.32,.05,6,16),l,-252.5,1.9,-4.93);i(.05,.05,.2,r,-252.5,2.2,-4.9);let v=-258.6,F=2.9;i(2,.07,1,s,v,.9,F);for(let T of[-1,1])for(let I of[-1,1])i(.08,.88,.08,t,v+T*.9,.44,F+I*.42);i(1.9,.5,.05,t,v,.6,F+.45);let L=An(256,160,T=>{T.fillStyle="#e9dfc4",T.fillRect(0,0,256,160),T.strokeStyle="#8a7a5c",T.beginPath(),T.moveTo(128,0),T.lineTo(128,160),T.stroke(),T.strokeStyle="#3a3026",T.lineWidth=1.3;for(let I=0;I<2;I++)for(let C=0;C<12;C++)T.beginPath(),T.moveTo(14+I*128,16+C*12),T.lineTo(70+I*128+C*37%30,16+C*12),T.stroke(),T.beginPath(),T.moveTo(98+I*128,16+C*12),T.lineTo(116+I*128,16+C*12),T.stroke()});L.wrapS=L.wrapT=rn,i(.72,.05,.46,[t,t,new ke({map:L,roughness:.9}),t,t,t],v-.35,.96,F-.05),te(new rt(.09,.11,.02,12),a,v+.45,.945,F-.15),te(new rt(.012,.012,.42,6),a,v+.45,1.15,F-.15);let U=te(new rt(.008,.008,.5,6),a,v+.45,1.35,F-.15);U.rotation.z=Math.PI/2+.08;for(let T of[-1,1])te(new rt(.08,.06,.015,12),a,v+.45+T*.24,1.14-T*.02,F-.15),te(new rt(.003,.003,.2,4),a,v+.45+T*.24,1.25-T*.02,F-.15);for(let[T,I,C]of[[.75,.1,5],[.84,.16,3],[.7,.22,1],[.21,-.14,1]])te(new rt(.019,.019,.005*C,10),o,v+T,.937+.0025*C+(T<.3?.21:0),F+I);te(new rt(.07,.055,.015,12),a,v-.85,.943,F+.3),te(new rt(.011,.011,.13,6),c,v-.85,1.02,F+.3);let H=te(new wn(.016,6,6),new bt({color:16762474}),v-.85,1.1,F+.3);H.scale.y=1.9;let J=i(.24,.004,.17,c,v+.1,.938,F+.25);J.rotation.y=.3,te(new rt(.018,.018,.006,10),new ke({color:10231583,roughness:.5}),v+.1,.943,F+.25);let k=te(new os(.012,.3,5),c,v-.05,1.02,F-.2);k.rotation.z=.5,te(new rt(.03,.035,.05,8),r,v-.12,.96,F-.25),i(.4,.04,.3,s,v,.5,F+1);for(let T of[-1,1])for(let I of[-1,1])i(.04,.5,.04,t,v+T*.16,.25,F+1+I*.11);i(.9,.55,.55,n,-261.3,.275,3.9);for(let T of[-.3,0,.3])i(.05,.57,.57,r,-261.3+T,.275,3.9);i(.1,.12,.03,a,-261.3,.35,3.61);for(let T of[1.3,1.9])i(2.2,.04,.3,t,-259,T,4.83);for(let T=0;T<7;T++)i(.09+T%3*.02,.3,.22,T%2?t:n,-259.9+T*.13,1.47,4.83);for(let T=0;T<4;T++)te(new rt(.07,.07,.2,10),c,-258.6+T*.2,2.02,4.83);{let C=d-1;i(.012,.6,.012,r,-256,C+.45,.6),i(.18,.02,.18,r,-256,C+.17,.6),i(.18,.02,.18,r,-256,C-.13,.6),i(.14,.26,.14,new bt({color:16766346,transparent:!0,opacity:.55}),-256,C+.02,.6),To=new Hi(16767392,0,14,1.4),To.position.set(-256,C,.6),it.add(To)}for(let T in Wl){let I=te(new cs(.75,.86,36),new bt({color:14263361,side:Ot}),Wl[T][0],.02,Wl[T][1]+.9);I.rotation.x=-Math.PI/2,c0[T]=I,P.unlocked.includes(T)&&(I.visible=!1)}mn=it}function SM(){if(Qr("begin"),!Ys||!Zr){Kn("The town is still loading.");return}Yr(),oe("dialogue").hidden=!0,oe("goal").hidden=!1,wi("1691",["A year has passed. Lewis Galdy now has a warehouse of his own, close to the wharf.","Ships bring goods in. He sells them on. This is how a merchant gets rich."],[{t:"Begin",go:Xl},{t:"Not now",go:Ti}])}function Xl(){Ti(),ge.on&&(ea(),ge.on=!1),MM(),Si.coins=Si.talked=!1,Ki("ware"),P.x=-249,P.z=-.4,P.yaw=Math.PI/2-.12,P.pitch=0,ql()}function wM(){wi("The letter",["\u201CMr Galdy. Spanish buyers will pay well for enslaved people from Jamaica. Put your money in with mine, and we will both be rich.\u201D","It is signed by the captain of a ship in the harbour."],[{t:"Say yes",go:()=>Om("You said yes",["In later years, the real Lewis Galdy made this choice. It made him rich.","The people who were sold had no choice at all."])},{t:"Say no",go:()=>Om("You said no",["That was the right thing to do.","In later years, the real Lewis Galdy said yes. It made him rich. The people who were sold had no choice at all."])}])}function Om(i,e){P.ch.ware=!0,$r(),wi(i,e,[{t:"Go on to 7 June 1692",go:n0},{t:"Go back to 1690",go:TM}])}function TM(){Ti(),Ki("out"),P.x=17,P.z=.4,P.yaw=Math.PI/2,P.pitch=0,On="",li()}function EM(){let i=Rn.clientWidth,e=Rn.clientHeight;(Rn.width!==Math.floor(i*gs.getPixelRatio())||Rn.height!==Math.floor(e*gs.getPixelRatio()))&&(gs.setSize(i,e,!1),Xr.aspect=i/e,Xr.updateProjectionMatrix())}var Zr=!1,km=performance.now(),Bm=0,jl=!1,zl=0,po=0,Gr=null,AM=0,Gl=new Map,RM=new Xt,CM=new ti;function h0(i){let e=Math.min(.05,(i-km)/1e3);if(km=i,EM(),P.started&&!jn){let s=0,r=0;(vn.has("w")||vn.has("arrowup"))&&(s+=1),(vn.has("s")||vn.has("arrowdown"))&&(s-=1),vn.has("d")&&(r+=1),vn.has("a")&&(r-=1),vn.has("arrowleft")&&(P.yaw+=1.9*e),vn.has("arrowright")&&(P.yaw-=1.9*e),s-=cn.y,r+=cn.x;let a=Math.hypot(s,r);a>1&&(s/=a,r/=a);let o=nh*e,l=Math.sin(P.yaw),c=Math.cos(P.yaw),[h,u]=sM(P.x+(-l*s+c*r)*o,P.z+(-c*s-l*r)*o);a>.05&&!lo&&(Bm+=e*8.5*Math.min(1,a)),P.x=h,P.z=u}else P.started||(P.yaw=Math.PI/2-.12+Math.sin(i/5200)*.14);ge.on&&gM(e,i/1e3);let t=ge.shake*(lo?.15:1),n=i/1e3;Xr.position.set(P.x+Math.sin(n*31)*.06*t,Yl+(lo?0:Math.sin(Bm)*.035)+Math.sin(n*37)*.05*t,P.z+Math.sin(n*27)*.05*t),Xr.rotation.set(P.pitch+Math.sin(n*29)*.015*t,P.yaw,Math.sin(n*23)*.03*t);for(let[s,r]of Gl)s.quaternion.copy(r);if(js&&P.place!=="in"&&P.place!=="ware"){let s=i/1e3;js.offset.x=s*.02,js.offset.y=s*.013;let r=qr.geometry.attributes.position,a=qr.userData.base;for(let c=0;c<r.count;c++){let h=a[c*3],u=a[c*3+2];r.setY(c,Math.sin(h*.42+s*1.3)*.07+Math.sin(u*.31+s*.9)*.06+Math.sin((h+u)*.9+s*2.1)*.025)}r.needsUpdate=!0,(AM++&3)===0&&qr.geometry.computeVertexNormals(),qr.position.y=Js;let o=ge.ruin?null:gn.merchant,l=ge.ruin?null:gn.sloop;o&&(o.position.y=-.35+Math.sin(s*.8)*.05,o.rotation.x=Math.sin(s*.6)*.012,o.rotation.z=Math.sin(s*.45)*.004),l&&(l.position.y=-.35+Math.sin(s*1+1)*.07,l.rotation.x=Math.sin(s*.75+2)*.025);for(let c of u0){for(let h=0;h<c.p.count;h++){let u=c.uv.getX(h);c.p.setZ(h,c.base[h*3+2]+(Math.sin(u*5.5-s*5.2)*.2+Math.sin(u*11-s*8.3)*.05)*u),c.p.setY(h,c.base[h*3+1]+Math.sin(u*4-s*3.1)*.05*u)}c.p.needsUpdate=!0}}pM(i/1e3),P.started&&i-Im>5e3&&(Im=i,$r()),Jl&&Jl.update(e);for(let s of Km)s.update(e);if(jl)for(let s of Ro){let r=ci[s.id];if(!r||!r.visible)continue;let a=P.x-s.x,o=P.z-s.z,l=s.ry;if(Math.hypot(a,o)<6){let c=Math.atan2(a,o)-s.ry;c=Math.atan2(Math.sin(c),Math.cos(c)),l=s.ry+Math.max(-1.3,Math.min(1.3,c))}r.rotation.y+=(l-r.rotation.y)*Math.min(1,e*2.5)}if(jl&&Rt){let s=i/1e3,r=Rt.getObjectByName("mixamorigSpine"),a=Rt.getObjectByName("mixamorigSpine2"),o=Rt.getObjectByName("mixamorigHead"),l=Rt.getObjectByName("mixamorigNeck");for(let g of[r,a,l,o])g&&(Gl.has(g)||Gl.set(g,new Xt),Gl.get(g).copy(g.quaternion));let c=(g,_,b,p)=>{g&&g.quaternion.multiply(RM.setFromEuler(CM.set(_,b,p)))};c(r,0,Math.sin(s*.35)*.05,Math.sin(s*.5)*.03),c(a,Math.sin(s*1.5)*.01,0,0);let h=P.x-at.x,u=P.z-at.z,f=Math.hypot(h,u)<4.5||!oe("dialogue").hidden;if(po+=((f?1:0)-po)*Math.min(1,e*3),!Gr&&l&&o){let g=null;if(Rt.traverse(_=>{!g&&_.isSkinnedMesh&&(g=_.skeleton)}),g){Gr={};let _=b=>new et().copy(g.boneInverses[g.bones.indexOf(b)]).invert();for(let b of[l,o]){let p=new et().copy(_(b.parent)).invert().multiply(_(b));Gr[b.name]=new Xt().setFromRotationMatrix(p)}}}Gr&&(l.quaternion.slerp(Gr[l.name],po*.5),o.quaternion.slerp(Gr[o.name],po*.5));let d=Math.atan2(h,u)-Rt.rotation.y;d=Math.max(-.7,Math.min(.7,Math.atan2(Math.sin(d),Math.cos(d))))*po,zl+=(d-zl)*Math.min(1,e*4),c(l,0,zl*.4,0),c(o,Math.sin(s*.9)*.02,zl*.6,0)}if(jl){let s=P.x-at.x,r=P.z-at.z,o=Math.hypot(s,r)<9?Math.max(-1.1,Math.min(1.1,Math.atan2(s,r))):P.place==="in"?0:.25;if(Rt.rotation.y+=(o-Rt.rotation.y)*Math.min(1,e*3),ln&&ln.visible){let l=1+(lo?0:Math.sin(i/420)*.08);ln.scale.set(l,l,l)}if(P.started){fs=null;let l=1e9;if(!jn)for(let c of rM){let h=c.where();if(!h)continue;let u=Math.hypot(P.x-h[0],P.z-h[1]);u<c.r&&u<l&&(l=u,fs=c)}oe("talk").hidden=!fs,fs&&oe("talk").textContent!==fs.label&&(oe("talk").textContent=fs.label),!P.unlocked.includes("harbour")&&P.x<Ve-2&&(ji("harbour"),li())}if(P.place==="in"&&yd&&!lo){let l=.85+Math.sin(i/90)*.08+Math.sin(i/37)*.07;yd.scale.set(1,l,1),yo.intensity=16*l;for(let c=0;c<vo.length;c++){let h=1.75+Math.sin(i/70+c*2.1)*.25;vo[c].scale.y=vo[c].geometry.type==="SphereGeometry"?h:.9+(h-1.75)}}}gs.render(it,Xr),requestAnimationFrame(h0)}var u0=[];async function PM(){await wm(["tex_harbour","merchant","sloop"],e=>{oe("bar").style.width=Math.round(e*100)+"%"}),await Em();for(let e of["merchant","sloop"])gn[e]=ho(window.__got[e].scene),gn[e].traverse(t=>{if(t.isMesh&&t.material.name==="Flag"){let n=t.geometry.attributes.position;u0.push({p:n,base:n.array.slice(),uv:t.geometry.attributes.uv})}});Zv(),oe("start").disabled=!1,oe("start").textContent=wd?"Continue":"Step ashore",oe("savenote").hidden=!wd,oe("loadnote").hidden=!0,document.querySelector(".track").hidden=!0,await wm(["tex_town","h1","h2","h3","h4","h5","h6","abba","kofi","sailor","benning"]),await Em();for(let e in window.__tex)window.__tex[e]="";for(let e of Object.keys(mo))jm[e]=ho(window.__got[e].scene);let i=window.__got.abba;Rt=ho(i.scene),i.animations.length&&(Jl=new Pr(Rt),Am=Jl.clipAction(i.animations[0]),Am.play(),jr=i.animations[0].clone(),jr.tracks=jr.tracks.filter(e=>e.name.endsWith(".quaternion")));for(let e of Ro){let t=ho(window.__got[e.id].scene);t.position.set(e.x,0,e.z),t.rotation.y=e.ry,it.add(t),ci[e.id]=t,Id(t)}iM(),ln&&(ln.visible=!P.talked),window.__got=null,Ys=!0,jl=!0,setTimeout(()=>{$v();for(let t of ms)P.unlocked.includes(t.id)&&(Cd[t.id].visible=!1);P.ate&&(qi.visible=!0),Zr=!0,oe("tchap").hidden=!1,Xm("heath").then(t=>{ci.heath=ho(t.scene),a0()}).catch(()=>{}),oe("chapters").hidden||Fd();let e=new URLSearchParams(location.search);e.has("shot")&&(oe("start").click(),e.get("shot")==="talk"&&(P.x=-3.6,P.z=-1.4,P.yaw=.62,P.pitch=-.02,setTimeout(()=>oe("talk").click(),300)),e.get("shot")==="quake1"&&(So(),Kr("main"),ge.t=6.5,P.x=6,P.yaw=Math.PI/2+.3),e.get("shot")==="quake2"&&(So(),Ed(),P.yaw+=0),e.get("shot")==="quake3"&&(So(),Ed(),P.x=Ve+14,P.z=20,P.yaw=Math.PI/2+.35,P.pitch=.1),e.get("shot")==="after"&&(wo(),P.x=-2,P.z=-1,P.yaw=Math.PI/2-.1),e.get("shot")==="after2"&&(wo(),P.x=-12,P.z=-1,P.yaw=-Math.PI/2-.15),e.get("shot")==="yard"&&$l(),e.get("shot")==="ware"&&Xl(),e.get("shot")==="door"&&(Xl(),P.x=-253,P.z=.6,P.yaw=-Math.PI/2,P.pitch=0),e.get("shot")==="ware2"&&(Xl(),P.x=-256.6,P.z=.2,P.yaw=.62+Math.PI*0,P.yaw=Math.atan2(-(-258.6-P.x),-(2.9-P.z)),P.pitch=-.25),e.get("shot")==="chapters"&&Ud(),e.get("shot")==="npc1"&&(P.x=23.6,P.z=.6,P.yaw=Math.atan2(-(21.7-23.6),-(2.35-.6))),e.get("shot")==="npc2"&&(P.x=37.2,P.z=.2,P.yaw=Math.PI/2-.25),e.get("shot")==="npc3"&&(P.x=8.6,P.z=.9,P.yaw=Math.PI,P.pitch=.05),e.get("shot")==="npc4"&&(wo(),P.x=-7.4,P.z=3.2,P.yaw=Math.atan2(-(-9.65+7.4),-(1.75-3.2))),e.get("shot")==="street"&&(P.x=17,P.z=.4),e.get("shot")==="ships"&&(P.x=Ve+1,P.z=.9,P.yaw=-Math.PI/2+.25,P.pitch=.22),e.get("shot")==="beach"&&(P.x=Ve-6,P.z=1,P.yaw=-Math.PI/2-.9,P.pitch=-.05),e.get("shot")==="beach2"&&(P.x=Ve-7,P.z=-2,P.yaw=-Math.PI/2+.8,P.pitch=.05),(e.get("shot")==="in"||e.get("shot")==="stew")&&(P.talked=!0,P.unlocked.push("harbour"),Ki("in"),P.x=-199.6,P.z=2.6,P.yaw=.25,P.pitch=-.12,li(),e.get("shot")==="stew"&&(P.x=-200.6,P.z=-.6,P.yaw=.1,setTimeout(()=>{oe("talk").click(),P.step=1,Ld()},400))))},300)}function zm(i){i&&i.started||oM(aM()),PM().catch(()=>{}),i&&i.started&&(Object.assign(P,i),(P.place!=="out"||P.x>Ve+24||P.x<Un-1||Math.abs(P.z)>9.5)&&(P.place="out",P.x=17,P.z=.4,P.yaw=Math.PI/2,P.pitch=0),oe("start").addEventListener("click",()=>{P.unlocked.length&&(oe("jcount").textContent=P.unlocked.length,oe("jcount").hidden=!1)},{once:!0})),requestAnimationFrame(h0)}window.claude?.hot?.snapshot?.(()=>P.place==="out"&&!ge.on?{...P,step:0}:{...P,step:0,place:"out",x:17,z:.4,yaw:Math.PI/2,pitch:0});window.claude?.hot?.ready?window.claude.hot.ready(zm):zm(window.claude?.hot?.data??{});})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
