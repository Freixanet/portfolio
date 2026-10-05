# Builds the site from src/ into the repository root: index.html, styles.css, app.js, 404.html,
# robots.txt, sitemap.xml and the icons. Run from anywhere:  python3 src/build.py
# Optional: python3 src/build.py --artifact DIR  also writes a copy for the Claude artifact (no <head>).
import base64, hashlib, html, json, os, re, shutil, sys

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
URL = "https://freixanet.github.io/portfolio/"
LANGS = ("es", "ca", "en")

def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()

def write(name, text):
    with open(os.path.join(ROOT, name), "w", encoding="utf-8") as f:
        f.write(text)

def sha256(script):
    return "'sha256-" + base64.b64encode(hashlib.sha256(script.encode()).digest()).decode() + "'"

s = read("template.html").replace("{{UI}}", read("ui-screens.html"))

def picture(name, alt, cls, sizes, extra=""):
    av = ", ".join(f"img/{name}-{w}.avif {w}w" for w in (320, 560, 840))
    wb = ", ".join(f"img/{name}-{w}.webp {w}w" for w in (320, 560, 840))
    c = f' class="{cls}"' if cls else ""
    return (f'<picture><source type="image/avif" srcset="{av}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{wb}" sizes="{sizes}">'
            f'<img{c}{extra} src="img/{name}-560.webp" width="560" height="1217" alt="{alt}" loading="lazy" decoding="async"></picture>')

feat = "(width < 54rem) 36vw, 260px"
for old, new in [
    ('<img class="par" data-speed="10" alt="Alice: inicio del chat" src="data:image/jpeg;base64,{{CHAT}}">', picture("chat", "Alice: inicio del chat", "par", feat, ' data-speed="10"')),
    ('<img class="par" data-speed="18" alt="Alice: menú lateral" src="data:image/jpeg;base64,{{NAV}}">', picture("nav", "Alice: menú lateral", "par", feat, ' data-speed="18"')),
    ('<img alt="" src="data:image/jpeg;base64,{{CHAT}}">', picture("chat", "", "", "320px")),
    ('<img alt="" src="data:image/jpeg;base64,{{NAV}}">', picture("nav", "", "", "320px")),
]:
    assert old in s, old[:50]
    s = s.replace(old, new)
assert "{{" not in s.replace("{{LANG_LINKS}}", ""), "placeholder left"

# Split the template into head, CSS, body and JS
i = s.index("<style>"); j = s.index("</style>") + len("</style>")
css = s[i + len("<style>"):j - len("</style>")]
top = s[:i]; rest = s[j:]
k = rest.index("<script>\n"); m = rest.index("</script>", k) + len("</script>")
js = rest[k + len("<script>\n"):m - len("</script>")]
body = rest[:k] + '<script src="app.js" defer></script>' + rest[m:]
lenis = '<script src="vendor/lenis-1.3.26.min.js"></script>'
assert lenis in body
body = body.replace(lenis, lenis.replace("></script>", " defer></script>"))
css = (":root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
       "body{margin:0}img{max-width:100%}[hidden]{display:none!important}\n" + css +
       "\nimg { height: auto; }\npicture { display: contents; }\n")

head_script = "document.documentElement.classList.add('js');"
assert f"<script>{head_script}</script>" in top
desc = "Marc Freixanet construye productos completos: apps de iPhone, webs, y los servidores y agentes que hay detrás."
person = json.dumps({"@context": "https://schema.org", "@type": "Person", "name": "Marc Freixanet",
                     "url": URL, "jobTitle": "Developer", "homeLocation": {"@type": "Place", "name": "Barcelona"},
                     "sameAs": ["https://github.com/Freixanet"]}, ensure_ascii=False)

def csp(*scripts):
    return ("default-src 'self'; script-src 'self' " + " ".join(sha256(x) for x in scripts) +
            "; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; "
            "object-src 'none'; base-uri 'self'; form-action 'none'")

# ——— One static page per language: / (Spanish), /ca/, /en/ ———
I18N = json.loads(re.search(r"var I18N = (\{.*?\});\n", js).group(1))
PATH = {"es": "", "ca": "ca/", "en": "en/"}
NAME = {"ca": "Català", "es": "Español", "en": "English"}
LOCALE = {"es": "es_ES", "ca": "ca_ES", "en": "en_GB"}

def translate(page, lang):
    """Replaces every text the dictionary knows: element contents, aria-labels and alt texts."""
    if lang == "es":
        return page
    for es, tr in sorted(I18N.items(), key=lambda kv: -len(kv[0])):    # longest first, so no key eats a longer one
        words = [re.escape(w) for w in es.split()]
        pattern = r"\s*".join(words)
        page = re.sub(r"(>\s*)" + pattern + r"(\s*</)", lambda m: m.group(1) + tr[lang] + m.group(2), page)
        attr = html.escape(es, quote=True)
        for a in ("aria-label", "alt", "content"):
            page = page.replace(f'{a}="{attr}"', f'{a}="{html.escape(tr[lang], quote=True)}"')
    return page

def relocate(page, depth):
    """Points relative src/href/srcset one folder up for the /ca/ and /en/ pages (in-page #links stay)."""
    if not depth:
        return page
    up = "../" * depth
    def fix(url):
        return url if re.match(r"^(#|[a-z]+:|/|data:)", url) else up + url
    page = re.sub(r'\b(src|href)="([^"]*)"', lambda m: f'{m.group(1)}="{fix(m.group(2))}"', page)
    page = re.sub(r'\bsrcset="([^"]*)"', lambda m: 'srcset="' + ", ".join(
        " ".join([fix(p.strip().split(" ")[0])] + p.strip().split(" ")[1:]) for p in m.group(1).split(",")) + '"', page)
    return page

def lang_links(lang, artifact=False):
    """Links to the three language pages, relative to the page they are written into."""
    up = "../" if PATH[lang] else ""
    out = []
    for l in ("ca", "es", "en"):
        href = "./" if l == lang else (up + PATH[l] or "./")
        if artifact: href = "index.html" if l == lang else up + PATH[l] + "index.html"
        cur = ' aria-current="page"' if l == lang else ""
        out.append(f'<a href="{href}" hreflang="{l}" lang="{l}" data-lang="{l}"{cur}>{NAME[l]}</a>')
    return "\n            ".join(out)

alternates = "".join(f'<link rel="alternate" hreflang="{l}" href="{URL}{PATH[l]}">\n' for l in ("es", "ca", "en")) + \
             f'<link rel="alternate" hreflang="x-default" href="{URL}">\n'

def head(lang):
    d = desc if lang == "es" else I18N[desc][lang]
    alt_locales = "".join(f'<meta property="og:locale:alternate" content="{LOCALE[l]}">\n' for l in LANGS if l != lang)
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="{csp(head_script)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="description" content="{d}">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="{URL}{PATH[lang]}">
{alternates}<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:url" content="{URL}{PATH[lang]}">
<meta property="og:title" content="Marc Freixanet">
<meta property="og:description" content="{d}">
<meta property="og:image" content="{URL}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Marc Freixanet. Construyo productos completos.">
<meta property="og:locale" content="{LOCALE[lang]}">
{alt_locales}<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{person}</script>
"""

link_css = '<link rel="stylesheet" href="styles.css">\n'
write("styles.css", css)
write("app.js", js)
pages = {}
for lang in LANGS:
    depth = 1 if PATH[lang] else 0
    doc = head(lang) + top + link_css + "</head>\n<body>" + body + "\n</body>\n</html>\n"
    doc = relocate(translate(doc, lang), depth)
    pages[lang] = doc
    doc = doc.replace("{{LANG_LINKS}}", lang_links(lang))
    if PATH[lang]: os.makedirs(os.path.join(ROOT, PATH[lang]), exist_ok=True)
    write(PATH[lang] + "index.html", doc)

# 404: same look, in the visitor's language. Absolute paths, because GitHub serves it at any depth.
nf_script = ("var l=(function(){try{return localStorage.getItem('lang')}catch(e){}})()||(navigator.language||'es').slice(0,2);"
             "var t={ca:['Aquesta pàgina no existeix.','Potser l’enllaç és antic o hi ha una errada.','Anar a l’inici'],"
             "en:['This page doesn’t exist.','The link may be old, or there may be a typo.','Go to the home page']}[l];"
             "if(t){document.documentElement.lang=l;var e=document.querySelectorAll('[data-t]');"
             "for(var i=0;i<e.length;i++)e[i].textContent=t[i];}")
nf_theme = ("try{var m=localStorage.getItem('theme');if(m==='light'||m==='dark')document.documentElement.setAttribute('data-theme',m)}catch(e){}")
write("404.html", f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="{csp(nf_theme, nf_script)}">
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
<title>Página no encontrada — Marc Freixanet</title>
<link rel="icon" href="/portfolio/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/portfolio/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/portfolio/styles.css">
<style>
.nf {{ min-block-size: 100svh; display: grid; align-content: center; gap: var(--s5); }}
.nf h1 {{ font-family: var(--display); font-size: var(--t-h2); line-height: 1; letter-spacing: -.025em; margin: 0; }}
.nf p {{ margin: 0; color: var(--muted); }}
.nf a {{ justify-self: start; display: inline-flex; align-items: center; min-block-size: 44px; color: var(--fg); }}
</style>
<script>{nf_theme}</script>
</head>
<body>
<main class="wrap nf">
<h1 data-t>Esta página no existe.</h1>
<p data-t>Puede que el enlace sea antiguo o tenga una errata.</p>
<a class="ul" href="/portfolio/" data-t>Ir al inicio</a>
</main>
<script>{nf_script}</script>
</body>
</html>
''')

write("robots.txt", f"User-agent: *\nAllow: /\nDisallow: /src/\nDisallow: /tests/\n\nSitemap: {URL}sitemap.xml\n")
alts = "".join(f'    <xhtml:link rel="alternate" hreflang="{l}" href="{URL}{PATH[l]}"/>\n' for l in LANGS) + \
       f'    <xhtml:link rel="alternate" hreflang="x-default" href="{URL}"/>\n'
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
      + "".join(f"  <url>\n    <loc>{URL}{PATH[l]}</loc>\n{alts}  </url>\n" for l in LANGS)
      + "</urlset>\n")
write("favicon.svg", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>rect{fill:#000}path{stroke:#f2f2f2}'
      '@media(prefers-color-scheme:dark){rect{fill:#f2f2f2}path{stroke:#000}}</style><rect width="32" height="32" rx="7"/>'
      '<path d="M6 16c2.2 0 2.2-4.6 4.4-4.6S12.6 20.6 14.8 20.6 17 11.4 19.2 11.4s2.2 4.6 4.4 4.6H26" fill="none" '
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>\n')

if "--artifact" in sys.argv:                      # the Claude artifact: the host adds the document head
    A = sys.argv[sys.argv.index("--artifact") + 1]
    shutil.rmtree(A, ignore_errors=True)
    for d in ("img", "fonts", "vendor"):
        shutil.copytree(os.path.join(ROOT, d), os.path.join(A, d))
    for f in ("styles.css", "app.js"):
        shutil.copy(os.path.join(ROOT, f), os.path.join(A, f))
    with open(os.path.join(A, "index.html"), "w", encoding="utf-8") as f:
        f.write(top + link_css + body.replace("{{LANG_LINKS}}", lang_links("es", artifact=True)))
    for lang in ("ca", "en"):
        os.makedirs(os.path.join(A, lang), exist_ok=True)
        doc = pages[lang].replace("{{LANG_LINKS}}", lang_links(lang, artifact=True))
        with open(os.path.join(A, lang, "index.html"), "w", encoding="utf-8") as f:
            f.write(doc)

print("built", {f: os.path.getsize(os.path.join(ROOT, f)) for f in ("index.html", "ca/index.html", "en/index.html", "styles.css", "app.js", "404.html")})
