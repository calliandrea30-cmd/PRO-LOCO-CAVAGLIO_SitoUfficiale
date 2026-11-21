Ecco la **guida pratica e completa** per aggiornare e gestire in totale autonomia ogni sezione del tuo nuovo sito modulare.

Grazie alla nuova architettura a dati centralizzati, per il 90% degli aggiornamenti **non dovrai toccare il codice HTML**: ti basterà aprire e modificare i file di dati dentro la cartella `data/`.

---

### Indice Rapido
1. [Come Aggiornare o Aggiungere Eventi](#1-gestione-eventi)
2. [Come Cambiare il Menù dell'Oktoberfest / Sagre](#2-cambiare-il-menù)
3. [Come Aggiungere un Nuovo Album Fotografico](#3-aggiungere-album-fotografici)
4. [Come Cambiare le Rubriche e Archiviare i Vecchi Numeri](#4-rubriche-mensili-e-archivio-numeri)
5. [Come Modificare la Barra Live News, Footer e Informazioni Globali](#5-barra-live-news-e-footer)
6. [Come Pubblicare le Modifiche Online](#6-come-pubblicare-le-modifiche)

---

### 1. Gestione Eventi
📁 **File da modificare:** `data/eventi.js`

Tutti gli eventi (sia i primi 3 mostrati in Home Page sia quelli nel Calendario completo di `eventi.html`) si gestiscono da questo unico file.

#### Per aggiungere un nuovo evento:
Apri `data/eventi.js` e aggiungi in cima alla lista un nuovo blocco tra parentesi graffe `{ ... }`:

```javascript
{
  id: 'nome-evento-2026',
  title: 'Nome dell\'Evento',
  year: '2026',
  status: 'bookable', // Usa: 'bookable' (prenotabile), 'soldout' (esaurito), 'free' (ingresso libero), 'past' (concluso)
  hasPoster: true,
  // Sostituisci l'ID con quello di Google Drive della tua locandina:
  coverImage: 'https://lh3.googleusercontent.com/d/INSERISCI_ID_DRIVE_QUI',
  coverImageFallback: 'https://drive.google.com/thumbnail?id=INSERISCI_ID_DRIVE_QUI&sz=w1000',
  posterDriveUrl: 'https://drive.google.com/uc?export=download&id=INSERISCI_ID_DRIVE_QUI',
  badge: 'Prenotazioni Aperte',
  stickerText: '15 LUG 2026',
  stickerBg: 'bg-sun text-ink',
  dateDay: 'Domenica 15 Luglio 2026',
  dateTime: 'Dalle ore 19:30',
  location: 'Area Feste Pro Loco • Via Cavaglietto',
  desc: 'Breve descrizione dell\'evento per la card.',
  fullDesc: 'Descrizione completa che comparirà quando si clicca su Dettagli Evento.',
  features: [
    'Specialità gastronomiche',
    'Musica dal vivo',
    'Ingresso con prenotazione'
  ],
  booking: {
    required: true,
    note: 'Prenotazione consigliata entro il 12 Luglio.',
    // Solo qui è ammesso WhatsApp per la prenotazione:
    contactPerson: 'Samanta: +39 348 0816395',
    phone: '+393480816395',
    whatsapp: 'https://wa.me/393480816395?text=Buongiorno,%20vorrei%20prenotare%20per%20l\'evento'
  }
},
```

> **Nota:** La Home Page mostra automaticamente **i primi 3 eventi** presenti nell'elenco di `data/eventi.js`. Se vuoi mettere un evento in vetrina in Home, basta metterlo tra i primi 3 dell'array.

---

### 2. Cambiare il Menù
📁 **File da modificare:** `data/menu.js`

La pagina `menu.html` legge automaticamente questo file: il carrello, i filtri, il calcolo dei prezzi, il **Codice Cassa Base36** e il QR Code si aggiornano in automatico.

#### Per modificare o aggiungere un piatto:
Apri `data/menu.js` e modifica la lista `MENU_ITEMS`:

```javascript
{ 
  id: 'm37',                       // ID univoco progressivo (m1, m2, m3...)
  cod: '37',                       // Numero cassa
  cat: 'cucina',                   // Categoria: 'cucina', 'panini', 'dolci', 'birre', 'bevande'
  name: 'Risotto ai Funghi Porcini', // Nome del piatto
  desc: 'Riso Carnaroli con funghi porcini freschi.', 
  price: 8.50,                     // Prezzo in euro (usa il punto decimale)
  tag: 'Primi',                    // Etichetta grafica sulla card
  stickerBg: 'bg-sun text-ink'     // Colore etichetta (bg-sun, bg-coral, bg-cobalt, bg-hill)
},
```

* Per **cambiare un prezzo**: basta cambiare il valore di `price`.
* Per **eliminare un piatto**: cancella il blocco corrispondente o commentalo con `//`.

---

### 3. Aggiungere Album Fotografici
📁 **File da modificare:** `data/foto.js` e `foto.html`

L'archivio non usa iframe lenti di Google Drive, ma carica le immagini veloci tramite i loro ID.

#### Come recuperare l'ID di una foto da Google Drive:
Quando condividi una foto su Drive (es. `https://drive.google.com/file/d/1BFqh9gRsxO6GzjL8sCJWSkQN-zQgYNAv/view?usp=sharing`), la stringa di lettere e numeri in mezzo (`1BFqh9gRsxO6GzjL8sCJWSkQN-zQgYNAv`) è l'**ID del file**.

#### Passaggio 1: Aggiungi l'album in `data/foto.js`
Apri `data/foto.js` e aggiungi il nuovo album nell'oggetto `FOTO_DATABASE`:

```javascript
"carnevale-2027": {
  "id": "carnevale-2027",
  "titolo": "Carnevale 2027",
  "data": "Domenica 14 Febbraio 2027",
  "descrizione": "I momenti più belli della festa in maschera.",
  "copertinaId": "ID_DRIVE_DELLA_FOTO_DI_COPERTINA",
  "totale": 2,
  "foto": [
    { "name": "IMG_001.jpg", "id": "ID_FOTO_1" },
    { "name": "IMG_002.jpg", "id": "ID_FOTO_2" }
  ]
},
```

#### Passaggio 2: Mostra la scheda dell'album in `foto.html`
In `foto.html`, dentro il blocco `<div class="grid grid-cols-1 md:grid-cols-3 gap-6">`, duplica una scheda album esistente impostando il nuovo ID:

```html
<button onclick="selectAlbum('carnevale-2027')" data-album="carnevale-2027" class="album-tab-btn group text-left bg-white rounded-3xl p-5 border border-ink/10 shadow-sm transition hover:shadow-md">
  <div class="aspect-video w-full rounded-2xl overflow-hidden bg-ink/10 mb-4 relative">
    <img src="https://lh3.googleusercontent.com/d/ID_DRIVE_COPERTINA=w600" alt="Carnevale 2027" class="w-full h-full object-cover">
  </div>
  <span class="inline-block bg-sun text-ink text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
    Febbraio 2027
  </span>
  <h3 class="font-display text-2xl uppercase text-ink">Carnevale 2027</h3>
  <p class="text-xs text-ink/70 mt-1">Festa in maschera per grandi e piccini.</p>
</button>
```

---

### 4. Rubriche Mensili e Archivio Numeri
📁 **File da modificare:** `rubriche.html`

La pagina è strutturata come un **gazzettino stampato**.

#### A. Come cambiare il numero corrente (edizione del mese):
Apri `rubriche.html` e modifica i testi direttamente nel file:
1. **Intestazione del giornale:**
   All'inizio trovi la riga:
   ```html
   <p class="text-xs font-bold uppercase tracking-wider text-ink/80">
     Notiziario Mensile di Tradizioni, Enogastronomia & Cultura Popolare • Cavaglio d'Agogna (NO)
   </p>
   ```
   Puoi aggiornare la datazione: *Anno I – N. 2 • Febbraio 2027*.

2. **Ricetta e Vino del Mese (*A Tavola con la Pro Loco*):**
   * Nella colonna sinistra (sfondo carta) modifica il titolo della ricetta, la lista `<ul class="space-y-1">` degli ingredienti e i passaggi del procedimento.
   * Nella colonna destra (scheda vino bordeaux) modifica il nome del vino (es. *Ghemme DOCG*), i sentori, la temperatura di servizio e il calice consigliato.

3. **Storia e Cultura:**
   * Modifica i paragrafi dell'articolo e il testo dentro il box dialettale (*"Il Dialetto di Cavaglio"*).

4. **La Foto del Mese:**
   * Sostituisci l'ID Google Drive dentro l'attributo `src`:
     `https://lh3.googleusercontent.com/d/NUOVO_ID_DRIVE=w1200`
   * Aggiorna titolo dello scatto, autore e luogo nella didascalia sotto la polaroid.

#### B. Come archiviare i vecchi numeri:
Per non perdere le rubriche precedenti hai due opzioni molto semplici:
* **Metodo consigliato (Duplicazione del file):**  
  Prima di modificare `rubriche.html` per il nuovo mese, fai una copia del file e nominala ad esempio:  
  `rubriche-2026-11.html` (o `rubriche-novembre-2026.html`).  
* **Aggiungere il link all'archivio:**  
  In fondo a `rubriche.html`, aggiungi una sezione con l'elenco dei numeri passati:
  ```html
  <div class="mt-12 p-6 bg-white rounded-3xl border border-ink/10">
    <h3 class="font-display text-2xl uppercase text-ink mb-3">Archivio Numeri Precedenti</h3>
    <ul class="space-y-2 text-sm">
      <li><a href="rubriche-2026-11.html" class="text-cobalt font-bold underline">Edizione N. 1 – Novembre 2026 (Paniscia Novarese & Vespolina DOC) →</a></li>
    </ul>
  </div>
  ```

---

### 5. Barra Live News e Footer
📁 **File da modificare:** `js/layout.js`

Poiché tutte le 8 pagine richiamano `js/layout.js`, **modificando questo file aggiorni all'istante l'intero sito**:

* **Per cambiare i messaggi che scorrono nella barra Live News:**
  Cerca la funzione `renderLiveBar()` (intorno alla riga 50) e modifica il testo tra i tag `<span>`:
  ```javascript
  <span>📢 <strong>Prossimo Evento:</strong> Sabato 15 Luglio – Serata Paella all'Area Feste!</span>
  ```
  *(Ricordati di aggiornare anche il blocco `.marquee-duplicate` subito sotto, che serve a far scorrere il testo senza interruzioni).*

* **Per cambiare dati societari o legali:**
  In cima al file trovi l'oggetto `CONFIG_PRO_LOCO` dove puoi aggiornare email, indirizzo, Codice Fiscale o P.IVA.

---

### 6. Come Pubblicare le Modifiche

Ogni volta che fai una modifica sul tuo computer, per mandarla online sul sito ti basta:

**Tramite il Terminale del Mac:**
```bash
cd "$HOME/Desktop/SITO WEB PRO LOCO "
git add .
git commit -m "Aggiornato menù e aggiunta foto del mese"
git push origin main
```
*Tempo di attesa:* 1 minuto e GitHub Pages aggiornerà automaticamente il sito online!
