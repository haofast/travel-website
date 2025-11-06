import { Cart } from "../../Cart.js";
import { CarDataInterface } from "../CarDataInterface.js";
import { CarBookFormCreator } from "./CarBookFormCreator.js";

export class CarBookForm {
  static getFormWrapperElement() {
    return document.getElementById("carBookFormWrapper")
  }

  static async refreshSelectElement() {
    const carCartItems = Cart.getCars();
    const selectElement = document.getElementById("carSelect");
    const noCarsMessage = document.getElementById("noCarsMessage");

    if (Object.keys(carCartItems).length === 0) {
      selectElement.classList.add("invisible");
      noCarsMessage.classList.remove("invisible");

    } else {
      selectElement.classList.remove("invisible")
      noCarsMessage.classList.add("invisible");

      selectElement.innerHTML = (`
        <option value="" disabled selected>Select car</option>
      `);

      for (const carID of carCartItems) {
        const carListing = await CarDataInterface.getListing(carID)
        const optionElement = document.createElement("option");
        optionElement.text = `${carListing.id} - ${carListing.city}`;
        optionElement.value = carListing.id;
        selectElement.appendChild(optionElement);
      }
    }
  }

  static async displayForm(carID) {
    CarBookForm.clearForm();
    const carListing = await CarDataInterface.getListing(carID);
    const carBookForm = new CarBookFormCreator(carListing).createFormElement();
    CarBookForm.getFormWrapperElement().appendChild(carBookForm);
  }

  static clearForm() {
    CarBookForm.getFormWrapperElement().innerHTML = "";
  }
}