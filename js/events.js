/**
 * Gestione Eventi e Locandine (2025–2026)
 * Pro Loco Cavaglio d'Agogna APS
 */

(function () {
  'use strict';

  // Verifica se un evento è già concluso rispetto alla data odierna
  function isEventConcluded(ev) {
    if (ev.status === 'past') return true;
    if (!ev.isoDate) return false;
    const evEnd = new Date(ev.isoDate);
    // Margine fino alla fine della giornata (ore 23:59:59)
    evEnd.setHours(23, 59, 59, 999);
    return evEnd.getTime() < Date.now();
  }

  // Restituisce l'evento con lo stato effettivo aggiornato in tempo reale
  function getEffectiveEvent(ev) {
    if (!ev) return ev;
    if (isEventConcluded(ev)) {
      return {
        ...ev,
        status: 'past',
        badge: (ev.badge && ev.badge.includes('Concluso')) ? ev.badge : `Concluso • ${ev.year}`,
        entry: 'Evento Concluso',
        dateTime: 'Concluso'
      };
    }
    return ev;
  }

  // Restituisce gli eventi futuri/in programma ordinati per data crescente (il più vicino per primo)
  function getUpcomingEvents() {
    if (typeof EVENTI_DATA === 'undefined') return [];
    return EVENTI_DATA
      .filter(e => !isEventConcluded(e))
      .sort((a, b) => new Date(a.isoDate || 0) - new Date(b.isoDate || 0));
  }

  // Restituisce i 3 eventi per la Home: prioritari quelli futuri imminenti
  function getHomeEvents() {
    const upcoming = getUpcomingEvents();
    if (upcoming.length >= 3) {
      return upcoming.slice(0, 3);
    }
    // Se ci sono meno di 3 eventi futuri, completa con gli eventi più recentemente conclusi
    const concluded = EVENTI_DATA
      .filter(e => isEventConcluded(e))
      .sort((a, b) => new Date(b.isoDate || 0) - new Date(a.isoDate || 0));
    return [...upcoming, ...concluded].slice(0, 3);
  }

  function createEventCard(evRaw, options = {}) {
    const ev = getEffectiveEvent(evRaw);
    const isSoldOut = ev.status === 'soldout';
    const isFree = ev.status === 'free';
    const isPast = ev.status === 'past';
    const isBookable = ev.status === 'bookable' || ev.status === 'prenotabile';
    const hasCover = Boolean(ev.coverImage);

    // Pulsante Principale
    let primaryBtn = '';
    if (isSoldOut) {
      primaryBtn = `
        <button disabled class="w-full bg-[#DC2626] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3 px-4 rounded-full shadow-sm cursor-not-allowed flex items-center justify-center gap-2">
          SOLD OUT – Posti Terminati
        </button>`;
    } else if (isFree) {
      primaryBtn = `
        <div class="w-full bg-hill-light text-hill-dark font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3 px-4 rounded-full border border-hill/30 text-center">
          Ingresso Libero • Nessuna Prenotazione
        </div>`;
    } else if (isBookable) {
      primaryBtn = `
        <a href="https://wa.me/393480816395?text=${encodeURIComponent('Buongiorno, vorrei informazioni / prenotare per l\'evento: ' + ev.title)}" target="_blank" rel="noopener" class="btn-press w-full bg-[#25D366] hover:bg-[#1EBE5D] text-ink font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3 px-4 rounded-full shadow-md flex items-center justify-center gap-2 transition">
          Prenota su WhatsApp
        </a>`;
    } else {
      primaryBtn = `
        <button disabled class="w-full bg-paper text-ink/40 font-extrabold text-xs sm:text-sm uppercase tracking-wider py-3 px-4 rounded-full border border-ink/10 cursor-not-allowed flex items-center justify-center gap-2">
          Evento Concluso
        </button>`;
    }

    // Azioni Secondarie
    let bottomActionsHtml = '';
    if (!isPast) {
      bottomActionsHtml = `
        <div class="grid ${ev.hasPoster ? 'grid-cols-2' : 'grid-cols-1'} gap-2">
          <button onclick="window.openEventDetail('${ev.id}')" class="btn-press bg-paper hover:bg-sun text-ink font-extrabold text-[11px] uppercase py-2.5 px-3 rounded-full transition text-center">
            Dettagli Evento
          </button>
          ${ev.hasPoster ? `
            <button onclick="window.downloadPoster('${ev.id}')" class="btn-press bg-hill-light hover:bg-hill hover:text-white text-hill-dark font-extrabold text-[11px] uppercase py-2.5 px-3 rounded-full transition inline-flex items-center justify-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Locandina
            </button>` : ''}
        </div>`;
    } else {
      const leftAction = hasCover
        ? `<button onclick="window.openEventDetail('${ev.id}')" class="btn-press bg-paper hover:bg-sun text-ink font-extrabold text-[11px] uppercase py-2.5 px-3 rounded-full transition text-center">
            Locandina
          </button>`
        : `<span class="bg-paper/80 text-ink/50 font-extrabold text-[11px] uppercase py-2.5 px-3 rounded-full text-center select-none tabular-nums">
            Archivio ${ev.year}
          </span>`;

      bottomActionsHtml = `
        <div class="grid ${ev.albumUrl ? 'grid-cols-2' : 'grid-cols-1'} gap-2">
          ${leftAction}
          ${ev.albumUrl ? `
            <a href="${ev.albumUrl}" target="_blank" rel="noopener" class="btn-press bg-sun hover:bg-sun-dark text-ink font-extrabold text-[11px] uppercase py-2.5 px-3 rounded-full transition inline-flex items-center justify-center gap-1">
              Foto Drive ↗
            </a>` : ''}
        </div>`;
    }

    const coverMediaHtml = hasCover ? `
      <img
        src="${ev.coverImage}=w900"
        alt="Locandina ${ev.title}"
        loading="lazy"
        decoding="async"
        onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${ev.coverImageFallback || ev.coverImage}';}else{this.style.display='none';}"
        class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35 pointer-events-none"></div>
    ` : '';

    return `
      <article class="ticket-scallop shadow-xl flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
        <div class="p-3 pb-0">
          <div ${hasCover ? `onclick="window.openEventDetail('${ev.id}')"` : ''} class="group ${hasCover ? 'h-48 cursor-pointer' : 'h-32'} rounded-2xl bg-gradient-to-br ${ev.gradient} p-4 flex flex-col justify-between text-white relative overflow-hidden">
            ${coverMediaHtml}
            <div class="flex items-center justify-between gap-2 relative z-10">
              <span class="sticker-badge -rotate-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider tabular-nums ${ev.stickerBg}">
                ${ev.stickerText}
              </span>
              <button type="button" onclick="event.stopPropagation(); window.shareEvent('${ev.id}')" class="btn-press p-2 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm text-white transition cursor-pointer" title="Condividi evento" aria-label="Condividi ${ev.title}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              </button>
            </div>
            <div class="relative z-10 flex items-center justify-between gap-2">
              <span class="text-[11px] font-extrabold uppercase tracking-widest text-white drop-shadow">${ev.badge}</span>
              ${hasCover ? `<span class="text-[10px] font-extrabold uppercase bg-white/95 text-ink px-2.5 py-0.5 rounded-full shadow">Vedi locandina ↗</span>` : ''}
            </div>
          </div>
        </div>

        <div class="p-5 sm:p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="font-display text-2xl uppercase text-ink tracking-wide leading-tight mb-4">
              ${ev.title}
            </h3>
            <div class="space-y-2 text-xs border-y border-dashed border-ink/20 py-3.5 tabular-nums">
              <div class="flex items-center justify-between gap-2">
                <span class="uppercase font-extrabold text-ink/45 tracking-wider">DATA</span>
                <span class="font-bold text-ink bg-cobalt-light text-cobalt px-2.5 py-0.5 rounded-full text-right">${ev.dateDay}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="uppercase font-extrabold text-ink/45 tracking-wider">ORARIO</span>
                <span class="font-bold text-ink text-right">${ev.dateTime}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="uppercase font-extrabold text-ink/45 tracking-wider">LUOGO</span>
                <span class="font-bold text-ink text-right">${ev.location}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="uppercase font-extrabold text-ink/45 tracking-wider">STATO</span>
                <span class="font-bold ${isSoldOut ? 'text-[#DC2626]' : isFree ? 'text-hill-dark' : 'text-ink/55'} text-right">${ev.entry}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 space-y-3">
            <div class="ticket-watermark text-center text-3xl uppercase leading-none py-1">
              PRO LOCO CAVAGLIO
            </div>
            ${primaryBtn}
            ${bottomActionsHtml}
          </div>
        </div>
      </article>
    `;
  }

  window.openEventDetail = function (eventId) {
    if (typeof EVENTI_DATA === 'undefined') return;
    const rawEv = EVENTI_DATA.find(e => e.id === eventId);
    if (!rawEv) return;
    const ev = getEffectiveEvent(rawEv);

    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    document.getElementById('det-badge').textContent = ev.badge;
    document.getElementById('det-title').textContent = ev.title;
    document.getElementById('det-meta').textContent = `${ev.dateDay} • ${ev.location}`;

    let bodyHtml = '';
    if (ev.coverImage) {
      bodyHtml += `
        <div class="rounded-2xl overflow-hidden border border-ink/10 bg-paper">
          <img
            src="${ev.coverImage}=w900"
            alt="Locandina ${ev.title}"
            onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${ev.coverImageFallback || ev.coverImage}';}else{this.parentElement.style.display='none';}"
            class="w-full max-h-[30rem] object-contain mx-auto bg-ink/5"
          />
        </div>`;
    }

    if (ev.summary) {
      bodyHtml += `<p class="leading-relaxed text-sm">${ev.summary}</p>`;
    }

    if (ev.program && ev.program.length > 0) {
      bodyHtml += `
        <div class="bg-paper rounded-2xl p-4 border border-ink/10">
          <h4 class="font-extrabold uppercase text-xs tracking-wider text-cobalt mb-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-cobalt"></span> Programma ufficiale
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm text-ink/85">
            ${ev.program.map(item => `<li>• ${item}</li>`).join('')}
          </ul>
        </div>`;
    }

    if (ev.menu && ev.menu.length > 0) {
      bodyHtml += `
        <div class="bg-sun-light rounded-2xl p-4 border border-sun">
          <h4 class="font-extrabold uppercase text-xs tracking-wider text-ink mb-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-coral"></span> Menù & Quote di partecipazione
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm text-ink/90">
            ${ev.menu.map(item => `<li class="flex items-start gap-1.5"><span class="text-coral font-extrabold">✓</span><span>${item}</span></li>`).join('')}
          </ul>
        </div>`;
    }

    // Contatti specifici della locandina
    if (ev.contacts) {
      bodyHtml += `
        <div class="bg-paper rounded-2xl p-3.5 border border-ink/10 text-xs">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-ink/60 block mb-1">Riferimenti prenotazione in locandina:</span>
          <div class="flex flex-wrap items-center gap-3">
            <a href="tel:+393480816395" class="font-bold text-cobalt underline flex items-center gap-1">
              📞 ${ev.contacts}
            </a>
            <a href="https://wa.me/393480816395?text=${encodeURIComponent('Buongiorno, contatto per l\'evento: ' + ev.title)}" target="_blank" rel="noopener" class="font-extrabold text-[#25D366] hover:underline flex items-center gap-1">
              💬 WhatsApp
            </a>
          </div>
        </div>`;
    }

    document.getElementById('det-body').innerHTML = bodyHtml;

    const extraActions = document.getElementById('det-extra-actions');
    if (extraActions) {
      extraActions.innerHTML = `
        ${ev.hasPoster ? `
          <button onclick="window.downloadPoster('${ev.id}')" class="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-hill-light hover:bg-hill hover:text-white text-hill-dark font-extrabold uppercase text-xs transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Scarica Locandina
          </button>` : ''}
        ${ev.posterViewUrl ? `
          <a href="${ev.posterViewUrl}" target="_blank" rel="noopener" class="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cobalt-light hover:bg-cobalt hover:text-white text-cobalt font-extrabold uppercase text-xs transition">
            Vedi su Drive ↗
          </a>` : ''}
        ${ev.albumUrl ? `
          <a href="${ev.albumUrl}" target="_blank" rel="noopener" class="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sun hover:bg-sun-dark text-ink font-extrabold uppercase text-xs transition">
            Foto Evento Drive ↗
          </a>` : ''}
        <button onclick="window.shareEvent('${ev.id}')" class="btn-press inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-paper hover:bg-sun text-ink font-extrabold uppercase text-xs transition">
          Condividi
        </button>
      `;
    }

    const bookBtn = document.getElementById('det-book-btn');
    if (bookBtn) {
      if (ev.status === 'soldout') {
        bookBtn.disabled = true;
        bookBtn.className = 'px-5 py-2.5 rounded-full bg-[#DC2626] text-white font-extrabold text-xs uppercase cursor-not-allowed';
        bookBtn.textContent = 'SOLD OUT – Posti Terminati';
        bookBtn.onclick = null;
      } else if (ev.status === 'free') {
        bookBtn.disabled = true;
        bookBtn.className = 'px-5 py-2.5 rounded-full bg-hill-light text-hill-dark font-extrabold text-xs uppercase cursor-default';
        bookBtn.textContent = 'Ingresso Libero';
        bookBtn.onclick = null;
      } else if (ev.status === 'bookable' || ev.status === 'prenotabile') {
        bookBtn.disabled = false;
        bookBtn.className = 'btn-press px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-ink font-extrabold text-xs uppercase shadow transition';
        bookBtn.textContent = 'Prenota su WhatsApp';
        bookBtn.onclick = function () {
          window.open(`https://wa.me/393480816395?text=${encodeURIComponent('Buongiorno, desidero prenotare per: ' + ev.title)}`, '_blank', 'noopener');
        };
      } else {
        bookBtn.disabled = true;
        bookBtn.className = 'px-5 py-2.5 rounded-full bg-paper text-ink/40 font-extrabold text-xs uppercase cursor-not-allowed';
        bookBtn.textContent = 'Evento Concluso';
        bookBtn.onclick = null;
      }
    }

    modal.classList.remove('hidden');
  };

  window.downloadPoster = function (eventId) {
    if (typeof EVENTI_DATA === 'undefined') return;
    const ev = EVENTI_DATA.find(e => e.id === eventId);
    if (!ev || !ev.hasPoster) return;
    if (ev.posterDriveUrl) {
      window.open(ev.posterDriveUrl, '_blank', 'noopener');
      if (window.showToast) {
        window.showToast(`Download avviato per la locandina: "${ev.title}"`);
      }
    }
  };

  window.shareEvent = function (eventId) {
    if (typeof EVENTI_DATA === 'undefined') return;
    const ev = EVENTI_DATA.find(e => e.id === eventId);
    if (!ev) return;
    const directUrl = `${window.location.origin}/eventi.html#${ev.id}`;
    if (window.sharePage) {
      window.sharePage(ev.title, directUrl);
    }
  };

  // Rendering dinamico evento in primo piano nella Hero (colonna destra Home)
  function renderHeroUpcomingEvent() {
    const heroCard = document.getElementById('hero-event-card');
    if (!heroCard || typeof EVENTI_DATA === 'undefined') return;

    const upcoming = getUpcomingEvents();
    let heroEv = upcoming[0];
    if (!heroEv) {
      const allSorted = [...EVENTI_DATA].sort((a, b) => new Date(b.isoDate || 0) - new Date(a.isoDate || 0));
      heroEv = allSorted[0];
    }
    if (!heroEv) return;

    const ev = getEffectiveEvent(heroEv);
    const isSoldOut = ev.status === 'soldout';
    const isFree = ev.status === 'free';
    const isBookable = ev.status === 'bookable' || ev.status === 'prenotabile';
    const isPast = ev.status === 'past';

    let primaryBtn = '';
    if (isSoldOut) {
      primaryBtn = `
        <button disabled class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#DC2626] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide px-5 py-3.5 rounded-full shadow-lg cursor-not-allowed opacity-95">
          SOLD OUT – Posti Terminati
        </button>`;
    } else if (isBookable) {
      primaryBtn = `
        <a href="https://wa.me/393480816395?text=${encodeURIComponent('Buongiorno, vorrei informazioni / prenotare per l\'evento: ' + ev.title)}" target="_blank" rel="noopener" class="btn-press flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-ink font-extrabold text-xs sm:text-sm uppercase tracking-wide px-6 py-3.5 rounded-full shadow-lg transition">
          Prenota su WhatsApp
        </a>`;
    } else if (isFree) {
      primaryBtn = `
        <div class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-hill text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide px-5 py-3.5 rounded-full shadow-md">
          Ingresso Libero
        </div>`;
    } else {
      primaryBtn = `
        <button disabled class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-paper text-ink/40 font-extrabold text-xs sm:text-sm uppercase tracking-wide px-5 py-3.5 rounded-full shadow-sm cursor-not-allowed">
          Evento Concluso
        </button>`;
    }

    let countdownElHtml = '';
    if (!isPast && heroEv.isoDate) {
      countdownElHtml = `
        <div class="bg-ink/65 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-sun tabular-nums">
          Partenza: <span id="hero-countdown">--g --h --m</span>
        </div>`;
    } else {
      countdownElHtml = `
        <div class="bg-ink/65 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white/80">
          Prossimi Eventi in Arrivo
        </div>`;
    }

    heroCard.innerHTML = `
      <div class="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <span class="${ev.stickerBg || 'bg-[#DC2626] text-white'} text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-wider shadow">
          ${ev.badge}
        </span>
        ${countdownElHtml}
      </div>

      <div class="relative z-10 my-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-7 space-y-3">
        <div class="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-sun tabular-nums">
          <span>${ev.dateDay}</span>
          <span>•</span>
          <span>${ev.dateTime}</span>
        </div>
        <h2 class="font-display text-3xl sm:text-5xl uppercase tracking-wide text-white leading-none">
          ${ev.title}
        </h2>
        <p class="text-sm text-white/90 leading-relaxed">
          ${ev.summary || 'Unisciti a noi per vivere insieme le feste e le iniziative di Cavaglio d\'Agogna!'}
        </p>
        <div class="flex flex-wrap gap-2 pt-1 tabular-nums">
          <span class="bg-white/15 px-3 py-1 rounded-full text-xs font-bold">${ev.location}</span>
          <span class="bg-white/15 px-3 py-1 rounded-full text-xs font-bold">${ev.entry}</span>
        </div>
      </div>

      <div class="relative z-10 flex flex-wrap items-center gap-2.5">
        ${primaryBtn}
        <button onclick="window.openEventDetail('${ev.id}')" class="btn-press inline-flex items-center justify-center bg-white hover:bg-sun text-ink font-extrabold text-xs sm:text-sm uppercase tracking-wide px-5 py-3.5 rounded-full transition">
          Programma & Menù
        </button>
        ${ev.hasPoster ? `
          <button onclick="window.downloadPoster('${ev.id}')" class="btn-press inline-flex items-center justify-center gap-1.5 bg-sun hover:bg-sun-dark text-ink font-extrabold text-xs uppercase tracking-wide px-4 py-3.5 rounded-full transition" title="Scarica Locandina Ufficiale">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Locandina
          </button>` : ''}
        <button onclick="window.shareEvent('${ev.id}')" class="btn-press p-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 transition" title="Condividi evento">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </button>
      </div>
    `;

    if (!isPast && heroEv.isoDate && window.initHeroCountdown) {
      window.initHeroCountdown(heroEv.isoDate);
    }
  }

  // Rendering dei 3 album fotografici più recenti nella Home page
  function renderHomePhotoAlbums() {
    const container = document.getElementById('home-photo-albums-grid');
    if (!container) return;

    let html = `
      <a href="menu.html" class="btn-press group text-left rounded-3xl p-6 bg-gradient-to-br from-[#1B4965] to-cobalt text-white flex flex-col justify-between min-h-[190px] shadow-md hover:-translate-y-1 transition">
        <span class="sticker-badge -rotate-2 self-start bg-sun text-ink text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
          Listino Ufficiale
        </span>
        <div>
          <h3 class="font-display text-2xl uppercase">Menù & Cucina</h3>
          <p class="text-xs text-white/90 mt-1">Cucina, birre alla spina e listino piatti →</p>
        </div>
      </a>
    `;

    const sortedAlbums = (typeof window.getSortedAlbums === 'function')
      ? window.getSortedAlbums()
      : (typeof FOTO_DATABASE !== 'undefined' ? Object.keys(FOTO_DATABASE).map(k => FOTO_DATABASE[k]) : []);

    const top3 = sortedAlbums.slice(0, 3);
    top3.forEach((album, idx) => {
      const rotClass = idx % 2 === 0 ? 'rotate-2' : '-rotate-2';
      const count = album.totale || (album.foto ? album.foto.length : 0);
      html += `
        <a href="foto.html?album=${album.id}" class="btn-press group text-left rounded-3xl p-6 bg-gradient-to-br ${album.gradient || 'from-[#6B2A14] to-coral'} text-white flex flex-col justify-between min-h-[190px] shadow-md hover:-translate-y-1 transition">
          <span class="sticker-badge ${rotClass} self-start bg-sun text-ink text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
            ${count} Fotografie
          </span>
          <div>
            <h3 class="font-display text-2xl uppercase tabular-nums">${album.titolo}</h3>
            <p class="text-xs text-white/90 mt-1">Guarda le foto →</p>
          </div>
        </a>
      `;
    });

    container.innerHTML = html;
  }

  window.filterEvents = function (filterKey) {
    if (typeof EVENTI_DATA === 'undefined') return;

    document.querySelectorAll('.filter-btn').forEach(btn => {
      if (btn.dataset.filter === filterKey) {
        btn.classList.remove('bg-white', 'text-ink', 'border', 'border-ink/15');
        btn.classList.add('bg-ink', 'text-white');
      } else {
        btn.classList.add('bg-white', 'text-ink', 'border', 'border-ink/15');
        btn.classList.remove('bg-ink', 'text-white');
      }
    });

    let filtered = EVENTI_DATA;
    if (filterKey === 'upcoming') {
      filtered = EVENTI_DATA.filter(e => !isEventConcluded(e));
    } else if (filterKey === '2026') {
      filtered = EVENTI_DATA.filter(e => e.year === '2026');
    } else if (filterKey === '2025') {
      filtered = EVENTI_DATA.filter(e => e.year === '2025');
    }

    const allGrid = document.getElementById('all-events-grid');
    if (allGrid) {
      allGrid.innerHTML = filtered.map(ev => createEventCard(ev)).join('');
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof EVENTI_DATA === 'undefined') return;

    // Sezione Home: Evento in Primo Piano (Hero dinamica)
    renderHeroUpcomingEvent();

    // Sezione Home: Primi 3 eventi più recenti/imminenti dalla data odierna
    const homeGrid = document.getElementById('home-events-grid');
    if (homeGrid) {
      homeGrid.innerHTML = getHomeEvents().map(ev => createEventCard(ev)).join('');
    }

    // Sezione Home: I 3 album fotografici più recenti
    renderHomePhotoAlbums();

    // Sezione Completa: Calendario Eventi
    const allGrid = document.getElementById('all-events-grid');
    if (allGrid) {
      window.filterEvents('tutti');
    }

    // Apertura da hash dell'URL
    const hash = window.location.hash.replace('#', '');
    if (hash && EVENTI_DATA.some(e => e.id === hash)) {
      setTimeout(() => window.openEventDetail(hash), 150);
    }
  });
})();
