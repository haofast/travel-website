export const FORM_ID = "flightForm";

export const VALID_STATES = ["CA", "TX"];

export const MAX_PASSENGERS_PER_CATEGORY = 4;

export const TripTypeIDs = {
  ONE_WAY: "oneway",
  ROUND_TRIP: "roundtrip",
};

export const FieldIDs = {
  TRIP_TYPE:      "tripType",
  ORIGIN:         "origin",
  DESTINATION:    "destination",
  DEPARTURE_DATE: "departureDate",
  RETURNING_DATE: "returningDate",
  NUM_ADULTS:     "numAdults",
  NUM_CHILDREN:   "numChildren",
  NUM_INFANTS:    "numInfants",
};

export const FieldNames = {
  TRIP_TYPE:      "Type of Trip",
  ORIGIN:         "Origin",
  DESTINATION:    "Destination",
  DEPARTURE_DATE: "Departing Flight Date",
  RETURNING_DATE: "Returning Flight Date",
  NUM_ADULTS:     "Number of Adults",
  NUM_CHILDREN:   "Number of Children",
  NUM_INFANTS:    "Number of Infants",
};

export const PASSENGER_VALIDATION_STATUSES = [
  "NUMBER_OF_ADULTS_REQUIRED",
  "NUMBER_OF_CHILDREN_REQUIRED",
  "NUMBER_OF_INFANTS_REQUIRED",
  "INVALID_NUM_PASSENGERS",
];

export const FLIGHT_TABLE_COLUMNS_NAMES = [
  "Flight",
  "Origin",
  "Destination",
  "Depart",
  "Arrive",
  "Seats",
  "Price (Adult)",
  "Price (Children)",
  "Price (Infant)",
];