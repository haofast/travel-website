import { FlightDataInterface } from "../FlightDataInterface.js";

export class FlightSearcher {

  constructor(searchSubmission) {
    this.searchSubmission = searchSubmission;
  }

  async getDepartingFlights() {
    return this.getFlights(
      this.searchSubmission.getDepartureDateObject(),
      this.searchSubmission.data.origin,
      this.searchSubmission.data.destination,
    );
  }

  async getReturningFlights() {
    return this.getFlights(
      this.searchSubmission.getReturningDateObject(),
      this.searchSubmission.data.destination,
      this.searchSubmission.data.origin,
    );
  }

  async getFlights(requestedDepartureDate, origin, destination) {
    const allFlightListings = await FlightDataInterface.getAllListings();
    const requestedNumPassengers = this.searchSubmission.getTotalPassengers();

    console.log(origin, destination)

    // get flights matching origin, destination, and the minimum required seats
    const filteredFlightListings = allFlightListings.filter((flight) => (
      flight.origin.toLowerCase().includes(origin.toLowerCase())
      && flight.destination.toLowerCase().includes(destination.toLowerCase())
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