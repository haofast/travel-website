import { TripTypeIDs } from "./FlightConstants.js";

export class FlightTicket {

  constructor(flightData, submissionData) {
    this.flightData = flightData;
    this.submissionData = submissionData;
  }

  getPricePerAdult() {
    return this.flightData.price.toFixed(2);
  }

  getPricePerChild() {
    return (this.getPricePerAdult() * 0.70).toFixed(2);
  }

  getPricePerInfant() {
    return (this.getPricePerAdult() * 0.10).toFixed(2);
  }

  getPriceForAdults() {
    return this.submissionData.numAdults * this.getPricePerAdult();
  }

  getPriceForChildren() {
    return this.submissionData.numChildren * this.getPricePerChild();
  }

  getPriceForInfants() {
    return this.submissionData.numInfants * this.getPricePerInfant();
  }

  getTotalPrice() {
    return this.getPriceForAdults() + this.getPriceForChildren() + this.getPriceForInfants();
  }

  getTotalPassengers() {
    return this.submissionData.numAdults + this.submissionData.numChildren + this.submissionData.numInfants;
  }

  getFlightTypeLabel() {
    switch (this.submissionData.tripType) {
      case TripTypeIDs.ONE_WAY: return "One Way";
      case TripTypeIDs.ROUND_TRIP: return "Round Trip";
      default: throw new Error(`Unknown flight type: ${flightType}`);
    }
  }
}