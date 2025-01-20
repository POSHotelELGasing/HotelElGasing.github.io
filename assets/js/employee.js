const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const authButton = document.getElementById("auth-button");

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

// Simpan pengguna login di localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Periksa jika pengguna login
if (currentUser) {
  // Ubah tombol menjadi Logout
  authButton.textContent = "Logout";
  document.getElementById(
    "user-info"
  ).innerText = `Selamat datang, ${currentUser.username} (${currentUser.email})`;
} else {
  // Arahkan ke halaman login jika tidak login
  document.getElementById("user-info").innerText = "Anda belum login.";
  authButton.textContent = "Login";
}

// Tambahkan event listener untuk tombol Login/Logout
authButton.addEventListener("click", () => {
  if (currentUser) {
    // Logout: Hapus data pengguna dari localStorage dan muat ulang halaman
    localStorage.removeItem("currentUser");
    alert("Berhasil logout!");
    window.location.href = "login.html";
  } else {
    // Login: Arahkan ke halaman login
    window.location.href = "login.html";
  }
});
