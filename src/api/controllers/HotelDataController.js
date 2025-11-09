import { DataController } from "../utilities/DataController.js";

export class HotelDataController extends DataController {
  static LISTINGS_PATH = "src/api/data/hotel/HotelListings.xml";
  static BOOKINGS_PATH = "src/api/data/hotel/HotelBookings.json";

  getAllListings() {
    const xml = this.getFileXml(HotelDataController.LISTINGS_PATH, "hotels");
    const hotelsObj = xml.hotels;
    const hotelsArray = Array.isArray(hotelsObj.hotel)
      ? hotelsObj.hotel
      : Object.values(hotelsObj);
    return hotelsArray;
  }

  getAllBookings() {
    const data = this.getFileJson(HotelDataController.BOOKINGS_PATH, "bookings");
    return Array.isArray(data) ? data : [];
  }

  setListings(hotelsArray) {
    const hotelsObj = {};
    hotelsArray.forEach((h) => {
      const id = h["hotel-id"] || h.id || crypto.randomUUID();
      hotelsObj[id] = h;
    });
    const data = { hotels: hotelsObj };
    this.setFileXml(HotelDataController.LISTINGS_PATH, "hotels", data);
  }

  setBookings(bookings) {
    this.setFileJson(HotelDataController.BOOKINGS_PATH, "bookings", bookings);
  }

  findListing(hotels, hotelID) {
    return hotels.find((h) => h["hotel-id"] === hotelID);
  }

  respondWithListings() {
    this.res.json(this.getAllListings());
  }

  respondWithListing() {
    const allListings = this.getAllListings();
    const hotel = this.findListing(allListings, this.req.params.hotelID);
    this.res.json(hotel);
  }

  bookHotel() {
    const allListings = this.getAllListings();
    const allBookings = this.getAllBookings();
    const newBooking = this.req.body;
    const targetedListing = this.findListing(allListings, newBooking.hotelID);
    if (!targetedListing) {
      return this.res.status(404).json({ error: "Hotel not found" });
    }
    const requestedRooms = Number(newBooking.rooms ?? 1);
    const currentAvailable = Number(targetedListing["available-rooms"]);
    if (requestedRooms > currentAvailable) {
      return this.res.status(400).json({ error: "Not enough available rooms" });
    }
    targetedListing["available-rooms"] = String(currentAvailable - requestedRooms);
    allBookings.push(newBooking);
    this.setListings(allListings);
    this.setBookings(allBookings);
    this.res.sendStatus(200);
  }
}
