/* Lin animé de l'ouverture (ordinateur, souris) : la toile ondule doucement sous la souris.
   WebGL léger : densité de pixels limitée, 60 images par seconde au plus, qualité qui baisse si une image tarde,
   arrêt hors écran et en mode calme (boucle du socle). Sans WebGL : l'image de lin reste affichée. */
import { boucle } from '../socle/index.js?v=2';
import { calmeActif, souris } from './outils.js?v=2';

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FS = `precision mediump float;varying vec2 v;uniform vec2 r;uniform vec2 m;uniform float t;uniform float a;uniform sampler2D img;uniform float avecImg;uniform vec4 cad;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 uv=v; vec2 px=uv*r;
  vec2 d=px-m*r; float dist=length(d);
  float onde=a*sin(dist*.045-t*3.2)*exp(-dist*.006)*14.;
  vec2 dec=normalize(d+1e-4)*onde;
  vec2 q=(px+dec)/r;
  float plis=n(q*vec2(2.2,1.4)+t*.03)*.10+n(q*vec2(5.,3.)-t*.02)*.04;
  vec3 c;
  if(avecImg>.5){ c=texture2D(img,vec2(cad.z+q.x*cad.x,cad.w+(1.-q.y)*cad.y)).rgb; }
  else {
    vec2 w=(px+dec)*vec2(.55,.55);
    float trame=.5+.5*sin(w.x*3.1+n(w*.08)*4.)*.5+.5*sin(w.y*2.9+n(w.yx*.07)*4.)*.5;
    float fibre=n(vec2(w.x*.12,w.y*2.))*.5+n(vec2(w.x*2.,w.y*.12))*.5;
    c=vec3(.949,.925,.882)-vec3(.05,.055,.06)*trame*.55-vec3(.03)*fibre;
  }
  c*=1.-plis*.6+onde*.004;
  gl_FragColor=vec4(c,1.);
}`;

export function initLin() {
  const canvas = document.querySelector('[data-lin]');
  if (!canvas || calmeActif() || !souris() || innerWidth < 1000) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
  const U = (k) => gl.getUniformLocation(pr, k);
  const ur = U('r'), um = U('m'), ut = U('t'), ua = U('a'), uImg = U('avecImg'), uCad = U('cad');
  /* Si l'image de lin (Grok) est là, elle sert de texture ; sinon, la toile est dessinée en code. */
  const photo = canvas.parentElement.querySelector('.hero-fond img');
  let avecImg = 0;
  const pos = (photo ? getComputedStyle(photo).objectPosition : '50% 50%').split(' ').map((v) => (parseFloat(v) || 50) / 100);
  const cadX = pos[0], cadY = pos[1] ?? .5;
  if (photo) {
    const charger = () => {
      try {
        const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, photo);
        avecImg = 1;
      } catch { avecImg = 0; }
    };
    if (photo.complete && photo.naturalWidth) charger(); else photo.addEventListener('load', charger, { once: true });
  }
  let dpr = Math.min(1, devicePixelRatio || 1), w = 0, h = 0;
  const taille = () => { const r = canvas.getBoundingClientRect(); w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr)); canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); };
  taille();
  new ResizeObserver(taille).observe(canvas);
  let mx = .5, my = .5, cx = .5, cy = .5, amp = 0, ampCible = 0, rect = canvas.getBoundingClientRect();
  const scene = canvas.parentElement;
  scene.addEventListener('pointerenter', () => { rect = canvas.getBoundingClientRect(); });
  scene.addEventListener('pointermove', (e) => { mx = (e.clientX - rect.left) / rect.width; my = (e.clientY - rect.top) / rect.height; ampCible = 1; });
  scene.addEventListener('pointerleave', () => { ampCible = 0; });
  /* Pendant le défilement, la toile se fige : la page reste fluide, l'onde repart au prochain geste de la souris. */
  let defile = false, finDefile = 0;
  addEventListener('scroll', () => { defile = true; ampCible = 0; amp = 0; clearTimeout(finDefile); finDefile = setTimeout(() => { defile = false; aDessiner = true; }, 220); }, { passive: true });
  let lents = 0, premier = true, aDessiner = true;
  if (photo) photo.addEventListener('load', () => { aDessiner = true; });
  boucle(canvas, (dt, t) => {
    const t0 = performance.now();
    const k = 1 - Math.exp(-dt * 6);
    cx += (mx - cx) * k; cy += (my - cy) * k; amp += (ampCible - amp) * (1 - Math.exp(-dt * 2.5));
    /* Toile au repos (souris absente) : l'image reste figée, aucun calcul pendant le défilement. */
    if (!premier && (defile || (!aDessiner && amp < 0.002 && ampCible === 0))) return;
    aDessiner = false;
    gl.uniform2f(ur, w, h); gl.uniform2f(um, cx, cy); gl.uniform1f(ut, t); gl.uniform1f(ua, amp); gl.uniform1f(uImg, avecImg);
    /* Photo posée comme en object-fit: cover, au cadrage de l'image affichée sous la toile. */
    if (avecImg && photo.naturalWidth) {
      const ia = photo.naturalWidth / photo.naturalHeight, ca = w / h;
      const sx = ca > ia ? 1 : ca / ia, sy = ca > ia ? ia / ca : 1;
      gl.uniform4f(uCad, sx, sy, (1 - sx) * cadX, (1 - sy) * cadY);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (premier) { premier = false; canvas.classList.add('actif'); }
    /* Qualité qui baisse d'elle-même si les images tardent. */
    if (performance.now() - t0 > 6 || dt > 1 / 40) { if (++lents > 30 && dpr > .75) { dpr = Math.max(.75, dpr - .25); taille(); lents = 0; } } else lents = Math.max(0, lents - 1);
  }, { lourde: true });
}
