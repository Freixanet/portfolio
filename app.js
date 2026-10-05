(function () {
  var set = document.getElementById('screens');
  var screens = Array.prototype.slice.call(set.children);
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));

  // On narrow screens each step carries its own phone.
  steps.forEach(function (step, i) {
    var phone = document.createElement('div');
    phone.className = 'phone';
    var inner = document.createElement('div');
    inner.className = 'screen-set';
    var s = screens[i].cloneNode(true);
    s.classList.add('on');
    inner.appendChild(s);
    phone.appendChild(inner);
    step.querySelector('.inline-phone').appendChild(phone);
  });


  // ——— Motion ———
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (!reduce) root.classList.add('motion');
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };


  // ——— Languages: Catalan, Spanish, English. Spanish is the source text in the page. ———
  var I18N = {"Escríbeme": {"ca": "Escriu-me", "en": "Get in touch"}, "Inicio": {"ca": "Inici", "en": "Home"}, "Trabajo": {"ca": "Feina", "en": "Work"}, "Detalles": {"ca": "Detalls", "en": "Details"}, "Sobre mí": {"ca": "Sobre mi", "en": "About"}, "Contacto": {"ca": "Contacte", "en": "Contact"}, "La historia": {"ca": "La història", "en": "The story"}, "Cómo está hecha": {"ca": "Com està feta", "en": "How it’s built"}, "Construyo productos completos.": {"ca": "Construeixo productes complets.", "en": "I build complete products."}, "Swift, TypeScript<br>y Python": {"ca": "Swift, TypeScript<br>i Python", "en": "Swift, TypeScript<br>and Python"}, "Apps de iPhone, webs, y los servidores y agentes que hay detrás. Desde Barcelona.": {"ca": "Apps d’iPhone, webs, i els servidors i agents que hi ha al darrere. Des de Barcelona.", "en": "iPhone apps, websites, and the servers and agents behind them. From Barcelona."}, "Cinco proyectos. El primero lo uso cada día.<sup><a href=\"#nota-1\" class=\"fn\">1</a></sup>": {"ca": "Cinc projectes. El primer el faig servir cada dia.<sup><a href=\"#nota-1\" class=\"fn\">1</a></sup>", "en": "Five projects. I use the first one every day.<sup><a href=\"#nota-1\" class=\"fn\">1</a></sup>"}, "Demo en vídeo, pendiente": {"ca": "Demo en vídeo, pendent", "en": "Video demo, coming soon"}, "Un agente personal que manejas desde el iPhone y que trabaja en tu propio Mac. Busca, rellena y compra, y se para antes de pagar.": {"ca": "Un agent personal que fas servir des de l’iPhone i que treballa al teu propi Mac. Busca, omple i compra, i s’atura abans de pagar.", "en": "A personal agent you run from your iPhone that works on your own Mac. It searches, fills in and buys, and stops before paying."}, "iPhone, web y agentes": {"ca": "iPhone, web i agents", "en": "iPhone, web and agents"}, "Ver el caso": {"ca": "Veure el cas", "en": "See the case"}, "Más proyectos": {"ca": "Més projectes", "en": "More projects"}, "Chat legal para España que quita tus datos personales del texto en el navegador, antes de enviarlo.": {"ca": "Xat legal per a Espanya que treu les teves dades personals del text al navegador, abans d’enviar-lo.", "en": "A legal chat for Spain that strips your personal data from the text in the browser, before sending it."}, "Web con IA": {"ca": "Web amb IA", "en": "Web with AI"}, "Un escáner de documentos pensado para sentirse tranquilo. Prototipo con cada decisión documentada.": {"ca": "Un escàner de documents pensat per sentir-se tranquil. Prototip amb cada decisió documentada.", "en": "A document scanner designed to feel calm. A prototype with every decision documented."}, "App de iPhone": {"ca": "App d’iPhone", "en": "iPhone app"}, "La web de una pintora: un catálogo para vender obra y un modo que cuenta su historia, en dos idiomas.": {"ca": "La web d’una pintora: un catàleg per vendre obra i un mode que explica la seva història, en dos idiomes.", "en": "A painter’s website: a catalogue to sell her work and a mode that tells her story, in two languages."}, "Web para un cliente": {"ca": "Web per a un client", "en": "Client website"}, "Convierte notas, vídeos de YouTube o PDFs en una idea central y unos pocos pasos con tiempo.": {"ca": "Converteix notes, vídeos de YouTube o PDF en una idea central i uns quants passos amb temps.", "en": "Turns notes, YouTube videos or PDFs into one core idea and a few timed steps."}, "App móvil con IA": {"ca": "App mòbil amb IA", "en": "Mobile app with AI"}, "casos en preparación": {"ca": "casos en preparació", "en": "case studies in progress"}, "Piezas pequeñas de varios proyectos que muestran cómo trabajo.": {"ca": "Peces petites de diversos projectes que mostren com treballo.", "en": "Small pieces from several projects that show how I work."}, "El navegador, en el chat": {"ca": "El navegador, al xat", "en": "The browser, in the chat"}, "Anonimizar antes de enviar": {"ca": "Anonimitzar abans d’enviar", "en": "Anonymise before sending"}, "Dos modos, una web": {"ca": "Dos modes, una web", "en": "Two modes, one site"}, "Un juez que exige pruebas": {"ca": "Un jutge que exigeix proves", "en": "A judge that demands proof"}, "La tarjeta, fuera del chat": {"ca": "La targeta, fora del xat", "en": "The card, out of the chat"}, "De un PDF a tres pasos": {"ca": "D’un PDF a tres passos", "en": "From a PDF to three steps"}, "vídeo de 6&nbsp;s": {"ca": "vídeo de 6&nbsp;s", "en": "6&nbsp;s video"}, "vídeo de 8&nbsp;s": {"ca": "vídeo de 8&nbsp;s", "en": "8&nbsp;s video"}, "vídeo de 5&nbsp;s": {"ca": "vídeo de 5&nbsp;s", "en": "5&nbsp;s video"}, "código": {"ca": "codi", "en": "code"}, "Hueco: dos o tres frases tuyas. Qué te mueve, cómo trabajas y qué equipo buscas.": {"ca": "Espai reservat: dues o tres frases teves. Què et mou, com treballes i quin equip busques.", "en": "Placeholder: two or three sentences of yours. What drives you, how you work and what team you’re after."}, "Lenguajes": {"ca": "Llenguatges", "en": "Languages"}, "Hago": {"ca": "Faig", "en": "I make"}, "Base": {"ca": "Base", "en": "Based in"}, "Apps de iPhone, webs, servidores y agentes": {"ca": "Apps d’iPhone, webs, servidors i agents", "en": "iPhone apps, websites, servers and agents"}, "Barcelona, o en remoto": {"ca": "Barcelona, o en remot", "en": "Barcelona, or remote"}, "Con mi propio Hermes, en mi iPhone y en mi Mac.": {"ca": "Amb el meu propi Hermes, al meu iPhone i al meu Mac.", "en": "With my own Hermes, on my iPhone and my Mac."}, "¿Hacemos algo juntos?": {"ca": "Fem alguna cosa junts?", "en": "Shall we build something?"}, "Copiar": {"ca": "Copia", "en": "Copy"}, "Copiado": {"ca": "Copiat", "en": "Copied"}, "Idioma": {"ca": "Idioma", "en": "Language"}, "Tema": {"ca": "Tema", "en": "Theme"}, "Auto": {"ca": "Auto", "en": "Auto"}, "Claro": {"ca": "Clar", "en": "Light"}, "Oscuro": {"ca": "Fosc", "en": "Dark"}, "Volver al trabajo": {"ca": "Tornar a la feina", "en": "Back to work"}, "Tu propio agente, en el iPhone.": {"ca": "El teu propi agent, a l’iPhone.", "en": "Your own agent, on your iPhone."}, "Swift y SwiftUI": {"ca": "Swift i SwiftUI", "en": "Swift and SwiftUI"}, "React y TypeScript": {"ca": "React i TypeScript", "en": "React and TypeScript"}, "Servidor y agentes": {"ca": "Servidor i agents", "en": "Server and agents"}, "Estado": {"ca": "Estat", "en": "Status"}, "En uso diario": {"ca": "En ús diari", "en": "In daily use"}, "En el móvil, un agente vive dentro de un bot de mensajería. Sirve para preguntas. Pero cuando compra, inicia sesión o necesita tu permiso a mitad de tarea, hace falta otra cosa: ver lo que hace, y decidir tú.": {"ca": "Al mòbil, un agent viu dins d’un bot de missatgeria. Serveix per a preguntes. Però quan compra, inicia sessió o necessita el teu permís a mitja tasca, cal una altra cosa: veure què fa, i decidir tu.", "en": "On a phone, an agent lives inside a messaging bot. That’s fine for questions. But when it buys something, signs in or needs your permission halfway through, you need something else: to see what it does, and to decide."}, "Le pides algo. Como a una persona.": {"ca": "Li demanes alguna cosa. Com a una persona.", "en": "You ask it for something. Like you’d ask a person."}, "Un chat nativo con respuestas en directo, adjuntos y una voz que puedes interrumpir hablando. <b>Una cosa cada vez.</b>": {"ca": "Un xat natiu amb respostes en directe, adjunts i una veu que pots interrompre parlant. <b>Una cosa cada vegada.</b>", "en": "A native chat with live replies, attachments and a voice you can interrupt by speaking. <b>One thing at a time.</b>"}, "Ves lo que hace. Mientras lo hace.": {"ca": "Veus què fa. Mentre ho fa.", "en": "You see what it does. While it does it."}, "La página en la que está el agente aparece en el chat, en directo. <b>La tocas y tomas el control;</b> al acabar, se la devuelves.": {"ca": "La pàgina on és l’agent apareix al xat, en directe. <b>La toques i prens el control;</b> quan acabes, l’hi tornes.", "en": "The page the agent is on appears in the chat, live. <b>Tap it to take over;</b> when you’re done, hand it back."}, "Paga cuando tú dices «Pagar».": {"ca": "Paga quan tu dius «Pagar».", "en": "It pays when you say “Pay”."}, "Llena el carrito, la dirección y el envío, prueba los códigos de descuento y se para antes de pagar. <b>La tarjeta nunca pasa por el chat.</b>": {"ca": "Omple el cistell, l’adreça i l’enviament, prova els codis de descompte i s’atura abans de pagar. <b>La targeta mai no passa pel xat.</b>", "en": "It fills in the basket, the address and the delivery, tries the discount codes and stops before paying. <b>The card never goes through the chat.</b>"}, "Agentes, notas, rutinas. A un gesto.": {"ca": "Agents, notes, rutines. A un gest.", "en": "Agents, notes, routines. One gesture away."}, "Resumen de mañana y de noche, agenda, objetivos que se miden solos y avisos al llegar a un sitio, sin compartir dónde estás.": {"ca": "Resum del matí i del vespre, agenda, objectius que es mesuren sols i avisos en arribar a un lloc, sense compartir on ets.", "en": "Morning and evening summaries, calendar, goals that measure themselves and reminders when you arrive somewhere, without sharing where you are."}, "Por qué existe, qué decidí y qué me costó.": {"ca": "Per què existeix, què vaig decidir i què em va costar.", "en": "Why it exists, what I decided and what was hard."}, "El problema": {"ca": "El problema", "en": "The problem"}, "Hermes es un agente abierto muy capaz, pero en el móvil se usa a través de un bot de mensajería. Sirve para preguntas. Se queda corto cuando el agente compra, inicia sesión en una web o necesita tu permiso a mitad de tarea.": {"ca": "Hermes és un agent obert molt capaç, però al mòbil es fa servir a través d’un bot de missatgeria. Serveix per a preguntes. Es queda curt quan l’agent compra, inicia sessió en una web o necessita el teu permís a mitja tasca.", "en": "Hermes is a very capable open agent, but on a phone you reach it through a messaging bot. That works for questions. It falls short when the agent buys something, signs in to a site or needs your permission halfway through a task."}, "Las decisiones": {"ca": "Les decisions", "en": "The decisions"}, "App nativa en SwiftUI, no una web dentro de una app.": {"ca": "App nativa en SwiftUI, no una web dins d’una app.", "en": "A native SwiftUI app, not a website inside an app."}, "Ningún secreto en el chat: contraseñas, códigos y tarjetas van por hojas seguras a tu Mac.": {"ca": "Cap secret al xat: contrasenyes, codis i targetes van per fulls segurs al teu Mac.", "en": "No secrets in the chat: passwords, codes and cards go through secure sheets to your Mac."}, "Un paso irreversible, como pagar, espera un «Pagar» explícito.": {"ca": "Un pas irreversible, com pagar, espera un «Pagar» explícit.", "en": "An irreversible step, like paying, waits for an explicit “Pay”."}, "Hermes oficial, sin parches: lo que falta va en un plugin propio.": {"ca": "Hermes oficial, sense pedaços: el que falta va en un plugin propi.", "en": "Official Hermes, unpatched: anything missing goes in a plugin of my own."}, "Lo difícil": {"ca": "El difícil", "en": "The hard part"}, "Comprar de verdad. Cada tienda es distinta y el pago pasa por la página del banco. Alice distingue un pago confirmado de uno rechazado o sin confirmar, y bloquea un segundo pago en la misma tienda hasta saber qué pasó con el primero.": {"ca": "Comprar de debò. Cada botiga és diferent i el pagament passa per la pàgina del banc. Alice distingeix un pagament confirmat d’un de rebutjat o sense confirmar, i bloqueja un segon pagament a la mateixa botiga fins a saber què ha passat amb el primer.", "en": "Buying for real. Every shop is different and payment goes through the bank’s page. Alice tells a confirmed payment from a declined or unconfirmed one, and blocks a second payment at the same shop until it knows what happened to the first."}, "Dónde está hoy": {"ca": "On és avui", "en": "Where it is today"}, "La uso cada día para el chat, la agenda, los objetivos y los resúmenes. Las compras llegan hasta el pago y ya han destapado errores reales que he corregido. Todavía no la dejaría comprar sin supervisión.": {"ca": "La faig servir cada dia per al xat, l’agenda, els objectius i els resums. Les compres arriben fins al pagament i ja han destapat errors reals que he corregit. Encara no la deixaria comprar sense supervisió.", "en": "I use it every day for chat, calendar, goals and summaries. Purchases go as far as payment and have already surfaced real bugs that I’ve fixed. I wouldn’t yet let it buy unsupervised."}, "Ver el código": {"ca": "Veure el codi", "en": "See the code"}, "Tres capas, de punta a punta. Una decisión importante en cada una.": {"ca": "Tres capes, de punta a punta. Una decisió important en cadascuna.", "en": "Three layers, end to end. One important decision in each."}, "archivos de Swift en la app de iPhone": {"ca": "fitxers de Swift a l’app d’iPhone", "en": "Swift files in the iPhone app"}, "archivos de TypeScript en la web": {"ca": "fitxers de TypeScript a la web", "en": "TypeScript files in the web app"}, "archivos de Python en el servidor y los agentes": {"ca": "fitxers de Python al servidor i als agents", "en": "Python files in the server and agents"}, "iPhone y web": {"ca": "iPhone i web", "en": "iPhone and web"}, "Swift y TypeScript, unos 640 archivos": {"ca": "Swift i TypeScript, uns 640 fitxers", "en": "Swift and TypeScript, about 640 files"}, "Contraseñas, códigos y tarjetas se escriben en hojas seguras que van directas a tu Mac. El chat solo sabe que se guardaron.": {"ca": "Contrasenyes, codis i targetes s’escriuen en fulls segurs que van directes al teu Mac. El xat només sap que s’han desat.", "en": "Passwords, codes and cards are typed into secure sheets that go straight to your Mac. The chat only learns that they were saved."}, "Hermes en tu Mac": {"ca": "Hermes al teu Mac", "en": "Hermes on your Mac"}, "Python, unos 150 archivos": {"ca": "Python, uns 150 fitxers", "en": "Python, about 150 files"}, "Hermes oficial, sin parches; lo que falta va en un plugin propio. Un registro de pagos impide cobrar dos veces en la misma tienda.": {"ca": "Hermes oficial, sense pedaços; el que falta va en un plugin propi. Un registre de pagaments impedeix cobrar dues vegades a la mateixa botiga.", "en": "Official Hermes, unpatched; what’s missing goes in my own plugin. A payment ledger prevents charging twice at the same shop."}, "Agentes y modelo": {"ca": "Agents i model", "en": "Agents and model"}, "Un modelo juez y evaluaciones": {"ca": "Un model jutge i avaluacions", "en": "A judge model and evals"}, "Un segundo modelo hace de juez: devuelve al agente al trabajo si se para, y solo acepta «hecho» con una prueba.": {"ca": "Un segon model fa de jutge: torna l’agent a la feina si s’atura, i només accepta «fet» amb una prova.", "en": "A second model acts as judge: it sends the agent back to work if it stops, and only accepts “done” with proof."}, "Secciones": {"ca": "Seccions", "en": "Sections"}, "Notas": {"ca": "Notes", "en": "Notes"}, "Alice: inicio del chat": {"ca": "Alice: inici del xat", "en": "Alice: chat home"}, "Alice: menú lateral": {"ca": "Alice: menú lateral", "en": "Alice: side menu"}, "Marc Freixanet, Barcelona": {"ca": "Marc Freixanet, Barcelona", "en": "Marc Freixanet, Barcelona"}, "Saltar al contenido": {"ca": "Salta al contingut", "en": "Skip to content"}, "Nunca pagar dos veces": {"ca": "Mai pagar dues vegades", "en": "Never pay twice"}, "Piezas pequeñas de varios proyectos que muestran cómo trabajo: pantallas y código real.": {"ca": "Peces petites de diversos projectes que mostren com treballo: pantalles i codi real.", "en": "Small pieces from several projects that show how I work: real screens and real code."}, "Marc Freixanet construye productos completos: apps de iPhone, webs, y los servidores y agentes que hay detrás.": {"ca": "Marc Freixanet construeix productes complets: apps d’iPhone, webs, i els servidors i agents que hi ha al darrere.", "en": "Marc Freixanet builds complete products: iPhone apps, websites, and the servers and agents behind them."}};
  var LANGS = ['ca', 'es', 'en'];
  var lang = 'es';
  function T(es) { return lang === 'es' || !I18N[es] ? es : I18N[es][lang]; }
  var norm = function (h) { return h.replace(/\s+/g, ' ').trim(); };
  var tEls = (function () {
    var sel = 'h1,h2,h3,h4,p,li,dt,dd,span.label,span.pill,.prow span,.stack span,.figures span,.crumbs a,a.cta,button.btn,a.btn,.pref-k,[data-theme-set],.play-label,.nt,a.skip';
    var all = Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (el) { return !el.closest('.screen-set, .inline-phone, .mail') && I18N[norm(el.innerHTML)]; });
    var set = new Set(all);
    return all.filter(function (el) { for (var p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false; return true; })
      .map(function (el) { return { el: el, key: norm(el.innerHTML) }; });
  })();
  var aEls = Array.prototype.slice.call(document.querySelectorAll('[data-aria-t]')).map(function (el) { return { el: el, key: el.getAttribute('aria-label') }; });
  var imgEls = Array.prototype.slice.call(document.querySelectorAll('img[alt]')).filter(function (i) { return I18N[i.alt]; }).map(function (el) { return { el: el, key: el.alt }; });
  function splitWords(el) { el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span>' + w + '</span>'; }).join(' '); }
  function applyLang(next, live) {
    lang = next;
    root.setAttribute('lang', lang);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) { if (!desc.dataset.es) desc.dataset.es = desc.content; desc.content = T(desc.dataset.es); }
    tEls.forEach(function (x) { x.el.innerHTML = T(x.key); if (x.el.hasAttribute('data-lit')) splitWords(x.el); });
    aEls.forEach(function (x) { x.el.setAttribute('aria-label', T(x.key)); });
    imgEls.forEach(function (x) { x.el.alt = T(x.key); });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    if (live) { var cur = chapterCurrent; chapterSet = ''; setChapter(home.hidden ? 'case' : 'home', cur); collect(); request(); }
  }
  var savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (e) {}
  var guess = (navigator.language || 'es').slice(0, 2).toLowerCase();
  var urlLang = null;
  try { urlLang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  applyLang(LANGS.indexOf(urlLang) !== -1 ? urlLang : LANGS.indexOf(savedLang) !== -1 ? savedLang : (LANGS.indexOf(guess) !== -1 ? guess : 'es'), false);

  // Words of the statement, one span each
  document.querySelectorAll('[data-lit]').forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span>' + w + '</span>'; }).join(' ');
  });

  var header = document.querySelector('header.top');
  var home = document.getElementById('home');
  var chapters = {
    home: [['trabajo', 'Trabajo'], ['detalles', 'Detalles'], ['sobre-mi', 'Sobre mí'], ['contacto', 'Contacto']],
    case: [['alice', 'Alice'], ['historia', 'La historia'], ['como', 'Cómo está hecha']]
  };
  var chapterName = document.getElementById('chapterName'), chapterDots = document.getElementById('chapterDots');
  var chapterSet = '', chapterCurrent = null, chapterTimer = 0;
  function buildDots(set) {
    chapterSet = set; chapterCurrent = null;
    chapterDots.innerHTML = chapters[set].map(function (c) { return '<a href="#' + c[0] + '" aria-label="' + T(c[1]) + '"></a>'; }).join('');
  }
  function setChapter(set, id) {
    if (set !== chapterSet) buildDots(set);
    if (id === chapterCurrent) return;
    chapterCurrent = id;
    var label = set === 'home' ? T('Inicio') : 'Alice';
    chapters[set].forEach(function (c) { if (c[0] === id) label = T(c[1]); });
    Array.prototype.forEach.call(chapterDots.children, function (a, i) { a.classList.toggle('on', chapters[set][i][0] === id); });
    clearTimeout(chapterTimer);
    if (chapterName.textContent !== label) {
      chapterName.classList.add('swap');
      chapterTimer = setTimeout(function () { chapterName.textContent = label; chapterName.classList.remove('swap'); }, 160);
    } else chapterName.classList.remove('swap');
  }
  var hero = document.querySelector('.intro h1');
  var reveals = [], expands = [], pars = [], words = [], curtain, device, track;
  function collect() {
    reveals = Array.prototype.slice.call(document.querySelectorAll('[data-r]'));
    expands = Array.prototype.slice.call(document.querySelectorAll('[data-expand]'));
    pars = Array.prototype.slice.call(document.querySelectorAll('.par'));
    pars.forEach(function (img) { img.style.setProperty('--speed', img.dataset.speed); });
    words = Array.prototype.slice.call(document.querySelectorAll('[data-lit]')).map(function (g) { return Array.prototype.slice.call(g.querySelectorAll('span')); });
    curtain = document.querySelector('[data-curtain]');
    device = document.getElementById('device');
    track = document.getElementById('track');
  }
  collect();

  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight, y = window.scrollY;
    header.classList.toggle('scrolled', y > 4);
    var set = home.hidden ? 'case' : 'home', current = '';
    chapters[set].forEach(function (c) { var t = document.getElementById(c[0]); if (t && t.offsetParent !== null && t.getBoundingClientRect().top <= vh * .45) current = c[0]; });
    if (set === 'home' && y + vh >= document.documentElement.scrollHeight - 2) current = 'contacto';
    if (set === 'case' && !current) current = 'alice';
    setChapter(set, current);
    if (reduce) return;

    // Hero eases back as you leave it
    if (hero && !document.getElementById('home').hidden) {
      var q = clamp(y / (vh * .7));
      hero.style.transform = 'scale(' + (1 - q * .06) + ')';
      hero.style.opacity = 1 - q * .7;
    }
    expands.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = ease(clamp((vh - r.top) / (vh * .75)));
      el.style.setProperty('--p', p.toFixed(3));
      pars.forEach(function (img) { if (el.contains(img)) img.style.setProperty('--p', p.toFixed(3)); });
    });
    words.forEach(function (group) {
      if (!group.length || !group[0].offsetParent) return;
      var box = group[0].parentNode.getBoundingClientRect();
      // Lighting starts when the text enters the lower part of the screen. Text already on screen when its view
      // opens starts from where it stands instead, so it opens fully unlit and still lights up as you scroll.
      var start = Math.min(vh * .85, box.top + y);
      var span = Math.max(vh * .25, Math.min(box.height + vh * .3, start - vh * .15));
      var prog = clamp((start - box.top) / span);
      var lit = prog * (group.length + 4);
      group.forEach(function (w, i) { w.style.setProperty('--w', (0.2 + 0.8 * clamp(lit - i)).toFixed(2)); });
    });
    if (curtain && curtain.offsetParent) {
      var ct = curtain.getBoundingClientRect().top;
      curtain.style.setProperty('--p', ease(clamp((vh - ct) / (vh * .6))).toFixed(3));
    }
    if (device && device.offsetParent) {
      var st = document.getElementById('story').getBoundingClientRect().top;
      device.style.setProperty('--p', ease(clamp((vh - st) / (vh * .7))).toFixed(3));
    }
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  // Reveals play once. Siblings that arrive together are staggered by 70 ms.
  (function () {
    if (reduce || !('IntersectionObserver' in window)) { reveals.forEach(function (el) { el.classList.add('in'); }); return; }
    // Anything already on screen is shown as is, with no animation (at load, and after a jump to a shared section)
    function showInView() {
      var vh = window.innerHeight, shown = [];
      reveals.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0 && el.offsetParent) shown.push(el);
      });
      if (!shown.length) return;
      root.classList.add('reveal-now');
      shown.forEach(function (el) { el.classList.add('in'); });
      void root.offsetHeight;
      setTimeout(function () { root.classList.remove('reveal-now'); }, 50);
    }
    window.__showInView = showInView;
    showInView();
    var batch = [], flushing = false;
    function flush() {
      batch.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      batch.forEach(function (el, i) { el.style.setProperty('--delay', Math.min(i, 5) * 70 + 'ms'); el.classList.add('in'); });
      batch = []; flushing = false;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || e.target.classList.contains('in')) return;
        io.unobserve(e.target); batch.push(e.target);
      });
      if (batch.length && !flushing) { flushing = true; setTimeout(flush, 16); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    reveals.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
    // Elements in a view that opens later (the case page) are observed when it is shown
    window.addEventListener('hashchange', function () {
      setTimeout(function () {
        var h = window.innerHeight;
        reveals.forEach(function (el) {
          if (el.classList.contains('in') || !el.offsetParent) return;
          var r = el.getBoundingClientRect();
          if (r.top < h && r.bottom > 0) el.classList.add('in');
        });
      }, 60);
    });
  })();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  frame();


  var dots = Array.prototype.slice.call(document.querySelectorAll('#dots i'));
  function show(i) {
    screens.forEach(function (s, j) { s.classList.toggle('on', j === i); });
    dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
    steps.forEach(function (s, j) { s.classList.toggle('on', j === i); });
  }
  show(0);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(Number(e.target.dataset.screen)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }

  // Two views in one page: the index and Alice's case.
  var caseView = document.getElementById('case');
  var caseIds = ['alice', 'como'];
  var homeY = 0, pendingFocus = null;
  function moveFocus() {                                  // keyboard focus follows the view, once it is on screen
    if (pendingFocus) { pendingFocus.focus({ preventScroll: true }); pendingFocus = null; }
  }
  function apply() {
    var h = location.hash.replace('#', '');
    var inCase = caseIds.indexOf(h) !== -1;
    var wasCase = !caseView.hidden;
    if (inCase && !wasCase) homeY = window.scrollY;
    home.hidden = inCase; caseView.hidden = !inCase; caseView.classList.toggle('open', inCase);
    document.title = inCase ? 'Alice — Marc Freixanet' : 'Marc Freixanet';
    if (inCase && !wasCase && h === 'alice') { window.scrollTo(0, 0); if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true }); }
    if (!inCase && wasCase && h) { var t = document.getElementById(h); if (t) { t.scrollIntoView({ behavior: 'instant' }); if (window.__lenis) window.__lenis.scrollTo(window.scrollY, { immediate: true }); } }
    if (!inCase && wasCase && !h) {                       // browser Back: the index at the point you left it
      window.scrollTo(0, homeY); if (window.__lenis) window.__lenis.scrollTo(homeY, { immediate: true });
      pendingFocus = document.querySelector('a.project.feature');
    }
    if (inCase && !wasCase) { pendingFocus = caseView.querySelector('h1'); if (pendingFocus) pendingFocus.setAttribute('tabindex', '-1'); }
    if (window.__lenis) window.__lenis.resize();
    frame();
  }
  function route(animate) {
    var h = location.hash.replace('#', '');
    var changing = (caseIds.indexOf(h) !== -1) === caseView.hidden;
    if (animate && changing && !reduce && document.startViewTransition && document.visibilityState === 'visible') {
      var vt = document.startViewTransition(apply);
      [vt.ready, vt.finished, vt.updateCallbackDone].forEach(function (pr) { if (pr) pr.catch(function () {}); });
      vt.finished.then(moveFocus, moveFocus);           // focus can only land once the new view is painted
    }
    else { apply(); moveFocus(); }
  }
  window.addEventListener('hashchange', function () { route(true); });
  // Section links on the index scroll to their section without writing it into the address,
  // so a reload always opens at the top. Only the Alice case keeps its own address (#alice).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function clearHash() { history.replaceState(null, '', location.pathname + location.search); }
  function goTo(el) {
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -56 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href').slice(1);
    if (caseIds.indexOf(id) !== -1) return;                 // opening the case: let the router handle it
    var el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (!caseView.hidden) {                                 // from the case back to the index
      location.hash = id;                                   // the router shows the index and scrolls there
      return;
    }
    if (id === 'top') { if (window.__lenis) window.__lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); clearHash(); }
    else { goTo(el); history.replaceState(null, '', '#' + id); }   // shareable, without stacking history entries
  });
  // A shared link (#detalles, #contacto…) opens at its section; a reload always opens at the top.
  var startHash = location.hash.replace('#', '');
  var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var isReload = navEntry ? navEntry.type === 'reload' : false;
  var homeTarget = startHash && caseIds.indexOf(startHash) === -1 ? document.getElementById(startHash) : null;
  if (homeTarget && isReload) { clearHash(); homeTarget = null; }
  function toTop() {
    if (homeTarget) { homeTarget.scrollIntoView({ behavior: 'instant' }); if (window.__lenis) window.__lenis.scrollTo(homeTarget, { offset: -56, immediate: true }); if (window.__showInView) window.__showInView(); return; }
    window.scrollTo({ top: 0, behavior: 'instant' }); if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  }
  toTop();
  var touched = false;                                    // never pull someone back who has already started scrolling
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { window.addEventListener(t, function () { touched = true; }, { once: true, passive: true }); });
  window.addEventListener('load', function () { if (!touched) toTop(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) toTop(); });
  route(false);


  // ——— The signal ———
  // A sum of slow waves at rest. Moving the pointer or scrolling adds energy,
  // which brings in faster, finer waves; with no input it settles back to calm.
  (function () {
    var cv = document.getElementById('signal');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = 1, color = '#000';
    var energy = 0, drive = 0, phase = 0, last = 0, running = false, visible = true;
    var px = -1, near = 0, nearDrive = 0, lastMove = { x: 0, y: 0, t: 0 };
    function readColor() { color = getComputedStyle(document.body).color; }
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect(); w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    var TAU = Math.PI * 2;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var mid = h / 2, amp = 5 + energy * 16;
      var s = phase;
      ctx.beginPath();
      for (var x = 0; x <= w; x += 2) {
        var u = x / w;
        var env = Math.pow(Math.sin(Math.PI * u), .7);
        var calm = Math.sin(TAU * 1.4 * u + s * .55) * .62 + Math.sin(TAU * 2.6 * u - s * .8) * .38;
        var busy = Math.sin(TAU * 9 * u + s * 3.1) * .55 + Math.sin(TAU * 17 * u - s * 4.7) * .3 + Math.sin(TAU * 31 * u + s * 7.3) * .15;
        var y = calm * (1 - energy * .35) + busy * energy;
        var bump = 0;
        if (px >= 0) { var d = (x - px) / 90; bump = Math.exp(-d * d) * near * 14; }
        ctx.lineTo(x, mid + (y * amp - bump) * env);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.globalAlpha = .55 + energy * .35;
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    function tick(t) {
      if (!running) return;
      var dt = Math.min(.05, (t - (last || t)) / 1000); last = t;
      drive *= Math.pow(.25, dt);           // input fades in about a second
      nearDrive *= Math.pow(.2, dt);
      energy += (Math.min(drive, 1) - energy) * (1 - Math.pow(.02, dt));   // critically damped follow
      near += (Math.min(nearDrive, 1) - near) * (1 - Math.pow(.01, dt));
      phase += dt * (1 + energy * 2.4);
      draw();
      requestAnimationFrame(tick);
    }
    function start() { if (running || reduce || !visible || document.hidden) return; running = true; last = 0; requestAnimationFrame(tick); }
    function stop() { running = false; }

    readColor(); size(); draw();
    if (reduce) { new MutationObserver(function () { readColor(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); return; }
    window.addEventListener('resize', function () { size(); draw(); });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { readColor(); draw(); });
    // the theme can also be switched from the footer
    new MutationObserver(function () { readColor(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pointermove', function (e) {
      var now = performance.now(), dtm = Math.max(16, now - lastMove.t);
      var v = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y) / dtm;   // px per ms
      lastMove = { x: e.clientX, y: e.clientY, t: now };
      drive = Math.min(1.2, drive + v * .05);
      var r = cv.getBoundingClientRect();
      if (e.clientY > r.top - 80 && e.clientY < r.bottom + 80) { px = e.clientX - r.left; nearDrive = Math.min(1, nearDrive + .2); }
    }, { passive: true });
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var dy = Math.abs(window.scrollY - lastY); lastY = window.scrollY;
      drive = Math.min(1.2, drive + dy * .004);
    }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); else stop(); }).observe(cv);
    }
    start();
  })();


  // ——— Two speeds ———
  // Each [data-lag] element trails the page by a fraction of its distance from the
  // centre of the screen, eased so it glides rather than jumps.
  (function () {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-lag]'));
    if (reduce || !els.length) return;
    var items = els.map(function (el) { return { el: el, k: Number(el.dataset.lag), cur: 0, tgt: 0 }; });
    var raf = 0;
    function measure() {
      var vh = window.innerHeight, small = window.matchMedia('(width < 54rem)').matches;
      items.forEach(function (it) {
        if (!it.el.offsetParent) { it.tgt = 0; return; }
        var r = it.el.getBoundingClientRect();
        var d = (r.top - it.cur) + r.height / 2 - vh / 2;      // distance from centre, without our own offset
        it.tgt = -d * it.k * (small ? .4 : 1);
      });
    }
    function step() {
      var moving = false;
      items.forEach(function (it) {
        it.cur += (it.tgt - it.cur) * .14;
        if (Math.abs(it.tgt - it.cur) > .1) moving = true; else it.cur = it.tgt;
        it.el.style.transform = 'translate3d(0,' + it.cur.toFixed(2) + 'px,0)';
      });
      raf = moving ? requestAnimationFrame(step) : 0;
    }
    function kick() { measure(); if (!raf) raf = requestAnimationFrame(step); }
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    window.addEventListener('hashchange', function () { setTimeout(kick, 60); });
    kick();
  })();


  // ——— Smooth scroll on desktop ———
  var lenis = null;
  if (!reduce && window.Lenis && window.matchMedia('(pointer: fine)').matches) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    (function loop(t) { lenis.raf(t); requestAnimationFrame(loop); })(performance.now());
    window.__lenis = lenis;
  }

  // ——— Figures count up once, when they come into view ———
  if (!reduce && 'IntersectionObserver' in window) {
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, to = Number(el.dataset.count), t0 = performance.now(), dur = 1400;
        (function tick(now) {
          var k = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - k, 4);
          el.textContent = Math.round(to * eased);
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: .6 });
    counters.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && el.offsetParent) return;   // already visible: leave the real number
      el.textContent = '0';
      co.observe(el);
    });
  }


  // ——— Preference buttons ———
  // Applied at once: a page-wide crossfade had to capture the whole page first and held the next paint
  // back by 300–700 ms, well over the 200 ms that keeps an interaction feeling immediate (INP).
  function swap(fn) { fn(); }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === lang) return;
      swap(function () { applyLang(b.dataset.lang, true); });
      try { localStorage.setItem('lang', b.dataset.lang); } catch (e) {}
    });
  });
  var themeBtns = Array.prototype.slice.call(document.querySelectorAll('[data-theme-set]'));
  // No choice saved means the page follows the system; the option shown as active is the one in effect.
  var sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  var themeChoice = 'auto';
  function effective() { return themeChoice === 'auto' ? (sysDark.matches ? 'dark' : 'light') : themeChoice; }
  function applyTheme(t) {
    themeChoice = t;
    if (t === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
    themeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.themeSet === effective())); });
  }
  sysDark.addEventListener('change', function () { if (themeChoice === 'auto') applyTheme('auto'); });
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(['light', 'dark'].indexOf(savedTheme) !== -1 ? savedTheme : 'auto');
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.themeSet;
      if (t === effective()) return;
      // Choosing what the system already shows goes back to following the system
      var next = t === (sysDark.matches ? 'dark' : 'light') ? 'auto' : t;
      swap(function () { applyTheme(next); });
      try { if (next === 'auto') localStorage.removeItem('theme'); else localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  var btn = document.getElementById('copy'), mail = document.getElementById('mail');
  btn.addEventListener('click', function () {
    var select = function () { window.getSelection().selectAllChildren(mail); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mail.textContent).then(function () {
        btn.textContent = T('Copiado');
        setTimeout(function () { btn.textContent = T('Copiar'); }, 1600);
      }, select);
    } else { select(); }
  });
})();
