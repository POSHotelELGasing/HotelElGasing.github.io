import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

// Firebase Configuration
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
const db = getFirestore(app);
const storage = getStorage(app);
const employeeCountElement = document.getElementById("employee-count");
const defaultPhoto = "https://via.placeholder.com/150"; // Gambar default pegawai

const employeeList = document.getElementById("employee-list");
const addEmployeeBtn = document.getElementById("add-employee-btn");

async function updateEmployeeCount() {
  try {
    const querySnapshot = await getDocs(collection(db, "employees"));
    employeeCountElement.textContent = querySnapshot.size;
  } catch (error) {
    console.error("Error fetching employee count:", error);
  }
}

async function getJobAndDeptOptions() {
  const roles = ["Admin", "Kasir", "Resepsionis", "Housekeeping", "Manajer"];
  let roleOptions = "<option value=''>Pilih Role</option>";
  roles.forEach((role) => {
    roleOptions += `<option value="${role}">${role}</option>`;
  });
  const jobSnapshot = await getDocs(collection(db, "positions"));
  const deptSnapshot = await getDocs(collection(db, "departments"));
  let jobOptions = "<option value=''>Pilih Jabatan</option>";
  let deptOptions = "<option value=''>Pilih Departemen</option>";

  jobSnapshot.forEach((doc) => {
    jobOptions += `<option value="${doc.data().position}">${
      doc.data().position
    }</option>`;
  });

  deptSnapshot.forEach((doc) => {
    deptOptions += `<option value="${doc.data().name}">${
      doc.data().name
    }</option>`;
  });

  return { jobOptions, deptOptions };
}
// Load Employees
async function loadEmployees() {
  employeeList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "employees"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    createEmployeeCard(doc.id, data);
  });
  await updateEmployeeCount(); // Pastikan ini dipanggil setelah data dimuat
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

// Create Employee Card
function createEmployeeCard(id, data) {
  const personalData = data.personalData || {};
  const jobData = data.jobData || {};

  const card = document.createElement("div");
  card.className =
    "bg-white shadow-lg rounded-lg overflow-hidden p-4 flex flex-col items-center text-center";

  card.innerHTML = `
    <img
      src="${personalData.photo || defaultPhoto}"
      alt="Foto ${personalData.name || "Pegawai"}"
      class="w-32 h-32 object-cover rounded-full shadow-lg mb-4"
    />
    <h3 class="font-bold text-lg">${personalData.name || "Tidak Ada Nama"}</h3>
    <p class="text-sm text-gray-600">Jabatan: ${
      jobData.position || "Tidak Ada Jabatan"
    }</p>
    <p class="text-sm text-gray-600">Departemen: ${
      jobData.department || "Tidak Ada Departemen"
    }</p>
    <div class="flex space-x-2 mt-4">
      <button class="bg-blue-500 text-white px-4 py-2 rounded detail-btn">Detail</button>
      <button class="bg-blue-600 text-white px-4 py-2 rounded edit-btn">Edit</button>
      <button class="bg-red-600 text-white px-4 py-2 rounded delete-btn">Hapus</button>
    </div>
  `;

  // Event Listener untuk Tombol Detail
  card.querySelector(".detail-btn").addEventListener("click", () => {
    Swal.fire({
      title: "Detail Pegawai",
      html: `
        <h3 class="text-lg font-bold mb-2">${
          personalData.name || "Tidak Ada Nama"
        }</h3>
        <p class="text-sm text-gray-600 pb-3">Hak Akses Sebagai ${
          jobData.role || "Tidak Ada Role"
        }</p>
        <p><strong>Nomor Identitas:</strong> ${
          personalData.id || "Tidak Ada"
        }</p>
        <p><strong>Tanggal Lahir:</strong> ${
          personalData.dob || "Tidak Ada"
        }</p>
        <p><strong>Jenis Kelamin:</strong> ${
          personalData.gender || "Tidak Ada"
        }</p>
        <p><strong>Alamat:</strong> ${personalData.address || "Tidak Ada"}</p>
        <p><strong>Kontak:</strong> ${personalData.phone || "Tidak Ada"}</p>
        <p><strong>Email:</strong> ${personalData.email || "Tidak Ada"}</p>
        <hr class="my-2" />
        <p><strong>ID Pegawai:</strong> ${jobData.employeeId || "Tidak Ada"}</p>
        <p><strong>Jabatan:</strong> ${jobData.position || "Tidak Ada"}</p>
        <p><strong>Departemen:</strong> ${jobData.department || "Tidak Ada"}</p>
        <p><strong>Tanggal Bergabung:</strong> ${
          jobData.joinDate || "Tidak Ada"
        }</p>
        <p><strong>Status:</strong> ${jobData.status || "Tidak Ada"}</p>
        <p><strong>Shift:</strong> ${jobData.shift || "Tidak Ada"}</p>
      `,
      confirmButtonText: "Tutup",
    });
  });

  // Event Listener untuk Tombol Edit
  // Event Listener untuk Tombol Edit
  card.querySelector(".edit-btn").addEventListener("click", async () => {
    const positionsSnapshot = await getDocs(collection(db, "positions"));
    const departmentsSnapshot = await getDocs(collection(db, "departments"));

    let positionOptions = "<option value=''>Pilih Jabatan</option>";
    positionsSnapshot.forEach((doc) => {
      const isSelected =
        jobData.position === doc.data().position ? "selected" : "";
      positionOptions += `<option value="${
        doc.data().position
      }" ${isSelected}>${doc.data().position}</option>`;
    });

    let departmentOptions = "<option value=''>Pilih Departemen</option>";
    departmentsSnapshot.forEach((doc) => {
      const isSelected =
        jobData.department === doc.data().name ? "selected" : "";
      departmentOptions += `<option value="${doc.data().name}" ${isSelected}>${
        doc.data().name
      }</option>`;
    });

    // Tambahkan pilihan role
    const roles = ["Admin", "Kasir", "Resepsionis", "Housekeeping", "Manajer"];
    let roleOptions = "<option value=''>Pilih Role</option>";
    roles.forEach((role) => {
      const isSelected = jobData.role === role ? "selected" : "";
      roleOptions += `<option value="${role}" ${isSelected}>${role}</option>`;
    });

    const { value: updatedData } = await Swal.fire({
      title: "Edit Data Pegawai",
      html: `
      <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap" value="${
        personalData.name || ""
      }">
      <input id="swal-id" class="swal2-input" placeholder="Nomor Identitas" value="${
        personalData.id || ""
      }">
      <input id="swal-dob" type="date" class="swal2-input" value="${
        personalData.dob || ""
      }">
      <select id="swal-gender" class="swal2-input">
        <option value="Pria" ${
          personalData.gender === "Pria" ? "selected" : ""
        }>Pria</option>
        <option value="Wanita" ${
          personalData.gender === "Wanita" ? "selected" : ""
        }>Wanita</option>
      </select>
      <input id="swal-address" class="swal2-input" placeholder="Alamat" value="${
        personalData.address || ""
      }">
      <input id="swal-phone" class="swal2-input" placeholder="Nomor Telepon" value="${
        personalData.phone || ""
      }">
      <input id="swal-email" class="swal2-input" placeholder="Email" value="${
        personalData.email || ""
      }">
      <input id="swal-employee-id" class="swal2-input" placeholder="ID Pegawai" value="${
        jobData.employeeId || ""
      }">
      <select id="swal-position" class="swal2-input">${positionOptions}</select>
      <select id="swal-department" class="swal2-input">${departmentOptions}</select>
      <select id="swal-role" class="swal2-input">${roleOptions}</select>
      <input id="swal-join-date" type="date" class="swal2-input" value="${
        jobData.joinDate || ""
      }">
      <select id="swal-status" class="swal2-input">
        <option value="Kontrak" ${
          jobData.status === "Kontrak" ? "selected" : ""
        }>Kontrak</option>
        <option value="Tetap" ${
          jobData.status === "Tetap" ? "selected" : ""
        }>Tetap</option>
        <option value="Freelance" ${
          jobData.status === "Freelance" ? "selected" : ""
        }>Freelance</option>
      </select>
      <select id="swal-shift" class="swal2-input">
        <option value="Pagi" ${
          jobData.shift === "Pagi" ? "selected" : ""
        }>Pagi</option>
        <option value="Siang" ${
          jobData.shift === "Siang" ? "selected" : ""
        }>Siang</option>
        <option value="Malam" ${
          jobData.shift === "Malam" ? "selected" : ""
        }>Malam</option>
      </select>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      preConfirm: () => {
        return {
          personalData: {
            name: document.getElementById("swal-name").value,
            id: document.getElementById("swal-id").value,
            dob: document.getElementById("swal-dob").value,
            gender: document.getElementById("swal-gender").value,
            address: document.getElementById("swal-address").value,
            phone: document.getElementById("swal-phone").value,
            email: document.getElementById("swal-email").value,
          },
          jobData: {
            employeeId: document.getElementById("swal-employee-id").value,
            position: document.getElementById("swal-position").value,
            department: document.getElementById("swal-department").value,
            role: document.getElementById("swal-role").value, // Menyimpan role yang dipilih
            joinDate: document.getElementById("swal-join-date").value,
            status: document.getElementById("swal-status").value,
            shift: document.getElementById("swal-shift").value,
          },
        };
      },
    });

    if (updatedData) {
      await updateDoc(doc(db, "employees", id), updatedData);
      loadEmployees();
    }
  });

  // Event Listener untuk Tombol Delete
  card.querySelector(".delete-btn").addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "employees", id));
      loadEmployees();
    }
  });

  employeeList.appendChild(card);
}

// Add Employee
addEmployeeBtn.addEventListener("click", async () => {
  updateEmployeeCount();
  const { jobOptions, deptOptions } = await getJobAndDeptOptions();

  // Daftar role
  const roles = ["Admin", "Kasir", "Resepsionis", "Housekeeping", "Manajer"];
  let roleOptions = "<option value=''>Pilih Role</option>";
  roles.forEach((role) => {
    roleOptions += `<option value="${role}">${role}</option>`;
  });

  const { value: personalData } = await Swal.fire({
    title: "Data Pribadi Pegawai",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap">
      <input id="swal-id" class="swal2-input" placeholder="Nomor Identitas">
      <input id="swal-dob" type="date" class="swal2-input" placeholder="Tanggal Lahir">
      <select id="swal-gender" class="swal2-input">
        <option value="">Pilih Gender</option>
        <option value="Pria">Pria</option>
        <option value="Wanita">Wanita</option>
      </select>
      <input id="swal-address" class="swal2-input" placeholder="Alamat Lengkap">
      <input id="swal-phone" class="swal2-input" placeholder="Nomor Telepon">
      <input id="swal-email" class="swal2-input" placeholder="Alamat Email">
    `,
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value.trim();
      const id = document.getElementById("swal-id").value.trim();
      const dob = document.getElementById("swal-dob").value;
      const gender = document.getElementById("swal-gender").value;
      const address = document.getElementById("swal-address").value.trim();
      const phone = document.getElementById("swal-phone").value.trim();
      const email = document.getElementById("swal-email").value.trim();

      // Validasi Data Pribadi
      if (!name || !id || !email || !phone) {
        Swal.showValidationMessage("Nama, ID, Email, dan Telepon wajib diisi!");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        Swal.showValidationMessage("Format email tidak valid!");
        return false;
      }
      if (!/^\d{10,}$/.test(phone)) {
        Swal.showValidationMessage(
          "Nomor telepon harus minimal 10 digit angka!"
        );
        return false;
      }

      return { name, id, dob, gender, address, phone, email };
    },
    confirmButtonText: "Lanjutkan",
    cancelButtonText: "Batal",
    showCancelButton: true,
  });

  if (!personalData) return;

  const { value: jobData } = await Swal.fire({
    title: "Data Pekerjaan Pegawai",
    html: `
      <select id="swal-position" class="swal2-input">${jobOptions}</select>
      <select id="swal-department" class="swal2-input">${deptOptions}</select>
      <select id="swal-role" class="swal2-input">${roleOptions}</select>
      <input id="swal-join-date" type="date" class="swal2-input" placeholder="Tanggal Bergabung">
      <select id="swal-status" class="swal2-input">
        <option value="">Pilih Status</option>
        <option value="Kontrak">Kontrak</option>
        <option value="Tetap">Tetap</option>
        <option value="Freelance">Freelance</option>
      </select>
      <select id="swal-shift" class="swal2-input">
        <option value="">Pilih Shift</option>
        <option value="Pagi">Pagi</option>
        <option value="Siang">Siang</option>
        <option value="Malam">Malam</option>
      </select>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const position = document.getElementById("swal-position").value;
      const department = document.getElementById("swal-department").value;
      const role = document.getElementById("swal-role").value;
      const joinDate = document.getElementById("swal-join-date").value;
      const status = document.getElementById("swal-status").value;
      const shift = document.getElementById("swal-shift").value;

      // Validasi Data Pekerjaan
      if (!position || !department || !role) {
        Swal.showValidationMessage(
          "Jabatan, Departemen, dan Role wajib dipilih!"
        );
        return false;
      }
      if (!joinDate) {
        Swal.showValidationMessage("Tanggal Bergabung wajib diisi!");
        return false;
      }
      const today = new Date().toISOString().split("T")[0];
      if (joinDate > today) {
        Swal.showValidationMessage(
          "Tanggal Bergabung tidak boleh di masa depan!"
        );
        return false;
      }
      if (!status) {
        Swal.showValidationMessage("Status kerja wajib dipilih!");
        return false;
      }
      if (!shift) {
        Swal.showValidationMessage("Shift kerja wajib dipilih!");
        return false;
      }

      return { position, department, role, joinDate, status, shift };
    },
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    showCancelButton: true,
  });

  if (!jobData) return;

  const autoEmployeeId = `EMP-${Date.now()}`;

  // Simpan ke Firestore setelah validasi berhasil
  await addDoc(collection(db, "employees"), {
    personalData: { ...personalData, photo: defaultPhoto },
    jobData: { ...jobData, employeeId: autoEmployeeId },
  });

  loadEmployees();
  updateEmployeeCount();
});

// Initial Load
loadEmployees();
updateEmployeeCount();
