/* ================================================================
   K.I.M.I. — ERROR LOOP · ENGINE
   WebGL2 Flowmap (Ping-Pong) + Curl-Noise-Ölfluss + geplanter
   Stutter + Audio-Reaktivität + Dual-Textur-Crossfade.
   Exportiert: window.Engine = { state, setImage, tear, capture,
   time, onGlitch }
   ================================================================ */
'use strict';

const Engine = (function(){

const S = {
  phase: 'idle',
  warm: .6, aber: .35, flow: .9, scale: 1, drift: .5,
  glitch: 0, nextGlitch: 4.5,
  audio: 0, audioSm: 0
};
const TARGETS = {
  idle: {warm:.6, aber:.35, flow:.9,  scale:1,    drift:.5,  glint:[9,15]},
  a:    {warm:1,  aber:.15, flow:.55, scale:1.05, drift:.3,  glint:[14,22]},
  b:    {warm:0,  aber:1,   flow:1.6, scale:1.1,  drift:1.1, glint:[4.5,9]},
  loop: {warm:.5, aber:.6,  flow:1.1, scale:1.07, drift:.8,  glint:[6,11]}
};
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = document.getElementById('gl');
const gl = canvas.getContext('webgl2', {antialias:false, alpha:false, preserveDrawingBuffer:false});
if (!gl) document.body.classList.add('no-webgl');

const VS = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos*.5+.5; gl_Position = vec4(aPos,0.,1.); }`;

/* Flowmap-Simulation: altes Feld abklingen + Zeiger-Splat */
const FS_SIM = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uP0, uP1;
uniform float uForce, uAspect;
float segDist(vec2 p, vec2 a, vec2 b){
  vec2 pa=p-a, ba=b-a;
  float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);
  return length(pa-ba*h);
}
void main(){
  vec2 f = (texture(uPrev,vUv).rg*2.-1.) * .965;
  vec2 p = vec2(vUv.x*uAspect, vUv.y);
  vec2 a = vec2(uP0.x*uAspect,uP0.y), b = vec2(uP1.x*uAspect,uP1.y);
  float s = exp(-pow(segDist(p,a,b),2.)/.0018);
  f += (b-a) * s * uForce;
  f = clamp(f,-1.,1.);
  o = vec4(f*.5+.5,0.,1.);   /* RGBA8 kann kein Vorzeichen — bias auf 0..1 */
}`;

/* Display: Ölfluss + Flowmap + chromatische Aberration + Stutter
   + Dual-Textur-Crossfade (Track-Bild-Bindung) */
const FS_DRAW = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTex, uTexB, uFlow;
uniform vec2 uRes, uImg, uImgB, uDrift;
uniform float uTime, uAber, uWarm, uGlitch, uSeed, uAudio, uFlowStr, uScale, uTexMix;

vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
float hash(float n){ return fract(sin(n)*43758.5453123); }

vec2 coverUv(vec2 uv, vec2 img, vec2 disp, float scale){
  float rs=uRes.x/uRes.y, ri=img.x/img.y;
  vec2 cs = rs<ri ? vec2(rs/ri,1.) : vec2(1.,ri/rs);
  return (uv+disp-.5)*cs/scale+.5;
}
vec3 sampleAber(sampler2D t, vec2 uv, float ab){
  vec3 c;
  c.r = texture(t, uv+vec2(ab,0.)).r;
  c.g = texture(t, uv).g;
  c.b = texture(t, uv-vec2(ab,0.)).b;
  return c;
}

void main(){
  /* Zeiger-Flowmap (bias zurück nach -1..1) */
  vec2 fl = texture(uFlow,vUv).rg*2.-1.;

  /* autonomer Ölfluss (Curl-Noise) */
  vec2 q = vUv*3.2 + uDrift*uTime*.06;
  float e=.05;
  float cURLy = snoise(q+vec2(0.,e)) - snoise(q-vec2(0.,e));
  float cURLx = snoise(q-vec2(e,0)) - snoise(q+vec2(e,0));
  vec2 curl = vec2(cURLy, cURLx)/(2.*e);

  vec2 disp = curl*(.0032+uAudio*.011) + fl*uFlowStr;

  /* Stutter: Zeilenversatz */
  float row = floor(vUv.y*90.);
  float h = hash(row+uSeed);
  float g = uGlitch*step(.7,h);
  disp.x += (h-.5)*.11*g;

  /* chromatische Aberration — nur im Bild, kalt */
  float ab = (.0012+uAber*.0032+uGlitch*.011)*(1.+uAudio*1.8);
  vec3 colA = sampleAber(uTex,  coverUv(vUv,uImg, disp,uScale), ab);
  vec3 colB = sampleAber(uTexB, coverUv(vUv,uImgB,disp,uScale), ab);
  float m = smoothstep(0.,1.,uTexMix);
  vec3 col = mix(colA, colB, m);

  /* Gradierung: warmes Öl <-> kaltes Glas */
  float lum = dot(col, vec3(.299,.587,.114));
  vec3 warmC = col*vec3(1.06,.97,.85);
  vec3 coldC = mix(vec3(lum),col,.5)*vec3(.9,.99,1.08);
  col = mix(coldC, warmC, uWarm);
  col *= 1.08;   /* leichte Anhebung — Öl glänzt, bleibt aber dunkel */

  /* kalte Glas-Flanke während des Stutters */
  col += uGlitch*vec3(.35,.5,.55)*step(.96,hash(row*3.7+uSeed))*.3;

  /* Vignette */
  float vig = smoothstep(1.3,.35,length(vUv-.5)*1.35);
  col *= mix(.76,1.,vig);

  o = vec4(col,1.);
}`;

let prog={}, tex=null, texB=null, imgW=2560, imgH=1440, imgBW=2560, imgBH=1440;
let fboA, fboB, simW=320, simH=180;
let texMix=0, swapInFlight=false, pendingSrc=null;

function mkShader(type, src){
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error(gl.getShaderInfoLog(s));
  return s;
}
function mkProg(fs){
  const p = gl.createProgram();
  gl.attachShader(p, mkShader(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    console.error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i=0;i<n;i++){ const info = gl.getActiveUniform(p,i); u[info.name] = gl.getUniformLocation(p, info.name); }
  return {p, u};
}
function mkTarget(w,h){
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const f = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  return {t, f};
}
function uploadTex(img){
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  return t;
}

function initGL(){
  if (!gl) return;
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  prog.sim  = mkProg(FS_SIM);
  prog.draw = mkProg(FS_DRAW);
  [prog.sim, prog.draw].forEach(({p}) => {
    const loc = gl.getAttribLocation(p, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  });
  fboA = mkTarget(simW, simH);
  fboB = mkTarget(simW, simH);
  const img = new Image();
  img.onload = () => {
    imgW = img.naturalWidth; imgH = img.naturalHeight;
    tex = uploadTex(img);
    texB = tex;  /* bis zur ersten Bindung identisch */
    requestAnimationFrame(frame);
  };
  img.onerror = () => document.body.classList.add('no-webgl');
  img.src = KEY_VISUAL;   /* eingebettet — kein file://-Taint im WebGL */
}

/* Zeiger */
const ptr = {x:.5, y:.5, px:.5, py:.5, force:0};
addEventListener('pointermove', e => {
  ptr.x = e.clientX/innerWidth;
  ptr.y = 1 - e.clientY/innerHeight;
}, {passive:true});

function resize(){
  const dpr = Math.min(devicePixelRatio||1, 1.75);
  canvas.width  = innerWidth*dpr|0;
  canvas.height = innerHeight*dpr|0;
}
addEventListener('resize', resize); resize();

const lerp = (a,b,t) => a+(b-a)*t;
let t0 = performance.now(), seedN = 0;
let tearUntil = -1;   /* Peel: anhaltender Riss */

function frame(now){
  if (!gl || !tex) return;
  const t = (now-t0)/1000;
  const dt = Math.min(.05, t - (frame.lt||t)); frame.lt = t;
  const T = TARGETS[S.phase] || TARGETS.idle;

  /* Stutter-Scheduler (Tear hält den Riss offen) */
  const tearing = t < tearUntil;
  if (!REDUCED && (t > S.nextGlitch || tearing)){
    S.glitch = tearing ? 1.4 : 1;
    seedN = Math.random()*100;
    Engine.onGlitch && Engine.onGlitch();
    if (tearing){ S.nextGlitch = t + .09; }
    else {
      const [lo,hi] = T.glint;
      S.nextGlitch = t + lo + Math.random()*(hi-lo);
    }
  }
  S.glitch = Math.max(0, S.glitch - dt*(tearing?2:7));

  /* LOOP: Wärme und Drift oszillieren — der Umschlag als Struktur */
  let warmT = T.warm, driftT = T.drift;
  if (S.phase==='loop'){
    warmT = .5+.5*Math.sin(t*.13);
    driftT = T.drift*Math.sin(t*.07);
  }

  /* Uniforms sanft nachziehen */
  const k = 1-Math.pow(.0018, dt);
  S.warm=lerp(S.warm,warmT,k); S.aber=lerp(S.aber,T.aber,k);
  S.flow=lerp(S.flow,T.flow,k); S.scale=lerp(S.scale,T.scale,k);
  S.drift=lerp(S.drift,driftT,k);
  S.audioSm = lerp(S.audioSm, S.audio, 1-Math.pow(.01, dt));

  /* Textur-Crossfade */
  if (swapInFlight){
    texMix = Math.min(1, texMix + dt/.9);
    if (texMix >= 1){
      tex = texB; imgW = imgBW; imgH = imgBH;
      texMix = 0; swapInFlight = false;
      if (pendingSrc){ const p = pendingSrc; pendingSrc = null; setImage(p); }
    }
  }

  /* 1) Flowmap-Simulation */
  ptr.force = Math.min(1.6, Math.hypot(ptr.x-ptr.px, ptr.y-ptr.py)*22 + ptr.force*.82);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.f);
  gl.viewport(0,0,simW,simH);
  gl.useProgram(prog.sim.p);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, fboA.t);
  gl.uniform1i(prog.sim.u.uPrev, 0);
  gl.uniform2f(prog.sim.u.uP0, ptr.px, ptr.py);
  gl.uniform2f(prog.sim.u.uP1, ptr.x, ptr.y);
  gl.uniform1f(prog.sim.u.uForce, REDUCED?0:ptr.force);
  gl.uniform1f(prog.sim.u.uAspect, innerWidth/innerHeight);
  gl.drawArrays(gl.TRIANGLES,0,3);
  [fboA,fboB] = [fboB,fboA];
  ptr.px=ptr.x; ptr.py=ptr.y;

  /* 2) Display */
  drawScene(t);

  if (!document.hidden) requestAnimationFrame(frame);
  else setTimeout(()=>requestAnimationFrame(frame), 400);
}

function drawScene(t){
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.useProgram(prog.draw.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, fboA.t);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texB);
  gl.uniform1i(prog.draw.u.uTex,0); gl.uniform1i(prog.draw.u.uFlow,1);
  gl.uniform1i(prog.draw.u.uTexB,2);
  gl.uniform2f(prog.draw.u.uRes, canvas.width, canvas.height);
  gl.uniform2f(prog.draw.u.uImg, imgW, imgH);
  gl.uniform2f(prog.draw.u.uImgB, imgBW, imgBH);
  gl.uniform1f(prog.draw.u.uTime, t);
  gl.uniform1f(prog.draw.u.uAber, S.aber);
  gl.uniform1f(prog.draw.u.uWarm, S.warm);
  gl.uniform1f(prog.draw.u.uGlitch, REDUCED?0:S.glitch);
  gl.uniform1f(prog.draw.u.uSeed, seedN);
  gl.uniform1f(prog.draw.u.uAudio, REDUCED?0:S.audioSm);
  gl.uniform1f(prog.draw.u.uFlowStr, .014*S.flow);
  gl.uniform1f(prog.draw.u.uScale, S.scale);
  gl.uniform1f(prog.draw.u.uTexMix, texMix);
  gl.uniform2f(prog.draw.u.uDrift, S.drift, S.drift*.6);
  gl.drawArrays(gl.TRIANGLES,0,3);
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && gl && tex) requestAnimationFrame(frame);
});

/* ---------- öffentliche API ---------- */
function setImage(src){
  const fb = document.getElementById('fallback');
  if (fb) fb.style.backgroundImage = `url('${src}')`;
  if (!gl || !tex) return;
  if (swapInFlight){ pendingSrc = src; return; }
  const img = new Image();
  img.onload = () => {
    imgBW = img.naturalWidth; imgBH = img.naturalHeight;
    texB = uploadTex(img);
    texMix = 0; swapInFlight = true;
  };
  img.src = src;
}
function tear(ms){
  tearUntil = (performance.now()-t0)/1000 + ms/1000;
}
function capture(){
  if (!gl || !tex) return;
  drawScene((performance.now()-t0)/1000);   /* Frame sicher neu zeichnen */
  canvas.toBlob(blob => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ERROR_LOOP_${S.phase.toUpperCase()}_${Date.now()}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}

const Engine = {
  state: S, REDUCED,
  onGlitch: null,
  setImage, tear, capture,
  time: () => (performance.now()-t0)/1000
};
initGL();
return Engine;
})();
