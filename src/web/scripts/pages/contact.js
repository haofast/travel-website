const NAME_REGEX = /^[A-Z][a-z]+$/;
const PHONE_REGEX = /^\u0028\d{3}\u0029 \d{3}-\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const contactForm = document.forms["contactForm"];

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = contactForm["firstName"].value.trim();
    const lastName = contactForm["lastName"].value.trim();
    const phone = contactForm["phone"].value.trim();
    const gender = contactForm["gender"].value.trim();
    const email = contactForm["email"].value.trim();
    const comment = contactForm["comment"].value.trim();

    if (!NAME_REGEX.test(firstName)) {
      Form.setFailMessage("First name must start with a capital letter and contain only alphabetic characters.");
      return false;
    }

    if (!NAME_REGEX.test(lastName)) {
      Form.setFailMessage("Last name must start with a capital letter and contain only alphabetic characters.");
      return false;
    }

    if (firstName.toLowerCase() === lastName.toLowerCase()) {
      Form.setFailMessage("First name and last name cannot be the same.");
      return false;
    }

    if (!PHONE_REGEX.test(phone)) {
      Form.setFailMessage("Phone number must be formatted as (ddd) ddd-dddd.");
      return false;
    }

    if (!gender) {
      Form.setFailMessage("Please select your gender.");
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      Form.setFailMessage("Email address must contain @ and .");
      return false;
    }

    if (comment.length < 10) {
      Form.setFailMessage("Comment must be at least 10 characters long.");
      return false;
    }

    Form.setSuccessMessage("Form submitted!");
    return true;
  });
});
