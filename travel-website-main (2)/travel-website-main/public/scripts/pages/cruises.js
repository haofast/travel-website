const VALID_DATE_REGEX = /^(2024-(09|10|11|12)-(0[1-9]|[12][0-9]|30|31))$/;
const VALID_DESTINATIONS = ["alaska", "bahamas", "europe", "mexico"];
const MIN_DURATION = 3;
const MAX_DURATION = 10;
const MAX_ADULTS = 2;

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

  static setElementVisibility(elementId, visible) {
    const classList = document.getElementById(elementId).classList;
    visible ? classList.remove("invisible") : classList.add("invisible");
  }

  static toggleElementVisibility(elementId) {
    const classList = document.getElementById(elementId).classList;
    classList.contains("invisible") ? classList.remove("invisible") : classList.add("invisible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cruiseForm = document.forms["cruiseForm"];

  cruiseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const destination = cruiseForm["destination"].value.trim().toLowerCase();
    const departingBetween = cruiseForm["departingBetween"].value.trim();
    const durationMin = cruiseForm["durationMin"].value.trim();
    const durationMax = cruiseForm["durationMax"].value.trim();
    const numAdults = cruiseForm["numAdults"].value.trim();
    const numInfants = cruiseForm["numInfants"].value.trim();

    const fieldNameToValueMap = new Map([
      ["Destination", destination],
      ["Departing between", departingBetween],
      ["Minimum duration (days)", durationMin],
      ["Maximum duration (days)", durationMax],
      ["Number of adults", numAdults],
      ["Number of infants", numInfants],
    ]);

    for (const [key, value] of fieldNameToValueMap.entries()) {
      if (!value) {
        Form.setFailMessage(`${key} is required.`);
        return false;
      }
    }

    if (!VALID_DESTINATIONS.includes(destination)) {
      Form.setFailMessage("Destination must be Alaska, Bahamas, Europe, or Mexico.");
      return false;
    }

    if (!VALID_DATE_REGEX.test(departingBetween)) {
      Form.setFailMessage("Departing date must be between September 1, 2024, and December 1, 2024.");
      return false;
    }

    const minDays = parseInt(durationMin);
    const maxDays = parseInt(durationMax);

    if (minDays < MIN_DURATION || maxDays > MAX_DURATION || minDays > maxDays) {
      Form.setFailMessage("Duration must be between 3 and 10 days, and minimum cannot exceed maximum.");
      return false;
    }

    const adults = parseInt(numAdults);
    const infants = parseInt(numInfants);

    if (adults > MAX_ADULTS) {
      Form.setFailMessage("Number of adults cannot exceed 2 per room.");
      return false;
    }

    const formOutput = document.getElementById("formOutput");
    const list = document.createElement("ul");
    formOutput.innerHTML = "";
    formOutput.appendChild(list);

    for (const [key, value] of fieldNameToValueMap.entries()) {
      const listItem = document.createElement("li");
      listItem.textContent = `${key}: ${value}`;
      list.appendChild(listItem);
    }

    Form.setSuccessMessage("Form submitted successfully!");
    return true;
  });
});
