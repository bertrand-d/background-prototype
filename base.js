// Récupérer le contexte du canvas
var canvas = document.getElementById('gridCanvas');
var ctx = canvas.getContext('2d');

// Définir la taille du canvas en fonction de la taille de l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables pour la bande en arrière-plan
var bandPosY = - window.innerHeight / 2;
var bandSpeed = 2;

// Variables pour la grille de rectangles
var rectSize = 100;
var gap = 5;
var rectsPerRow = Math.floor(canvas.width);
var rectColors = '#0B0B0B'; // Couleurs des rectangles
var hoveredRect = null; // Rectangle survolé (null si aucun)

// Fonction pour dessiner la bande en arrière-plan
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Créer le dégradé linéaire
    var gradient = ctx.createLinearGradient(
        0, bandPosY,
        0, bandPosY + (window.innerHeight / 2)
    );
    gradient.addColorStop(0, 'black'); // Couleur de départ
    gradient.addColorStop(0.5, '#9000bb'); // Couleur intermédiaire
    gradient.addColorStop(1, 'black'); // Couleur de fin

    // Dessiner la bande avec le dégradé de couleur
    ctx.fillStyle = gradient;
    ctx.fillRect(0, bandPosY, canvas.width, window.innerHeight / 2);
}

// Fonction pour dessiner la grille de rectangles
function drawRects() {
    for (var i = 0; i < rectsPerRow; i++) {
        for (var j = 0; j < canvas.height / (rectSize + gap); j++) {
            var rectX = i * (rectSize + gap);
            var rectY = j * (rectSize + gap);

            // Dessiner le rectangle
            ctx.fillStyle = rectColors;
            ctx.fillRect(rectX, rectY, rectSize, rectSize);
        }
    }
}

// Fonction pour animer la bande en arrière-plan
function animateBackground() {
    bandPosY += bandSpeed;
    if (bandPosY > canvas.height) {
        bandPosY = - window.innerHeight / 2; // Réinitialiser la position de la bande en haut du canvas
    }
}

// Fonction pour détecter le survol des rectangles
canvas.addEventListener('mousemove', function (event) {
    var mouseX = event.offsetX;
    var mouseY = event.offsetY;

    // Parcourir tous les rectangles pour détecter le survol
    for (var i = 0; i < rectsPerRow; i++) {
        for (var j = 0; j < canvas.height / (rectSize + gap); j++) {
            var rectX = i * (rectSize + gap);
            var rectY = j * (rectSize + gap);

            // Vérifier si la souris est sur ce rectangle
            if (mouseX > rectX && mouseX < rectX + rectSize && mouseY > rectY && mouseY < rectY + rectSize) {
                // Rectangle survolé
                hoveredRect = { x: rectX, y: rectY };
                return;
            }
        }
    }

    // Si aucun rectangle n'est survolé
    hoveredRect = null;
});

// Fonction pour dessiner le rectangle survolé
function drawHoveredRect() {
    if (hoveredRect) {
        var hoverColor = "#9000bb"; // Couleur de survol "#9000bb"
        var hoveredRectX = hoveredRect.x;
        var hoveredRectY = hoveredRect.y;

        // Dessiner le rectangle avec la couleur de survol
        ctx.fillStyle = hoverColor;
        ctx.fillRect(hoveredRectX, hoveredRectY, rectSize, rectSize);
    }
}

// Fonction principale d'animation
function animate() {
    drawBackground();
    drawRects();
    drawHoveredRect();
    animateBackground();
    requestAnimationFrame(animate);
}

// Démarrer l'animation
animate();