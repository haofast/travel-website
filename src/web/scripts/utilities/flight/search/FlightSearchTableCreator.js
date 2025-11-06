import { Cart } from "../../Cart.js";
import { SearchTableCreator } from "../../SearchTableCreator.js";
import { FLIGHT_TABLE_COLUMNS_NAMES } from "../FlightConstants.js";
import { FlightTicket } from "../FlightTicket.js";

export class FlightSearchTableCreator extends SearchTableCreator{

  constructor(flightListings, searchSubmissionData) {
    super(flightListings);
    this.searchSubmissionData = searchSubmissionData;
  }

  getColumnNames() {
    return FLIGHT_TABLE_COLUMNS_NAMES;
  }

  getDetailsListForRow(flightListing) {
    const flightTicket = new FlightTicket(flightListing, this.searchSubmissionData);

    return [
      flightListing.id,
      flightListing.origin,
      flightListing.destination,
      `${flightListing.departureDate} ${flightListing.departureTime}`,
      `${flightListing.arrivalDate} ${flightListing.arrivalTime}`,
      flightListing.availableSeats,
      `$${flightTicket.getPricePerAdult()}`,
      `$${flightTicket.getPricePerChild()}`,
      `$${flightTicket.getPricePerInfant()}`,
    ];
  }

  clickCartButton(flightListing) {
    Cart.addFlight(flightListing.id, this.searchSubmissionData);
    alert(`Flight ${flightListing.id} added to cart!`);
  }
}