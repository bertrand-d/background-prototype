// Récupérer le contexte du canvas
var canvas = document.getElementById('gridCanvas');
var ctx = canvas.getContext('2d');

// Définir la taille du canvas en fonction de la taille de l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ajoutez une variable pour suivre le temps écoulé depuis le début du survol
var hoverTime = 0;

// Ajoutez une constante pour spécifier la durée de la transition en millisecondes
const transitionDuration = 300; // 0.3 seconde

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

// Variables pour suivre l'état précédent du rectangle survolé
var previousHoveredRect = null;

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
                // Vérifier si le rectangle survolé est différent du précédent
                if (hoveredRect !== previousHoveredRect || !previousHoveredRect) {
                    // Réinitialiser le temps écoulé et mettre à jour le rectangle survolé
                    hoverTime = 0;
                    hoveredRect = { x: rectX, y: rectY, color: '#0B0B0B' }; // Couleur de base du rectangle
                    previousHoveredRect = hoveredRect;
                }
                return;
            }
        }
    }

    // Si aucun rectangle n'est survolé
    hoveredRect = null;
    previousHoveredRect = null;
});

// Fonction pour mettre à jour progressivement la couleur du rectangle survolé
function updateHoveredRectColor() {
    if (hoveredRect) {
        // Calculer le pourcentage du temps écoulé par rapport à la durée de la transition
        var progress = Math.min(hoverTime / transitionDuration, 1);

        // Interpoler entre la couleur de base et la couleur de survol
        var r = Math.round(11 + (144 - 11) * progress); // Rouge
        var g = Math.round(11 + (0 - 11) * progress);   // Vert
        var b = Math.round(11 + (187 - 11) * progress); // Bleu

        // Mettre à jour la couleur du rectangle survolé
        hoveredRect.color = 'rgb(' + r + ',' + g + ',' + b + ')';

        // Incrémenter le temps écoulé
        hoverTime += 1000 / 60; // Temps écoulé depuis la dernière trame (en millisecondes)
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