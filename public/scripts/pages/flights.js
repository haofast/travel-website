import { FlightSearchSubmission } from "../utilities/flight/FlightSearchSubmission.js";
import { FlightSearchForm } from "../utilities/flight/dom/FlightSearchForm.js";
import { PASSENGER_VALIDATION_STATUSES, TripTypeIDs } from "../utilities/flight/FlightConstants.js";
import { FlightLookup } from "../utilities/flight/FlightLookup.js";

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("passengerButton").addEventListener("click", () => {
    FlightSearchForm.toggleElementVisibility("passengerSection");
  });

  document.getElementById("tripType").addEventListener("change", (event) => {
    FlightSearchForm.setElementVisibility("formSection", event.target.value);
    FlightSearchForm.setElementVisibility("returningDateInputWrapper", event.target.value === "roundtrip");
  });

  document.forms["flightForm"].addEventListener("submit", (event) => {
    event.preventDefault();

    FlightSearchForm.clearUserInput();
    const submission = new FlightSearchSubmission();
    const [validationStatus, validationMessage] = submission.validate();

    return validationMessage
      ? onValidationFail(validationStatus, validationMessage)
      : onValidationSuccess(submission);
  });

  function onValidationSuccess(submission) {
    FlightSearchForm.setSuccessMessage("Search successful!");
    FlightSearchForm.displayUserInput(submission.getFieldNameToValueMap());

    const flightLookup = new FlightLookup(submission);
    FlightSearchForm.displayDepartingFlightsTable(flightLookup.getDepartingFlights(), submission.data);

    if (submission.data.tripType === TripTypeIDs.ROUND_TRIP) {
      FlightSearchForm.displayReturningFlightsTable(flightLookup.getReturningFlights(), submission.data);
    }
  }

  function onValidationFail(validationStatus, validationMessage) {
    FlightSearchForm.setFailMessage(validationMessage);

    if (PASSENGER_VALIDATION_STATUSES.includes(validationStatus)) {
      FlightSearchForm.setElementVisibility("passengerSection", true);
    }
  }
});