import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
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
const salaryList = document.getElementById("salary-list");
const addSalaryBtn = document.getElementById("add-salary-btn");
const filterMonth = document.getElementById("filter-month");

async function loadSalaries(filter = "") {
  salaryList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "salaries"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const salaryDate = new Date(data.date);
    const payDate = data.payDate
      ? new Date(data.payDate).toLocaleDateString()
      : "-";
    const month = salaryDate.getMonth() + 1;
    if (filter && month !== parseInt(filter, 10)) return;

    const formatIDR = (amount) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

    const card = document.createElement("div");
    card.className = "bg-white p-4 shadow-lg rounded-lg text-center";
    card.innerHTML = `
          <h3 class="font-bold text-lg">${data.employeeName}</h3>
          <p class="text-gray-500">Jabatan: ${
            data.position || "Tidak Diketahui"
          }</p>
          <p class="text-gray-500">Departemen: ${
            data.department || "Tidak Diketahui"
          }</p>
         
          <p class="text-gray-700 font-bold">Total: ${formatIDR(
            data.totalSalary
          )}</p>
          <p class="text-gray-500">Tanggal Gajian: ${payDate}</p>
          <button class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mt-2" onclick="editSalary('${
            doc.id
          }')">Edit</button>
          <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2" onclick="deleteSalary('${
            doc.id
          }')">Hapus</button>
          <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2" onclick="viewSalaryDetail('${
            doc.id
          }')">Detail</button>
        `;
    salaryList.appendChild(card);
  });
}

async function getEmployeeOptions() {
  const querySnapshot = await getDocs(collection(db, "employees"));
  let options = {}; // Menggunakan objek, bukan string
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.personalData && data.personalData.name) {
      options[data.personalData.name] = data.personalData.name;
    }
  });
  return options;
}

window.addSalary = async () => {
  const employeeOptions = await getEmployeeOptions();

  const { value: selectedEmployeeName } = await Swal.fire({
    title: "Pilih Karyawan",
    input: "select",
    inputOptions: employeeOptions,
    showCancelButton: true,
  });

  if (!selectedEmployeeName) return;

  // 🔹 **Cek apakah karyawan sudah memiliki gaji di Firestore**
  const querySnapshot = await getDocs(collection(db, "salaries"));
  let isDuplicate = false;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.employeeName === selectedEmployeeName) {
      isDuplicate = true;
    }
  });

  if (isDuplicate) {
    Swal.fire("Error", "Karyawan ini sudah memiliki data gaji!", "error");
    return;
  }

  // 🔹 **Cari data pegawai berdasarkan nama**
  const employeeSnapshot = await getDocs(collection(db, "employees"));
  let employeeData = {};
  employeeSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.personalData.name === selectedEmployeeName) {
      employeeData = data.jobData || {};
    }
  });

  if (!employeeData.position || !employeeData.department) {
    Swal.fire("Error", "Data jabatan dan departemen tidak ditemukan!", "error");
    return;
  }

  // 🔹 **Minta admin untuk memasukkan gaji secara manual, termasuk tanggal gajian**
  const { value: manualSalaryData } = await Swal.fire({
    title: "Masukkan Detail Gaji",
    html: `
              <input id="swal-base-salary" class="swal2-input" type="number" placeholder="Gaji Pokok">
              <input id="swal-allowance" class="swal2-input" type="number" placeholder="Tunjangan">
              <input id="swal-deduction" class="swal2-input" type="number" placeholder="Potongan">
              <input id="swal-pay-date" class="swal2-input" type="date" placeholder="Tanggal Gajian">
          `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    preConfirm: () => {
      return {
        baseSalary:
          parseFloat(document.getElementById("swal-base-salary").value) || 0,
        allowance:
          parseFloat(document.getElementById("swal-allowance").value) || 0,
        deduction:
          parseFloat(document.getElementById("swal-deduction").value) || 0,
        payDate:
          document.getElementById("swal-pay-date").value ||
          new Date().toISOString(),
      };
    },
  });

  if (!manualSalaryData) return;

  // 🔹 **Simpan gaji ke Firestore**
  await addDoc(collection(db, "salaries"), {
    employeeName: selectedEmployeeName,
    position: employeeData.position,
    department: employeeData.department,
    baseSalary: manualSalaryData.baseSalary,
    allowance: manualSalaryData.allowance,
    deduction: manualSalaryData.deduction,
    totalSalary:
      manualSalaryData.baseSalary +
      manualSalaryData.allowance -
      manualSalaryData.deduction,
    payDate: manualSalaryData.payDate, // Menyimpan tanggal gajian
  });

  Swal.fire("Berhasil!", "Data gaji telah disimpan.", "success");
  loadSalaries();
};

addSalaryBtn.addEventListener("click", addSalary);

window.deleteSalary = async (id) => {
  try {
    const salaryRef = doc(db, "salaries", id);
    await deleteDoc(salaryRef);
    Swal.fire("Terhapus!", "Data gaji telah dihapus", "success");
    loadSalaries(); // Memperbarui tampilan setelah penghapusan
  } catch (error) {
    console.error("Error deleting salary:", error);
    Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data", "error");
  }
};

window.editSalary = async (id) => {
  const salaryRef = doc(db, "salaries", id);
  const salarySnap = await getDoc(salaryRef);

  if (!salarySnap.exists()) {
    Swal.fire("Error", "Data gaji tidak ditemukan!", "error");
    return;
  }

  const salaryData = salarySnap.data();
  const payDate = salaryData.payDate
    ? new Date(salaryData.payDate).toISOString().split("T")[0]
    : "";

  const { value: updatedSalary } = await Swal.fire({
    title: "Edit Gaji Karyawan",
    html: `
            <label for="swal-base-salary">Gaji Pokok</label>
            <input id="swal-base-salary" class="swal2-input" type="number" placeholder="Gaji Pokok" value="${salaryData.baseSalary}">
            <label for="swal-allowance">Tunjangan</label>
            <input id="swal-allowance" class="swal2-input" type="number" placeholder="Tunjangan" value="${salaryData.allowance}">
            <label for="swal-deduction">Potongan</label>
            <input id="swal-deduction" class="swal2-input" type="number" placeholder="Potongan" value="${salaryData.deduction}">
            <label for="swal-pay-date">Tanggal Gajian</label>
            <input id="swal-pay-date" class="swal2-input" type="date" value="${payDate}">
        `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    preConfirm: () => {
      return {
        baseSalary:
          parseFloat(document.getElementById("swal-base-salary").value) || 0,
        allowance:
          parseFloat(document.getElementById("swal-allowance").value) || 0,
        deduction:
          parseFloat(document.getElementById("swal-deduction").value) || 0,
        totalSalary:
          (parseFloat(document.getElementById("swal-base-salary").value) || 0) +
          (parseFloat(document.getElementById("swal-allowance").value) || 0) -
          (parseFloat(document.getElementById("swal-deduction").value) || 0),
        payDate:
          document.getElementById("swal-pay-date").value || salaryData.payDate,
      };
    },
  });

  if (!updatedSalary) return;

  await updateDoc(salaryRef, updatedSalary);
  Swal.fire("Berhasil!", "Data gaji telah diperbarui.", "success");
  loadSalaries();
};

window.viewSalaryDetail = async (id) => {
  const salaryRef = doc(db, "salaries", id);
  const salarySnap = await getDoc(salaryRef);

  if (salarySnap.exists()) {
    const data = salarySnap.data();
    const payDate = data.payDate
      ? new Date(data.payDate).toLocaleDateString()
      : "-";
    const formatIDR = (amount) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

    Swal.fire(
      "Detail Gaji",
      `
            <strong>Nama:</strong> ${data.employeeName} <br>
            <strong>Jabatan:</strong> ${data.position || "Tidak Diketahui"} <br>
            <strong>Departemen:</strong> ${
              data.department || "Tidak Diketahui"
            } <br>
            <strong class="text-green-500">Gaji Pokok:</strong> ${formatIDR(
              data.baseSalary
            )} <br>
            <strong class="text-blue-700">Tunjangan:</strong> ${formatIDR(
              data.allowance
            )} <br>
            <strong class="text-red-600">Potongan:</strong> ${formatIDR(
              data.deduction
            )} <br>
            <strong>Total Gaji:</strong> ${formatIDR(data.totalSalary)} <br>
            <strong>Tanggal Gajian:</strong> ${payDate}
        `
    );
  } else {
    Swal.fire("Error", "Data tidak ditemukan", "error");
  }
};

document
  .getElementById("download-pdf-btn")
  .addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Laporan Gaji Karyawan", 15, 15);
    doc.setFontSize(10);

    const filterMonth = document.getElementById("filter-month").value;
    const querySnapshot = await getDocs(collection(db, "salaries"));
    let y = 30;

    const columnHeaders = [
      "Nama Karyawan",
      "Jabatan",
      "Departemen",
      "Gaji Pokok",
      "Tunjangan",
      "Potongan",
      "Total Gaji",
      "Tanggal Gajian",
    ];

    const rowData = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const payDate = data.payDate
        ? new Date(data.payDate).toLocaleDateString()
        : "-";

      rowData.push([
        data.employeeName,
        data.position,
        data.department,
        `Rp ${data.baseSalary.toLocaleString()}`,
        `Rp ${data.allowance.toLocaleString()}`,
        `Rp ${data.deduction.toLocaleString()}`,
        `Rp ${data.totalSalary.toLocaleString()}`,
        payDate, // Menampilkan tanggal gajian di laporan
      ]);
    });

    doc.autoTable({
      head: [columnHeaders],
      body: rowData,
      startY: y,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });

    doc.save("Laporan_Gaji_Karyawan.pdf");
  });

filterMonth.addEventListener("change", async (e) => {
  loadSalaries(e.target.value);
});

loadSalaries();

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
