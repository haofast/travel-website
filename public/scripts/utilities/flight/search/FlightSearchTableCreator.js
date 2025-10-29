import { Cart } from "../../Cart.js";
import { FLIGHT_TABLE_COLUMNS_NAMES } from "../FlightConstants.js";
import { FlightTicket } from "../FlightTicket.js";

export class FlightSearchTableCreator {

  constructor(flightListings, searchSubmissionData) {
    this.flightListings = flightListings;
    this.searchSubmissionData = searchSubmissionData;
  }

  createFlightsTable() {
    const table = document.createElement("table");
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const tableBody = document.createElement("tbody");

    header.appendChild(headerRow);
    table.appendChild(header);
    table.appendChild(tableBody);

    // build header row
    [...FLIGHT_TABLE_COLUMNS_NAMES, "" /* CART */].forEach((columnName) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = columnName;
      headerRow.appendChild(headerCell);
    });

    // build data rows
    this.flightListings.forEach((flightListing) => {
      const dataRow = this.createFlightsTableDataRow(flightListing);
      tableBody.appendChild(dataRow);
    });

    return table;
  }

  createFlightsTableDataRow(flightListing) {
    const dataRow = document.createElement("tr");

    // create data cells
    this.getFlightDetailsListForRow(flightListing).forEach((detail) => {
      const dataCell = document.createElement("td");
      dataCell.textContent = detail;
      dataRow.appendChild(dataCell);
    });

    // create cart cell
    const cartButtonCell = document.createElement("td");
    dataRow.appendChild(cartButtonCell);

    // create cart button
    const cartButton = document.createElement("button");
    cartButton.textContent = "Add to Cart";
    cartButton.style.minWidth = "120px";
    cartButtonCell.appendChild(cartButton);

    // add cart button action
    cartButton.addEventListener("click", () => {
      Cart.addFlight(flightListing.id, this.searchSubmissionData);
      alert(`Flight ${flightListing.id} added to cart!`);
    });

    return dataRow;
  }

  getFlightDetailsListForRow(flightListing) {
    const flightTicket = new FlightTicket(flightListing, this.searchSubmissionData);

    return [
      flightListing.id,
      flightListing.origin,
      flightListing.destination,
      `${flightListing.departureDate} ${flightListing.departureTime}`,
      `${flightListing.arrivalDate} ${flightListing.arrivalTime}`,
      flightListing.availableSeats,
      `$${flightTicket.getPricePerAdult()}`,
      `$${flightTicket.getPricePerChild()}`,
      `$${flightTicket.getPricePerInfant()}`,
    ];
  }
}