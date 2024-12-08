// Dummy data untuk UI
const rooms = [
  {
    room_number: "101",
    room_type: "Deluxe",
    price: 500000,
    status: "Available",
  },
  { room_number: "102", room_type: "Suite", price: 800000, status: "Booked" },
  {
    room_number: "103",
    room_type: "Standard",
    price: 300000,
    status: "Available",
  },
];

const guests = [
  {
    name: "John Doe",
    identity: "123456789",
    phone: "08123456789",
    email: "john@example.com",
  },
  {
    name: "Jane Smith",
    identity: "987654321",
    phone: "08198765432",
    email: "jane@example.com",
  },
];

const transactions = [
  { guest: "John Doe", amount: 500000, date: "2024-12-01" },
];

// Render data kamar
function renderRooms() {
  const roomList = document.getElementById("room-list");
  roomList.innerHTML = rooms
    .map(
      (room) => `
        <tr>
          <td class="border p-2">${room.room_number}</td>
          <td class="border p-2">${room.room_type}</td>
          <td class="border p-2">Rp ${room.price}</td>
          <td class="border p-2">${room.status}</td>
          <td class="border p-2">
            <button class="bg-yellow-500 text-white p-1 rounded">Edit</button>
          </td>
        </tr>
      `
    )
    .join("");
}

// Render data tamu
function renderGuests() {
  const guestList = document.getElementById("guest-list");
  guestList.innerHTML = guests
    .map(
      (guest) => `
        <tr>
          <td class="border p-2">${guest.name}</td>
          <td class="border p-2">${guest.identity}</td>
          <td class="border p-2">${guest.phone}</td>
          <td class="border p-2">${guest.email}</td>
          <td class="border p-2">
            <button class="bg-red-500 text-white p-1 rounded">Hapus</button>
          </td>
        </tr>
      `
    )
    .join("");
}

// Render data transaksi
function renderTransactions() {
  const transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = transactions
    .map(
      (transaction) => `
        <tr>
          <td class="border p-2">${transaction.guest}</td>
          <td class="border p-2">Rp ${transaction.amount}</td>
          <td class="border p-2">${transaction.date}</td>
        </tr>
      `
    )
    .join("");
}

// Inisialisasi data awal
document.addEventListener("DOMContentLoaded", () => {
  renderRooms();
  renderGuests();
  renderTransactions();
});
