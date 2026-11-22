/**
 * Archivio Fotografico
 * Pro Loco Cavaglio d'Agogna APS
 */

(function () {
  'use strict';

  let currentAlbumKey = 'castagnata-2026';
  let currentSubFilter = 'tutte';
  let activePhotoList = [];
  let displayedCount = 0;
  const CHUNK_SIZE = 30;

  let currentLightboxIndex = 0;

  // Scorrimento laterale carosello album
  window.scrollAlbumCarousel = function (direction) {
    const carousel = document.getElementById('album-carousel');
    if (!carousel) return;
    const scrollAmount = Math.max(300, carousel.clientWidth * 0.75) * direction;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Rendering dinamico delle schede album nel carosello a scorrimento
  function renderAlbumCarousel(activeKey) {
    const carousel = document.getElementById('album-carousel');
    if (!carousel) return;

    const albums = (typeof window.getSortedAlbums === 'function')
      ? window.getSortedAlbums()
      : Object.keys(FOTO_DATABASE).map(k => FOTO_DATABASE[k]);

    if (!albums || albums.length === 0) return;

    // Indicatore album più recente in alto
    const latestBadgeEl = document.getElementById('latest-album-indicator');
    if (latestBadgeEl && albums[0]) {
      latestBadgeEl.textContent = `Più recente: ${albums[0].titolo} (${albums[0].badgeText || albums[0].data})`;
    }

    carousel.innerHTML = albums.map((album, idx) => {
      const isLatest = idx === 0;
      const isSelected = album.id === activeKey;
      const coverThumb = album.copertinaId
        ? `https://lh3.googleusercontent.com/d/${album.copertinaId}=w600`
        : '';
      const fallbackThumb = album.copertinaId
        ? `https://drive.google.com/thumbnail?id=${album.copertinaId}&sz=w600`
        : '';

      return `
        <article
          onclick="window.selectAlbum('${album.id}', 'tutte', true)"
          data-album="${album.id}"
          class="album-tab-btn btn-press text-left bg-white rounded-3xl overflow-hidden border border-ink/15 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 snap-start w-[85vw] sm:w-[360px] md:w-[380px] select-none ${isSelected ? 'ring-4 ring-cobalt border-transparent shadow-xl' : ''}"
        >
          <div class="h-44 bg-gradient-to-br ${album.gradient || 'from-[#1B4965] to-[#2A4BFF]'} p-5 text-white flex flex-col justify-between relative overflow-hidden">
            ${coverThumb ? `
              <img
                src="${coverThumb}"
                alt="Copertina ${album.titolo}"
                loading="lazy"
                onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${fallbackThumb}';}else{this.style.display='none';}"
                class="absolute inset-0 w-full h-full object-cover object-center opacity-30 transition-transform duration-300 pointer-events-none"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none"></div>
            ` : ''}

            <div class="relative z-10 flex items-center justify-between gap-2">
              <span class="bg-white/20 backdrop-blur-sm text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tabular-nums">
                ${album.badgeText || album.data}
              </span>
              ${isLatest ? `
                <span class="sticker-badge rotate-2 bg-sun text-ink text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                  Più Recente ★
                </span>
              ` : ''}
            </div>

            <div class="relative z-10">
              <h3 class="font-display text-2xl sm:text-3xl uppercase tracking-wide leading-tight text-white drop-shadow">
                ${album.titolo}
              </h3>
              <span class="text-xs text-white/90 font-bold tabular-nums">
                ${album.totale || (album.foto ? album.foto.length : 0)} Fotografie
              </span>
            </div>
          </div>

          <div class="p-5 flex-grow flex flex-col justify-between gap-4">
            <p class="text-xs sm:text-sm text-ink/75 leading-relaxed">
              ${album.descrizione}
            </p>
            <div class="pt-2 flex items-center justify-between border-t border-dashed border-ink/15 text-xs font-black uppercase text-cobalt">
              <span>Sfoglia fotografie</span>
              <span class="text-base leading-none">↓</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Seleziona un album principale
  window.selectAlbum = function (albumKey, subFilterKey, shouldScroll) {
    if (typeof FOTO_DATABASE === 'undefined') return;
    const album = FOTO_DATABASE[albumKey];
    if (!album) return;

    currentAlbumKey = albumKey;
    currentSubFilter = subFilterKey || 'tutte';
    displayedCount = 0;

    // Aggiorna stile pulsanti album
    document.querySelectorAll('.album-tab-btn').forEach(btn => {
      if (btn.dataset.album === albumKey) {
        btn.classList.add('ring-4', 'ring-cobalt', 'border-transparent', 'shadow-xl');
      } else {
        btn.classList.remove('ring-4', 'ring-cobalt', 'border-transparent', 'shadow-xl');
      }
    });

    // Mostra/Nascondi filtri serate per Cavaglio sotto le Stelle
    const filterContainer = document.getElementById('stelle-subfilters');
    if (filterContainer) {
      if (albumKey === 'cavaglio-stelle-2026') {
        filterContainer.classList.remove('hidden');
      } else {
        filterContainer.classList.add('hidden');
      }
    }

    // Ricava l'elenco foto in base al filtro serate
    if (albumKey === 'cavaglio-stelle-2026') {
      if (currentSubFilter === 'tutte') {
        activePhotoList = [];
        album.serate.forEach(s => {
          activePhotoList = activePhotoList.concat(s.foto);
        });
      } else {
        const found = album.serate.find(s => s.id === currentSubFilter);
        activePhotoList = found ? found.foto : [];
      }
    } else {
      activePhotoList = album.foto || [];
    }

    // Aggiorna intestazione galleria
    const titleEl = document.getElementById('active-album-title');
    const descEl = document.getElementById('active-album-desc');
    const totalEl = document.getElementById('active-album-total');
    if (titleEl) titleEl.textContent = album.titolo;
    if (descEl) descEl.textContent = album.descrizione;
    if (totalEl) totalEl.textContent = `${activePhotoList.length} fotografie`;

    // Svuota e carica il primo blocco di 30 foto
    const grid = document.getElementById('photo-grid');
    if (grid) grid.innerHTML = '';
    window.loadMorePhotos();

    // Scorrimento dolce verso la sezione delle fotografie
    if (shouldScroll) {
      const activeSection = document.getElementById('active-album-section');
      if (activeSection) {
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Seleziona il filtro per serata (Cavaglio sotto le Stelle)
  window.filterStelleSerata = function (subId) {
    currentSubFilter = subId;

    document.querySelectorAll('.subfilter-btn').forEach(btn => {
      if (btn.dataset.sub === subId) {
        btn.classList.remove('bg-white', 'text-ink', 'border-ink/15');
        btn.classList.add('bg-ink', 'text-white');
      } else {
        btn.classList.add('bg-white', 'text-ink', 'border-ink/15');
        btn.classList.remove('bg-ink', 'text-white');
      }
    });

    window.selectAlbum('cavaglio-stelle-2026', subId);
  };

  // Paginazione progressiva a blocchi di 30 foto
  window.loadMorePhotos = function () {
    const grid = document.getElementById('photo-grid');
    const btnLoadMore = document.getElementById('btn-load-more');
    const counterEl = document.getElementById('photo-counter-status');
    if (!grid) return;

    const start = displayedCount;
    const end = Math.min(start + CHUNK_SIZE, activePhotoList.length);

    for (let i = start; i < end; i++) {
      const item = activePhotoList[i];
      const thumbUrl = `https://lh3.googleusercontent.com/d/${item.id}=w500`;
      const fallbackUrl = `https://drive.google.com/thumbnail?id=${item.id}&sz=w500`;

      const card = document.createElement('div');
      card.className = "photo-thumb-container rounded-2xl border border-ink/10 shadow-sm cursor-pointer group";
      card.onclick = (function (idx) {
        return function () {
          window.openLightbox(idx);
        };
      })(i);

      card.innerHTML = `
        <img
          src="${thumbUrl}"
          alt="${item.name}"
          loading="lazy"
          decoding="async"
          onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${fallbackUrl}';}else{this.style.opacity='0.2';}"
          class="photo-thumb-img"
        />
        <div class="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2">
          <span class="bg-white/95 text-ink text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full shadow">
            Ingrandisci ↗
          </span>
        </div>
      `;
      grid.appendChild(card);
    }

    displayedCount = end;

    if (counterEl) {
      counterEl.textContent = `Visualizzate ${displayedCount} di ${activePhotoList.length} fotografie`;
    }

    if (btnLoadMore) {
      if (displayedCount >= activePhotoList.length) {
        btnLoadMore.classList.add('hidden');
      } else {
        btnLoadMore.classList.remove('hidden');
        btnLoadMore.textContent = `Carica altre foto (${activePhotoList.length - displayedCount} rimanenti)`;
      }
    }
  };

  // =========================================================
  // LIGHTBOX A SCHERMO INTERO CON SUPPORTO TASTIERA & SWIPE
  // =========================================================
  window.openLightbox = function (index) {
    if (!activePhotoList || activePhotoList.length === 0) return;
    currentLightboxIndex = index;

    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateLightboxContent();
  };

  function updateLightboxContent() {
    if (!activePhotoList[currentLightboxIndex]) return;
    const photo = activePhotoList[currentLightboxIndex];

    const imgEl = document.getElementById('lightbox-img');
    const counterEl = document.getElementById('lightbox-counter');
    const nameEl = document.getElementById('lightbox-name');
    const downloadLink = document.getElementById('lightbox-download');

    const highResUrl = `https://lh3.googleusercontent.com/d/${photo.id}=w1600`;
    const fallbackHighRes = `https://drive.google.com/thumbnail?id=${photo.id}&sz=w1600`;

    if (imgEl) {
      imgEl.src = highResUrl;
      imgEl.dataset.fb = '';
      imgEl.onerror = function () {
        if (!this.dataset.fb) {
          this.dataset.fb = '1';
          this.src = fallbackHighRes;
        }
      };
    }

    if (counterEl) {
      counterEl.textContent = `${currentLightboxIndex + 1} / ${activePhotoList.length}`;
    }

    if (nameEl) {
      nameEl.textContent = photo.name;
    }

    if (downloadLink) {
      downloadLink.href = `https://drive.google.com/uc?export=download&id=${photo.id}`;
    }
  }

  window.closeLightbox = function () {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  window.prevLightboxPhoto = function () {
    if (currentLightboxIndex > 0) {
      currentLightboxIndex--;
    } else {
      currentLightboxIndex = activePhotoList.length - 1; // loop
    }
    updateLightboxContent();
  };

  window.nextLightboxPhoto = function () {
    if (currentLightboxIndex < activePhotoList.length - 1) {
      currentLightboxIndex++;
    } else {
      currentLightboxIndex = 0; // loop
    }
    updateLightboxContent();
  };

  // Navigazione tastiera nel Lightbox
  document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    if (e.key === 'ArrowLeft') {
      window.prevLightboxPhoto();
    } else if (e.key === 'ArrowRight') {
      window.nextLightboxPhoto();
    } else if (e.key === 'Escape') {
      window.closeLightbox();
    }
  });

  // Supporto Gesture Swipe Touch per Smartphone
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;

    modal.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 45; // pixel minimi per rilevare lo swipe
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          window.prevLightboxPhoto(); // swipe verso destra -> foto precedente
        } else {
          window.nextLightboxPhoto(); // swipe verso sinistra -> foto successiva
        }
      }
    }

    // Inizializzazione album: default al più recente
    const sorted = (typeof window.getSortedAlbums === 'function') ? window.getSortedAlbums() : [];
    let initAlbum = sorted.length > 0 ? sorted[0].id : 'castagnata-2026';

    const params = new URLSearchParams(window.location.search);
    const paramAlbum = params.get('album');
    const hash = window.location.hash.replace('#', '');

    let hasExplicitTarget = false;
    if (paramAlbum && FOTO_DATABASE[paramAlbum]) {
      initAlbum = paramAlbum;
      hasExplicitTarget = true;
    } else if (hash && FOTO_DATABASE[hash]) {
      initAlbum = hash;
      hasExplicitTarget = true;
    }

    renderAlbumCarousel(initAlbum);
    window.selectAlbum(initAlbum, 'tutte', hasExplicitTarget);
  });
})();
