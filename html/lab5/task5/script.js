"use strict";

const display = document.getElementById("display");
const buttons = document.getElementById("calc-buttons");
const logBaseRow = document.getElementById("logBaseRow");
const logBaseInput = document.getElementById("logBase");
const logConfirm = document.getElementById("logConfirm");
const logCancel = document.getElementById("logCancel");
const historyList = document.getElementById("historyList");

let currentInput = "0";
let previousInput = null;
let operation = null;
let resetOnNextInput = false;
let awaitingLogBase = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function addToHistory(expression, result) {
    // Убираем сообщение о пустой истории
    if (historyList.querySelector('.empty-history')) {
        historyList.innerHTML = '';
    }
    
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `<span>${expression}</span> = <span class="result">${result}</span>`;
    historyList.prepend(item);
}

function inputDigit(digit) {
    if (resetOnNextInput) {
        currentInput = "0";
        resetOnNextInput = false;
    }
    if (currentInput === "0" && digit !== ".") {
        currentInput = digit;
    } else {
        if (digit === "." && currentInput.includes(".")) return;
        currentInput += digit;
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentInput === "Ошибка") return;

    const current = parseFloat(currentInput);
    if (isNaN(current)) return;

    if (previousInput === null) {
        previousInput = current;
    } else if (operation) {
        const result = calculate();
        if (result !== null) {
            previousInput = result;
            currentInput = String(result);
            addToHistory(`${previousInput} ${getOpSymbol(operation)} ${current}`, result);
        }
    }

    operation = op;
    resetOnNextInput = true;
}

function calculate() {
    if (previousInput === null || operation === null) return parseFloat(currentInput);

    const current = parseFloat(currentInput);
    if (isNaN(current)) return null;

    let result;
    switch (operation) {
        case "+": result = previousInput + current; break;
        case "-": result = previousInput - current; break;
        case "*": result = previousInput * current; break;
        case "/":
            if (current === 0) {
                showError("Деление на ноль!");
                return null;
            }
            result = previousInput / current;
            break;
        default: return current;
    }
    return result;
}

function computeResult() {
    if (currentInput === "Ошибка") return;
    if (operation === null) return;

    const current = parseFloat(currentInput);
    if (isNaN(current)) return;

    const result = calculate();
    if (result !== null) {
        const expr = `${previousInput} ${getOpSymbol(operation)} ${current}`;
        currentInput = String(result);
        addToHistory(expr, result);
        operation = null;
        previousInput = null;
        resetOnNextInput = true;
        updateDisplay();
    }
}

function getOpSymbol(op) {
    const map = { "+": "+", "-": "−", "*": "×", "/": "÷" };
    return map[op] || op;
}

// === Функции: sqrt и log ===

function applySqrt() {
    if (currentInput === "Ошибка") return;
    const num = parseFloat(currentInput);
    if (isNaN(num)) return;

    if (num < 0) {
        showError("√: аргумент ≥ 0");
        return;
    }

    const result = Math.sqrt(num);
    const expr = `√(${num})`;
    currentInput = String(result);
    resetOnNextInput = true;
    updateDisplay();
    addToHistory(expr, result);
}

function startLog() {
    if (currentInput === "Ошибка") return;
    const num = parseFloat(currentInput);
    if (isNaN(num)) {
        showError("Введите число для log");
        return;
    }
    if (num <= 0) {
        showError("log: аргумент > 0");
        return;
    }

    window.logArgument = num;
    awaitingLogBase = true;

    logBaseRow.style.display = "flex";
    logBaseInput.value = "";
    logBaseInput.focus();
}

function confirmLog() {
    const baseStr = logBaseInput.value.trim();
    const base = baseStr === "" ? 10 : parseFloat(baseStr);

    if (isNaN(base)) {
        showError("Основание — число");
        return;
    }
    if (base <= 0 || base === 1) {
        showError("Основание > 0 и ≠ 1");
        return;
    }

    const arg = window.logArgument;
    const result = Math.log(arg) / Math.log(base);
    const expr = baseStr === "" ? `log₁₀(${arg})` : `log_${base}(${arg})`;

    currentInput = String(result);
    resetOnNextInput = true;
    updateDisplay();
    addToHistory(expr, result);

    logBaseRow.style.display = "none";
    awaitingLogBase = false;
    delete window.logArgument;
}

function cancelLog() {
    logBaseRow.style.display = "none";
    awaitingLogBase = false;
    delete window.logArgument;
}

// === Общие функции ===

function showError(message) {
    currentInput = "Ошибка";
    updateDisplay();
    setTimeout(() => {
        if (currentInput === "Ошибка") {
            currentInput = "0";
            updateDisplay();
        }
    }, 2000);
}

function clearAll() {
    currentInput = "0";
    previousInput = null;
    operation = null;
    resetOnNextInput = false;
    if (awaitingLogBase) cancelLog();
    updateDisplay();
}

function deleteLastChar() {
    if (currentInput === "Ошибка") {
        clearAll();
        return;
    }
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith("-"))) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// === Обработка событий ===

buttons.addEventListener("click", (e) => {
    if (awaitingLogBase) return;
    const btn = e.target;
    if (!btn.classList.contains("calc-btn")) return;

    if (btn.dataset.digit !== undefined) {
        inputDigit(btn.dataset.digit);
    } else if (btn.dataset.op) {
        chooseOperation(btn.dataset.op);
    } else if (btn.dataset.action === "equals") {
        computeResult();
    } else if (btn.dataset.action === "clear") {
        clearAll();
    } else if (btn.dataset.action === "back") {
        deleteLastChar();
    } else if (btn.dataset.action === "decimal") {
        inputDigit(".");
    } else if (btn.dataset.func === "sqrt") {
        applySqrt();
    } else if (btn.dataset.func === "log") {
        startLog();
    }
});

// Обработка OK/Отмена для логарифма
logConfirm.addEventListener("click", confirmLog);
logCancel.addEventListener("click", cancelLog);

logBaseInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmLog();
    if (e.key === "Escape") cancelLog();
});

document.getElementById("clearHistory").addEventListener("click", () => {
    historyList.innerHTML = '<div class="empty-history">История операций пуста</div>';
});

// Инициализация
updateDisplay();