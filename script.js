// Inisialisasi data stok dan penjualan sebagai array kosong
let stock = [];
let sales = [];

// Fungsi untuk menampilkan konten menu berdasarkan tombol yang diklik
function showMenuContent(index) {
    const menuContents = document.querySelectorAll('.menu-content');
    menuContents.forEach((content, i) => {
        content.style.display = i === index ? 'block' : 'none';
    });
}

// Inisialisasi menu button
document.querySelectorAll('.menu-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => showMenuContent(index));
});

// Fungsi untuk memperbarui daftar opsi jenis penjualan berdasarkan stok
function updateItemTypeOptions() {
    const itemTypeSelect = document.getElementById('itemType');
    itemTypeSelect.innerHTML = '<option value="">Pilih Jenis Penjualan</option>';

    stock.forEach(item => {
        const option = document.createElement('option');
        option.value = item.type;
        option.textContent = item.type;
        itemTypeSelect.appendChild(option);
    });
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('sales', JSON.stringify(sales));
}

// Fungsi untuk memuat data dari localStorage
function loadData() {
    const savedStock = localStorage.getItem('stock');
    const savedSales = localStorage.getItem('sales');

    if (savedStock) {
        stock = JSON.parse(savedStock);
    }

    if (savedSales) {
        sales = JSON.parse(savedSales);
    }

    // Pastikan stock dan sales selalu berupa array
    if (!Array.isArray(stock)) {
        stock = [];
    }

    if (!Array.isArray(sales)) {
        sales = [];
    }
}

// Fungsi untuk memperbarui tabel stok barang
function updateStockTable() {
    const stockTableBody = document.querySelector('#stockTable tbody');
    stockTableBody.innerHTML = '';

    stock.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${item.quantity}</td>
            <td>${item.remainingStock}</td>
            <td>
                <button class="delete-btn" data-type="${item.type}">Hapus</button>
            </td>
        `;
        stockTableBody.appendChild(row);
    });
}

// Fungsi untuk memperbarui tabel riwayat penjualan
function updateSalesTable() {
    const itemTableBody = document.querySelector('#itemTable tbody');
    itemTableBody.innerHTML = '';

    sales.forEach((sale, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.type}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price}</td>
            <td>${sale.paymentType}</td>
            <td>${sale.dateTime}</td>
            <td>${sale.totalPrice}</td>
            <td>
                <button class="delete-btn" data-index="${index}">Hapus</button>
            </td>
        `;
        itemTableBody.appendChild(row);
    });
}

// Fungsi untuk memperbarui tabel total penjualan
function updateTotalSalesTable() {
    const totalItems = document.getElementById('totalItems');
    totalItems.innerHTML = '';

    const totalSummary = sales.reduce((summary, sale) => {
        const existingItem = summary.find(item => item.type === sale.type);
        if (existingItem) {
            existingItem.quantity += sale.quantity;
            existingItem.totalPrice += sale.totalPrice;
        } else {
            summary.push({
                type: sale.type,
                quantity: sale.quantity,
                totalPrice: sale.totalPrice
            });
        }
        return summary;
    }, []);

    totalSummary.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${item.quantity}</td>
            <td>${item.totalPrice.toFixed(2)}</td>
        `;
        totalItems.appendChild(row);
    });

    const grandTotalElement = document.getElementById('grandTotal');
    const grandTotal = totalSummary.reduce((total, item) => total + item.totalPrice, 0);
    grandTotalElement.textContent = `Rp ${grandTotal.toLocaleString()}`;
}

// Event listener untuk penambahan penjualan
document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const type = document.getElementById('itemType').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const price = parseInt(document.getElementById('itemPrice').value);
    const paymentType = document.getElementById('paymentType').value;
    const dateTime = new Date().toLocaleString();
    const totalPrice = quantity * price;

    // Update stok barang
    const stockItem = stock.find(item => item.type === type);
    if (stockItem) {
        if (stockItem.remainingStock >= quantity) {
            stockItem.remainingStock -= quantity;
            sales.push({ type, quantity, price, paymentType, dateTime, totalPrice });
            saveData();
            updateSalesTable();
            updateTotalSalesTable();
            updateStockTable();
        } else {
            alert('Stok tidak mencukupi');
        }
    } else {
        alert('Jenis barang tidak ditemukan dalam stok');
    }
});

// Event listener untuk penambahan stok
document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const type = document.getElementById('stockType').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);

    const existingStock = stock.find(item => item.type === type);
    if (existingStock) {
        existingStock.quantity += quantity;
        existingStock.remainingStock += quantity;
    } else {
        stock.push({ type, quantity, remainingStock: quantity });
    }

    saveData();
    updateItemTypeOptions();
    updateStockTable();
});

// Event listener untuk menghapus penjualan
document.querySelector('#itemTable tbody').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');
        const sale = sales[index];

        // Mengembalikan stok barang
        const stockItem = stock.find(item => item.type === sale.type);
        if (stockItem) {
            stockItem.remainingStock += sale.quantity;
        }

        sales.splice(index, 1);
        saveData();
        updateSalesTable();
        updateTotalSalesTable();
        updateStockTable();
    }
});

// Event listener untuk menghapus stok
document.querySelector('#stockTable tbody').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const type = event.target.getAttribute('data-type');

        const stockIndex = stock.findIndex(item => item.type === type);
        if (stockIndex !== -1) {
            stock.splice(stockIndex, 1);
            saveData();
            updateItemTypeOptions();
            updateStockTable();
        }
    }
});

// Muat data dari localStorage saat halaman dimuat
window.addEventListener('load', function() {
    loadData();
    updateItemTypeOptions();
    updateSalesTable();
    updateTotalSalesTable();
    updateStockTable();
});

// Tampilkan konten menu input sebagai tampilan awal
showMenuContent(0);