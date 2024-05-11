document.addEventListener('DOMContentLoaded', (event) => {
    const deviceInfoDiv = document.createElement('div');
    deviceInfoDiv.id = 'device-info';
    const browserData = `Browser-Name: ${navigator.appName}<br>
                         Browser-Version: ${navigator.appVersion}<br>
                         Plattform: ${navigator.platform}<br>
                         Sprache: ${navigator.language}<br>
                         Cookies aktiviert: ${navigator.cookieEnabled}`;
    deviceInfoDiv.innerHTML = `<p>${browserData}</p>`;
    document.body.appendChild(deviceInfoDiv);  // Stellen Sie sicher, dass dies Teil Ihres Dokuments ist

    // PDF-Anzeige Logik...
});

const loader = document.getElementById('loader');
const container = document.getElementById('pdf-container');
const isMobile = window.innerWidth < window.innerHeight;

pdfjsLib.getDocument('magazine.pdf').promise.then(pdf => {
    loader.style.display = 'none';  // Ladebildschirm ausblenden

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
