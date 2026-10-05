# Checks the built site before it is published.  python3 tests/check.py
# Standard library only, so it runs the same on a laptop and in CI. Exits 1 on any failure.
import json, os, re, sys, xml.dom.minidom
from html.parser import HTMLParser
from urllib.parse import urlsplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
failures = []
def check(ok, msg):
    if not ok: failures.append(msg)

def read(name):
    with open(os.path.join(ROOT, name), encoding="utf-8") as f:
        return f.read()

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags = []; self.ids = []; self.headings = []; self._h = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); self.tags.append((tag, a))
        if "id" in a: self.ids.append(a["id"])
        if re.fullmatch(r"h[1-6]", tag): self._h = [int(tag[1]), ""]
    def handle_endtag(self, tag):
        if self._h and tag == f"h{self._h[0]}": self.headings.append(tuple(self._h)); self._h = None
    def handle_data(self, data):
        if self._h: self._h[1] += data

def parse(name):
    p = Page(); p.feed(read(name)); return p

def local(url):
    u = urlsplit(url)
    return not u.scheme and not u.netloc and not url.startswith(("#", "mailto:", "data:"))

def exists(url, base="/portfolio/"):
    path = urlsplit(url).path
    if path.startswith(base): path = path[len(base):]
    return os.path.exists(os.path.join(ROOT, path.lstrip("/"))) if path not in ("", "/") else True

# 1. Every file the pages ask for exists, and nothing is loaded from another site
for name in ("index.html", "404.html"):
    page = parse(name)
    for tag, a in page.tags:
        refs = [a[k] for k in ("src", "href") if a.get(k)]
        refs += [part.strip().split(" ")[0] for k in ("srcset",) if a.get(k) for part in a[k].split(",")]
        for r in refs:
            if local(r) or r.startswith("/portfolio/"):
                check(exists(r), f"{name}: missing file {r}")
            loads = tag in ("script", "img", "source") or (tag == "link" and a.get("rel") not in ("canonical", "alternate"))
            if loads and urlsplit(r).netloc:
                check(False, f"{name}: <{tag}> loads from another site: {r}")
    csp = [a.get("content", "") for t, a in page.tags if t == "meta" and a.get("http-equiv") == "Content-Security-Policy"]
    check(csp and "default-src 'self'" in csp[0], f"{name}: no Content-Security-Policy")
    check(any(t == "html" and a.get("lang") for t, a in page.tags), f"{name}: <html> has no lang")

index = parse("index.html")
html_text = read("index.html")

# 2. Accessibility basics that can be read from the markup
for tag, a in index.tags:
    if tag == "img": check("alt" in a, f"img without alt: {a.get('src')}")
    if tag == "img": check("width" in a and "height" in a, f"img without dimensions: {a.get('src')}")
    if tag == "button": check(a.get("type") == "button", "button without type=button")
    if tag == "a" and a.get("target") == "_blank": check("noopener" in a.get("rel", ""), f"target=_blank without noopener: {a.get('href')}")
dupes = {i for i in index.ids if index.ids.count(i) > 1}
check(not dupes, f"duplicate ids: {sorted(dupes)}")
for tag, a in index.tags:
    if tag == "a" and a.get("href", "").startswith("#") and len(a["href"]) > 1:
        check(a["href"][1:] in index.ids, f"link to a missing section: {a['href']}")
check(sum(1 for lvl, _ in index.headings if lvl == 1) == 2, "expected one h1 for the index and one for the case")
prev = 1
for lvl, text in index.headings:
    check(lvl <= prev + 1, f"heading level skips from h{prev} to h{lvl}: {text.strip()[:40]}")
    prev = lvl

# 3. Every translatable text has Catalan and English
js = read("app.js")
m = re.search(r"var I18N = (\{.*?\});\n", js)
check(m, "I18N dictionary not found in app.js")
if m:
    for es, tr in json.loads(m.group(1)).items():
        check(tr.get("ca") and tr.get("en"), f"missing translation: {es[:50]}")

# 4. Colour contrast of the text tokens, light and dark (WCAG AA: 4.5:1 for body text)
css = read("styles.css")
def lum(hexc):
    h = hexc.lstrip("#"); h = "".join(c * 2 for c in h) if len(h) == 3 else h
    ch = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    ch = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in ch]
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True); return (la + 0.05) / (lb + 0.05)
def tokens(block):
    return dict(re.findall(r"--(bg|fg|muted|giant):\s*(#[0-9a-fA-F]{3,6})", block))
light = tokens(css[css.index(":root {"):css.index("}", css.index(":root {"))])
dark_at = css.index(':root[data-theme="dark"]')
dark = {**light, **tokens(css[dark_at:css.index("}", dark_at)])}
for name, t in (("light", light), ("dark", dark)):
    check(ratio(t["fg"], t["bg"]) >= 4.5, f"{name}: text contrast {ratio(t['fg'], t['bg']):.2f}")
    check(ratio(t["muted"], t["bg"]) >= 4.5, f"{name}: secondary text contrast {ratio(t['muted'], t['bg']):.2f}")
    check(ratio(t["giant"], t["bg"]) >= 3, f"{name}: large text contrast {ratio(t['giant'], t['bg']):.2f}")

# 5. Search engines and sharing
for needle in ('rel="canonical"', 'property="og:image"', 'hreflang="en"', 'hreflang="ca"', 'name="description"', 'rel="icon"'):
    check(needle in html_text, f"index.html: missing {needle}")
check(re.search(r"<title>[^<]+</title>", html_text), "index.html: no <title>")
check("noindex" in read("404.html"), "404.html should not be indexed")
check("Sitemap:" in read("robots.txt"), "robots.txt: no sitemap")
try: xml.dom.minidom.parseString(read("sitemap.xml"))
except Exception as e: check(False, f"sitemap.xml is not valid XML: {e}")

# 6. Weight budget for the first visit (bytes): page, styles, script, fonts
budget = {"index.html": 40_000, "styles.css": 50_000, "app.js": 60_000,
          "fonts/geist-latin.woff2": 40_000, "vendor/lenis-1.3.26.min.js": 25_000}
for f, limit in budget.items():
    size = os.path.getsize(os.path.join(ROOT, f))
    check(size <= limit, f"{f} is {size} bytes, over its {limit} byte budget")

if failures:
    print("FAILED"); [print(" -", f) for f in failures]; sys.exit(1)
print("All checks passed")
