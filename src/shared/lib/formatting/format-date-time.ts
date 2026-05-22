const DEFAULT_DATE_LOCALE = "en-US";
const DEFAULT_TIME_ZONE = "UTC";

export function formatDateTime(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
    timeStyle: "short"
  }
) {
  return new Intl.DateTimeFormat(DEFAULT_DATE_LOCALE, {
    ...options,
    timeZone: DEFAULT_TIME_ZONE
  }).format(new Date(value));
}
