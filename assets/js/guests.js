// Fungsi untuk menampilkan loading saat memuat data tamu
function showLoading() {
  Swal.fire({
    title: "Memuat data tamu...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

// Fungsi untuk menutup loading
function closeLoading() {
  Swal.close();
}

// Toggle menu
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

// Fungsi untuk menampilkan daftar tamu
function displayGuests() {
  showLoading();
  setTimeout(() => {
    const guests = JSON.parse(localStorage.getItem("guests") || "[]");
    const guestCards = document.getElementById("guest-cards");
    guestCards.innerHTML = "";

    guests.forEach((guest) => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";
      card.innerHTML = `
          <p><strong>ID:</strong> ${guest.id}</p>
          <h3 class="text-lg font-bold mb-2">${guest.name}</h3>
          <p><strong>Telepon:</strong> ${guest.phone}</p>
          <p><strong>Email:</strong> ${guest.email}</p>
          <div class="flex mt-4 space-x-2">
            <button class="bg-blue-600 text-white px-4 py-2 rounded" onclick="editGuest(${guest.id})">Edit</button>
            <button class="bg-red-600 text-white px-4 py-2 rounded" onclick="deleteGuest(${guest.id})">Hapus</button>
          </div>
        `;
      guestCards.appendChild(card);
    });

    closeLoading();
  }, 1000);
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
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Tamu ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      let guests = JSON.parse(localStorage.getItem("guests") || "[]");
      guests = guests.filter((guest) => guest.id !== id);
      localStorage.setItem("guests", JSON.stringify(guests));
      displayGuests();
      Swal.fire("Berhasil!", "Tamu telah dihapus.", "success");
    }
  });
}

// Fungsi untuk mengedit tamu (termasuk ID)
function editGuest(id) {
  let guests = JSON.parse(localStorage.getItem("guests") || "[]");
  let guest = guests.find((guest) => guest.id === id);

  if (!guest) return;

  Swal.fire({
    title: "Edit Data Tamu",
    html: `
      <input id="edit-id" class="swal2-input" value="${guest.id}" placeholder="ID">
      <input id="edit-name" class="swal2-input" value="${guest.name}" placeholder="Nama">
      <input id="edit-phone" class="swal2-input" value="${guest.phone}" placeholder="Telepon">
      <input id="edit-email" class="swal2-input" value="${guest.email}" placeholder="Email">
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    preConfirm: () => {
      const editedId = document.getElementById("edit-id").value;
      const editedName = document.getElementById("edit-name").value;
      const editedPhone = document.getElementById("edit-phone").value;
      const editedEmail = document.getElementById("edit-email").value;

      if (!editedId || !editedName || !editedPhone || !editedEmail) {
        Swal.showValidationMessage("Semua kolom harus diisi!");
        return false;
      }

      // Cek jika ID baru sudah digunakan oleh tamu lain
      if (editedId !== guest.id.toString() && guests.some(g => g.id.toString() === editedId)) {
        Swal.showValidationMessage("ID sudah digunakan oleh tamu lain!");
        return false;
      }

      // Perbarui data tamu
      guest.id = editedId;
      guest.name = editedName;
      guest.phone = editedPhone;
      guest.email = editedEmail;

      // Simpan kembali ke localStorage
      localStorage.setItem("guests", JSON.stringify(guests));
      displayGuests();
    },
  });
}

// Event listener untuk modal
const modal = document.getElementById("guest-modal");
const addGuestBtn = document.getElementById("add-guest-btn");
const closeModalBtn = document.getElementById("close-modal");

addGuestBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("flex");
  modal.classList.add("hidden");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }
});

// Event listener untuk form penambahan tamu
document
  .getElementById("add-guest-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("guest-id").value;
    const name = document.getElementById("guest-name").value;
    const phone = document.getElementById("guest-phone").value;
    const email = document.getElementById("guest-email").value;

    const guests = JSON.parse(localStorage.getItem("guests") || "[]");

    // Cek jika ID sudah digunakan
    if (guests.some(g => g.id.toString() === id)) {
      Swal.fire("Error!", "ID sudah digunakan oleh tamu lain!", "error");
      return;
    }

    const newGuest = { id, name, phone, email };
    addGuest(newGuest);
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    this.reset();
    Swal.fire("Berhasil!", "Tamu berhasil ditambahkan.", "success");
  });

// Inisialisasi awal
displayGuests();
