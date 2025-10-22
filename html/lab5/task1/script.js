"use strict";

let modalOpen = false;

setTimeout(() => {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  modalOpen = true;
}, 7000);

function closeModal() {
  document.getElementById("modal").style.display = "none";
  modalOpen = false;
}

document.getElementById("close-btn").addEventListener("click", closeModal);

document.getElementById("subscribe-btn").addEventListener("click", () => {
  const emailInput = document.getElementById("email-input");
  const errorEl = document.getElementById("email-error");
  const email = emailInput.value.trim();

  // Простая проверка email
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email) {
    errorEl.textContent = "Поле не заполнено.";
    emailInput.className = "modal-input error";
  } else if (!isValid) {
    errorEl.textContent = "Неверный формат e-mail.";
    emailInput.className = "modal-input error";
  } else {
    errorEl.textContent = "";
    emailInput.className = "modal-input";

    const successText = `Спасибо за подписку! На Ваш адрес ${email} будет направлено письмо`;
    document.querySelector(".modal-content").innerHTML = `<p style="font-size: 12px; margin: 20px 0;">${successText}</p>`;

    // Показ результата на основной странице
    document.getElementById("result").textContent = `Подписка выполнена на ${email}`;
    document.getElementById("result").style.display = "block";
    document.getElementById("result").className = "result-display correct";

    // Закрытие через 10 сек или по клику/esc
    let autoClose = setTimeout(closeModal, 10000);

    const handleModalClick = () => {
      clearTimeout(autoClose);
      closeModal();
    };

    document.getElementById("modal").addEventListener("click", (e) => {
      if (e.target === document.getElementById("modal")) {
        handleModalClick();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOpen) {
        clearTimeout(autoClose);
        closeModal();
      }
    });
  }
});

// Закрытие по клику вне модального окна
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal")) {
    closeModal();
  }
});