import { DataController } from "../utilities/DataController.js";

export class CarDataController extends DataController {

  static LISTINGS_PATH = "src/api/data/car/CarListings.xml";

  getAllListings() {
    return this.getFileXml(CarDataController.LISTINGS_PATH, "listings").cars;
  }

  setListings(listings) {
    return this.setFileXml(CarDataController.LISTINGS_PATH, "listings", { cars: listings });
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

    const newBooking = this.req.body;
    const targetedListing = this.findListing(allListings, newBooking.carID);

    delete allListings[targetedListing.id];
    this.setListings(allListings);
  }
}