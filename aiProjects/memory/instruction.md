# Memory-Spiel: Ein kleines Projekt zum Lernen von JavaScript

## Projektübersicht

Erstelle ein einfaches Memory-Spiel, bei dem der Benutzer Kartenpaare finden muss. Wir gehen es Schritt für Schritt durch, sodass du die Grundlagen von JavaScript vertiefst und ein vollständiges Spiel entwickelst.

### Schritte:

---

### **Schritt 1: Überlege dir, wie das Spielfeld aufgebaut werden soll.**

-   Du musst ein Spielfeld mit Karten erstellen. Jede Karte wird zufällig einem Bild zugeordnet, und die Karten werden verdeckt angezeigt.
-   Du benötigst ein Array, das alle Karten repräsentiert (mit den jeweiligen Bildern oder Symbolen).
-   Die Karten sollen nach dem Umblättern verglichen werden, um zu prüfen, ob sie übereinstimmen.

**Tipp:** Erstelle ein Array mit den Karten. Du kannst dafür ein einfaches Symbol wie Zahlen oder Zeichen verwenden, z. B. "A", "B", "C", etc. Du kannst später die Symbole mit Bildern oder Icons ersetzen.

```javascript
let cards = ['A', 'B', 'A', 'B', 'C', 'C'];
```

---

### **Schritt 2: Mische die Karten.**

-   Um die Karten zufällig anzuzeigen, musst du sie mischen, bevor du sie auf dem Spielfeld darstellst.

**Tipp:** Du kannst die **Fisher-Yates**-Mischmethode verwenden, um das Array zu mischen. Es ist eine effiziente Methode, um ein Array zufällig neu anzuordnen.

```javascript
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
```

---

### **Schritt 3: Karten anzeigen.**

-   Erstelle die HTML-Struktur für das Spielfeld. Jede Karte könnte durch ein HTML-Element (z.B. ein `div`) repräsentiert werden.
-   Bei einem Klick auf eine Karte soll diese umgedreht werden, d.h., sie zeigt den Wert (z. B. "A", "B").

**Tipp:** Verwende `addEventListener` für die Interaktion. Du kannst bei jedem Klick eine Funktion aufrufen, die die Karte umdreht.

```javascript
const grid = document.querySelector('.grid');
const cardElements = [];

cards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = card;
    cardElements.push(cardElement);
    grid.appendChild(cardElement);
});
```

---

### **Schritt 4: Karten umdrehen und vergleichen.**

-   Wenn der Benutzer eine Karte umdreht, speichere den Wert der Karte.
-   Wenn zwei Karten umgedreht wurden, vergleiche die Werte. Wenn sie übereinstimmen, lasse sie aufgedeckt bleiben, andernfalls drehe sie wieder um.

**Tipp:** Du kannst die `data-`-Attribute von HTML verwenden, um den Status der Karten zu speichern (ob sie umgedreht sind oder nicht).

```javascript
let flippedCards = [];

cardElements.forEach((cardElement) => {
    cardElement.addEventListener('click', () => {
        if (flippedCards.length < 2 && !cardElement.classList.contains('flipped')) {
            cardElement.classList.add('flipped');
            flippedCards.push(cardElement);

            if (flippedCards.length === 2) {
                const [card1, card2] = flippedCards;
                if (card1.textContent === card2.textContent) {
                    console.log('Match!');
                } else {
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                    }, 1000);
                }
                flippedCards = [];
            }
        }
    });
});
```

---

### **Schritt 5: Spiel gewinnen.**

-   Das Spiel endet, wenn alle Kartenpaare gefunden wurden. Du kannst dies überwachen und eine Nachricht anzeigen, wenn der Spieler gewonnen hat.

**Tipp:** Überprüfe nach jedem Klick, ob alle Kartenpaare gefunden wurden.

```javascript
let matchedPairs = 0;
const totalPairs = cards.length / 2;

if (matchedPairs === totalPairs) {
    alert('Du hast gewonnen!');
}
```

---

### **Schritt 6: Styling hinzufügen.**

-   Style das Spielfeld, damit es gut aussieht. Du kannst die Karten drehen, indem du CSS-Animationen verwendest.
-   Achte darauf, dass die Karten im "unaufgedeckten" Zustand so aussehen, als wären sie verdeckt.

**Tipp:** Verwende CSS-Transformationen wie `rotateY(180deg)` und Übergänge, um das Umdrehen der Karten zu animieren.

---

## Bonus-Aufgaben:

-   **Punkte zählen:** Füge eine Punktzahl hinzu, die sich basierend auf der Anzahl der Versuche ändert.
-   **Timer:** Implementiere einen Timer, der die Zeit misst, die der Benutzer benötigt, um alle Kartenpaare zu finden.
-   **Schwierigkeitsgrad:** Du könntest verschiedene Schwierigkeitsgrade hinzufügen, z. B. ein einfaches Spielfeld mit weniger Karten oder ein schwieriges Spielfeld mit mehr Karten.
