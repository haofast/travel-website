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
}

document.addEventListener("DOMContentLoaded", () => {
  const flightForm = document.forms["flightForm"];

  document.getElementById("passengerButton").addEventListener("click", () => {
    Form.toggleElementVisibility("passengerSection");
  });

  document.getElementById("tripType").addEventListener("change", (event) => {
    Form.setElementVisibility("formSection", event.target.value);
    Form.setElementVisibility("arrivingFlightDateInputWrapper", event.target.value === "roundtrip");
  });

  flightForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const tripType = flightForm["tripType"].value.trim();
    const origin = flightForm["origin"].value.trim();
    const destination = flightForm["destination"].value.trim();
    const departureFlightDate = flightForm["departureFlightDate"].value.trim();
    const arrivingFlightDate = flightForm["arrivingFlightDate"].value.trim();
    const numAdults = flightForm["numAdults"].value.trim();
    const numChildren = flightForm["numChildren"].value.trim();
    const numInfants = flightForm["numInfants"].value.trim();

    const fieldToNameMappings = tripType === "roundtrip" ? [
      { value: tripType, name: "Type of trip" },
      { value: origin, name: "Origin" },
      { value: destination, name: "Destination" },
      { value: departureFlightDate, name: "Departing flight date" },
      { value: arrivingFlightDate, name: "Arriving flight date" },
      { value: numAdults, name: "Number of adults" },
      { value: numChildren, name: "Number of children" },
      { value: numInfants, name: "Number of infants" },
    ] : [
      { value: tripType, name: "Type of trip" },
      { value: origin, name: "Origin" },
      { value: destination, name: "Destination" },
      { value: departureFlightDate, name: "Departing flight date" },
      { value: numAdults, name: "Number of adults" },
      { value: numChildren, name: "Number of children" },
      { value: numInfants, name: "Number of infants" },
    ];

    for (const mapping of fieldToNameMappings) {
      if (!mapping.value.trim()) {
        Form.setFailMessage(`${mapping.name} is required.`);
        if (mapping.name.toLowerCase().includes("number of")) {
          Form.setElementVisibility("passengerSection", true);
        }
        return false;
      }
    }

    if (!VALID_LOCATIONS.includes(origin.toLowerCase())) {
      Form.setFailMessage("Origin must be either Texas or California");
      return false
    }

    if (!VALID_LOCATIONS.includes(destination.toLowerCase())) {
      Form.setFailMessage("Destination must be either Texas or California");
      return false;
    }

    if (!VALID_DATE_REGEX.test(departureFlightDate)) {
      Form.setFailMessage("Departure date must be between September 1, 2024, and December 1, 2024.");
      return false;
    }

    if (tripType === "roundtrip") {
      if (!VALID_DATE_REGEX.test(arrivingFlightDate)) {
        Form.setFailMessage("Arriving flight date must be between September 1, 2024, and December 1, 2024.");
        return false;
      }

      const departureDate = new Date(departureFlightDate);
      const arrivingDate = new Date(arrivingFlightDate);

      if (arrivingDate <= departureDate) {
        Form.setFailMessage("Arriving flight date must be after the departing flight date.");
        return false;
      }
    }

    if (
      parseInt(numAdults) > MAX_PASSENGERS_PER_CATEGORY
      || parseInt(numChildren) > MAX_PASSENGERS_PER_CATEGORY
      || parseInt(numInfants) > MAX_PASSENGERS_PER_CATEGORY
    ) {
      Form.setFailMessage("Number of passengers for each category cannot be more than 4.");
      Form.setElementVisibility("passengerSection", true);
      return false;
    }

    Form.setSuccessMessage("Form submitted!");
    return true;
  });
});
