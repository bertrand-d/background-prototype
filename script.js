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
var hoveredRect = null; // Rectangle survolé

//Variable pour suivre le temps écoulé depuis le début du survol
var hoverTime = 0;

//Constante pour spécifier la durée de la transition
const transitionDuration = 1000;

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

// Variable pour suivre l'état précédent du rectangle survolé
var previousHoveredRect = null;

// Fonction pour détecter le survol des rectangles
canvas.addEventListener('mousemove', function (event) {
    var mouseX = event.offsetX;
    var mouseY = event.offsetY;

    // Variable pour savoir si un rectangle est déjà survolé et empêcher l'animation de se reproduire au moindre mouvement de la souris
    var foundHoveredRect = null; 

    // Parcourir tous les rectangles pour détecter le survol
    for (var i = 0; i < rectsPerRow; i++) {
        for (var j = 0; j < canvas.height / (rectSize + gap); j++) {
            var rectX = i * (rectSize + gap);
            var rectY = j * (rectSize + gap);

            // Vérifier si la souris est sur ce rectangle
            if (mouseX > rectX && mouseX < rectX + rectSize && mouseY > rectY && mouseY < rectY + rectSize) {
                hoveredRect = { x: rectX, y: rectY };
                foundHoveredRect = hoveredRect;
            }
        }
    }

    if (!foundHoveredRect) {
        hoverTime = 0;
        // Si aucun rectangle n'est survolé, mettre à jour previousHoveredRect
        previousHoveredRect = hoveredRect;
    }
});

// Fonction pour dessiner le rectangle survolé
function drawHoveredRect() {
    if (hoveredRect) {
        var hoverColor = "#9000bb";
        var hoveredRectX = hoveredRect.x;
        var hoveredRectY = hoveredRect.y;

        ctx.fillStyle = hoverColor;
        ctx.fillRect(hoveredRectX, hoveredRectY, rectSize, rectSize);
    }
}

//Fonction pour dessiner le précédent rectangle survolé
function drawPreviousHoveredRect() {
    if (previousHoveredRect) {
        var previousHoveredRectX = previousHoveredRect.x;
        var previousHoveredRectY = previousHoveredRect.y;

        ctx.fillStyle = rectColors;

        // Calculer le pourcentage du temps écoulé par rapport à la durée de la transition
        var progress = Math.min(hoverTime / transitionDuration, 1);

        const colorStart = [144, 0, 187]; // violet
        const colorEnd = [11,11,11]; // Bleu

        // Calculer la couleur de transition pour cette étape
        var r = Math.round(colorStart[0] + (colorEnd[0] - colorStart[0]) * progress);
        var g = Math.round(colorStart[1] + (colorEnd[1] - colorStart[1]) * progress);
        var b = Math.round(colorStart[2] + (colorEnd[2] - colorStart[2]) * progress);
        var color = 'rgb(' + r + ',' + g + ',' + b + ')';

        // Dessiner le rectangle avec la couleur de transition
        ctx.fillStyle = color;
        ctx.fillRect(previousHoveredRectX, previousHoveredRectY, rectSize, rectSize);

        // Incrémenter le temps écoulé
        hoverTime += 1000 / 60; // Temps écoulé depuis la dernière trame (en millisecondes)
    }
}

// Fonction principale d'animation
function animate() {
    drawBackground();
    drawRects();
    drawHoveredRect();
    drawPreviousHoveredRect();
    animateBackground();
    requestAnimationFrame(animate);
}

// Démarrer l'animation
animate();