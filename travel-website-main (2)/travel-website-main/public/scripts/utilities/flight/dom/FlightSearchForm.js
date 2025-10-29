import { Form } from "../../Form.js";
import { FlightTableCreator } from "./FlightTableCreator.js";

export class FlightSearchForm extends Form {

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

  static displayDepartingFlightsTable(flightsData, submissionData) {
    const tableWrapper = document.getElementById("departingFlightsTableWrapper");
    tableWrapper.innerHTML = "<h2>Departing Flights</h2>";
    tableWrapper.appendChild(new FlightTableCreator(flightsData, submissionData).createFlightsTable());
  }

  static displayReturningFlightsTable(flightsData, submissionData) {
    const tableWrapper = document.getElementById("returningFlightsTableWrapper");
    tableWrapper.innerHTML = "<h2>Returning Flights</h2>";
    tableWrapper.appendChild(new FlightTableCreator(flightsData, submissionData).createFlightsTable());
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