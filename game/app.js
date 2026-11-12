(()=>{var dm=0,Yu=1,fm=2;var zo=1,pm=2,ya=3,Bi=0,_n=1,Bt=2,br=0,_a=1,va=2,Zu=3,$u=4,mm=5;var xr=100,gm=101,bm=102,xm=103,ym=104,_m=200,vm=201,Mm=202,Sm=203,Qu=204,ed=205,wm=206,Tm=207,Em=208,Am=209,Rm=210,Cm=211,Pm=212,Im=213,Lm=214,nc=0,ic=1,sc=2,na=3,rc=4,ac=5,oc=6,lc=7,td=0,Dm=1,Nm=2,zi=0,nd=1,id=2,sd=3,Ho=4,rd=5,ad=6,od=7,Uu="attached",Fm="detached",ld=300,yr=301,Ma=302,Fc=303,kc=304,ai=1e3,Cn=1001,ia=1002,$t=1003,Uc=1004;var _r=1005;var an=1006,Sa=1007;var ci=1008;var qn=1009,cd=1010,hd=1011,wa=1012,Oc=1013,Ti=1014,ti=1015,Ei=1016,Bc=1017,zc=1018,vr=1020,ud=35902,dd=35899,fd=1021,pd=1022,hi=1023,is=1026,ps=1027,Hc=1028,Gc=1029,Ds=1030,Vc=1031;var Wc=1033,Go=33776,Vo=33777,Wo=33778,qo=33779,qc=35840,Xc=35841,jc=35842,Kc=35843,Jc=36196,Yc=37492,Zc=37496,$c=37488,Qc=37489,Xo=37490,eh=37491,th=37808,nh=37809,ih=37810,sh=37811,rh=37812,ah=37813,oh=37814,lh=37815,ch=37816,hh=37817,uh=37818,dh=37819,fh=37820,ph=37821,mh=36492,gh=36494,bh=36495,xh=36283,yh=36284,jo=36285,_h=36286,Ko=2200,vh=2201,km=2202,ir=2300,sr=2301,ec=2302,Ou=2303,er=2400,tr=2401,ao=2402,Mh=2500,Um=2501,md=0,Jo=1,Ta=2,Om=3200;var Sh=0,Bm=1,ui="",Gt="srgb",Un="srgb-linear",oo="linear",Ct="srgb";var tc=7680;var zm=519,Hm=512,Gm=513,Vm=514,gd=515,Wm=516,qm=517,bd=518,xd=519,yd=35044,_d=35048;var vd="300 es",ri=2e3,sa=2001;function zg(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Hg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ra(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xm(){let i=ra("canvas");return i.style.display="block",i}var xp={},aa=null;function lo(...i){let e="THREE."+i.shift();aa?aa("log",e,...i):console.log(e,...i)}function jm(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function We(...i){i=jm(i);let e="THREE."+i.shift();if(aa)aa("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function it(...i){i=jm(i);let e="THREE."+i.shift();if(aa)aa("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function nr(...i){let e=i.join(" ");e in xp||(xp[e]=!0,We(...i))}function Km(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Jm={[nc]:nc,[sc]:oc,[rc]:rc,[na]:ac,[ic]:ic,[oc]:sc,[lc]:lc,[ac]:na},wi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},An=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yp=1234567,no=Math.PI/180,rr=180/Math.PI;function Ai(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(An[i&255]+An[i>>8&255]+An[i>>16&255]+An[i>>24&255]+"-"+An[e&255]+An[e>>8&255]+"-"+An[e>>16&15|64]+An[e>>24&255]+"-"+An[t&63|128]+An[t>>8&255]+"-"+An[t>>16&255]+An[t>>24&255]+An[n&255]+An[n>>8&255]+An[n>>16&255]+An[n>>24&255]).toLowerCase()}function gt(i,e,t){return Math.max(e,Math.min(t,i))}function Md(i,e){return(i%e+e)%e}function Gg(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Vg(i,e,t){return i!==e?(t-i)/(e-i):0}function io(i,e,t){return(1-t)*i+t*e}function Wg(i,e,t,n){return io(i,e,1-Math.exp(-t*n))}function qg(i,e=1){return e-Math.abs(Md(i,e*2)-e)}function Xg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function jg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Kg(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Jg(i,e){return i+Math.random()*(e-i)}function Yg(i){return i*(.5-Math.random())}function Zg(i){i!==void 0&&(yp=i);let e=yp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function $g(i){return i*no}function Qg(i){return i*rr}function eb(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function tb(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Sd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function nb(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*p,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*p,o*l);break;case"ZYZ":i.set(c*p,c*f,o*h,o*l);break;default:We("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function wh(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function wd(i,e){if(e.constructor===Float32Array)return i;let t=wh(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/t,-1)}function Td(i,e){if(e.constructor===Float32Array)return i;let t=wh(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*t)}var Th={DEG2RAD:no,RAD2DEG:rr,generateUUID:Ai,clamp:gt,euclideanModulo:Md,mapLinear:Gg,inverseLerp:Vg,lerp:io,damp:Wg,pingpong:qg,smoothstep:Xg,smootherstep:jg,randInt:Kg,randFloat:Jg,randFloatSpread:Yg,seededRandom:Zg,degToRad:$g,radToDeg:Qg,isPowerOfTwo:eb,ceilPowerOfTwo:tb,floorPowerOfTwo:Sd,setQuaternionFromProperEuler:nb,normalize:Td,denormalize:wd},Id=class Id{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=gt(this.x,e.x,t.x),this.y=gt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=gt(this.x,e,t),this.y=gt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(gt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(gt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Id.prototype.isVector2=!0;var he=Id,Zt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],p=r[a+2],y=r[a+3];if(u!==y||c!==d||l!==f||h!==p){let g=c*d+l*f+h*p+u*y;g<0&&(d=-d,f=-f,p=-p,y=-y,g=-g);let m=1-o;if(g<.9995){let x=Math.acos(g),M=Math.sin(x);m=Math.sin(m*x)/M,o=Math.sin(o*x)/M,c=c*m+d*o,l=l*m+f*o,h=h*m+p*o,u=u*m+y*o}else{c=c*m+d*o,l=l*m+f*o,h=h*m+p*o,u=u*m+y*o;let x=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=x,l*=x,h*=x,u*=x}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+h*u+c*f-l*d,e[t+1]=c*p+h*d+l*u-o*f,e[t+2]=l*p+h*f+o*d-c*u,e[t+3]=h*p-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),d=c(n/2),f=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:We("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(gt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){let l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Ld=class Ld{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(_p.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(_p.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=gt(this.x,e.x,t.x),this.y=gt(this.y,e.y,t.y),this.z=gt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=gt(this.x,e,t),this.y=gt(this.y,e,t),this.z=gt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(gt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return cu.copy(this).projectOnVector(e),this.sub(cu)}reflect(e){return this.sub(cu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(gt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ld.prototype.isVector3=!0;var z=Ld,cu=new z,_p=new Zt,Dd=class Dd{constructor(e,t,n,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],y=s[0],g=s[3],m=s[6],x=s[1],M=s[4],_=s[7],E=s[2],A=s[5],b=s[8];return r[0]=a*y+o*x+c*E,r[3]=a*g+o*M+c*A,r[6]=a*m+o*_+c*b,r[1]=l*y+h*x+u*E,r[4]=l*g+h*M+u*A,r[7]=l*m+h*_+u*b,r[2]=d*y+f*x+p*E,r[5]=d*g+f*M+p*A,r[8]=d*m+f*_+p*b,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,p=t*u+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/p;return e[0]=u*y,e[1]=(s*l-h*n)*y,e[2]=(o*n-s*a)*y,e[3]=d*y,e[4]=(h*t-s*c)*y,e[5]=(s*r-o*t)*y,e[6]=f*y,e[7]=(n*c-l*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return nr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(hu.makeScale(e,t)),this}rotate(e){return nr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(hu.makeRotation(-e)),this}translate(e,t){return nr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(hu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Dd.prototype.isMatrix3=!0;var ot=Dd,hu=new ot,vp=new ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mp=new ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ib(){let i={enabled:!0,workingColorSpace:Un,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ct&&(s.r=ns(s.r),s.g=ns(s.g),s.b=ns(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ct&&(s.r=ta(s.r),s.g=ta(s.g),s.b=ta(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ui?oo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Un]:{primaries:e,whitePoint:n,transfer:oo,toXYZ:vp,fromXYZ:Mp,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:e,whitePoint:n,transfer:Ct,toXYZ:vp,fromXYZ:Mp,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}}),i}var yt=ib();function ns(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ta(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ur,cc=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ur===void 0&&(Ur=ra("canvas")),Ur.width=e.width,Ur.height=e.height;let s=Ur.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ur}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ra("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ns(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ns(t[n]/255)*255):t[n]=ns(t[n]);return{data:t,width:e.width,height:e.height}}else return We("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},sb=0,oa=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:sb++}),this.uuid=Ai(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(uu(s[a].image)):r.push(uu(s[a]))}else r=uu(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function uu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?cc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(We("Texture: Unable to serialize Texture."),{})}var rb=0,du=new z,Qt=class i extends wi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Cn,s=Cn,r=an,a=ci,o=hi,c=qn,l=i.DEFAULT_ANISOTROPY,h=ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rb++}),this.uuid=Ai(),this.name="",this.source=new oa(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ot,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(du).x}get height(){return this.source.getSize(du).y}get depth(){return this.source.getSize(du).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){We(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){We(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ld)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ai:e.x=e.x-Math.floor(e.x);break;case Cn:e.x=e.x<0?0:1;break;case ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ai:e.y=e.y-Math.floor(e.y);break;case Cn:e.y=e.y<0?0:1;break;case ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=ld;Qt.DEFAULT_ANISOTROPY=1;var Nd=class Nd{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],y=c[2],g=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(p+g)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(l+1)/2,_=(f+1)/2,E=(m+1)/2,A=(h+d)/4,b=(u+y)/4,S=(p+g)/4;return M>_&&M>E?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=A/n,r=b/n):_>E?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=A/s,r=S/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=b/r,s=S/r),this.set(n,s,r,t),this}let x=Math.sqrt((g-p)*(g-p)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-p)/x,this.y=(u-y)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=gt(this.x,e.x,t.x),this.y=gt(this.y,e.y,t.y),this.z=gt(this.z,e.z,t.z),this.w=gt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=gt(this.x,e,t),this.y=gt(this.y,e,t),this.z=gt(this.z,e,t),this.w=gt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(gt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Nd.prototype.isVector4=!0;var It=Nd,hc=class extends wi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new Qt({width:e,height:t,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new oa(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},$n=class extends hc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},co=class extends Qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=$t,this.minFilter=$t,this.wrapR=Cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var uc=class extends Qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=$t,this.minFilter=$t,this.wrapR=Cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Nc=class Nc{constructor(e,t,n,s,r,a,o,c,l,h,u,d,f,p,y,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,u,d,f,p,y,g)}set(e,t,n,s,r,a,o,c,l,h,u,d,f,p,y,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=p,m[11]=y,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Nc().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Or.setFromMatrixColumn(e,0).length(),r=1/Or.setFromMatrixColumn(e,1).length(),a=1/Or.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,p=o*h,y=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+p*l,t[5]=d-y*l,t[9]=-o*c,t[2]=y-d*l,t[6]=p+f*l,t[10]=a*c}else if(e.order==="YXZ"){let d=c*h,f=c*u,p=l*h,y=l*u;t[0]=d+y*o,t[4]=p*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=y+d*o,t[10]=a*c}else if(e.order==="ZXY"){let d=c*h,f=c*u,p=l*h,y=l*u;t[0]=d-y*o,t[4]=-a*u,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=y-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let d=a*h,f=a*u,p=o*h,y=o*u;t[0]=c*h,t[4]=p*l-f,t[8]=d*l+y,t[1]=c*u,t[5]=y*l+d,t[9]=f*l-p,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let d=a*c,f=a*l,p=o*c,y=o*l;t[0]=c*h,t[4]=y-d*u,t[8]=p*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+p,t[10]=d-y*u}else if(e.order==="XZY"){let d=a*c,f=a*l,p=o*c,y=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+y,t[5]=a*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=o*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ab,e,ob)}lookAt(e,t,n){let s=this.elements;return Yn.subVectors(e,t),Yn.lengthSq()===0&&(Yn.z=1),Yn.normalize(),vs.crossVectors(n,Yn),vs.lengthSq()===0&&(Math.abs(n.z)===1?Yn.x+=1e-4:Yn.z+=1e-4,Yn.normalize(),vs.crossVectors(n,Yn)),vs.normalize(),wl.crossVectors(Yn,vs),s[0]=vs.x,s[4]=wl.x,s[8]=Yn.x,s[1]=vs.y,s[5]=wl.y,s[9]=Yn.y,s[2]=vs.z,s[6]=wl.z,s[10]=Yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],y=n[6],g=n[10],m=n[14],x=n[3],M=n[7],_=n[11],E=n[15],A=s[0],b=s[4],S=s[8],L=s[12],P=s[1],k=s[5],V=s[9],X=s[13],R=s[2],I=s[6],U=s[10],O=s[14],W=s[3],D=s[7],G=s[11],q=s[15];return r[0]=a*A+o*P+c*R+l*W,r[4]=a*b+o*k+c*I+l*D,r[8]=a*S+o*V+c*U+l*G,r[12]=a*L+o*X+c*O+l*q,r[1]=h*A+u*P+d*R+f*W,r[5]=h*b+u*k+d*I+f*D,r[9]=h*S+u*V+d*U+f*G,r[13]=h*L+u*X+d*O+f*q,r[2]=p*A+y*P+g*R+m*W,r[6]=p*b+y*k+g*I+m*D,r[10]=p*S+y*V+g*U+m*G,r[14]=p*L+y*X+g*O+m*q,r[3]=x*A+M*P+_*R+E*W,r[7]=x*b+M*k+_*I+E*D,r[11]=x*S+M*V+_*U+E*G,r[15]=x*L+M*X+_*O+E*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],y=e[7],g=e[11],m=e[15],x=c*f-l*d,M=o*f-l*u,_=o*d-c*u,E=a*f-l*h,A=a*d-c*h,b=a*u-o*h;return t*(y*x-g*M+m*_)-n*(p*x-g*E+m*A)+s*(p*M-y*E+m*b)-r*(p*_-y*A+g*b)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+s*(r*l-a*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],y=e[13],g=e[14],m=e[15],x=t*o-n*a,M=t*c-s*a,_=t*l-r*a,E=n*c-s*o,A=n*l-r*o,b=s*l-r*c,S=h*y-u*p,L=h*g-d*p,P=h*m-f*p,k=u*g-d*y,V=u*m-f*y,X=d*m-f*g,R=x*X-M*V+_*k+E*P-A*L+b*S;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/R;return e[0]=(o*X-c*V+l*k)*I,e[1]=(s*V-n*X-r*k)*I,e[2]=(y*b-g*A+m*E)*I,e[3]=(d*A-u*b-f*E)*I,e[4]=(c*P-a*X-l*L)*I,e[5]=(t*X-s*P+r*L)*I,e[6]=(g*_-p*b-m*M)*I,e[7]=(h*b-d*_+f*M)*I,e[8]=(a*V-o*P+l*S)*I,e[9]=(n*P-t*V-r*S)*I,e[10]=(p*A-y*_+m*x)*I,e[11]=(u*_-h*A-f*x)*I,e[12]=(o*L-a*k-c*S)*I,e[13]=(t*k-n*L+s*S)*I,e[14]=(y*M-p*E-g*x)*I,e[15]=(h*E-u*M+d*x)*I,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,p=r*u,y=a*h,g=a*u,m=o*u,x=c*l,M=c*h,_=c*u,E=n.x,A=n.y,b=n.z;return s[0]=(1-(y+m))*E,s[1]=(f+_)*E,s[2]=(p-M)*E,s[3]=0,s[4]=(f-_)*A,s[5]=(1-(d+m))*A,s[6]=(g+x)*A,s[7]=0,s[8]=(p+M)*b,s[9]=(g-x)*b,s[10]=(1-(d+y))*b,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Or.set(s[0],s[1],s[2]).length(),o=Or.set(s[4],s[5],s[6]).length(),c=Or.set(s[8],s[9],s[10]).length();r<0&&(a=-a),_i.copy(this);let l=1/a,h=1/o,u=1/c;return _i.elements[0]*=l,_i.elements[1]*=l,_i.elements[2]*=l,_i.elements[4]*=h,_i.elements[5]*=h,_i.elements[6]*=h,_i.elements[8]*=u,_i.elements[9]*=u,_i.elements[10]*=u,t.setFromRotationMatrix(_i),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,s,r,a,o=ri,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,y;if(c)p=r/(a-r),y=a*r/(a-r);else if(o===ri)p=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===sa)p=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=ri,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),p,y;if(c)p=1/(a-r),y=a/(a-r);else if(o===ri)p=-2/(a-r),y=-(a+r)/(a-r);else if(o===sa)p=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Nc.prototype.isMatrix4=!0;var st=Nc,Or=new z,_i=new st,ab=new z(0,0,0),ob=new z(1,1,1),vs=new z,wl=new z,Yn=new z,Sp=new st,wp=new Zt,oi=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(gt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-gt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(gt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:We("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Sp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Sp,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wp.setFromEuler(this),this.setFromQuaternion(wp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};oi.DEFAULT_ORDER="XYZ";var ho=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},lb=0,Tp=new z,Br=new Zt,Ji=new st,Tl=new z,Va=new z,cb=new z,hb=new Zt,Ep=new z(1,0,0),Ap=new z(0,1,0),Rp=new z(0,0,1),Cp={type:"added"},ub={type:"removed"},zr={type:"childadded",child:null},fu={type:"childremoved",child:null},Ot=class i extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lb++}),this.uuid=Ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new z,t=new oi,n=new Zt,s=new z(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new st},normalMatrix:{value:new ot}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ho,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Br.setFromAxisAngle(e,t),this.quaternion.multiply(Br),this}rotateOnWorldAxis(e,t){return Br.setFromAxisAngle(e,t),this.quaternion.premultiply(Br),this}rotateX(e){return this.rotateOnAxis(Ep,e)}rotateY(e){return this.rotateOnAxis(Ap,e)}rotateZ(e){return this.rotateOnAxis(Rp,e)}translateOnAxis(e,t){return Tp.copy(e).applyQuaternion(this.quaternion),this.position.add(Tp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ep,e)}translateY(e){return this.translateOnAxis(Ap,e)}translateZ(e){return this.translateOnAxis(Rp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ji.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Tl.copy(e):Tl.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Va.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ji.lookAt(Va,Tl,this.up):Ji.lookAt(Tl,Va,this.up),this.quaternion.setFromRotationMatrix(Ji),s&&(Ji.extractRotation(s.matrixWorld),Br.setFromRotationMatrix(Ji),this.quaternion.premultiply(Br.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(it("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cp),zr.child=e,this.dispatchEvent(zr),zr.child=null):it("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ub),fu.child=e,this.dispatchEvent(fu),fu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ji.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ji.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ji),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cp),zr.child=e,this.dispatchEvent(zr),zr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Va,e,cb),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Va,hb,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ot.DEFAULT_UP=new z(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var vt=class extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}},db={type:"move"},la=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let y of e.hand.values()){let g=t.getJointPose(y,n),m=this._getHandJoint(l,y);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.quaternion,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(db)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new vt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ym={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ms={h:0,s:0,l:0},El={h:0,s:0,l:0};function pu(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,yt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=yt.workingColorSpace){return this.r=e,this.g=t,this.b=n,yt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=yt.workingColorSpace){if(e=Md(e,1),t=gt(t,0,1),n=gt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=pu(a,r,e+1/3),this.g=pu(a,r,e),this.b=pu(a,r,e-1/3)}return yt.colorSpaceToWorking(this,s),this}setStyle(e,t=Gt){function n(r){r!==void 0&&parseFloat(r)<1&&We("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:We("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);We("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){let n=Ym[e.toLowerCase()];return n!==void 0?this.setHex(n,t):We("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ns(e.r),this.g=ns(e.g),this.b=ns(e.b),this}copyLinearToSRGB(e){return this.r=ta(e.r),this.g=ta(e.g),this.b=ta(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return yt.workingToColorSpace(Rn.copy(this),e),Math.round(gt(Rn.r*255,0,255))*65536+Math.round(gt(Rn.g*255,0,255))*256+Math.round(gt(Rn.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=yt.workingColorSpace){yt.workingToColorSpace(Rn.copy(this),t);let n=Rn.r,s=Rn.g,r=Rn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=yt.workingColorSpace){return yt.workingToColorSpace(Rn.copy(this),t),e.r=Rn.r,e.g=Rn.g,e.b=Rn.b,e}getStyle(e=Gt){yt.workingToColorSpace(Rn.copy(this),e);let t=Rn.r,n=Rn.g,s=Rn.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ms),this.setHSL(Ms.h+e,Ms.s+t,Ms.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ms),e.getHSL(El);let n=io(Ms.h,El.h,t),s=io(Ms.s,El.s,t),r=io(Ms.l,El.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Rn=new qe;qe.NAMES=Ym;var uo=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new qe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},fo=class extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},vi=new z,Yi=new z,mu=new z,Zi=new z,Hr=new z,Gr=new z,Pp=new z,gu=new z,bu=new z,xu=new z,yu=new It,_u=new It,vu=new It,ts=class i{constructor(e=new z,t=new z,n=new z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),vi.subVectors(e,t),s.cross(vi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){vi.subVectors(s,t),Yi.subVectors(n,t),mu.subVectors(e,t);let a=vi.dot(vi),o=vi.dot(Yi),c=vi.dot(mu),l=Yi.dot(Yi),h=Yi.dot(mu),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-o*h)*d,p=(a*h-o*c)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Zi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Zi.x),c.addScaledVector(a,Zi.y),c.addScaledVector(o,Zi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return yu.setScalar(0),_u.setScalar(0),vu.setScalar(0),yu.fromBufferAttribute(e,t),_u.fromBufferAttribute(e,n),vu.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(yu,r.x),a.addScaledVector(_u,r.y),a.addScaledVector(vu,r.z),a}static isFrontFacing(e,t,n,s){return vi.subVectors(n,t),Yi.subVectors(e,t),vi.cross(Yi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vi.subVectors(this.c,this.b),Yi.subVectors(this.a,this.b),vi.cross(Yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Hr.subVectors(s,n),Gr.subVectors(r,n),gu.subVectors(e,n);let c=Hr.dot(gu),l=Gr.dot(gu);if(c<=0&&l<=0)return t.copy(n);bu.subVectors(e,s);let h=Hr.dot(bu),u=Gr.dot(bu);if(h>=0&&u<=h)return t.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0&&c-h>0)return a=c/(c-h),t.copy(n).addScaledVector(Hr,a);xu.subVectors(e,r);let f=Hr.dot(xu),p=Gr.dot(xu);if(p>=0&&f<=p)return t.copy(r);let y=f*l-c*p;if(y<=0&&l>=0&&p<=0)return o=l/(l-p),t.copy(n).addScaledVector(Gr,o);let g=h*p-f*u;if(g<=0&&u-h>=0&&f-p>=0)return Pp.subVectors(r,s),o=(u-h)/(u-h+(f-p)),t.copy(s).addScaledVector(Pp,o);let m=1/(g+y+d);return a=y*m,o=d*m,t.copy(n).addScaledVector(Hr,a).addScaledVector(Gr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},On=class{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Mi):Mi.fromBufferAttribute(r,a),Mi.applyMatrix4(e.matrixWorld),this.expandByPoint(Mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Al.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Al.copy(n.boundingBox)),Al.applyMatrix4(e.matrixWorld),this.union(Al)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mi),Mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wa),Rl.subVectors(this.max,Wa),Vr.subVectors(e.a,Wa),Wr.subVectors(e.b,Wa),qr.subVectors(e.c,Wa),Ss.subVectors(Wr,Vr),ws.subVectors(qr,Wr),Ys.subVectors(Vr,qr);let t=[0,-Ss.z,Ss.y,0,-ws.z,ws.y,0,-Ys.z,Ys.y,Ss.z,0,-Ss.x,ws.z,0,-ws.x,Ys.z,0,-Ys.x,-Ss.y,Ss.x,0,-ws.y,ws.x,0,-Ys.y,Ys.x,0];return!Mu(t,Vr,Wr,qr,Rl)||(t=[1,0,0,0,1,0,0,0,1],!Mu(t,Vr,Wr,qr,Rl))?!1:(Cl.crossVectors(Ss,ws),t=[Cl.x,Cl.y,Cl.z],Mu(t,Vr,Wr,qr,Rl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},$i=[new z,new z,new z,new z,new z,new z,new z,new z],Mi=new z,Al=new On,Vr=new z,Wr=new z,qr=new z,Ss=new z,ws=new z,Ys=new z,Wa=new z,Rl=new z,Cl=new z,Zs=new z;function Mu(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Zs.fromArray(i,r);let o=s.x*Math.abs(Zs.x)+s.y*Math.abs(Zs.y)+s.z*Math.abs(Zs.z),c=e.dot(Zs),l=t.dot(Zs),h=n.dot(Zs);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var tn=new z,Pl=new he,fb=0,yn=class extends wi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:fb++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yd,this.updateRanges=[],this.gpuType=ti,this.version=0,this._normalizationScale=e!==void 0?wh(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pl.fromBufferAttribute(this,t),Pl.applyMatrix3(e),this.setXY(t,Pl.x,Pl.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix3(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):wd(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Td(e,this.array)}};var po=class extends yn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var mo=class extends yn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var dt=class extends yn{constructor(e,t,n){super(new Float32Array(e),t,n)}},pb=new On,qa=new z,Su=new z,Vn=class{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):pb.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;qa.subVectors(e,this.center);let t=qa.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(qa,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Su.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(qa.copy(e.center).add(Su)),this.expandByPoint(qa.copy(e.center).sub(Su))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},mb=0,si=new st,wu=new Ot,Xr=new z,Zn=new On,Xa=new On,un=new z,Ft=class i extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mb++}),this.uuid=Ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(zg(e)?mo:po)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ot().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return si.makeRotationFromQuaternion(e),this.applyMatrix4(si),this}rotateX(e){return si.makeRotationX(e),this.applyMatrix4(si),this}rotateY(e){return si.makeRotationY(e),this.applyMatrix4(si),this}rotateZ(e){return si.makeRotationZ(e),this.applyMatrix4(si),this}translate(e,t,n){return si.makeTranslation(e,t,n),this.applyMatrix4(si),this}scale(e,t,n){return si.makeScale(e,t,n),this.applyMatrix4(si),this}lookAt(e){return wu.lookAt(e),wu.updateMatrix(),this.applyMatrix4(wu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xr).negate(),this.translate(Xr.x,Xr.y,Xr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new dt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&We("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new On);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Zn.setFromBufferAttribute(r),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,Zn.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,Zn.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint(Zn.min),this.boundingBox.expandByPoint(Zn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&it('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){let n=this.boundingSphere.center;if(Zn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Xa.setFromBufferAttribute(o),this.morphTargetsRelative?(un.addVectors(Zn.min,Xa.min),Zn.expandByPoint(un),un.addVectors(Zn.max,Xa.max),Zn.expandByPoint(un)):(Zn.expandByPoint(Xa.min),Zn.expandByPoint(Xa.max))}Zn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)un.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(un));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)un.fromBufferAttribute(o,l),c&&(Xr.fromBufferAttribute(e,l),un.add(Xr)),s=Math.max(s,n.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&it('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){it("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new yn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],c=[],l=new Uint8Array(n.count);for(let L=0;L<n.count;L++)o[L]=new z,c[L]=new z;let h=new z,u=new z,d=new z,f=new he,p=new he,y=new he,g=new z,m=new z;function x(L,P,k){l[L]=l[P]=l[k]=1,h.fromBufferAttribute(n,L),u.fromBufferAttribute(n,P),d.fromBufferAttribute(n,k),f.fromBufferAttribute(r,L),p.fromBufferAttribute(r,P),y.fromBufferAttribute(r,k),u.sub(h),d.sub(h),p.sub(f),y.sub(f);let V=1/(p.x*y.y-y.x*p.y);isFinite(V)&&(g.copy(u).multiplyScalar(y.y).addScaledVector(d,-p.y).multiplyScalar(V),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-y.x).multiplyScalar(V),o[L].add(g),o[P].add(g),o[k].add(g),c[L].add(m),c[P].add(m),c[k].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let L=0,P=M.length;L<P;++L){let k=M[L],V=k.start,X=k.count;for(let R=V,I=V+X;R<I;R+=3)x(e.getX(R+0),e.getX(R+1),e.getX(R+2))}let _=new z,E=new z,A=new z,b=new z;function S(L){A.fromBufferAttribute(s,L),b.copy(A);let P=o[L];_.copy(P),_.sub(A.multiplyScalar(A.dot(P))).normalize(),E.crossVectors(b,P);let V=E.dot(c[L])<0?-1:1;a.setXYZW(L,_.x,_.y,_.z,V)}for(let L=0,P=n.count;L<P;++L)l[L]&&S(L);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new yn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new z,r=new z,a=new z,o=new z,c=new z,l=new z,h=new z,u=new z;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),y=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)un.fromBufferAttribute(e,t),un.normalize(),e.setXYZ(t,un.x,un.y,un.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h),f=0,p=0;for(let y=0,g=c.length;y<g;y++){o.isInterleavedBufferAttribute?f=c[y]*o.data.stride+o.offset:f=c[y]*h;for(let m=0;m<h;m++)d[p++]=l[f++]}return new yn(d,h,u)}if(this.index===null)return We("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ar=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=yd,this.updateRanges=[],this.version=0,this.uuid=Ai()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Ip(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Ip(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Ip(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=Ai()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var kn=new z,As=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s,this._normalizationScale=e!==void 0?wh(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.applyMatrix4(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.applyNormalMatrix(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kn.fromBufferAttribute(this,t),kn.transformDirection(e),this.setXYZ(t,kn.x,kn.y,kn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){lo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new yn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){lo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):wd(e,this.data.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):Td(e,this.data.array)}},Tu=new z,gb=new z,bb=new ot,Si=class{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Tu.subVectors(n,t).cross(gb.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Tu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||bb.getNormalMatrix(e),s=this.coplanarPoint(Tu).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},xb=0,Bn=class extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xb++}),this.uuid=Ai(),this.name="",this.type="Material",this.blending=_a,this.side=Bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qu,this.blendDst=ed,this.blendEquation=xr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=na,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=tc,this.stencilZFail=tc,this.stencilZPass=tc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){We(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){We(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Si().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new he().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new he().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},or=class extends Bn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},jr,ja=new z,Kr=new z,Jr=new z,Yr=new he,Ka=new he,Zm=new st,Il=new z,Ja=new z,Ll=new z,Lp=new he,Eu=new he,Dp=new he,ca=class extends Ot{constructor(e=new or){if(super(),this.isSprite=!0,this.type="Sprite",jr===void 0){jr=new Ft;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ar(t,5);jr.setIndex([0,1,2,0,2,3]),jr.setAttribute("position",new As(n,3,0,!1)),jr.setAttribute("uv",new As(n,2,3,!1))}this.geometry=jr,this.material=e,this.center=new he(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&it('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Kr.setFromMatrixScale(this.matrixWorld),Zm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Jr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Kr.multiplyScalar(-Jr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;Dl(Il.set(-.5,-.5,0),Jr,a,Kr,s,r),Dl(Ja.set(.5,-.5,0),Jr,a,Kr,s,r),Dl(Ll.set(.5,.5,0),Jr,a,Kr,s,r),Lp.set(0,0),Eu.set(1,0),Dp.set(1,1);let o=e.ray.intersectTriangle(Il,Ja,Ll,!1,ja);if(o===null&&(Dl(Ja.set(-.5,.5,0),Jr,a,Kr,s,r),Eu.set(0,1),o=e.ray.intersectTriangle(Il,Ll,Ja,!1,ja),o===null))return;let c=e.ray.origin.distanceTo(ja);c<e.near||c>e.far||t.push({distance:c,point:ja.clone(),uv:ts.getInterpolation(ja,Il,Ja,Ll,Lp,Eu,Dp,new he),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function Dl(i,e,t,n,s,r){Yr.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ka.x=r*Yr.x-s*Yr.y,Ka.y=s*Yr.x+r*Yr.y):Ka.copy(Yr),i.copy(e),i.x+=Ka.x,i.y+=Ka.y,i.applyMatrix4(Zm)}var Qi=new z,Au=new z,Nl=new z,Fl=new z,lr=class{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Qi.copy(this.origin).addScaledVector(this.direction,t),Qi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Au.copy(e).add(t).multiplyScalar(.5),Nl.copy(t).sub(e).normalize(),Fl.copy(this.origin).sub(Au);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Nl),o=Fl.dot(this.direction),c=-Fl.dot(Nl),l=Fl.lengthSq(),h=Math.abs(1-a*a),u,d,f,p;if(h>0)if(u=a*c-o,d=a*o-c,p=r*h,u>=0)if(d>=-p)if(d<=p){let y=1/h;u*=y,d*=y,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Au).addScaledVector(Nl,d),f}intersectSphere(e,t){if(e.radius<0)return null;Qi.subVectors(e.center,this.origin);let n=Qi.dot(this.direction),s=Qi.dot(Qi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Qi)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,y=t.y-a.y,g=t.z-a.z,m=n.x-a.x,x=n.y-a.y,M=n.z-a.z,_=Math.abs(c),E=Math.abs(l),A=Math.abs(h),b,S,L,P,k,V,X,R,I,U,O,W;if(_>=E&&_>=A?(L=c,V=u,I=p,W=m,c>=0?(b=l,S=h,P=d,k=f,X=y,R=g,U=x,O=M):(b=h,S=l,P=f,k=d,X=g,R=y,U=M,O=x)):E>=A?(L=l,V=d,I=y,W=x,l>=0?(b=h,S=c,P=f,k=u,X=g,R=p,U=M,O=m):(b=c,S=h,P=u,k=f,X=p,R=g,U=m,O=M)):(L=h,V=f,I=g,W=M,h>=0?(b=c,S=l,P=u,k=d,X=p,R=y,U=m,O=x):(b=l,S=c,P=d,k=u,X=y,R=p,U=x,O=m)),L===0)return null;let D=b/L,G=S/L,q=1/L,le=P-D*V,Pe=k-G*V,Z=X-D*I,de=R-G*I,Ie=U-D*W,Xe=O-G*W,Me=Ie*de-Xe*Z,je=le*Xe-Pe*Ie,Rt=Z*Pe-de*le;if(s){if(Me<0||je<0||Rt<0)return null}else if((Me<0||je<0||Rt<0)&&(Me>0||je>0||Rt>0))return null;let Ze=Me+je+Rt;if(Ze===0)return null;let lt=q*(Me*V+je*I+Rt*W);return(Ze>0?lt<0:lt>0)?null:this.at(lt/Ze,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Tt=class extends Bn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=td,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Np=new st,$s=new lr,kl=new Vn,Fp=new z,Ul=new z,Ol=new z,Bl=new z,Ru=new z,zl=new z,kp=new z,Hl=new z,ht=class extends Ot{constructor(e=new Ft,t=new Tt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){zl.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(Ru.fromBufferAttribute(u,e),a?zl.addScaledVector(Ru,h):zl.addScaledVector(Ru.sub(t),h))}t.add(zl)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kl.copy(n.boundingSphere),kl.applyMatrix4(r),$s.copy(e.ray).recast(e.near),!(kl.containsPoint($s.origin)===!1&&($s.intersectSphere(kl,Fp)===null||$s.origin.distanceToSquared(Fp)>(e.far-e.near)**2))&&(Np.copy(r).invert(),$s.copy(e.ray).applyMatrix4(Np),!(n.boundingBox!==null&&$s.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,$s)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,y=d.length;p<y;p++){let g=d[p],m=a[g.materialIndex],x=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let _=x,E=M;_<E;_+=3){let A=o.getX(_),b=o.getX(_+1),S=o.getX(_+2);s=Gl(this,m,e,n,l,h,u,A,b,S),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),y=Math.min(o.count,f.start+f.count);for(let g=p,m=y;g<m;g+=3){let x=o.getX(g),M=o.getX(g+1),_=o.getX(g+2);s=Gl(this,a,e,n,l,h,u,x,M,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,y=d.length;p<y;p++){let g=d[p],m=a[g.materialIndex],x=Math.max(g.start,f.start),M=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let _=x,E=M;_<E;_+=3){let A=_,b=_+1,S=_+2;s=Gl(this,m,e,n,l,h,u,A,b,S),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),y=Math.min(c.count,f.start+f.count);for(let g=p,m=y;g<m;g+=3){let x=g,M=g+1,_=g+2;s=Gl(this,a,e,n,l,h,u,x,M,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function yb(i,e,t,n,s,r,a,o){let c;if(e.side===_n?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Bi,o),c===null)return null;Hl.copy(o),Hl.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Hl);return l<t.near||l>t.far?null:{distance:l,point:Hl.clone(),object:i}}function Gl(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Ul),i.getVertexPosition(c,Ol),i.getVertexPosition(l,Bl);let h=yb(i,e,t,n,Ul,Ol,Bl,kp);if(h){let u=new z;ts.getBarycoord(kp,Ul,Ol,Bl,u),s&&(h.uv=ts.getInterpolatedAttribute(s,o,c,l,u,new he)),r&&(h.uv1=ts.getInterpolatedAttribute(r,o,c,l,u,new he)),a&&(h.normal=ts.getInterpolatedAttribute(a,o,c,l,u,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:c,c:l,normal:new z,materialIndex:0};ts.getNormal(Ul,Ol,Bl,d.normal),h.face=d,h.barycoord=u}return h}var Ya=new It,Up=new It,Op=new It,_b=new It,Bp=new st,Vl=new z,Cu=new Vn,zp=new st,Pu=new lr,go=class extends ht{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Uu,this.bindMatrix=new st,this.bindMatrixInverse=new st,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new On),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Vl),this.boundingBox.expandByPoint(Vl)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Vn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Vl),this.boundingSphere.expandByPoint(Vl)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cu.copy(this.boundingSphere),Cu.applyMatrix4(s),e.ray.intersectsSphere(Cu)!==!1&&(zp.copy(s).invert(),Pu.copy(e.ray).applyMatrix4(zp),!(this.boundingBox!==null&&Pu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Pu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new It,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Uu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Fm?this.bindMatrixInverse.copy(this.bindMatrix).invert():We("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Up.fromBufferAttribute(s.attributes.skinIndex,e),Op.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Ya.copy(t),t.set(0,0,0,0)):(Ya.set(t.x,t.y,t.z,1),t.set(0,0,0)),Ya.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=Op.getComponent(r);if(a!==0){let o=Up.getComponent(r);Bp.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(_b.copy(Ya).applyMatrix4(Bp),a)}}return t.isVector4&&(t.w=Ya.w),t.applyMatrix4(this.bindMatrixInverse)}},ha=class extends Ot{constructor(){super(),this.isBone=!0,this.type="Bone"}},ua=class extends Qt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=$t,h=$t,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Hp=new st,vb=new st,bo=class i{constructor(e=[],t=[]){this.uuid=Ai(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){We("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new st)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new st;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:vb;Hp.multiplyMatrices(o,t[r]),Hp.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ua(t,e,e,hi,ti);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(We("Skeleton: No bone found with UUID:",r),a=new ha),this.bones.push(a),this.boneInverses.push(new st().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},ss=class extends yn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Zr=new st,Gp=new st,Wl=[],Vp=new On,Mb=new st,Za=new ht,$a=new Vn,cr=class extends ht{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ss(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Mb)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new On),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zr),Vp.copy(e.boundingBox).applyMatrix4(Zr),this.boundingBox.union(Vp)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zr),$a.copy(e.boundingSphere).applyMatrix4(Zr),this.boundingSphere.union($a)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Za.geometry=this.geometry,Za.material=this.material,Za.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$a.copy(this.boundingSphere),$a.applyMatrix4(n),e.ray.intersectsSphere($a)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Zr),Gp.multiplyMatrices(n,Zr),Za.matrixWorld=Gp,Za.raycast(e,Wl);for(let a=0,o=Wl.length;a<o;a++){let c=Wl[a];c.instanceId=r,c.object=this,t.push(c)}Wl.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ss(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ua(new Float32Array(s*this.count),s,this.count,Hc,ti));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Qs=new Vn,Sb=new he(.5,.5),ql=new z,Rs=class{constructor(e=new Si,t=new Si,n=new Si,s=new Si,r=new Si,a=new Si){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ri,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],y=r[9],g=r[10],m=r[11],x=r[12],M=r[13],_=r[14],E=r[15];if(s[0].setComponents(l-a,f-h,m-p,E-x).normalize(),s[1].setComponents(l+a,f+h,m+p,E+x).normalize(),s[2].setComponents(l+o,f+u,m+y,E+M).normalize(),s[3].setComponents(l-o,f-u,m-y,E-M).normalize(),n)s[4].setComponents(c,d,g,_).normalize(),s[5].setComponents(l-c,f-d,m-g,E-_).normalize();else if(s[4].setComponents(l-c,f-d,m-g,E-_).normalize(),t===ri)s[5].setComponents(l+c,f+d,m+g,E+_).normalize();else if(t===sa)s[5].setComponents(c,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qs)}intersectsSprite(e){Qs.center.set(0,0,0);let t=Sb.distanceTo(e.center);return Qs.radius=.7071067811865476+t,Qs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ql.x=s.normal.x>0?e.max.x:e.min.x,ql.y=s.normal.y>0?e.max.y:e.min.y,ql.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ql)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Wp=new st,dc=class i{constructor(){this.coordinateSystem=ri,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let s=0;s<t.length;s++){let r=t[s];Wp.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new Rs),n[s].setFromProjectionMatrix(Wp,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Rs),t[s].copy(n[s]);return this._count=e._count,this}clone(){return new i().copy(this)}};var Cs=class extends Bn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},fc=new z,pc=new z,qp=new st,Qa=new lr,Xl=new Vn,Iu=new z,Xp=new z,rs=class extends Ot{constructor(e=new Ft,t=new Cs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)fc.fromBufferAttribute(t,s-1),pc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=fc.distanceTo(pc);e.setAttribute("lineDistance",new dt(n,1))}else We("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xl.copy(n.boundingSphere),Xl.applyMatrix4(s),Xl.radius+=r,e.ray.intersectsSphere(Xl)===!1)return;qp.copy(s).invert(),Qa.copy(e.ray).applyMatrix4(qp);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let y=f,g=p-1;y<g;y+=l){let m=h.getX(y),x=h.getX(y+1),M=jl(this,e,Qa,c,m,x,y);M&&t.push(M)}if(this.isLineLoop){let y=h.getX(p-1),g=h.getX(f),m=jl(this,e,Qa,c,y,g,p-1);m&&t.push(m)}}else{let f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let y=f,g=p-1;y<g;y+=l){let m=jl(this,e,Qa,c,y,y+1,y);m&&t.push(m)}if(this.isLineLoop){let y=jl(this,e,Qa,c,p-1,f,p-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function jl(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(fc.fromBufferAttribute(o,s),pc.fromBufferAttribute(o,r),t.distanceSqToSegment(fc,pc,Iu,Xp)>n)return;Iu.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Iu);if(!(l<e.near||l>e.far))return{distance:l,point:Xp.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var jp=new z,Kp=new z,xo=class extends rs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)jp.fromBufferAttribute(t,s),Kp.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+jp.distanceTo(Kp);e.setAttribute("lineDistance",new dt(n,1))}else We("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},yo=class extends rs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},da=class extends Bn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Jp=new st,Bu=new lr,Kl=new Vn,Jl=new z,_o=class extends Ot{constructor(e=new Ft,t=new da){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Kl.copy(n.boundingSphere),Kl.applyMatrix4(s),Kl.radius+=r,e.ray.intersectsSphere(Kl)===!1)return;Jp.copy(s).invert(),Bu.copy(e.ray).applyMatrix4(Jp);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=d,y=f;p<y;p++){let g=l.getX(p);Jl.fromBufferAttribute(u,g),Yp(Jl,g,c,s,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,y=f;p<y;p++)Jl.fromBufferAttribute(u,p),Yp(Jl,p,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Yp(i,e,t,n,s,r,a){let o=Bu.distanceSqToPoint(i);if(o<t){let c=new z;Bu.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var vo=class extends Qt{constructor(e=[],t=yr,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},hr=class extends Qt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var as=class extends Qt{constructor(e,t,n=Ti,s,r,a,o=$t,c=$t,l,h=is,u=1){if(h!==is&&h!==ps)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new oa(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Mo=class extends as{constructor(e,t=Ti,n=yr,s,r,a=$t,o=$t,c,l=is){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},So=class extends Qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Qe=class i extends Ft{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,s,a,2),p("x","z","y",1,-1,e,n,-t,s,a,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new dt(l,3)),this.setAttribute("normal",new dt(h,3)),this.setAttribute("uv",new dt(u,2));function p(y,g,m,x,M,_,E,A,b,S,L){let P=_/b,k=E/S,V=_/2,X=E/2,R=A/2,I=b+1,U=S+1,O=0,W=0,D=new z;for(let G=0;G<U;G++){let q=G*k-X;for(let le=0;le<I;le++){let Pe=le*P-V;D[y]=Pe*x,D[g]=q*M,D[m]=R,l.push(D.x,D.y,D.z),D[y]=0,D[g]=0,D[m]=A>0?1:-1,h.push(D.x,D.y,D.z),u.push(le/b),u.push(1-G/S),O+=1}}for(let G=0;G<S;G++)for(let q=0;q<b;q++){let le=d+q+I*G,Pe=d+q+I*(G+1),Z=d+(q+1)+I*(G+1),de=d+(q+1)+I*G;c.push(le,Pe,de),c.push(Pe,Z,de),W+=6}o.addGroup(f,W,L),f+=W,d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var wo=class i extends Ft{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new z,h=new he;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new dt(a,3)),this.setAttribute("normal",new dt(o,3)),this.setAttribute("uv",new dt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},nt=class i extends Ft{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],p=0,y=[],g=n/2,m=0;x(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new dt(u,3)),this.setAttribute("normal",new dt(d,3)),this.setAttribute("uv",new dt(f,2));function x(){let _=new z,E=new z,A=0,b=(t-e)/n;for(let S=0;S<=r;S++){let L=[],P=S/r,k=P*(t-e)+e;for(let V=0;V<=s;V++){let X=V/s,R=X*c+o,I=Math.sin(R),U=Math.cos(R);E.x=k*I,E.y=-P*n+g,E.z=k*U,u.push(E.x,E.y,E.z),_.set(I,b,U).normalize(),d.push(_.x,_.y,_.z),f.push(X,1-P),L.push(p++)}y.push(L)}for(let S=0;S<s;S++)for(let L=0;L<r;L++){let P=y[L][S],k=y[L+1][S],V=y[L+1][S+1],X=y[L][S+1];(e>0||L!==0)&&(h.push(P,k,X),A+=3),(t>0||L!==r-1)&&(h.push(k,V,X),A+=3)}l.addGroup(m,A,0),m+=A}function M(_){let E=p,A=new he,b=new z,S=0,L=_===!0?e:t,P=_===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,g*P,0),d.push(0,P,0),f.push(.5,.5),p++;let k=p;for(let V=0;V<=s;V++){let R=V/s*c+o,I=Math.cos(R),U=Math.sin(R);b.x=L*U,b.y=g*P,b.z=L*I,u.push(b.x,b.y,b.z),d.push(0,P,0),A.x=I*.5+.5,A.y=U*.5*P+.5,f.push(A.x,A.y),p++}for(let V=0;V<s;V++){let X=E+V,R=k+V;_===!0?h.push(R,R+1,X):h.push(R+1,R,X),S+=3}l.addGroup(m,S,_===!0?1:2),m+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ni=class i extends nt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},mc=class i extends Ft{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new dt(r,3)),this.setAttribute("normal",new dt(r.slice(),3)),this.setAttribute("uv",new dt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let M=new z,_=new z,E=new z;for(let A=0;A<t.length;A+=3)f(t[A+0],M),f(t[A+1],_),f(t[A+2],E),c(M,_,E,x)}function c(x,M,_,E){let A=E+1,b=[];for(let S=0;S<=A;S++){b[S]=[];let L=x.clone().lerp(_,S/A),P=M.clone().lerp(_,S/A),k=A-S;for(let V=0;V<=k;V++)V===0&&S===A?b[S][V]=L:b[S][V]=L.clone().lerp(P,V/k)}for(let S=0;S<A;S++)for(let L=0;L<2*(A-S)-1;L++){let P=Math.floor(L/2);L%2===0?(d(b[S][P+1]),d(b[S+1][P]),d(b[S][P])):(d(b[S][P+1]),d(b[S+1][P+1]),d(b[S+1][P]))}}function l(x){let M=new z;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(x),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){let x=new z;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];let _=g(x)/2/Math.PI+.5,E=m(x)/Math.PI+.5;a.push(_,1-E)}p(),u()}function u(){for(let x=0;x<a.length;x+=6){let M=a[x+0],_=a[x+2],E=a[x+4],A=Math.max(M,_,E),b=Math.min(M,_,E);A>.9&&b<.1&&(M<.2&&(a[x+0]+=1),_<.2&&(a[x+2]+=1),E<.2&&(a[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,M){let _=x*3;M.x=e[_+0],M.y=e[_+1],M.z=e[_+2]}function p(){let x=new z,M=new z,_=new z,E=new z,A=new he,b=new he,S=new he;for(let L=0,P=0;L<r.length;L+=9,P+=6){x.set(r[L+0],r[L+1],r[L+2]),M.set(r[L+3],r[L+4],r[L+5]),_.set(r[L+6],r[L+7],r[L+8]),A.set(a[P+0],a[P+1]),b.set(a[P+2],a[P+3]),S.set(a[P+4],a[P+5]),E.copy(x).add(M).add(_).divideScalar(3);let k=g(E);y(A,P+0,x,k),y(b,P+2,M,k),y(S,P+4,_,k)}}function y(x,M,_,E){E<0&&x.x===1&&(a[M]=x.x-1),_.x===0&&_.z===0&&(a[M]=E/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var Qn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){We("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new he:new z);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new z,s=[],r=[],a=[],o=new z,c=new st;for(let f=0;f<=e;f++){let p=f/e;s[f]=this.getTangentAt(p,new z)}r[0]=new z,a[0]=new z;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(gt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(gt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(c.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},fa=class extends Qn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new he){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},gc=class extends fa{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ed(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Zp=new z,$p=new z,Lu=new Ed,Du=new Ed,Nu=new Ed,bc=class extends Qn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new z){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:($p.subVectors(s[0],s[1]).add(s[0]),l=$p);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Zp.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Zp),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),p<1e-4&&(p=y),g<1e-4&&(g=y),Lu.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,p,y,g),Du.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,p,y,g),Nu.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,p,y,g)}else this.curveType==="catmullrom"&&(Lu.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Du.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Nu.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Lu.calc(c),Du.calc(c),Nu.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new z().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Qp(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function wb(i,e){let t=1-i;return t*t*e}function Tb(i,e){return 2*(1-i)*i*e}function Eb(i,e){return i*i*e}function so(i,e,t,n){return wb(i,e)+Tb(i,t)+Eb(i,n)}function Ab(i,e){let t=1-i;return t*t*t*e}function Rb(i,e){let t=1-i;return 3*t*t*i*e}function Cb(i,e){return 3*(1-i)*i*i*e}function Pb(i,e){return i*i*i*e}function ro(i,e,t,n,s){return Ab(i,e)+Rb(i,t)+Cb(i,n)+Pb(i,s)}var To=class extends Qn{constructor(e=new he,t=new he,n=new he,s=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ro(e,s.x,r.x,a.x,o.x),ro(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},xc=class extends Qn{constructor(e=new z,t=new z,n=new z,s=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new z){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ro(e,s.x,r.x,a.x,o.x),ro(e,s.y,r.y,a.y,o.y),ro(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Eo=class extends Qn{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yc=class extends Qn{constructor(e=new z,t=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ao=class extends Qn{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(so(e,s.x,r.x,a.x),so(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_c=class extends Qn{constructor(e=new z,t=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new z){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(so(e,s.x,r.x,a.x),so(e,s.y,r.y,a.y),so(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ro=class extends Qn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Qp(o,c.x,l.x,h.x,u.x),Qp(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new he().fromArray(s))}return this}},zu=Object.freeze({__proto__:null,ArcCurve:gc,CatmullRomCurve3:bc,CubicBezierCurve:To,CubicBezierCurve3:xc,EllipseCurve:fa,LineCurve:Eo,LineCurve3:yc,QuadraticBezierCurve:Ao,QuadraticBezierCurve3:_c,SplineCurve:Ro}),vc=class extends Qn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new zu[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new zu[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},Co=class extends vc{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Eo(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ao(this.currentPoint.clone(),new he(e,t),new he(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new To(this.currentPoint.clone(),new he(e,t),new he(n,s),new he(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Ro(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let l=new fa(e,t,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},li=class extends Co{constructor(e){super(e),this.uuid=Ai(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Co().fromJSON(s))}return this}};function Ib(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=$m(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=kb(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let h=o,u=c;for(let d=t;d<s;d+=t){let f=i[d],p=i[d+1];f<o&&(o=f),p<c&&(c=p),f>h&&(h=f),p>u&&(u=p)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return Po(r,a,t,o,c,l,0),a}function $m(i,e,t,n,s){let r;if(s===jb(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=em(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=em(a/n|0,i[a],i[a+1],r);return r&&pa(r,r.next)&&(Lo(r),r=r.next),r}function ur(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(pa(t,t.next)||Wt(t.prev,t,t.next)===0)){if(Lo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Po(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Hb(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Db(i,n,s,r):Lb(i)){e.push(c.i,i.i,l.i),Lo(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Nb(ur(i),e),Po(i,e,t,n,s,r,2)):a===2&&Fb(i,e,t,n,s,r):Po(ur(i),e,t,n,s,r,1);break}}}function Lb(i){let e=i.prev,t=i,n=i.next;if(Wt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),u=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l),p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&eo(s,o,r,c,a,l,p.x,p.y)&&Wt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Db(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Wt(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,c,l),p=Math.min(h,u,d),y=Math.max(o,c,l),g=Math.max(h,u,d),m=Hu(f,p,e,t,n),x=Hu(y,g,e,t,n),M=i.prevZ,_=i.nextZ;for(;M&&M.z>=m&&_&&_.z<=x;){if(M.x>=f&&M.x<=y&&M.y>=p&&M.y<=g&&M!==s&&M!==a&&eo(o,h,c,u,l,d,M.x,M.y)&&Wt(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=f&&_.x<=y&&_.y>=p&&_.y<=g&&_!==s&&_!==a&&eo(o,h,c,u,l,d,_.x,_.y)&&Wt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=y&&M.y>=p&&M.y<=g&&M!==s&&M!==a&&eo(o,h,c,u,l,d,M.x,M.y)&&Wt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=x;){if(_.x>=f&&_.x<=y&&_.y>=p&&_.y<=g&&_!==s&&_!==a&&eo(o,h,c,u,l,d,_.x,_.y)&&Wt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Nb(i,e){let t=i;do{let n=t.prev,s=t.next.next;!pa(n,s)&&e0(n,t,t.next,s)&&Io(n,s)&&Io(s,n)&&(e.push(n.i,t.i,s.i),Lo(t),Lo(t.next),t=i=s),t=t.next}while(t!==i);return ur(t)}function Fb(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Wb(a,o)){let c=t0(a,o);a=ur(a,a.next),c=ur(c,c.next),Po(a,e,t,n,s,r,0),Po(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function kb(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=$m(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Vb(l))}s.sort(Ub);for(let r=0;r<s.length;r++)t=Ob(s[r],t);return t}function Ub(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Ob(i,e){let t=Bb(i,e);if(!t)return e;let n=t0(t,i);return ur(n,n.next),ur(t,t.next)}function Bb(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(pa(i,t))return t;do{if(pa(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Qm(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);Io(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&zb(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function zb(i,e){return Wt(i.prev,i,e.prev)<0&&Wt(e.next,i,i.next)<0}function Hb(i,e,t,n){let s=i;do s.z===0&&(s.z=Hu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Gb(s)}function Gb(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Hu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Vb(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Qm(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function eo(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Qm(i,e,t,n,s,r,a,o)}function Wb(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!qb(i,e)&&(Io(i,e)&&Io(e,i)&&Xb(i,e)&&(Wt(i.prev,i,e.prev)||Wt(i,e.prev,e))||pa(i,e)&&Wt(i.prev,i,i.next)>0&&Wt(e.prev,e,e.next)>0)}function Wt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function pa(i,e){return i.x===e.x&&i.y===e.y}function e0(i,e,t,n){let s=Zl(Wt(i,e,t)),r=Zl(Wt(i,e,n)),a=Zl(Wt(t,n,i)),o=Zl(Wt(t,n,e));return!!(s!==r&&a!==o||s===0&&Yl(i,t,e)||r===0&&Yl(i,n,e)||a===0&&Yl(t,i,n)||o===0&&Yl(t,e,n))}function Yl(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Zl(i){return i>0?1:i<0?-1:0}function qb(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&e0(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Io(i,e){return Wt(i.prev,i,i.next)<0?Wt(i,e,i.next)>=0&&Wt(i,i.prev,e)>=0:Wt(i,e,i.prev)<0||Wt(i,i.next,e)<0}function Xb(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function t0(i,e){let t=Gu(i.i,i.x,i.y),n=Gu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function em(i,e,t,n){let s=Gu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Lo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Gu(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function jb(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Vu=class{static triangulate(e,t,n=2){return Ib(e,t,n)}},Li=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];tm(e),nm(n,e);let a=e.length;t.forEach(tm);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,nm(n,t[c]);let o=Vu.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function tm(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function nm(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var os=class i extends Ft{constructor(e=new li([new he(.5,.5),new he(-.5,.5),new he(-.5,-.5),new he(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,c=e.length;o<c;o++){let l=e[o];a(l)}this.setAttribute("position",new dt(s,3)),this.setAttribute("uv",new dt(r,2)),this.computeVertexNormals();function a(o){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,m=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Kb,M,_=!1,E,A,b,S;if(m){M=m.getSpacedPoints(h),_=!0,d=!1;let ae=m.isCatmullRomCurve3?m.closed:!1;E=m.computeFrenetFrames(h,ae),A=new z,b=new z,S=new z}d||(g=0,f=0,p=0,y=0);let L=o.extractPoints(l),P=L.shape,k=L.holes;if(!Li.isClockWise(P)){P=P.reverse();for(let ae=0,ge=k.length;ae<ge;ae++){let me=k[ae];Li.isClockWise(me)&&(k[ae]=me.reverse())}}function X(ae){let me=10000000000000001e-36,Ne=ae[0];for(let we=1;we<=ae.length;we++){let ct=we%ae.length,ke=ae[ct],F=ke.x-Ne.x,Q=ke.y-Ne.y,ce=F*F+Q*Q,N=Math.max(Math.abs(ke.x),Math.abs(ke.y),Math.abs(Ne.x),Math.abs(Ne.y)),Ke=me*N*N;if(ce<=Ke){ae.splice(ct,1),we--;continue}Ne=ke}}X(P),k.forEach(X);let R=k.length,I=P;for(let ae=0;ae<R;ae++){let ge=k[ae];P=P.concat(ge)}function U(ae,ge,me){return ge||it("ExtrudeGeometry: vec does not exist"),ae.clone().addScaledVector(ge,me)}let O=P.length;function W(ae,ge,me){let Ne,we,ct,ke=ae.x-ge.x,F=ae.y-ge.y,Q=me.x-ae.x,ce=me.y-ae.y,N=ke*ke+F*F,Ke=ke*ce-F*Q;if(Math.abs(Ke)>Number.EPSILON){let Be=Math.sqrt(N),xt=Math.sqrt(Q*Q+ce*ce),be=ge.x-F/Be,Xt=ge.y+ke/Be,et=me.x-ce/xt,at=me.y+Q/xt,C=((et-be)*ce-(at-Xt)*Q)/(ke*ce-F*Q);Ne=be+ke*C-ae.x,we=Xt+F*C-ae.y;let w=Ne*Ne+we*we;if(w<=2)return new he(Ne,we);ct=Math.sqrt(w/2)}else{let Be=!1;ke>Number.EPSILON?Q>Number.EPSILON&&(Be=!0):ke<-Number.EPSILON?Q<-Number.EPSILON&&(Be=!0):Math.sign(F)===Math.sign(ce)&&(Be=!0),Be?(Ne=-F,we=ke,ct=Math.sqrt(N)):(Ne=ke,we=F,ct=Math.sqrt(N/2))}return new he(Ne/ct,we/ct)}let D=[];for(let ae=0,ge=I.length,me=ge-1,Ne=ae+1;ae<ge;ae++,me++,Ne++)me===ge&&(me=0),Ne===ge&&(Ne=0),D[ae]=W(I[ae],I[me],I[Ne]);let G=[],q,le=D.concat();for(let ae=0,ge=R;ae<ge;ae++){let me=k[ae];q=[];for(let Ne=0,we=me.length,ct=we-1,ke=Ne+1;Ne<we;Ne++,ct++,ke++)ct===we&&(ct=0),ke===we&&(ke=0),q[Ne]=W(me[Ne],me[ct],me[ke]);G.push(q),le=le.concat(q)}let Pe;if(g===0)Pe=Li.triangulateShape(I,k);else{let ae=[],ge=[];for(let me=0;me<g;me++){let Ne=me/g,we=f*Math.cos(Ne*Math.PI/2),ct=p*Math.sin(Ne*Math.PI/2)+y;for(let ke=0,F=I.length;ke<F;ke++){let Q=U(I[ke],D[ke],ct);je(Q.x,Q.y,-we),Ne===0&&ae.push(Q)}for(let ke=0,F=R;ke<F;ke++){let Q=k[ke];q=G[ke];let ce=[];for(let N=0,Ke=Q.length;N<Ke;N++){let Be=U(Q[N],q[N],ct);je(Be.x,Be.y,-we),Ne===0&&ce.push(Be)}Ne===0&&ge.push(ce)}}Pe=Li.triangulateShape(ae,ge)}let Z=Pe.length,de=p+y;for(let ae=0;ae<O;ae++){let ge=d?U(P[ae],le[ae],de):P[ae];_?(b.copy(E.normals[0]).multiplyScalar(ge.x),A.copy(E.binormals[0]).multiplyScalar(ge.y),S.copy(M[0]).add(b).add(A),je(S.x,S.y,S.z)):je(ge.x,ge.y,0)}for(let ae=1;ae<=h;ae++)for(let ge=0;ge<O;ge++){let me=d?U(P[ge],le[ge],de):P[ge];_?(b.copy(E.normals[ae]).multiplyScalar(me.x),A.copy(E.binormals[ae]).multiplyScalar(me.y),S.copy(M[ae]).add(b).add(A),je(S.x,S.y,S.z)):je(me.x,me.y,u/h*ae)}for(let ae=g-1;ae>=0;ae--){let ge=ae/g,me=f*Math.cos(ge*Math.PI/2),Ne=p*Math.sin(ge*Math.PI/2)+y;for(let we=0,ct=I.length;we<ct;we++){let ke=U(I[we],D[we],Ne);je(ke.x,ke.y,u+me)}for(let we=0,ct=k.length;we<ct;we++){let ke=k[we];q=G[we];for(let F=0,Q=ke.length;F<Q;F++){let ce=U(ke[F],q[F],Ne);_?je(ce.x,ce.y+M[h-1].y,M[h-1].x+me):je(ce.x,ce.y,u+me)}}}Ie(),Xe();function Ie(){let ae=s.length/3;if(d){let ge=0,me=O*ge;for(let Ne=0;Ne<Z;Ne++){let we=Pe[Ne];Rt(we[2]+me,we[1]+me,we[0]+me)}ge=h+g*2,me=O*ge;for(let Ne=0;Ne<Z;Ne++){let we=Pe[Ne];Rt(we[0]+me,we[1]+me,we[2]+me)}}else{for(let ge=0;ge<Z;ge++){let me=Pe[ge];Rt(me[2],me[1],me[0])}for(let ge=0;ge<Z;ge++){let me=Pe[ge];Rt(me[0]+O*h,me[1]+O*h,me[2]+O*h)}}n.addGroup(ae,s.length/3-ae,0)}function Xe(){let ae=s.length/3,ge=0;Me(I,ge),ge+=I.length;for(let me=0,Ne=k.length;me<Ne;me++){let we=k[me];Me(we,ge),ge+=we.length}n.addGroup(ae,s.length/3-ae,1)}function Me(ae,ge){let me=ae.length;for(;--me>=0;){let Ne=me,we=me-1;we<0&&(we=ae.length-1);for(let ct=0,ke=h+g*2;ct<ke;ct++){let F=O*ct,Q=O*(ct+1),ce=ge+Ne+F,N=ge+we+F,Ke=ge+we+Q,Be=ge+Ne+Q;Ze(ce,N,Ke,Be)}}}function je(ae,ge,me){c.push(ae),c.push(ge),c.push(me)}function Rt(ae,ge,me){lt(ae),lt(ge),lt(me);let Ne=s.length/3,we=x.generateTopUV(n,s,Ne-3,Ne-2,Ne-1);ft(we[0]),ft(we[1]),ft(we[2])}function Ze(ae,ge,me,Ne){lt(ae),lt(ge),lt(Ne),lt(ge),lt(me),lt(Ne);let we=s.length/3,ct=x.generateSideWallUV(n,s,we-6,we-3,we-2,we-1);ft(ct[0]),ft(ct[1]),ft(ct[3]),ft(ct[1]),ft(ct[2]),ft(ct[3])}function lt(ae){s.push(c[ae*3+0]),s.push(c[ae*3+1]),s.push(c[ae*3+2])}function ft(ae){r.push(ae.x),r.push(ae.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Jb(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new zu[s.type]().fromJSON(s)),new i(n,e.options)}},Kb={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new he(r,a),new he(o,c),new he(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],p=e[s*3+2],y=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new he(a,1-c),new he(l,1-u),new he(d,1-p),new he(y,1-m)]:[new he(o,1-c),new he(h,1-u),new he(f,1-p),new he(g,1-m)]}};function Jb(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Fi=class i extends Ft{constructor(e=[new he(0,-.5),new he(.5,0),new he(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=gt(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],l=[],h=1/t,u=new z,d=new he,f=new z,p=new z,y=new z,g=0,m=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:g=e[x+1].x-e[x].x,m=e[x+1].y-e[x].y,f.x=m*1,f.y=-g,f.z=m*0,y.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:y.normalize(),c.push(y.x,y.y,y.z);break;default:g=e[x+1].x-e[x].x,m=e[x+1].y-e[x].y,f.x=m*1,f.y=-g,f.z=m*0,p.copy(f),f.x+=y.x,f.y+=y.y,f.z+=y.z,f.normalize(),c.push(f.x,f.y,f.z),y.copy(p)}for(let x=0;x<=t;x++){let M=n+x*h*s,_=Math.sin(M),E=Math.cos(M);for(let A=0;A<=e.length-1;A++){u.x=e[A].x*_,u.y=e[A].y,u.z=e[A].x*E,a.push(u.x,u.y,u.z),d.x=x/t,d.y=A/(e.length-1),o.push(d.x,d.y);let b=c[3*A+0]*_,S=c[3*A+1],L=c[3*A+0]*E;l.push(b,S,L)}}for(let x=0;x<t;x++)for(let M=0;M<e.length-1;M++){let _=M+x*e.length,E=_,A=_+e.length,b=_+e.length+1,S=_+1;r.push(E,A,S),r.push(b,S,A)}this.setIndex(r),this.setAttribute("position",new dt(a,3)),this.setAttribute("uv",new dt(o,2)),this.setAttribute("normal",new dt(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Do=class i extends mc{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},Mt=class i extends Ft{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=e/o,d=t/c,f=[],p=[],y=[],g=[];for(let m=0;m<h;m++){let x=m*d-a;for(let M=0;M<l;M++){let _=M*u-r;p.push(_,-x,0),y.push(0,0,1),g.push(M/o),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<o;x++){let M=x+l*m,_=x+l*(m+1),E=x+1+l*(m+1),A=x+1+l*m;f.push(M,_,A),f.push(_,E,A)}this.setIndex(f),this.setAttribute("position",new dt(p,3)),this.setAttribute("normal",new dt(y,3)),this.setAttribute("uv",new dt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Ps=class i extends Ft{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=e,d=(t-e)/s,f=new z,p=new he;for(let y=0;y<=s;y++){for(let g=0;g<=n;g++){let m=r+g/n*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,h.push(p.x,p.y)}u+=d}for(let y=0;y<s;y++){let g=y*(n+1);for(let m=0;m<n;m++){let x=m+g,M=x,_=x+n+1,E=x+n+2,A=x+1;o.push(M,_,A),o.push(_,E,A)}}this.setIndex(o),this.setAttribute("position",new dt(c,3)),this.setAttribute("normal",new dt(l,3)),this.setAttribute("uv",new dt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Is=class i extends Ft{constructor(e=new li([new he(0,.5),new he(-.5,-.5),new he(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new dt(s,3)),this.setAttribute("normal",new dt(r,3)),this.setAttribute("uv",new dt(a,2));function l(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,p=d.holes;Li.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,m=p.length;g<m;g++){let x=p[g];Li.isClockWise(x)===!0&&(p[g]=x.reverse())}let y=Li.triangulateShape(f,p);for(let g=0,m=p.length;g<m;g++){let x=p[g];f=f.concat(x)}for(let g=0,m=f.length;g<m;g++){let x=f[g];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let g=0,m=y.length;g<m;g++){let x=y[g],M=x[0]+u,_=x[1]+u,E=x[2]+u;n.push(M,_,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Yb(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Yb(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Pn=class i extends Ft{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new z,d=new z,f=[],p=[],y=[],g=[];for(let m=0;m<=n;m++){let x=[],M=m/n,_=a+M*o,E=e*Math.cos(_),A=Math.sqrt(e*e-E*E),b=0;m===0&&a===0?b=.5/t:m===n&&c===Math.PI&&(b=-.5/t);for(let S=0;S<=t;S++){let L=S/t,P=s+L*r;u.x=-A*Math.cos(P),u.y=E,u.z=A*Math.sin(P),p.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),g.push(L+b,1-M),x.push(l++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){let M=h[m][x+1],_=h[m][x],E=h[m+1][x],A=h[m+1][x+1];(m!==0||a>0)&&f.push(M,_,A),(m!==n-1||c<Math.PI)&&f.push(_,E,A)}this.setIndex(f),this.setAttribute("position",new dt(p,3)),this.setAttribute("normal",new dt(y,3)),this.setAttribute("uv",new dt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ei=class i extends Ft{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let c=[],l=[],h=[],u=[],d=new z,f=new z,p=new z;for(let y=0;y<=n;y++){let g=a+y/n*o;for(let m=0;m<=s;m++){let x=m/s*r;f.x=(e+t*Math.cos(g))*Math.cos(x),f.y=(e+t*Math.cos(g))*Math.sin(x),f.z=t*Math.sin(g),l.push(f.x,f.y,f.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(m/s),u.push(y/n)}}for(let y=1;y<=n;y++)for(let g=1;g<=s;g++){let m=(s+1)*y+g-1,x=(s+1)*(y-1)+g-1,M=(s+1)*(y-1)+g,_=(s+1)*y+g;c.push(m,x,_),c.push(x,M,_)}this.setIndex(c),this.setAttribute("position",new dt(l,3)),this.setAttribute("normal",new dt(h,3)),this.setAttribute("uv",new dt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Mr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(im(s))s.isRenderTargetTexture?(We("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(im(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function In(i){let e={};for(let t=0;t<i.length;t++){let n=Mr(i[t]);for(let s in n)e[s]=n[s]}return e}function im(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Zb(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ad(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:yt.workingColorSpace}var n0={clone:Mr,merge:In},$b=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qb=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ki=class extends Bn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$b,this.fragmentShader=Qb,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Mr(e.uniforms),this.uniformsGroups=Zb(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new qe().setHex(s.value);break;case"v2":this.uniforms[n].value=new he().fromArray(s.value);break;case"v3":this.uniforms[n].value=new z().fromArray(s.value);break;case"v4":this.uniforms[n].value=new It().fromArray(s.value);break;case"m3":this.uniforms[n].value=new ot().fromArray(s.value);break;case"m4":this.uniforms[n].value=new st().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Mc=class extends ki{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ae=class extends Bn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sh,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},zn=class extends Ae{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new he(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return gt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new qe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return nr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){nr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Sc=class extends Bn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Om,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},wc=class extends Bn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Es(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function to(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function ex(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function sm(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let c=0;c!==e;++c)s[a++]=i[o+c]}return s}function tx(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var Ui=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break t}a=t.length;break n}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Tc=class extends Ui{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:er,endingEnd:er}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case tr:r=e,o=2*t-n;break;case ao:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case tr:a=e,c=2*n-t;break;case ao:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),y=p*p,g=y*p,m=-d*g+2*d*y-d*p,x=(1+d)*g+(-1.5-2*d)*y+(-.5+d)*p+1,M=(-1-f)*g+(1.5+f)*y+.5*p,_=f*g-f*y;for(let E=0;E!==o;++E)r[E]=m*a[h+E]+x*a[l+E]+M*a[c+E]+_*a[u+E];return r}},No=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}},Ec=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Ac=class extends Ui{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let p=(n-t)/(s-t),y=1-p;for(let g=0;g!==o;++g)r[g]=a[l+g]*y+a[c+g]*p;return r}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let y=a[l+p],g=a[c+p],m=f*d+p*2,x=u[m],M=u[m+1],_=e*d+p*2,E=h[_],A=h[_+1],b=ix(n,t,x,E,s);r[p]=i0(b,y,M,A,g)}return r}};function i0(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function nx(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function ix(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=i0(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let c=nx(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-o/c))}return r}var Wn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Es(t,this.TimeBufferType),this.values=Es(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Es(e.times,Array),values:Es(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),to(e.settings)&&(n.settings={inTangents:Es(e.settings.inTangents,Array),outTangents:Es(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ec(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new No(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Tc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ac(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ir:t=this.InterpolantFactoryMethodDiscrete;break;case sr:t=this.InterpolantFactoryMethodLinear;break;case ec:t=this.InterpolantFactoryMethodSmooth;break;case Ou:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return We("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ir;case this.InterpolantFactoryMethodLinear:return sr;case this.InterpolantFactoryMethodSmooth:return ec;case this.InterpolantFactoryMethodBezier:return Ou}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e;to(this.settings)&&(rm(this.settings.inTangents,e),rm(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;to(this.settings)&&(am(this.settings.inTangents,e),am(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(it("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(it("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){it("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){it("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Hg(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){it("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ec,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let u=o*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let y=t[u+p];if(y!==t[d+p]||y!==t[f+p]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,to(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function rm(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]+=e}function am(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Wn.prototype.ValueTypeName="";Wn.prototype.TimeBufferType=Float32Array;Wn.prototype.ValueBufferType=Float32Array;Wn.prototype.DefaultInterpolation=sr;var ls=class extends Wn{constructor(e,t,n){super(e,t,n)}};ls.prototype.ValueTypeName="bool";ls.prototype.ValueBufferType=Array;ls.prototype.DefaultInterpolation=ir;ls.prototype.InterpolantFactoryMethodLinear=void 0;ls.prototype.InterpolantFactoryMethodSmooth=void 0;var Fo=class extends Wn{constructor(e,t,n,s){super(e,t,n,s)}};Fo.prototype.ValueTypeName="color";var cs=class extends Wn{constructor(e,t,n,s){super(e,t,n,s)}};cs.prototype.ValueTypeName="number";var Rc=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)Zt.slerpFlat(r,0,a,l-o,a,l,c);return r}},hs=class extends Wn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Rc(this.times,this.values,this.getValueSize(),e)}};hs.prototype.ValueTypeName="quaternion";hs.prototype.InterpolantFactoryMethodSmooth=void 0;var us=class extends Wn{constructor(e,t,n){super(e,t,n)}};us.prototype.ValueTypeName="string";us.prototype.ValueBufferType=Array;us.prototype.DefaultInterpolation=ir;us.prototype.InterpolantFactoryMethodLinear=void 0;us.prototype.InterpolantFactoryMethodSmooth=void 0;var Ls=class extends Wn{constructor(e,t,n,s){super(e,t,n,s)}};Ls.prototype.ValueTypeName="vector";var dr=class{constructor(e="",t=-1,n=[],s=Mh){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Ai(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(rx(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Wn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);let h=ex(c);c=sm(c,1,h),l=sm(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new cs(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){let l=e[o],h=l.name.match(r);if(h&&h.length>1){let u=h[1],d=s[u];d||(s[u]=d=[]),d.push(l)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function sx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return cs;case"vector":case"vector2":case"vector3":case"vector4":return Ls;case"color":return Fo;case"quaternion":return hs;case"bool":case"boolean":return ls;case"string":return us}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function rx(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=sx(i.type);if(i.times===void 0){let n=[],s=[];tx(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),to(i.settings)&&(t.settings={inTangents:Es(i.settings.inTangents,Float32Array),outTangents:Es(i.settings.outTangents,Float32Array)}),t}var Di={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(om(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!om(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function om(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Cc=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],p=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},s0=new Cc,Oi=class{constructor(e){this.manager=e!==void 0?e:s0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};Oi.DEFAULT_MATERIAL_NAME="__DEFAULT";var es={},Wu=class extends Error{constructor(e,t){super(e),this.response=t}},ma=class extends Oi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Di.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(es[e]!==void 0){es[e].push({onLoad:t,onProgress:n,onError:s});return}es[e]=[],es[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&We("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=es[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,y=0,g=new ReadableStream({start(m){x();function x(){u.read().then(({done:M,value:_})=>{if(M)m.close();else{y+=_.byteLength;let E=new ProgressEvent("progress",{lengthComputable:p,loaded:y,total:f});for(let A=0,b=h.length;A<b;A++){let S=h[A];S.onProgress&&S.onProgress(E)}m.enqueue(_),x()}},M=>{m.error(M)})}}});return new Response(g)}else throw new Wu(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(p=>f.decode(p))}}}).then(l=>{Di.add(`file:${e}`,l);let h=es[e];delete es[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let h=es[e];if(h===void 0)throw this.manager.itemError(e),l;delete es[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var $r=new WeakMap,Pc=class extends Oi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Di.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=$r.get(a);u===void 0&&(u=[],$r.set(a,u)),u.push({onLoad:t,onError:s})}return a}let o=ra("img");function c(){h(),t&&t(this);let u=$r.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}$r.delete(this),r.manager.itemEnd(e)}function l(u){h(),s&&s(u),Di.remove(`image:${e}`);let d=$r.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(u)}$r.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Di.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}};var fr=class extends Oi{constructor(e){super(e)}load(e,t,n,s){let r=new Qt,a=new Pc(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},pr=class extends Ot{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ko=class extends pr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Fu=new st,lm=new z,cm=new z,ga=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.mapType=qn,this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Rs,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;lm.setFromMatrixPosition(e.matrixWorld),t.position.copy(lm),cm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(cm),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Fu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Fu,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===sa||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(Fu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},$l=new z,Ql=new Zt,Ii=new z,Uo=class extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=ri,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose($l,Ql,Ii),Ii.x===1&&Ii.y===1&&Ii.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($l,Ql,Ii.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose($l,Ql,Ii),Ii.x===1&&Ii.y===1&&Ii.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($l,Ql,Ii.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ts=new z,hm=new he,um=new he,rn=class extends Uo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=rr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(no*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return rr*2*Math.atan(Math.tan(no*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ts.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ts.x,Ts.y).multiplyScalar(-e/Ts.z),Ts.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ts.x,Ts.y).multiplyScalar(-e/Ts.z)}getViewSize(e,t){return this.getViewBounds(e,hm,um),t.subVectors(um,hm)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(no*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},qu=class extends ga{constructor(){super(new rn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=rr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Oo=class extends pr{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new qu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Xu=class extends ga{constructor(){super(new rn(90,1,.5,500)),this.isPointLightShadow=!0}},ds=class extends pr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Xu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},mr=class extends Uo{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ju=class extends ga{constructor(){super(new mr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},gr=class extends pr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new ju}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var fs=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var ku=new WeakMap,Bo=class extends Oi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&We("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&We("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Di.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{ku.has(a)===!0?(s&&s(ku.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Di.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),ku.set(c,l),Di.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Di.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Qr=-90,ea=1,ba=class extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new rn(Qr,ea,e,t);s.layers=this.layers,this.add(s);let r=new rn(Qr,ea,e,t);r.layers=this.layers,this.add(r);let a=new rn(Qr,ea,e,t);a.layers=this.layers,this.add(a);let o=new rn(Qr,ea,e,t);o.layers=this.layers,this.add(o);let c=new rn(Qr,ea,e,t);c.layers=this.layers,this.add(c);let l=new rn(Qr,ea,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===ri)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===sa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.mipmapsAutoUpdate=y,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ic=class extends rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}};var Lc=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,s=this.valueSize,r=e*s+s,a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=t}else{a+=t;let o=t/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let c=t*this._origIndex;this._mixBufferRegion(n,s,c,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*t,1,t);for(let c=t,l=t+t;c!==l;++c)if(n[c]!==n[c+t]){o.setValue(n,s);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,s=n*this._origIndex;e.getValue(t,s);for(let r=n,a=s;r!==a;++r)t[r]=t[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,s){Zt.slerpFlat(e,t,e,t,e,n,s)}_slerpAdditive(e,t,n,s,r){let a=this._workIndex*r;Zt.multiplyQuaternionsFlat(e,a,e,t,e,n),Zt.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,n,s,r){let a=1-s;for(let o=0;o!==r;++o){let c=t+o;e[c]=e[c]*a+e[n+o]*s}}_lerpAdditive(e,t,n,s,r){for(let a=0;a!==r;++a){let o=t+a;e[o]=e[o]+e[n+a]*s}}},Rd="\\[\\]\\.:\\/",ax=new RegExp("["+Rd+"]","g"),Cd="[^"+Rd+"]",ox="[^"+Rd.replace("\\.","")+"]",lx=/((?:WC+[\/:])*)/.source.replace("WC",Cd),cx=/(WCOD+)?/.source.replace("WCOD",ox),hx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Cd),ux=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Cd),dx=new RegExp("^"+lx+cx+hx+ux+"$"),fx=["material","materials","bones","map"],Ku=class{constructor(e,t,n){let s=n||Dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Dt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ax,"")}static parseTrackName(e){let t=dx.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);fx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){We("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){it("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){it("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){it("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){it("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){it("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){it("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){it("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;it("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){it("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){it("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Dt.Composite=Ku;Dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Dt.prototype.GetterByBindingType=[Dt.prototype._getValue_direct,Dt.prototype._getValue_array,Dt.prototype._getValue_arrayElement,Dt.prototype._getValue_toArray];Dt.prototype.SetterByBindingTypeAndVersioning=[[Dt.prototype._setValue_direct,Dt.prototype._setValue_direct_setNeedsUpdate,Dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Dt.prototype._setValue_array,Dt.prototype._setValue_array_setNeedsUpdate,Dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Dt.prototype._setValue_arrayElement,Dt.prototype._setValue_arrayElement_setNeedsUpdate,Dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Dt.prototype._setValue_fromArray,Dt.prototype._setValue_fromArray_setNeedsUpdate,Dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Dc=class{constructor(e,t,n=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=s;let r=t.tracks,a=r.length,o=new Array(a),c={endingStart:er,endingEnd:er};for(let l=0;l!==a;++l){let h=r[l].createInterpolant(null);o[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=vh,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let s=this._mixer,r=s.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);let c=o.parameterPositions,l=o.sampleValues;return c[0]=r,c[1]=r+n,l[0]=e/a,l[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,s){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let c=(e-r)*n;c<0||n===0?t=0:(this._startTime=null,t=n*c)}t*=this._updateTimeScale(e);let a=this._updateTime(t),o=this._updateWeight(e);if(o>0){let c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Um:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(a),l[h].accumulateAdditive(o);break;case Mh:default:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(a),l[h].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,s=this.time+e,r=this._loopCount,a=n===km;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(n===Ko){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){let o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);let c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(c===1){let l=e<0;this._setEndings(l,!l,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,n){let s=this._interpolantSettings;n?(s.endingStart=tr,s.endingEnd=tr):(e?s.endingStart=this.zeroSlopeAtStart?tr:er:s.endingStart=ao,t?s.endingEnd=this.zeroSlopeAtEnd?tr:er:s.endingEnd=ao)}_scheduleFading(e,t,n){let s=this._mixer,r=s.time,a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,c=a.sampleValues;return o[0]=r,c[0]=t,o[1]=r+e,c[1]=n,this}},px=new Float32Array(1),xa=class extends wi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,c=n.uuid,l=this._bindingsByRootAndName,h=l[c];h===void 0&&(h={},l[c]=h);for(let u=0;u!==r;++u){let d=s[u],f=d.name,p=h[f];if(p!==void 0)++p.referenceCount,a[u]=p;else{if(p=a[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,c,f));continue}let y=t&&t._propertyBindings[u].binding.parsedPath;p=new Lc(Dt.create(n,f,y),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,c,f),a[u]=p}o[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,n)}let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let s=this._actions,r=this._actionsByClip,a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{let o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],s=e._cacheIndex;n._cacheIndex=s,t[s]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,a=this._actionsByClip,o=a[r],c=o.knownActions,l=c[c.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),e._byClipCacheIndex=null;let u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],c.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let s=this._bindingsByRootAndName,r=this._bindings,a=s[t];a===void 0&&(a={},s[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],c=t[t.length-1],l=e._cacheIndex;c._cacheIndex=l,t[l]=c,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new No(new Float32Array(2),new Float32Array(2),1,px),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let s=t||this._root,r=s.uuid,a=typeof e=="string"?dr.findByName(s,e):e,o=a!==null?a.uuid:e,c=this._actionsByClip[o],l=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Mh),c!==void 0){let u=c.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;l=c.knownActions[0],a===null&&(a=l._clip)}if(a===null)return null;let h=new Dc(this,a,t,n);return this._bindAction(h,l),this._addInactiveAction(h,o,r),h}existingAction(e,t){let n=t||this._root,s=n.uuid,r=typeof e=="string"?dr.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let l=0;l!==n;++l)t[l]._update(s,e,r,a);let o=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)o[l].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){let a=r.knownActions;for(let o=0,c=a.length;o!==c;++o){let l=a[o];this._deactivateAction(l);let h=l._cacheIndex,u=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(l)}delete s[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let a in n){let o=n[a].actionByRoot,c=o[t];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}let s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(let a in r){let o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Fd=class Fd{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Fd.prototype.isMatrix2=!0;var Ju=Fd;function Pd(i,e,t,n){let s=mx(n);switch(t){case fd:return i*e;case Hc:return i*e/s.components*s.byteLength;case Gc:return i*e/s.components*s.byteLength;case Ds:return i*e*2/s.components*s.byteLength;case Vc:return i*e*2/s.components*s.byteLength;case pd:return i*e*3/s.components*s.byteLength;case hi:return i*e*4/s.components*s.byteLength;case Wc:return i*e*4/s.components*s.byteLength;case Go:case Vo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Wo:case qo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xc:case Kc:return Math.max(i,16)*Math.max(e,8)/4;case qc:case jc:return Math.max(i,8)*Math.max(e,8)/2;case Jc:case Yc:case $c:case Qc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Zc:case Xo:case eh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case th:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nh:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ih:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case sh:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case rh:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ah:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case oh:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case lh:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ch:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case hh:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case uh:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case dh:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case fh:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ph:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case mh:case gh:case bh:return Math.ceil(i/4)*Math.ceil(e/4)*16;case xh:case yh:return Math.ceil(i/4)*Math.ceil(e/4)*8;case jo:case _h:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mx(i){switch(i){case qn:case cd:return{byteLength:1,components:1};case wa:case hd:case Ei:return{byteLength:2,components:1};case Bc:case zc:return{byteLength:2,components:4};case Ti:case Oc:case ti:return{byteLength:4,components:1};case ud:case dd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?We("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function E0(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function bx(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){let p=u[d],y=u[f];y.start<=p.start+p.count+1?p.count=Math.max(p.count,y.start+y.count-p.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){let y=u[f];i.bufferSubData(l,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var xx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yx=`#ifdef USE_ALPHAHASH
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
#endif`,_x=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wx=`#ifdef USE_AOMAP
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
#endif`,Tx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ex=`#ifdef USE_BATCHING
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
#endif`,Ax=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Px=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ix=`#ifdef USE_IRIDESCENCE
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
#endif`,Lx=`#ifdef USE_BUMPMAP
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
#endif`,Dx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Nx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,kx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ux=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ox=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Bx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Hx=`#define PI 3.141592653589793
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
} // validated`,Gx=`vec3 transformedNormal = objectNormal;
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
#endif`,Vx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jx=`#ifdef USE_ENVMAP
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
#endif`,Yx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Zx=`#ifdef USE_ENVMAP
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
#endif`,$x=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qx=`#ifdef USE_ENVMAP
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
#endif`,ey=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ty=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ny=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,iy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sy=`#ifdef USE_GRADIENTMAP
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
}`,ry=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ay=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,oy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ly=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,cy=`#ifdef USE_ENVMAP
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
#endif`,hy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,uy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,py=`PhysicalMaterial material;
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
#endif`,my=`uniform sampler2D dfgLUT;
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
}`,gy=`
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
#endif`,by=`#if defined( RE_IndirectDiffuse )
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
#endif`,xy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yy=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,_y=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,My=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ty=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ey=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ay=`#if defined( USE_POINTS_UV )
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
#endif`,Ry=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Py=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Iy=`#if defined( USE_MORPHCOLORS )
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
#endif`,Ly=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dy=`#ifdef USE_MORPHTARGETS
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
#endif`,Ny=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ky=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Uy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Oy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,By=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,zy=`#ifdef USE_NORMALMAP
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
#endif`,Hy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Vy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xy=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,jy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ky=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$y=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qy=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,e_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,t_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,n_=`float getShadowMask() {
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
}`,i_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,s_=`#ifdef USE_SKINNING
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
#endif`,r_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,a_=`#ifdef USE_SKINNING
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
#endif`,o_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,l_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,c_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,h_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,u_=`#ifdef USE_TRANSMISSION
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
#endif`,d_=`#ifdef USE_TRANSMISSION
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
#endif`,f_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,p_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,m_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,b_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,x_=`uniform sampler2D t2D;
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
}`,y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,__=`uniform float backgroundBlurriness;
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
}`,v_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,M_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,S_=`#include <common>
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
}`,w_=`#if DEPTH_PACKING == 3200
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
}`,T_=`#define DISTANCE
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
}`,E_=`#define DISTANCE
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
}`,A_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,R_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C_=`uniform float scale;
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
}`,P_=`uniform vec3 diffuse;
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
}`,I_=`#include <common>
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
}`,L_=`uniform vec3 diffuse;
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
}`,D_=`#define LAMBERT
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
}`,N_=`#define LAMBERT
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
}`,F_=`#define MATCAP
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
}`,k_=`#define MATCAP
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
}`,U_=`#define NORMAL
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
}`,O_=`#define NORMAL
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
}`,B_=`#define PHONG
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
}`,z_=`#define PHONG
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
}`,H_=`#define STANDARD
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
}`,G_=`#define STANDARD
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
}`,V_=`#define TOON
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
}`,W_=`#define TOON
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
}`,q_=`uniform float size;
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
}`,X_=`uniform vec3 diffuse;
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
}`,j_=`#include <common>
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
}`,K_=`uniform vec3 color;
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
}`,J_=`uniform float rotation;
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
}`,Y_=`uniform vec3 diffuse;
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
}`,bt={alphahash_fragment:xx,alphahash_pars_fragment:yx,alphamap_fragment:_x,alphamap_pars_fragment:vx,alphatest_fragment:Mx,alphatest_pars_fragment:Sx,aomap_fragment:wx,aomap_pars_fragment:Tx,batching_pars_vertex:Ex,batching_vertex:Ax,begin_vertex:Rx,beginnormal_vertex:Cx,bsdfs:Px,iridescence_fragment:Ix,bumpmap_pars_fragment:Lx,clipping_planes_fragment:Dx,clipping_planes_pars_fragment:Nx,clipping_planes_pars_vertex:Fx,clipping_planes_vertex:kx,color_fragment:Ux,color_pars_fragment:Ox,color_pars_vertex:Bx,color_vertex:zx,common:Hx,defaultnormal_vertex:Gx,displacementmap_pars_vertex:Vx,displacementmap_vertex:Wx,emissivemap_fragment:qx,emissivemap_pars_fragment:Xx,colorspace_fragment:jx,colorspace_pars_fragment:Kx,envmap_fragment:Jx,envmap_common_pars_fragment:Yx,envmap_pars_fragment:Zx,envmap_pars_vertex:$x,envmap_physical_pars_fragment:cy,envmap_vertex:Qx,fog_vertex:ey,fog_pars_vertex:ty,fog_fragment:ny,fog_pars_fragment:iy,gradientmap_pars_fragment:sy,lightmap_pars_fragment:ry,lights_lambert_fragment:ay,lights_lambert_pars_fragment:oy,lights_pars_begin:ly,lights_toon_fragment:hy,lights_toon_pars_fragment:uy,lights_phong_fragment:dy,lights_phong_pars_fragment:fy,lights_physical_fragment:py,lights_physical_pars_fragment:my,lights_fragment_begin:gy,lights_fragment_maps:by,lights_fragment_end:xy,lightprobes_pars_fragment:yy,logdepthbuf_fragment:_y,logdepthbuf_pars_fragment:vy,logdepthbuf_pars_vertex:My,logdepthbuf_vertex:Sy,map_fragment:wy,map_pars_fragment:Ty,map_particle_fragment:Ey,map_particle_pars_fragment:Ay,metalnessmap_fragment:Ry,metalnessmap_pars_fragment:Cy,morphinstance_vertex:Py,morphcolor_vertex:Iy,morphnormal_vertex:Ly,morphtarget_pars_vertex:Dy,morphtarget_vertex:Ny,normal_fragment_begin:Fy,normal_fragment_maps:ky,normal_pars_fragment:Uy,normal_pars_vertex:Oy,normal_vertex:By,normalmap_pars_fragment:zy,clearcoat_normal_fragment_begin:Hy,clearcoat_normal_fragment_maps:Gy,clearcoat_pars_fragment:Vy,iridescence_pars_fragment:Wy,opaque_fragment:qy,packing:Xy,premultiplied_alpha_fragment:jy,project_vertex:Ky,dithering_fragment:Jy,dithering_pars_fragment:Yy,roughnessmap_fragment:Zy,roughnessmap_pars_fragment:$y,shadowmap_pars_fragment:Qy,shadowmap_pars_vertex:e_,shadowmap_vertex:t_,shadowmask_pars_fragment:n_,skinbase_vertex:i_,skinning_pars_vertex:s_,skinning_vertex:r_,skinnormal_vertex:a_,specularmap_fragment:o_,specularmap_pars_fragment:l_,tonemapping_fragment:c_,tonemapping_pars_fragment:h_,transmission_fragment:u_,transmission_pars_fragment:d_,uv_pars_fragment:f_,uv_pars_vertex:p_,uv_vertex:m_,worldpos_vertex:g_,background_vert:b_,background_frag:x_,backgroundCube_vert:y_,backgroundCube_frag:__,cube_vert:v_,cube_frag:M_,depth_vert:S_,depth_frag:w_,distance_vert:T_,distance_frag:E_,equirect_vert:A_,equirect_frag:R_,linedashed_vert:C_,linedashed_frag:P_,meshbasic_vert:I_,meshbasic_frag:L_,meshlambert_vert:D_,meshlambert_frag:N_,meshmatcap_vert:F_,meshmatcap_frag:k_,meshnormal_vert:U_,meshnormal_frag:O_,meshphong_vert:B_,meshphong_frag:z_,meshphysical_vert:H_,meshphysical_frag:G_,meshtoon_vert:V_,meshtoon_frag:W_,points_vert:q_,points_frag:X_,shadow_vert:j_,shadow_frag:K_,sprite_vert:J_,sprite_frag:Y_},De={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ot}},envmap:{envMap:{value:null},envMapRotation:{value:new ot},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ot},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0},uvTransform:{value:new ot}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}}},Gi={basic:{uniforms:In([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.fog]),vertexShader:bt.meshbasic_vert,fragmentShader:bt.meshbasic_frag},lambert:{uniforms:In([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:bt.meshlambert_vert,fragmentShader:bt.meshlambert_frag},phong:{uniforms:In([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:bt.meshphong_vert,fragmentShader:bt.meshphong_frag},standard:{uniforms:In([De.common,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.roughnessmap,De.metalnessmap,De.fog,De.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:bt.meshphysical_vert,fragmentShader:bt.meshphysical_frag},toon:{uniforms:In([De.common,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.gradientmap,De.fog,De.lights,{emissive:{value:new qe(0)}}]),vertexShader:bt.meshtoon_vert,fragmentShader:bt.meshtoon_frag},matcap:{uniforms:In([De.common,De.bumpmap,De.normalmap,De.displacementmap,De.fog,{matcap:{value:null}}]),vertexShader:bt.meshmatcap_vert,fragmentShader:bt.meshmatcap_frag},points:{uniforms:In([De.points,De.fog]),vertexShader:bt.points_vert,fragmentShader:bt.points_frag},dashed:{uniforms:In([De.common,De.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:bt.linedashed_vert,fragmentShader:bt.linedashed_frag},depth:{uniforms:In([De.common,De.displacementmap]),vertexShader:bt.depth_vert,fragmentShader:bt.depth_frag},normal:{uniforms:In([De.common,De.bumpmap,De.normalmap,De.displacementmap,{opacity:{value:1}}]),vertexShader:bt.meshnormal_vert,fragmentShader:bt.meshnormal_frag},sprite:{uniforms:In([De.sprite,De.fog]),vertexShader:bt.sprite_vert,fragmentShader:bt.sprite_frag},background:{uniforms:{uvTransform:{value:new ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:bt.background_vert,fragmentShader:bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ot}},vertexShader:bt.backgroundCube_vert,fragmentShader:bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:bt.cube_vert,fragmentShader:bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:bt.equirect_vert,fragmentShader:bt.equirect_frag},distance:{uniforms:In([De.common,De.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:bt.distance_vert,fragmentShader:bt.distance_frag},shadow:{uniforms:In([De.lights,De.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:bt.shadow_vert,fragmentShader:bt.shadow_frag}};Gi.physical={uniforms:In([Gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ot},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ot},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new ot},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ot},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ot},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ot},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ot},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ot}}]),vertexShader:bt.meshphysical_vert,fragmentShader:bt.meshphysical_frag};var Eh={r:0,b:0,g:0},Z_=new st,A0=new ot;A0.set(-1,0,0,0,1,0,0,0,1);function $_(i,e,t,n,s,r){let a=new qe(0),o=s===!0?0:1,c,l,h=null,u=0,d=null;function f(x){let M=x.isScene===!0?x.background:null;if(M&&M.isTexture){let _=x.backgroundBlurriness>0;M=e.get(M,_)}return M}function p(x){let M=!1,_=f(x);_===null?g(a,o):_&&_.isColor&&(g(_,1),M=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(x,M){let _=f(M);_&&_.isCubeTexture?(l===void 0&&(l=new ht(new Qe(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:Mr(Gi.backgroundCube.uniforms),vertexShader:Gi.backgroundCube.vertexShader,fragmentShader:Gi.backgroundCube.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,A,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=_,l.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Z_.makeRotationFromEuler(M.backgroundRotation)).transpose(),_.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(A0),l.material.toneMapped=yt.getTransfer(_.colorSpace)!==Ct,(h!==_||u!==_.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=_,u=_.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new ht(new Mt(2,2),new ki({name:"BackgroundMaterial",uniforms:Mr(Gi.background.uniforms),vertexShader:Gi.background.vertexShader,fragmentShader:Gi.background.fragmentShader,side:Bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=yt.getTransfer(_.colorSpace)!==Ct,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||u!==_.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=_,u=_.version,d=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function g(x,M){x.getRGB(Eh,Ad(i)),t.buffers.color.setClear(Eh.r,Eh.g,Eh.b,M,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,M=1){a.set(x),o=M,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,g(a,o)},render:p,addToRenderList:y,dispose:m}}function Q_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(k,V,X,R,I){let U=!1,O=u(k,R,X,V);r!==O&&(r=O,l(r.object)),U=f(k,R,X,I),U&&p(k,R,X,I),I!==null&&e.update(I,i.ELEMENT_ARRAY_BUFFER),(U||a)&&(a=!1,_(k,V,X,R),I!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function c(){return i.createVertexArray()}function l(k){return i.bindVertexArray(k)}function h(k){return i.deleteVertexArray(k)}function u(k,V,X,R){let I=R.wireframe===!0,U=n[V.id];U===void 0&&(U={},n[V.id]=U);let O=k.isInstancedMesh===!0?k.id:0,W=U[O];W===void 0&&(W={},U[O]=W);let D=W[X.id];D===void 0&&(D={},W[X.id]=D);let G=D[I];return G===void 0&&(G=d(c()),D[I]=G),G}function d(k){let V=[],X=[],R=[];for(let I=0;I<t;I++)V[I]=0,X[I]=0,R[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:X,attributeDivisors:R,object:k,attributes:{},index:null}}function f(k,V,X,R){let I=r.attributes,U=V.attributes,O=0,W=X.getAttributes();for(let D in W)if(W[D].location>=0){let q=I[D],le=U[D];if(le===void 0&&(D==="instanceMatrix"&&k.instanceMatrix&&(le=k.instanceMatrix),D==="instanceColor"&&k.instanceColor&&(le=k.instanceColor)),q===void 0||q.attribute!==le||le&&q.data!==le.data)return!0;O++}return r.attributesNum!==O||r.index!==R}function p(k,V,X,R){let I={},U=V.attributes,O=0,W=X.getAttributes();for(let D in W)if(W[D].location>=0){let q=U[D];q===void 0&&(D==="instanceMatrix"&&k.instanceMatrix&&(q=k.instanceMatrix),D==="instanceColor"&&k.instanceColor&&(q=k.instanceColor));let le={};le.attribute=q,q&&q.data&&(le.data=q.data),I[D]=le,O++}r.attributes=I,r.attributesNum=O,r.index=R}function y(){let k=r.newAttributes;for(let V=0,X=k.length;V<X;V++)k[V]=0}function g(k){m(k,0)}function m(k,V){let X=r.newAttributes,R=r.enabledAttributes,I=r.attributeDivisors;X[k]=1,R[k]===0&&(i.enableVertexAttribArray(k),R[k]=1),I[k]!==V&&(i.vertexAttribDivisor(k,V),I[k]=V)}function x(){let k=r.newAttributes,V=r.enabledAttributes;for(let X=0,R=V.length;X<R;X++)V[X]!==k[X]&&(i.disableVertexAttribArray(X),V[X]=0)}function M(k,V,X,R,I,U,O){O===!0?i.vertexAttribIPointer(k,V,X,I,U):i.vertexAttribPointer(k,V,X,R,I,U)}function _(k,V,X,R){y();let I=R.attributes,U=X.getAttributes(),O=V.defaultAttributeValues;for(let W in U){let D=U[W];if(D.location>=0){let G=I[W];if(G===void 0&&(W==="instanceMatrix"&&k.instanceMatrix&&(G=k.instanceMatrix),W==="instanceColor"&&k.instanceColor&&(G=k.instanceColor)),G!==void 0){let q=G.normalized,le=G.itemSize,Pe=e.get(G);if(Pe===void 0)continue;let Z=Pe.buffer,de=Pe.type,Ie=Pe.bytesPerElement,Xe=de===i.INT||de===i.UNSIGNED_INT||G.gpuType===Oc;if(G.isInterleavedBufferAttribute){let Me=G.data,je=Me.isInterleavedBuffer===!0?Me.stride:Me.itemSize,Rt=G.offset;if(Me.isInstancedInterleavedBuffer||Me.isInstancedBufferAttribute){for(let Ze=0;Ze<D.locationSize;Ze++)m(D.location+Ze,Me.meshPerAttribute);k.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=Me.meshPerAttribute*Me.count)}else for(let Ze=0;Ze<D.locationSize;Ze++)g(D.location+Ze);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let Ze=0;Ze<D.locationSize;Ze++)M(D.location+Ze,le/D.locationSize,de,q,je*Ie,(Rt+le/D.locationSize*Ze)*Ie,Xe)}else{if(G.isInstancedBufferAttribute){for(let Me=0;Me<D.locationSize;Me++)m(D.location+Me,G.meshPerAttribute);k.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Me=0;Me<D.locationSize;Me++)g(D.location+Me);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let Me=0;Me<D.locationSize;Me++)M(D.location+Me,le/D.locationSize,de,q,le*Ie,le/D.locationSize*Me*Ie,Xe)}}else if(O!==void 0){let q=O[W];if(q!==void 0)switch(q.length){case 2:i.vertexAttrib2fv(D.location,q);break;case 3:i.vertexAttrib3fv(D.location,q);break;case 4:i.vertexAttrib4fv(D.location,q);break;default:i.vertexAttrib1fv(D.location,q)}}}}x()}function E(){L();for(let k in n){let V=n[k];for(let X in V){let R=V[X];for(let I in R){let U=R[I];for(let O in U)h(U[O].object),delete U[O];delete R[I]}}delete n[k]}}function A(k){if(n[k.id]===void 0)return;let V=n[k.id];for(let X in V){let R=V[X];for(let I in R){let U=R[I];for(let O in U)h(U[O].object),delete U[O];delete R[I]}}delete n[k.id]}function b(k){for(let V in n){let X=n[V];for(let R in X){let I=X[R];if(I[k.id]===void 0)continue;let U=I[k.id];for(let O in U)h(U[O].object),delete U[O];delete I[k.id]}}}function S(k){for(let V in n){let X=n[V],R=k.isInstancedMesh===!0?k.id:0,I=X[R];if(I!==void 0){for(let U in I){let O=I[U];for(let W in O)h(O[W].object),delete O[W];delete I[U]}delete X[R],Object.keys(X).length===0&&delete n[V]}}}function L(){P(),a=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:P,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfObject:S,releaseStatesOfProgram:b,initAttributes:y,enableAttribute:g,disableUnusedAttributes:x}}function ev(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let d=0;for(let f=0;f<h;f++)d+=l[f];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function tv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let b=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(b){return!(b!==hi&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(b){let S=b===Ei&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(b!==qn&&b!==ti&&!S&&n.convert(b)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(b){if(b==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(We("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&u===!1;t.reversedDepthBuffer===!0&&u===!1&&We("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&u===!0&&We("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),A=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:y,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:_,maxSamples:E,samples:A}}function nv(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Si,o=new ot,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let p=u.clippingPlanes,y=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):l();else{let x=r?0:n,M=x*4,_=m.clippingState||null;c.value=_,_=h(p,d,M,f);for(let E=0;E!==M;++E)_[E]=t[E];m.clippingState=_,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){let y=u!==null?u.length:0,g=null;if(y!==0){if(g=c.value,p!==!0||g===null){let m=f+y*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,_=f;M!==y;++M,_+=4)a.copy(u[M]).applyMatrix4(x,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}var $o=class extends $n{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new vo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Qe(5,5,5),r=new ki({name:"CubemapFromEquirect",uniforms:Mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:_n,blending:br});r.uniforms.tEquirect.value=t;let a=new ht(s,r),o=t.minFilter;return t.minFilter===ci&&(t.minFilter=an),new ba(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},r0=256,iv=3,sv=20,R0=256,C0=16,rv=3,av=new z,ov=new qe,Rh=class i{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ba(1,10,null),this._boxMesh=new ht(new Qe(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=av}=r,c=this._renderer;this._setSize(a);let l=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);let u=c.autoClear,d=c.autoClearColor,f=c.autoClearDepth,p=c.autoClearStencil,y=e.background;c.autoClear=!0,c.autoClearColor=!0,c.autoClearDepth=!0,c.autoClearStencil=!0,y===null&&(e.background=c.getClearColor(ov));let g=new ba(n,s,h);return g.position.copy(o),g.update(c,e),c.autoClear=u,c.autoClearColor=d,c.autoClearDepth=f,c.autoClearStencil=p,e.background=y,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(l,t)),this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=l0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=o0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(r0,Sd(e))}_fromTexture(e,t){e.mapping===yr||e.mapping===Ma?this._setSize(e.image.length===0?r0:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=a0(e,!1,!1),n=Math.log2(e)-iv;for(let s=0;s<=n;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=a0(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=e,r.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===yr||e.mapping===Ma?(this._cubemapMaterial===null&&(this._cubemapMaterial=l0()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=o0()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=lv(),this._integrationMaterial=cv());let t=this._cubeSize,n=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/C0);for(let a=0;a<=n;a++){let o=i.lodToRoughness(a,n);if(a>n-rv)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{let c=o>0?Math.log2(t)+.5*Math.log2(6/(R0*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=c,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=hv());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,n),s.envMap.value=e.texture,this._renderCube(r,0,n)}};function a0(i,e,t){return new $o(i,{minFilter:ci,generateMipmaps:e,type:Ei,colorSpace:Un,depthBuffer:t})}function Qo(i,e,t){return new ki({name:i,uniforms:e,vertexShader:bt.cube_vert,fragmentShader:t,side:_n,blending:br,depthTest:!1,depthWrite:!1})}function lv(){return Qo("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${R0}u

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
	`)}function cv(){return Qo("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:C0}},`

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
	`)}function hv(){return Qo("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${sv}
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
	`)}function o0(){return Qo("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function l0(){return Qo("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function uv(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===Fc||f===kc)if(e.has(d)){let p=e.get(d).texture;return o(p,d.mapping)}else{let p=d.image;if(p&&p.height>0){let y=new $o(p.height);return y.fromEquirectangularTexture(i,d),e.set(d,y),d.addEventListener("dispose",l),o(y.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,p=f===Fc||f===kc,y=f===yr||f===Ma;if(p||y){let g=t.get(d),m=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new Rh(i)),g=p?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let x=d.image;return p&&x&&x.height>0||y&&x&&c(x)?(n===null&&(n=new Rh(i)),g=p?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===Fc?d.mapping=yr:f===kc&&(d.mapping=Ma),d}function c(d){let f=0,p=6;for(let y=0;y<p;y++)d[y]!==void 0&&f++;return f===p}function l(d){let f=d.target;f.removeEventListener("dispose",l);let p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function dv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&nr("WebGLRenderer: "+n+" extension not supported."),s}}}function fv(i,e,t,n){let s={},r=new WeakMap,a=new FinalizationRegistry(p=>delete s[p]);function o(p){c(p.target)}function c(p){p.index!==null&&e.remove(p.index);for(let g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",o),delete s[p.id],a.unregister(p);let y=r.get(p);y&&(e.remove(y),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function l(p,y){return s[y.id]!==void 0||(y.addEventListener("dispose",o),s[y.id]=new WeakRef(y),a.register(y,y.id,y),t.memory.geometries++),y}function h(p){let y=p.attributes;for(let g in y)e.update(y[g],i.ARRAY_BUFFER)}function u(p){let y=p.index,g=p.attributes.position,m=0;if(g===void 0)return;let x=y!==null?y.array.length:g.array.length/3-1,M=g.count>=65535?mo:po,_=new M(Math.ceil(x/3)*6,1),E=_.array;if(y!==null){let b=y.array;m=y.version;for(let S=0,L=0;S<x;S+=3){let P=b[S+0],k=b[S+1],V=b[S+2];E[L++]=P,E[L++]=k,E[L++]=k,E[L++]=V,E[L++]=V,E[L++]=P}}else{m=g.version;for(let b=0,S=0;b<x;b+=3){let L=b+0,P=b+1,k=b+2;E[S++]=L,E[S++]=P,E[S++]=P,E[S++]=k,E[S++]=k,E[S++]=L}}_.version=m;let A=r.get(p);A&&e.remove(A),r.set(p,_)}function d(p){let y=r.get(p);if(y){let g=p.index;g!==null&&y.version<g.version&&u(p)}else u(p);return r.get(p)}function f(){for(let p in s){let y=s[p].deref();y!==void 0&&c(y)}}return{get:l,update:h,getWireframeAttribute:d,dispose:f}}function pv(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,d){i.drawElements(n,d,r,u*a),t.update(d,n,1)}function l(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let y=0;for(let g=0;g<f;g++)y+=d[g];t.update(y,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function mv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:it("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function gv(i,e,t){let n=new WeakMap,s=new It;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let L=function(){b.dispose(),n.delete(o),o.removeEventListener("dispose",L)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],M=0;f===!0&&(M=1),p===!0&&(M=2),y===!0&&(M=3);let _=o.attributes.position.count*M,E=1;_>e.maxTextureSize&&(E=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let A=new Float32Array(_*E*4*u),b=new co(A,_,E,u);b.type=ti,b.needsUpdate=!0;let S=M*4;for(let P=0;P<u;P++){let k=g[P],V=m[P],X=x[P],R=_*E*4*P;for(let I=0;I<k.count;I++){let U=I*S;f===!0&&(s.fromBufferAttribute(k,I),A[R+U+0]=s.x,A[R+U+1]=s.y,A[R+U+2]=s.z,A[R+U+3]=0),p===!0&&(s.fromBufferAttribute(V,I),A[R+U+4]=s.x,A[R+U+5]=s.y,A[R+U+6]=s.z,A[R+U+7]=0),y===!0&&(s.fromBufferAttribute(X,I),A[R+U+8]=s.x,A[R+U+9]=s.y,A[R+U+10]=s.z,A[R+U+11]=X.itemSize===4?s.w:1)}}d={count:u,texture:b,size:new he(_,E)},n.set(o,d),o.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let y=0;y<l.length;y++)f+=l[y];let p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",p),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function bv(i,e,t,n,s){let r=new WeakMap;function a(l){let h=s.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){let f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function c(l){let h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var xv={[nd]:"LINEAR_TONE_MAPPING",[id]:"REINHARD_TONE_MAPPING",[sd]:"CINEON_TONE_MAPPING",[Ho]:"ACES_FILMIC_TONE_MAPPING",[ad]:"AGX_TONE_MAPPING",[od]:"NEUTRAL_TONE_MAPPING",[rd]:"CUSTOM_TONE_MAPPING"};function yv(i,e,t,n,s,r){let a=new $n(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=null,h=new Ft;h.setAttribute("position",new dt([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new dt([0,2,0,0,2,0],2));let u=new Mc({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new ht(h,u),f=new mr(-1,1,1,-1,0,1),p=null,y=null,g=!1,m,x=null,M=[],_=!1;this.setSize=function(E,A){a.setSize(E,A),o!==null&&o.setSize(E,A),c!==null&&c.setSize(E,A);for(let b=0;b<M.length;b++){let S=M[b];S.setSize&&S.setSize(E,A)}},this.setEffects=function(E){M=E,_=M.length>0&&M[0].isRenderPass===!0;let A=a.width,b=a.height;M.length>0&&o===null&&(o=new $n(A,b,{type:Ei,depthBuffer:!1,stencilBuffer:!1}),c=new $n(A,b,{type:Ei,depthBuffer:!1,stencilBuffer:!1}));let S=s===!0&&M.some(L=>L.needsDepthTexture===!0);S!==(a.depthTexture!==null)&&(S===!0&&l===null&&(l=new as(A,b),r===!0&&(l.format=ps,l.type=vr)),a.dispose(),a.depthTexture=S?l:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S);for(let L=0;L<M.length;L++){let P=M[L];P.setSize&&P.setSize(A,b),S&&P.needsDepthTexture===!0&&P.setDepthTexture&&P.setDepthTexture(l)}},this.begin=function(E,A){if(g||E.toneMapping===zi&&M.length===0)return!1;if(x=A,A!==null){let b=A.width,S=A.height;(a.width!==b||a.height!==S)&&this.setSize(b,S)}return _===!1&&E.setRenderTarget(a),m=E.toneMapping,E.toneMapping=zi,!0},this.hasRenderPass=function(){return _},this.end=function(E,A){E.toneMapping=m,g=!0;let b=a,S=o;for(let L=0;L<M.length;L++){let P=M[L];P.enabled!==!1&&(P.render(E,S,b,A),P.needsSwap!==!1&&(b=S,S=S===o?c:o))}if(p!==E.outputColorSpace||y!==E.toneMapping){p=E.outputColorSpace,y=E.toneMapping,u.defines={},yt.getTransfer(p)===Ct&&(u.defines.SRGB_TRANSFER="");let L=xv[y];L&&(u.defines[L]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=b.texture,E.setRenderTarget(x),E.render(d,f),x=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),h.dispose(),u.dispose()}}var P0=new Qt,I0=new as(1,1),L0=new Mo(1),D0=new co,N0=new uc,F0=new vo,c0=[],h0=[],u0=new Float32Array(16),d0=new Float32Array(9),f0=new Float32Array(4);function Aa(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=c0[s];if(r===void 0&&(r=new Float32Array(s),c0[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function on(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function ln(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ph(i,e){let t=h0[e];t===void 0&&(t=new Int32Array(e),h0[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function _v(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function vv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;i.uniform2fv(this.addr,e),ln(t,e)}}function Mv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(on(t,e))return;i.uniform3fv(this.addr,e),ln(t,e)}}function Sv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;i.uniform4fv(this.addr,e),ln(t,e)}}function wv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(on(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),ln(t,e)}else{if(on(t,n))return;f0.set(n),i.uniformMatrix2fv(this.addr,!1,f0),ln(t,n)}}function Tv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(on(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),ln(t,e)}else{if(on(t,n))return;d0.set(n),i.uniformMatrix3fv(this.addr,!1,d0),ln(t,n)}}function Ev(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(on(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),ln(t,e)}else{if(on(t,n))return;u0.set(n),i.uniformMatrix4fv(this.addr,!1,u0),ln(t,n)}}function Av(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Rv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;i.uniform2iv(this.addr,e),ln(t,e)}}function Cv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(on(t,e))return;i.uniform3iv(this.addr,e),ln(t,e)}}function Pv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;i.uniform4iv(this.addr,e),ln(t,e)}}function Iv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Lv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(on(t,e))return;i.uniform2uiv(this.addr,e),ln(t,e)}}function Dv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(on(t,e))return;i.uniform3uiv(this.addr,e),ln(t,e)}}function Nv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(on(t,e))return;i.uniform4uiv(this.addr,e),ln(t,e)}}function Ih(i){return i.version===0&&(i.compareFunction=xd,i.needsUpdate=!0),i}function Fv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=Ih(I0):r=P0,t.setTexture2D(e||r,s)}function kv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||N0,s)}function Uv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=Ih(L0):r=F0,t.setTextureCube(e||r,s)}function Ov(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||D0,s)}function Bv(i){switch(i){case 5126:return _v;case 35664:return vv;case 35665:return Mv;case 35666:return Sv;case 35674:return wv;case 35675:return Tv;case 35676:return Ev;case 5124:case 35670:return Av;case 35667:case 35671:return Rv;case 35668:case 35672:return Cv;case 35669:case 35673:return Pv;case 5125:return Iv;case 36294:return Lv;case 36295:return Dv;case 36296:return Nv;case 35678:case 36198:case 36298:case 36306:case 35682:return Fv;case 35679:case 36299:case 36307:return kv;case 35680:case 36300:case 36308:case 36293:return Uv;case 36289:case 36303:case 36311:case 36292:return Ov}}function zv(i,e){i.uniform1fv(this.addr,e)}function Hv(i,e){let t=Aa(e,this.size,2);i.uniform2fv(this.addr,t)}function Gv(i,e){let t=Aa(e,this.size,3);i.uniform3fv(this.addr,t)}function Vv(i,e){let t=Aa(e,this.size,4);i.uniform4fv(this.addr,t)}function Wv(i,e){let t=Aa(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function qv(i,e){let t=Aa(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Xv(i,e){let t=Aa(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function jv(i,e){i.uniform1iv(this.addr,e)}function Kv(i,e){i.uniform2iv(this.addr,e)}function Jv(i,e){i.uniform3iv(this.addr,e)}function Yv(i,e){i.uniform4iv(this.addr,e)}function Zv(i,e){i.uniform1uiv(this.addr,e)}function $v(i,e){i.uniform2uiv(this.addr,e)}function Qv(i,e){i.uniform3uiv(this.addr,e)}function eM(i,e){i.uniform4uiv(this.addr,e)}function tM(i,e,t){let n=this.cache,s=e.length,r=Ph(t,s);on(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ih(I0):a=P0;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function nM(i,e,t){let n=this.cache,s=e.length,r=Ph(t,s);on(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||N0,r[a])}function iM(i,e,t){let n=this.cache,s=e.length,r=Ph(t,s);on(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));let a;this.type===i.SAMPLER_CUBE_SHADOW?a=Ih(L0):a=F0;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function sM(i,e,t){let n=this.cache,s=e.length,r=Ph(t,s);on(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||D0,r[a])}function rM(i){switch(i){case 5126:return zv;case 35664:return Hv;case 35665:return Gv;case 35666:return Vv;case 35674:return Wv;case 35675:return qv;case 35676:return Xv;case 5124:case 35670:return jv;case 35667:case 35671:return Kv;case 35668:case 35672:return Jv;case 35669:case 35673:return Yv;case 5125:return Zv;case 36294:return $v;case 36295:return Qv;case 36296:return eM;case 35678:case 36198:case 36298:case 36306:case 35682:return tM;case 35679:case 36299:case 36307:return nM;case 35680:case 36300:case 36308:case 36293:return iM;case 36289:case 36303:case 36311:case 36292:return sM}}var Od=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Bv(t.type)}},Bd=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=rM(t.type)}},zd=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},kd=/(\w+)(\])?(\[|\.)?/g;function p0(i,e){i.seq.push(e),i.map[e.id]=e}function aM(i,e,t){let n=i.name,s=n.length;for(kd.lastIndex=0;;){let r=kd.exec(n),a=kd.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){p0(t,l===void 0?new Od(o,i,e):new Bd(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new zd(o),p0(t,u)),t=u}}}var Ea=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);aM(o,c,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function m0(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var oM=37297,lM=0;function cM(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var g0=new ot;function hM(i){yt._getMatrix(g0,yt.workingColorSpace,i);let e=`mat3( ${g0.elements.map(t=>t.toFixed(4))} )`;switch(yt.getTransfer(i)){case oo:return[e,"LinearTransferOETF"];case Ct:return[e,"sRGBTransferOETF"];default:return We("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function b0(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+cM(i.getShaderSource(e),o)}else return r}function uM(i,e){let t=hM(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var dM={[nd]:"Linear",[id]:"Reinhard",[sd]:"Cineon",[Ho]:"ACESFilmic",[ad]:"AgX",[od]:"Neutral",[rd]:"Custom"};function fM(i,e){let t=dM[e];return t===void 0?(We("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ah=new z;function pM(){yt.getLuminanceCoefficients(Ah);let i=Ah.x.toFixed(4),e=Ah.y.toFixed(4),t=Ah.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zo).join(`
`)}function gM(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function bM(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Zo(i){return i!==""}function x0(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function y0(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var xM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hd(i){return i.replace(xM,yM)}function yM(i,e){let t=bt[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Hd(t)}var _M=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _0(i){return i.replace(_M,vM)}function vM(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function v0(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var MM={[zo]:"SHADOWMAP_TYPE_PCF",[ya]:"SHADOWMAP_TYPE_VSM"};function SM(i){return MM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var wM={[Ma]:"ENVMAP_MODE_REFRACTION"};function TM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":wM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var EM={[td]:"ENVMAP_BLENDING_MULTIPLY",[Dm]:"ENVMAP_BLENDING_MIX",[Nm]:"ENVMAP_BLENDING_ADD"};function AM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":EM[i.combine]||"ENVMAP_BLENDING_NONE"}function RM(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=SM(t),l=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=TM(t),u=AM(t),d=mM(t),f=gM(r),p=s.createProgram(),y,g,m=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Zo).join(`
`),y.length>0&&(y+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Zo).join(`
`),g.length>0&&(g+=`
`)):(y=[v0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zo).join(`
`),g=[v0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==zi?"#define TONE_MAPPING":"",t.toneMapping!==zi?bt.tonemapping_pars_fragment:"",t.toneMapping!==zi?fM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",bt.colorspace_pars_fragment,uM("linearToOutputTexel",t.outputColorSpace),pM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zo).join(`
`)),a=Hd(a),a=x0(a,t),a=y0(a,t),o=Hd(o),o=x0(o,t),o=y0(o,t),a=_0(a),o=_0(o),t.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,y=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,g=["#define varying in",t.glslVersion===vd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let x=m+y+a,M=m+g+o,_=m0(s,s.VERTEX_SHADER,x),E=m0(s,s.FRAGMENT_SHADER,M);s.attachShader(p,_),s.attachShader(p,E),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function A(P){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(p)||"",V=s.getShaderInfoLog(_)||"",X=s.getShaderInfoLog(E)||"",R=k.trim(),I=V.trim(),U=X.trim(),O=!0,W=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,_,E);else{let D=b0(s,_,"vertex"),G=b0(s,E,"fragment");it("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+R+`
`+D+`
`+G)}else R!==""?We("WebGLProgram: Program Info Log:",R):(I===""||U==="")&&(W=!1);W&&(P.diagnostics={runnable:O,programLog:R,vertexShader:{log:I,prefix:y},fragmentShader:{log:U,prefix:g}})}s.deleteShader(_),s.deleteShader(E),b=new Ea(s,p),S=bM(s,p)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(p,oM)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=lM++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=_,this.fragmentShader=E,this}var CM=0,Gd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Vd(e),t.set(e,n)),n}},Vd=class{constructor(e){this.id=CM++,this.code=e,this.usedTimes=0}};function PM(i){return i===Ds||i===Xo||i===jo}function IM(i,e,t,n,s,r){let a=new ho,o=new Gd,c=new Set,l=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(b){return c.add(b),b===0?"uv":`uv${b}`}function p(b,S,L,P,k,V){let X=P.fog,R=k.geometry,I=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?P.environment:null,U=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,O=e.get(b.envMap||I,U),W=d[b.type],D=n.precision;b.precision!==null&&(D=n.getMaxPrecision(b.precision),D!==b.precision&&We("WebGLProgram.getParameters:",b.precision,"not supported, using",D,"instead."));let G=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,q=G!==void 0?G.length:0,le=0;R.morphAttributes.position!==void 0&&(le=1),R.morphAttributes.normal!==void 0&&(le=2),R.morphAttributes.color!==void 0&&(le=3);let Pe,Z,de,Ie;if(W){let Le=Gi[W];Pe=Le.vertexShader,Z=Le.fragmentShader}else{Pe=b.vertexShader,Z=b.fragmentShader;let Le=o.getVertexShaderStage(b),Pt=o.getFragmentShaderStage(b);o.update(b,Le,Pt),de=Le.id,Ie=Pt.id}let Xe=i.getRenderTarget(),Me=i.state.buffers.depth.getReversed(),je=k.isInstancedMesh===!0,Rt=k.isBatchedMesh===!0,Ze=!!b.map,lt=!!b.matcap,ft=!!O,ae=ft&&O.isPMREMTexture===!0,ge=!!b.aoMap,me=!!b.lightMap,Ne=!!b.bumpMap&&b.wireframe===!1,we=!!b.normalMap,ct=!!b.displacementMap,ke=!!b.emissiveMap,F=!!b.metalnessMap,Q=!!b.roughnessMap,ce=b.anisotropy>0,N=b.clearcoat>0,Ke=b.diffuseRoughness>0,Be=b.dispersion>0,xt=b.retroreflectivity>0,be=b.iridescence>0,Xt=b.sheen>0,et=b.transmission>0,at=ce&&!!b.anisotropyMap,C=N&&!!b.clearcoatMap,w=N&&!!b.clearcoatNormalMap,K=N&&!!b.clearcoatRoughnessMap,ue=Ke&&!!b.diffuseRoughnessMap,oe=be&&!!b.iridescenceMap,xe=be&&!!b.iridescenceThicknessMap,Te=Xt&&!!b.sheenColorMap,ne=Xt&&!!b.sheenRoughnessMap,ie=!!b.specularMap,_e=!!b.specularColorMap,B=!!b.specularIntensityMap,se=et&&!!b.transmissionMap,ee=et&&!!b.thicknessMap,ve=!!b.gradientMap,pe=!!b.alphaMap,ye=b.alphaTest>0,Je=!!b.alphaHash,mt=!!b.extensions,fe=zi;b.toneMapped&&(Xe===null||Xe.isXRRenderTarget===!0)&&(fe=i.toneMapping);let $e=ae?O.isCompressedCubeTexture?O.image[0].mipmaps:O.mipmaps:null,pt={shaderID:W,shaderType:b.type,shaderName:b.name,vertexShader:Pe,fragmentShader:Z,defines:b.defines,customVertexShaderID:de,customFragmentShaderID:Ie,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:D,batching:Rt,batchingColor:Rt&&k._colorsTexture!==null,instancing:je,instancingColor:je&&k.instanceColor!==null,instancingMorph:je&&k.morphTexture!==null,outputColorSpace:Xe===null?i.outputColorSpace:Xe.isXRRenderTarget===!0?Xe.texture.colorSpace:yt.workingColorSpace,alphaToCoverage:!!b.alphaToCoverage,map:Ze,matcap:lt,envMap:ft,envMapMode:ft&&O.mapping,envMapPMREM:ae,envMapMaxLod:ae?$e.length-1:null,envMapSize:ae?$e[0].width:null,aoMap:ge,lightMap:me,bumpMap:Ne,normalMap:we,displacementMap:ct,emissiveMap:ke,normalMapObjectSpace:we&&b.normalMapType===Bm,normalMapTangentSpace:we&&b.normalMapType===Sh,packedNormalMap:we&&b.normalMapType===Sh&&PM(b.normalMap.format),metalnessMap:F,roughnessMap:Q,anisotropy:ce,anisotropyMap:at,clearcoat:N,clearcoatMap:C,clearcoatNormalMap:w,clearcoatRoughnessMap:K,diffuseRoughness:Ke,diffuseRoughnessMap:ue,dispersion:Be,retroreflection:xt,iridescence:be,iridescenceMap:oe,iridescenceThicknessMap:xe,sheen:Xt,sheenColorMap:Te,sheenRoughnessMap:ne,specularMap:ie,specularColorMap:_e,specularIntensityMap:B,transmission:et,transmissionMap:se,thicknessMap:ee,gradientMap:ve,opaque:b.transparent===!1&&b.blending===_a&&b.alphaToCoverage===!1,alphaMap:pe,alphaTest:ye,alphaHash:Je,combine:b.combine,mapUv:Ze&&f(b.map.channel),aoMapUv:ge&&f(b.aoMap.channel),lightMapUv:me&&f(b.lightMap.channel),bumpMapUv:Ne&&f(b.bumpMap.channel),normalMapUv:we&&f(b.normalMap.channel),displacementMapUv:ct&&f(b.displacementMap.channel),emissiveMapUv:ke&&f(b.emissiveMap.channel),metalnessMapUv:F&&f(b.metalnessMap.channel),roughnessMapUv:Q&&f(b.roughnessMap.channel),anisotropyMapUv:at&&f(b.anisotropyMap.channel),clearcoatMapUv:C&&f(b.clearcoatMap.channel),clearcoatNormalMapUv:w&&f(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&f(b.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ue&&f(b.diffuseRoughnessMap.channel),iridescenceMapUv:oe&&f(b.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&f(b.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&f(b.sheenColorMap.channel),sheenRoughnessMapUv:ne&&f(b.sheenRoughnessMap.channel),specularMapUv:ie&&f(b.specularMap.channel),specularColorMapUv:_e&&f(b.specularColorMap.channel),specularIntensityMapUv:B&&f(b.specularIntensityMap.channel),transmissionMapUv:se&&f(b.transmissionMap.channel),thicknessMapUv:ee&&f(b.thicknessMap.channel),alphaMapUv:pe&&f(b.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(we||ce),vertexNormals:!!R.attributes.normal,vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!R.attributes.uv&&(Ze||pe),fog:!!X,useFog:b.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:b.wireframe===!1&&(b.flatShading===!0||R.attributes.normal===void 0&&we===!1&&(b.isMeshLambertMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isMeshPhysicalMaterial)),sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:k.isSkinnedMesh===!0,hasPositionAttribute:R.attributes.position!==void 0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:le,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:V.filter(Le=>Le.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:fe,decodeVideoTexture:Ze&&b.map.isVideoTexture===!0&&yt.getTransfer(b.map.colorSpace)===Ct,decodeVideoTextureEmissive:ke&&b.emissiveMap.isVideoTexture===!0&&yt.getTransfer(b.emissiveMap.colorSpace)===Ct,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Bt,flipSided:b.side===_n,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:mt&&b.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&b.extensions.multiDraw===!0||Rt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function y(b){let S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(let L in b.defines)S.push(L),S.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(g(S,b),m(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function g(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapPMREM),b.push(S.envMapMaxLod),b.push(S.envMapSize),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.diffuseRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.numSunLights),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numSunLightShadows),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.numLightProbeGrids),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function m(b,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.retroreflection&&a.enable(24),S.diffuseRoughness&&a.enable(25),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),b.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),b.push(a.mask)}function x(b){let S=d[b.type],L;if(S){let P=Gi[S];L=n0.clone(P.uniforms)}else L=b.uniforms;return L}function M(b,S){let L=h.get(S);return L!==void 0?++L.usedTimes:(L=new RM(i,S,b,s),l.push(L),h.set(S,L)),L}function _(b){if(--b.usedTimes===0){let S=l.indexOf(b);l[S]=l[l.length-1],l.pop(),h.delete(b.cacheKey),b.destroy()}}function E(b){o.remove(b)}function A(){o.dispose()}return{getParameters:p,getProgramCacheKey:y,getUniforms:x,acquireProgram:M,releaseProgram:_,releaseShaderCache:E,programs:l,dispose:A}}function LM(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function DM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function M0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function S0(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,y,g,m){let x=i[e];return x===void 0?(x={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:y,renderOrder:d.renderOrder,z:g,group:m},i[e]=x):(x.id=d.id,x.object=d,x.geometry=f,x.material=p,x.materialVariant=a(d),x.groupOrder=y,x.renderOrder=d.renderOrder,x.z=g,x.group=m),e++,x}function c(d,f,p,y,g,m,x){x.reversedDepth===!0&&(g=-g);let M=o(d,f,p,y,g,m);p.transmission>0?n.push(M):p.transparent===!0?s.push(M):t.push(M)}function l(d,f,p,y,g,m){let x=o(d,f,p,y,g,m);p.transmission>0?n.unshift(x):p.transparent===!0?s.unshift(x):t.unshift(x)}function h(d,f){t.length>1&&t.sort(d||DM),n.length>1&&n.sort(f||M0),s.length>1&&s.sort(f||M0)}function u(){for(let d=e,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:u,sort:h}}function NM(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new S0,i.set(n,[a])):s>=r.length?(a=new S0,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function FM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new z,color:new qe};break;case"SpotLight":t={position:new z,direction:new z,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new z,halfWidth:new z,halfHeight:new z};break}return i[e.id]=t,t}}}function kM(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var UM=0;function OM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function BM(i){let e=new FM,t=kM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new z);let s=new z,r=new st,a=new st;function o(l){let h=0,u=0,d=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let f=0,p=0,y=0,g=0,m=0,x=0,M=0,_=0,E=0,A=0,b=0,S=0,L=0,P=0;l.sort(OM);for(let V=0,X=l.length;V<X;V++){let R=l[V],I=R.color,U=R.intensity,O=R.distance,W=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Ds?W=R.shadow.map.texture:W=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=I.r*U,u+=I.g*U,d+=I.b*U;else if(R.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(R.sh.coefficients[D],U);P++}else if(R.isSunLight){let D=e.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let G=R.shadow,q=t.get(R);q.shadowIntensity=G.intensity,q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize.copy(G.mapSize).multiply(G.getFrameExtents()),n.sunShadow[p]=q,n.sunShadowMap[p]=W;let le=G.getViewportCount();for(let Pe=0;Pe<le;Pe++)n.sunShadowMatrix[y+Pe]=G.getMatrix(Pe),n.sunShadowCascade[y+Pe]=G._cascadeData[Pe];y+=le,p++}n.sun[f]=D,f++}else if(R.isDirectionalLight){let D=e.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let G=R.shadow,q=t.get(R);q.shadowIntensity=G.intensity,q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize=G.mapSize,n.directionalShadow[g]=q,n.directionalShadowMap[g]=W,n.directionalShadowMatrix[g]=R.shadow.matrix,E++}n.directional[g]=D,g++}else if(R.isSpotLight){let D=e.get(R);D.position.setFromMatrixPosition(R.matrixWorld),D.color.copy(I).multiplyScalar(U),D.distance=O,D.coneCos=Math.cos(R.angle),D.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),D.decay=R.decay,n.spot[x]=D;let G=R.shadow;if(R.map&&(n.spotLightMap[S]=R.map,S++,G.updateMatrices(R),R.castShadow&&L++),n.spotLightMatrix[x]=G.matrix,R.castShadow){let q=t.get(R);q.shadowIntensity=G.intensity,q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize=G.mapSize,n.spotShadow[x]=q,n.spotShadowMap[x]=W,b++}x++}else if(R.isRectAreaLight){let D=e.get(R);D.color.copy(I).multiplyScalar(U),D.halfWidth.set(R.width*.5,0,0),D.halfHeight.set(0,R.height*.5,0),n.rectArea[M]=D,M++}else if(R.isPointLight){let D=e.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),D.distance=R.distance,D.decay=R.decay,R.castShadow){let G=R.shadow,q=t.get(R);q.shadowIntensity=G.intensity,q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize=G.mapSize,q.shadowCameraNear=G.camera.near,q.shadowCameraFar=G.camera.far,n.pointShadow[m]=q,n.pointShadowMap[m]=W,n.pointShadowMatrix[m]=R.shadow.matrix,A++}n.point[m]=D,m++}else if(R.isHemisphereLight){let D=e.get(R);D.skyColor.copy(R.color).multiplyScalar(U),D.groundColor.copy(R.groundColor).multiplyScalar(U),n.hemi[_]=D,_++}}M>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=De.LTC_FLOAT_1,n.rectAreaLTC2=De.LTC_FLOAT_2):(n.rectAreaLTC1=De.LTC_HALF_1,n.rectAreaLTC2=De.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let k=n.hash;(k.sunLength!==f||k.directionalLength!==g||k.pointLength!==m||k.spotLength!==x||k.rectAreaLength!==M||k.hemiLength!==_||k.numSunShadows!==p||k.numDirectionalShadows!==E||k.numPointShadows!==A||k.numSpotShadows!==b||k.numSpotMaps!==S||k.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=g,n.spot.length=x,n.rectArea.length=M,n.point.length=m,n.hemi.length=_,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=A,n.pointShadowMap.length=A,n.pointShadowMatrix.length=A,n.spotShadow.length=b,n.spotShadowMap.length=b,n.spotLightMatrix.length=b+S-L,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=P,k.sunLength=f,k.directionalLength=g,k.pointLength=m,k.spotLength=x,k.rectAreaLength=M,k.hemiLength=_,k.numSunShadows=p,k.numDirectionalShadows=E,k.numPointShadows=A,k.numSpotShadows=b,k.numSpotMaps=S,k.numLightProbes=P,n.version=UM++)}function c(l,h){let u=0,d=0,f=0,p=0,y=0,g=0,m=h.matrixWorldInverse;for(let x=0,M=l.length;x<M;x++){let _=l[x];if(_.isSunLight){let E=n.sun[u];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(m),u++}else if(_.isDirectionalLight){let E=n.directional[d];E.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),d++}else if(_.isSpotLight){let E=n.spot[p];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),p++}else if(_.isRectAreaLight){let E=n.rectArea[y];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(m),a.identity(),r.copy(_.matrixWorld),r.premultiply(m),a.extractRotation(r),E.halfWidth.set(_.width*.5,0,0),E.halfHeight.set(0,_.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),y++}else if(_.isPointLight){let E=n.point[f];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){let E=n.hemi[g];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:n}}function w0(i){let e=new BM(i),t=[],n=[],s=[];function r(u){h.camera=u,t.length=0,n.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):t.push(u)}function o(u){n.push(u)}function c(){e.setup(t),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function l(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function zM(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new w0(i),e.set(s,[o])):r>=a.length?(o=new w0(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var HM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,GM=`uniform sampler2D shadow_pass;
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
}`,VM=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],WM=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],T0=new st,Yo=new z,Ud=new z;function qM(i,e,t){let n=new Rs,s=new he,r=new he,a=new It,o=new Sc,c=new wc,l={},h=t.maxTextureSize,u={[Bi]:_n,[_n]:Bi,[Bt]:Bt},d=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:HM,fragmentShader:GM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new Ft;p.setAttribute("position",new yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new ht(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zo;let m=this.type;this.render=function(A,b,S){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;this.type===pm&&(We("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=zo);let L=i.getRenderTarget(),P=i.getActiveCubeFace(),k=i.getActiveMipmapLevel(),V=i.state;V.setBlending(br),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let X=m!==this.type;X&&b.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(I=>I.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,I=A.length;R<I;R++){let U=A[R],O=U.shadow;if(O===void 0){We("WebGLShadowMap:",U,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);let W=O.getFrameExtents();s.multiply(W),r.copy(O.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/W.x),s.x=r.x*W.x,O.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/W.y),s.y=r.y*W.y,O.mapSize.y=r.y));let D=i.state.buffers.depth.getReversed();if(O.camera._reversedDepth=D,O.map===null||X===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===ya){if(U.isPointLight){We("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new $n(s.x,s.y,{format:Ds,type:Ei,minFilter:an,magFilter:an,generateMipmaps:!1}),O.map.texture.name=U.name+".shadowMap",O.map.depthTexture=new as(s.x,s.y,ti),O.map.depthTexture.name=U.name+".shadowMapDepth",O.map.depthTexture.format=is,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=$t,O.map.depthTexture.magFilter=$t}else U.isPointLight?(O.map=new $o(s.x),O.map.depthTexture=new Mo(s.x,Ti)):(O.map=new $n(s.x,s.y),O.map.depthTexture=new as(s.x,s.y,Ti)),O.map.depthTexture.name=U.name+".shadowMap",O.map.depthTexture.format=is,this.type===zo?(O.map.depthTexture.compareFunction=D?bd:gd,O.map.depthTexture.minFilter=an,O.map.depthTexture.magFilter=an):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=$t,O.map.depthTexture.magFilter=$t);O.camera.updateProjectionMatrix()}O.map.isWebGLCubeRenderTarget!==!0&&(O.map.width!==s.x||O.map.height!==s.y)&&O.map.setSize(s.x,s.y);let G=O.map.isWebGLCubeRenderTarget?6:O.getViewportCount();U.isPointLight!==!0&&O.updateMatrices(U,S);let q=(O.camera.layers.mask&4294967294)!==0?O.camera.layers:S.layers;for(let le=0;le<G;le++){let Pe=O.getCamera(le);if(U.isPointLight){let Z=O.camera,de=O.matrix,Ie=U.distance||Z.far;Ie!==Z.far&&(Z.far=Ie,Z.updateProjectionMatrix()),Yo.setFromMatrixPosition(U.matrixWorld),Z.position.copy(Yo),Ud.copy(Z.position),Ud.add(VM[le]),Z.up.copy(WM[le]),Z.lookAt(Ud),Z.updateMatrixWorld(),de.makeTranslation(-Yo.x,-Yo.y,-Yo.z),T0.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),O._frustum.setFromProjectionMatrix(T0,Z.coordinateSystem,Z.reversedDepth)}if(O.map.isWebGLCubeRenderTarget)i.setRenderTarget(O.map,le),i.clear();else{le===0&&(i.setRenderTarget(O.map),i.clear());let Z=O.getViewport(le);a.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),V.viewport(a)}n=O.getFrustum(le),_(b,S,Pe,U,q,this.type)}O.isPointLightShadow!==!0&&this.type===ya&&x(O,S),O.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(L,P,k)};function x(A,b){let S=e.update(y);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null?A.mapPass=new $n(s.x,s.y,{format:Ds,type:Ei}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),d.uniforms.shadow_pass.value=A.map.depthTexture,d.uniforms.resolution.value.set(A.map.width,A.map.height),d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(b,null,S,d,y,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value.set(A.map.width,A.map.height),f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(b,null,S,f,y,null)}function M(A,b,S,L){let P=null,k=S.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(k!==void 0)P=k;else if(P=S.isPointLight===!0?c:o,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0||b.alphaToCoverage===!0){let V=P.uuid,X=b.uuid,R=l[V];R===void 0&&(R={},l[V]=R);let I=R[X];I===void 0&&(I=P.clone(),R[X]=I,b.addEventListener("dispose",E)),P=I}if(P.visible=b.visible,P.wireframe=b.wireframe,L===ya?P.side=b.shadowSide!==null?b.shadowSide:b.side:P.side=b.shadowSide!==null?b.shadowSide:u[b.side],P.alphaMap=b.alphaMap,P.alphaTest=b.alphaToCoverage===!0?.5:b.alphaTest,P.map=b.map,P.clipShadows=b.clipShadows,P.clippingPlanes=b.clippingPlanes,P.clipIntersection=b.clipIntersection,P.displacementMap=b.displacementMap,P.displacementScale=b.displacementScale,P.displacementBias=b.displacementBias,P.wireframeLinewidth=b.wireframeLinewidth,P.linewidth=b.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let V=i.properties.get(P);V.light=S}return P}function _(A,b,S,L,P,k){if(A.visible===!1)return;if(A.layers.test(P)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&k===ya)&&(!A.frustumCulled||A.intersectsFrustum(n))){A.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,A.matrixWorld);let R=e.update(A),I=A.material;if(Array.isArray(I)){let U=R.groups;for(let O=0,W=U.length;O<W;O++){let D=U[O],G=I[D.materialIndex];if(G&&G.visible){let q=M(A,G,L,k);A.onBeforeShadow(i,A,b,S,R,q,D),i.renderBufferDirect(S,null,R,q,A,D),A.onAfterShadow(i,A,b,S,R,q,D)}}}else if(I.visible){let U=M(A,I,L,k);A.onBeforeShadow(i,A,b,S,R,U,null),i.renderBufferDirect(S,null,R,U,A,null),A.onAfterShadow(i,A,b,S,R,U,null)}}let X=A.children;for(let R=0,I=X.length;R<I;R++)_(X[R],b,S,L,P,k)}function E(A){A.target.removeEventListener("dispose",E);for(let S in l){let L=l[S],P=A.target.uuid;P in L&&(L[P].dispose(),delete L[P])}}}function XM(i,e){function t(){let B=!1,se=new It,ee=null,ve=new It(0,0,0,0);return{setMask:function(pe){ee!==pe&&!B&&(i.colorMask(pe,pe,pe,pe),ee=pe)},setLocked:function(pe){B=pe},setClear:function(pe,ye,Je,mt,fe){fe===!0&&(pe*=mt,ye*=mt,Je*=mt),se.set(pe,ye,Je,mt),ve.equals(se)===!1&&(i.clearColor(pe,ye,Je,mt),ve.copy(se))},reset:function(){B=!1,ee=null,ve.set(-1,0,0,0)}}}function n(){let B=!1,se=!1,ee=null,ve=null,pe=null;return{setReversed:function(ye){if(se!==ye){let Je=e.get("EXT_clip_control");ye?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT),se=ye;let mt=pe;pe=null,this.setClear(mt)}},getReversed:function(){return se},setTest:function(ye){ye?Me(i.DEPTH_TEST):je(i.DEPTH_TEST)},setMask:function(ye){ee!==ye&&!B&&(i.depthMask(ye),ee=ye)},setFunc:function(ye){if(se&&(ye=Jm[ye]),ve!==ye){switch(ye){case nc:i.depthFunc(i.NEVER);break;case ic:i.depthFunc(i.ALWAYS);break;case sc:i.depthFunc(i.LESS);break;case na:i.depthFunc(i.LEQUAL);break;case rc:i.depthFunc(i.EQUAL);break;case ac:i.depthFunc(i.GEQUAL);break;case oc:i.depthFunc(i.GREATER);break;case lc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=ye}},setLocked:function(ye){B=ye},setClear:function(ye){pe!==ye&&(pe=ye,se&&(ye=1-ye),i.clearDepth(ye))},reset:function(){B=!1,ee=null,ve=null,pe=null,se=!1}}}function s(){let B=!1,se=null,ee=null,ve=null,pe=null,ye=null,Je=null,mt=null,fe=null;return{setTest:function($e){B||($e?Me(i.STENCIL_TEST):je(i.STENCIL_TEST))},setMask:function($e){se!==$e&&!B&&(i.stencilMask($e),se=$e)},setFunc:function($e,pt,Le){(ee!==$e||ve!==pt||pe!==Le)&&(i.stencilFunc($e,pt,Le),ee=$e,ve=pt,pe=Le)},setOp:function($e,pt,Le){(ye!==$e||Je!==pt||mt!==Le)&&(i.stencilOp($e,pt,Le),ye=$e,Je=pt,mt=Le)},setLocked:function($e){B=$e},setClear:function($e){fe!==$e&&(i.clearStencil($e),fe=$e)},reset:function(){B=!1,se=null,ee=null,ve=null,pe=null,ye=null,Je=null,mt=null,fe=null}}}let r=new t,a=new n,o=new s,c={},l=new WeakMap,h={},u={},d={},f=new WeakMap,p=[],y=null,g=!1,m=null,x=null,M=null,_=null,E=null,A=null,b=null,S=new qe(0,0,0),L=0,P=!1,k=null,V=null,X=null,R=null,I=null,U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,W=0,D=i.getParameter(i.VERSION);D.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(D)[1]),O=W>=1):D.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(D)[1]),O=W>=2);let G=null,q={},le=i.getParameter(i.SCISSOR_BOX),Pe=i.getParameter(i.VIEWPORT),Z=new It().fromArray(le),de=new It().fromArray(Pe);function Ie(B,se,ee,ve){let pe=new Uint8Array(4),ye=i.createTexture();i.bindTexture(B,ye),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Je=0;Je<ee;Je++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(se,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(se+Je,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return ye}let Xe={};Xe[i.TEXTURE_2D]=Ie(i.TEXTURE_2D,i.TEXTURE_2D,1),Xe[i.TEXTURE_CUBE_MAP]=Ie(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Xe[i.TEXTURE_2D_ARRAY]=Ie(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Xe[i.TEXTURE_3D]=Ie(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Me(i.DEPTH_TEST),a.setFunc(na),Ne(!1),we(Yu),Me(i.CULL_FACE),ge(br);function Me(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function je(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Rt(B,se){return d[B]!==se?(i.bindFramebuffer(B,se),d[B]=se,B===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=se),B===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=se),!0):!1}function Ze(B,se){let ee=p,ve=!1;if(B){ee=f.get(se),ee===void 0&&(ee=[],f.set(se,ee));let pe=B.textures;if(ee.length!==pe.length||ee[0]!==i.COLOR_ATTACHMENT0){for(let ye=0,Je=pe.length;ye<Je;ye++)ee[ye]=i.COLOR_ATTACHMENT0+ye;ee.length=pe.length,ve=!0}}else ee[0]!==i.BACK&&(ee[0]=i.BACK,ve=!0);ve&&i.drawBuffers(ee)}function lt(B){return y!==B?(i.useProgram(B),y=B,!0):!1}let ft={[xr]:i.FUNC_ADD,[gm]:i.FUNC_SUBTRACT,[bm]:i.FUNC_REVERSE_SUBTRACT};ft[xm]=i.MIN,ft[ym]=i.MAX;let ae={[_m]:i.ZERO,[vm]:i.ONE,[Mm]:i.SRC_COLOR,[Qu]:i.SRC_ALPHA,[Rm]:i.SRC_ALPHA_SATURATE,[Em]:i.DST_COLOR,[wm]:i.DST_ALPHA,[Sm]:i.ONE_MINUS_SRC_COLOR,[ed]:i.ONE_MINUS_SRC_ALPHA,[Am]:i.ONE_MINUS_DST_COLOR,[Tm]:i.ONE_MINUS_DST_ALPHA,[Cm]:i.CONSTANT_COLOR,[Pm]:i.ONE_MINUS_CONSTANT_COLOR,[Im]:i.CONSTANT_ALPHA,[Lm]:i.ONE_MINUS_CONSTANT_ALPHA};function ge(B,se,ee,ve,pe,ye,Je,mt,fe,$e){if(B===br){g===!0&&(je(i.BLEND),g=!1);return}if(g===!1&&(Me(i.BLEND),g=!0),B!==mm){if(B!==m||$e!==P){if((x!==xr||E!==xr)&&(i.blendEquation(i.FUNC_ADD),x=xr,E=xr),$e)switch(B){case _a:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case va:i.blendFunc(i.ONE,i.ONE);break;case Zu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $u:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:it("WebGLState: Invalid blending: ",B);break}else switch(B){case _a:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case va:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Zu:it("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $u:it("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:it("WebGLState: Invalid blending: ",B);break}M=null,_=null,A=null,b=null,S.set(0,0,0),L=0,m=B,P=$e}return}pe=pe||se,ye=ye||ee,Je=Je||ve,(se!==x||pe!==E)&&(i.blendEquationSeparate(ft[se],ft[pe]),x=se,E=pe),(ee!==M||ve!==_||ye!==A||Je!==b)&&(i.blendFuncSeparate(ae[ee],ae[ve],ae[ye],ae[Je]),M=ee,_=ve,A=ye,b=Je),(mt.equals(S)===!1||fe!==L)&&(i.blendColor(mt.r,mt.g,mt.b,fe),S.copy(mt),L=fe),m=B,P=!1}function me(B,se){B.side===Bt?je(i.CULL_FACE):Me(i.CULL_FACE);let ee=B.side===_n;se&&(ee=!ee),Ne(ee),B.blending===_a&&B.transparent===!1?ge(br):ge(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);let ve=B.stencilWrite;o.setTest(ve),ve&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ke(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?Me(i.SAMPLE_ALPHA_TO_COVERAGE):je(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(B){k!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),k=B)}function we(B){B!==dm?(Me(i.CULL_FACE),B!==V&&(B===Yu?i.cullFace(i.BACK):B===fm?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):je(i.CULL_FACE),V=B}function ct(B){B!==X&&(O&&i.lineWidth(B),X=B)}function ke(B,se,ee){B?(Me(i.POLYGON_OFFSET_FILL),(R!==se||I!==ee)&&(R=se,I=ee,a.getReversed()&&(se=-se,ee=-ee),i.polygonOffset(se,ee))):je(i.POLYGON_OFFSET_FILL)}function F(B){B?Me(i.SCISSOR_TEST):je(i.SCISSOR_TEST)}function Q(B){B===void 0&&(B=i.TEXTURE0+U-1),G!==B&&(i.activeTexture(B),G=B)}function ce(B,se,ee){ee===void 0&&(G===null?ee=i.TEXTURE0+U-1:ee=G);let ve=q[ee];ve===void 0&&(ve={type:void 0,texture:void 0},q[ee]=ve),(ve.type!==B||ve.texture!==se)&&(G!==ee&&(i.activeTexture(ee),G=ee),i.bindTexture(B,se||Xe[B]),ve.type=B,ve.texture=se)}function N(){let B=q[G];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Ke(){try{i.compressedTexImage2D(...arguments)}catch(B){it("WebGLState:",B)}}function Be(){try{i.compressedTexImage3D(...arguments)}catch(B){it("WebGLState:",B)}}function xt(){try{i.texSubImage2D(...arguments)}catch(B){it("WebGLState:",B)}}function be(){try{i.texSubImage3D(...arguments)}catch(B){it("WebGLState:",B)}}function Xt(){try{i.compressedTexSubImage2D(...arguments)}catch(B){it("WebGLState:",B)}}function et(){try{i.compressedTexSubImage3D(...arguments)}catch(B){it("WebGLState:",B)}}function at(){try{i.texStorage2D(...arguments)}catch(B){it("WebGLState:",B)}}function C(){try{i.texStorage3D(...arguments)}catch(B){it("WebGLState:",B)}}function w(){try{i.texImage2D(...arguments)}catch(B){it("WebGLState:",B)}}function K(){try{i.texImage3D(...arguments)}catch(B){it("WebGLState:",B)}}function ue(B){return u[B]!==void 0?u[B]:i.getParameter(B)}function oe(B,se){u[B]!==se&&(i.pixelStorei(B,se),u[B]=se)}function xe(B){Z.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Z.copy(B))}function Te(B){de.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),de.copy(B))}function ne(B,se){let ee=l.get(se);ee===void 0&&(ee=new WeakMap,l.set(se,ee));let ve=ee.get(B);ve===void 0&&(ve=i.getUniformBlockIndex(se,B.name),i.uniformBlockBinding(se,ve,ve),ee.set(B,ve))}function ie(B,se,ee){let pe=l.get(se).get(B);c[pe]!==ee&&(i.bindBufferBase(i.UNIFORM_BUFFER,pe,ee),c[pe]=ee)}function _e(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},G=null,q={},d={},c={},f=new WeakMap,p=[],y=null,g=!1,m=null,x=null,M=null,_=null,E=null,A=null,b=null,S=new qe(0,0,0),L=0,P=!1,k=null,V=null,X=null,R=null,I=null,Z.set(0,0,i.canvas.width,i.canvas.height),de.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Me,disable:je,bindFramebuffer:Rt,drawBuffers:Ze,useProgram:lt,setBlending:ge,setMaterial:me,setFlipSided:Ne,setCullFace:we,setLineWidth:ct,setPolygonOffset:ke,setScissorTest:F,activeTexture:Q,bindTexture:ce,unbindTexture:N,compressedTexImage2D:Ke,compressedTexImage3D:Be,texImage2D:w,texImage3D:K,pixelStorei:oe,getParameter:ue,updateUBOMapping:ne,uniformBlockBinding:ie,texStorage2D:at,texStorage3D:C,texSubImage2D:xt,texSubImage3D:be,compressedTexSubImage2D:Xt,compressedTexSubImage3D:et,scissor:xe,viewport:Te,reset:_e}}function jM(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new he,h=new WeakMap,u=new Set,d,f=new WeakMap,p=new Set,y=new FinalizationRegistry(C=>p.delete(C)),g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,w){return g?new OffscreenCanvas(C,w):ra("canvas")}function x(C,w,K){let ue=1,oe=at(C);if((oe.width>K||oe.height>K)&&(ue=K/Math.max(oe.width,oe.height)),ue<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let xe=Math.floor(ue*oe.width),Te=Math.floor(ue*oe.height);d===void 0&&(d=m(xe,Te));let ne=w?m(xe,Te):d;return ne.width=xe,ne.height=Te,ne.getContext("2d").drawImage(C,0,0,xe,Te),We("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+xe+"x"+Te+")."),ne}else return"data"in C&&We("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),C;return C}function M(C){return C.generateMipmaps}function _(C){i.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function A(C,w,K,ue,oe,xe=!1){if(C!==null){if(i[C]!==void 0)return i[C];We("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Te;ue&&(Te=e.get("EXT_texture_norm16"),Te||We("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ne=w;if(w===i.RED&&(K===i.FLOAT&&(ne=i.R32F),K===i.HALF_FLOAT&&(ne=i.R16F),K===i.UNSIGNED_BYTE&&(ne=i.R8),K===i.UNSIGNED_SHORT&&Te&&(ne=Te.R16_EXT),K===i.SHORT&&Te&&(ne=Te.R16_SNORM_EXT)),w===i.RED_INTEGER&&(K===i.UNSIGNED_BYTE&&(ne=i.R8UI),K===i.UNSIGNED_SHORT&&(ne=i.R16UI),K===i.UNSIGNED_INT&&(ne=i.R32UI),K===i.BYTE&&(ne=i.R8I),K===i.SHORT&&(ne=i.R16I),K===i.INT&&(ne=i.R32I)),w===i.RG&&(K===i.FLOAT&&(ne=i.RG32F),K===i.HALF_FLOAT&&(ne=i.RG16F),K===i.UNSIGNED_BYTE&&(ne=i.RG8),K===i.UNSIGNED_SHORT&&Te&&(ne=Te.RG16_EXT),K===i.SHORT&&Te&&(ne=Te.RG16_SNORM_EXT)),w===i.RG_INTEGER&&(K===i.UNSIGNED_BYTE&&(ne=i.RG8UI),K===i.UNSIGNED_SHORT&&(ne=i.RG16UI),K===i.UNSIGNED_INT&&(ne=i.RG32UI),K===i.BYTE&&(ne=i.RG8I),K===i.SHORT&&(ne=i.RG16I),K===i.INT&&(ne=i.RG32I)),w===i.RGB_INTEGER&&(K===i.UNSIGNED_BYTE&&(ne=i.RGB8UI),K===i.UNSIGNED_SHORT&&(ne=i.RGB16UI),K===i.UNSIGNED_INT&&(ne=i.RGB32UI),K===i.BYTE&&(ne=i.RGB8I),K===i.SHORT&&(ne=i.RGB16I),K===i.INT&&(ne=i.RGB32I)),w===i.RGBA_INTEGER&&(K===i.UNSIGNED_BYTE&&(ne=i.RGBA8UI),K===i.UNSIGNED_SHORT&&(ne=i.RGBA16UI),K===i.UNSIGNED_INT&&(ne=i.RGBA32UI),K===i.BYTE&&(ne=i.RGBA8I),K===i.SHORT&&(ne=i.RGBA16I),K===i.INT&&(ne=i.RGBA32I)),w===i.RGB&&(K===i.UNSIGNED_SHORT&&Te&&(ne=Te.RGB16_EXT),K===i.SHORT&&Te&&(ne=Te.RGB16_SNORM_EXT),K===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),K===i.UNSIGNED_INT_10F_11F_11F_REV&&(ne=i.R11F_G11F_B10F)),w===i.RGBA){let ie=xe?oo:yt.getTransfer(oe);K===i.FLOAT&&(ne=i.RGBA32F),K===i.HALF_FLOAT&&(ne=i.RGBA16F),K===i.UNSIGNED_BYTE&&(ne=ie===Ct?i.SRGB8_ALPHA8:i.RGBA8),K===i.UNSIGNED_SHORT&&Te&&(ne=Te.RGBA16_EXT),K===i.SHORT&&Te&&(ne=Te.RGBA16_SNORM_EXT),K===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),K===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function b(C,w){let K;return C?w===null||w===Ti||w===vr?K=i.DEPTH24_STENCIL8:w===ti?K=i.DEPTH32F_STENCIL8:w===wa&&(K=i.DEPTH24_STENCIL8,We("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ti||w===vr?K=i.DEPTH_COMPONENT24:w===ti?K=i.DEPTH_COMPONENT32F:w===wa&&(K=i.DEPTH_COMPONENT16),K}function S(C,w){return M(C)===!0||C.isFramebufferTexture&&C.minFilter!==$t&&C.minFilter!==an?Math.log2(Math.max(w.width,w.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?w.mipmaps.length:1}function L(C){let w=new WeakRef(C);n.get(C).__ref=w,p.add(w),y.register(C,w,w)}function P(C){let w=n.get(C).__ref;w!==void 0&&(p.delete(w),y.unregister(w))}function k(C){X(C.target)}function V(C){R(C.target)}function X(C){C.removeEventListener("dispose",k),P(C),U(C),C.isVideoTexture&&h.delete(C),C.isHTMLTexture&&u.delete(C)}function R(C){C.removeEventListener("dispose",V),P(C),W(C)}function I(){for(let C of p){let w=C.deref();w!==void 0&&(w.isRenderTarget===!0?R(w):X(w))}p.clear(),u.clear()}function U(C){let w=n.get(C);if(w.__webglInit===void 0)return;let K=C.source,ue=f.get(K);if(ue){let oe=ue[w.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&O(C),Object.keys(ue).length===0&&f.delete(K)}n.remove(C)}function O(C){let w=n.get(C);i.deleteTexture(w.__webglTexture);let K=C.source,ue=f.get(K);delete ue[w.__cacheKey],a.memory.textures--}function W(C){let w=n.get(C);w.__depthDisposeCallback&&w.__depthDisposeCallback();let K=C.depthTexture;if(K&&K.renderTarget===C&&X(K),C.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(w.__webglFramebuffer[oe]))for(let xe=0;xe<w.__webglFramebuffer[oe].length;xe++)i.deleteFramebuffer(w.__webglFramebuffer[oe][xe]);else i.deleteFramebuffer(w.__webglFramebuffer[oe]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[oe])}else{if(Array.isArray(w.__webglFramebuffer))for(let oe=0;oe<w.__webglFramebuffer.length;oe++)i.deleteFramebuffer(w.__webglFramebuffer[oe]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let oe=0;oe<w.__webglColorRenderbuffer.length;oe++)w.__webglColorRenderbuffer[oe]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[oe]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let ue=C.textures;for(let oe=0,xe=ue.length;oe<xe;oe++){let Te=n.get(ue[oe]);Te.__webglTexture&&(i.deleteTexture(Te.__webglTexture),a.memory.textures--),n.remove(ue[oe])}n.remove(C)}let D=0;function G(){D=0}function q(){return D}function le(C){D=C}function Pe(){let C=D;return C>=s.maxTextures&&We("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function Z(C){let w=[];return w.push(C.wrapS),w.push(C.wrapT),w.push(C.wrapR||0),w.push(C.magFilter),w.push(C.minFilter),w.push(C.anisotropy),w.push(C.internalFormat),w.push(C.format),w.push(C.type),w.push(C.generateMipmaps),w.push(C.mipmapsAutoUpdate),w.push(C.premultiplyAlpha),w.push(C.flipY),w.push(C.unpackAlignment),w.push(C.colorSpace),w.join()}function de(C,w){let K=n.get(C);if(C.isVideoTexture&&Xt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&K.__version!==C.version){let ue=C.image;if(ue===null)We("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)We("WebGLRenderer: Texture marked for update but image is incomplete");else{me(K,C,w);return}}else C.isExternalTexture&&(K.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,K.__webglTexture,i.TEXTURE0+w)}function Ie(C,w){let K=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&K.__version!==C.version){me(K,C,w);return}else C.isExternalTexture&&(K.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,K.__webglTexture,i.TEXTURE0+w)}function Xe(C,w){let K=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&K.__version!==C.version){me(K,C,w);return}t.bindTexture(i.TEXTURE_3D,K.__webglTexture,i.TEXTURE0+w)}function Me(C,w){let K=n.get(C);if(C.version>0&&K.__version!==C.version){Ne(K,C,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture,i.TEXTURE0+w)}let je={[ai]:i.REPEAT,[Cn]:i.CLAMP_TO_EDGE,[ia]:i.MIRRORED_REPEAT},Rt={[$t]:i.NEAREST,[Uc]:i.NEAREST_MIPMAP_NEAREST,[_r]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[Sa]:i.LINEAR_MIPMAP_NEAREST,[ci]:i.LINEAR_MIPMAP_LINEAR},Ze={[Hm]:i.NEVER,[xd]:i.ALWAYS,[Gm]:i.LESS,[gd]:i.LEQUAL,[Vm]:i.EQUAL,[bd]:i.GEQUAL,[Wm]:i.GREATER,[qm]:i.NOTEQUAL};function lt(C,w){if(w.type===ti&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===an||w.magFilter===Sa||w.magFilter===_r||w.magFilter===ci||w.minFilter===an||w.minFilter===Sa||w.minFilter===_r||w.minFilter===ci)&&We("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,je[w.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,je[w.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,je[w.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Rt[w.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Rt[w.minFilter]),w.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Ze[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===$t||w.minFilter!==_r&&w.minFilter!==ci||w.type===ti&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let K=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function ft(C,w){let K=!1;C.__webglInit===void 0&&(C.__webglInit=!0,w.addEventListener("dispose",k),L(w));let ue=w.source,oe=f.get(ue);oe===void 0&&(oe={},f.set(ue,oe));let xe=Z(w);if(xe!==C.__cacheKey){oe[xe]===void 0&&(oe[xe]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,K=!0),oe[xe].usedTimes++;let Te=oe[C.__cacheKey];Te!==void 0&&(oe[C.__cacheKey].usedTimes--,Te.usedTimes===0&&O(w)),C.__cacheKey=xe,C.__webglTexture=oe[xe].texture}return K}function ae(C,w,K){return Math.floor(Math.floor(C/K)/w)}function ge(C,w,K,ue){let xe=C.updateRanges;if(xe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,K,ue,w.data);else{xe.sort((B,se)=>B.start-se.start);let Te=0;for(let B=1;B<xe.length;B++){let se=xe[Te],ee=xe[B],ve=se.start+se.count,pe=ae(ee.start,w.width,4),ye=ae(se.start,w.width,4);ee.start<=ve+1&&pe===ye&&ae(ee.start+ee.count-1,w.width,4)===pe?se.count=Math.max(se.count,ee.start+ee.count-se.start):(++Te,xe[Te]=ee)}xe.length=Te+1;let ne=t.getParameter(i.UNPACK_ROW_LENGTH),ie=t.getParameter(i.UNPACK_SKIP_PIXELS),_e=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let B=0,se=xe.length;B<se;B++){let ee=xe[B],ve=Math.floor(ee.start/4),pe=Math.ceil(ee.count/4),ye=ve%w.width,Je=Math.floor(ve/w.width),mt=pe,fe=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ye),t.pixelStorei(i.UNPACK_SKIP_ROWS,Je),t.texSubImage2D(i.TEXTURE_2D,0,ye,Je,mt,fe,K,ue,w.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ne),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(i.UNPACK_SKIP_ROWS,_e)}}function me(C,w,K){let ue=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ue=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ue=i.TEXTURE_3D);let oe=ft(C,w),xe=w.source;t.bindTexture(ue,C.__webglTexture,i.TEXTURE0+K);let Te=n.get(xe);if(xe.version!==Te.__version||oe===!0){if(t.activeTexture(i.TEXTURE0+K),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){let fe=yt.getPrimaries(yt.workingColorSpace),$e=w.colorSpace===ui?null:yt.getPrimaries(w.colorSpace),pt=w.colorSpace===ui||fe===$e?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt)}t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment);let ie=x(w.image,!1,s.maxTextureSize);ie=et(w,ie);let _e=r.convert(w.format,w.colorSpace),B=r.convert(w.type),se=A(w.internalFormat,_e,B,w.normalized,w.colorSpace,w.isVideoTexture);lt(ue,w);let ee,ve=w.mipmaps,pe=w.isVideoTexture!==!0,ye=Te.__version===void 0||oe===!0,Je=xe.dataReady,mt=S(w,ie);if(w.isDepthTexture)se=b(w.format===ps,w.type),ye&&(pe?t.texStorage2D(i.TEXTURE_2D,1,se,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,se,ie.width,ie.height,0,_e,B,null));else if(w.isDataTexture)if(ve.length>0){pe&&ye&&t.texStorage2D(i.TEXTURE_2D,mt,se,ve[0].width,ve[0].height);for(let fe=0,$e=ve.length;fe<$e;fe++)ee=ve[fe],pe?Je&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,ee.width,ee.height,_e,B,ee.data):t.texImage2D(i.TEXTURE_2D,fe,se,ee.width,ee.height,0,_e,B,ee.data);w.generateMipmaps=!1}else pe?(ye&&t.texStorage2D(i.TEXTURE_2D,mt,se,ie.width,ie.height),Je&&ge(w,ie,_e,B)):t.texImage2D(i.TEXTURE_2D,0,se,ie.width,ie.height,0,_e,B,ie.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){pe&&ye&&t.texStorage3D(i.TEXTURE_2D_ARRAY,mt,se,ve[0].width,ve[0].height,ie.depth);for(let fe=0,$e=ve.length;fe<$e;fe++)if(ee=ve[fe],w.format!==hi)if(_e!==null)if(pe){if(Je)if(w.layerUpdates.size>0){let pt=Pd(ee.width,ee.height,w.format,w.type);for(let Le of w.layerUpdates){let Pt=ee.data.subarray(Le*pt/ee.data.BYTES_PER_ELEMENT,(Le+1)*pt/ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,Le,ee.width,ee.height,1,_e,Pt)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,0,ee.width,ee.height,ie.depth,_e,ee.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,fe,se,ee.width,ee.height,ie.depth,0,ee.data,0,0);else We("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else pe?Je&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,fe,0,0,0,ee.width,ee.height,ie.depth,_e,B,ee.data):t.texImage3D(i.TEXTURE_2D_ARRAY,fe,se,ee.width,ee.height,ie.depth,0,_e,B,ee.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{pe&&ye&&t.texStorage2D(i.TEXTURE_2D,mt,se,ve[0].width,ve[0].height);for(let fe=0,$e=ve.length;fe<$e;fe++)ee=ve[fe],w.format!==hi?_e!==null?pe?Je&&t.compressedTexSubImage2D(i.TEXTURE_2D,fe,0,0,ee.width,ee.height,_e,ee.data):t.compressedTexImage2D(i.TEXTURE_2D,fe,se,ee.width,ee.height,0,ee.data):We("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pe?Je&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,ee.width,ee.height,_e,B,ee.data):t.texImage2D(i.TEXTURE_2D,fe,se,ee.width,ee.height,0,_e,B,ee.data)}else if(w.isDataArrayTexture)if(pe){if(ye&&t.texStorage3D(i.TEXTURE_2D_ARRAY,mt,se,ie.width,ie.height,ie.depth),Je)if(w.layerUpdates.size>0){let fe=Pd(ie.width,ie.height,w.format,w.type);for(let $e of w.layerUpdates){let pt=ie.data.subarray($e*fe/ie.data.BYTES_PER_ELEMENT,($e+1)*fe/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$e,ie.width,ie.height,1,_e,B,pt)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,_e,B,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,se,ie.width,ie.height,ie.depth,0,_e,B,ie.data);else if(w.isData3DTexture)pe?(ye&&t.texStorage3D(i.TEXTURE_3D,mt,se,ie.width,ie.height,ie.depth),Je&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,_e,B,ie.data)):t.texImage3D(i.TEXTURE_3D,0,se,ie.width,ie.height,ie.depth,0,_e,B,ie.data);else if(w.isFramebufferTexture){if(ye)if(pe)t.texStorage2D(i.TEXTURE_2D,mt,se,ie.width,ie.height);else{let fe=ie.width,$e=ie.height;for(let pt=0;pt<mt;pt++)t.texImage2D(i.TEXTURE_2D,pt,se,fe,$e,0,_e,B,null),fe>>=1,$e>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in i){let fe=i.canvas;if(fe.hasAttribute("layoutsubtree")||fe.setAttribute("layoutsubtree","true"),ie.parentNode!==fe){fe.appendChild(ie),u.add(w),fe.onpaint=$e=>{let pt=$e.changedElements;for(let Le of u)pt.includes(Le.image)&&(Le.needsUpdate=!0)},fe.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ie);else{let pt=i.RGBA,Le=i.RGBA,Pt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,pt,Le,Pt,ie)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ve.length>0){if(pe&&ye){let fe=at(ve[0]);t.texStorage2D(i.TEXTURE_2D,mt,se,fe.width,fe.height)}for(let fe=0,$e=ve.length;fe<$e;fe++)ee=ve[fe],pe?Je&&t.texSubImage2D(i.TEXTURE_2D,fe,0,0,_e,B,ee):t.texImage2D(i.TEXTURE_2D,fe,se,_e,B,ee);w.generateMipmaps=!1}else if(pe){if(ye){let fe=at(ie);t.texStorage2D(i.TEXTURE_2D,mt,se,fe.width,fe.height)}Je&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,_e,B,ie)}else t.texImage2D(i.TEXTURE_2D,0,se,_e,B,ie);M(w)&&w.mipmapsAutoUpdate===!0&&_(ue),Te.__version=xe.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function Ne(C,w,K){if(w.image.length!==6)return;let ue=ft(C,w),oe=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+K);let xe=n.get(oe);if(oe.version!==xe.__version||ue===!0){t.activeTexture(i.TEXTURE0+K);let Te=yt.getPrimaries(yt.workingColorSpace),ne=w.colorSpace===ui?null:yt.getPrimaries(w.colorSpace),ie=w.colorSpace===ui||Te===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let _e=w.isCompressedTexture||w.image[0].isCompressedTexture,B=w.image[0]&&w.image[0].isDataTexture,se=[];for(let Le=0;Le<6;Le++)!_e&&!B?se[Le]=x(w.image[Le],!0,s.maxCubemapSize):se[Le]=B?w.image[Le].image:w.image[Le],se[Le]=et(w,se[Le]);let ee=se[0],ve=r.convert(w.format,w.colorSpace),pe=r.convert(w.type),ye=A(w.internalFormat,ve,pe,w.normalized,w.colorSpace),Je=w.isVideoTexture!==!0,mt=xe.__version===void 0||ue===!0,fe=oe.dataReady,$e=S(w,ee);lt(i.TEXTURE_CUBE_MAP,w);let pt;if(w.isDepthTexture){if(ye=b(w.format===ps,w.type),mt)if(Je)t.texStorage2D(i.TEXTURE_CUBE_MAP,1,ye,ee.width,ee.height);else for(let Le=0;Le<6;Le++)t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,ye,ee.width,ee.height,0,ve,pe,null)}else if(_e){Je&&mt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,$e,ye,ee.width,ee.height);for(let Le=0;Le<6;Le++){pt=se[Le].mipmaps;for(let Pt=0;Pt<pt.length;Pt++){let cn=pt[Pt];w.format!==hi?ve!==null?Je?fe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt,0,0,cn.width,cn.height,ve,cn.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt,ye,cn.width,cn.height,0,cn.data):We("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt,0,0,cn.width,cn.height,ve,pe,cn.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt,ye,cn.width,cn.height,0,ve,pe,cn.data)}}}else{if(pt=w.mipmaps,Je&&mt){pt.length>0&&$e++;let Le=at(se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,$e,ye,Le.width,Le.height)}for(let Le=0;Le<6;Le++)if(B){Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,0,0,se[Le].width,se[Le].height,ve,pe,se[Le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,ye,se[Le].width,se[Le].height,0,ve,pe,se[Le].data);for(let Pt=0;Pt<pt.length;Pt++){let ys=pt[Pt].image[Le].image;Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt+1,0,0,ys.width,ys.height,ve,pe,ys.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt+1,ye,ys.width,ys.height,0,ve,pe,ys.data)}}else{Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,0,0,ve,pe,se[Le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0,ye,ve,pe,se[Le]);for(let Pt=0;Pt<pt.length;Pt++){let cn=pt[Pt];Je?fe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt+1,0,0,ve,pe,cn.image[Le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Pt+1,ye,ve,pe,cn.image[Le])}}}M(w)&&w.mipmapsAutoUpdate===!0&&_(i.TEXTURE_CUBE_MAP),xe.__version=oe.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function we(C,w,K,ue,oe,xe){let Te=r.convert(K.format,K.colorSpace),ne=r.convert(K.type),ie=A(K.internalFormat,Te,ne,K.normalized,K.colorSpace),_e=n.get(w),B=n.get(K);if(B.__renderTarget=w,!_e.__hasExternalTextures){let se=Math.max(1,w.width>>xe),ee=Math.max(1,w.height>>xe);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,xe,ie,se,ee,w.depth,0,Te,ne,null):t.texImage2D(oe,xe,ie,se,ee,0,Te,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),be(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ue,oe,B.__webglTexture,0,xt(w)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ue,oe,B.__webglTexture,xe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ct(C,w,K){if(i.bindRenderbuffer(i.RENDERBUFFER,C),w.depthBuffer){let ue=w.depthTexture,oe=ue&&ue.isDepthTexture?ue.type:null,xe=b(w.stencilBuffer,oe),Te=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;be(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt(w),xe,w.width,w.height):K?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt(w),xe,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,xe,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,C)}else{let ue=w.textures;for(let oe=0;oe<ue.length;oe++){let xe=ue[oe],Te=r.convert(xe.format,xe.colorSpace),ne=r.convert(xe.type),ie=A(xe.internalFormat,Te,ne,xe.normalized,xe.colorSpace);be(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt(w),ie,w.width,w.height):K?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt(w),ie,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,ie,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ke(C,w,K){let ue=w.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let oe=n.get(w.depthTexture);oe.__renderTarget=w;let xe=ue?w.depthTexture.image[0]:w.depthTexture.image;(!oe.__webglTexture||xe.width!==w.width||xe.height!==w.height)&&(xe.width=w.width,xe.height=w.height,w.depthTexture.needsUpdate=!0),ue?Me(w.depthTexture,0):de(w.depthTexture,0);let Te=oe.__webglTexture,ne=xt(w),ie=ue?i.TEXTURE_CUBE_MAP_POSITIVE_X+K:i.TEXTURE_2D,_e=w.depthTexture.format===ps?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(w.depthTexture.format===is)be(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,_e,ie,Te,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,_e,ie,Te,0);else if(w.depthTexture.format===ps)be(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,_e,ie,Te,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,_e,ie,Te,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function F(C){let w=n.get(C),K=C.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==C.depthTexture){let ue=C.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ue){let oe=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ue.removeEventListener("dispose",oe)};ue.addEventListener("dispose",oe),w.__depthDisposeCallback=oe}w.__boundDepthTexture=ue}if(C.depthTexture&&!w.__autoAllocateDepthBuffer)if(K)for(let ue=0;ue<6;ue++)ke(w.__webglFramebuffer[ue],C,ue);else C.texture.mipmaps.length>0?ke(w.__webglFramebuffer[0],C,0):ke(w.__webglFramebuffer,C,0);else if(K){w.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[ue]),w.__webglDepthbuffer[ue]===void 0)w.__webglDepthbuffer[ue]=i.createRenderbuffer(),ct(w.__webglDepthbuffer[ue],C,!1);else{let oe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=w.__webglDepthbuffer[ue];i.bindRenderbuffer(i.RENDERBUFFER,xe),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,xe)}}else if(C.texture.mipmaps.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),ct(w.__webglDepthbuffer,C,!1);else{let oe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,xe),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,xe)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Q(C,w,K){let ue=n.get(C);w!==void 0&&we(ue.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),K!==void 0&&F(C)}function ce(C){let w=C.texture,K=n.get(C),ue=n.get(w);C.addEventListener("dispose",V),L(C);let oe=C.textures,xe=C.isWebGLCubeRenderTarget===!0,Te=oe.length>1;if(Te||(ue.__webglTexture===void 0&&(ue.__webglTexture=i.createTexture()),ue.__version=w.version,a.memory.textures++),xe){K.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(w.mipmaps.length>0){K.__webglFramebuffer[ne]=[];for(let ie=0;ie<w.mipmaps.length;ie++)K.__webglFramebuffer[ne][ie]=i.createFramebuffer()}else K.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(w.mipmaps.length>0){K.__webglFramebuffer=[];for(let ne=0;ne<w.mipmaps.length;ne++)K.__webglFramebuffer[ne]=i.createFramebuffer()}else K.__webglFramebuffer=i.createFramebuffer();if(Te)for(let ne=0,ie=oe.length;ne<ie;ne++){let _e=n.get(oe[ne]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&be(C)===!1){K.__webglMultisampledFramebuffer=i.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let ne=0;ne<oe.length;ne++){let ie=oe[ne];K.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,K.__webglColorRenderbuffer[ne]);let _e=r.convert(ie.format,ie.colorSpace),B=r.convert(ie.type),se=A(ie.internalFormat,_e,B,ie.normalized,ie.colorSpace,C.isXRRenderTarget===!0),ee=xt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,ee,se,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,K.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(K.__webglDepthRenderbuffer=i.createRenderbuffer(),ct(K.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(xe){t.bindTexture(i.TEXTURE_CUBE_MAP,ue.__webglTexture),lt(i.TEXTURE_CUBE_MAP,w);for(let ne=0;ne<6;ne++)if(w.mipmaps.length>0)for(let ie=0;ie<w.mipmaps.length;ie++)we(K.__webglFramebuffer[ne][ie],C,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ie);else we(K.__webglFramebuffer[ne],C,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);M(w)?_(i.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}else if(Te){for(let ne=0,ie=oe.length;ne<ie;ne++){let _e=oe[ne],B=n.get(_e),se=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(se=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(se,B.__webglTexture),lt(se,_e),we(K.__webglFramebuffer,C,_e,i.COLOR_ATTACHMENT0+ne,se,0),M(_e)&&_(se)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ne=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,ue.__webglTexture),lt(ne,w),w.mipmaps.length>0)for(let ie=0;ie<w.mipmaps.length;ie++)we(K.__webglFramebuffer[ie],C,w,i.COLOR_ATTACHMENT0,ne,ie);else we(K.__webglFramebuffer,C,w,i.COLOR_ATTACHMENT0,ne,0);M(w)?_(ne):w.mipmaps.length>0&&i.texParameteri(ne,i.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),t.unbindTexture()}C.depthBuffer&&F(C)}function N(C){let w=C.textures;for(let K=0,ue=w.length;K<ue;K++){let oe=w[K];if(M(oe)&&oe.mipmapsAutoUpdate===!0){let xe=E(C),Te=n.get(oe).__webglTexture;t.bindTexture(xe,Te),_(xe),t.unbindTexture()}}}let Ke=[];function Be(C){if(C.samples>0){if(be(C)===!1){let w=C.textures,K=C.width,ue=C.height,oe=i.COLOR_BUFFER_BIT,xe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(C),ne=w.length>1;if(ne)for(let _e=0;_e<w.length;_e++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let _e=0;_e<w.length;_e++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[_e]);let B=n.get(w[_e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,B,0)}i.blitFramebuffer(0,0,K,ue,0,0,K,ue,oe,i.NEAREST),c===!0&&(Ke.length=0,Ke.push(i.COLOR_ATTACHMENT0+_e),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&Ke.push(xe),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ke))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let _e=0;_e<w.length;_e++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,Te.__webglColorRenderbuffer[_e]);let B=n.get(w[_e]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,B,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&c){let w=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function xt(C){return Math.min(s.maxSamples,C.samples)}function be(C){let w=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Xt(C){let w=a.render.frame;h.get(C)!==w&&(h.set(C,w),C.update())}function et(C,w){let K=C.colorSpace,ue=C.format,oe=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||K!==Un&&K!==ui&&(yt.getTransfer(K)===Ct?(ue!==hi||oe!==qn)&&We("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):it("WebGLTextures: Unsupported texture color space:",K)),w}function at(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=Pe,this.resetTextureUnits=G,this.getTextureUnits=q,this.setTextureUnits=le,this.setTexture2D=de,this.setTexture2DArray=Ie,this.setTexture3D=Xe,this.setTextureCube=Me,this.rebindTextures=Q,this.setupRenderTarget=ce,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=F,this.setupFrameBufferTexture=we,this.useMultisampledRTT=be,this.dispose=I}function KM(i,e){function t(n,s=ui){let r,a=yt.getTransfer(s);if(n===qn)return i.UNSIGNED_BYTE;if(n===Bc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===zc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ud)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===dd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===cd)return i.BYTE;if(n===hd)return i.SHORT;if(n===wa)return i.UNSIGNED_SHORT;if(n===Oc)return i.INT;if(n===Ti)return i.UNSIGNED_INT;if(n===ti)return i.FLOAT;if(n===Ei)return i.HALF_FLOAT;if(n===fd)return i.ALPHA;if(n===pd)return i.RGB;if(n===hi)return i.RGBA;if(n===is)return i.DEPTH_COMPONENT;if(n===ps)return i.DEPTH_STENCIL;if(n===Hc)return i.RED;if(n===Gc)return i.RED_INTEGER;if(n===Ds)return i.RG;if(n===Vc)return i.RG_INTEGER;if(n===Wc)return i.RGBA_INTEGER;if(n===Go||n===Vo||n===Wo||n===qo)if(a===Ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Go)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Go)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Wo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===qo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===qc||n===Xc||n===jc||n===Kc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===qc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===jc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Jc||n===Yc||n===Zc||n===$c||n===Qc||n===Xo||n===eh)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Jc||n===Yc)return a===Ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Zc)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===$c)return r.COMPRESSED_R11_EAC;if(n===Qc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Xo)return r.COMPRESSED_RG11_EAC;if(n===eh)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===th||n===nh||n===ih||n===sh||n===rh||n===ah||n===oh||n===lh||n===ch||n===hh||n===uh||n===dh||n===fh||n===ph)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===th)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===nh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ih)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===sh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===rh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ah)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===lh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ch)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===hh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===uh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===dh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fh)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ph)return a===Ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===mh||n===gh||n===bh)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===mh)return a===Ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===gh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===bh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xh||n===yh||n===jo||n===_h)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===xh)return r.COMPRESSED_RED_RGTC1_EXT;if(n===yh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===jo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_h)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===vr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var JM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,YM=`
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

}`,Wd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new So(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ki({vertexShader:JM,fragmentShader:YM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new Mt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},qd=class extends wi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null,y=typeof XRWebGLBinding<"u",g=new Wd,m={},x=t.getContextAttributes(),M=null,_=null,E=[],A=[],b=new he,S=null,L=null,P=new rn;P.viewport=new It;let k=new rn;k.viewport=new It;let V=[P,k],X=new Ic,R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let de=E[Z];return de===void 0&&(de=new la,E[Z]=de),de.getTargetRaySpace()},this.getControllerGrip=function(Z){let de=E[Z];return de===void 0&&(de=new la,E[Z]=de),de.getGripSpace()},this.getHand=function(Z){let de=E[Z];return de===void 0&&(de=new la,E[Z]=de),de.getHandSpace()};function U(Z){let de=A.indexOf(Z.inputSource);if(de===-1)return;let Ie=E[de];Ie!==void 0&&(Ie.update(Z.inputSource,Z.frame,l||a),Ie.dispatchEvent({type:Z.type,data:Z.inputSource}))}function O(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",W);for(let Z=0;Z<E.length;Z++){let de=A[Z];de!==null&&(A[Z]=null,E[Z].disconnect(de))}R=null,I=null,g.reset();for(let Z in m)delete m[Z];if(e.setRenderTarget(M),f=null,d=null,u=null,s=null,_=null,Pe.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(b.width,b.height,!1),L!==null){let Z=L.camera;Z.fov=L.fov,Z.zoom=L.zoom,Z.updateProjectionMatrix(),L=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&We("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&We("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",O),s.addEventListener("inputsourceschange",W),x.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(b),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ie=null,Xe=null,Me=null;x.depth&&(Me=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ie=x.stencil?ps:is,Xe=x.stencil?vr:Ti);let je={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(je),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new $n(d.textureWidth,d.textureHeight,{format:hi,type:qn,depthTexture:new as(d.textureWidth,d.textureHeight,Xe,void 0,void 0,void 0,void 0,void 0,void 0,Ie),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let Ie={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ie),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new $n(f.framebufferWidth,f.framebufferHeight,{format:hi,type:qn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Pe.setContext(s),Pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function W(Z){for(let de=0;de<Z.removed.length;de++){let Ie=Z.removed[de],Xe=A.indexOf(Ie);Xe>=0&&(A[Xe]=null,E[Xe].disconnect(Ie))}for(let de=0;de<Z.added.length;de++){let Ie=Z.added[de],Xe=A.indexOf(Ie);if(Xe===-1){for(let je=0;je<E.length;je++)if(je>=A.length){A.push(Ie),Xe=je;break}else if(A[je]===null){A[je]=Ie,Xe=je;break}if(Xe===-1)break}let Me=E[Xe];Me&&Me.connect(Ie)}}function D(Z,de){de===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(de.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let de=Z.near,Ie=Z.far;g.texture!==null&&(g.depthNear>0&&(de=g.depthNear),g.depthFar>0&&(Ie=g.depthFar)),X.near=k.near=P.near=de,X.far=k.far=P.far=Ie,(R!==X.near||I!==X.far)&&(s.updateRenderState({depthNear:X.near,depthFar:X.far}),R=X.near,I=X.far),X.layers.mask=Z.layers.mask|6,P.layers.mask=X.layers.mask&-5,k.layers.mask=X.layers.mask&-3;let Xe=Z.parent,Me=X.cameras;D(X,Xe);for(let je=0;je<Me.length;je++)D(Me[je],Xe);X.projectionMatrix.copy(P.projectionMatrix),X.projectionMatrixInverse.copy(P.projectionMatrixInverse),L===null&&Z.isPerspectiveCamera&&(L={camera:Z,fov:Z.fov,zoom:Z.zoom}),G(Z,X,Xe)};function G(Z,de,Ie){Ie===null?Z.matrix.copy(de.matrixWorld):(Z.matrix.copy(Ie.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(de.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(de.projectionMatrix),Z.projectionMatrixInverse.copy(de.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=rr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return X},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(X)},this.getCameraTexture=function(Z){return m[Z]};let q=null;function le(Z,de){if(h=de.getViewerPose(l||a),p=de,h!==null){let Ie=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let Xe=!1;Ie.length!==X.cameras.length&&(X.cameras.length=0,Xe=!0);for(let Ze=0;Ze<Ie.length;Ze++){let lt=Ie[Ze],ft=null;if(f!==null)ft=f.getViewport(lt);else{let ge=u.getViewSubImage(d,lt);ft=ge.viewport,Ze===0&&(e.setRenderTargetTextures(_,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(_))}let ae=V[Ze];ae===void 0&&(ae=new rn,ae.layers.enable(Ze),ae.viewport=new It,V[Ze]=ae),ae.matrix.fromArray(lt.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(lt.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(ft.x,ft.y,ft.width,ft.height),Ze===0&&(X.matrix.copy(ae.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale)),Xe===!0&&X.cameras.push(ae)}let Me=s.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){u=n.getBinding();let Ze=u.getDepthInformation(Ie[0]);Ze&&Ze.isValid&&Ze.texture&&g.init(Ze,s.renderState)}if(Me&&Me.includes("camera-access")&&y){e.state.unbindTexture(),u=n.getBinding();for(let Ze=0;Ze<Ie.length;Ze++){let lt=Ie[Ze].camera;if(lt){let ft=m[lt];ft||(ft=new So,m[lt]=ft);let ae=u.getCameraImage(lt);ft.sourceTexture=ae}}}}for(let Ie=0;Ie<E.length;Ie++){let Xe=A[Ie],Me=E[Ie];Xe!==null&&Me!==void 0&&Me.update(Xe,de,l||a)}q&&q(Z,de),de.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:de}),p=null}let Pe=new E0;Pe.setAnimationLoop(le),this.setAnimationLoop=function(Z){q=Z},this.dispose=function(){}}},ZM=new st,k0=new ot;k0.set(-1,0,0,0,1,0,0,0,1);function $M(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Ad(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,x,M,_){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,_)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),y(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?c(g,m,x,M):m.isSpriteMaterial?l(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===_n&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===_n&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let x=e.get(m),M=x.envMap,_=x.envMapRotation;M&&(g.envMap.value=M,g.envMapRotation.value.setFromMatrix4(ZM.makeRotationFromEuler(_)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(k0),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,x,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*x,g.scale.value=M*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function l(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,x){g.ior.value=m.ior,m.diffuseRoughness>0&&(g.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=m.diffuseRoughnessMap,t(m.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===_n&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function y(g,m){let x=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function QM(i,e,t,n){let s={},r={};function a(x,M){let _=M.program;n.uniformBlockBinding(x,_,s[x.id])}function o(x,M){let _=s[x.id];_===void 0&&(p(x),_=c(x),s[x.id]=_,x.addEventListener("dispose",g));let E=M.program;n.updateUBOMapping(x,E);let A=e.render.frame;r[x.id]!==A&&(l(x),r[x.id]=A)}function c(x){let M=i.createBuffer(),_=x.__size,E=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,_,E),i.bindBuffer(i.UNIFORM_BUFFER,null),M}function l(x){let M=s[x.id],_=x.uniforms,E=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let A=0,b=_.length;A<b;A++){let S=_[A];if(Array.isArray(S))for(let L=0,P=S.length;L<P;L++)h(S[L],A,L,E);else h(S,A,0,E)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(x,M,_,E){if(d(x,M,_,E)===!0){let A=x.__offset,b=x.value;if(Array.isArray(b)){let S=0;for(let L=0;L<b.length;L++){let P=b[L],k=y(P,!0);u(P,x.__data,S),S+=k.storage/Float32Array.BYTES_PER_ELEMENT}}else u(b,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,A,x.__data)}}function u(x,M,_){typeof x=="number"||typeof x=="boolean"?M[_]=x:x.isMatrix3?(M[_]=x.elements[0],M[_+1]=x.elements[1],M[_+2]=x.elements[2],M[_+3]=0,M[_+4]=x.elements[3],M[_+5]=x.elements[4],M[_+6]=x.elements[5],M[_+7]=0,M[_+8]=x.elements[6],M[_+9]=x.elements[7],M[_+10]=x.elements[8],M[_+11]=0):ArrayBuffer.isView(x)?M.set(x.subarray(0,M.length-_),_):x.toArray(M,_)}function d(x,M,_,E){let A=x.value,b=M+"_"+_;if(Array.isArray(A)){E[b]===void 0&&(E[b]=[]);let S=E[b],L=!1;for(let P=0;P<A.length;P++)f(A[P],S,P)===!0&&(L=!0);return L}return f(A,E,b)}function f(x,M,_){if(M[_]===void 0)return typeof x=="number"||typeof x=="boolean"?M[_]=x:ArrayBuffer.isView(x)?M[_]=x.slice():M[_]=x.clone(),!0;{let E=M[_];if(typeof x=="number"||typeof x=="boolean"){if(E!==x)return M[_]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(E.equals(x)===!1)return E.copy(x),!0}}return!1}function p(x){let M=x.uniforms,_=0,E=16;for(let b=0,S=M.length;b<S;b++){let L=Array.isArray(M[b])?M[b]:[M[b]];for(let P=0,k=L.length;P<k;P++){let V=L[P],X=Array.isArray(V.value)?V.value:[V.value],R=Array.isArray(M[b])||Array.isArray(V.value),I=_;for(let O=0,W=X.length;O<W;O++){let D=X[O],G=y(D,R),q=_%E,le=q%G.boundary,Pe=q+le;_+=le,Pe!==0&&E-Pe<G.storage&&(_+=E-Pe),O===0&&(I=_),_+=G.storage}let U=V.type==="int"?Int32Array:V.type==="uint"?Uint32Array:Float32Array;V.__data=new U((_-I)/Float32Array.BYTES_PER_ELEMENT),V.__offset=I}}let A=_%E;return A>0&&(_+=E-A),x.__size=_,x.__cache={},this}function y(x,M){let _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=16,_.storage=48):x.isMatrix4?(_.boundary=16,_.storage=64):x.isTexture?We("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(_.boundary=16,_.storage=x.byteLength):We("WebGLRenderer: Unsupported uniform value type.",x),M===!0&&(_.boundary=16,_.storage=Math.ceil(_.storage/16)*16),_}function g(x){let M=x.target;M.removeEventListener("dispose",g),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function m(){for(let x in s)i.deleteBuffer(s[x]);s={},r={}}return{bind:a,update:o,dispose:m}}var eS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Hi=null;function tS(){return Hi===null&&(Hi=new ua(eS,16,16,Ds,Ei),Hi.name="DFG_LUT",Hi.minFilter=an,Hi.magFilter=an,Hi.wrapS=Cn,Hi.wrapT=Cn,Hi.generateMipmaps=!1,Hi.needsUpdate=!0),Hi}var Ch=class{constructor(e={}){let{canvas:t=Xm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=qn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let y=f,g=new Set([Wc,Vc,Gc]),m=new Set([qn,Ti,wa,vr,Bc,zc]),x=new Uint32Array(4),M=new Int32Array(4),_={textures:[],min:[],max:[],resolution:[]},E=null,A=null,b=[],S=[],L=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,k=!1,V=null,X=null,R=null,I=null;this._outputColorSpace=Gt;let U=0,O=0,W=null,D=-1,G=null,q=new It,le=new It,Pe=null,Z=new qe(0),de=0,Ie=t.width,Xe=t.height,Me=1,je=null,Rt=null,Ze=new It(0,0,Ie,Xe),lt=new It(0,0,Ie,Xe),ft=!1,ae=new Rs,ge=new dc,me=!1,Ne=!1,we=new st,ct=new z,ke=new It,F={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Q=!1;function ce(){return W===null?Me:1}let N=n;function Ke(T,H){return t.getContext(T,H)}let Be,xt,be,Xt,et,at,C,w,K,ue,oe,xe,Te,ne,ie,_e,B,se,ee,ve,pe,ye,Je;try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"187"}`),t.addEventListener("webglcontextlost",$e,!1),t.addEventListener("webglcontextrestored",pt,!1),t.addEventListener("webglcontextcreationerror",Le,!1),N===null){let H="webgl2";if(N=Ke(H,T),N===null)throw Ke(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}mt()}catch(T){throw t.removeEventListener("webglcontextlost",$e,!1),t.removeEventListener("webglcontextrestored",pt,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),it("WebGLRenderer: "+T.message),T}function mt(){Be=new dv(N),Be.init(),pe=new KM(N,Be),xt=new tv(N,Be,e,pe),be=new XM(N,Be),xt.reversedDepthBuffer&&d&&be.buffers.depth.setReversed(!0),X=N.createFramebuffer(),R=N.createFramebuffer(),I=N.createFramebuffer(),Xt=new mv(N),et=new LM,at=new jM(N,Be,be,et,xt,pe,Xt),C=new uv(P),w=new bx(N),ye=new Q_(N,w),K=new fv(N,w,Xt,ye),ue=new bv(N,K,w,ye,Xt),se=new gv(N,xt,at),ie=new nv(et),oe=new IM(P,C,Be,xt,ye,ie),xe=new $M(P,et),Te=new NM,ne=new zM(Be),B=new $_(P,C,be,ue,p,c),_e=new qM(P,ue,xt),Je=new QM(N,Xt,xt,be),ee=new ev(N,Be,Xt),ve=new pv(N,Be,Xt),Xt.programs=oe.programs,P.capabilities=xt,P.extensions=Be,P.properties=et,P.renderLists=Te,P.shadowMap=_e,P.state=be,P.info=Xt}y!==qn&&(L=new yv(y,t.width,t.height,o,s,r));let fe=new qd(P,N);this.xr=fe,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let T=Be.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=Be.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(T){T!==void 0&&(Me=T,this.setSize(Ie,Xe,!1))},this.getSize=function(T){return T.set(Ie,Xe)},this.setSize=function(T,H,$=!0){if(fe.isPresenting){We("WebGLRenderer: Can't change size while VR device is presenting.");return}Ie=T,Xe=H,t.width=Math.floor(T*Me),t.height=Math.floor(H*Me),$===!0&&(t.style.width=T+"px",t.style.height=H+"px"),L!==null&&L.setSize(t.width,t.height),this.setViewport(0,0,T,H)},this.getDrawingBufferSize=function(T){return T.set(Ie*Me,Xe*Me).floor()},this.setDrawingBufferSize=function(T,H,$){Ie=T,Xe=H,Me=$,t.width=Math.floor(T*$),t.height=Math.floor(H*$),this.setViewport(0,0,T,H)},this.setEffects=function(T){if(y===qn){it("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let H=0;H<T.length;H++)if(T[H].isOutputPass===!0){We("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}L.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(q)},this.getViewport=function(T){return T.copy(Ze)},this.setViewport=function(T,H,$,j){T.isVector4?Ze.set(T.x,T.y,T.z,T.w):Ze.set(T,H,$,j),be.viewport(q.copy(Ze).multiplyScalar(ce()).round())},this.getScissor=function(T){return T.copy(lt)},this.setScissor=function(T,H,$,j){T.isVector4?lt.set(T.x,T.y,T.z,T.w):lt.set(T,H,$,j),be.scissor(le.copy(lt).multiplyScalar(ce()).round())},this.getScissorTest=function(){return ft},this.setScissorTest=function(T){be.setScissorTest(ft=T)},this.setOpaqueSort=function(T){je=T},this.setTransparentSort=function(T){Rt=T},this.getClearColor=function(T){return T.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor(...arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha(...arguments)},this.clear=function(T=!0,H=!0,$=!0){let j=0;if(T){let J=!1;if(W!==null){let Ee=W.texture.format;J=g.has(Ee)}if(J){let Ee=W.texture.type,Oe=m.has(Ee),Se=B.getClearColor(),Fe=B.getClearAlpha(),Ve=Se.r,ut=Se.g,St=Se.b;Oe?(x[0]=Ve,x[1]=ut,x[2]=St,x[3]=Fe,N.clearBufferuiv(N.COLOR,0,x)):(M[0]=Ve,M[1]=ut,M[2]=St,M[3]=Fe,N.clearBufferiv(N.COLOR,0,M))}else j|=N.COLOR_BUFFER_BIT}H&&(j|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(j|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),j!==0&&N.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),V=T},this.dispose=function(){t.removeEventListener("webglcontextlost",$e,!1),t.removeEventListener("webglcontextrestored",pt,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),B.dispose(),Te.dispose(),ne.dispose(),at.dispose(),et.dispose(),C.dispose(),ue.dispose(),K.dispose(),ye.dispose(),Je.dispose(),oe.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",lp),fe.removeEventListener("sessionend",cp),js.stop()};function $e(T){T.preventDefault(),lo("WebGLRenderer: Context Lost."),k=!0}function pt(){lo("WebGLRenderer: Context Restored."),k=!1;let T=Xt.autoReset,H=_e.enabled,$=_e.autoUpdate,j=_e.needsUpdate,J=_e.type;mt(),Xt.autoReset=T,_e.enabled=H,_e.autoUpdate=$,_e.needsUpdate=j,_e.type=J}function Le(T){it("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Pt(T){let H=T.target;H.removeEventListener("dispose",Pt),cn(H)}function cn(T){ys(T),et.remove(T)}function ys(T){let H=et.get(T).programs;H!==void 0&&(H.forEach(function($){oe.releaseProgram($)}),T.isShaderMaterial&&oe.releaseShaderCache(T))}this.renderBufferDirect=function(T,H,$,j,J,Ee){H===null&&(H=F);let Oe=J.isMesh&&J.matrixWorld.determinantAffine()<0,Se=Ug(T,H,$,j,J);be.setMaterial(j,Oe);let Fe=$.index,Ve=1;if(j.wireframe===!0){if(Fe=K.getWireframeAttribute($),Fe===void 0)return;Ve=2}let ut=$.drawRange,St=$.attributes.position,ze=ut.start*Ve,wt=(ut.start+ut.count)*Ve;Ee!==null&&(ze=Math.max(ze,Ee.start*Ve),wt=Math.min(wt,(Ee.start+Ee.count)*Ve)),Fe!==null?(ze=Math.max(ze,0),wt=Math.min(wt,Fe.count)):St!=null&&(ze=Math.max(ze,0),wt=Math.min(wt,St.count));let en=wt-ze;if(en<0||en===1/0)return;ye.setup(J,j,Se,$,Fe);let kt,Nt=ee;if(Fe!==null&&(kt=w.get(Fe),Nt=ve,Nt.setIndex(kt)),J.isMesh)j.wireframe===!0?(be.setLineWidth(j.wireframeLinewidth*ce()),Nt.setMode(N.LINES)):Nt.setMode(N.TRIANGLES);else if(J.isLine){let Tn=j.linewidth;Tn===void 0&&(Tn=1),be.setLineWidth(Tn*ce()),J.isLineSegments?Nt.setMode(N.LINES):J.isLineLoop?Nt.setMode(N.LINE_LOOP):Nt.setMode(N.LINE_STRIP)}else J.isPoints?Nt.setMode(N.POINTS):J.isSprite&&Nt.setMode(N.TRIANGLES);if(J.isBatchedMesh)if(Be.get("WEBGL_multi_draw"))Nt.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{let Tn=J._multiDrawStarts,He=J._multiDrawCounts,Fn=J._multiDrawCount,At=Fe?w.get(Fe).bytesPerElement:1,Ks=et.get(j).currentProgram.getUniforms();for(let En=0;En<Fn;En++)Ks.setValue(N,"_gl_DrawID",En),Nt.render(Tn[En]/At,He[En])}else if(J.isInstancedMesh)Nt.renderInstances(ze,en,J.count);else if($.isInstancedBufferGeometry){let Tn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,He=Math.min($.instanceCount,Tn);Nt.renderInstances(ze,en,He)}else Nt.render(ze,en)};function op(T,H,$,j){V!==null&&T.isNodeMaterial&&V.setObject(j,T),me===!0&&ie.setState(T,$,!1),T.transparent===!0&&T.side===Bt&&T.forceSinglePass===!1?(T.side=_n,T.needsUpdate=!0,Ga(T,H,j),T.side=Bi,T.needsUpdate=!0,Ga(T,H,j),T.side=Bt):Ga(T,H,j)}this.compile=function(T,H,$=null){$===null&&($=T),V!==null&&V.renderStart(T,H,$),A=ne.get($),A.init(H),S.push(A),$.traverseVisible(function(J){J.isLight&&J.layers.test(H.layers)&&(A.pushLight(J),J.castShadow&&A.pushShadow(J))}),T!==$&&T.traverseVisible(function(J){J.isLight&&J.layers.test(H.layers)&&(A.pushLight(J),J.castShadow&&A.pushShadow(J))}),A.setupLights(),V!==null&&V.updateLights(A.state.lightsArray),Ne=this.localClippingEnabled,me=ie.init(this.clippingPlanes,Ne),me===!0&&ie.setGlobalState(this.clippingPlanes,H),V!==null&&_e.render(A.state.shadowsArray,$,H);let j=new Set;return T.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;let Ee=J.material;if(Ee)if(Array.isArray(Ee))for(let Oe=0;Oe<Ee.length;Oe++){let Se=Ee[Oe];op(Se,$,H,J),j.add(Se)}else op(Ee,$,H,J),j.add(Ee)}),A=S.pop(),V!==null&&V.renderEnd(),j},this.compileAsync=function(T,H,$=null){let j=this.compile(T,H,$);return new Promise(J=>{function Ee(){if(j.forEach(function(Oe){let Fe=et.get(Oe).currentProgram;(Fe===void 0||Fe.isReady())&&j.delete(Oe)}),j.size===0){J(T);return}setTimeout(Ee,10)}Be.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let ou=null;function Fg(T){ou&&ou(T)}function lp(){js.stop()}function cp(){js.start()}let js=new E0;js.setAnimationLoop(Fg),typeof self<"u"&&js.setContext(self),this.setAnimationLoop=function(T){ou=T,fe.setAnimationLoop(T),T===null?js.stop():js.start()},fe.addEventListener("sessionstart",lp),fe.addEventListener("sessionend",cp),this.render=function(T,H){if(H!==void 0&&H.isCamera!==!0){it("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;V!==null&&V.renderStart(T,H);let $=fe.enabled===!0&&fe.isPresenting===!0,j=L!==null&&(W===null||$)&&L.begin(P,W);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(L===null||L.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(H),H=fe.getCamera()),T.isScene===!0&&T.onBeforeRender(P,T,H,W),A=ne.get(T,S.length),A.init(H),A.state.textureUnits=at.getTextureUnits(),S.push(A),we.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),H.isArrayCamera?ge.setFromArrayCamera(H):ae.setFromProjectionMatrix(we,ri,H.reversedDepth),Ne=this.localClippingEnabled,me=ie.init(this.clippingPlanes,Ne),E=Te.get(T,b.length),E.init(),b.push(E),this.info.render.frame++,fe.enabled===!0&&fe.isPresenting===!0){let Oe=P.xr.getDepthSensingMesh();Oe!==null&&lu(Oe,H,-1/0,P.sortObjects)}lu(T,H,0,P.sortObjects),E.finish(),V!==null&&V.updateLights(A.state.lightsArray),P.sortObjects===!0&&E.sort(je,Rt),Q=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,Q&&B.addToRenderList(E,T),this.info.autoReset===!0&&this.info.reset(),me===!0&&ie.beginShadows();let J=A.state.shadowsArray;if(_e.render(J,T,H),me===!0&&ie.endShadows(),(j&&L.hasRenderPass())===!1){let Oe=E.opaque,Se=E.transmissive;if(A.setupLights(),H.isArrayCamera){let Fe=H.cameras;if(Se.length>0)for(let Ve=0,ut=Fe.length;Ve<ut;Ve++){let St=Fe[Ve];up(Oe,Se,T,St)}Q&&B.render(T);for(let Ve=0,ut=Fe.length;Ve<ut;Ve++){let St=Fe[Ve];hp(E,T,St,St.viewport)}}else Se.length>0&&up(Oe,Se,T,H),Q&&B.render(T),hp(E,T,H)}W!==null&&O===0&&(at.updateMultisampleRenderTarget(W),at.updateRenderTargetMipmap(W)),j&&L.end(P),T.isScene===!0&&T.onAfterRender(P,T,H),ye.resetDefaultState(),D=-1,G=null,S.pop(),S.length>0?(A=S[S.length-1],at.setTextureUnits(A.state.textureUnits),me===!0&&ie.setGlobalState(P.clippingPlanes,A.state.camera)):A=null,b.pop(),b.length>0?E=b[b.length-1]:E=null,V!==null&&V.renderEnd()};function lu(T,H,$,j){if(T.visible===!1)return;if(T.layers.test(H.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(H);else if(T.isLight)A.pushLight(T),T.castShadow&&A.pushShadow(T);else if(T.isSprite){let Oe=H.isArrayCamera?ge:ae;if(!T.frustumCulled||T.intersectsFrustum(Oe)){j&&ke.setFromMatrixPosition(T.matrixWorld).applyMatrix4(we);let Se=ue.update(T),Fe=T.material;Fe.visible&&E.push(T,Se,Fe,$,ke.z,null,H)}}else if(T.isMesh||T.isLine||T.isPoints){let Oe=H.isArrayCamera?ge:ae;if(!T.frustumCulled||T.intersectsFrustum(Oe)){let Se=ue.update(T),Fe=T.material;if(j&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ke.copy(T.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),ke.copy(Se.boundingSphere.center)),ke.applyMatrix4(T.matrixWorld).applyMatrix4(we)),Array.isArray(Fe)){let Ve=Se.groups;for(let ut=0,St=Ve.length;ut<St;ut++){let ze=Ve[ut],wt=Fe[ze.materialIndex];wt&&wt.visible&&E.push(T,Se,wt,$,ke.z,ze,H)}}else Fe.visible&&E.push(T,Se,Fe,$,ke.z,null,H)}}}let Ee=T.children;for(let Oe=0,Se=Ee.length;Oe<Se;Oe++)lu(Ee[Oe],H,$,j)}function hp(T,H,$,j){let{opaque:J,transmissive:Ee,transparent:Oe}=T;A.setupLightsView($),me===!0&&ie.setGlobalState(P.clippingPlanes,$),j&&be.viewport(q.copy(j)),J.length>0&&Ml(J,H,$),Ee.length>0&&Ml(Ee,H,$),Oe.length>0&&Ml(Oe,H,$),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function up(T,H,$,j){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[j.id]===void 0){let ze=Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[j.id]=new $n(1,1,{generateMipmaps:!0,type:ze?Ei:qn,minFilter:ci,samples:Math.max(4,xt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:yt.workingColorSpace})}let Ee=A.state.transmissionRenderTarget[j.id],Oe=j.viewport||q;Ee.setSize(Oe.z*P.transmissionResolutionScale,Oe.w*P.transmissionResolutionScale);let Se=P.getRenderTarget(),Fe=P.getActiveCubeFace(),Ve=P.getActiveMipmapLevel();P.setRenderTarget(Ee),P.getClearColor(Z),de=P.getClearAlpha(),de<1&&P.setClearColor(16777215,.5),P.clear(),Q&&B.render($);let ut=P.toneMapping;P.toneMapping=zi;let St=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),A.setupLightsView(j),me===!0&&ie.setGlobalState(P.clippingPlanes,j),Ml(T,$,j),at.updateMultisampleRenderTarget(Ee),at.updateRenderTargetMipmap(Ee),Be.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let wt=0,en=H.length;wt<en;wt++){let kt=H[wt],{object:Nt,geometry:Tn,material:He,group:Fn}=kt;if(He.side===Bt&&Nt.layers.test(j.layers)){let At=He.side;He.side=_n,He.needsUpdate=!0,dp(Nt,$,j,Tn,He,Fn),He.side=At,He.needsUpdate=!0,ze=!0}}ze===!0&&(at.updateMultisampleRenderTarget(Ee),at.updateRenderTargetMipmap(Ee))}P.setRenderTarget(Se,Fe,Ve),P.setClearColor(Z,de),St!==void 0&&(j.viewport=St),P.toneMapping=ut}function Ml(T,H,$){let j=H.isScene===!0?H.overrideMaterial:null;for(let J=0,Ee=T.length;J<Ee;J++){let Oe=T[J],{object:Se,geometry:Fe,group:Ve}=Oe,ut=Oe.material;ut.allowOverride===!0&&j!==null&&(ut=j),Se.layers.test($.layers)&&dp(Se,H,$,Fe,ut,Ve)}}function dp(T,H,$,j,J,Ee){V!==null&&J.isNodeMaterial&&V.setObject(T,J),T.onBeforeRender(P,H,$,j,J,Ee),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),J.onBeforeRender(P,H,$,j,T,Ee),J.transparent===!0&&J.side===Bt&&J.forceSinglePass===!1?(J.side=_n,J.needsUpdate=!0,P.renderBufferDirect($,H,j,J,T,Ee),J.side=Bi,J.needsUpdate=!0,P.renderBufferDirect($,H,j,J,T,Ee),J.side=Bt):P.renderBufferDirect($,H,j,J,T,Ee),T.onAfterRender(P,H,$,j,J,Ee)}function fp(T){let H=0;for(let $ of T)$.texture!==null&&H++;return H}function Ga(T,H,$){H.isScene!==!0&&(H=F);let j=et.get(T),J=A.state.lights,Ee=A.state.shadowsArray,Oe=J.state.version,Se=oe.getParameters(T,J.state,Ee,H,$,A.state.lightProbeGridArray),Fe=oe.getProgramCacheKey(Se),Ve=j.programs;j.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?H.environment:null,j.fog=H.fog;let ut=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;j.envMap=C.get(T.envMap||j.environment,ut),j.envMapRotation=j.environment!==null&&T.envMap===null?H.environmentRotation:T.envMapRotation,Ve===void 0&&(T.addEventListener("dispose",Pt),Ve=new Map,j.programs=Ve,j.programVariants=new Map);let St=Ve.get(Fe);if(St!==void 0){if(j.currentProgram===St&&j.lightsStateVersion===Oe)return mp(T,Se),St}else Se.uniforms=oe.getUniforms(T),V!==null&&T.isNodeMaterial&&V.build(T,$,Se),T.onBeforeCompile(Se,P),St=oe.acquireProgram(Se,Fe),Ve.set(Fe,St),j.uniforms=Se.uniforms;let ze=j.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(ze.clippingPlanes=ie.uniform),mp(T,Se),j.needsLights=Bg(T),j.lightsStateVersion=Oe,j.needsLights&&(ze.ambientLightColor.value=J.state.ambient,ze.lightProbe.value=J.state.probe,ze.sunLights.value=J.state.sun,ze.sunLightShadows.value=J.state.sunShadow,ze.directionalLights.value=J.state.directional,ze.directionalLightShadows.value=J.state.directionalShadow,ze.spotLights.value=J.state.spot,ze.spotLightShadows.value=J.state.spotShadow,ze.rectAreaLights.value=J.state.rectArea,ze.ltc_1.value=J.state.rectAreaLTC1,ze.ltc_2.value=J.state.rectAreaLTC2,ze.pointLights.value=J.state.point,ze.pointLightShadows.value=J.state.pointShadow,ze.hemisphereLights.value=J.state.hemi,ze.sunShadowMatrix.value=J.state.sunShadowMatrix,ze.sunShadowCascade.value=J.state.sunShadowCascade,ze.directionalShadowMatrix.value=J.state.directionalShadowMatrix,ze.spotLightMatrix.value=J.state.spotLightMatrix,ze.spotLightMap.value=J.state.spotLightMap,ze.pointShadowMatrix.value=J.state.pointShadowMatrix),j.numLightProbeGrids=fp(A.state.lightProbeGridArray),j.currentProgram=St,j.uniformsList=null,St}function kg(T,H,$,j,J){let Ee=et.get(T),Oe=Ee.currentProgram.id+","+j+","+J,Se=Ee.programVariants.get(Oe);return Se===void 0?(Se=Ga(T,H,$),Ee.programVariants.set(Oe,Se)):(Ee.currentProgram=Se,Ee.uniformsList=null,Ee.outputColorSpace=j,Ee.toneMapping=J),Se}function pp(T){if(T.uniformsList===null){let H=T.currentProgram.getUniforms();T.uniformsList=Ea.seqWithValue(H.seq,T.uniforms)}return T.uniformsList}function mp(T,H){let $=et.get(T);$.outputColorSpace=H.outputColorSpace,$.batching=H.batching,$.batchingColor=H.batchingColor,$.instancing=H.instancing,$.instancingColor=H.instancingColor,$.instancingMorph=H.instancingMorph,$.skinning=H.skinning,$.morphTargets=H.morphTargets,$.morphNormals=H.morphNormals,$.morphColors=H.morphColors,$.morphTargetsCount=H.morphTargetsCount,$.numClippingPlanes=H.numClippingPlanes,$.numIntersection=H.numClipIntersection,$.vertexAlphas=H.vertexAlphas,$.vertexTangents=H.vertexTangents,$.toneMapping=H.toneMapping}function Ug(T,H,$,j,J){H.isScene!==!0&&(H=F),at.resetTextureUnits();let Ee=H.fog,Oe=j.isMeshStandardMaterial||j.isMeshLambertMaterial||j.isMeshPhongMaterial?H.environment:null,Se=W===null?P.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:yt.workingColorSpace,Fe=j.isMeshStandardMaterial||j.isMeshLambertMaterial&&!j.envMap||j.isMeshPhongMaterial&&!j.envMap,Ve=C.get(j.envMap||Oe,Fe),ut=j.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,St=!!$.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),ze=!!$.morphAttributes.position,wt=!!$.morphAttributes.normal,en=!!$.morphAttributes.color,kt=zi;j.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(kt=P.toneMapping);let Nt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Tn=Nt!==void 0?Nt.length:0,He=et.get(j),Fn=A.state.lights;if(me===!0&&(Ne===!0||T!==G)){let Vt=T===G&&j.id===D;ie.setState(j,T,Vt)}let At=!1,Ks=!1;j.version===He.__version?He.needsLights&&He.lightsStateVersion!==Fn.state.version||J.isBatchedMesh&&He.batching===!1||!J.isBatchedMesh&&He.batching===!0||J.isBatchedMesh&&He.batchingColor===!0&&J._colorsTexture===null||J.isBatchedMesh&&He.batchingColor===!1&&J._colorsTexture!==null||J.isInstancedMesh&&He.instancing===!1||!J.isInstancedMesh&&He.instancing===!0||J.isSkinnedMesh&&He.skinning===!1||!J.isSkinnedMesh&&He.skinning===!0||J.isInstancedMesh&&He.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&He.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&He.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&He.instancingMorph===!1&&J.morphTexture!==null||He.envMap!==Ve||j.fog===!0&&He.fog!==Ee||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==ie.numPlanes||He.numIntersection!==ie.numIntersection)||He.vertexAlphas!==ut||He.vertexTangents!==St||He.morphTargets!==ze||He.morphNormals!==wt||He.morphColors!==en||He.morphTargetsCount!==Tn||He.numLightProbeGrids!==fp(A.state.lightProbeGridArray)?At=!0:(He.outputColorSpace!==Se||He.toneMapping!==kt)&&(Ks=!0):(At=!0,He.__version=j.version);let En=He.currentProgram;(At===!0||Ks===!0)&&(En=Ks===!0?kg(j,H,J,Se,kt):Ga(j,H,J),V&&j.isNodeMaterial&&V.onUpdateProgram(j,En,He));let Sl=!1,_s=!1,Js=!1,Et=En.getUniforms(),xn=He.uniforms;if(be.useProgram(En.program)&&(Sl=!0,_s=!0,Js=!0),j.id!==D&&(D=j.id,_s=!0),Sl||G!==T){be.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Et.setValue(N,"projectionMatrix",T.projectionMatrix),Et.setValue(N,"viewMatrix",T.matrixWorldInverse);let hn=Et.map.cameraPosition;hn!==void 0&&hn.setValue(N,ct.setFromMatrixPosition(T.matrixWorld)),xt.logarithmicDepthBuffer&&Et.setValue(N,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Et.setValue(N,"isOrthographic",T.isOrthographicCamera===!0),G!==T&&(G=T,_s=!0,Js=!0)}if(He.needsLights&&(Fn.state.sunShadowMap.length>0&&Et.setValue(N,"sunShadowMap",Fn.state.sunShadowMap,at),Fn.state.directionalShadowMap.length>0&&Et.setValue(N,"directionalShadowMap",Fn.state.directionalShadowMap,at),Fn.state.spotShadowMap.length>0&&Et.setValue(N,"spotShadowMap",Fn.state.spotShadowMap,at),Fn.state.pointShadowMap.length>0&&Et.setValue(N,"pointShadowMap",Fn.state.pointShadowMap,at)),J.isSkinnedMesh){Et.setOptional(N,J,"bindMatrix"),Et.setOptional(N,J,"bindMatrixInverse");let Vt=J.skeleton;Vt&&(Vt.boneTexture===null&&Vt.computeBoneTexture(),Et.setValue(N,"boneTexture",Vt.boneTexture,at))}J.isBatchedMesh&&(Et.setOptional(N,J,"batchingTexture"),Et.setValue(N,"batchingTexture",J._matricesTexture,at),Et.setOptional(N,J,"batchingIdTexture"),Et.setValue(N,"batchingIdTexture",J._indirectTexture,at),Et.setOptional(N,J,"batchingColorTexture"),J._colorsTexture!==null&&Et.setValue(N,"batchingColorTexture",J._colorsTexture,at));let yi=$.morphAttributes;if((yi.position!==void 0||yi.normal!==void 0||yi.color!==void 0)&&se.update(J,$,En),(_s||He.receiveShadow!==J.receiveShadow)&&(He.receiveShadow=J.receiveShadow,Et.setValue(N,"receiveShadow",J.receiveShadow)),(j.isMeshStandardMaterial||j.isMeshLambertMaterial||j.isMeshPhongMaterial)&&j.envMap===null&&H.environment!==null&&(xn.envMapIntensity.value=H.environmentIntensity),xn.dfgLUT!==void 0&&(xn.dfgLUT.value=tS()),_s){if(Et.setValue(N,"toneMappingExposure",P.toneMappingExposure),He.needsLights&&Og(xn,Js),Ee&&j.fog===!0&&xe.refreshFogUniforms(xn,Ee),xe.refreshMaterialUniforms(xn,j,Me,Xe,A.state.transmissionRenderTarget[T.id]),He.needsLights&&He.numLightProbeGrids>0){let Vt=_,hn=0;for(let Ki of A.state.lightProbeGridArray)Ki.texture!==null&&(Vt.textures[hn]=Ki.texture,Vt.min[hn]=Ki.boundingBox.min,Vt.max[hn]=Ki.boundingBox.max,Vt.resolution[hn]=Ki.resolution,hn++);for(let Ki in Vt)Vt[Ki].length=hn;xn.probesSH.value=Vt.textures,xn.probesMin.value=Vt.min,xn.probesMax.value=Vt.max,xn.probesResolution.value=Vt.resolution}Ea.upload(N,pp(He),xn,at)}if(j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Ea.upload(N,pp(He),xn,at),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Et.setValue(N,"center",J.center),Et.setValue(N,"modelViewMatrix",J.modelViewMatrix),Et.setValue(N,"normalMatrix",J.normalMatrix),Et.setValue(N,"modelMatrix",J.matrixWorld),j.uniformsGroups!==void 0){let Vt=j.uniformsGroups;for(let hn=0,Ki=Vt.length;hn<Ki;hn++){let bp=Vt[hn];Je.update(bp,En),Je.bind(bp,En)}}return En}function Og(T,H){T.ambientLightColor.needsUpdate=H,T.lightProbe.needsUpdate=H,T.sunLights.needsUpdate=H,T.sunLightShadows.needsUpdate=H,T.directionalLights.needsUpdate=H,T.directionalLightShadows.needsUpdate=H,T.pointLights.needsUpdate=H,T.pointLightShadows.needsUpdate=H,T.spotLights.needsUpdate=H,T.spotLightShadows.needsUpdate=H,T.rectAreaLights.needsUpdate=H,T.hemisphereLights.needsUpdate=H}function Bg(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(T,H,$){let j=et.get(T);j.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),et.get(T.texture).__webglTexture=H,et.get(T.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:$,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,H){let $=et.get(T);$.__webglFramebuffer=H,$.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(T,H=0,$=0){W=T,U=H,O=$;let j=null,J=!1,Ee=!1;if(T){let Se=et.get(T);if(Se.__useDefaultFramebuffer!==void 0){be.bindFramebuffer(N.FRAMEBUFFER,Se.__webglFramebuffer),q.copy(T.viewport),le.copy(T.scissor),Pe=T.scissorTest,be.viewport(q),be.scissor(le),be.setScissorTest(Pe),D=-1;return}else if(Se.__webglFramebuffer===void 0)at.setupRenderTarget(T);else if(Se.__hasExternalTextures)at.rebindTextures(T,et.get(T.texture).__webglTexture,et.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let ut=T.depthTexture;if(Se.__boundDepthTexture!==ut){if(ut!==null&&et.has(ut)&&(T.width!==ut.image.width||T.height!==ut.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");at.setupDepthRenderbuffer(T)}}let Fe=T.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(Ee=!0);let Ve=et.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ve[H])?j=Ve[H][$]:j=Ve[H],J=!0):T.samples>0&&at.useMultisampledRTT(T)===!1?j=et.get(T).__webglMultisampledFramebuffer:Array.isArray(Ve)?j=Ve[$]:j=Ve,q.copy(T.viewport),le.copy(T.scissor),Pe=T.scissorTest}else q.copy(Ze).multiplyScalar(Me).floor(),le.copy(lt).multiplyScalar(Me).floor(),Pe=ft;if($!==0&&(j=X),be.bindFramebuffer(N.FRAMEBUFFER,j)&&be.drawBuffers(T,j),be.viewport(q),be.scissor(le),be.setScissorTest(Pe),J){let Se=et.get(T.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+H,Se.__webglTexture,$)}else if(Ee){let Se=H;for(let Fe=0;Fe<T.textures.length;Fe++){let Ve=et.get(T.textures[Fe]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Fe,Ve.__webglTexture,$,Se)}}else if(T!==null&&$!==0){let Se=et.get(T.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Se.__webglTexture,$)}D=-1};function gp(T){let H=et.get(T);return(H.__readFormat!==T.format||H.__readType!==T.type)&&(H.__readFormat=T.format,H.__readType=T.type,H.__formatReadable=xt.textureFormatReadable(T.format),H.__typeReadable=xt.textureTypeReadable(T.type)),H}this.readRenderTargetPixels=function(T,H,$,j,J,Ee,Oe,Se=0){if(!(T&&T.isWebGLRenderTarget)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=et.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Oe!==void 0&&(Fe=Fe[Oe],Array.isArray(Fe)&&(Fe=Fe[0])),Fe){be.bindFramebuffer(N.FRAMEBUFFER,Fe);try{let Ve=T.textures[Se],ut=Ve.format,St=Ve.type;T.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Se);let ze=gp(Ve);if(ze.__formatReadable===!1){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ze.__typeReadable===!1){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=T.width-j&&$>=0&&$<=T.height-J&&N.readPixels(H,$,j,J,pe.convert(ut),pe.convert(St),Ee)}finally{let Ve=W!==null?et.get(W).__webglFramebuffer:null;be.bindFramebuffer(N.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(T,H,$,j,J,Ee,Oe,Se=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=et.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Oe!==void 0&&(Fe=Fe[Oe],Array.isArray(Fe)&&(Fe=Fe[0])),Fe)if(H>=0&&H<=T.width-j&&$>=0&&$<=T.height-J){be.bindFramebuffer(N.FRAMEBUFFER,Fe);let Ve=T.textures[Se],ut=Ve.format,St=Ve.type;T.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Se);let ze=gp(Ve);if(ze.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ze.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let wt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,wt),N.bufferData(N.PIXEL_PACK_BUFFER,Ee.byteLength,N.STREAM_READ),N.readPixels(H,$,j,J,pe.convert(ut),pe.convert(St),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let en=W!==null?et.get(W).__webglFramebuffer:null;be.bindFramebuffer(N.FRAMEBUFFER,en);let kt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Km(N,kt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,wt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Ee),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(wt),N.deleteSync(kt),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,H=null,$=0){let j=Math.pow(2,-$),J=Math.floor(T.image.width*j),Ee=Math.floor(T.image.height*j),Oe=H!==null?H.x:0,Se=H!==null?H.y:0;at.setTexture2D(T,0),N.copyTexSubImage2D(N.TEXTURE_2D,$,0,0,Oe,Se,J,Ee),be.unbindTexture()},this.copyTextureToTexture=function(T,H,$=null,j=null,J=0,Ee=0){let Oe,Se,Fe,Ve,ut,St,ze,wt,en,kt=T.isCompressedTexture?T.mipmaps[Ee]:T.image;if($!==null)Oe=$.max.x-$.min.x,Se=$.max.y-$.min.y,Fe=$.isBox3?$.max.z-$.min.z:1,Ve=$.min.x,ut=$.min.y,St=$.isBox3?$.min.z:0;else{let Et=Math.pow(2,-J);Oe=Math.floor(kt.width*Et),Se=Math.floor(kt.height*Et),T.isDataArrayTexture?Fe=kt.depth:T.isData3DTexture?Fe=Math.floor(kt.depth*Et):Fe=1,Ve=0,ut=0,St=0}j!==null?(ze=j.x,wt=j.y,en=j.z):(ze=0,wt=0,en=0);let Nt=pe.convert(H.format),Tn=pe.convert(H.type),He;H.isData3DTexture?(at.setTexture3D(H,0),He=N.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(at.setTexture2DArray(H,0),He=N.TEXTURE_2D_ARRAY):(at.setTexture2D(H,0),He=N.TEXTURE_2D),be.activeTexture(N.TEXTURE0),be.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,H.flipY),be.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),be.pixelStorei(N.UNPACK_ALIGNMENT,H.unpackAlignment);let Fn=be.getParameter(N.UNPACK_ROW_LENGTH),At=be.getParameter(N.UNPACK_IMAGE_HEIGHT),Ks=be.getParameter(N.UNPACK_SKIP_PIXELS),En=be.getParameter(N.UNPACK_SKIP_ROWS),Sl=be.getParameter(N.UNPACK_SKIP_IMAGES);be.pixelStorei(N.UNPACK_ROW_LENGTH,kt.width),be.pixelStorei(N.UNPACK_IMAGE_HEIGHT,kt.height),be.pixelStorei(N.UNPACK_SKIP_PIXELS,Ve),be.pixelStorei(N.UNPACK_SKIP_ROWS,ut),be.pixelStorei(N.UNPACK_SKIP_IMAGES,St);let _s=T.isDataArrayTexture||T.isData3DTexture,Js=H.isDataArrayTexture||H.isData3DTexture;if(T.isDepthTexture){let Et=et.get(T),xn=et.get(H),yi=et.get(Et.__renderTarget),Vt=et.get(xn.__renderTarget);be.bindFramebuffer(N.READ_FRAMEBUFFER,yi.__webglFramebuffer),be.bindFramebuffer(N.DRAW_FRAMEBUFFER,Vt.__webglFramebuffer);for(let hn=0;hn<Fe;hn++)_s&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,et.get(T).__webglTexture,J,St+hn),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,et.get(H).__webglTexture,Ee,en+hn)),N.blitFramebuffer(Ve,ut,Ve+Oe,ut+Se,ze,wt,ze+Oe,wt+Se,N.DEPTH_BUFFER_BIT,N.NEAREST);be.bindFramebuffer(N.READ_FRAMEBUFFER,null),be.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(J!==0||T.isRenderTargetTexture||et.has(T)){let Et=et.get(T),xn=et.get(H);be.bindFramebuffer(N.READ_FRAMEBUFFER,R),be.bindFramebuffer(N.DRAW_FRAMEBUFFER,I);for(let yi=0;yi<Fe;yi++)_s?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Et.__webglTexture,J,St+yi):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Et.__webglTexture,J),Js?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,xn.__webglTexture,Ee,en+yi):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xn.__webglTexture,Ee),J!==0?N.blitFramebuffer(Ve,ut,Ve+Oe,ut+Se,ze,wt,ze+Oe,wt+Se,N.COLOR_BUFFER_BIT,N.NEAREST):Js?N.copyTexSubImage3D(He,Ee,ze,wt,en+yi,Ve,ut,Oe,Se):N.copyTexSubImage2D(He,Ee,ze,wt,Ve,ut,Oe,Se);be.bindFramebuffer(N.READ_FRAMEBUFFER,null),be.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Js?T.isDataTexture||T.isData3DTexture?N.texSubImage3D(He,Ee,ze,wt,en,Oe,Se,Fe,Nt,Tn,kt.data):H.isCompressedArrayTexture?N.compressedTexSubImage3D(He,Ee,ze,wt,en,Oe,Se,Fe,Nt,kt.data):N.texSubImage3D(He,Ee,ze,wt,en,Oe,Se,Fe,Nt,Tn,kt):T.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Ee,ze,wt,Oe,Se,Nt,Tn,kt.data):T.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Ee,ze,wt,kt.width,kt.height,Nt,kt.data):N.texSubImage2D(N.TEXTURE_2D,Ee,ze,wt,Oe,Se,Nt,Tn,kt);be.pixelStorei(N.UNPACK_ROW_LENGTH,Fn),be.pixelStorei(N.UNPACK_IMAGE_HEIGHT,At),be.pixelStorei(N.UNPACK_SKIP_PIXELS,Ks),be.pixelStorei(N.UNPACK_SKIP_ROWS,En),be.pixelStorei(N.UNPACK_SKIP_IMAGES,Sl),Ee===0&&H.generateMipmaps===!0&&H.mipmapsAutoUpdate===!0&&N.generateMipmap(He),be.unbindTexture()},this.initRenderTarget=function(T){et.get(T).__webglFramebuffer===void 0&&at.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?at.setTextureCube(T,0):T.isData3DTexture?at.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?at.setTexture2DArray(T,0):at.setTexture2D(T,0),be.unbindTexture()},this.resetState=function(){U=0,O=0,W=null,be.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=yt._getDrawingBufferColorSpace(e),t.unpackColorSpace=yt._getUnpackColorSpace()}};function Xd(i,e){if(e===md)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Ta||e===Jo){let t=i.getIndex();if(t===null){let r=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Ta)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function Ra(i){let e=new Map,t=new Map,n=i.clone();return U0(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function U0(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)U0(i.children[n],e.children[n],t)}var Lh=class extends Oi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Qd(t)}),this.register(function(t){return new ef(t)}),this.register(function(t){return new tf(t)}),this.register(function(t){return new uf(t)}),this.register(function(t){return new df(t)}),this.register(function(t){return new ff(t)}),this.register(function(t){return new sf(t)}),this.register(function(t){return new rf(t)}),this.register(function(t){return new af(t)}),this.register(function(t){return new of(t)}),this.register(function(t){return new $d(t)}),this.register(function(t){return new lf(t)}),this.register(function(t){return new nf(t)}),this.register(function(t){return new hf(t)}),this.register(function(t){return new cf(t)}),this.register(function(t){return new Yd(t)}),this.register(function(t){return new Dh(t,_t.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Dh(t,_t.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new pf(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let l=fs.extractUrlBase(e);a=fs.resolveURL(l,this.path)}else a=fs.extractUrlBase(e);this.manager.itemStart(e);let o=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new ma(this.manager);c.setPriority(this.priority),c.setCache(this.cache),c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===G0){try{a[_t.KHR_BINARY_GLTF]=new mf(e)}catch(u){s&&s(u);return}r=JSON.parse(a[_t.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new Mf(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case _t.KHR_MATERIALS_UNLIT:a[u]=new Zd;break;case _t.KHR_DRACO_MESH_COMPRESSION:a[u]=new gf(r,this.dracoLoader);break;case _t.KHR_TEXTURE_TRANSFORM:a[u]=new bf;break;case _t.KHR_MESH_QUANTIZATION:a[u]=new xf;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function iS(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function qt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var _t={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Yd=class{constructor(e){this.parser=e,this.name=_t.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],l,h=new qe(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Un);let u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new gr(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new ds(h),l.distance=u;break;case"spot":l=new Oo(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Vi(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}},Zd=class{constructor(){this.name=_t.KHR_MATERIALS_UNLIT}getMaterialType(){return Tt}extendParams(e,t,n){let s=[];e.color=new qe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Un),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Gt))}return Promise.all(s)}},$d=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Qd=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new he(r,r)}return Promise.all(s)}},ef=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(s)}},tf=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_DISPERSION}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},nf=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},sf=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_SHEEN}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new qe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Gt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},rf=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},af=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_VOLUME}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new qe().setRGB(r[0],r[1],r[2],Un),Promise.all(s)}},of=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_IOR}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},lf=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_SPECULAR}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new qe().setRGB(r[0],r[1],r[2],Un),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Gt)),Promise.all(s)}},cf=class{constructor(e){this.parser=e,this.name=_t.EXT_MATERIALS_BUMP}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},hf=class{constructor(e){this.parser=e,this.name=_t.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return qt(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){let n=qt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},uf=class{constructor(e){this.parser=e,this.name=_t.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},df=class{constructor(e){this.parser=e,this.name=_t.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],c=n.textureLoader;if(o.uri){let l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}},ff=class{constructor(e){this.parser=e,this.name=_t.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],c=n.textureLoader;if(o.uri){let l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}},Dh=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let c=s.byteOffset||0,l=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}},pf=class{constructor(e){this.name=_t.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let l of s.primitives)if(l.mode!==di.TRIANGLES&&l.mode!==di.TRIANGLE_STRIP&&l.mode!==di.TRIANGLE_FAN&&l.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],c={};for(let l in a)o.push(this.parser.getDependency("accessor",a[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{let h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(let p of u){let y=new st,g=new z,m=new Zt,x=new z(1,1,1),M=new cr(p.geometry,p.material,d);for(let E=0;E<d;E++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,E),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,E),c.SCALE&&x.fromBufferAttribute(c.SCALE,E),M.setMatrixAt(E,y.compose(g,m,x));let _=null;for(let E in c)if(E==="_COLOR_0"){let A=c[E];M.instanceColor=new ss(A.array,A.itemSize,A.normalized)}else if(E!=="TRANSLATION"&&E!=="ROTATION"&&E!=="SCALE"){if(_===null){let b=M.geometry;_=new Ft,_.name=b.name;for(let S in b.attributes)_.setAttribute(S,b.attributes[S]);for(let S in b.morphAttributes)_.morphAttributes[S]=b.morphAttributes[S];b.index!==null&&_.setIndex(b.index),_.morphTargetsRelative=b.morphTargetsRelative;for(let S of b.groups)_.addGroup(S.start,S.count,S.materialIndex);b.boundingBox!==null&&(_.boundingBox=b.boundingBox.clone()),b.boundingSphere!==null&&(_.boundingSphere=b.boundingSphere.clone()),_.drawRange.start=b.drawRange.start,_.drawRange.count=b.drawRange.count,_.userData=Object.assign({},b.userData),M.geometry=_}let A=c[E];_.setAttribute(E,new ss(A.array,A.itemSize,A.normalized))}Ot.prototype.copy.call(M,p),this.parser.assignFinalMaterial(M),f.push(M)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},G0="glTF",el=12,O0={JSON:1313821514,BIN:5130562},mf=class{constructor(e){this.name=_t.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,el),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==G0)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-el,r=new DataView(e,el),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let c=r.getUint32(a,!0);if(a+=4,c===O0.JSON){let l=new Uint8Array(e,el+a,o);this.content=n.decode(l)}else if(c===O0.BIN){let l=el+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},gf=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=_t.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(let h in a){let u=_f[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=_f[h]||h.toLowerCase();if(a[h]!==void 0){let d=n.accessors[e.attributes[h]],f=Ca[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(let p in f.attributes){let y=f.attributes[p],g=c[p];g!==void 0&&(y.normalized=g)}u(f)},o,l,Un,d)})})}},bf=class{constructor(){this.name=_t.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},xf=class{constructor(){this.name=_t.KHR_MESH_QUANTIZATION}},Nh=class extends Ui{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=s-t,u=(n-t)/h,d=u*u,f=d*u,p=e*l,y=p-l,g=-2*f+3*d,m=f-d,x=1-g,M=m-d+u;for(let _=0;_!==o;_++){let E=a[y+_+o],A=a[y+_+c]*h,b=a[p+_+o],S=a[p+_]*h;r[_]=x*E+M*A+g*b+m*S}return r}},sS=new Zt,yf=class extends Nh{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return sS.fromArray(r).normalize().toArray(r),r}},di={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ca={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},B0={9728:$t,9729:an,9984:Uc,9985:Sa,9986:_r,9987:ci},z0={33071:Cn,33648:ia,10497:ai},jd={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},_f={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ns={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},rS={CUBICSPLINE:void 0,LINEAR:sr,STEP:ir},Kd={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function aS(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ae({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Bi})),i.DefaultMaterial}function Sr(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Vi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function oS(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,h=e.length;l<h;l++){let u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){let u=e[l];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;a.push(d)}if(s){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;o.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){let h=l[0],u=l[1],d=l[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function lS(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function cS(i){let e,t=i.extensions&&i.extensions[_t.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Jd(t.attributes):e=i.indices+":"+Jd(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Jd(i.targets[n]);return e}function Jd(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function vf(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function hS(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var uS=new st,Mf=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new iS,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let c=o.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?(this.textureLoader=new fr(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new Bo(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ma(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return Sr(r,o,s),Vi(o,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(let c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(let[l,h]of a.children.entries())r(h,o.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[_t.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(fs.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=jd[s.type],o=Ca[s.componentType],c=s.normalized===!0,l=new o(s.count*a);return Promise.resolve(new yn(l,a,c))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],c=jd[s.type],l=Ca[s.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,p=s.normalized===!0,y,g;if(f&&f!==u){let m=Math.floor(d/f),x="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count,M=t.cache.get(x);M||(y=new l(o,m*f,s.count*f/h),M=new ar(y,f/h),t.cache.add(x,M)),g=new As(M,c,d%f/h,p)}else o===null?y=new l(s.count*c):y=new l(o,d,s.count*c),g=new yn(y,c,p);if(s.sparse!==void 0){let m=jd.SCALAR,x=Ca[s.sparse.indices.componentType],M=s.sparse.indices.byteOffset||0,_=s.sparse.values.byteOffset||0,E=new x(a[1],M,s.sparse.count*m),A=new l(a[2],_,s.sparse.count*c);o!==null&&(g=new yn(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let b=0,S=E.length;b<S;b++){let L=E[b];if(g.setX(L,A[b*c]),c>=2&&g.setY(L,A[b*c+1]),c>=3&&g.setZ(L,A[b*c+2]),c>=4&&g.setW(L,A[b*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let d=(r.samplers||{})[a.sampler]||{};return h.magFilter=B0[d.magFilter]||an,h.minFilter=B0[d.minFilter]||ci,h.wrapS=z0[d.wrapS]||ai,h.wrapT=z0[d.wrapT]||ai,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==$t&&h.minFilter!==an,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let a=s.images[e],o=self.URL||self.webkitURL,c=a.uri||"",l=!1,h;if(t.isKTX2Loader===!0&&a.bufferView!==void 0)h=n.getDependency("bufferView",a.bufferView).then(function(d){return new Promise(function(f,p){t.parse(d,f,p)})});else{if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(d){l=!0;let f=new Blob([d],{type:a.mimeType});return c=o.createObjectURL(f),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");h=Promise.resolve(c).then(function(d){return new Promise(function(f,p){let y=f;t.isImageBitmapLoader===!0&&(y=function(g){let m=new Qt(g);m.needsUpdate=!0,f(m)}),t.load(fs.resolveURL(d,r.path),y,void 0,p)})})}let u=h.then(function(d){return l===!0&&o.revokeObjectURL(c),Vi(d,a),d.userData.mimeType=a.mimeType||hS(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[_t.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[_t.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let c=r.associations.get(a);a=r.extensions[_t.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,c)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,c=this.cache.get(o);c||(c=new da,Bn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,c=this.cache.get(o);c||(c=new Cs,Bn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),r&&(c.vertexColors=!0),a&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Ae}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},c=r.extensions||{},l=[];if(c[_t.KHR_MATERIALS_UNLIT]){let u=s[_t.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),l.push(u.extendParams(o,r,t))}else{let u=r.pbrMetallicRoughness||{};if(o.color=new qe(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Un),o.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",u.baseColorTexture,Gt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Bt);let h=r.alphaMode||Kd.OPAQUE;if(h===Kd.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Kd.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Tt&&(l.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new he(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Tt&&(l.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Tt){let u=r.emissiveFactor;o.emissive=new qe().setRGB(u[0],u[1],u[2],Un)}return r.emissiveTexture!==void 0&&a!==Tt&&l.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Gt)),Promise.all(l).then(function(){let u=new a(o);return r.name&&(u.name=r.name),Vi(u,r),t.associations.set(u,{materials:e}),r.extensions&&Sr(s,u,r),u})}createUniqueName(e){let t=Dt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[_t.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return H0(c,o,t)})}let a=[];for(let o=0,c=e.length;o<c;o++){let l=e[o],h=cS(l),u=s[h];if(u)a.push(u.promise);else{let d;l.extensions&&l.extensions[_t.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=H0(new Ft,l,t),l.mode===di.TRIANGLE_STRIP?d=d.then(f=>Xd(f,Jo)):l.mode===di.TRIANGLE_FAN&&(d=d.then(f=>Xd(f,Ta))),s[h]={primitive:l,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let c=0,l=a.length;c<l;c++){let h=a[c].material===void 0?aS(this.cache):this.getDependency("material",a[c].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(c){let l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,p=h.length;f<p;f++){let y=h[f],g=a[f],m,x=l[f];if(g.mode===di.TRIANGLES||g.mode===di.TRIANGLE_STRIP||g.mode===di.TRIANGLE_FAN||g.mode===void 0){let M=r.isSkinnedMesh===!0,_=y.hasAttribute("skinIndex")&&y.hasAttribute("skinWeight");M&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=M&&_?new go(y,x):new ht(y,x),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(g.mode===di.LINES)m=new xo(y,x);else if(g.mode===di.LINE_STRIP)m=new rs(y,x);else if(g.mode===di.LINE_LOOP)m=new yo(y,x);else if(g.mode===di.POINTS)m=new _o(y,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(m.geometry.morphAttributes).length>0&&lS(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Vi(m,r),g.extensions&&Sr(s,m,g),t.assignFinalMaterial(m),u.push(m)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&Sr(s,u[0],r),u[0];let d=new vt;r.extensions&&Sr(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new rn(Th.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new mr(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Vi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],c=[];for(let l=0,h=a.length;l<h;l++){let u=a[l];if(u){o.push(u);let d=new st;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new bo(o,c)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],c=[],l=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){let f=s.channels[u],p=s.samplers[f.sampler],y=f.target,g=y.node,m=s.parameters!==void 0?s.parameters[p.input]:p.input,x=s.parameters!==void 0?s.parameters[p.output]:p.output;y.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",x)),l.push(p),h.push(y))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],p=u[2],y=u[3],g=u[4],m=[];for(let M=0,_=d.length;M<_;M++){let E=d[M],A=f[M],b=p[M],S=y[M],L=g[M];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let P=n._createAnimationTracks(E,A,b,S,L);if(P)for(let k=0;k<P.length;k++)m.push(P[k])}let x=new dr(r,void 0,m);return Vi(x,s),x})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=s.weights.length;c<l;c++)o.morphTargetInfluences[c]=s.weights[c]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let l=0,h=o.length;l<h;l++)a.push(n.getDependency("node",o[l]));let c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),c]).then(function(l){let h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,uS)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,p=u[0];h.pivot=new z().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(r.isBone===!0?h=new ha:l.length>1?h=new vt:l.length===1?h=l[0]:h=new Ot,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Vi(h,r),r.extensions&&Sr(n,h,r),r.matrix!==void 0){let u=new st;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new vt;n.name&&(r.name=s.createUniqueName(n.name)),Vi(r,n),n.extensions&&Sr(t,r,n);let a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(s.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let h=0,u=c.length;h<u;h++){let d=c[h];d.parent!==null?r.add(Ra(d)):r.add(d)}let l=h=>{let u=new Map;for(let[d,f]of s.associations)(d instanceof Bn||d instanceof Qt)&&u.set(d,f);return h.traverse(d=>{let f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,c=[];function l(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}Ns[r.path]===Ns.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(o);let h;switch(Ns[r.path]){case Ns.weights:h=cs;break;case Ns.rotation:h=hs;break;case Ns.translation:case Ns.scale:h=Ls;break;default:n.itemSize===1?h=cs:h=Ls;break}let u=s.interpolation!==void 0?rS[s.interpolation]:sr,d=this._getArrayFromAccessor(n);for(let f=0,p=c.length;f<p;f++){let y=new h(c[f]+"."+Ns[r.path],t.array,d,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),a.push(y)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=vf(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof hs?yf:Nh;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function dS(i,e,t){let n=e.attributes,s=new On;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(s.set(new z(c[0],c[1],c[2]),new z(l[0],l[1],l[2])),o.normalized){let h=vf(Ca[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new z,c=new z;for(let l=0,h=r.length;l<h;l++){let u=r[l];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let y=vf(Ca[d.componentType]);c.multiplyScalar(y)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new Vn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function H0(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(c){i.setAttribute(o,c)})}for(let a in n){let o=_f[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return yt.workingColorSpace!==Un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${yt.workingColorSpace}" not supported.`),Vi(i,e),dS(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?oS(i,e.targets,t):i})}var V0=(function(){var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var s=WebAssembly.validate(t)?o(e):o(i),r,a=WebAssembly.instantiate(s,{}).then(function(m){r=m.instance,r.exports.__wasm_call_ctors()});function o(m){for(var x=new Uint8Array(m.length),M=0;M<m.length;++M){var _=m.charCodeAt(M);x[M]=_>96?_-97:_>64?_-39:_+4}for(var E=0,M=0;M<m.length;++M)x[E++]=x[M]<60?n[x[M]]:(x[M]-60)*64+x[++M];return x.buffer.slice(0,E)}function c(m,x,M,_,E,A,b){var S=m.exports.sbrk,L=_+3&-4,P=S(L*E),k=S(A.length),V=new Uint8Array(m.exports.memory.buffer);V.set(A,k);var X=x(P,_,E,k,A.length);if(X==0&&b&&b(P,L,E),M.set(V.subarray(P,P+_*E)),S(P-S(0)),X!=0)throw new Error("Malformed buffer data: "+X)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp",COLOR:"meshopt_decodeFilterColor"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function f(m){var x={object:new Worker(m),pending:0,requests:{}};return x.object.onmessage=function(M){var _=M.data;x.pending-=_.count,x.requests[_.id][_.action](_.value),delete x.requests[_.id]},x}function p(m){for(var x="self.ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(s)+"]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = "+g.name+";"+c.toString()+g.toString(),M=new Blob([x],{type:"text/javascript"}),_=URL.createObjectURL(M),E=u.length;E<m;++E)u[E]=f(_);for(var E=m;E<u.length;++E)u[E].object.postMessage({});u.length=m,URL.revokeObjectURL(_)}function y(m,x,M,_,E){for(var A=u[0],b=1;b<u.length;++b)u[b].pending<A.pending&&(A=u[b]);return new Promise(function(S,L){var P=new Uint8Array(M),k=++d;A.pending+=m,A.requests[k]={resolve:S,reject:L},A.object.postMessage({id:k,count:m,size:x,source:P,mode:_,filter:E},[P.buffer])})}function g(m){var x=m.data;self.ready.then(function(M){if(!x.id)return self.close();try{var _=new Uint8Array(x.count*x.size);c(M,M.exports[x.mode],_,x.count,x.size,x.source,M.exports[x.filter]),self.postMessage({id:x.id,count:x.count,action:"resolve",value:_},[_.buffer])}catch(E){self.postMessage({id:x.id,count:x.count,action:"reject",value:E})}})}return{ready:a,supported:!0,useWorkers:function(m){p(m)},decodeVertexBuffer:function(m,x,M,_,E){c(r,r.exports.meshopt_decodeVertexBuffer,m,x,M,_,r.exports[l[E]])},decodeIndexBuffer:function(m,x,M,_){c(r,r.exports.meshopt_decodeIndexBuffer,m,x,M,_)},decodeIndexSequence:function(m,x,M,_){c(r,r.exports.meshopt_decodeIndexSequence,m,x,M,_)},decodeGltfBuffer:function(m,x,M,_,E,A){c(r,r.exports[h[E]],m,x,M,_,r.exports[l[A]])},decodeGltfBufferAsync:function(m,x,M,_,E){return u.length>0?y(m,x,M,h[_],l[E]):a.then(function(){var A=new Uint8Array(m*x);return c(r,r.exports[h[_]],A,m,x,M,r.exports[l[E]]),A})}}})();var Rr=[{id:"galdy",title:"Who is Lewis Galdy?",simple:["Lewis Galdy was a real person. He was born in France in 1659.","His family were Huguenots. That means French Protestants. In France they were punished for their religion, so Lewis sailed across the ocean to Jamaica."],deeper:["We know this from the words carved on his tombstone. You can still read it at St Peter\u2019s Church in Port Royal.","Nobody wrote down the year he arrived. This game starts his story in 1690. That date is our best guess, not a fact."]},{id:"town",title:"The town on the sand",simple:["Port Royal sat on a thin strip of sand in Kingston Harbour. About 6,500 people lived here, packed close together.","There was not much land, so people built upward. Some brick houses were four floors high."],deeper:["Around 1690, Port Royal was about the same size as Boston. It was one of the busiest English ports in the Americas, and brick houses were a sign of money.","From 1981 to 1990, archaeologists dug up five buildings that now lie under the sea. The houses in this game are based on what they found, and on paintings made from their work."]},{id:"coins",title:"Pieces of eight",simple:["People in Port Royal paid with silver coins from Spanish lands.","The big coin was called a piece of eight. It was worth eight smaller coins called reales."],deeper:["In most English colonies, people swapped goods like sugar or tobacco. Port Royal was different. So much Spanish silver arrived, through trade and through raids on Spanish ships and towns, that people used coins every day."]},{id:"people",title:"Who lived here?",simple:["People came to Port Royal from England, France, Africa and many other places.","Not everyone chose to come, and not everyone was free. Many African people here were enslaved. That means they were forced to work, were not paid, and were not allowed to leave.","Abba is a free woman. That was rare."],deeper:["About 2,500 of the people in the town were enslaved Africans. Part of Port Royal\u2019s wealth came from buying and selling human beings. This game will not hide that.","Abba is a character we made up. She stands for the free Black and mixed-race people who really lived in Jamaica at this time. Church records list a free Black couple, Peter Moore and Black Betty, who married in 1677."]},{id:"harbour",title:"The busy harbour",simple:["Port Royal had one of the busiest harbours in the Americas. In the year 1688, 213 ships came here.","Ships left Jamaica full of sugar, rum, cotton, ginger and wood."],deeper:["In that same year, 226 ships visited all of New England put together. One small town in Jamaica was almost as busy as a whole region.","Ships also carried enslaved African people here to be sold. The money and the cruelty came in through the same harbour."]},{id:"change",title:"Making change",simple:["A piece of eight was worth eight reales. Abba\u2019s stew cost two reales, so you got six back.","Sometimes people cut a coin into smaller pieces to make change. The pieces were called bits."],deeper:["The prices in this game are made up. Nobody wrote down what a bowl of stew cost in a Port Royal tavern in 1690."]},{id:"bottle",title:"Onion bottles",simple:["This round bottle is called an onion bottle, because of its shape. It held wine or other drinks.","Divers found a huge number of bottles like this under the sea at Port Royal."],deeper:["Some bottles came up still sealed, with liquid inside, after more than 250 years under the sea.","You can see real objects from Port Royal at the National Museum of Jamaica in Kingston."]},{id:"pewter",title:"Pewter plates",simple:["Pewter is a soft grey metal. Many people ate from pewter plates.","In one sunken building, archaeologists found about 25 pewter plates stacked in a cupboard under the stairs."],deeper:["Port Royal has given the world its largest collection of pewter from the late 1600s.","A pewter maker named Simon Benning was working in Jamaica by the 1660s. His son carried on the shop."]},{id:"pipes",title:"Clay pipes",simple:["Many people in Port Royal smoked tobacco in long clay pipes. Divers found so many pipes that it seemed the whole town smoked.","Today we know that smoking harms the body. People in 1690 did not know that."],deeper:["Archaeologists found white clay pipes that had never been used, still waiting to be sold.","Some pipes were made in Jamaica from local red clay. African craftspeople, both free and enslaved, made them."]},{id:"turtle",title:"The turtle-shell box",simple:["This little box is covered in turtle shell. A box like it was found under the sea at Port Royal.","Sea turtles were easy to find near the town. People ate turtle meat and made things from the shells."],deeper:["In one sunken building, archaeologists found sea turtle shells in a room used for cutting up meat.","Today sea turtles are in danger and are protected by law. Nobody should hunt them now."]},{id:"quake",title:"The earthquake",simple:["On 7 June 1692, just before noon, a huge earthquake hit Port Royal.","In about three minutes, most of the town was gone."],deeper:["As many as 2,000 people died that day. Thousands more died in the days and weeks after.","A news sheet printed in London that year lists what people saw: houses falling, the great church and its tower coming down, the wharf covered by the sea, and a boat coming to save people."]},{id:"sand",title:"Why the ground swallowed the town",simple:["Port Royal was built on loose, wet sand.","When loose, wet sand is shaken very hard, it stops acting like solid ground. It flows like a liquid. Heavy brick houses sank straight down into it."],deeper:["Scientists call this liquefaction.","It is why divers found some buildings under the sea with their brick floors still in place."]},{id:"watch",title:"The stopped watch",simple:["In 1959, divers found a brass pocket watch under the sea at Port Royal.","Its hands had stopped at 17 minutes before noon."],deeper:["The watch was made in Amsterdam in 1686. People believe it stopped when the earthquake struck. That is how we know the time: about 11:43 in the morning."]},{id:"tomb",title:"Swallowed, and saved",simple:["This part of the story is true. Lewis Galdy was swallowed by the ground. A second shock threw him out into the sea.","He swam until a boat picked him up."],deeper:["His tombstone says he was \u201Cmiraculously saved by swimming until a boat took him up.\u201D He lived for 47 more years.","In this game, Abba is in the boat. We made that part up. Nobody wrote down who was in the boat that saved him."]},{id:"after",title:"The days after",simple:["The earthquake lasted about three minutes. The hard days came after.","People had little food and no clean water. Many who lived through the earthquake became sick. Thousands more died."],deeper:["At night, thieves robbed the broken houses. The town\u2019s minister wrote about them in a letter.","The camp in this game is made up. The hunger, the sickness and the thieves were real."]},{id:"tentp",title:"Church in a tent",simple:["The great church fell down in the earthquake.","So the minister held church in a tent."],deeper:["A news sheet printed in London in 1692 shows him preaching in a tent, with ruined houses all around."]},{id:"kingston",title:"A new town across the water",simple:["Most people who lived left Port Royal. They crossed the harbour and began a new town.","That town became Kingston, the capital of Jamaica today."],deeper:["Port Royal was built again, but smaller. It was never again the great trading town it had been.","A few merchants and fishermen stayed. Lewis Galdy was one of them."]},{id:"fortune",title:"Where the money came from",simple:["Lewis Galdy became rich again. He sold wine and cocoa. He also sold people.","He worked for a company that shipped enslaved African people to Spanish lands. This game does not look away from that."],deeper:["That trade was called the Asiento. Galdy was one of its agents in Jamaica.","He also sat in Jamaica\u2019s Assembly, which made the island\u2019s laws."]},{id:"stone",title:"The tombstone",simple:["Lewis Galdy died in 1739. He was 80 years old.","His tombstone tells how the earthquake swallowed him and how he was saved. You can visit it today at St Peter\u2019s Church in Port Royal."],deeper:["As a churchwarden, he helped to get this church built again. It was finished in 1725.","His tomb was first at a place called Green Bay, across the harbour. It was moved here in 1953.","The stone tells his story. The people he bought and sold have no stones, and most of their names were never written down."]},{id:"sugar",title:"Sugar",simple:["These big casks are full of sugar. Sugar was the main thing Jamaica sold to the world.","Enslaved African people grew the sugar cane and made the sugar. The work was very hard and very dangerous."],deeper:["A big cask like this is called a hogshead.","Sugar made planters and merchants rich. The people who made it were paid nothing."]},{id:"cocoa",title:"Cocoa",simple:["These sacks hold cocoa beans. People ground them up to make a chocolate drink.","We know that Lewis Galdy traded in cocoa."],deeper:["In the 1600s, chocolate was a drink, not a bar. People drank it hot, often with spices."]},{id:"logwood",title:"Logwood",simple:["This dark red wood is called logwood. It was not for building.","People boiled it to make dye for cloth."],deeper:["Many old privateers became logwood cutters on the coast of Central America. Much of their wood was shipped through Jamaica to Europe."]},{id:"scales",title:"Weighing coins",simple:["Merchants did not just count coins. They weighed them.","Some people shaved silver off the edges of coins and kept it. A scale showed if a coin was too light."],deeper:["Shaving coins was called clipping. It was a crime."]},{id:"market",title:"The slave market",simple:["Ships brought enslaved African people to Port Royal to be sold.","Families were split apart on the wharf. The law allowed this. It was still wrong."],deeper:["Until 1698, one company, the Royal African Company, was the only English company allowed to bring enslaved people from Africa.","We do not know the year Lewis Galdy began to buy and sell people. We know that he did. The letter in this game is made up, to show the choice in front of him.","Abba\u2019s mother is made up too. Thousands of real mothers were sold in Port Royal."]},{id:"swan",title:"The ship over the houses",simple:["When the earthquake struck, the sea rushed over the wharf.","A ship called the Swan was being repaired by the shore. The water lifted it and carried it over the tops of the sunken houses."],deeper:["People in the water climbed onto the Swan and were saved.","Sam is a character we made up, but people who were there wrote about the Swan."]},{id:"kofi",title:"Kofi\u2019s name",simple:["Many enslaved people in Jamaica were taken from West Africa. Kofi is an Akan name from West Africa. It is given to a boy born on a Friday.","Owners often gave enslaved people new names. Many people kept their own names among themselves."],deeper:["Enslaved Africans did much of the hardest work in Port Royal: loading ships, carrying goods, building and rowing.","Kofi is a character we made up. About 2,500 enslaved people lived in Port Royal, and most of their names were never written down."]},{id:"privateer",title:"Pirates and privateers",simple:["A privateer had a paper from the government that allowed him to attack enemy ships. A pirate had no paper, and attacked anyone.","In the 1660s, English leaders let privateers sail from Port Royal to raid Spanish ships and towns."],deeper:["The most famous was Henry Morgan. He later became Lieutenant Governor of Jamaica.","By the 1680s the government had turned against the raiders. Pirates caught by the law were hanged at Gallows Point, just outside the town.","Sam is a character we made up."]},{id:"benning",title:"The Bennings, pewterers",simple:["Simon Benning was a real pewterer: he made plates, spoons and cups from pewter. He came from England by way of Barbados, and was working in Jamaica by the 1660s.","He died in 1687. His son, also called Symon, carried on the shop. He was still a pewterer in Port Royal when the earthquake struck in 1692."],deeper:["Their mark was a pineapple with the letters S and B. Pewter with this mark has been found under the sea at Port Royal.","Marks like these help archaeologists work out who made the things they find.","The words of Symon Benning in this game are made up."]},{id:"heath",title:"The Reverend Emmanuel Heath",simple:["Emmanuel Heath was a real person. He was the minister of St Paul\u2019s Church in Port Royal.","He lived through the earthquake and wrote letters about it. Much of what we know about that day comes from him."],deeper:["He wrote from a ship called the Granada, out in the harbour. He went ashore to pray with the hurt and dying, and to christen children.","Like many people then, he believed the earthquake was God\u2019s punishment. Today, scientists explain it with loose, wet sand turning to liquid.","His words in this game are made up, but they follow what he wrote."]}],fS=[{who:"You",text:"A ship\u2019s cook wants a sack of cocoa. The price is 20 reales."},{who:"You",text:"He gives me 3 pieces of eight. Each one is worth 8 reales. How many reales do I give back?",choices:[{t:"2 reales"},{t:"4 reales",ok:!0},{t:"6 reales"}],hint:"Not quite. Three eights are 24. Take away 20."},{who:"You",text:"Four reales. But first I weigh his coins. One is too light. Someone has shaved its edge.",unlock:"scales"}],hg=[{who:"Abba",text:"Good day, Lewis. I need a cask of wine for The Turtle."},{who:"You",text:"Take the one by the door. You can pay me on Friday."},{who:"Abba",text:"There is a letter on your desk. The captain of the slave ship left it. I know what it asks."},{who:"Abba",text:"My mother was sold on that wharf, Lewis. Read it. Then decide what kind of merchant you are.",unlock:"market"},{who:"You",text:"Abba, wait. I have not said yes to anything."},{who:"Abba",text:"I know. That is why I came to tell you. I will send a boy for the wine."},{who:"Abba",text:"Good day, Lewis."}],Oa=[{id:"kofi",label:"Talk to the dockworker",who:"Kofi",x:21.7,z:2.35,ry:Math.PI+.5,route:[[21.2,2.5],[31,.7]],talk:[{who:"Kofi",text:"Mind the casks. They are heavy, and the captain wants them on board by noon."},{who:"You",text:"Do you work for the captain?"},{who:"Kofi",text:"No. I am enslaved. A merchant in this town says he owns me. I work, and I am not paid."},{who:"Kofi",text:"My mother named me Kofi, because I was born on a Friday. Here they call me something else. I keep my own name.",unlock:"kofi"}],again:[{who:"Kofi",text:"I have work to do. Go well."}]},{id:"sailor",label:"Talk to the sailor",who:"Sam",x:34.5,z:.55,y:.06,ry:Math.PI/2,talk:[{who:"Sam",anim:"Point",text:"Fine sloop, isn\u2019t she? Built of Jamaica cedar. Fast enough to catch anything on the sea."},{who:"You",text:"Are you a pirate?"},{who:"Sam",text:"Hush! Years ago, when Captain Morgan led us, the governor gave us papers to attack Spanish ships. That made us privateers, not pirates."},{who:"Sam",text:"Now the law has changed. Attack a ship without papers and they hang you at Gallows Point.",unlock:"privateer"}],again:[{who:"Sam",text:"We sail with the tide. Keep your purse close in the taverns."}]},{id:"benning",label:"Talk to the pewterer",who:"Symon Benning",x:8.6,z:4,ry:Math.PI,talk:[{who:"Symon Benning",text:"Good day! Symon Benning, pewterer. Plates, spoons, tankards. All made right here in Port Royal."},{who:"You",text:"You make them here, not in England?"},{who:"Symon Benning",text:"My father started this shop. I melt the metal and pour it into moulds, then scrape and polish, just as he taught me."},{who:"Symon Benning",text:"Look underneath for our mark: a pineapple, with an S and a B. Ships bring the metal. We do the rest.",unlock:"benning"}],again:[{who:"Symon Benning",text:"Come back when you need plates. Good pewter lasts a lifetime."}]}],Cr={x:-9.65,z:1.75,ry:Math.PI/2},Fs=[[-2.6,-1.3,-.6,"sailor"],[-13.4,-1.6,.4,"benning"],[-7.2,3.9,Math.PI+.3,"kofi"]],ug=[[-.6,-.4,-1.8,"benning","Sad1",[.62,.6,.58]],[-4.3,3.7,2.8,"kofi","Sad2",[.9,.85,.8]],[-14.4,3.6,2.2,"sailor","Sad2",[.7,.7,.66]],[-15.2,1.4,1.4,"kofi","Sad1",[.75,.72,.7]]],pS=[{who:"Sam",text:"Mr Galdy! You\u2019re alive. I saw the ground take you."},{who:"Sam",text:"The sea came up over the wharf. A big ship, the Swan, was washed right over the tops of the houses. I saw it with my own eyes."},{who:"Sam",text:"Our sloop broke her ropes and was gone. I have nothing now but these clothes.",unlock:"swan"},{who:"Sam",text:"And they say the Palisadoes graveyard went under the sea. Even Captain Morgan\u2019s grave. The sea has him at last."}],mS=[{who:"Kofi",text:"A wall came down by the wharf. I got out. Many did not."},{who:"Kofi",text:"Many of us were working there when the sea came in. Nobody will write down their names."},{who:"Kofi",text:"So I say them. Every night, I say them."}],gS=[{who:"Symon Benning",text:"My shop is under the sea. The moulds, the metal, the plates. My father\u2019s work, gone in a minute."},{who:"You",text:"I am sorry, Symon."},{who:"Symon Benning",text:"Maybe one day someone will find our plates down there and see the pineapple mark. Then they will know we were here."}],bS=[{who:"Emmanuel Heath",text:"I am Emmanuel Heath, minister of this town. My church fell in the earthquake. I heard the tower come down."},{who:"Emmanuel Heath",text:"I sleep on a ship in the harbour now. I come ashore to pray with the sick, and to christen the babies."},{who:"Emmanuel Heath",text:"Many people say God punished this town for its wickedness. I fear they are right. Pray for us.",unlock:"heath"}],xS=[{who:"Abba",text:"You are alive! I pulled so many from the water. Not enough."},{who:"Abba",text:"It has been three days. There is little food, the water is bad, and people are getting sick.",unlock:"after"},{who:"Abba",text:"At night, thieves go through the broken houses. In the day, we share what we have."},{who:"Abba",text:"Look around. Then come back and tell me what you will do."}],yS=[{who:"Abba",text:"Most people are leaving. They are crossing the harbour to build a new town."},{who:"Abba",text:"You are a merchant, Lewis. You will be rich again. Ask yourself what you will sell to get there."}],jf=[{who:"Abba",text:"Morning! You look lost. Are you new in Port Royal?",choices:["Yes. I just got off the ship.","Is it that easy to tell?"]},{who:"Abba",text:"Everyone here came from somewhere else. Where is home?"},{who:"You",text:"France. A town called Montpellier. It was not safe for my family to pray the way we do. So we left.",unlock:"galdy"},{who:"Abba",text:"Then you are in good company. This town is full of people starting again. I am Abba. I keep this tavern.",unlock:"people"},{who:"Abba",text:"Here is some advice. Money in this town is Spanish silver. People call the coins pieces of eight. Learn what things cost before you spend one.",unlock:"coins"},{who:"Abba",text:"And look around you. Brick houses four floors high, on a strip of sand! Come inside when you are hungry. My turtle stew is the best on Lime Street.",unlock:"town"}],_S=[{who:"Abba",text:"Welcome to The Turtle! A bowl of turtle stew is two reales."},{who:"You",text:"I only have this. One piece of eight."},{who:"Abba",text:"A piece of eight is worth eight reales. The stew is two. How many reales do I give you back?",choices:[{t:"Four reales"},{t:"Six reales",ok:!0},{t:"Eight reales"}],hint:"Not quite. Start with eight and take away two."},{who:"Abba",text:"Six it is. Here is your change, and here is your stew. Eat while it is hot!",unlock:"change"},{who:"Abba",text:"Look around while you eat. Almost everything in this room came here on a ship."}],W0=[{who:"Abba",text:"Take your time. Look around. Port Royal will still be here tomorrow."}],Hs=[{id:"bottle",label:"Look at the bottle",x:-198.8,z:-2.15,y:1.02},{id:"pewter",label:"Look at the plates",x:-198.2,z:1.3,y:.78},{id:"pipes",label:"Look at the pipes",x:-201.6,z:1,y:.78},{id:"turtle",label:"Look at the little box",x:-195.9,z:2.3,y:.78}],v={started:!1,x:43,z:0,yaw:Math.PI/2,pitch:0,unlocked:[],talked:!1,step:0,place:"out",ate:!1,done:!1,ch:{}},re=i=>document.getElementById(i),tl=matchMedia("(prefers-reduced-motion: reduce)").matches,vS=matchMedia("(pointer: coarse)").matches,Kn=re("stage"),bs=new Ch({canvas:Kn,antialias:!0,powerPreference:"high-performance"}),Nf=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,rl=Math.min(devicePixelRatio||1,Nf?1.25:1.75);bs.setPixelRatio(rl);var Sf=16,wf=0;bs.toneMapping=Ho;bs.toneMappingExposure=1.12;var Ye=new fo,tu=new qe(13624298);Ye.fog=new uo(tu,70,900);var fi=new rn(68,1,.1,3e3);fi.rotation.order="YXZ";var dg=new ko(15135231,11770488,2.3);Ye.add(dg);var Da=new gr(16773592,2.6);Da.position.set(-.35,1,.75);Ye.add(Da);var Pr=null;{let i=new Pn(2500,24,12),e=[],t=new qe(4163273),n=new qe;for(let s=0;s<i.attributes.position.count;s++){let r=Math.max(0,i.attributes.position.getY(s)/2500);n.copy(tu).lerp(t,Math.pow(r,.55)),e.push(n.r,n.g,n.b)}i.setAttribute("color",new dt(e,3)),Pr=new ht(i,new Tt({vertexColors:!0,side:_n,fog:!1,depthWrite:!1})),Pr.userData.far=!0,Ye.add(Pr)}function pn(i,e,t){let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createImageData(128,128);for(let o=0;o<r.data.length;o+=4){let c=(Math.random()-.5)*e;r.data[o]=i[0]+c,r.data[o+1]=i[1]+c,r.data[o+2]=i[2]+c*.8,r.data[o+3]=255}s.putImageData(r,0,0);let a=new hr(n);return a.wrapS=a.wrapT=ai,a.repeat.set(t,t),a.colorSpace=Gt,a}var Gn=5.2,fn=-17.9,ji=17.9,Re=23,Er=new Ae({color:2854560,roughness:.22,metalness:.15});{let i=new ht(new Mt(160,160),new Ae({map:pn([203,180,138],34,60),roughness:1}));i.rotation.x=-Math.PI/2,i.position.set(Re-80,0,0),Ye.add(i);let e=new ht(new Mt(5e3,5e3),Er);e.rotation.x=-Math.PI/2,e.position.y=-.62,Ye.add(e);for(let[t,n,s,r]of[[1500,230,8364966,1],[1150,120,6262662,2]]){let a=[];for(let u=0;u<=160;u++){let d=-Math.PI+2*Math.PI*u/160,f=Math.abs(Math.atan2(Math.sin(d-1.45),Math.cos(d-1.45))),p=Math.max(0,Math.min(1,(f-.95)/.7)),y=p*n*(.45+.3*Math.sin(u*.21+r)+.18*Math.sin(u*.63+r*3)+.07*Math.sin(u*1.7));a.push(Math.cos(d)*t,-2,Math.sin(d)*t,Math.cos(d)*t,Math.max(0,y)-1,Math.sin(d)*t)}let c=[];for(let u=0;u<160;u++){let d=u*2;c.push(d,d+1,d+2,d+1,d+3,d+2)}let l=new Ft;l.setAttribute("position",new dt(a,3)),l.setIndex(c);let h=new ht(l,new Tt({color:s,side:Bt,fog:!1}));h.userData.far=!0,Ye.add(h)}}var Gs=new vt;Gs.visible=!1;Ye.add(Gs);var Yt=Ye;function Y(i,e,t,n,s,r){let a=new ht(i,e);return a.position.set(t,n,s),(r||Yt).add(a),a}var Ar=null,Na=null,nu=[],mn={};function MS(){let i=(I,U)=>new Ae({map:I,roughness:U===void 0?.9:U}),e=(I,U,O,W,D,G,q,le)=>Y(new Qe(I,U,O),W,D,G,q,le),t=Ht([138,120,96],5,21,3),n=i(t),s=i(Ht([84,66,48],3,1,2)),r=i(Ht([70,56,42],4,1,2)),a=new Ae({color:1842206,roughness:.6,metalness:.7}),o=new Ae({map:pn([168,146,104],30,4),roughness:1}),c=new Ae({map:pn([156,136,100],30,3),roughness:1}),l=Re-2.5,h=Re+23,u=h-l,d=(l+h)/2;e(u,.1,3.4,n,d,0,0);for(let I of[-1.62,1.62])e(u,.22,.2,s,d,-.14,I),e(u,.12,.16,s,d,.1,I*1.02);for(let I=l+1;I<h;I+=2.6){e(.2,.22,3.2,s,I,-.16,0);for(let U of[-1.72,1.72]){let O=Math.round((I-l)/2.6)%2===0,W=Y(new nt(.15,.17,O?3.3:2.4,9),r,I,O?-.25:-.9,U);O&&Y(new nt(.17,.15,.06,9),s,I,1.42,U)}if(I<h-2)for(let U of[-1,1]){let O=e(.1,.1,3.6,s,I,-.85,0);O.rotation.x=U*.5}}for(let[I,U]of[[Re+6,1.72],[Re+11.2,1.72],[Re+8.6,-1.72],[Re+16.4,-1.72]]){let O=Y(new ei(.24,.045,6,14),o,I,.75,U);O.rotation.x=Math.PI/2,Y(new ei(.25,.045,6,14),o,I,.84,U).rotation.x=Math.PI/2}let f=(I,U,O)=>{for(let W=0;W<3;W++)Y(new ei(O-W*.02,.04,6,16),o,I,.09+W*.07,U).rotation.x=Math.PI/2};f(Re+4,-1.2,.3),f(Re+19,1.15,.34);let p=mn.merchant;p.position.set(Re+17.5,-.35,-5.9),Ye.add(p);let y=mn.sloop;y.position.set(Re+17.5,-.35,4.9),y.rotation.y=Math.PI,Ye.add(y);let g=e(1,.07,2.3,n,Re+17.6,.66,-2.1);g.rotation.x=-.56;for(let I=0;I<5;I++){let U=e(1,.03,.05,s,Re+17.6,.2+I*.25,-1.4-I*.4);U.rotation.x=-.56}let m=(I,U)=>{let O=new Ft().setFromPoints([new z(...I),new z((I[0]+U[0])/2,Math.min(I[1],U[1])-.25,(I[2]+U[2])/2),new z(...U)]);Ye.add(new rs(O,new Cs({color:9073742})))};m([Re+8.6,.8,-1.72],[Re+6,3.2,-3.6]),m([Re+16.4,.8,-1.72],[Re+21.5,2.2,-3.4]),m([Re+11.2,.8,1.72],[Re+10.5,1.5,3.4]),m([Re+19,.6,1.72],[Re+24.5,1.9,3.3]);let x=new Fi([[0,-.45],[.27,-.45],[.33,-.25],[.36,0],[.33,.25],[.27,.45],[0,.45]].map(([I,U])=>new he(I,U)),14),M=i(Ht([122,90,56],10,2,1),.8),_=[[-.38,.292],[-.2,.342],[.2,.342],[.38,.292]].map(([I,U])=>[I,new nt(U,U,.035,14,1,!0)]),E=(I,U,O,W)=>{let D=new vt;D.position.set(I,U+(W?.36:.45),O),W&&(D.rotation.z=Math.PI/2,D.rotation.y=I*2.3),Ye.add(D),Y(x,M,0,0,0,D);for(let[G,q]of _)Y(q,a,0,G,0,D)},A=i(Ht([150,118,78],4,1,1)),b=(I,U,O,W,D)=>{let G=new vt;G.position.set(I,U+W/2,O),G.rotation.y=D,Ye.add(G),e(W,W,W,A,0,0,0,G);for(let q of[-1,1])for(let le of[-1,1])e(.07,W+.03,.07,s,q*W/2,0,le*W/2,G),e(W+.03,.07,.07,s,0,q*W/2,le*W/2,G),e(.07,.07,W+.03,s,q*W/2,le*W/2,0,G)},S=(I,U,O,W)=>{let D=Y(new Pn(.32,10,8),c,I,U+.2*W,O);D.scale.set(W*1.2,.7*W,W*.85),D.rotation.y=I};E(Re+2.2,.05,1),E(Re+2.9,.05,1.15),E(Re+2.5,.05,.45,!0),b(Re+14.6,.05,1.1,.8,.2),b(Re+15.5,.05,1.2,.6,.6),b(Re+14.7,.85,1.1,.55,.5),S(Re+13.7,.05,1.2,1);for(let[I,U,O]of[[20.2,2.8,0],[20.9,3,0],[20.4,3.6,2],[19.6,-3.2,1],[20.6,-2.8,0],[21.5,-3.3,1],[20.3,-3.9,3],[21.1,-4.1,3],[20.7,-4,4]])O===0?E(I,0,U):O===2?E(I,0,U,!0):O===1?b(I,0,U,.75,I):O===3?S(I,0,U,1):S(I,.3,U,.9);let L=Ye.children.length;for(let[I,U,O]of[[-9.6,-4.4,0],[3.4,4.35,0],[4.15,4.4,1],[-13.2,4.4,0],[11.6,-4.4,1],[12.3,-4.45,0]])O?b(I,.12,U,.65,.1):E(I,.12,U);nu.push(...Ye.children.slice(L));{let O=new li;O.moveTo(-4.6/2,-1.5*.36),O.quadraticCurveTo(0,-1.5*.56,4.6*.3,-1.5*.4),O.quadraticCurveTo(4.6*.45,-1.5*.2,4.6/2,0),O.quadraticCurveTo(4.6*.45,1.5*.2,4.6*.3,1.5*.4),O.quadraticCurveTo(0,1.5*.56,-4.6/2,1.5*.36),O.closePath();let W=new os(O,{depth:.62,bevelEnabled:!1,curveSegments:8});W.rotateX(-Math.PI/2);let D=W.attributes.position;for(let le=0;le<D.count;le++)D.getY(le)<.3&&(D.setZ(le,D.getZ(le)*.45),D.setX(le,D.getX(le)*.9));W.computeVertexNormals();let G=new vt;G.position.set(Re-2.6,0,7.2),G.rotation.set(0,.5,.12),Ye.add(G);let q=i(Ht([96,80,62],6,3,1));q.side=Bt,Y(W,q,0,0,0,G),e(4.6*.86,.03,1.5*.78,new Ae({color:3812384,roughness:1}),-.1,.34,0,G);for(let le of[-1.2,-.2,.9])e(.22,.04,1.5*.86,s,le,.5,0,G);for(let le of[-.2,.15]){let Pe=Y(new nt(.025,.025,3.2,6),s,-.2,.56,le,G);Pe.rotation.z=Math.PI/2+.03,e(.6,.02,.14,s,1.5,.52,le,G)}}{let I=Ln(128,128,q=>{q.clearRect(0,0,128,128),q.strokeStyle="rgba(96,84,60,0.95)",q.lineWidth=1.4;for(let le=-128;le<256;le+=12)q.beginPath(),q.moveTo(le,0),q.lineTo(le+128,128),q.stroke(),q.beginPath(),q.moveTo(le,0),q.lineTo(le-128,128),q.stroke()});I.repeat.set(3,1.4);let U=Re-3.2,O=-8.4;for(let q of[-2,2])Y(new nt(.05,.06,2.3,6),s,U+q,1.15,O);let W=Y(new nt(.04,.04,4.3,6),s,U,2.2,O);W.rotation.z=Math.PI/2;let G=Y(new Mt(3.9,1.9,8,1),new Tt({map:I,transparent:!0,side:Bt,alphaTest:.3}),U,1.25,O).geometry.attributes.position;for(let q=0;q<G.count;q++)G.setZ(q,Math.sin(G.getX(q)*2.2)*.12*(1-(G.getY(q)+.95)/1.9))}let P=Y(new Mt(3.2,160),new Tt({color:7298372,transparent:!0,opacity:.35}),Re-1.4,.006,0);P.rotation.x=-Math.PI/2;let k=Ln(64,256,I=>{I.clearRect(0,0,64,256);for(let U=0;U<256;U+=2){let O=14+Math.sin(U*.11)*8+Math.sin(U*.37)*5+Math.random()*6,W=I.createLinearGradient(32-O,0,32+O,0);W.addColorStop(0,"rgba(255,255,255,0)"),W.addColorStop(.6,"rgba(255,255,255,0.75)"),W.addColorStop(1,"rgba(255,255,255,0)"),I.fillStyle=W,I.fillRect(32-O,U,O*2,2)}});k.repeat.set(1,6);let V=Y(new Mt(1.6,160),new Tt({map:k,transparent:!0,depthWrite:!1}),Re+.2,-.33,0);V.rotation.x=-Math.PI/2;let X=Y(new Mt(1.2,160),new Ae({map:pn([176,152,112],30,30),roughness:1}),Re+.45,-.19,0);X.rotation.set(-Math.PI/2+0,0,0),X.rotation.y=.33,Ar=Ln(128,128,I=>{let U=I.createImageData(128,128),O=new Float32Array(16384);for(let W=0;W<O.length;W++){let D=W%128,G=W/128|0;O[W]=Math.sin(D*.196+Math.sin(G*.147)*2)+Math.sin(G*.245+Math.sin(D*.098)*1.5)*.7+Math.sin((D+G)*.393)*.3}for(let W=0;W<128;W++)for(let D=0;D<128;D++){let G=W*128+D,q=O[W*128+(D+1)%128]-O[G],le=O[(W+1)%128*128+D]-O[G];U.data[G*4]=128+q*150,U.data[G*4+1]=128+le*150,U.data[G*4+2]=255,U.data[G*4+3]=255}I.putImageData(U,0,0)});let R=new Mt(300,300,60,60);R.rotateX(-Math.PI/2),Na=Y(R,Er,Re+60,-.35,0),Na.userData.base=R.attributes.position.array.slice(),Ar.colorSpace=ui,Ar.repeat.set(160,160),Er.normalMap=Ar,Er.normalScale.set(.55,.55),Er.needsUpdate=!0}var Ue={x0:-205,x1:-195,z0:-3.5,z1:3.5,h:2.8},Kf={},Ff=null,hl=null,zh=null,ms=null,ul=[];function Ln(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new hr(n);return s.colorSpace=Gt,s.wrapS=s.wrapT=ai,s.anisotropy=Jf,s}function kf(i,e,t,n){let s=i.getImageData(0,0,e,t);for(let r=0;r<s.data.length;r+=4){let a=(Math.random()-.5)*n;s.data[r]+=a,s.data[r+1]+=a,s.data[r+2]+=a*.8}i.putImageData(s,0,0)}function Ht(i,e,t,n){let s=Ln(256,256,(r,a,o)=>{let c=a/e;for(let l=0;l<e;l++){let h=(Math.random()-.5)*26;r.fillStyle=`rgb(${i[0]+h|0},${i[1]+h|0},${i[2]+h*.8|0})`,r.fillRect(l*c,0,c,o),r.strokeStyle="rgba(30,18,10,0.25)",r.lineWidth=1;for(let u=0;u<9;u++){let d=l*c+3+Math.random()*(c-6);r.beginPath(),r.moveTo(d,0),r.bezierCurveTo(d+3,o*.3,d-3,o*.6,d+1,o),r.stroke()}r.fillStyle="rgba(15,9,5,0.75)",r.fillRect(l*c,0,2,o),Math.random()<.5&&(r.fillStyle="rgba(25,14,8,0.6)",r.beginPath(),r.ellipse(l*c+c/2,Math.random()*o,3,5,0,0,7),r.fill())}kf(r,a,o,18)});return s.repeat.set(t||1,n||1),s}function SS(){Yt=Gs;let i=(F,Q)=>new Ae({map:F,roughness:Q===void 0?.9:Q}),e=i(Ht([104,76,50],4,1,1)),t=i(Ht([62,45,31],3,1,1)),n=i(Ht([122,92,62],5,1,1),.8),s=i(Ht([74,54,38],8,3,2)),r=new Ae({color:3811869,roughness:.95}),a=Ln(512,256,(F,Q,ce)=>{let N=F.createLinearGradient(0,0,0,ce);N.addColorStop(0,"#d9ceb4"),N.addColorStop(.55,"#d2c6aa"),N.addColorStop(1,"#a7997c"),F.fillStyle=N,F.fillRect(0,0,Q,ce);for(let Ke=0;Ke<26;Ke++)F.fillStyle=`rgba(${90+Math.random()*40|0},${74+Math.random()*30|0},50,${.012+Math.random()*.025})`,F.beginPath(),F.ellipse(Math.random()*Q,Math.random()*ce,20+Math.random()*70,10+Math.random()*40,Math.random()*3,0,7),F.fill();kf(F,Q,ce,14)});a.wrapT=Cn;let o=new Ae({map:a,roughness:1}),c=Ln(256,256,(F,Q,ce)=>{F.fillStyle="#9b917e",F.fillRect(0,0,Q,ce);for(let N=0;N<8;N++)for(let Ke=-1;Ke<4;Ke++){let Be=Math.random();F.fillStyle=`rgb(${150+Be*36|0},${80+Be*22|0},${54+Be*14|0})`,F.fillRect(Ke*64+N%2*32+2,N*32+2,60,28)}for(let N=0;N<14;N++)F.fillStyle=`rgba(40,28,20,${.06+Math.random()*.1})`,F.beginPath(),F.ellipse(Math.random()*Q,Math.random()*ce,20+Math.random()*50,14+Math.random()*30,0,0,7),F.fill();kf(F,Q,ce,24)}),l=i(c),h=c.clone();h.repeat.set(5,3.5),h.needsUpdate=!0;let u=c.clone();u.repeat.set(1.2,1.6),u.needsUpdate=!0;let d=i(u),f=new Ae({color:10658979,roughness:.38,metalness:.85}),p=new Ae({color:11569722,roughness:.4,metalness:.8}),y=new Ae({color:1842206,roughness:.6,metalness:.7}),g=new Ae({color:2046506,roughness:.18,metalness:.15}),m=new Ae({color:15328472,roughness:.8}),x=new Ae({color:9071172,roughness:.5}),M=new Ae({color:10135696,roughness:.35}),_=new Ae({color:15260864,roughness:.7}),E=new Tt({color:16762474}),A=new Ae({map:pn([150,130,96],30,3),roughness:1}),b=(F,Q,ce,N,Ke,Be,xt,be)=>Y(new Qe(F,Q,ce),N,Ke,Be,xt,be),S=(Ue.x0+Ue.x1)/2,L=Ue.x1-Ue.x0,P=Ue.z1-Ue.z0,k=Ue.h;Y(new Mt(L,P),i(h),S,0,0).rotation.x=-Math.PI/2,Y(new Mt(L,P),s,S,k,0).rotation.x=Math.PI/2;let V=(F,Q,ce,N,Ke)=>{let Be=o.clone();Be.map=a.clone(),Be.map.repeat.set(Ke,1),Be.map.needsUpdate=!0;let xt=Y(new Mt(F,k),Be,Q,k/2,ce);xt.rotation.y=N};V(L,S,Ue.z0,0,3),V(L,S,Ue.z1,Math.PI,3),V(P,Ue.x0,0,Math.PI/2,2),V(P,Ue.x1,0,-Math.PI/2,2);for(let F=Ue.x0+.06;F<=Ue.x1;F+=(L-.12)/8)b(.13,k,.07,r,F,k/2,Ue.z0+.035);for(let F of[Ue.x0+.06,-204,-201.75,-198.8,-195.9,Ue.x1-.06])b(.13,k,.07,r,F,k/2,Ue.z1-.035);for(let F=Ue.z0+.06;F<=Ue.z1;F+=(P-.12)/6)b(.07,k,.13,r,Ue.x0+.035,k/2,F),b(.07,k,.13,r,Ue.x1-.035,k/2,F);b(L,.14,.08,r,S,.07,Ue.z0+.04),b(L,.14,.08,r,S,.07,Ue.z1-.04),b(.08,.14,P,r,Ue.x0+.04,.07,0),b(.08,.14,P,r,Ue.x1-.04,.07,0),b(L,.16,.09,r,S,k-.08,Ue.z0+.045),b(L,.16,.09,r,S,k-.08,Ue.z1-.045);for(let F=Ue.x0+.5;F<Ue.x1;F+=.62)b(.1,.15,P,r,F,k-.075,0);b(L,.26,.28,r,S,k-.28,.4);let X=Ln(256,160,(F,Q,ce)=>{let N=F.createLinearGradient(0,0,0,ce);N.addColorStop(0,"#f4f6ea"),N.addColorStop(1,"#cfdccf"),F.fillStyle=N,F.fillRect(0,0,Q,ce),F.strokeStyle="rgba(52,56,58,0.9)",F.lineWidth=2.2;for(let Ke=-ce;Ke<Q+ce;Ke+=22)F.beginPath(),F.moveTo(Ke,0),F.lineTo(Ke+ce*.62,ce),F.stroke(),F.beginPath(),F.moveTo(Ke,0),F.lineTo(Ke-ce*.62,ce),F.stroke()}),R=new Tt({map:X}),I=new Tt({map:X,transparent:!0,opacity:.2,blending:va,depthWrite:!1});for(let F of[-200.3,-197.3]){Y(new Mt(1.9,1.2),R,F,1.72,Ue.z1-.012).rotation.y=Math.PI;for(let ce of[-.475,.475])b(.05,1.2,.05,r,F+ce/1,1.72,Ue.z1-.03);b(.06,1.2,.06,r,F,1.72,Ue.z1-.03);for(let ce of[1.09,2.35])b(2.06,.08,.09,r,F,ce,Ue.z1-.04);for(let ce of[-.99,.99])b(.08,1.34,.09,r,F+ce,1.72,Ue.z1-.04);b(2.1,.05,.2,e,F,1.04,Ue.z1-.1);let Q=Y(new Mt(2,2.3),I,F-.3,.012,1.7);Q.rotation.x=-Math.PI/2}b(1.15,2.2,.06,e,-203,1.1,Ue.z1-.05);for(let F of[.45,1.75])b(.9,.06,.02,y,-203.05,F,Ue.z1-.09);b(.05,.14,.04,y,-202.55,1.1,Ue.z1-.1);for(let F of[-.63,.63])b(.1,2.3,.1,r,-203+F,1.15,Ue.z1-.05);b(1.36,.12,.1,r,-203,2.3,Ue.z1-.05),b(5.4,.95,.65,e,-200.9,.475,-2.2),b(5.6,.07,.8,n,-200.9,.985,-2.2);for(let F=-203.4;F<-198.3;F+=.9)b(.07,.8,.02,t,F,.5,-1.866);b(5.4,.08,.02,t,-200.9,.86,-1.866),b(5.4,.1,.03,t,-200.9,.05,-1.86);for(let F of[1.2,1.7,2.2])b(4.6,.045,.3,t,-201.2,F,Ue.z0+.2);for(let F of[-203.5,-201.2,-198.9])b(.05,1.5,.3,t,F,1.65,Ue.z0+.2);let U=[[0,0],[.085,0],[.105,.04],[.1,.09],[.06,.13],[.022,.17],[.02,.24],[.028,.245],[0,.245]].map(([F,Q])=>new he(F,Q)),O=new Fi(U,14),W=new Fi([[0,0],[.07,0],[.1,.08],[.095,.17],[.05,.23],[.045,.29],[.055,.3],[0,.3]].map(([F,Q])=>new he(F,Q)),14),D=new Fi([[0,0],[.06,0],[.11,.1],[.115,.17],[.07,.24],[.075,.26],[0,.26]].map(([F,Q])=>new he(F,Q)),16),G=Ln(128,128,F=>{F.fillStyle="#1b3f8a",F.fillRect(0,0,128,128),F.fillStyle="#eef0ea",F.beginPath(),F.arc(64,64,62,0,7),F.fill(),F.strokeStyle="#2a4f9c",F.lineWidth=3;for(let Q of[56,40])F.beginPath(),F.arc(64,64,Q,0,7),F.stroke();F.lineWidth=2;for(let Q=0;Q<6.28;Q+=.52)F.beginPath(),F.moveTo(64+Math.cos(Q)*42,64+Math.sin(Q)*42),F.quadraticCurveTo(64+Math.cos(Q+.2)*50,64+Math.sin(Q+.2)*50,64+Math.cos(Q+.26)*55,64+Math.sin(Q+.26)*55),F.stroke();for(let Q=0;Q<6.28;Q+=1.05)F.beginPath(),F.ellipse(64+Math.cos(Q)*18,64+Math.sin(Q)*18,9,4,Q,0,7),F.stroke()}),q=[new Ae({color:15263968,roughness:.3}),new Ae({map:G,roughness:.25}),new Ae({color:15263968,roughness:.3})],le=new nt(.125,.11,.014,22),Pe=new nt(.04,.048,.12,12),Z=new ei(.03,.007,6,10,Math.PI),de=(F,Q,ce,N)=>{let Ke=new vt;Ke.position.set(F,Q,ce),Ke.rotation.y=N||0,Yt.add(Ke),Y(Pe,f,0,.06,0,Ke);let Be=Y(Z,f,.045,.06,0,Ke);Be.rotation.z=-Math.PI/2},Ie=Ue.z0+.2;for(let F=0;F<5;F++)Y(O,g,-203.2+F*.4,1.2225,Ie);for(let F=0;F<4;F++){let Q=Y(le,q,-200.8+F*.42,1.345,Ie-.06);Q.rotation.x=Math.PI/2-.22}for(let F=0;F<4;F++)Y(W,x,-203.1+F*.5,1.7225,Ie);Y(D,M,-200.6,1.7225,Ie);for(let F=0;F<5;F++)de(-200.05+F*.22,1.7225,Ie,.5*F);for(let F=0;F<6;F++)Y(O,g,-203.2+F*.36,2.2225,Ie);for(let F=0;F<3;F++){let Q=Y(le,f,-200.6+F*.5,2.345,Ie-.06);Q.rotation.x=Math.PI/2-.22}Y(new Mt(.6,.45),new Ae({map:Ln(128,96,F=>{F.fillStyle="#23262a",F.fillRect(0,0,128,96),F.strokeStyle="#d8d8d0",F.lineWidth=2;for(let Q=0;Q<3;Q++)for(let ce=0;ce<4+Q*2;ce++)F.beginPath(),F.moveTo(12+ce*9,14+Q*26),F.lineTo(14+ce*9,30+Q*26),F.stroke();F.strokeStyle="#6b4a2c",F.lineWidth=6,F.strokeRect(0,0,128,96)}),roughness:.9}),-198.3,1.7,Ue.z0+.012);let Xe=Ln(128,128,F=>{F.fillStyle="#6a4a24",F.fillRect(0,0,128,128),F.strokeStyle="#2c1c0c",F.lineWidth=3;for(let Q=0;Q<4;Q++)for(let ce=0;ce<4;ce++){let N=ce*34+Q%2*17-6,Ke=Q*34;F.fillStyle=`rgb(${120+Math.random()*40|0},${84+Math.random()*24|0},40)`,F.beginPath();for(let Be=0;Be<6;Be++)F.lineTo(N+17+Math.cos(Be*1.047)*19,Ke+17+Math.sin(Be*1.047)*19);F.closePath(),F.fill(),F.stroke()}}),Me=Y(new Pn(.42,18,10,0,6.3,0,1.2),i(Xe,.45),Ue.x1-.62,2.1,-.6);Me.scale.set(.8,.5,1.05),Me.rotation.z=Math.PI/2;let je=new Fi([[0,-.52],[.34,-.52],[.4,-.3],[.44,0],[.4,.3],[.34,.52],[0,.52]].map(([F,Q])=>new he(F,Q)),18),Rt=i(Ht([118,86,52],10,2,1),.8),Ze=(F,Q,ce)=>{let N=new vt;N.position.set(F,Q,ce),N.rotation.z=Math.PI/2,Yt.add(N),Y(je,Rt,0,0,0,N);for(let[Be,xt]of[[-.45,.362],[-.24,.416],[.24,.416],[.45,.362]])Y(new nt(xt,xt,.04,18,1,!0),y,0,Be,0,N);let Ke=b(.14,.03,.03,p,F+.58,Q-.26,ce);return b(.03,.07,.03,p,F+.62,Q-.22,ce),Ke};for(let F of[-2.85,-1.9]){Ze(-204.35,.8,F),b(.9,.08,.1,t,-204.35,.32,F-.25),b(.9,.08,.1,t,-204.35,.32,F+.25);for(let Q of[-.38,.38])b(.1,.3,.7,t,-204.35+Q,.15,F)}let lt=(F,Q,ce,N)=>{b(ce,.05,N,n,F,.745,Q);for(let Ke of[-1,1]){let Be=F+Ke*(ce/2-.28);for(let xt of[-1,1]){let be=b(.07,.76,.07,t,Be,.36,Q+xt*.17);be.rotation.x=-xt*.3}b(.07,.07,N*.7,t,Be,.69,Q)}b(ce-.5,.06,.05,t,F,.3,Q)},ft=(F,Q,ce)=>{b(ce,.05,.28,n,F,.45,Q);for(let N of[-1,1])b(.05,.45,.26,t,F+N*(ce/2-.16),.225,Q);b(ce-.3,.07,.04,t,F,.3,Q)},ae=(F,Q,ce)=>{let N=new vt;N.position.set(F,0,Q),N.rotation.y=ce,Yt.add(N),b(.34,.04,.26,n,0,.47,0,N);for(let Ke of[-1,1])for(let Be of[-1,1]){let xt=b(.04,.47,.04,t,Ke*.13,.235,Be*.09,N);xt.rotation.z=-Ke*.1}b(.26,.05,.03,t,0,.36,.09,N),b(.26,.05,.03,t,0,.36,-.09,N)};lt(-198.2,1.3,1.9,.8),ft(-198.2,.58,1.7),ft(-198.2,2.02,1.7),lt(-201.6,1,1.9,.8),ft(-201.6,.28,1.7),ft(-201.6,1.72,1.7),b(.7,.04,.7,n,-195.9,.75,2.3);for(let F of[-1,1])for(let Q of[-1,1])b(.05,.74,.05,t,-195.9+F*.28,.37,2.3+Q*.28);ae(-202.6,-1.25,.3),ae(-200.2,-1.3,-.2),ae(-196.9,-1.7,.9),b(.4,.05,1.7,n,-204.72,.45,2),b(.05,1.5,1.7,e,-204.9,.75,2);for(let F of[-.85,.85])b(.42,1.05,.05,e,-204.72,.525,2+F);b(.38,.4,1.66,t,-204.72,.2,2);for(let F of[-1,1])b(.6,1.45,.4,d,Ue.x1-.3,.725,-.6+F*.9);b(.6,1.25,2.2,d,Ue.x1-.3,2.175,-.6),b(.12,1.45,1.4,new Tt({color:919815}),Ue.x1-.07,.725,-.6),b(.62,.2,2.3,r,Ue.x1-.3,1.5,-.6),b(.75,.05,2.4,e,Ue.x1-.36,1.62,-.6),b(.7,.06,1.5,d,Ue.x1-.42,.03,-.6),b(.03,1.1,.03,y,Ue.x1-.2,.75,-1.2),b(.03,.03,.7,y,Ue.x1-.2,1.2,-.87),b(.015,.4,.015,y,Ue.x1-.2,1,-.6);let ge=Y(new Pn(.22,14,10),y,Ue.x1-.2,.72,-.6);ge.scale.y=.8,Ff=Y(new Ni(.22,.5,7),new Tt({color:16751150}),Ue.x1-.22,.3,-.6);let me=Y(new Ni(.13,.32,6),E,Ue.x1-.26,.22,-.42);ul.push(me);for(let[F,Q]of[[-.2,.3],[.15,-.4],[0,1.2]])Y(new nt(.05,.05,.5,7),t,Ue.x1-.25,.09,-.6+F).rotation.set(Math.PI/2,0,Q);for(let F=0;F<7;F++){let Q=Y(new nt(.055,.055,.55,7),e,Ue.x1-.45,.06+(F>3?.11:0),.95+F%4*.12+(F>3?.06:0));Q.rotation.z=Math.PI/2}for(let F=0;F<3;F++)Y(le,f,Ue.x1-.5,1.77,-1.2+F*.32).rotation.set(0,0,Math.PI/2-.22);Y(D,M,Ue.x1-.42,1.645,.1),hl=new ds(16751946,0,8,1.7),hl.position.set(Ue.x1-.9,.8,-.6),Yt.add(hl);let Ne=(F,Q,ce)=>{Y(new nt(.075,.06,.015,14),p,F,Q+.008,ce),Y(new nt(.02,.024,.05,8),p,F,Q+.04,ce),b(.1,.008,.025,p,F+.1,Q+.012,ce),Y(new nt(.011,.011,.12,6),_,F,Q+.12,ce);let N=Y(new Pn(.016,6,6),E,F,Q+.2,ce);N.scale.y=1.9,ul.push(N)};Ne(-198.75,.77,1.3),Ne(-201,.77,1.05),Ne(-202.9,1.02,-2.2),Ne(Ue.x1-.4,1.645,-1.5);{let ce=k-.95;b(.012,.5,.012,y,-200.2,ce+.42,.4),b(.18,.02,.18,y,-200.2,ce+.17,.4),b(.18,.02,.18,y,-200.2,ce-.13,.4);for(let N of[-1,1])for(let Ke of[-1,1])b(.015,.3,.015,y,-200.2+N*.08,ce+.02,.4+Ke*.08);b(.14,.26,.14,new Tt({color:16766346,transparent:!0,opacity:.55}),-200.2,ce+.02,.4),zh=new ds(16767392,0,9,1.6),zh.position.set(-200.2,ce,.4),Yt.add(zh)}de(-198.7,.77,1.08,1),de(-197.75,.77,1.5,3),de(-202.15,.77,.85,2),de(-201.3,.77,1.2,4.5),de(-201.9,1.02,-2.3,.6),Y(W,x,-202.3,1.02,-2.05),Y(W,x,-197.6,.77,1.12);for(let[F,Q]of[[0,0],[.05,.03],[-.03,.05],[.09,-.02]])Y(new nt(.018,.018,.004,10),f,-200+F,1.022,-2+Q);for(let[F,Q,ce]of[[-195.6,-2.9,1],[-196.1,-3,.85],[-195.7,-2.4,.9]])Y(new Pn(.3,10,8),A,F,.24*ce,Q).scale.set(ce,.85*ce,ce*.9);let we=Y(new ei(.2,.04,6,16),A,-204.4,.05,-.7);we.rotation.x=Math.PI/2;let ct=b(.03,1.4,.03,e,-204.8,.72,.6);ct.rotation.z=-.12,b(.1,.25,.18,A,-204.7,.13,.6);let ke={};for(let F of Hs)ke[F.id]=new vt,ke[F.id].position.set(F.x,F.y,F.z),Yt.add(ke[F.id]);Y(O,g,0,0,0,ke.bottle).scale.setScalar(1.25),Y(O,g,.26,0,.05,ke.bottle);for(let F=0;F<6;F++)Y(le,f,0,.009+F*.016,0,ke.pewter);for(let[F,Q]of[[-.06,.2],[.05,-.15],[.14,.05]]){let ce=new vt;ce.position.set(0,.012,F),ce.rotation.y=Q,ke.pipes.add(ce);let N=Y(new nt(.006,.008,.34,6),m,0,0,0,ce);N.rotation.z=Math.PI/2,Y(new nt(.016,.012,.045,8),m,.175,.015,0,ce)}{let F=Ln(64,64,N=>{N.fillStyle="#c8873a",N.fillRect(0,0,64,64),N.fillStyle="#4a2412";for(let Ke=0;Ke<46;Ke++)N.beginPath(),N.ellipse(Math.random()*64,Math.random()*64,3+Math.random()*7,2+Math.random()*5,Math.random()*3,0,7),N.fill()}),Q=new Ae({map:F,roughness:.3}),ce=new Ae({color:15260864,roughness:.5});b(.2,.11,.14,Q,0,.065,0,ke.turtle),b(.21,.012,.15,ce,0,.126,0,ke.turtle),b(.19,.05,.13,Q,0,.157,0,ke.turtle),b(.22,.012,.16,Q,0,.006,0,ke.turtle),b(.02,.03,.004,ce,0,.07,.072,ke.turtle)}for(let F of Hs){let Q=new ht(new Ps(.27,.3,32),new Tt({color:14263361,side:Bt}));Q.rotation.x=-Math.PI/2,Q.position.y=.004,ke[F.id].add(Q),Kf[F.id]=Q}ms=new vt,ms.position.set(-200.4,1.02,-2.05),ms.visible=!1,Yt.add(ms),Y(new nt(.11,.06,.07,16),f,0,.035,0,ms),Y(new nt(.1,.1,.01,16),new Ae({color:8014370,roughness:.6}),0,.066,0,ms),b(.012,.01,.16,f,.16,.006,.02,ms),Yt=Ye}function ii(i){v.place=i;let e=i!=="out",t=i==="in"?Gs:i==="ware"?Wi:Ye;for(let n of Ye.children)n.isLight||(n===Gs?n.visible=i==="in":n===Wi?n.visible=i==="ware":n===jn||n===zs?n.visible=!1:n.visible=!e||i==="ware"&&n.userData.far===!0);t.add(Ge),Ge.visible=i!=="ware",vn&&t.add(vn),dg.intensity=e?.5:2.3,Da.intensity=e?1.5:2.6,i==="in"?Da.position.set(.3,.75,1):i==="ware"?Da.position.set(1,.7,.2):Da.position.set(-.35,1,.75),hl.intensity=i==="in"?16:0,zh.intensity=i==="in"?9:0,dl&&(dl.intensity=i==="ware"?14:0),i==="in"?(rt.x=-201,rt.z=-2.95,Ge.position.set(rt.x,0,rt.z)):i==="ware"?(rt.x=9999,rt.z=0):(rt.x=-5.25,rt.z=-Gn+1.05,Ge.position.set(rt.x,.12,rt.z)),Ge.rotation.y=0,Sn&&(Sn.visible=!e&&!v.talked)}var al={h1:6,h2:5,h3:7.2,h4:6.6,h5:5.4,h6:5.6},wS=["h2","h6","h1","h4","h5","h3"],TS=["h3","h1","h5","h2","h4","h6"],fg=new Lh;fg.setMeshoptDecoder(V0);var qs=!1;function pg(i){re("loadnote").hidden=!1,re("loadnote").textContent="Part of the game did not load ("+i+"). Reload the page to try again."}function mg(i){return new Promise((e,t)=>{let n=document.createElement("script");n.src="models/"+i+".js",n.onload=e,n.onerror=()=>{pg(i),t(i)},document.head.appendChild(n)})}function Hh(i){return mg(i).then(()=>new Promise((e,t)=>{let n=atob(window.__models[i]),s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);delete window.__models[i],fg.parse(s.buffer,"",e,()=>{pg(i),t(i)})}))}async function q0(i,e){let t=0;await Promise.all(i.map(n=>(n.startsWith("tex_")?mg(n):Hh(n).then(s=>{window.__got=window.__got||{},window.__got[n]=s})).then(()=>{t++,e&&e(t/i.length)})))}var gg={},Ge=null,rt={x:-5.25,z:-Gn+1.05},Jf=bs.capabilities.getMaxAnisotropy(),X0={Brick:["brick","brick_n"],Shingle:["shingle","shingle_n"],ClayTile:["clay","clay_n"],Wood:["wood","wood_n"],Stone:["stone","stone_n"],Plaster:["plaster","plaster_n"],LeadedGlass:["glass","glass_n"],Hull:["hull","hull_n"],Spar:["hull","hull_n"],Tar:["hull","hull_n"],Ochre:["hull","hull_n"],Red:["hull","hull_n"],Deck:["deck","deck_n"],Sail:["canvas"],Glass:["glass"],Flag:["ensign"]},Tf={},Ef={},dE=new fr,Kh={};async function j0(){await Promise.all(Object.keys(window.__tex||{}).filter(i=>!Kh[i]).map(i=>new Promise(e=>{let t=new Image;t.onload=()=>{Kh[i]=t,e()},t.onerror=()=>e(),t.src=window.__tex[i]})))}function Jh(i,e){if(!Tf[i]&&Kh[i]){let t=new Qt(Kh[i]);t.needsUpdate=!0,t.flipY=!1,t.wrapS=t.wrapT=ai,t.colorSpace=e?Gt:ui,t.anisotropy=Jf,Tf[i]=t}return Tf[i]||null}function wr(i){return i.traverse(e=>{if(e.isMesh&&X0[e.material.name]){let t=e.material.name;if(!Ef[t]){let n=e.material,[s,r]=X0[t];n.map=Jh(s,!0),n.color.set(16777215),r&&(n.normalMap=Jh(r,!1)),n.needsUpdate=!0,Ef[t]=n}e.material=Ef[t]}}),ES(i)}function ES(i){return i.traverse(e=>{if(e.isMesh){let t=e.material;t.map&&(t.map.anisotropy=Jf),t.name==="LeadedGlass"&&(t.emissive=new qe(4875376),t.emissiveMap=t.map,t.roughness=.2),e.isSkinnedMesh&&(e.frustumCulled=!1)}}),i}var ks=null,ni=null,mi=null,Gh=null,Vs={},vn=null,Os=!1,Af=!1,tt={},bg=[],gn={},Nr=[],Uf=[],AS=/^(Sit|Injured|StumbleBack|JogStumble|Terrified|Pray|Sad)/;function Vh(i,e){let t=gn[i];if(!t)return null;let n=t.clone();return e=e||AS.test(i),n.tracks=n.tracks.filter(s=>{if(s.name.endsWith(".scale"))return!1;if(!s.name.endsWith(".position"))return!0;if(!e||!/Hips/.test(s.name))return!1;let r=s.values,a=r[0],o=r[2];for(let c=0;c<r.length;c+=3)r[c]=a,r[c+2]=o;return!0}),n}function Pi(i,e,t,n){let s=e&&Vh(e)||Vh("Idle")||Gh;if(!s&&!n)return;let r=t||new xa(i),a=n||r.clipAction(s);n||(a.play(),a.time=Math.random()*s.duration),t||bg.push(r);let o={},c={mx:r,base:a,cur:a,timer:0,get(l){if(!o[l]){let h=Vh(l);if(!h)return null;o[l]=r.clipAction(h)}return o[l]},play(l,h,u){let d=l?this.get(l):this.base;!d||d===this.cur||(d.reset(),d.setLoop(h?Ko:vh),d.clampWhenFinished=!!h,d.fadeIn(.35).play(),this.cur.fadeOut(.35),this.cur=d,this.timer=h?Math.max(.5,d.getClip().duration-.35):u||0)},rest(){this.play(null)},tick(l){this.timer>0&&(this.timer-=l,this.timer<=0&&this.cur!==this.base&&this.rest())}};return i.userData.anim=c,c}var pl=[];function RS(i){let e=i.userData.toes||(i.userData.toes=["Left","Right"].map(n=>i.getObjectByName("mixamorig"+n+"ToeBase")).filter(Boolean));if(!e.length)return;i.updateMatrixWorld(!0);let t=1e9;for(let n of e)t=Math.min(t,n.getWorldPosition(au).y);i.position.y+=(i.userData.ground||0)+.035-t}var CS=["Talk1","Talk2","Talk3"],PS=0,nn=null;function ml(i){return i==="Abba"?Ge:i==="Kofi"?v.place==="after"?Vs.kofi:tt.kofi:i==="Emmanuel Heath"?tt.heath:i==="Sam"?v.place==="after"?Vs.sailor:tt.sailor:i==="Symon Benning"?v.place==="after"?Vs.benning:tt.benning:null}function IS(i,e){let t=ml(i);if(e&&t&&t.userData.anim&&gn[e]){nn&&nn!==t&&nn.userData.anim&&nn.userData.anim.rest(),nn=t,t.userData.anim.play(e,!0);return}nn&&nn!==t&&nn.userData.anim&&nn.userData.anim.rest(),nn=t,t&&t.userData.anim&&gn.Talk1&&t.userData.anim.play(t.userData.sits&&gn.SitTalk?"SitTalk":CS[PS++%3])}function LS(i){nn&&nn.userData.anim&&(i&&gn.Wave?nn.userData.anim.play("Wave",!0):nn.userData.anim.rest()),nn=null}var Lt={leg:0,wait:1.5,box:null};function DS(i){let e=Oa[0],t=tt.kofi,n=t.userData.anim;if(!n)return;Lt.go||(Lt.go=!0,n.play("CarryIdle"));let[s,r]=e.route,a=Lt.leg===0?r:s;if(Lt.box||(Lt.box=new ht(new Qe(.44,.32,.34),new Ae({map:Ht([150,118,80],3,1,2),roughness:.9})),Ye.add(Lt.box),Lt.hl=t.getObjectByName("mixamorigLeftHand"),Lt.hr=t.getObjectByName("mixamorigRightHand")),Lt.hl&&Lt.hr){let p=Lt.hl.getWorldPosition(au),y=Lt.hr.getWorldPosition(ip);Lt.box.position.copy(p).add(y).multiplyScalar(.5),Lt.box.position.y-=.02,Lt.box.rotation.y=t.rotation.y}Lt.box.visible=t.visible&&Lt.leg===0;let o=Math.hypot(v.x-e.x,v.z-e.z)<3.2||nn===t;if(o||Lt.wait>0){e.walking&&(e.walking=!1,n.play(Lt.leg===0?"CarryIdle":null)),o||(Lt.wait-=i),Lt.wait<=0&&!o&&(e.walking=!0,n.play(Lt.leg===0?"Carry":"Walk"));return}e.walking||(e.walking=!0,n.play(Lt.leg===0?"Carry":"Walk"));let c=a[0]-e.x,l=a[1]-e.z,h=Math.hypot(c,l),u=1.25*i,f=Math.atan2(c,l)-t.rotation.y;f=Math.atan2(Math.sin(f),Math.cos(f)),t.rotation.y+=f*Math.min(1,i*5),e.ry=t.rotation.y,h<=u?(e.x=a[0],e.z=a[1],Lt.leg=1-Lt.leg,Lt.wait=1.6,e.walking=!1,n.play(Lt.leg===0?"CarryIdle":null)):(e.x+=c/h*u,e.z+=l/h*u),t.position.set(e.x,e.x>Re-2.5&&Math.abs(e.z)<1.75?.06:0,e.z)}function Ba(i){for(let e of Oa)tt[e.id]&&(tt[e.id].visible=i)}function NS(){let i=document.createElement("canvas");i.width=264,i.height=200;let e=i.getContext("2d");e.fillStyle="#5d4a36",e.fillRect(0,0,264,200),e.strokeStyle="#d9a441",e.lineWidth=6,e.strokeRect(8,8,248,184),e.fillStyle="#3f7a5c",e.beginPath(),e.ellipse(132,86,62,40,0,0,7),e.fill(),e.beginPath(),e.ellipse(206,80,18,13,0,0,7),e.fill();for(let[n,s]of[[88,50],[176,50],[88,122],[176,122]])e.beginPath(),e.ellipse(n,s,20,10,(n<132?-1:1)*(s<86?.6:-.6),0,7),e.fill();e.strokeStyle="#2a563f",e.lineWidth=3,e.beginPath(),e.moveTo(132,48),e.lineTo(132,124),e.moveTo(74,86),e.lineTo(190,86),e.stroke(),e.fillStyle="#f1ead9",e.font="600 30px Georgia, serif",e.textAlign="center",e.fillText("THE TURTLE",132,174);let t=new hr(i);return t.colorSpace=Gt,t}var Sn=null,Fr=[];function FS(){let i=(t,n,s,r)=>{let a=gg[t].clone(!0);a.position.set(n,0,s),a.rotation.y=r,Ye.add(a);let o=Math.max(0,Math.min(1,(n-fn)/(ji-fn))),c=Math.sin(n*12.9+s*78.2)*43758.5%1,l=Math.abs(c);return Fr.push({m:a,ry:r,sink:n<fn?1.2+l*1.5:l>.72?13:2.2+o*4.5+l*2.5,tx:(l-.5)*.3,tz:(l*7%1-.5)*.24,delay:(1-o)*4.5+l*2,dur:4.5+l*3}),a},e=fn;for(let t of wS){let n=i(t,e+al[t]/2,-Gn-4,0);if(t==="h1"){let s=new Tt({map:NS()});for(let r of[-1,1]){let a=new ht(new Mt(.68,.52),s);a.position.set(r*.028,3.94,4.67),a.rotation.y=r*Math.PI/2,n.add(a)}}e+=al[t]}e=fn;for(let t of TS)i(t,e+al[t]/2,Gn+4,Math.PI),e+=al[t];i("h4",fn-5.9,-3.4,Math.PI/2),i("h2",fn-5.9,2.4,Math.PI/2),i("h6",fn-5.9,8,Math.PI/2),i("h3",fn-5.9,-10.5,Math.PI/2),Ge.position.set(rt.x,.12,rt.z),Ye.add(Ge),Sn=new ht(new Ps(.75,.9,40),new Tt({color:14263361,transparent:!0,opacity:.8,side:Bt})),Sn.rotation.x=-Math.PI/2,Sn.position.set(rt.x,.14,rt.z+.2),Ye.add(Sn)}var Rf=!1,Hn=new Set,Mn={id:null,ox:0,oy:0,x:0,y:0},Ri={id:null,lx:0,ly:0},bi=!1;addEventListener("keydown",i=>{let e=i.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e)&&v.started&&i.preventDefault(),Hn.add(e),!!v.started)if(e==="escape"&&(Xs(),Sg()),re("dialogue").hidden===!1&&(e==="enter"||e===" ")){let t=re("next");t.hidden||t.click()}else(e==="e"||e==="enter")&&!re("talk").hidden?re("talk").click():e==="j"&&(re("journal").hidden?Qf():Xs())});addEventListener("keyup",i=>Hn.delete(i.key.toLowerCase()));addEventListener("blur",()=>Hn.clear());Kn.addEventListener("pointerdown",i=>{if(!(!v.started||bi))if(Kn.setPointerCapture(i.pointerId),i.pointerType==="touch"&&i.clientX<innerWidth*.42&&Mn.id===null){Mn.id=i.pointerId,Mn.ox=i.clientX,Mn.oy=i.clientY,Mn.x=Mn.y=0;let e=re("stick");e.hidden=!1,e.style.left=i.clientX+"px",e.style.top=i.clientY+"px",re("nub").style.transform="translate(-50%,-50%)"}else Ri.id===null&&(Ri.id=i.pointerId,Ri.lx=i.clientX,Ri.ly=i.clientY)});Kn.addEventListener("pointermove",i=>{if(i.pointerId===Mn.id){let e=i.clientX-Mn.ox,t=i.clientY-Mn.oy,n=Math.hypot(e,t),s=48;n>s&&(e*=s/n,t*=s/n),Mn.x=e/s,Mn.y=t/s,re("nub").style.transform=`translate(calc(-50% + ${e}px), calc(-50% + ${t}px))`}else if(i.pointerId===Ri.id){let e=i.pointerType==="touch"?.0052:.0034;v.yaw-=(i.clientX-Ri.lx)*e,v.pitch=Math.max(-.9,Math.min(.9,v.pitch-(i.clientY-Ri.ly)*e)),Ri.lx=i.clientX,Ri.ly=i.clientY}});var xg=i=>{i.pointerId===Mn.id&&(Mn.id=null,Mn.x=Mn.y=0,re("stick").hidden=!0),i.pointerId===Ri.id&&(Ri.id=null)};Kn.addEventListener("pointerup",xg);Kn.addEventListener("pointercancel",xg);var Yh=null;function kS(){Yh=[];let i=new On;for(let e of nu){if(!e.visible&&!e.isGroup&&!e.isMesh||(i.setFromObject(e),i.isEmpty()))continue;let t=i.max.x-i.min.x,n=i.max.z-i.min.z,s=i.max.y-i.min.y;i.min.y>1.2||s<.25||t>4||n>4||t*n<.05||Yh.push([i.min.x,i.min.z,i.max.x,i.max.z])}}function US(i,e){let t=v.place;return t==="in"?[Math.max(Ue.x0+.25,Math.min(Ue.x1-.3,i)),Math.max(-1.75,Math.min(Ue.z1-.25,e))]:t==="ware"?[Math.max(Tr+.3,Math.min(jt-.3,i)),Math.max(-1.65,Math.min(4.65,e))]:t==="out"&&!te.ruin&&i>fn-1&&i<ji+.3?[i,Math.max(-(Gn-.25),Math.min(Gn-.25,e))]:[i,e]}function Yf(i,e){return i>Re-2.5&&Math.abs(e)<1.75?.06:i>fn&&i<ji&&Math.abs(e)>Gn-1.7&&Math.abs(e)<Gn+.1?.12:0}function Zh(i,e){return v.place!=="out"||te.ruin?0:i>Re-2.5&&Math.abs(e)<1.75?.06:i>fn&&i<ji&&Math.abs(e)>Gn-1.7&&Math.abs(e)<Gn+.1?.12:0}function Zf(i,e){if(v.place==="ware"){i=Math.max(Tr+.5,Math.min(jt-.6,i)),e=Math.max(-1.4,Math.min(4.4,e));for(let[t,n,s]of[[-258.6,2.9,1.5],[-252.5,1.2,1]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(v.place==="after"){i=Math.max(fn+.6,Math.min(.4,i)),e=Math.max(-3.9,Math.min(3.9,e));for(let t of Rg)[i,e]=nw(i,e,t[0],t[1],t[2]/2+.35,t[4]/2+.35,t[5]);for(let[t,n,s]of[[ol,ll,.75],[rt.x,rt.z,.65],[Cr.x,Cr.z,.65],...Fs.map(r=>[r[0],r[1],.6]),...ug.map(r=>[r[0],r[1],.6])]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(v.place==="yard"){i=Math.max(Kt+.8,Math.min(Kt+13,i)),e=Math.max(Jt-13,Math.min(Jt+4.5,e));let t=i-(Kt+6),n=e-(Jt-2),s=Math.hypot(t,n);return s<1.7&&s>0&&(i=Kt+6+t/s*1.7,e=Jt-2+n/s*1.7),[i,e]}if(v.place==="sea")return[Math.max(Re+4,Math.min(Re+75,i)),Math.max(9,Math.min(75,e))];if(v.place==="in"){i=Math.max(Ue.x0+.45,Math.min(Ue.x1-.95,i)),e=Math.max(-1.5,Math.min(Ue.z1-.45,e));for(let[t,n,s]of[[-198.2,1.3,1.25],[-201.6,1,1.25],[-195.9,2.3,.75],...Uf]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}return[i,e]}if(Dn.ready&&!zt.on&&(e<-8.6||v.z<-8.6)&&i>4&&i<Re-.3)return vw(i,e);i=Math.max(fn-.2,Math.min(Re+23,i)),!qs&&i<ji+2.5&&(i=ji+2.5,Rf||(Rf=!0,bn("The town is still loading."),setTimeout(()=>{Rf=!1},4e3))),i=Math.min(Re+21.5,i),i>Re-1.5?v.x<=Re-1.5&&Math.abs(e)>1.4?i=Re-1.5:e=Math.max(-1.4,Math.min(1.4,e)):i>ji+.3?e=Math.max(-9,Math.min(9,e)):e=Math.max(-(Gn-.45),Math.min(Gn-.45,e));for(let[t,n,s]of[[rt.x,rt.z,.75],...qs&&!te.on?Oa.map(r=>[r.x,r.z,r.id==="kofi"?1.05:.8]):[]]){let r=i-t,a=e-n,o=Math.hypot(r,a);o<s&&o>0&&(i=t+r/o*s,e=n+a/o*s)}if(!te.ruin){Yh||kS();for(let[t,n,s,r]of Yh){let a=Math.max(t,Math.min(s,i)),o=Math.max(n,Math.min(r,e)),c=i-a,l=e-o,h=Math.hypot(c,l),u=.32;h<u&&(h>1e-4?(i=a+c/h*u,e=o+l/h*u):(i=v.x,e=v.z))}}return[i,e]}var K0=0;function bn(i){let e=re("toast");e.textContent=i,e.hidden=!1,clearTimeout(K0),K0=setTimeout(()=>{e.hidden=!0},2600)}function Xi(i){if(v.unlocked.includes(i))return;v.unlocked.push(i),kr();let e=Rr.find(t=>t.id===i);re("jcount").textContent=v.unlocked.length,re("jcount").hidden=!1,bn("Journal: "+e.title)}var Nn="",J0=0,Y0=0;function xi(i){let e=re("goal");e.textContent=Nn,e.classList.remove("folded"),e.setAttribute("aria-expanded","true"),clearTimeout(J0),J0=setTimeout(()=>{e.textContent="Goal",e.classList.add("folded"),e.setAttribute("aria-expanded","false")},6500),i&&yg()}function yg(){re("hint").hidden=!1,clearTimeout(Y0),Y0=setTimeout(()=>{re("hint").hidden=!0},6e3)}re("goal").onclick=()=>xi(!0);function Cf(){return Hs.filter(i=>v.unlocked.includes(i.id)).length}function Jn(){if(te.on||v.place==="ware"||zt.on)return;let i;v.unlocked.includes("harbour")?v.talked?v.place==="out"&&!v.ate?i="Go into The Turtle. The door is right beside Abba.":v.ate?Cf()<Hs.length?i="Look around the tavern. Things found: "+Cf()+" of "+Hs.length+".":v.unlocked.includes("morgan")?v.unlocked.includes("forts")?i="You have finished the first part. Open your journal for the next part of the story.":i="Walk out to Fort Charles. Follow the beach past the last houses, away from the pier.":i="Old Ned, sitting at the table by the window, has a story about Captain Morgan.":i="Abba is behind the counter. Ask her for some stew.":i="Find the woman in the white head wrap. She keeps the tavern with the turtle sign.":i="Walk down the pier and into the town.",i!==Nn&&(Nn=i,xi()),v.ate&&Cf()===Hs.length&&v.unlocked.includes("forts")&&!v.done&&(v.done=!0,setTimeout(()=>bn("Well done! Your journal now has "+v.unlocked.length+" pages."),3800))}var ka=jf,Of=null;function _g(){let i=ka[v.step];i.who!=="You"&&IS(i.who,i.anim),re("who").textContent=i.who,re("line").textContent=i.text;let e=re("choices");if(e.replaceChildren(),i.choices){re("next").hidden=!0;for(let t of i.choices){let n=typeof t=="string"?{t,ok:!0}:t,s=document.createElement("button");s.className="btn ghost",s.textContent=n.t,s.onclick=()=>{n.ok?$f():(re("line").textContent=i.hint+" "+i.text.split(". ").pop(),s.disabled=!0)},e.appendChild(s)}e.firstChild.focus()}else re("next").hidden=!1,re("next").textContent=v.step===ka.length-1?ka===jf?"Goodbye for now":"Thank you":"Next",re("next").focus();i.unlock&&Xi(i.unlock)}function $f(){if(v.step++,v.step>=ka.length){LS(ka!==hg),re("dialogue").hidden=!0,re("goal").hidden=!1,bi=!1,v.step=0;let i=Of;Of=null,i&&i(),Jn(),Kn.focus();return}_g()}function dn(i,e){ka=i,Of=e,bi=!0,Hn.clear(),re("talk").hidden=!0,re("hint").hidden=!0,re("goal").hidden=!0,re("dialogue").hidden=!1,v.step=0,_g()}re("next").onclick=$f;var iu=[...["sugar","cocoa","logwood"].map((i,e)=>({label:["Look at the casks","Look at the sacks","Look at the red wood"][e],r:2.6,where:()=>v.place==="ware"&&!v.unlocked.includes(i)&&Xh[i],go:()=>{Xi(i),Ig[i].visible=!1,jh()}})),{label:"Sit at the desk",r:2.4,where:()=>v.place==="ware"&&Lg()&&!qi.coins&&[-258.6,2.9],go:()=>dn(fS,()=>{qi.coins=!0,Ge.visible=!0,rt.x=-250.2,rt.z=.4,Ge.position.set(rt.x,0,rt.z),bn("Abba has come in."),jh()})},{label:"Talk to Abba",r:3,where:()=>v.place==="ware"&&qi.coins&&!qi.talked&&[rt.x,rt.z],go:()=>dn(hg,()=>{qi.talked=!0;let i=Ge.userData.anim;i&&gn.WaveSlow&&i.play("WaveSlow",!0),setTimeout(()=>{v.place==="ware"&&(Ge.visible=!1,rt.x=9999,bn("Abba goes out to the wharf."))},2600),jh()})},{label:"Go out to the wharf",r:1.8,where:()=>v.place==="ware"&&[jt-.7,.8],go:()=>wn("Leave the warehouse?",["Lewis can come back to 1691 any time from the Chapters menu."],[{t:"Back to the town",go:eu},{t:"Stay",go:sn}])},{label:"Read the letter",r:2.4,where:()=>v.place==="ware"&&qi.talked&&[-258.6,2.9],go:hw},{label:"Talk to Abba",r:3.2,where:()=>v.place==="after"&&[rt.x,rt.z],go:()=>{Pg()&&te.aTalk?dn(yS,sw):dn(xS,()=>{te.aTalk=!0,qh()})}},{label:"Look at the big tent",r:3.6,where:()=>v.place==="after"&&!v.unlocked.includes("tentp")&&[-12.5,.8],go:()=>{Xi("tentp"),qh()}},{label:"Look across the water",r:2.6,where:()=>v.place==="after"&&!v.unlocked.includes("kingston")&&[.2,0],go:()=>{Xi("kingston"),qh()}},{label:"Read the tombstone",r:3.2,where:()=>v.place==="yard"&&[Kt+6,Jt-2],go:aw},...Oa.map(i=>({label:i.label,r:2.6,where:()=>qs&&!te.on&&v.place==="out"&&tt[i.id]&&[i.x,i.z],go:()=>dn(v.unlocked.includes(i.id)?i.again:i.talk)})),{label:"Talk to Sam",r:2.4,where:()=>v.place==="after"&&Vs.sailor&&[Fs[0][0],Fs[0][1]],go:()=>dn(v.unlocked.includes("swan")?[{who:"Sam",text:"I keep looking at the water. I can\u2019t stop."}]:pS)},{label:"Talk to Kofi",r:2.4,where:()=>v.place==="after"&&Vs.kofi&&[Fs[2][0],Fs[2][1]],go:()=>dn(mS)},{label:"Talk to Symon Benning",r:2.4,where:()=>v.place==="after"&&Vs.benning&&[Fs[1][0],Fs[1][1]],go:()=>dn(gS)},{label:"Talk to the minister",r:2.6,where:()=>v.place==="after"&&tt.heath&&tt.heath.parent&&[Cr.x,Cr.z],go:()=>dn(v.unlocked.includes("heath")?[{who:"Emmanuel Heath",text:"God keep you, Mr Galdy."}]:bS)},{label:"Reach for the boat",r:3.6,where:()=>v.place==="sea"&&te.boat&&[te.boat.position.x,te.boat.position.z],go:()=>rp(!1)},{label:"Talk to her",r:3.4,where:()=>qs&&!te.on&&!zt.on&&v.place==="out"&&[rt.x,rt.z],go:()=>dn(v.talked?W0:jf,()=>{v.talked=!0,Sn&&(Sn.visible=!1)})},{label:"Go into the tavern",r:2,where:()=>Dr&&!te.on&&v.place==="out"&&v.talked&&[-6.18,-4.5],go:()=>{ii("in"),v.x=-203,v.z=2.3,v.yaw=0,v.pitch=0,Jn()}},{label:"Go back to the street",r:1.3,where:()=>v.place==="in"&&[-203,3.3],go:()=>{ii("out"),v.x=-6.18,v.z=-3.4,v.yaw=Math.PI,v.pitch=0,Jn()}},{label:"Talk to Abba",r:2.3,where:()=>v.place==="in"&&[-201,-1.9],go:()=>dn(v.ate?W0:_S,()=>{v.ate||(v.ate=!0,ms.visible=!0)})},...Hs.map(i=>({label:i.label,r:1.9,where:()=>v.place==="in"&&!v.unlocked.includes(i.id)&&[i.x,i.z],go:()=>{Xi(i.id),Kf[i.id].visible=!1,Jn()}}))],Us=null;re("talk").onclick=()=>{Us&&Us.go()};function vg(i){let e=re("jtabs");e.replaceChildren();let t=i||v.unlocked[v.unlocked.length-1];Rr.filter(l=>v.unlocked.includes(l.id)).forEach(l=>{let h=document.createElement("button");h.className="tab"+(l.id===t?" on":""),h.textContent=l.title,h.onclick=()=>vg(l.id),e.appendChild(h)});let n=Rr.length-v.unlocked.length;if(n>0){let l=document.createElement("button");l.className="tab",l.disabled=!0,l.textContent=n+" more to find",e.appendChild(l)}let s=re("jpage");s.replaceChildren();let r=Rr.find(l=>l.id===t);if(!r){let l=document.createElement("p");l.textContent="Your journal is empty. Talk to people in the town to fill it.",s.appendChild(l);return}let a=document.createElement("h3");a.textContent=r.title,s.appendChild(a);for(let l of r.simple){let h=document.createElement("p");h.textContent=l,s.appendChild(h)}let o=document.createElement("details"),c=document.createElement("summary");c.textContent="Dig deeper",o.appendChild(c);for(let l of r.deeper){let h=document.createElement("p");h.textContent=l,o.appendChild(h)}s.appendChild(o)}function Qf(){re("dialogue").hidden&&(bi=!0,Hn.clear(),vg(),re("journal").hidden=!1,re("jclose").focus())}function Xs(){re("journal").hidden||(re("journal").hidden=!0,bi=!1)}re("jbtn").onclick=Qf;re("jclose").onclick=Xs;function Mg(){ru(),v.started=!0,re("title").hidden=!0,re("hud").hidden=!1,v.unlocked.length&&(re("jcount").textContent=v.unlocked.length,re("jcount").hidden=!1),Jn(),re("hint").textContent=vS?"Left thumb walks. Drag to look.":"W A S D to walk. Drag to look. E to use.",yg(),Kn.focus()}re("start").onclick=()=>{Mg(),za("begin")};var su="portroyal-save-v1",Bf=!1,Z0=0;function kr(){try{localStorage.setItem(su,JSON.stringify({unlocked:v.unlocked,talked:v.talked,ate:v.ate,done:v.done,ch:v.ch,pos:v.place==="out"&&!te.on?[v.x,v.z,v.yaw]:null}))}catch{}}function OS(){try{return JSON.parse(localStorage.getItem(su)||"null")}catch{return null}}function BS(i){if(!i||!Array.isArray(i.unlocked))return;v.unlocked=i.unlocked.filter(t=>Rr.some(n=>n.id===t)),v.talked=!!i.talked,v.ate=!!i.ate,v.done=!!i.done,v.ch=i.ch&&typeof i.ch=="object"?i.ch:{};let e=i.pos;Array.isArray(e)&&e.every(Number.isFinite)&&e[0]>fn-1&&e[0]<Re+24&&Math.abs(e[1])<9.5&&!(e[0]<ji+.3&&Math.abs(e[1])>Gn)&&(v.x=e[0],v.z=e[1],v.yaw=e[2]),Bf=v.unlocked.length>0}addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&v.started&&kr()});var ep={goArrive:["1690","Port Royal, Jamaica"],leaveWare:["1690","Back in the town"],beginWare:["1691","Lewis Galdy\u2019s warehouse"],beginQuake:["7 June 1692","A hot, still morning"],beginAfter:["Three days later","The camp on the beach"],toYard:["Many years later","St Peter\u2019s Church, Port Royal"],leaveQuake:["1690","Before the earthquake"]},Wh=!1;function xs(i,e){return function(...t){if(Wh)return;if(new URLSearchParams(location.search).has("shot"))return e.apply(this,t);Wh=!0;let n=re("fade"),[s,r]=ep[i];re("fadeT").textContent=s,re("fadeS").textContent=r,re("card").hidden=!0,re("dialogue").hidden=!0,n.hidden=!1,requestAnimationFrame(()=>{n.classList.add("on")}),setTimeout(()=>{e.apply(this,t),n.classList.add("txt")},750),setTimeout(()=>{n.classList.remove("txt")},2500),setTimeout(()=>{n.classList.remove("on")},2900),setTimeout(()=>{n.hidden=!0,Wh=!1},3800)}}function zf(){sn(),te.on&&(Ha(),te.on=!1),ii("out"),v.x=43,v.z=0,v.yaw=Math.PI/2,v.pitch=0,Nn="",Jn(),za("begin")}var Hf=[{year:"1690",name:"Arrival",go:()=>zf(),done:()=>v.ate},{year:"1670",name:"Ned\u2019s story: Morgan\u2019s men",go:()=>Ew(),done:()=>v.unlocked.includes("morgan")},{year:"1691",name:"The warehouse",go:()=>cw(),done:()=>!!v.ch.ware},{year:"7 June 1692",name:"The earthquake",go:()=>Eg(),done:()=>v.unlocked.includes("tomb")},{year:"1692",name:"The days after",go:()=>gs(),done:()=>!!v.ch.after},{year:"1739 and today",name:"The tombstone",go:()=>Ws(),done:()=>v.unlocked.includes("stone")}];function tp(){let i=re("chlist");i.replaceChildren(),Hf.forEach((e,t)=>{let n=t===0||v.ch.all||Hf[t-1].done(),s=e.done(),r=document.createElement("li"),a=document.createElement("button");a.className="chbtn"+(s?" done":""),a.disabled=!n||!Dr;for(let[o,c]of[["yr",e.year],["nm",e.name],["st",Dr?s?"Done":n?"Play":"Locked":"Loading"]]){let l=document.createElement("span");l.className=o,l.textContent=c,a.appendChild(l)}a.onclick=()=>zS(e),r.appendChild(a),i.appendChild(r)}),re("chteach").hidden=!!v.ch.all,re("chreset").textContent="Start again",re("chreset").dataset.armed=""}function np(){Xs(),bi=!0,Hn.clear(),tp(),re("chapters").hidden=!1,(re("chlist").querySelector("button:not(:disabled)")||re("chclose")).focus()}function Sg(){re("chapters").hidden||(re("chapters").hidden=!0,bi=!re("card").hidden,v.started&&Kn.focus())}function zS(i){re("chapters").hidden=!0,bi=!1,v.started||Mg(),i.go()}re("chclose").onclick=Sg;re("tchap").onclick=np;re("jchap").onclick=np;re("chteach").onclick=()=>{v.ch.all=!0,kr(),tp()};re("chreset").onclick=()=>{let i=re("chreset");if(!i.dataset.armed){i.dataset.armed="1",i.textContent="Tap again to erase all progress";return}try{localStorage.removeItem(su)}catch{}location.reload()};var Ce={ctx:null,master:null,on:!0,ch:{},crack:null};try{Ce.on=localStorage.getItem("portroyal-sound")!=="off"}catch{}function HS(i){let e=Ce.ctx,t=e.sampleRate*3,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0),r=0;for(let o=0;o<t;o++){let c=Math.random()*2-1;i==="brown"?(r=(r+.02*c)/1.02,s[o]=r*3.5):s[o]=c*.5}let a=e.createBufferSource();return a.buffer=n,a.loop=!0,a.start(),a}function nl(i,e,t,n){let s=Ce.ctx,r=s.createBiquadFilter(),a=s.createGain();return r.type=e,r.frequency.value=t,n&&(r.Q.value=n),a.gain.value=0,HS(i).connect(r),r.connect(a),a.connect(Ce.master),a.f=r,a}function ru(){try{if(!Ce.ctx){let i=window.AudioContext||window.webkitAudioContext;if(!i)return;Ce.ctx=new i,Ce.master=Ce.ctx.createGain(),Ce.master.gain.value=Ce.on?.8:0,Ce.master.connect(Ce.ctx.destination),Ce.ch.sea=nl("brown","lowpass",800),Ce.ch.surf=nl("white","bandpass",2200,.4),Ce.ch.wind=nl("white","bandpass",650,.6),Ce.ch.crowd=nl("white","bandpass",480,2.2),Ce.ch.room=nl("brown","lowpass",160);let e=Ce.ctx.sampleRate*.03,t=Ce.ctx.createBuffer(1,e,Ce.ctx.sampleRate),n=t.getChannelData(0);for(let s=0;s<e;s++)n[s]=(Math.random()*2-1)*(1-s/e);Ce.crack=t;{let s=Ce.ctx.sampleRate*.22|0,r=Ce.ctx.createBuffer(1,s,Ce.ctx.sampleRate),a=r.getChannelData(0),o=0;for(let c=0;c<s;c++){Math.random()<.004&&(o=.6+Math.random()*.4),o*=.992;let l=Math.min(1,c/(s*.15))*Math.pow(1-c/s,1.6);a[c]=(Math.random()*2-1)*(.35+o)*l}Ce.step=r}}Ce.ctx.resume()}catch{Ce.ctx=null}}function vl(i){let e=Ce.ctx,t=e.createGain();if(e.createStereoPanner){let n=e.createStereoPanner();n.pan.value=i,t.connect(n),n.connect(Ce.master)}else t.connect(Ce.master);return t}function GS(){let i=Ce.ctx,e=i.currentTime+.05,t=vl(Math.random()*1.6-.8),n=i.createBiquadFilter();n.type="bandpass",n.frequency.value=1500,n.Q.value=1.4,n.connect(t),t.gain.value=.35+Math.random()*.4;for(let s=0,r=2+(Math.random()*2|0);s<r;s++){let a=e+s*.42,o=i.createOscillator(),c=i.createGain(),l=i.createOscillator(),h=i.createGain();o.type="triangle",o.frequency.setValueAtTime(1300,a),o.frequency.linearRampToValueAtTime(1750,a+.06),o.frequency.exponentialRampToValueAtTime(950,a+.34),l.frequency.value=28,h.gain.value=45,l.connect(h),h.connect(o.frequency),c.gain.setValueAtTime(1e-4,a),c.gain.exponentialRampToValueAtTime(.16,a+.03),c.gain.exponentialRampToValueAtTime(1e-4,a+.36),o.connect(c),c.connect(n),o.start(a),l.start(a),o.stop(a+.4),l.stop(a+.4)}}var Fh=0,Pf=1,$0=0,If=0;function VS(){let i=v.place,e=v.x,t=v.z;return i==="in"?"wood":i==="ware"?Math.abs(e-(jt-.7))<.6?"wood":"stone":i==="sea"?"water":te.on&&te.phase==="yard"?"grass":e>Re-2.5&&Math.abs(t)<1.75?"wood":!(te.on&&te.ruin)&&e>fn&&e<ji&&Math.abs(t)<Gn-.6?"stone":"sand"}function WS(){if(!Ce.ctx||!Ce.on||Ce.ctx.state!=="running")return;let i=VS();if(!i)return;let e=Ce.ctx,t=e.currentTime+.005;Pf=-Pf;let n=vl(Pf*.12),s=.85+Math.random()*.3,r=e.createBufferSource();r.buffer=(i==="sand"||i==="grass")&&Ce.step?Ce.step:Ce.crack;let a=e.createBiquadFilter();if(i==="sand"||i==="grass")a.type="lowpass",a.frequency.value=i==="sand"?700+Math.random()*300:1600,r.playbackRate.value=.9+Math.random()*.2,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.16*s,t+.045),n.gain.exponentialRampToValueAtTime(1e-4,t+.24);else if(i==="water"){a.type="bandpass",a.Q.value=.7,a.frequency.setValueAtTime(500,t),a.frequency.exponentialRampToValueAtTime(1800,t+.12),a.frequency.exponentialRampToValueAtTime(700,t+.5),r.buffer=Ce.step||Ce.crack,r.playbackRate.value=.55+Math.random()*.15,r.loop=!0,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.3*s,t+.08),n.gain.exponentialRampToValueAtTime(1e-4,t+.6),r.connect(a),a.connect(n),r.start(t),r.stop(t+.65);return}else if(i==="wood"){a.type="bandpass",a.frequency.value=420+Math.random()*120,a.Q.value=1.4,r.playbackRate.value=.5,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.26*s,t+.012),n.gain.exponentialRampToValueAtTime(1e-4,t+.2);let o=e.createOscillator(),c=e.createGain();o.frequency.setValueAtTime(130,t),o.frequency.exponentialRampToValueAtTime(70,t+.09),c.gain.setValueAtTime(.16*s,t),c.gain.exponentialRampToValueAtTime(1e-4,t+.16),o.connect(c),c.connect(n),o.start(t),o.stop(t+.2)}else a.type="bandpass",a.frequency.value=1100+Math.random()*400,a.Q.value=.9,r.playbackRate.value=.8,n.gain.setValueAtTime(1e-4,t),n.gain.linearRampToValueAtTime(.17*s,t+.008),n.gain.exponentialRampToValueAtTime(1e-4,t+.11);r.connect(a),a.connect(n),r.start(t),r.stop(t+.3)}function qS(){let i=Ce.ctx,e=i.currentTime,t=i.createBufferSource(),n=i.createBiquadFilter(),s=vl(.3);t.buffer=Ce.crack,t.playbackRate.value=.6+Math.random(),n.type="highpass",n.frequency.value=1400,s.gain.value=.05+Math.random()*.12,t.connect(n),n.connect(s),t.start(e)}function XS(){let i=Ce.ctx,e=i.currentTime+.02,t=vl(Math.random()*1.4-.7);t.gain.value=.5;for(let n=0;n<3;n++){let s=e+n*.13,r=i.createOscillator(),a=i.createGain();r.frequency.setValueAtTime(2600,s),r.frequency.exponentialRampToValueAtTime(3700,s+.07),a.gain.setValueAtTime(1e-4,s),a.gain.exponentialRampToValueAtTime(.05,s+.015),a.gain.exponentialRampToValueAtTime(1e-4,s+.08),r.connect(a),a.connect(t),r.start(s),r.stop(s+.1)}}function za(i){if(!Ce.ctx)return;let e=Ce.ctx,t=e.currentTime+.05,n={begin:[[293.66,0],[369.99,.35],[440,.7],[587.33,1.05]],sad:[[293.66,0],[349.23,.5],[440,1],[392,1.6]],end:[[440,0],[369.99,.6],[329.63,1.2],[293.66,1.8]]}[i],s=e.createBiquadFilter();s.type="lowpass",s.frequency.value=1400,s.connect(Ce.master);for(let[r,a]of n)for(let o of[0,7]){let c=e.createOscillator(),l=e.createGain();c.type="triangle",c.frequency.value=r,c.detune.value=o,l.gain.setValueAtTime(1e-4,t+a),l.gain.exponentialRampToValueAtTime(.05,t+a+.08),l.gain.exponentialRampToValueAtTime(1e-4,t+a+2.4),c.connect(l),l.connect(s),c.start(t+a),c.stop(t+a+2.5)}}var Q0=0,eg=2,tg=0,ng=0,kh=.6;function il(i,e,t){i.gain.setTargetAtTime(e,Ce.ctx.currentTime,t||.5)}function jS(i){if(!Ce.ctx||!v.started||i<Q0)return;Q0=i+.1;let e=v.place,t=te.on&&["tremor","main","swallow"].includes(te.phase),n=.72+.28*Math.sin(i*.55)+.1*Math.sin(i*1.7),s=0,r=0,a=0,o=0,c=0,l=!1,h=!1,u=!1;if(e==="out"){let d=Math.max(0,Math.min(1,(v.x+5)/(Re+10)));s=(.15+.55*d)*n,r=.04*d*n,a=te.ruin?.1:.05,l=!te.ruin&&v.x>-2}else e==="in"?(o=.3,h=!0,s=.03):e==="ware"?(c=.14,s=.16*n,l=!0):e==="sea"?(s=.8*n,r=.08*n,a=.12):e==="after"?(s=.22*n,a=.14):e==="yard"&&(a=.07,s=.08*n,u=!0);t&&(s*=.4,r=0,o=0,l=u=!1),il(Ce.ch.sea,s),il(Ce.ch.surf,r),il(Ce.ch.wind,a),il(Ce.ch.room,c),kh=Math.max(.3,Math.min(1,kh+(Math.random()-.5)*.3)),il(Ce.ch.crowd,o*kh,.12),Ce.ch.crowd.f.frequency.setTargetAtTime(380+kh*260,Ce.ctx.currentTime,.2),l&&i>eg&&(eg=i+6+Math.random()*10,GS()),h&&i>tg&&(tg=i+.05+Math.random()*.35,qS()),u&&i>ng&&(ng=i+3+Math.random()*6,XS())}function wg(){let i=re("snd");i.setAttribute("aria-pressed",Ce.on?"true":"false"),i.setAttribute("aria-label",Ce.on?"Sound on. Tap to turn off.":"Sound off. Tap to turn on."),re("sndon").style.display=Ce.on?"":"none",re("sndoff").style.display=Ce.on?"none":""}re("snd").onclick=()=>{Ce.on=!Ce.on;try{localStorage.setItem("portroyal-sound",Ce.on?"on":"off")}catch{}ru(),Ce.master&&Ce.master.gain.setTargetAtTime(Ce.on?.8:0,Ce.ctx.currentTime,.1),wg()};wg();addEventListener("pointerdown",()=>{Ce.ctx&&Ce.ctx.state!=="running"&&Ce.ctx.resume()});var gl=2.7,$h=1.62,Ir=-.35,te={on:!1,phase:"",t:0,shake:0,ruin:!1,boat:null,debris:[],T:0,ac:null,gain:null},bl=new qe(12167304),Gf=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i));function wn(i,e,t){bi=!0,Hn.clear(),re("ctitle").textContent=i;let n=re("cbody");n.replaceChildren();for(let r of e){let a=document.createElement("p");a.textContent=r,n.appendChild(a)}let s=re("cbtns");s.replaceChildren(),t.forEach((r,a)=>{let o=document.createElement("button");o.className="btn"+(a?" ghost":""),o.textContent=r.t,o.onclick=r.go,s.appendChild(o)}),re("card").hidden=!1,re("talk").hidden=!0,s.firstChild.focus()}function sn(){re("card").hidden=!0,bi=!1,Kn.focus()}var Xn=null,xl=[],gi=[],Vf=520,ig=new st,KS=new Zt,JS=new oi,ip=new z,au=new z,sp=null;function Tg(){if(Xn)return;Xn=new cr(new Qe(.24,.08,.12),(()=>{let e=Jh("brick",!0).clone();return e.repeat.set(.18,.12),e.needsUpdate=!0,new Ae({map:e,roughness:.95})})(),Vf),Xn.instanceMatrix.setUsage(_d),Xn.frustumCulled=!1,Xn.count=0,Ye.add(Xn);let i=new qe;for(let e=0;e<Vf;e++){let t=Math.random();i.setRGB(.7+t*.3,.66+t*.3,.62+t*.3),e%9===0&&i.setRGB(1.3,1.3,1.25),Xn.setColorAt(e,i)}Xn.instanceColor.needsUpdate=!0,sp=Ln(64,64,e=>{let t=e.createRadialGradient(32,32,2,32,32,31);t.addColorStop(0,"rgba(255,255,255,0.9)"),t.addColorStop(.5,"rgba(255,255,255,0.35)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64)})}function YS(i){Tg();let e=i.m.position,t=e.z<0?1:-1,n=2.4,s=e.z+t*3.9;for(let r=0;r<34&&xl.length<Vf;r++){let a=r<3;xl.push({x:e.x+(Math.random()-.5)*n*2,y:4+Math.random()*6,z:s+t*Math.random()*.4,vx:(Math.random()-.5)*1.2,vy:Math.random()*1.5,vz:t*(.8+Math.random()*2.6),rx:Math.random()*6,ry:Math.random()*6,rz:Math.random()*6,w:(Math.random()-.5)*12,s:a?1.7+Math.random()*.8:1,rest:!1,delay:Math.random()*1.6})}for(let r=0;r<3;r++){let a=new ca(new or({map:sp,color:bl,transparent:!0,opacity:0,depthWrite:!1}));a.position.set(e.x+(r-1)*2.2,1.2,s+t*1.2),a.userData={age:-r*.4,life:5+Math.random()*2},Ye.add(a),gi.push(a)}}function ZS(i){if(te.phase==="main"||te.phase==="swallow")for(let e of Fr)!e.broke&&te.T>e.delay+.4&&e.m.position.x>fn-1&&(e.broke=!0,YS(e));if(Xn){let e=0;for(let t of xl){if(t.delay>0){t.delay-=i;continue}if(!t.rest){t.vy-=9.8*i,t.x+=t.vx*i,t.y+=t.vy*i,t.z+=t.vz*i,t.rx+=t.w*i,t.rz+=t.w*.7*i;let n=.04*t.s;t.y<n&&(t.y=n,Math.abs(t.vy)<1.2&&(t.rest=!0,t.rx=Math.round(t.rx/Math.PI)*Math.PI,t.rz=Math.round(t.rz/Math.PI)*Math.PI),t.vy=-t.vy*.28,t.vx*=.45,t.vz*=.45,t.w*=.4)}ig.compose(au.set(t.x,t.y,t.z),KS.setFromEuler(JS.set(t.rx,t.ry,t.rz)),ip.setScalar(t.s)),Xn.setMatrixAt(e++,ig)}Xn.count=e,Xn.instanceMatrix.needsUpdate=!0}for(let e=gi.length-1;e>=0;e--){let t=gi[e],n=t.userData;if(n.age+=i,n.age<0)continue;let s=n.age/n.life;t.scale.setScalar(2+s*9),t.position.y=1.2+s*3,t.material.opacity=Math.min(.55,n.age*1.2)*(1-s),s>=1&&(Ye.remove(t),t.material.dispose(),gi.splice(e,1))}}function $S(){xl.length=0,Xn&&(Xn.count=0);for(let i of gi)Ye.remove(i),i.material.dispose();gi.length=0;for(let i of Fr)i.broke=!1}function yl(i,e){for(let t of Fr){let n=e===void 0?Gf((i-t.delay)/t.dur):e;t.m.position.y=-t.sink*n+(n>0&&n<1?Math.sin(i*40+t.delay*9)*.03:0),t.m.rotation.set(t.tx*n,t.ry,t.tz*n)}}function QS(){if(ru(),!Ce.ctx||te.gain)return;let i=Ce.ctx,e=i.sampleRate*2,t=i.createBuffer(1,e,i.sampleRate),n=t.getChannelData(0),s=0;for(let o=0;o<e;o++)s=(s+.02*(Math.random()*2-1))/1.02,n[o]=s*3.5;let r=i.createBufferSource();r.buffer=t,r.loop=!0;let a=i.createBiquadFilter();a.type="lowpass",a.frequency.value=150,te.gain=i.createGain(),te.gain.gain.value=0,r.connect(a),a.connect(te.gain),te.gain.connect(Ce.master),r.start()}function Lr(i){te.phase=i,te.t=0}function Eg(){if(za("sad"),!qs||!Dr){bn("The town is still loading.");return}Xs(),re("card").hidden=!0,re("dialogue").hidden=!0,re("goal").hidden=!1,wn("7 June 1692",["Two years have passed. Lewis Galdy is now a merchant in Port Royal.","This part of the story shows the great earthquake. It is loud, and it can be scary."],[{t:"Begin",go:Bs},{t:"Read what happened instead",go:()=>rp(!0)}])}function Bs(){sn(),QS(),v.place!=="out"&&ii("out"),Ha(),te.on=!0,Lr("calm"),v.place="out",v.x=1,v.z=.6,v.yaw=-Math.PI/2,v.pitch=0,Sn&&(Sn.visible=!1),Ba(!1),Nn="It is a hot, still morning. Walk down to the harbour.",xi(),bn("7 June 1692, late morning")}function Ha(){if(te.abbaHit=te.abbaTrip=!1,$S(),Ge&&Ge.userData.anim){let t=Ge.userData.anim.get("JogStumble");t&&t.stop()}if(te.abbaRun||mi&&mi.isRunning()||Ge&&Ge.userData.anim&&Ge.userData.anim.cur!==ni){te.abbaRun=!1,mi&&mi.stop();let t=Ge.userData.anim;t&&t.cur!==ni&&(t.cur.stop(),t.cur=ni,t.timer=0),ni.reset().setEffectiveWeight(1).play()}te.ruin=!1,te.shake=0,te.T=0,yl(0,0),Ir=-.35,gl=2.7,$h=1.62,Ye.fog.color.copy(tu),Ye.fog.near=70,Ye.fog.far=900,Pr.material.color.set(16777215),re("vig").style.opacity=0;let i=mn.merchant,e=mn.sloop;i.position.set(Re+17.5,-.35,-5.9),i.rotation.set(0,0,0),e.position.set(Re+17.5,-.35,4.9),e.rotation.set(0,Math.PI,0),jn&&(jn.visible=!1),zs&&(zs.visible=!1);for(let t of nu)t.visible=!0;Ba(!0);for(let t of Fr)t.m.visible=!0;mn.merchant.visible=mn.sloop.visible=!0,te.aTalk=!1,te.boat&&(te.boat.visible=!1);for(let t of te.debris)t.visible=!1;rt.x=-5.25,rt.z=-Gn+1.05,Ge.position.set(rt.x,.12,rt.z),Ge.visible=!0,te.gain&&(te.gain.gain.value=0)}function Ag(){if(te.boat)return;let i=new Ae({map:Ht([96,80,62],6,3,1),roughness:.9,side:Bt}),e=new Ae({map:Ht([110,86,60],3,1,1),roughness:.9}),t=5.2,n=1.7,s=new li;s.moveTo(-t/2,-n*.36),s.quadraticCurveTo(0,-n*.56,t*.3,-n*.4),s.quadraticCurveTo(t*.45,-n*.2,t/2,0),s.quadraticCurveTo(t*.45,n*.2,t*.3,n*.4),s.quadraticCurveTo(0,n*.56,-t/2,n*.36),s.closePath();let r=new os(s,{depth:.7,bevelEnabled:!1,curveSegments:8});r.rotateX(-Math.PI/2);let a=r.attributes.position;for(let l=0;l<a.count;l++)a.getY(l)<.3&&(a.setZ(l,a.getZ(l)*.45),a.setX(l,a.getX(l)*.9));r.computeVertexNormals();let o=new vt;Ye.add(o),Y(r,i,0,-.3,0,o),Y(new Qe(t*.86,.03,n*.78),e,-.1,.02,0,o);for(let l of[-1.5,1.2])Y(new Qe(.24,.04,n*.86),e,l,.2,0,o);let c=Y(new Do(.28),new Tt({color:14263361}),0,3.3,0,o);o.userData.mark=c,te.boat=o;for(let l=0;l<12;l++){let h=l%3,u=Y(h===0?new nt(.3,.3,.9,10):h===1?new Qe(.7,.6,.7):new Qe(2.6,.12,.3),e,Re+8+l*37%50,0,12+l*53%55);h===0&&(u.rotation.z=Math.PI/2),u.rotation.y=l*1.3,u.userData.ph=l*1.7,te.debris.push(u)}}function ew(){if(!Ge||!ni)return;mi&&mi.stop();let i=Ge.userData.anim;if(i){for(let e of["JogStumble","StumbleBack","Terrified"]){let t=i.get(e);t&&t.stop()}i.cur!==ni&&i.cur.stop(),i.cur=ni,i.timer=0}ni.reset().setEffectiveWeight(1).fadeIn(.2).play()}function Wf(){sn(),Ag(),te.ruin=!0,yl(0,1),Ir=.2,gl=1.5,re("vig").style.opacity=0,Ye.fog.color.copy(bl),Ye.fog.near=25,Ye.fog.far=320,Pr.material.color.set(14273972);let i=mn.merchant,e=mn.sloop;i.position.set(Re+19,-1.2,-7),i.rotation.set(.42,.15,.05),e.position.set(Re-6,.5,13),e.rotation.set(-.5,2.2,.08),v.place="sea",v.x=Re+12,v.z=22,te.boat.position.set(Re+30,Ir,46),te.boat.rotation.y=.6,te.boat.visible=!0;for(let t of te.debris)t.visible=!0;v.yaw=Math.atan2(-(te.boat.position.x-v.x),-(te.boat.position.z-v.z)),v.pitch=0,rt.x=te.boat.position.x,rt.z=te.boat.position.z,Ge.visible=!0,te.abbaRun=!1,ew(),Ge.rotation.y=Math.atan2(v.x-rt.x,v.z-rt.z),Lr("sea"),Nn="Swim to the boat with the gold marker.",xi(),bn("A second shock throws you into the sea.")}function rp(i){for(let e of["quake","sand","watch","tomb"])Xi(e);te.shake=0,te.gain&&(te.gain.gain.value=0),te.phase="end",wn(i?"What happened":"Saved",i?["Just before noon, an earthquake shook Port Royal. The wet sand under the town turned to liquid, and most of the town sank into the sea.","Lewis Galdy was swallowed by the ground, thrown out into the sea by a second shock, and saved by a boat.","Four new pages are in your journal."]:["Hands pull you over the side of the boat. You are alive.","Behind you, most of Port Royal is under the sea.","Four new pages are in your journal."],[{t:"Go on: the days after",go:gs},{t:"Play the earthquake again",go:Bs},{t:"Go back to 1690",go:Qh}])}function Qh(){sn(),Ha(),te.on=!1,v.place="out",v.x=17,v.z=.4,v.yaw=Math.PI/2,v.pitch=0,Jn(),Nn="",Jn()}function tw(i,e){te.t+=i;let t=te.t;if(te.phase==="calm")(t>9||v.x>9)&&(Lr("tremor"),bn("Abba: \u201CDid you feel that?\u201D"));else if(te.phase==="tremor")te.shake=t<2.6?.22*Math.sin(t/2.6*Math.PI):0,Ge.userData.anim&&gn.Terrified&&Ge.userData.anim.cur===Ge.userData.anim.base&&t>.6&&Ge.userData.anim.play("Terrified"),t>4.6&&(Lr("main"),Nn="Run! Get away from the houses!",xi());else if(te.phase==="main"){!te.abbaHit&&Ge.visible&&Ge.userData.anim&&gn.StumbleBack&&(te.abbaHit=!0,Ge.userData.anim.play("StumbleBack",!0)),te.shake=Math.min(1,t/1.5),te.T=t,yl(t);let n=Gf(t/5);if(Ye.fog.color.copy(tu).lerp(bl,n),Ye.fog.near=70-62*n,Ye.fog.far=900-830*n,Pr.material.color.set(16777215).lerp(bl,n*.8),t>2.5&&Ge.visible&&!te.abbaRun)if(bn("Abba: \u201CRun! To the boats!\u201D"),mi){te.abbaRun=!0,rt.x=9999;let s=Ge.userData.anim;(s?s.cur:ni).fadeOut(.25),mi.reset().fadeIn(.25).play(),s&&(s.cur=mi,s.timer=0)}else Ge.visible=!1;if(te.abbaRun){if(!te.abbaTrip&&Ge.position.x>6&&gn.JogStumble&&Ge.userData.anim){te.abbaTrip=!0;let s=Ge.userData.anim,r=s.get("JogStumble");r.reset().setLoop(Ko).fadeIn(.15).play(),r.clampWhenFinished=!1,mi.fadeOut(.15),setTimeout(()=>{te.abbaRun&&(mi.reset().fadeIn(.2).play(),r.fadeOut(.2))},(r.getClip().duration-.2)*1e3)}Ge.rotation.y=Math.PI/2-.08,Ge.position.x+=4.6*i,Ge.position.z+=.35*i,Ge.position.x>Re+4&&(Ge.visible=!1,te.abbaRun=!1)}t>8.5&&(Lr("swallow"),Nn="The sand is pulling you down!",xi())}else if(te.phase==="swallow"){te.shake=1,te.T+=i,yl(te.T);let n=Gf(t/3.6);$h=1.62-1.25*n,gl=2.7*(1-.9*n),re("vig").style.opacity=n,t>4&&re("card").hidden&&(te.shake=.3,wn("Swallowed",["The wet sand has turned to liquid. It closes around you, up to your neck.","You cannot move. Then the ground shakes again."],[{t:"Next",go:Wf}]))}else if(te.phase==="sea"){te.shake=t<1.5?.6*(1-t/1.5):Math.sin(e*.5)>.96?.25:0,$h=Ir+.32+Math.sin(e*1.6)*.07;let n=te.boat;n.position.y=Ir+.12+Math.sin(e*1.2)*.06,n.rotation.z=Math.sin(e*.9)*.05,n.userData.mark.rotation.y=e*1.5,Ge.position.set(n.position.x-.3,n.position.y+.05,n.position.z);for(let s of te.debris)s.position.y=Ir+Math.sin(e*1.1+s.userData.ph)*.07,s.rotation.x=Math.sin(e*.7+s.userData.ph)*.12;Math.hypot(v.x-n.position.x,v.z-n.position.z)<2.3&&re("card").hidden&&rp(!1)}te.gain&&(te.gain.gain.value=Math.min(1,te.shake)*.9)}var jn=null,zs=null,Rg=[[-12.5,.8,3.6,3,4.6,Math.PI/2],[-7.6,-1.75,2.4,1.9,2.7,.08],[-5.2,1.8,2.2,1.8,2.5,-.1],[-16,-1.9,2.2,1.9,2.8,0]],ol=-9.8,ll=-1.7;function nw(i,e,t,n,s,r,a){let o=Math.cos(a),c=Math.sin(a),l=i-t,h=e-n,u=l*o-h*c,d=l*c+h*o;if(Math.abs(u)>=s||Math.abs(d)>=r)return[i,e];let f=u,p=d;return s-Math.abs(u)<r-Math.abs(d)?f=Math.sign(u||1)*s:p=Math.sign(d||1)*r,[t+f*o+p*c,n-f*c+p*o]}var Kt=-100,Jt=70;function Ci(i,e){let t=Jh("brick",!0).clone();return t.repeat.set(i,e),t.needsUpdate=!0,new Ae({map:t,roughness:.95})}function iw(){if(jn)return;jn=new vt,Ye.add(jn),Yt=jn;let i=new Ae({map:pn([206,194,166],26,3),roughness:1,side:Bt}),e=new Ae({map:Ht([92,72,52],3,1,2),roughness:.95}),t=new Ae({map:pn([150,130,100],30,3),roughness:1}),n=new Ae({color:1842206,roughness:.6,metalness:.7}),s=(l,h,u,d,f,p)=>{let y=new vt;y.position.set(l,0,h),y.rotation.y=p,jn.add(y);let g=new li;g.moveTo(-u/2,0),g.lineTo(0,d),g.lineTo(u/2,0);let m=new os(g,{depth:f,bevelEnabled:!1});m.translate(0,0,-f/2);let x=Y(m,i,0,0,0,y);x.material=[new Tt({visible:!1}),i];let M=Y(new nt(.04,.04,f+.5,6),e,0,d,0,y);M.rotation.x=Math.PI/2;for(let E of[-1,1])Y(new nt(.05,.05,d,6),e,0,d/2,E*f/2,y);let _=new li;_.moveTo(-u/2,0),_.lineTo(0,d),_.lineTo(u/2,0),_.closePath(),Y(new Is(_),i,0,0,-f/2,y)};for(let l of Rg)s(l[0],l[1],l[2],l[3],l[4],l[5]);for(let[l,h,u]of[[-.2,0,.3],[.15,.1,-.5],[0,-.15,1.3]])Y(new nt(.06,.06,.7,7),e,ol+l,.08,ll+h).rotation.set(Math.PI/2,0,u);Y(new Ni(.2,.5,7),new Tt({color:16751150}),ol,.33,ll);for(let l of[-1,1]){let h=Y(new nt(.02,.02,1.3,5),n,ol+l*.3,.6,ll);h.rotation.z=l*.45}let r=Y(new Pn(.16,10,8),n,ol,.7,ll);r.scale.y=.8;for(let[l,h,u]of[[-11.4,-2.4,1],[-12.3,-2.6,.85],[-6.4,-.1,.85],[-3.2,2.5,1],[-13.6,-2.5,1]])Y(new Pn(.3,10,8),t,l,.2*u,h).scale.set(1.2*u,.7*u,.9*u);let a=Ci(1.5,.5);for(let[l,h,u,d,f,p]of[[-2,-2.4,2.2,.7,.15,1.2],[-1,2.4,2,.9,-.2,1.2],[-15.9,2.5,1.8,.5,.1,1]])Y(new Qe(u,d,p),a,l,d/2-.1,h).rotation.set(.12,f,.1);for(let[l,h,u,d,f]of[[-4.3,-2.9,3,.15,.18],[-3.6,.2,2.6,-1.25,.12],[-9.6,2.8,3,.05,.3],[-10.8,-2.9,2.4,-.05,.1]])Y(new Qe(u,.2,.2),e,l,.35,h).rotation.set(0,d,f);let o=Y(new Mt(160,160),Er,81.2,.07,0);o.rotation.x=-Math.PI/2;let c=Y(new Mt(3,14),new Tt({color:6245944,transparent:!0,opacity:.4}),-.2,.012,0);c.rotation.x=-Math.PI/2,Cg();for(let l of Fr){if(l.sink<12)continue;let h=l.m.position,u=h.z<0?-1:1,d=p=>Math.abs(Math.sin(h.x*7.1+p*3.7));for(let p=0;p<3;p++){let y=1.2+d(p)*2.2,g=.35+d(p+4)*.9;Y(new Qe(y,g,.36),a,h.x-2.2+p*2.1+d(p+9),g/2-.15,h.z-u*(1.2+d(p+2)*3)).rotation.set(d(p+5)*.12,d(p+6)*.5-.25,(d(p+7)-.5)*.2)}for(let p=0;p<2;p++)Y(new Qe(2.4+d(p+11),.18,.18),e,h.x-1+p*2.2,.25,h.z-u*(2+d(p+12)*2)).rotation.set(0,d(p+13)*2,.15+d(p+14)*.25);let f=Y(new Ni(1.1+d(20)*.6,.5,9),a,h.x+1.5,.15,h.z-u*1.8);f.rotation.y=d(21)*3}for(let[l,h,u,d,f,p]of ug){if(!tt[d])continue;let y=tt[d].userData.anim;delete tt[d].userData.anim;let g=Ra(tt[d]);tt[d].userData.anim=y,g.traverse(m=>{m.isMesh&&(m.material=m.material.clone(),m.material.color.setRGB(...p))}),g.position.set(l,0,h),g.rotation.y=u,g.visible=!0,jn.add(g),Pi(g,f),pl.push(g)}for(let[l,h,u,d]of Fs){if(!tt[d])continue;let f=tt[d].userData.anim;delete tt[d].userData.anim;let p=Ra(tt[d]);if(tt[d].userData.anim=f,p.traverse(y=>{y.isMesh&&(y.material=y.material.clone(),y.material.color.setRGB(.78,.74,.68))}),p.visible=!0,p.position.set(l,0,h),p.rotation.y=u,jn.add(p),Pi(p,d==="sailor"?"Sad2":d==="kofi"?"Sad1":gn.SitDisbelief?"SitDisbelief":"Sad2"),Vs[d]=p,pl.push(p),d==="benning"&&gn.SitDisbelief){p.userData.sits=!0;let y=new ht(new Qe(.55,.42,.45),new Ae({map:Ht([132,100,70],3,1,2),roughness:.9}));y.position.set(l-Math.sin(u)*.18,.21,h-Math.cos(u)*.18),y.rotation.y=u,jn.add(y)}}Yt=Ye}function Cg(){let i=tt.heath;!i||!jn||i.parent||(pl.push(i),i.position.set(Cr.x,0,Cr.z),i.rotation.y=Cr.ry,jn.add(i),Pi(i,"Pray"),i.userData.ground=0)}function Pg(){return v.unlocked.includes("tentp")&&v.unlocked.includes("kingston")}function qh(){Nn=te.aTalk?Pg()?"Go back to Abba.":"Look around: the big tent, and the edge of the water.":"Find Abba in the camp.",xi()}function gs(){za("sad"),sn(),iw(),Ag(),v.place!=="out"&&ii("out"),Ha(),te.on=!0,te.phase="after",te.ruin=!0,yl(0,1),jn.visible=!0;let i=mn.merchant,e=mn.sloop;i.position.set(Re+19,-1.2,-7),i.rotation.set(.42,.15,.05),e.position.set(Re-6,.5,13),e.rotation.set(-.5,2.2,.08),Ye.fog.color.copy(bl),Ye.fog.near=35,Ye.fog.far=420,Pr.material.color.set(14866626),v.place="after",v.x=-1.6,v.z=0,v.yaw=Math.PI/2,v.pitch=0,rt.x=-8.9,rt.z=.7;for(let t of nu)t.visible=!1;Ge.position.set(rt.x,0,rt.z),Ge.visible=!0,Sn&&(Sn.visible=!1),Ba(!1),qh(),bn("Three days later")}function sw(){wn("Stay, or go?",["The town you knew is under the sea. Across the harbour, people are starting again.","What will you do?"],[{t:"Stay and build again",go:()=>wn("He stayed",["The real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church."],[{t:"Go to the church",go:Ws}])},{t:"Cross the harbour",go:()=>wn("Most people left",["Most survivors crossed the harbour, and their new town became Kingston.","But the real Lewis Galdy stayed in Port Royal. He traded, grew rich, and helped to build a new church."],[{t:"Go to the church",go:Ws}])}])}function rw(){if(zs)return;zs=new vt,Ye.add(zs),Yt=zs;let i=new Ae({map:pn([176,172,160],26,2),roughness:.9}),e=new Ae({map:pn([96,84,74],30,6),roughness:.95}),t=new Ae({color:1776152,roughness:.9}),n=new Ae({map:Ht([84,62,44],4,1,1),roughness:.9}),s=Y(new Mt(30,30),new Ae({map:pn([126,138,92],36,10),roughness:1}),Kt,.02,Jt-4);s.rotation.x=-Math.PI/2;let r=Ci(16,2.4);for(let[D,G,q,le]of[[Kt,Jt-19,30,.5],[Kt,Jt+11,30,.5],[Kt-15,Jt-4,.5,30],[Kt+15,Jt-4,.5,30]])Y(new Qe(q,2.6,le),r,D,1.3,G),Y(new Qe(q+.2,.14,le+.2),i,D,2.67,G);let a=Kt-4,o=Jt-6,c=8,l=15,h=6,u=new Ae({color:15328212,roughness:.85}),d=new Ae({color:1909544,roughness:.3,metalness:.3});Y(new Qe(c,h,l),Ci(8,5.5),a,h/2,o),Y(new Qe(c+.3,.45,l+.3),i,a,.22,o),Y(new Qe(c+.35,.28,l+.35),u,a,h-.1,o);for(let D of[-1,1])for(let G of[-1,1])for(let q=.6;q<h-.4;q+=.62)Y(new Qe(q%1.24<.62?.62:.42,.28,.12),u,a+D*(c/2+.05)-D*.2,q,o+G*(l/2+.01)).rotation.y=0;let f=(D,G)=>{let q=new li;return q.moveTo(-D/2,0),q.lineTo(D/2,0),q.lineTo(D/2,G-D/2),q.absarc(0,G-D/2,D/2,0,Math.PI,!1),q.lineTo(-D/2,0),q},p=(D,G,q,le,Pe,Z)=>{let de=new vt;de.position.set(D,G,q),de.rotation.y=le,Yt.add(de);let Ie=f(Pe+.36,Z+.18);Ie.holes.push(f(Pe,Z));let Xe=new ht(new os(Ie,{depth:.08,bevelEnabled:!1,curveSegments:14}),u);Xe.position.set(0,-.09,0),de.add(Xe);let Me=new ht(new Is(f(Pe,Z),14),d);Me.position.z=-.02,de.add(Me);for(let Ze of[Z*.33,Z*.62]){let lt=new ht(new Qe(Pe,.04,.03),u);lt.position.set(0,Ze,.01),de.add(lt)}let je=new ht(new Qe(.04,Z-Pe/2,.03),u);je.position.set(0,(Z-Pe/2)/2,.01),de.add(je);let Rt=new ht(new Qe(.26,.34,.12),u);Rt.position.set(0,Z+.06,.03),de.add(Rt)};for(let D of[-5,-1.7,1.6])for(let G of[-1,1])p(a+G*(c/2+.02),1.5,o+D,G*Math.PI/2,1.3,3.2);let y=Math.atan2(3.2,c/2),g=Math.hypot(c/2,3.2)+.4;for(let D of[-1,1]){let G=Y(new Qe(g,.14,l+.6),e,a+D*(c/4+.1),h+1.55,o);G.rotation.z=-D*y}for(let D of[-1,1]){let G=new li;G.moveTo(-c/2,0),G.lineTo(0,3.2),G.lineTo(c/2,0),G.closePath();let q=Y(new Is(G),Ci(.25,.3),a,h,o+D*l/2+D*.01);q.material.side=Bt}let m=Y(new ei(.55,.12,8,24),u,a,h+1.25,o-l/2-.05);Y(new wo(.55,24),d,a,h+1.25,o-l/2-.03).rotation.y=Math.PI,p(a,1.6,o-l/2-.02,Math.PI,1.8,3.6);let x=4.2,M=o+l/2+x/2-.2,_=10;Y(new Qe(x,_,x),Ci(4.2,9.5),a,_/2,M);for(let D of[.22,4.2,7.4])Y(new Qe(x+.2,D<1?.45:.22,x+.2),D<1?i:u,a,D,M);for(let[D,G,q]of[[0,1,0],[0,-1,Math.PI],[1,0,Math.PI/2],[-1,0,-Math.PI/2]])G!==-1&&p(a+D*(x/2+.02),8,M+G*(x/2+.02),q,1,1.6),G===1&&p(a,4.8,M+x/2+.02,0,.8,1.6);Y(new Qe(x+.45,.32,x+.45),u,a,_+.1,M);for(let D of[-1,1])for(let G of[-1,1])Y(new Qe(.42,.75,.42),u,a+D*(x/2-.05),_+.6,M+G*(x/2-.05));let E=new vt;E.position.set(a,_+.26,M),Yt.add(E);for(let D=0;D<8;D++){let G=new ht(new Qe(.12,1.3,.12),u),q=D/8*Math.PI*2;G.position.set(Math.cos(q)*.75,.65,Math.sin(q)*.75),E.add(G)}let A=new ht(new Pn(.95,16,8,0,Math.PI*2,0,Math.PI/2),new Ae({color:6253158,roughness:.6,metalness:.4}));A.position.y=1.3,E.add(A);let b=new ht(new nt(.03,.03,1.1,6),t);b.position.y=2.6,E.add(b);let S=new ht(new Qe(.5,.05,.05),t);S.position.y=2.75,E.add(S);let L=new vt;L.position.set(a,0,M+x/2+.03),Yt.add(L);let P=f(2,3);P.holes.push(f(1.5,2.75)),L.add(new ht(new os(P,{depth:.1,bevelEnabled:!1,curveSegments:14}),u));let k=new ht(new Is(f(1.5,2.75),14),n);k.position.z=-.01,L.add(k);let V=Kt+6,X=Jt-2;Y(new Qe(1.2,.2,2.5),i,V,.1,X),Y(new Qe(1,.7,2.3),Ci(2.3,.7),V,.55,X);let R=Ln(512,1024,D=>{D.fillStyle="#c9c5b8",D.fillRect(0,0,512,1024);for(let le=0;le<2500;le++)D.fillStyle=`rgba(${90+Math.random()*60|0},${88+Math.random()*50|0},80,${Math.random()*.12})`,D.fillRect(Math.random()*512,Math.random()*1024,2+Math.random()*6,2+Math.random()*6);D.strokeStyle="rgba(70,66,58,0.7)",D.lineWidth=3,D.strokeRect(22,22,468,980),D.fillStyle="rgba(60,56,50,0.85)",D.beginPath(),D.arc(256,112,58,0,7),D.lineWidth=5,D.stroke(),D.font="600 26px Georgia, serif",D.textAlign="center",D.fillText("L G",256,122);let G=["Here Lyes the Body of","LEWIS GALDY Esq.","who departed this Life at","Port Royal the 22d December 1739","Aged 80.","He was Born at Montpelier in France","but left that Country for his Religion","and came to settle in this Island","where he was swallowed up","in the Great Earthquake in the Year 1692","and By the Providence of God","was by another Shock thrown into the Sea","and Miraculously saved by swimming","until a Boat took him up.","He lived many Years after","in great Reputation,","Beloved by all that knew him","and much Lamented at his Death."],q=214;for(let le of G){let Pe=le.startsWith("LEWIS");D.font=(Pe?"700 31px":"italic 21px")+" Georgia, serif",D.fillStyle="rgba(255,255,255,0.35)",D.fillText(le,257,q+1.5),D.fillStyle="rgba(48,44,38,0.92)",D.fillText(le,256,q),q+=Pe?46:41}});R.wrapS=R.wrapT=Cn;let I=Y(new Qe(1.25,.12,2.55),[i,i,new Ae({map:R,roughness:.85}),i,i,i],V,.96,X),U=Y(new Ps(1.75,1.9,40),new Tt({color:14263361,side:Bt}),V,.05,X);U.rotation.x=-Math.PI/2;for(let[D,G]of[[Kt+3,Jt-9],[Kt+9.5,Jt-7],[Kt+1.5,Jt+3]])Y(new Qe(.7,1,.14),i,D,.5,G).rotation.z=.06;let O=new Ae({color:5208636,roughness:.9,side:Bt}),W=new Ae({map:pn([120,100,78],30,2),roughness:1});for(let[D,G,q]of[[Kt+11,Jt-13,7],[Kt+12,Jt+6,6],[Kt-12,Jt+7,7.5]]){let le=Y(new nt(.16,.24,q,8),W,D,q/2,G);le.rotation.z=.06;for(let Pe=0;Pe<9;Pe++){let Z=Y(new Mt(.7,3.4),O,D+.3,q,G);Z.geometry.translate(0,1.7,0),Z.rotation.set(1.15+Pe%3*.18,Pe*.7,0,"YXZ")}}Yt=Ye}function Ws(){sn(),v.place!=="out"&&ii("out"),v.ch.after=!0,kr(),rw(),Ha(),te.on=!0,te.phase="yard";for(let i of Fr)i.m.visible=!1;mn.merchant.visible=mn.sloop.visible=!1,Ge.visible=!1,Ba(!1),zs.visible=!0,v.place="yard",v.x=Kt+11,v.z=Jt+3.5,v.yaw=.95,v.pitch=.06,rt.x=9999,Nn="Find the tomb beside the church.",xi(),bn("St Peter\u2019s Church, Port Royal")}function aw(){wn("Here lies Lewis Galdy",["\u201CHere Lyes the Body of LEWIS GALDY Esq. who departed this Life at Port Royal the 22d December 1739, Aged 80.","He was Born at Montpelier in France, but left that Country for his Religion, and came to settle in this Island, where he was swallowed up in the Great Earthquake in the Year 1692,","and By the Providence of God was by another Shock thrown into the Sea, and Miraculously saved by swimming until a Boat took him up.","He lived many Years after in great Reputation, Beloved by all that knew him, and much Lamented at his Death.\u201D"],[{t:"Go on",go:ow}])}function ow(){za("end"),Xi("fortune"),Xi("stone"),wn("The end of the story",["Lewis Galdy lived for 47 more years. His tombstone tells of his escape, and says that everyone loved him.","It does not say what he sold to grow rich. Abba would have told it another way.","Two new pages are in your journal."],[{t:"Read the journal",go:()=>{sn(),Qf()}},{t:"Credits",go:()=>{sn(),re("credits").hidden=!1}},{t:"Go back to 1690",go:Qh}])}var Wi=null,dl=null,Tr=-262,jt=-248,qi={coins:!1,talked:!1},Ig={},Xh={sugar:[-259.5,-2.6],cocoa:[-254.6,-2.9],logwood:[-250.4,-2.9]};function Lg(){return["sugar","cocoa","logwood"].every(i=>v.unlocked.includes(i))}function jh(){Nn=Lg()?qi.coins?qi.talked?"Read the letter on your desk.":"Abba is at the door. Talk to her.":"Sit at your desk and serve a customer.":"Check today\u2019s cargo: the casks, the sacks and the red wood.",xi()}function lw(){if(Wi)return;Wi=new vt,Wi.visible=!1,Ye.add(Wi),Yt=Wi;let i=(R,I,U,O,W,D,G,q)=>Y(new Qe(R,I,U),O,W,D,G,q),e=(R,I)=>new Ae({map:R,roughness:I===void 0?.9:I}),t=e(Ht([104,76,50],4,1,1)),n=new Ae({color:3811869,roughness:.95}),s=e(Ht([122,92,62],5,1,1),.8),r=new Ae({color:1842206,roughness:.6,metalness:.7}),a=new Ae({color:11569722,roughness:.4,metalness:.8}),o=new Ae({color:12172216,roughness:.4,metalness:.85}),c=new Ae({map:pn([150,126,92],30,3),roughness:1}),l=new Ae({color:15129792,roughness:.9}),h=(Tr+jt)/2,u=jt-Tr,d=10,f=3.8;Y(new Mt(u,d),Ci(7,5),h,0,0).rotation.x=-Math.PI/2,Y(new Mt(u,d),e(Ht([70,52,38],8,4,3)),h,f,0).rotation.x=Math.PI/2,Y(new Mt(u,f),Ci(14,4),h,f/2,-5),Y(new Mt(u,f),Ci(14,4),h,f/2,5).rotation.y=Math.PI,Y(new Mt(d,f),Ci(10,4),Tr,f/2,0).rotation.y=Math.PI/2;for(let[R,I,U,O]of[[4.1,-2.95,f,f/2],[2.5,3.75,f,f/2],[3.4,.8,f-3,3+(f-3)/2]])Y(new Mt(R,U),Ci(R,U),jt,O,I).rotation.y=-Math.PI/2;for(let R=Tr+1;R<jt;R+=2)i(.22,.26,d,n,R,f-.13,0);for(let R of[-2.2,2.2])for(let I of[Tr+4.6,jt-4.6])i(.28,f,.28,n,I,f/2,R);for(let R of[-1,1]){let I=new vt;I.position.set(jt-.05,0,.8+R*1.7),I.rotation.y=R*1.48,Wi.add(I),i(.07,3,1.7,t,0,1.5,-R*.85,I);for(let U of[.5,2.5])i(.02,.06,1.2,r,-.045,U,-R*.75,I)}for(let R of[-.95,2.55])i(.2,3,.15,n,jt-.05,1.5,R);i(.25,.25,3.8,n,jt-.05,3.1,.8);let p=new vt;Wi.add(p);{let R=e(Ht([150,132,106],6,4,2)),I=e(Ht([84,66,48],3,1,2)),U=(W,D,G,q,le,Pe,Z)=>Y(new Qe(W,D,G),q,le,Pe,Z,p);U(7,.1,30,R,jt+3.5,-.05,.8),U(.25,.3,30,I,jt+7,-.15,.8);for(let W=-13;W<=15;W+=2.4)Y(new nt(.16,.18,2.2,9),I,jt+7.05,-.9,W,p),Math.abs(W-.8)>2&&Math.round(W)%2===0&&Y(new nt(.13,.15,.55,9),I,jt+6.6,.27,W,p);for(let[W,D]of[[jt+2.2,-3.4],[jt+2.9,-2.6],[jt+1.9,5.2]])Y(new nt(.34,.34,.85,14),I,W,.42,D,p);let O=Y(new Mt(400,400),Er,jt+207,-.45,.8,p);if(O.rotation.x=-Math.PI/2,mn.sloop){let W=mn.sloop.clone();W.position.set(jt+17,-.35,1.5),W.rotation.y=Math.PI/2,W.visible=!0,W.traverse(D=>{D.isMesh&&D.material&&D.material.isMeshStandardMaterial&&(D.material=D.material.clone(),D.material.emissive.set(16777215),D.material.emissiveMap=D.material.map,D.material.emissiveIntensity=.55)}),p.add(W)}}let y=Y(new Mt(4.5,3.2),new Tt({color:16773839,transparent:!0,opacity:.16,blending:va,depthWrite:!1}),jt-2.6,.012,.8);y.rotation.x=-Math.PI/2,Y(new Mt(1.4,.9),new Tt({color:14674402}),h-2,2.9,4.99).rotation.y=Math.PI;for(let R of[-.35,0,.35])i(.04,.9,.04,r,h-2+R,2.9,4.96);let g=new Fi([[0,-.6],[.4,-.6],[.48,-.32],[.52,0],[.48,.32],[.4,.6],[0,.6]].map(([R,I])=>new he(R,I)),16),m=e(Ht([126,94,58],10,2,1),.8),x=(R,I,U)=>{let O=new vt;O.position.set(R,I+.6,U),Wi.add(O),Y(g,m,0,0,0,O);for(let[W,D]of[[-.5,.435],[-.25,.497],[.25,.497],[.5,.435]])Y(new nt(D,D,.045,16,1,!0),r,0,W,0,O)};for(let R=0;R<3;R++)x(-261.2+R*1.1,0,-4.2),x(-260.65+R*1.1,0,-3.15);x(-260.65,1.2,-4),x(-259.55,1.2,-4);let M=0;for(let[R,I,U]of[[-255.4,0,-4.2],[-254.5,0,-4.3],[-253.6,0,-4.2],[-255,0,-3.5],[-254,0,-3.5],[-255,.42,-4.1],[-254.1,.42,-4.15],[-254.5,.8,-4.1],[-253.3,0,-3.4]]){let O=Y(new Pn(.42,10,8),c,R,I+.26,U);O.scale.set(1.15,.62,.85),O.rotation.y=M++*.7}let _=new Ae({map:pn([214,208,192],22,2),roughness:1});for(let[R,I,U]of[[-256.9,0,-4.3],[-256.9,.8,-4.3],[-257.9,0,-4.3]]){i(.9,.78,1.1,_,R,I+.4,U);for(let O of[-.3,.3])i(.93,.81,.04,c,R,I+.4,U+O)}let E=new Ae({map:pn([118,44,40],34,2),roughness:.9});for(let R=0;R<4;R++)for(let I=0;I<6-R;I++){let U=Y(new nt(.14,.15,1.7,7),E,-251.6+I*.3+R*.15,.15+R*.26,-4);U.rotation.x=Math.PI/2,U.rotation.z=((I*7+R)%5-2)*.03}for(let[R,I,U,O]of[[-249.2,3.6,.9,.2],[-250.45,4.05,.7,.35],[-249.3,3.7,.6,.9]]){let W=i(U,U,U,s,R,U/2+(O>.8?.9:0),I);W.rotation.y=O}let A=Y(new ei(.32,.05,6,16),c,-252.5,1.9,-4.93);i(.05,.05,.2,r,-252.5,2.2,-4.9);let b=-258.6,S=2.9;i(2,.07,1,s,b,.9,S);for(let R of[-1,1])for(let I of[-1,1])i(.08,.88,.08,t,b+R*.9,.44,S+I*.42);i(1.9,.5,.05,t,b,.6,S+.45);let L=Ln(256,160,R=>{R.fillStyle="#e9dfc4",R.fillRect(0,0,256,160),R.strokeStyle="#8a7a5c",R.beginPath(),R.moveTo(128,0),R.lineTo(128,160),R.stroke(),R.strokeStyle="#3a3026",R.lineWidth=1.3;for(let I=0;I<2;I++)for(let U=0;U<12;U++)R.beginPath(),R.moveTo(14+I*128,16+U*12),R.lineTo(70+I*128+U*37%30,16+U*12),R.stroke(),R.beginPath(),R.moveTo(98+I*128,16+U*12),R.lineTo(116+I*128,16+U*12),R.stroke()});L.wrapS=L.wrapT=Cn,i(.72,.05,.46,[t,t,new Ae({map:L,roughness:.9}),t,t,t],b-.35,.96,S-.05),Y(new nt(.09,.11,.02,12),a,b+.45,.945,S-.15),Y(new nt(.012,.012,.42,6),a,b+.45,1.15,S-.15);let P=Y(new nt(.008,.008,.5,6),a,b+.45,1.35,S-.15);P.rotation.z=Math.PI/2+.08;for(let R of[-1,1])Y(new nt(.08,.06,.015,12),a,b+.45+R*.24,1.14-R*.02,S-.15),Y(new nt(.003,.003,.2,4),a,b+.45+R*.24,1.25-R*.02,S-.15);for(let[R,I,U]of[[.75,.1,5],[.84,.16,3],[.7,.22,1],[.21,-.14,1]])Y(new nt(.019,.019,.005*U,10),o,b+R,.937+.0025*U+(R<.3?.21:0),S+I);Y(new nt(.07,.055,.015,12),a,b-.85,.943,S+.3),Y(new nt(.011,.011,.13,6),l,b-.85,1.02,S+.3);let k=Y(new Pn(.016,6,6),new Tt({color:16762474}),b-.85,1.1,S+.3);k.scale.y=1.9;let V=i(.24,.004,.17,l,b+.1,.938,S+.25);V.rotation.y=.3,Y(new nt(.018,.018,.006,10),new Ae({color:10231583,roughness:.5}),b+.1,.943,S+.25);let X=Y(new Ni(.012,.3,5),l,b-.05,1.02,S-.2);X.rotation.z=.5,Y(new nt(.03,.035,.05,8),r,b-.12,.96,S-.25),i(.4,.04,.3,s,b,.5,S+1);for(let R of[-1,1])for(let I of[-1,1])i(.04,.5,.04,t,b+R*.16,.25,S+1+I*.11);i(.9,.55,.55,n,-261.3,.275,3.9);for(let R of[-.3,0,.3])i(.05,.57,.57,r,-261.3+R,.275,3.9);i(.1,.12,.03,a,-261.3,.35,3.61);for(let R of[1.3,1.9])i(2.2,.04,.3,t,-259,R,4.83);for(let R=0;R<7;R++)i(.09+R%3*.02,.3,.22,R%2?t:n,-259.9+R*.13,1.47,4.83);for(let R=0;R<4;R++)Y(new nt(.07,.07,.2,10),l,-258.6+R*.2,2.02,4.83);{let U=f-1;i(.012,.6,.012,r,-256,U+.45,.6),i(.18,.02,.18,r,-256,U+.17,.6),i(.18,.02,.18,r,-256,U-.13,.6),i(.14,.26,.14,new Tt({color:16766346,transparent:!0,opacity:.55}),-256,U+.02,.6),dl=new ds(16767392,0,14,1.4),dl.position.set(-256,U,.6),Ye.add(dl)}for(let R in Xh){let I=Y(new Ps(.75,.86,36),new Tt({color:14263361,side:Bt}),Xh[R][0],.02,Xh[R][1]+.9);I.rotation.x=-Math.PI/2,Ig[R]=I,v.unlocked.includes(R)&&(I.visible=!1)}Yt=Ye}function cw(){if(za("begin"),!qs||!Dr){bn("The town is still loading.");return}Xs(),re("dialogue").hidden=!0,re("goal").hidden=!1,wn("1691",["A year has passed. Lewis Galdy now has a warehouse of his own, close to the wharf.","Ships bring goods in. He sells them on. This is how a merchant gets rich."],[{t:"Begin",go:Ua},{t:"Not now",go:sn}])}function Ua(){sn(),te.on&&(Ha(),te.on=!1),lw(),qi.coins=qi.talked=!1,ii("ware"),v.x=-249,v.z=-.4,v.yaw=Math.PI/2-.12,v.pitch=0,jh()}function hw(){wn("The letter",["\u201CMr Galdy. Spanish buyers will pay well for enslaved people from Jamaica. Put your money in with mine, and we will both be rich.\u201D","It is signed by the captain of a ship in the harbour."],[{t:"Say yes",go:()=>sg("You said yes",["In later years, the real Lewis Galdy made this choice. It made him rich.","The people who were sold had no choice at all."])},{t:"Say no",go:()=>sg("You said no",["That was the right thing to do.","In later years, the real Lewis Galdy said yes. It made him rich. The people who were sold had no choice at all."])}])}function sg(i,e){v.ch.ware=!0,kr(),wn(i,e,[{t:"Go on to 7 June 1692",go:Eg},{t:"Go back to 1690",go:eu}])}function eu(){sn(),ii("out"),v.x=17,v.z=.4,v.yaw=Math.PI/2,v.pitch=0,Nn="",Jn()}function uw(){let i=Kn.clientWidth,e=Kn.clientHeight;(Kn.width!==Math.floor(i*bs.getPixelRatio())||Kn.height!==Math.floor(e*bs.getPixelRatio()))&&(bs.setSize(i,e,!1),fi.aspect=i/e,fi.updateProjectionMatrix())}var Dr=!1,rg=performance.now(),ag=0,cl=!1,Uh=0,sl=0,Pa=null,og=0,Oh=new Map,dw=new Zt,fw=new oi;function Dg(i){let e=Math.min(.05,(i-rg)/1e3);if(rg=i,uw(),v.started&&!bi){let s=0,r=0;(Hn.has("w")||Hn.has("arrowup"))&&(s+=1),(Hn.has("s")||Hn.has("arrowdown"))&&(s-=1),Hn.has("d")&&(r+=1),Hn.has("a")&&(r-=1),Hn.has("arrowleft")&&(v.yaw+=1.9*e),Hn.has("arrowright")&&(v.yaw-=1.9*e),s-=Mn.y,r+=Mn.x;let a=Math.hypot(s,r);a>1&&(s/=a,r/=a);let o=gl*e,c=Math.sin(v.yaw),l=Math.cos(v.yaw),[h,u]=Zf(v.x+(-c*s+l*r)*o,v.z+(-l*s-c*r)*o);a>.05&&!tl&&(ag+=e*8.5*Math.min(1,a)),Fh+=Math.hypot(h-v.x,u-v.z),(h!==v.x||u!==v.z)&&($0=performance.now()),Fh>1.35&&(Fh=0,WS()),v.x=h,v.z=u}else v.started||(v.yaw=Math.PI/2-.12+Math.sin(i/5200)*.14);If+=(Zh(v.x,v.z)-If)*Math.min(1,e*10),Sf+=(e*1e3-Sf)*.05,wf+=e,wf>3&&v.started&&(wf=0,Sf>26&&rl>.8&&(rl=Math.max(.8,rl-.2),bs.setPixelRatio(rl))),te.on&&(tw(e,i/1e3),ZS(e));let t=te.shake*(tl?.15:1),n=i/1e3;if(vn){let s=Os&&v.started&&v.place!=="sea"&&!(te.on&&te.phase==="swallow");if(vn.visible=s,s){vn.position.set(v.x,Zh(v.x,v.z),v.z),vn.rotation.y=v.yaw+Math.PI;let r=Fh>0&&performance.now()-$0<250,a=vn.userData.anim;a&&r!==Af&&(Af=r,r?a.play(gn.Walk?"Walk":null):a.rest()),a&&Af&&a.cur!==a.base&&(a.cur.timeScale=Math.max(.6,Math.min(1.6,gl/1.5)))}}if(fi.position.set(v.x+Math.sin(n*31)*.06*t,$h+If+(tl?0:Math.sin(ag)*.035)+Math.sin(n*37)*.05*t,v.z+Math.sin(n*27)*.05*t),fi.rotation.set(v.pitch+Math.sin(n*29)*.015*t,v.yaw,Math.sin(n*23)*.03*t),vn&&vn.visible){let s=v.place==="out"?2.6:1.9,r=fi.position.x+Math.sin(v.yaw)*s,a=fi.position.z+Math.cos(v.yaw)*s,o=v.x,c=v.z,[l,h]=US(r,a);fi.position.x=l,fi.position.z=h,v.x=o,v.z=c,fi.position.y+=.35,fi.rotation.x-=.12}for(let[s,r]of Oh)s.quaternion.copy(r);if(Ar&&v.place!=="in"&&v.place!=="ware"){let s=i/1e3;Ar.offset.x=s*.02,Ar.offset.y=s*.013;let r=Na.geometry.attributes.position,a=Na.userData.base;if(!Nf||(og&1)===0)for(let l=0;l<r.count;l++){let h=a[l*3],u=a[l*3+2];r.setY(l,Math.sin(h*.42+s*1.3)*.07+Math.sin(u*.31+s*.9)*.06+Math.sin((h+u)*.9+s*2.1)*.025)}r.needsUpdate=!0,(og++&(Nf?7:3))===0&&Na.geometry.computeVertexNormals(),Na.position.y=Ir;let o=te.ruin?null:mn.merchant,c=te.ruin?null:mn.sloop;o&&(o.position.y=-.35+Math.sin(s*.8)*.05,o.rotation.x=Math.sin(s*.6)*.012,o.rotation.z=Math.sin(s*.45)*.004),c&&(c.position.y=-.35+Math.sin(s*1+1)*.07,c.rotation.x=Math.sin(s*.75+2)*.025);for(let l of Ng){for(let h=0;h<l.p.count;h++){let u=l.uv.getX(h);l.p.setZ(h,l.base[h*3+2]+(Math.sin(u*5.5-s*5.2)*.2+Math.sin(u*11-s*8.3)*.05)*u),l.p.setY(h,l.base[h*3+1]+Math.sin(u*4-s*3.1)*.05*u)}l.p.needsUpdate=!0}}jS(i/1e3),v.started&&i-Z0>5e3&&(Z0=i,kr()),ks&&ks.update(e);for(let s of bg){let r=s.getRoot(),a=r.visible,o=r.parent;for(;a&&o;)a=o.visible,o=o.parent;a&&s.update(e)}for(let s of[Ge,...Object.values(tt),...Object.values(Vs)])s&&s.userData.anim&&s.userData.anim.tick(e);for(let s of pl)s.visible&&s.parent&&s.parent.visible&&RS(s);for(let s of Nr)s(e);if(cl&&tt.kofi&&tt.kofi.visible&&gn.Carry&&DS(e),cl)for(let s of Oa){let r=tt[s.id];if(!r||!r.visible||s.walking)continue;let a=v.x-s.x,o=v.z-s.z,c=s.ry;if(Math.hypot(a,o)<4.5){let u=Math.atan2(a,o)-s.ry;u=Math.atan2(Math.sin(u),Math.cos(u)),c=s.ry+u}let l=c-r.rotation.y;l=Math.atan2(Math.sin(l),Math.cos(l)),r.rotation.y+=l*Math.min(1,e*3);let h=r.userData.anim;h&&gn.TurnL&&Math.abs(l)>.75&&h.cur===h.base&&nn!==r&&h.play(l>0?"TurnL":"TurnR",!0)}if(cl&&Ge){let s=i/1e3,r=Ge.getObjectByName("mixamorigSpine"),a=Ge.getObjectByName("mixamorigSpine2"),o=Ge.getObjectByName("mixamorigHead"),c=Ge.getObjectByName("mixamorigNeck");for(let p of[r,a,c,o])p&&(Oh.has(p)||Oh.set(p,new Zt),Oh.get(p).copy(p.quaternion));let l=(p,y,g,m)=>{p&&p.quaternion.multiply(dw.setFromEuler(fw.set(y,g,m)))};l(r,0,Math.sin(s*.35)*.05,Math.sin(s*.5)*.03),l(a,Math.sin(s*1.5)*.01,0,0);let h=v.x-rt.x,u=v.z-rt.z,d=!te.abbaRun&&(Math.hypot(h,u)<4.5||!re("dialogue").hidden);if(sl+=((d?1:0)-sl)*Math.min(1,e*3),!Pa&&c&&o){let p=null;if(Ge.traverse(y=>{!p&&y.isSkinnedMesh&&(p=y.skeleton)}),p){Pa={};let y=g=>new st().copy(p.boneInverses[p.bones.indexOf(g)]).invert();for(let g of[c,o]){let m=new st().copy(y(g.parent)).invert().multiply(y(g));Pa[g.name]=new Zt().setFromRotationMatrix(m)}}}Pa&&(c.quaternion.slerp(Pa[c.name],sl*.5),o.quaternion.slerp(Pa[o.name],sl*.5));let f=Math.atan2(h,u)-Ge.rotation.y;f=Math.max(-.7,Math.min(.7,Math.atan2(Math.sin(f),Math.cos(f))))*sl,Uh+=(f-Uh)*Math.min(1,e*4),l(c,0,Uh*.4,0),l(o,Math.sin(s*.9)*.02,Uh*.6,0)}if(cl){let s=v.x-rt.x,r=v.z-rt.z,a=Math.hypot(s,r),o=v.place==="sea"?Math.atan2(s,r):a<9?Math.max(-1.1,Math.min(1.1,Math.atan2(s,r))):v.place==="in"?0:.25;if(!te.abbaRun){let c=o-Ge.rotation.y;Ge.rotation.y+=c*Math.min(1,e*3);let l=Ge.userData.anim;l&&gn.TurnLW&&Math.abs(c)>.8&&l.cur===l.base&&Ge.visible&&!te.on&&l.play(c>0?"TurnLW":"TurnRW",!0)}if(Sn&&Sn.visible){let c=1+(tl?0:Math.sin(i/420)*.08);Sn.scale.set(c,c,c)}if(v.started){Us=null;let c=1e9;if(!bi)for(let l of iu){if(!!zt.on!=!!l.fb)continue;let h=l.where();if(!h)continue;let u=Math.hypot(v.x-h[0],v.z-h[1]);u<l.r&&u<c&&(c=u,Us=l)}re("talk").hidden=!Us,Us&&re("talk").textContent!==Us.label&&(re("talk").textContent=Us.label),!v.unlocked.includes("harbour")&&v.x<Re-2&&(Xi("harbour"),Jn())}if(v.place==="in"&&Ff&&!tl){let c=.85+Math.sin(i/90)*.08+Math.sin(i/37)*.07;Ff.scale.set(1,c,1),hl.intensity=16*c;for(let l=0;l<ul.length;l++){let h=1.75+Math.sin(i/70+l*2.1)*.25;ul[l].scale.y=ul[l].geometry.type==="SphereGeometry"?h:.9+(h-1.75)}}}bs.render(Ye,fi),requestAnimationFrame(Dg)}var Ng=[];async function pw(){await q0(["tex_harbour","merchant","sloop"],e=>{re("bar").style.width=Math.round(e*100)+"%"}),await j0();for(let e of["merchant","sloop"])mn[e]=wr(window.__got[e].scene),mn[e].traverse(t=>{if(t.isMesh&&t.material.name==="Flag"){let n=t.geometry.attributes.position;Ng.push({p:n,base:n.array.slice(),uv:t.geometry.attributes.uv})}});MS(),re("start").disabled=!1,re("start").textContent=Bf?"Continue":"Step ashore",re("savenote").hidden=!Bf,re("loadnote").hidden=!0,document.querySelector(".track").hidden=!0,await q0(["tex_town","h1","h2","h3","h4","h5","h6","abba","kofi","sailor","benning","anims"]),await j0();for(let e in window.__tex)window.__tex[e]="";for(let e of Object.keys(al))gg[e]=wr(window.__got[e].scene);let i=window.__got.abba;if(Ge=wr(i.scene),i.animations.length&&(ks=new xa(Ge),ni=ks.clipAction(i.animations[0]),ni.play(),Gh=i.animations[0].clone(),Gh.tracks=Gh.tracks.filter(e=>e.name.endsWith(".quaternion"))),window.__got.anims)for(let e of window.__got.anims.animations)gn[e.name]=e;ks&&gn.Run&&(mi=ks.clipAction(Vh("Run",!0))),ks&&ni&&Pi(Ge,null,ks,ni);for(let e of Oa){let t=wr(window.__got[e.id].scene);t.position.set(e.x,e.y||Yf(e.x,e.z),e.z),t.rotation.y=e.ry,Ye.add(t),tt[e.id]=t,Pi(t)}FS(),Sn&&(Sn.visible=!v.talked),window.__got=null,qs=!0,cl=!0,setTimeout(()=>{SS();for(let t of Hs)v.unlocked.includes(t.id)&&(Kf[t.id].visible=!1);v.ate&&(ms.visible=!0),Dr=!0,re("tchap").hidden=!1,Hh("heath").then(t=>{tt.heath=wr(t.scene),Cg()}).catch(()=>{});for(let t of["ned","buc1","buc2","morgan","gunner"])Hh(t).then(n=>{tt[t]=wr(n.scene),gw(t)}).catch(()=>{});Hh("galdy").then(t=>{vn=wr(t.scene),vn.scale.multiplyScalar(.94),vn.visible=!1,Ye.add(vn),Pi(vn,"Idle"),re("view").hidden=!1}).catch(()=>{}),re("chapters").hidden||tp();let e=new URLSearchParams(location.search);e.has("shot")&&(re("start").click(),e.get("shot")==="talk"&&(v.x=-3.6,v.z=-1.4,v.yaw=.62,v.pitch=-.02,setTimeout(()=>re("talk").click(),300)),e.get("shot")==="abbarun"&&(Bs(),Lr("main"),te.t=1.6,v.x=5,v.z=-.5,v.yaw=Math.PI/2-.3),e.get("shot")==="quake1"&&(Bs(),Lr("main"),te.t=6.5,v.x=6,v.yaw=Math.PI/2+.3),e.get("shot")==="quake2"&&(Bs(),Wf(),v.yaw+=0),e.get("shot")==="quake3"&&(Bs(),Wf(),v.x=Re+14,v.z=20,v.yaw=Math.PI/2+.35,v.pitch=.1),e.get("shot")==="after"&&(gs(),v.x=-2,v.z=-1,v.yaw=Math.PI/2-.1),e.get("shot")==="after2"&&(gs(),v.x=-12,v.z=-1,v.yaw=-Math.PI/2-.15),e.get("shot")==="yard"&&Ws(),e.get("shot")==="yard2"&&(Ws(),v.x=Kt+6,v.z=Jt-.2,v.yaw=0,v.pitch=-1.1),e.get("shot")==="church"&&(Ws(),v.x=Kt+9,v.z=Jt+9,v.yaw=Math.atan2(-(Kt-4-v.x),-(Jt-6-v.z)),v.pitch=.18),e.get("shot")==="ware"&&Ua(),e.get("shot")==="door"&&(Ua(),v.x=-253,v.z=.6,v.yaw=-Math.PI/2,v.pitch=0),e.get("shot")==="ware2"&&(Ua(),v.x=-256.6,v.z=.2,v.yaw=.62+Math.PI*0,v.yaw=Math.atan2(-(-258.6-v.x),-(2.9-v.z)),v.pitch=-.25),e.get("shot")==="chapters"&&np(),e.get("shot")==="third"&&(v.x=12,v.z=.3,v.yaw=Math.PI/2,setTimeout(()=>ap(),4500)),e.get("shot")==="kofi2"&&(v.x=33,v.z=-.6,v.yaw=Math.PI/2+.2),e.get("shot")==="npc1"&&(v.x=23.6,v.z=.6,v.yaw=Math.atan2(-(21.7-23.6),-(2.35-.6))),e.get("shot")==="npc2"&&(v.x=37.2,v.z=.2,v.yaw=Math.PI/2-.25),e.get("shot")==="npc3"&&(v.x=8.6,v.z=.9,v.yaw=Math.PI,v.pitch=.05),e.get("shot")==="tav"&&(v.talked=v.ate=!0,v.unlocked.push("harbour"),ii("in"),v.x=-199,v.z=-2.2,v.yaw=Math.atan2(-2.7,-2.2),v.pitch=-.05),e.get("shot")==="tav2"&&(v.talked=v.ate=!0,v.unlocked.push("harbour"),ii("in"),v.x=-199.6,v.z=-.6,v.yaw=Math.atan2(2,-2.5),v.pitch=-.08),e.get("shot")==="fort"&&(v.x=21.2,v.z=-14,v.yaw=.2,v.pitch=.08),e.get("shot")==="fort2"&&setTimeout(()=>{v.x=13,v.z=-24,v.yaw=Math.PI*.75+.2},5e3),e.get("shot")==="fb"&&(setTimeout(()=>_l(),4500),setTimeout(()=>{v.x=Re-.5,v.z=.4,v.yaw=Math.PI/2+.25},6e3)),e.get("shot")==="camp4"&&(gs(),v.x=-3,v.z=-3.2,v.yaw=Math.PI-.6,v.pitch=.05),e.get("shot")==="credits"&&(re("credits").hidden=!1),e.get("shot")==="resetc"&&setTimeout(()=>re("reset").click(),4e3),e.get("shot")==="camp3"&&(gs(),v.x=-4.2,v.z=3.4,v.yaw=Math.PI/2-.2),e.get("shot")==="npc4"&&(gs(),v.x=-7.4,v.z=3.2,v.yaw=Math.atan2(-(-9.65+7.4),-(1.75-3.2))),e.get("shot")==="street"&&(v.x=17,v.z=.4),e.get("shot")==="ships"&&(v.x=Re+1,v.z=.9,v.yaw=-Math.PI/2+.25,v.pitch=.22),e.get("shot")==="beach"&&(v.x=Re-6,v.z=1,v.yaw=-Math.PI/2-.9,v.pitch=-.05),e.get("shot")==="beach2"&&(v.x=Re-7,v.z=-2,v.yaw=-Math.PI/2+.8,v.pitch=.05),(e.get("shot")==="in"||e.get("shot")==="stew")&&(v.talked=!0,v.unlocked.push("harbour"),ii("in"),v.x=-199.6,v.z=2.6,v.yaw=.25,v.pitch=-.12,Jn(),e.get("shot")==="stew"&&(v.x=-200.6,v.z=-.6,v.yaw=.1,setTimeout(()=>{re("talk").click(),v.step=1,$f()},400))))},300)}function lg(i){i&&i.started||BS(OS()),pw().catch(()=>{}),i&&i.started&&(Object.assign(v,i),(v.place!=="out"||v.x>Re+24||v.x<fn-1||Math.abs(v.z)>9.5)&&(v.place="out",v.x=17,v.z=.4,v.yaw=Math.PI/2,v.pitch=0),re("start").addEventListener("click",()=>{v.unlocked.length&&(re("jcount").textContent=v.unlocked.length,re("jcount").hidden=!1)},{once:!0})),requestAnimationFrame(Dg)}window.claude?.hot?.snapshot?.(()=>v.place==="out"&&!te.on?{...v,step:0}:{...v,step:0,place:"out",x:17,z:.4,yaw:Math.PI/2,pitch:0});window.claude?.hot?.ready?window.claude.hot.ready(lg):lg(window.claude?.hot?.data??{});zf=xs("goArrive",zf);eu=xs("leaveWare",eu);Ua=xs("beginWare",Ua);Bs=xs("beginQuake",Bs);gs=xs("beginAfter",gs);Ws=xs("toYard",Ws);Qh=xs("leaveQuake",Qh);re("dev").onclick=()=>{re("credits").hidden=!1};re("crclose").onclick=()=>{re("credits").hidden=!0};re("chcred").onclick=()=>{re("credits").hidden=!1};function ap(){vn&&(Os=!Os,re("view").setAttribute("aria-pressed",String(Os)),bn(Os?"You can see Lewis Galdy. Press V to look through his eyes again.":"You see through Galdy\u2019s eyes."))}re("view").onclick=ap;addEventListener("keydown",i=>{(i.key==="v"||i.key==="V")&&!i.repeat&&document.activeElement?.tagName!=="INPUT"&&ap()});function mw(){return zt.on?1:v.place==="ware"?2:te.on&&te.phase==="yard"?5:te.on&&(te.phase==="after"||v.place==="after")?4:te.on?3:0}re("reset").onclick=()=>{if(Wh)return;Xs();let i=mw(),e=Hf[i];wn("Reset",["Go back to the start of this chapter, or begin the whole story again."],[{t:"Restart \u201C"+e.name+"\u201D",go:()=>{sn(),i===0&&(v.x=43,v.z=0),e.go()}},{t:"Start the whole story again",go:()=>wn("Start again?",["This erases everything you have found, including your journal pages."],[{t:"Yes, start again",go:()=>{try{localStorage.removeItem(su)}catch{}location.reload()}},{t:"No, keep playing",go:sn}])},{t:"Cancel",go:sn}])};var zt={on:!1},Dn={ready:!1};Rr.push({id:"morgan",title:"Captain Henry Morgan",simple:["Henry Morgan was the most famous privateer of Port Royal. He came from Wales and arrived in Jamaica as a young man, around 1658.","The governor of Jamaica gave him papers to attack Spanish ships and towns. His men chose him as their admiral."],deeper:["He raided Portobelo in 1668 and Maracaibo in 1669. In January 1671 his men took the city of Panama, and it burned.","England and Spain had just made peace, so Morgan was arrested and sent to England in 1672. Instead of being punished, he was made a knight in 1674.","He came back in 1675 as Lieutenant Governor of Jamaica, and the law he served now hanged pirates. Ned is a made-up character, but Morgan was real."]},{id:"funeral",title:"Morgan\u2019s grave",simple:["Henry Morgan died in Port Royal on 25 August 1688.","He was buried in the Palisadoes cemetery, and the ships in the harbour fired a 22-gun salute."],deeper:["Four years later, the 1692 earthquake carried that cemetery into the sea. His grave has never been found.","Many stories say Morgan hid treasure in Port Royal. None of them have ever been proved."]},{id:"forts",title:"The forts of Port Royal",simple:["Six forts with cannons guarded Port Royal: Fort Charles, Fort James, Fort Carlisle, Fort Rupert, Fort Morgan and Fort Walker.","Any enemy ship had to sail past their guns to reach the harbour."],deeper:["Fort Charles was the first, begun in 1655. It is the only one that survived the 1692 earthquake, and you can still visit it today.","Forts James, Carlisle and Rupert sank into the sea in the earthquake.","Fort Charles in this game is simpler than the real one, and placed to fit the game."]});var fl={ned:[-201.6,1.95,Math.PI],b1:[-199,-.7,Math.PI/2],b2:[-198,-.7,-Math.PI/2]},qf={gunner:[14.6,-25.6,Math.PI/2]};function Lf(i){let e=i.getObjectByName("mixamorigRightHand");if(!e||i.userData.sword)return;let t=new vt,n=new Ae({color:13225168,metalness:.85,roughness:.3}),s=new Ae({color:12093756,metalness:.7,roughness:.4}),r=new ht(new Qe(.035,.68,.008),n);r.position.y=.42,r.rotation.z=.06,t.add(r);let a=new ht(new ei(.06,.008,6,12,Math.PI),s);a.position.y=.06,t.add(a);let o=new ht(new nt(.018,.018,.12,8),new Ae({color:3810840,roughness:.8}));o.position.y=0,t.add(o),t.position.set(0,.07,.02),t.rotation.set(Math.PI/2,0,0);let c=e.getWorldScale(new z).x||1;t.scale.setScalar(1/c),e.add(t),i.userData.sword=t}function gw(i){cg();let e=tt[i];if(e){if(i==="ned"&&Gs){let[t,n,s]=fl.ned;e.position.set(t,0,n),e.rotation.y=s,e.userData.sits=!0,Gs.add(e),Pi(e,gn.SitIdle?"SitIdle":null),pl.push(e),Uf.push([t,n,.5])}if(i==="buc1"||i==="buc2"){let[t,n,s]=i==="buc1"?fl.b1:fl.b2;e.position.set(t,0,n),e.rotation.y=s,Gs.add(e),Pi(e),Uf.push([t,n,.55])}if(i==="gunner"){cg();let[t,n,s]=qf.gunner;e.position.set(t,0,n),e.rotation.y=s,Dn.g.add(e),Pi(e)}i==="morgan"&&(e.visible=!1,Ye.add(e),Pi(e))}}var Ia={t:0,n:0},bw=[[0,"Talk1","Laugh"],[3.6,"Punch","Block"],[5.1,"Block","Punch"],[6.6,"Laugh","Defeated"],[12.5,"Talk2","Talk3"],[16,null,null]];Nr.push(i=>{let e=tt.buc1,t=tt.buc2;if(!e||!t||v.place!=="in"||!e.userData.anim||nn===e||nn===t)return;let n=Ia.t;Ia.t+=i;for(let[s,r,a]of bw)if(n<s&&Ia.t>=s){let o=c=>c&&!/Talk|Laugh/.test(c);r?e.userData.anim.play(r,o(r),3.5):e.userData.anim.rest(),a?t.userData.anim.play(a,o(a),3.5):t.userData.anim.rest(),r==="Punch"&&Ia.n++%2===0&&Math.hypot(v.x+199,v.z)<6&&setTimeout(()=>bn("Abba: \u201CNot in my tavern, boys! Take it outside!\u201D"),700)}Ia.t>22&&(Ia.t=0)});var xw=[{who:"Will",text:"Ha! Mind your feet, friend. Jack here thinks he can beat me at anything."},{who:"Jack",text:"I can! I sailed with Captain Morgan himself. I carried his flag at Portobelo!"},{who:"Will",text:"And I carried your hat home when you lost it. Go on, ask old Ned. He was really there."}],yw=[{who:"Ned",text:"Sit down, lad. You look like you want a story. I sailed with Henry Morgan, back when I was young."},{who:"Ned",text:"Morgan came out from Wales with nothing. By 1668 he was our admiral. Portobelo, Maracaibo, then Panama, the richest city in the Spanish lands."},{who:"You",text:"Was he a pirate?"},{who:"Ned",text:"He had papers from the governor, so the law called him a privateer. The Spanish called him worse.",choices:[{t:"Tell me the story",ok:!0},{t:"Maybe another time",ok:!0}]},{who:"Ned",text:"Close your eyes. It is August 1670. I am fifteen, a ship\u2019s boy, and the harbour is full of Morgan\u2019s ships..."}],_w=[{who:"Ned",text:"Morgan was knighted by the King, and came back to be Lieutenant Governor. Then he hanged pirates! Ha."},{who:"Ned",text:"He died two years ago. The ships fired 22 guns over his grave out on the Palisadoes. I was there.",unlock:"funeral"},{who:"Ned",text:"The forts fired too. Go and see Fort Charles, past the last houses. Those guns keep us all safe."}];iu.push({label:"Talk to the sailors",r:2.2,where:()=>v.place==="in"&&tt.buc1&&tt.buc1.parent&&[-198.5,-.7],go:()=>dn(xw)},{label:"Talk to old Ned",r:2.4,where:()=>v.place==="in"&&tt.ned&&tt.ned.parent&&[fl.ned[0],fl.ned[1]],go:()=>{if(v.unlocked.includes("morgan")){dn(_w,Jn);return}let i="yes",e=yw.map(t=>t.choices?{...t,choices:[{t:"Tell me the story",ok:!0},{t:"Maybe another time",ok:!0}]}:t);dn(e.slice(0,4),()=>wn("Ned\u2019s story",["Ned is going to tell you about the summer Morgan\u2019s fleet got ready for Panama.","In his story, you are young Ned."],[{t:"Hear the story",go:()=>{sn(),_l()}},{t:"Another time",go:sn}]))}});ml=(i=>e=>e==="Ned"?tt.ned:e==="Will"?tt.buc1:e==="Jack"?tt.buc2:e==="Henry Morgan"?tt.morgan:e==="The gunner"?tt.gunner:i(e))(ml);var Fa={x0:5,x1:19,z0:-32,z1:-22,gate:[14,16]};function cg(){if(Dn.ready)return;let i=new vt;Ye.add(i),Dn.g=i;let e=Yt;Yt=i;let t=new Ae({map:pn([176,160,132],30,4),roughness:.95}),n=new Ae({color:1907999,roughness:.5,metalness:.6}),s=new Ae({map:Ht([110,84,58],3,1,2),roughness:.9}),r=3.2,a=1.1,{x0:o,x1:c,z0:l,z1:h,gate:u}=Fa,d=(L,P,k,V,X)=>{let R=Math.hypot(k-L,V-P),I=Math.atan2(V-P,k-L),U=(L+k)/2,O=(P+V)/2,W=Y(new Qe(R,r-.9,a),t,U,(r-.9)/2,O);W.rotation.y=-I;let D=Math.max(2,Math.round(R/1.6));for(let G=0;G<D;G++){if(X&&G%2===1)continue;let q=(G+.5)/D,le=L+(k-L)*q,Pe=P+(V-P)*q,Z=Y(new Qe(R/D*.92,.9,a),t,le,r-.45,Pe);Z.rotation.y=-I}};d(o,h,u[0],h),d(u[1],h,c,h),d(c,h,c,l,!0),d(c,l,o,l,!0),d(o,l,o,h);for(let[L,P]of[[o,l],[c,l],[o,h],[c,h]])Y(new Qe(2.4,r+.6,2.4),t,L,(r+.6)/2,P);for(let L of u)Y(new Qe(.6,r+.8,1.3),t,L,(r+.8)/2,h);let f=Y(new Qe(2.6,.5,1.3),t,(u[0]+u[1])/2,r+.55,h),p=Y(new Mt(c-o,h-l+.2),new Ae({map:pn([168,152,124],26,8),roughness:1}),(o+c)/2,.01,(l+h)/2);p.rotation.x=-Math.PI/2;let y=Y(new Qe(2.6,1,h-l-1),t,c-1.85,.5,(l+h)/2),g=Y(new Qe(1.2,.5,1.6),t,c-3.65,.25,h-2.2);Dn.guns=[];let m=(L,P,k,V)=>{let X=new vt;X.position.set(L,V,P),X.rotation.y=k,i.add(X);let R=new ht(new Qe(.62,.34,1.3),s);R.position.y=.32,X.add(R);for(let O of[-.36,.36])for(let W of[-.42,.42]){let D=new ht(new nt(.2,.2,.1,12),s);D.rotation.z=Math.PI/2,D.position.set(O,.2,W),X.add(D)}let I=new ht(new nt(.13,.2,1.9,14),n);I.rotation.x=Math.PI/2,I.position.set(0,.62,.35),X.add(I);let U=new ht(new ei(.14,.035,6,14),n);return U.position.set(0,.62,1.3),X.add(U),Dn.guns.push(X),X};for(let L=0;L<4;L++)m(c-1.5,l+1.6+L*2.2,Math.PI/2,1);for(let L=0;L<3;L++)m(o+2.2+L*3.2,l+1.4,Math.PI,0);for(let[L,P]of[[c-3.3,l+1],[o+1.4,h-1.4]])for(let k=0;k<6;k++){let V=Y(new Pn(.11,10,8),n,L+k%3*.23+(k>2?.11:0),.11+(k>2?.18:0),P+(k>2?.1:0))}let x=Y(new Qe(3.4,2.4,2.6),t,o+3,1.2,h-3.2),M=Y(new Ni(2.6,1.1,4),new Ae({map:pn([110,70,54],30,4),roughness:.9}),o+3,2.95,h-3.2);M.rotation.y=Math.PI/4,M.scale.set(1,1,.78),Y(new Qe(.9,1.6,.06),s,o+3,.8,h-1.88);for(let[L,P]of[[o+6,h-1.2],[o+6.8,h-1.1],[o+6.4,h-1.8]])Y(new nt(.3,.3,.8,12),s,L,.4,P);let _=Y(new nt(.06,.08,9,8),s,o+8.5,4.5,(l+h)/2),E=Ln(96,64,L=>{L.fillStyle="#f2f0ea",L.fillRect(0,0,96,64),L.fillStyle="#c8202a",L.fillRect(40,0,16,64),L.fillRect(0,24,96,16)}),A=Y(new Mt(1.8,1.2,12,4),new Ae({map:E,side:Bt,roughness:.9}),o+9.4,8.3,(l+h)/2);Dn.flag={p:A.geometry.attributes.position,base:A.geometry.attributes.position.array.slice()};let b=Ln(256,64,L=>{L.fillStyle="#4a3a2a",L.fillRect(0,0,256,64),L.fillStyle="#efe4c8",L.font="600 30px Georgia, serif",L.textAlign="center",L.fillText("FORT CHARLES",128,42)});Y(new Mt(2.4,.6),new Ae({map:b,roughness:.9}),(u[0]+u[1])/2,r+.55,h+.66);let S=Y(new Mt(3.2,13.5),new Ae({map:pn([190,170,134],26,6),roughness:1,transparent:!0,opacity:.75}),20.4,.012,-15.2);S.rotation.x=-Math.PI/2,Yt=e,Dn.ready=!0}function La(i,e,t,n,s,r){return i>=t&&i<=n&&e>=s&&e<=r}function Df(i,e){let{x0:t,x1:n,z0:s,z1:r,gate:a}=Fa;return La(i,e,t+.8,n-3.3,s+.8,r-.8)?!La(i,e,t+1,t+5,r-4.8,r-1.6):!!(La(i,e,a[0]+.3,a[1]-.3,r-1,r+.8)||La(i,e,12,Re-.6,r+.75,-8.6)||La(i,e,n+1.5,Re-.6,s-1,r+.8))}function vw(i,e){return e>-8.6&&v.z>-8.6?[i,e]:Df(i,e)?[i,e]:Df(i,v.z)?[i,v.z]:Df(v.x,e)?[v.x,e]:e>-8.6&&i>ji+.3?[i,e]:[v.x,v.z]}var Mw=Zh;Zh=(i,e)=>v.place==="out"&&!zt.on&&Dn.ready&&La(i,e,Fa.x1-3.15,Fa.x1-.5,Fa.z0+.5,Fa.z1-.5)?1:Mw(i,e);function Sw(i,e){if(ru(),Ce.ctx&&Ce.on){let t=Ce.ctx,n=t.currentTime,s=t.createBufferSource(),r=t.createBiquadFilter(),a=vl(0),o=t.createOscillator(),c=t.createGain();s.buffer=Ce.step||Ce.crack,s.loop=!0,s.playbackRate.value=.3,r.type="lowpass",r.frequency.setValueAtTime(900,n),r.frequency.exponentialRampToValueAtTime(120,n+1.4),a.gain.setValueAtTime(.9,n),a.gain.exponentialRampToValueAtTime(1e-4,n+1.8),s.connect(r),r.connect(a),s.start(n),s.stop(n+1.9),o.frequency.setValueAtTime(70,n),o.frequency.exponentialRampToValueAtTime(28,n+.8),c.gain.setValueAtTime(.7,n),c.gain.exponentialRampToValueAtTime(1e-4,n+.9),o.connect(c),c.connect(a),o.start(n),o.stop(n+1)}Tg();for(let t=0;t<5;t++){let n=new ca(new or({map:sp,color:15262422,transparent:!0,opacity:0,depthWrite:!1}));n.position.set(i+.6+t*.5,1.7+Math.random()*.4,e+(Math.random()-.5)*.6),n.userData={age:-t*.08,life:3+Math.random()},Ye.add(n),gi.push(n)}te.shake=Math.max(te.shake,.25),setTimeout(()=>{te.on||(te.shake=0)},350)}Nr.push(i=>{if(!Dn.ready||v.place!=="out")return;let e=performance.now()/1e3,t=Dn.flag;for(let n=0;n<t.p.count;n++){let s=(t.base[n*3]+.9)/1.8;t.p.setZ(n,t.base[n*3+2]+Math.sin(s*5-e*5)*.15*s)}if(t.p.needsUpdate=!0,!te.on)for(let n of gi)n.userData.fort});Nr.push(i=>{if(!(te.on||!gi.length||xl.length))for(let e=gi.length-1;e>=0;e--){let t=gi[e],n=t.userData;if(n.age+=i,n.age<0)continue;let s=n.age/n.life;t.scale.setScalar(1+s*5),t.position.y+=i*.4,t.material.opacity=Math.min(.7,n.age*2)*(1-s),s>=1&&(Ye.remove(t),t.material.dispose(),gi.splice(e,1))}});var ww=[{who:"The gunner",text:"Welcome to Fort Charles! It was the first fort built here. There are five more around the town."},{who:"The gunner",text:"Fort James, Fort Carlisle, Fort Rupert, Fort Morgan and Fort Walker. Any enemy ship has to sail past all our guns."},{who:"You",text:"Have the guns ever been fired?"},{who:"The gunner",text:"For practice, and for honour. When Sir Henry Morgan was buried, the ships fired 22 guns for him. Want to hear one?",unlock:"forts"}];iu.push({label:"Talk to the gunner",r:2.4,where:()=>Dn.ready&&!te.on&&v.place==="out"&&tt.gunner&&[qf.gunner[0],qf.gunner[1]],go:()=>dn(v.unlocked.includes("forts")?[{who:"The gunner",text:"Stand back from the wall, and cover your ears!"}]:ww,()=>{Jn(),Tw()})});function Tw(){if(!Dn.guns)return;Dn.guns.slice(0,4).forEach((e,t)=>setTimeout(()=>{if(v.place!=="out"||zt.on)return;let n=new z(0,.62,1.4);e.localToWorld(n),Sw(n.x,n.z);let s=e.children.find(r=>r.geometry&&r.geometry.type==="CylinderGeometry"&&r.position.z>.3);s&&(s.position.z=.1,setTimeout(()=>{s.position.z=.35},500))},600+t*900))}Nr.push(()=>{Dn.g&&(Dn.g.visible=v.place==="out"&&!(te.on&&te.phase==="yard"))});var pi={morgan:[Re+9.5,-.55,-Math.PI/2],d1:[Re-4.2,2.6,Math.PI/2],d2:[Re-2.6,2.6,-Math.PI/2],c1:[Re+3,.7,Math.PI/2],watch:[[Re-3.4,4.2,Math.PI,"Laugh"],[Re-5.6,1.2,Math.PI*.7,"Talk2"],[Re+14,.8,-Math.PI/2,"Wave"]]},Ut={group:null,cast:[]};Rr.push({id:"panama",title:"The raid on Panama",simple:["In August 1670 Morgan gathered a fleet of ships and more than a thousand men.","In January 1671 they crossed the land to Panama on foot and took the city. It burned."],deeper:["Morgan\u2019s men were paid with a share of what they captured. Most got far less than they hoped.","The young Ned in this story is made up. The raid was real."]});function Ew(){if(!qs||!Dr||!tt.morgan){bn("The town is still loading.");return}Xs(),wn("1670",["This is old Ned\u2019s story, from twenty years before.","In it, you are young Ned, a ship\u2019s boy in Port Royal, the summer Morgan\u2019s fleet got ready for Panama."],[{t:"Begin",go:()=>{sn(),_l()}},{t:"Not now",go:sn}])}function Bh(i,e){let t=tt[i].userData.anim,n=tt[i].userData.sword;delete tt[i].userData.anim,delete tt[i].userData.sword;let s=Ra(tt[i]);return tt[i].userData.anim=t,n&&(tt[i].userData.sword=n),e&&s.traverse(r=>{r.isMesh&&(r.material=r.material.clone(),r.material.color.setRGB(...e))}),s}function Aw(){if(Ut.group)return;let i=new vt;i.visible=!1,Ye.add(i),Ut.group=i;let e=(r,[a,o,c],l)=>(r.position.set(a,Yf(a,o),o),r.rotation.y=c,r.visible=!0,i.add(r),Pi(r,l),Ut.cast.push(r),r),t=e(Bh("buc1"),pi.d1,"Sword1"),n=e(Bh("buc2"),pi.d2,"Sword2");Lf(t),Lf(n),Ut.d=[t,n],e(Bh("kofi",[.9,.85,.8]),pi.c1,"Carry"),Ut.carrier=Ut.cast[Ut.cast.length-1];for(let[r,a,o,c]of pi.watch)e(Bh(o>2?"sailor":"buc2",[.85,.8,.78]),[r,a,o],c);let s=tt.morgan;s.position.set(pi.morgan[0],.06,pi.morgan[1]),s.rotation.y=pi.morgan[2],i.add(s),s.visible=!0,Lf(s),Ut.box=new ht(new Qe(.44,.32,.34),new Ae({map:Ht([150,118,80],3,1,2),roughness:.9})),i.add(Ut.box)}var Rw=[{who:"Henry Morgan",text:"You, boy! Are you the new ship\u2019s boy? Good. Keep out from under the men\u2019s feet."},{who:"Henry Morgan",text:"I am Admiral Henry Morgan. The Governor of Jamaica has given me papers to fight the Spanish. That makes us privateers, not pirates."},{who:"You",text:"Where are we going, Admiral?"},{who:"Henry Morgan",text:"Somewhere rich. Every man gets a share of what we take, and nothing if we take nothing. So we practise until we are the best.",anim:"Point"},{who:"Henry Morgan",text:"Now run along and watch the men at their sword drill. Then go and help load the ships.",unlock:"morgan"}];function _l(){Aw(),zt.on=!0,zt.step=0,zt.wasThird=Os,Os=!1,ii("out"),Ba(!1),Ge.visible=!1,rt.x=9999,Lt.box&&(Lt.box.visible=!1),vn&&(vn.visible=!1),v.x=Re+15,v.z=0,v.yaw=Math.PI/2,v.pitch=0,Ut.group.visible=!0,document.body.classList.add("flash"),Nn="Find Admiral Morgan on the pier. He wears a red coat.",xi(),bn("Port Royal, August 1670")}function Cw(){wn("What happened next",["The fleet sailed. In January 1671 Morgan\u2019s men took Panama, and the city burned.","England had just made peace with Spain, so Morgan was arrested and sent to England. Instead of being punished, he was made a knight. He came back to rule Jamaica, and hanged pirates.","He died in 1688. Four years later, the earthquake took his grave into the sea."],[{t:"Back to the tavern",go:Xf}])}function Xf(){sn(),zt.on=!1,document.body.classList.remove("flash"),Ut.group.visible=!1,tt.morgan.visible=!1,Ba(!0),Os=!!zt.wasThird,Xi("panama"),v.ch.ned=!0,kr(),ii("in"),v.x=-200.4,v.z=2.4,v.yaw=Math.PI-.4,v.pitch=0,Jn(),bn("Ned: \u201CAnd that is how it was. Now, who is buying?\u201D")}iu.push({fb:!0,label:"Talk to Admiral Morgan",r:2.6,where:()=>zt.on&&[pi.morgan[0],pi.morgan[1]],go:()=>dn(zt.step?[{who:"Henry Morgan",text:"Still here? Go and watch the sword drill, then help with the loading."}]:Rw,()=>{zt.step=Math.max(zt.step,1),Nn="Watch the sword drill on the beach, by the boats.",xi()})},{fb:!0,label:"Watch the sword drill",r:3.4,where:()=>zt.on&&zt.step>=1&&[(pi.d1[0]+pi.d2[0])/2,pi.d1[1]],go:()=>{let[i,e]=Ut.d;dn([{who:"Tom",text:"Watch close, boy! Feet apart, sword up. Block high, then low!"},{who:"Dick",text:"And when you lose, you say so, like a gentleman. Yield?"},{who:"Tom",text:"I yield! Ha! Again tomorrow."}],()=>{i.userData.anim.play("Defeated",!0),e.userData.anim.play("Laugh",!0,3),setTimeout(()=>{i.userData.anim.play("Sword1"),e.userData.anim.play("Sword2")},7e3),zt.step=Math.max(zt.step,2),Nn="Help load the ships: talk to the man carrying crates.",xi()})}},{fb:!0,label:"Help load the ships",r:2.6,where:()=>zt.on&&zt.step>=2&&Ut.carrier&&[Ut.carrier.position.x,Ut.carrier.position.z],go:()=>dn([{who:"Sailor",text:"Biscuit, water, powder, shot. Enough for months at sea. Hand me that crate, boy."},{who:"Sailor",text:"Ha! Good lad. That is the last of it. We sail with the morning tide."}],Cw)});ml=(i=>e=>e==="Tom"?Ut.d&&Ut.d[0]:e==="Dick"?Ut.d&&Ut.d[1]:e==="Sailor"?Ut.carrier:i(e))(ml);Nr.push(i=>{if(!zt.on||!Ut.carrier)return;let e=Ut.carrier,t=performance.now()/1e3,n=(Math.sin(t*.25)+1)/2,s=Re+1+n*9,r=Math.cos(t*.25)>0?Math.PI/2:-Math.PI/2;if(nn===e)return;e.position.set(s,Yf(s,.7),.7),e.rotation.y=r;let a=e.getObjectByName("mixamorigLeftHand"),o=e.getObjectByName("mixamorigRightHand");a&&o&&(Ut.box.position.copy(a.getWorldPosition(au)).add(o.getWorldPosition(ip)).multiplyScalar(.5),Ut.box.rotation.y=r)});Nr.push(()=>{if(!zt.on)return;let i=tt.morgan;if(!i)return;let e=v.x-i.position.x,t=v.z-i.position.z;Math.hypot(e,t)<5&&(i.rotation.y+=(Math.atan2(e,t)-i.rotation.y)*.08)});var Pw=Zf;Zf=(i,e)=>{if(zt.on&&v.place==="out"){i=Math.max(Re-9,Math.min(Re+21.5,i)),i>Re-1.5?e=Math.max(-1.4,Math.min(1.4,e)):e=Math.max(-5,Math.min(6,e));for(let t of[tt.morgan,...Ut.cast]){if(!t||t===Ut.carrier)continue;let n=i-t.position.x,s=e-t.position.z,r=Math.hypot(n,s);r<.75&&r>0&&(i=t.position.x+n/r*.75,e=t.position.z+s/r*.75)}return[i,e]}return Pw(i,e)};ep.fbStart=["August 1670","Ned\u2019s story"];ep.fbLeave=["1690","Back in The Turtle"];_l=xs("fbStart",_l);Xf=xs("fbLeave",Xf);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
