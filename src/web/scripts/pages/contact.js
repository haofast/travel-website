import { Form } from "../utilities/Form.js";

const NAME_REGEX = /^[A-Z][a-z]+$/;
const PHONE_REGEX = /^\u0028\d{3}\u0029 \d{3}-\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.forms["contactForm"];

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      Form.setFailMessage(validationMessage);
      return;
    }

    await uploadContactSubmission();
    Form.setSuccessMessage("Form submitted!");
    return true;
  });

  function validateForm() {
    const data = getFormData();

    if (!NAME_REGEX.test(data.firstName)) {
      return ("First name must start with a capital letter and contain only alphabetic characters.");
    }
    if (!NAME_REGEX.test(data.lastName)) {
      return ("Last name must start with a capital letter and contain only alphabetic characters.");
    }
    if (data.firstName.toLowerCase() === data.lastName.toLowerCase()) {
      return ("First name and last name cannot be the same.");
    }
    if (!PHONE_REGEX.test(data.phone)) {
      return ("Phone number must be formatted as (ddd) ddd-dddd.");
    }
    if (!data.gender) {
      return ("Please select your gender.");
    }
    if (!EMAIL_REGEX.test(data.email)) {
      return ("Email address must contain @ and .");
    }
    if (data.comment.length < 10) {
      return ("Comment must be at least 10 characters long.");
    }
    return null;
  }

  function getFormData() {
    return {
      firstName: contactForm["firstName"].value.trim(),
      lastName: contactForm["lastName"].value.trim(),
      phone: contactForm["phone"].value.trim(),
      gender: contactForm["gender"].value.trim(),
      email: contactForm["email"].value.trim(),
      comment: contactForm["comment"].value.trim(),
    };
  }

  async function uploadContactSubmission() {
    return await fetch(`http://localhost:8080/api/contact/submission`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getFormData()),
      method: "POST",
    });
  }
});
