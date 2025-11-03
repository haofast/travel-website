import { DataController } from "../utilities/DataController.js";

export class FlightDataController extends DataController {

  static LISTINGS_PATH = "src/api/data/flight/FlightListings.json";
  static BOOKINGS_PATH = "src/api/data/flight/FlightBookings.json";

  getAllListings() {
    return this.getFileJson(FlightDataController.LISTINGS_PATH, 'listings');
  }

  getAllBookings() {
    return this.getFileJson(FlightDataController.BOOKINGS_PATH, 'bookings');
  }

  setListings(listings) {
    this.setFileJson(FlightDataController.LISTINGS_PATH, 'listings', listings);
  }

  setBookings(bookings) {
    this.setFileJson(FlightDataController.BOOKINGS_PATH, 'listings', bookings);
  }

  findListing(listings, flightID) {
    return listings.find((f) => f.id === flightID);
  }

  respondWithListings() {
    this.res.json(this.getAllListings());
  }

  respondWithListing() {
    this.res.json(this.findListing(this.getAllListings(), this.req.params.flightID));
  }

  bookFlight() {
    const allListings = this.getAllListings();
    const allBookings = this.getAllBookings();

    const newBooking = this.req.body;
    const targetedListing = this.findListing(allListings, newBooking.flightID);

    const numPassengers = newBooking.passengers.length;
    targetedListing.availableSeats = targetedListing.availableSeats - numPassengers;
    allBookings.push(newBooking);

    this.setListings(allListings);
    this.setBookings(allBookings);
    this.res.sendStatus(200);
  }
}