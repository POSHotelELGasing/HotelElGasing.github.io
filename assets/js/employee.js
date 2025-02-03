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
const defaultPhoto = "https://via.placeholder.com/150"; // Gambar default pegawai

const employeeList = document.getElementById("employee-list");
const addEmployeeBtn = document.getElementById("add-employee-btn");

// Load Employees
async function loadEmployees() {
  employeeList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "employees"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    createEmployeeCard(doc.id, data);
  });
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
  card.querySelector(".edit-btn").addEventListener("click", async () => {
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
        <input id="swal-position" class="swal2-input" placeholder="Jabatan" value="${
          jobData.position || ""
        }">
        <input id="swal-department" class="swal2-input" placeholder="Departemen" value="${
          jobData.department || ""
        }">
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
  // Form Input Data Pribadi
  const { value: personalData } = await Swal.fire({
    title: "Data Pribadi Pegawai",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap">
      <input id="swal-id" class="swal2-input" placeholder="Nomor Identitas">
      <input id="swal-dob" type="date" class="swal2-input" placeholder="Tanggal Lahir">
      <select id="swal-gender" class="swal2-input">
        <option value="">Jenis Kelamin</option>
        <option value="Pria">Pria</option>
        <option value="Wanita">Wanita</option>
      </select>
      <input id="swal-address" class="swal2-input" placeholder="Alamat Lengkap">
      <input id="swal-phone" class="swal2-input" placeholder="Nomor Telepon">
      <input id="swal-email" class="swal2-input" placeholder="Alamat Email">
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        name: document.getElementById("swal-name").value,
        id: document.getElementById("swal-id").value,
        dob: document.getElementById("swal-dob").value,
        gender: document.getElementById("swal-gender").value,
        address: document.getElementById("swal-address").value,
        phone: document.getElementById("swal-phone").value,
        email: document.getElementById("swal-email").value,
      };
    },
    confirmButtonText: "Lanjutkan",
    cancelButtonText: "Batal",
    showCancelButton: true,
  });

  if (personalData) {
    const photoURL = defaultPhoto; // Tetapkan gambar default

    await addDoc(collection(db, "employees"), {
      personalData: { ...personalData, photo: photoURL },
      jobData,
    });

    // Form Input Data Pekerjaan
    const { value: jobData } = await Swal.fire({
      title: "Data Pekerjaan Pegawai",
      html: `
        <input id="swal-employee-id" class="swal2-input" placeholder="ID Pegawai">
        <input id="swal-position" class="swal2-input" placeholder="Jabatan">
        <input id="swal-department" class="swal2-input" placeholder="Departemen">
        <input id="swal-join-date" type="date" class="swal2-input" placeholder="Tanggal Bergabung">
        <select id="swal-status" class="swal2-input">
          <option value="">Status Kepegawaian</option>
          <option value="Kontrak">Kontrak</option>
          <option value="Tetap">Tetap</option>
          <option value="Freelance">Freelance</option>
        </select>
        <select id="swal-shift" class="swal2-input">
          <option value="">Shift Kerja</option>
          <option value="Pagi">Pagi</option>
          <option value="Siang">Siang</option>
          <option value="Malam">Malam</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          employeeId: document.getElementById("swal-employee-id").value,
          position: document.getElementById("swal-position").value,
          department: document.getElementById("swal-department").value,
          joinDate: document.getElementById("swal-join-date").value,
          status: document.getElementById("swal-status").value,
          shift: document.getElementById("swal-shift").value,
        };
      },
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      showCancelButton: true,
    });

    if (jobData) {
      // Simpan Data ke Firestore
      await addDoc(collection(db, "employees"), {
        personalData: { ...personalData, photo: photoURL },
        jobData,
      });

      // Reload Employees
      loadEmployees();
    }
  }
});

// Initial Load
loadEmployees();
