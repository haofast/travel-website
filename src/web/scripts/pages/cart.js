import { CarBookForm } from "../utilities/car/book/CarBookForm.js";
import { FlightBookForm } from "../utilities/flight/book/FlightBookForm.js";

document.addEventListener("DOMContentLoaded", () => {
  FlightBookForm.refreshSelectElement();
  CarBookForm.refreshSelectElement();

  document.getElementById("flightSelect").addEventListener("change", (event) => {
    event.preventDefault();
    FlightBookForm.displayForm(event.target.value);
  });

  document.getElementById("carSelect").addEventListener("change", (event) => {
    event.preventDefault();
    CarBookForm.displayForm(event.target.value);
  });
});
