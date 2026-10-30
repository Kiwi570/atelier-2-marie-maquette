#!/usr/bin/env python3
"""Détoure des photos de produits (fond transparent) avec le modèle ISNet (onnxruntime).

Usage : python3 outils/detourer.py <modele.onnx> <sortie/> <photo> [<photo>…]
Écrit <sortie>/<nom>.png (RGBA). Les couleurs du produit ne sont jamais modifiées :
seul le canal alpha est ajouté, avec un bord légèrement adouci.
Le modèle (isnet-general-use.onnx, 170 Mo) n'est pas livré avec la maquette :
il se télécharge depuis github.com/danielgatis/rembg/releases (v0.0.0).
"""
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter, ImageOps


def masque(session, img):
    entree = img.convert("RGB").resize((1024, 1024), Image.BICUBIC)
    x = np.asarray(entree, dtype=np.float32) / 255.0
    x = (x - 0.5) / 1.0
    x = x.transpose(2, 0, 1)[None]
    sortie = session.run(None, {session.get_inputs()[0].name: x})[0][0, 0]
    mi, ma = sortie.min(), sortie.max()
    m = (sortie - mi) / (ma - mi + 1e-8)
    m = Image.fromarray((m * 255).astype(np.uint8)).resize(img.size, Image.BICUBIC)
    # Bord net mais sans escalier : seuil doux puis léger flou.
    a = np.asarray(m, dtype=np.float32) / 255.0
    a = np.clip((a - 0.25) / 0.5, 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    modele, dossier, photos = sys.argv[1], Path(sys.argv[2]), sys.argv[3:]
    dossier.mkdir(parents=True, exist_ok=True)
    session = ort.InferenceSession(modele, providers=["CPUExecutionProvider"])
    for p in photos:
        img = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        a = masque(session, img)
        rgba = img.copy()
        rgba.putalpha(a)
        boite = a.point(lambda v: 255 if v > 8 else 0).getbbox()
        if boite:
            marge = round(max(img.size) * 0.02)
            boite = (max(0, boite[0] - marge), max(0, boite[1] - marge), min(img.width, boite[2] + marge), min(img.height, boite[3] + marge))
            rgba = rgba.crop(boite)
        sortie = dossier / (Path(p).stem + ".png")
        rgba.save(sortie)
        print("OK", sortie, rgba.size)


if __name__ == "__main__":
    main()
