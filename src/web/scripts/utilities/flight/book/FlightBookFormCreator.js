import { FlightBooker } from "./FlightBooker.js"
import { FlightBookForm } from "./FlightBookForm.js";
import { FlightBookSubmission } from "./FlightBookSubmission.js";

export class FlightBookFormCreator {

  constructor(flightTicket) {
    this.flightTicket = flightTicket;
  }

  createFormElement() {
    const form = document.createElement("form");
    form.innerHTML = this.createFlightFormElementHTML();
    form.appendChild(this.createBookFlightButton(form));
    return form;
  }

  createFlightFormElementHTML() {
    return (`
      <div>
        <h2>Flight Details</h2>
        <ul>
          <li><strong>Flight ID:</strong> ${this.flightTicket.listing.id}</li>
          <li><strong>Flight Type:</strong> ${this.flightTicket.getFlightTypeLabel()}</li>
          <li><strong>Origin:</strong> ${this.flightTicket.listing.origin}</li>
          <li><strong>Destination:</strong> ${this.flightTicket.listing.destination}</li>
          <li><strong>Departure Date:</strong> ${this.flightTicket.listing.departureDate}</li>
          <li><strong>Departure Time:</strong> ${this.flightTicket.listing.departureTime}</li>
          <li><strong>Arrival Date:</strong> ${this.flightTicket.listing.arrivalDate}</li>
          <li><strong>Arrival Time:</strong> ${this.flightTicket.listing.arrivalTime}</li>
          </ul>
        <h2>Pricing Breakdown</h2>
        <ul>
          <li><strong>Number of Adults:</strong>  ${this.flightTicket.designations.numAdults}</li>
          <li><strong>Number of Children:</strong>  ${this.flightTicket.designations.numChildren}</li>
          <li><strong>Number of Infants:</strong>  ${this.flightTicket.designations.numInfants}</li>
          <li><strong>Price per Adult:</strong> $${this.flightTicket.getPricePerAdult()}</li>
          <li><strong>Price per Child:</strong> $${this.flightTicket.getPricePerChild()}</li>
          <li><strong>Price per Infant:</strong> $${this.flightTicket.getPricePerInfant()}</li>
          <li><strong>Total Price:</strong> $${this.flightTicket.getTotalPrice()}</li>
        </ul>
        <h2>Passenger Details</h2>
        <div class="stack">
          ${this.createPassengerFormSectionHTML('adult', this.flightTicket.designations.numAdults)}
          ${this.createPassengerFormSectionHTML('child', this.flightTicket.designations.numChildren)}
          ${this.createPassengerFormSectionHTML('infant', this.flightTicket.designations.numInfants)}
        </div>
      </div>
      <br/>
    `);
  }

  createPassengerFormSectionHTML(passengerType, numPassengers) {
    return Array.from({ length: numPassengers }, (_, i) => (`
      <div class="form-section">
        <h3 style="margin:0px">${this.capitalize(passengerType)} Passenger ${i + 1}</h3>
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

  createBookFlightButton(form) {
    const bookFlightButton = document.createElement("button");
    bookFlightButton.setAttribute("type", "submit");
    bookFlightButton.textContent = "Book Flight";

    bookFlightButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (form.checkValidity()) {
        const bookSubmission = new FlightBookSubmission(this.flightTicket.designations);
        const flightBooker = new FlightBooker(bookSubmission, this.flightTicket);

        await flightBooker.bookFlight();
        alert("Flight booked successfully!");

        FlightBookForm.refreshSelectElement();
        FlightBookForm.clearForm();
      }
    });

    return bookFlightButton;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}