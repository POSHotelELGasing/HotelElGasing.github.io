
// Firebase Config
const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  menuToggle.addEventListener("click", () => {
    const isHidden = menu.classList.contains("hidden");
    if (isHidden) {
      menu.classList.remove("hidden");
      setTimeout(() => {
        menu.classList.remove("-translate-y-full", "opacity-0");
        menu.classList.add("translate-y-0", "opacity-100");
      }, 10);
    } else {
      menu.classList.remove("translate-y-0", "opacity-100");
      menu.classList.add("-translate-y-full", "opacity-0");
      setTimeout(() => {
        menu.classList.add("hidden");
      }, 300);
    }
  });
const firebaseConfig = {
  apiKey: "AIzaSyB4BKM35Qy-rf0dlfqiqyWzs9AwUZq0ojA",
  authDomain: "prog4-34938.firebaseapp.com",
  projectId: "prog4-34938",
  storageBucket: "prog4-34938.appspot.com",
  messagingSenderId: "920234132726",
  appId: "1:920234132726:web:4439c637de33ddf4f3d8d7"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const roomList = document.getElementById("room-list");
const roomModal = document.getElementById("room-modal");
const detailModal = document.getElementById("detail-modal");

const openModal = (title) => {
  document.getElementById("modal-title").textContent = title;
  roomModal.classList.remove("hidden");
};

const closeModal = () => {
  roomModal.classList.add("hidden");
  document.getElementById("room-form").reset();
};

const openDetailModal = () => {
  detailModal.classList.remove("hidden");
};

const closeDetailModal = () => {
  detailModal.classList.add("hidden");
};

document.getElementById("add-room-btn").addEventListener("click", () => {
  document.getElementById("room-id").value = "";
  openModal("Tambah Kamar");
});

document.getElementById("close-modal-btn").addEventListener("click", closeModal);
document.getElementById("close-detail-btn").addEventListener("click", closeDetailModal);

document.getElementById("room-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("room-id").value;
  const roomData = {
    number: document.getElementById("room-number").value,
    type: document.getElementById("room-type").value,
    price: document.getElementById("room-price").value,
    status: document.getElementById("room-status").value,
  };

  if (id) {
    db.collection("rooms").doc(id).update(roomData).then(() => {
      Swal.fire("Berhasil!", "Kamar berhasil diperbarui!", "success");
      closeModal();
      displayRooms();
    });
  } else {
    db.collection("rooms").add(roomData).then(() => {
      Swal.fire("Berhasil!", "Kamar berhasil ditambahkan!", "success");
      closeModal();
      displayRooms();
    });
  }
});

const displayRooms = () => {
  roomList.innerHTML = "";
  db.collection("rooms").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const room = doc.data();
      roomList.innerHTML += `
        <div class="bg-white p-4 shadow rounded">
          <h4 class="text-lg font-bold">${room.number} - ${room.type}</h4>
          <p class="text-sm">Harga: Rp ${room.price}</p>
          <p class="text-sm">Status: ${room.status}</p>
          <div class="mt-4 flex space-x-2">
            <button class="bg-blue-500 text-white p-1 rounded" onclick="editRoom('${doc.id}')">Edit</button>
            <button class="bg-green-500 text-white p-1 rounded" onclick="showDetails('${doc.id}')">Detail</button>
            <button class="bg-red-500 text-white p-1 rounded" onclick="deleteRoom('${doc.id}')">Hapus</button>
          </div>
        </div>`;
    });
  });
};

const editRoom = (id) => {
  db.collection("rooms").doc(id).get().then((doc) => {
    if (doc.exists) {
      const room = doc.data();
      document.getElementById("room-id").value = id;
      document.getElementById("room-number").value = room.number;
      document.getElementById("room-type").value = room.type;
      document.getElementById("room-price").value = room.price;
      document.getElementById("room-status").value = room.status;
      openModal("Edit Kamar");
    }
  });
};

const showDetails = (id) => {
  db.collection("rooms").doc(id).get().then((doc) => {
    if (doc.exists) {
      const room = doc.data();
      document.getElementById("room-detail").innerHTML = `
        <p><strong>Nomor Kamar:</strong> ${room.number}</p>
        <p><strong>Tipe:</strong> ${room.type}</p>
        <p><strong>Harga:</strong> Rp ${room.price}</p>
        <p><strong>Status:</strong> ${room.status}</p>`;
      openDetailModal();
    }
  });
};

const deleteRoom = (id) => {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data kamar tidak dapat dikembalikan setelah dihapus.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection("rooms").doc(id).delete().then(() => {
        Swal.fire("Terhapus!", "Kamar berhasil dihapus.", "success");
        displayRooms();
      });
    }
  });
};

// Modal Nomor Kamar
const roomNumberModal = document.getElementById("room-number-modal");
const openRoomNumberModal = () => roomNumberModal.classList.remove("hidden");
const closeRoomNumberModal = () => roomNumberModal.classList.add("hidden");

// Tambah Nomor Kamar
document.getElementById("add-room-number-btn").addEventListener("click", openRoomNumberModal);
document.getElementById("close-room-number-modal-btn").addEventListener("click", closeRoomNumberModal);

document.getElementById("room-number-form").addEventListener("submit", (e) => {
e.preventDefault();
const roomNumber = document.getElementById("new-room-number").value;

db.collection("roomNumbers").add({ number: roomNumber }).then(() => {
Swal.fire("Berhasil!", "Nomor kamar berhasil ditambahkan!", "success");
closeRoomNumberModal();
});
});

// Detail Nomor Kamar
document.getElementById("detail-room-number-btn").addEventListener("click", () => {
db.collection("roomNumbers").get().then((snapshot) => {
let numbers = "";
snapshot.forEach((doc) => {
  const roomNumber = doc.data().number;
  numbers += `<li>${roomNumber}</li>`;
});

});
});

// Validasi Nomor Kamar di Dropdown
document.getElementById("add-room-btn").addEventListener("click", () => {
  const dropdown = document.getElementById("room-number");
  dropdown.innerHTML = `<option value="" disabled selected>Pilih Nomor Kamar</option>`;

  // Ambil semua nomor kamar yang sudah digunakan di "rooms"
  db.collection("rooms").get().then((roomSnapshot) => {
      let usedRoomNumbers = new Set();
      roomSnapshot.forEach((doc) => {
          usedRoomNumbers.add(doc.data().number);
      });

      // Ambil semua nomor kamar dari "roomNumbers"
      db.collection("roomNumbers").get().then((roomNumbersSnapshot) => {
          roomNumbersSnapshot.forEach((doc) => {
              const roomNumber = doc.data().number;

              // Hanya tambahkan nomor kamar yang belum digunakan
              if (!usedRoomNumbers.has(roomNumber)) {
                  dropdown.innerHTML += `<option value="${roomNumber}">${roomNumber}</option>`;
              }
          });
      });
  });

  openModal("Tambah Kamar");
});


// Modal Detail Nomor Kamar
const detailRoomNumberModal = document.getElementById(
"detail-room-number-modal"
);
const closeDetailRoomNumberModal = () =>
detailRoomNumberModal.classList.add("hidden");
document
.getElementById("close-detail-room-number-modal-btn")
.addEventListener("click", closeDetailRoomNumberModal);

// Tombol untuk membuka modal detail nomor kamar
document
.getElementById("detail-room-number-btn")
.addEventListener("click", () => {
const roomNumberList = document.getElementById("room-number-list");
roomNumberList.innerHTML = "";

db.collection("roomNumbers")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      const roomNumber = doc.data().number;
      const listItem = document.createElement("li");
      listItem.className =
        "flex justify-between items-center bg-gray-100 p-2 rounded shadow";
      listItem.innerHTML = `
        <span class="text-gray-700 font-medium">${roomNumber}</span>
        <div class="space-x-2">
          <button class="edit-room-number-btn bg-blue-500 text-white p-1 rounded hover:bg-blue-600" data-id="${doc.id}">Edit</button>
          <button class="delete-room-number-btn bg-red-500 text-white p-1 rounded hover:bg-red-600" data-id="${doc.id}">Hapus</button>
        </div>
      `;
      roomNumberList.appendChild(listItem);
    });

    // Tambahkan event listener untuk tombol edit dan hapus
    document
      .querySelectorAll(".edit-room-number-btn")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          editRoomNumber(id);
        })
      );

    document
      .querySelectorAll(".delete-room-number-btn")
      .forEach((btn) =>
        btn.addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          deleteRoomNumber(id);
        })
      );

    detailRoomNumberModal.classList.remove("hidden");
  });
});

// Fungsi Edit Nomor Kamar
const editRoomNumber = (id) => {
db.collection("roomNumbers")
.doc(id)
.get()
.then((doc) => {
  if (doc.exists) {
    const newNumber = prompt(
      "Masukkan nomor kamar baru:",
      doc.data().number
    );
    if (newNumber) {
      db.collection("roomNumbers").doc(id).update({ number: newNumber });
      Swal.fire("Berhasil!", "Nomor kamar berhasil diperbarui.", "success");
      closeDetailRoomNumberModal();
    }
  }
});
};

// Fungsi Hapus Nomor Kamar
const deleteRoomNumber = (id) => {
Swal.fire({
title: "Yakin ingin menghapus?",
text: "Nomor kamar tidak dapat dikembalikan setelah dihapus.",
icon: "warning",
showCancelButton: true,
confirmButtonColor: "#d33",
cancelButtonColor: "#3085d6",
confirmButtonText: "Ya, hapus!",
cancelButtonText: "Batal",
}).then((result) => {
if (result.isConfirmed) {
  db.collection("roomNumbers")
    .doc(id)
    .delete()
    .then(() => {
      Swal.fire(
        "Terhapus!",
        "Nomor kamar berhasil dihapus.",
        "success"
      );
      closeDetailRoomNumberModal();
    });
}
});
};

window.onload = displayRooms;
