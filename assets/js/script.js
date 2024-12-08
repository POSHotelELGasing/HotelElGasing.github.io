// Fungsi untuk menampilkan kamar
function updateDashboard() {
  const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  document.getElementById('total-rooms').textContent = rooms.length;
  document.getElementById('total-guests').textContent = guests.length;
  document.getElementById('total-transactions').textContent = transactions.length;
  
  // Menampilkan total pendapatan dari transaksi
  const totalRevenue = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
  document.getElementById('total-revenue').textContent = `Rp ${totalRevenue.toLocaleString()}`;
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
  displayRooms();
  displayGuests();
  displayTransactions();
});

// Fungsi untuk menampilkan kamar
function displayRooms() {
  const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
  const roomList = document.getElementById('room-list');
  roomList.innerHTML = '';

  rooms.forEach(room => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${room.number}</td>
      <td class="border p-2">${room.type}</td>
      <td class="border p-2">${room.price}</td>
      <td class="border p-2">${room.status}</td>
      <td class="border p-2">
        <button class="bg-blue-600 text-white p-2 rounded" onclick="editRoom(${room.id})">Edit</button>
        <button class="bg-red-600 text-white p-2 rounded" onclick="deleteRoom(${room.id})">Hapus</button>
      </td>
    `;
    roomList.appendChild(row);
  });
}

// Fungsi untuk menambah kamar
function addRoom(room) {
  const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
  rooms.push(room);
  localStorage.setItem('rooms', JSON.stringify(rooms));
  displayRooms();
}

// Fungsi untuk menghapus kamar
function deleteRoom(id) {
  let rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
  rooms = rooms.filter(room => room.id !== id);
  localStorage.setItem('rooms', JSON.stringify(rooms));
  displayRooms();
}

// Fungsi untuk mengedit kamar
function editRoom(id) {
  let rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
  const room = rooms.find(room => room.id === id);

  if (room) {
    document.getElementById('room-number').value = room.number;
    document.getElementById('room-type').value = room.type;
    document.getElementById('room-price').value = room.price;
    document.getElementById('room-status').value = room.status;
  }
}

// Event listener untuk form penambahan kamar
document.getElementById('add-room-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const number = document.getElementById('room-number').value;
  const type = document.getElementById('room-type').value;
  const price = document.getElementById('room-price').value;
  const status = document.getElementById('room-status').value;

  const newRoom = {
    id: Date.now(),
    number,
    type,
    price,
    status
  };

  addRoom(newRoom);
  this.reset();
});

// Fungsi untuk menampilkan tamu
function displayGuests() {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const guestList = document.getElementById('guest-list');
  guestList.innerHTML = '';

  guests.forEach(guest => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${guest.name}</td>
      <td class="border p-2">${guest.id}</td>
      <td class="border p-2">${guest.phone}</td>
      <td class="border p-2">${guest.email}</td>
      <td class="border p-2">
        <button class="bg-blue-600 text-white p-2 rounded" onclick="editGuest(${guest.id})">Edit</button>
        <button class="bg-red-600 text-white p-2 rounded" onclick="deleteGuest(${guest.id})">Hapus</button>
      </td>
    `;
    guestList.appendChild(row);
  });
}

// Fungsi untuk menambah tamu
function addGuest(guest) {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  guests.push(guest);
  localStorage.setItem('guests', JSON.stringify(guests));
  displayGuests();
}

// Fungsi untuk menghapus tamu
function deleteGuest(id) {
  let guests = JSON.parse(localStorage.getItem('guests') || '[]');
  guests = guests.filter(guest => guest.id !== id);
  localStorage.setItem('guests', JSON.stringify(guests));
  displayGuests();
}

// Fungsi untuk mengedit tamu
function editGuest(id) {
  let guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const guest = guests.find(g => g.id === id);

  if (guest) {
    document.getElementById('guest-name').value = guest.name;
    document.getElementById('guest-id-number').value = guest.idNumber;
    document.getElementById('guest-phone').value = guest.phone;
    document.getElementById('guest-email').value = guest.email;
  }
}

// Event listener untuk form penambahan tamu
document.getElementById('add-guest-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('guest-name').value;
  const idNumber = document.getElementById('guest-id-number').value;
  const phone = document.getElementById('guest-phone').value;
  const email = document.getElementById('guest-email').value;

  const newGuest = {
    id: Date.now(),
    name,
    idNumber,
    phone,
    email
  };

  addGuest(newGuest);
  this.reset();
});

// Fungsi untuk menampilkan transaksi
function displayTransactions() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';

  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    
    const guests = JSON.parse(localStorage.getItem('guests') || '[]');
    const guest = guests.find(g => g.id === transaction.guestId);
    const guestName = guest ? guest.name : 'Tamu Tidak Ditemukan';

    row.innerHTML = `
      <td class="border p-2">${guestName}</td>
      <td class="border p-2">${transaction.amount}</td>
      <td class="border p-2">${transaction.date}</td>
    `;
    transactionList.appendChild(row);
  });
}

// Fungsi untuk menambah transaksi
function addTransaction(transaction) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  displayTransactions();
  updateDashboard(); // Update dashboard setelah menambah transaksi
}

// Event listener untuk form transaksi
document.getElementById('transaction-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const guestId = document.getElementById('transaction-guest').value;
  const amount = document.getElementById('transaction-amount').value;
  const date = new Date().toLocaleString();

  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const guest = guests.find(g => g.id === parseInt(guestId));

  if (!guest) {
    alert('Tamu tidak ditemukan!');
    return;
  }

  const newTransaction = {
    guestId: parseInt(guestId),
    amount,
    date
  };

  addTransaction(newTransaction);
  this.reset();
});

// Fungsi untuk memuat daftar tamu pada dropdown transaksi
function loadGuestOptions() {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const guestSelect = document.getElementById('transaction-guest');
  
  guests.forEach(guest => {
    const option = document.createElement('option');
    option.value = guest.id;
    option.textContent = guest.name;
    guestSelect.appendChild(option);
  });
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadGuestOptions);
