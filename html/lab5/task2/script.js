"use strict";

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-task");
const tasksList = document.getElementById("tasks-list");

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Современный способ (HTTPS / localhost)
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Не удалось скопировать:', err);
      fallbackCopyTextToClipboard(text);
    });
  } else {
    // Fallback для HTTP
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
    alert("Ваш браузер не поддерживает копирование. Скопируйте вручную.");
  }
  document.body.removeChild(textArea);
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = now.toLocaleString("ru-RU");

  const taskEl = document.createElement("div");
  taskEl.className = "task-item";
  taskEl.innerHTML = `
    <div class="task-meta">${timeStr}</div>
    <div class="task-text">${text}</div>
    <div class="task-actions">
      <button class="task-btn copy-btn">Копировать</button>
      <button class="task-btn delete-btn">Удалить</button>
    </div>
  `;

  tasksList.insertBefore(taskEl, tasksList.firstChild);
  taskInput.value = "";

  // Обработчики для кнопок
  taskEl.querySelector(".copy-btn").addEventListener("click", () => {
    copyToClipboard(text);
    // Визуальная обратная связь
    const btn = taskEl.querySelector(".copy-btn");
    const originalText = btn.textContent;
    btn.textContent = "Скопировано!";
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  });

  taskEl.querySelector(".delete-btn").addEventListener("click", () => {
    taskEl.remove();
  });
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    e.preventDefault();
    addTask();
  }
});