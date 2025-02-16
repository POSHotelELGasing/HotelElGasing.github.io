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

  // Initialize Firebase with the correct method for v8
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const totalRoomsElement = document.getElementById("total-rooms");
  const occupiedRoomsElement = document.getElementById("occupied-rooms");
  const availableRoomsElement = document.getElementById("available-rooms");
  const roomChartElement = document.getElementById("roomChart");
  const roomTableBody = document.getElementById("room-table");

  let totalRooms = 0;
  let occupiedRooms = 0;
  let availableRooms = 0;

  const fetchRoomData = () => {
    const roomsCollection = db.collection("rooms");
    roomsCollection.get()
      .then((snapshot) => {
        totalRooms = snapshot.size;
        occupiedRooms = 0;
        availableRooms = 0;
  
        // Clear the table first
        roomTableBody.innerHTML = "";
  
        snapshot.forEach((doc) => {
          const room = doc.data();
          // Update the counts
          if (room.status === "Occupied" || room.status === "occupied") {
            occupiedRooms++;
          } else if (room.status === "Available") {
            availableRooms++;
          }
  
          // Create table row for each room
          roomTableBody.innerHTML += `
            <tr>
              <td class="p-4">${room.number}</td>
              <td class="p-4">${room.type}</td>
              <td class="p-4">${room.status}</td>
            </tr>
          `;
        });
  
        // Update the room statistics on the page
        totalRoomsElement.textContent = totalRooms;
        occupiedRoomsElement.textContent = occupiedRooms;
        availableRoomsElement.textContent = availableRooms;
  
        // Update the chart
        updateChart();
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
      });
  };
  

  // Function to update the chart
  const updateChart = () => {
    const ctx = roomChartElement.getContext("2d");
    const roomChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Kamar', 'Kamar Terisi', 'Kamar Kosong'],
        datasets: [{
          label: 'Jumlah Kamar',
          data: [totalRooms, occupiedRooms, availableRooms],
          backgroundColor: ['#4B8B3B', '#FF6F61', '#2F80ED'],
          borderColor: ['#2E5E2A', '#D24C3A', '#1C60B7'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  // Initialize the page by fetching room data
  fetchRoomData();
  document
  .getElementById("pegawai-toggle")
  .addEventListener("click", function () {
    var menu = document.getElementById("pegawai-menu");
    menu.classList.toggle("hidden");
  });   