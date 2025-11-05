import { Cart } from "../../Cart.js";
import { CAR_TABLE_COLUMNS_NAMES } from "../CarConstants.js";

export class CarSearchTableCreator {

  constructor(carListings) {
    this.carListings = carListings;
  }

  createCarTable() {
    const table = document.createElement("table");
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const tableBody = document.createElement("tbody");

    header.appendChild(headerRow);
    table.appendChild(header);
    table.appendChild(tableBody);

    // build header row
    [...CAR_TABLE_COLUMNS_NAMES, "" /* CART */].forEach((columnName) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = columnName;
      headerRow.appendChild(headerCell);
    });

    // build data rows
    this.carListings.forEach((carListing) => {
      const dataRow = this.createCarTableDataRow(carListing);
      tableBody.appendChild(dataRow);
    });

    return table;
  }

  createCarTableDataRow(carListing) {
    const dataRow = document.createElement("tr");

    // create data cells
    this.getCarDetailsListForRow(carListing).forEach((detail) => {
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
      Cart.addCar(carListing.id);
      alert(`Car ${carListing.id} added to cart!`);
    });

    return dataRow;
  }

  getCarDetailsListForRow(carListing) {
    return [
      carListing.id,
      carListing.type,
      carListing.city,
      carListing.checkInDate,
      carListing.checkOutDate,
      `$${carListing.pricePerDay}`,
    ];
  }
}