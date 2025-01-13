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
// Fungsi untuk menampilkan tamu
function displayGuests() {
  showLoading(); // Tampilkan loading
  setTimeout(() => {
    // Simulasi waktu pemuatan data
    const guests = JSON.parse(localStorage.getItem("guests") || "[]");
    const guestCards = document.getElementById("guest-cards");
    guestCards.innerHTML = "";

    guests.forEach((guest) => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";
      card.innerHTML = `
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

    closeLoading(); // Tutup loading setelah data dimuat
  }, 1000); // Simulasi waktu pemrosesan (1 detik)
}

// Fungsi untuk menambah tamu
function addGuest(guest) {
  const guests = JSON.parse(localStorage.getItem("guests") || "[]");
  guests.push(guest);
  localStorage.setItem("guests", JSON.stringify(guests));
  displayGuests();
}

// Fungsi untuk menghapus tamu dengan konfirmasi SweetAlert2
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

// Fungsi untuk mengedit tamu (contoh dengan SweetAlert2)
function editGuest(id) {
  Swal.fire({
    icon: "info",
    title: "Fitur Belum Tersedia",
    text: "Fitur edit belum diimplementasikan.",
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

    const name = document.getElementById("guest-name").value;
    const phone = document.getElementById("guest-phone").value;
    const email = document.getElementById("guest-email").value;

    const newGuest = {
      id: Date.now(),
      name,
      phone,
      email,
    };

    addGuest(newGuest);
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    this.reset();
    Swal.fire("Berhasil!", "Tamu berhasil ditambahkan.", "success");
  });

// Inisialisasi awal
displayGuests();

