import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const APP_TIMEZONE = "Europe/Istanbul";

export const toAppTz = (date: string | Date | Dayjs) => dayjs(date).tz(APP_TIMEZONE);

export const appTzDayBoundary = (day: Dayjs, edge: "start" | "end") =>
  dayjs.tz(day.format("YYYY-MM-DD"), APP_TIMEZONE)[edge === "start" ? "startOf" : "endOf"]("day");
