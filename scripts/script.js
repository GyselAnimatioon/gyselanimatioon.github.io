document.addEventListener('DOMContentLoaded', (event) => {
    const loader = document.getElementById('loader');
    const container = document.getElementById('pdf-container');
    const isMobile = window.innerWidth < window.innerHeight;

    pdfjsLib.getDocument('magazine.pdf').promise.then(pdf => {
        loader.style.display = 'none';  // Ladebildschirm ausblenden

        let renderPage = (pageNum) => {
            if (pageNum > pdf.numPages) {
                return; // Alle Seiten sind gerendert
            }

            // Nachricht unter der letzten Seite anzeigen, wenn noch weitere Seiten geladen werden
            let loadingMessage;
            if (pageNum < pdf.numPages) {
                loadingMessage = document.createElement('div');
                loadingMessage.innerText = 'Nächste Seite wird geladen...';
                loadingMessage.style.padding = '20px';
                loadingMessage.style.textAlign = 'center';
                container.appendChild(loadingMessage);
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
                    container.appendChild(canvas);
                    if (loadingMessage) {
                        container.removeChild(loadingMessage);
                    }
                    renderPage(pageNum + 1); // Nächste Seite laden
                });
            });
        };

        renderPage(1); // Starten Sie mit der ersten Seite
    }).catch(error => {
        console.error('Fehler beim Laden des PDFs: ', error);
        loader.innerHTML = '<p>Fehler beim Laden des PDFs. Bitte versuchen Sie es später erneut.</p>';
    });
});
