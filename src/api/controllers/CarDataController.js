import { DataController } from "../utilities/DataController.js";

export class CarDataController extends DataController {

  static LISTINGS_PATH = "src/api/data/car/CarListings.xml";
  static BOOKINGS_PATH = "src/api/data/car/CarBookings.xml";

  getAllListings() {
    return this.getFileXml(CarDataController.LISTINGS_PATH, "listings").cars;
  }

  getAllBookings() {
    return this.getFileXml(CarDataController.BOOKINGS_PATH, "bookings").bookings || {};
  }

  setListings(listings) {
    return this.setFileXml(CarDataController.LISTINGS_PATH, "listings", { cars: listings });
  }

  setBookings(bookings) {
    return this.setFileXml(CarDataController.BOOKINGS_PATH, "bookings", { bookings: bookings });
  }

  findListing(listings, carID) {
    return listings[carID];
  }

  respondWithListings() {
    this.res.json(this.getAllListings());
  }

  respondWithListing() {
    this.res.json(this.findListing(this.getAllListings(), this.req.params.carID));
  }

  bookCar() {
    const allListings = this.getAllListings();
    const allBookings = this.getAllBookings();

    const newBooking = this.req.body;
    const targetedListing = this.findListing(allListings, newBooking.id);
    delete allListings[targetedListing.id];
    allBookings[newBooking.id] = newBooking;

    this.setBookings(allBookings);
    this.setListings(allListings);
  }
}