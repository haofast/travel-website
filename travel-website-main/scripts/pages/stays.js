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
    const staysForm = document.forms["staysForm"];

    staysForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const city = staysForm["city"].value.trim();
        const checkinDate = new Date(staysForm["checkinDate"].value.trim());
        const checkoutDate = new Date(staysForm["checkoutDate"].value.trim());
        const adults = staysForm["numAdults"].value.trim();
        const children = staysForm["numChildren"].value.trim();
        const infants = staysForm["numInfants"].value.trim();
        startDate = new Date("2024-09-01");
        endDate = new Date("2024-12-01");
        if (city.empty) {
            Form.setFailMessage("Please enter a city in either Texas or California");
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
        var nadults = Number(adults);
        var nchildren = Number(children);
        var rooms = Math.ceil((nadults + nchildren) / 2);

        const options = { year: 'numeric', month: 'short', day: 'numeric' };

        const normIn = checkinDate.toLocaleDateString('en-US', options);
        const normOut = checkoutDate.toLocaleDateString('en-US', options);

        var infoback = "Location: " + city + ", Check in date: " + normIn + ", Check out date: " + normOut + ", Number of Adults: " + adults + ", Number of Children: " + children +
            ", Number of Infants: "+infants+", Number of Rooms needed: " + rooms;
        Form.setSuccessMessage(infoback);
        return true;
    });
});