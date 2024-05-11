document.addEventListener('DOMContentLoaded', (event) => {
    const loader = document.getElementById('loader');
    const nextpageloader = document.getElementById('nextpageloader');
    const container = document.getElementById('pdf-container');
    const isMobile = window.innerWidth < window.innerHeight;

    pdfjsLib.getDocument('magazine.pdf').promise.then(pdf => {
        loader.style.display = 'none';  // Ladebildschirm für das Gesamtdokument ausblenden
        nextpageloader.style.display = 'flex'; // Ladebildschirm für die nächste Seite anzeigen

        let timeoutId; // Timeout-Identifikator für das Laden der nächsten Seite
        let lastPageLoaded = 0; // Zuletzt geladene Seite verfolgen

        let renderPage = (pageNum) => {
            clearTimeout(timeoutId); // Timeout zurücksetzen, da eine neue Seite geladen wird

            if (pageNum > pdf.numPages) {
                nextpageloader.style.display = 'none';  // Keine weiteren Seiten zu laden
                return; // Alle Seiten sind gerendert
            }

            pdf.getPage(pageNum).then(page => {
                var viewport = page.getViewport({scale: 1});
                let canvas = document.createElement('canvas');
                canvas.style.display = 'block';
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                if (isMobile) {
                    canvas.style.width = "100%";
                } else {
                    canvas.style.maxWidth = "100%";
                }

                var renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport
                };

                page.render(renderContext).promise.then(() => {
                    lastPageLoaded = pageNum; // Aktualisierung der zuletzt geladenen Seite
                    container.appendChild(canvas);
                    nextpageloader.style.display = 'none'; // Ladebildschirm für die nächste Seite ausblenden
                    renderPage(pageNum + 1); // Nächste Seite laden
                    nextpageloader.style.display = 'flex'; // Ladebildschirm für die nächste Seite erneut anzeigen
                });
            });

            // Timeout einrichten
            timeoutId = setTimeout(() => {
                if (lastPageLoaded < pageNum) { // Prüfen, ob Fortschritt seit dem letzten Timeout erzielt wurde
                    loader.innerText = 'Fehler beim Laden weiterer Seiten. Bitte laden Sie die Seite neu.';
                    loader.style.display = 'block';
                    nextpageloader.style.display = 'none'; // Ladebildschirm ausblenden
                }
            }, 60000); // 60 Sekunden Timeout
        };

        renderPage(1); // Starten Sie mit der ersten Seite
    }).catch(error => {
        console.error('Fehler beim Laden des PDFs: ', error);
        loader.innerHTML = '<p>Fehler beim Laden des PDFs. Bitte versuchen Sie es später erneut.</p>';
        nextpageloader.style.display = 'none'; // Bei einem Fehler den Ladebildschirm ausblenden
    });
});
