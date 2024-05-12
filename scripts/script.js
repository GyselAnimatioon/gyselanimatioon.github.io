document.addEventListener('DOMContentLoaded', (event) => {
    const loader = document.getElementById('loader');
    const nextpageloader = document.getElementById('nextpageloader');
    const magazineContainer = document.getElementById('pdf-magazine');
    const coverContainer = document.getElementById('pdf-cover');
    const isMobile = window.innerWidth < window.innerHeight;

    // Funktion zum Laden und Anzeigen eines PDF-Dokuments
    const loadPdfDocument = (url, container, onComplete) => {
        pdfjsLib.getDocument(url).promise.then(pdf => {
            loader.style.display = 'none'; // Ladebildschirm ausblenden
            nextpageloader.style.display = 'flex';

            let renderPage = (pageNum) => {
                if (pageNum > pdf.numPages) {
                    nextpageloader.style.display = 'none';
                    onComplete(); // Aufruf des Callbacks, wenn alle Seiten gerendert wurden
                    return;
                }

                pdf.getPage(pageNum).then(page => {
                    var viewport = page.getViewport({scale: 1});
                    let canvas = document.createElement('canvas');
                    canvas.style.display = 'block';
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    canvas.style.marginBottom = "10px"; // 10px Abstand unter jeder Seite

                    if (isMobile) {
                        canvas.style.width = "100%";
                        coverContainer.style.marginTop = "20px"; // Zusätzlicher oberer Rand für das Cover auf Mobilgeräten
                        magazineContainer.style.marginTop = "20px"; // Zusätzlicher oberer Rand für das Magazin auf Mobilgeräten
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

    // Laden des Covers
    loadPdfDocument('cover.pdf', coverContainer, () => {
        // Nachdem das Cover geladen wurde, das Magazin laden
        loadPdfDocument('magazine.pdf', magazineContainer, () => {
            console.log('Both cover and magazine have been loaded.');
        });
    });
});
