const VALID_DATE_REGEX = /^(2024-(09|10|11|12)-(0[1-9]|[12][0-9]|30|31))$/;

export function isValidDate(dateString) {
  return VALID_DATE_REGEX.test(dateString);
}