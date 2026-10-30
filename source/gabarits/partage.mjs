/* Image de partage 1200×630 de chaque page : photo de l'atelier, logo, accroche, polices et couleurs du site.
   outils/images-partage.mjs photographie ces pages et écrit assets/partage/<page>-<langue>.jpg. */
import { html, brut } from '../../outils/gabarit.mjs';

export function page(c) {
  const cle = c.page.cle;
  const image = c.page.imagePartage || c.site.imagePartage;
  const accroche = c.page.accroche || c.s(`pages.${cle}.accroche`);
  return html`<!doctype html>
<html lang="${c.l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/css/socle.css"><link rel="stylesheet" href="/assets/css/site.css">
<style>${brut(`:root{--fond:${c.site.couleurs.fond};--texte:${c.site.couleurs.texte}}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--fond);color:var(--texte)}
.carte-p{display:grid;grid-template-columns:560px 640px;width:1200px;height:630px}
.carte-p-texte{display:flex;flex-direction:column;justify-content:space-between;padding:48px 56px;background:var(--fond);position:relative}
.carte-p-texte::after{content:"";position:absolute;left:56px;right:40px;bottom:120px;border-top:3px dashed #c8963e}
.carte-p-logo{width:250px;height:auto}
.carte-p-titre{font-family:var(--police-titres);font-size:56px;line-height:1.04;margin:0;text-wrap:balance;font-weight:500}
.carte-p-prix{font-family:var(--police-texte);font-size:30px;font-weight:600;margin:12px 0 0;color:#7a5716}
.carte-p-nom{font-size:22px;font-weight:600;margin:0;letter-spacing:.04em}
.carte-p-image{background:#fbf8f3 center/cover no-repeat}`)}</style>
</head><body>
<div class="carte-p">
  <div class="carte-p-texte">
    <img class="carte-p-logo" src="/assets/images/logo-640.webp" alt="">
    <div><p class="carte-p-titre">${accroche}</p>${c.page.prixPartage ? html`<p class="carte-p-prix">${c.page.prixPartage}</p>` : ''}</div>
    <p class="carte-p-nom">${c.site.nom} · Kernascléden, Bretagne</p>
  </div>
  <div class="carte-p-image" style="background-image:url('/assets/images/${image}')"></div>
</div>
</body></html>`;
}
