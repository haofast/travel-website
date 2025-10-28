const FORM_ID = "flightForm";
const VALID_DATE_REGEX = /^(2024-(09|10|11|12)-(0[1-9]|[12][0-9]|30|31))$/;
const VALID_LOCATIONS = ["ca", "tx", "california", "texas"];
const MAX_PASSENGERS_PER_CATEGORY = 4;

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

  static setElementVisibility(elementId, visible) {
    const classList = document.getElementById(elementId).classList;
    visible ? classList.remove("invisible") : classList.add("invisible");
  }

  static toggleElementVisibility(elementId) {
    const classList = document.getElementById(elementId).classList;
    classList.contains("invisible") ? classList.remove("invisible") : classList.add("invisible");
  }

  static displayUserInput(fieldNameToValueMap) {
    const formOutput = document.getElementById("formOutput");
    const list = document.createElement("ul");
    formOutput.innerHTML = "<h2>Search Criteria</h2>";
    formOutput.appendChild(list);

    for (const [key, value] of fieldNameToValueMap.entries()) {
      const listItem = document.createElement("li");
      listItem.textContent = `${key}: ${value}`;
      list.appendChild(listItem);
    }
  }

  static displayDepartingFlightsTable(flights, submissionData) {
    Form.clearDepartingFlightsTable();
    const tableWrapper = document.getElementById("departingFlightsTableWrapper");
    tableWrapper.innerHTML = "<h2>Departing Flights</h2>";
    tableWrapper.appendChild(this.generateFlightsTable(flights, submissionData))
  }

  static displayReturningFlightsTable(flights, submissionData) {
    Form.clearReturningFlightsTable();
    const tableWrapper = document.getElementById("returningFlightsTableWrapper");
    tableWrapper.innerHTML = "<h2>Returning Flights</h2>";
    tableWrapper.appendChild(this.generateFlightsTable(flights, submissionData))
  }

  static generateFlightsTable(flights, submissionData) {
    const table = document.createElement("table");
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const tableBody = document.createElement("tbody");

    header.appendChild(headerRow);
    table.appendChild(header);
    table.appendChild(tableBody);

    [
      "Flight",
      "Origin",
      "Destination",
      "Depart",
      "Arrive",
      "Seats",
      "Price (Adult)",
      "Price (Children)",
      "Price (Infant)",
      "", // cart button row
    ].forEach((columnName) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = columnName;
      headerRow.appendChild(headerCell);
    });

    flights.forEach((flight) => {
      const tableRow = document.createElement("tr");
      tableBody.appendChild(tableRow);

      const departCell = `${flight.departureDate} ${flight.departureTime || ""}`.trim();
      const arriveCell = `${flight.arrivalDate} ${flight.arrivalTime || ""}`.trim();
      const priceAdult = parseFloat(flight.price ?? 0).toFixed(2);
      const priceChildren = (priceAdult * 0.70).toFixed(2);
      const priceInfant = (priceAdult * 0.10).toFixed(2);

      [
        flight.id,
        flight.origin,
        flight.destination,
        departCell,
        arriveCell,
        flight.availableSeats,
        `$${priceAdult}`,
        `$${priceChildren}`,
        `$${priceInfant}`,
      ].forEach((value) => {
        const tableValueCell = document.createElement("td");
        tableValueCell.textContent = value;
        tableRow.appendChild(tableValueCell);
      });

      const cartButtonCell = document.createElement("td");
      const cartButton = document.createElement("button");
      cartButton.addEventListener("click", () => Form.addFlightToCart(flight, submissionData));
      cartButton.style.minWidth = "120px";
      cartButton.textContent = "Add to Cart";
      cartButtonCell.appendChild(cartButton);
      tableRow.appendChild(cartButtonCell);
    });

    return table;
  }

  static addFlightToCart(flight, submissionData) {
    const cart = JSON.parse(localStorage.getItem('CART_ITEMS') ?? "{}");
    if (!cart.flights) cart.flights = {};

    cart.flights[flight.id] = {
      ...flight,
      type: submissionData.tripType,
      passengers: {
        adults: parseInt(submissionData.numAdults),
        children: parseInt(submissionData.numChildren),
        infants: parseInt(submissionData.numInfants),
      }
    };


    localStorage.setItem('CART_ITEMS', JSON.stringify(cart));
    alert(`Flight ${flight.id} added to cart!`);
  }

  static clearUserInput() {
    document.getElementById("formOutput").innerHTML = "";
  }

  static clearDepartingFlightsTable() {
    document.getElementById("departingFlightsTableWrapper").innerHTML = "";
  }

  static clearReturningFlightsTable() {
    document.getElementById("returningFlightsTableWrapper").innerHTML = "";
  }
}

class Submission {
  data = {};

  static getFormData(form, fieldId) {
    return form[fieldId].value.trim();
  }

  constructor() {
    const form = document.forms[FORM_ID];
    this.data.tripType = Submission.getFormData(form, "tripType");
    this.data.origin = Submission.getFormData(form, "origin");
    this.data.destination = Submission.getFormData(form, "destination");
    this.data.departureFlightDate = Submission.getFormData(form, "departureFlightDate");
    this.data.returningFlightDate = Submission.getFormData(form, "returningFlightDate");
    this.data.numAdults = Submission.getFormData(form, "numAdults");
    this.data.numChildren = Submission.getFormData(form, "numChildren");
    this.data.numInfants = Submission.getFormData(form, "numInfants");
  }

  getFieldNameToValueMap() {
    switch (this.data.tripType) {
      case "oneway": return new Map([
        ["Type of trip", this.data.tripType],
        ["Origin", this.data.origin],
        ["Destination", this.data.destination],
        ["Departing flight date", this.data.departureFlightDate],
        ["Number of adults", this.data.numAdults],
        ["Number of children", this.data.numChildren],
        ["Number of infants", this.data.numInfants],
      ]);
      default: return new Map([
        ["Type of trip", this.data.tripType],
        ["Origin", this.data.origin],
        ["Destination", this.data.destination],
        ["Departing flight date", this.data.departureFlightDate],
        ["Arriving flight date", this.data.returningFlightDate],
        ["Number of adults", this.data.numAdults],
        ["Number of children", this.data.numChildren],
        ["Number of infants", this.data.numInfants],
      ]);
    }
  }

  getValidationSet() {
    switch (this.data.tripType) {
      case "oneway": return [
        () => this.validateAllFieldsFilled(),
        () => this.validateOriginIsTexasOrCalifornia(),
        () => this.validateDestinationIsTexasOrCalifornia(),
        () => this.validateDepartureFlightDate(),
        () => this.validateMaxPassengersPerCategory(),
      ];
      default: return [
        () => this.validateAllFieldsFilled(),
        () => this.validateOriginIsTexasOrCalifornia(),
        () => this.validateDestinationIsTexasOrCalifornia(),
        () => this.validateDepartureFlightDate(),
        () => this.validateArrivingFlightDate(),
        () => this.validateMaxPassengersPerCategory(),
      ];
    }
  }

  validate() {
    const validationSet = this.getValidationSet();

    for (const validate of validationSet) {
      const validationMessage = validate();

      if (validationMessage) {
        Form.setFailMessage(validationMessage);
        return false;
      }
    }

    Form.setSuccessMessage("Search successful!");
    return true;
  }

  validateAllFieldsFilled() {
    for (const [key, value] of this.getFieldNameToValueMap().entries()) {
      if (value) continue;
      if (key.includes("Number of")) Form.setElementVisibility("passengerSection", true);
      return `${key} is required.`;
    }
  }

  validateOriginIsTexasOrCalifornia() {
    if (!VALID_LOCATIONS.includes(this.data.origin.toLowerCase())) {
      return "Origin must be either Texas or California.";
    }
  }

  validateDestinationIsTexasOrCalifornia() {
    if (!VALID_LOCATIONS.includes(this.data.destination.toLowerCase())) {
      return "Destination must be either Texas or California.";
    }
  }

  validateDepartureFlightDate() {
    if (!VALID_DATE_REGEX.test(this.data.departureFlightDate)) {
      return "Departure date must be between September 1, 2024, and December 1, 2024.";
    }
  }

  validateArrivingFlightDate() {
    if (!VALID_DATE_REGEX.test(this.data.returningFlightDate)) {
      return "Arriving flight date must be between September 1, 2024, and December 1, 2024.";
    }

    if (new Date(this.data.returningFlightDate) <= new Date(this.data.departureFlightDate)) {
      return "Arriving flight date must be after the departing flight date.";
    }
  }

  validateMaxPassengersPerCategory() {
    if (
      parseInt(this.data.numAdults) > MAX_PASSENGERS_PER_CATEGORY
      || parseInt(this.data.numChildren) > MAX_PASSENGERS_PER_CATEGORY
      || parseInt(this.data.numInfants) > MAX_PASSENGERS_PER_CATEGORY
    ) {
      Form.setElementVisibility("passengerSection", true);
      return "Number of passengers for each category cannot be more than 4.";
    }
  }

  getOriginAbbreviation() {
    return this.data.origin.toLowerCase().startsWith("t") ? "TX" : "CA";
  }

  getDestinationAbbreviation() {
    return this.data.destination.toLowerCase().startsWith("t") ? "TX" : "CA";
  }

  getDepartingFlights() {
    // user input fields
    const requestedDepartureDate = new Date(this.data.departureFlightDate)
    return this.getFlights(requestedDepartureDate, this.getOriginAbbreviation(), this.getDestinationAbbreviation());
  }

  getReturningFlights() {
    const reuqestedReturningDate = new Date(this.data.returningFlightDate)
    return this.getFlights(reuqestedReturningDate, this.getDestinationAbbreviation(), this.getOriginAbbreviation());
  }

  getFlights(requestedDepartureDate, originAbbreviation, destinationAbbreviation) {
    const allFlights = getAllFlights();

    const requestedNumPassengers = (
      parseInt(this.data.numAdults)
      + parseInt(this.data.numChildren)
      + parseInt(this.data.numInfants)
    );

    // get flights mathcing origin, destination, and the minimum required seats
    const filteredFlights = allFlights.filter((flight) => (
      flight.origin.includes(originAbbreviation)
      && flight.destination.includes(destinationAbbreviation)
      && parseInt(flight.availableSeats) >= requestedNumPassengers
    ));

    // then filter by departure date
    let selectedFlights = filteredFlights.filter((flight) => (
      new Date(flight.departureDate).getTime() === requestedDepartureDate.getTime()
    ));

    // if still no flights, expand search to +/- 3 days from requested departure date
    if (selectedFlights.length === 0) {
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const departureDateRangeStart = new Date(requestedDepartureDate.getTime() - threeDaysInMs);
      const departureDateRangeEnd = new Date(requestedDepartureDate.getTime() + threeDaysInMs);

      selectedFlights = filteredFlights.filter((flight) => (
        new Date(flight.departureDate) >= departureDateRangeStart
        && new Date(flight.departureDate) <= departureDateRangeEnd
      ));
    }

    return selectedFlights;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const flightForm = document.forms["flightForm"];

  document.getElementById("passengerButton").addEventListener("click", () => {
    Form.toggleElementVisibility("passengerSection");
  });

  document.getElementById("tripType").addEventListener("change", (event) => {
    Form.setElementVisibility("formSection", event.target.value);
    Form.setElementVisibility("returningFlightDateInputWrapper", event.target.value === "roundtrip");
  });

  flightForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submission = new Submission();
    const submissionIsValid = submission.validate();

    Form.clearUserInput();
    Form.clearDepartingFlightsTable();
    Form.clearReturningFlightsTable();

    if (submissionIsValid) {
      Form.displayUserInput(submission.getFieldNameToValueMap());

      Form.displayDepartingFlightsTable(submission.getDepartingFlights(), submission.data);

      if (submission.data.tripType === "roundtrip") {
        Form.displayReturningFlightsTable(submission.getReturningFlights(), submission.data);
      }
    }
  });
});

function getAllFlights() {
  return [
    {
      "id": "FL0051",
      "origin": "Austin, TX (AUS)",
      "destination": "San Diego, CA (SAN)",
      "departureDate": "2024-09-03",
      "arrivalDate": "2024-09-03",
      "departureTime": "08:00",
      "arrivalTime": "09:45",
      "availableSeats": 25,
      "price": 159.00
    },
    {
      "id": "FL0052",
      "origin": "Los Angeles, CA (LAX)",
      "destination": "Dallas, TX (DFW)",
      "departureDate": "2024-09-04",
      "arrivalDate": "2024-09-04",
      "departureTime": "10:30",
      "arrivalTime": "15:00",
      "availableSeats": 40,
      "price": 179.00
    },
    {
      "id": "FL0053",
      "origin": "Houston, TX (IAH)",
      "destination": "Oakland, CA (OAK)",
      "departureDate": "2024-09-06",
      "arrivalDate": "2024-09-06",
      "departureTime": "13:15",
      "arrivalTime": "15:45",
      "availableSeats": 30,
      "price": 169.00
    },
    {
      "id": "FL0054",
      "origin": "San Francisco, CA (SFO)",
      "destination": "San Antonio, TX (SAT)",
      "departureDate": "2024-09-07",
      "arrivalDate": "2024-09-07",
      "departureTime": "09:00",
      "arrivalTime": "13:30",
      "availableSeats": 22,
      "price": 189.00
    },
    {
      "id": "FL0055",
      "origin": "Dallas, TX (DFW)",
      "destination": "Sacramento, CA (SMF)",
      "departureDate": "2024-09-09",
      "arrivalDate": "2024-09-09",
      "departureTime": "11:20",
      "arrivalTime": "13:40",
      "availableSeats": 18,
      "price": 159.00
    },
    {
      "id": "FL0056",
      "origin": "San Diego, CA (SAN)",
      "destination": "El Paso, TX (ELP)",
      "departureDate": "2024-09-10",
      "arrivalDate": "2024-09-10",
      "departureTime": "14:00",
      "arrivalTime": "17:10",
      "availableSeats": 27,
      "price": 149.00
    },
    {
      "id": "FL0057",
      "origin": "San Antonio, TX (SAT)",
      "destination": "San Jose, CA (SJC)",
      "departureDate": "2024-09-12",
      "arrivalDate": "2024-09-12",
      "departureTime": "07:45",
      "arrivalTime": "10:20",
      "availableSeats": 35,
      "price": 179.00
    },
    {
      "id": "FL0058",
      "origin": "Oakland, CA (OAK)",
      "destination": "Lubbock, TX (LBB)",
      "departureDate": "2024-09-13",
      "arrivalDate": "2024-09-13",
      "departureTime": "16:30",
      "arrivalTime": "20:00",
      "availableSeats": 20,
      "price": 159.00
    },
    {
      "id": "FL0059",
      "origin": "El Paso, TX (ELP)",
      "destination": "Burbank, CA (BUR)",
      "departureDate": "2024-09-15",
      "arrivalDate": "2024-09-15",
      "departureTime": "12:10",
      "arrivalTime": "13:55",
      "availableSeats": 16,
      "price": 139.00
    },
    {
      "id": "FL0060",
      "origin": "San Jose, CA (SJC)",
      "destination": "Corpus Christi, TX (CRP)",
      "departureDate": "2024-09-16",
      "arrivalDate": "2024-09-16",
      "departureTime": "10:00",
      "arrivalTime": "14:30",
      "availableSeats": 19,
      "price": 169.00
    },
    {
      "id": "FL0061",
      "origin": "Lubbock, TX (LBB)",
      "destination": "Long Beach, CA (LGB)",
      "departureDate": "2024-09-18",
      "arrivalDate": "2024-09-18",
      "departureTime": "15:00",
      "arrivalTime": "17:20",
      "availableSeats": 23,
      "price": 149.00
    },
    {
      "id": "FL0062",
      "origin": "Sacramento, CA (SMF)",
      "destination": "Midland, TX (MAF)",
      "departureDate": "2024-09-19",
      "arrivalDate": "2024-09-19",
      "departureTime": "08:30",
      "arrivalTime": "12:00",
      "availableSeats": 21,
      "price": 179.00
    },
    {
      "id": "FL0063",
      "origin": "Corpus Christi, TX (CRP)",
      "destination": "San Francisco, CA (SFO)",
      "departureDate": "2024-09-21",
      "arrivalDate": "2024-09-21",
      "departureTime": "13:10",
      "arrivalTime": "15:55",
      "availableSeats": 14,
      "price": 159.00
    },
    {
      "id": "FL0064",
      "origin": "Long Beach, CA (LGB)",
      "destination": "Austin, TX (AUS)",
      "departureDate": "2024-09-22",
      "arrivalDate": "2024-09-22",
      "departureTime": "17:00",
      "arrivalTime": "21:10",
      "availableSeats": 28,
      "price": 189.00
    },
    {
      "id": "FL0065",
      "origin": "Midland, TX (MAF)",
      "destination": "Los Angeles, CA (LAX)",
      "departureDate": "2024-09-24",
      "arrivalDate": "2024-09-24",
      "departureTime": "09:30",
      "arrivalTime": "11:15",
      "availableSeats": 12,
      "price": 169.00
    },
    {
      "id": "FL0066",
      "origin": "Burbank, CA (BUR)",
      "destination": "Houston, TX (IAH)",
      "departureDate": "2024-09-25",
      "arrivalDate": "2024-09-25",
      "departureTime": "13:45",
      "arrivalTime": "18:00",
      "availableSeats": 24,
      "price": 179.00
    },
    {
      "id": "FL0067",
      "origin": "Austin, TX (AUS)",
      "destination": "San Jose, CA (SJC)",
      "departureDate": "2024-09-27",
      "arrivalDate": "2024-09-27",
      "departureTime": "07:20",
      "arrivalTime": "09:55",
      "availableSeats": 31,
      "price": 159.00
    },
    {
      "id": "FL0068",
      "origin": "San Jose, CA (SJC)",
      "destination": "Dallas, TX (DFW)",
      "departureDate": "2024-09-28",
      "arrivalDate": "2024-09-28",
      "departureTime": "11:00",
      "arrivalTime": "15:30",
      "availableSeats": 18,
      "price": 169.00
    },
    {
      "id": "FL0069",
      "origin": "Houston, TX (IAH)",
      "destination": "Oakland, CA (OAK)",
      "departureDate": "2024-09-30",
      "arrivalDate": "2024-09-30",
      "departureTime": "10:10",
      "arrivalTime": "12:45",
      "availableSeats": 29,
      "price": 149.00
    },
    {
      "id": "FL0070",
      "origin": "Oakland, CA (OAK)",
      "destination": "San Antonio, TX (SAT)",
      "departureDate": "2024-10-01",
      "arrivalDate": "2024-10-01",
      "departureTime": "15:30",
      "arrivalTime": "20:00",
      "availableSeats": 20,
      "price": 159.00
    },
    {
      "id": "FL0071",
      "origin": "Dallas, TX (DFW)",
      "destination": "San Diego, CA (SAN)",
      "departureDate": "2024-10-03",
      "arrivalDate": "2024-10-03",
      "departureTime": "12:00",
      "arrivalTime": "13:45",
      "availableSeats": 22,
      "price": 179.00
    },
    {
      "id": "FL0072",
      "origin": "San Diego, CA (SAN)",
      "destination": "El Paso, TX (ELP)",
      "departureDate": "2024-10-04",
      "arrivalDate": "2024-10-04",
      "departureTime": "09:30",
      "arrivalTime": "13:00",
      "availableSeats": 25,
      "price": 149.00
    },
    {
      "id": "FL0073",
      "origin": "San Antonio, TX (SAT)",
      "destination": "Sacramento, CA (SMF)",
      "departureDate": "2024-10-06",
      "arrivalDate": "2024-10-06",
      "departureTime": "14:10",
      "arrivalTime": "16:45",
      "availableSeats": 19,
      "price": 169.00
    },
    {
      "id": "FL0074",
      "origin": "Sacramento, CA (SMF)",
      "destination": "Lubbock, TX (LBB)",
      "departureDate": "2024-10-07",
      "arrivalDate": "2024-10-07",
      "departureTime": "10:00",
      "arrivalTime": "14:20",
      "availableSeats": 17,
      "price": 159.00
    },
    {
      "id": "FL0075",
      "origin": "El Paso, TX (ELP)",
      "destination": "San Francisco, CA (SFO)",
      "departureDate": "2024-10-09",
      "arrivalDate": "2024-10-09",
      "departureTime": "16:00",
      "arrivalTime": "18:45",
      "availableSeats": 21,
      "price": 189.00
    },
    {
      "id": "FL0076",
      "origin": "San Francisco, CA (SFO)",
      "destination": "Corpus Christi, TX (CRP)",
      "departureDate": "2024-10-10",
      "arrivalDate": "2024-10-10",
      "departureTime": "13:30",
      "arrivalTime": "18:00",
      "availableSeats": 23,
      "price": 179.00
    },
    {
      "id": "FL0077",
      "origin": "Lubbock, TX (LBB)",
      "destination": "Burbank, CA (BUR)",
      "departureDate": "2024-10-12",
      "arrivalDate": "2024-10-12",
      "departureTime": "08:45",
      "arrivalTime": "10:55",
      "availableSeats": 15,
      "price": 169.00
    },
    {
      "id": "FL0078",
      "origin": "Burbank, CA (BUR)",
      "destination": "Midland, TX (MAF)",
      "departureDate": "2024-10-13",
      "arrivalDate": "2024-10-13",
      "departureTime": "17:30",
      "arrivalTime": "21:00",
      "availableSeats": 18,
      "price": 159.00
    },
    {
      "id": "FL0079",
      "origin": "Corpus Christi, TX (CRP)",
      "destination": "San Jose, CA (SJC)",
      "departureDate": "2024-10-15",
      "arrivalDate": "2024-10-15",
      "departureTime": "11:00",
      "arrivalTime": "13:30",
      "availableSeats": 20,
      "price": 149.00
    },
    {
      "id": "FL0080",
      "origin": "San Jose, CA (SJC)",
      "destination": "Austin, TX (AUS)",
      "departureDate": "2024-10-16",
      "arrivalDate": "2024-10-16",
      "departureTime": "09:00",
      "arrivalTime": "13:20",
      "availableSeats": 22,
      "price": 179.00
    },
    {
      "id": "FL0081",
      "origin": "Midland, TX (MAF)",
      "destination": "Oakland, CA (OAK)",
      "departureDate": "2024-10-18",
      "arrivalDate": "2024-10-18",
      "departureTime": "14:30",
      "arrivalTime": "16:55",
      "availableSeats": 19,
      "price": 169.00
    },
    {
      "id": "FL0082",
      "origin": "Oakland, CA (OAK)",
      "destination": "Houston, TX (IAH)",
      "departureDate": "2024-10-19",
      "arrivalDate": "2024-10-19",
      "departureTime": "12:00",
      "arrivalTime": "16:20",
      "availableSeats": 25,
      "price": 159.00
    },
    {
      "id": "FL0083",
      "origin": "Austin, TX (AUS)",
      "destination": "Los Angeles, CA (LAX)",
      "departureDate": "2024-10-21",
      "arrivalDate": "2024-10-21",
      "departureTime": "07:30",
      "arrivalTime": "09:10",
      "availableSeats": 28,
      "price": 189.00
    },
    {
      "id": "FL0084",
      "origin": "Los Angeles, CA (LAX)",
      "destination": "Dallas, TX (DFW)",
      "departureDate": "2024-10-22",
      "arrivalDate": "2024-10-22",
      "departureTime": "10:00",
      "arrivalTime": "14:30",
      "availableSeats": 30,
      "price": 179.00
    },
    {
      "id": "FL0085",
      "origin": "Houston, TX (IAH)",
      "destination": "San Diego, CA (SAN)",
      "departureDate": "2024-10-24",
      "arrivalDate": "2024-10-24",
      "departureTime": "13:00",
      "arrivalTime": "15:40",
      "availableSeats": 32,
      "price": 159.00
    },
    {
      "id": "FL0086",
      "origin": "San Diego, CA (SAN)",
      "destination": "San Antonio, TX (SAT)",
      "departureDate": "2024-10-25",
      "arrivalDate": "2024-10-25",
      "departureTime": "08:30",
      "arrivalTime": "13:00",
      "availableSeats": 21,
      "price": 169.00
    },
    {
      "id": "FL0087",
      "origin": "Dallas, TX (DFW)",
      "destination": "San Jose, CA (SJC)",
      "departureDate": "2024-10-27",
      "arrivalDate": "2024-10-27",
      "departureTime": "11:20",
      "arrivalTime": "13:55",
      "availableSeats": 24,
      "price": 179.00
    },
    {
      "id": "FL0088",
      "origin": "San Jose, CA (SJC)",
      "destination": "El Paso, TX (ELP)",
      "departureDate": "2024-10-28",
      "arrivalDate": "2024-10-28",
      "departureTime": "09:00",
      "arrivalTime": "13:30",
      "availableSeats": 19,
      "price": 159.00
    },
    {
      "id": "FL0089",
      "origin": "San Antonio, TX (SAT)",
      "destination": "Oakland, CA (OAK)",
      "departureDate": "2024-10-30",
      "arrivalDate": "2024-10-30",
      "departureTime": "14:00",
      "arrivalTime": "16:30",
      "availableSeats": 22,
      "price": 149.00
    },
    {
      "id": "FL0090",
      "origin": "Oakland, CA (OAK)",
      "destination": "Corpus Christi, TX (CRP)",
      "departureDate": "2024-10-31",
      "arrivalDate": "2024-10-31",
      "departureTime": "16:00",
      "arrivalTime": "20:30",
      "availableSeats": 20,
      "price": 179.00
    },
    {
      "id": "FL0091",
      "origin": "El Paso, TX (ELP)",
      "destination": "Sacramento, CA (SMF)",
      "departureDate": "2024-11-02",
      "arrivalDate": "2024-11-02",
      "departureTime": "10:30",
      "arrivalTime": "12:50",
      "availableSeats": 18,
      "price": 169.00
    },
    {
      "id": "FL0092",
      "origin": "Sacramento, CA (SMF)",
      "destination": "Midland, TX (MAF)",
      "departureDate": "2024-11-03",
      "arrivalDate": "2024-11-03",
      "departureTime": "13:00",
      "arrivalTime": "17:20",
      "availableSeats": 15,
      "price": 159.00
    },
    {
      "id": "FL0093",
      "origin": "Lubbock, TX (LBB)",
      "destination": "San Francisco, CA (SFO)",
      "departureDate": "2024-11-05",
      "arrivalDate": "2024-11-05",
      "departureTime": "07:45",
      "arrivalTime": "10:30",
      "availableSeats": 44,
      "price": 159.00
    },
    {
      "id": "FL0094",
      "origin": "San Francisco, CA (SFO)",
      "destination": "Austin, TX (AUS)",
      "departureDate": "2024-11-06",
      "arrivalDate": "2024-11-06",
      "departureTime": "12:00",
      "arrivalTime": "16:30",
      "availableSeats": 20,
      "price": 189.00
    },
    {
      "id": "FL0095",
      "origin": "Corpus Christi, TX (CRP)",
      "destination": "Los Angeles, CA (LAX)",
      "departureDate": "2024-11-08",
      "arrivalDate": "2024-11-08",
      "departureTime": "16:50",
      "arrivalTime": "18:40",
      "availableSeats": 14,
      "price": 149.00
    },
    {
      "id": "FL0096",
      "origin": "Los Angeles, CA (LAX)",
      "destination": "Houston, TX (IAH)",
      "departureDate": "2024-11-09",
      "arrivalDate": "2024-11-09",
      "departureTime": "17:00",
      "arrivalTime": "21:30",
      "availableSeats": 22,
      "price": 179.00
    },
    {
      "id": "FL0097",
      "origin": "Midland, TX (MAF)",
      "destination": "San Diego, CA (SAN)",
      "departureDate": "2024-11-11",
      "arrivalDate": "2024-11-11",
      "departureTime": "09:00",
      "arrivalTime": "11:10",
      "availableSeats": 33,
      "price": 139.00
    },
    {
      "id": "FL0098",
      "origin": "San Diego, CA (SAN)",
      "destination": "Dallas, TX (DFW)",
      "departureDate": "2024-11-12",
      "arrivalDate": "2024-11-12",
      "departureTime": "10:00",
      "arrivalTime": "14:30",
      "availableSeats": 20,
      "price": 159.00
    },
    {
      "id": "FL0099",
      "origin": "Austin, TX (AUS)",
      "destination": "San Jose, CA (SJC)",
      "departureDate": "2024-11-14",
      "arrivalDate": "2024-11-14",
      "departureTime": "07:20",
      "arrivalTime": "09:55",
      "availableSeats": 31,
      "price": 159.00
    },
    {
      "id": "FL0100",
      "origin": "San Jose, CA (SJC)",
      "destination": "Houston, TX (IAH)",
      "departureDate": "2024-11-15",
      "arrivalDate": "2024-11-15",
      "departureTime": "11:00",
      "arrivalTime": "15:30",
      "availableSeats": 18,
      "price": 169.00
    }
  ]
}