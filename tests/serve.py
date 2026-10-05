# Serves the repository root at /portfolio/ like GitHub Pages, including its 404 page.
#   python3 tests/serve.py [port]
import http.server, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREFIX = "/portfolio"
PUBLISHED = {"index.html", "404.html", "styles.css", "app.js", "robots.txt", "sitemap.xml", "favicon.svg",
             "apple-touch-icon.png", "og.png", ".nojekyll"}
PUBLISHED_DIRS = ("img/", "fonts/", "vendor/")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a):
        pass
    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path == PREFIX:
            self.send_response(301); self.send_header("Location", PREFIX + "/"); self.end_headers(); return None
        rel = path[len(PREFIX) + 1:] if path.startswith(PREFIX + "/") else None
        if rel == "": rel = "index.html"
        if rel is None or not (rel in PUBLISHED or rel.startswith(PUBLISHED_DIRS)) or not os.path.isfile(os.path.join(ROOT, rel)):
            body = open(os.path.join(ROOT, "404.html"), "rb").read()
            self.send_response(404); self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body))); self.end_headers()
            self.wfile.write(body); return None
        self.path = "/" + rel
        return super().send_head()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
