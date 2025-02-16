// Firebase Config
 // Firebase Config
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

const menuTableBody = document.getElementById("menu-table");
const menuChartElem = document.getElementById("menuChart");
const totalMenuElem = document.getElementById("total-menu");
const totalStockElem = document.getElementById("total-stock");

// Fetch data menu dari Firestore dan hitung stok
const fetchMenuData = () => {
  const menuCollection = db.collection("product");
  menuCollection.get()
    .then((snapshot) => {
      // Clear the table first
      menuTableBody.innerHTML = "";

      // Untuk menyimpan total stok per kategori
      const stockByCategory = {};
      let totalMenu = 0;
      let totalStock = 0;

      snapshot.forEach((doc) => {
        const menuItem = doc.data();

        // Update data stok untuk kategori
        if (stockByCategory[menuItem.category]) {
          stockByCategory[menuItem.category] += menuItem.stock;
        } else {
          stockByCategory[menuItem.category] = menuItem.stock;
        }

        // Update total menu dan total stok
        totalMenu++;
        totalStock += menuItem.stock;

        // Create table row for each menu item
        menuTableBody.innerHTML += `
          <tr>
            <td class="p-4">${menuItem.name}</td>
            <td class="p-4">${menuItem.category}</td>
            <td class="p-4">${menuItem.price}</td>
            <td class="p-4">${menuItem.stock}</td>
          </tr>
        `;
      });

      // Update total menu dan total stok di halaman
      totalMenuElem.textContent = totalMenu;
      totalStockElem.textContent = totalStock;

      // Buat data untuk chart
      const chartData = {
        labels: Object.keys(stockByCategory),  // kategori menu
        datasets: [{
          label: 'Stok Menu',
          data: Object.values(stockByCategory),  // jumlah stok per kategori
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)', // warna untuk kategori 1
            'rgba(153, 102, 255, 0.2)', // warna untuk kategori 2
            'rgba(255, 159, 64, 0.2)',  // warna untuk kategori 3
            'rgba(54, 162, 235, 0.2)',  // warna untuk kategori 4
            // tambahkan warna lainnya sesuai kebutuhan
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
            // sesuaikan border color
          ],
          borderWidth: 1
        }]
      };

      // Cek jika elemen canvas tersedia
      if (menuChartElem) {
        // Hapus chart sebelumnya jika ada
        if (menuChartElem.chart) {
          menuChartElem.chart.destroy();
        }

        // Inisialisasi chart baru
        new Chart(menuChartElem, {
          type: 'pie',  // Tipe chart pie
          data: chartData
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching menu data: ", error);
    });
};

// Inisialisasi data saat halaman dimuat
fetchMenuData();
