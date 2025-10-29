export class Cart {

  static getBlankCartData() {
    return { flights: {} };
  }

  static getData() {
    return JSON.parse(localStorage.getItem('CART_ITEMS')) ?? Cart.getBlankCartData();
  }

  static setData(cartData) {
    localStorage.setItem('CART_ITEMS', JSON.stringify(cartData));
  }

  static getFlights() {
    return Cart.getData().flights;
  }

  static getFlight(flightID) {
    return Cart.getFlights()[flightID];
  }

  static addFlight(flightID, submissionData) {
    const data = Cart.getData();

    data.flights[flightID] = {
      tripType: submissionData.tripType,
      numAdults: submissionData.numAdults,
      numChildren: submissionData.numChildren,
      numInfants: submissionData.numInfants,
    };

    Cart.setData(data);
  }
}