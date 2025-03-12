const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Cargar la imagen desde la carpeta "img"
const efrainImage = new Image();
efrainImage.src = "img/efrain.jpg";

class Circle {
    constructor(x, y, radius, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.isColliding = false;  // Bandera para saber si está colisionando
    }

    // Método para dibujar la imagen con forma circular
    draw() {
        ctx.save();
        // Crear un clipping circular
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Dibujar la imagen escalada al tamaño del círculo
        ctx.drawImage(efrainImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        
        // Si está en colisión, aplicar un tinte azul con algo de transparencia
        if (this.isColliding) {
            ctx.fillStyle = "#0000FF";
            ctx.globalAlpha = 0.5;  // Ajusta la opacidad para el efecto deseado
            ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            ctx.globalAlpha = 1; // Restaurar la opacidad
        }
        ctx.restore();
    }

    // Actualiza la posición y verifica rebotes en los bordes
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote en los bordes horizontales
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX *= -1;
        }
        // Rebote en los bordes verticales
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY *= -1;
        }
        this.draw();
    }

    // Método para que este círculo colisione con otro: intercambia velocidades
    collideWith(otherCircle) {
        let tempSpeedX = this.speedX;
        let tempSpeedY = this.speedY;
        this.speedX = otherCircle.speedX;
        this.speedY = otherCircle.speedY;
        otherCircle.speedX = tempSpeedX;
        otherCircle.speedY = tempSpeedY;
    }
}

// Crear 10 círculos con tamaños aleatorios (radio entre 20 y 50) y velocidades entre 1 y 5
let circles = [];
for (let i = 0; i < 10; i++) {
    let radius = Math.floor(Math.random() * 31) + 20; // radio entre 20 y 50
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let speedX = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
    let speedY = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
    circles.push(new Circle(x, y, radius, speedX, speedY));
}

// Función para detectar colisiones entre los círculos
function detectCollisions() {
    // Reinicia la bandera de colisión en cada círculo
    circles.forEach(circle => circle.isColliding = false);

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let dx = circles[i].x - circles[j].x;
            let dy = circles[i].y - circles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circles[i].radius + circles[j].radius) {
                circles[i].isColliding = true;
                circles[j].isColliding = true;
                // Llamar al método para intercambiar velocidades (efecto de rebote)
                circles[i].collideWith(circles[j]);
            }
        }
    }
}

// Función de animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detectCollisions();
    circles.forEach(circle => circle.update());
    requestAnimationFrame(animate);
}

animate();
