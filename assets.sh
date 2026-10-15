#!/bin/sh
# Converts PNG masters into web assets. Re-run when masters change.
set -e
cd "$(dirname "$0")"
HANDOFF="../sf-diamonds-handoff 2"
SRC="$HANDOFF/assets/generated"
OUT=public/img
mkdir -p "$OUT" public/fonts

# name master widths...
img() {
  name=$1; master=$2; shift 2
  for w in "$@"; do
    magick "$master" -resize "${w}x" -strip "$OUT/tmp.png"
    cwebp -quiet -q 80 "$OUT/tmp.png" -o "$OUT/$name-$w.webp"
    avifenc -q 55 -s 6 "$OUT/tmp.png" "$OUT/$name-$w.avif" >/dev/null
    magick "$OUT/tmp.png" -quality 80 -interlace Plane "$OUT/$name-$w.jpg"
  done
  rm -f "$OUT/tmp.png"
}

# Hero posters are renders of the site's own 3D scene (qa/capture.mjs), so poster and live scene show the same ring.
RENDERS="$HANDOFF/assets/scene-renders"
img hero-3d "$RENDERS/01-hero-front.png" 1920 1280
img hero-3d-mobile "$RENDERS/hero-mobile-poster.png" 1170 780

# Ivory monogram: alpha of the navy master filled with one colour, trimmed to the visible mark.
magick "$SRC/logo-sf-navy.png" -trim +repage -alpha extract \
  \( +clone -fill '#F3F0E9' -colorize 100 \) +swap -alpha off -compose CopyOpacity -composite \
  -resize x128 "$OUT/logo-ivory.png"
cwebp -quiet -q 90 -alpha_q 100 "$OUT/logo-ivory.png" -o "$OUT/logo-ivory.webp"
magick "$OUT/logo-ivory.png" -background '#13223B' -gravity center -extent 150x150 -resize 64x64 public/favicon.png

cp "$HANDOFF"/assets/fonts/cormorantgaramond/CormorantGaramond-ru-en.woff2 "$HANDOFF"/assets/fonts/manrope/Manrope-ru-en.woff2 public/fonts/
cp "$HANDOFF"/assets/fonts/manrope/OFL.txt public/fonts/OFL-Manrope.txt

# Portrait 4:5 crops for catalogue tiles and editorial collages (redesign, Oct 2026).
crop() { # name master geometry widths...
  name=$1; master=$2; geo=$3; shift 3
  magick "$master" -crop "$geo" +repage "$OUT/crop.png"
  img "$name" "$OUT/crop.png" "$@"
  rm -f "$OUT/crop.png"
}

cp "$HANDOFF"/assets/fonts/cormorantgaramond/OFL.txt public/fonts/OFL-CormorantGaramond.txt
# Unbounded (display, OFL) is fetched from Google Fonts as latin + cyrillic woff2: public/fonts/Unbounded-*.woff2.
# Cormorant italic subset: pyftsubset CormorantGaramond-Italic[wght].ttf (same ranges as upright) -> CormorantGaramond-Italic-ru-en.woff2

# Real photos from the SF Telegram channel (telegram-media/photos, read-only export).
# tools/grade.py applies one global "SF grade" (tone/colour/grain, no AI), then crop.
TG=../telegram-media/photos
tg() { # name message-id geometry widths...
  name=$1; id=$2; geo=$3; shift 3
  python3 -I tools/grade.py "$(ls "$TG"/*_"$id".jpg)" "$OUT/grade.png" --crop "$geo"
  img "$name" "$OUT/grade.png" "$@"
  rm -f "$OUT/grade.png"
}
tg tg-ring-oval 2602 960x1200+0+40 960 560
tg tg-ring-radiant 2604 960x1200+0+40 960 560
tg tg-ring-pear 2601 960x1200+0+40 960 560
tg tg-ring-round 2600 960x1200+0+40 960 560
tg tg-ring-pink 2599 960x1200+0+40 960 560
tg tg-ring-yellow 2598 960x1200+0+0 960 560
tg tg-bracelets 2659 960x1200+0+40 960 560
tg tg-bracelets-tray 2715 598x748+0+24 598
tg tg-bracelet-studio 3313 1280x853+0+0 1280 720
tg tg-earrings 1262 1000x1250+0+15 1000 560
tg tg-necklace 2073 960x1200+0+20 960 560

# Own SF pieces with a price in the post: channel photo, AI-edited navy background, original stones pasted back by mask.
PRICES=../ai-generation-bases/out/prices
crop sf-necklace-2062 "$PRICES/necklace-2062-final.png" 1120x1400+0+0 960 560
crop sf-studs-177 "$PRICES/studs-177-final.png" 912x1140+0+12 960 560

# Section photos (one per place, never repeated): channel pieces re-staged by AI on site-palette surfaces, original
# stones pasted back by mask where the angle allowed (ai-generation-bases/out/sections, prompts next to each image).
SEC=../ai-generation-bases/out/sections
img sec-engagement "$SEC/01-engagement-pink-gen.png" 1080 640
img sec-bespoke-wide "$SEC/02-bespoke-paraiba-final.png" 1600 960
img sec-bespoke-emerald "$SEC/03-bespoke-emerald-final.png" 800 480
img sec-closing "$SEC/04-closing-necklace-gen.png" 880 560
img sec-collection "$SEC/05-collection-yellow-bracelet-gen.png" 900 560
img page-bespoke "$SEC/06-bespoke-page-earrings-gen.png" 1536 900
img page-engagement "$SEC/07-engagement-page-yellow-rings-gen.png" 1536 900
# Graded channel photos, no AI (About collage, channel strip).
tg about-emerald 2782 601x751+0+0 601 480
tg about-studs 1265 1024x1280+0+0 800 480
tg tg-bracelets-dark 2537 853x1066+0+60 853 560
# Catalogue: SF's own pieces, one photo each from the post (graded, no AI), 4:5 centre crop.
tg tg-ring-pear-2603 2603 960x1200+0+26 960 560
tg tg-ring-blue-2793 2793 844x1055+0+23 844 560
tg tg-studs-1264 1264 1015x1268+0+4 960 560
tg tg-earrings-2058 2058 960x1200+0+26 960 560
tg tg-pendant-2057 2057 960x1200+0+26 960 560
tg tg-emerald-2787 2787 601x751+0+16 601 560
tg tg-cross-2075 2075 960x1200+0+26 960 560
tg tg-tennis-2735 2735 640x800+80+0 640 560
tg tg-bracelet-2536 2536 853x1066+0+71 853 560
tg tg-bracelets-2662 2662 960x1200+0+26 960 560
tg tg-bracelets-3312 3312 853x1066+0+71 853 560
tg tg-bracelets-2712 2712 598x747+0+16 598 560
tg tg-yellow-2801 2801 960x1200+0+26 960 560
crop tg-tennis-layers "$SEC/08-channel-tennis-layers-gen.png" 1003x1254+125+0 960 560

# SF Instagram photos (ai-generation-bases/*.jpg), same SF grade, 4:5 crop: Bespoke steps, FAQ concierge, Contact.
IG=../ai-generation-bases
ig() { # name file geometry widths...
  name=$1; file=$2; geo=$3; shift 3
  python3 -I tools/grade.py "$IG/$file" "$OUT/grade.png" --crop "$geo"
  img "$name" "$OUT/grade.png" "$@"
  rm -f "$OUT/grade.png"
}
ig ig-hands-rings 09-mood-flowers-hands.jpg 3072x3840+0+128 960 560
ig ig-coffee 03-necklace-butterfly-coffee.jpg 3024x3780+0+24 960 560
ig ig-neckline 04-necklace-butterfly-neckline.jpg 3024x3780+0+126 960 560
ig ig-blazer 10-mood-brown-blazer-pose.jpg 3024x3780+0+126 960 560
ig ig-trench 08-mood-trench-ivory.jpg 2048x2560+0+86 960 560
