# MANUALE TECNICO E GUIDA ARCHITETTURALE DEL SITO PRO LOCO CAVAGLIO D'AGOGNA APS
> **Istruzioni per l'Intelligenza Artificiale**: Questo documento definisce l'architettura, la mappa completa dei file, le convenzioni di codice, le logiche dinamiche e il Design System del sito web della **Pro Loco Cavaglio d'Agogna APS**.  
> Quando l'utente richiede una modifica o una nuova funzionalità, consulta questo documento per identificare esattamente i file coinvolti, i blocchi di codice necessari e lo stile da rispettare.

---

## 1. Mappa dei File e Responsabilità

Il sito è sviluppato con architettura statica modulare pura (**HTML5, Tailwind CSS via CDN, CSS custom e Vanilla JavaScript ES6**). Non fa uso di framework pesanti (no React, no Vue, no bundler come Vite o Webpack), garantendo massima velocità e manutenibilità.

### 1.1 File Dati (`/data/`) — *Single Source of Truth*
* **[`data/eventi.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/data/eventi.js)**:
  * **Cosa contiene**: L'array globale `EVENTI_DATA = [...]`. Contiene tutti gli eventi programmati e passati.
  * **Quando modificarlo**: Quando si aggiungono nuovi eventi, si aggiorna un menù, si cambia lo stato di prenotazione o si collega una nuova locandina.
* **[`data/foto.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/data/foto.js)**:
  * **Cosa contiene**: L'oggetto `FOTO_DATABASE = { ... }` con tutti gli album fotografici, gli ID delle immagini ospitate su Google Drive e la funzione `window.getSortedAlbums()`.
  * **Quando modificarlo**: Quando si caricano nuovi album fotografici o si modificano le copertine degli album.
* **[`data/menu.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/data/menu.js)**:
  * **Cosa contiene**: L'oggetto `MENU_DATA` con categorie (cucina, panini, birre, bevande, dolci), prezzi, descrizioni e codici per il generatore cassa.
  * **Quando modificarlo**: In occasione dell'Oktoberfest o di sagre gastronomiche per variare il listino prezzi.

### 1.2 File Logica JavaScript (`/js/`)
* **[`js/events.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/js/events.js)**:
  * **Cosa contiene**: Motore di calcolo temporale degli eventi.
    * `isEventConcluded(ev)`: Confronta la data `isoDate` con `Date.now()`. Se la giornata è passata, contrassegna automaticamente l'evento come `"past"` ("Concluso").
    * `getUpcomingEvents()`: Estrae e ordina gli eventi futuri con data crescente ($\ge$ oggi).
    * `renderHeroUpcomingEvent()`: Popola dinamicamente il box in evidenza nella Home page (`#hero-event-card`) con il primissimo evento in arrivo.
    * `getHomeEvents()`: Restituisce i 3 eventi più imminenti per la griglia `#home-events-grid` della Home page.
    * `renderHomePhotoAlbums()`: Renderizza i 3 album fotografici più recenti nel box rapido della Home page.
    * `openEventDetail(id)`: Apre il modal con la locandina, il programma, il menù e i contatti WhatsApp.
    * `filterEvents(key)`: Gestisce i filtri nella pagina completa `eventi.html`.
* **[`js/foto.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/js/foto.js)**:
  * **Cosa contiene**: Motore della galleria fotografica.
    * `renderAlbumCarousel(activeKey)`: Renderizza il carosello orizzontale degli album in cima a `foto.html`.
    * `scrollAlbumCarousel(direction)`: Scorrimento laterale tramite frecce di navigazione $\leftarrow$ $\rightarrow$.
    * `selectAlbum(key, subFilter, shouldScroll)`: Seleziona l'album attivo, filtra per serata (es. Cavaglio sotto le Stelle) ed effettua lo **scroll dolce automatico** (`scrollIntoView({ behavior: 'smooth' })`) verso le foto.
    * `loadMorePhotos()`: Paginazione progressiva a blocchi di 30 foto ad alta velocità.
    * Visualizzatore a schermo intero: Gestione tastiera (frecce $\leftarrow$ $\rightarrow$, ESC) e swipe touch su smartphone.
* **[`js/meteo.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/js/meteo.js)**:
  * **Cosa contiene**:
    * Chiamata alle previsioni meteo ufficiali su coordinate di Cavaglio d'Agogna (45.61° N, 8.49° E) con icone dinamiche.
    * `window.initHeroCountdown(targetIsoDate)`: Motore del conto alla rovescia dinamico (`-XXg XXh XXm`) agganciato alla data dell'evento in Hero.
* **[`js/menu.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/js/menu.js)**:
  * **Cosa contiene**: Logica del carrello del menù, calcolo totale ordini e generazione del QR Code rapido per la cassa.
* **[`js/layout.js`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/js/layout.js)**:
  * **Cosa contiene**: Componenti condivisi (Barra Live News scorrevole in cima, Header con navigazione attiva e drawer mobile, Footer unificato, Modal Privacy Policy e Trasparenza contributi pubblici).

### 1.3 Pagine HTML
* **[`index.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/index.html)**: Home Page (Hero con evento dinamico e countdown, Meteo live, Prossimi 3 eventi per data, Rubriche paesane, 3 Album foto più recenti, Bacheca soci 5×1000).
* **[`eventi.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/eventi.html)**: Calendario completo degli eventi con filtri e archivio storico.
* **[`foto.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/foto.html)**: Archivio fotografico con carosello orizzontale degli album, filtri serate e visualizzatore a schermo intero.
* **[`menu.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/menu.html)**: Listino piatti e birre con generatore ordine cassa.
* **[`rubriche.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/rubriche.html)**: Gazzettino culturale (A Tavola col Cuoco & Sommelier, Pillole di Storia e Dialetto, La Foto del Mese).
* **[`chi-siamo.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/chi-siamo.html)**: Chi Siamo, Consiglio Direttivo, Statuto APS, Sede e Modulo contatti.
* **[`soci.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/soci.html)**: Tesseramento soci UNPLI, vantaggi, quote e donazione 5×1000.
* **[`cavaglio-utile.html`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/cavaglio-utile.html)**: Servizi per cittadini e turisti (farmacie di turno, raccolta differenziata, numeri di emergenza).

### 1.4 Stile e Risorse
* **[`css/style.css`](file:///Users/andreacalligari/Desktop/SITO%20WEB%20PRO%20LOCO%20/css/style.css)**: Foglio di stile personalizzato. Contiene le classi identitarie (biglietti traforati, sticker badge fustellati, polaroid, carosello album orizzontale, scrollbar personalizzata).

---

## 2. Design System & Guida di Stile

Ogni nuova pagina, sezione, card o locandina deve seguire rigorosamente queste regole visive.

### 2.1 Tavolozza Colori (Tailwind Tokens)
Configurati nello script Tailwind in `<head>` di ogni pagina HTML:
| Colore | Codice HEX | Utilizzo Principale |
| :--- | :--- | :--- |
| **`cobalt`** | `#2A4BFF` (Dark: `#1D37CC`, Light: `#E8EDFF`) | Colore istituzionale, sezioni calendario, header eventi, bottoni primari |
| **`sun`** | `#FFD426` (Dark: `#E5B800`, Light: `#FFF8D6`) | Feste popolari, birra, countdown, badge adesivi "Più Recente" |
| **`coral`** | `#FF5A26` (Dark: `#E04312`, Light: `#FFE8E0`) | Gastronomia, cucina, archivio fotografico, accenti caldi |
| **`hill`** | `#6EB34E` (Dark: `#4F8F33`, Light: `#E7F5E0`) | Territorio, colline novaresi, "Ingresso Libero", natura |
| **`paper`** | `#F4F4F1` (Dark: `#E8E8E3`) | Sfondo generale del sito stile carta materica calda |
| **`ink`** | `#18191C` (Soft: `#3A3D45`) | Testo principale ad alto contrasto, bottoni scuri |
| **`soldout`** | `#DC2626` | Badge e bottoni disattivati per eventi esauriti |
| **`whatsapp`** | `#25D366` (Hover: `#1EBE5D`) | Bottoni di contatto e prenotazione WhatsApp |

### 2.2 Tipografia
* **Titoli e Intestazioni d'Impatto**:  
  Font: **`Anton`** (`font-display`).  
  Regola: Sempre in **MAIUSCOLO**, tracking leggermente aperto (`tracking-wide` o `tracking-tight` a seconda della dimensione).
* **Testi di Lettura e Sottotitoli**:  
  Font: **`Plus Jakarta Sans`** (`font-sans`).  
  Pesi utilizzati: `font-medium` (400–500), `font-bold` (700), `font-extrabold` (800).
* **Numeri e Date**:  
  Aggiungere sempre la classe **`tabular-nums`** per allineamento monospaziato delle cifre numeriche.

### 2.3 Componenti Chiave da Riutilizzare
1. **Bottone con Feedback Tattile**:
   ```html
   <button class="btn-press bg-cobalt hover:bg-cobalt-dark text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 py-3.5 rounded-full shadow transition">
     Testo Azione →
   </button>
   ```
2. **Sticker Badge (Adesivo Fustellato)**:
   ```html
   <span class="sticker-badge -rotate-2 bg-sun text-ink text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
     Novità • 2026
   </span>
   ```
3. **Card Biglietto Smerlato (Stile Ticket Festivo)**:
   ```html
   <article class="ticket-scallop shadow-xl flex flex-col justify-between">
     <!-- contenuto ticket -->
     <div class="ticket-watermark text-center text-3xl uppercase">PRO LOCO CAVAGLIO</div>
   </article>
   ```
4. **Card Polaroid (per Rubriche e Foto)**:
   ```html
   <div class="polaroid-frame bg-white p-3 shadow-lg -rotate-1 hover:rotate-0 transition-transform">
     <img src="..." class="w-full aspect-square object-cover" />
     <p class="text-xs font-bold text-ink/75 mt-2 text-center">Didascalia scatto</p>
   </div>
   ```

### 2.4 Tono di Voce e Regole di Comunicazione
* **Zero gergo informatico**: Non usare mai sul sito pubblico termini come *"Lightbox"*, *"Galleria nativa"*, *"Caricamento progressivo"*, *"API"*, *"CDN"*, *"Database"*.
* **Linguaggio**: Accogliente, comunitario, legato alle tradizioni, alle famiglie e al territorio delle Colline Novaresi.

---

## 3. Schemi dei Dati (Come Aggiungere Contenuti)

### 3.1 Come Aggiungere un Evento in `data/eventi.js`
Aggiungi un oggetto all'array `EVENTI_DATA`.  
**Nota FONDAMENTALE sulla data**: Compila sempre `isoDate` nel formato `YYYY-MM-DDTHH:mm:ss`. È il parametro usato dal sistema per capire se l'evento è futuro o concluso, per il countdown e per l'ordinamento in Home.

```javascript
{
  id: 'nome-univoco-2027',            // ID univoco senza spazi
  title: 'Nome dell\'Evento',          // Titolo evento
  year: '2027',                       // Anno
  isoDate: '2027-05-15T19:00:00',     // DATA STANDARD ISO (Anno-Mese-GiornoTOra:Minuti:Secondi)
  status: 'bookable',                 // 'bookable' (prenotabile), 'soldout' (esaurito), 'free' (libero), 'past' (concluso)
  hasPoster: true,                    // true se esiste una locandina
  coverImage: 'https://lh3.googleusercontent.com/d/[ID_GOOGLE_DRIVE]', // opzionale
  posterDriveUrl: 'https://drive.google.com/uc?export=download&id=[ID_GOOGLE_DRIVE]', // download
  posterViewUrl: 'https://drive.google.com/file/d/[ID_GOOGLE_DRIVE]/view', // anteprima drive
  albumUrl: '',                       // Link eventuale cartella foto
  badge: 'Prenotazioni Aperte',       // Dicitura badge
  stickerText: '15 MAG 2027',         // Testo adesivo data
  stickerBg: 'bg-sun text-ink',       // Colori adesivo
  dateDay: 'Sabato 15 Maggio 2027',   // Testo esteso data
  dateTime: 'Ritrovo ore 19:00 • Inizio cena ore 20:00',
  location: 'Area Feste Pro Loco – Cavaglio d\'Agogna',
  entry: 'Cena con Prenotazione',
  gradient: 'from-[#1B4965] to-[#2A4BFF]', // Gradiente di sfondo della card
  summary: 'Breve descrizione discorsiva dell\'evento per la card e per la Home.',
  program: [
    'Ore 19:00: Apertura cancelli e aperitivo di benvenuto',
    'Ore 20:00: Inizio servizio ristorazione',
    'Ore 21:30: Musica dal vivo e intrattenimento'
  ],
  menu: [
    'Quota di partecipazione: 25,00 € adulti | 12,00 € bambini',
    'Primo: Risotto tipico novarese',
    'Secondo: Arrosto con contorno di patate'
  ],
  contacts: 'Info e prenotazioni: Samanta +39 348 0816395'
}
```

### 3.2 Come Aggiungere un Album Fotografico in `data/foto.js`
Aggiungi una nuova proprietà all'interno di `FOTO_DATABASE`:

```javascript
"nome-album-2027": {
  "id": "nome-album-2027",
  "titolo": "Festa di Primavera 2027",
  "isoDate": "2027-04-25",            // Data standard YYYY-MM-DD per ordinare in cima il più recente
  "data": "Domenica 25 Aprile 2027",
  "badgeText": "25 Aprile 2027",
  "gradient": "from-[#6EB34E] to-[#1D37CC]", // Gradiente di copertina
  "descrizione": "I momenti più belli della giornata di festa all'aria aperta.",
  "copertinaId": "[ID_FOTO_DRIVE]",   // ID della foto di copertina su Google Drive
  "totale": 45,
  "foto": [
    {
      "name": "IMG_001.jpg",
      "id": "[ID_FOTO_GOOGLE_DRIVE]"
    },
    {
      "name": "IMG_002.jpg",
      "id": "[ID_FOTO_GOOGLE_DRIVE]"
    }
  ]
}
```

---

## 4. Linee Guida per Nuove Locandine Grafiche

Quando viene richiesto di preparare grafiche o inserire nuove locandine:
1. **Rapporto d'aspetto**: Standard verticale **3:4** (es. 1200 × 1600 px) o **4:5** (1080 × 1350 px).
2. **Visualizzazione web responsive**: Nella card dell'evento l'immagine usa `object-cover object-top` per garantire che il titolo in alto della locandina rimanga sempre ben visibile.
3. **URL Google Drive**: Per mostrare l'immagine ad alta velocità senza reindirizzamenti lenti, usa il link CDN di Google Drive:
   * Anteprima Web: `https://lh3.googleusercontent.com/d/[ID_FILE]=w900`
   * Download Diretto: `https://drive.google.com/uc?export=download&id=[ID_FILE]`

---

## 5. Procedura di Modifica e Deploy per un'Altra AI

Quando ricevi una richiesta di modifica dall'utente:
1. **Individua il file competente**:
   * Aggiunta/modifica evento $\rightarrow$ Modifica solo `data/eventi.js`.
   * Aggiunta album foto $\rightarrow$ Modifica solo `data/foto.js`.
   * Variazione menù e prezzi $\rightarrow$ Modifica solo `data/menu.js`.
   * Modifica a header/footer/privacy $\rightarrow$ Modifica solo `js/layout.js`.
   * Modifica layout galleria $\rightarrow$ `foto.html`, `js/foto.js`, `css/style.css`.
2. **Chiedi solo i codici necessari**: Se devi visualizzare o ritoccare un file, richiedi all'utente unicamente quel file specifico.
3. **Verifica della sintassi**: Assicurati che i file `.js` non contengano errori di sintassi prima del rilascio (`node -c <file>`).
4. **Comandi Git per il caricamento**:
   ```bash
   git add .
   git commit -m "Descrizione chiara delle modifiche"
   git push origin main
   ```
