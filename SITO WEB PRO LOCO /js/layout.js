/**
 * Pro Loco Cavaglio d'Agogna APS - Layout Centralizzato
 * Genera automaticamente Header, Live News, Footer, Modali comuni (Privacy GDPR, Trasparenza, Share, Toast)
 * e gestisce la navigazione attiva su tutte le pagine.
 */

(function () {
  'use strict';

  // Configurazione globale
  window.CONFIG_PRO_LOCO = window.CONFIG_PRO_LOCO || {
    nomeAssociazione: "Pro Loco Cavaglio d'Agogna APS",
    sede: "Via Cavaglietto, 28010 Cavaglio d'Agogna (NO)",
    cf: "91004540034",
    piva: "01501400038",
    email: "proloco.cavaglio@gmail.com",
    instagram: "https://www.instagram.com/proloco_cavaglio/",
    dominio: "https://www.prolococavaglio.it",
    meteoLat: 45.6139,
    meteoLon: 8.4872
  };

  // Pagine del sito
  const PAGINE = [
    { id: 'home', file: 'index.html', label: 'Home' },
    { id: 'eventi', file: 'eventi.html', label: 'Eventi' },
    { id: 'menu', file: 'menu.html', label: 'Menù' },
    { id: 'rubriche', file: 'rubriche.html', label: 'Rubriche' },
    { id: 'foto', file: 'foto.html', label: 'Foto & Video' },
    { id: 'utile', file: 'cavaglio-utile.html', label: 'Cavaglio Utile' },
    { id: 'soci', file: 'soci.html', label: 'Area Soci' },
    { id: 'chisiamo', file: 'chi-siamo.html', label: 'Chi Siamo & Contatti' }
  ];

  // Rileva la pagina corrente
  function getCurrentPageId() {
    const bodyPage = document.body.dataset.page;
    if (bodyPage) return bodyPage;

    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    for (const p of PAGINE) {
      if (filename === p.file || (filename === '' && p.file === 'index.html')) {
        return p.id;
      }
    }
    if (filename.includes('eventi')) return 'eventi';
    if (filename.includes('menu')) return 'menu';
    if (filename.includes('rubriche')) return 'rubriche';
    if (filename.includes('foto')) return 'foto';
    if (filename.includes('utile')) return 'utile';
    if (filename.includes('soci')) return 'soci';
    if (filename.includes('chi-siamo') || filename.includes('chisiamo')) return 'chisiamo';
    return 'home';
  }

  // Genera Barra Live News
  function renderLiveBar() {
    const target = document.getElementById('site-live-bar');
    if (!target) return;

    target.className = "w-full bg-ink text-white text-xs sm:text-sm py-2 px-3 sm:px-6 relative z-50 border-b border-white/10";
    target.innerHTML = `
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 shrink-0">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-coral text-white">
            <span class="w-2 h-2 rounded-full bg-sun animate-pulse"></span>
            Live News
          </span>
        </div>
        <div class="marquee-wrapper flex-1 min-w-0">
          <div class="marquee-track tabular-nums text-xs sm:text-sm font-medium text-white/95">
            <span>📢 <strong>Assemblea Soci:</strong> Martedì 15 Dicembre – 1ª convocazione ore <strong>19:45</strong> | 2ª convocazione ore <strong>21:00</strong></span>
            <span class="text-sun">•</span>
            <span>🚌 <strong>Gita a Carrù (29 Nov):</strong> Posti esauriti (<strong>SOLD OUT</strong>) – Ritrovo ore 7:45 in Piazza del Peso</span>
            <span class="text-sun">•</span>
            <span>🍷 <strong>Nuova Rubrica Mensile:</strong> Scopri la ricetta della Paniscia Novarese e il vino consigliato dalla Sommelier!</span>
            <span class="text-sun">•</span>
            <span>📸 <strong>Foto del Mese:</strong> Invia il tuo scatto di Cavaglio via email a <strong>proloco.cavaglio@gmail.com</strong></span>
            <span class="text-sun">•</span>
            <!-- Duplicato per ciclo continuo senza scatti -->
            <span class="marquee-duplicate">📢 <strong>Assemblea Soci:</strong> Martedì 15 Dicembre – 1ª convocazione ore <strong>19:45</strong> | 2ª convocazione ore <strong>21:00</strong></span>
            <span class="marquee-duplicate text-sun">•</span>
            <span class="marquee-duplicate">🚌 <strong>Gita a Carrù (29 Nov):</strong> Posti esauriti (<strong>SOLD OUT</strong>) – Ritrovo ore 7:45 in Piazza del Peso</span>
            <span class="marquee-duplicate text-sun">•</span>
            <span class="marquee-duplicate">🍷 <strong>Nuova Rubrica Mensile:</strong> Scopri la ricetta della Paniscia Novarese e il vino consigliato dalla Sommelier!</span>
            <span class="marquee-duplicate text-sun">•</span>
            <span class="marquee-duplicate">📸 <strong>Foto del Mese:</strong> Invia il tuo scatto di Cavaglio via email a <strong>proloco.cavaglio@gmail.com</strong></span>
            <span class="marquee-duplicate text-sun">•</span>
          </div>
        </div>
        <div class="shrink-0 hidden sm:flex items-center gap-3">
          <a href="cavaglio-utile.html" class="btn-press text-xs font-extrabold text-sun hover:underline">
            Cavaglio Utile →
          </a>
        </div>
      </div>
    `;
  }

  // Genera Header e Menu di Navigazione
  function renderHeader(currentId) {
    const target = document.getElementById('site-header');
    if (!target) return;

    target.className = "w-full sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-ink/10";

    const navLinksHtml = PAGINE.map(p => {
      const isActive = p.id === currentId;
      const activeClass = isActive ? "tab-active bg-ink text-white" : "text-ink hover:bg-paper";
      return `<a href="${p.file}" class="btn-press px-3 py-2 rounded-full transition ${activeClass}">${p.label}</a>`;
    }).join('');

    const mobileLinksHtml = PAGINE.map(p => {
      const isActive = p.id === currentId;
      const activeClass = isActive ? "bg-ink text-white font-black" : "text-ink hover:bg-sun/40";
      return `<a href="${p.file}" class="block w-full text-left px-4 py-2.5 rounded-2xl font-extrabold text-sm uppercase transition ${activeClass}">${p.label}</a>`;
    }).join('');

    target.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2">
        <!-- Logo Ufficiale Pro Loco Cavaglio d'Agogna APS -->
        <a href="index.html" class="btn-press flex items-center text-left group focus:outline-none shrink-0" aria-label="Home Pro Loco Cavaglio d'Agogna">
          <div class="w-28 sm:w-36 transition-transform duration-200 group-hover:scale-[1.02]">
            <svg viewBox="0 0 360 135" class="w-full h-auto" aria-hidden="true">
              <path d="M 8 78 Q 48 34 72 22 Q 82 18 85 32 L 94 74 Q 76 42 52 46 Q 28 50 8 78 Z" fill="#18191C"/>
              <path d="M 88 22 Q 96 64 102 74 Q 108 78 118 68 Q 145 40 172 18 Q 140 36 112 46 Q 98 48 88 22 Z" fill="#6EB34E"/>
              <path d="M 116 74 Q 152 34 182 14 Q 192 8 206 18 Q 275 68 352 122 Q 268 72 204 44 Q 168 30 116 74 Z" fill="#18191C"/>
              <text x="48" y="96" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="33" fill="#18191C" letter-spacing="-0.5">Pro Loco</text>
              <line x1="50" y1="108" x2="108" y2="108" stroke="#18191C" stroke-width="1.8"/>
              <text x="116" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12.5" fill="#18191C" letter-spacing="0.4">CAVAGLIO D'AGOGNA</text>
              <text x="116" y="127" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="12.5" fill="#18191C" letter-spacing="0.4">APS</text>
            </svg>
          </div>
        </a>

        <!-- Menu Desktop a Pillole -->
        <nav class="hidden xl:flex items-center gap-0.5 bg-white p-1.5 rounded-full border border-ink/10 shadow-sm text-[11px] font-extrabold uppercase tracking-wide">
          ${navLinksHtml}
        </nav>

        <!-- Pulsante Contatti Rapido & Hamburger Mobile (NO WHATSAPP) -->
        <div class="flex items-center gap-2 shrink-0">
          <a href="chi-siamo.html#contatti" class="btn-press hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-ink hover:text-white text-ink border border-ink/15 font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-sm transition">
            <svg class="w-3.5 h-3.5 text-cobalt" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Contatta
          </a>
          <button id="mobile-menu-btn" onclick="window.toggleMobileMenu()" class="btn-press xl:hidden p-2.5 rounded-full bg-white border border-ink/15 text-ink hover:bg-sun transition" aria-label="Apri menu di navigazione">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Menu Mobile Dropdown -->
      <div id="mobile-menu" class="hidden xl:hidden bg-white border-b border-ink/10 px-4 pt-3 pb-5 space-y-1.5 shadow-xl max-h-[82vh] overflow-y-auto">
        ${mobileLinksHtml}
        <div class="pt-3 border-t border-ink/10">
          <a href="mailto:proloco.cavaglio@gmail.com" class="block text-center w-full bg-cobalt hover:bg-cobalt-dark text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-full transition shadow">
            Scrivi a proloco.cavaglio@gmail.com
          </a>
        </div>
      </div>
    `;
  }

  // Genera Footer Istituzionale Completo
  function renderFooter() {
    const target = document.getElementById('site-footer');
    if (!target) return;

    target.className = "w-full bg-ink text-white pt-14 pb-10 px-4 sm:px-6 border-t border-white/10";
    target.innerHTML = `
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
        <!-- Colonna 1: Info Istituzionali APS -->
        <div class="md:col-span-5 space-y-3.5">
          <div class="inline-block bg-white px-4 py-2 rounded-2xl">
            <span class="font-extrabold text-ink text-base tracking-tight">Pro Loco Cavaglio d'Agogna APS</span>
          </div>
          <p class="text-xs sm:text-sm text-white/75 leading-relaxed max-w-md">
            Associazione di Promozione Sociale (APS) impegnata nella valorizzazione del territorio, della cultura, delle tradizioni contadine ed enogastronomiche di Cavaglio d'Agogna (NO).
          </p>
          <div class="text-xs text-white/80 space-y-1 tabular-nums">
            <p class="text-sun font-bold">📍 Sede Operativa & Legale: Via Cavaglietto, 28010 Cavaglio d'Agogna (NO)</p>
            <p>Codice Fiscale: <strong class="text-white select-all">91004540034</strong> • Partita IVA: <strong class="text-white select-all">01501400038</strong></p>
          </div>
        </div>

        <!-- Colonna 2: Navigazione Rapida -->
        <div class="md:col-span-3 space-y-2 text-xs sm:text-sm">
          <h4 class="font-extrabold uppercase tracking-wider text-sun">Navigazione</h4>
          <ul class="space-y-1.5 text-white/80">
            <li><a href="index.html" class="hover:text-white transition">Home Page</a></li>
            <li><a href="eventi.html" class="hover:text-white transition tabular-nums">Eventi & Storico 2025–2026</a></li>
            <li><a href="menu.html" class="hover:text-white transition">Menù Oktoberfest 2026</a></li>
            <li><a href="rubriche.html" class="hover:text-white transition">Le Rubriche di Cavaglio</a></li>
            <li><a href="foto.html" class="hover:text-white transition">Archivio Foto & Video</a></li>
            <li><a href="cavaglio-utile.html" class="hover:text-white transition">Cavaglio Utile</a></li>
            <li><a href="soci.html" class="hover:text-white transition">Area Soci, Tesseramento & 5×1000</a></li>
            <li><a href="chi-siamo.html" class="hover:text-white transition">Chi Siamo, Sedi & Contatti</a></li>
          </ul>
        </div>

        <!-- Colonna 3: Contatti, Social & Trasparenza (NO WHATSAPP) -->
        <div class="md:col-span-4 space-y-3.5">
          <h4 class="font-extrabold uppercase tracking-wider text-sun text-xs sm:text-sm">Contatti & Trasparenza</h4>
          <p class="text-xs text-white/80">
            Email Ufficiale: <a href="mailto:proloco.cavaglio@gmail.com" class="underline hover:text-sun font-bold text-white">proloco.cavaglio@gmail.com</a>
          </p>
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <a href="https://www.instagram.com/proloco_cavaglio/" target="_blank" rel="noopener" class="btn-press inline-flex items-center gap-1.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-full shadow transition">
              Instagram @proloco_cavaglio ↗
            </a>
            <a href="chi-siamo.html#contatti" class="btn-press inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-full transition">
              Modulo Contatti →
            </a>
          </div>
          <div class="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <button onclick="window.openPrivacyModal()" class="text-sun underline hover:text-white font-bold transition">
              Informativa Privacy (GDPR)
            </button>
            <button onclick="window.openTransparencyDoc('statuto')" class="text-white/80 underline hover:text-sun transition">
              Trasparenza APS (D.Lgs. 117/2017)
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-2 tabular-nums">
        <span>© 2026 Pro Loco Cavaglio d'Agogna APS • CF 91004540034 • P.IVA 01501400038</span>
        <div class="flex items-center gap-3">
          <button onclick="window.openPrivacyModal()" class="underline hover:text-white transition">Privacy & Cookie Policy</button>
          <span>•</span>
          <span>Sito statico ospitato su GitHub Pages</span>
        </div>
      </div>
    `;
  }

  // Modali Comuni (Privacy, Trasparenza, Condivisione, Toast)
  function injectCommonModals() {
    if (document.getElementById('common-modals-container')) return;

    const div = document.createElement('div');
    div.id = 'common-modals-container';
    div.innerHTML = `
      <!-- MODAL PRIVACY & COOKIE POLICY (GDPR) -->
      <div id="privacy-modal" onclick="if(event.target===this) window.closeModal('privacy-modal')" class="fixed inset-0 z-50 hidden bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-ink/10 max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between border-b border-ink/10 pb-4 mb-5 gap-4">
            <div>
              <span class="inline-block bg-cobalt text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
                Regolamento UE 2016/679 (GDPR)
              </span>
              <h3 class="font-display text-3xl uppercase text-ink leading-none">INFORMATIVA PRIVACY & COOKIE</h3>
            </div>
            <button onclick="window.closeModal('privacy-modal')" class="btn-press p-2 rounded-full bg-paper hover:bg-ink/10 text-ink shrink-0 transition" aria-label="Chiudi">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="space-y-4 text-xs sm:text-sm text-ink/85 leading-relaxed">
            <div class="bg-paper rounded-2xl p-4 border border-ink/10 tabular-nums">
              <h4 class="font-extrabold uppercase text-xs text-cobalt mb-1">1. Titolare del Trattamento</h4>
              <p>
                <strong>Pro Loco Cavaglio d'Agogna APS</strong><br>
                Sede Legale & Operativa: Via Cavaglietto – 28010 Cavaglio d'Agogna (NO)<br>
                Codice Fiscale: <strong>91004540034</strong> • Partita IVA: <strong>01501400038</strong><br>
                Email di contatto: <a href="mailto:proloco.cavaglio@gmail.com" class="underline font-bold text-cobalt">proloco.cavaglio@gmail.com</a>
              </p>
            </div>
            <div>
              <h4 class="font-extrabold uppercase text-xs text-ink mb-1">2. Tipologia di Dati Trattati e Finalità</h4>
              <ul class="space-y-1.5 list-disc pl-5">
                <li><strong>Richieste Tesseramento e Contatti:</strong> i dati conferiti volontariamente (nome, recapito email, comune) vengono impiegati unicamente per rispondere alle richieste dell'interessato o per il rilascio della tessera socio APS (art. 6, par. 1, lett. b GDPR).</li>
                <li><strong>Rubriche Partecipative ("La Foto del Mese"):</strong> fotografie inviate spontaneamente via email dai cittadini, pubblicate con citazione dell'autore e rimovibili in qualsiasi momento su semplice segnalazione scritta.</li>
                <li><strong>Menù e Codice Cassa:</strong> la composizione dell'ordine per l'Oktoberfest avviene in locale nel browser; nessun dato sensibile o bancario viene memorizzato o trasmesso a server terzi.</li>
                <li><strong>Archivio Fotografico Eventi:</strong> pubblicazione di immagini scattate nel corso di manifestazioni pubbliche a scopo documentale e di promozione del territorio (art. 97 L. 633/1941).</li>
              </ul>
            </div>
            <div class="bg-sun-light rounded-2xl p-4 border border-sun">
              <h4 class="font-extrabold uppercase text-xs text-ink mb-1">3. Cookie Policy & Diritti</h4>
              <p>
                Questo sito web <strong>non fa uso di cookie di profilazione o tracciamento pubblicitario</strong>. Sono impiegati unicamente cookie tecnici o risorse CDN strettamente necessarie al funzionamento visivo. L'utente può esercitare i diritti previsti dagli artt. 15-22 GDPR scrivendo a <strong>proloco.cavaglio@gmail.com</strong>.
              </p>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-ink/10 flex justify-end">
            <button onclick="window.closeModal('privacy-modal')" class="btn-press px-6 py-2.5 rounded-full bg-ink hover:bg-cobalt text-white font-extrabold text-xs uppercase transition">
              Ho Compreso • Chiudi
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL TRASPARENZA APS (D.LGS. 117/2017) -->
      <div id="transparency-modal" onclick="if(event.target===this) window.closeModal('transparency-modal')" class="fixed inset-0 z-50 hidden bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-ink/10 max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between border-b border-ink/10 pb-3.5 mb-4 gap-3">
            <div>
              <span class="inline-block bg-hill text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
                Terzo Settore • D.Lgs. 117/2017
              </span>
              <h3 id="transp-title" class="font-display text-3xl uppercase text-ink leading-none">TRASPARENZA APS</h3>
            </div>
            <button onclick="window.closeModal('transparency-modal')" class="btn-press p-2 rounded-full bg-paper hover:bg-ink/10 text-ink shrink-0 transition" aria-label="Chiudi">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div id="transp-body" class="space-y-3 text-xs sm:text-sm text-ink/85 leading-relaxed"></div>
          <div class="mt-5 pt-4 border-t border-ink/10 flex flex-wrap items-center justify-between gap-2">
            <a href="mailto:proloco.cavaglio@gmail.com?subject=Richiesta%20Documenti%20Trasparenza%20APS" class="btn-press px-4 py-2.5 rounded-full bg-cobalt hover:bg-cobalt-dark text-white font-extrabold text-xs uppercase transition">
              Richiedi via Email
            </a>
            <button onclick="window.closeModal('transparency-modal')" class="btn-press px-5 py-2.5 rounded-full bg-paper font-extrabold text-xs uppercase text-ink">
              Chiudi
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL CONDIVISIONE LINK DIRETTO -->
      <div id="share-modal" onclick="if(event.target===this) window.closeModal('share-modal')" class="fixed inset-0 z-50 hidden bg-ink/75 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-ink/10">
          <div class="flex items-center justify-between border-b border-ink/10 pb-3 mb-4">
            <h3 class="font-display text-2xl uppercase text-ink">Condividi</h3>
            <button onclick="window.closeModal('share-modal')" class="btn-press p-1.5 rounded-full bg-paper hover:bg-ink/10 text-ink transition" aria-label="Chiudi">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <p class="text-xs text-ink/70 mb-3">Condividi con i tuoi contatti o sui social network:</p>
          <textarea id="share-preview-text" rows="4" readonly class="w-full p-3.5 rounded-2xl bg-paper border border-ink/15 text-xs text-ink/85 mb-4 focus:outline-none"></textarea>
          <div class="grid grid-cols-2 gap-2.5">
            <a id="share-wa-link" href="#" target="_blank" rel="noopener" class="btn-press bg-[#25D366] hover:bg-[#1EBE5D] text-ink font-extrabold text-xs uppercase py-3.5 px-4 rounded-full text-center transition flex items-center justify-center gap-1.5">
              WhatsApp
            </a>
            <button onclick="window.copyShareText()" class="btn-press bg-ink hover:bg-cobalt text-white font-extrabold text-xs uppercase py-3.5 px-4 rounded-full transition flex items-center justify-center gap-1.5">
              Copia Testo
            </button>
          </div>
        </div>
      </div>

      <!-- TOAST NOTIFICA FLUTTUANTE -->
      <div id="toast" class="fixed bottom-5 right-5 z-50 hidden max-w-sm bg-ink text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/15 flex items-start gap-3">
        <div class="w-6 h-6 rounded-full bg-sun text-ink flex items-center justify-center shrink-0 font-extrabold text-xs mt-0.5">✓</div>
        <div id="toast-message" class="text-xs sm:text-sm font-medium leading-snug"></div>
      </div>
    `;
    document.body.appendChild(div);
  }

  // Funzioni di utilità globale
  let toastTimer;
  window.showToast = function (msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  };

  window.copyTextSafe = function (text, successMsg) {
    const fallbackCopy = () => {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        if (successMsg) window.showToast(successMsg);
      } catch (e) {}
      document.body.removeChild(temp);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => { if (successMsg) window.showToast(successMsg); })
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  window.copyCF = function () {
    window.copyTextSafe('91004540034', 'Codice Fiscale 91004540034 copiato negli appunti!');
  };

  window.toggleMobileMenu = function () {
    const m = document.getElementById('mobile-menu');
    if (m) m.classList.toggle('hidden');
  };

  window.closeModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  };

  window.openPrivacyModal = function () {
    const el = document.getElementById('privacy-modal');
    if (el) el.classList.remove('hidden');
  };

  window.openTransparencyDoc = function (docKey) {
    const map = {
      statuto: {
        title: 'STATUTO PRO LOCO APS',
        body: `
          <p>Lo <strong>Statuto della Pro Loco Cavaglio d'Agogna APS</strong> è redatto in conformità al <strong>Codice del Terzo Settore (D.Lgs. 3 luglio 2017, n. 117)</strong> e disciplina i principi associativi, la vita democratica e le finalità sociali dell'ente.</p>
          <p class="bg-paper p-3.5 rounded-2xl border border-ink/10">I soci e i cittadini possono richiederne copia in formato PDF scrivendo all'indirizzo email <strong>proloco.cavaglio@gmail.com</strong>.</p>
        `
      },
      rendiconto: {
        title: 'RENDICONTI & 5×1000',
        body: `
          <p>Ai sensi dell'<strong>art. 14 del D.Lgs. 117/2017</strong>, il Consiglio Direttivo redige e sottopone all'Assemblea dei Soci il rendiconto per cassa e la relazione sulle attività associative annuali.</p>
          <p class="bg-paper p-3.5 rounded-2xl border border-ink/10">Il bilancio approvato è consultabile dai soci e richiedibile via email a <strong>proloco.cavaglio@gmail.com</strong>.</p>
        `
      },
      contributi: {
        title: 'CONTRIBUTI PUBBLICI (L. 124/2017)',
        body: `
          <p>In adempimento agli obblighi di trasparenza previsti dalla <strong>Legge 124/2017</strong> (commi 125-129), la Pro Loco rende pubblici gli eventuali contributi erogati da pubbliche amministrazioni d'importo superiore a 10.000,00 €.</p>
          <p class="bg-paper p-3.5 rounded-2xl border border-ink/10">Per chiarimenti e attestazioni amministrative contattare <strong>proloco.cavaglio@gmail.com</strong>.</p>
        `
      }
    };

    const doc = map[docKey] || map.statuto;
    const titleEl = document.getElementById('transp-title');
    const bodyEl = document.getElementById('transp-body');
    if (titleEl && bodyEl) {
      titleEl.textContent = doc.title;
      bodyEl.innerHTML = doc.body;
      const m = document.getElementById('transparency-modal');
      if (m) m.classList.remove('hidden');
    }
  };

  window.sharePage = function (title, customUrl) {
    const url = customUrl || window.location.href;
    const shareText = `🎉 *${title}* – Pro Loco Cavaglio d'Agogna APS\nScopri tutti i dettagli sul sito ufficiale:\n${url}`;
    const textarea = document.getElementById('share-preview-text');
    const waLink = document.getElementById('share-wa-link');
    if (textarea && waLink) {
      textarea.value = shareText;
      waLink.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      const m = document.getElementById('share-modal');
      if (m) m.classList.remove('hidden');
    }
  };

  window.copyShareText = function () {
    const textarea = document.getElementById('share-preview-text');
    if (textarea) {
      window.copyTextSafe(textarea.value, 'Testo di invito copiato negli appunti!');
      window.closeModal('share-modal');
    }
  };

  // Chiusura dei modali con tasto ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      ['privacy-modal', 'transparency-modal', 'share-modal', 'pos-modal', 'detail-modal', 'lightbox-modal'].forEach(id => {
        window.closeModal(id);
      });
    }
  });

  // Inizializzazione al caricamento del DOM
  document.addEventListener('DOMContentLoaded', function () {
    const currentId = getCurrentPageId();
    renderLiveBar();
    renderHeader(currentId);
    renderFooter();
    injectCommonModals();
  });

})();
