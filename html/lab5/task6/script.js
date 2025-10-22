"use strict";

const chars = {
    digits: "0123456789",
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            // Успешно
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (!successful) {
            alert("Не удалось скопировать. Попробуйте вручную.");
        }
    } catch (err) {
        alert("Ваш браузер не поддерживает копирование.");
    }
    document.body.removeChild(textArea);
}

document.getElementById("generate").addEventListener("click", () => {
    const length = parseInt(document.getElementById("length").value);
    const useDigits = document.getElementById("digits").checked;
    const useLower = document.getElementById("lower").checked;
    const useUpper = document.getElementById("upper").checked;
    const useSymbols = document.getElementById("symbols").checked;

    if (!useDigits && !useLower && !useUpper && !useSymbols) {
        alert("Выберите хотя бы один тип символов!");
        return;
    }

    if (length < 6 || length > 32) {
        alert("Длина пароля должна быть от 6 до 32 символов!");
        return;
    }

    let charset = "";
    if (useDigits) charset += chars.digits;
    if (useLower) charset += chars.lower;
    if (useUpper) charset += chars.upper;
    if (useSymbols) charset += chars.symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const output = document.getElementById("password-output");
    output.textContent = password;
    output.style.display = "block";

    const copyBtn = document.getElementById("copy-btn");
    copyBtn.style.display = "inline-block";
    copyBtn.disabled = false;

    // Сохраняем пароль для копирования
    copyBtn.onclick = () => {
        copyToClipboard(password);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Скопировано!";
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    };
});

// Обработка Enter в поле длины
document.getElementById("length").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("generate").click();
    }
});