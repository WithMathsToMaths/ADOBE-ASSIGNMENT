const canvas = document.getElementById('geometryCanvas');
const ctx = canvas.getContext('2d');
const statusBadge = document.getElementById('status');

// Circle properties
const circle = { x: 225, y: 200, radius: 90 };

// Mouse/Line properties (Default starting position)
let mouse = { x: 225, y: 70 };

// Track mouse movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    draw();
});

function drawGrid() {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    // 1. Draw the Main Circle
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
    ctx.fill();

    // 2. Draw Horizontal line controlled by Mouse Y
    const lineY = mouse.y;

    // 3. Math check: Distance from circle center to the line
    const distance = Math.abs(lineY - circle.y);

    // Determine state (giving a 3-pixel tolerance buffer to make it easy to find)
    let state = "secant";
    let lineColor = "#f43f5e"; // Non-tangent Red

    if (distance > circle.radius + 2) {
        state = "miss";
        lineColor = "#94a3b8"; // Muted Gray
    } else if (Math.abs(distance - circle.radius) <= 3) {
        state = "tangent";
        lineColor = "#10b981"; // Tangent Green
    }

    // Update UI Badges based on real-time data
    if (state === "tangent") {
        statusBadge.textContent = "🎯 Perfect Tangent!";
        statusBadge.className = "status-badge status-tangent";
        statusBadge.removeAttribute('style'); // Reset inline styles if any
    } else if (state === "secant") {
        statusBadge.textContent = "❌ Non-Tangent (Secant Line)";
        statusBadge.className = "status-badge status-secant";
        statusBadge.removeAttribute('style');
    } else {
        statusBadge.textContent = "❌ Non-Tangent (Misses Circle)";
        statusBadge.className = "status-badge status-secant";
        statusBadge.style.borderColor = "#94a3b8";
        statusBadge.style.color = "#94a3b8";
        statusBadge.style.backgroundColor = "transparent";
    }

    // 4. Draw the dynamic Line
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(canvas.width, lineY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // 5. Draw Intersection Points visually
    if (state === "tangent") {
        // Exactly one point at the top or bottom edge
        const intersectY = lineY > circle.y ? circle.y + circle.radius : circle.y - circle.radius;
        drawIntersectionPoint(circle.x, intersectY, "#10b981");
    } else if (state === "secant") {
        // Two intersection points using Pythagorean theorem
        const halfChord = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(distance, 2));
        drawIntersectionPoint(circle.x - halfChord, lineY, "#f43f5e");
        drawIntersectionPoint(circle.x + halfChord, lineY, "#f43f5e");
    }
}

function drawIntersectionPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Initial paint when the script runs
draw();
