import { FlightBookForm } from "../utilities/flight/book/FlightBookForm.js";

document.addEventListener("DOMContentLoaded", () => {
  FlightBookForm.refreshSelectElement();

  document.getElementById("flightSelect").addEventListener("change", (event) => {
    event.preventDefault();
    FlightBookForm.displayForm(event.target.value);
  });
});
