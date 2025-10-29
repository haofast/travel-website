import { getAllFlights } from "./FlightData.js";

export class FlightLookup {

  constructor(submission) {
    this.submission = submission;
  }

  getDepartingFlights() {
    return this.getFlights(
      this.submission.getDepartureDateObject(),
      this.submission.getOriginAbbreviation(),
      this.submission.getDestinationAbbreviation(),
    );
  }

  getReturningFlights() {
    return this.getFlights(
      this.submission.getReturningDateObject(),
      this.submission.getDestinationAbbreviation(),
      this.submission.getOriginAbbreviation(),
    );
  }

  getFlights(requestedDepartureDate, originAbbreviation, destinationAbbreviation) {
    const allFlights = getAllFlights();
    const requestedNumPassengers = this.submission.getTotalPassengers();

    // get flights matching origin, destination, and the minimum required seats
    const filteredFlights = allFlights.filter((flight) => (
      flight.origin.includes(originAbbreviation)
      && flight.destination.includes(destinationAbbreviation)
      && parseInt(flight.availableSeats) >= requestedNumPassengers
    ));

    // then filter by departure date
    let selectedFlights = filteredFlights.filter((flight) => (
      new Date(flight.departureDate).getTime() === requestedDepartureDate.getTime()
    ));

    // if still no flights, expand search to +/- 3 days from requested departure date
    if (selectedFlights.length === 0) {
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      const departureDateRangeStart = new Date(requestedDepartureDate.getTime() - threeDaysInMs);
      const departureDateRangeEnd = new Date(requestedDepartureDate.getTime() + threeDaysInMs);

      selectedFlights = filteredFlights.filter((flight) => (
        new Date(flight.departureDate) >= departureDateRangeStart
        && new Date(flight.departureDate) <= departureDateRangeEnd
      ));
    }

    return selectedFlights;
  }
}