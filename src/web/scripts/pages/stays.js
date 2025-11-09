import { CA_CITIES, TX_CITIES } from "../utilities/locationValidation.js";
import { Cart } from "../utilities/Cart.js";

class Form {
  static getMessageElement() {
    return document.getElementById("formMessage");
  }

  static setMessageText(text) {
    Form.getMessageElement().textContent = text;
  }

  static setFailMessage(text) {
    Form.getMessageElement().className = "form-message form-message-failure";
    Form.setMessageText(text);
  }

  static setSuccessMessage(text) {
    Form.getMessageElement().className = "form-message form-message-success";
    Form.setMessageText(text);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const staysForm = document.forms["staysForm"];

  staysForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = staysForm["city"].value.trim();
    const checkinDate = new Date(staysForm["checkinDate"].value.trim());
    const checkoutDate = new Date(staysForm["checkoutDate"].value.trim());
    const adults = staysForm["numAdults"].value.trim();
    const children = staysForm["numChildren"].value.trim();
    const infants = staysForm["numInfants"].value.trim();

    const startDate = new Date("2024-09-01");
    const endDate = new Date("2024-12-01");

    if ((!TX_CITIES.includes(city.toLowerCase())) && (!CA_CITIES.includes(city.toLowerCase()))) {
      Form.setFailMessage("Origin must be either Texas or California");
      return false
    }

    if (!(checkinDate >= startDate && checkinDate < endDate)) {
      Form.setFailMessage("Please enter a valid check in date. Date must be on or after September 1st, 2024 and before December 1st, 2024.");
      return false;
    }

    if (!(checkoutDate > checkinDate && checkoutDate <= endDate)) {
      Form.setFailMessage("Please enter a valid check in date. Date must be after your check in date and before December 1st, 2024.");
      return false;
    }

    var nadults = Number(adults);
    var nchildren = Number(children);
    var rooms = Math.ceil((nadults + nchildren) / 2);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const normIn = checkinDate.toLocaleDateString('en-US', options);
    const normOut = checkoutDate.toLocaleDateString('en-US', options);

    var infoback = "Location: " + city + ", Check in date: " + normIn + ", Check out date: " + normOut + ", Number of Adults: " + adults + ", Number of Children: " + children +
      ", Number of Infants: " + infants + ", Number of Rooms needed: " + rooms;

    Form.setSuccessMessage(infoback);
    
    loadHotels(city, rooms, checkinDate, checkoutDate);

    return true;
  });
});

async function loadHotels(city, rooms, checkinDate, checkoutDate) {
  const container = document.getElementById("hotelResults");
  container.innerHTML = "Loading hotels...";
  try {
    const res = await fetch("/api/hotel/listings");
    if (!res.ok) {
      container.textContent = "Error loading hotels.";
      return;
    }
    const hotels = await res.json();
    const matchingHotels = hotels.filter(h =>
      h.city.toLowerCase() === city.toLowerCase() &&
      Number(h["available-rooms"]) >= rooms
    );
    if (matchingHotels.length === 0) {
      container.textContent = `No hotels available in ${city} with ${rooms} room(s).`;
      return;
    }
    renderHotelResults(container, matchingHotels, { city, rooms, checkinDate, checkoutDate });
  } catch (err) {
    container.textContent = "Failed to load hotels.";
  }
}

function renderHotelResults(container, hotels, stayInfo) {
  container.innerHTML = "";
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = `
    <th>Hotel ID</th>
    <th>Name</th>
    <th>City</th>
    <th>Price / Night</th>
    <th>Available Rooms</th>
    <th>Action</th>
  `;
  table.appendChild(header);
  hotels.forEach(hotel => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${hotel["hotel-id"]}</td>
      <td>${hotel["hotel-name"]}</td>
      <td>${hotel.city}</td>
      <td>$${hotel["price-per-night"]}</td>
      <td>${hotel["available-rooms"]}</td>
      <td><button type="button">Add to Cart</button></td>
    `;
    row.querySelector("button").addEventListener("click", () => {
      addHotelToCart(hotel, stayInfo);
    });
    table.appendChild(row);
  });
  container.appendChild(table);
}

function addHotelToCart(hotel, stayInfo) {
  const nights = (stayInfo.checkoutDate - stayInfo.checkinDate) / (1000 * 60 * 60 * 24);
  const pricePerNight = Number(hotel["price-per-night"]);
  const hotelCartItem = {
    hotelID: hotel["hotel-id"],
    hotelName: hotel["hotel-name"],
    city: hotel.city,
    rooms: stayInfo.rooms,
    checkInDate: stayInfo.checkinDate.toISOString().slice(0, 10),
    checkOutDate: stayInfo.checkoutDate.toISOString().slice(0, 10),
    pricePerNight: pricePerNight,
    nights: nights
  };
  Cart.addHotel(hotelCartItem);
  alert("Hotel added to cart.");
}

