import { FlightDataInterface } from "../FlightDataInterface.js";

export class FlightSearcher {

  constructor(searchSubmission) {
    this.searchSubmission = searchSubmission;
  }

  async getDepartingFlights() {
    return this.getFlights(
      this.searchSubmission.getDepartureDateObject(),
      this.searchSubmission.getOriginAbbreviation(),
      this.searchSubmission.getDestinationAbbreviation(),
    );
  }

  async getReturningFlights() {
    return this.getFlights(
      this.searchSubmission.getReturningDateObject(),
      this.searchSubmission.getDestinationAbbreviation(),
      this.searchSubmission.getOriginAbbreviation(),
    );
  }

  async getFlights(requestedDepartureDate, origin, destination) {
    const allFlightListings = await FlightDataInterface.getAllListings();
    const requestedNumPassengers = this.searchSubmission.getTotalPassengers();

    // get flights matching origin, destination, and the minimum required seats
    const filteredFlightListings = allFlightListings.filter((flight) => (
      flight.origin.includes(origin)
      && flight.destination.includes(destination)
      && parseInt(flight.availableSeats) >= requestedNumPassengers
    ));

    // then filter by departure date
    let selectedFlightListings = filteredFlightListings.filter((flight) => (
      new Date(flight.departureDate).getTime() === requestedDepartureDate.getTime()
    ));

    // if still no flights, expand search to +/- 3 days from requested departure date
    if (selectedFlightListings.length === 0) {
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const departureDateRangeStart = new Date(requestedDepartureDate.getTime() - threeDaysInMs);
      const departureDateRangeEnd = new Date(requestedDepartureDate.getTime() + threeDaysInMs);

      selectedFlightListings = filteredFlightListings.filter((flight) => (
        new Date(flight.departureDate) >= departureDateRangeStart
        && new Date(flight.departureDate) <= departureDateRangeEnd
      ));
    }

    return selectedFlightListings;
  }
}