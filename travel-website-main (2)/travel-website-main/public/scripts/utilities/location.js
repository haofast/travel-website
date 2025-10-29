const STATE_TO_NAME_MAP = {
  CA: "California",
  TX: "Texas",
};

/** returns the state name for the input, returns null if state is invalid or unsupported */
export function getStateName(stateAbbreviationOrName) {
  const upperCaseStateAbbrOrName = stateAbbreviationOrName.toUpperCase();

  // input is an abbreviation
  if (STATE_TO_NAME_MAP[upperCaseStateAbbrOrName]) {
    return STATE_TO_NAME_MAP[upperCaseStateAbbrOrName];
  }

  // input is a name
  for (const stateName of Object.values(STATE_TO_NAME_MAP)) {
    if (stateName.toUpperCase() === upperCaseStateAbbrOrName) {
      return stateName;
    }
  }

  return null;
}

/** returns the state abbreviation for the input, returns null if state is invalid or unsupported */
export function getStateAbbreviation(stateAbbreviationOrName) {
  const upperCaseStateAbbrOrName = stateAbbreviationOrName.toUpperCase();

  // input is an abbreviation
  if (STATE_TO_NAME_MAP[upperCaseStateAbbrOrName]) {
    return upperCaseStateAbbrOrName;
  }

  // input is a name
  for (const [stateAbbr, stateName] of Object.entries(STATE_TO_NAME_MAP)) {
    if (stateName.toUpperCase() === upperCaseStateAbbrOrName) {
      return stateAbbr;
    }
  }

  return null;
}