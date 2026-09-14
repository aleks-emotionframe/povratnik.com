/* ============================================================
   EmotionFrame Footer
   Version 2.3

   Optional. Ohne dieses Script ist der Balken voll funktionsfähig
   und sofort sichtbar, er hat dann nur keinen Auftritt beim
   Scrollen.

   Einbinden mit defer, damit vor dem Zeichnen des Footers kein
   Aufblitzen entsteht:
   <script src="/ef-signature/ef-signature.js" defer></script>
   ============================================================ */

(function () {
  'use strict';

  var roots = document.querySelectorAll('.ef-sig');
  if (!roots.length) return;

  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(roots, function (root) {

    /* ---- Jahreszahl ----
       Standard ist automatisch, damit der Vermerk ohne Pflege richtig
       bleibt und im Januar nicht auf allen Kundenseiten das alte Jahr
       steht. Das WordPress-Plugin verhält sich genauso.

       Die Zahl im HTML ist der Rückfallwert, falls kein JavaScript
       läuft. Sie gehört darum auf das Veröffentlichungsjahr.

       Festhalten mit data-ef-year="fest". Der frühere Wert "auto" ist
       weiterhin gültig, er ist jetzt nur das, was ohnehin passiert. */
    if (root.getAttribute('data-ef-year') !== 'fest') {
      var year = root.querySelector('.ef-sig__year');
      if (year) year.textContent = String(new Date().getFullYear());
    }

    /* ---- Auftritt beim ersten Sichtbarwerden ---- */
    if (reduce || !('IntersectionObserver' in window)) {
      root.classList.add('is-visible');
      return;
    }

    root.classList.add('ef-sig--js');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    /* Der Rand von -40px unten übernimmt die Verzögerung: der Auftritt
       startet, sobald 40 Pixel des Balkens sichtbar sind.
       Die Schwelle muss dabei 0 bleiben. Ein Anteilswert wäre bei einem
       niedrigen Balken unerreichbar, weil der abgeschnittene Rand einen
       festen Teil seiner Höhe frisst. Bei 56 Pixel Höhe käme der Balken
       auch ganz unten auf der Seite höchstens auf 0.28 und bliebe für
       immer unsichtbar. */
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    io.observe(root);
  });
})();
