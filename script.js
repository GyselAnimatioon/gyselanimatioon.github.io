// Laden der PDF-Datei
pdfjsLib.getDocument('beispiel_magazin.pdf').promise.then(pdf => {
    // Erhalten der ersten Seite
    pdf.getPage(1).then(page => {
        var canvas = document.getElementById('pdf-renderer');
        var ctx = canvas.getContext('2d');
        var viewport = page.getViewport({scale: 1.5});

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Rendern der Seite
        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
});
