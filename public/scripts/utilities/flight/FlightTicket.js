import { TripTypeIDs } from "./FlightConstants.js";

export class FlightTicket {

  constructor(listing, designations) {
    this.listing = listing;
    this.designations = designations;
  }

  getPricePerAdult() {
    return this.listing.price.toFixed(2);
  }

  getPricePerChild() {
    return (this.getPricePerAdult() * 0.70).toFixed(2);
  }

  getPricePerInfant() {
    return (this.getPricePerAdult() * 0.10).toFixed(2);
  }

  getPriceForAdults() {
    return this.designations.numAdults * this.getPricePerAdult();
  }

  getPriceForChildren() {
    return this.designations.numChildren * this.getPricePerChild();
  }

  getPriceForInfants() {
    return this.designations.numInfants * this.getPricePerInfant();
  }

  getTotalPrice() {
    return this.getPriceForAdults() + this.getPriceForChildren() + this.getPriceForInfants();
  }

  getTotalPassengers() {
    return this.designations.numAdults + this.designations.numChildren + this.designations.numInfants;
  }

  getFlightTypeLabel() {
    switch (this.designations.tripType) {
      case TripTypeIDs.ONE_WAY: return "One Way";
      case TripTypeIDs.ROUND_TRIP: return "Round Trip";
      default: throw new Error(`Unknown flight type: ${flightType}`);
    }
  }
}