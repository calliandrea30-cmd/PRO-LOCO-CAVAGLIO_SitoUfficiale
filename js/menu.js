/**
 * Menù Oktoberfest 2026 & Generatore Codice Cassa Base36 + QR
 * Pro Loco Cavaglio d'Agogna APS
 */

(function () {
  'use strict';

  let menuCart = {};

  function formatEuro(val) {
    return val.toFixed(2).replace('.', ',') + ' €';
  }

  window.filterMenu = function (cat) {
    if (typeof MENU_ITEMS === 'undefined') return;

    document.querySelectorAll('.menu-filter-btn').forEach(btn => {
      if (btn.dataset.menuFilter === cat) {
        btn.classList.remove('bg-white', 'text-ink', 'border', 'border-ink/15');
        btn.classList.add('bg-ink', 'text-white');
      } else {
        btn.classList.add('bg-white', 'text-ink', 'border', 'border-ink/15');
        btn.classList.remove('bg-ink', 'text-white');
      }
    });

    const list = cat === 'tutti' ? MENU_ITEMS : MENU_ITEMS.filter(m => m.cat === cat);
    const grid = document.getElementById('menu-items-grid');
    if (!grid) return;

    grid.innerHTML = list.map(item => {
      const qty = menuCart[item.id] || 0;
      return `
        <div class="bg-white rounded-3xl p-5 border border-ink/10 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="sticker-badge -rotate-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${item.stickerBg}">
                ${item.tag}
              </span>
              <span class="font-mono text-[11px] font-extrabold text-ink/45 tabular-nums">ART. #${item.cod}</span>
            </div>
            <h3 class="font-bold text-ink text-base leading-snug">${item.name}</h3>
            <p class="text-xs text-ink/70 mt-1 leading-relaxed">${item.desc}</p>
          </div>
          <div class="pt-3 border-t border-ink/10 flex items-center justify-between gap-2 tabular-nums">
            <span class="font-display text-2xl text-cobalt">${formatEuro(item.price)}</span>
            <div class="flex items-center gap-1.5">
              ${qty > 0 ? `
                <button onclick="window.removeFromMenuCart('${item.id}')" class="btn-press w-9 h-9 rounded-full bg-paper hover:bg-ink/10 text-ink font-extrabold text-base flex items-center justify-center transition" aria-label="Rimuovi una porzione di ${item.name}">−</button>
                <span class="w-6 text-center font-extrabold text-sm text-ink">${qty}</span>
              ` : ''}
              <button onclick="window.addToMenuCart('${item.id}')" class="btn-press w-9 h-9 rounded-full bg-ink hover:bg-coral text-white font-extrabold text-base flex items-center justify-center shadow-sm transition" aria-label="Aggiungi ${item.name}">+</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  window.addToMenuCart = function (id) {
    const current = menuCart[id] || 0;
    if (current >= 15) {
      if (window.showToast) window.showToast('Quantità massima per singolo articolo: 15 porzioni.');
      return;
    }
    menuCart[id] = current + 1;
    const activeBtn = document.querySelector('.menu-filter-btn.bg-ink');
    window.filterMenu(activeBtn ? activeBtn.dataset.menuFilter : 'tutti');
    renderMenuCart();
  };

  window.removeFromMenuCart = function (id) {
    if (!menuCart[id]) return;
    menuCart[id] -= 1;
    if (menuCart[id] <= 0) delete menuCart[id];
    const activeBtn = document.querySelector('.menu-filter-btn.bg-ink');
    window.filterMenu(activeBtn ? activeBtn.dataset.menuFilter : 'tutti');
    renderMenuCart();
  };

  window.clearMenuCart = function () {
    menuCart = {};
    const activeBtn = document.querySelector('.menu-filter-btn.bg-ink');
    window.filterMenu(activeBtn ? activeBtn.dataset.menuFilter : 'tutti');
    renderMenuCart();
    if (window.showToast) window.showToast('Carrello svuotato.');
  };

  function getCartItemsDetails() {
    if (typeof MENU_ITEMS === 'undefined') return { items: [], total: 0 };
    const items = [];
    let total = 0;
    for (const item of MENU_ITEMS) {
      const qty = menuCart[item.id] || 0;
      if (qty > 0) {
        const sub = item.price * qty;
        total += sub;
        items.push({ ...item, qty, sub });
      }
    }
    return { items, total };
  }

  function renderMenuCart() {
    const container = document.getElementById('menu-cart-list');
    const totalEl = document.getElementById('menu-cart-total');
    if (!container || !totalEl) return;

    const { items, total } = getCartItemsDetails();
    totalEl.textContent = formatEuro(total);

    if (items.length === 0) {
      container.innerHTML = `<p class="text-xs text-ink/60 py-6 text-center">Tocca il tasto <strong>+</strong> accanto ai piatti o alle birre per comporre l'ordine e generare il codice cassa rapido.</p>`;
      return;
    }

    container.innerHTML = items.map(it => `
      <div class="flex items-center justify-between gap-2 bg-paper px-3.5 py-2.5 rounded-2xl border border-ink/10 tabular-nums">
        <div class="min-w-0">
          <span class="font-extrabold text-cobalt mr-1">${it.qty}×</span>
          <span class="font-bold text-ink text-xs sm:text-sm">${it.name}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="font-extrabold text-xs text-ink">${formatEuro(it.sub)}</span>
          <button onclick="window.removeFromMenuCart('${it.id}')" class="btn-press w-6 h-6 rounded-full bg-white border border-ink/15 text-ink hover:bg-coral hover:text-white font-bold text-xs flex items-center justify-center transition" aria-label="Rimuovi">−</button>
        </div>
      </div>
    `).join('');
  }

  window.generatePosOrderCode = function () {
    const { items, total } = getCartItemsDetails();
    if (items.length === 0) return null;

    let packed = 0n;
    for (const it of items) {
      const cod = BigInt(parseInt(it.cod, 10)) & 63n;
      const qty = BigInt(Math.min(it.qty, 15)) & 15n;
      packed = (packed << 10n) | (cod << 4n) | qty;
    }
    const shortCode = 'PL-' + packed.toString(36).toUpperCase();
    return { shortCode, items, total };
  };

  window.openPosOrderModal = function () {
    const order = window.generatePosOrderCode();
    if (!order) {
      if (window.showToast) window.showToast('Seleziona almeno un articolo dal menù prima di generare il codice cassa.');
      return;
    }

    const modal = document.getElementById('pos-modal');
    if (!modal) return;

    document.getElementById('pos-short-code').textContent = order.shortCode;
    document.getElementById('pos-payload-raw').textContent = `QR Cassa: ${order.shortCode} • Totale: ${formatEuro(order.total)}`;
    document.getElementById('pos-modal-total').textContent = formatEuro(order.total);

    const qrImg = document.getElementById('pos-qr-img');
    if (qrImg) {
      qrImg.parentElement.classList.remove('hidden');
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=6&data=${encodeURIComponent(order.shortCode)}`;
    }

    document.getElementById('pos-summary-list').innerHTML = order.items.map(it => `
      <div class="flex items-center justify-between gap-2">
        <span><strong class="text-cobalt">#${it.cod}</strong> • <strong>${it.qty}×</strong> ${it.name}</span>
        <span class="font-bold">${formatEuro(it.sub)}</span>
      </div>
    `).join('');

    modal.classList.remove('hidden');
  };

  window.copyPosCode = function () {
    const code = document.getElementById('pos-short-code').textContent.trim();
    if (window.copyTextSafe) {
      window.copyTextSafe(code, `Codice Cassa "${code}" copiato!`);
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof MENU_ITEMS !== 'undefined') {
      window.filterMenu('tutti');
      renderMenuCart();
    }
  });
})();
