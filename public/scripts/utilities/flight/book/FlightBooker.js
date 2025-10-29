import { Cart } from "../../Cart.js";
import { FlightDataInterface } from "../FlightDataInterface.js";

export class FlightBooker {

  constructor(bookSubmission, flightTicket) {
    this.bookSubmission = bookSubmission;
    this.flightTicket = flightTicket;
  }

  async bookFlight() {
    const bookedFlightData = {
      id: this.flightTicket.listing.id,
      origin: this.flightTicket.listing.origin,
      destination: this.flightTicket.listing.destination,
      departureDate: this.flightTicket.listing.departureDate,
      arrivalDate: this.flightTicket.listing.arrivalDate,
      departureTime: this.flightTicket.listing.departureTime,
      arrivalTime: this.flightTicket.listing.arrivalTime,
      totalPrice: this.flightTicket.getTotalPrice(),
      bookingNumber: crypto.randomUUID(),
      passengers: this.bookSubmission.data.passengers,
    };

    Cart.removeFlight(this.flightTicket.listing.id);
    await FlightDataInterface.addBooking(bookedFlightData);
  }
}