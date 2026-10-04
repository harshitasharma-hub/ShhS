(()=>{var ot=(i,e,t)=>()=>{if(t)throw t[0];try{return i&&(e=i(i=0)),e}catch(n){throw t=[n],n}};var pp=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};function mp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function gp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function xr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bd(){let i=xr("canvas");return i.style.display="block",i}function ah(...i){let e="THREE."+i.shift();Os?Os("log",e,...i):console.log(e,...i)}function Sd(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Le(...i){i=Sd(i);let e="THREE."+i.shift();if(Os)Os("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ue(...i){i=Sd(i);let e="THREE."+i.shift();if(Os)Os("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ss(...i){let e=i.join(" ");e in ou||(ou[e]=!0,Le(...i))}function Md(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Ks(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ln[i&255]+ln[i>>8&255]+ln[i>>16&255]+ln[i>>24&255]+"-"+ln[e&255]+ln[e>>8&255]+"-"+ln[e>>16&15|64]+ln[e>>24&255]+"-"+ln[t&63|128]+ln[t>>8&255]+"-"+ln[t>>16&255]+ln[t>>24&255]+ln[n&255]+ln[n>>8&255]+ln[n>>16&255]+ln[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function _p(i,e){return(i%e+e)%e}function jl(i,e,t){return(1-t)*i+t*e}function or(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function vp(){let i={enabled:!0,workingColorSpace:_r,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=xi(s.r),s.g=xi(s.g),s.b=xi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=Ds(s.r),s.g=Ds(s.g),s.b=Ds(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Mi?vr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ss("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ss("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[_r]:{primaries:e,whitePoint:n,transfer:vr,toXYZ:cu,fromXYZ:hu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:cu,fromXYZ:hu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),i}function xi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ds(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function tc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ka.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}function sc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function dc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ts.fromArray(i,r);let o=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),l=e.dot(ts),c=t.dot(ts),h=n.dot(ts);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}function Np(i,e,t,n,s,r,a,o){let l;if(e.side===gn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Vi,o),l===null)return null;wa.copy(o),wa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(wa);return c<t.near||c>t.far?null:{distance:c,point:wa.clone(),object:i}}function Ea(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,ya),i.getVertexPosition(l,ba),i.getVertexPosition(c,Sa);let h=Np(i,e,t,n,ya,ba,Sa,bu);if(h){let d=new P;vi.getBarycoord(bu,ya,ba,Sa,d),s&&(h.uv=vi.getInterpolatedAttribute(s,o,l,c,d,new ge)),r&&(h.uv1=vi.getInterpolatedAttribute(r,o,l,c,d,new ge)),a&&(h.normal=vi.getInterpolatedAttribute(a,o,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new P,materialIndex:0};vi.getNormal(ya,ba,Sa,u.normal),h.face=u,h.barycoord=d}return h}function Ra(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(eo.fromBufferAttribute(o,s),to.fromBufferAttribute(o,r),t.distanceSqToSegment(eo,to,vc,Mu)>n)return;vc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(vc);if(!(c<e.near||c>e.far))return{distance:c,point:Mu.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}function Au(i,e,t,n,s,r,a){let o=Cc.distanceSqToPoint(i);if(o<t){let l=new P;Cc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function oh(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,p*=h,s(a,o,u,p)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}function Pu(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Fp(i,e){let t=1-i;return t*t*e}function Bp(i,e){return 2*(1-i)*i*e}function Op(i,e){return i*i*e}function pr(i,e,t,n){return Fp(i,e)+Bp(i,t)+Op(i,n)}function kp(i,e){let t=1-i;return t*t*t*e}function zp(i,e){let t=1-i;return 3*t*t*i*e}function Hp(i,e){return 3*(1-i)*i*i*e}function Vp(i,e){return i*i*i*e}function mr(i,e,t,n,s){return kp(i,e)+zp(i,t)+Hp(i,n)+Vp(i,s)}function Gp(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Td(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=$p(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,d=l;for(let u=t;u<s;u+=t){let p=i[u],g=i[u+1];p<o&&(o=p),g<l&&(l=g),p>h&&(h=p),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Lr(r,a,t,o,l,c,0),a}function Td(i,e,t,n,s){let r;if(s===rm(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Lu(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Lu(a/n|0,i[a],i[a+1],r);return r&&Xs(r,r.next)&&(Nr(r),r=r.next),r}function os(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Xs(t,t.next)||Lt(t.prev,t,t.next)===0)){if(Nr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Lr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Qp(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Xp(i,n,s,r):Wp(i)){e.push(l.i,i.i,c.i),Nr(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=qp(os(i),e),Lr(i,e,t,n,s,r,2)):a===2&&Yp(i,e,t,n,s,r):Lr(os(i),e,t,n,s,r,1);break}}}function Wp(i){let e=i.prev,t=i,n=i.next;if(Lt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),u=Math.max(s,r,a),p=Math.max(o,l,c),g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=p&&fr(s,o,r,l,a,c,g.x,g.y)&&Lt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Xp(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Lt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,p=Math.min(o,l,c),g=Math.min(h,d,u),_=Math.max(o,l,c),f=Math.max(h,d,u),m=Pc(p,g,e,t,n),b=Pc(_,f,e,t,n),E=i.prevZ,y=i.nextZ;for(;E&&E.z>=m&&y&&y.z<=b;){if(E.x>=p&&E.x<=_&&E.y>=g&&E.y<=f&&E!==s&&E!==a&&fr(o,h,l,d,c,u,E.x,E.y)&&Lt(E.prev,E,E.next)>=0||(E=E.prevZ,y.x>=p&&y.x<=_&&y.y>=g&&y.y<=f&&y!==s&&y!==a&&fr(o,h,l,d,c,u,y.x,y.y)&&Lt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;E&&E.z>=m;){if(E.x>=p&&E.x<=_&&E.y>=g&&E.y<=f&&E!==s&&E!==a&&fr(o,h,l,d,c,u,E.x,E.y)&&Lt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;y&&y.z<=b;){if(y.x>=p&&y.x<=_&&y.y>=g&&y.y<=f&&y!==s&&y!==a&&fr(o,h,l,d,c,u,y.x,y.y)&&Lt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function qp(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Xs(n,s)&&Rd(n,t,t.next,s)&&Dr(n,s)&&Dr(s,n)&&(e.push(n.i,t.i,s.i),Nr(t),Nr(t.next),t=i=s),t=t.next}while(t!==i);return os(t)}function Yp(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&nm(a,o)){let l=Cd(a,o);a=os(a,a.next),l=os(l,l.next),Lr(a,e,t,n,s,r,0),Lr(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function $p(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Td(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(tm(c))}s.sort(Zp);for(let r=0;r<s.length;r++)t=Jp(s[r],t);return t}function Zp(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Jp(i,e){let t=Kp(i,e);if(!t)return e;let n=Cd(t,i);return os(n,n.next),os(t,t.next)}function Kp(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(Xs(i,t))return t;do{if(Xs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Ad(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let d=Math.abs(s-t.y)/(n-t.x);Dr(t,i)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&jp(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function jp(i,e){return Lt(i.prev,i,e.prev)<0&&Lt(e.next,i,i.next)<0}function Qp(i,e,t,n){let s=i;do s.z===0&&(s.z=Pc(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,em(s)}function em(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Pc(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function tm(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ad(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function fr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Ad(i,e,t,n,s,r,a,o)}function nm(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!im(i,e)&&(Dr(i,e)&&Dr(e,i)&&sm(i,e)&&(Lt(i.prev,i,e.prev)||Lt(i,e.prev,e))||Xs(i,e)&&Lt(i.prev,i,i.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Xs(i,e){return i.x===e.x&&i.y===e.y}function Rd(i,e,t,n){let s=Ua(Lt(i,e,t)),r=Ua(Lt(i,e,n)),a=Ua(Lt(t,n,i)),o=Ua(Lt(t,n,e));return!!(s!==r&&a!==o||s===0&&Na(i,t,e)||r===0&&Na(i,n,e)||a===0&&Na(t,i,n)||o===0&&Na(t,e,n))}function Na(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ua(i){return i>0?1:i<0?-1:0}function im(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Rd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Dr(i,e){return Lt(i.prev,i,i.next)<0?Lt(i,e,i.next)>=0&&Lt(i,i.prev,e)>=0:Lt(i,e,i.prev)<0||Lt(i,i.next,e)<0}function sm(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Cd(i,e){let t=Ic(i.i,i.x,i.y),n=Ic(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Lu(i,e,t,n){let s=Ic(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Nr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ic(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function rm(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}function Du(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Nu(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}function am(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}function ds(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Uu(s))s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Uu(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function un(i){let e={};for(let t=0;t<i.length;t++){let n=ds(i[t]);for(let s in n)e[s]=n[s]}return e}function Uu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function om(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function lh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}function Ps(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Mc(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function Id(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function hm(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function um(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Id(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=hm(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}function Fu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}function uh(i,e,t,n){let s=ym(n);switch(t){case th:return i*e;case ih:return i*e/s.components*s.byteLength;case Lo:return i*e/s.components*s.byteLength;case Xi:return i*e*2/s.components*s.byteLength;case Do:return i*e*2/s.components*s.byteLength;case nh:return i*e*3/s.components*s.byteLength;case En:return i*e*4/s.components*s.byteLength;case No:return i*e*4/s.components*s.byteLength;case Xr:case qr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Yr:case $r:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fo:case Oo:return Math.max(i,16)*Math.max(e,8)/4;case Uo:case Bo:return Math.max(i,8)*Math.max(e,8)/2;case ko:case zo:case Vo:case Go:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ho:case Zr:case Wo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Yo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case $o:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Jo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ko:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case jo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Qo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case el:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case tl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case nl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case il:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case rl:case al:case ol:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ll:case cl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Jr:case hl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ym(i){switch(i){case wn:case Kc:return{byteLength:1,components:1};case Zs:case jc:case jn:return{byteLength:2,components:1};case Po:case Io:return{byteLength:2,components:4};case Jn:case Co:case Kn:return{byteLength:4,components:1};case Qc:case eh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}var Hu,Fc,Vu,cs,Gu,Ys,Vi,gn,nt,oi,$s,Bc,Oc,kc,Wu,hs,Xu,qu,Yu,$u,Zu,Ju,Ku,ju,zc,Hc,Qu,ed,td,nd,id,sd,rd,ad,od,Ha,Va,Ga,Us,Wa,Xa,qa,Ya,Vc,ld,cd,Zn,Gc,Wc,Xc,qc,Yc,$c,Zc,Jc,Gi,us,To,Ao,Gr,Fs,ni,$a,Qt,hd,Wr,Xt,Ro,li,wn,Kc,jc,Zs,Co,Jn,Kn,jn,Po,Io,Js,Qc,eh,th,nh,En,ii,Wi,ih,Lo,Xi,Do,No,Xr,qr,Yr,$r,Uo,Fo,Bo,Oo,ko,zo,Ho,Vo,Go,Zr,Wo,Xo,qo,Yo,$o,Zo,Jo,Ko,jo,Qo,el,tl,nl,il,sl,rl,al,ol,ll,cl,Jr,hl,gr,Za,Oa,Ec,Tc,Ac,Rc,ud,ul,dd,Mi,Qe,_r,vr,lt,ka,fd,pd,md,gd,dl,_d,vd,fl,xd,yd,sh,rh,Xn,Bs,ou,Os,wd,si,ln,za,Ja,dh,ge,ri,fh,P,Ql,lu,ph,Fe,ec,cu,hu,Ze,ys,Ka,xp,ks,yp,nc,mn,mh,Ct,ja,bn,yr,Qa,Eo,yt,bs,Hn,bp,Sp,Ci,ha,An,uu,du,yi,br,Mp,fu,Ss,fi,ua,lr,wp,Ep,pu,mu,gu,_u,Tp,Ms,ic,en,Ie,Ap,zs,Ed,Pi,da,he,cn,Sr,Vn,pi,rc,mi,ws,Es,vu,ac,oc,lc,cc,hc,uc,vi,Ni,gi,Gn,fa,Ts,As,Rs,Ii,Li,es,cr,pa,ma,ts,Vt,ga,Rp,Dt,Mr,wr,ze,Cp,hr,fc,Ui,Pp,Un,pc,Cs,Rn,ur,jt,Je,mc,Ip,Lp,Wn,Dp,qn,_i,gc,_a,va,Hs,Pt,xu,ns,xa,yu,ya,ba,Sa,_c,Ma,bu,wa,ye,Vs,ai,is,Up,Ta,Gs,Yn,eo,to,Su,dr,Aa,vc,Mu,Fn,wu,Eu,Bn,rs,Tu,Cc,Ca,Pa,Fi,Er,tn,Bi,no,Tr,Sn,as,Ia,La,xc,Da,On,Cn,Oi,io,Ru,Cu,yc,bc,Sc,$n,Ar,so,Rr,ro,Cr,ao,Pr,Iu,oo,Ir,Ws,Lc,Ns,Tt,Ur,bi,Fr,Br,Pd,lm,cm,At,lo,Si,co,ho,Mn,ki,uo,fo,po,mo,Pn,zi,go,_o,vo,Or,Hi,xo,yo,Ld,bo,kr,zr,wc,Bu,Ou,So,Fa,Ba,ti,Hr,Di,ku,zu,hn,qs,Dc,Vr,ls,Is,Ls,Mo,wo,ch,dm,hh,fm,pm,mm,gm,_m,vm,xm,Nc,Et,Hx,gh,Uc,_h=ot(()=>{Hu=0,Fc=1,Vu=2,cs=1,Gu=2,Ys=3,Vi=0,gn=1,nt=2,oi=0,$s=1,Bc=2,Oc=3,kc=4,Wu=5,hs=100,Xu=101,qu=102,Yu=103,$u=104,Zu=200,Ju=201,Ku=202,ju=203,zc=204,Hc=205,Qu=206,ed=207,td=208,nd=209,id=210,sd=211,rd=212,ad=213,od=214,Ha=0,Va=1,Ga=2,Us=3,Wa=4,Xa=5,qa=6,Ya=7,Vc=0,ld=1,cd=2,Zn=0,Gc=1,Wc=2,Xc=3,qc=4,Yc=5,$c=6,Zc=7,Jc=300,Gi=301,us=302,To=303,Ao=304,Gr=306,Fs=1e3,ni=1001,$a=1002,Qt=1003,hd=1004,Wr=1005,Xt=1006,Ro=1007,li=1008,wn=1009,Kc=1010,jc=1011,Zs=1012,Co=1013,Jn=1014,Kn=1015,jn=1016,Po=1017,Io=1018,Js=1020,Qc=35902,eh=35899,th=1021,nh=1022,En=1023,ii=1026,Wi=1027,ih=1028,Lo=1029,Xi=1030,Do=1031,No=1033,Xr=33776,qr=33777,Yr=33778,$r=33779,Uo=35840,Fo=35841,Bo=35842,Oo=35843,ko=36196,zo=37492,Ho=37496,Vo=37488,Go=37489,Zr=37490,Wo=37491,Xo=37808,qo=37809,Yo=37810,$o=37811,Zo=37812,Jo=37813,Ko=37814,jo=37815,Qo=37816,el=37817,tl=37818,nl=37819,il=37820,sl=37821,rl=36492,al=36494,ol=36495,ll=36283,cl=36284,Jr=36285,hl=36286,gr=2300,Za=2301,Oa=2302,Ec=2303,Tc=2400,Ac=2401,Rc=2402,ud=3200,ul=0,dd=1,Mi="",Qe="srgb",_r="srgb-linear",vr="linear",lt="srgb",ka=7680,fd=519,pd=512,md=513,gd=514,dl=515,_d=516,vd=517,fl=518,xd=519,yd=35044,sh=35048,rh="300 es",Xn=2e3,Bs=2001;ou={},Os=null;wd={[Ha]:Va,[Ga]:qa,[Wa]:Ya,[Us]:Xa,[Va]:Ha,[qa]:Ga,[Ya]:Wa,[Xa]:Us},si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],za=Math.PI/180,Ja=180/Math.PI;dh=class dh{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};dh.prototype.isVector2=!0;ge=dh,ri=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(d!==_||l!==u||c!==p||h!==g){let f=l*u+c*p+h*g+d*_;f<0&&(u=-u,p=-p,g=-g,_=-_,f=-f);let m=1-o;if(f<.9995){let b=Math.acos(f),E=Math.sin(b);m=Math.sin(m*b)/E,o=Math.sin(o*b)/E,l=l*m+u*o,c=c*m+p*o,h=h*m+g*o,d=d*m+_*o}else{l=l*m+u*o,c=c*m+p*o,h=h*m+g*o,d=d*m+_*o;let b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+h*d+l*p-c*u,e[t+1]=l*g+h*u+c*d-o*p,e[t+2]=c*g+h*p+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},fh=class fh{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(lu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(lu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ql.copy(this).projectOnVector(e),this.sub(Ql)}reflect(e){return this.sub(Ql.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};fh.prototype.isVector3=!0;P=fh,Ql=new P,lu=new ri,ph=class ph{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],_=s[0],f=s[3],m=s[6],b=s[1],E=s[4],y=s[7],S=s[2],w=s[5],A=s[8];return r[0]=a*_+o*b+l*S,r[3]=a*f+o*E+l*w,r[6]=a*m+o*y+l*A,r[1]=c*_+h*b+d*S,r[4]=c*f+h*E+d*w,r[7]=c*m+h*y+d*A,r[2]=u*_+p*b+g*S,r[5]=u*f+p*E+g*w,r[8]=u*m+p*y+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,p=c*r-a*l,g=t*d+n*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=d*_,e[1]=(s*c-h*n)*_,e[2]=(o*n-s*a)*_,e[3]=u*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ec.makeScale(e,t)),this}rotate(e){return ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ec.makeRotation(-e)),this}translate(e,t){return ss("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ec.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ph.prototype.isMatrix3=!0;Fe=ph,ec=new Fe,cu=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hu=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ze=vp();Ka=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ys===void 0&&(ys=xr("canvas")),ys.width=e.width,ys.height=e.height;let s=ys.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ys}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=xr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=xi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(xi(t[n]/255)*255):t[n]=xi(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},xp=0,ks=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:xp++}),this.uuid=Ks(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(tc(s[a].image)):r.push(tc(s[a]))}else r=tc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};yp=0,nc=new P,mn=class i extends si{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=ni,s=ni,r=Xt,a=li,o=En,l=wn,c=i.DEFAULT_ANISOTROPY,h=Mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=Ks(),this.name="",this.source=new ks(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ge(0,0),this.repeat=new ge(1,1),this.center=new ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nc).x}get height(){return this.source.getSize(nc).y}get depth(){return this.source.getSize(nc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Jc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fs:e.x=e.x-Math.floor(e.x);break;case ni:e.x=e.x<0?0:1;break;case $a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fs:e.y=e.y-Math.floor(e.y);break;case ni:e.y=e.y<0?0:1;break;case $a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=Jc;mn.DEFAULT_ANISOTROPY=1;mh=class mh{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],_=l[2],f=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+f)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,y=(p+1)/2,S=(m+1)/2,w=(h+u)/4,A=(d+_)/4,v=(g+f)/4;return E>y&&E>S?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=w/n,r=A/n):y>S?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=v/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=A/r,s=v/r),this.set(n,s,r,t),this}let b=Math.sqrt((f-g)*(f-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(b)<.001&&(b=1),this.x=(f-g)/b,this.y=(d-_)/b,this.z=(u-h)/b,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};mh.prototype.isVector4=!0;Ct=mh,ja=class extends si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new mn(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ks(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},bn=class extends ja{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},yr=class extends mn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Qa=class extends mn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Eo=class Eo{constructor(e,t,n,s,r,a,o,l,c,h,d,u,p,g,_,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,p,g,_,f)}set(e,t,n,s,r,a,o,l,c,h,d,u,p,g,_,f){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=p,m[7]=g,m[11]=_,m[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Eo().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/bs.setFromMatrixColumn(e,0).length(),r=1/bs.setFromMatrixColumn(e,1).length(),a=1/bs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=a*h,p=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,p=l*d,g=c*h,_=c*d;t[0]=u+_*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=_+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,p=l*d,g=c*h,_=c*d;t[0]=u-_*o,t[4]=-a*d,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=_-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,p=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=g*c-p,t[8]=u*c+_,t[1]=l*d,t[5]=_*c+u,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-u*d,t[8]=g*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+g,t[10]=u-_*d}else if(e.order==="XZY"){let u=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+_,t[5]=a*h,t[9]=p*d-g,t[2]=g*d-p,t[6]=o*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bp,e,Sp)}lookAt(e,t,n){let s=this.elements;return An.subVectors(e,t),An.lengthSq()===0&&(An.z=1),An.normalize(),Ci.crossVectors(n,An),Ci.lengthSq()===0&&(Math.abs(n.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),Ci.crossVectors(n,An)),Ci.normalize(),ha.crossVectors(An,Ci),s[0]=Ci.x,s[4]=ha.x,s[8]=An.x,s[1]=Ci.y,s[5]=ha.y,s[9]=An.y,s[2]=Ci.z,s[6]=ha.z,s[10]=An.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],_=n[6],f=n[10],m=n[14],b=n[3],E=n[7],y=n[11],S=n[15],w=s[0],A=s[4],v=s[8],T=s[12],I=s[1],L=s[5],N=s[9],z=s[13],R=s[2],D=s[6],k=s[10],V=s[14],K=s[3],q=s[7],j=s[11],te=s[15];return r[0]=a*w+o*I+l*R+c*K,r[4]=a*A+o*L+l*D+c*q,r[8]=a*v+o*N+l*k+c*j,r[12]=a*T+o*z+l*V+c*te,r[1]=h*w+d*I+u*R+p*K,r[5]=h*A+d*L+u*D+p*q,r[9]=h*v+d*N+u*k+p*j,r[13]=h*T+d*z+u*V+p*te,r[2]=g*w+_*I+f*R+m*K,r[6]=g*A+_*L+f*D+m*q,r[10]=g*v+_*N+f*k+m*j,r[14]=g*T+_*z+f*V+m*te,r[3]=b*w+E*I+y*R+S*K,r[7]=b*A+E*L+y*D+S*q,r[11]=b*v+E*N+y*k+S*j,r[15]=b*T+E*z+y*V+S*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],g=e[3],_=e[7],f=e[11],m=e[15],b=l*p-c*u,E=o*p-c*d,y=o*u-l*d,S=a*p-c*h,w=a*u-l*h,A=a*d-o*h;return t*(_*b-f*E+m*y)-n*(g*b-f*S+m*w)+s*(g*E-_*S+m*A)-r*(g*y-_*w+f*A)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],g=e[12],_=e[13],f=e[14],m=e[15],b=t*o-n*a,E=t*l-s*a,y=t*c-r*a,S=n*l-s*o,w=n*c-r*o,A=s*c-r*l,v=h*_-d*g,T=h*f-u*g,I=h*m-p*g,L=d*f-u*_,N=d*m-p*_,z=u*m-p*f,R=b*z-E*N+y*L+S*I-w*T+A*v;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/R;return e[0]=(o*z-l*N+c*L)*D,e[1]=(s*N-n*z-r*L)*D,e[2]=(_*A-f*w+m*S)*D,e[3]=(u*w-d*A-p*S)*D,e[4]=(l*I-a*z-c*T)*D,e[5]=(t*z-s*I+r*T)*D,e[6]=(f*y-g*A-m*E)*D,e[7]=(h*A-u*y+p*E)*D,e[8]=(a*N-o*I+c*v)*D,e[9]=(n*I-t*N-r*v)*D,e[10]=(g*w-_*y+m*b)*D,e[11]=(d*y-h*w-p*b)*D,e[12]=(o*T-a*L-l*v)*D,e[13]=(t*L-n*T+s*v)*D,e[14]=(_*E-g*S-f*b)*D,e[15]=(h*S-d*E+u*b)*D,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,p=r*h,g=r*d,_=a*h,f=a*d,m=o*d,b=l*c,E=l*h,y=l*d,S=n.x,w=n.y,A=n.z;return s[0]=(1-(_+m))*S,s[1]=(p+y)*S,s[2]=(g-E)*S,s[3]=0,s[4]=(p-y)*w,s[5]=(1-(u+m))*w,s[6]=(f+b)*w,s[7]=0,s[8]=(g+E)*A,s[9]=(f-b)*A,s[10]=(1-(u+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=bs.set(s[0],s[1],s[2]).length(),o=bs.set(s[4],s[5],s[6]).length(),l=bs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Hn.copy(this);let c=1/a,h=1/o,d=1/l;return Hn.elements[0]*=c,Hn.elements[1]*=c,Hn.elements[2]*=c,Hn.elements[4]*=h,Hn.elements[5]*=h,Hn.elements[6]*=h,Hn.elements[8]*=d,Hn.elements[9]*=d,Hn.elements[10]*=d,t.setFromRotationMatrix(Hn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Xn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),p=(n+s)/(n-s),g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===Xn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Bs)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Xn,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),p=-(n+s)/(n-s),g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===Xn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===Bs)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Eo.prototype.isMatrix4=!0;yt=Eo,bs=new P,Hn=new yt,bp=new P(0,0,0),Sp=new P(1,1,1),Ci=new P,ha=new P,An=new P,uu=new yt,du=new ri,yi=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return uu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(uu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return du.setFromEuler(this),this.setFromQuaternion(du,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};yi.DEFAULT_ORDER="XYZ";br=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Mp=0,fu=new P,Ss=new ri,fi=new yt,ua=new P,lr=new P,wp=new P,Ep=new ri,pu=new P(1,0,0),mu=new P(0,1,0),gu=new P(0,0,1),_u={type:"added"},Tp={type:"removed"},Ms={type:"childadded",child:null},ic={type:"childremoved",child:null},en=class i extends si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mp++}),this.uuid=Ks(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new yi,n=new ri,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new Fe}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new br,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ss.setFromAxisAngle(e,t),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(e,t){return Ss.setFromAxisAngle(e,t),this.quaternion.premultiply(Ss),this}rotateX(e){return this.rotateOnAxis(pu,e)}rotateY(e){return this.rotateOnAxis(mu,e)}rotateZ(e){return this.rotateOnAxis(gu,e)}translateOnAxis(e,t){return fu.copy(e).applyQuaternion(this.quaternion),this.position.add(fu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(pu,e)}translateY(e){return this.translateOnAxis(mu,e)}translateZ(e){return this.translateOnAxis(gu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ua.copy(e):ua.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),lr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(lr,ua,this.up):fi.lookAt(ua,lr,this.up),this.quaternion.setFromRotationMatrix(fi),s&&(fi.extractRotation(s.matrixWorld),Ss.setFromRotationMatrix(fi),this.quaternion.premultiply(Ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ue("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_u),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null):Ue("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Tp),ic.child=e,this.dispatchEvent(ic),ic.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_u),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,e,wp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,Ep,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};en.DEFAULT_UP=new P(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Ie=class extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ap={type:"move"},zs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,n),m=this._getHandJoint(c,_);f!==null&&(m.matrix.fromArray(f.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=f.radius),m.visible=f!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ap)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ie;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ed={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},da={h:0,s:0,l:0};he=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Qe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ze.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ze.workingColorSpace){if(e=_p(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=sc(a,r,e+1/3),this.g=sc(a,r,e),this.b=sc(a,r,e-1/3)}return Ze.colorSpaceToWorking(this,s),this}setStyle(e,t=Qe){function n(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Qe){let n=Ed[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xi(e.r),this.g=xi(e.g),this.b=xi(e.b),this}copyLinearToSRGB(e){return this.r=Ds(e.r),this.g=Ds(e.g),this.b=Ds(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Qe){return Ze.workingToColorSpace(cn.copy(this),e),Math.round(qe(cn.r*255,0,255))*65536+Math.round(qe(cn.g*255,0,255))*256+Math.round(qe(cn.b*255,0,255))}getHexString(e=Qe){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(cn.copy(this),t);let n=cn.r,s=cn.g,r=cn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(cn.copy(this),t),e.r=cn.r,e.g=cn.g,e.b=cn.b,e}getStyle(e=Qe){Ze.workingToColorSpace(cn.copy(this),e);let t=cn.r,n=cn.g,s=cn.b;return e!==Qe?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(da);let n=jl(Pi.h,da.h,t),s=jl(Pi.s,da.s,t),r=jl(Pi.l,da.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},cn=new he;he.NAMES=Ed;Sr=class extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vn=new P,pi=new P,rc=new P,mi=new P,ws=new P,Es=new P,vu=new P,ac=new P,oc=new P,lc=new P,cc=new Ct,hc=new Ct,uc=new Ct,vi=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vn.subVectors(e,t),s.cross(Vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vn.subVectors(s,t),pi.subVectors(n,t),rc.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(pi),l=Vn.dot(rc),c=pi.dot(pi),h=pi.dot(rc),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,p=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,mi.x),l.addScaledVector(a,mi.y),l.addScaledVector(o,mi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return cc.setScalar(0),hc.setScalar(0),uc.setScalar(0),cc.fromBufferAttribute(e,t),hc.fromBufferAttribute(e,n),uc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(cc,r.x),a.addScaledVector(hc,r.y),a.addScaledVector(uc,r.z),a}static isFrontFacing(e,t,n,s){return Vn.subVectors(n,t),pi.subVectors(e,t),Vn.cross(pi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),Vn.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ws.subVectors(s,n),Es.subVectors(r,n),ac.subVectors(e,n);let l=ws.dot(ac),c=Es.dot(ac);if(l<=0&&c<=0)return t.copy(n);oc.subVectors(e,s);let h=ws.dot(oc),d=Es.dot(oc);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ws,a);lc.subVectors(e,r);let p=ws.dot(lc),g=Es.dot(lc);if(g>=0&&p<=g)return t.copy(r);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Es,o);let f=h*g-p*d;if(f<=0&&d-h>=0&&p-g>=0)return vu.subVectors(r,s),o=(d-h)/(d-h+(p-g)),t.copy(s).addScaledVector(vu,o);let m=1/(f+_+u);return a=_*m,o=u*m,t.copy(n).addScaledVector(ws,a).addScaledVector(Es,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ni=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Gn):Gn.fromBufferAttribute(r,a),Gn.applyMatrix4(e.matrixWorld),this.expandByPoint(Gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fa.copy(n.boundingBox)),fa.applyMatrix4(e.matrixWorld),this.union(fa)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Gn),Gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(cr),pa.subVectors(this.max,cr),Ts.subVectors(e.a,cr),As.subVectors(e.b,cr),Rs.subVectors(e.c,cr),Ii.subVectors(As,Ts),Li.subVectors(Rs,As),es.subVectors(Ts,Rs);let t=[0,-Ii.z,Ii.y,0,-Li.z,Li.y,0,-es.z,es.y,Ii.z,0,-Ii.x,Li.z,0,-Li.x,es.z,0,-es.x,-Ii.y,Ii.x,0,-Li.y,Li.x,0,-es.y,es.x,0];return!dc(t,Ts,As,Rs,pa)||(t=[1,0,0,0,1,0,0,0,1],!dc(t,Ts,As,Rs,pa))?!1:(ma.crossVectors(Ii,Li),t=[ma.x,ma.y,ma.z],dc(t,Ts,As,Rs,pa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},gi=[new P,new P,new P,new P,new P,new P,new P,new P],Gn=new P,fa=new Ni,Ts=new P,As=new P,Rs=new P,Ii=new P,Li=new P,es=new P,cr=new P,pa=new P,ma=new P,ts=new P;Vt=new P,ga=new ge,Rp=0,Dt=class extends si{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Rp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yd,this.updateRanges=[],this.gpuType=Kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ga.fromBufferAttribute(this,t),ga.applyMatrix3(e),this.setXY(t,ga.x,ga.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix3(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=or(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=or(t,this.array)),t}setX(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=or(t,this.array)),t}setY(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=or(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=or(t,this.array)),t}setW(e,t){return this.normalized&&(t=yn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yn(t,this.array),n=yn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=yn(t,this.array),n=yn(n,this.array),s=yn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=yn(t,this.array),n=yn(n,this.array),s=yn(s,this.array),r=yn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}},Mr=class extends Dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},wr=class extends Dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},ze=class extends Dt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Cp=new Ni,hr=new P,fc=new P,Ui=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Cp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;hr.subVectors(e,this.center);let t=hr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(hr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(hr.copy(e.center).add(fc)),this.expandByPoint(hr.copy(e.center).sub(fc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Pp=0,Un=new yt,pc=new en,Cs=new P,Rn=new Ni,ur=new Ni,jt=new P,Je=class i extends si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pp++}),this.uuid=Ks(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mp(e)?wr:Mr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Fe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,t,n){return Un.makeTranslation(e,t,n),this.applyMatrix4(Un),this}scale(e,t,n){return Un.makeScale(e,t,n),this.applyMatrix4(Un),this}lookAt(e){return pc.lookAt(e),pc.updateMatrix(),this.applyMatrix4(pc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cs).negate(),this.translate(Cs.x,Cs.y,Cs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ze(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ue('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];ur.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(Rn.min,ur.min),Rn.expandByPoint(jt),jt.addVectors(Rn.max,ur.max),Rn.expandByPoint(jt)):(Rn.expandByPoint(ur.min),Rn.expandByPoint(ur.max))}Rn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(jt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)jt.fromBufferAttribute(o,c),l&&(Cs.fromBufferAttribute(e,c),jt.add(Cs)),s=Math.max(s,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ue('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ue("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Dt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new P,l[v]=new P;let c=new P,h=new P,d=new P,u=new ge,p=new ge,g=new ge,_=new P,f=new P;function m(v,T,I){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,T),d.fromBufferAttribute(n,I),u.fromBufferAttribute(r,v),p.fromBufferAttribute(r,T),g.fromBufferAttribute(r,I),h.sub(c),d.sub(c),p.sub(u),g.sub(u);let L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(L),f.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(L),o[v].add(_),o[T].add(_),o[I].add(_),l[v].add(f),l[T].add(f),l[I].add(f))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let v=0,T=b.length;v<T;++v){let I=b[v],L=I.start,N=I.count;for(let z=L,R=L+N;z<R;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let E=new P,y=new P,S=new P,w=new P;function A(v){S.fromBufferAttribute(s,v),w.copy(S);let T=o[v];E.copy(T),E.sub(S.multiplyScalar(S.dot(T))).normalize(),y.crossVectors(w,T);let L=y.dot(l[v])<0?-1:1;a.setXYZW(v,E.x,E.y,E.z,L)}for(let v=0,T=b.length;v<T;++v){let I=b[v],L=I.start,N=I.count;for(let z=L,R=L+N;z<R;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,d=new P;if(e)for(let u=0,p=e.count;u<p;u+=3){let g=e.getX(u+0),_=e.getX(u+1),f=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,f),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),p=0,g=0;for(let _=0,f=l.length;_<f;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let m=0;m<h;m++)u[g++]=c[p++]}return new Dt(u,h,d)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},mc=new P,Ip=new P,Lp=new Fe,Wn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=mc.subVectors(n,t).cross(Ip.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(mc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Lp.getNormalMatrix(e),s=this.coplanarPoint(mc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Dp=0,qn=class extends si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Ks(),this.name="",this.type="Material",this.blending=$s,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zc,this.blendDst=Hc,this.blendEquation=hs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new he(0,0,0),this.blendAlpha=0,this.depthFunc=Us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ka,this.stencilZFail=ka,this.stencilZPass=ka,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new he().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Wn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ge().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ge().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},_i=new P,gc=new P,_a=new P,va=new P,Hs=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_i)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=_i.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_i.copy(this.origin).addScaledVector(this.direction,t),_i.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){gc.copy(e).add(t).multiplyScalar(.5),_a.copy(t).sub(e).normalize(),va.copy(this.origin).sub(gc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(_a),o=va.dot(this.direction),l=-va.dot(_a),c=va.lengthSq(),h=Math.abs(1-a*a),d,u,p,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let _=1/h;d*=_,u*=_,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(gc).addScaledVector(_a,u),p}intersectSphere(e,t){if(e.radius<0)return null;_i.subVectors(e.center,this.origin);let n=_i.dot(this.direction),s=_i.dot(_i)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,_i)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,p=e.z-a.z,g=t.x-a.x,_=t.y-a.y,f=t.z-a.z,m=n.x-a.x,b=n.y-a.y,E=n.z-a.z,y=Math.abs(l),S=Math.abs(c),w=Math.abs(h),A,v,T,I,L,N,z,R,D,k,V,K;if(y>=S&&y>=w?(T=l,N=d,D=g,K=m,l>=0?(A=c,v=h,I=u,L=p,z=_,R=f,k=b,V=E):(A=h,v=c,I=p,L=u,z=f,R=_,k=E,V=b)):S>=w?(T=c,N=u,D=_,K=b,c>=0?(A=h,v=l,I=p,L=d,z=f,R=g,k=E,V=m):(A=l,v=h,I=d,L=p,z=g,R=f,k=m,V=E)):(T=h,N=p,D=f,K=E,h>=0?(A=l,v=c,I=d,L=u,z=g,R=_,k=m,V=b):(A=c,v=l,I=u,L=d,z=_,R=g,k=b,V=m)),T===0)return null;let q=A/T,j=v/T,te=1/T,we=I-q*N,Ee=L-j*N,gt=z-q*D,Ke=R-j*D,tt=k-q*K,Z=V-j*K,ne=tt*Ke-Z*gt,be=we*Z-Ee*tt,Oe=gt*Ee-Ke*we;if(s){if(ne<0||be<0||Oe<0)return null}else if((ne<0||be<0||Oe<0)&&(ne>0||be>0||Oe>0))return null;let ve=ne+be+Oe;if(ve===0)return null;let Ge=te*(ne*N+be*D+Oe*K);return(ve>0?Ge<0:Ge>0)?null:this.at(Ge/ve,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Pt=class extends qn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Vc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},xu=new yt,ns=new Hs,xa=new Ui,yu=new P,ya=new P,ba=new P,Sa=new P,_c=new P,Ma=new P,bu=new P,wa=new P,ye=class extends en{constructor(e=new Je,t=new Pt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Ma.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(_c.fromBufferAttribute(d,e),a?Ma.addScaledVector(_c,h):Ma.addScaledVector(_c.sub(t),h))}t.add(Ma)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xa.copy(n.boundingSphere),xa.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(xa.containsPoint(ns.origin)===!1&&(ns.intersectSphere(xa,yu)===null||ns.origin.distanceToSquared(yu)>(e.far-e.near)**2))&&(xu.copy(r).invert(),ns.copy(e.ray).applyMatrix4(xu),!(n.boundingBox!==null&&ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){let f=u[g],m=a[f.materialIndex],b=Math.max(f.start,p.start),E=Math.min(o.count,Math.min(f.start+f.count,p.start+p.count));for(let y=b,S=E;y<S;y+=3){let w=o.getX(y),A=o.getX(y+1),v=o.getX(y+2);s=Ea(this,m,e,n,c,h,d,w,A,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let f=g,m=_;f<m;f+=3){let b=o.getX(f),E=o.getX(f+1),y=o.getX(f+2);s=Ea(this,a,e,n,c,h,d,b,E,y),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){let f=u[g],m=a[f.materialIndex],b=Math.max(f.start,p.start),E=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));for(let y=b,S=E;y<S;y+=3){let w=y,A=y+1,v=y+2;s=Ea(this,m,e,n,c,h,d,w,A,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let f=g,m=_;f<m;f+=3){let b=f,E=f+1,y=f+2;s=Ea(this,a,e,n,c,h,d,b,E,y),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};Vs=class extends mn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Qt,h=Qt,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ai=class extends Dt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},is=new Ui,Up=new ge(.5,.5),Ta=new P,Gs=class{constructor(e=new Wn,t=new Wn,n=new Wn,s=new Wn,r=new Wn,a=new Wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Xn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],p=r[7],g=r[8],_=r[9],f=r[10],m=r[11],b=r[12],E=r[13],y=r[14],S=r[15];if(s[0].setComponents(c-a,p-h,m-g,S-b).normalize(),s[1].setComponents(c+a,p+h,m+g,S+b).normalize(),s[2].setComponents(c+o,p+d,m+_,S+E).normalize(),s[3].setComponents(c-o,p-d,m-_,S-E).normalize(),n)s[4].setComponents(l,u,f,y).normalize(),s[5].setComponents(c-l,p-u,m-f,S-y).normalize();else if(s[4].setComponents(c-l,p-u,m-f,S-y).normalize(),t===Xn)s[5].setComponents(c+l,p+u,m+f,S+y).normalize();else if(t===Bs)s[5].setComponents(l,u,f,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){is.center.set(0,0,0);let t=Up.distanceTo(e.center);return is.radius=.7071067811865476+t,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ta.x=s.normal.x>0?e.max.x:e.min.x,Ta.y=s.normal.y>0?e.max.y:e.min.y,Ta.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ta)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Yn=class extends qn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new he(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},eo=new P,to=new P,Su=new yt,dr=new Hs,Aa=new Ui,vc=new P,Mu=new P,Fn=class extends en{constructor(e=new Je,t=new Yn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)eo.fromBufferAttribute(t,s-1),to.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=eo.distanceTo(to);e.setAttribute("lineDistance",new ze(n,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Aa.copy(n.boundingSphere),Aa.applyMatrix4(s),Aa.radius+=r,e.ray.intersectsSphere(Aa)===!1)return;Su.copy(s).invert(),dr.copy(e.ray).applyMatrix4(Su);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=p,f=g-1;_<f;_+=c){let m=h.getX(_),b=h.getX(_+1),E=Ra(this,e,dr,l,m,b,_);E&&t.push(E)}if(this.isLineLoop){let _=h.getX(g-1),f=h.getX(p),m=Ra(this,e,dr,l,_,f,g-1);m&&t.push(m)}}else{let p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=p,f=g-1;_<f;_+=c){let m=Ra(this,e,dr,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){let _=Ra(this,e,dr,l,g-1,p,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};wu=new P,Eu=new P,Bn=class extends Fn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)wu.fromBufferAttribute(t,s),Eu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+wu.distanceTo(Eu);e.setAttribute("lineDistance",new ze(n,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},rs=class extends qn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new he(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Tu=new yt,Cc=new Hs,Ca=new Ui,Pa=new P,Fi=class extends en{constructor(e=new Je,t=new rs){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ca.copy(n.boundingSphere),Ca.applyMatrix4(s),Ca.radius+=r,e.ray.intersectsSphere(Ca)===!1)return;Tu.copy(s).invert(),Cc.copy(e.ray).applyMatrix4(Tu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=u,_=p;g<_;g++){let f=c.getX(g);Pa.fromBufferAttribute(d,f),Au(Pa,f,l,s,e,t,this)}}else{let u=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let g=u,_=p;g<_;g++)Pa.fromBufferAttribute(d,g),Au(Pa,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};Er=class extends mn{constructor(e=[],t=Gi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},tn=class extends mn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Bi=class extends mn{constructor(e,t,n=Jn,s,r,a,o=Qt,l=Qt,c,h=ii,d=1){if(h!==ii&&h!==Wi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ks(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},no=class extends Bi{constructor(e,t=Jn,n=Gi,s,r,a=Qt,o=Qt,l,c=ii){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Tr=class extends mn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Sn=class i extends Je{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ze(c,3)),this.setAttribute("normal",new ze(h,3)),this.setAttribute("uv",new ze(d,2));function g(_,f,m,b,E,y,S,w,A,v,T){let I=y/A,L=S/v,N=y/2,z=S/2,R=w/2,D=A+1,k=v+1,V=0,K=0,q=new P;for(let j=0;j<k;j++){let te=j*L-z;for(let we=0;we<D;we++){let Ee=we*I-N;q[_]=Ee*b,q[f]=te*E,q[m]=R,c.push(q.x,q.y,q.z),q[_]=0,q[f]=0,q[m]=w>0?1:-1,h.push(q.x,q.y,q.z),d.push(we/A),d.push(1-j/v),V+=1}}for(let j=0;j<v;j++)for(let te=0;te<A;te++){let we=u+te+D*j,Ee=u+te+D*(j+1),gt=u+(te+1)+D*(j+1),Ke=u+(te+1)+D*j;l.push(we,Ee,Ke),l.push(Ee,gt,Ke),K+=6}o.addGroup(p,K,T),p+=K,u+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},as=class i extends Je{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],p=[],g=0,_=[],f=n/2,m=0;b(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new ze(d,3)),this.setAttribute("normal",new ze(u,3)),this.setAttribute("uv",new ze(p,2));function b(){let y=new P,S=new P,w=0,A=(t-e)/n;for(let v=0;v<=r;v++){let T=[],I=v/r,L=I*(t-e)+e;for(let N=0;N<=s;N++){let z=N/s,R=z*l+o,D=Math.sin(R),k=Math.cos(R);S.x=L*D,S.y=-I*n+f,S.z=L*k,d.push(S.x,S.y,S.z),y.set(D,A,k).normalize(),u.push(y.x,y.y,y.z),p.push(z,1-I),T.push(g++)}_.push(T)}for(let v=0;v<s;v++)for(let T=0;T<r;T++){let I=_[T][v],L=_[T+1][v],N=_[T+1][v+1],z=_[T][v+1];(e>0||T!==0)&&(h.push(I,L,z),w+=3),(t>0||T!==r-1)&&(h.push(L,N,z),w+=3)}c.addGroup(m,w,0),m+=w}function E(y){let S=g,w=new ge,A=new P,v=0,T=y===!0?e:t,I=y===!0?1:-1;for(let N=1;N<=s;N++)d.push(0,f*I,0),u.push(0,I,0),p.push(.5,.5),g++;let L=g;for(let N=0;N<=s;N++){let R=N/s*l+o,D=Math.cos(R),k=Math.sin(R);A.x=T*k,A.y=f*I,A.z=T*D,d.push(A.x,A.y,A.z),u.push(0,I,0),w.x=D*.5+.5,w.y=k*.5*I+.5,p.push(w.x,w.y),g++}for(let N=0;N<s;N++){let z=S+N,R=L+N;y===!0?h.push(R,R+1,z):h.push(R+1,R,z),v+=3}c.addGroup(m,v,y===!0?1:2),m+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ia=new P,La=new P,xc=new P,Da=new vi,On=class extends Je{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let s=Math.pow(10,4),r=Math.cos(za*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},p=[];for(let g=0;g<l;g+=3){a?(c[0]=a.getX(g),c[1]=a.getX(g+1),c[2]=a.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:f,c:m}=Da;if(_.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),m.fromBufferAttribute(o,c[2]),Da.getNormal(xc),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,d[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let b=0;b<3;b++){let E=(b+1)%3,y=d[b],S=d[E],w=Da[h[b]],A=Da[h[E]],v=`${y}_${S}`,T=`${S}_${y}`;T in u&&u[T]?(xc.dot(u[T].normal)<=r&&(p.push(w.x,w.y,w.z),p.push(A.x,A.y,A.z)),u[T]=null):v in u||(u[v]={index0:c[b],index1:c[E],normal:xc.clone()})}}for(let g in u)if(u[g]){let{index0:_,index1:f}=u[g];Ia.fromBufferAttribute(o,_),La.fromBufferAttribute(o,f),p.push(Ia.x,Ia.y,Ia.z),p.push(La.x,La.y,La.z)}this.setAttribute("position",new ze(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Cn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Le("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],u=n[s+1]-h,p=(a-h)/u;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new ge:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],a=[],o=new P,l=new yt;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(qe(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(qe(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Oi=class extends Cn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ge){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,p=c-this.aY;l=u*h-p*d+this.aX,c=u*d+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},io=class extends Oi{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};Ru=new P,Cu=new P,yc=new oh,bc=new oh,Sc=new oh,$n=class extends Cn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Cu.subVectors(s[0],s[1]).add(s[0]),c=Cu);let d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ru.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ru),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),p),_=Math.pow(d.distanceToSquared(u),p),f=Math.pow(u.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),yc.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,g,_,f),bc.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,g,_,f),Sc.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,g,_,f)}else this.curveType==="catmullrom"&&(yc.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),bc.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Sc.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(yc.calc(l),bc.calc(l),Sc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};Ar=class extends Cn{constructor(e=new ge,t=new ge,n=new ge,s=new ge){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ge){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(mr(e,s.x,r.x,a.x,o.x),mr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},so=class extends Cn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(mr(e,s.x,r.x,a.x,o.x),mr(e,s.y,r.y,a.y,o.y),mr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Rr=class extends Cn{constructor(e=new ge,t=new ge){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ge){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ge){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ro=class extends Cn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Cr=class extends Cn{constructor(e=new ge,t=new ge,n=new ge){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ge){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(pr(e,s.x,r.x,a.x),pr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ao=class extends Cn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(pr(e,s.x,r.x,a.x),pr(e,s.y,r.y,a.y),pr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Pr=class extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ge){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Pu(o,l.x,c.x,h.x,d.x),Pu(o,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ge().fromArray(s))}return this}},Iu=Object.freeze({__proto__:null,ArcCurve:io,CatmullRomCurve3:$n,CubicBezierCurve:Ar,CubicBezierCurve3:so,EllipseCurve:Oi,LineCurve:Rr,LineCurve3:ro,QuadraticBezierCurve:Cr,QuadraticBezierCurve3:ao,SplineCurve:Pr}),oo=class extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Iu[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Iu[s.type]().fromJSON(s))}return this}},Ir=class extends oo{constructor(e){super(),this.type="Path",this.currentPoint=new ge,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Rr(this.currentPoint.clone(),new ge(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Cr(this.currentPoint.clone(),new ge(e,t),new ge(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new Ar(this.currentPoint.clone(),new ge(e,t),new ge(n,s),new ge(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Pr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Oi(e,t,n,s,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ws=class extends Ir{constructor(e){super(e),this.uuid=Ks(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Ir().fromJSON(s))}return this}};Lc=class{static triangulate(e,t,n=2){return Gp(e,t,n)}},Ns=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Du(e),Nu(n,e);let a=e.length;t.forEach(Du);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Nu(n,t[l]);let o=Lc.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};Tt=class i extends Je{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,p=[],g=[],_=[],f=[];for(let m=0;m<h;m++){let b=m*u-a;for(let E=0;E<c;E++){let y=E*d-r;g.push(y,-b,0),_.push(0,0,1),f.push(E/o),f.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<o;b++){let E=b+c*m,y=b+c*(m+1),S=b+1+c*(m+1),w=b+1+c*m;p.push(E,y,w),p.push(y,S,w)}this.setIndex(p),this.setAttribute("position",new ze(g,3)),this.setAttribute("normal",new ze(_,3)),this.setAttribute("uv",new ze(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Ur=class i extends Je{constructor(e=new Ws([new ge(0,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ze(s,3)),this.setAttribute("normal",new ze(r,3)),this.setAttribute("uv",new ze(a,2));function c(h){let d=s.length/3,u=h.extractPoints(t),p=u.shape,g=u.holes;Ns.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,m=g.length;f<m;f++){let b=g[f];Ns.isClockWise(b)===!0&&(g[f]=b.reverse())}let _=Ns.triangulateShape(p,g);for(let f=0,m=g.length;f<m;f++){let b=g[f];p=p.concat(b)}for(let f=0,m=p.length;f<m;f++){let b=p[f];s.push(b.x,b.y,0),r.push(0,0,1),a.push(b.x,b.y)}for(let f=0,m=_.length;f<m;f++){let b=_[f],E=b[0]+d,y=b[1]+d,S=b[2]+d;n.push(E,y,S),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return am(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};bi=class i extends Je{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new P,u=new P,p=[],g=[],_=[],f=[];for(let m=0;m<=n;m++){let b=[],E=m/n,y=a+E*o,S=e*Math.cos(y),w=Math.sqrt(e*e-S*S),A=0;m===0&&a===0?A=.5/t:m===n&&l===Math.PI&&(A=-.5/t);for(let v=0;v<=t;v++){let T=v/t,I=s+T*r;d.x=-w*Math.cos(I),d.y=S,d.z=w*Math.sin(I),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),f.push(T+A,1-E),b.push(c++)}h.push(b)}for(let m=0;m<n;m++)for(let b=0;b<t;b++){let E=h[m][b+1],y=h[m][b],S=h[m+1][b],w=h[m+1][b+1];(m!==0||a>0)&&p.push(E,y,w),(m!==n-1||l<Math.PI)&&p.push(y,S,w)}this.setIndex(p),this.setAttribute("position",new ze(g,3)),this.setAttribute("normal",new ze(_,3)),this.setAttribute("uv",new ze(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Fr=class i extends Je{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new P,p=new P,g=new P;for(let _=0;_<=n;_++){let f=a+_/n*o;for(let m=0;m<=s;m++){let b=m/s*r;p.x=(e+t*Math.cos(f))*Math.cos(b),p.y=(e+t*Math.cos(f))*Math.sin(b),p.z=t*Math.sin(f),c.push(p.x,p.y,p.z),u.x=e*Math.cos(b),u.y=e*Math.sin(b),g.subVectors(p,u).normalize(),h.push(g.x,g.y,g.z),d.push(m/s),d.push(_/n)}}for(let _=1;_<=n;_++)for(let f=1;f<=s;f++){let m=(s+1)*_+f-1,b=(s+1)*(_-1)+f-1,E=(s+1)*(_-1)+f,y=(s+1)*_+f;l.push(m,b,y),l.push(b,E,y)}this.setIndex(l),this.setAttribute("position",new ze(c,3)),this.setAttribute("normal",new ze(h,3)),this.setAttribute("uv",new ze(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}},Br=class extends qn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new he(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};Pd={clone:ds,merge:un},lm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,At=class extends qn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lm,this.fragmentShader=cm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ds(e.uniforms),this.uniformsGroups=om(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new he().setHex(s.value);break;case"v2":this.uniforms[n].value=new ge().fromArray(s.value);break;case"v3":this.uniforms[n].value=new P().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Ct().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Fe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new yt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},lo=class extends At{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Si=class extends qn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ul,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},co=class extends qn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ud,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ho=class extends qn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Mn=class extends Yn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};ki=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},uo=class extends ki{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Tc,endingEnd:Tc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ac:r=e,o=2*t-n;break;case Rc:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ac:a=e,l=2*n-t;break;case Rc:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),_=g*g,f=_*g,m=-u*f+2*u*_-u*g,b=(1+u)*f+(-1.5-2*u)*_+(-.5+u)*g+1,E=(-1-p)*f+(1.5+p)*_+.5*g,y=p*f-p*_;for(let S=0;S!==o;++S)r[S]=m*a[h+S]+b*a[c+S]+E*a[l+S]+y*a[d+S];return r}},fo=class extends ki{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},po=class extends ki{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},mo=class extends ki{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-t)/(s-t),_=1-g;for(let f=0;f!==o;++f)r[f]=a[c+f]*_+a[l+f]*g;return r}let u=o*2,p=e-1;for(let g=0;g!==o;++g){let _=a[c+g],f=a[l+g],m=p*u+g*2,b=d[m],E=d[m+1],y=e*u+g*2,S=h[y],w=h[y+1],A=um(n,t,b,S,s);r[g]=Id(A,_,E,w,f)}return r}};Pn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ps(t,this.TimeBufferType),this.values=Ps(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ps(e.times,Array),values:Ps(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Mc(e.settings)&&(n.settings={inTangents:Ps(e.settings.inTangents,Array),outTangents:Ps(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new po(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new fo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new mo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case gr:t=this.InterpolantFactoryMethodDiscrete;break;case Za:t=this.InterpolantFactoryMethodLinear;break;case Oa:t=this.InterpolantFactoryMethodSmooth;break;case Ec:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Le("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return gr;case this.InterpolantFactoryMethodLinear:return Za;case this.InterpolantFactoryMethodSmooth:return Oa;case this.InterpolantFactoryMethodBezier:return Ec}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Mc(this.settings)&&(Fu(this.settings.inTangents,e),Fu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ue("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ue("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ue("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ue("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&gp(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ue("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Oa,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,u=d-n,p=d+n;for(let g=0;g!==n;++g){let _=t[d+g];if(_!==t[u+g]||_!==t[p+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,u=a*n;for(let p=0;p!==n;++p)t[u+p]=t[d+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Mc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};Pn.prototype.ValueTypeName="";Pn.prototype.TimeBufferType=Float32Array;Pn.prototype.ValueBufferType=Float32Array;Pn.prototype.DefaultInterpolation=Za;zi=class extends Pn{constructor(e,t,n){super(e,t,n)}};zi.prototype.ValueTypeName="bool";zi.prototype.ValueBufferType=Array;zi.prototype.DefaultInterpolation=gr;zi.prototype.InterpolantFactoryMethodLinear=void 0;zi.prototype.InterpolantFactoryMethodSmooth=void 0;go=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};go.prototype.ValueTypeName="color";_o=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};_o.prototype.ValueTypeName="number";vo=class extends ki{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)ri.slerpFlat(r,0,a,c-o,a,c,l);return r}},Or=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new vo(this.times,this.values,this.getValueSize(),e)}};Or.prototype.ValueTypeName="quaternion";Or.prototype.InterpolantFactoryMethodSmooth=void 0;Hi=class extends Pn{constructor(e,t,n){super(e,t,n)}};Hi.prototype.ValueTypeName="string";Hi.prototype.ValueBufferType=Array;Hi.prototype.DefaultInterpolation=gr;Hi.prototype.InterpolantFactoryMethodLinear=void 0;Hi.prototype.InterpolantFactoryMethodSmooth=void 0;xo=class extends Pn{constructor(e,t,n,s){super(e,t,n,s)}};xo.prototype.ValueTypeName="vector";yo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Ld=new yo,bo=class{constructor(e){this.manager=e!==void 0?e:Ld,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};bo.DEFAULT_MATERIAL_NAME="__DEFAULT";kr=class extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new he(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},zr=class extends kr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.groundColor=new he(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},wc=new yt,Bu=new P,Ou=new P,So=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ge(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gs,this._frameExtents=new ge(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Bu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bu),Ou.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ou),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){wc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(wc,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Bs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(wc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Fa=new P,Ba=new ri,ti=new P,Hr=class extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Fa,Ba,ti),ti.x===1&&ti.y===1&&ti.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fa,Ba,ti.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Fa,Ba,ti),ti.x===1&&ti.y===1&&ti.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fa,Ba,ti.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Di=new P,ku=new ge,zu=new ge,hn=class extends Hr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ja*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(za*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ja*2*Math.atan(Math.tan(za*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,ku,zu),t.subVectors(zu,ku)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(za*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},qs=class extends Hr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Dc=class extends So{constructor(){super(new qs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Vr=class extends kr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new Dc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ls=class extends Je{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Is=-90,Ls=1,Mo=class extends en{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new hn(Is,Ls,e,t);s.layers=this.layers,this.add(s);let r=new hn(Is,Ls,e,t);r.layers=this.layers,this.add(r);let a=new hn(Is,Ls,e,t);a.layers=this.layers,this.add(a);let o=new hn(Is,Ls,e,t);o.layers=this.layers,this.add(o);let l=new hn(Is,Ls,e,t);l.layers=this.layers,this.add(l);let c=new hn(Is,Ls,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Bs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},wo=class extends hn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ch="\\[\\]\\.:\\/",dm=new RegExp("["+ch+"]","g"),hh="[^"+ch+"]",fm="[^"+ch.replace("\\.","")+"]",pm=/((?:WC+[\/:])*)/.source.replace("WC",hh),mm=/(WCOD+)?/.source.replace("WCOD",fm),gm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",hh),_m=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",hh),vm=new RegExp("^"+pm+mm+gm+_m+"$"),xm=["material","materials","bones","map"],Nc=class{constructor(e,t,n){let s=n||Et.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Et=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(dm,"")}static parseTrackName(e){let t=vm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);xm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Le("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ue("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ue("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ue("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ue("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ue("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Ue("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Et.Composite=Nc;Et.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Et.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Et.prototype.GetterByBindingType=[Et.prototype._getValue_direct,Et.prototype._getValue_array,Et.prototype._getValue_arrayElement,Et.prototype._getValue_toArray];Et.prototype.SetterByBindingTypeAndVersioning=[[Et.prototype._setValue_direct,Et.prototype._setValue_direct_setNeedsUpdate,Et.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_array,Et.prototype._setValue_array_setNeedsUpdate,Et.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_arrayElement,Et.prototype._setValue_arrayElement_setNeedsUpdate,Et.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_fromArray,Et.prototype._setValue_fromArray_setNeedsUpdate,Et.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];Hx=new Float32Array(1),gh=class gh{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};gh.prototype.isMatrix2=!0;Uc=gh;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186")});function ef(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Mm(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){let g=d[u],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){let _=d[p];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}function r_(i,e,t,n,s,r){let a=new he(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function p(b){let E=b.isScene===!0?b.background:null;if(E&&E.isTexture){let y=b.backgroundBlurriness>0;E=e.get(E,y)}return E}function g(b){let E=!1,y=p(b);y===null?f(a,o):y&&y.isColor&&(f(y,1),E=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(b,E){let y=p(E);y&&(y.isCubeTexture||y.mapping===Gr)?(c===void 0&&(c=new ye(new Sn(1,1,1),new At({name:"BackgroundCubeMaterial",uniforms:ds(hi.backgroundCube.uniforms),vertexShader:hi.backgroundCube.vertexShader,fragmentShader:hi.backgroundCube.fragmentShader,side:gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(s_.makeRotationFromEuler(E.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(tf),c.material.toneMapped=Ze.getTransfer(y.colorSpace)!==lt,(h!==y||d!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ye(new Tt(2,2),new At({name:"BackgroundMaterial",uniforms:ds(hi.background.uniforms),vertexShader:hi.background.vertexShader,fragmentShader:hi.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Ze.getTransfer(y.colorSpace)!==lt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function f(b,E){b.getRGB(pl,lh(i)),t.buffers.color.setClear(pl.r,pl.g,pl.b,E,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,E=1){a.set(b),o=E,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,f(a,o)},render:g,addToRenderList:_,dispose:m}}function a_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(L,N,z,R,D){let k=!1,V=d(L,R,z,N);r!==V&&(r=V,c(r.object)),k=p(L,R,z,D),k&&g(L,R,z,D),D!==null&&e.update(D,i.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,y(L,N,z,R),D!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function l(){return i.createVertexArray()}function c(L){return i.bindVertexArray(L)}function h(L){return i.deleteVertexArray(L)}function d(L,N,z,R){let D=R.wireframe===!0,k=n[N.id];k===void 0&&(k={},n[N.id]=k);let V=L.isInstancedMesh===!0?L.id:0,K=k[V];K===void 0&&(K={},k[V]=K);let q=K[z.id];q===void 0&&(q={},K[z.id]=q);let j=q[D];return j===void 0&&(j=u(l()),q[D]=j),j}function u(L){let N=[],z=[],R=[];for(let D=0;D<t;D++)N[D]=0,z[D]=0,R[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:z,attributeDivisors:R,object:L,attributes:{},index:null}}function p(L,N,z,R){let D=r.attributes,k=N.attributes,V=0,K=z.getAttributes();for(let q in K)if(K[q].location>=0){let te=D[q],we=k[q];if(we===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(we=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(we=L.instanceColor)),te===void 0||te.attribute!==we||we&&te.data!==we.data)return!0;V++}return r.attributesNum!==V||r.index!==R}function g(L,N,z,R){let D={},k=N.attributes,V=0,K=z.getAttributes();for(let q in K)if(K[q].location>=0){let te=k[q];te===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(te=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(te=L.instanceColor));let we={};we.attribute=te,te&&te.data&&(we.data=te.data),D[q]=we,V++}r.attributes=D,r.attributesNum=V,r.index=R}function _(){let L=r.newAttributes;for(let N=0,z=L.length;N<z;N++)L[N]=0}function f(L){m(L,0)}function m(L,N){let z=r.newAttributes,R=r.enabledAttributes,D=r.attributeDivisors;z[L]=1,R[L]===0&&(i.enableVertexAttribArray(L),R[L]=1),D[L]!==N&&(i.vertexAttribDivisor(L,N),D[L]=N)}function b(){let L=r.newAttributes,N=r.enabledAttributes;for(let z=0,R=N.length;z<R;z++)N[z]!==L[z]&&(i.disableVertexAttribArray(z),N[z]=0)}function E(L,N,z,R,D,k,V){V===!0?i.vertexAttribIPointer(L,N,z,D,k):i.vertexAttribPointer(L,N,z,R,D,k)}function y(L,N,z,R){_();let D=R.attributes,k=z.getAttributes(),V=N.defaultAttributeValues;for(let K in k){let q=k[K];if(q.location>=0){let j=D[K];if(j===void 0&&(K==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),K==="instanceColor"&&L.instanceColor&&(j=L.instanceColor)),j!==void 0){let te=j.normalized,we=j.itemSize,Ee=e.get(j);if(Ee===void 0)continue;let gt=Ee.buffer,Ke=Ee.type,tt=Ee.bytesPerElement,Z=Ke===i.INT||Ke===i.UNSIGNED_INT||j.gpuType===Co;if(j.isInterleavedBufferAttribute){let ne=j.data,be=ne.stride,Oe=j.offset;if(ne.isInstancedInterleavedBuffer){for(let ve=0;ve<q.locationSize;ve++)m(q.location+ve,ne.meshPerAttribute);L.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ve=0;ve<q.locationSize;ve++)f(q.location+ve);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let ve=0;ve<q.locationSize;ve++)E(q.location+ve,we/q.locationSize,Ke,te,be*tt,(Oe+we/q.locationSize*ve)*tt,Z)}else{if(j.isInstancedBufferAttribute){for(let ne=0;ne<q.locationSize;ne++)m(q.location+ne,j.meshPerAttribute);L.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ne=0;ne<q.locationSize;ne++)f(q.location+ne);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let ne=0;ne<q.locationSize;ne++)E(q.location+ne,we/q.locationSize,Ke,te,we*tt,we/q.locationSize*ne*tt,Z)}}else if(V!==void 0){let te=V[K];if(te!==void 0)switch(te.length){case 2:i.vertexAttrib2fv(q.location,te);break;case 3:i.vertexAttrib3fv(q.location,te);break;case 4:i.vertexAttrib4fv(q.location,te);break;default:i.vertexAttrib1fv(q.location,te)}}}}b()}function S(){T();for(let L in n){let N=n[L];for(let z in N){let R=N[z];for(let D in R){let k=R[D];for(let V in k)h(k[V].object),delete k[V];delete R[D]}}delete n[L]}}function w(L){if(n[L.id]===void 0)return;let N=n[L.id];for(let z in N){let R=N[z];for(let D in R){let k=R[D];for(let V in k)h(k[V].object),delete k[V];delete R[D]}}delete n[L.id]}function A(L){for(let N in n){let z=n[N];for(let R in z){let D=z[R];if(D[L.id]===void 0)continue;let k=D[L.id];for(let V in k)h(k[V].object),delete k[V];delete D[L.id]}}}function v(L){for(let N in n){let z=n[N],R=L.isInstancedMesh===!0?L.id:0,D=z[R];if(D!==void 0){for(let k in D){let V=D[k];for(let K in V)h(V[K].object),delete V[K];delete D[k]}delete z[R],Object.keys(z).length===0&&delete n[N]}}}function T(){I(),a=!0,r!==s&&(r=s,c(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:I,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:f,disableUnusedAttributes:b}}function o_(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let p=0;p<h;p++)u+=c[p];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function l_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==En&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let v=A===jn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==wn&&A!==Kn&&!v&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Le("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:f,maxAttributes:m,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:y,maxSamples:S,samples:w}}function c_(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Wn,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||n!==0||s;return s=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){let g=d.clippingPlanes,_=d.clipIntersection,f=d.clipShadows,m=i.get(d);if(!s||g===null||g.length===0||r&&!f)r?h(null):c();else{let b=r?0:n,E=b*4,y=m.clippingState||null;l.value=y,y=h(g,u,E,p);for(let S=0;S!==E;++S)y[S]=t[S];m.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,p,g){let _=d!==null?d.length:0,f=null;if(_!==0){if(f=l.value,g!==!0||f===null){let m=p+_*4,b=u.matrixWorldInverse;o.getNormalMatrix(b),(f===null||f.length<m)&&(f=new Float32Array(m));for(let E=0,y=p;E!==_;++E,y+=4)a.copy(d[E]).applyMatrix4(b,o),a.normal.toArray(f,y),f[y+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,f}}function p_(i){let e=[],t=[],n=i,s=i-Qs+1+h_;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,p=3,g=new Float32Array(p*u*d),_=new Float32Array(p*u*d);for(let m=0;m<d;m++){let b=m%3*2/3-1,E=m>2?0:-1,y=[b,E,0,b+2/3,E,0,b+2/3,E+1,0,b,E,0,b+2/3,E+1,0,b,E+1,0];g.set(y,p*u*m);for(let S=0;S<u;S++){let w=h[S*2]*2-1,A=h[S*2+1]*2-1;m===0?fs.set(1,A,w):m===1?fs.set(-w,1,-A):m===2?fs.set(-w,A,1):m===3?fs.set(-1,A,-w):m===4?fs.set(-w,-1,A):fs.set(w,A,-1),fs.toArray(_,(m*u+S)*p)}}let f=new Je;f.setAttribute("position",new Dt(g,p)),f.setAttribute("outputDirection",new Dt(_,p)),t.push(new ye(f,null)),n>Qs&&n--}return{lodMeshes:t,sizeLods:e}}function Nd(i,e,t){let n=new bn(i,e,t);return n.texture.mapping=Gr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function js(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function m_(i,e,t){return new At({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:d_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:xl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function g_(i,e,t){return new At({name:"SphericalGaussianBlur",defines:{SAMPLES:u_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:xl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

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

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function Ud(){return new At({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function Fd(){return new At({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function xl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}function __(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,p=!1){return u==null?null:p?a(u):r(u)}function r(u){if(u&&u.isTexture){let p=u.mapping;if(p===To||p===Ao)if(e.has(u)){let g=e.get(u).texture;return o(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let _=new _l(g.height);return _.fromEquirectangularTexture(i,u),e.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let p=u.mapping,g=p===To||p===Ao,_=p===Gi||p===us;if(g||_){let f=t.get(u),m=f!==void 0?f.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new gl(i)),f=g?n.fromEquirectangular(u,f):n.fromCubemap(u,f),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),f.texture;if(f!==void 0)return f.texture;{let b=u.image;return g&&b&&b.height>0||_&&b&&l(b)?(n===null&&(n=new gl(i)),f=g?n.fromEquirectangular(u):n.fromCubemap(u),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),u.addEventListener("dispose",h),f.texture):null}}}return u}function o(u,p){return p===To?u.mapping=Gi:p===Ao&&(u.mapping=us),u}function l(u){let p=0,g=6;for(let _=0;_<g;_++)u[_]!==void 0&&p++;return p===g}function c(u){let p=u.target;p.removeEventListener("dispose",c);let g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(u){let p=u.target;p.removeEventListener("dispose",h);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function v_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ss("WebGLRenderer: "+n+" extension not supported."),s}}}function x_(i,e,t,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];let p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let p in u)e.update(u[p],i.ARRAY_BUFFER)}function c(d){let u=[],p=d.index,g=d.attributes.position,_=0;if(g===void 0)return;if(p!==null){let b=p.array;_=p.version;for(let E=0,y=b.length;E<y;E+=3){let S=b[E+0],w=b[E+1],A=b[E+2];u.push(S,w,w,A,A,S)}}else{let b=g.array;_=g.version;for(let E=0,y=b.length/3-1;E<y;E+=3){let S=E+0,w=E+1,A=E+2;u.push(S,w,w,A,A,S)}}let f=new(g.count>=65535?wr:Mr)(u,1);f.version=_;let m=r.get(d);m&&e.remove(m),r.set(d,f)}function h(d){let u=r.get(d);if(u){let p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function y_(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function c(d,u,p){p!==0&&(i.drawElementsInstanced(n,u,r,d*a,p),t.update(u,n,p))}function h(d,u,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,p);let _=0;for(let f=0;f<p;f++)_+=u[f];t.update(_,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function b_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ue("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function S_(i,e,t){let n=new WeakMap,s=new Ct;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let T=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],E=0;p===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let y=o.attributes.position.count*E,S=1;y>e.maxTextureSize&&(S=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let w=new Float32Array(y*S*4*d),A=new yr(w,y,S,d);A.type=Kn,A.needsUpdate=!0;let v=E*4;for(let I=0;I<d;I++){let L=f[I],N=m[I],z=b[I],R=y*S*4*I;for(let D=0;D<L.count;D++){let k=D*v;p===!0&&(s.fromBufferAttribute(L,D),w[R+k+0]=s.x,w[R+k+1]=s.y,w[R+k+2]=s.z,w[R+k+3]=0),g===!0&&(s.fromBufferAttribute(N,D),w[R+k+4]=s.x,w[R+k+5]=s.y,w[R+k+6]=s.z,w[R+k+7]=0),_===!0&&(s.fromBufferAttribute(z,D),w[R+k+8]=s.x,w[R+k+9]=s.y,w[R+k+10]=s.z,w[R+k+11]=z.itemSize===4?s.w:1)}}u={count:d,texture:A,size:new ge(y,S)},n.set(o,u),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function M_(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}function E_(i,e,t,n,s,r){let a=new bn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Je;c.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ze([0,2,0,0,2,0],2));let h=new lo({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new ye(c,h),u=new qs(-1,1,1,-1,0,1),p=null,g=null,_=!1,f,m=null,b=[],E=!1;this.setSize=function(y,S){a.setSize(y,S),o!==null&&o.setSize(y,S),l!==null&&l.setSize(y,S);for(let w=0;w<b.length;w++){let A=b[w];A.setSize&&A.setSize(y,S)}},this.setEffects=function(y){b=y,E=b.length>0&&b[0].isRenderPass===!0;let S=a.width,w=a.height;b.length>0&&o===null&&(o=new bn(S,w,{type:jn,depthBuffer:!1,stencilBuffer:!1}),l=new bn(S,w,{type:jn,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<b.length;A++){let v=b[A];v.setSize&&v.setSize(S,w)}},this.begin=function(y,S){if(_||y.toneMapping===Zn&&b.length===0)return!1;if(m=S,S!==null){let w=S.width,A=S.height;(a.width!==w||a.height!==A)&&this.setSize(w,A)}return E===!1&&y.setRenderTarget(a),f=y.toneMapping,y.toneMapping=Zn,!0},this.hasRenderPass=function(){return E},this.end=function(y,S){y.toneMapping=f,_=!0;let w=a,A=o;for(let v=0;v<b.length;v++){let T=b[v];T.enabled!==!1&&(T.render(y,A,w,S),T.needsSwap!==!1&&(w=A,A=A===o?l:o))}if(p!==y.outputColorSpace||g!==y.toneMapping){p=y.outputColorSpace,g=y.toneMapping,h.defines={},Ze.getTransfer(p)===lt&&(h.defines.SRGB_TRANSFER="");let v=w_[g];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=w.texture,y.setRenderTarget(m),y.render(d,u),m=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}function tr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Bd[s];if(r===void 0&&(r=new Float32Array(s),Bd[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function yl(i,e){let t=Od[e];t===void 0&&(t=new Int32Array(e),Od[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function T_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function A_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),Yt(t,e)}}function R_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),Yt(t,e)}}function C_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),Yt(t,e)}}function P_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;Hd.set(n),i.uniformMatrix2fv(this.addr,!1,Hd),Yt(t,n)}}function I_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;zd.set(n),i.uniformMatrix3fv(this.addr,!1,zd),Yt(t,n)}}function L_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;kd.set(n),i.uniformMatrix4fv(this.addr,!1,kd),Yt(t,n)}}function D_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function N_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),Yt(t,e)}}function U_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),Yt(t,e)}}function F_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),Yt(t,e)}}function B_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function O_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),Yt(t,e)}}function k_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),Yt(t,e)}}function z_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),Yt(t,e)}}function H_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(wh.compareFunction=t.isReversedDepthBuffer()?fl:dl,r=wh):r=nf,t.setTexture2D(e||r,s)}function V_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||rf,s)}function G_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||af,s)}function W_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||sf,s)}function X_(i){switch(i){case 5126:return T_;case 35664:return A_;case 35665:return R_;case 35666:return C_;case 35674:return P_;case 35675:return I_;case 35676:return L_;case 5124:case 35670:return D_;case 35667:case 35671:return N_;case 35668:case 35672:return U_;case 35669:case 35673:return F_;case 5125:return B_;case 36294:return O_;case 36295:return k_;case 36296:return z_;case 35678:case 36198:case 36298:case 36306:case 35682:return H_;case 35679:case 36299:case 36307:return V_;case 35680:case 36300:case 36308:case 36293:return G_;case 36289:case 36303:case 36311:case 36292:return W_}}function q_(i,e){i.uniform1fv(this.addr,e)}function Y_(i,e){let t=tr(e,this.size,2);i.uniform2fv(this.addr,t)}function $_(i,e){let t=tr(e,this.size,3);i.uniform3fv(this.addr,t)}function Z_(i,e){let t=tr(e,this.size,4);i.uniform4fv(this.addr,t)}function J_(i,e){let t=tr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function K_(i,e){let t=tr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function j_(i,e){let t=tr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Q_(i,e){i.uniform1iv(this.addr,e)}function ev(i,e){i.uniform2iv(this.addr,e)}function tv(i,e){i.uniform3iv(this.addr,e)}function nv(i,e){i.uniform4iv(this.addr,e)}function iv(i,e){i.uniform1uiv(this.addr,e)}function sv(i,e){i.uniform2uiv(this.addr,e)}function rv(i,e){i.uniform3uiv(this.addr,e)}function av(i,e){i.uniform4uiv(this.addr,e)}function ov(i,e,t){let n=this.cache,s=e.length,r=yl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=wh:a=nf;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function lv(i,e,t){let n=this.cache,s=e.length,r=yl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||rf,r[a])}function cv(i,e,t){let n=this.cache,s=e.length,r=yl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||af,r[a])}function hv(i,e,t){let n=this.cache,s=e.length,r=yl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||sf,r[a])}function uv(i){switch(i){case 5126:return q_;case 35664:return Y_;case 35665:return $_;case 35666:return Z_;case 35674:return J_;case 35675:return K_;case 35676:return j_;case 5124:case 35670:return Q_;case 35667:case 35671:return ev;case 35668:case 35672:return tv;case 35669:case 35673:return nv;case 5125:return iv;case 36294:return sv;case 36295:return rv;case 36296:return av;case 35678:case 36198:case 36298:case 36306:case 35682:return ov;case 35679:case 36299:case 36307:return lv;case 35680:case 36300:case 36308:case 36293:return cv;case 36289:case 36303:case 36311:case 36292:return hv}}function Vd(i,e){i.seq.push(e),i.map[e.id]=e}function dv(i,e,t){let n=i.name,s=n.length;for(Sh.lastIndex=0;;){let r=Sh.exec(n),a=Sh.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Vd(t,c===void 0?new Eh(o,i,e):new Th(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Ah(o),Vd(t,d)),t=d}}}function Gd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function mv(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function gv(i){Ze._getMatrix(Wd,Ze.workingColorSpace,i);let e=`mat3( ${Wd.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(i)){case vr:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Xd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+mv(i.getShaderSource(e),o)}else return r}function _v(i,e){let t=gv(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function xv(i,e){let t=vv[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function yv(){Ze.getLuminanceCoefficients(ml);let i=ml.x.toFixed(4),e=ml.y.toFixed(4),t=ml.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qr).join(`
`)}function Sv(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Mv(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Qr(i){return i!==""}function qd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Rh(i){return i.replace(wv,Tv)}function Tv(i,e){let t=Ve[e];if(t===void 0){let n=Ev.get(e);if(n!==void 0)t=Ve[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Rh(t)}function $d(i){return i.replace(Av,Rv)}function Rv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zd(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Pv(i){return Cv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function Lv(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Iv[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function Nv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Dv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function Fv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Uv[i.combine]||"ENVMAP_BLENDING_NONE"}function Bv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ov(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Pv(t),c=Lv(t),h=Nv(t),d=Fv(t),u=Bv(t),p=bv(t),g=Sv(r),_=s.createProgram(),f,m,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qr).join(`
`),f.length>0&&(f+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qr).join(`
`),m.length>0&&(m+=`
`)):(f=[Zd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qr).join(`
`),m=[Zd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zn?"#define TONE_MAPPING":"",t.toneMapping!==Zn?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Zn?xv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,_v("linearToOutputTexel",t.outputColorSpace),yv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qr).join(`
`)),a=Rh(a),a=qd(a,t),a=Yd(a,t),o=Rh(o),o=qd(o,t),o=Yd(o,t),a=$d(a),o=$d(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,m=["#define varying in",t.glslVersion===rh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===rh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let E=b+f+a,y=b+m+o,S=Gd(s,s.VERTEX_SHADER,E),w=Gd(s,s.FRAGMENT_SHADER,y);s.attachShader(_,S),s.attachShader(_,w),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(L){if(i.debug.checkShaderErrors){let N=s.getProgramInfoLog(_)||"",z=s.getShaderInfoLog(S)||"",R=s.getShaderInfoLog(w)||"",D=N.trim(),k=z.trim(),V=R.trim(),K=!0,q=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,S,w);else{let j=Xd(s,S,"vertex"),te=Xd(s,w,"fragment");Ue("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+D+`
`+j+`
`+te)}else D!==""?Le("WebGLProgram: Program Info Log:",D):(k===""||V==="")&&(q=!1);q&&(L.diagnostics={runnable:K,programLog:D,vertexShader:{log:k,prefix:f},fragmentShader:{log:V,prefix:m}})}s.deleteShader(S),s.deleteShader(w),v=new er(s,_),T=Mv(s,_)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(_,fv)),I},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pv++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=w,this}function zv(i){return i===Xi||i===Zr||i===Jr}function Hv(i,e,t,n,s,r){let a=new br,o=new Ch,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,T,I,L,N,z){let R=L.fog,D=N.geometry,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,K=e.get(v.envMap||k,V),q=K&&K.mapping===Gr?K.image.height:null,j=p[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Le("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let te=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,we=te!==void 0?te.length:0,Ee=0;D.morphAttributes.position!==void 0&&(Ee=1),D.morphAttributes.normal!==void 0&&(Ee=2),D.morphAttributes.color!==void 0&&(Ee=3);let gt,Ke,tt,Z;if(j){let vt=hi[j];gt=vt.vertexShader,Ke=vt.fragmentShader}else{gt=v.vertexShader,Ke=v.fragmentShader;let vt=o.getVertexShaderStage(v),rt=o.getFragmentShaderStage(v);o.update(v,vt,rt),tt=vt.id,Z=rt.id}let ne=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),Oe=N.isInstancedMesh===!0,ve=N.isBatchedMesh===!0,Ge=!!v.map,Wt=!!v.matcap,We=!!K,et=!!v.aoMap,_t=!!v.lightMap,$e=!!v.bumpMap&&v.wireframe===!1,Rt=!!v.normalMap,Kt=!!v.displacementMap,xn=!!v.emissiveMap,It=!!v.metalnessMap,zt=!!v.roughnessMap,B=v.anisotropy>0,an=v.clearcoat>0,ht=v.dispersion>0,C=v.retroreflectivity>0,x=v.iridescence>0,H=v.sheen>0,X=v.transmission>0,$=B&&!!v.anisotropyMap,se=an&&!!v.clearcoatMap,re=an&&!!v.clearcoatNormalMap,J=an&&!!v.clearcoatRoughnessMap,ee=x&&!!v.iridescenceMap,ae=x&&!!v.iridescenceThicknessMap,Re=H&&!!v.sheenColorMap,ue=H&&!!v.sheenRoughnessMap,oe=!!v.specularMap,Ce=!!v.specularColorMap,De=!!v.specularIntensityMap,ke=X&&!!v.transmissionMap,F=X&&!!v.thicknessMap,le=!!v.gradientMap,Q=!!v.alphaMap,ce=v.alphaTest>0,me=!!v.alphaHash,ie=!!v.extensions,Pe=Zn;v.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Pe=i.toneMapping);let Te={shaderID:j,shaderType:v.type,shaderName:v.name,vertexShader:gt,fragmentShader:Ke,defines:v.defines,customVertexShaderID:tt,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:ve,batchingColor:ve&&N._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&N.instanceColor!==null,instancingMorph:Oe&&N.morphTexture!==null,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Ze.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ge,matcap:Wt,envMap:We,envMapMode:We&&K.mapping,envMapCubeUVHeight:q,aoMap:et,lightMap:_t,bumpMap:$e,normalMap:Rt,displacementMap:Kt,emissiveMap:xn,normalMapObjectSpace:Rt&&v.normalMapType===dd,normalMapTangentSpace:Rt&&v.normalMapType===ul,packedNormalMap:Rt&&v.normalMapType===ul&&zv(v.normalMap.format),metalnessMap:It,roughnessMap:zt,anisotropy:B,anisotropyMap:$,clearcoat:an,clearcoatMap:se,clearcoatNormalMap:re,clearcoatRoughnessMap:J,dispersion:ht,retroreflection:C,iridescence:x,iridescenceMap:ee,iridescenceThicknessMap:ae,sheen:H,sheenColorMap:Re,sheenRoughnessMap:ue,specularMap:oe,specularColorMap:Ce,specularIntensityMap:De,transmission:X,transmissionMap:ke,thicknessMap:F,gradientMap:le,opaque:v.transparent===!1&&v.blending===$s&&v.alphaToCoverage===!1,alphaMap:Q,alphaTest:ce,alphaHash:me,combine:v.combine,mapUv:Ge&&g(v.map.channel),aoMapUv:et&&g(v.aoMap.channel),lightMapUv:_t&&g(v.lightMap.channel),bumpMapUv:$e&&g(v.bumpMap.channel),normalMapUv:Rt&&g(v.normalMap.channel),displacementMapUv:Kt&&g(v.displacementMap.channel),emissiveMapUv:xn&&g(v.emissiveMap.channel),metalnessMapUv:It&&g(v.metalnessMap.channel),roughnessMapUv:zt&&g(v.roughnessMap.channel),anisotropyMapUv:$&&g(v.anisotropyMap.channel),clearcoatMapUv:se&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:re&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:ue&&g(v.sheenRoughnessMap.channel),specularMapUv:oe&&g(v.specularMap.channel),specularColorMapUv:Ce&&g(v.specularColorMap.channel),specularIntensityMapUv:De&&g(v.specularIntensityMap.channel),transmissionMapUv:ke&&g(v.transmissionMap.channel),thicknessMapUv:F&&g(v.thicknessMap.channel),alphaMapUv:Q&&g(v.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Rt||B),vertexNormals:!!D.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!D.attributes.uv&&(Ge||Q),fog:!!R,useFog:v.fog===!0,fogExp2:!!R&&R.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||D.attributes.normal===void 0&&Rt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:be,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Ee,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Pe,decodeVideoTexture:Ge&&v.map.isVideoTexture===!0&&Ze.getTransfer(v.map.colorSpace)===lt,decodeVideoTextureEmissive:xn&&v.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(v.emissiveMap.colorSpace)===lt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===nt,flipSided:v.side===gn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ie&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ie&&v.extensions.multiDraw===!0||ve)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Te.vertexUv1s=l.has(1),Te.vertexUv2s=l.has(2),Te.vertexUv3s=l.has(3),l.clear(),Te}function f(v){let T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(let I in v.defines)T.push(I),T.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(m(T,v),b(T,v),T.push(i.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function m(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numSunLights),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numSunLightShadows),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function b(v,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.retroreflection&&a.enable(24),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),T.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function E(v){let T=p[v.type],I;if(T){let L=hi[T];I=Pd.clone(L.uniforms)}else I=v.uniforms;return I}function y(v,T){let I=h.get(T);return I!==void 0?++I.usedTimes:(I=new Ov(i,T,v,s),c.push(I),h.set(T,I)),I}function S(v){if(--v.usedTimes===0){let T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function w(v){o.remove(v)}function A(){o.dispose()}return{getParameters:_,getProgramCacheKey:f,getUniforms:E,acquireProgram:y,releaseProgram:S,releaseShaderCache:w,programs:c,dispose:A}}function Vv(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Gv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Jd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Kd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let p=0;return u.isInstancedMesh&&(p+=2),u.isSkinnedMesh&&(p+=1),p}function o(u,p,g,_,f,m){let b=i[e];return b===void 0?(b={id:u.id,object:u,geometry:p,material:g,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:f,group:m},i[e]=b):(b.id=u.id,b.object=u,b.geometry=p,b.material=g,b.materialVariant=a(u),b.groupOrder=_,b.renderOrder=u.renderOrder,b.z=f,b.group=m),e++,b}function l(u,p,g,_,f,m,b){b.reversedDepth===!0&&(f=-f);let E=o(u,p,g,_,f,m);g.transmission>0?n.push(E):g.transparent===!0?s.push(E):t.push(E)}function c(u,p,g,_,f,m){let b=o(u,p,g,_,f,m);g.transmission>0?n.unshift(b):g.transparent===!0?s.unshift(b):t.unshift(b)}function h(u,p){t.length>1&&t.sort(u||Gv),n.length>1&&n.sort(p||Jd),s.length>1&&s.sort(p||Jd)}function d(){for(let u=e,p=i.length;u<p;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Wv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Kd,i.set(n,[a])):s>=r.length?(a=new Kd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Xv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new P,color:new he};break;case"SpotLight":t={position:new P,direction:new P,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new he,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new he,groundColor:new he};break;case"RectAreaLight":t={color:new he,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function qv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function $v(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Zv(i){let e=new Xv,t=qv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new yt,a=new yt;function o(c){let h=0,d=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let p=0,g=0,_=0,f=0,m=0,b=0,E=0,y=0,S=0,w=0,A=0,v=0,T=0,I=0;c.sort($v);for(let N=0,z=c.length;N<z;N++){let R=c[N],D=R.color,k=R.intensity,V=R.distance,K=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Xi?K=R.shadow.map.texture:K=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=D.r*k,d+=D.g*k,u+=D.b*k;else if(R.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(R.sh.coefficients[q],k);I++}else if(R.isSunLight){let q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let j=R.shadow,te=t.get(R);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=te,n.sunShadowMap[g]=K;let we=j.getViewportCount();for(let Ee=0;Ee<we;Ee++)n.sunShadowMatrix[_+Ee]=j.getMatrix(Ee),n.sunShadowCascade[_+Ee]=j._cascadeData[Ee];_+=we,g++}n.sun[p]=q,p++}else if(R.isDirectionalLight){let q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let j=R.shadow,te=t.get(R);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize=j.mapSize,n.directionalShadow[f]=te,n.directionalShadowMap[f]=K,n.directionalShadowMatrix[f]=R.shadow.matrix,S++}n.directional[f]=q,f++}else if(R.isSpotLight){let q=e.get(R);q.position.setFromMatrixPosition(R.matrixWorld),q.color.copy(D).multiplyScalar(k),q.distance=V,q.coneCos=Math.cos(R.angle),q.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),q.decay=R.decay,n.spot[b]=q;let j=R.shadow;if(R.map&&(n.spotLightMap[v]=R.map,v++,j.updateMatrices(R),R.castShadow&&T++),n.spotLightMatrix[b]=j.matrix,R.castShadow){let te=t.get(R);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize=j.mapSize,n.spotShadow[b]=te,n.spotShadowMap[b]=K,A++}b++}else if(R.isRectAreaLight){let q=e.get(R);q.color.copy(D).multiplyScalar(k),q.halfWidth.set(R.width*.5,0,0),q.halfHeight.set(0,R.height*.5,0),n.rectArea[E]=q,E++}else if(R.isPointLight){let q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),q.distance=R.distance,q.decay=R.decay,R.castShadow){let j=R.shadow,te=t.get(R);te.shadowIntensity=j.intensity,te.shadowBias=j.bias,te.shadowNormalBias=j.normalBias,te.shadowRadius=j.radius,te.shadowMapSize=j.mapSize,te.shadowCameraNear=j.camera.near,te.shadowCameraFar=j.camera.far,n.pointShadow[m]=te,n.pointShadowMap[m]=K,n.pointShadowMatrix[m]=R.shadow.matrix,w++}n.point[m]=q,m++}else if(R.isHemisphereLight){let q=e.get(R);q.skyColor.copy(R.color).multiplyScalar(k),q.groundColor.copy(R.groundColor).multiplyScalar(k),n.hemi[y]=q,y++}}E>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let L=n.hash;(L.sunLength!==p||L.directionalLength!==f||L.pointLength!==m||L.spotLength!==b||L.rectAreaLength!==E||L.hemiLength!==y||L.numSunShadows!==g||L.numDirectionalShadows!==S||L.numPointShadows!==w||L.numSpotShadows!==A||L.numSpotMaps!==v||L.numLightProbes!==I)&&(n.sun.length=p,n.directional.length=f,n.spot.length=b,n.rectArea.length=E,n.point.length=m,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+v-T,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=I,L.sunLength=p,L.directionalLength=f,L.pointLength=m,L.spotLength=b,L.rectAreaLength=E,L.hemiLength=y,L.numSunShadows=g,L.numDirectionalShadows=S,L.numPointShadows=w,L.numSpotShadows=A,L.numSpotMaps=v,L.numLightProbes=I,n.version=Yv++)}function l(c,h){let d=0,u=0,p=0,g=0,_=0,f=0,m=h.matrixWorldInverse;for(let b=0,E=c.length;b<E;b++){let y=c[b];if(y.isSunLight){let S=n.sun[d];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),d++}else if(y.isDirectionalLight){let S=n.directional[u];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),u++}else if(y.isSpotLight){let S=n.spot[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),g++}else if(y.isRectAreaLight){let S=n.rectArea[_];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){let S=n.point[p];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),p++}else if(y.isHemisphereLight){let S=n.hemi[f];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),f++}}}return{setup:o,setupView:l,state:n}}function jd(i){let e=new Zv(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Jv(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new jd(i),e.set(s,[o])):r>=a.length?(o=new jd(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function tx(i,e,t){let n=new Gs,s=new ge,r=new ge,a=new Ct,o=new co,l=new ho,c={},h=t.maxTextureSize,d={[Vi]:gn,[gn]:Vi,[nt]:nt},u=new At({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ge},radius:{value:4}},vertexShader:Kv,fragmentShader:jv}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let g=new Je;g.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ye(g,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cs;let m=this.type;this.render=function(w,A,v){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||w.length===0)return;this.type===Gu&&(Le("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=cs);let T=i.getRenderTarget(),I=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),N=i.state;N.setBlending(oi),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let z=m!==this.type;z&&A.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(D=>D.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,D=w.length;R<D;R++){let k=w[R],V=k.shadow;if(V===void 0){Le("WebGLShadowMap:",k,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let K=V.getFrameExtents();s.multiply(K),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,V.mapSize.y=r.y));let q=i.state.buffers.depth.getReversed();if(V.camera._reversedDepth=q,V.map===null||z===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Ys){if(k.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new bn(s.x,s.y,{format:Xi,type:jn,minFilter:Xt,magFilter:Xt,generateMipmaps:!1}),V.map.texture.name=k.name+".shadowMap",V.map.depthTexture=new Bi(s.x,s.y,Kn),V.map.depthTexture.name=k.name+".shadowMapDepth",V.map.depthTexture.format=ii,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Qt,V.map.depthTexture.magFilter=Qt}else k.isPointLight?(V.map=new _l(s.x),V.map.depthTexture=new no(s.x,Jn)):(V.map=new bn(s.x,s.y),V.map.depthTexture=new Bi(s.x,s.y,Jn)),V.map.depthTexture.name=k.name+".shadowMap",V.map.depthTexture.format=ii,this.type===cs?(V.map.depthTexture.compareFunction=q?fl:dl,V.map.depthTexture.minFilter=Xt,V.map.depthTexture.magFilter=Xt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Qt,V.map.depthTexture.magFilter=Qt);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==s.x||V.map.height!==s.y)&&V.map.setSize(s.x,s.y);let j=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();k.isPointLight!==!0&&V.updateMatrices(k,v);for(let te=0;te<j;te++){let we=V.getCamera(te);if(k.isPointLight){let Ee=V.camera,gt=V.matrix,Ke=k.distance||Ee.far;Ke!==Ee.far&&(Ee.far=Ke,Ee.updateProjectionMatrix()),jr.setFromMatrixPosition(k.matrixWorld),Ee.position.copy(jr),Mh.copy(Ee.position),Mh.add(Qv[te]),Ee.up.copy(ex[te]),Ee.lookAt(Mh),Ee.updateMatrixWorld(),gt.makeTranslation(-jr.x,-jr.y,-jr.z),Qd.multiplyMatrices(Ee.projectionMatrix,Ee.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Qd,Ee.coordinateSystem,Ee.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)i.setRenderTarget(V.map,te),i.clear();else{te===0&&(i.setRenderTarget(V.map),i.clear());let Ee=V.getViewport(te);a.set(r.x*Ee.x,r.y*Ee.y,r.x*Ee.z,r.y*Ee.w),N.viewport(a)}n=V.getFrustum(te),y(A,v,we,k,this.type)}V.isPointLightShadow!==!0&&this.type===Ys&&b(V,v),V.needsUpdate=!1}m=this.type,f.needsUpdate=!1,i.setRenderTarget(T,I,L)};function b(w,A){let v=e.update(_);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null?w.mapPass=new bn(s.x,s.y,{format:Xi,type:jn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value.set(w.map.width,w.map.height),u.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,v,u,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value.set(w.map.width,w.map.height),p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,v,p,_,null)}function E(w,A,v,T){let I=null,L=v.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)I=L;else if(I=v.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let N=I.uuid,z=A.uuid,R=c[N];R===void 0&&(R={},c[N]=R);let D=R[z];D===void 0&&(D=I.clone(),R[z]=D,A.addEventListener("dispose",S)),I=D}if(I.visible=A.visible,I.wireframe=A.wireframe,T===Ys?I.side=A.shadowSide!==null?A.shadowSide:A.side:I.side=A.shadowSide!==null?A.shadowSide:d[A.side],I.alphaMap=A.alphaMap,I.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,I.map=A.map,I.clipShadows=A.clipShadows,I.clippingPlanes=A.clippingPlanes,I.clipIntersection=A.clipIntersection,I.displacementMap=A.displacementMap,I.displacementScale=A.displacementScale,I.displacementBias=A.displacementBias,I.wireframeLinewidth=A.wireframeLinewidth,I.linewidth=A.linewidth,v.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let N=i.properties.get(I);N.light=v}return I}function y(w,A,v,T,I){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&I===Ys)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,w.matrixWorld);let z=e.update(w),R=w.material;if(Array.isArray(R)){let D=z.groups;for(let k=0,V=D.length;k<V;k++){let K=D[k],q=R[K.materialIndex];if(q&&q.visible){let j=E(w,q,T,I);w.onBeforeShadow(i,w,A,v,z,j,K),i.renderBufferDirect(v,null,z,j,w,K),w.onAfterShadow(i,w,A,v,z,j,K)}}}else if(R.visible){let D=E(w,R,T,I);w.onBeforeShadow(i,w,A,v,z,D,null),i.renderBufferDirect(v,null,z,D,w,null),w.onAfterShadow(i,w,A,v,z,D,null)}}let N=w.children;for(let z=0,R=N.length;z<R;z++)y(N[z],A,v,T,I)}function S(w){w.target.removeEventListener("dispose",S);for(let v in c){let T=c[v],I=w.target.uuid;I in T&&(T[I].dispose(),delete T[I])}}}function nx(i,e){function t(){let F=!1,le=new Ct,Q=null,ce=new Ct(0,0,0,0);return{setMask:function(me){Q!==me&&!F&&(i.colorMask(me,me,me,me),Q=me)},setLocked:function(me){F=me},setClear:function(me,ie,Pe,Te,vt){vt===!0&&(me*=Te,ie*=Te,Pe*=Te),le.set(me,ie,Pe,Te),ce.equals(le)===!1&&(i.clearColor(me,ie,Pe,Te),ce.copy(le))},reset:function(){F=!1,Q=null,ce.set(-1,0,0,0)}}}function n(){let F=!1,le=!1,Q=null,ce=null,me=null;return{setReversed:function(ie){if(le!==ie){let Pe=e.get("EXT_clip_control");ie?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),le=ie;let Te=me;me=null,this.setClear(Te)}},getReversed:function(){return le},setTest:function(ie){ie?ne(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(ie){Q!==ie&&!F&&(i.depthMask(ie),Q=ie)},setFunc:function(ie){if(le&&(ie=wd[ie]),ce!==ie){switch(ie){case Ha:i.depthFunc(i.NEVER);break;case Va:i.depthFunc(i.ALWAYS);break;case Ga:i.depthFunc(i.LESS);break;case Us:i.depthFunc(i.LEQUAL);break;case Wa:i.depthFunc(i.EQUAL);break;case Xa:i.depthFunc(i.GEQUAL);break;case qa:i.depthFunc(i.GREATER);break;case Ya:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ce=ie}},setLocked:function(ie){F=ie},setClear:function(ie){me!==ie&&(me=ie,le&&(ie=1-ie),i.clearDepth(ie))},reset:function(){F=!1,Q=null,ce=null,me=null,le=!1}}}function s(){let F=!1,le=null,Q=null,ce=null,me=null,ie=null,Pe=null,Te=null,vt=null;return{setTest:function(rt){F||(rt?ne(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(rt){le!==rt&&!F&&(i.stencilMask(rt),le=rt)},setFunc:function(rt,zn,Qn){(Q!==rt||ce!==zn||me!==Qn)&&(i.stencilFunc(rt,zn,Qn),Q=rt,ce=zn,me=Qn)},setOp:function(rt,zn,Qn){(ie!==rt||Pe!==zn||Te!==Qn)&&(i.stencilOp(rt,zn,Qn),ie=rt,Pe=zn,Te=Qn)},setLocked:function(rt){F=rt},setClear:function(rt){vt!==rt&&(i.clearStencil(rt),vt=rt)},reset:function(){F=!1,le=null,Q=null,ce=null,me=null,ie=null,Pe=null,Te=null,vt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},p=new WeakMap,g=[],_=null,f=!1,m=null,b=null,E=null,y=null,S=null,w=null,A=null,v=new he(0,0,0),T=0,I=!1,L=null,N=null,z=null,R=null,D=null,k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,K=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(q)[1]),V=K>=1):q.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),V=K>=2);let j=null,te={},we=i.getParameter(i.SCISSOR_BOX),Ee=i.getParameter(i.VIEWPORT),gt=new Ct().fromArray(we),Ke=new Ct().fromArray(Ee);function tt(F,le,Q,ce){let me=new Uint8Array(4),ie=i.createTexture();i.bindTexture(F,ie),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<Q;Pe++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,ce,0,i.RGBA,i.UNSIGNED_BYTE,me):i.texImage2D(le+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,me);return ie}let Z={};Z[i.TEXTURE_2D]=tt(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(Us),$e(!1),Rt(Fc),ne(i.CULL_FACE),et(oi);function ne(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function be(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function Oe(F,le){return u[F]!==le?(i.bindFramebuffer(F,le),u[F]=le,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function ve(F,le){let Q=g,ce=!1;if(F){Q=p.get(le),Q===void 0&&(Q=[],p.set(le,Q));let me=F.textures;if(Q.length!==me.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let ie=0,Pe=me.length;ie<Pe;ie++)Q[ie]=i.COLOR_ATTACHMENT0+ie;Q.length=me.length,ce=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,ce=!0);ce&&i.drawBuffers(Q)}function Ge(F){return _!==F?(i.useProgram(F),_=F,!0):!1}let Wt={[hs]:i.FUNC_ADD,[Xu]:i.FUNC_SUBTRACT,[qu]:i.FUNC_REVERSE_SUBTRACT};Wt[Yu]=i.MIN,Wt[$u]=i.MAX;let We={[Zu]:i.ZERO,[Ju]:i.ONE,[Ku]:i.SRC_COLOR,[zc]:i.SRC_ALPHA,[id]:i.SRC_ALPHA_SATURATE,[td]:i.DST_COLOR,[Qu]:i.DST_ALPHA,[ju]:i.ONE_MINUS_SRC_COLOR,[Hc]:i.ONE_MINUS_SRC_ALPHA,[nd]:i.ONE_MINUS_DST_COLOR,[ed]:i.ONE_MINUS_DST_ALPHA,[sd]:i.CONSTANT_COLOR,[rd]:i.ONE_MINUS_CONSTANT_COLOR,[ad]:i.CONSTANT_ALPHA,[od]:i.ONE_MINUS_CONSTANT_ALPHA};function et(F,le,Q,ce,me,ie,Pe,Te,vt,rt){if(F===oi){f===!0&&(be(i.BLEND),f=!1);return}if(f===!1&&(ne(i.BLEND),f=!0),F!==Wu){if(F!==m||rt!==I){if((b!==hs||S!==hs)&&(i.blendEquation(i.FUNC_ADD),b=hs,S=hs),rt)switch(F){case $s:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bc:i.blendFunc(i.ONE,i.ONE);break;case Oc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case kc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ue("WebGLState: Invalid blending: ",F);break}else switch(F){case $s:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Oc:Ue("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case kc:Ue("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ue("WebGLState: Invalid blending: ",F);break}E=null,y=null,w=null,A=null,v.set(0,0,0),T=0,m=F,I=rt}return}me=me||le,ie=ie||Q,Pe=Pe||ce,(le!==b||me!==S)&&(i.blendEquationSeparate(Wt[le],Wt[me]),b=le,S=me),(Q!==E||ce!==y||ie!==w||Pe!==A)&&(i.blendFuncSeparate(We[Q],We[ce],We[ie],We[Pe]),E=Q,y=ce,w=ie,A=Pe),(Te.equals(v)===!1||vt!==T)&&(i.blendColor(Te.r,Te.g,Te.b,vt),v.copy(Te),T=vt),m=F,I=!1}function _t(F,le){F.side===nt?be(i.CULL_FACE):ne(i.CULL_FACE);let Q=F.side===gn;le&&(Q=!Q),$e(Q),F.blending===$s&&F.transparent===!1?et(oi):et(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let ce=F.stencilWrite;o.setTest(ce),ce&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),xn(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function $e(F){L!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),L=F)}function Rt(F){F!==Hu?(ne(i.CULL_FACE),F!==N&&(F===Fc?i.cullFace(i.BACK):F===Vu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),N=F}function Kt(F){F!==z&&(V&&i.lineWidth(F),z=F)}function xn(F,le,Q){F?(ne(i.POLYGON_OFFSET_FILL),(R!==le||D!==Q)&&(R=le,D=Q,a.getReversed()&&(le=-le),i.polygonOffset(le,Q))):be(i.POLYGON_OFFSET_FILL)}function It(F){F?ne(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function zt(F){F===void 0&&(F=i.TEXTURE0+k-1),j!==F&&(i.activeTexture(F),j=F)}function B(F,le,Q){Q===void 0&&(j===null?Q=i.TEXTURE0+k-1:Q=j);let ce=te[Q];ce===void 0&&(ce={type:void 0,texture:void 0},te[Q]=ce),(ce.type!==F||ce.texture!==le)&&(j!==Q&&(i.activeTexture(Q),j=Q),i.bindTexture(F,le||Z[F]),ce.type=F,ce.texture=le)}function an(){let F=te[j];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ht(){try{i.compressedTexImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function C(){try{i.compressedTexImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function x(){try{i.texSubImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function H(){try{i.texSubImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function se(){try{i.texStorage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function re(){try{i.texStorage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function J(){try{i.texImage2D(...arguments)}catch(F){Ue("WebGLState:",F)}}function ee(){try{i.texImage3D(...arguments)}catch(F){Ue("WebGLState:",F)}}function ae(F){return d[F]!==void 0?d[F]:i.getParameter(F)}function Re(F,le){d[F]!==le&&(i.pixelStorei(F,le),d[F]=le)}function ue(F){gt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),gt.copy(F))}function oe(F){Ke.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Ke.copy(F))}function Ce(F,le){let Q=c.get(le);Q===void 0&&(Q=new WeakMap,c.set(le,Q));let ce=Q.get(F);ce===void 0&&(ce=i.getUniformBlockIndex(le,F.name),Q.set(F,ce))}function De(F,le){let ce=c.get(le).get(F);l.get(le)!==ce&&(i.uniformBlockBinding(le,ce,F.__bindingPointIndex),l.set(le,ce))}function ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},j=null,te={},u={},p=new WeakMap,g=[],_=null,f=!1,m=null,b=null,E=null,y=null,S=null,w=null,A=null,v=new he(0,0,0),T=0,I=!1,L=null,N=null,z=null,R=null,D=null,gt.set(0,0,i.canvas.width,i.canvas.height),Ke.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:be,bindFramebuffer:Oe,drawBuffers:ve,useProgram:Ge,setBlending:et,setMaterial:_t,setFlipSided:$e,setCullFace:Rt,setLineWidth:Kt,setPolygonOffset:xn,setScissorTest:It,activeTexture:zt,bindTexture:B,unbindTexture:an,compressedTexImage2D:ht,compressedTexImage3D:C,texImage2D:J,texImage3D:ee,pixelStorei:Re,getParameter:ae,updateUBOMapping:Ce,uniformBlockBinding:De,texStorage2D:se,texStorage3D:re,texSubImage2D:x,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:$,scissor:ue,viewport:oe,reset:ke}}function ix(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ge,h=new WeakMap,d=new Set,u,p=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,x){return g?new OffscreenCanvas(C,x):xr("canvas")}function f(C,x,H){let X=1,$=ht(C);if(($.width>H||$.height>H)&&(X=H/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let se=Math.floor(X*$.width),re=Math.floor(X*$.height);u===void 0&&(u=_(se,re));let J=x?_(se,re):u;return J.width=se,J.height=re,J.getContext("2d").drawImage(C,0,0,se,re),Le("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+se+"x"+re+")."),J}else return"data"in C&&Le("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function m(C){return C.generateMipmaps}function b(C){i.generateMipmap(C)}function E(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,x,H,X,$,se=!1){if(C!==null){if(i[C]!==void 0)return i[C];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let re;X&&(re=e.get("EXT_texture_norm16"),re||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=x;if(x===i.RED&&(H===i.FLOAT&&(J=i.R32F),H===i.HALF_FLOAT&&(J=i.R16F),H===i.UNSIGNED_BYTE&&(J=i.R8),H===i.UNSIGNED_SHORT&&re&&(J=re.R16_EXT),H===i.SHORT&&re&&(J=re.R16_SNORM_EXT)),x===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.R8UI),H===i.UNSIGNED_SHORT&&(J=i.R16UI),H===i.UNSIGNED_INT&&(J=i.R32UI),H===i.BYTE&&(J=i.R8I),H===i.SHORT&&(J=i.R16I),H===i.INT&&(J=i.R32I)),x===i.RG&&(H===i.FLOAT&&(J=i.RG32F),H===i.HALF_FLOAT&&(J=i.RG16F),H===i.UNSIGNED_BYTE&&(J=i.RG8),H===i.UNSIGNED_SHORT&&re&&(J=re.RG16_EXT),H===i.SHORT&&re&&(J=re.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.RG8UI),H===i.UNSIGNED_SHORT&&(J=i.RG16UI),H===i.UNSIGNED_INT&&(J=i.RG32UI),H===i.BYTE&&(J=i.RG8I),H===i.SHORT&&(J=i.RG16I),H===i.INT&&(J=i.RG32I)),x===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.RGB8UI),H===i.UNSIGNED_SHORT&&(J=i.RGB16UI),H===i.UNSIGNED_INT&&(J=i.RGB32UI),H===i.BYTE&&(J=i.RGB8I),H===i.SHORT&&(J=i.RGB16I),H===i.INT&&(J=i.RGB32I)),x===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),H===i.UNSIGNED_INT&&(J=i.RGBA32UI),H===i.BYTE&&(J=i.RGBA8I),H===i.SHORT&&(J=i.RGBA16I),H===i.INT&&(J=i.RGBA32I)),x===i.RGB&&(H===i.UNSIGNED_SHORT&&re&&(J=re.RGB16_EXT),H===i.SHORT&&re&&(J=re.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),x===i.RGBA){let ee=se?vr:Ze.getTransfer($);H===i.FLOAT&&(J=i.RGBA32F),H===i.HALF_FLOAT&&(J=i.RGBA16F),H===i.UNSIGNED_BYTE&&(J=ee===lt?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&re&&(J=re.RGBA16_EXT),H===i.SHORT&&re&&(J=re.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function S(C,x){let H;return C?x===null||x===Jn||x===Js?H=i.DEPTH24_STENCIL8:x===Kn?H=i.DEPTH32F_STENCIL8:x===Zs&&(H=i.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Jn||x===Js?H=i.DEPTH_COMPONENT24:x===Kn?H=i.DEPTH_COMPONENT32F:x===Zs&&(H=i.DEPTH_COMPONENT16),H}function w(C,x){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Qt&&C.minFilter!==Xt?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function A(C){let x=C.target;x.removeEventListener("dispose",A),T(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&d.delete(x)}function v(C){let x=C.target;x.removeEventListener("dispose",v),L(x)}function T(C){let x=n.get(C);if(x.__webglInit===void 0)return;let H=C.source,X=p.get(H);if(X){let $=X[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&I(C),Object.keys(X).length===0&&p.delete(H)}n.remove(C)}function I(C){let x=n.get(C);i.deleteTexture(x.__webglTexture);let H=C.source,X=p.get(H);delete X[x.__cacheKey],a.memory.textures--}function L(C){let x=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let $=0;$<x.__webglFramebuffer[X].length;$++)i.deleteFramebuffer(x.__webglFramebuffer[X][$]);else i.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)i.deleteFramebuffer(x.__webglFramebuffer[X]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let H=C.textures;for(let X=0,$=H.length;X<$;X++){let se=n.get(H[X]);se.__webglTexture&&(i.deleteTexture(se.__webglTexture),a.memory.textures--),n.remove(H[X])}n.remove(C)}let N=0;function z(){N=0}function R(){return N}function D(C){N=C}function k(){let C=N;return C>=s.maxTextures&&Le("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,C}function V(C){let x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function K(C,x){let H=n.get(C);if(C.isVideoTexture&&B(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let X=C.image;if(X===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{be(H,C,x);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+x)}function q(C,x){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){be(H,C,x);return}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+x)}function j(C,x){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){be(H,C,x);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+x)}function te(C,x){let H=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&H.__version!==C.version){Oe(H,C,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+x)}let we={[Fs]:i.REPEAT,[ni]:i.CLAMP_TO_EDGE,[$a]:i.MIRRORED_REPEAT},Ee={[Qt]:i.NEAREST,[hd]:i.NEAREST_MIPMAP_NEAREST,[Wr]:i.NEAREST_MIPMAP_LINEAR,[Xt]:i.LINEAR,[Ro]:i.LINEAR_MIPMAP_NEAREST,[li]:i.LINEAR_MIPMAP_LINEAR},gt={[pd]:i.NEVER,[xd]:i.ALWAYS,[md]:i.LESS,[dl]:i.LEQUAL,[gd]:i.EQUAL,[fl]:i.GEQUAL,[_d]:i.GREATER,[vd]:i.NOTEQUAL};function Ke(C,x){if(x.type===Kn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Xt||x.magFilter===Ro||x.magFilter===Wr||x.magFilter===li||x.minFilter===Xt||x.minFilter===Ro||x.minFilter===Wr||x.minFilter===li)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,we[x.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,we[x.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,we[x.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Ee[x.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Ee[x.minFilter]),x.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,gt[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Qt||x.minFilter!==Wr&&x.minFilter!==li||x.type===Kn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function tt(C,x){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",A));let X=x.source,$=p.get(X);$===void 0&&($={},p.set(X,$));let se=V(x);if(se!==C.__cacheKey){$[se]===void 0&&($[se]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),$[se].usedTimes++;let re=$[C.__cacheKey];re!==void 0&&($[C.__cacheKey].usedTimes--,re.usedTimes===0&&I(x)),C.__cacheKey=se,C.__webglTexture=$[se].texture}return H}function Z(C,x,H){return Math.floor(Math.floor(C/H)/x)}function ne(C,x,H,X){let se=C.updateRanges;if(se.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,H,X,x.data);else{se.sort((Re,ue)=>Re.start-ue.start);let re=0;for(let Re=1;Re<se.length;Re++){let ue=se[re],oe=se[Re],Ce=ue.start+ue.count,De=Z(oe.start,x.width,4),ke=Z(ue.start,x.width,4);oe.start<=Ce+1&&De===ke&&Z(oe.start+oe.count-1,x.width,4)===De?ue.count=Math.max(ue.count,oe.start+oe.count-ue.start):(++re,se[re]=oe)}se.length=re+1;let J=t.getParameter(i.UNPACK_ROW_LENGTH),ee=t.getParameter(i.UNPACK_SKIP_PIXELS),ae=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Re=0,ue=se.length;Re<ue;Re++){let oe=se[Re],Ce=Math.floor(oe.start/4),De=Math.ceil(oe.count/4),ke=Ce%x.width,F=Math.floor(Ce/x.width),le=De,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ke),t.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,ke,F,le,Q,H,X,x.data)}C.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,J),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(i.UNPACK_SKIP_ROWS,ae)}}function be(C,x,H){let X=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=i.TEXTURE_3D);let $=tt(C,x),se=x.source;t.bindTexture(X,C.__webglTexture,i.TEXTURE0+H);let re=n.get(se);if(se.version!==re.__version||$===!0){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let Q=Ze.getPrimaries(Ze.workingColorSpace),ce=x.colorSpace===Mi?null:Ze.getPrimaries(x.colorSpace),me=x.colorSpace===Mi||Q===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let ee=f(x.image,!1,s.maxTextureSize);ee=an(x,ee);let ae=r.convert(x.format,x.colorSpace),Re=r.convert(x.type),ue=y(x.internalFormat,ae,Re,x.normalized,x.colorSpace,x.isVideoTexture);Ke(X,x);let oe,Ce=x.mipmaps,De=x.isVideoTexture!==!0,ke=re.__version===void 0||$===!0,F=se.dataReady,le=w(x,ee);if(x.isDepthTexture)ue=S(x.format===Wi,x.type),ke&&(De?t.texStorage2D(i.TEXTURE_2D,1,ue,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,ue,ee.width,ee.height,0,ae,Re,null));else if(x.isDataTexture)if(Ce.length>0){De&&ke&&t.texStorage2D(i.TEXTURE_2D,le,ue,Ce[0].width,Ce[0].height);for(let Q=0,ce=Ce.length;Q<ce;Q++)oe=Ce[Q],De?F&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,oe.width,oe.height,ae,Re,oe.data):t.texImage2D(i.TEXTURE_2D,Q,ue,oe.width,oe.height,0,ae,Re,oe.data);x.generateMipmaps=!1}else De?(ke&&t.texStorage2D(i.TEXTURE_2D,le,ue,ee.width,ee.height),F&&ne(x,ee,ae,Re)):t.texImage2D(i.TEXTURE_2D,0,ue,ee.width,ee.height,0,ae,Re,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){De&&ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,ue,Ce[0].width,Ce[0].height,ee.depth);for(let Q=0,ce=Ce.length;Q<ce;Q++)if(oe=Ce[Q],x.format!==En)if(ae!==null)if(De){if(F)if(x.layerUpdates.size>0){let me=uh(oe.width,oe.height,x.format,x.type);for(let ie of x.layerUpdates){let Pe=oe.data.subarray(ie*me/oe.data.BYTES_PER_ELEMENT,(ie+1)*me/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,ie,oe.width,oe.height,1,ae,Pe)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,oe.width,oe.height,ee.depth,ae,oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,ue,oe.width,oe.height,ee.depth,0,oe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,oe.width,oe.height,ee.depth,ae,Re,oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,ue,oe.width,oe.height,ee.depth,0,ae,Re,oe.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{De&&ke&&t.texStorage2D(i.TEXTURE_2D,le,ue,Ce[0].width,Ce[0].height);for(let Q=0,ce=Ce.length;Q<ce;Q++)oe=Ce[Q],x.format!==En?ae!==null?De?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,oe.width,oe.height,ae,oe.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,ue,oe.width,oe.height,0,oe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?F&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,oe.width,oe.height,ae,Re,oe.data):t.texImage2D(i.TEXTURE_2D,Q,ue,oe.width,oe.height,0,ae,Re,oe.data)}else if(x.isDataArrayTexture)if(De){if(ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,ue,ee.width,ee.height,ee.depth),F)if(x.layerUpdates.size>0){let Q=uh(ee.width,ee.height,x.format,x.type);for(let ce of x.layerUpdates){let me=ee.data.subarray(ce*Q/ee.data.BYTES_PER_ELEMENT,(ce+1)*Q/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ce,ee.width,ee.height,1,ae,Re,me)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ae,Re,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ue,ee.width,ee.height,ee.depth,0,ae,Re,ee.data);else if(x.isData3DTexture)De?(ke&&t.texStorage3D(i.TEXTURE_3D,le,ue,ee.width,ee.height,ee.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ae,Re,ee.data)):t.texImage3D(i.TEXTURE_3D,0,ue,ee.width,ee.height,ee.depth,0,ae,Re,ee.data);else if(x.isFramebufferTexture){if(ke)if(De)t.texStorage2D(i.TEXTURE_2D,le,ue,ee.width,ee.height);else{let Q=ee.width,ce=ee.height;for(let me=0;me<le;me++)t.texImage2D(i.TEXTURE_2D,me,ue,Q,ce,0,ae,Re,null),Q>>=1,ce>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),ee.parentNode!==Q){Q.appendChild(ee),d.add(x),Q.onpaint=ce=>{let me=ce.changedElements;for(let ie of d)me.includes(ie.image)&&(ie.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ee);else{let me=i.RGBA,ie=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,me,ie,Pe,ee)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ce.length>0){if(De&&ke){let Q=ht(Ce[0]);t.texStorage2D(i.TEXTURE_2D,le,ue,Q.width,Q.height)}for(let Q=0,ce=Ce.length;Q<ce;Q++)oe=Ce[Q],De?F&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ae,Re,oe):t.texImage2D(i.TEXTURE_2D,Q,ue,ae,Re,oe);x.generateMipmaps=!1}else if(De){if(ke){let Q=ht(ee);t.texStorage2D(i.TEXTURE_2D,le,ue,Q.width,Q.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,Re,ee)}else t.texImage2D(i.TEXTURE_2D,0,ue,ae,Re,ee);m(x)&&b(X),re.__version=se.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Oe(C,x,H){if(x.image.length!==6)return;let X=tt(C,x),$=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+H);let se=n.get($);if($.version!==se.__version||X===!0){t.activeTexture(i.TEXTURE0+H);let re=Ze.getPrimaries(Ze.workingColorSpace),J=x.colorSpace===Mi?null:Ze.getPrimaries(x.colorSpace),ee=x.colorSpace===Mi||re===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let ae=x.isCompressedTexture||x.image[0].isCompressedTexture,Re=x.image[0]&&x.image[0].isDataTexture,ue=[];for(let ie=0;ie<6;ie++)!ae&&!Re?ue[ie]=f(x.image[ie],!0,s.maxCubemapSize):ue[ie]=Re?x.image[ie].image:x.image[ie],ue[ie]=an(x,ue[ie]);let oe=ue[0],Ce=r.convert(x.format,x.colorSpace),De=r.convert(x.type),ke=y(x.internalFormat,Ce,De,x.normalized,x.colorSpace),F=x.isVideoTexture!==!0,le=se.__version===void 0||X===!0,Q=$.dataReady,ce=w(x,oe);Ke(i.TEXTURE_CUBE_MAP,x);let me;if(ae){F&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ce,ke,oe.width,oe.height);for(let ie=0;ie<6;ie++){me=ue[ie].mipmaps;for(let Pe=0;Pe<me.length;Pe++){let Te=me[Pe];x.format!==En?Ce!==null?F?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,0,0,Te.width,Te.height,Ce,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,ke,Te.width,Te.height,0,Te.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,0,0,Te.width,Te.height,Ce,De,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe,ke,Te.width,Te.height,0,Ce,De,Te.data)}}}else{if(me=x.mipmaps,F&&le){me.length>0&&ce++;let ie=ht(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ce,ke,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(Re){F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ue[ie].width,ue[ie].height,Ce,De,ue[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ke,ue[ie].width,ue[ie].height,0,Ce,De,ue[ie].data);for(let Pe=0;Pe<me.length;Pe++){let vt=me[Pe].image[ie].image;F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,0,0,vt.width,vt.height,Ce,De,vt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,ke,vt.width,vt.height,0,Ce,De,vt.data)}}else{F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ce,De,ue[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ke,Ce,De,ue[ie]);for(let Pe=0;Pe<me.length;Pe++){let Te=me[Pe];F?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,0,0,Ce,De,Te.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Pe+1,ke,Ce,De,Te.image[ie])}}}m(x)&&b(i.TEXTURE_CUBE_MAP),se.__version=$.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function ve(C,x,H,X,$,se){let re=r.convert(H.format,H.colorSpace),J=r.convert(H.type),ee=y(H.internalFormat,re,J,H.normalized,H.colorSpace),ae=n.get(x),Re=n.get(H);if(Re.__renderTarget=x,!ae.__hasExternalTextures){let ue=Math.max(1,x.width>>se),oe=Math.max(1,x.height>>se);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,se,ee,ue,oe,x.depth,0,re,J,null):t.texImage2D($,se,ee,ue,oe,0,re,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),zt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,$,Re.__webglTexture,0,It(x)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,$,Re.__webglTexture,se),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ge(C,x,H){if(i.bindRenderbuffer(i.RENDERBUFFER,C),x.depthBuffer){let X=x.depthTexture,$=X&&X.isDepthTexture?X.type:null,se=S(x.stencilBuffer,$),re=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;zt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,It(x),se,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,It(x),se,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,se,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,C)}else{let X=x.textures;for(let $=0;$<X.length;$++){let se=X[$],re=r.convert(se.format,se.colorSpace),J=r.convert(se.type),ee=y(se.internalFormat,re,J,se.normalized,se.colorSpace);zt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,It(x),ee,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,It(x),ee,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ee,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Wt(C,x,H){let X=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",A)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Ke(i.TEXTURE_CUBE_MAP,x.depthTexture);let ae=r.convert(x.depthTexture.format),Re=r.convert(x.depthTexture.type),ue;x.depthTexture.format===ii?ue=i.DEPTH_COMPONENT24:x.depthTexture.format===Wi&&(ue=i.DEPTH24_STENCIL8);for(let oe=0;oe<6;oe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ue,x.width,x.height,0,ae,Re,null)}}else K(x.depthTexture,0);let se=$.__webglTexture,re=It(x),J=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,ee=x.depthTexture.format===Wi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===ii)zt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,J,se,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,ee,J,se,0);else if(x.depthTexture.format===Wi)zt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,J,se,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,ee,J,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function We(C){let x=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){let X=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){let $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=X}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(H)for(let X=0;X<6;X++)Wt(x.__webglFramebuffer[X],C,X);else{let X=C.texture.mipmaps;X&&X.length>0?Wt(x.__webglFramebuffer[0],C,0):Wt(x.__webglFramebuffer,C,0)}else if(H){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=i.createRenderbuffer(),Ge(x.__webglDepthbuffer[X],C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,se)}}else{let X=C.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Ge(x.__webglDepthbuffer,C,!1);else{let $=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,se)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function et(C,x,H){let X=n.get(C);x!==void 0&&ve(X.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&We(C)}function _t(C){let x=C.texture,H=n.get(C),X=n.get(x);C.addEventListener("dispose",v);let $=C.textures,se=C.isWebGLCubeRenderTarget===!0,re=$.length>1;if(re||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=x.version,a.memory.textures++),se){H.__webglFramebuffer=[];for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer[J]=[];for(let ee=0;ee<x.mipmaps.length;ee++)H.__webglFramebuffer[J][ee]=i.createFramebuffer()}else H.__webglFramebuffer[J]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer=[];for(let J=0;J<x.mipmaps.length;J++)H.__webglFramebuffer[J]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(re)for(let J=0,ee=$.length;J<ee;J++){let ae=n.get($[J]);ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&zt(C)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let J=0;J<$.length;J++){let ee=$[J];H.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[J]);let ae=r.convert(ee.format,ee.colorSpace),Re=r.convert(ee.type),ue=y(ee.internalFormat,ae,Re,ee.normalized,ee.colorSpace,C.isXRRenderTarget===!0),oe=It(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,ue,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,H.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Ge(H.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(se){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Ke(i.TEXTURE_CUBE_MAP,x);for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)ve(H.__webglFramebuffer[J][ee],C,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ee);else ve(H.__webglFramebuffer[J],C,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);m(x)&&b(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(re){for(let J=0,ee=$.length;J<ee;J++){let ae=$[J],Re=n.get(ae),ue=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ue=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,Re.__webglTexture),Ke(ue,ae),ve(H.__webglFramebuffer,C,ae,i.COLOR_ATTACHMENT0+J,ue,0),m(ae)&&b(ue)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,X.__webglTexture),Ke(J,x),x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)ve(H.__webglFramebuffer[ee],C,x,i.COLOR_ATTACHMENT0,J,ee);else ve(H.__webglFramebuffer,C,x,i.COLOR_ATTACHMENT0,J,0);m(x)&&b(J),t.unbindTexture()}C.depthBuffer&&We(C)}function $e(C){let x=C.textures;for(let H=0,X=x.length;H<X;H++){let $=x[H];if(m($)){let se=E(C),re=n.get($).__webglTexture;t.bindTexture(se,re),b(se),t.unbindTexture()}}}let Rt=[],Kt=[];function xn(C){if(C.samples>0){if(zt(C)===!1){let x=C.textures,H=C.width,X=C.height,$=i.COLOR_BUFFER_BIT,se=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=n.get(C),J=x.length>1;if(J)for(let ae=0;ae<x.length;ae++)t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer);let ee=C.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let ae=0;ae<x.length;ae++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,re.__webglColorRenderbuffer[ae]);let Re=n.get(x[ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Re,0)}i.blitFramebuffer(0,0,H,X,0,0,H,X,$,i.NEAREST),l===!0&&(Rt.length=0,Kt.length=0,Rt.push(i.COLOR_ATTACHMENT0+ae),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(Rt.push(se),Kt.push(se),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Kt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Rt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let ae=0;ae<x.length;ae++){t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,re.__webglColorRenderbuffer[ae]);let Re=n.get(x[ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,Re,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let x=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function It(C){return Math.min(s.maxSamples,C.samples)}function zt(C){let x=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function B(C){let x=a.render.frame;h.get(C)!==x&&(h.set(C,x),C.update())}function an(C,x){let H=C.colorSpace,X=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==_r&&H!==Mi&&(Ze.getTransfer(H)===lt?(X!==En||$!==wn)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ue("WebGLTextures: Unsupported texture color space:",H)),x}function ht(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=z,this.getTextureUnits=R,this.setTextureUnits=D,this.setTexture2D=K,this.setTexture2DArray=q,this.setTexture3D=j,this.setTextureCube=te,this.rebindTextures=et,this.setupRenderTarget=_t,this.updateRenderTargetMipmap=$e,this.updateMultisampleRenderTarget=xn,this.setupDepthRenderbuffer=We,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=zt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function sx(i,e){function t(n,s=Mi){let r,a=Ze.getTransfer(s);if(n===wn)return i.UNSIGNED_BYTE;if(n===Po)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Io)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Qc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===eh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Kc)return i.BYTE;if(n===jc)return i.SHORT;if(n===Zs)return i.UNSIGNED_SHORT;if(n===Co)return i.INT;if(n===Jn)return i.UNSIGNED_INT;if(n===Kn)return i.FLOAT;if(n===jn)return i.HALF_FLOAT;if(n===th)return i.ALPHA;if(n===nh)return i.RGB;if(n===En)return i.RGBA;if(n===ii)return i.DEPTH_COMPONENT;if(n===Wi)return i.DEPTH_STENCIL;if(n===ih)return i.RED;if(n===Lo)return i.RED_INTEGER;if(n===Xi)return i.RG;if(n===Do)return i.RG_INTEGER;if(n===No)return i.RGBA_INTEGER;if(n===Xr||n===qr||n===Yr||n===$r)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Xr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===$r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Xr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===qr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Yr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===$r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Uo||n===Fo||n===Bo||n===Oo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Uo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Bo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ko||n===zo||n===Ho||n===Vo||n===Go||n===Zr||n===Wo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ko||n===zo)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ho)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Vo)return r.COMPRESSED_R11_EAC;if(n===Go)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Zr)return r.COMPRESSED_RG11_EAC;if(n===Wo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Xo||n===qo||n===Yo||n===$o||n===Zo||n===Jo||n===Ko||n===jo||n===Qo||n===el||n===tl||n===nl||n===il||n===sl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Yo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$o)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Zo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ko)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===jo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===el)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===tl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===il)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rl||n===al||n===ol)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===rl)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ll||n===cl||n===Jr||n===hl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ll)return r.COMPRESSED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Jr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===hl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Js?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function lx(i,e){function t(f,m){f.matrixAutoUpdate===!0&&f.updateMatrix(),m.value.copy(f.matrix)}function n(f,m){m.color.getRGB(f.fogColor.value,lh(i)),m.isFog?(f.fogNear.value=m.near,f.fogFar.value=m.far):m.isFogExp2&&(f.fogDensity.value=m.density)}function s(f,m,b,E,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(f,m):m.isMeshLambertMaterial?(r(f,m),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(f,m),d(f,m)):m.isMeshPhongMaterial?(r(f,m),h(f,m),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(f,m),u(f,m),m.isMeshPhysicalMaterial&&p(f,m,y)):m.isMeshMatcapMaterial?(r(f,m),g(f,m)):m.isMeshDepthMaterial?r(f,m):m.isMeshDistanceMaterial?(r(f,m),_(f,m)):m.isMeshNormalMaterial?r(f,m):m.isLineBasicMaterial?(a(f,m),m.isLineDashedMaterial&&o(f,m)):m.isPointsMaterial?l(f,m,b,E):m.isSpriteMaterial?c(f,m):m.isShadowMaterial?(f.color.value.copy(m.color),f.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(f,m){f.opacity.value=m.opacity,m.color&&f.diffuse.value.copy(m.color),m.emissive&&f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.bumpMap&&(f.bumpMap.value=m.bumpMap,t(m.bumpMap,f.bumpMapTransform),f.bumpScale.value=m.bumpScale,m.side===gn&&(f.bumpScale.value*=-1)),m.normalMap&&(f.normalMap.value=m.normalMap,t(m.normalMap,f.normalMapTransform),f.normalScale.value.copy(m.normalScale),m.side===gn&&f.normalScale.value.negate()),m.displacementMap&&(f.displacementMap.value=m.displacementMap,t(m.displacementMap,f.displacementMapTransform),f.displacementScale.value=m.displacementScale,f.displacementBias.value=m.displacementBias),m.emissiveMap&&(f.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,f.emissiveMapTransform)),m.specularMap&&(f.specularMap.value=m.specularMap,t(m.specularMap,f.specularMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest);let b=e.get(m),E=b.envMap,y=b.envMapRotation;E&&(f.envMap.value=E,f.envMapRotation.value.setFromMatrix4(ox.makeRotationFromEuler(y)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(of),f.reflectivity.value=m.reflectivity,f.ior.value=m.ior,f.refractionRatio.value=m.refractionRatio),m.lightMap&&(f.lightMap.value=m.lightMap,f.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,f.lightMapTransform)),m.aoMap&&(f.aoMap.value=m.aoMap,f.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,f.aoMapTransform))}function a(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform))}function o(f,m){f.dashSize.value=m.dashSize,f.totalSize.value=m.dashSize+m.gapSize,f.scale.value=m.scale}function l(f,m,b,E){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.size.value=m.size*b,f.scale.value=E*.5,m.map&&(f.map.value=m.map,t(m.map,f.uvTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function c(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.rotation.value=m.rotation,m.map&&(f.map.value=m.map,t(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,t(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function h(f,m){f.specular.value.copy(m.specular),f.shininess.value=Math.max(m.shininess,1e-4)}function d(f,m){m.gradientMap&&(f.gradientMap.value=m.gradientMap)}function u(f,m){f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)}function p(f,m,b){f.ior.value=m.ior,m.sheen>0&&(f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),f.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(f.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,f.sheenColorMapTransform)),m.sheenRoughnessMap&&(f.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,f.sheenRoughnessMapTransform))),m.clearcoat>0&&(f.clearcoat.value=m.clearcoat,f.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(f.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,f.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(f.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===gn&&f.clearcoatNormalScale.value.negate())),m.dispersion>0&&(f.dispersion.value=m.dispersion),m.retroreflectivity>0&&(f.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(f.iridescence.value=m.iridescence,f.iridescenceIOR.value=m.iridescenceIOR,f.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(f.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,f.iridescenceMapTransform)),m.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),m.transmission>0&&(f.transmission.value=m.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(f.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,f.transmissionMapTransform)),f.thickness.value=m.thickness,m.thicknessMap&&(f.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=m.attenuationDistance,f.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(f.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(f.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=m.specularIntensity,f.specularColor.value.copy(m.specularColor),m.specularColorMap&&(f.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,f.specularColorMapTransform)),m.specularIntensityMap&&(f.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,m){m.matcap&&(f.matcap.value=m.matcap)}function _(f,m){let b=e.get(m).light;f.referencePosition.value.setFromMatrixPosition(b.matrixWorld),f.nearDistance.value=b.shadow.camera.near,f.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function cx(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,S){let w=S.program;n.uniformBlockBinding(y,w)}function c(y,S){let w=s[y.id];w===void 0&&(f(y),w=h(y),s[y.id]=w,y.addEventListener("dispose",b));let A=S.program;n.updateUBOMapping(y,A);let v=e.render.frame;r[y.id]!==v&&(u(y),r[y.id]=v)}function h(y){let S=d();y.__bindingPointIndex=S;let w=i.createBuffer(),A=y.__size,v=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,A,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,w),w}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ue("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let S=s[y.id],w=y.uniforms,A=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let v=0,T=w.length;v<T;v++){let I=w[v];if(Array.isArray(I))for(let L=0,N=I.length;L<N;L++)p(I[L],v,L,A);else p(I,v,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(y,S,w,A){if(_(y,S,w,A)===!0){let v=y.__offset,T=y.value;if(Array.isArray(T)){let I=0;for(let L=0;L<T.length;L++){let N=T[L],z=m(N);g(N,y.__data,I),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(I+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(T,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,y.__data)}}function g(y,S,w){typeof y=="number"||typeof y=="boolean"?S[0]=y:y.isMatrix3?(S[0]=y.elements[0],S[1]=y.elements[1],S[2]=y.elements[2],S[3]=0,S[4]=y.elements[3],S[5]=y.elements[4],S[6]=y.elements[5],S[7]=0,S[8]=y.elements[6],S[9]=y.elements[7],S[10]=y.elements[8],S[11]=0):ArrayBuffer.isView(y)?S.set(new y.constructor(y.buffer,y.byteOffset,S.length)):y.toArray(S,w)}function _(y,S,w,A){let v=y.value,T=S+"_"+w;if(A[T]===void 0)return typeof v=="number"||typeof v=="boolean"?A[T]=v:ArrayBuffer.isView(v)?A[T]=v.slice():A[T]=v.clone(),!0;{let I=A[T];if(typeof v=="number"||typeof v=="boolean"){if(I!==v)return A[T]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(I.equals(v)===!1)return I.copy(v),!0}}return!1}function f(y){let S=y.uniforms,w=0,A=16;for(let T=0,I=S.length;T<I;T++){let L=Array.isArray(S[T])?S[T]:[S[T]];for(let N=0,z=L.length;N<z;N++){let R=L[N],D=Array.isArray(R.value)?R.value:[R.value];for(let k=0,V=D.length;k<V;k++){let K=D[k],q=m(K),j=w%A,te=j%q.boundary,we=j+te;w+=te,we!==0&&A-we<q.storage&&(w+=A-we),R.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=w,w+=q.storage}}}let v=w%A;return v>0&&(w+=A-v),y.__size=w,y.__cache={},this}function m(y){let S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(S.boundary=16,S.storage=y.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",y),S}function b(y){let S=y.target;S.removeEventListener("dispose",b);let w=a.indexOf(S.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function E(){for(let y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:E}}function ux(){return ci===null&&(ci=new Vs(hx,16,16,Xi,jn),ci.name="DFG_LUT",ci.minFilter=Xt,ci.magFilter=Xt,ci.wrapS=ni,ci.wrapT=ni,ci.generateMipmaps=!1,ci.needsUpdate=!0),ci}var wm,Em,Tm,Am,Rm,Cm,Pm,Im,Lm,Dm,Nm,Um,Fm,Bm,Om,km,zm,Hm,Vm,Gm,Wm,Xm,qm,Ym,$m,Zm,Jm,Km,jm,Qm,e0,t0,n0,i0,s0,r0,a0,o0,l0,c0,h0,u0,d0,f0,p0,m0,g0,_0,v0,x0,y0,b0,S0,M0,w0,E0,T0,A0,R0,C0,P0,I0,L0,D0,N0,U0,F0,B0,O0,k0,z0,H0,V0,G0,W0,X0,q0,Y0,$0,Z0,J0,K0,j0,Q0,eg,tg,ng,ig,sg,rg,ag,og,lg,cg,hg,ug,dg,fg,pg,mg,gg,_g,vg,xg,yg,bg,Sg,Mg,wg,Eg,Tg,Ag,Rg,Cg,Pg,Ig,Lg,Dg,Ng,Ug,Fg,Bg,Og,kg,zg,Hg,Vg,Gg,Wg,Xg,qg,Yg,$g,Zg,Jg,Kg,jg,Qg,e_,t_,n_,i_,Ve,de,hi,pl,s_,tf,Qs,h_,u_,d_,Kr,Dd,vh,xh,yh,bh,f_,fs,gl,_l,w_,nf,wh,sf,rf,af,Bd,Od,kd,zd,Hd,Eh,Th,Ah,Sh,er,fv,pv,Wd,vv,ml,wv,Ev,Av,Cv,Iv,Dv,Uv,kv,Ch,Ph,Yv,Kv,jv,Qv,ex,Qd,jr,Mh,rx,ax,Ih,Lh,ox,of,hx,ci,vl,Ft=ot(()=>{_h();_h();wm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Em=`#ifdef USE_ALPHAHASH
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
#endif`,Tm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Am=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pm=`#ifdef USE_AOMAP
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
#endif`,Im=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lm=`#ifdef USE_BATCHING
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
#endif`,Dm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Nm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Um=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Bm=`#ifdef USE_IRIDESCENCE
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
#endif`,Om=`#ifdef USE_BUMPMAP
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
#endif`,km=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Wm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Xm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,qm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Ym=`#define PI 3.141592653589793
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
} // validated`,$m=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Zm=`vec3 transformedNormal = objectNormal;
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
#endif`,Jm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Km=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,e0="gl_FragColor = linearToOutputTexel( gl_FragColor );",t0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
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
#endif`,r0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
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
#endif`,o0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,l0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,c0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,h0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,u0=`#ifdef USE_GRADIENTMAP
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
}`,d0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,f0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,p0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,m0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,g0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
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
				#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,_0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,b0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
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
#endif`,S0=`uniform sampler2D dfgLUT;
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
		float roughness = material.clearcoatRoughness;
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
	float roughness = material.roughness;
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
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
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
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
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
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
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
}`,M0=`
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,w0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
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
#endif`,E0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,T0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
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
#endif`,A0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,R0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,I0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,L0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,D0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,N0=`#if defined( USE_POINTS_UV )
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
#endif`,U0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,F0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,B0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,O0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,k0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,z0=`#ifdef USE_MORPHTARGETS
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
#endif`,H0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,G0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,W0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Y0=`#ifdef USE_NORMALMAP
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
#endif`,$0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Z0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,J0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,K0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,j0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Q0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,eg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ng=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ig=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ag=`#if NUM_SPOT_LIGHT_COORDS > 0
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
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
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
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
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
#endif`,og=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,cg=`float getShadowMask() {
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
}`,hg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ug=`#ifdef USE_SKINNING
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
#endif`,dg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fg=`#ifdef USE_SKINNING
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
#endif`,pg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_g=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,vg=`#ifdef USE_TRANSMISSION
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
#endif`,xg=`#ifdef USE_TRANSMISSION
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,wg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Eg=`uniform sampler2D t2D;
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
}`,Tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`#include <common>
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
}`,Ig=`#if DEPTH_PACKING == 3200
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
}`,Lg=`#define DISTANCE
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
}`,Dg=`#define DISTANCE
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
}`,Ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ug=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fg=`uniform float scale;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,Og=`#include <common>
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
}`,kg=`uniform vec3 diffuse;
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
}`,zg=`#define LAMBERT
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
}`,Hg=`#define LAMBERT
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
#include <cube_uv_reflection_fragment>
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
}`,Vg=`#define MATCAP
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
}`,Gg=`#define MATCAP
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
}`,Wg=`#define NORMAL
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
}`,Xg=`#define NORMAL
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
}`,qg=`#define PHONG
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
}`,Yg=`#define PHONG
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
#include <cube_uv_reflection_fragment>
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
}`,$g=`#define STANDARD
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
}`,Zg=`#define STANDARD
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
#include <cube_uv_reflection_fragment>
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
}`,Jg=`#define TOON
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
}`,Kg=`#define TOON
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
}`,jg=`uniform float size;
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
}`,Qg=`uniform vec3 diffuse;
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
}`,e_=`#include <common>
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
}`,t_=`uniform vec3 color;
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
}`,n_=`uniform float rotation;
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
}`,i_=`uniform vec3 diffuse;
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
}`,Ve={alphahash_fragment:wm,alphahash_pars_fragment:Em,alphamap_fragment:Tm,alphamap_pars_fragment:Am,alphatest_fragment:Rm,alphatest_pars_fragment:Cm,aomap_fragment:Pm,aomap_pars_fragment:Im,batching_pars_vertex:Lm,batching_vertex:Dm,begin_vertex:Nm,beginnormal_vertex:Um,bsdfs:Fm,iridescence_fragment:Bm,bumpmap_pars_fragment:Om,clipping_planes_fragment:km,clipping_planes_pars_fragment:zm,clipping_planes_pars_vertex:Hm,clipping_planes_vertex:Vm,color_fragment:Gm,color_pars_fragment:Wm,color_pars_vertex:Xm,color_vertex:qm,common:Ym,cube_uv_reflection_fragment:$m,defaultnormal_vertex:Zm,displacementmap_pars_vertex:Jm,displacementmap_vertex:Km,emissivemap_fragment:jm,emissivemap_pars_fragment:Qm,colorspace_fragment:e0,colorspace_pars_fragment:t0,envmap_fragment:n0,envmap_common_pars_fragment:i0,envmap_pars_fragment:s0,envmap_pars_vertex:r0,envmap_physical_pars_fragment:g0,envmap_vertex:a0,fog_vertex:o0,fog_pars_vertex:l0,fog_fragment:c0,fog_pars_fragment:h0,gradientmap_pars_fragment:u0,lightmap_pars_fragment:d0,lights_lambert_fragment:f0,lights_lambert_pars_fragment:p0,lights_pars_begin:m0,lights_toon_fragment:_0,lights_toon_pars_fragment:v0,lights_phong_fragment:x0,lights_phong_pars_fragment:y0,lights_physical_fragment:b0,lights_physical_pars_fragment:S0,lights_fragment_begin:M0,lights_fragment_maps:w0,lights_fragment_end:E0,lightprobes_pars_fragment:T0,logdepthbuf_fragment:A0,logdepthbuf_pars_fragment:R0,logdepthbuf_pars_vertex:C0,logdepthbuf_vertex:P0,map_fragment:I0,map_pars_fragment:L0,map_particle_fragment:D0,map_particle_pars_fragment:N0,metalnessmap_fragment:U0,metalnessmap_pars_fragment:F0,morphinstance_vertex:B0,morphcolor_vertex:O0,morphnormal_vertex:k0,morphtarget_pars_vertex:z0,morphtarget_vertex:H0,normal_fragment_begin:V0,normal_fragment_maps:G0,normal_pars_fragment:W0,normal_pars_vertex:X0,normal_vertex:q0,normalmap_pars_fragment:Y0,clearcoat_normal_fragment_begin:$0,clearcoat_normal_fragment_maps:Z0,clearcoat_pars_fragment:J0,iridescence_pars_fragment:K0,opaque_fragment:j0,packing:Q0,premultiplied_alpha_fragment:eg,project_vertex:tg,dithering_fragment:ng,dithering_pars_fragment:ig,roughnessmap_fragment:sg,roughnessmap_pars_fragment:rg,shadowmap_pars_fragment:ag,shadowmap_pars_vertex:og,shadowmap_vertex:lg,shadowmask_pars_fragment:cg,skinbase_vertex:hg,skinning_pars_vertex:ug,skinning_vertex:dg,skinnormal_vertex:fg,specularmap_fragment:pg,specularmap_pars_fragment:mg,tonemapping_fragment:gg,tonemapping_pars_fragment:_g,transmission_fragment:vg,transmission_pars_fragment:xg,uv_pars_fragment:yg,uv_pars_vertex:bg,uv_vertex:Sg,worldpos_vertex:Mg,background_vert:wg,background_frag:Eg,backgroundCube_vert:Tg,backgroundCube_frag:Ag,cube_vert:Rg,cube_frag:Cg,depth_vert:Pg,depth_frag:Ig,distance_vert:Lg,distance_frag:Dg,equirect_vert:Ng,equirect_frag:Ug,linedashed_vert:Fg,linedashed_frag:Bg,meshbasic_vert:Og,meshbasic_frag:kg,meshlambert_vert:zg,meshlambert_frag:Hg,meshmatcap_vert:Vg,meshmatcap_frag:Gg,meshnormal_vert:Wg,meshnormal_frag:Xg,meshphong_vert:qg,meshphong_frag:Yg,meshphysical_vert:$g,meshphysical_frag:Zg,meshtoon_vert:Jg,meshtoon_frag:Kg,points_vert:jg,points_frag:Qg,shadow_vert:e_,shadow_frag:t_,sprite_vert:n_,sprite_frag:i_},de={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},hi={basic:{uniforms:un([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:un([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new he(0)},envMapIntensity:{value:1}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:un([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:un([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:un([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new he(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:un([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:un([de.points,de.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:un([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:un([de.common,de.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:un([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:un([de.sprite,de.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distance:{uniforms:un([de.common,de.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distance_vert,fragmentShader:Ve.distance_frag},shadow:{uniforms:un([de.lights,de.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};hi.physical={uniforms:un([hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};pl={r:0,b:0,g:0},s_=new yt,tf=new Fe;tf.set(-1,0,0,0,1,0,0,0,1);Qs=4,h_=6,u_=20,d_=256,Kr=new qs,Dd=new he,vh=null,xh=0,yh=0,bh=!1,f_=new P,fs=new P,gl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=f_}=r;vh=this._renderer.getRenderTarget(),xh=this._renderer.getActiveCubeFace(),yh=this._renderer.getActiveMipmapLevel(),bh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ud(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(vh,xh,yh),this._renderer.xr.enabled=bh,e.scissorTest=!1,js(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vh=this._renderer.getRenderTarget(),xh=this._renderer.getActiveCubeFace(),yh=this._renderer.getActiveMipmapLevel(),bh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:jn,format:En,colorSpace:_r,depthBuffer:!1},s=Nd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nd(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=p_(r)),this._blurMaterial=g_(r,e,t),this._ggxMaterial=m_(r,e,t)}return s}_compileMaterial(e){let t=new ye(new Je,e);this._renderer.compile(t,Kr)}_sceneToCubeUV(e,t,n,s,r){let l=new hn(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(Dd),d.toneMapping=Zn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ye(new Sn,new Pt({name:"PMREM.Background",side:gn,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,f=_.material,m=!1,b=e.background;b?b.isColor&&(f.color.copy(b),e.background=null,m=!0):(f.color.copy(Dd),m=!0);for(let E=0;E<6;E++){let y=E%3;y===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):y===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));let S=this._cubeSize;js(s,y*S,E>2?S:0,S,S),d.setRenderTarget(s),m&&d.render(_,l),d.render(e,l)}d.toneMapping=p,d.autoClear=u,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Gi||e.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ud());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;js(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Kr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,p=d*u,{_lodMax:g}=this,_=this._sizeLods[n],f=3*_*(n>g-Qs?n-g+Qs:0),m=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,js(r,f,m,3*_,2*_),s.setRenderTarget(r),s.render(o,Kr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,js(e,f,m,3*_,2*_),s.setRenderTarget(e),s.render(o,Kr)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-Qs?s-this._lodMax+Qs:0),u=4*(this._cubeSize-h);js(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(l,Kr)}};_l=class extends bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Er(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Sn(5,5,5),r=new At({name:"CubemapFromEquirect",uniforms:ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:gn,blending:oi});r.uniforms.tEquirect.value=t;let a=new ye(s,r),o=t.minFilter;return t.minFilter===li&&(t.minFilter=Xt),new Mo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};w_={[Gc]:"LINEAR_TONE_MAPPING",[Wc]:"REINHARD_TONE_MAPPING",[Xc]:"CINEON_TONE_MAPPING",[qc]:"ACES_FILMIC_TONE_MAPPING",[$c]:"AGX_TONE_MAPPING",[Zc]:"NEUTRAL_TONE_MAPPING",[Yc]:"CUSTOM_TONE_MAPPING"};nf=new mn,wh=new Bi(1,1),sf=new yr,rf=new Qa,af=new Er,Bd=[],Od=[],kd=new Float32Array(16),zd=new Float32Array(9),Hd=new Float32Array(4);Eh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=X_(t.type)}},Th=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uv(t.type)}},Ah=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Sh=/(\w+)(\])?(\[|\.)?/g;er=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);dv(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};fv=37297,pv=0;Wd=new Fe;vv={[Gc]:"Linear",[Wc]:"Reinhard",[Xc]:"Cineon",[qc]:"ACESFilmic",[$c]:"AgX",[Zc]:"Neutral",[Yc]:"Custom"};ml=new P;wv=/^[ \t]*#include +<([\w\d./]+)>/gm;Ev=new Map;Av=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;Cv={[cs]:"SHADOWMAP_TYPE_PCF",[Ys]:"SHADOWMAP_TYPE_VSM"};Iv={[Gi]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE",[Gr]:"ENVMAP_TYPE_CUBE_UV"};Dv={[us]:"ENVMAP_MODE_REFRACTION"};Uv={[Vc]:"ENVMAP_BLENDING_MULTIPLY",[ld]:"ENVMAP_BLENDING_MIX",[cd]:"ENVMAP_BLENDING_ADD"};kv=0,Ch=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ph(e),t.set(e,n)),n}},Ph=class{constructor(e){this.id=kv++,this.code=e,this.usedTimes=0}};Yv=0;Kv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jv=`uniform sampler2D shadow_pass;
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
}`,Qv=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],ex=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Qd=new yt,jr=new P,Mh=new P;rx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ax=`
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

}`,Ih=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Tr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new At({vertexShader:rx,fragmentShader:ax,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ye(new Tt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Lh=class extends si{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null,_=typeof XRWebGLBinding<"u",f=new Ih,m={},b=t.getContextAttributes(),E=null,y=null,S=[],w=[],A=new ge,v=null,T=null,I=new hn;I.viewport=new Ct;let L=new hn;L.viewport=new Ct;let N=[I,L],z=new wo,R=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ne=S[Z];return ne===void 0&&(ne=new zs,S[Z]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Z){let ne=S[Z];return ne===void 0&&(ne=new zs,S[Z]=ne),ne.getGripSpace()},this.getHand=function(Z){let ne=S[Z];return ne===void 0&&(ne=new zs,S[Z]=ne),ne.getHandSpace()};function k(Z){let ne=w.indexOf(Z.inputSource);if(ne===-1)return;let be=S[ne];be!==void 0&&(be.update(Z.inputSource,Z.frame,c||a),be.dispatchEvent({type:Z.type,data:Z.inputSource}))}function V(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",K);for(let Z=0;Z<S.length;Z++){let ne=w[Z];ne!==null&&(w[Z]=null,S[Z].disconnect(ne))}R=null,D=null,f.reset();for(let Z in m)delete m[Z];if(e.setRenderTarget(E),p=null,u=null,d=null,s=null,y=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),T!==null){let Z=T.camera;Z.fov=T.fov,Z.zoom=T.zoom,Z.updateProjectionMatrix(),T=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",V),s.addEventListener("inputsourceschange",K),b.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,Oe=null,ve=null;b.depth&&(ve=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=b.stencil?Wi:ii,Oe=b.stencil?Js:Jn);let Ge={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ge),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new bn(u.textureWidth,u.textureHeight,{format:En,type:wn,depthTexture:new Bi(u.textureWidth,u.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let be={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,be),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new bn(p.framebufferWidth,p.framebufferHeight,{format:En,type:wn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),tt.setContext(s),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function K(Z){for(let ne=0;ne<Z.removed.length;ne++){let be=Z.removed[ne],Oe=w.indexOf(be);Oe>=0&&(w[Oe]=null,S[Oe].disconnect(be))}for(let ne=0;ne<Z.added.length;ne++){let be=Z.added[ne],Oe=w.indexOf(be);if(Oe===-1){for(let Ge=0;Ge<S.length;Ge++)if(Ge>=w.length){w.push(be),Oe=Ge;break}else if(w[Ge]===null){w[Ge]=be,Oe=Ge;break}if(Oe===-1)break}let ve=S[Oe];ve&&ve.connect(be)}}let q=new P,j=new P;function te(Z,ne,be){q.setFromMatrixPosition(ne.matrixWorld),j.setFromMatrixPosition(be.matrixWorld);let Oe=q.distanceTo(j),ve=ne.projectionMatrix.elements,Ge=be.projectionMatrix.elements,Wt=ve[14]/(ve[10]-1),We=ve[14]/(ve[10]+1),et=(ve[9]+1)/ve[5],_t=(ve[9]-1)/ve[5],$e=(ve[8]-1)/ve[0],Rt=(Ge[8]+1)/Ge[0],Kt=Wt*$e,xn=Wt*Rt,It=Oe/(-$e+Rt),zt=It*-$e;if(ne.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(zt),Z.translateZ(It),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),ve[10]===-1)Z.projectionMatrix.copy(ne.projectionMatrix),Z.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let B=Wt+It,an=We+It,ht=Kt-zt,C=xn+(Oe-zt),x=et*We/an*B,H=_t*We/an*B;Z.projectionMatrix.makePerspective(ht,C,x,H,B,an),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function we(Z,ne){ne===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ne.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ne=Z.near,be=Z.far;f.texture!==null&&(f.depthNear>0&&(ne=f.depthNear),f.depthFar>0&&(be=f.depthFar)),z.near=L.near=I.near=ne,z.far=L.far=I.far=be,(R!==z.near||D!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),R=z.near,D=z.far),z.layers.mask=Z.layers.mask|6,I.layers.mask=z.layers.mask&-5,L.layers.mask=z.layers.mask&-3;let Oe=Z.parent,ve=z.cameras;we(z,Oe);for(let Ge=0;Ge<ve.length;Ge++)we(ve[Ge],Oe);ve.length===2?te(z,I,L):z.projectionMatrix.copy(I.projectionMatrix),T===null&&Z.isPerspectiveCamera&&(T={camera:Z,fov:Z.fov,zoom:Z.zoom}),Ee(Z,z,Oe)};function Ee(Z,ne,be){be===null?Z.matrix.copy(ne.matrixWorld):(Z.matrix.copy(be.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ne.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ne.projectionMatrix),Z.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ja*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(z)},this.getCameraTexture=function(Z){return m[Z]};let gt=null;function Ke(Z,ne){if(h=ne.getViewerPose(c||a),g=ne,h!==null){let be=h.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let Oe=!1;be.length!==z.cameras.length&&(z.cameras.length=0,Oe=!0);for(let We=0;We<be.length;We++){let et=be[We],_t=null;if(p!==null)_t=p.getViewport(et);else{let Rt=d.getViewSubImage(u,et);_t=Rt.viewport,We===0&&(e.setRenderTargetTextures(y,Rt.colorTexture,Rt.depthStencilTexture),e.setRenderTarget(y))}let $e=N[We];$e===void 0&&($e=new hn,$e.layers.enable(We),$e.viewport=new Ct,N[We]=$e),$e.matrix.fromArray(et.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(et.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(_t.x,_t.y,_t.width,_t.height),We===0&&(z.matrix.copy($e.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Oe===!0&&z.cameras.push($e)}let ve=s.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let We=d.getDepthInformation(be[0]);We&&We.isValid&&We.texture&&f.init(We,s.renderState)}if(ve&&ve.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let We=0;We<be.length;We++){let et=be[We].camera;if(et){let _t=m[et];_t||(_t=new Tr,m[et]=_t);let $e=d.getCameraImage(et);_t.sourceTexture=$e}}}}for(let be=0;be<S.length;be++){let Oe=w[be],ve=S[be];Oe!==null&&ve!==void 0&&ve.update(Oe,ne,c||a)}gt&&gt(Z,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),g=null}let tt=new ef;tt.setAnimationLoop(Ke),this.setAnimationLoop=function(Z){gt=Z},this.dispose=function(){}}},ox=new yt,of=new Fe;of.set(-1,0,0,0,1,0,0,0,1);hx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ci=null;vl=class{constructor(e={}){let{canvas:t=bd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:p=wn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let _=p,f=new Set([No,Do,Lo]),m=new Set([wn,Jn,Zs,Js,Po,Io]),b=new Uint32Array(4),E=new Int32Array(4),y=new P,S=null,w=null,A=[],v=[],T=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,L=!1,N=null,z=null,R=null,D=null;this._outputColorSpace=Qe;let k=0,V=0,K=null,q=-1,j=null,te=new Ct,we=new Ct,Ee=null,gt=new he(0),Ke=0,tt=t.width,Z=t.height,ne=1,be=null,Oe=null,ve=new Ct(0,0,tt,Z),Ge=new Ct(0,0,tt,Z),Wt=!1,We=new Gs,et=!1,_t=!1,$e=new yt,Rt=new P,Kt=new Ct,xn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},It=!1;function zt(){return K===null?ne:1}let B=n;function an(M,U){return t.getContext(M,U)}let ht,C,x,H,X,$,se,re,J,ee,ae,Re,ue,oe,Ce,De,ke,F,le,Q,ce,me,ie;try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",vt,!1),t.addEventListener("webglcontextrestored",rt,!1),t.addEventListener("webglcontextcreationerror",zn,!1),B===null){let U="webgl2";if(B=an(U,M),B===null)throw an(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Pe()}catch(M){throw t.removeEventListener("webglcontextlost",vt,!1),t.removeEventListener("webglcontextrestored",rt,!1),t.removeEventListener("webglcontextcreationerror",zn,!1),Ue("WebGLRenderer: "+M.message),M}function Pe(){ht=new v_(B),ht.init(),ce=new sx(B,ht),C=new l_(B,ht,e,ce),x=new nx(B,ht),C.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),z=B.createFramebuffer(),R=B.createFramebuffer(),D=B.createFramebuffer(),H=new b_(B),X=new Vv,$=new ix(B,ht,x,X,C,ce,H),se=new __(I),re=new Mm(B),me=new a_(B,re),J=new x_(B,re,H,me),ee=new M_(B,J,re,me,H),F=new S_(B,C,$),Ce=new c_(X),ae=new Hv(I,se,ht,C,me,Ce),Re=new lx(I,X),ue=new Wv,oe=new Jv(ht),ke=new r_(I,se,x,ee,g,l),De=new tx(I,ee,C),ie=new cx(B,H,C,x),le=new o_(B,ht,H),Q=new y_(B,ht,H),H.programs=ae.programs,I.capabilities=C,I.extensions=ht,I.properties=X,I.renderLists=ue,I.shadowMap=De,I.state=x,I.info=H}_!==wn&&(T=new E_(_,t.width,t.height,o,s,r));let Te=new Lh(I,B);this.xr=Te,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let M=ht.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=ht.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(M){M!==void 0&&(ne=M,this.setSize(tt,Z,!1))},this.getSize=function(M){return M.set(tt,Z)},this.setSize=function(M,U,Y=!0){if(Te.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}tt=M,Z=U,t.width=Math.floor(M*ne),t.height=Math.floor(U*ne),Y===!0&&(t.style.width=M+"px",t.style.height=U+"px"),T!==null&&T.setSize(t.width,t.height),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(tt*ne,Z*ne).floor()},this.setDrawingBufferSize=function(M,U,Y){tt=M,Z=U,ne=Y,t.width=Math.floor(M*Y),t.height=Math.floor(U*Y),this.setViewport(0,0,M,U)},this.setEffects=function(M){if(_===wn){Ue("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let U=0;U<M.length;U++)if(M[U].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(te)},this.getViewport=function(M){return M.copy(ve)},this.setViewport=function(M,U,Y,G){M.isVector4?ve.set(M.x,M.y,M.z,M.w):ve.set(M,U,Y,G),x.viewport(te.copy(ve).multiplyScalar(ne).round())},this.getScissor=function(M){return M.copy(Ge)},this.setScissor=function(M,U,Y,G){M.isVector4?Ge.set(M.x,M.y,M.z,M.w):Ge.set(M,U,Y,G),x.scissor(we.copy(Ge).multiplyScalar(ne).round())},this.getScissorTest=function(){return Wt},this.setScissorTest=function(M){x.setScissorTest(Wt=M)},this.setOpaqueSort=function(M){be=M},this.setTransparentSort=function(M){Oe=M},this.getClearColor=function(M){return M.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor(...arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,Y=!0){let G=0;if(M){let W=!1;if(K!==null){let pe=K.texture.format;W=f.has(pe)}if(W){let pe=K.texture.type,xe=m.has(pe),fe=ke.getClearColor(),Se=ke.getClearAlpha(),Ae=fe.r,He=fe.g,Xe=fe.b;xe?(b[0]=Ae,b[1]=He,b[2]=Xe,b[3]=Se,B.clearBufferuiv(B.COLOR,0,b)):(E[0]=Ae,E[1]=He,E[2]=Xe,E[3]=Se,B.clearBufferiv(B.COLOR,0,E))}else G|=B.COLOR_BUFFER_BIT}U&&(G|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(G|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&B.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),N=M},this.dispose=function(){t.removeEventListener("webglcontextlost",vt,!1),t.removeEventListener("webglcontextrestored",rt,!1),t.removeEventListener("webglcontextcreationerror",zn,!1),ke.dispose(),ue.dispose(),oe.dispose(),X.dispose(),se.dispose(),ee.dispose(),me.dispose(),ie.dispose(),ae.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",jh),Te.removeEventListener("sessionend",Qh),Qi.stop()};function vt(M){M.preventDefault(),ah("WebGLRenderer: Context Lost."),L=!0}function rt(){ah("WebGLRenderer: Context Restored."),L=!1;let M=H.autoReset,U=De.enabled,Y=De.autoUpdate,G=De.needsUpdate,W=De.type;Pe(),H.autoReset=M,De.enabled=U,De.autoUpdate=Y,De.needsUpdate=G,De.type=W}function zn(M){Ue("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Qn(M){let U=M.target;U.removeEventListener("dispose",Qn),op(U)}function op(M){lp(M),X.remove(M)}function lp(M){let U=X.get(M).programs;U!==void 0&&(U.forEach(function(Y){ae.releaseProgram(Y)}),M.isShaderMaterial&&ae.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,Y,G,W,pe){U===null&&(U=xn);let xe=W.isMesh&&W.matrixWorld.determinantAffine()<0,fe=up(M,U,Y,G,W);x.setMaterial(G,xe);let Se=Y.index,Ae=1;if(G.wireframe===!0){if(Se=J.getWireframeAttribute(Y),Se===void 0)return;Ae=2}let He=Y.drawRange,Xe=Y.attributes.position,Me=He.start*Ae,at=(He.start+He.count)*Ae;pe!==null&&(Me=Math.max(Me,pe.start*Ae),at=Math.min(at,(pe.start+pe.count)*Ae)),Se!==null?(Me=Math.max(Me,0),at=Math.min(at,Se.count)):Xe!=null&&(Me=Math.max(Me,0),at=Math.min(at,Xe.count));let Ht=at-Me;if(Ht<0||Ht===1/0)return;me.setup(W,G,fe,Y,Se);let wt,mt=le;if(Se!==null&&(wt=re.get(Se),mt=Q,mt.setIndex(wt)),W.isMesh)G.wireframe===!0?(x.setLineWidth(G.wireframeLinewidth*zt()),mt.setMode(B.LINES)):mt.setMode(B.TRIANGLES);else if(W.isLine){let on=G.linewidth;on===void 0&&(on=1),x.setLineWidth(on*zt()),W.isLineSegments?mt.setMode(B.LINES):W.isLineLoop?mt.setMode(B.LINE_LOOP):mt.setMode(B.LINE_STRIP)}else W.isPoints?mt.setMode(B.POINTS):W.isSprite&&mt.setMode(B.TRIANGLES);if(W.isBatchedMesh)if(ht.get("WEBGL_multi_draw"))mt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let on=W._multiDrawStarts,_e=W._multiDrawCounts,pn=W._multiDrawCount,je=Se?re.get(Se).bytesPerElement:1,Nn=X.get(G).currentProgram.getUniforms();for(let ei=0;ei<pn;ei++)Nn.setValue(B,"_gl_DrawID",ei),mt.render(on[ei]/je,_e[ei])}else if(W.isInstancedMesh)mt.renderInstances(Me,Ht,W.count);else if(Y.isInstancedBufferGeometry){let on=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,_e=Math.min(Y.instanceCount,on);mt.renderInstances(Me,Ht,_e)}else mt.render(Me,Ht)};function Kh(M,U,Y,G){N!==null&&M.isNodeMaterial&&N.setObject(G,M),et===!0&&Ce.setState(M,Y,!1),M.transparent===!0&&M.side===nt&&M.forceSinglePass===!1?(M.side=gn,M.needsUpdate=!0,ca(M,U,G),M.side=Vi,M.needsUpdate=!0,ca(M,U,G),M.side=nt):ca(M,U,G)}this.compile=function(M,U,Y=null){Y===null&&(Y=M),N!==null&&N.renderStart(M,U,Y),w=oe.get(Y),w.init(U),v.push(w),Y.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),M!==Y&&M.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights(),N!==null&&N.updateLights(w.state.lightsArray),_t=this.localClippingEnabled,et=Ce.init(this.clippingPlanes,_t),et===!0&&Ce.setGlobalState(this.clippingPlanes,U),N!==null&&De.render(w.state.shadowsArray,Y,U);let G=new Set;return M.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let pe=W.material;if(pe)if(Array.isArray(pe))for(let xe=0;xe<pe.length;xe++){let fe=pe[xe];Kh(fe,Y,U,W),G.add(fe)}else Kh(pe,Y,U,W),G.add(pe)}),w=v.pop(),N!==null&&N.renderEnd(),G},this.compileAsync=function(M,U,Y=null){let G=this.compile(M,U,Y);return new Promise(W=>{function pe(){if(G.forEach(function(xe){let Se=X.get(xe).currentProgram;(Se===void 0||Se.isReady())&&G.delete(xe)}),G.size===0){W(M);return}setTimeout(pe,10)}ht.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Jl=null;function cp(M){Jl&&Jl(M)}function jh(){Qi.stop()}function Qh(){Qi.start()}let Qi=new ef;Qi.setAnimationLoop(cp),typeof self<"u"&&Qi.setContext(self),this.setAnimationLoop=function(M){Jl=M,Te.setAnimationLoop(M),M===null?Qi.stop():Qi.start()},Te.addEventListener("sessionstart",jh),Te.addEventListener("sessionend",Qh),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){Ue("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;N!==null&&N.renderStart(M,U);let Y=Te.enabled===!0&&Te.isPresenting===!0,G=T!==null&&(K===null||Y)&&T.begin(I,K);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(U),U=Te.getCamera()),M.isScene===!0&&M.onBeforeRender(I,M,U,K),w=oe.get(M,v.length),w.init(U),w.state.textureUnits=$.getTextureUnits(),v.push(w),$e.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),We.setFromProjectionMatrix($e,Xn,U.reversedDepth),_t=this.localClippingEnabled,et=Ce.init(this.clippingPlanes,_t),S=ue.get(M,A.length),S.init(),A.push(S),Te.enabled===!0&&Te.isPresenting===!0){let xe=I.xr.getDepthSensingMesh();xe!==null&&Kl(xe,U,-1/0,I.sortObjects)}Kl(M,U,0,I.sortObjects),S.finish(),N!==null&&N.updateLights(w.state.lightsArray),I.sortObjects===!0&&S.sort(be,Oe),It=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,It&&ke.addToRenderList(S,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),et===!0&&Ce.beginShadows();let W=w.state.shadowsArray;if(De.render(W,M,U),et===!0&&Ce.endShadows(),(G&&T.hasRenderPass())===!1){let xe=S.opaque,fe=S.transmissive;if(w.setupLights(),U.isArrayCamera){let Se=U.cameras;if(fe.length>0)for(let Ae=0,He=Se.length;Ae<He;Ae++){let Xe=Se[Ae];tu(xe,fe,M,Xe)}It&&ke.render(M);for(let Ae=0,He=Se.length;Ae<He;Ae++){let Xe=Se[Ae];eu(S,M,Xe,Xe.viewport)}}else fe.length>0&&tu(xe,fe,M,U),It&&ke.render(M),eu(S,M,U)}K!==null&&V===0&&($.updateMultisampleRenderTarget(K),$.updateRenderTargetMipmap(K)),G&&T.end(I),M.isScene===!0&&M.onAfterRender(I,M,U),me.resetDefaultState(),q=-1,j=null,v.pop(),v.length>0?(w=v[v.length-1],$.setTextureUnits(w.state.textureUnits),et===!0&&Ce.setGlobalState(I.clippingPlanes,w.state.camera)):w=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,N!==null&&N.renderEnd()};function Kl(M,U,Y,G){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)Y=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLightProbeGrid)w.pushLightProbeGrid(M);else if(M.isLight)w.pushLight(M),M.castShadow&&w.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(We)){G&&Kt.setFromMatrixPosition(M.matrixWorld).applyMatrix4($e);let xe=ee.update(M),fe=M.material;fe.visible&&S.push(M,xe,fe,Y,Kt.z,null,U)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(We))){let xe=ee.update(M),fe=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Kt.copy(M.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Kt.copy(xe.boundingSphere.center)),Kt.applyMatrix4(M.matrixWorld).applyMatrix4($e)),Array.isArray(fe)){let Se=xe.groups;for(let Ae=0,He=Se.length;Ae<He;Ae++){let Xe=Se[Ae],Me=fe[Xe.materialIndex];Me&&Me.visible&&S.push(M,xe,Me,Y,Kt.z,Xe,U)}}else fe.visible&&S.push(M,xe,fe,Y,Kt.z,null,U)}}let pe=M.children;for(let xe=0,fe=pe.length;xe<fe;xe++)Kl(pe[xe],U,Y,G)}function eu(M,U,Y,G){let{opaque:W,transmissive:pe,transparent:xe}=M;w.setupLightsView(Y),et===!0&&Ce.setGlobalState(I.clippingPlanes,Y),G&&x.viewport(te.copy(G)),W.length>0&&la(W,U,Y),pe.length>0&&la(pe,U,Y),xe.length>0&&la(xe,U,Y),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function tu(M,U,Y,G){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[G.id]===void 0){let Me=ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[G.id]=new bn(1,1,{generateMipmaps:!0,type:Me?jn:wn,minFilter:li,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}let pe=w.state.transmissionRenderTarget[G.id],xe=G.viewport||te;pe.setSize(xe.z*I.transmissionResolutionScale,xe.w*I.transmissionResolutionScale);let fe=I.getRenderTarget(),Se=I.getActiveCubeFace(),Ae=I.getActiveMipmapLevel();I.setRenderTarget(pe),I.getClearColor(gt),Ke=I.getClearAlpha(),Ke<1&&I.setClearColor(16777215,.5),I.clear(),It&&ke.render(Y);let He=I.toneMapping;I.toneMapping=Zn;let Xe=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),w.setupLightsView(G),et===!0&&Ce.setGlobalState(I.clippingPlanes,G),la(M,Y,G),$.updateMultisampleRenderTarget(pe),$.updateRenderTargetMipmap(pe),ht.has("WEBGL_multisampled_render_to_texture")===!1){let Me=!1;for(let at=0,Ht=U.length;at<Ht;at++){let wt=U[at],{object:mt,geometry:on,material:_e,group:pn}=wt;if(_e.side===nt&&mt.layers.test(G.layers)){let je=_e.side;_e.side=gn,_e.needsUpdate=!0,nu(mt,Y,G,on,_e,pn),_e.side=je,_e.needsUpdate=!0,Me=!0}}Me===!0&&($.updateMultisampleRenderTarget(pe),$.updateRenderTargetMipmap(pe))}I.setRenderTarget(fe,Se,Ae),I.setClearColor(gt,Ke),Xe!==void 0&&(G.viewport=Xe),I.toneMapping=He}function la(M,U,Y){let G=U.isScene===!0?U.overrideMaterial:null;for(let W=0,pe=M.length;W<pe;W++){let xe=M[W],{object:fe,geometry:Se,group:Ae}=xe,He=xe.material;He.allowOverride===!0&&G!==null&&(He=G),fe.layers.test(Y.layers)&&nu(fe,U,Y,Se,He,Ae)}}function nu(M,U,Y,G,W,pe){N!==null&&W.isNodeMaterial&&N.setObject(M,W),M.onBeforeRender(I,U,Y,G,W,pe),M.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),W.onBeforeRender(I,U,Y,G,M,pe),W.transparent===!0&&W.side===nt&&W.forceSinglePass===!1?(W.side=gn,W.needsUpdate=!0,I.renderBufferDirect(Y,U,G,W,M,pe),W.side=Vi,W.needsUpdate=!0,I.renderBufferDirect(Y,U,G,W,M,pe),W.side=nt):I.renderBufferDirect(Y,U,G,W,M,pe),M.onAfterRender(I,U,Y,G,W,pe)}function ca(M,U,Y){U.isScene!==!0&&(U=xn);let G=X.get(M),W=w.state.lights,pe=w.state.shadowsArray,xe=W.state.version,fe=ae.getParameters(M,W.state,pe,U,Y,w.state.lightProbeGridArray),Se=ae.getProgramCacheKey(fe),Ae=G.programs;G.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let He=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;G.envMap=se.get(M.envMap||G.environment,He),G.envMapRotation=G.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Ae===void 0&&(M.addEventListener("dispose",Qn),Ae=new Map,G.programs=Ae);let Xe=Ae.get(Se);if(Xe!==void 0){if(G.currentProgram===Xe&&G.lightsStateVersion===xe)return su(M,fe),Xe}else fe.uniforms=ae.getUniforms(M),N!==null&&M.isNodeMaterial&&N.build(M,Y,fe),M.onBeforeCompile(fe,I),Xe=ae.acquireProgram(fe,Se),Ae.set(Se,Xe),G.uniforms=fe.uniforms;let Me=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Me.clippingPlanes=Ce.uniform),su(M,fe),G.needsLights=fp(M),G.lightsStateVersion=xe,G.needsLights&&(Me.ambientLightColor.value=W.state.ambient,Me.lightProbe.value=W.state.probe,Me.sunLights.value=W.state.sun,Me.sunLightShadows.value=W.state.sunShadow,Me.directionalLights.value=W.state.directional,Me.directionalLightShadows.value=W.state.directionalShadow,Me.spotLights.value=W.state.spot,Me.spotLightShadows.value=W.state.spotShadow,Me.rectAreaLights.value=W.state.rectArea,Me.ltc_1.value=W.state.rectAreaLTC1,Me.ltc_2.value=W.state.rectAreaLTC2,Me.pointLights.value=W.state.point,Me.pointLightShadows.value=W.state.pointShadow,Me.hemisphereLights.value=W.state.hemi,Me.sunShadowMatrix.value=W.state.sunShadowMatrix,Me.sunShadowCascade.value=W.state.sunShadowCascade,Me.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Me.spotLightMatrix.value=W.state.spotLightMatrix,Me.spotLightMap.value=W.state.spotLightMap,Me.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=w.state.lightProbeGridArray.length>0,G.currentProgram=Xe,G.uniformsList=null,Xe}function iu(M){if(M.uniformsList===null){let U=M.currentProgram.getUniforms();M.uniformsList=er.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function su(M,U){let Y=X.get(M);Y.outputColorSpace=U.outputColorSpace,Y.batching=U.batching,Y.batchingColor=U.batchingColor,Y.instancing=U.instancing,Y.instancingColor=U.instancingColor,Y.instancingMorph=U.instancingMorph,Y.skinning=U.skinning,Y.morphTargets=U.morphTargets,Y.morphNormals=U.morphNormals,Y.morphColors=U.morphColors,Y.morphTargetsCount=U.morphTargetsCount,Y.numClippingPlanes=U.numClippingPlanes,Y.numIntersection=U.numClipIntersection,Y.vertexAlphas=U.vertexAlphas,Y.vertexTangents=U.vertexTangents,Y.toneMapping=U.toneMapping}function hp(M,U){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let Y=0,G=M.length;Y<G;Y++){let W=M[Y];if(W.texture!==null&&W.boundingBox.containsPoint(y))return W}return null}function up(M,U,Y,G,W){U.isScene!==!0&&(U=xn),$.resetTextureUnits();let pe=U.fog,xe=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,fe=K===null?I.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Ze.workingColorSpace,Se=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ae=se.get(G.envMap||xe,Se),He=G.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Xe=!!Y.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Me=!!Y.morphAttributes.position,at=!!Y.morphAttributes.normal,Ht=!!Y.morphAttributes.color,wt=Zn;G.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(wt=I.toneMapping);let mt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,on=mt!==void 0?mt.length:0,_e=X.get(G),pn=w.state.lights;if(et===!0&&(_t===!0||M!==j)){let xt=M===j&&G.id===q;Ce.setState(G,M,xt)}let je=!1;G.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==pn.state.version||_e.outputColorSpace!==fe||W.isBatchedMesh&&_e.batching===!1||!W.isBatchedMesh&&_e.batching===!0||W.isBatchedMesh&&_e.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&_e.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&_e.instancing===!1||!W.isInstancedMesh&&_e.instancing===!0||W.isSkinnedMesh&&_e.skinning===!1||!W.isSkinnedMesh&&_e.skinning===!0||W.isInstancedMesh&&_e.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&_e.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&_e.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&_e.instancingMorph===!1&&W.morphTexture!==null||_e.envMap!==Ae||G.fog===!0&&_e.fog!==pe||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Ce.numPlanes||_e.numIntersection!==Ce.numIntersection)||_e.vertexAlphas!==He||_e.vertexTangents!==Xe||_e.morphTargets!==Me||_e.morphNormals!==at||_e.morphColors!==Ht||_e.toneMapping!==wt||_e.morphTargetsCount!==on||!!_e.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,_e.__version=G.version);let Nn=_e.currentProgram;je===!0&&(Nn=ca(G,U,W),N&&G.isNodeMaterial&&N.onUpdateProgram(G,Nn,_e));let ei=!1,Ti=!1,vs=!1,ft=Nn.getUniforms(),Ut=_e.uniforms;if(x.useProgram(Nn.program)&&(ei=!0,Ti=!0,vs=!0),G.id!==q&&(q=G.id,Ti=!0),_e.needsLights){let xt=hp(w.state.lightProbeGridArray,W);_e.lightProbeGrid!==xt&&(_e.lightProbeGrid=xt,Ti=!0)}if(ei||j!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ft.setValue(B,"projectionMatrix",M.projectionMatrix),ft.setValue(B,"viewMatrix",M.matrixWorldInverse);let Ri=ft.map.cameraPosition;Ri!==void 0&&Ri.setValue(B,Rt.setFromMatrixPosition(M.matrixWorld)),C.logarithmicDepthBuffer&&ft.setValue(B,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ft.setValue(B,"isOrthographic",M.isOrthographicCamera===!0),j!==M&&(j=M,Ti=!0,vs=!0)}if(_e.needsLights&&(pn.state.sunShadowMap.length>0&&ft.setValue(B,"sunShadowMap",pn.state.sunShadowMap,$),pn.state.directionalShadowMap.length>0&&ft.setValue(B,"directionalShadowMap",pn.state.directionalShadowMap,$),pn.state.spotShadowMap.length>0&&ft.setValue(B,"spotShadowMap",pn.state.spotShadowMap,$),pn.state.pointShadowMap.length>0&&ft.setValue(B,"pointShadowMap",pn.state.pointShadowMap,$)),W.isSkinnedMesh){ft.setOptional(B,W,"bindMatrix"),ft.setOptional(B,W,"bindMatrixInverse");let xt=W.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),ft.setValue(B,"boneTexture",xt.boneTexture,$))}W.isBatchedMesh&&(ft.setOptional(B,W,"batchingTexture"),ft.setValue(B,"batchingTexture",W._matricesTexture,$),ft.setOptional(B,W,"batchingIdTexture"),ft.setValue(B,"batchingIdTexture",W._indirectTexture,$),ft.setOptional(B,W,"batchingColorTexture"),W._colorsTexture!==null&&ft.setValue(B,"batchingColorTexture",W._colorsTexture,$));let Ai=Y.morphAttributes;if((Ai.position!==void 0||Ai.normal!==void 0||Ai.color!==void 0)&&F.update(W,Y,Nn),(Ti||_e.receiveShadow!==W.receiveShadow)&&(_e.receiveShadow=W.receiveShadow,ft.setValue(B,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(Ut.envMapIntensity.value=U.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=ux()),Ti){if(ft.setValue(B,"toneMappingExposure",I.toneMappingExposure),_e.needsLights&&dp(Ut,vs),pe&&G.fog===!0&&Re.refreshFogUniforms(Ut,pe),Re.refreshMaterialUniforms(Ut,G,ne,Z,w.state.transmissionRenderTarget[M.id]),_e.needsLights&&_e.lightProbeGrid){let xt=_e.lightProbeGrid;Ut.probesSH.value=xt.texture,Ut.probesMin.value.copy(xt.boundingBox.min),Ut.probesMax.value.copy(xt.boundingBox.max),Ut.probesResolution.value.copy(xt.resolution)}er.upload(B,iu(_e),Ut,$)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(er.upload(B,iu(_e),Ut,$),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ft.setValue(B,"center",W.center),ft.setValue(B,"modelViewMatrix",W.modelViewMatrix),ft.setValue(B,"normalMatrix",W.normalMatrix),ft.setValue(B,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){let xt=G.uniformsGroups;for(let Ri=0,xs=xt.length;Ri<xs;Ri++){let au=xt[Ri];ie.update(au,Nn),ie.bind(au,Nn)}}return Nn}function dp(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.sunLights.needsUpdate=U,M.sunLightShadows.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function fp(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(M,U,Y){let G=X.get(M);G.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),X.get(M.texture).__webglTexture=U,X.get(M.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:Y,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){let Y=X.get(M);Y.__webglFramebuffer=U,Y.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(M,U=0,Y=0){K=M,k=U,V=Y;let G=null,W=!1,pe=!1;if(M){let fe=X.get(M);if(fe.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(B.FRAMEBUFFER,fe.__webglFramebuffer),te.copy(M.viewport),we.copy(M.scissor),Ee=M.scissorTest,x.viewport(te),x.scissor(we),x.setScissorTest(Ee),q=-1;return}else if(fe.__webglFramebuffer===void 0)$.setupRenderTarget(M);else if(fe.__hasExternalTextures)$.rebindTextures(M,X.get(M.texture).__webglTexture,X.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let He=M.depthTexture;if(fe.__boundDepthTexture!==He){if(He!==null&&X.has(He)&&(M.width!==He.image.width||M.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(M)}}let Se=M.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(pe=!0);let Ae=X.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ae[U])?G=Ae[U][Y]:G=Ae[U],W=!0):M.samples>0&&$.useMultisampledRTT(M)===!1?G=X.get(M).__webglMultisampledFramebuffer:Array.isArray(Ae)?G=Ae[Y]:G=Ae,te.copy(M.viewport),we.copy(M.scissor),Ee=M.scissorTest}else te.copy(ve).multiplyScalar(ne).floor(),we.copy(Ge).multiplyScalar(ne).floor(),Ee=Wt;if(Y!==0&&(G=z),x.bindFramebuffer(B.FRAMEBUFFER,G)&&x.drawBuffers(M,G),x.viewport(te),x.scissor(we),x.setScissorTest(Ee),W){let fe=X.get(M.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,Y)}else if(pe){let fe=U;for(let Se=0;Se<M.textures.length;Se++){let Ae=X.get(M.textures[Se]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Se,Ae.__webglTexture,Y,fe)}}else if(M!==null&&Y!==0){let fe=X.get(M.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,fe.__webglTexture,Y)}q=-1};function ru(M){let U=X.get(M);return(U.__readFormat!==M.format||U.__readType!==M.type)&&(U.__readFormat=M.format,U.__readType=M.type,U.__formatReadable=C.textureFormatReadable(M.format),U.__typeReadable=C.textureTypeReadable(M.type)),U}this.readRenderTargetPixels=function(M,U,Y,G,W,pe,xe,fe=0){if(!(M&&M.isWebGLRenderTarget)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=X.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){x.bindFramebuffer(B.FRAMEBUFFER,Se);try{let Ae=M.textures[fe],He=Ae.format,Xe=Ae.type;M.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+fe);let Me=ru(Ae);if(Me.__formatReadable===!1){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Me.__typeReadable===!1){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-G&&Y>=0&&Y<=M.height-W&&B.readPixels(U,Y,G,W,ce.convert(He),ce.convert(Xe),pe)}finally{let Ae=K!==null?X.get(K).__webglFramebuffer:null;x.bindFramebuffer(B.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(M,U,Y,G,W,pe,xe,fe=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=X.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se)if(U>=0&&U<=M.width-G&&Y>=0&&Y<=M.height-W){x.bindFramebuffer(B.FRAMEBUFFER,Se);let Ae=M.textures[fe],He=Ae.format,Xe=Ae.type;M.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+fe);let Me=ru(Ae);if(Me.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Me.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let at=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,at),B.bufferData(B.PIXEL_PACK_BUFFER,pe.byteLength,B.STREAM_READ),B.readPixels(U,Y,G,W,ce.convert(He),ce.convert(Xe),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let Ht=K!==null?X.get(K).__webglFramebuffer:null;x.bindFramebuffer(B.FRAMEBUFFER,Ht);let wt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Md(B,wt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,at),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,pe),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(at),B.deleteSync(wt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,Y=0){let G=Math.pow(2,-Y),W=Math.floor(M.image.width*G),pe=Math.floor(M.image.height*G),xe=U!==null?U.x:0,fe=U!==null?U.y:0;$.setTexture2D(M,0),B.copyTexSubImage2D(B.TEXTURE_2D,Y,0,0,xe,fe,W,pe),x.unbindTexture()},this.copyTextureToTexture=function(M,U,Y=null,G=null,W=0,pe=0){let xe,fe,Se,Ae,He,Xe,Me,at,Ht,wt=M.isCompressedTexture?M.mipmaps[pe]:M.image;if(Y!==null)xe=Y.max.x-Y.min.x,fe=Y.max.y-Y.min.y,Se=Y.isBox3?Y.max.z-Y.min.z:1,Ae=Y.min.x,He=Y.min.y,Xe=Y.isBox3?Y.min.z:0;else{let Ut=Math.pow(2,-W);xe=Math.floor(wt.width*Ut),fe=Math.floor(wt.height*Ut),M.isDataArrayTexture?Se=wt.depth:M.isData3DTexture?Se=Math.floor(wt.depth*Ut):Se=1,Ae=0,He=0,Xe=0}G!==null?(Me=G.x,at=G.y,Ht=G.z):(Me=0,at=0,Ht=0);let mt=ce.convert(U.format),on=ce.convert(U.type),_e;U.isData3DTexture?($.setTexture3D(U,0),_e=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?($.setTexture2DArray(U,0),_e=B.TEXTURE_2D_ARRAY):($.setTexture2D(U,0),_e=B.TEXTURE_2D),x.activeTexture(B.TEXTURE0),x.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),x.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),x.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);let pn=x.getParameter(B.UNPACK_ROW_LENGTH),je=x.getParameter(B.UNPACK_IMAGE_HEIGHT),Nn=x.getParameter(B.UNPACK_SKIP_PIXELS),ei=x.getParameter(B.UNPACK_SKIP_ROWS),Ti=x.getParameter(B.UNPACK_SKIP_IMAGES);x.pixelStorei(B.UNPACK_ROW_LENGTH,wt.width),x.pixelStorei(B.UNPACK_IMAGE_HEIGHT,wt.height),x.pixelStorei(B.UNPACK_SKIP_PIXELS,Ae),x.pixelStorei(B.UNPACK_SKIP_ROWS,He),x.pixelStorei(B.UNPACK_SKIP_IMAGES,Xe);let vs=M.isDataArrayTexture||M.isData3DTexture,ft=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){let Ut=X.get(M),Ai=X.get(U),xt=X.get(Ut.__renderTarget),Ri=X.get(Ai.__renderTarget);x.bindFramebuffer(B.READ_FRAMEBUFFER,xt.__webglFramebuffer),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,Ri.__webglFramebuffer);for(let xs=0;xs<Se;xs++)vs&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,X.get(M).__webglTexture,W,Xe+xs),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,X.get(U).__webglTexture,pe,Ht+xs)),B.blitFramebuffer(Ae,He,xe,fe,Me,at,xe,fe,B.DEPTH_BUFFER_BIT,B.NEAREST);x.bindFramebuffer(B.READ_FRAMEBUFFER,null),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(W!==0||M.isRenderTargetTexture||X.has(M)){let Ut=X.get(M),Ai=X.get(U);x.bindFramebuffer(B.READ_FRAMEBUFFER,R),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,D);for(let xt=0;xt<Se;xt++)vs?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ut.__webglTexture,W,Xe+xt):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ut.__webglTexture,W),ft?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ai.__webglTexture,pe,Ht+xt):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ai.__webglTexture,pe),W!==0?B.blitFramebuffer(Ae,He,xe,fe,Me,at,xe,fe,B.COLOR_BUFFER_BIT,B.NEAREST):ft?B.copyTexSubImage3D(_e,pe,Me,at,Ht+xt,Ae,He,xe,fe):B.copyTexSubImage2D(_e,pe,Me,at,Ae,He,xe,fe);x.bindFramebuffer(B.READ_FRAMEBUFFER,null),x.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else ft?M.isDataTexture||M.isData3DTexture?B.texSubImage3D(_e,pe,Me,at,Ht,xe,fe,Se,mt,on,wt.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(_e,pe,Me,at,Ht,xe,fe,Se,mt,wt.data):B.texSubImage3D(_e,pe,Me,at,Ht,xe,fe,Se,mt,on,wt):M.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,pe,Me,at,xe,fe,mt,on,wt.data):M.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,pe,Me,at,wt.width,wt.height,mt,wt.data):B.texSubImage2D(B.TEXTURE_2D,pe,Me,at,xe,fe,mt,on,wt);x.pixelStorei(B.UNPACK_ROW_LENGTH,pn),x.pixelStorei(B.UNPACK_IMAGE_HEIGHT,je),x.pixelStorei(B.UNPACK_SKIP_PIXELS,Nn),x.pixelStorei(B.UNPACK_SKIP_ROWS,ei),x.pixelStorei(B.UNPACK_SKIP_IMAGES,Ti),pe===0&&U.generateMipmaps&&B.generateMipmap(_e),x.unbindTexture()},this.initRenderTarget=function(M){X.get(M).__webglFramebuffer===void 0&&$.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?$.setTextureCube(M,0):M.isData3DTexture?$.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?$.setTexture2DArray(M,0):$.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){k=0,V=0,K=null,x.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}}});var bl,lf,Nt,In,nr,cf,_n,hf,Sl=ot(()=>{bl=[{id:"open",name:"Open",dur:20},{id:"noor",name:"Noor",dur:65},{id:"gap",name:"Gap",dur:60},{id:"idea",name:"Idea",dur:45},{id:"lab",name:"Renders",dur:55},{id:"photos",name:"Labels",dur:40},{id:"recipe",name:"Plan",dur:185},{id:"proof",name:"Evidence",dur:70},{id:"phone",name:"Phone",dur:45},{id:"close",name:"Close",dur:15}],lf={calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',wifi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><path d="M4 4l16 16"/></svg>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M9 9c0-1.2 1-2 2-2s2 .8 2 2c0 1.4-2 1.6-2 3"/></svg>',dot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg>'},Nt=(i,e="var(--ink)")=>`<p class="eyebrow"><i class="dot" style="--c:${e}"></i>${i}</p>`,In=(i,e="")=>`<span class="chip ${e?"chip--"+e:""}">${i}</span>`,nr=(i,e)=>`<li><span class="ic" aria-hidden="true">${lf[i]||lf.dot}</span><span>${e}</span></li>`,cf=[{k:"Challenge",t:"Hack-Nation x World Bank Youth Summit. Small AI for Development Hackathon, Challenge 04, Annex B Agriculture. Concept note, October 2026."},{k:"FAO",t:'FAO, 2 December 2019. "Up to 40 percent of global food crops are lost to plant pests and diseases."',href:"https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/"},{k:"Plantwise",t:"Plantwise (CABI), 17 March 2022. Coffee leaf rust: spotting and managing Hemileia vastatrix.",href:"https://blog.plantwise.org/2022/03/17/coffee-leaf-rust-spotting-and-managing-hemileia-vastatrix/"},{k:"PlantVillage test",t:"Mohanty, Hughes, Salathe. Using deep learning for image-based plant disease detection. Frontiers in Plant Science, 2016. 54,306 images; 99.35% on a held-out set, 31.4% on images from other conditions.",href:"https://arxiv.org/abs/1604.03169"},{k:"BRACOL",t:"Krohling, Esgario, Ventura. BRACOL: a Brazilian Arabica coffee leaf images dataset. Mendeley Data, 2019. 1,747 leaf images from five phone models. CC BY 4.0. Our own check: every photo is 2048 by 1024 pixels, and the 24 we looked at show one leaf on a plain light background (ShhS repository, data/bracol/README.md).",href:"https://data.mendeley.com/datasets/yy2k5y8mxg/1"},{k:"Kenya set",t:"Arabica coffee leaf images dataset for coffee leaf disease detection and classification. Data in Brief, 2021. 58,555 leaf images from Mutira, Kirinyaga County, Kenya. Fujifilm X-T4 camera. CC BY.",href:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8165403/"},{k:"Gemma 4",t:"Gemma 4 E2B-it model card, Google DeepMind. Apache 2.0. 2.3 billion effective parameters (5.1 billion with embeddings). Takes text, image and audio. Made for phones and laptops.",href:"https://huggingface.co/collections/google/gemma-4"},{k:"Klein et al.",t:"Klein, Waller, Pirk, Palubicki, Tester, Michels. Synthetic data at scale: a development model to efficiently leverage machine learning in agriculture. Frontiers in Plant Science, 2024. A tomato-disease classifier trained only on renders: 26 of 29 real images right (89.6%) after a threshold fix. CC BY.",href:"https://doi.org/10.3389/fpls.2024.1360113"},{k:"Review",t:"He, Li, Chen, Raj, Fleming, Chen, Karkee, Xiang. From 2D image synthesis to 3D scene generation: a comprehensive review of synthetic data for agricultural vision. Artificial Intelligence Review, 2026. Accepted manuscript.",href:"https://doi.org/10.1007/s10462-026-11658-8"},{k:"Tesla AI Day",t:"Tesla AI Day, August 2021. Simulation for rare scenes and auto-labeled clips for training."},{k:"Datasets named in the brief",t:"PlantVillage, PlantDoc, Cassava Leaf Disease and iBean (Makerere), BRACOL, NASA POWER, CHIRPS, iSDAsoil, Mozilla Common Voice, FLEURS, Meta MMS."},{k:"Figures",t:"All diagrams on this page were drawn from scratch for this talk. We read the review paper and did not copy its figures (it is licensed CC BY-NC-ND). The 3D farm and leaf are a Three.js preview. The real renders come from Blender."}],_n=[{id:"open",chapter:"open",scene:"farm",side:"left",env:"dawn",seam:{v:.5,mode:"follow",show:!0},html:`${Nt("Small AI for Development \xB7 Challenge 04 \xB7 Agriculture","var(--healthy)")}
      <p class="panel__body">One question. Do coffee leaves rendered in Blender help a small model find rust on real photos? We add them to real photos, then test on photos the model never saw. The model runs offline on Noor's phone.</p>
      <p class="panel__small">Drag the line. Left is a photo. Right is the label a render gives for free.</p>
      <div class="chips"><button class="btn" data-go="next" type="button">Start the talk <span aria-hidden="true">&rarr;</span></button></div>`,notes:"Hi, we are ShhS. Our question: do leaves rendered in Blender help a small model spot coffee rust? We add them to real photos and test on photos the model never saw. Drag the line to see a photo on the left and its label on the right."},{id:"noor-1",chapter:"noor",scene:"farm",side:"left",env:"dawn",seam:{v:1,mode:"free",show:!1},html:`${Nt("The challenge \xB7 Agriculture","var(--real)")}
      <h2 class="panel__title">Meet Noor.</h2>
      <p class="panel__body">Noor farms 2 hectares in the highlands. Coffee grows on the upper slope. Maize and beans grow below.</p>
      <p class="panel__small">Noor is fictional. Her constraints are real (Challenge 04 brief).</p>`,notes:"The brief gives us Noor. 2 hectares, coffee on the upper slope, maize and beans below. She is fictional, but her limits come from real World Bank work."},{id:"noor-2",chapter:"noor",scene:"farm",side:"left",env:"dawn",seam:{v:1,mode:"free",show:!1},html:`${Nt("The problem","var(--real)")}
      <h2 class="panel__title">Her coffee yield dropped. She cannot say why.</h2>
      <ul class="facts">
        ${nr("calendar","The extension officer visits the sub-county <b>twice a year</b> at best.")}
        ${nr("wifi","There is <b>no Wi-Fi</b> at home. She buys 3G data bundles.")}
        ${nr("search","A search needs a name for what she sees. She <b>does not have one</b>.")}
      </ul>`,notes:"She sees spots on her leaves but has no name for them. The officer comes twice a year. A search engine needs words she does not have, and an SMS cannot see a leaf."},{id:"noor-3",chapter:"noor",scene:"farm",side:"left",env:"dawn",wide:!0,seam:{v:.5,mode:"free",show:!0},html:`${Nt("Problem statement, as the brief asks","var(--early)")}
      <p class="statement">Because of this tool, Noor will <mark>spot leaf rust while the spots are still small</mark>, not after the leaves drop. We know because the officer visits twice a year, and rust travels on wind and rain in between.</p>
      <p class="src">Visits: Challenge 04 brief, Annex B.<br>
      Up to 40% of global food crops are lost to pests and diseases each year (<a href="https://www.fao.org/newsroom/detail/FAO-launches-2020-as-the-UN-s-International-Year-of-Plant-Health/" target="_blank" rel="noopener noreferrer">FAO, 2019</a>).<br>
      Rust starts as small yellow spots, spreads on wind and rain, and makes leaves fall early (<a href="https://blog.plantwise.org/2022/03/17/coffee-leaf-rust-spotting-and-managing-hemileia-vastatrix/" target="_blank" rel="noopener noreferrer">Plantwise, 2022</a>).</p>`,notes:'This is our one-sentence problem statement, in the format the brief asks. The evidence: the officer comes twice a year, up to 40% of crops are lost to pests and diseases, and rust spreads on wind and rain. We will check "small spots" in the test, by severity.'},{id:"gap-1",chapter:"gap",scene:"gap",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Data gap","var(--real)")}
      <h2 class="panel__title">The photos that exist are not Noor's photos.</h2>
      <p class="panel__body">Most crop-disease sets show one leaf on a plain background. The brief warns about this. In a classic test, a model scored 99.35% on its own test set and 31.4% on photos taken under other conditions.</p>
      <figure class="chart" role="img" aria-label="Accuracy of one model on two test sets: 99.35 percent on its own lab test set, 31.4 percent on photos from other conditions.">
        <div class="chart__row" title="Lab test set: 99.35% correct"><span class="chart__name">Lab test set</span><span class="chart__track"><i style="--v:99.35"></i></span><b>99.35%</b></div>
        <div class="chart__row" title="Photos from other conditions: 31.4% correct"><span class="chart__name">Other conditions</span><span class="chart__track"><i style="--v:31.4"></i></span><b>31.4%</b></div>
        <div class="chart__axis" aria-hidden="true"><span>0</span><span>50</span><span>100%</span></div>
      </figure>
      <p class="src">Mohanty, Hughes and Salathe, 2016. PlantVillage, 54,306 images. <a href="https://arxiv.org/abs/1604.03169" target="_blank" rel="noopener noreferrer">Paper</a></p>`,notes:"The brief says it too: most disease sets are studio photos on plain backgrounds. In a well-known test, a model scored 99% in the lab and 31% on photos from other conditions."},{id:"gap-2",chapter:"gap",scene:"gap",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Data gap","var(--real)")}
      <h2 class="panel__title">Even the coffee sets are leaf close-ups.</h2>
      <p class="panel__body">BRACOL has 1,747 Arabica leaf photos. The ones we checked each show one leaf on a plain light background. A Kenyan set has 58,555 leaf photos from one plantation, shot with a Fujifilm X-T4.</p>
      <p class="panel__body">Noor needs a model that has seen mild rust, shade, rain and an ordinary phone camera. Labeled photos like that take seasons to collect.</p>
      <div class="chips">${In('<i style="--c:var(--real)"></i>BRACOL \xB7 CC BY 4.0',"real")}${In('<i style="--c:var(--real)"></i>Kenya set \xB7 CC BY',"real")}</div>`,notes:"Even the coffee sets are close-ups of single leaves on plain backgrounds. We looked at 24 BRACOL photos by eye to check. What Noor needs, mild rust in shade and rain on an ordinary phone, takes whole seasons to collect by hand."},{id:"idea-1",chapter:"idea",scene:"idea",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("The idea","var(--sim)")}
      <h2 class="panel__title">Self-driving teams do not wait for the rare crash.</h2>
      <p class="panel__body">They simulate roads, rain and pedestrians. The simulator knows where everything is, so the labels are free. Tesla described this at its 2021 AI Day. We borrow the trick, on a much smaller scale.</p>`,notes:"Self-driving teams train on simulated roads for the cases that are rare or dangerous, and the simulator labels everything for free. Tesla showed this at AI Day in 2021. We borrow the idea, but at a much smaller scale."},{id:"idea-2",chapter:"idea",scene:"idea",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Our version","var(--sim)")}
      <h2 class="panel__title">We render the <em>leaf</em>.</h2>
      <p class="panel__body">In Blender we build a 3D coffee leaf with rust spots we control. Light, camera and background change on every image. Each image keeps its label. We add the renders to real photos and check if the model gets better.</p>
      <div class="chips">${In('<i style="--c:#fff"></i>Blender renders',"sim")}${In('<i style="--c:#fff"></i>Free labels',"sim")}${In('<i style="--c:var(--real)"></i>Tested on real photos',"real")}</div>
      <p class="panel__small">It may not help. That is why we test it. Every rendered image is labeled synthetic, as the brief requires.</p>`,notes:"Our idea in one line: render coffee leaves in Blender, add them to real photos, and test if the model improves. We do not model how rust spreads. We only render images. It might not help, and the test will tell us."},{id:"lab",chapter:"lab",scene:"farm",side:"left",env:"dawn",seam:{v:.78,mode:"free",show:!0},html:`${Nt("Render lab \xB7 preview","var(--sim)")}
      <h2 class="panel__title">Turn the knobs.</h2>
      <p class="panel__body">In Blender, the rust, the light and the camera change on every image. Try the same knobs here. Click a shrub to pick another one.</p>
      <div class="lab">
        <label class="lab__slider"><span class="lab__label">Rust severity</span><input type="range" min="0" max="4" step="1" value="2" name="severity" autocomplete="off" data-ctl="level" aria-label="Rust severity, 0 to 4"><output data-out="level" aria-live="off">2</output></label>
        <div class="lab__group" role="group" aria-label="Light">
          <span class="lab__label">Light</span>
          <div class="lab__lights">
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="dawn" aria-pressed="true">Dawn</button>
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="noon" aria-pressed="false">Noon</button>
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="overcast" aria-pressed="false">Overcast</button>
            <button class="btn btn--soft" type="button" data-ctl="light" data-light="late" aria-pressed="false">Late sun</button>
          </div>
        </div>
        <div class="lab__row"><button class="btn btn--soft" data-ctl="view" type="button">New view</button><button class="btn btn--soft" data-ctl="spot" type="button">New shrub</button></div>
        <p class="lab__insight" aria-live="polite" aria-atomic="true">Label saved with this image: <b data-out="label">rust yes \xB7 severity 2</b></p>
      </div>
      <p class="panel__small">Preview in Three.js. The real renders come from Blender.</p>`,notes:"This is a Three.js preview of the knobs we turn in Blender. Slide the severity from 0 to 4. Change the light. Pick a new shrub or a new view. In Blender, each change would be a new image with its own label."},{id:"pairs",chapter:"photos",scene:"farm",side:"left",env:"dawn",seam:{v:.5,mode:"free",show:!0},html:`${Nt("Synthetic dataset","var(--sim)")}
      <h2 class="panel__title">Every render comes with its label.</h2>
      <p class="panel__body">The scene knows which leaves have rust, so each image is saved with its label: rust yes or no. A render can also give a mask of where the rust is. Our first test needs only yes or no.</p>
      <div class="chips"><button class="btn" data-ctl="shutter" type="button">Take a render</button><button class="btn btn--soft" data-ctl="batch" type="button">Make 12</button><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>
      <div class="pairs" id="pairStrip"></div>
      <p class="panel__small" aria-live="polite" aria-atomic="true"><b data-out="pairs">0</b> made. Preview in Three.js. The real renders come from Blender.</p>`,notes:"Each render is saved with its label. A render can also output a mask of the rust, but our first test only needs yes or no. The real images come from Blender. This page only previews them."},{id:"rec-1",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Step 1 \xB7 real photos only","var(--real)")}
      <h2 class="panel__title">Fine-tune on the real photos.</h2>
      <p class="panel__body">We start with Gemma 4 E2B, a model made to run on phones and laptops. First we ask it as it comes: does this coffee leaf have rust? Then we fine-tune it on 1,225 BRACOL leaves and score it on 261 it never saw.</p>
      <p class="panel__small">We fine-tune with LoRA. It trains a thin layer on top and leaves the base model alone.</p>`,notes:"Step 1 is the baseline. Gemma 4 E2B is a small multimodal model from Google, with 2.3 billion effective parameters. We ask it a yes or no question about each leaf, first with no training, then after LoRA fine-tuning on the real BRACOL training photos. We score it on 261 test leaves that no run trains on."},{id:"rec-2",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Step 2 \xB7 make the synthetic leaves","var(--sim)")}
      <h2 class="panel__title">Build the leaf in Blender.</h2>
      <p class="panel__body">A 3D coffee leaf with a rust material. How many spots, how big and where all change from image to image. We use the same 0 to 4 severity scale as BRACOL, so we can compare by severity.</p>
      <div class="chips"><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>`,notes:"Step 2 is the new part. In Blender we build a coffee leaf with a rust material. We control the spots and give each image a severity from 0 to 4, the same scale BRACOL uses. We do not model how rust spreads."},{id:"rec-3",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Step 2 \xB7 render","var(--sim)")}
      <h2 class="panel__title">A virtual camera takes the images.</h2>
      <p class="panel__body">Rust, light, camera angle, distance and background change on every image. Each image is saved with its label.</p>
      <div class="chips"><span class="chip chip--sim"><i style="--c:#fff"></i>Synthetic</span></div>`,notes:"The virtual camera changes the rust, the light, the angle, the distance and the background on every shot. Each image is saved with its label, rust yes or no."},{id:"rec-4",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Step 2 \xB7 save","var(--sim)")}
      <h2 class="panel__title">A folder of images and one table.</h2>
      <p class="panel__body">The table has three columns: image, rust and split. Our training script already reads this format, so the renders plug straight in.</p>
      <p class="panel__small">How many renders we make is still open.</p>`,notes:"The output is a folder of images and a CSV with image, rust and split. Our training script takes that CSV as an option. How many renders we make is still open. Our timing script assumes about 2,000, and that is a guess."},{id:"rec-5",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Steps 3 and 4 \xB7 two new runs","var(--ink)")}
      <h2 class="panel__title">Renders only. Then renders plus real.</h2>
      <p class="panel__body">Step 3 trains on the renders alone and tests on BRACOL. Step 4 trains on the renders plus the real photos. The model and the test stay the same as in step 1, so the scores compare.</p>`,notes:"Step 3 asks: can renders alone teach rust? Step 4 asks: do renders add to real photos? Everything else stays the same as step 1, so the three scores are comparable."},{id:"rec-6",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("The scarcity curve","var(--real)")}
      <h2 class="panel__title">Do renders help most when real photos are few?</h2>
      <p class="panel__body">We repeat steps 1 and 4 with 10, 25, 50 and 100% of the real training photos. That is 128, 312, 614 and 1,225 leaves. Each size runs with 3 random draws.</p>`,notes:"The scarcity curve is our main figure. Farmers will rarely have 1,200 labeled leaves. If renders help, we expect it to show most at 10 or 25 percent. We do not know yet. Each size runs with 3 seeds so we can see the spread."},{id:"rec-7",chapter:"recipe",scene:"pipeline",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Field test and phone","var(--real)")}
      <h2 class="panel__title">Then real farm photos. Then a phone.</h2>
      <p class="panel__body">BRACOL is plain-background leaf photos, so we also test on real farm photos. Then we convert the best model for Android and try it on a phone.</p>
      <p class="panel__small">Both steps are still to do.</p>`,notes:"BRACOL is not field photos, so a good score there is not enough. The field test uses real farm photos. After that we convert the best model for Android. Size, speed and battery are not measured yet."},{id:"rec-8",chapter:"recipe",scene:"pipeline",side:"right",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("The plan, end to end","var(--sim)")}
      <h2 class="panel__title">Render. Add. Test on real.</h2>
      <p class="panel__body">Render leaves with free labels. Add them to the real photos. Train the same small model. Score it on photos it never saw, then on a farm, then on a phone.</p>`,notes:"Put together: we change one thing, the training data, and keep the model and the test fixed. Then we read the curve. If the renders do not help, we say so."},{id:"proof-1",chapter:"proof",scene:"proof",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Evidence plan","var(--real)")}
      <h2 class="panel__title">Will the renders help?</h2>
      <ul class="facts">
        ${nr("dot","Every run is scored on the same <b>261 BRACOL test leaves</b>. No run trains on them.")}
        ${nr("dot",'We report <b>AUC</b> with a 95% interval, rust found by severity, false alarms, and how often it says "not sure".')}
        ${nr("dot","One study trained on renders only and got <b>26 of 29</b> real tomato images right. A tiny test: encouraging, not proof (Klein et al., 2024).")}
      </ul>
      <div class="chips">${In('<i style="--c:#9aa3c6"></i>Zero-shot')}${In('<i style="--c:var(--sim)"></i>Renders only')}${In('<i style="--c:var(--real)"></i>Real only')}${In('<i style="--c:linear-gradient(var(--sim) 50%, var(--real) 50%)"></i>Real + renders')}</div>
      <p class="panel__small">No results yet. This is the plan.</p>`,notes:"Every bar is empty on purpose. We have no results yet. All runs are scored on the same 261 locked BRACOL test leaves, with a 95% interval, rust found by severity, false alarms and the not-sure rate. If asked, be straight: the evidence is mixed. In one watermelon study, gains stopped near 1 real photo for every 10 synthetic ones, so more renders are not always better (He et al., 2026 review). A different 261 leaves pick the settings, so the test stays clean. We will say what we find, even if it is nothing."},{id:"proof-2",chapter:"proof",scene:"proof",side:"left",env:"studio",grid:!0,wide:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("The brief scores this","var(--alarm)")}
      <h2 class="panel__title">What our data does not cover.</h2>
      <ol class="gaps">
        <li><b>Farm photos.</b> BRACOL leaves sit on a plain light background. The farm test is still to do.</li>
        <li><b>Other diseases.</b> The label is rust yes or no. Leaf miner, phoma and cercospora all count as no.</li>
        <li><b>Clean renders.</b> Real leaves have dirt, water drops and damage that our renders may lack.</li>
        <li><b>A small test.</b> 261 leaves, 102 of them with rust. The intervals will be wide.</li>
        <li><b>Phones.</b> BRACOL used 5 phone models. Noor's phone and the Android build are untested.</li>
        <li><b>Languages.</b> Swahili first. A native speaker still has to check the Swahili text.</li>
      </ol>`,notes:"The brief scores what our data does not cover, so here it is: no farm photos in BRACOL, only rust as a label, renders that may look too clean, a small test set with wide intervals, untested phones, and Swahili text that needs a native speaker."},{id:"hands-1",chapter:"phone",scene:"phone",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Small AI rules","var(--healthy)")}
      <h2 class="panel__title">Point, shoot, read. No signal needed.</h2>
      <p class="panel__body">Gemma 4 E2B is made to run on a phone. We will convert our best model for Android and try it. It answers rust, no rust or not sure. Close to the line between yes and no, it says not sure, and a person decides.</p>
      <div class="chips">${In('<i style="--c:var(--healthy)"></i>Offline')}${In('<i style="--c:var(--healthy)"></i>Gemma 4 E2B')}${In('<i style="--c:var(--healthy)"></i>Swahili first')}${In('<i style="--c:var(--healthy)"></i>A person decides')}</div>
      <p class="panel__small">File size and speed on a phone are not measured yet. Why AI and not SMS or search? An SMS cannot see a leaf, and a search needs a name Noor does not have.</p>`,notes:"It runs offline on the phone, answers rust, no rust or not sure, and a person always decides. Not sure is built in: we pick the margin on validation photos so the answers it does give are right 95% of the time, and we report how many photos it still answers. The Swahili text is shown first. We have not measured file size or speed on a phone yet."},{id:"hands-2",chapter:"phone",scene:"phone",side:"left",env:"studio",grid:!0,seam:{v:1,mode:"free",show:!1},html:`${Nt("Optional \xB7 after the first test","var(--healthy)")}
      <h2 class="panel__title">A cooperative hub for a second opinion.</h2>
      <p class="panel__body">A laptop at the cooperative could run a bigger copy of the model. Phones would connect over local Wi-Fi, with no internet. It is not part of our first test. Photos leave the phone only if Noor agrees.</p>
      <div class="chips"><button class="btn btn--soft" data-ctl="mode" data-mode="phone" type="button" aria-pressed="true">Phone only</button><button class="btn btn--soft" data-ctl="mode" data-mode="hub" type="button" aria-pressed="false">Phone + hub</button></div>`,notes:"The core works with the phone alone. This hub is an idea for later, and it is not in our first test. Where a cooperative has a laptop, phones could connect over local Wi-Fi for a second opinion from a bigger model."},{id:"close",chapter:"close",scene:"farm",side:"left",env:"dawn",wide:!0,seam:{v:.5,mode:"follow",show:!0},html:`${Nt("Our take","var(--healthy)")}
      <h2 class="panel__title">Localizing AI means localizing the data.</h2>
      <p class="panel__body">Change the crop, the leaf, the light and the phone in the render. Keep the test. Another farm, another country.</p>
      <div class="chips"><button class="btn" data-go="sources" type="button">Sources and scorecard</button><button class="btn btn--soft" data-go="first" type="button">Start over</button></div>
      <p class="panel__small">ShhS \xB7 Small AI for Development Hackathon \xB7 Challenge 04, Agriculture</p>`,notes:"Our take on localizing AI: it means localizing the data. Swap the crop, the leaf, the light and the phone in the render, and keep the test. Thank you. Sources and a judging scorecard are one click away."}],hf=[["Built solution (Small AI fidelity)","25%","This talk presents a plan. Built so far: the BRACOL audit and frozen split, training and scoring scripts for Gemma 4 E2B, and a timing test. The renders and the runs come next. The phone rules are in the Phone step."],["Development relevance and impact","20%","Noor and the problem statement; a farm-photo test."],["Data grounding","15%","The data gap; BRACOL named with size, license and split; what the data does not cover."],["Evidence it works","15%","Four runs and a scarcity curve on one locked test; no results yet."],["Clarity, design and value of AI","15%","An SMS cannot see a leaf; a search needs a name Noor lacks."],["Scalability and replication","10%","Change the crop and the leaf in Blender; keep the test."],["Responsible AI, data and safety","Pass/fail","Rust, no rust or not sure; a person decides; renders labeled synthetic."]]});function ct(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Ml(i,e){let t=i*374761393+e*668265263;return t=(t^t>>>13)*1274126177,((t^t>>>16)>>>0)/4294967296}function Dh(i,e){let t=Math.floor(i),n=Math.floor(e),s=i-t,r=e-n,a=s*s*(3-2*s),o=r*r*(3-2*r),l=Ml(t,n),c=Ml(t+1,n),h=Ml(t,n+1),d=Ml(t+1,n+1);return ir(ir(l,c,a),ir(h,d,a),o)}function df(i,e,t=4){let n=0,s=.5,r=1;for(let a=0;a<t;a++)n+=s*Dh(i*r,e*r),r*=2,s*=.5;return n}var ut,ir,wl,uf,El,bt,Ne,qi,nn=ot(()=>{ut=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),ir=(i,e,t)=>i+(e-i)*t,wl=(i,e,t)=>{let n=ut((t-i)/(e-i));return n*n*(3-2*n)},uf=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,El=i=>1-Math.pow(1-i,3),bt=(i,e,t,n)=>ir(i,e,1-Math.exp(-t*n));Ne=(i,e,t)=>e+(t-e)*i(),qi=Math.PI*2});function ff(i=256){let e=ct(1337),t=new Uint8Array(i*i*4);function n(h){let d=new Float32Array(h*h);for(let u=0;u<d.length;u++)d[u]=e();return d}let s=h=>h*h*(3-2*h);function r(h,d,u,p){let g=u*d,_=p*d,f=Math.floor(g),m=Math.floor(_),b=s(g-f),E=s(_-m),y=(f%d+d)%d,S=(y+1)%d,w=(m%d+d)%d,A=(w+1)%d,v=h[w*d+y],T=h[w*d+S],I=h[A*d+y],L=h[A*d+S];return(v+(T-v)*b)*(1-E)+(I+(L-I)*b)*E}let a=[8,16,32,64],o=()=>a.map(h=>({p:h,lat:n(h)})),l=[o(),o(),o()];for(let h=0;h<i;h++)for(let d=0;d<i;d++){let u=d/i,p=h/i,g=[0,0,0];for(let f=0;f<3;f++){let m=.5,b=0,E=0;for(let{p:y,lat:S}of l[f]){let w=r(S,y,u,p);f===2&&(w=1-Math.abs(w*2-1)),b+=w*m,E+=m,m*=.5}g[f]=b/E}let _=(h*i+d)*4;t[_]=Math.min(255,g[0]*255*1.15-20),t[_+1]=Math.min(255,g[1]*255*1.15-20),t[_+2]=g[2]*255,t[_+3]=e()*255}let c=new Vs(t,i,i,En);return c.wrapS=c.wrapT=Fs,c.magFilter=Xt,c.minFilter=li,c.generateMipmaps=!0,c.needsUpdate=!0,c}var pf=ot(()=>{Ft();nn()});function dx(i){let e=mf[i]||mf.dawn;return{sun:new P(...e.sun).normalize(),sunColor:new he(e.sunColor),sky:new he(e.sky),ground:new he(e.ground),fog:new he(e.fog),fogD:e.fogD,amb:e.amb,glow:e.glow,dom:e.dom.map(t=>new he(t))}}function gf(){dt.uSunDir.value.copy(Be.sun).normalize(),dt.uSunColor.value.copy(Be.sunColor),dt.uSkyColor.value.copy(Be.sky),dt.uGroundColor.value.copy(Be.ground),dt.uFogColor.value.copy(Be.fog),dt.uFogDensity.value=Be.fogD,dt.uAmbient.value=Be.amb}function _f(){let i=document.documentElement.style;for(let e=0;e<4;e++)i.setProperty(`--sky-${e}`,"#"+Be.dom[e].getHexString(Qe));i.setProperty("--sky-glow",Be.glow.toFixed(3))}function Yi(i,e=!1){it=dx(i),Tl=!1,e&&(Be.sun.copy(it.sun),Be.sunColor.copy(it.sunColor),Be.sky.copy(it.sky),Be.ground.copy(it.ground),Be.fog.copy(it.fog),Be.fogD=it.fogD,Be.amb=it.amb,Be.glow=it.glow,Be.dom.forEach((t,n)=>t.copy(it.dom[n])),gf(),_f(),Tl=!0)}function vf(i){if(!it||Tl)return;let e=2.4;Be.sun.x=bt(Be.sun.x,it.sun.x,e,i),Be.sun.y=bt(Be.sun.y,it.sun.y,e,i),Be.sun.z=bt(Be.sun.z,it.sun.z,e,i);let t=(s,r)=>{s.r=bt(s.r,r.r,e,i),s.g=bt(s.g,r.g,e,i),s.b=bt(s.b,r.b,e,i)};t(Be.sunColor,it.sunColor),t(Be.sky,it.sky),t(Be.ground,it.ground),t(Be.fog,it.fog);for(let s=0;s<4;s++)t(Be.dom[s],it.dom[s]);Be.fogD=bt(Be.fogD,it.fogD,e,i),Be.amb=bt(Be.amb,it.amb,e,i),Be.glow=bt(Be.glow,it.glow,e,i),gf(),_f(),ea(Be.fog,it.fog)+ea(Be.sky,it.sky)+ea(Be.sunColor,it.sunColor)+Be.sun.distanceTo(it.sun)+Math.abs(Be.amb-it.amb)+Math.abs(Be.fogD-it.fogD)*100+Math.abs(Be.glow-it.glow)+ea(Be.dom[0],it.dom[0])+ea(Be.dom[2],it.dom[2])<.002&&(Tl=!0)}function xf(){return Be.dom.map(i=>"#"+i.getHexString(Qe))}var dt,mf,Be,it,Tl,ea,$i=ot(()=>{Ft();nn();pf();dt={uTime:{value:0},uSeam:{value:.5},uRes:{value:new ge(1,1)},uSunDir:{value:new P(-.78,.52,-.22).normalize()},uSunColor:{value:new he("#ffd2a1")},uSkyColor:{value:new he("#a9bef0")},uGroundColor:{value:new he("#8d7468")},uFogColor:{value:new he("#f3e4e4")},uFogDensity:{value:.0019},uAmbient:{value:.62},uWind:{value:new P(.8,0,.35)},uLabelGround:{value:new he("#2a1b52")},uNoiseTex:{value:ff(256)}},mf={dawn:{sun:[-.78,.52,-.22],sunColor:"#ffd8ae",sky:"#a9bef0",ground:"#a07c66",fog:"#f3e4e4",fogD:.0019,amb:.56,glow:.8,dom:["#b3c4ef","#d2d8f3","#ebdff0","#f3e4e4"]},noon:{sun:[-.2,.92,.25],sunColor:"#fff6e8",sky:"#9fc1f2",ground:"#8a7a6a",fog:"#e9eef8",fogD:.0017,amb:.7,glow:0,dom:["#8fb4ee","#b9d0f3","#dbe6f7","#e9eef8"]},overcast:{sun:[.1,.8,.3],sunColor:"#e6e8f2",sky:"#c3c9dc",ground:"#8b8a92",fog:"#dfe2ec",fogD:.0034,amb:.95,glow:0,dom:["#c3c9dc","#d0d4e3","#dadde9","#dfe2ec"]},late:{sun:[.7,.2,.45],sunColor:"#ffb27a",sky:"#9c9ee0",ground:"#7a6258",fog:"#f1d5d0",fogD:.0022,amb:.52,glow:.6,dom:["#9fa4e6","#c9bde8","#ecc7d0","#f1d5d0"]},studio:{sun:[-.35,.8,.5],sunColor:"#ffffff",sky:"#dfe5f5",ground:"#b9bfd6",fog:"#eef1f8",fogD:9e-4,amb:.95,glow:0,dom:["#f6f8fd","#eef1f8","#eef1f8","#eef1f8"]}},Be={sun:new P,sunColor:new he,sky:new he,ground:new he,fog:new he,fogD:.004,amb:.6,glow:0,dom:[0,1,2,3].map(()=>new he)},it=null,Tl=!0,ea=(i,e)=>Math.abs(i.r-e.r)+Math.abs(i.g-e.g)+Math.abs(i.b-e.b)});var Al,yf=ot(()=>{$i();nn();Al=class{constructor(e){this.el=e,this.value=1,this.target=1,this.mode="free",this.dragging=!1,this.pointerX=.5,this.visible=!0,this.onChange=null,this._bind(),this._write()}_bind(){let e=this.el,t=s=>{let r=ut(s.clientX/window.innerWidth,.02,.98);this.value=this.target=r,this.mode="free",this._write()};e.addEventListener("pointerdown",s=>{this.dragging=!0,e.classList.add("is-drag"),e.setPointerCapture(s.pointerId),t(s)}),e.addEventListener("pointermove",s=>{this.dragging&&t(s)});let n=s=>{this.dragging=!1,e.classList.remove("is-drag"),e.hasPointerCapture(s.pointerId)&&e.releasePointerCapture(s.pointerId)};e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n),e.addEventListener("keydown",s=>{s.key==="ArrowLeft"&&(this.nudge(-.03),s.preventDefault(),s.stopPropagation()),s.key==="ArrowRight"&&(this.nudge(.03),s.preventDefault(),s.stopPropagation())}),window.addEventListener("pointermove",s=>{this.pointerX=s.clientX/window.innerWidth},{passive:!0})}nudge(e){this.mode="free",this.target=ut(this.target+e,.02,.98)}go(e,{mode:t="free",instant:n=!1}={}){this.mode=t,t==="free"&&(this.target=e),n&&(this.value=this.target=e,this._write())}flip(){this.mode="free",this.target=this.value>.5?0:1}show(e){this.visible=e,document.body.dataset.seam=e?"on":"off"}update(e){if(!this.dragging)if(this.mode==="follow"){let t=ut(.5+(this.pointerX-.5)*.85,.14,.86);this.target=t,this.value=bt(this.value,this.target,3.2,e)}else this.value=bt(this.value,this.target,4,e),Math.abs(this.value-this.target)<4e-4&&(this.value=this.target);this._write()}_write(e=!1){dt.uSeam.value=this.value;let t=window.innerWidth,n=ut(this.value*t,0,t),s=`${n.toFixed(1)}|${t}`;if(!e&&s===this._last)return;this._last=s,document.documentElement.style.setProperty("--seam-x",`${n.toFixed(1)}px`);let r=ut(n,28,t-28);this.el.style.left=`${r.toFixed(1)}px`,this.el.setAttribute("aria-valuenow",String(Math.round(this.value*100)))}}});var Rl,bf=ot(()=>{Ft();nn();Rl=class{constructor(e){this.camera=e,this.pos=new P(0,30,160),this.target=new P(0,10,0),this.fov=32,this.from=null,this.to=null,this.t=1,this.dur=1.6,this.arc=0,this.px=0,this.py=0,this.parallax=1,this.drift=1,this.reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this._right=new P,this._up=new P,this._fwd=new P,this._tmp=new P,this.flying=!1}jumpTo(e){this.pos.fromArray(e.pos),this.target.fromArray(e.target),this.fov=e.fov??32,this.parallax=e.parallax??1,this.drift=e.drift??1,this.t=1,this.flying=!1}flyTo(e,t=1.8){if(this.reduced){this.jumpTo(e);return}this.from={pos:this.pos.clone(),target:this.target.clone(),fov:this.fov},this.to={pos:new P().fromArray(e.pos),target:new P().fromArray(e.target),fov:e.fov??32},this.parallax=e.parallax??1,this.drift=e.drift??1,this.t=0,this.dur=t,this.arc=Math.min(this.from.pos.distanceTo(this.to.pos)*.07,10),this.flying=!0}update(e,t,n){if(this.t<1){this.t=Math.min(1,this.t+e/this.dur);let p=uf(this.t);this.pos.lerpVectors(this.from.pos,this.to.pos,p),this.pos.y+=Math.sin(Math.PI*p)*this.arc,this.target.lerpVectors(this.from.target,this.to.target,p),this.fov=this.from.fov+(this.to.fov-this.from.fov)*p,this.t>=1&&(this.flying=!1)}this.px=bt(this.px,n.x,2.4,e),this.py=bt(this.py,n.y,2.4,e);let s=this.camera;s.position.copy(this.pos),s.lookAt(this.target),s.updateMatrixWorld(),this._right.setFromMatrixColumn(s.matrixWorld,0),this._up.setFromMatrixColumn(s.matrixWorld,1),this._fwd.subVectors(this.target,this.pos);let r=this._fwd.length(),a=this.reduced?0:this.parallax,o=Math.min(r*.035,6)*a,l=this.reduced?0:this.drift,c=Math.sin(t*.17)*.012*r*l,h=Math.sin(t*.13+1.3)*.006*r*l;this._tmp.copy(this._right).multiplyScalar(-this.px*o+c).addScaledVector(this._up,this.py*o*.6+h),s.position.add(this._tmp),s.lookAt(this.target);let d=ut(1.6/s.aspect,1,1.9),u=2*Math.atan(Math.tan(this.fov*Math.PI/360)*d)*180/Math.PI;Math.abs(s.fov-u)>.001&&(s.fov=u,s.updateProjectionMatrix())}}});var Cl,Sf=ot(()=>{Ft();Cl=class{constructor(e,t){this.root=e,this.camera=t,this.items=new Map,this._v=new P,this.w=window.innerWidth,this.h=window.innerHeight}resize(e,t){this.w=e,this.h=t}add(e){this.items.has(e.id)&&this.remove(e.id);let t=document.createElement("div");t.className=`tag tag--${e.side||"r"}${e.big?" tag--big":""}${e.dark?" tag--dark":""}`,e.color&&t.style.setProperty("--c",e.color),t.style.setProperty("--len",`${e.len??26}px`),t.innerHTML=`<i class="tag__dot"></i><span class="tag__body"><i class="tag__line"></i><span class="tag__text">${e.text}${e.sub?`<small>${e.sub}</small>`:""}</span></span>`,this.root.appendChild(t);let n={spec:e,el:t,on:!1,x:0,y:0,shown:!1};return this.items.set(e.id,n),n}remove(e){let t=this.items.get(e);t&&(t.el.remove(),this.items.delete(e))}only(e){let t=new Set(e);for(let[n,s]of this.items)s.on=t.has(n),s.el.classList.toggle("is-on",s.on)}clear(){this.only([])}setText(e,t,n){let s=this.items.get(e);if(!s)return;let r=s.el.querySelector(".tag__text");r.innerHTML=`${t}${n?`<small>${n}</small>`:""}`}update(){let e=this.camera;for(let t of this.items.values()){if(!t.on)continue;let n=typeof t.spec.anchor=="function"?t.spec.anchor():t.spec.anchor;this._v.copy(n).project(e);let s=this._v.z<1&&this._v.z>-1&&Math.abs(this._v.x)<1.15&&Math.abs(this._v.y)<1.15,r=(this._v.x*.5+.5)*this.w,a=(-this._v.y*.5+.5)*this.h;s?(t.el.style.transform=`translate3d(${r.toFixed(1)}px,${a.toFixed(1)}px,0)`,t.shown||(t.shown=!0,t.el.style.visibility="visible")):t.shown&&(t.shown=!1,t.el.style.visibility="hidden")}}}});var fx,px,Pl,Mf=ot(()=>{Sl();fx=/(Gemma 4 E2B|BRACOL|Blender|LoRA)(?![^<]*>)/g,px=i=>i.replace(fx,'<span class="nobr" translate="no">$1</span>'),Pl=class{constructor(e){this.app=e,this.root=document.getElementById("panels"),this.els=[],this.active=-1,_n.forEach(t=>{let n=document.createElement("section");n.className="panel",n.dataset.side=t.side,t.wide&&(n.dataset.wide="1"),n.id=`beat-${t.id}`,n.innerHTML=`<div class="panel__card">${px(t.html)}</div>`,n.setAttribute("inert",""),n.setAttribute("aria-hidden","true"),n.querySelectorAll(".panel__card > *").forEach((s,r)=>s.style.setProperty("--i",r)),this.root.appendChild(n),this.els.push(n)}),this._bind(),this._sheet()}show(e){if(this.active===e)return;let t=this.els[this.active];t&&(t.classList.remove("is-active"),t.setAttribute("inert",""),t.setAttribute("aria-hidden","true"));let n=this.els[e];n.classList.add("is-active"),n.removeAttribute("inert"),n.removeAttribute("aria-hidden"),this.active=e;let s=document.getElementById("srLive");if(s){let r=n.querySelector(".panel__title, .statement");s.textContent=`Step ${e+1} of ${_n.length}: ${r?r.textContent.trim():"Introduction"}`}}_q(e){return this.els[this.active]?this.els[this.active].querySelectorAll(e):[]}out(e,t){this._q(`[data-out="${e}"]`).forEach(n=>{n.textContent!==t&&(n.textContent=t)})}setRange(e,t){this._q(`input[data-ctl="${e}"]`).forEach(n=>{document.activeElement!==n&&(n.value=t)})}busy(e){this._q('[data-ctl="shutter"], [data-ctl="batch"]').forEach(t=>{t.disabled=e})}addPair(e,t,n){let s=this.root.querySelector("#pairStrip");if(!s)return;let r=document.createElement("figure");r.className="pair",e.setAttribute("aria-hidden","true"),t.setAttribute("aria-hidden","true");let a=document.createElement("div");a.className="pair__img",a.appendChild(e);let o=document.createElement("div");o.className="pair__img pair__img--mask",o.appendChild(t);let l=document.createElement("figcaption");for(l.textContent=n,r.append(a,o,l),s.prepend(r);s.children.length>12;)s.lastChild.remove()}_bind(){let e=this.root;e.addEventListener("click",t=>{let n=t.target.closest("[data-go]");if(n){this.app.action(n.dataset.go);return}let s=t.target.closest("button[data-ctl]");if(s){if(s.dataset.ctl==="mode"){this.app.control("mode",s,{mode:s.dataset.mode});return}this.app.control(s.dataset.ctl,s)}}),e.addEventListener("input",t=>{let n=t.target.closest("input[data-ctl]");n&&this.app.control(n.dataset.ctl,n)})}_sheet(){let e=document.createElement("div");e.className="sheet",e.id="sheet",e.hidden=!0,e.setAttribute("role","dialog"),e.setAttribute("aria-label","Sources and judging scorecard"),e.innerHTML=`<div class="sheet__card" data-scroll>
      <button class="sheet__close btn btn--soft" type="button" data-go="closeSheet">Close <kbd>Esc</kbd></button>
      <h2 class="panel__title">Where each judging criterion is answered</h2>
      <table class="score"><thead><tr><th>Criterion</th><th>Weight</th><th>Where in this talk</th></tr></thead><tbody>
        ${hf.map(t=>`<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td></tr>`).join("")}
      </tbody></table>
      <h3 class="sheet__h">Sources</h3>
      <ul class="srclist">${cf.map(t=>`<li><b>${t.k}.</b> ${t.t}${t.href?` <a href="${t.href}" target="_blank" rel="noopener noreferrer">Open</a>`:""}</li>`).join("")}</ul>
    </div>`,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&this.app.action("closeSheet");let n=t.target.closest("[data-go]");n&&this.app.action(n.dataset.go)}),this.sheet=e}_behind(){return document.querySelectorAll(".stage, .hud, .panels, .rail, .notes, .keys")}openSheet(){this._opener=document.activeElement,this._behind().forEach(e=>{e.inert=!0}),this.sheet.hidden=!1,this.sheet.querySelector("button").focus()}closeSheet(){this.sheet.hidden||(this.sheet.hidden=!0,this._behind().forEach(e=>{e.inert=!1}),this._opener&&this._opener.focus&&this._opener.focus())}get sheetOpen(){return!this.sheet.hidden}}});var Il,wf=ot(()=>{Sl();Il=class{constructor(){this.ol=document.getElementById("railChapters"),this.segs=bl.map(e=>{let t=document.createElement("li");t.style.flex=`${e.dur} 1 0`;let n=document.createElement("span");return n.className="rail__seg",n.innerHTML=`<span class="rail__name">${e.name}</span>`,t.appendChild(n),this.ol.appendChild(t),n})}update(e){let t=_n[e],n=bl.findIndex(a=>a.id===t.chapter),s=_n.filter(a=>a.chapter===t.chapter),r=s.findIndex(a=>a.id===t.id)+1;this.segs.forEach((a,o)=>{a.classList.toggle("is-past",o<n),a.classList.toggle("is-current",o===n),a.style.setProperty("--pf",o<n?"1":o===n?String(r/s.length):"0"),o===n?a.setAttribute("aria-current","step"):a.removeAttribute("aria-current")}),document.getElementById("hudChapter").textContent=bl[n].name}}});var Ll,Ef=ot(()=>{Ll=class{constructor(e){this.app=e,this._wheel={acc:0,last:0,locked:!1,timer:0},window.addEventListener("keydown",a=>this._key(a)),window.addEventListener("wheel",a=>this._onWheel(a),{passive:!1});let t=0,n=0,s=0,r=!1;window.addEventListener("touchstart",a=>{if(a.target.closest("[data-scroll], input, .seam")){r=!0;return}t=a.touches[0].clientX,n=a.touches[0].clientY,s=performance.now(),r=!1},{passive:!0}),window.addEventListener("touchend",a=>{if(r)return;let o=a.changedTouches[0],l=o.clientX-t,c=o.clientY-n;performance.now()-s>700||(Math.abs(l)>60&&Math.abs(l)>Math.abs(c)*1.4?l<0?e.next():e.prev():Math.abs(c)>70&&Math.abs(c)>Math.abs(l)*1.4&&(c<0?e.next():e.prev()))},{passive:!0})}_key(e){let t=this.app;if(e.metaKey||e.ctrlKey||e.altKey)return;let n=e.target;if(n.matches?.("input[type=text], textarea, select"))return;if(e.key==="Escape"){t.action("closeSheet"),t.action("closeOverlays");return}let r=n.matches?.("input[type=range], .seam"),a=n.matches?.("button, a");switch(e.key){case"ArrowRight":case"PageDown":if(r&&e.key==="ArrowRight")return;e.preventDefault(),t.next();break;case"ArrowLeft":case"PageUp":if(r&&e.key==="ArrowLeft")return;e.preventDefault(),t.prev();break;case"ArrowDown":if(r)return;e.preventDefault(),t.next();break;case"ArrowUp":if(r)return;e.preventDefault(),t.prev();break;case" ":case"Enter":if(a)return;e.preventDefault(),t.next();break;case"Home":e.preventDefault(),t.go(0);break;case"End":e.preventDefault(),t.go(t.count-1);break;case"s":case"S":t.seam.flip();break;case"n":case"N":t.toggleNotes();break;case"f":case"F":t.fullscreen();break;case"q":case"Q":t.setLite(!t.lite);break;case"p":case"P":t.togglePause();break;case"?":t.toggleKeys();break;default:break}}_onWheel(e){if(e.target.closest?.("[data-scroll], input, .notes")||this.app.panels.sheetOpen)return;e.preventDefault();let t=this._wheel,n=performance.now();n-t.last>220&&(t.acc=0),t.last=n;let s=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;if(t.locked){Math.abs(s)>4&&(clearTimeout(t.timer),t.timer=setTimeout(()=>{t.locked=!1},240));return}t.acc+=s,Math.abs(t.acc)>70&&(t.acc>0?this.app.next():this.app.prev(),t.acc=0,t.locked=!0,clearTimeout(t.timer),t.timer=setTimeout(()=>{t.locked=!1},650))}}});var dn,Zi=ot(()=>{Ft();dn=class{constructor(e){this.app=e,this.group=new Ie,this.group.visible=!1,this.poses={},this.built=!1}build(){this.built=!0}enter(e,t){}leave(){}update(e,t,n){}control(e,t,n){}pick(e,t){}resize(e,t){}setLite(e){}pose(e){return this.poses[e]}}});var Ln,wi,ui,Tf,ta=ot(()=>{Ln=`
uniform float uTime;
uniform float uSeam;        // label world starts at this fraction of the canvas width
uniform vec2  uRes;         // drawing buffer size in pixels
uniform vec3  uSunDir;      // unit vector pointing at the sun
uniform vec3  uSunColor;
uniform vec3  uSkyColor;
uniform vec3  uGroundColor;
uniform vec3  uFogColor;
uniform float uFogDensity;
uniform float uAmbient;
uniform vec3  uWind;        // xz direction scaled by strength, y unused
uniform vec3  uLabelGround; // class color for soil and background
`,wi=`
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x), mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
// baked 4-octave noise: one texture fetch instead of sixteen hashes
uniform sampler2D uNoiseTex;
float fbm(vec2 p) { return texture2D(uNoiseTex, p * 0.125).r; }
float fbm2(vec2 p) { return texture2D(uNoiseTex, p * 0.125 + 0.37).g; }
`,ui=`
bool onLabelSide() { return gl_FragCoord.x > uSeam * uRes.x; }

vec3 applyFog(vec3 col, float dist) {
  float f = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);
  return mix(col, uFogColor, clamp(f, 0.0, 1.0));
}

// albedo is linear. n is the surface normal facing the viewer.
vec3 shade(vec3 albedo, vec3 n, vec3 V, float ao, float trans, float spec) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float wrap = clamp((dot(n, uSunDir) + 0.35) / 1.35, 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
  vec3 light = hemi * uAmbient * ao + uSunColor * (0.15 * wrap + 0.85 * ndl) * mix(0.55, 1.0, ao);
  // light through thin leaves when the sun is behind them
  light += uSunColor * trans * max(dot(-n, uSunDir), 0.0) * 0.6;
  vec3 col = albedo * light;
  vec3 H = normalize(uSunDir + V);
  col += uSunColor * spec * pow(max(dot(n, H), 0.0), 48.0) * ndl;
  // soft rim to lift silhouettes off the mist
  float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);
  col += uSkyColor * rim * 0.10;
  return col;
}
`,Tf=`
vec3 windOffset(vec3 worldPos, float amp, float phase) {
  float t = uTime;
  float s = length(uWind.xz) + 0.15;
  float a = sin(t * 1.3 + worldPos.x * 0.35 + worldPos.z * 0.27 + phase) * 0.6
          + sin(t * 2.7 + worldPos.x * 0.8 + phase * 1.7) * 0.4;
  vec2 dir = normalize(uWind.xz + vec2(0.0001));
  return vec3(dir.x, 0.0, dir.y) * a * amp * s;
}
`});function Zt(i,e){let t=Af(i,e),n=Math.pow(ut(t),1.3)*33,s=wl(.46,.56,t),r=Math.floor(n/st.step),a=n/st.step-r,o=(r+wl(.78,1,a))*st.step;return n=ir(n,o,s),n+=(df(i*.05+3,e*.05)-.5)*2.2*(1-.6*s),n}function Ei(i,e,t=.4){let n=(e+t)*st.step,s=Math.pow(n/33,1/1.3),r=st.z1-s*(st.z1-st.z0);for(let a=0;a<6;a++){let o=s-(Af(i,r)-ut((st.z1-r)/(st.z1-st.z0)));r=st.z1-o*(st.z1-st.z0)}return r}function na(i,e){let t=1e9;for(let n=0;n<Nh.length-1;n++){let[s,r]=Nh[n],[a,o]=Nh[n+1],l=a-s,c=o-r,h=ut(((i-s)*l+(e-r)*c)/(l*l+c*c)),d=s+l*h,u=r+c*h;t=Math.min(t,Math.hypot(i-d,e-u))}return t}function Rf(i=1){let e=Math.round(170*i),t=Math.round(150*i),n=st.x1-st.x0,s=st.z1-st.z0,r=new Float32Array((e+1)*(t+1)*3),a=new Float32Array((e+1)*(t+1)),o=0,l=0;for(let E=0;E<=t;E++)for(let y=0;y<=e;y++){let S=st.x0+y/e*n,w=st.z0+E/t*s;r[o++]=S,r[o++]=Zt(S,w),r[o++]=w,a[l++]=wl(1.7,.7,na(S,w))}let c=[];for(let E=0;E<t;E++)for(let y=0;y<e;y++){let S=E*(e+1)+y,w=S+1,A=S+(e+1),v=A+1;c.push(S,A,w,w,A,v)}let h=new Je;h.setAttribute("position",new Dt(r,3)),h.setAttribute("aPath",new Dt(a,1)),h.setIndex(c),h.computeVertexNormals();let d=new At({vertexShader:mx,fragmentShader:gx,uniforms:{...dt,uSoilCoffee:{value:new he("#8a4429")},uSoilMaize:{value:new he("#94603a")},uSoilBeans:{value:new he("#a77f4f")},uGrass:{value:new he("#6f9d3f")},uPathCol:{value:new he("#c9a77f")},uLabelOther:{value:new he("#6d5db4")}}}),u=new ye(h,d);u.frustumCulled=!1;let p=new Ie,g=new At({vertexShader:_x,fragmentShader:vx,uniforms:{...dt}}),_=(E,y)=>{let S=[],w=[],A=[];E.forEach(([L,N],z)=>{let R=Zt(L,N);if(S.push(L,R,N,L,st.floorY,N),w.push(0,R-st.floorY),z<E.length-1){let D=z*2;A.push(D,D+1,D+2,D+1,D+3,D+2)}});let v=new Je;v.setAttribute("position",new ze(S,3)),v.setAttribute("aDepth",new ze(w,1)),v.setIndex(A),v.computeVertexNormals();let T=v.getAttribute("normal");for(let L=0;L<T.count;L++)T.getX(L)*y[0]+T.getZ(L)*y[2]<0&&T.setXYZ(L,-T.getX(L),-T.getY(L),-T.getZ(L));let I=new ye(v,g);I.material.side=nt,I.frustumCulled=!1,p.add(I)},f=140,m=E=>Array.from({length:f+1},(y,S)=>[st.x0+S/f*n,E]),b=E=>Array.from({length:f+1},(y,S)=>[E,st.z0+S/f*s]);return _(m(st.z1),[0,0,1]),_(m(st.z0),[0,0,-1]),_(b(st.x0),[-1,0,0]),_(b(st.x1),[1,0,0]),{mesh:u,walls:p}}var st,Af,Nh,mx,gx,_x,vx,Uh=ot(()=>{Ft();$i();ta();nn();st={x0:-62,x1:62,z0:-50,z1:58,floorY:-9,step:2.4},Af=(i,e)=>ut((st.z1-e)/(st.z1-st.z0))+.035*Math.sin(i*.045+e*.02)+.02*Math.sin(i*.11);Nh=[[48,62],[45,48],[32,41],[14,37],[-4,32],[-18,26],[-30,19],[-38,14],[-31,7],[-22,1],[-28,-7],[-35,-13],[-27,-19],[-19,-25],[-25,-33],[-31,-39],[-25,-46]];mx=`
attribute float aPath;
varying vec3 vWorld;
varying vec3 vN;
varying float vPath;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vPath = aPath;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,gx=`
${Ln}
${wi}
${ui}
uniform vec3 uSoilCoffee; uniform vec3 uSoilMaize; uniform vec3 uSoilBeans; uniform vec3 uGrass; uniform vec3 uPathCol; uniform vec3 uLabelOther;
varying vec3 vWorld; varying vec3 vN; varying float vPath; void main() {
  if (onLabelSide()) {
    vec3 L = uLabelGround;
    float c = abs(fract(vWorld.y / 2.4 + 0.5) - 0.5);
    L += vec3(0.05, 0.045, 0.09) * smoothstep(0.035, 0.0, c);
    L = mix(L, uLabelOther, vPath);
    gl_FragColor = vec4(L, 1.0);
    #include <colorspace_fragment>
    return;
  }
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  float zc = smoothstep(6.0, 0.0, vWorld.z);
  float zb = smoothstep(28.0, 38.0, vWorld.z);
  vec3 soil = mix(mix(uSoilMaize, uSoilCoffee, zc), uSoilBeans, zb);
  soil *= 0.84 + 0.32 * fbm(vWorld.xz * 0.33);
  // planted rows: green understory under the coffee hedge, stripes of maize and beans
  float sSlope = clamp((58.0 - vWorld.z) / 108.0 + 0.035 * sin(vWorld.x * 0.045 + vWorld.z * 0.02) + 0.02 * sin(vWorld.x * 0.11), 0.0, 1.0);
  float tread = fract(pow(sSlope, 1.3) * 33.0 / 2.4);
  float band = zc * smoothstep(0.08, 0.26, tread) * smoothstep(0.74, 0.56, tread);
  soil = mix(soil, vec3(0.09, 0.20, 0.08) * (0.8 + 0.5 * fbm(vWorld.xz * 0.8)), band * 0.8);
  float mz = smoothstep(6.5, 8.5, vWorld.z) * (1.0 - smoothstep(29.0, 33.0, vWorld.z));
  float md = abs(fract((vWorld.z - 9.0) / 2.6 + 0.5) - 0.5);
  soil = mix(soil, vec3(0.22, 0.40, 0.10) * (0.8 + 0.5 * fbm(vWorld.xz * 0.9)), mz * smoothstep(0.30, 0.12, md) * 0.85);
  float bz = smoothstep(32.0, 34.0, vWorld.z);
  float bd = abs(fract((vWorld.z - 35.0) / 2.0 + 0.5) - 0.5);
  soil = mix(soil, vec3(0.30, 0.50, 0.14) * (0.8 + 0.5 * fbm(vWorld.xz * 0.9)), bz * smoothstep(0.32, 0.12, bd) * 0.85);
  float slope = 1.0 - clamp(n.y, 0.0, 1.0);
  float grass = smoothstep(0.28, 0.5, slope);
  vec3 g = uGrass * (0.78 + 0.45 * fbm(vWorld.xz * 0.5));
  vec3 col = mix(soil, g, grass);
  col = mix(col, uPathCol * (0.92 + 0.16 * vnoise(vWorld.xz * 2.0)), vPath * 0.9);
  col = shade(col, n, V, 1.0, 0.0, 0.0);
  // the block dissolves into the mist underneath
  col = mix(uFogColor, col, 0.25 + 0.75 * smoothstep(-8.0, 0.5, vWorld.y));
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,_x=`
attribute float aDepth;
varying vec3 vWorld; varying vec3 vN; varying float vDepth;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vDepth = aDepth;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,vx=`
${Ln}
${wi}
${ui}
varying vec3 vWorld; varying vec3 vN; varying float vDepth;
void main() {
  if (onLabelSide()) {
    gl_FragColor = vec4(mix(uLabelGround, vec3(1.0), 0.06), 1.0);
    #include <colorspace_fragment>
    return;
  }
  float wob = (fbm(vec2(vWorld.x + vWorld.z, 0.0) * 0.12) - 0.5) * 2.2;
  float d = vDepth + wob;
  vec3 topsoil = vec3(0.17, 0.085, 0.055);
  vec3 clay    = vec3(0.34, 0.14, 0.085);
  vec3 sand    = vec3(0.52, 0.30, 0.18);
  vec3 rock    = vec3(0.30, 0.27, 0.40);
  vec3 col = topsoil;
  col = mix(col, clay, smoothstep(0.5, 0.9, d));
  col = mix(col, sand, smoothstep(5.0, 5.6, d));
  col = mix(col, clay, smoothstep(9.5, 10.1, d));
  col = mix(col, rock, smoothstep(15.0, 15.6, d));
  // thin horizontal bedding lines
  float line = smoothstep(0.06, 0.0, abs(fract(d * 0.55) - 0.5) - 0.44);
  col *= 1.0 - 0.10 * line;
  col *= 0.9 + 0.2 * vnoise(vec2(vWorld.x + vWorld.z, vWorld.y * 1.5) * 1.3);
  vec3 n = normalize(vN);
  vec3 V = normalize(cameraPosition - vWorld);
  col = shade(col, n, V, 0.9, 0.0, 0.0);
  col = mix(uFogColor, col, 0.12 + 0.88 * smoothstep(-8.5, -0.5, vWorld.y));
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`});var Tn,Fh=ot(()=>{Ft();Tn=class{constructor(){this.pos=[],this.uv=[],this.data=[],this.part=[],this.col=[],this.idx=[],this.n=0}vert(e,t,n,s=0,r=0,a=[0,0,1,0],o=0,l=null){return this.pos.push(e,t,n),this.uv.push(s,r),this.data.push(a[0],a[1],a[2],a[3]),this.part.push(o),l?this.col.push(l[0],l[1],l[2]):this.col.push(1,1,1),this.n++}tri(e,t,n){this.idx.push(e,t,n)}quad(e,t,n,s){this.idx.push(e,t,n,e,n,s)}tube(e,t,n,s,r){let a=[],o=new P(0,1,0),l=new P,c=new P,h=new P;for(let d=0;d<e.length;d++){let u=e[d],p=e[Math.max(0,d-1)],g=e[Math.min(e.length-1,d+1)];l.set(g[0]-p[0],g[1]-p[1],g[2]-p[2]).normalize(),c.crossVectors(Math.abs(l.y)>.95?new P(1,0,0):o,l).normalize(),h.crossVectors(l,c).normalize();let _=[];for(let f=0;f<n;f++){let m=f/n*Math.PI*2,b=Math.cos(m)*t[d],E=Math.sin(m)*t[d];_.push(this.vert(u[0]+c.x*b+h.x*E,u[1]+c.y*b+h.y*E,u[2]+c.z*b+h.z*E,0,0,r?r(d/(e.length-1)):[0,0,1,0],s,null))}a.push(_)}for(let d=0;d<a.length-1;d++)for(let u=0;u<n;u++){let p=(u+1)%n;this.quad(a[d][u],a[d][p],a[d+1][p],a[d+1][u])}}grid(e,t,n,s){let r=[];for(let a=0;a<=e;a++){let o=a/e,l=[];for(let c=0;c<=t;c++){let h=-1+2*c/t,d=n(o,h);l.push(this.vert(d.p[0],d.p[1],d.p[2],o,h,d.d,s,d.col||null))}r.push(l)}for(let a=0;a<e;a++)for(let o=0;o<t;o++)this.quad(r[a][o],r[a+1][o],r[a+1][o+1],r[a][o+1])}ball(e,t,n,s,r,a,o=1,l=1,c=1,h=null){let d=(1+Math.sqrt(5))/2,u=[[-1,d,0],[1,d,0],[-1,-d,0],[1,-d,0],[0,-1,d],[0,1,d],[0,-1,-d],[0,1,-d],[d,0,-1],[d,0,1],[-d,0,-1],[-d,0,1]].map(_=>{let f=Math.hypot(..._);return[_[0]/f,_[1]/f,_[2]/f]}),p=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=u.map(_=>this.vert(e+_[0]*s*o,t+_[1]*s*l,n+_[2]*s*c,0,0,a,r,h));for(let _ of p)this.tri(g[_[0]],g[_[1]],g[_[2]])}build(e=!1){let t=new Je;return t.setAttribute("position",new ze(this.pos,3)),t.setAttribute("uv",new ze(this.uv,2)),t.setAttribute("aData",new ze(this.data,4)),t.setAttribute("aPart",new ze(this.part,1)),e&&t.setAttribute("color",new ze(this.col,3)),t.setIndex(this.idx),t.computeVertexNormals(),t}}});function Dl(i,e,t,n,s,r,a,o,l={}){let{curl:c=-.2,rows:h=4,cols:d=2,broad:u=!1,foldAmt:p=.4}=l,g=ps(t),_=ps(Nl([0,1,0],Math.abs(g[1])>.97?[1,0,0]:g)),f=Nl(g,_);i.grid(h,d,(m,b)=>{let E=u?Math.pow(Math.sin(Math.PI*Math.pow(m,.62)),.65):Math.pow(Math.sin(Math.PI*Math.pow(m,.75)),.85),y=s*.5*E,S=Math.abs(b)*y*p,w=Math.sin(Math.PI*m*.9)*n*.07+m*m*n*c,A=Math.sin(m*15+r*6.28)*.012*Math.abs(b),v=b*y,T=w+S+A;return{p:[e[0]+g[0]*m*n+_[0]*v+f[0]*T,e[1]+g[1]*m*n+_[1]*v+f[1]*T,e[2]+g[2]*m*n+_[2]*v+f[2]*T],d:[r,ut(.25*m+.75*o),a*(.82+.18*m),0]}},1)}function Cf(i,e,t,n,s,r,a,o,l=.25,c=.02){let h=[0,1,0];i.grid(n,2,(d,u)=>{let p=e(d),g=e(Math.min(1,d+.01)),_=e(Math.max(0,d-.01)),f=ps([g[0]-_[0],g[1]-_[1],g[2]-_[2]]),m=ps(Nl(h,Math.abs(f[1])>.97?[1,0,0]:f)),b=Nl(f,m),E=t(d),y=Math.abs(u)*E*l+Math.sin(d*18+s*6.28)*c*Math.abs(u),S=u*E;return{p:[p[0]+m[0]*S+b[0]*y,p[1]+m[1]*S+b[1]*y,p[2]+m[2]*S+b[2]*y],d:[s,ut(a+(o-a)*d),r,0]}},1)}function kh(i,e=Oh){let t=ct(i),n=new Tn,s=Ne(t,1.3,1.6),r=e.tiers,a=e.berries?Ne(t,.35,.8):0,o={rows:e.leafRows,cols:e.leafCols};n.tube([[0,0,0],[.015,s*.35,.01],[-.01,s*.7,.02],[0,s,0]],[.055,.04,.024,.01],Math.max(3,e.woodSides+1),0,l=>[0,.05*l,.55,0]);for(let l=0;l<r;l++){let c=l/(r-1),h=.3+(s-.3)*Math.pow(c,.95),d=l*(Math.PI/2)+t()*.3;for(let u=0;u<2;u++){let p=d+u*Math.PI+(t()-.5)*.35,g=(1.35*(1-Math.pow(c,1.1))+.22)*Ne(t,.9,1.1),_=[Math.cos(p),0,Math.sin(p)],f=Ne(t,.08,.18),m=(.5-.25*c)*Ne(t,.8,1.2),b=v=>[_[0]*g*v,h+(f*v-m*v*v)*g,_[2]*g*v],E=[],y=[];for(let v=0;v<=e.branchSegs;v++){let T=v/e.branchSegs;E.push(b(T)),y.push(.019*(1-T)+.005)}n.tube(E,y,e.woodSides,0,v=>[0,.3+.6*v,.5,0]);let S=Math.max(3,Math.round((5+4*(1-.5*c))*e.nodeK));for(let v=0;v<S;v++){let T=.14+.86*(v/(S-1)),I=b(T),L=ps([_[0]*g,(f-2*m*T)*g,_[2]*g]),N=(.5+.5*Math.pow(c,.7))*(.72+.28*T),z=ut(T*(.55+.45*c));for(let R of[-1,1]){let D=Bh(L,R*Ne(t,.9,1.25));D[1]+=Ne(t,0,.28);let k=Ne(t,.3,.38)*(1-.15*c)*e.leafScale;Dl(n,I,D,k,k*.46,t(),N,z,{...o,curl:Ne(t,-.28,-.1)})}if(e.berries&&t()<a*(.4+.6*(1-c))){let R=t(),D=3+Math.floor(t()*3);for(let k=0;k<D;k++){let V=Ne(t,.032,.044);n.ball(I[0]+Ne(t,-.04,.04),I[1]-Ne(t,.02,.07),I[2]+Ne(t,-.04,.04),V,2,[t(),z,N,ut(R+Ne(t,-.12,.12))],1,1.15,1)}}}let w=b(1),A=ps([_[0]*g,(f-2*m)*g,_[2]*g]);for(let v of[-1,1]){let T=Bh(A,v*.5);T[1]+=.1,Dl(n,w,T,.3*e.leafScale,.14*e.leafScale,t(),.8,1,{...o,curl:-.15})}}}for(let l=0;l<6;l++){let c=l/6*Math.PI*2+t()*.4;Dl(n,[0,s-.02,0],[Math.cos(c)*.55,.75,Math.sin(c)*.55],Ne(t,.25,.32)*e.leafScale,.12*e.leafScale,t(),.95,.95,{...o,curl:-.12})}return n.build()}function If(i,e=1){let t=ct(i),n=new Tn,s=Ne(t,1.9,2.3),r=[Ne(t,-.05,.05),Ne(t,-.05,.05)],a=[];for(let h=0;h<=5;h++){let d=h/5;a.push([r[0]*d*d,s*d,r[1]*d*d])}n.tube(a,[.034,.03,.026,.021,.016,.01],5,0,h=>[0,h*.15,.6,0]);let o=Math.max(6,Math.round(11*e)),l=e<.8?3:8;for(let h=0;h<o;h++){let d=h/(o-1),u=.18+s*.78*Math.pow(d,.92),p=h*Math.PI+(t()-.5)*.6,g=(.7+.55*Math.sin(Math.PI*(.15+.75*d)))*Ne(t,.92,1.1),_=.058*(.8+.4*Math.sin(Math.PI*(.2+.7*d))),f=[Math.cos(p),Math.sin(p)],m=.55-.18*d,b=.7-.2*d,E=r[0]*d*d,y=r[1]*d*d;Cf(n,A=>[E+f[0]*g*.8*A,u+g*(m*A-b*A*A),y+f[1]*g*.8*A],A=>_*(.3+.7*Math.sin(Math.PI*(.08+.85*A)))*(1-.92*Math.pow(Math.max(0,(A-.82)/.18),1.5)),l,t(),.55+.45*d,.15+.2*d,.95,.2,.025)}for(let h=0;h<6;h++){let d=h/6*Math.PI*2+t(),u=a[5];n.tube([[u[0],u[1],u[2]],[u[0]+Math.cos(d)*.1,u[1]+.18,u[2]+Math.sin(d)*.1],[u[0]+Math.cos(d)*.22,u[1]+.26,u[2]+Math.sin(d)*.22]],[.008,.006,.003],3,3,()=>[t(),1,.95,0])}let c=s*.55;return n.ball(.07,c,.03,.045,2,[t(),.1,.8,.5],1,3,1),n.build()}function Lf(i,e=1){let t=ct(i),n=new Tn,s=e<.8?3:4;for(let r=0;r<s;r++){let a=r/s*Math.PI*2+t()*.6,o=Ne(t,.28,.42),l=[Math.cos(a),Math.sin(a)],c=u=>[l[0]*o*.55*u,.04+o*(.9*u-.25*u*u),l[1]*o*.55*u],h=[c(0),c(.4),c(.75),c(1)];n.tube(h,[.011,.009,.007,.005],3,0,u=>[0,u,.6,0]);let d=e<.8?2:3;for(let u=0;u<d;u++){let p=.5+.3*u,g=c(p),_=ps([l[0],.35,l[1]]);for(let f=-1;f<=1;f++){let m=Bh(_,f*.75+Ne(t,-.15,.15));m[1]+=.22;let b=Ne(t,.12,.17);Dl(n,g,m,b,b*.95,t(),.6+.4*p,ut(p),{rows:2,cols:2,broad:!0,curl:-.25,foldAmt:.3})}}}return n.build()}function zh(i){let e=ct(i),t=new Tn,n=Ne(e,2.5,3.1),s=[],r=[];for(let c=0;c<=4;c++){let h=c/4;s.push([0,n*h,0]),r.push(.17-.07*h)}t.tube(s,r,7,0,()=>[0,.05,.6,0]);let a=8;for(let c=0;c<a;c++){let h=c/a*Math.PI*2+e()*.5,d=Ne(e,2,2.7),u=[Math.cos(h),Math.sin(h)],p=Ne(e,.45,.9);Cf(t,f=>[u[0]*d*.7*f,n-.1+d*(p*f-.85*f*f),u[1]*d*.7*f],f=>.34*Math.pow(Math.sin(Math.PI*(.04+.9*f)),.6)*(1-.5*f*f),10,e(),.75,.2,1,.12,.03)}let o=.18,l=n-.5;for(let c=0;c<18;c++){let h=c/18*Math.PI*4;t.ball(o+Math.cos(h)*.1,l-Math.floor(c/6)*.1-.05,Math.sin(h)*.1,.05,2,[e(),.1,.8,.3+e()*.2],1,1.7,1)}return t.build()}var ps,Nl,Bh,Pf,Oh,Df=ot(()=>{Fh();nn();ps=i=>{let e=Math.hypot(i[0],i[1],i[2])||1;return[i[0]/e,i[1]/e,i[2]/e]},Nl=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],Bh=(i,e)=>{let t=Math.cos(e),n=Math.sin(e);return[i[0]*t+i[2]*n,i[1],-i[0]*n+i[2]*t]};Pf={tiers:6,nodeK:.6,leafRows:2,leafCols:1,berries:!1,leafScale:1.35,woodSides:3,branchSegs:2},Oh={tiers:10,nodeK:.95,leafRows:4,leafCols:2,berries:!0,leafScale:1,woodSides:4,branchSegs:3}});function ia(i={}){let e={leafA:"#133d27",leafB:"#2d7d44",under:"#6f9a74",wood:"#5a4331",fruitA:"#6aa84a",fruitC:"#e7c53a",fruitB:"#c4262e",sway:.1,shine:.25,sick:0,labelFlat:"#6d5db4",...i};return new At({vertexShader:xx,fragmentShader:yx,side:nt,uniforms:{...dt,uLeafA:{value:Dn(e.leafA)},uLeafB:{value:Dn(e.leafB)},uUnder:{value:Dn(e.under)},uWood:{value:Dn(e.wood)},uFruitA:{value:Dn(e.fruitA)},uFruitB:{value:Dn(e.fruitB)},uFruitC:{value:Dn(e.fruitC)},uLabelFlat:{value:Dn(e.labelFlat)},uLabelLeaf:{value:Dn("#19b3c8")},uLabelEarly:{value:Dn("#ffe14d")},uLabelSevere:{value:Dn("#f2552c")},uLabelFruit:{value:Dn("#b15cf5")},uLabelWood:{value:Dn("#dcd6f4")},uSick:{value:e.sick},uSway:{value:e.sway},uShine:{value:e.shine}}})}var xx,yx,Dn,di,Nf=ot(()=>{Ft();$i();ta();xx=`
${Ln}
${Tf}
attribute vec4 aData;
attribute float aPart;
attribute vec3 aPos;
attribute vec2 aRS;      // yaw, scale
attribute vec2 aState;   // plant severity 0..1, seed 0..1
uniform float uSway;
uniform float uSick;
varying vec3 vN;
varying vec3 vWorld;
varying vec2 vUv;
varying vec4 vData;
varying float vPart;
varying float vLeafSev;
varying float vSeed;
varying float vPlantSev;
void main() {
  float c = cos(aRS.x), s = sin(aRS.x);
  mat3 R = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  vec3 world = aPos + R * (position * aRS.y);
  float isLeaf = step(0.5, aPart) * step(aPart, 1.5);
  float sev = 0.0;
  if (uSick > 0.5) sev = clamp((aState.x - aData.x * 0.5) / 0.38, 0.0, 1.0) * isLeaf;
  world += windOffset(world, uSway * aData.y * aRS.y, aState.y * 6.2831 + aData.x * 3.0);
  vN = R * normal;
  vWorld = world;
  vUv = uv;
  vData = aData;
  vPart = aPart;
  vLeafSev = sev;
  vSeed = aState.y;
  vPlantSev = uSick > 0.5 ? aState.x : 0.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  // dead leaves drop, but only once the whole shrub is far gone, so a sick patch still reads from afar
  if (sev > 0.985 && fract(aData.x * 13.7 + aState.y * 5.3) < smoothstep(0.82, 1.0, aState.x)) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,yx=`
${Ln}
${wi}
${ui}
uniform vec3 uLeafA; uniform vec3 uLeafB; uniform vec3 uUnder; uniform vec3 uWood;
uniform vec3 uFruitA; uniform vec3 uFruitB; uniform vec3 uFruitC;
uniform vec3 uLabelFlat; uniform vec3 uLabelLeaf; uniform vec3 uLabelEarly; uniform vec3 uLabelSevere; uniform vec3 uLabelFruit; uniform vec3 uLabelWood;
uniform float uSick;
uniform float uShine;
varying vec3 vN; varying vec3 vWorld; varying vec2 vUv; varying vec4 vData; varying float vPart; varying float vLeafSev; varying float vSeed; varying float vPlantSev;

// Rust-like lesions: a jittered grid of round spots that grow and multiply with severity s.
void lesions(vec2 uv, float seed, float s, out float spot, out float core) {
  spot = 0.0; core = 0.0;
  vec2 g = vec2(uv.x * 6.0, (uv.y * 0.5 + 0.5) * 3.0);
  vec2 id = floor(g);
  vec2 f = fract(g);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 cid = id + o;
      float h = hash21(cid + seed * 17.0);
      float on = step(h, 0.2 + 0.7 * s);
      vec2 c = o + 0.15 + 0.7 * hash22(cid + seed * 5.0 + 3.1);
      float r = (0.17 + 0.30 * s) * (0.65 + 0.7 * hash21(cid + seed * 9.0));
      vec2 dv = (f - c) * vec2(1.0, 1.15);
      float d = length(dv);
      spot = max(spot, on * smoothstep(r, r * 0.55, d));
      core = max(core, on * smoothstep(r * 0.55, r * 0.15, d) * smoothstep(0.2, 0.55, s));
    }
  }
}

void main() {
  float isWood = step(vPart, 0.5);
  float isLeaf = step(0.5, vPart) * step(vPart, 1.5);
  float isFruit = step(1.5, vPart) * step(vPart, 2.5);
  float s = vLeafSev;
  float spot = 0.0; float core = 0.0;
  if (uSick > 0.5 && isLeaf > 0.5 && s > 0.002) lesions(vUv, vData.x * 3.7 + vSeed, s, spot, core);

  if (onLabelSide()) {
    vec3 L = uLabelFlat;
    if (uSick > 0.5) {
      if (isWood > 0.5) L = uLabelWood;
      else if (isFruit > 0.5) L = uLabelFruit;
      else {
        L = uLabelLeaf;
        if (spot > 0.5) L = (s < 0.42 && core < 0.5) ? uLabelEarly : uLabelSevere;
        if (s > 0.78) L = uLabelSevere;
      }
    }
    gl_FragColor = vec4(L, 1.0);
    #include <colorspace_fragment>
    return;
  }

  vec3 V = normalize(cameraPosition - vWorld);
  vec3 n = normalize(vN);
  n = faceforward(n, -V, n);
  bool upper = gl_FrontFacing;
  vec3 albedo; float spec = 0.0; float trans = 0.0;

  if (isWood > 0.5) {
    albedo = uWood * (0.85 + 0.3 * vnoise(vWorld.xz * 9.0 + vWorld.y * 5.0));
  } else if (isFruit > 0.5) {
    float ripe = vData.w;
    vec3 a = ripe < 0.5 ? mix(uFruitA, uFruitC, ripe * 2.0) : mix(uFruitC, uFruitB, ripe * 2.0 - 1.0);
    albedo = a; spec = 0.55;
  } else if (vPart > 2.5) {
    albedo = vec3(0.78, 0.72, 0.45); trans = 0.4;
  } else {
    float edge = abs(vUv.y);
    float mott = vnoise(vUv * vec2(9.0, 4.0) + vData.x * 12.0);
    float tone = clamp(0.35 * vUv.x + 0.45 * edge + 0.4 * (mott - 0.5) + (hash11(vSeed * 91.0) - 0.5) * 0.25, 0.0, 1.0);
    vec3 top = mix(uLeafA, uLeafB, tone);
    float rib = smoothstep(0.10, 0.0, edge);
    float vein = smoothstep(0.90, 1.0, abs(sin((vUv.x * 7.0 - edge * 2.4) * 3.14159)));
    top = mix(top, top * 1.45 + 0.02, rib * 0.55 + vein * 0.12 * (1.0 - rib));
    vec3 under = uUnder * (0.9 + 0.2 * mott);
    albedo = upper ? top : under;
    if (uSick > 0.5 && s > 0.002) {
      if (upper) {
        vec3 halo = vec3(0.86, 0.80, 0.18);
        vec3 rust = vec3(0.80, 0.36, 0.05);
        vec3 necro = vec3(0.17, 0.08, 0.04);
        albedo = mix(albedo, halo, spot * 0.92);
        albedo = mix(albedo, rust, core * 0.75);
        albedo = mix(albedo, necro, core * smoothstep(0.5, 0.85, s));
        albedo = mix(albedo, vec3(0.45, 0.36, 0.08), smoothstep(0.55, 0.95, s) * 0.65);
      } else {
        float pust = spot * step(0.5, vnoise(vUv * vec2(90.0, 45.0) + vData.x * 40.0));
        albedo = mix(albedo, vec3(0.93, 0.50, 0.06), clamp(spot * 0.5 + pust * 0.7, 0.0, 1.0));
        albedo = mix(albedo, vec3(0.28, 0.16, 0.07), smoothstep(0.7, 0.95, s));
      }
    }
    // a sick shrub turns rusty yellow as a whole, so a sick patch reads from far away
    albedo = mix(albedo, vec3(0.62, 0.5, 0.12), smoothstep(0.18, 0.85, vPlantSev) * 0.5);
    spec = upper ? uShine * (1.0 - 0.7 * spot) : 0.02;
    trans = 0.55;
  }

  float ao = vData.z;
  vec3 col = shade(albedo, n, V, ao, trans, spec);
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,Dn=i=>new he(i);di=class{constructor(e,t,n){this.capacity=t,this.count=0;let s=new ls;s.index=e.index;for(let r of["position","normal","uv","aData","aPart","color"]){let a=e.getAttribute(r);a&&s.setAttribute(r,a)}this.aPos=new ai(new Float32Array(t*3),3),this.aRS=new ai(new Float32Array(t*2),2),this.aState=new ai(new Float32Array(t*2),2),this.aState.setUsage(sh),s.setAttribute("aPos",this.aPos),s.setAttribute("aRS",this.aRS),s.setAttribute("aState",this.aState),s.instanceCount=0,this.geometry=s,this.mesh=new ye(s,n),this.mesh.frustumCulled=!1}reset(){this.count=0,this.geometry.instanceCount=0}add(e,t,n,s,r,a){let o=this.count++;return this.aPos.setXYZ(o,e,t,n),this.aRS.setXY(o,s,r),this.aState.setXY(o,0,a),this.geometry.instanceCount=this.count,this.aPos.needsUpdate=!0,this.aRS.needsUpdate=!0,this.aState.needsUpdate=!0,o}setSeverity(e,t){this.aState.array[e*2]=t}flush(){this.aState.needsUpdate=!0}}});function sr({label:i="#6d5db4",sway:e=0,stripes:t=0}={}){return new At({vertexShader:bx,fragmentShader:Sx,side:nt,uniforms:{...dt,uLabelColor:{value:new he(i)},uSway:{value:e},uStripes:{value:t}}})}function vn(i,e,t,n,s,r,a,o,l=0,c=.9,h=0){let d=ms(o),u=Math.cos(l),p=Math.sin(l),g=(b,E)=>[e+b*u+E*p,n-b*p+E*u],_=s/2,f=a/2,m=[[[-_,0,f],[_,0,f],[_,r,f],[-_,r,f]],[[_,0,-f],[-_,0,-f],[-_,r,-f],[_,r,-f]],[[_,0,f],[_,0,-f],[_,r,-f],[_,r,f]],[[-_,0,-f],[-_,0,f],[-_,r,f],[-_,r,-f]],[[-_,r,f],[_,r,f],[_,r,-f],[-_,r,-f]],[[-_,0,-f],[_,0,-f],[_,0,f],[-_,0,f]]];for(let b of m){let E=b.map(([y,S,w])=>{let[A,v]=g(y,w);return i.vert(A,t+S,v,0,0,[0,h,c,0],0,d)});i.quad(E[0],E[1],E[2],E[3])}}function Hh(i,e,t,n,s,r,a,o,l=0,c=.25){let h=ms(o),d=Math.cos(l),u=Math.sin(l),p=(L,N)=>[e+L*d+N*u,n-L*u+N*d],g=s/2+c,_=r/2+c,f=(L,N,z,R=.95)=>{let[D,k]=p(L,z);return i.vert(D,t+N,k,0,0,[0,0,R,0],0,h)},m=f(-g,0,_),b=f(g,0,_),E=f(g,a,0),y=f(-g,a,0);i.quad(m,b,E,y);let S=f(g,0,-_),w=f(-g,0,-_),A=f(-g,a,0),v=f(g,a,0);i.quad(S,w,A,v);let T=[f(-g,0,_,.8),f(-g,a,0,.8),f(-g,0,-_,.8)];i.tri(T[0],T[1],T[2]);let I=[f(g,0,-_,.8),f(g,a,0,.8),f(g,0,_,.8)];i.tri(I[0],I[1],I[2])}function Ji(i,e,t,n,s,r,a,o,l,c=.9,h=0){let d=ms(l),u=[];for(let g=0;g<2;g++){let _=[];for(let f=0;f<o;f++){let m=f/o*Math.PI*2,b=g?r:s;_.push(i.vert(e+Math.cos(m)*b,t+g*a,n+Math.sin(m)*b,0,0,[0,h,c,0],0,d))}u.push(_)}for(let g=0;g<o;g++){let _=(g+1)%o;i.quad(u[0][g],u[0][_],u[1][_],u[1][g])}let p=i.vert(e,t+a,n,0,0,[0,h,c,0],0,d);for(let g=0;g<o;g++)i.tri(u[1][g],u[1][(g+1)%o],p)}function Ul(i,e,t,n,s,r,a,o,l,c,h,d=.22,u=1){let p=(1+Math.sqrt(5))/2,g=[[-1,p,0],[1,p,0],[-1,-p,0],[1,-p,0],[0,-1,p],[0,1,p],[0,-1,-p],[0,1,-p],[p,0,-1],[p,0,1],[-p,0,-1],[-p,0,1]].map(E=>{let y=Math.hypot(...E);return[E[0]/y,E[1]/y,E[2]/y]}),_=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];for(let E=0;E<2;E++){let y=new Map,S=[],w=(A,v)=>{let T=A<v?`${A}_${v}`:`${v}_${A}`;if(y.has(T))return y.get(T);let I=[(g[A][0]+g[v][0])/2,(g[A][1]+g[v][1])/2,(g[A][2]+g[v][2])/2],L=Math.hypot(...I);return g.push([I[0]/L,I[1]/L,I[2]/L]),y.set(T,g.length-1),g.length-1};for(let[A,v,T]of _){let I=w(A,v),L=w(v,T),N=w(T,A);S.push([A,I,N],[v,L,I],[T,N,L],[I,L,N])}_=S}let f=ms(l),m=ms(c),b=g.map(E=>{let y=Dh(E[0]*2.2+h,E[2]*2.2+E[1]*1.7)-.5,S=1+y*d*2,w=(E[1]+1)/2,A=[f[0]+(m[0]-f[0])*w,f[1]+(m[1]-f[1])*w,f[2]+(m[2]-f[2])*w],v=.9+y*.5;return i.vert(e+E[0]*s*r*S,t+E[1]*s*a*S,n+E[2]*s*o*S,0,0,[0,u,.55+.45*w,0],0,[A[0]*v,A[1]*v,A[2]*v])});for(let[E,y,S]of _)i.tri(b[E],b[y],b[S])}function Uf(){let i=new Tn;return vn(i,0,0,0,5.2,2.5,3.6,"#e8e1d2"),Hh(i,0,2.5,0,5.2,3.6,1.1,"#8b95a6",0,.35),vn(i,-.9,0,1.81,.9,1.7,.08,"#3a2a2a"),vn(i,1.2,.9,1.81,.8,.7,.08,"#2b3a4e"),vn(i,1.9,0,1,.7,.9,.7,"#8c7a63",.2),vn(i,3.6,0,-.4,2.4,2,2.4,"#d8cdb7"),Hh(i,3.6,2,-.4,2.4,2.4,.8,"#7f8999",0,.3),Ji(i,-3.4,0,-.6,.62,.62,1.4,10,"#6f8fb0"),Ji(i,-3.4,1.4,-.6,.62,.05,.25,10,"#5d7b9b"),i.build(!0)}function Ff(){let i=new Tn;vn(i,0,0,0,9,3.4,5.4,"#dcd5c6"),Hh(i,0,3.4,0,9,5.4,1.5,"#6f7c8e",0,.5),vn(i,0,0,2.75,3,2.3,.1,"#3d3a46"),vn(i,-3.2,.9,2.75,1,.9,.1,"#2b3a4e"),vn(i,3.2,.9,2.75,1,.9,.1,"#2b3a4e"),vn(i,0,2.5,2.8,4.4,.6,.08,"#19b3c8");for(let e=0;e<6;e++)vn(i,-4.8+e%3*.7,Math.floor(e/3)*.5,3.6+Math.floor(e/3)*.1,.6,.5,.4,"#d8c9a3",.1*e);return i.build(!0)}function Bf(){let i=new Tn;for(let e=0;e<3;e++){let t=e*1.9;for(let[n,s]of[[-1.7,-.7],[1.7,-.7],[-1.7,.7],[1.7,.7]])vn(i,n,0,t+s,.1,.8,.1,"#5a4331");vn(i,0,.8,t,4,.08,1.7,"#7a6a52"),vn(i,0,.88,t,3.8,.1,1.5,"#a07844")}return i.build(!0)}function Vh(i){let e=ct(i),t=new Tn,n=Ne(e,7,9);Ji(t,0,0,0,.45,.22,n*.7,6,"#5a4331",.7,.02);for(let s=0;s<3;s++){let r=s/3*Math.PI*2+e();Ul(t,Math.cos(r)*2.2,n*.78+Ne(e,-.4,.6),Math.sin(r)*2.2,3.3,1.2,.45,1.2,"#2c5f3a","#6f9e4a",i+s*3.1,.25,1)}return Ul(t,0,n*.9,0,3.6,1.2,.5,1.2,"#2f6a3d","#7ba94f",i+9.7,.25,1),t.build(!0)}function Of(){let i=new Tn,e=ms("#8a5a3c"),t=ms("#f4c542");return Ji(i,-.08,0,0,.065,.06,.8,5,"#8a5a3c",.9),Ji(i,.08,0,0,.065,.06,.8,5,"#8a5a3c",.9),Ji(i,0,.55,0,.23,.12,.85,8,"#1f7a96",.95),Ji(i,.17,1.05,.05,.045,.04,.35,5,"#8a5a3c"),Ji(i,-.17,1.05,.05,.045,.04,.35,5,"#8a5a3c"),i.ball(0,1.52,0,.11,0,[0,0,.95,0],1,1.1,1,e),i.ball(0,1.58,-.015,.125,0,[0,0,.95,0],1,.8,1,t),vn(i,0,1,.24,.1,.17,.015,"#dff3ff"),i.build(!0)}function kf(i){let e=ct(i),t=new Tn;return Ul(t,0,.3,0,.8,1.2,.7,1,"#6c6a78","#a6a4b4",i,.3,0),Ul(t,.9,.2,.4,.5,1.1,.7,1,"#6c6a78","#a6a4b4",i+2,.3,0),t.build(!0)}var bx,Sx,ms,zf=ot(()=>{Ft();$i();ta();Fh();nn();bx=`
${Ln}
attribute vec4 aData;
attribute vec3 color;
attribute vec3 aPos;
attribute vec2 aRS;
attribute vec2 aState;
uniform float uSway;
varying vec3 vN; varying vec3 vWorld; varying vec3 vCol; varying float vAO; varying float vWob;
void main() {
  float c = cos(aRS.x), s = sin(aRS.x);
  mat3 R = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  vec3 world = aPos + R * (position * aRS.y);
  // canopies move a little in the wind: aData.y holds the sway weight
  float k = aData.y * uSway;
  world.x += sin(uTime * 0.9 + world.z * 0.2 + aState.y * 6.0) * k * uWind.x;
  world.z += sin(uTime * 0.7 + world.x * 0.2 + aState.y * 4.0) * k * uWind.z;
  vN = R * normal; vWorld = world; vCol = color; vAO = aData.z; vWob = aData.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`,Sx=`
${Ln}
${wi}
${ui}
uniform vec3 uLabelColor;
uniform float uStripes;
varying vec3 vN; varying vec3 vWorld; varying vec3 vCol; varying float vAO; varying float vWob;
void main() {
  if (onLabelSide()) {
    gl_FragColor = vec4(uLabelColor, 1.0);
    #include <colorspace_fragment>
    return;
  }
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 n = normalize(vN);
  n = faceforward(n, -V, n);
  vec3 albedo = vCol * (0.92 + 0.16 * vnoise(vWorld.xz * 1.6 + vWorld.y));
  if (uStripes > 0.5) albedo *= 0.9 + 0.1 * sin((vWorld.x + vWorld.z) * 16.0);
  vec3 col = shade(albedo, n, V, vAO, uStripes > 0.5 ? 0.0 : 0.25, uStripes > 0.5 ? 0.35 : 0.0);
  col = applyFog(col, length(cameraPosition - vWorld));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;ms=i=>{let e=new he(i);return[e.r,e.g,e.b]}});function Hf(){let i=new Ie,e=(t,n,s,r,a,o,l,c,h,d=0)=>{let u=new ye(new Tt(t,n,1,1),new At({vertexShader:Mx,fragmentShader:wx,transparent:!0,depthWrite:!1,side:nt,uniforms:{...dt,uScale:{value:new ge(...a)},uSpeed:{value:o},uAlpha:{value:l},uSeed:{value:c},uTint:{value:new he(h)},uFadeY:{value:d}}}));return u.position.set(...s),u.rotation.x=r,u.frustumCulled=!1,u.renderOrder=5,i.add(u),u};return e(700,700,[0,-13,10],-Math.PI/2,[5,5],.004,.95,1,"#ffffff"),e(520,520,[0,-18,20],-Math.PI/2,[4,4],-.003,.9,2,"#f1e8f6"),e(700,700,[0,-24,0],-Math.PI/2,[3,3],.002,1,3,"#e8e2f2"),e(1100,150,[0,14,-250],0,[7,1.6],.003,.5,4,"#e8def4",0),e(1300,170,[0,22,-420],0,[6,1.4],-.002,.45,5,"#dcd8f2",0),i}var Mx,wx,Ex,Tx,Fl,Vf=ot(()=>{Ft();$i();ta();Mx=`
varying vec2 vUv; varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz; vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,wx=`
${Ln}
${wi}
${ui}
uniform vec2 uScale; uniform float uSpeed; uniform float uAlpha; uniform float uSeed; uniform vec3 uTint; uniform float uFadeY;
varying vec2 vUv; varying vec3 vWorld;
void main() {
  float photo = onLabelSide() ? 0.0 : 1.0;
  vec2 p = vUv * uScale + vec2(uTime * uSpeed, 0.0) + uSeed * 17.0;
  float n = fbm(p) * 0.65 + fbm(p * 2.1 + 5.0) * 0.35;
  float a = smoothstep(0.38, 0.78, n);
  // fade toward the plane's edges so no hard borders show
  vec2 e = abs(vUv - 0.5) * 2.0;
  float edge = 1.0 - smoothstep(0.55, 1.0, max(e.x, uFadeY > 0.5 ? e.y : e.x * 0.0));
  float edgeY = uFadeY > 0.5 ? 1.0 : 1.0 - smoothstep(0.55, 1.0, e.y);
  a *= edge * edgeY * uAlpha * photo;
  float light = 0.9 + 0.2 * smoothstep(0.3, 0.9, n);
  vec3 col = mix(uFogColor, vec3(1.0), 0.35) * uTint * light;
  col = mix(col, uFogColor, 1.0 - exp(-0.00002 * dot(vWorld - cameraPosition, vWorld - cameraPosition)));
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;Ex=`
${Ln}
attribute vec3 aBase;   // plant base
attribute vec3 aDims;   // length, width, height
varying vec2 vUv;
void main() {
  vec2 sd = -uSunDir.xz;
  float horiz = max(length(sd), 0.0001);
  vec2 dir = sd / horiz;
  vec2 perp = vec2(-dir.y, dir.x);
  float stretch = clamp(horiz / max(uSunDir.y, 0.05), 0.35, 2.6);
  float len = aDims.x * (0.45 + 0.55 * stretch) + aDims.z * stretch * 0.25;
  float wid = aDims.y;
  vec2 q = position.xy; // plane is in xy, -0.5..0.5
  vec2 off = dir * (q.x * len + len * 0.28) + perp * q.y * wid;
  vec3 world = vec3(aBase.x + off.x, aBase.y + 0.06, aBase.z + off.y);
  vUv = position.xy * 2.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`,Tx=`
${Ln}
${ui}
varying vec2 vUv;
void main() {
  float photo = onLabelSide() ? 0.0 : 1.0;
  float r = length(vUv);
  float a = pow(clamp(1.0 - r, 0.0, 1.0), 1.4) * 0.5 * photo;
  gl_FragColor = vec4(vec3(0.05, 0.025, 0.04), a);
  #include <colorspace_fragment>
}`,Fl=class{constructor(e){let t=new Tt(1,1),n=new ls;n.index=t.index,n.setAttribute("position",t.getAttribute("position")),this.aBase=new ai(new Float32Array(e*3),3),this.aDims=new ai(new Float32Array(e*3),3),n.setAttribute("aBase",this.aBase),n.setAttribute("aDims",this.aDims),n.instanceCount=0,this.geometry=n,this.count=0,this.mesh=new ye(n,new At({vertexShader:Ex,fragmentShader:Tx,uniforms:{...dt},transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2}add(e,t,n,s,r,a){let o=this.count++;this.aBase.setXYZ(o,e,t,n),this.aDims.setXYZ(o,s,r,a),this.geometry.instanceCount=this.count,this.aBase.needsUpdate=!0,this.aDims.needsUpdate=!0}}});var Bt,Bl,Gf=ot(()=>{Ft();Uh();Df();Nf();zf();Vf();nn();Bt={house:[-40,12],dryer:[-30,19],coop:[42,47],noor:[-2,0]},Bl=class{constructor({quality:e=1,onProgress:t=()=>{}}={}){this.quality=e,this.group=new Ie,this.shrubs=[],this.batches={coffee:[]},this.spots={},this.onProgress=t,this._build()}_build(){let e=this.quality,{mesh:t,walls:n}=Rf(e>=.8?1:.7);this.group.add(t,n),this.terrain=t,this.onProgress(.15),this.shadows=new Fl(2600),this.group.add(this.shadows.mesh);let s=(r,a)=>{let o=[[Bt.house[0],Bt.house[1],8],[Bt.dryer[0],Bt.dryer[1],5],[Bt.coop[0],Bt.coop[1],9]];for(let[l,c,h]of o)if(Math.hypot(r-l,a-c)<h)return!0;return na(r,a)<2.2};this.blocked=s,this._coffee(s),this.onProgress(.5),this._maizeAndBeans(s),this.onProgress(.75),this._props(),this.onProgress(.9),this.clouds=Hf(),this.group.add(this.clouds);for(let r of this.batches.coffee)r.mesh.renderOrder=1;this.onProgress(1)}_coffee(e){let t=this.quality,n=ct(11),s=ia({sick:1,sway:.16,shine:.34,leafA:"#0d3623",leafB:"#2b7a45",under:"#78a27c",labelFlat:"#6d5db4"});this.coffeeMat=s;let r=[0,1,2].map(l=>new di(kh(101+l*37,Pf),420,s)),a=[0,1,2].map(l=>new di(kh(101+l*37,Oh),140,s));this.batches.coffee=[...r,...a],this.coffeeLOD={lo:r,hi:a};let o=t>=.8?2.6:3.3;for(let l=6;l<=13;l++)for(let c=-50;c<=50;c+=o){let h=c+Ne(n,-.45,.45),d=Ei(h,l,.4)+Ne(n,-.3,.3);if(e(h,d))continue;let u=Zt(h,d),p=Ne(n,1.25,1.55);this.shrubs.push({x:h,y:u,z:d,k:l,vi:Math.floor(n()*3),sc:p,yaw:n()*qi,seed:n(),sev:0,lod:0,slot:0,id:this.shrubs.length}),this.shadows.add(h,u,d,3*p,2.4*p,1.8*p)}for(let l of this.batches.coffee)this.group.add(l.mesh);this.assignLOD(0,0,0)}assignLOD(e,t,n){let{lo:s,hi:r}=this.coffeeLOD;for(let a of[...s,...r])a.reset();for(let a of this.shrubs){let o=n>0&&Math.hypot(a.x-e,a.z-t)<n;a.lod=o?1:0;let l=(o?r:s)[a.vi];a.slot=l.add(a.x,a.y,a.z,a.yaw,a.sc,a.seed),l.setSeverity(a.slot,a.sev)}this.flush()}_maizeAndBeans(e){let t=this.quality,n=ct(23),s=ia({sick:0,sway:.2,shine:.18,leafA:"#2d6a2c",leafB:"#7fae3f",under:"#8db56a",wood:"#7a8a3a",fruitA:"#d9c46a",fruitC:"#d9c46a",fruitB:"#d9c46a",labelFlat:"#7d6fcb"}),r=ia({sick:0,sway:.08,shine:.2,leafA:"#2a6a35",leafB:"#5fa04a",under:"#86b278",labelFlat:"#5c4fa6"}),a=[0,1].map(u=>If(7+u*5,.55)),o=[0,1].map(u=>Lf(31+u*9,.55)),l=a.map(u=>new di(u,900,s)),c=o.map(u=>new di(u,1200,r)),h=t>=.8?1.5:2.4;for(let u=0;u<9;u++){let p=9+u*2.6;for(let g=-57;g<=57;g+=h){let _=g+Ne(n,-.3,.3),f=p+Ne(n,-.25,.25);if(e(_,f))continue;let m=Zt(_,f),b=Math.floor(n()*2),E=Ne(n,1.1,1.35);l[b].add(_,m,f,n()*qi,E,n()),n()<.5&&this.shadows.add(_,m,f,1.2*E,.8,2.1*E)}}let d=t>=.8?1.4:2.2;for(let u=0;u<10;u++){let p=35+u*2;for(let g=-57;g<=57;g+=d){let _=g+Ne(n,-.3,.3),f=p+Ne(n,-.2,.2);if(e(_,f))continue;let m=Zt(_,f);c[Math.floor(n()*2)].add(_,m,f,n()*qi,Ne(n,1.3,1.7),n())}}for(let u of[...l,...c])this.group.add(u.mesh);this.batches.maize=l,this.batches.beans=c}_props(){let e=ct(5),t=(_,f,m,b,E=0,y=1,S=0)=>{let w=new di(_,1,f),A=Zt(m,b)+S;return w.add(m,A,b,E,y,e()),this.group.add(w.mesh),[m,A,b]},n=sr({label:"#6d5db4"}),s=sr({label:"#6d5db4",stripes:1}),r=Zt(...Bt.house);this.spots.house=t(Uf(),n,Bt.house[0],Bt.house[1],.25,1),this.spots.dryer=t(Bf(),n,Bt.dryer[0],Bt.dryer[1],.25,1),this.spots.coop=t(Ff(),n,Bt.coop[0],Bt.coop[1],-.2,1),this.shadows.add(Bt.house[0]+1,Zt(...Bt.house),Bt.house[1]+1,6.5,4.6,3.2),this.shadows.add(Bt.coop[0]+1,Zt(...Bt.coop),Bt.coop[1]+1,9.5,6.4,4.2);let a=Ei(Bt.noor[0],9,.72),o=sr({label:"#f4f1ff"});this.spots.noor=t(Of(),o,Bt.noor[0],a,.6,1);let l=sr({label:"#5c4fa6",sway:.35}),c=[[-54,7],[-33,10],[33,8],[51,11],[22,12],[-18,12],[44,6]],h=[Vh(3),Vh(8)];this.spots.trees=[],c.forEach(([_,f],m)=>{let b=Ei(_,f,.68);na(_,b)<4||(this.spots.trees.push(t(h[m%2],l,_,b,e()*qi,Ne(e,.9,1.15))),this.shadows.add(_,Zt(_,b),b,8,5.5,8))});let d=ia({sick:0,sway:.22,shine:.22,leafA:"#2c6a2d",leafB:"#79ad3e",under:"#9bc07a",wood:"#7d9a4a",fruitA:"#8fba4a",fruitC:"#e5cf4a",fruitB:"#e5cf4a",labelFlat:"#8a7cd8"}),u=[zh(2),zh(9)];[[-48,4],[-45,9],[-51,14],[-46,19],[-35,3],[50,38],[52,44],[-56,24]].forEach(([_,f],m)=>{let b=new di(u[m%2],1,d),E=Zt(_,f);b.add(_,E,f,e()*qi,Ne(e,.9,1.15),e()),this.group.add(b.mesh),this.shadows.add(_,E,f,3.2,2.6,2.8)});for(let[_,f]of[[-26,8],[27,9],[12,11],[-8,13]]){let m=Ei(_,f,.74),b=new di(u[0],1,d),E=Zt(_,m);na(_,m)<3||(b.add(_,E,m,e()*qi,1,e()),this.group.add(b.mesh),this.shadows.add(_,E,m,3.2,2.6,2.8))}let g=sr({label:"#6d5db4"});for(let[_,f]of[[20,38],[-12,28],[-34,10],[-30,-10]])t(kf(Math.floor(_+50)),g,_,f,e()*qi,Ne(e,.8,1.3));this.group.add(this.shadows.mesh)}setWide(e){this.clouds.visible=e}anchor(e){let t=this.spots;switch(e){case"house":return new P(t.house[0],t.house[1]+3.6,t.house[2]);case"noor":return new P(t.noor[0],t.noor[1]+1.9,t.noor[2]);case"coop":return new P(t.coop[0],t.coop[1]+4.6,t.coop[2]);case"dryer":return new P(t.dryer[0],t.dryer[1]+1.4,t.dryer[2]);case"coffee":return new P(0,Zt(0,Ei(0,10,.4))+3,Ei(0,10,.4));case"maize":return new P(-8,Zt(-8,17)+3.4,17);case"beans":return new P(8,Zt(8,44)+1.4,44);default:return new P}}setSeverity(e,t){let n=this.shrubs[e];n.sev=t,(n.lod?this.coffeeLOD.hi:this.coffeeLOD.lo)[n.vi].setSeverity(n.slot,t)}flush(){for(let e of this.batches.coffee)e.flush()}shrubPos(e){let t=this.shrubs[e];return new P(t.x,t.y+1,t.z)}}});var Wf,Xf,Ol,Gh=ot(()=>{Ft();Zi();Gf();Uh();$i();nn();Wf=[{name:"dawn",label:"dawn light"},{name:"noon",label:"noon sun"},{name:"overcast",label:"overcast"},{name:"late",label:"late sun"}],Xf=[0,.14,.32,.56,.86],Ol=class extends dn{constructor(e){super(e),this.level=2,this.labOn=!1,this.patch=new P,this.pairs=0,this.shooting=!1}build(e){this.farm=new Bl({quality:this.app.quality,onProgress:e}),this.group.add(this.farm.group),this.sev=new Float32Array(this.farm.shrubs.length);let t=Ei(0,9,.4);this.patch.set(0,Zt(0,t),t),this.defaultSeed=this._nearest(this.patch.x,this.patch.z),this.target=this.defaultSeed;let n=this.farm.shrubs.map((s,r)=>[Math.hypot(s.x-this.patch.x,s.z-this.patch.z),r]).sort((s,r)=>s[0]-r[0]);this.heroSeeds=n.slice(0,12).map(s=>s[1]),this._poses(),this._tags(),this.built=!0}_nearest(e,t){let n=0,s=1e9;return this.farm.shrubs.forEach((r,a)=>{let o=Math.hypot(r.x-e,r.z-t);o<s&&(s=o,n=a)}),n}_poses(){let e=this.farm.shrubs[this.defaultSeed];this.poses={open:{pos:[112,64,186],target:[-2,33,4],fov:27,parallax:1},"noor-1":{pos:[-88,62,112],target:[-2,16,2],fov:31,parallax:.8},"noor-2":{pos:[38,40,20],target:[0,21,-20],fov:31,parallax:.8},"noor-3":{pos:[e.x+1,e.y+1.8,e.z+3.7],target:[e.x-.1,e.y+1.2,e.z+.1],fov:38,parallax:.4,drift:.3},lab:this._viewPose(this.defaultSeed,-.38,5.6,1.9),pairs:{pos:[e.x-2.4,e.y+1.7,e.z+5.6],target:[e.x,e.y+1.15,e.z],fov:46,parallax:.4,drift:.4},close:{pos:[-104,62,150],target:[2,22,-2],fov:28,parallax:1}}}_viewPose(e,t,n,s){let r=this.farm.shrubs[e],a=n*.2;return{pos:[r.x+Math.sin(t)*n,r.y+s,r.z+Math.cos(t)*n],target:[r.x-Math.cos(t)*a,r.y+.8,r.z+Math.sin(t)*a],fov:40,parallax:.4,drift:.3}}_tags(){let e=this.app.tags,t=this.farm;e.add({id:"t-coffee",text:"Coffee",sub:"upper slope",anchor:t.anchor("coffee"),side:"r",len:40}),e.add({id:"t-maize",text:"Maize",sub:"middle",anchor:t.anchor("maize"),side:"r",len:40}),e.add({id:"t-beans",text:"Beans",sub:"lower",anchor:t.anchor("beans"),side:"r",len:40}),e.add({id:"t-house",text:"Noor's house",sub:"no Wi-Fi, 3G bundles",anchor:t.anchor("house"),side:"l",len:50}),e.add({id:"t-coop",text:"Cooperative",sub:"sells to a middleman",anchor:t.anchor("coop"),side:"l",len:40}),e.add({id:"t-noor",text:"Noor",sub:"checking her coffee",anchor:t.anchor("noor"),side:"r",len:36,big:!0}),e.add({id:"t-spots",text:"First spots",sub:"a few mm wide",anchor:()=>this._spotAnchor(),side:"r",len:46,color:"#ffe14d",big:!0}),e.add({id:"t-officer",text:"Extension officer",sub:"two visits a year, at best",anchor:new P(46,Zt(46,56)+2.2,56),side:"l",len:46})}_spotAnchor(){let e=this.farm.shrubs[this.defaultSeed];return new P(e.x-.1,e.y+2.3,e.z+.3)}_paint(e,t,n){let s=this.farm.shrubs,r=this.sev;if(r.fill(0),t>0){for(let a=0;a<s.length;a++){let o=s[a],l=0;for(let c of e){let h=s[c],d=Math.hypot(o.x-h.x,o.z-h.z)/n;l=Math.max(l,Math.exp(-d*d))}l>.06&&(r[a]=Math.min(1,t*l*(.8+.4*o.seed)))}e.length===1&&(r[e[0]]=t)}this._apply()}_apply(){let e=this.sev.length;for(let t=0;t<e;t++)this.farm.setSeverity(t,this.sev[t]);this.farm.flush()}_paintTarget(){this._paint([this.target],Xf[this.level],2.4),this._readout()}_readout(){if(!this.labOn)return;let e=this.app.panels;e.out("level",String(this.level)),e.out("label",this.level?`rust yes \xB7 severity ${this.level}`:"rust no \xB7 healthy"),e.setRange("level",this.level)}_lights(e="dawn"){document.querySelectorAll('[data-ctl="light"]').forEach(t=>t.setAttribute("aria-pressed",String(t.dataset.light===e)))}setLite(e){this.lite=e,this.farm.shadows.mesh.visible=!e,this.built&&this.app.index>=0&&this._setLOD(this._lodRadius||0)}_setLOD(e){this._lodRadius=e,this.farm.assignLOD(this.patch.x,this.patch.z,this.lite?0:e),this._apply()}enter(e){let t=this.app,n=t.tags;switch(this.labOn=!1,t.phoneFrame(!1),Yi("dawn"),this._lights("dawn"),this.farm.setWide(e==="open"||e==="noor-1"||e==="close"),this.target=this.defaultSeed,e){case"open":this._setLOD(0),this._paint(this.heroSeeds,.78,5.5),n.only([]);break;case"noor-1":this._setLOD(0),this._paint(this.heroSeeds,.72,5),n.only(["t-coffee","t-maize","t-beans"]);break;case"noor-2":this._setLOD(20),this._paint([this.defaultSeed],.36,3.6),n.only(["t-noor"]);break;case"noor-3":this._setLOD(14),this._paint([this.defaultSeed],.2,2.2),n.only(["t-spots"]);break;case"lab":this.level=2,this.labOn=!0,this._setLOD(16),n.only([]),this._paintTarget();break;case"pairs":this._setLOD(16),this._paint([this.defaultSeed],.32,2.4),n.only([]),t.phoneFrame(!0);break;case"close":this._setLOD(0),this._paint(this.heroSeeds,.8,8),n.only([]);break;default:break}}leave(){this.app.phoneFrame(!1)}control(e,t){switch(e){case"level":this.level=ut(parseInt(t.value,10)||0,0,4),this._paintTarget();break;case"light":Yi(t.dataset.light),this._lights(t.dataset.light);break;case"view":{let n=(Math.random()*2-1)*1.2,s=3.8+Math.random()*2.6,r=1+Math.random()*1.8;this.app.rig.flyTo(this._viewPose(this.target,n,s,r),1);break}case"spot":{let n=this.farm.shrubs.map((s,r)=>r).filter(s=>this.farm.shrubs[s].lod===1&&s!==this.target);if(!n.length)break;this._goTo(n[Math.floor(Math.random()*n.length)]);break}case"shutter":this.shoot(1);break;case"batch":this.shoot(12);break;default:break}}_goTo(e){this.target=e,this._paintTarget(),this.app.rig.flyTo(this._viewPose(e,-.38,5.6,1.9),1.2)}pick(e,t){if(!this.labOn)return!1;let n=this.app.camera,s=new P,r=-1,a=2116,o=window.innerWidth,l=window.innerHeight;return this.farm.shrubs.forEach((c,h)=>{if(c.lod!==1||(s.set(c.x,c.y+1,c.z).project(n),s.z>1))return;let d=(s.x*.5+.5)*o,u=(-s.y*.5+.5)*l,p=(d-e)**2+(u-t)**2;p<a&&(a=p,r=h)}),r<0?!1:(this._goTo(r),!0)}_grab(e){let t=this.app,n=t.renderer.domElement,s=n.width/window.innerWidth,r=Math.max(0,e.left*s),a=Math.max(0,e.top*s),o=Math.min(n.width-r,e.width*s),l=Math.min(n.height-a,e.height*s),c=[],h=dt.uSeam.value,d=xf();for(let u of[!1,!0]){dt.uSeam.value=u?0:1,t.renderNow();let p=document.createElement("canvas");p.width=240,p.height=Math.round(240*(l/o));let g=p.getContext("2d");if(u)g.fillStyle="#2a1b52",g.fillRect(0,0,p.width,p.height);else{let _=g.createLinearGradient(0,0,0,p.height);_.addColorStop(0,d[0]),_.addColorStop(.3,d[1]),_.addColorStop(.5,d[2]),_.addColorStop(.68,d[3]),g.fillStyle=_,g.fillRect(0,0,p.width,p.height)}g.drawImage(n,r,a,o,l,0,0,p.width,p.height),c.push(p)}return dt.uSeam.value=h,t.renderNow(),c}_pickLevel(e){let t=e();return t<.2?0:1+Math.min(3,Math.floor((t-.2)/.8*4))}async shoot(e){if(this.shooting)return;this.shooting=!0;let t=this.app,s=document.getElementById("phoneFrame").getBoundingClientRect(),r={pos:t.rig.pos.toArray(),target:t.rig.target.toArray(),fov:t.rig.fov,parallax:.4,drift:.4},a=ct(Date.now()%1e5),o=this.farm.shrubs.map((l,c)=>c).filter(l=>this.farm.shrubs[l].lod===1);o.length||o.push(this.defaultSeed),t.panels.busy(!0);for(let l=0;l<e;l++){let c=o[Math.floor(a()*o.length)],h=this.farm.shrubs[c],d=this._pickLevel(a),u=Wf[Math.floor(a()*Wf.length)],p=a()*Math.PI*2,g=3.6+a()*3.6,_=.7+a()*1.9;this._paint([c],Xf[d],2.4),Yi(u.name,!0),t.rig.jumpTo({pos:[h.x+Math.cos(p)*g,h.y+_,h.z+Math.sin(p)*g],target:[h.x,h.y+1.1,h.z],fov:38+a()*14,parallax:0,drift:0}),t.renderNow();let[f,m]=this._grab(s),b=d?`rust yes \xB7 severity ${d}`:"rust no \xB7 healthy";t.panels.addPair(f,m,`${b} \xB7 ${u.label}`),this.pairs++,t.panels.out("pairs",String(this.pairs)),await new Promise(E=>setTimeout(E,e>1?260:0))}Yi("dawn",!0),this._paint([this.defaultSeed],.32,2.4),t.rig.jumpTo(r),t.panels.busy(!1),this.shooting=!1}}});var Ax,Wh,qf,kl,Yf=ot(()=>{Ft();Sl();$i();yf();bf();Sf();Mf();wf();Ef();Zi();Gh();nn();Ax={pos:[0,4,46],target:[0,2,0],fov:34,parallax:.6},Wh=class extends dn{pose(){return Ax}},qf=()=>new Promise(i=>setTimeout(i,0)),kl=class{constructor(e={}){this.index=-1,this.count=_n.length,this.pointer={x:0,y:0},this.sceneClasses=e,this.swapTimer=0,this.active=null,this.perf={acc:0,n:0,skip:90,slow:0},this.lite=!1,this.paused=!1,this.reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let t=new URLSearchParams(location.search);this.maxDpr=Math.min(window.devicePixelRatio||1,parseFloat(t.get("dpr")||"1.5")),this.dpr=this.maxDpr,this.aa=t.get("aa")!=="0",this.forceNoGL=t.get("nogl")==="1"}async boot(){window.__app=this;let e=document.getElementById("gl");this.canvas=e,this.panels=new Pl(this);try{if(this.forceNoGL)throw new Error("WebGL switched off for testing");this.renderer=new vl({canvas:e,antialias:this.aa,alpha:!0,powerPreference:"high-performance"})}catch{this._noGL();return}this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=Qe,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=cs,this.quality=window.innerWidth<800?.7:1,this.scene3d=new Sr,this.camera=new hn(30,1,.5,5e3),this.rig=new Rl(this.camera),this.seam=new Al(document.getElementById("seam")),this.tags=new Cl(document.getElementById("tags"),this.camera),Yi("dawn",!0),this.resize(),window.addEventListener("resize",()=>this.resize()),window.addEventListener("pointermove",o=>{this.pointer.x=o.clientX/window.innerWidth*2-1,this.pointer.y=o.clientY/window.innerHeight*2-1},{passive:!0}),this.rail=new Il,this.input=new Ll(this),this._chrome();let t=["800 40px Bricolage","700 40px Bricolage","400 30px Instrument","600 30px Instrument","700 30px Instrument","400 24px DMMono","500 24px DMMono"].map(o=>document.fonts.load(o).catch(()=>{}));await Promise.race([Promise.all(t),new Promise(o=>setTimeout(o,2500))]);let n=document.getElementById("preloaderBar"),s=[...new Set(_n.map(o=>o.scene))];this.scenes={};for(let o=0;o<s.length;o++){let l=s[o],c=this.sceneClasses[l]||Wh,h=new c(this);this.scenes[l]=h,this.scene3d.add(h.group),await qf(),h.build(d=>{n.style.width=`${(o+d)/s.length*100}%`}),h.built=!0}n.style.width="100%";let r=location.hash.replace("#",""),a=_n.findIndex(o=>o.id===r);a<0&&(a=0),this.go(a,{instant:!0}),await qf(),document.body.classList.add("is-ready"),a===0&&this.seam.go(.5,{mode:"follow"}),this._keepAwake(),e.addEventListener("click",o=>{this.active&&this.active.pick(o.clientX,o.clientY)}),window.addEventListener("hashchange",()=>{let o=_n.findIndex(l=>l.id===location.hash.replace("#",""));o>=0&&o!==this.index&&this.go(o)}),this.last=performance.now(),requestAnimationFrame(o=>this._frame(o))}_noGL(){document.body.classList.add("no-gl","is-ready");let e=document.getElementById("nogl");e.hidden=!1,this.panels.root.before(e),this.panels.els.forEach(t=>{t.removeAttribute("inert"),t.removeAttribute("aria-hidden"),t.classList.add("is-active")})}_keepAwake(){let e=async()=>{try{this._wake=await navigator.wakeLock?.request("screen")}catch{}};e(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&e()})}_chrome(){document.getElementById("btnNotes").addEventListener("click",()=>this.toggleNotes()),document.getElementById("btnKeys").addEventListener("click",()=>this.toggleKeys()),document.getElementById("btnFull").addEventListener("click",()=>this.fullscreen()),document.getElementById("brand").addEventListener("click",e=>{e.preventDefault(),this.go(0)})}resize(){let e=window.innerWidth,t=window.innerHeight;this.renderer.setPixelRatio(this.dpr),this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix();let n=new ge;if(this.renderer.getDrawingBufferSize(n),dt.uRes.value.copy(n),this.tags.resize(e,t),this.seam&&this.seam._write(),this.scenes)for(let s of Object.values(this.scenes))s.resize(e,t)}_perf(e){let t=this.perf;if(t.skip>0){t.skip--;return}if(t.acc+=e,t.n++,t.n<80)return;let n=t.acc/t.n;t.acc=0,t.n=0,n>.024&&this.dpr>1?(this.dpr=Math.max(1,this.dpr-.15),this.resize(),t.skip=40,t.slow=0):n>.034&&this.dpr<=1&&!this.lite?++t.slow>=2&&this.setLite(!0):(n<.0135&&this.dpr<this.maxDpr&&!this.lite&&(this.dpr=Math.min(this.maxDpr,this.dpr+.1),this.resize(),t.skip=40),t.slow=0)}setLite(e){if(this.lite=e,document.body.dataset.lite=e?"1":"0",this.scenes)for(let t of Object.values(this.scenes))t.setLite?.(e);e&&(this.dpr=1,this.resize())}next(){this.go(this.index+1)}prev(){this.go(this.index-1)}go(e,{instant:t=!1}={}){if(e=ut(e,0,this.count-1),e===this.index&&!t)return;let n=_n[this.index],s=_n[e];this.index=e;try{history.replaceState(null,"",`#${s.id}`)}catch{}let r=document.body;r.dataset.chapter=s.chapter,r.dataset.beat=s.id,r.dataset.grid=s.grid?"1":"0",this.panels.show(e),this.rail.update(e),this._notes(),Yi(s.env,t),this.seam.show(s.seam.show),this.seam.go(s.seam.v,{mode:s.seam.mode,instant:t}),this.tags.clear();let a=this.scenes[s.scene],o=a.pose(s.id),l=()=>(this.active&&this.active!==a&&(this.active.group.visible=!1,this.active.leave()),a.group.visible=!0,this.active=a,a.enter(s.id,n&&n.id),!0);clearTimeout(this.swapTimer);let c=!n||n.scene!==s.scene||this.active!==a;if(t)l(),this.rig.jumpTo(o);else if(c)this.canvas.classList.add("is-fading"),this.swapTimer=setTimeout(()=>{l(),this.rig.jumpTo(this._pulled(o,.16)),this.rig.flyTo(o,1.9),this.canvas.classList.remove("is-fading")},300);else{l();let h=this.rig.pos.distanceTo(new P().fromArray(o.pos));this.rig.flyTo(o,ut(1.2+h/90,1.3,2.4))}}_pulled(e,t){let n=new P().fromArray(e.target),s=new P().fromArray(e.pos);return s.sub(n).multiplyScalar(1+t).add(n),{...e,pos:s.toArray()}}control(e,t,n){this.active&&this.active.control(e,t,n)}action(e){switch(e){case"next":this.next();break;case"first":this.go(0);break;case"sources":this.panels.openSheet();break;case"closeSheet":this.panels.closeSheet();break;case"closeOverlays":document.getElementById("notes").hidden=!0,document.getElementById("btnNotes").setAttribute("aria-pressed","false"),document.getElementById("keys").hidden=!0,document.getElementById("btnKeys").setAttribute("aria-pressed","false");break;default:break}}toggleNotes(){let e=document.getElementById("notes");e.hidden=!e.hidden,document.getElementById("btnNotes").setAttribute("aria-pressed",String(!e.hidden))}toggleKeys(){let e=document.getElementById("keys");e.hidden=!e.hidden,document.getElementById("btnKeys").setAttribute("aria-pressed",String(!e.hidden))}fullscreen(){document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{})}_notes(){document.getElementById("notesText").textContent=_n[this.index].notes}currentBeat(){return _n[this.index].id}phoneFrame(e){document.getElementById("phoneFrame").classList.toggle("is-on",e)}renderNow(){this.rig.update(1e-4,dt.uTime.value,{x:0,y:0}),this.renderer.render(this.scene3d,this.camera)}togglePause(){this.paused=!this.paused,document.body.dataset.paused=this.paused?"1":"0"}get motion(){return!this.paused&&!this.reduced}_frame(e){let t=Math.min(.05,(e-this.last)/1e3);this.last=e;let n=this.motion;n&&(dt.uTime.value+=t),vf(t),this.seam.update(t),this.rig.update(t,dt.uTime.value,this.pointer),this.active&&this.active.update(t,dt.uTime.value,n),this.tags.update(),this.renderer.render(this.scene3d,this.camera),this._perf(t),window.__fps=1/Math.max(t,.001),requestAnimationFrame(s=>this._frame(s))}}});function kn(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;sa.copy(e),sa[n]=0,sa.normalize();let c=.5*a/(a+o),h=1-sa.angleTo(i)/l;return Math.sign(sa[t])===1?h*c:o/(a+o)+c+c*(1-h)}var sa,pt,$f=ot(()=>{Ft();sa=new P;pt=class i extends Sn{constructor(e=1,t=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let l=new P,c=new P,h=new P(e,t,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,u=this.attributes.normal.array,p=this.attributes.uv.array,g=d.length/6,_=new P,f=.5/a;for(let m=0,b=0;m<d.length;m+=3,b+=2)switch(l.fromArray(d,m),c.copy(l),c.x-=Math.sign(c.x)*f,c.y-=Math.sign(c.y)*f,c.z-=Math.sign(c.z)*f,c.normalize(),d[m+0]=h.x*Math.sign(l.x)+c.x*r,d[m+1]=h.y*Math.sign(l.y)+c.y*r,d[m+2]=h.z*Math.sign(l.z)+c.z*r,u[m+0]=c.x,u[m+1]=c.y,u[m+2]=c.z,Math.floor(m/g)){case 0:_.set(1,0,0),p[b+0]=kn(_,c,"z","y",r,n),p[b+1]=1-kn(_,c,"y","z",r,t);break;case 1:_.set(-1,0,0),p[b+0]=1-kn(_,c,"z","y",r,n),p[b+1]=1-kn(_,c,"y","z",r,t);break;case 2:_.set(0,1,0),p[b+0]=1-kn(_,c,"x","z",r,e),p[b+1]=kn(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),p[b+0]=1-kn(_,c,"x","z",r,e),p[b+1]=1-kn(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),p[b+0]=1-kn(_,c,"x","y",r,e),p[b+1]=1-kn(_,c,"y","x",r,t);break;case 5:_.set(0,0,-1),p[b+0]=kn(_,c,"x","y",r,e),p[b+1]=1-kn(_,c,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}}});function zl(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function Hl(i,e,t,n,s,r,a,o){return i.save(),i.translate(e,t),i.rotate(r),i.beginPath(),i.moveTo(-n/2,0),i.bezierCurveTo(-n*.25,-s*.75,n*.25,-s*.7,n/2,0),i.bezierCurveTo(n*.25,s*.7,-n*.25,s*.75,-n/2,0),i.closePath(),i.fillStyle=a,i.fill(),o&&(i.strokeStyle=o,i.lineWidth=Math.max(1,s*.05),i.beginPath(),i.moveTo(-n/2,0),i.lineTo(n/2,0),i.stroke()),i.restore(),{cx:e,cy:t,len:n,wid:s,rot:r}}function Vl(i,e,t,n,s=1,r=!1){i.save(),i.translate(e.cx,e.cy),i.rotate(e.rot);for(let a=0;a<t;a++){let o=(n()-.5)*e.len*.7,l=(n()-.5)*e.wid*.7,c=(3+n()*5)*s;i.fillStyle=r?"#ffe14d":"rgba(235, 214, 70, 0.9)",i.beginPath(),i.arc(o,l,c,0,6.283),i.fill(),i.fillStyle=r?"#f2552c":"rgba(205, 92, 14, 0.95)",i.beginPath(),i.arc(o,l,c*.5,0,6.283),i.fill()}i.restore()}function Zf(i,e,t,n=Jt,s=Ot){let r=i.getImageData(0,0,n,s);for(let a=0;a<r.data.length;a+=4){let o=(t()-.5)*e;r.data[a]+=o,r.data[a+1]+=o,r.data[a+2]+=o}i.putImageData(r,0,0)}function Rx(i,e,t,n=14,s=Ot-34){i.font='700 15px "DMMono", ui-monospace, monospace';let r=i.measureText(e).width+18;zl(i,n,s,r,24,7),i.fillStyle=t,i.fill(),i.fillStyle="#fff",i.textBaseline="middle",i.fillText(e,n+9,s+12.5)}function Cx(i,e,t,n){let s=ct(t),r=[],a=4+Math.floor(s()*2);for(let l=0;l<a;l++)r.push({cx:50+s()*156,cy:90+s()*150,len:90+s()*60,wid:40+s()*22,rot:-1.2+s()*2.4,tone:s(),sp:Math.floor(s()*7*n)+(s()<.4?2:0),s:s()});let o=ct(t+77);for(let l of r)if(e==="mask"){let c=Hl(i,l.cx,l.cy,l.len,l.wid,l.rot,O.healthy,null);Vl(i,c,l.sp,o,1+n*.5,!0)}else{let c=e==="sim"?`hsl(${128+l.tone*14}, 52%, ${30+l.tone*10}%)`:`hsl(${112+l.tone*24}, 38%, ${22+l.tone*14}%)`,h=Hl(i,l.cx,l.cy,l.len,l.wid,l.rot,c,"rgba(255,255,255,0.28)");Vl(i,h,l.sp,o,1+n*.5,!1)}}function ra(i,e=0,t=null,n=null){let s=`${i}|${e}|${t}|${n}`;if(Xh.has(s))return Xh.get(s);let r=document.createElement("canvas");r.width=Jt,r.height=Ot;let a=r.getContext("2d"),o=ct(900+e*31);switch(a.save(),zl(a,4,4,Jt-8,Ot-8,22),a.clip(),i){case"studio":{a.fillStyle="#ffffff",a.fillRect(0,0,Jt,Ot);let l=Hl(a,Jt/2+(o()-.5)*20,Ot/2-12,190,96,-.5+o()*1,"hsl(120,45%,32%)","rgba(255,255,255,0.35)");Vl(a,l,3+Math.floor(o()*7),o,1.3,!1),a.fillStyle="rgba(21,24,52,0.07)",a.fillRect(0,Ot-60,Jt,60);break}case"field":case"fail":{let l=a.createLinearGradient(0,0,0,Ot);l.addColorStop(0,"#53432f"),l.addColorStop(1,"#2a2118"),a.fillStyle=l,a.fillRect(0,0,Jt,Ot);for(let c=0;c<11;c++){let h=Hl(a,o()*Jt,o()*Ot,70+o()*120,36+o()*40,o()*6.28,`hsl(${100+o()*40}, ${28+o()*22}%, ${14+o()*22}%)`,"rgba(255,255,255,0.12)");o()<.5&&Vl(a,h,1+Math.floor(o()*4),o,.8,!1)}a.fillStyle="rgba(0,0,0,0.22)",a.fillRect(0,0,Jt,60),a.fillStyle="rgba(255,230,170,0.10)",a.fillRect(0,Ot*.55,Jt,40),Zf(a,36,o),a.filter="blur(1.4px)",a.drawImage(r,0,0),a.filter="none";break}case"sim":case"mask":case"refined":{let l=e%5/4;if(i==="mask")a.fillStyle=O.dusk,a.fillRect(0,0,Jt,Ot);else{let c=a.createLinearGradient(0,0,0,Ot);i==="sim"?(c.addColorStop(0,"#bcd3f5"),c.addColorStop(.45,"#dfe8f4"),c.addColorStop(1,"#8c6a4e")):(c.addColorStop(0,"#a9b9cf"),c.addColorStop(.5,"#c9c2b4"),c.addColorStop(1,"#5d4634")),a.fillStyle=c,a.fillRect(0,0,Jt,Ot)}if(Cx(a,i,40+e*13,.35+l*.65),i==="refined"){a.fillStyle="rgba(70,40,10,0.10)",a.fillRect(0,0,Jt,Ot);let c=a.createRadialGradient(Jt/2,Ot/2,60,Jt/2,Ot/2,230);c.addColorStop(0,"rgba(0,0,0,0)"),c.addColorStop(1,"rgba(0,0,0,0.38)"),a.fillStyle=c,a.fillRect(0,0,Jt,Ot),Zf(a,40,o),a.filter="blur(0.8px)",a.drawImage(r,0,0),a.filter="none"}break}default:a.fillStyle="#ddd",a.fillRect(0,0,Jt,Ot)}return a.restore(),i==="fail"&&(a.fillStyle="rgba(242,85,44,0.18)",zl(a,4,4,Jt-8,Ot-8,22),a.fill()),t&&(zl(a,5,5,Jt-10,Ot-10,21),a.lineWidth=10,a.strokeStyle=t,a.stroke()),n&&Rx(a,n,t||O.ink),Xh.set(s,r),r}function Yh(i,e=0,t=null,n=null){let s=`${i}|${e}|${t}|${n}`;if(qh.has(s))return qh.get(s);let r=new tn(ra(i,e,t,n));return r.colorSpace=Qe,r.anisotropy=4,qh.set(s,r),r}function sn(i,e=0,t=null,n=null,s=1){let r=new ye(Px,new Pt({map:Yh(i,e,t,n),transparent:!0,side:nt}));return r.scale.setScalar(s),r.userData.kind=i,r}function Gl(i,e=O.ink,t=.5){let n=new $n(i.map(a=>new P(...a)),!1,"catmullrom",.3),s=new Je().setFromPoints(n.getPoints(80)),r=new Fn(s,new Mn({color:e,transparent:!0,opacity:t,dashSize:.5,gapSize:.35}));return r.computeLineDistances(),r}function rn(i,e,t=.9,n="#ffffff",s=O.ink){let r=new Ie,a=new ye(new pt(i,t,e,3,.28),new Si({color:n,roughness:.55,metalness:0}));a.position.y=t/2,a.castShadow=!0,a.receiveShadow=!0,r.add(a);let o=new ye(new pt(i-1.4,.1,.42,2,.04),new Si({color:s,roughness:.4}));return o.position.set(0,t+.02,e/2-.62),r.add(o),r}function Wl(i,e=O.ink,t=.35,n=28){let s=new Bn(new On(i.geometry,n),new Yn({color:e,transparent:!0,opacity:t}));return i.add(s),s}function St(i,e=.6){return new Si({color:i,roughness:e,metalness:0})}function Ki(i,e=140){let t=new zr(16777215,13226214,1.35),n=new Vr(16777215,2.6);n.position.set(-34,70,46),n.castShadow=!0,n.shadow.mapSize.set(2048,2048);let s=n.shadow.camera;s.left=-e,s.right=e,s.top=e*.7,s.bottom=-e*.7,s.near=10,s.far=260,n.shadow.bias=-4e-4,n.shadow.radius=5,n.target.position.set(40,0,0);let r=new ye(new Tt(e*4,e*4),new Br({opacity:.2,color:2764646}));return r.rotation.x=-Math.PI/2,r.receiveShadow=!0,i.add(t,n,n.target,r),{hemi:t,sun:n,floor:r}}var O,Jt,Ot,Xh,qh,Px,gs,rr=ot(()=>{Ft();$f();nn();O={ink:"#151834",slate:"#565c7e",sim:"#2b4de8",real:"#7b4a2d",healthy:"#19b3c8",early:"#ffe14d",alarm:"#f2552c",dusk:"#2a1b52",mist:"#eef1f8",fog:"#c9d0e6",paper:"#ffffff",fruit:"#b15cf5",wood:"#dcd6f4"},Jt=256,Ot=320,Xh=new Map;qh=new Map;Px=new Tt(1.6,2);gs=class{constructor(e,t,{speed:n=.07,lift:s=0,fade:r=.08,offset:a=0}={}){this.curve=new $n(e.map(o=>new P(...o)),!1,"catmullrom",.3),this.items=t,this.speed=n,this.lift=s,this.fade=r,this.offset=a,this.visible=!0,this.base=t.map(o=>o.scale.x),this._v=new P}get length(){return this.curve.getLength()}update(e){let t=this.items.length;for(let n=0;n<t;n++){let s=this.items[n],r=((e*this.speed+n/t+this.offset)%1+1)%1;this.curve.getPointAt(r,this._v),s.position.copy(this._v),s.position.y+=Math.sin(r*Math.PI*6+n)*.06+this.lift;let a=Math.min(1,r/this.fade,(1-r)/this.fade),o=this.base[n]*(.15+.85*a);s.scale.setScalar(o),s.visible=this.visible&&a>.02}}}});function ar(i,e,t,n=512){let s=document.createElement("canvas");s.width=n,s.height=Math.round(n*(e/i));let r=s.getContext("2d"),a=new tn(s);a.colorSpace=Qe,a.anisotropy=4;let o=new ye(new Tt(i,e),new Pt({map:a,transparent:!0,side:nt}));return o.userData.redraw=()=>{r.clearRect(0,0,s.width,s.height),t(r,s.width,s.height),a.needsUpdate=!0},o.userData.redraw(),o}var Ye,Jf,Ix,Kf,_s,Lx,$h,Xl,jf=ot(()=>{Ft();Zi();rr();nn();Ye={real:[0,0,10],scar:[-27,0,10],s1:[-24,0,-14],s2:[0,0,-14],s3:[24,0,-14],s4:[48,0,-14],s5:[38,0,10],s6:[72,0,10]},Jf=["rec-1","rec-2","rec-3","rec-4","rec-5","rec-6","rec-7","rec-8"],Ix={"rec-1":["real","s5","s6"],"rec-2":["s1","s2"],"rec-3":["s3"],"rec-4":["s4","syn"],"rec-5":["s5x"],"rec-6":["scar"],"rec-7":["s6x","real2"],"rec-8":[]},Kf={};Jf.forEach((i,e)=>{Kf[i]=Jf.slice(0,e+1).flatMap(t=>Ix[t])});_s=(i,e,t,n,s,r)=>{i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()},Lx=i=>i===0?0:i<=3?1:i<=6?2:i<=10?3:4,$h=[0,2,5,8,13,17],Xl=class extends dn{build(e){let t=this.group;this.rig=Ki(t,130),this.items={},this.flows=[],this.t=0;let n=(s,r,a)=>(r.position.set(...a),r.userData.cur=0,r.userData.tgt=0,r.userData.base=a[1],this.items[s]=r,t.add(r),r);n("real",this._real(),Ye.real),n("s1",this._s1(),Ye.s1),n("s2",this._s2(),Ye.s2),n("s3",this._s3(),Ye.s3),n("s4",this._s4(),Ye.s4),n("syn",this._synBranch(),[0,0,0]),n("s5",this._s5(),Ye.s5),n("s5x",this._s5x(),Ye.s5),n("s6",this._s6(),Ye.s6),n("s6x",this._s6x(),Ye.s6),n("real2",this._realBranch(),[0,0,0]),n("scar",this._scar(),Ye.scar),e&&e(.8),this._poses(),this._tags(),this.built=!0}_real(){let e=new Ie;e.add(rn(15,8,.9,"#ffffff",O.real));let t=9;for(let r=0;r<t;r++){let a=sn("studio",r,O.real,r===0?"BRACOL":null,1.15);a.position.set(-5.6+r*1.4,2.3,.4-r*.05),a.rotation.y=-.35+r*.01,a.rotation.x=-.1,e.add(a)}let n=[];for(let r=0;r<7;r++){let a=sn("studio",r+20,O.real,null,.55);e.add(a),n.push(a)}let s=new gs([[8,1.6,0],[16,1.6,0],[24,1.6,0],[30,1.6,0]],n,{speed:.06,fade:.1});return s.group="real",this.flows.push(s),e.userData.guide=Gl([[8,.4,.2],[18,.4,.2],[30,.4,.2]],O.real,.6),e.add(e.userData.guide),e}_s1(){let e=new Ie;e.add(rn(17,11,.9,"#ffffff",O.sim)),this.ladder=[];for(let n=0;n<5;n++){let s=ar(3,3.6,(r,a,o)=>{r.fillStyle="#fff",_s(r,4,4,a-8,o-8,36),r.fill(),r.lineWidth=8,r.strokeStyle=O.sim,r.stroke(),r.save(),r.translate(a/2,o*.43),r.rotate(-.45),r.beginPath(),r.moveTo(-a*.34,0),r.bezierCurveTo(-a*.17,-o*.26,a*.17,-o*.26,a*.34,0),r.bezierCurveTo(a*.17,o*.26,-a*.17,o*.26,-a*.34,0),r.fillStyle="#1f6b3a",r.fill();let l=ct(5+n),c=[0,3,6,10,16][n];for(let h=0;h<c;h++){let d=(l()-.5)*a*.5,u=(l()-.5)*o*.2,p=7+n*5*l();r.fillStyle="rgba(240,215,60,0.95)",r.beginPath(),r.arc(d,u,p,0,6.28),r.fill(),r.fillStyle=n>=3?"#4a2a12":"rgba(210,95,14,0.95)",r.beginPath(),r.arc(d,u,p*.5,0,6.28),r.fill()}r.restore(),r.fillStyle=O.ink,r.font='600 40px "DMMono", monospace',r.textAlign="center",r.fillText(`severity ${n}`,a/2,o*.9)},384);s.position.set(-6.4+n*3.2,3,.5),s.rotation.y=.12,e.add(s),this.ladder.push(s)}let t=ar(9,2.4,(n,s,r)=>{n.fillStyle="#fff",_s(n,4,4,s-8,r-8,28),n.fill(),n.lineWidth=6,n.strokeStyle=O.sim,n.stroke(),n.fillStyle=O.ink,n.font='700 38px "Instrument", sans-serif',n.textAlign="left",n.fillText("Rust spots: number, size, place",34,70),n.font='400 30px "Instrument", sans-serif',n.fillStyle=O.slate,n.fillText("Severity 0 to 4, the same scale as BRACOL",34,124)},720);return t.position.set(0,.95,4.4),t.rotation.x=-.9,e.add(t),e}_backdrop(e){let t=document.createElement("canvas");t.width=384,t.height=256;let n=t.getContext("2d"),s=ct(300+e*17);if(e===0){let a=n.createRadialGradient(192,120,20,192,128,230);a.addColorStop(0,"#ffffff"),a.addColorStop(1,"#e3e7f0"),n.fillStyle=a,n.fillRect(0,0,384,256)}else if(e===1){n.fillStyle="#7a4d33",n.fillRect(0,0,384,256);for(let a=0;a<260;a++)n.fillStyle=`rgba(${40+s()*60},${22+s()*30},${10+s()*20},0.35)`,n.beginPath(),n.arc(s()*384,s()*256,3+s()*14,0,6.283),n.fill()}else{n.fillStyle="#1e4a2e",n.fillRect(0,0,384,256);for(let a=0;a<40;a++)n.save(),n.translate(s()*384,s()*256),n.rotate(s()*6.28),n.fillStyle=`hsl(${105+s()*40},${35+s()*25}%,${16+s()*22}%)`,n.beginPath(),n.ellipse(0,0,40+s()*40,14+s()*14,0,0,6.283),n.fill(),n.restore()}let r=new tn(t);return r.colorSpace=Qe,r.anisotropy=4,r}_leafGeometry(){let n=new Ws;n.moveTo(-5.6/2,0),n.bezierCurveTo(-5.6*.25,1.7*1.1,5.6*.2,1.7*1.05,5.6/2,0),n.bezierCurveTo(5.6*.2,-1.7*1.05,-5.6*.25,-1.7*1.1,-5.6/2,0);let s=new Ur(n,28),r=s.attributes.position,a=s.attributes.uv;for(let o=0;o<r.count;o++){let l=r.getX(o),c=r.getY(o);a.setXY(o,l/5.6+.5,c/(1.7*2.2)+.5),r.setZ(o,.28*(1-(2*l/5.6)**2)-.1*(c/1.7)**2)}return s.computeVertexNormals(),s}_drawLeaf(e,t){let n=this.leafCanvas,s=n.getContext("2d"),r=n.width,a=n.height,o=ct(e),l=s.createLinearGradient(0,0,0,a);l.addColorStop(0,"#2f7a46"),l.addColorStop(.5,"#236538"),l.addColorStop(1,"#2f7a46"),s.fillStyle=l,s.fillRect(0,0,r,a),s.strokeStyle="rgba(255,255,255,0.35)",s.lineWidth=5,s.beginPath(),s.moveTo(0,a/2),s.lineTo(r,a/2),s.stroke(),s.lineWidth=2;for(let c=1;c<9;c++){let h=c/9*r;s.beginPath(),s.moveTo(h,a/2),s.lineTo(h+40,a/2-70),s.moveTo(h,a/2),s.lineTo(h+40,a/2+70),s.stroke()}for(let c=0;c<t;c++){let h=r*(.1+.8*o()),d=a*(.3+.4*o()),u=7+o()*14;s.fillStyle="rgba(235, 214, 70, 0.95)",s.beginPath(),s.arc(h,d,u,0,6.283),s.fill(),s.fillStyle="rgba(205, 92, 14, 0.95)",s.beginPath(),s.arc(h,d,u*.5,0,6.283),s.fill()}this.leafTex.needsUpdate=!0}_s2(){let e=new Ie;e.add(rn(20,14,.9,"#ffffff",O.sim)),this.bgTex=[0,1,2].map(l=>this._backdrop(l));let t=new ye(new pt(11.6,7.6,.3,2,.15),St(O.ink,.5));t.position.set(0,5,-4.7),t.castShadow=!0,e.add(t),this.bg=new ye(new Tt(11,7),new Pt({map:this.bgTex[0]})),this.bg.position.set(0,5,-4.53),e.add(this.bg),this.leafCanvas=document.createElement("canvas"),this.leafCanvas.width=512,this.leafCanvas.height=256,this.leafTex=new tn(this.leafCanvas),this.leafTex.colorSpace=Qe,this.leafTex.anisotropy=4,this.reseed=0,this._drawLeaf(11,$h[2]);let n=new ye(this._leafGeometry(),new Si({map:this.leafTex,roughness:.55,side:nt}));n.position.set(0,4.8,-1.2),n.castShadow=!0,e.add(n),this.leaf=n,this.curLabel="rust yes \xB7 severity 2",this.labelPlane=ar(7.6,1.5,(l,c,h)=>{l.fillStyle="#fff",_s(l,4,4,c-8,h-8,30),l.fill(),l.lineWidth=6,l.strokeStyle=O.sim,l.stroke(),l.fillStyle=O.slate,l.font='500 26px "DMMono", monospace',l.textAlign="left",l.fillText("LABEL",36,52),l.fillStyle=O.ink,l.font='700 44px "Instrument", sans-serif',l.fillText(this.curLabel,36,112)},640),this.labelPlane.position.set(0,1.55,5.2),this.labelPlane.rotation.x=-.75,e.add(this.labelPlane);let s=new Ie,r=new ye(new pt(1.7,1.2,1,2,.2),St(O.ink,.35));r.castShadow=!0,s.add(r);let a=new ye(new as(.42,.48,.8,20),St("#0b0d22",.2));a.rotation.x=Math.PI/2,a.position.z=.85,s.add(a),e.add(s),this.cam3=s,this.sun=new ye(new bi(.7,20,14),new Pt({color:"#ffd27a"})),e.add(this.sun);let o=new Fn(new Je().setFromPoints(new Oi(0,0,9,5,0,Math.PI,!1,0).getPoints(50).map(l=>new P(l.x,l.y+7,-2))),new Mn({color:O.ink,transparent:!0,opacity:.35,dashSize:.4,gapSize:.3}));return o.computeLineDistances(),e.add(o),e}_s3(){let e=new Ie;e.add(rn(17,11,.9,"#ffffff",O.sim));let t=new Ie,n=new ye(new pt(2.4,4.6,.36,3,.3),St(O.ink,.35));n.castShadow=!0,t.add(n);let s=ar(2,4.1,(l,c,h)=>{l.fillStyle="#0d1030",l.fillRect(0,0,c,h);let d=Yh("sim",3,null,null).image;l.drawImage(d,14,60,c-28,h*.62),l.strokeStyle="#fff",l.lineWidth=4;let u=34,p=40;for(let[g,_,f,m]of[[u,56,1,1],[c-u,56,-1,1],[u,h*.62+56,1,-1],[c-u,h*.62+56,-1,-1]])l.beginPath(),l.moveTo(g,_+m*p),l.lineTo(g,_),l.lineTo(g+f*p,_),l.stroke();l.fillStyle="#f2552c",l.beginPath(),l.arc(40,34,9,0,6.28),l.fill(),l.fillStyle="#fff",l.beginPath(),l.arc(c/2,h-70,30,0,6.28),l.fill(),l.fillStyle="#0d1030",l.beginPath(),l.arc(c/2,h-70,22,0,6.28),l.fill()},256);s.position.z=.19,t.add(s);let r=new ye(new as(.26,.26,.12,24),St("#0b0d22",.2));r.rotation.x=Math.PI/2,r.position.set(-.6,1.9,-.22),t.add(r),t.position.set(-5.2,3.2,1.2),t.rotation.y=.45,e.add(t),this.phone=t,this.knobs=ar(9.2,6.2,(l,c,h)=>this._drawKnobs(l,c,h),768),this.knobs.position.set(2.2,4.1,2.2),this.knobs.rotation.y=-.18,e.add(this.knobs),this.knobVals=[.2,.7,.4,.15,.6],this.knobTgt=[.5,.3,.8,.5,.2],this.knobT=0;let a=[];for(let l=0;l<6;l++){let c=new Ie,h=sn("sim",l,O.sim,"SYNTHETIC",1),d=sn("mask",l,O.sim,"LABEL",1);h.position.y=1.15,d.position.y=-1.15,c.add(h,d),c.scale.setScalar(.5),e.add(c),a.push(c)}let o=new gs([[9,3,2],[14,3,0],[19,3,0]],a,{speed:.05,fade:.12});return o.group="s3",this.flows.push(o),this.pairFlow=o,e}_drawKnobs(e,t,n){e.fillStyle="#fff",_s(e,6,6,t-12,n-12,36),e.fill(),e.lineWidth=8,e.strokeStyle=O.sim,e.stroke(),e.fillStyle=O.ink,e.font='700 44px "Instrument", sans-serif',e.textAlign="left",e.fillText("Changes on every image",44,82),["Rust spots","Light","Camera angle","Distance","Background"].forEach((r,a)=>{let o=150+a*72;e.fillStyle=O.slate,e.font='400 34px "Instrument", sans-serif',e.fillText(r,44,o+10),e.fillStyle="#e1e6f2",_s(e,330,o-8,380,16,8),e.fill(),e.fillStyle=O.sim,_s(e,330,o-8,380*(this.knobVals?.[a]??.5),16,8),e.fill(),e.fillStyle="#fff",e.strokeStyle=O.ink,e.lineWidth=5,e.beginPath(),e.arc(330+380*(this.knobVals?.[a]??.5),o,17,0,6.28),e.fill(),e.stroke()})}_s4(){let e=new Ie;e.add(rn(20,11,.9,"#ffffff",O.sim));for(let n=0;n<3;n++)for(let s=0;s<6;s++){let r=sn("sim",n*6+s+2,O.sim,n===0&&s===0?"SYNTHETIC":null,.62);r.position.set(-8.2+s*1.35,1.9+n*1.35,1.6-n*.5),r.rotation.x=-.45,e.add(r)}let t=ar(8.4,6,(n,s,r)=>{n.fillStyle="#fff",_s(n,6,6,s-12,r-12,34),n.fill(),n.lineWidth=8,n.strokeStyle=O.sim,n.stroke(),n.fillStyle=O.ink,n.font='700 40px "DMMono", monospace',n.textAlign="left",n.fillText("manifest.csv",40,74),n.fillStyle=O.slate,n.font='500 30px "DMMono", monospace',n.fillText("image",40,138),n.fillText("rust",400,138),n.fillText("split",520,138),n.fillStyle=O.fog,n.fillRect(40,154,s-80,3),[["leaf_0001.png",1],["leaf_0002.png",0],["leaf_0003.png",1],["leaf_0004.png",0],["leaf_0005.png",1]].forEach(([o,l],c)=>{let h=204+c*52;n.fillStyle=O.ink,n.font='400 30px "DMMono", monospace',n.fillText(o,40,h),n.fillStyle=l?O.alarm:O.healthy,n.font='700 30px "DMMono", monospace',n.fillText(String(l),410,h),n.fillStyle=O.ink,n.font='400 30px "DMMono", monospace',n.fillText("train",520,h)})},640);return t.position.set(5,4.3,1),t.rotation.y=-.22,e.add(t),e}_synBranch(){let e=new Ie,t=[[48,2,-8],[45,2.6,-2],[41,2.6,3],[39,2.4,5.4]];e.add(Gl(t,O.sim,.6));let n=[];for(let r=0;r<5;r++){let a=sn("sim",70+r,O.sim,null,.5);e.add(a),n.push(a)}let s=new gs(t,n,{speed:.05,fade:.1});return s.group="syn",this.flows.push(s),e}_realBranch(){let e=new Ie;e.add(Gl([[6,.3,12],[26,.3,17],[50,.3,17],[66,.3,14]],O.real,.55));let t=[];for(let s=0;s<4;s++){let r=sn(s%2?"field":"studio",50+s,O.real,null,.5);e.add(r),t.push(r)}let n=new gs([[6,1,12],[26,1,17],[50,1,17],[66,1.4,14]],t,{speed:.04,fade:.1});return n.group="real2",this.flows.push(n),e}_s5(){let e=new Ie;e.add(rn(15,11,.9,"#ffffff",O.ink)),this.layers=[];for(let t=0;t<8;t++){let n=t>=6,s=new ye(new pt(8.6,.62,6.2,2,.12),St(n?O.ink:"#dfe4f2",.5));s.position.set(0,1.3+t*.86,0),s.castShadow=!0,s.receiveShadow=!0,Wl(s,O.ink,n?0:.25,30),e.add(s),this.layers.push(s)}return e}_s5x(){let e=new Ie;for(let s=6;s<8;s++){let r=new ye(new pt(.5,.5,5.2,2,.1),St(O.ink,.4));r.position.set(4.6,1.3+s*.86,0),e.add(r)}return[[O.alarm,0],[O.healthy,1.4],["#c9d0e6",2.8]].forEach(([s,r],a)=>{let o=new ye(new as(.42,.42,1.1,20),St(s,.35));o.rotation.z=Math.PI/2,o.position.set(6.2,3.6+a*0,-1.4+r),o.castShadow=!0,e.add(o)}),this.phases=[],[[0,1],[1,0],[.5,.5]].forEach(([s,r],a)=>{let o=new Ie,l=4.2;if(s>0){let c=new ye(new pt(1.5,l*s,1.5,2,.1),St(O.sim,.5));c.position.y=l*r+l*s/2,c.castShadow=!0,o.add(c)}if(r>0){let c=new ye(new pt(1.5,l*r,1.5,2,.1),St(O.real,.5));c.position.y=l*r/2,c.castShadow=!0,o.add(c)}o.position.set(-5.4+a*2.1,.95,7.2),e.add(o),this.phases.push(o)}),e}_s6(){let e=new Ie;e.add(rn(15,11,.9,"#ffffff",O.ink));let t=new ye(new pt(4.2,3.4,4.2,3,.4),St("#cfd5e8",.45));return t.position.set(0,2.8,0),t.castShadow=!0,Wl(t,O.ink,.3,30),e.add(t),this.endModel=t,e}_s6x(){let e=new Ie,t=new ye(new pt(1.3,.5,1.3,2,.12),St(O.ink,.35));t.position.set(-4.6,1.3,3.2),t.castShadow=!0,e.add(t),this.chip=t;let n=[];for(let s=0;s<4;s++){let r=sn(s<2?"studio":"field",60+s,O.real,s<2?"TEST":"FARM",.82);r.position.set(-3.3+s*2.2,1.9,5),r.rotation.x=-.15,e.add(r),n.push(r)}return this.bench=n,e}_scar(){let e=new Ie;return e.add(rn(21,11,.9,"#ffffff",O.real)),this.scarTops=[],[.1,.25,.5,1].forEach((t,n)=>{let s=.8+t*5.2,r=-7.2+n*4.8,a=new ye(new pt(3.6,s,3.6,3,.35),St(O.real,.5));a.position.set(r,.9+s/2,.4),a.castShadow=!0,a.receiveShadow=!0,Wl(a,O.ink,.25,30),e.add(a);let o=new ye(new pt(3.6,1.3,3.6,3,.35),St(O.sim,.45));o.position.set(r,.9+s+.75,.4),o.castShadow=!0,e.add(o),this.scarTops.push(o)}),e}_poses(){this.poses={"rec-1":{pos:[34,46,104],target:[34,-14,8],fov:40,parallax:.5},"rec-2":{pos:[-12,32,44],target:[-12,-4,-12],fov:38,parallax:.5},"rec-3":{pos:[30,28,36],target:[30,-4,-12],fov:34,parallax:.5},"rec-4":{pos:[44,36,44],target:[44,-3,-4],fov:38,parallax:.5},"rec-5":{pos:[34,30,58],target:[37,1,6],fov:36,parallax:.5},"rec-6":{pos:[-24,30,50],target:[-24,0,6],fov:38,parallax:.5},"rec-7":{pos:[60,30,50],target:[62,0,8],fov:36,parallax:.5},"rec-8":{pos:[26,90,80],target:[26,-10,2],fov:44,parallax:.4}}}_tags(){let e=this.app.tags,t=(n,s,r)=>new P(n,s,r);e.add({id:"p-real",text:"BRACOL",sub:"real leaves \xB7 train 1,225 \xB7 test 261",anchor:t(-4,4.6,0),side:"r",len:22,color:O.real,big:!0}),e.add({id:"p-s1",text:"Blender leaf",sub:"3D leaf, rust material, severity 0 to 4",anchor:t(...Ye.s1).add(t(0,5.8,0)),side:"l",len:40,color:O.sim,big:!0}),e.add({id:"p-s2",text:"Blender scene",sub:"leaf, light, camera, backdrop",anchor:t(...Ye.s2).add(t(0,9.6,0)),side:"r",len:40,color:O.sim,big:!0}),e.add({id:"p-s3",text:"Render",sub:"an image and its label, every time",anchor:t(...Ye.s3).add(t(0,6.2,0)),side:"r",len:40,color:O.sim,big:!0}),e.add({id:"p-s4",text:"Synthetic set",sub:"images + table: image, rust, split",anchor:t(...Ye.s4).add(t(0,7.6,0)),side:"r",len:40,color:O.sim,big:!0}),e.add({id:"p-blender",text:"Blender",sub:"leaf, scene, render",anchor:t(10,9.4,-14),side:"r",len:40,color:O.sim,big:!0}),e.add({id:"p-syn",text:"Renders join the real photos",anchor:t(44,3.4,-1),side:"r",len:30,color:O.sim}),e.add({id:"p-s5",text:"Gemma 4 E2B",sub:"2.3B effective parameters",anchor:t(Ye.s5[0]-4.3,9.4,Ye.s5[2]+3),side:"l",len:26,color:O.ink,big:!0}),e.add({id:"p-frozen",text:"Frozen",sub:"the base model",anchor:t(Ye.s5[0]-4.3,3.4,Ye.s5[2]),side:"l",len:26,color:"#9aa3c6"}),e.add({id:"p-train",text:"LoRA",sub:"a thin layer we train",anchor:t(Ye.s5[0]+4.6,7.2,Ye.s5[2]),side:"r",len:26,color:O.ink}),e.add({id:"p-out",text:"Answers",sub:"rust \xB7 no rust \xB7 not sure",anchor:t(Ye.s5[0]+6.4,3.9,Ye.s5[2]),side:"r",len:36,color:O.alarm}),e.add({id:"p-pa",text:"Real only",sub:"step 1",anchor:t(Ye.s5[0]-5.4,5.6,Ye.s5[2]+7.2),side:"l",len:20,color:O.real}),e.add({id:"p-pb",text:"Renders only",sub:"step 3",anchor:t(Ye.s5[0]-3.3,7.8,Ye.s5[2]+7.2),side:"r",len:16,color:O.sim}),e.add({id:"p-pc",text:"Renders + real",sub:"step 4",anchor:t(Ye.s5[0]-1.2,5.6,Ye.s5[2]+7.2),side:"r",len:24,color:O.ink}),e.add({id:"p-s6",text:"Test",sub:"261 BRACOL leaves no run trains on",anchor:t(...Ye.s6).add(t(0,6.4,0)),side:"l",len:30,color:O.ink,big:!0}),e.add({id:"p-farm",text:"Real farm photos",sub:"the field test",anchor:t(Ye.s6[0]+1.1,4.3,Ye.s6[2]+5),side:"r",len:36,color:O.real,big:!0}),e.add({id:"p-chip",text:"Android build",sub:"size and speed not measured yet",anchor:t(Ye.s6[0]-4.6,2.4,Ye.s6[2]+3.2),side:"l",len:40,color:O.ink}),[["10%","128 leaves"],["25%","312 leaves"],["50%","614 leaves"],["100%","1,225 leaves"]].forEach(([n,s],r)=>{let a=.8+[.1,.25,.5,1][r]*5.2;e.add({id:`p-sc${r}`,text:n,sub:s,anchor:t(Ye.scar[0]-7.2+r*4.8,.9+a+2,Ye.scar[2]+.4),side:r<2?"l":"r",len:r%2?36:22,color:O.real,big:r===0})}),e.add({id:"p-scar",text:"Brown: real photos",sub:"Blue: renders added on top",anchor:t(Ye.scar[0]+6,1.2,Ye.scar[2]+5.4),side:"r",len:30,color:O.sim})}enter(e){let t=new Set(Kf[e]||[]);Object.entries(this.items).forEach(([r,a])=>{a.userData.tgt=t.has(r)?1:0});let n=this.app.tags,s={"rec-1":["p-real","p-s5","p-s6"],"rec-2":["p-s1","p-s2"],"rec-3":["p-s3"],"rec-4":["p-s4","p-syn"],"rec-5":["p-s5","p-frozen","p-train","p-out","p-pa","p-pb","p-pc"],"rec-6":["p-sc0","p-sc1","p-sc2","p-sc3","p-scar"],"rec-7":["p-s6","p-farm","p-chip"],"rec-8":["p-real","p-blender","p-s4","p-s5","p-s6"]};n.only(s[e]||[]),this.beat=e}leave(){}update(e,t,n=!0){n&&(this.t+=e);let s=this.t;for(let r of Object.values(this.items)){let a=r.userData;a.cur=bt(a.cur,a.tgt,4.5,e);let o=El(Math.min(1,a.cur));r.visible=a.cur>.01,r.scale.setScalar(.55+.45*o),r.userData.keepY||(r.position.y=a.base-(1-o)*4)}for(let r of this.flows){let a=this.items[r.group];r.visible=!!a&&a.visible&&a.userData.cur>.5,r.update(s)}if(this.leaf){let r=Math.floor(s/2.2);if(r!==this._step){this._step=r;let l=$h[r%$h.length];this._drawLeaf(40+r*7,l),this.bg.material.map=this.bgTex[r%3],this.bg.material.needsUpdate=!0;let c=Lx(l);this.curLabel=c?`rust yes \xB7 severity ${c}`:"rust no \xB7 healthy",this.labelPlane.userData.redraw()}let a=Math.sin(s*.7)*.75;this.cam3.position.set(Math.sin(a)*8,4.2+Math.sin(s*.5)*.7,-1.2+Math.cos(a)*6.4),this.cam3.lookAt(this.leaf.position),this.leaf.rotation.set(-.1+Math.sin(s*.6)*.12,.25+Math.sin(s*.45)*.3,Math.sin(s*.5)*.12);let o=s*.35%Math.PI;this.sun.position.set(Math.cos(Math.PI-o)*9,Math.sin(o)*5+7,-2)}if(this.phone){this.phone.position.x=-5.2+Math.sin(s*.9)*.9,this.phone.rotation.y=.45+Math.sin(s*.9)*.18,this.knobT+=e,this.knobT>1&&(this.knobT=0,this.knobTgt=this.knobTgt.map(()=>.12+Math.random()*.76));let r=!1;this.knobVals=this.knobVals.map((a,o)=>{let l=bt(a,this.knobTgt[o],3,e);return Math.abs(l-a)>8e-4&&(r=!0),l}),r&&this.knobs.parent&&this.knobs.parent.visible&&this.knobs.userData.redraw()}if(this.phases&&this.phases.forEach((r,a)=>{let o=Math.floor(s/2.2)%3===a;r.scale.y=bt(r.scale.y,o?1:.82,6,e)}),this.scarTops&&this.scarTops.forEach((r,a)=>{let o=Math.floor(s/1.6)%4===a;r.scale.y=bt(r.scale.y,o?1.25:1,5,e)}),this.endModel){let r=this.items.s6x&&this.items.s6x.userData.cur>.5?.42:1;this.endModel.scale.setScalar(bt(this.endModel.scale.x,r,3,e)),this.endModel.position.y=.9+1.7*this.endModel.scale.x+.1}this.bench&&this.bench.forEach((r,a)=>{r.position.y=1.9+Math.sin(s*2+a)*.05})}}});function Qf(i,e,t,n=512){let s=document.createElement("canvas");s.width=n,s.height=Math.round(n*(e/i));let r=s.getContext("2d");t(r,s.width,s.height);let a=new tn(s);return a.colorSpace=Qe,a.anisotropy=4,new ye(new Tt(i,e),new Pt({map:a,transparent:!0,side:nt}))}var ql,ep=ot(()=>{Ft();Zi();rr();nn();ql=class extends dn{build(){let e=this.group;this.rig=Ki(e,120),this.t=0,this.studio=[];let t=new Ie,n=9,s=5;for(let S=0;S<s;S++)for(let w=0;w<n;w++){let A=sn("studio",(S*n+w)%9,O.real,null,1);A.position.set(w*1.85,S*2.25,0),t.add(A),this.studio.push(A)}t.position.set(-36,1.4,0),e.add(t),this.wall=t;let r=new ye(new pt(n*1.85+1.2,s*2.25+1,.5,2,.2),St("#ffffff",.7));r.position.set(-36+(n-1)*.925,1.4+(s-1)*1.125,-.5),r.castShadow=!0,r.receiveShadow=!0,e.add(r);let a=new Ie,o=St(O.ink,.4);for(let S of[-4.2,4.2]){let w=new ye(new pt(1.1,11,1.4,2,.25),o);w.position.set(S,5.5,0),w.castShadow=!0,a.add(w)}let l=new ye(new pt(10.5,1.3,1.6,2,.25),o);l.position.set(0,11.2,0),l.castShadow=!0,a.add(l);let c=new ye(new Tt(7.2,10.2),new Pt({color:O.healthy,transparent:!0,opacity:.16,side:nt}));c.position.set(0,5.6,0),a.add(c),this.gateGlow=c;let h=Qf(7,1.6,(S,w,A)=>{S.fillStyle="#fff",S.font='600 70px "DMMono", monospace',S.textAlign="center",S.fillText("THE MODEL",w/2,A/2+24)},600);h.position.set(0,11.2,.85),a.add(h),a.position.set(-8,0,0),e.add(a),this.gate=a,this.field=[];for(let S=0;S<5;S++){let w=sn("field",10+S,O.real,null,1.15);w.userData.phase=S*1.3,w.userData.row=S,e.add(w),this.field.push(w)}this.pass=[];for(let S=0;S<6;S++){let w=sn("studio",S,O.real,null,.9);e.add(w),this.pass.push(w)}let d=new ye(new pt(94,.8,22,2,.3),St("#ffffff",.7));d.position.set(-8,-.45,0),d.receiveShadow=!0,e.add(d);let u=120;this.g2=new Ie,this.g2.position.set(u,0,0),e.add(this.g2);let p=(S,w,A,v,T)=>{let I=rn(S,w,.9,"#ffffff",A);return I.position.set(v,0,T),this.g2.add(I),I};p(24,14,O.real,-22,0);for(let S=0;S<4;S++)for(let w=0;w<9;w++){let A=sn("studio",(S*9+w)%9,O.real,null,.82);A.position.set(-30+w*1.9,2.4+S*1.9,-3+S*.9),A.rotation.x=-.5,this.g2.add(A)}p(30,16,O.real,14,0);let g=new Ie,_=14,f=7;for(let S=0;S<f;S++)for(let w=0;w<_;w++){let A=sn("field",(S*_+w)%13,O.real,null,.7);A.position.set(w*1.78,S*1.62,-S*.4),A.rotation.x=-.34,g.add(A)}g.position.set(14-11.6,2,3.6),this.g2.add(g);let m=new Ie,b=new ye(new Tt(12,15),new Pt({color:"#ffffff",transparent:!0,opacity:.55,side:nt}));m.add(b);let E=new Bn(new On(new Tt(12,15)),new Mn({color:O.alarm,dashSize:.7,gapSize:.5}));E.computeLineDistances(),m.add(E);let y=Qf(7,7,(S,w,A)=>{S.fillStyle=O.alarm,S.font='800 360px "Bricolage", sans-serif',S.textAlign="center",S.textBaseline="middle",S.fillText("?",w/2,A/2+20)},400);y.position.z=.05,m.add(y),m.position.set(52,8.6,0),this.g2.add(m),this.need=m,this._poses(),this._tags(),this.built=!0}_poses(){this.poses={"gap-1":{pos:[-6,16,60],target:[-6,-2,0],fov:38,parallax:.6},"gap-2":{pos:[134,26,90],target:[134,-2,0],fov:48,parallax:.6}}}_tags(){let e=this.app.tags,t=(n,s,r)=>new P(n,s,r);e.add({id:"g-studio",text:"PlantVillage",sub:"54,306 leaf photos \xB7 plain backgrounds",anchor:t(-36,15.6,0),side:"r",len:30,color:O.real,big:!0}),e.add({id:"g-pass",text:"Same lab conditions",sub:"99.35% correct",anchor:t(-3.2,11.8,1),side:"l",len:30,color:O.healthy,big:!0}),e.add({id:"g-field",text:"Photos from other conditions",sub:"31.4% correct",anchor:t(10,8.4,0),side:"r",len:30,color:O.alarm,big:!0}),e.add({id:"g-bracol",text:"BRACOL",sub:"1,747 leaves \xB7 plain background \xB7 5 phones",anchor:t(98,8.2,0),side:"l",len:40,color:O.real,big:!0}),e.add({id:"g-kenya",text:"Kenya set",sub:"58,555 leaves \xB7 one plantation \xB7 Fujifilm X-T4",anchor:t(134,13.6,4),side:"r",len:40,color:O.real,big:!0}),e.add({id:"g-need",text:"What Noor needs",sub:"mild rust \xB7 shade and rain \xB7 ordinary phones \xB7 real farms",anchor:t(172,17.4,0),side:"l",len:40,color:O.alarm,big:!0})}enter(e){let t=this.app.tags;this.beat=e,e==="gap-1"?t.only(["g-studio","g-pass","g-field"]):t.only(["g-bracol","g-kenya","g-need"])}update(e,t,n=!0){n&&(this.t+=e);let s=this.t;this.pass.forEach((r,a)=>{let o=(s*.09+a/this.pass.length)%1;r.position.set(-28+o*40,5.5+Math.sin(o*9+a)*.25,.4);let l=Math.min(1,o/.1,(1-o)/.12);r.scale.setScalar(.9*(.3+.7*l));let c=Math.abs(r.position.x- -8)<4.5;r.material.color.set(c?"#c9f3f8":"#ffffff")}),this.field.forEach((r,a)=>{let o=r.userData.phase,l=(s*.42+o)%6,c=Math.min(1,l/3),h=l>3.2?Math.min(1,(l-3.2)/2):0,d=34-c*28+h*14;r.position.set(d,3+a*1.6+Math.sin(s*2+a)*.1,.4+a%2*.01),r.rotation.z=h>0?Math.sin(l*18)*.12*(1-h):0;let u=l>3;r.material.color.set(u?"#ffc7b8":"#ffffff")}),this.gateGlow.material.opacity=.12+.06*Math.sin(s*2.4),this.need&&(this.need.position.y=8.6+Math.sin(s*1.4)*.25)}}});function aa(i,e,t,n,s,r,a,o,l=!0){let c=[],h=[r*a,r*a,s*r,s*r,s*a],d=h.reduce((u,p)=>u+p,0);for(let u=0;u<o;u++){let p=i()*d,g=0;for(;g<4&&p>h[g];)p-=h[g],g++;let _=i()-.5,f=i()-.5;g===0?c.push([e+s/2,t+(f+.5)*r,n+_*a]):g===1?c.push([e-s/2,t+(f+.5)*r,n+_*a]):g===2?c.push([e+_*s,t+(f+.5)*r,n+a/2]):g===3?c.push([e+_*s,t+(f+.5)*r,n-a/2]):c.push([e+_*s,t+r,n+f*a])}return c}function oa(i,e,t,n,s,r,a,o){let l=[];for(let c=0;c<o;c++){let h=i()*2-1,d=i()*6.2832,u=Math.cbrt(i()),p=Math.sqrt(1-h*h);l.push([e+p*Math.cos(d)*s*u,t+h*r*u,n+p*Math.sin(d)*a*u])}return l}var kt,Dx,Nx,Gt,Yl,tp=ot(()=>{Ft();Zi();rr();nn();kt={ground:15e3,big:8e3,mid:7e3,small:3e3,lines:3e3},Dx=`
attribute vec3 aA; attribute vec3 aB; attribute vec3 aColA; attribute vec3 aColB; attribute float aRand;
uniform float uMix; uniform float uPix; uniform float uTime;
varying vec3 vCol;
void main() {
  float d = aRand * 0.38;
  float e = smoothstep(d, d + 0.62, uMix);
  vec3 p = mix(aA, aB, e);
  p.y += sin(e * 3.14159) * (6.0 + aRand * 14.0);
  p.x += sin(e * 3.14159) * (aRand - 0.5) * 10.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp((0.34 + 0.22 * aRand) * uPix / max(-mv.z, 1.0), 1.5, 14.0);
  vCol = mix(aColA, aColB, e);
}`,Nx=`
varying vec3 vCol;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vCol, smoothstep(0.5, 0.35, d));
  #include <colorspace_fragment>
}`,Gt=i=>{let e=new he(i);return[e.r,e.g,e.b]};Yl=class extends dn{build(){let e=ct(21),t=ct(22),n=kt.ground+kt.big+kt.mid+kt.small+kt.lines,s=[],r=[],a=[],o=[],l=(R,D,k,V)=>{s.push(...R),r.push(...D),a.push(...k),o.push(...V)},c={ground:[],big:[],mid:[],small:[],lines:[]},h={ground:[],big:[],mid:[],small:[],lines:[]};for(let R=0;R<kt.ground;R++){let D=(e()*2-1)*64,k=(e()*2-1)*38;c.ground.push([D,0,k]);let V=Math.abs(k);h.ground.push(V<9?Gt("#8d93b4"):V<13?Gt("#c5cbe3"):Gt("#dde2f0"))}let d=[];for(let R=0;R<9;R++)d.push([-56+R*14+Ne(e,-1,1),Ne(e,7,20),(R%2?1:-1)*Ne(e,22,30),Ne(e,9,13),Ne(e,8,12)]);let u=Math.floor(kt.big/d.length);d.forEach(([R,D,k,V,K],q)=>{let j=aa(e,R,0,k,V,D,K,q===d.length-1?kt.big-u*(d.length-1):u),te=.78+Ne(e,-.05,.08);j.forEach(we=>{c.big.push(we);let Ee=new he().setHSL(.64,.16,te-we[1]/D*.06);h.big.push([Ee.r,Ee.g,Ee.b])})});let p=[O.ink,O.sim,"#ffffff",O.healthy,"#8d93b4",O.ink,O.sim];this.cars=[];let g=Math.floor(kt.mid/7);for(let R=0;R<7;R++){let D=-50+R*15.5+Ne(e,-2,2),k=(R%2?1:-1)*4.3,V=4.8,K=2,q=aa(e,D,.5,k,V,1.1,K,Math.floor(g*.7)),j=aa(e,D-.2,1.6,k,V*.5,.9,K*.92,g-Math.floor(g*.7));[...q,...j].forEach(te=>{c.mid.push(te),h.mid.push(Gt(p[R]))}),this.cars.push({x:D,z:k,len:V,wid:K})}for(;c.mid.length<kt.mid;)c.mid.push([...c.mid[0]]),h.mid.push(Gt(O.ink));this.peds=[];let _=Math.floor(kt.small/8);for(let R=0;R<8;R++){let D=R<4?17+R*1.3:-40+R*9,k=R<4?-4+R*2.6:R%2?11:-11;[...oa(e,D,.9,k,.38,.9,.38,Math.floor(_*.8)),...oa(e,D,1.95,k,.28,.28,.28,_-Math.floor(_*.8))].forEach(K=>{c.small.push(K),h.small.push(Gt(O.early))}),this.peds.push({x:D,z:k})}for(;c.small.length<kt.small;)c.small.push([...c.small[0]]),h.small.push(Gt(O.early));for(let R=0;R<kt.lines;R++){if(R<1700){let k=-60+Math.floor(e()*18)*7+e()*2.6;c.lines.push([k,.04,(e()-.5)*.35])}else{let D=Math.floor(e()*9);c.lines.push([15.6+e()*5.2,.04,-8+D*2+e()*1])}h.lines.push(Gt("#ffffff"))}let f={ground:[],big:[],mid:[],small:[],lines:[]},m={ground:[],big:[],mid:[],small:[],lines:[]},b=R=>{let D=(R+38)/76*6,k=Math.floor(D),V=D-k;return k*1.7+Math.min(1,Math.max(0,(V-.78)/.22))*1.7};this.ty=b;for(let R=0;R<kt.ground;R++){let D=(t()*2-1)*64,k=(t()*2-1)*38;f.ground.push([D,b(k),k]);let V=(k+38)/76*6,K=V-Math.floor(V);m.ground.push(K>.78?Gt("#4f7a3a"):K>.3&&K<.55?Gt("#2e6b3a"):Gt("#a8683f"))}let E=[[-50,-24],[-30,-8],[-6,-26],[24,-16],[46,-28],[40,10],[-44,18]],y=Math.floor((kt.big-1200)/E.length);for(E.forEach(([R,D])=>{let k=b(D);oa(t,R,k+7,D,5.6,2.1,5.6,y).forEach(V=>{f.big.push(V),m.big.push(Gt(t()<.5?"#2f7a46":"#5d9a4a"))})}),aa(t,-34,b(26),28,7,3.4,5,700).forEach(R=>{f.big.push(R),m.big.push(Gt("#e8e1d2"))}),aa(t,38,b(32),30,9,3.6,5.4,500).forEach(R=>{f.big.push(R),m.big.push(Gt("#dcd5c6"))});f.big.length<kt.big;)f.big.push([...f.big[0]]),m.big.push(Gt("#2f7a46"));this.shrubsB=[];let S=58,w=Math.floor(kt.mid/S);for(let R=0;R<S;R++){let D=R%6,k=Math.floor(R/6),V=-30+D*11.6+4.4,K=-52+k*11.2+D%2*4,q=b(V)+1;oa(t,K,q,V,2.3,1.3,2,w).forEach(j=>{f.mid.push(j),m.mid.push(Gt(t()<.18?O.healthy:t()<.5?"#2f7a46":"#1e5a35"))}),this.shrubsB.push({x:K,y:q,z:V})}for(;f.mid.length<kt.mid;)f.mid.push([...f.mid[0]]),m.mid.push(Gt("#2f7a46"));this.sick=[];let A=16,v=Math.floor(kt.small/A);for(let R=0;R<A;R++){let D=2+R%3,k=-30+D*11.6+4.4,V=-8+R%5*4.6+Math.floor(R/5)*2,K=b(k)+1;oa(t,V,K,k,2.1,1.2,1.8,v).forEach(q=>{f.small.push(q),m.small.push(Gt(t()<.5?O.early:t()<.55?"#ff9a2e":O.alarm))}),this.sick.push({x:V,y:K,z:k})}for(;f.small.length<kt.small;)f.small.push([...f.small[0]]),m.small.push(Gt(O.alarm));for(let R=0;R<kt.lines;R++){let D=Math.floor(t()*6),k=-30+D*11.6+4.4+(t()-.5)*.3;f.lines.push([(t()*2-1)*60,b(k)+.05,k]),m.lines.push(Gt("#f4f1ff"))}for(let R of["ground","big","mid","small","lines"])l(c[R],f[R],h[R],m[R]);let T=R=>new Float32Array(R.flat()),I=new Je;I.setAttribute("position",new Dt(new Float32Array(n*3),3)),I.setAttribute("aA",new Dt(T(s),3)),I.setAttribute("aB",new Dt(T(r),3)),I.setAttribute("aColA",new Dt(T(a),3)),I.setAttribute("aColB",new Dt(T(o),3));let L=new Float32Array(n),N=ct(5);for(let R=0;R<n;R++)L[R]=N();I.setAttribute("aRand",new Dt(L,1)),this.mat=new At({vertexShader:Dx,fragmentShader:Nx,transparent:!0,depthWrite:!0,uniforms:{uMix:{value:0},uPix:{value:800},uTime:{value:0}}}),this.points=new Fi(I,this.mat),this.points.frustumCulled=!1,this.group.add(this.points),this.mix=0,this.mixTarget=0,this.boxesA=new Ie,this.boxesB=new Ie;let z=(R,D,k,V,K,q,j,te)=>{let we=new Bn(new On(new Sn(V,K,q)),new Yn({color:j,transparent:!0,opacity:0}));return we.position.set(R,D+K/2,k),te.add(we),we};this.cars.forEach(R=>z(R.x,0,R.z,R.len+.8,2.9,R.wid+.8,O.sim,this.boxesA)),this.peds.forEach(R=>z(R.x,0,R.z,1.3,2.5,1.3,"#d6a800",this.boxesA)),this.sick.forEach(R=>z(R.x,R.y-1.2,R.z,5.6,3.4,5,O.alarm,this.boxesB)),this.group.add(this.boxesA,this.boxesB),this._poses(),this._tags(),this.built=!0}_poses(){this.poses={"idea-1":{pos:[-6,64,100],target:[0,1,-6],fov:38,parallax:.7},"idea-2":{pos:[-6,68,98],target:[0,3,-6],fov:38,parallax:.7}}}_tags(){let e=this.app.tags,t=(n,s,r)=>new P(n,s,r);e.add({id:"i-car",text:"Car",sub:"label: free",anchor:t(this.cars[2].x,3.2,this.cars[2].z),side:"r",len:30,color:O.sim,big:!0}),e.add({id:"i-ped",text:"Pedestrian",sub:"label: free",anchor:t(this.peds[1].x,2.8,this.peds[1].z),side:"l",len:36,color:"#d6a800",big:!0}),e.add({id:"i-sick",text:"Rust, severity 1",sub:"label: free",anchor:t(this.sick[2].x,this.sick[2].y+2.4,this.sick[2].z),side:"r",len:36,color:O.alarm,big:!0}),e.add({id:"i-ok",text:"Healthy shrub",sub:"label: free",anchor:t(this.shrubsB[7].x,this.shrubsB[7].y+2.2,this.shrubsB[7].z),side:"l",len:36,color:O.healthy,big:!0})}enter(e){this.mixTarget=e==="idea-2"?1:0,this.app.tags.only(e==="idea-2"?["i-sick","i-ok"]:["i-car","i-ped"])}update(e,t){this.mix=bt(this.mix,this.mixTarget,1.1,e);let n=this.mix;this.mat.uniforms.uMix.value=ut(n*1.02);let s=this.app.camera;this.mat.uniforms.uPix.value=this.app.renderer.domElement.height/(2*Math.tan(s.fov*Math.PI/360)),this.boxesA.children.forEach(r=>{r.material.opacity=.9*ut(1-n*3.2)}),this.boxesB.children.forEach(r=>{r.material.opacity=.9*ut((n-.72)*4)})}}});function np(){let i=document.createElement("canvas");i.width=i.height=64;let e=i.getContext("2d"),t=e.createRadialGradient(32,32,4,32,32,30);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.7,"rgba(255,255,255,0.95)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.beginPath(),e.arc(32,32,30,0,6.2832),e.fill();let n=new tn(i);return n.colorSpace=Qe,n}function Ux(i,e,t,n=512){let s=document.createElement("canvas");s.width=n,s.height=Math.round(n*(e/i)),t(s.getContext("2d"),s.width,s.height);let r=new tn(s);return r.colorSpace=Qe,r.anisotropy=4,new ye(new Tt(i,e),new Pt({map:r,transparent:!0,side:nt}))}var Fx,ji,ip,Zh,$l,sp=ot(()=>{Ft();Zi();rr();nn();Fx="#9aa3c6",ji=10,ip=[{name:"0%",sub:"no real photos",bars:[["Zero-shot",Fx],["Renders only",O.sim]]},{name:"10%",sub:"128 leaves",bars:[["Real only",O.real],["Real + renders",null]]},{name:"25%",sub:"312 leaves",bars:[["Real only",O.real],["Real + renders",null]]},{name:"50%",sub:"614 leaves",bars:[["Real only",O.real],["Real + renders",null]]},{name:"100%",sub:"1,225 leaves",bars:[["Real only",O.real],["Real + renders",null]]}],Zh=i=>-20+i*10,$l=class extends dn{build(){let e=this.group;this.t=0,this.rig=Ki(e,120);let t=new Ie;this.rigGroup=t,e.add(t);let n=new Ie,s=rn(54,14,.8,"#ffffff",O.ink);n.add(s),this.bars=[],ip.forEach((I,L)=>{I.bars.forEach(([,N],z)=>{let R=Zh(L)+(z?2.5:-2.5),D=(V,K,q)=>{let j=new Bn(new On(new Sn(4,q,3)),new Mn({color:V,dashSize:.55,gapSize:.4}));j.computeLineDistances(),j.position.set(R,.8+K+q/2,0),n.add(j);let te=new ye(new Sn(4,q,3),new Pt({color:V,transparent:!0,opacity:.07,depthWrite:!1}));te.position.copy(j.position),n.add(te)};N?D(N,0,ji):(D(O.real,0,ji/2),D(O.sim,ji/2,ji/2));let k=Ux(2,2,(V,K,q)=>{V.fillStyle=N||O.ink,V.font='700 150px "Bricolage", sans-serif',V.textAlign="center",V.textBaseline="middle",V.fillText("?",K/2,q/2+6)},128);k.position.set(R,.8+ji/2,1.7),n.add(k),this.bars.push(k)})}),t.add(n);let r=new Ie;r.add(rn(15,12,.8,"#ffffff",O.real));for(let I=0;I<2;I++)for(let L=0;L<4;L++){let N=sn("studio",(I*4+L)%9,O.real,I===0&&L===0?"TEST":null,.95);N.position.set(-4.5+L*3,2.4+I*2.6,-1+I*.5),N.rotation.x=-.2,r.add(N)}let a=new Ie,o=new ye(new pt(3,2.4,1.4,3,.35),St(O.ink,.4));o.position.y=1.2,o.castShadow=!0,a.add(o);let l=new ye(new Fr(.95,.24,12,28,Math.PI),St(O.slate,.35));l.position.y=2.4,l.castShadow=!0,a.add(l),a.position.set(0,8.6,1.2),r.add(a),r.position.set(44,0,0),t.add(r),t.add(this._arrow([28,1.5,7.6],[38,1.5,5]));let c=new Ie;this.cloud=c,c.visible=!1,e.add(c);let h=32,d=22,u=22,p=new Bn(new On(new Sn(h,d,u)),new Yn({color:O.ink,transparent:!0,opacity:.45}));p.position.y=d/2,c.add(p);let g=ct(11),_=[],f=[],m=(I,L,N,z)=>{_.push(I,L,N),f.push(z.r,z.g,z.b)},b=new he(O.sim),E=new he(O.real);for(let I=0;I<5200;I++)m((g()-.5)*h,g()*d,(g()-.5)*u,b.clone().offsetHSL(0,0,(g()-.5)*.12));let y=new Je;y.setAttribute("position",new ze(_,3)),y.setAttribute("color",new ze(f,3));let S=new Fi(y,new rs({size:.5,vertexColors:!0,map:np(),transparent:!0,alphaTest:.2,depthWrite:!1,sizeAttenuation:!0}));c.add(S);let w=[],A=[];for(let I=0;I<240;I++){w.push(9+(g()-.5)*2.6,.6+g()*3,2+g()*8);let L=E.clone().offsetHSL(0,0,(g()-.5)*.1);A.push(L.r,L.g,L.b)}for(let I=0;I<90;I++){w.push((g()-.5)*h*.9,.6+g()*5,(g()-.5)*u);let L=E.clone().offsetHSL(0,0,.12);A.push(L.r,L.g,L.b)}let v=new Je;v.setAttribute("position",new ze(w,3)),v.setAttribute("color",new ze(A,3)),c.add(new Fi(v,new rs({size:.95,vertexColors:!0,map:np(),transparent:!0,alphaTest:.2,depthWrite:!0,sizeAttenuation:!0}))),this.pockets=[],[[-26,16,4],[-24,4,-12],[24,20,-14],[28,6,12],[-6,29,-4],[-6,-5,16]].forEach(([I,L,N])=>{let z=new ye(new bi(3.4,16,12),new Pt({color:O.alarm,wireframe:!0,transparent:!0,opacity:.55}));z.position.set(I,L,N),c.add(z),this.pockets.push(z)}),this._poses(),this._tags(),this.built=!0}_arrow(e,t){let n=new $n([new P(...e),new P((e[0]+t[0])/2,3.2,(e[2]+t[2])/2+1),new P(...t)]),s=new Fn(new Je().setFromPoints(n.getPoints(30)),new Mn({color:O.ink,transparent:!0,opacity:.5,dashSize:.45,gapSize:.3}));return s.computeLineDistances(),s}_poses(){this.poses={"proof-1":{pos:[14,30,94],target:[14,-9,0],fov:40,parallax:.5},"proof-2":{pos:[8,48,100],target:[8,-4,0],fov:40,parallax:.7}}}_tags(){let e=this.app.tags,t=(n,s,r)=>new P(n,s,r);ip.forEach((n,s)=>{e.add({id:`pf-g${s}`,text:n.name,sub:n.sub,anchor:t(Zh(s)-2.5,ji+2.6,0),side:"r",len:12,color:s===0?O.slate:O.real,big:s===0})}),e.add({id:"pf-test",text:"Locked test",sub:"261 BRACOL leaves",anchor:t(44,13.4,1.2),side:"r",len:22,color:O.real,big:!0}),e.add({id:"pf-metric",text:"Score: AUC",sub:"higher is better",anchor:t(Zh(0)-5.4,.8+ji*.55,1.6),side:"l",len:18,color:O.ink}),e.add({id:"pc-x",text:"Light",sub:"dawn to overcast",anchor:t(16,0,11),side:"r",len:30,color:O.slate}),e.add({id:"pc-y",text:"Backdrop",sub:"plain to cluttered",anchor:t(-16,22,11),side:"l",len:30,color:O.slate}),e.add({id:"pc-z",text:"Rust severity",sub:"0 to 4",anchor:t(16,0,-11),side:"r",len:30,color:O.slate}),e.add({id:"pc-sim",text:"Synthetic images",sub:"fill the space",anchor:t(2,16,2),side:"r",len:40,color:O.sim,big:!0}),e.add({id:"pc-real",text:"Real photos",sub:"a thin slice",anchor:t(9,2.2,7),side:"r",len:36,color:O.real,big:!0}),["Farm photos","Other diseases","Clean renders","A small test","Phones","Languages"].forEach((n,s)=>{let r=[[-26,16,4],[-24,4,-12],[24,20,-14],[28,6,12],[-6,29,-4],[-6,-5,16]][s];e.add({id:`pc-g${s}`,text:`<b class="num">${s+1}</b>${n}`,anchor:t(r[0],r[1],r[2]),side:r[0]>8?"r":"l",len:26,color:O.alarm})})}enter(e){let t=this.app.tags;this.rigGroup.visible=e==="proof-1",this.cloud.visible=e==="proof-2",e==="proof-1"?t.only(["pf-g0","pf-g1","pf-g2","pf-g3","pf-g4","pf-test","pf-metric"]):t.only(["pc-x","pc-y","pc-z","pc-sim","pc-real","pc-g0","pc-g1","pc-g2","pc-g3","pc-g4","pc-g5"])}update(e,t,n=!0){n&&(this.t+=e);let s=this.t;this.bars.forEach((r,a)=>{r.position.y=.8+ji/2+Math.sin(s*1.6+a*.7)*.18}),this.pockets.forEach((r,a)=>{r.rotation.y=s*.3+a,r.scale.setScalar(1+Math.sin(s*1.4+a)*.05)})}}});function rp(i,e,t,n,s,r){let a=e.split(" "),o="";for(let l of a){let c=o?`${o} ${l}`:l;i.measureText(c).width>s&&o?(i.fillText(o,t,n),o=l,n+=r):o=c}return i.fillText(o,t,n),n+r}function Bx(i,e,t){if(i.clearRect(0,0,Mt,Jh),i.fillStyle="#f6f7fc",i.fillRect(0,0,Mt,Jh),i.fillStyle=O.ink,i.font='500 22px "DMMono", monospace',i.textAlign="left",i.fillText("9:41",30,46),i.textAlign="right",i.fillText("OFFLINE",Mt-30,46),i.textAlign="left",i.fillStyle=O.healthy,i.beginPath(),i.arc(Mt-150,38,8,0,6.28),i.fill(),e==="camera"){i.fillStyle=O.ink,fn(i,24,70,Mt-48,640,30),i.fill(),i.save(),fn(i,24,70,Mt-48,640,30),i.clip(),i.drawImage(ra("refined",3,null,null),24,70,Mt-48,640),i.restore(),i.strokeStyle="#fff",i.lineWidth=6;let n=78,s=54,r=150,a=630;for(let[o,l,c,h]of[[n,r,1,1],[Mt-n,r,-1,1],[n,a,1,-1],[Mt-n,a,-1,-1]])i.beginPath(),i.moveTo(o,l+h*s),i.lineTo(o,l),i.lineTo(o+c*s,l),i.stroke();i.fillStyle=O.ink,i.font='700 40px "Instrument", sans-serif',i.textAlign="center",i.fillText("Piga picha ya jani",Mt/2,790),i.fillStyle=O.slate,i.font='400 28px "Instrument", sans-serif',i.fillText("Take a photo of the leaf",Mt/2,836),i.fillStyle="#fff",i.strokeStyle=O.ink,i.lineWidth=8,i.beginPath(),i.arc(Mt/2,940,52,0,6.28),i.fill(),i.stroke(),i.fillStyle=O.ink,i.beginPath(),i.arc(Mt/2,940,36+Math.sin(t*4)*1.5,0,6.28),i.fill(),i.textAlign="left"}else if(e==="result"){i.save(),fn(i,24,70,Mt-48,330,30),i.clip(),i.drawImage(ra("refined",3,null,null),24,40,Mt-48,400),i.restore();let n=.5+.5*Math.sin(t*3);i.strokeStyle=O.early,i.lineWidth=7,i.setLineDash([16,10]),fn(i,170-n*6,150-n*6,170+n*12,120+n*12,16),i.stroke(),i.setLineDash([]),i.fillStyle="#fff",fn(i,24,380,Mt-48,620,30),i.fill(),i.fillStyle=O.ink,i.textAlign="left",i.font='800 60px "Bricolage", sans-serif',i.fillText("Kutu ya majani",56,470),i.fillStyle=O.slate,i.font='500 30px "Instrument", sans-serif',i.fillText("Leaf rust: yes",56,516),i.fillStyle=O.slate,i.font='500 22px "DMMono", monospace',i.fillText("HOW SURE",56,580),i.fillStyle="#e1e6f2",fn(i,56,596,Mt-112,18,9),i.fill(),i.fillStyle=O.healthy,fn(i,56,596,(Mt-112)*.78,18,9),i.fill(),i.fillStyle=O.ink,i.font='600 32px "Instrument", sans-serif',i.fillText("Angalia majani ya karibu",56,690),i.fillStyle=O.slate,i.font='400 28px "Instrument", sans-serif',rp(i,"Check the leaves nearby. Show this photo to your extension officer before you spray.",56,732,Mt-112,38),i.fillStyle=O.ink,fn(i,56,880,190,70,20),i.fill(),i.fillStyle="#fff",i.font='600 28px "Instrument", sans-serif',i.textAlign="center",i.fillText("Sikiliza",151,925),i.fillStyle="#e1e6f2",fn(i,266,880,190,70,20),i.fill(),i.fillStyle=O.ink,i.fillText("Hifadhi",361,925),i.textAlign="left"}else i.save(),fn(i,24,70,Mt-48,330,30),i.clip(),i.drawImage(ra("field",4,null,null),24,40,Mt-48,400),i.restore(),i.fillStyle="#fff",fn(i,24,380,Mt-48,620,30),i.fill(),i.fillStyle=O.ink,i.font='800 60px "Bricolage", sans-serif',i.fillText("Sina uhakika",56,470),i.fillStyle=O.slate,i.font='500 30px "Instrument", sans-serif',i.fillText("I am not sure about this one",56,516),i.fillStyle="#e1e6f2",fn(i,56,596,Mt-112,18,9),i.fill(),i.fillStyle=O.alarm,fn(i,56,596,(Mt-112)*.28,18,9),i.fill(),i.fillStyle=O.ink,i.font='600 32px "Instrument", sans-serif',i.fillText("Muulize afisa ugani",56,690),i.fillStyle=O.slate,i.font='400 28px "Instrument", sans-serif',rp(i,"Ask the extension officer. The photo is saved on this phone and can be sent when a signal appears.",56,732,Mt-112,38),i.fillStyle=O.ink,fn(i,56,880,400,70,20),i.fill(),i.fillStyle="#fff",i.font='600 28px "Instrument", sans-serif',i.textAlign="center",i.fillText("Hifadhi picha",256,925),i.textAlign="left"}var Mt,Jh,fn,Zl,ap=ot(()=>{Ft();Zi();rr();nn();Mt=512,Jh=1040,fn=(i,e,t,n,s,r)=>{i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()};Zl=class extends dn{build(){let e=this.group;this.rig=Ki(e,90),this.t=0,this.hubOn=!1,this.states=["camera","result","camera","notsure"],this.si=0,this.ts=0;let t=rn(22,16,.8,"#ffffff",O.healthy);t.position.set(4,0,0),e.add(t);let n=new Ie,s=new ye(new pt(8.6,17.6,.9,4,.8),St(O.ink,.35));s.castShadow=!0,n.add(s),this.screenCanvas=document.createElement("canvas"),this.screenCanvas.width=Mt,this.screenCanvas.height=Jh,this.sctx=this.screenCanvas.getContext("2d"),this.screenTex=new tn(this.screenCanvas),this.screenTex.colorSpace=Qe,this.screenTex.anisotropy=4;let r=new ye(new Tt(8,16.2),new Pt({map:this.screenTex}));r.position.z=.47,n.add(r),n.position.set(4,10.4,0),n.rotation.y=-.18,e.add(n),this.phone=n,this._draw(),this.chips=new Ie;let a=["Rust","No rust","Not sure"];a.forEach((m,b)=>{let E=document.createElement("canvas");E.width=400,E.height=112;let y=E.getContext("2d"),S=b===a.length-1;y.fillStyle=S?O.ink:"#fff",fn(y,4,4,392,104,52),y.fill(),y.lineWidth=6,y.strokeStyle=S?O.ink:O.fog,y.stroke(),y.fillStyle=S?"#fff":O.ink,y.font='600 44px "Instrument", sans-serif',y.textAlign="center",y.textBaseline="middle",y.fillText(m,200,58);let w=new tn(E);w.colorSpace=Qe,w.anisotropy=4;let A=new ye(new Tt(4.4,1.23),new Pt({map:w,transparent:!0,side:nt}));A.userData.i=b,A.position.set(0,0,0),this.chips.add(A)}),this.chips.position.set(14.5,10.4,1),e.add(this.chips);let o=new Ie;o.add(rn(16,12,.8,"#ffffff",O.ink));let l=new ye(new pt(9.4,.5,6.4,2,.2),St("#cfd5e8",.4));l.position.set(0,1.3,1.2),l.castShadow=!0,o.add(l);let c=new Ie,h=new ye(new pt(9.4,6.2,.4,2,.2),St(O.ink,.4));h.castShadow=!0,c.add(h);let d=document.createElement("canvas");d.width=768,d.height=504;let u=d.getContext("2d");u.fillStyle="#f6f7fc",u.fillRect(0,0,768,504),u.fillStyle=O.ink,u.font='800 54px "Bricolage", sans-serif',u.fillText("Cooperative hub",40,84),u.fillStyle=O.slate,u.font='400 28px "Instrument", sans-serif',u.fillText("Local Wi-Fi only. No internet.",40,126),[["Second opinion","larger copy of the model"],["Field photos","waiting for review"],["Next test round","new cases to learn from"]].forEach(([m,b],E)=>{u.fillStyle="#fff",fn(u,40,160+E*106,688,90,22),u.fill(),u.strokeStyle=O.fog,u.lineWidth=3,u.stroke(),u.fillStyle=O.ink,u.font='600 32px "Instrument", sans-serif',u.fillText(m,68,200+E*106),u.fillStyle=O.slate,u.font='400 26px "Instrument", sans-serif',u.fillText(b,68,234+E*106)});let p=new tn(d);p.colorSpace=Qe,p.anisotropy=4;let g=new ye(new Tt(8.6,5.6),new Pt({map:p}));g.position.z=.21,c.add(g),c.position.set(0,4.6,-1.8),c.rotation.x=-.18,o.add(c),o.position.set(30,0,2),o.visible=!1,this.hub=o,this.hubK=0,e.add(o),this.pulses=[];for(let m=0;m<6;m++){let b=new ye(new bi(.28,12,8),new Pt({color:O.healthy}));b.userData.i=m,this.pulses.push(b),o.add(b)}this.link=new $n([new P(-20,8,-2),new P(-12,12,0),new P(-4,10,1),new P(0,5,0)]);let _=new Je().setFromPoints(this.link.getPoints(40)),f=new Fn(_,new Mn({color:O.healthy,dashSize:.5,gapSize:.35}));f.computeLineDistances(),o.add(f),this._poses(),this._tags(),this.built=!0}_draw(){Bx(this.sctx,this.states[this.si],this.t),this.screenTex.needsUpdate=!0}_poses(){this.poses={"hands-1":{pos:[4,15,46],target:[4,7,0],fov:36,parallax:.6},"hands-2":{pos:[14,17,62],target:[14,6,0],fov:40,parallax:.6}}}_tags(){let e=this.app.tags,t=(n,s,r)=>new P(n,s,r);e.add({id:"h-offline",text:"Offline",sub:"no signal, no data bundle",anchor:t(8.4,17.8,.6),side:"r",len:40,color:O.healthy,big:!0}),e.add({id:"h-list",text:"Three answers",sub:"rust, no rust, or not sure",anchor:t(14.5,14.2,1),side:"r",len:26,color:O.ink,big:!0}),e.add({id:"h-human",text:"A person decides",sub:'it says "not sure" and points to the officer',anchor:t(-.2,3.2,.6),side:"l",len:44,color:O.alarm,big:!0}),e.add({id:"h-hub",text:"Cooperative laptop",sub:"second opinion over local Wi-Fi",anchor:t(30,9.4,0),side:"r",len:30,color:O.ink,big:!0}),e.add({id:"h-link",text:"Local Wi-Fi",sub:"no internet needed",anchor:t(15,11,0),side:"r",len:24,color:O.healthy})}enter(e){let t=this.app.tags;this.hubOn=e==="hands-2",e==="hands-1"?t.only(["h-offline","h-list","h-human"]):t.only(["h-hub","h-link","h-offline"]),this._modeButtons()}control(e,t,n){e==="mode"&&(this.hubOn=n.mode==="hub",this._modeButtons(),this.app.tags.only(this.hubOn?["h-hub","h-link","h-offline"]:["h-offline","h-list","h-human"]),this.app.rig.flyTo(this.hubOn?this.poses["hands-2"]:this.poses["hands-1"],1.4))}_modeButtons(){document.querySelectorAll('[data-ctl="mode"]').forEach(e=>e.setAttribute("aria-pressed",String(e.dataset.mode==="hub"===this.hubOn)))}update(e,t,n=!0){n&&(this.t+=e,this.ts+=e);let s=this.t;this.ts>3.6?(this.ts=0,this.si=(this.si+1)%this.states.length,this._draw()):Math.floor(s*8)!==this._lastDraw&&(this._lastDraw=Math.floor(s*8),this._draw()),this.phone.position.y=10.4+Math.sin(s*1.2)*.25,this.phone.rotation.y=-.18+Math.sin(s*.7)*.07,this.chips.children.forEach(r=>{let a=r.userData.i;r.position.set(Math.sin(s*.8+a)*.25,2.6-a*2.6+Math.sin(s*1.1+a*1.7)*.12,0),r.quaternion.copy(this.app.camera.quaternion)}),this.hubK=bt(this.hubK,this.hubOn?1:0,4,e),this.hub.visible=this.hubK>.02,this.hub.scale.setScalar(.5+.5*El(this.hubK)),this.pulses.forEach((r,a)=>{let o=(s*.35+a/this.pulses.length)%1,l=this.link.getPoint(o);r.position.copy(l),r.scale.setScalar(Math.sin(o*Math.PI))})}}});var kx=pp(()=>{Yf();Gh();jf();ep();tp();sp();ap();var Ox=new kl({farm:Ol,pipeline:Xl,gap:ql,idea:Yl,proof:$l,phone:Zl});Ox.boot().catch(i=>{console.error(i),document.body.classList.add("is-ready")})});kx();})();
