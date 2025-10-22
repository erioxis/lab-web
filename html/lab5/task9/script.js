"use strict";

const delivery = document.getElementById("delivery");
const addressField = document.getElementById("address-field");

// Обработка чекбокса доставки
delivery.addEventListener("change", () => {
    addressField.style.display = delivery.checked ? "block" : "none";
});

function validate() {
    let valid = true;

    // Очистка предыдущих ошибок
    const errorElements = document.querySelectorAll('.error-message, .hint-message');
    const inputElements = document.querySelectorAll('.form-input, .form-select');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => el.classList.remove('error'));

    // Валидация логина
    const login = document.getElementById("login9").value.trim();
    const loginErr = document.getElementById("login-error");
    if (!login) {
        loginErr.textContent = "Логин обязателен для заполнения";
        document.getElementById("login9").classList.add("error");
        valid = false;
    } else if (login.length < 5 || login.length > 20) {
        loginErr.textContent = "Логин должен быть от 5 до 20 символов";
        document.getElementById("login9").classList.add("error");
        valid = false;
    }

    // Валидация пароля
    const pass = document.getElementById("password9").value.trim();
    const passErr = document.getElementById("pass-error");
    if (!pass) {
        passErr.textContent = "Пароль обязателен для заполнения";
        document.getElementById("password9").classList.add("error");
        valid = false;
    } else if (pass.length < 5 || pass.length > 12) {
        passErr.textContent = "Пароль должен быть от 5 до 12 символов";
        document.getElementById("password9").classList.add("error");
        valid = false;
    }

    // Подтверждение пароля
    const confirm = document.getElementById("confirm9").value.trim();
    const confirmErr = document.getElementById("confirm-error");
    if (pass !== confirm) {
        confirmErr.textContent = "Пароли не совпадают";
        document.getElementById("confirm9").classList.add("error");
        valid = false;
    }

    // Валидация возраста
    const age = document.getElementById("age9").value.trim();
    const ageErr = document.getElementById("age-error");
    const ageHint = document.getElementById("age-hint");
    
    if (!age) {
        ageErr.textContent = "Возраст обязателен для заполнения";
        document.getElementById("age9").classList.add("error");
        valid = false;
    } else {
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 14 || ageNum > 120) {
            if (isNaN(ageNum)) {
                ageErr.textContent = "Возраст должен быть числом";
            } else if (ageNum < 14) {
                ageErr.textContent = "Возраст слишком мал (минимум 14 лет)";
            } else {
                ageErr.textContent = "Возраст слишком велик (максимум 120 лет)";
            }
            document.getElementById("age9").classList.add("error");
            valid = false;
        } else {
            if (ageNum >= 14 && ageNum < 18) {
                ageHint.textContent = "⚠ Требуется согласие родителей";
            }
        }
    }

    // Валидация города
    const city = document.getElementById("city9").value;
    const cityErr = document.getElementById("city-error");
    if (!city) {
        cityErr.textContent = "Выберите город из списка";
        document.getElementById("city9").classList.add("error");
        valid = false;
    }

    return valid;
}

// Обработчик отправки формы
document.getElementById("form9").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validate()) {
        alert("✅ Форма успешно прошла валидацию и отправлена!");
        // Здесь можно добавить отправку данных на сервер
    }
});

// Очистка ошибок при изменении полей
const inputs = document.querySelectorAll('#form9 input, #form9 select');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorElement = document.getElementById(this.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});