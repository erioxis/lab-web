"use strict";

const colors = [
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
    "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50"
];

const grid = document.getElementById("grid");
const tableBody = document.querySelector("#color-table tbody");

// Создаём сетку
for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function colorize() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.backgroundColor = getRandomColor();
    });
    updateColorCount();
}

function updateColorCount() {
    const counts = {};
    document.querySelectorAll(".cell").forEach(cell => {
        const bg = getComputedStyle(cell).backgroundColor;
        // Нормализуем цвета: белый и чёрный — по имени
        let colorName;
        if (bg === "rgb(255, 255, 255)" || bg === "white") {
            colorName = "white";
        } else if (bg === "rgb(0, 0, 0)" || bg === "black") {
            colorName = "black";
        } else {
            colorName = bg; // например: rgb(52, 152, 219)
        }
        counts[colorName] = (counts[colorName] || 0) + 1;
    });

    tableBody.innerHTML = "";
    for (const [color, count] of Object.entries(counts)) {
        const row = document.createElement("tr");
        const displayColor = color === "white" ? "white" : color === "black" ? "black" : color;
        row.innerHTML = `
            <td>
                <span class="color-sample" style="background:${displayColor}"></span>
                ${color === "white" ? "Белый" : color === "black" ? "Черный" : "Цветной"}
            </td>
            <td>${count}</td>
        `;
        tableBody.appendChild(row);
    }
}

document.getElementById("colorize-btn").addEventListener("click", colorize);

// Используем mousedown вместо click
grid.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("cell")) return;

    if (e.button === 0) {
        // Левая кнопка — белый
        e.target.style.backgroundColor = "white";
        e.preventDefault();
    } else if (e.button === 2) {
        // Правая кнопка — чёрный
        e.target.style.backgroundColor = "black";
        e.preventDefault();
    }
    updateColorCount();
});

// Отключаем контекстное меню на всей сетке
grid.addEventListener("contextmenu", (e) => {
    if (e.target.classList.contains("cell")) {
        e.preventDefault();
    }
});

// Инициализируем таблицу при загрузке
document.addEventListener('DOMContentLoaded', updateColorCount);