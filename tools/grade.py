"""SF grade: one look for phone photos from the SF Telegram channel. Global tone/colour only, so stones, prongs
and metal keep their real pixels (no AI). usage: python3 -I tools/grade.py in.jpg out.png [--crop WxH+X+Y]"""
import sys
import numpy as np
from PIL import Image

def grade(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert('RGB'), dtype=np.float32) / 255
    # Matte blacks and a soft S-curve; highlights roll off instead of clipping.
    a = 0.035 + a * 0.945
    a = a + 0.12 * np.sin(2 * np.pi * (a - 0.5)) * a * (1 - a) * 2.2
    lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    # Calm phone saturation, keep a little more on bright sparkle.
    sat = 0.86 + 0.08 * lum[..., None]
    a = lum[..., None] + (a - lum[..., None]) * sat
    # Warm shadows (ivory/cognac palette), neutral highlights.
    shadow = (1 - lum)[..., None] ** 2
    a = a + shadow * np.array([0.022, 0.008, -0.018], dtype=np.float32)
    # Gentle vignette and fine luminance grain (seeded: same input, same output).
    h, w = lum.shape
    y, x = np.ogrid[-1:1:h * 1j, -1:1:w * 1j]
    a = a * (1 - 0.09 * np.clip(x * x + y * y - 0.35, 0, None))[..., None]
    a = a + np.random.default_rng(7).normal(0, 0.011, (h, w, 1)).astype(np.float32)
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))

if __name__ == '__main__':
    src, out = sys.argv[1], sys.argv[2]
    img = Image.open(src)
    if '--crop' in sys.argv:
        g = sys.argv[sys.argv.index('--crop') + 1]
        wh, x, y = g.split('+')[0], int(g.split('+')[1]), int(g.split('+')[2])
        w, h = map(int, wh.split('x'))
        img = img.crop((x, y, x + w, y + h))
    grade(img).save(out)
