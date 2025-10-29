
export class FlightDataInterface {

  static LISTINGS_PATH = "/data/flight/FlightListings.json";
  static BOOKINGS_PATH = "/data/flight/FlightBookings.json";

  
  static async getAllListings() {
    const response = await fetch(FlightDataInterface.LISTINGS_PATH);
    return await response.json();
  }

  static async getListing(flightID) {
    const allListings = await FlightDataInterface.getAllListings();
    return allListings.find((fl) => fl.id === flightID);
  }

  static async getAllBookings() {
    const response = await fetch(FlightDataInterface.BOOKINGS_PATH)
    return await response.json();
  }

  static async addBooking(bookedFlightData) {
    const allBookings = await FlightDataInterface.getAllBookings();
    allBookings.push(bookedFlightData);

    /** @todo find way to modify local file */
    console.log("Booked Flight:", bookedFlightData);
  }
}