import { CarSearchForm } from "../utilities/car/search/CarSearchForm.js";
import { getLocalizedDateString, isValidDate } from "../utilities/dateValidation.js";
import { areCitiesFromSameState, isValidCity } from "../utilities/locationValidation.js";

document.addEventListener("DOMContentLoaded", () => {
  const carForm = document.forms["carForm"];

  carForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    CarSearchForm.clearCarsTable();

    const validationMessage = validateForm();

    if (validationMessage) {
      CarSearchForm.setFailMessage(validationMessage);
      return;
    }

    CarSearchForm.setSuccessMessage(getUserInputString());
    CarSearchForm.displayCarsTable(await getApplicableCarListings());
    return true;
  });

  function validateForm() {
    const data = getFormData();

    if (!isValidCity(data.city)) {
      return ("Please enter a city in Texas or California.");
    }
    if (!data.carType) {
      return ("Please choose a type of car.");
    }
    if (!isValidDate(data.checkInDate)) {
      return ("Please enter a valid check in date. Date must be on or after September 1st, 2024 and before December 1st, 2024.");
    }
    if (!isValidDate(data.checkOutDate)) {
      return ("Please enter a valid check out date. Date must be on or after September 1st, 2024 and before December 1st, 2024.");
    }
    if (new Date(data.checkOutDate) <= new Date(data.checkInDate)) {
      return ("Please enter a valid check in date. Date must be after your check in date.");
    }
    return null;
  }

  function getFormData() {
    return {
      city: carForm["city"].value.trim(),
      carType: carForm["carType"].value,
      checkInDate: carForm["checkinDate"].value,
      checkOutDate: carForm["checkoutDate"].value,
    };
  }

  function getUserInputString() {
    const data = getFormData();
    const normIn = getLocalizedDateString(data.checkInDate);
    const normOut = getLocalizedDateString(data.checkOutDate);
    return "Pick up city: " + data.city + ", Type of car: " + data.carType + ", Check in date: " + normIn + ", Check out date: " + normOut;
  }

  async function getApplicableCarListings() {
    const allListings = await fetch('/api/car/listings').then(response => response.json());
    const data = getFormData();

    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const checkInTime = new Date(data.checkInDate).getTime() - threeDaysInMs;
    const checkOutTime = new Date(data.checkOutDate).getTime() + threeDaysInMs;

    const baseList = Object.values(allListings).filter((listing) => 
      areCitiesFromSameState(listing.city, data.city)
      && new Date(listing.checkInDate).getTime() >= checkInTime
      && new Date(listing.checkOutDate).getTime() <= checkOutTime
    );

    const narrowedList = baseList.filter((listing) => (
      listing.type === data.carType
    ));

    return (narrowedList.length > 0) ? narrowedList : baseList;
  }
});
