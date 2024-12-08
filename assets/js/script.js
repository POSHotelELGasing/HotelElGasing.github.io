const API_ROOMS = "https://6734ee1b5995834c8a916658.mockapi.io/api/v1/room";
const API_GUESTS = "https://6734ee1b5995834c8a916658.mockapi.io/api/v1/guests";

// Fungsi untuk mengambil data kamar dari API
async function fetchRooms() {
  try {
    const response = await fetch(API_ROOMS);
    const rooms = await response.json();

    // Render data kamar ke tabel
    const roomList = document.getElementById("room-list");
    roomList.innerHTML = rooms
      .map(
        (room) => `
        <tr>
          <td class="border p-2">${room.room_number}</td>
          <td class="border p-2">${room.room_type}</td>
          <td class="border p-2">Rp ${room.price}</td>
          <td class="border p-2">${room.status}</td>
          <td class="border p-2">
            <button class="bg-yellow-500 text-white p-1 rounded">Edit</button>
          </td>
        </tr>
      `
      )
      .join("");

    // Update total kamar di dashboard
    document.getElementById("total-rooms").textContent = rooms.length;
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
}

// Fungsi untuk mengambil data tamu dari API
async function fetchGuests() {
  try {
    const response = await fetch(API_GUESTS);
    const guests = await response.json();

    // Render data tamu ke tabel
    const guestList = document.getElementById("guest-list");
    guestList.innerHTML = guests
      .map(
        (guest) => `
        <tr>
          <td class="border p-2">${guest.full_name}</td>
          <td class="border p-2">${guest.identity_number}</td>
          <td class="border p-2">${guest.phone_number}</td>
          <td class="border p-2">${guest.email}</td>
          <td class="border p-2">
            <button class="bg-red-500 text-white p-1 rounded">Hapus</button>
          </td>
        </tr>
      `
      )
      .join("");

    // Update total tamu di dashboard
    document.getElementById("total-guests").textContent = guests.length;
  } catch (error) {
    console.error("Error fetching guests:", error);
  }
}

// Inisialisasi data awal
document.addEventListener("DOMContentLoaded", () => {
  fetchRooms();
  fetchGuests();
});
