
export class FlightDataInterface {

  static async getAllListings() {
    return (await fetch("/api/flight/listings", {
      method: "GET",
    })).json();
  }

  static async getListing(flightID) {
    return (await fetch(`/api/flight/listings/${flightID}`, {
      method: "GET",
    })).json();
  }

  static async addBooking(bookedFlightData) {
    return await fetch(`/api/flight/booking`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookedFlightData),
      method: "POST",
    });
  }
}