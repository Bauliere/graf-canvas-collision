const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.originalColor = color; // Se guarda el color original
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.isColliding = false; // Bandera para saber si está en colisión
    }

    // Dibuja el círculo en el canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Actualiza la posición y rebota en los bordes
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY *= -1;
        }

        this.draw();
    }

    // Método para que este círculo choque con otro: intercambia velocidades
    collideWith(otherCircle) {
        let tempSpeedX = this.speedX;
        let tempSpeedY = this.speedY;
        this.speedX = otherCircle.speedX;
        this.speedY = otherCircle.speedY;
        otherCircle.speedX = tempSpeedX;
        otherCircle.speedY = tempSpeedY;
    }
}

// Crear 10 círculos con radios aleatorios (entre 20 y 50) y velocidades aleatorias entre 1 y 5
let circles = [];
for (let i = 0; i < 10; i++) {
    let radius = Math.floor(Math.random() * 31) + 20; // radio entre 20 y 50
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    let speedX = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
    let speedY = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
    circles.push(new Circle(x, y, radius, color, speedX, speedY));
}

// Función para detectar colisiones y hacer que los círculos choquen entre sí
function detectCollisions() {
    // Resetea la bandera de colisión en cada círculo
    circles.forEach(circle => circle.isColliding = false);

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let dx = circles[i].x - circles[j].x;
            let dy = circles[i].y - circles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circles[i].radius + circles[j].radius) {
                // Marcar ambos círculos como colisionando
                circles[i].isColliding = true;
                circles[j].isColliding = true;
                // Invocar el método collideWith para intercambiar velocidades
                circles[i].collideWith(circles[j]);
            }
        }
    }

    // Actualizar color: azul (#0000FF) si está en colisión, sino el color original
    circles.forEach(circle => {
        circle.color = circle.isColliding ? "#0000FF" : circle.originalColor;
    });
}

// Función de animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detectCollisions();
    circles.forEach(circle => circle.update());
    requestAnimationFrame(animate);
}

animate();


