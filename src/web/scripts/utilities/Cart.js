export class Cart {

  static getBlankCartData() {
    return { flights: {}, cars: [] };
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

  static addFlight(flightID, flightCartData) {
    const data = Cart.getData();

    data.flights[flightID] = {
      tripType: flightCartData.tripType,
      numAdults: flightCartData.numAdults,
      numChildren: flightCartData.numChildren,
      numInfants: flightCartData.numInfants,
    };

    Cart.setData(data);
  }

  static removeFlight(flightID) {
    const data = Cart.getData();
    delete data.flights[flightID]
    Cart.setData(data);
  }

  static getCars() {
    return Cart.getData().cars;
  }

  static addCar(carID) {
    const data = Cart.getData();

    if (!data.cars.includes(carID)) {
      data.cars.push(carID);
      Cart.setData(data);
    }
  }

  static removeCar(carID) {
    const data = Cart.getData();
    data.cars = data.cars.filter(id => id !== carID);
    Cart.setData(data);
  }
}