import { Cart } from "../../Cart.js";
import { FlightDataInterface } from "../FlightDataInterface.js";

export class FlightBooker {

  constructor(bookSubmission, flightTicket) {
    this.bookSubmission = bookSubmission;
    this.flightTicket = flightTicket;
  }

  async bookFlight() {
    const bookedFlightData = {
      bookingNumber: crypto.randomUUID(),
      flightID: this.flightTicket.listing.id,
      origin: this.flightTicket.listing.origin,
      destination: this.flightTicket.listing.destination,
      departureDate: this.flightTicket.listing.departureDate,
      arrivalDate: this.flightTicket.listing.arrivalDate,
      departureTime: this.flightTicket.listing.departureTime,
      arrivalTime: this.flightTicket.listing.arrivalTime,
      totalPrice: this.flightTicket.getTotalPrice(),
      passengers: this.bookSubmission.data.passengers,
    };

    Cart.removeFlight(this.flightTicket.listing.id);
    return await FlightDataInterface.addBooking(bookedFlightData);
  }
}