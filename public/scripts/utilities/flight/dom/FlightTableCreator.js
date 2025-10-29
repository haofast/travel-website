import { Cart } from "../../Cart.js";
import { FLIGHT_TABLE_COLUMNS_NAMES } from "../FlightConstants.js";
import { FlightTicket } from "../FlightTicket.js";

export class FlightTableCreator {
  constructor(flightsData, submissionData) {
    this.flightsData = flightsData;
    this.submissionData = submissionData;
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
    this.flightsData.forEach((flightData) => {
      const dataRow = this.createFlightsTableDataRow(flightData);
      tableBody.appendChild(dataRow);
    });

    return table;
  }

  createFlightsTableDataRow(flightData) {
    const dataRow = document.createElement("tr");

    // create data cells
    this.getFlightDetailsListForRow(flightData).forEach((cellValue) => {
      const dataCell = document.createElement("td");
      dataCell.textContent = cellValue;
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
      Cart.addFlight(flightData.id, this.submissionData);
      alert(`Flight ${flightData.id} added to cart!`);
    });

    return dataRow;
  }

  getFlightDetailsListForRow(flightData) {
    const flightDetails = new FlightTicket(flightData, this.submissionData);

    return [
      flightData.id,
      flightData.origin,
      flightData.destination,
      `${flightData.departureDate} ${flightData.departureTime}`,
      `${flightData.arrivalDate} ${flightData.arrivalTime}`,
      flightData.availableSeats,
      `$${flightDetails.getPriceForAdults()}`,
      `$${flightDetails.getPriceForChildren()}`,
      `$${flightDetails.getPriceForInfants()}`,
    ];
  }
}