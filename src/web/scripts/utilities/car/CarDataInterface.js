export class CarDataInterface {

  static async getAllListings() {
    return (await fetch("/api/car/listings", {
      method: "GET",
    })).json();
  }

  static async getListing(carID) {
    return (await fetch(`/api/car/listings/${carID}`, {
      method: "GET",
    })).json();
  }

  static async addBooking(bookedCarData) {
    return await fetch(`/api/car/booking`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookedCarData),
      method: "POST",
    });
  }
}