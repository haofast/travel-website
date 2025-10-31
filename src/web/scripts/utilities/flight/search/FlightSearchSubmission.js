import { getStateAbbreviation } from "../../location.js";
import { isValidDate } from "../../dateValidation.js";
import {
  FieldIDs,
  FieldNames,
  TripTypeIDs,
  FORM_ID,
  MAX_PASSENGERS_PER_CATEGORY,
  VALID_STATES,
} from "../FlightConstants.js";

export class FlightSearchSubmission {

  data = {
    tripType: "",
    origin: "",
    destination: "",
    departureDate: "",
    returningDate: "",
    numAdults: NaN,
    numChildren: NaN,
    numInfants: NaN,
  };

  constructor() {
    const form = document.forms[FORM_ID];
    this.data.tripType      = form[FieldIDs.TRIP_TYPE].value
    this.data.origin        = form[FieldIDs.ORIGIN].value.trim()
    this.data.destination   = form[FieldIDs.DESTINATION].value.trim()
    this.data.departureDate = form[FieldIDs.DEPARTURE_DATE].value
    this.data.returningDate = form[FieldIDs.RETURNING_DATE].value
    this.data.numAdults     = parseInt(form[FieldIDs.NUM_ADULTS].value);
    this.data.numChildren   = parseInt(form[FieldIDs.NUM_CHILDREN].value);
    this.data.numInfants    = parseInt(form[FieldIDs.NUM_INFANTS].value);
  }

  validate() {
    for (const [fieldName, fieldValue] of this.getFieldNameToValueMap()) {
      if (this.isValidValue(fieldValue) || (fieldName === FieldNames.RETURNING_DATE && this.isFlightOneWay())) continue;
      return [`${fieldName.toUpperCase().replace(" ", "_")}_REQUIRED`, `${fieldName} is required.`];
    }

    if (!VALID_STATES.includes(this.getOriginAbbreviation())) {
      return ["INVALID_ORIGIN", "Origin must be either Texas or California."];
    }

    if (!VALID_STATES.includes(this.getDestinationAbbreviation())) {
      return ["INVALID_DESTINATION", "Destination must be either Texas or California."];
    }

    if (!isValidDate(this.data.departureDate)) {
      return ["INVALID_DEPARTURE_DATE", "Departure date must be between September 1, 2024, and December 1, 2024."];
    }

    if (this.isFlightRoundTrip() && !isValidDate(this.data.returningDate)) {
      return ["INVALID_ARRIVING_DATE", "Arriving flight date must be between September 1, 2024, and December 1, 2024."];
    }

    if (this.isFlightRoundTrip() && new Date(this.data.returningDate) <= new Date(this.data.departureDate)) {
      return ["INVALID_ARRIVING_DATE", "Arriving flight date must be after the departing flight date."];
    }

    if ([this.data.numAdults, this.data.numChildren, this.data.numInfants].some((num) => num > MAX_PASSENGERS_PER_CATEGORY)) {
      return ["INVALID_NUM_PASSENGERS", "Number of passengers for each category cannot be more than 4."];
    }

    return ["SUCCESS", null];
  }

  getFieldNameToValueMap() {
    return new Map(Object.entries(FieldNames).map(([key, fieldName]) => (
      [fieldName, this.data[FieldIDs[key]]]
    )));
  }

  isValidValue(value) {
    return value !== null && value !== undefined && value !== '' && !isNaN(value);
  }

  isFlightOneWay() {
    return this.data.tripType === TripTypeIDs.ONE_WAY;
  }

  isFlightRoundTrip() {
    return this.data.tripType === TripTypeIDs.ROUND_TRIP;
  }

  getOriginAbbreviation() {
    return getStateAbbreviation(this.data.origin);
  }

  getDestinationAbbreviation() {
    return getStateAbbreviation(this.data.destination);
  }

  getDepartureDateObject() {
    return new Date(this.data.departureDate);
  }

  getReturningDateObject() {
    return new Date(this.data.returningDate);
  }

  getTotalPassengers() {
    return this.data.numAdults + this.data.numChildren + this.data.numInfants;
  }
}