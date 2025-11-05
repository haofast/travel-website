const DATE_FORMAT_OPTIONS = { year: "numeric", month: "short", day: "numeric" };
const START_VALID_DATE_TIME = new Date("2024-09-01");
const END_VALID_DATE_TIME = new Date("2024-12-01");

export function isValidDate(dateString) {
  const date = new Date(dateString);
  return (START_VALID_DATE_TIME <= date) && (date < END_VALID_DATE_TIME);
}

export function getLocalizedDateString(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", DATE_FORMAT_OPTIONS);
}