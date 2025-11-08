import { Cart } from "../../Cart.js";
import { CarDataInterface } from "../CarDataInterface.js";
import { CarBookForm } from "./CarBookForm.js";

export class CarBookFormCreator {

  constructor(carListing) {
    this.carListing = carListing;
  }

  createFormElement() {
    const form = document.createElement("form");
    form.innerHTML = this.createCarFormElementHTML();
    form.appendChild(this.createBookCarButton(form));
    return form;
  }

  createCarFormElementHTML() {
    return (`
      <div>
        <h2>Car Details</h2>
        <ul>
          <li><strong>Car ID:</strong> ${this.carListing.id}</li>
          <li><strong>Car Type:</strong> ${this.carListing.type}</li>
          <li><strong>City:</strong> ${this.carListing.city}</li>
          <li><strong>Check In Date:</strong> ${this.carListing.checkInDate}</li>
          <li><strong>Check Out Date:</strong> ${this.carListing.checkOutDate}</li>
          <li><strong>Price Per Day:</strong> ${this.carListing.pricePerDay}</li>
          </ul>
        </div>
      </div>
    `);
  }

  createBookCarButton(form) {
    const bookCarButton = document.createElement("button");
    bookCarButton.setAttribute("type", "submit");
    bookCarButton.textContent = "Book Car";

    bookCarButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (form.checkValidity()) {
        Cart.removeCar(this.carListing.id);

        CarDataInterface.addBooking({
          userID: localStorage.getItem("USER_ID"),
          ...this.carListing,
        });
        
        alert("Car booked successfully!");

        CarBookForm.refreshSelectElement();
        CarBookForm.clearForm();
      }
    });

    return bookCarButton;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}