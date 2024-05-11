document.addEventListener('DOMContentLoaded', (event) => {
    const loader = document.getElementById('loader');
    const nextpageloader = document.getElementById('nextpageloader');
    const container = document.getElementById('pdf-container');
    const isMobile = window.innerWidth < window.innerHeight;

    pdfjsLib.getDocument('magazine.pdf').promise.then(pdf => {
        loader.style.display = 'none';  // Ladebildschirm ausblenden
		nextpageloader.style.display = 'flex';

        let timeoutId; // Timeout-Identifikator für das Laden der nächsten Seite
        let lastPageLoaded = 0; // Zuletzt geladene Seite verfolgen

        let renderPage = (pageNum) => {
            clearTimeout(timeoutId); // Timeout zurücksetzen, da eine neue Seite geladen wird

            if (pageNum > pdf.numPages) {
				nextpageloader.style.display = 'none';  // Ladebildschirm ausblenden
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
                    container.removeChild(loadingMessage);
                    renderPage(pageNum + 1); // Nächste Seite laden
                });
            });

            // Timeout einrichten
            timeoutId = setTimeout(() => {
                if (lastPageLoaded < pageNum) { // Prüfen, ob Fortschritt seit dem letzten Timeout erzielt wurde
                    loader.innerText = 'Fehler beim Laden weiterer Seiten. Bitte laden Sie die Seite neu.';
                    loader.style.display = 'block';
                }
            }, 60000); // 60 Sekunden Timeout
        };

        renderPage(1); // Starten Sie mit der ersten Seite
    }).catch(error => {
        console.error('Fehler beim Laden des PDFs: ', error);
        loader.innerHTML = '<p>Fehler beim Laden des PDFs. Bitte versuchen Sie es später erneut.</p>';
    });
});
