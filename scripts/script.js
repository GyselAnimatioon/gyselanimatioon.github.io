const container = document.getElementById('pdf-container');

document.addEventListener('DOMContentLoaded', (event) => {
    const deviceInfoDiv = document.getElementById('device-info');
    const browserData = `Browser-Name: ${navigator.appName}<br>
                         Browser-Version: ${navigator.appVersion}<br>
                         Plattform: ${navigator.platform}<br>
                         Sprache: ${navigator.language}<br>
                         Cookies aktiviert: ${navigator.cookieEnabled}`;

    // Informationen über das Gerät anzeigen
    deviceInfoDiv.innerHTML = `<p>${browserData}</p>`;

    // PDF-Anzeige Logik...
});

// Bestimmen des Render-Modus basierend auf der Bildschirmbreite
const isMobile = window.innerWidth < window.innerHeight;


pdfjsLib.getDocument('magazine.pdf').promise.then(pdf => {
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
                canvas.style.width = "100%";
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


document.addEventListener('DOMContentLoaded', (event) => {
    const container = document.getElementById('image-container');
    const deviceInfoDiv = document.getElementById('device-info');
    const browserData = `Browser-Name: ${navigator.appName}<br>
                         Browser-Version: ${navigator.appVersion}<br>
                         Plattform: ${navigator.platform}<br>
                         Sprache: ${navigator.language}<br>
                         Cookies aktiviert: ${navigator.cookieEnabled}`;

    // Informationen über das Gerät anzeigen
    deviceInfoDiv.innerHTML = `<p>${browserData}</p>`;

    // Bilder-Anzeige Logik...
    loadImages([
	'imageMagazine/image1.jpeg',
	'imageMagazine/image2.jpeg',
	'imageMagazine/image3.jpeg',
	'imageMagazine/image4.jpeg',
	'imageMagazine/image5.jpeg',
	'imageMagazine/image6.jpeg',
	'imageMagazine/image7.jpeg']);
});

function loadImages(imageUrls) {
    const container = document.getElementById('image-container');
    imageUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.appendChild(img);
    });
}
