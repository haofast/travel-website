
export class FlightDataInterface {

  static async getAllListings() {
    return (await fetch("http://localhost:8080/api/flight/listings", {
      method: "GET",
    })).json();
  }

  static async getListing(flightID) {
    return (await fetch(`http://localhost:8080/api/flight/listings/${flightID}`, {
      method: "GET",
    })).json();
  }

  static async addBooking(bookedFlightData) {
    await fetch(`http://localhost:8080/api/flight/booking`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookedFlightData),
      method: "POST",
    });
  }
}