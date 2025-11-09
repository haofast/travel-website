import { Cart } from "../../Cart.js";

export class HotelBookForm {
  static refreshSelectElement() {
    const select = document.getElementById("hotelSelect");
    const noHotelsMessage = document.getElementById("noHotelsMessage");
    const hotels = Cart.getHotels();

    select.innerHTML = "";

    if (!hotels || hotels.length === 0) {
      noHotelsMessage.classList.remove("invisible");
      return;
    }

    noHotelsMessage.classList.add("invisible");

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a hotel";
    select.appendChild(defaultOption);

    hotels.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${item.hotelName} (${item.city}) ${item.checkInDate} - ${item.checkOutDate}`;
      select.appendChild(option);
    });
  }

  static displayForm(indexString) {
    const wrapper = document.getElementById("hotelBookFormWrapper");
    wrapper.innerHTML = "";

    if (!indexString) {
      return;
    }

    const index = Number(indexString);
    const hotels = Cart.getHotels();
    const item = hotels[index];

    if (!item) {
      return;
    }

    const nights = item.nights ?? ((new Date(item.checkOutDate) - new Date(item.checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * item.pricePerNight * item.rooms;

    const form = document.createElement("form");
    form.innerHTML = `
      <p><strong>${item.hotelName}</strong> (${item.city})</p>
      <p>Check-in: ${item.checkInDate}</p>
      <p>Check-out: ${item.checkOutDate}</p>
      <p>Rooms: ${item.rooms}</p>
      <p>Price per night: $${item.pricePerNight}</p>
      <p>Total price: $${totalPrice}</p>
      <button type="submit">Book Hotel</button>
    `;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await HotelBookForm.bookHotel(index);
    });

    wrapper.appendChild(form);
  }

  static async bookHotel(index) {
    const hotels = Cart.getHotels();
    const item = hotels[index];

    if (!item) {
      return;
    }

    const nights = item.nights ?? ((new Date(item.checkOutDate) - new Date(item.checkInDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * item.pricePerNight * item.rooms;

    const booking = {
      userId: localStorage.getItem("USER_ID") ?? "demoUser",
      hotelID: item.hotelID,
      city: item.city,
      rooms: item.rooms,
      checkInDate: item.checkInDate,
      checkOutDate: item.checkOutDate,
      totalPrice: totalPrice
    };

    const res = await fetch("/api/hotel/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    if (!res.ok) {
      alert("Failed to book hotel.");
      return;
    }

    Cart.removeHotel(index);
    HotelBookForm.refreshSelectElement();
    document.getElementById("hotelBookFormWrapper").innerHTML = "";
    alert("Hotel booked successfully!");
  }
}
