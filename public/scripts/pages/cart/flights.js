import { Cart } from "../../utilities/Cart.js";
import { FlightTicket } from "../../utilities/flight/FlightTicket.js"
import { getFlightData } from "../../utilities/flight/FlightData.js";

class FlightForm {

  static getFormElement() {
    return document.getElementById("flightForm");
  }

  static refreshSelectElement() {
    const flightCartItems = Cart.getFlights();
    const selectElement = document.getElementById("flightSelect");
    const noFlightsMessage = document.getElementById("noFlightsMessage");

    if (Object.keys(flightCartItems).length === 0) {
      selectElement.classList.add("invisible");
      noFlightsMessage.classList.remove("invisible");

    } else {
      selectElement.classList.remove("invisible")
      noFlightsMessage.classList.add("invisible");

      selectElement.innerHTML = (`
        <option value="" disabled selected>Select flight</option>
      `);

      Object.keys(flightCartItems).forEach((flightID) => {
        const flightData = getFlightData(flightID);
        const optionElement = document.createElement("option");
        optionElement.text = `${flightData.id} - ${flightData.origin} to ${flightData.destination}`;
        optionElement.value = flightData.id;
        selectElement.appendChild(optionElement);
      });
    }
  }

  static displayForm(flightID) {
    const flightData = getFlightData(flightID);
    const submissionData = Cart.getFlight(flightID);
    const flightTicket = new FlightTicket(flightData, submissionData);

    const flightFormElement = FlightForm.getFormElement();

    flightFormElement.innerHTML = (`
      <div>
        <h2>Flight Details</h2>
        <ul>
          <li><strong>Flight ID:</strong> ${flightData.id}</li>
          <li><strong>Flight Type:</strong> ${flightTicket.getFlightTypeLabel()}</li>
          <li><strong>Origin:</strong> ${flightData.origin}</li>
          <li><strong>Destination:</strong> ${flightData.destination}</li>
          <li><strong>Departure Date:</strong> ${flightData.departureDate}</li>
          <li><strong>Departure Time:</strong> ${flightData.departureTime}</li>
          <li><strong>Arrival Date:</strong> ${flightData.arrivalDate}</li>
          <li><strong>Arrival Time:</strong> ${flightData.arrivalTime}</li>
          </ul>
        <h2>Pricing Breakdown</h2>
        <ul>
          <li><strong>Number of Adults:</strong>  ${submissionData.numAdults}</li>
          <li><strong>Number of Children:</strong>  ${submissionData.numChildren}</li>
          <li><strong>Number of Infants:</strong>  ${submissionData.numInfants}</li>
          <li><strong>Price per Adult:</strong> $${flightTicket.getPricePerAdult()}</li>
          <li><strong>Price per Child:</strong> $${flightTicket.getPricePerChild()}</li>
          <li><strong>Price per Infant:</strong> $${flightTicket.getPricePerInfant()}</li>
          <li><strong>Total Price:</strong> $${flightTicket.getTotalPrice()}</li>
        </ul>
        <h2>Passenger Details</h2>
        <div class="stack">
          ${getPassengerFormHTML('adult', submissionData.numAdults)}
          ${getPassengerFormHTML('child', submissionData.numChildren)}
          ${getPassengerFormHTML('infant', submissionData.numInfants)}
        </div>
      </div>
      <br/>
      <button type="submit" id="bookFlightButton">Book Flight</button>
    `);

    function getPassengerFormHTML(passengerType, numPassengers) {
      const passengerTypeCapitalized = (
        passengerType.charAt(0).toUpperCase() + passengerType.slice(1)
      );

      return Array.from({ length: numPassengers }, (_, i) => (`
        <div class="form-section">
          <h3 style="margin:0px">${passengerTypeCapitalized} Passenger ${i + 1}</h3>
          <div class="form-input-wrapper">
            <label for="${passengerType}FirstName${i}">First Name:</label>
            <input class="input-text" type="text" id="${passengerType}FirstName${i}" required>
          </div>
          <div class="form-input-wrapper">
            <label for="${passengerType}LastName${i}">Last Name:</label>
            <input class="input-text" type="text" id="${passengerType}LastName${i}" required>
          </div>
          <div class="form-input-wrapper">
            <label for="${passengerType}DOB${i}">Date of Birth:</label>
            <input class="input-text" type="date" id="${passengerType}DOB${i}" required>
          </div>
          <div class="form-input-wrapper">
            <label for="${passengerType}SSN${i}">SSN:</label>
            <input class="input-text" type="text" id="${passengerType}SSN${i}" required>
          </div>
        </div>
      `)).join('');
    }

    const bookFlightButton = document.getElementById("bookFlightButton");
    bookFlightButton.addEventListener("click", (event) => {
      if (flightFormElement.checkValidity()) {
        FormUtils.bookFlight(flightTicket);
        alert("Flight booked successfully!");
      }
    });
  }

  static clearForm() {
    FlightForm.getFormElement().innerHTML = "";
  }
}

class FormUtils {

  static bookFlight(flightTicket) {
    const bookedFlight = {
      id: flightTicket.flightData.id,
      origin: flightTicket.flightData.origin,
      destination: flightTicket.flightData.destination,
      departureDate: flightTicket.flightData.departureDate,
      arrivalDate: flightTicket.flightData.arrivalDate,
      departureTime: flightTicket.flightData.departureTime,
      arrivalTime: flightTicket.flightData.arrivalTime,
      totalPrice: flightTicket.getTotalPrice(),
      bookingNumber: crypto.randomUUID(),
      passengers: [
        ...getPassengerData('adult', flightTicket.submissionData.numAdults),
        ...getPassengerData('child', flightTicket.submissionData.numChildren),
        ...getPassengerData('infant', flightTicket.submissionData.numInfants),
      ],
    }

    function getPassengerData(passengerType, numPassengers) {
      return Array.from({ length: numPassengers }, (_, i) => ({
        type: passengerType,
        firstName: document.getElementById(`${passengerType}FirstName${i}`).value,
        lastName: document.getElementById(`${passengerType}LastName${i}`).value,
        dob: document.getElementById(`${passengerType}DOB${i}`).value,
        ssn: document.getElementById(`${passengerType}SSN${i}`).value,
      }));
    }

    FormUtils.removeFlightFromCart(flightTicket.flightData.id);
    FlightForm.refreshSelectElement();
    FlightForm.clearForm();
    console.log("Booked Flight:", bookedFlight);
  }

  static removeFlightFromCart(flightId) {
    const cartItems = JSON.parse(localStorage.getItem('CART_ITEMS')) || {};
    if (cartItems.flights && cartItems.flights[flightId]) {
      delete cartItems.flights[flightId];
      localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  FlightForm.refreshSelectElement();

  document.getElementById("flightSelect").addEventListener("change", (event) => {
    event.preventDefault();
    FlightForm.displayForm(event.target.value);
  });
});
