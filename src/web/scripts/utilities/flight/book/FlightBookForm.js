import { Cart } from "../../Cart.js";
import { FlightBookFormCreator } from "./FlightBookFormCreator.js";
import { FlightTicket } from "../FlightTicket.js";
import { FlightDataInterface } from "../FlightDataInterface.js";

export class FlightBookForm {

  static getFormWrapperElement() {
    return document.getElementById("flightBookFormWrapper")
  }

  static async refreshSelectElement() {
    const flightCartItems = Cart.getFlights();
    const selectElement = document.getElementById("flightSelect");
    const noFlightsMessage = document.getElementById("noFlightsMessage");

    if (Object.keys(flightCartItems).length === 0) {
      selectElement.classList.add("invisible");
      noFlightsMessage.classList.remove("invisible");

    } else {
      selectElement.classList.remove("invisible")
      noFlightsMessage.classList.add("invisible");

      selectElement.innerHTML = (`
        <option value="" disabled selected>Select flight</option>
      `);

      for (const flightID of Object.keys(flightCartItems)) {
        const flightListing = await FlightDataInterface.getListing(flightID)
        const optionElement = document.createElement("option");
        optionElement.text = `${flightListing.id} - ${flightListing.origin} to ${flightListing.destination}`;
        optionElement.value = flightListing.id;
        selectElement.appendChild(optionElement);
      }
    }
  }

  static async displayForm(flightID) {
    FlightBookForm.clearForm();
    const flightListing = await FlightDataInterface.getListing(flightID);
    const flightCartData = Cart.getFlight(flightID);
    const flightTicket = new FlightTicket(flightListing, flightCartData);
    const flightBookForm = new FlightBookFormCreator(flightTicket).createFormElement();
    FlightBookForm.getFormWrapperElement().appendChild(flightBookForm);
  }

  static clearForm() {
    FlightBookForm.getFormWrapperElement().innerHTML = "";
  }
}