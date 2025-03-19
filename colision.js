const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let destroyedCount = 0;
const counterElement = document.getElementById('counter');
let circles = [];
let lastSpawn = Date.now();

// Cargar imágenes
const efrainImage = new Image();
efrainImage.src = "img/efrain.jpg";
const fondoImage = new Image();
fondoImage.src = "img/fondo.jpg";

class Circle {
    constructor(x, y, radius, speedX, speedY, isSpecial = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.isSpecial = isSpecial;
    }

    draw() {
        if (this.isSpecial) {
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
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    update() {
        this.y += this.speedY;
        
        // Reiniciar posición al llegar al fondo
        if (this.y - this.radius > canvas.height) {
            this.y = -this.radius;
            this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.speedX = (Math.random() - 0.5) * 2;
        }
        
        this.draw();
    }
}

// Generar nuevos círculos continuamente
function spawnCircles() {
    const now = Date.now();
    if (now - lastSpawn > 1500) { // Generar cada 1.5 segundos
        lastSpawn = now;
        
        const radius = Math.floor(Math.random() * 31) + 20;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = -radius;
        const speedY = Math.random() * 2 + 1;
        
        // 30% de probabilidad de ser especial
        const isSpecial = Math.random() < 0.3;
        
        circles.push(new Circle(
            x,
            y,
            radius,
            (Math.random() - 0.5) * 2,
            speedY,
            isSpecial
        ));
    }
}

efrainImage.onload = () => {
    // Crear círculos iniciales
    for (let i = 0; i < 8; i++) {
        const radius = Math.floor(Math.random() * 31) + 20;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = -radius;
        const speedY = Math.random() * 2 + 1;
        
        circles.push(new Circle(
            x,
            y,
            radius,
            (Math.random() - 0.5) * 2,
            speedY,
            i === 0 // Primer círculo siempre especial
        ));
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
        }
    }
});

// Animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnCircles();
    circles.forEach(circle => circle.update());
    requestAnimationFrame(animate);
}

// Redimensionamiento
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});