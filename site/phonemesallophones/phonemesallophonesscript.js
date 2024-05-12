document.addEventListener('DOMContentLoaded', (event) => {
    const loader = document.getElementById('loader');
    const nextpageloader = document.getElementById('nextpageloader');
    const phonemesAllophonesContainer = document.getElementById('pdf-phonemesallophones');
    const isMobile = window.innerWidth < window.innerHeight;

    const loadPdfDocument = (url, container, onComplete) => {
        pdfjsLib.getDocument(url).promise.then(pdf => {
            loader.style.display = 'none';
            nextpageloader.style.display = 'flex';

            let renderPage = (pageNum) => {
                if (pageNum > pdf.numPages) {
                    nextpageloader.style.display = 'none';
                    if (onComplete) {
                        onComplete();
                    }
                    return;
                }

                pdf.getPage(pageNum).then(page => {
                    var viewport = page.getViewport({scale: 1});
                    let canvas = document.createElement('canvas');
                    canvas.style.display = 'block';
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    canvas.style.marginBottom = "10px";

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

                        // Nach dem Rendern der 5. Seite, fügen Sie den HTML-Teil ein, bevor die 6. Seite geladen wird
                        if (pageNum === 5) {
                            let htmlContent = document.createElement('div');
                            htmlContent.innerHTML = '<div class="audio-container"> <audio controls> <source src="audio1.mp3" type="audio/mpeg"> Ihr Browser unterstützt das Audio-Element nicht. </audio> <audio controls> <source src="audio2.mp3" type="audio/mpeg"> Ihr Browser unterstützt das Audio-Element nicht. </audio> <audio controls> <source src="audio3.mp3" type="audio/mpeg"> Ihr Browser unterstützt das Audio-Element nicht. </audio> </div>';
                            container.appendChild(htmlContent);
                        }

                        renderPage(pageNum + 1); // Nächste Seite laden
                    });
                });
            };

            renderPage(1);
        }).catch(error => {
            console.error('Error loading the PDF: ', error);
            loader.innerHTML = '<p>Error loading the PDF. Please try again later.</p>';
            loader.style.display = 'block';
        });
    };

    loadPdfDocument('phonemesallophones.pdf', phonemesAllophonesContainer, () => {
        console.log('PDF phonemesallophones.pdf has been loaded.');
    });
});
