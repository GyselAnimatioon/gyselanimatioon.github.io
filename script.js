const container = document.getElementById('pdf-container');

// Bestimmen des Render-Modus basierend auf der Bildschirmbreite
const isMobile = window.innerWidth < window.innerHeight;


pdfjsLib.getDocument('farbPDF.pdf').promise.then(pdf => {
    for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        // Erstellen eines neuen Canvas für jede Seite
        let canvas = document.createElement('canvas');
        canvas.id = `pdf-renderer-${pageNum}`;
        container.appendChild(canvas);

        // Erhalten der Seite
        pdf.getPage(pageNum).then(page => {
            var viewport = page.getViewport({scale: 1});
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Anpassen des Layouts basierend auf dem Modus
            if (isMobile) {
                canvas.style.width = "200%";
            } else {
                // Anpassen für Desktop-Ansicht
                canvas.style.maxWidth = "100%";
            }

            // Rendern der Seite
            var renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
            };
            page.render(renderContext);
        });
    }
});
