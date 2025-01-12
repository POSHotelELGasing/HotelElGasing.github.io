// Konfigurasi Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4BKM35Qy-rf0dlfqiqyWzs9AwUZq0ojA",
  authDomain: "prog4-34938.firebaseapp.com",
  projectId: "prog4-34938",
  storageBucket: "prog4-34938.firebasestorage.app",
  messagingSenderId: "920234132726",
  appId: "1:920234132726:web:4439c637de33ddf4f3d8d7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Event handler untuk Registrasi
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const phone = document.getElementById("regPhone").value;
    const password = document.getElementById("regPassword").value;

    // Daftar pengguna menggunakan Firebase Authentication
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Simpan data pengguna ke Firestore
        db.collection("users").doc(user.uid).set({
          username: username,
          email: email,
          phone: phone,
        });

        alert("Registrasi berhasil! Silakan login.");
      })
      .catch((error) => {
        alert(error.message);
      });
  });

// Event handler untuk Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const loginUsername = document.getElementById("loginUsername").value;
  const loginPassword = document.getElementById("loginPassword").value;

  // Login menggunakan Firebase Authentication
  auth
    .signInWithEmailAndPassword(loginUsername, loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;

      // Mendapatkan data pengguna dari Firestore
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Set data pengguna saat login
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(doc.data()));
            window.location.href = "./employee.html";
          }
        });
    })
    .catch((error) => {
      alert("Nama pengguna atau kata sandi salah!");
    });
});

// Fungsi untuk menampilkan kamar
function updateDashboard() {
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

  document.getElementById("total-rooms").textContent = rooms.length;
  document.getElementById("total-guests").textContent = guests.length;
  document.getElementById("total-transactions").textContent =
    transactions.length;

  // Menampilkan total pendapatan dari transaksi
  const totalRevenue = transactions.reduce(
    (sum, transaction) => sum + parseFloat(transaction.amount),
    0
  );
  document.getElementById(
    "total-revenue"
  ).textContent = `Rp ${totalRevenue.toLocaleString()}`;
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  displayRooms();
  displayGuests();
  displayTransactions();
});

// Fungsi untuk menampilkan kamar
function displayRooms() {
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  const roomList = document.getElementById("room-list");
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const row = document.createElement("tr");
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
  const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  rooms.push(room);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  displayRooms();
}

// Fungsi untuk menghapus kamar
function deleteRoom(id) {
  let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  rooms = rooms.filter((room) => room.id !== id);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  displayRooms();
}

// Fungsi untuk mengedit kamar
function editRoom(id) {
  let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
  const room = rooms.find((room) => room.id === id);

  if (room) {
    document.getElementById("room-number").value = room.number;
    document.getElementById("room-type").value = room.type;
    document.getElementById("room-price").value = room.price;
    document.getElementById("room-status").value = room.status;
  }
}

// Event listener untuk form penambahan kamar
document
  .getElementById("add-room-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const number = document.getElementById("room-number").value;
    const type = document.getElementById("room-type").value;
    const price = document.getElementById("room-price").value;
    const status = document.getElementById("room-status").value;

    const newRoom = {
      id: Date.now(),
      number,
      type,
      price,
      status,
    };

    addRoom(newRoom);
    this.reset();
  });

// Fungsi untuk menampilkan tamu
function displayGuests() {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  const guestCards = document.getElementById("guest-cards");
  guestCards.innerHTML = "";

  guests.forEach((guest) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow rounded p-4";
    card.innerHTML = `
      <h3 class="text-lg font-bold mb-2">${guest.name}</h3>
      <p><strong>ID:</strong> ${guest.id}</p>
      <p><strong>Telepon:</strong> ${guest.phone}</p>
      <p><strong>Email:</strong> ${guest.email}</p>
      <div class="flex mt-4 space-x-2">
        <button class="bg-blue-600 text-white px-4 py-2 rounded" onclick="editGuest(${guest.id})">Edit</button>
        <button class="bg-red-600 text-white px-4 py-2 rounded" onclick="deleteGuest(${guest.id})">Hapus</button>
      </div>
    `;
    guestCards.appendChild(card);
  });
}

// Fungsi untuk menambah tamu
function addGuest(guest) {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  guests.push(guest);
  localStorage.setItem("guests", JSON.stringify(guests));
  displayGuests();
}

// Fungsi untuk menghapus tamu
function deleteGuest(id) {
  let guests = JSON.parse(localStorage.getItem("guests") || "[]");
  guests = guests.filter((guest) => guest.id !== id);
  localStorage.setItem("guests", JSON.stringify(guests));
  displayGuests();
}

// Fungsi untuk mengedit tamu
function editGuest(id) {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  const guest = guests.find((g) => g.id === id);

  if (guest) {
    document.getElementById("guest-name").value = guest.name;
    document.getElementById("guest-id-number").value = guest.id; // Sesuaikan jika diperlukan
    document.getElementById("guest-phone").value = guest.phone;
    document.getElementById("guest-email").value = guest.email;
  }
}

// Event listener untuk form penambahan tamu
document
  .getElementById("add-guest-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("guest-name").value;
    const idNumber = document.getElementById("guest-id-number").value;
    const phone = document.getElementById("guest-phone").value;
    const email = document.getElementById("guest-email").value;

    const newGuest = {
      id: Date.now(),
      name,
      idNumber,
      phone,
      email,
    };

    addGuest(newGuest);
    this.reset();
  });

// Inisialisasi awal
displayGuests();

// Fungsi untuk menampilkan transaksi
function displayTransactions() {
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const guests = JSON.parse(localStorage.getItem("guests") || "[]");
    const guest = guests.find((g) => g.id === transaction.guestId);
    const guestName = guest ? guest.name : "Tamu Tidak Ditemukan";

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
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  displayTransactions();
  updateDashboard(); // Update dashboard setelah menambah transaksi
}

// Event listener untuk form transaksi
document
  .getElementById("transaction-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const guestId = document.getElementById("transaction-guest").value;
    const amount = document.getElementById("transaction-amount").value;
    const date = new Date().toLocaleString();

    const guests = JSON.parse(localStorage.getItem("guests") || "[]");
    const guest = guests.find((g) => g.id === parseInt(guestId));

    if (!guest) {
      alert("Tamu tidak ditemukan!");
      return;
    }

    const newTransaction = {
      guestId: parseInt(guestId),
      amount,
      date,
    };

    addTransaction(newTransaction);
    this.reset();
  });

// Fungsi untuk memuat daftar tamu pada dropdown transaksi
function loadGuestOptions() {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  const guestSelect = document.getElementById("transaction-guest");

  guests.forEach((guest) => {
    const option = document.createElement("option");
    option.value = guest.id;
    option.textContent = guest.name;
    guestSelect.appendChild(option);
  });
}

// Menampilkan modal edit
function editGuest(id) {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  const guest = guests.find((g) => g.id === id);

  if (guest) {
    document.getElementById("edit-guest-id").value = guest.id;
    document.getElementById("edit-guest-name").value = guest.name;
    document.getElementById("edit-guest-idcard").value = guest.idCard;
    document.getElementById("edit-guest-phone").value = guest.phone;
    document.getElementById("edit-guest-email").value = guest.email;

    const editGuestModal = document.getElementById("edit-guest-modal");
    editGuestModal.classList.remove("hidden", "opacity-0", "scale-95");
    editGuestModal.classList.add("opacity-100", "scale-100");
  }
}

// Menutup modal edit
document
  .getElementById("close-edit-guest-modal")
  .addEventListener("click", () => {
    const editGuestModal = document.getElementById("edit-guest-modal");
    editGuestModal.classList.remove("opacity-100", "scale-100");
    editGuestModal.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      editGuestModal.classList.add("hidden");
    }, 300);
  });

// Menyimpan perubahan data tamu
document.getElementById("edit-guest-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById("edit-guest-id").value, 10);
  const name = document.getElementById("edit-guest-name").value;
  const idCard = document.getElementById("edit-guest-idcard").value;
  const phone = document.getElementById("edit-guest-phone").value;
  const email = document.getElementById("edit-guest-email").value;

  let guests = JSON.parse(localStorage.getItem("guests") || "[]");
  guests = guests.map((guest) => {
    if (guest.id === id) {
      return { ...guest, name, idCard, phone, email };
    }
    return guest;
  });

  localStorage.setItem("guests", JSON.stringify(guests));
  displayGuests();

  const editGuestModal = document.getElementById("edit-guest-modal");
  editGuestModal.classList.remove("opacity-100", "scale-100");
  editGuestModal.classList.add("opacity-0", "scale-95");
  setTimeout(() => {
    editGuestModal.classList.add("hidden");
  }, 300);
});

// Panggil fungsi ini saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadGuestOptions);
