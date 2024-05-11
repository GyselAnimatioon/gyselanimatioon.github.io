// Warten auf das vollständige Laden des DOM
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const container = document.getElementById('pdf-container');
    const isMobile = window.innerWidth < window.innerHeight;

    // Anzeigen des Ladebildschirms beim Start des Ladevorgangs
    loader.style.display = 'flex';

    pdfjsLib.getDocument('magazine.pdf').promise.then(pdf => {
        // Verstecken des Ladebildschirms, sobald das PDF geladen ist
        //loader.style.display = 'none';  

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            let canvas = document.createElement('canvas');
            canvas.id = `pdf-renderer-${pageNum}`;
            container.appendChild(canvas);

            pdf.getPage(pageNum).then(page => {
                var viewport = page.getViewport({scale: 1});
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
                page.render(renderContext);
            });
        }
    }).catch(error => {
        console.error('Fehler beim Laden des PDFs: ', error);
        loader.innerHTML = '<p>Fehler beim Laden des PDFs. Bitte versuchen Sie es später erneut.</p>';
    });
});
