# Draws og.png (1200x630, link previews) and apple-touch-icon.png (180x180) with the site's own font.
# Only needed when the headline or the mark change; the PNGs are committed.
# Needs: pip install -r src/requirements-render.txt      Run: python3 src/render_images.py
import io, os
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

SRC = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(SRC)
BG, FG, MUTED, GIANT = "#f2f2f2", "#000000", "#626262", "#8a8a8a"

def geist(size, weight):
    f = TTFont(os.path.join(ROOT, "fonts/geist-latin.woff2")); f.flavor = None
    buf = io.BytesIO(); f.save(buf); buf.seek(0)
    font = ImageFont.truetype(buf, size); font.set_variation_by_axes([weight])
    return font

def mark(draw, x, y, scale, color, width):
    # The signal mark from the header (viewBox 22x12), as a polyline through its curve
    pts = []
    for i in range(0, 201):
        t = i / 200 * 20
        if t < 4.4: yy = 6 - 4.6 * (0.5 - 0.5 * __import__("math").cos(t / 4.4 * 3.14159))
        elif t < 8.8: yy = 1.4 + 9.2 * (0.5 - 0.5 * __import__("math").cos((t - 4.4) / 4.4 * 3.14159))
        elif t < 13.2: yy = 10.6 - 9.2 * (0.5 - 0.5 * __import__("math").cos((t - 8.8) / 4.4 * 3.14159))
        elif t < 17.6: yy = 1.4 + 4.6 * (0.5 - 0.5 * __import__("math").cos((t - 13.2) / 4.4 * 3.14159))
        else: yy = 6
        pts.append((x + (1 + t) * scale, y + yy * scale))
    r = width / 2                      # a round brush stamped along the curve: smooth, round caps
    for i in range(len(pts) - 1):
        (ax, ay), (bx, by) = pts[i], pts[i + 1]
        for k in range(8):
            px, py = ax + (bx - ax) * k / 8, ay + (by - ay) * k / 8
            draw.ellipse((px - r, py - r, px + r, py + r), fill=color)

S = 2  # draw at 2x, then downsample for clean edges
og = Image.new("RGB", (1200 * S, 630 * S), BG); d = ImageDraw.Draw(og)
mark(d, 70 * S, 66 * S, 2 * S, FG, 3 * S)
d.text((128 * S, 64 * S), "Marc Freixanet", font=geist(28 * S, 500), fill=FG)
big = geist(100 * S, 500)
d.text((68 * S, 252 * S), "Construyo productos", font=big, fill=GIANT)
d.text((68 * S, 348 * S), "completos.", font=big, fill=GIANT)
d.rectangle((72 * S, 520 * S, 1128 * S, 522 * S), fill=FG)
small = geist(26 * S, 420)
d.text((72 * S, 546 * S), "Apps de iPhone, webs, servidores y agentes", font=small, fill=MUTED)
d.text((1128 * S, 546 * S), "Barcelona", font=small, fill=MUTED, anchor="ra")
og.resize((1200, 630), Image.LANCZOS).save(os.path.join(ROOT, "og.png"), optimize=True)

ic = Image.new("RGB", (180 * S, 180 * S), FG); d = ImageDraw.Draw(ic)
mark(d, 22 * S, 52 * S, 6 * S, BG, 12 * S)
ic.resize((180, 180), Image.LANCZOS).save(os.path.join(ROOT, "apple-touch-icon.png"), optimize=True)
print("rendered og.png and apple-touch-icon.png")
