import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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
const reportTable = document.getElementById("report-table");
const filterMonth = document.getElementById("filter-month");
const filterDepartment = document.getElementById("filter-department");
const filterPosition = document.getElementById("filter-position");
const searchEmployee = document.getElementById("search-employee");
const totalSalary = document.getElementById("total-salary");
const totalEmployees = document.getElementById("total-employees");
const employeeCountElement = document.getElementById("employee-count");

async function updateEmployeeCount() {
  try {
    const querySnapshot = await getDocs(collection(db, "employees"));
    employeeCountElement.textContent = querySnapshot.size;
  } catch (error) {
    console.error("Error fetching employee count:", error);
  }
}

let salaryChart;

function renderChart(chartData, labels, title) {
  const ctx = document.getElementById("salaryChart").getContext("2d");
  if (salaryChart instanceof Chart) {
    salaryChart.destroy();
  }
  salaryChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: title,
          data: chartData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          fill: true,
        },
      ],
    },
  });
}

async function loadReport(
  filter = "",
  department = "",
  position = "",
  search = "",
  viewBy = "monthly"
) {
  console.log("📌 Memulai loadReport dengan filter:", {
    filter,
    department,
    position,
    search,
    viewBy,
  });

  if (!reportTable) {
    console.error("❌ Elemen reportTable tidak ditemukan di DOM!");
    return;
  }

  reportTable.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "salaries"));
  console.log("📌 Total Data dari Firestore:", querySnapshot.docs.length);

  if (querySnapshot.docs.length === 0) {
    console.warn("⚠️ Tidak ada data gaji di Firestore.");
    return;
  }

  let totalSalaries = 0;
  let employeeCount = 0;
  let chartData = {};
  let labels = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(
      `🔎 Cek Data Pegawai: ${data.employeeName}, Total Gaji: ${data.totalSalary}`
    );

    const salaryDate = new Date(data.payDate || data.date);
    const month = salaryDate.getMonth() + 1;
    const day = salaryDate.getDate();
    const year = salaryDate.getFullYear();

    // Debugging untuk memastikan filter berjalan dengan benar
    if (
      (filter && month !== parseInt(filter, 10)) ||
      (department && data.department !== department) ||
      (position && data.position !== position) ||
      (search &&
        !data.employeeName.toLowerCase().includes(search.toLowerCase()))
    ) {
      console.log(`🚨 Data ${data.employeeName} terfilter keluar`);
      return; // Jika tidak lolos filter, data tidak ditambahkan ke tabel
    }

    console.log(
      `✅ Data ${data.employeeName} lolos filter, akan ditambahkan ke tabel`
    );

    totalSalaries += data.totalSalary;
    employeeCount++;

    let label;
    if (viewBy === "daily") {
      label = `${day}/${month}`;
    } else if (viewBy === "yearly") {
      label = `${month}/${year}`;
    } else {
      label = salaryDate.toLocaleString("id-ID", { month: "long" });
    }

    if (!chartData[label]) {
      chartData[label] = 0;
    }
    chartData[label] += data.totalSalary;

    // Format gaji ke format IDR
    const formatIDR = (amount) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);

    // Menambahkan data ke tabel
    updateEmployeeCount();
    const row = `
<tr class="border-b">
    <td class="p-2">${data.employeeName}</td>
    <td class="p-2">${data.position || "-"}</td>
    <td class="p-2">${data.department || "-"}</td>
    <td class="p-2">${formatIDR(data.baseSalary)}</td>
    <td class="p-2">${formatIDR(data.allowance)}</td>
    <td class="p-2">${formatIDR(data.deduction)}</td>
    <td class="p-2 font-bold">${formatIDR(data.totalSalary)}</td>
    <td class="p-2">${salaryDate.toLocaleDateString()}</td>
</tr>`;

    reportTable.insertAdjacentHTML("beforeend", row);
    console.log(`✅ Data ${data.employeeName} berhasil ditambahkan ke tabel!`);
  });

  console.log("📌 Isi reportTable setelah update:", reportTable.innerHTML);

  // Update total gaji & jumlah karyawan di UI
  totalSalary.textContent = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalSalaries);
  totalEmployees.textContent = employeeCount;

  // Update grafik
  labels = Object.keys(chartData);
  const chartValues = Object.values(chartData);

  renderChart(
    chartValues,
    labels,
    viewBy === "daily"
      ? "Gaji Harian"
      : viewBy === "yearly"
      ? "Gaji Tahunan"
      : "Gaji Bulanan"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const dailyBtn = document.getElementById("view-daily");
  const monthlyBtn = document.getElementById("view-monthly");
  const yearlyBtn = document.getElementById("view-yearly");

  if (dailyBtn) {
    dailyBtn.addEventListener("click", () =>
      loadReport(
        filterMonth.value,
        filterDepartment.value,
        filterPosition.value,
        searchEmployee.value,
        "daily"
      )
    );
  }

  if (monthlyBtn) {
    monthlyBtn.addEventListener("click", () =>
      loadReport(
        filterMonth.value,
        filterDepartment.value,
        filterPosition.value,
        searchEmployee.value,
        "monthly"
      )
    );
  }

  if (yearlyBtn) {
    yearlyBtn.addEventListener("click", () =>
      loadReport(
        filterMonth.value,
        filterDepartment.value,
        filterPosition.value,
        searchEmployee.value,
        "yearly"
      )
    );
  }
});

document.getElementById("download-csv-btn").addEventListener("click", () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "Nama,Jabatan,Departemen,Gaji Pokok,Tunjangan,Potongan,Total,Tanggal Gajian\n";

  document.querySelectorAll("#report-table tr").forEach((row) => {
    let rowData = [];
    row.querySelectorAll("td").forEach((cell) => {
      rowData.push(cell.innerText);
    });
    csvContent += rowData.join(",") + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Laporan_Gaji_Karyawan.csv");
  document.body.appendChild(link);
  link.click();
});

filterMonth.addEventListener("change", (e) => {
  loadReport(
    e.target.value,
    filterDepartment.value,
    filterPosition.value,
    searchEmployee.value
  );
});

filterDepartment.addEventListener("change", (e) => {
  loadReport(
    filterMonth.value,
    e.target.value,
    filterPosition.value,
    searchEmployee.value
  );
});

filterPosition.addEventListener("change", (e) => {
  loadReport(
    filterMonth.value,
    filterDepartment.value,
    e.target.value,
    searchEmployee.value
  );
});

searchEmployee.addEventListener("input", (e) => {
  loadReport(
    filterMonth.value,
    filterDepartment.value,
    filterPosition.value,
    e.target.value
  );
});

document.getElementById("download-pdf-btn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text("Laporan Gaji Karyawan", 15, 15);
  doc.setFontSize(10);

  const rows = [];
  document.querySelectorAll("#report-table tr").forEach((row) => {
    const rowData = [];
    row.querySelectorAll("td").forEach((cell) => {
      rowData.push(cell.innerText);
    });
    rows.push(rowData);
  });

  if (rows.length === 0) {
    console.warn("⚠️ Tidak ada data dalam tabel untuk diunduh!");
    Swal.fire(
      "Peringatan",
      "Tidak ada data yang tersedia untuk diunduh!",
      "warning"
    );
    return;
  }

  doc.autoTable({
    head: [
      [
        "Nama",
        "Jabatan",
        "Departemen",
        "Gaji Pokok",
        "Tunjangan",
        "Potongan",
        "Total",
        "Tanggal Gajian",
      ],
    ],
    body: rows,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
  });

  doc.save("Laporan_Gaji_Karyawan.pdf");
  console.log("✅ Laporan Gaji telah diunduh sebagai PDF!");
});

loadReport();

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
