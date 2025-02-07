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
// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4BKM35Qy-rf0dlfqiqyWzs9AwUZq0ojA",
  authDomain: "prog4-34938.firebaseapp.com",
  projectId: "prog4-34938",
  storageBucket: "prog4-34938.appspot.com",
  messagingSenderId: "920234132726",
  appId: "1:920234132726:web:4439c637de33ddf4f3d8d7",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const guestCards = document.getElementById("guest-cards");
const guestModal = document.getElementById("guest-modal");

// Fungsi untuk menampilkan daftar tamu
function displayGuests() {
  guestCards.innerHTML = "";
  db.collection("guests")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const guest = doc.data();
        guestCards.innerHTML += `
                    <div class="bg-white shadow rounded p-4">
                        <p><strong>ID:</strong> ${doc.id}</p>
                        <h3 class="text-lg font-bold mb-2">${guest.name}</h3>
                        <p><strong>Telepon:</strong> ${guest.phone}</p>
                        <p><strong>Email:</strong> ${guest.email}</p>
                        <div class="flex mt-4 space-x-2">
                            <button class="bg-blue-600 text-white px-4 py-2 rounded" onclick="editGuest('${doc.id}')">Edit</button>
                            <button class="bg-red-600 text-white px-4 py-2 rounded" onclick="deleteGuest('${doc.id}')">Hapus</button>
                        </div>
                    </div>`;
      });
    });
}

// Fungsi untuk menambahkan tamu
document.getElementById("add-guest-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const guestName = document.getElementById("guest-name").value;
  const guestPhone = document.getElementById("guest-phone").value;
  const guestEmail = document.getElementById("guest-email").value;

  db.collection("guests")
    .add({
      name: guestName,
      phone: guestPhone,
      email: guestEmail,
    })
    .then(() => {
      Swal.fire("Berhasil!", "Tamu berhasil ditambahkan!", "success");
      guestModal.classList.add("hidden");
      displayGuests();
    });
});

// Fungsi untuk mengedit tamu
function editGuest(id) {
  db.collection("guests")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const guest = doc.data();
        Swal.fire({
          title: "Edit Data Tamu",
          html: `
                        <input id="edit-name" class="swal2-input" value="${guest.name}" placeholder="Nama">
                        <input id="edit-phone" class="swal2-input" value="${guest.phone}" placeholder="Telepon">
                        <input id="edit-email" class="swal2-input" value="${guest.email}" placeholder="Email">
                    `,
          showCancelButton: true,
          confirmButtonText: "Simpan",
          cancelButtonText: "Batal",
          preConfirm: () => {
            const editedName = document.getElementById("edit-name").value;
            const editedPhone = document.getElementById("edit-phone").value;
            const editedEmail = document.getElementById("edit-email").value;

            if (!editedName || !editedPhone || !editedEmail) {
              Swal.showValidationMessage("Semua kolom harus diisi!");
              return false;
            }

            return db
              .collection("guests")
              .doc(id)
              .update({
                name: editedName,
                phone: editedPhone,
                email: editedEmail,
              })
              .then(() => {
                Swal.fire("Berhasil!", "Tamu berhasil diperbarui!", "success");
                displayGuests();
              });
          },
        });
      }
    });
}

// Fungsi untuk menghapus tamu
function deleteGuest(id) {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data tamu tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection("guests")
        .doc(id)
        .delete()
        .then(() => {
          Swal.fire("Terhapus!", "Tamu berhasil dihapus.", "success");
          displayGuests();
        });
    }
  });
}

document.getElementById("add-guest-btn").addEventListener("click", () => {
  guestModal.classList.remove("hidden");
});

document.getElementById("close-guest-modal").addEventListener("click", () => {
  guestModal.classList.add("hidden");
});

window.onload = displayGuests;

document
  .getElementById("transaksi-toggle")
  .addEventListener("click", function () {
    var menu = document.getElementById("transaksi-menu");
    menu.classList.toggle("hidden");
  });

document
  .getElementById("pegawai-toggle")
  .addEventListener("click", function () {
    var menu = document.getElementById("pegawai-menu");
    menu.classList.toggle("hidden");
  });
