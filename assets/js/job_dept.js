import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4BKM35Qy-rf0dlfqiqyWzs9AwUZq0ojA",
  authDomain: "prog4-34938.firebaseapp.com",
  projectId: "prog4-34938",
  storageBucket: "prog4-34938.firebasestorage.app",
  messagingSenderId: "920234132726",
  appId: "1:920234132726:web:4439c637de33ddf4f3d8d7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadDepartments() {
  const departmentList = document.getElementById("department-list");
  departmentList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "departments"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const listItem = document.createElement("li");
    listItem.className =
      "bg-white p-2 shadow rounded mb-2 flex justify-between";
    listItem.innerHTML = `
      ${data.name} 
      <div>
        <button class='text-yellow-500 ml-2' onclick="editDepartment('${doc.id}')">Edit</button>
        <button class='text-red-500 ml-2' onclick="deleteDepartment('${doc.id}')">Hapus</button>
      </div>`;
    departmentList.appendChild(listItem);
  });
}

window.addDepartment = async function () {
  const { value: departmentName } = await Swal.fire({
    title: "Tambah Departemen",
    input: "text",
    inputPlaceholder: "Nama Departemen",
    showCancelButton: true,
  });
  if (departmentName) {
    await addDoc(collection(db, "departments"), { name: departmentName });
    loadDepartments();
  }
};

async function loadPositions() {
  const positionList = document.getElementById("position-list");
  positionList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "positions"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "bg-white p-4 shadow-lg rounded-lg text-center";
    card.innerHTML = `
      <h3 class="font-bold text-lg">${data.position} - ${data.department}</h3>
      <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mt-2" onclick="editPosition('${doc.id}')">Edit</button>
      <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2" onclick="deletePosition('${doc.id}')">Hapus</button>
    `;
    positionList.appendChild(card);
  });
}

window.addPosition = async function () {
  const departmentOptions = await getDepartmentOptions();
  const { value: formData } = await Swal.fire({
    title: "Tambah Jabatan",
    html: `
      <input id="swal-position" class="swal2-input" placeholder="Jabatan">
      <select id="swal-department" class="swal2-input">${departmentOptions}</select>
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    preConfirm: () => {
      return {
        position: document.getElementById("swal-position").value,
        department: document.getElementById("swal-department").value,
      };
    },
  });

  if (formData) {
    await addDoc(collection(db, "positions"), formData);
    loadPositions();
  }
};

async function getDepartmentOptions() {
  const querySnapshot = await getDocs(collection(db, "departments"));
  let options = "<option value=''>Pilih Departemen</option>";
  querySnapshot.forEach((doc) => {
    options += `<option value="${doc.data().name}">${doc.data().name}</option>`;
  });
  return options;
}

loadDepartments();
loadPositions();

document
  .getElementById("pegawai-toggle")
  .addEventListener("click", function () {
    var menu = document.getElementById("pegawai-menu");
    menu.classList.toggle("hidden");
  });

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
