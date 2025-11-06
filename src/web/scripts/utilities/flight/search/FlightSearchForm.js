import { Form } from "../../Form.js";
import { FlightSearchTableCreator } from "./FlightSearchTableCreator.js";

export class FlightSearchForm extends Form {

  static displayUserInput(fieldNameToValueMap) {
    const formOutput = document.getElementById("formOutput");
    const list = document.createElement("ul");
    formOutput.innerHTML = "<h2>Search Criteria</h2>";
    formOutput.appendChild(list);

    for (const [fieldName, fieldValue] of fieldNameToValueMap.entries()) {
      const listItem = document.createElement("li");
      listItem.textContent = `${fieldName}: ${fieldValue}`;
      list.appendChild(listItem);
    }
  }

  static displayDepartingFlightsTable(flightListings, searchSubmissionData) {
    const tableWrapper = document.getElementById("departingFlightsTableWrapper");
    tableWrapper.innerHTML = "<h2>Departing Flights</h2>";
    tableWrapper.appendChild(new FlightSearchTableCreator(flightListings, searchSubmissionData).createTable());
  }

  static displayReturningFlightsTable(flightListings, searchSubmissionData) {
    const tableWrapper = document.getElementById("returningFlightsTableWrapper");
    tableWrapper.innerHTML = "<h2>Returning Flights</h2>";
    tableWrapper.appendChild(new FlightSearchTableCreator(flightListings, searchSubmissionData).createTable());
  }

  static clearUserInput() {
    document.getElementById("formOutput").innerHTML = "";
    document.getElementById("departingFlightsTableWrapper").innerHTML = "";
    document.getElementById("returningFlightsTableWrapper").innerHTML = "";
  }

  static clearDepartingFlightsTable() {
    document.getElementById("departingFlightsTableWrapper").innerHTML = "";
  }

  static clearReturningFlightsTable() {
    document.getElementById("returningFlightsTableWrapper").innerHTML = "";
  }
}