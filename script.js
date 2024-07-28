document.addEventListener('DOMContentLoaded', function () {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const menuContents = document.querySelectorAll('.menu-content');
    const itemForm = document.getElementById('itemForm');
    const itemTableBody = document.querySelector('#itemTable tbody');
    const totalItemsBody = document.getElementById('totalItems');
    const grandTotalElement = document.getElementById('grandTotal');

    let items = JSON.parse(localStorage.getItem('items')) || [];

    // Fungsi untuk menampilkan menu
    function showMenu(menuIndex) {
        menuContents.forEach((content, index) => {
            content.classList.toggle('active', index === menuIndex);
        });
    }

    // Tampilkan menu input sebagai default
    showMenu(0);

    menuButtons.forEach((button, index) => {
        button.addEventListener('click', () => showMenu(index));
    });

    // Fungsi untuk menambahkan item
    function addItem(event) {
        event.preventDefault();

        const itemType = document.getElementById('itemType').value;
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
        const itemPrice = parseInt(document.getElementById('itemPrice').value);
        const paymentType = document.getElementById('paymentType').value;
        const dateTime = new Date().toLocaleString();
        const totalPrice = itemQuantity * itemPrice;

        if (itemType && itemQuantity > 0 && itemPrice > 0 && paymentType) {
            const newItem = { itemType, itemQuantity, itemPrice, paymentType, dateTime, totalPrice };
            items.push(newItem);
            localStorage.setItem('items', JSON.stringify(items));
            updateTable();
            updateTotal();
            itemForm.reset();
            showMenu(1); // Tampilkan tabel setelah menambah item
        }
    }

    // Fungsi untuk mengupdate tabel
    function updateTable() {
        itemTableBody.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.itemType}</td>
                <td>${item.itemQuantity}</td>
                <td>Rp ${item.itemPrice.toLocaleString()}</td>
                <td>${item.paymentType}</td>
                <td>${item.dateTime}</td>
                <td>Rp ${item.totalPrice.toLocaleString()}</td>
                <td>
                    <button class="edit-btn" onclick="editItem(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${index})">Hapus</button>
                </td>
            `;
            itemTableBody.appendChild(row);
        });
    }

    // Fungsi untuk mengupdate total
    function updateTotal() {
        const summary = items.reduce((acc, item) => {
            acc[item.itemType] = (acc[item.itemType] || 0) + item.itemQuantity;
            acc[item.itemType + '_total'] = (acc[item.itemType + '_total'] || 0) + item.totalPrice;
            acc.total += item.totalPrice;
            return acc;
        }, { total: 0 });

        totalItemsBody.innerHTML = '';
        for (const [key, value] of Object.entries(summary)) {
            if (key !== 'total') {
                if (key.includes('_total')) {
                    const itemType = key.split('_total')[0];
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${itemType}</td>
                        <td>${summary[itemType]}</td>
                        <td>Rp ${value.toLocaleString()}</td>
                    `;
                    totalItemsBody.appendChild(row);
                }
            }
        }

        grandTotalElement.textContent = `Rp ${summary.total.toLocaleString()}`;
    }

    // Fungsi untuk menghapus item
    window.deleteItem = function (index) {
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        updateTable();
        updateTotal();
    };

    // Fungsi untuk mengedit item
    window.editItem = function (index) {
        const item = items[index];
        document.getElementById('itemType').value = item.itemType;
        document.getElementById('itemQuantity').value = item.itemQuantity;
        document.getElementById('itemPrice').value = item.itemPrice;
        document.getElementById('paymentType').value = item.paymentType;

        // Menghapus item yang sedang diedit dari list
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        updateTable();
        updateTotal();
        showMenu(0); // Kembali ke menu input
    };

    itemForm.addEventListener('submit', addItem);
    updateTable(); // Load data saat halaman dimuat
    updateTotal(); // Hitung total saat halaman dimuat
});