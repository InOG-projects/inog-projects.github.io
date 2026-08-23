# Webflow-CSS-Fallen bei Markdown-Seiten

Die Seiten sind ein Webflow-Export. Zwei Regeln darin kollidieren mit
Markdown-generiertem HTML.

## `p { margin-bottom: 0 }` — Absätze ohne Abstand

`assets/css/inog-website.webflow.css:216` setzt global `p { margin-bottom: 0px }`
und überschreibt damit `webflow.css:233` (`10px`), weil es später in der Kaskade
steht.

Solange Absätze als `<br> <br>` **innerhalb eines** `<p>` gebaut waren, fiel das
nicht auf. Sobald echte `<p>`-Elemente aus Markdown entstehen, kleben sie
aneinander (26px Abstand = reine Zeilenhöhe).

Fix in `custom.css`, nicht im Export:

```css
.content-box p {
  margin-bottom: 1em;
}
```

**Scope beachten.** `.content-box` existiert nur im `default`-Layout, also auf
den Markdown-Seiten. Eine weiter gefasste Regel auf `.block-content` — vor allem
zusammen mit `p:last-child { margin-bottom: 0 }` — hat die Startseite um 150px
verkürzt, weil dort sechs Absätze letzte Kinder ihres Containers sind und deren
Webflow-Abstand entfernt wurde. Siehe PR #30.

`projekte.html` deklariert zwar `layout: home`, rendert aber trotzdem eine
`.content-box` (home verschachtelt default) — dort greift die Regel also mit.

## `<br>` im Adressblock muss bleiben

Markdown fasst einzelne Zeilenumbrüche zu Leerzeichen zusammen, und kein CSS im
Repo setzt `white-space` für `<p>`. Ohne `<br>` rendert die Anschrift als **eine
Zeile** (im Headless-Browser verifiziert: 18px statt 72px Höhe).

Die Markdown-Alternative wären zwei Leerzeichen am Zeilenende — die entfernt
Prettier beim nächsten `npm run format`. Deshalb `<br>` innerhalb der Anschrift
behalten, für Absatztrennung dagegen Leerzeilen nutzen.

## Verifikation von Layout-Änderungen

Seitenhöhen im Headless-Browser gegen einen frischen Clone von `main` vergleichen,
**alle** Seiten, nicht nur die geänderte. Die Startseiten-Regression oben war
lokal nur so sichtbar:

```bash
node -e "const p=require('puppeteer'); /* goto, document.body.scrollHeight */"
```

Siehe auch [[ci-and-verification]] und [[finding-unused-assets]].
