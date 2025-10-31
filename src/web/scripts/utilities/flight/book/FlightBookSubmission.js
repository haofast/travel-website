export class FlightBookSubmission {

  data = { passengers: [] };

  constructor(designations) {
    this.data.passengers = [
      ...FlightBookSubmission.getPassengerData('adult', designations.numAdults),
      ...FlightBookSubmission.getPassengerData('child', designations.numChildren),
      ...FlightBookSubmission.getPassengerData('infant', designations.numInfants),
    ];
  }

  static getPassengerData(passengerType, numPassengers) {
    return Array.from({ length: numPassengers }, (_, i) => ({
      type: passengerType,
      firstName: document.getElementById(`${passengerType}FirstName${i}`).value,
      lastName: document.getElementById(`${passengerType}LastName${i}`).value,
      dob: document.getElementById(`${passengerType}DOB${i}`).value,
      ssn: document.getElementById(`${passengerType}SSN${i}`).value,
    }));
  }
}