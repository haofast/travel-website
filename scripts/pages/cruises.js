class Form {
  static getMessageElement() {
    return $("#formMessage");
  }

  static setMessageText(text) {
    Form.getMessageElement().text(text);
  }

  static setFailMessage(text) {
    Form.getMessageElement().attr("class", "form-message form-message-failure");
    Form.setMessageText(text);
  }

  static setSuccessMessage(text) {
    Form.getMessageElement().attr("class", "form-message form-message-success");
    Form.setMessageText(text);
  }
}

$(document).ready(() => {
  const flightForm = document.forms["cruiseForm"];

  flightForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /** insert validation code here */

    Form.setSuccessMessage("Form submitted!");
    return true;
  });
});
