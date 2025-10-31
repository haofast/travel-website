class Form {
  static getMessageElement() {
    return document.getElementById("formMessage");
  }

  static setMessageText(text) {
    Form.getMessageElement().textContent = text;
  }

  static setFailMessage(text) {
    Form.getMessageElement().className = "form-message form-message-failure";
    Form.setMessageText(text);
  }

  static setSuccessMessage(text) {
    Form.getMessageElement().className = "form-message form-message-success";
    Form.setMessageText(text);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const carForm = document.forms["carForm"];

  carForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = carForm["city"].value.trim();
    const carType = carForm["carType"].value.trim();
    const checkinDate = new Date(carForm["checkinDate"].value.trim());
    const checkoutDate = new Date(carForm["checkoutDate"].value.trim());

    const startDate = new Date("2024-09-01");
    const endDate = new Date("2024-12-01");

    if (city.empty) {
      Form.setFailMessage("Please enter a city.");
      return false;
    }

    if (carType == "") {
      Form.setFailMessage("Please choose a type of car.");
      return false;
    }

    if (!(checkinDate >= startDate && checkinDate < endDate)) {
      Form.setFailMessage("Please enter a valid check in date. Date must be on or after September 1st, 2024 and before December 1st, 2024.");
      return false;
    }

    if (!(checkoutDate > checkinDate && checkoutDate <= endDate)) {
      Form.setFailMessage("Please enter a valid check in date. Date must be after your check in date and before December 1st, 2024.");
      return false;
    }

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const normIn = checkinDate.toLocaleDateString('en-US', options);
    const normOut = checkoutDate.toLocaleDateString('en-US', options);

    var infoback = "Pick up city: " + city + ", Type of car: " + carType + ", Check in date: " + normIn + ", Check out date: " + normOut;

    Form.setSuccessMessage(infoback);
    return true;
  });
});
