"use strict";

let contacts = [];

function addContact() {
    const surname = document.getElementById("surname").value.trim();
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!surname || !name || !phone) {
        alert("Заполните все обязательные поля!");
        return;
    }

    contacts.push({ surname, name, age, phone });
    renderContacts(contacts);
    clearInputs();
}

function clearInputs() {
    document.getElementById("surname").value = "";
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("phone").value = "";
}

function renderContacts(list) {
    const tbody = document.getElementById("contacts-body");
    tbody.innerHTML = "";
    
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">Нет контактов для отображения</td>
            </tr>
        `;
        return;
    }
    
    list.forEach(contact => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${contact.surname}</td>
            <td>${contact.name}</td>
            <td>${contact.age || "—"}</td>
            <td>${contact.phone}</td>
        `;
        tbody.appendChild(tr);
    });
}

function applyFilter() {
    const filters = {
        surname: document.getElementById("filter-surname").value.toLowerCase(),
        name: document.getElementById("filter-name").value.toLowerCase(),
        age: document.getElementById("filter-age").value.toLowerCase(),
        phone: document.getElementById("filter-phone").value.toLowerCase(),
    };

    const filtered = contacts.filter(c => {
        return (
            (!filters.surname || c.surname.toLowerCase().includes(filters.surname)) &&
            (!filters.name || c.name.toLowerCase().includes(filters.name)) &&
            (!filters.age || (c.age && c.age.toString().includes(filters.age))) &&
            (!filters.phone || c.phone.toLowerCase().includes(filters.phone))
        );
    });

    renderContacts(filtered);
}

document.getElementById("add-contact").addEventListener("click", addContact);
document.getElementById("apply-filter").addEventListener("click", applyFilter);

// Обработка Enter в полях ввода
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (e.target.id === 'surname' || e.target.id === 'name' || 
            e.target.id === 'age' || e.target.id === 'phone') {
            addContact();
        }
    }
});

// Инициализация
renderContacts(contacts);