import { Form } from "../../Form.js";
import { CarSearchTableCreator } from "./CarSearchTableCreator.js";

export class CarSearchForm extends Form {
  static displayCarsTable(carListings) {
    const tableWrapper = document.getElementById("carTableWrapper");
    tableWrapper.innerHTML = "<h2>Available Cars</h2>";
    tableWrapper.appendChild(new CarSearchTableCreator(carListings).createTable());
  }

  static clearCarsTable() {
    document.getElementById("carTableWrapper").innerHTML = "";
  }
}