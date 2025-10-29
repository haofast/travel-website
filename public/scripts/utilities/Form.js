export class Form {

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