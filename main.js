const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, ""); 
  if (input.startsWith("8")) {
    input = "7" + input.slice(1); 
  }
  if (!input.startsWith("7")) {
    input = "7" + input;
  }
  input = input.substring(0, 11); 

  let formatted = "+7";
  if (input.length > 1) {
    formatted += " (" + input.slice(1, 4);
  }
  if (input.length >= 5) {
    formatted += ") " + input.slice(4, 7);
  }
  if (input.length >= 8) {
    formatted += "-" + input.slice(7, 9);
  }
  if (input.length >= 10) {
    formatted += "-" + input.slice(9, 11);
  }

  e.target.value = formatted;
});


// --- 2. ФУНКЦИЯ ДЛЯ ПОКАЗА КРАСИВЫХ УВЕДОМЛЕНИЙ ---
function showNotification({ type = 'success', title, message }) {
    const container = document.getElementById('notification-container');
    if (!container) {
        console.error('Элемент #notification-container не найден на странице!');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icon = type === 'success' ? '✔' : '✖';

    toast.innerHTML = `
        <div class="toast__icon">${icon}</div>
        <div class="toast__body">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
        <div class="toast__progress"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast--hiding');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000); 
}


// --- 3. ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ (КОТОРЫЙ ВЫЗЫВАЕТ УВЕДОМЛЕНИЕ) ---
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const url = "https://script.google.com/macros/s/AKfycbw404dwPmZcZ3WpDVwL6Grrzj-Rsx7fuOx58hWZQZbbKyggZFhoC0wtGpSPVkybuJru/exec";

    fetch(url, { 
        method: "POST",
        body: new URLSearchParams(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            showNotification({
                type: 'success',
                title: 'Отлично!',
                message: 'Ваша анкета успешно отправлена.'
            });
            form.reset();
        } else {
            throw new Error(data.error || 'Неизвестная ошибка от сервера');
        }
    })
    .catch(error => {
        console.error("Ошибка отправки:", error);
        showNotification({
            type: 'error',
            title: 'Ошибка!',
            message: 'Не удалось отправить анкету. Попробуйте снова.'
        });
    });
});