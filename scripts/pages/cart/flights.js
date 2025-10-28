class FlightForm {

  static getFormElement() {
    return document.getElementById("flightForm");
  }

  static refreshSelectInput() {
    const flightCartItems = FormUtils.getFlightCartItems();
    const flightSelectInput = document.getElementById("flightSelect");
    const noFlightsMessage = document.getElementById("noFlightsMessage");

    if (Object.entries(flightCartItems).length === 0) {
      flightSelectInput.classList.add("invisible");
      noFlightsMessage.classList.remove("invisible");

    } else {
      flightSelectInput.classList.remove("invisible")
      noFlightsMessage.classList.add("invisible");

      flightSelectInput.innerHTML = (`
        <option value="" disabled selected>Select flight</option>
      `);

      Object.values(flightCartItems).forEach((flight) => {
        const option = document.createElement("option");
        flightSelectInput.appendChild(option);

        option.text = `${flight.id} - ${flight.origin} to ${flight.destination}`;
        option.value = flight.id;
      });
    }
  }

  static displayForm(flightId) {
    const flight = FormUtils.getFlightCartItems()[flightId];
    const flightPricing = FormUtils.getFlightPricing(flight.price, flight.passengers);
    const flightFormElement = FlightForm.getFormElement();

    flightFormElement.innerHTML = (`
      <div>
        <h2>Flight Details</h2>
        <ul>
          <li><strong>Flight ID:</strong> ${flight.id}</li>
          <li><strong>Flight Type:</strong> ${FormUtils.getFlightTypeDisplayString(flight.type)}</li>
          <li><strong>Origin:</strong> ${flight.origin}</li>
          <li><strong>Destination:</strong> ${flight.destination}</li>
          <li><strong>Departure Date:</strong> ${flight.departureDate}</li>
          <li><strong>Departure Time:</strong> ${flight.departureTime}</li>
          <li><strong>Arrival Date:</strong> ${flight.arrivalDate}</li>
          <li><strong>Arrival Time:</strong> ${flight.arrivalTime}</li>
          </ul>
        <h2>Pricing Breakdown</h2>
        <ul>
          <li><strong>Number of Adults:</strong>  ${flight.passengers.adults}</li>
          <li><strong>Number of Children:</strong>  ${flight.passengers.children}</li>
          <li><strong>Number of Infants:</strong>  ${flight.passengers.infants}</li>
          <li><strong>Price per Adult:</strong> $${flightPricing.adultPrice}</li>
          <li><strong>Price per Child:</strong> $${flightPricing.childPrice}</li>
          <li><strong>Price per Infant:</strong> $${flightPricing.infantPrice}</li>
          <li><strong>Total Price:</strong> $${flightPricing.totalPrice}</li>
        </ul>
        <h2>Passenger Details</h2>
        <div class="stack">
          ${getPassengerFormHTML('adult', flight.passengers.adults)}
          ${getPassengerFormHTML('child', flight.passengers.children)}
          ${getPassengerFormHTML('infant', flight.passengers.infants)}
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
        FormUtils.bookFlight(flight);
        alert("Flight booked successfully!");
      }
    });
  }

  static clearForm() {
    FlightForm.getFormElement().innerHTML = "";
  }
}

class FormUtils {

  static getFlightCartItems() {
    return JSON.parse(localStorage.getItem('CART_ITEMS'))?.flights ?? {};
  }

  static getFlightTypeDisplayString(flightType) {
    switch (flightType) {
      case "oneway": return "One Way";
      case "roundtrip": return "Round Trip";
      default: throw new Error(`Unknown flight type: ${flightType}`);
    }
  }

  static getFlightPricing(basePrice, passengers) {
    const adultPrice = basePrice;
    const childPrice = basePrice * 0.70;
    const infantPrice = basePrice * 0.10;

    const totalPrice = (
      adultPrice * passengers.adults
      + childPrice * passengers.children
      + infantPrice * passengers.infants
    );

    return {
      adultPrice,
      childPrice,
      infantPrice,
      totalPrice,
    };
  }

  static bookFlight(flight) {
    const flightPricing = FormUtils.getFlightPricing(
      flight.price,
      flight.passengers
    );

    const bookedFlight = {
      id: flight.id,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: flight.departureDate,
      arrivalDate: flight.arrivalDate,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      totalPrice: flightPricing.totalPrice,
      bookingNumber: crypto.randomUUID(),
      passengers: [
        ...getPassengerData('adult', flight.passengers.adults),
        ...getPassengerData('child', flight.passengers.children),
        ...getPassengerData('infant', flight.passengers.infants),
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

    FormUtils.removeFlightFromCart(flight.id);
    FlightForm.refreshSelectInput();
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
  FlightForm.refreshSelectInput();

  document.getElementById("flightSelect").addEventListener("change", (event) => {
    event.preventDefault();
    FlightForm.displayForm(event.target.value);
  });
});
