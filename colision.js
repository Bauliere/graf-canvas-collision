const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let destroyedCount = 0;
const counterElement = document.getElementById('counter');
let circles = [];
const maxCircles = 10; // Número máximo de círculos en pantalla

// Cargar imagen
const efrainImage = new Image();
efrainImage.src = "img/efrain.jpg"; // Asegúrate de tener esta ruta correcta

class Circle {
    constructor(x, y, radius, speedY, isSpecial = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedY = speedY;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.isSpecial = isSpecial;
    }

    draw() {
        if (this.isSpecial) {
            // Dibujar imagen con clip circular
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
                efrainImage,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
            ctx.restore();
        } else {
            // Dibujar círculo normal
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    update() {
        this.y += this.speedY; // Solo movimiento vertical

        // Reiniciar posición al llegar al fondo
        if (this.y - this.radius > canvas.height) {
            this.y = -this.radius;
            this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.speedY = Math.random() * 2 + 1; // Nueva velocidad aleatoria
        }
        this.draw();
    }
}

// Crear un nuevo círculo
function createCircle() {
    const radius = Math.floor(Math.random() * 31) + 20; // 20-50px
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = -radius; // Iniciar arriba del canvas
    const speedY = Math.random() * 2 + 1; // Velocidad vertical: 1-3

    // Aumentar ligeramente la probabilidad de que sea especial (10% de probabilidad)
    const isSpecial = Math.random() < 0.1;

    circles.push(new Circle(x, y, radius, speedY, isSpecial));
}

// Iniciar después de cargar la imagen
efrainImage.onload = () => {
    // Crear círculos iniciales
    for (let i = 0; i < maxCircles; i++) {
        createCircle();
    }
    animate();
};

// Detección de clics
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const distancia = Math.sqrt(
            (mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2
        );
        
        if (distancia < circle.radius) {
            circles.splice(i, 1);
            destroyedCount++;
            counterElement.textContent = `Círculos eliminados: ${destroyedCount}`;
            createCircle(); // Crear un nuevo círculo al eliminar uno
        }
    }
});

// Animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Asegurar que siempre haya 10 círculos
    while (circles.length < maxCircles) {
        createCircle();
    }

    // Actualizar y dibujar círculos
    circles.forEach(circle => circle.update());
    requestAnimationFrame(animate);
}

// Redimensionamiento
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});