"use strict";

function buildTable() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);

    if (rows < 1 || rows > 20 || cols < 1 || cols > 20) {
        alert("Числа должны быть от 1 до 20");
        return;
    }

    let tableHTML = "<table class='mult-table'><thead><tr><th>×</th>";
    
    // Заголовки столбцов
    for (let j = 1; j <= cols; j++) {
        tableHTML += `<th>${j}</th>`;
    }
    tableHTML += "</tr></thead><tbody>";
    
    // Тело таблицы
    for (let i = 1; i <= rows; i++) {
        tableHTML += `<tr><th>${i}</th>`;
        for (let j = 1; j <= cols; j++) {
            tableHTML += `<td data-row="${i}" data-col="${j}">${i * j}</td>`;
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</tbody></table>";

    document.getElementById("table-container").innerHTML = tableHTML;

    // Делегирование кликов
    document.getElementById("table-container").addEventListener("click", (e) => {
        if (e.target.tagName === "TD") {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;
            const val = e.target.textContent;
            document.getElementById("cell-info").textContent = 
                `Строка: ${row}\nСтолбец: ${col}\nЗначение: ${row} × ${col} = ${val}`;
            document.getElementById("modal-info").style.display = "flex";
        }
    });
}

document.getElementById("build-btn").addEventListener("click", buildTable);
document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal-info").style.display = "none";
});

// Закрытие модального окна по клику вне его
document.getElementById("modal-info").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-info")) {
        document.getElementById("modal-info").style.display = "none";
    }
});

// Обработка Enter в полях ввода
document.getElementById("rows").addEventListener("keydown", (e) => {
    if (e.key === "Enter") buildTable();
});
document.getElementById("cols").addEventListener("keydown", (e) => {
    if (e.key === "Enter") buildTable();
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', buildTable);