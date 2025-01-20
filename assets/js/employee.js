// Import Firebase
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

// Firebase Config
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

// Create Employee Card
function createEmployeeCard(id, data) {
  const personalData = data.personalData || {};
  const jobData = data.jobData || {};

  const card = document.createElement("div");
  card.className =
    "bg-white shadow p-4 rounded flex flex-col sm:flex-row justify-between items-center mb-4";

  card.innerHTML = `
      <div>
        <h3 class="font-bold text-lg">${
          personalData.name || "Tidak Ada Nama"
        }</h3>
        <p class="text-sm">Jabatan: ${
          jobData.position || "Tidak Ada Jabatan"
        }</p>
        <p class="text-sm">Departemen: ${
          jobData.department || "Tidak Ada Departemen"
        }</p>
        <p class="text-sm">Shift: ${jobData.shift || "Tidak Ada Shift"}</p>
        <p class="text-sm">Kontak: ${
          personalData.phone || "Tidak Ada Kontak"
        }</p>
      </div>
      <div class="flex space-x-2 mt-2 sm:mt-0">
        <button class="bg-blue-600 text-white px-3 py-1 rounded edit-btn">Edit</button>
        <button class="bg-red-600 text-white px-3 py-1 rounded delete-btn">Hapus</button>
      </div>
    `;

  // Edit Button
  card.querySelector(".edit-btn").addEventListener("click", async () => {
    const { value: newName } = await Swal.fire({
      title: "Edit Nama",
      input: "text",
      inputValue: data.personalData.name,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    });
    if (newName) {
      await updateDoc(doc(db, "employees", id), {
        "personalData.name": newName,
      });
      loadEmployees();
    }
  });

  // Delete Button
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
  const { value: personalData } = await Swal.fire({
    title: "Data Pribadi Pegawai",
    html:
      '<input id="swal-name" class="swal2-input" placeholder="Nama Lengkap">' +
      '<input id="swal-id" class="swal2-input" placeholder="Nomor Identitas">' +
      '<input id="swal-dob" type="date" class="swal2-input" placeholder="Tanggal Lahir">' +
      '<select id="swal-gender" class="swal2-input"><option value="">Jenis Kelamin</option><option value="Pria">Pria</option><option value="Wanita">Wanita</option></select>' +
      '<input id="swal-address" class="swal2-input" placeholder="Alamat Lengkap">' +
      '<input id="swal-phone" class="swal2-input" placeholder="Nomor Telepon">' +
      '<input id="swal-email" class="swal2-input" placeholder="Alamat Email">' +
      '<input id="swal-photo" type="file" class="swal2-input" accept="image/*">',
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
    const { value: jobData } = await Swal.fire({
      title: "Data Pekerjaan Pegawai",
      html:
        '<input id="swal-employee-id" class="swal2-input" placeholder="Nomor ID Pegawai">' +
        '<input id="swal-position" class="swal2-input" placeholder="Jabatan/Posisi">' +
        '<input id="swal-department" class="swal2-input" placeholder="Departemen">' +
        '<input id="swal-join-date" type="date" class="swal2-input" placeholder="Tanggal Bergabung">' +
        '<select id="swal-status" class="swal2-input"><option value="">Status Kepegawaian</option><option value="Kontrak">Kontrak</option><option value="Tetap">Tetap</option><option value="Freelance">Freelance</option></select>' +
        '<select id="swal-shift" class="swal2-input"><option value="">Shift Kerja</option><option value="Pagi">Pagi</option><option value="Siang">Siang</option><option value="Malam">Malam</option></select>',
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
      await addDoc(collection(db, "employees"), {
        personalData,
        jobData,
      });
      loadEmployees();
    }
  }
});

// Initial Load
loadEmployees();
