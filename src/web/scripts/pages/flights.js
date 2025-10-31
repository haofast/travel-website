import { FlightSearcher } from "../utilities/flight/search/FlightSearcher.js";
import { FlightSearchForm } from "../utilities/flight/search/FlightSearchForm.js";
import { FlightSearchSubmission } from "../utilities/flight/search/FlightSearchSubmission.js";
import { PASSENGER_VALIDATION_STATUSES, TripTypeIDs } from "../utilities/flight/FlightConstants.js";

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("passengerButton").addEventListener("click", () => {
    FlightSearchForm.toggleElementVisibility("passengerSection");
  });

  document.getElementById("tripType").addEventListener("change", (event) => {
    FlightSearchForm.setElementVisibility("formSection", event.target.value);
    FlightSearchForm.setElementVisibility("returningDateInputWrapper", event.target.value === TripTypeIDs.ROUND_TRIP);
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

  async function onValidationSuccess(submission) {
    FlightSearchForm.setSuccessMessage("Search successful!");
    FlightSearchForm.displayUserInput(submission.getFieldNameToValueMap());

    const flightSearcher = new FlightSearcher(submission);
    FlightSearchForm.displayDepartingFlightsTable(await flightSearcher.getDepartingFlights(), submission.data);

    if (submission.data.tripType === TripTypeIDs.ROUND_TRIP) {
      FlightSearchForm.displayReturningFlightsTable(await flightSearcher.getReturningFlights(), submission.data);
    }
  }

  function onValidationFail(validationStatus, validationMessage) {
    FlightSearchForm.setFailMessage(validationMessage);

    if (PASSENGER_VALIDATION_STATUSES.includes(validationStatus)) {
      FlightSearchForm.setElementVisibility("passengerSection", true);
    }
  }
});