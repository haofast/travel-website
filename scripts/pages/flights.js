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
  const flightForm = document.forms["flightForm"];

  flightForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /** insert validation code here */

    Form.setSuccessMessage("Form submitted!");
    return true;
  });
});
