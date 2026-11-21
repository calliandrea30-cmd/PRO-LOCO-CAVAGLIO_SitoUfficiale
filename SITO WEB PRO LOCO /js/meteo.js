/**
 * Widget Meteo Live Open-Meteo & Countdown
 * Pro Loco Cavaglio d'Agogna APS
 */

(function () {
  'use strict';

  function decodeWmoWeather(code) {
    if (code === 0) return { icon: '☀️', label: 'Cielo Sereno' };
    if (code === 1) return { icon: '🌤️', label: 'Prevalentemente Sereno' };
    if (code === 2) return { icon: '⛅', label: 'Parzialmente Nuvoloso' };
    if (code === 3) return { icon: '☁️', label: 'Nuvoloso' };
    if (code === 45 || code === 48) return { icon: '🌫️', label: 'Nebbia / Foschia' };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: '🌧️', label: 'Pioggia' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: '❄️', label: 'Neve' };
    if ([95, 96, 99].includes(code)) return { icon: '⛈️', label: 'Temporale' };
    return { icon: '🌤️', label: 'Variabile' };
  }

  async function loadCavaglioWeather() {
    // URL corretto con parametro &current= (senza caratteri corrotti)
    const lat = 45.6139;
    const lon = 8.4872;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FRome`;

    const iconEl = document.getElementById('weather-now-icon');
    const tempEl = document.getElementById('weather-now-temp');
    const descEl = document.getElementById('weather-now-desc');
    const extraEl = document.getElementById('weather-now-extra');
    const updatedEl = document.getElementById('weather-updated');
    const weekendGrid = document.getElementById('weather-weekend-grid');

    if (!iconEl || !tempEl) return;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API non disponibile');
      const data = await res.json();

      if (data.current) {
        const w = decodeWmoWeather(data.current.weather_code);
        iconEl.textContent = w.icon;
        tempEl.textContent = `${Math.round(data.current.temperature_2m)}°`;
        if (descEl) descEl.textContent = w.label;
        if (extraEl) {
          extraEl.textContent = `Vento ${Math.round(data.current.wind_speed_10m)} km/h • Umidità ${Math.round(data.current.relative_humidity_2m)}%`;
        }
        if (updatedEl) updatedEl.textContent = 'Rilevazione live • Colline Novaresi';
      }

      if (data.daily && Array.isArray(data.daily.time) && weekendGrid) {
        const weekendCards = [];
        const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

        for (let i = 0; i < data.daily.time.length; i++) {
          const dObj = new Date(data.daily.time[i] + 'T12:00:00');
          const dow = dObj.getDay(); // 6 = Sabato, 0 = Domenica
          if (dow === 6 || dow === 0) {
            const info = decodeWmoWeather(data.daily.weather_code[i]);
            const tMax = Math.round(data.daily.temperature_2m_max[i]);
            const tMin = Math.round(data.daily.temperature_2m_min[i]);
            const rainProb = data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0;
            const dateLabel = dObj.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });

            weekendCards.push(`
              <div class="bg-paper rounded-2xl p-3.5 border border-ink/10">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-extrabold uppercase text-cobalt">${dayNames[dow]} ${dateLabel}</span>
                  <span class="text-[10px] font-bold text-ink/55">💧 ${rainProb}%</span>
                </div>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-2xl">${info.icon}</span>
                  <span class="font-display text-xl text-ink">${tMax}° <span class="text-ink/45 text-base">/ ${tMin}°</span></span>
                </div>
                <span class="block text-[11px] font-semibold text-ink/75 mt-1 truncate">${info.label}</span>
              </div>
            `);
          }
          if (weekendCards.length === 2) break;
        }

        if (weekendCards.length > 0) {
          weekendGrid.innerHTML = weekendCards.join('');
        }
      }
    } catch (err) {
      if (updatedEl) updatedEl.textContent = 'Meteo Colline Novaresi';
      if (descEl) descEl.textContent = 'Cavaglio d\'Agogna';
      if (extraEl) extraEl.textContent = 'Coordinate: 45.61° N, 8.49° E';
    }
  }

  function startCountdown() {
    const el = document.getElementById('hero-countdown');
    if (!el) return;

    // Data obiettivo: Gita a Carrù 29 Novembre 2026 ore 7:45
    const targetDate = new Date('2026-11-29T07:45:00').getTime();

    function update() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        el.textContent = 'Oggi!';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      el.textContent = `-${String(d).padStart(2, '0')}g ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
    }

    update();
    setInterval(update, 60000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadCavaglioWeather();
    startCountdown();
  });
})();
