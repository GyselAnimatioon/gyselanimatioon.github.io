document.addEventListener('DOMContentLoaded', (event) => {
    const loader = document.getElementById('loader');
    const nextpageloader = document.getElementById('nextpageloader');
    const phonemesAllophonesContainer = document.getElementById('pdf-phonemesallophones');
    const isMobile = window.innerWidth < window.innerHeight;

    // Funktion zum Laden und Anzeigen eines PDF-Dokuments
    const loadPdfDocument = (url, container, onComplete) => {
        pdfjsLib.getDocument(url).promise.then(pdf => {
            loader.style.display = 'none'; // Ladebildschirm ausblenden
            nextpageloader.style.display = 'flex';

            let renderPage = (pageNum) => {
                if (pageNum > pdf.numPages) {
                    nextpageloader.style.display = 'none';
                    if (onComplete) {
                        onComplete(); // Aufruf des Callbacks, wenn alle Seiten gerendert wurden
                    }
                    return;
                }

                pdf.getPage(pageNum).then(page => {
                    var viewport = page.getViewport({scale: 1});
                    let canvas = document.createElement('canvas');
                    canvas.style.display = 'block';
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    canvas.style.marginBottom = "10px"; // Abstand zwischen den Seiten

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
                        renderPage(pageNum + 1); // Nächste Seite laden
                    });
                });
            };

            renderPage(1); // Starten mit der ersten Seite
        }).catch(error => {
            console.error('Error loading the PDF: ', error);
            loader.innerHTML = '<p>Error loading the PDF. Please try again later.</p>';
            loader.style.display = 'block';
        });
    };

    // Nur das spezifische PDF 'phonemesallophones.pdf' laden
    loadPdfDocument('phonemesallophones.pdf', phonemesAllophonesContainer, () => {
        console.log('PDF phonemesallophones.pdf has been loaded.');
    });
});
