import {fromReferenceDays, toReferenceDays} from "@softwareventures/date";
import {
    fromReferenceSeconds as timeFromReferenceSeconds,
    toReferenceSeconds as timeToReferenceSeconds
} from "@softwareventures/time/time";
import {Comparator, Comparison} from "@softwareventures/ordered";
import {map, maximum, minimum} from "@softwareventures/iterable";
import {map as mapNullable} from "@softwareventures/nullable";
import {JsDate} from "./js-date";

/** An instant in time, represented as a date and time in the Gregorian
 * Calendar, UTC. */
export interface Timestamp {
    readonly type: "timestamp";

    /** The year.
     *
     * Should be an integer.
     *
     * Positive values represent years in the Common Era (CE/AD). For example,
     * 2021 represents 2021 CE, the year this module was first published to
     * npm.
     *
     * Negative values or zero represent years before the Common Era (BCE/BC).
     * Zero represents 1 BCE, -1 represents 2 BCE, -2 represents BCE, and so
     * on.
     *
     * Note that there is no year zero in the Gregorian Calendar. The year 1
     * BCE was immediately followed by 1 CE.
     *
     * @default 1 */
    readonly year: number;

    /** The month of the year. Should be an integer in the range 1-12.
     *
     * @default 1 */
    readonly month: number;

    /** The day of the month. Should be an integer in the range 1-31.
     *
     * @default 1 */
    readonly day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range 0-23.
     *
     * @default 0 */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range 0-59.
     *
     * @default 0 */
    readonly minutes: number;

    /** The seconds component of the time of day. Should be in the range 0-60,
     * inclusive of 0 but exclusive of 60. May be fractional to represent an
     * instant in time with sub-second accuracy.
     *
     * @default 0 */
    readonly seconds: number;
}

/** Options for creating a Timestamp. */
export type TimestampOptions = Partial<Timestamp>;

/** Tests if the specified value is a Timestamp. */
export function isTimestamp(value: unknown): value is Timestamp {
    return (
        typeof value === "object" &&
        value != null &&
        "type" in value &&
        (value as {type: unknown}).type === "timestamp" &&
        "year" in value &&
        typeof (value as {year: unknown}).year === "number" &&
        "month" in value &&
        typeof (value as {month: unknown}).month === "number" &&
        "day" in value &&
        typeof (value as {day: unknown}).day === "number" &&
        "hours" in value &&
        typeof (value as {hours: unknown}).hours === "number" &&
        "minutes" in value &&
        typeof (value as {minutes: unknown}).minutes === "number" &&
        "seconds" in value &&
        typeof (value as {seconds: unknown}).seconds === "number"
    );
}

/** Creates a Timestamp with the specified options. */
export function timestamp(options: TimestampOptions): Timestamp {
    return fromReferenceSeconds(toReferenceSeconds(options));
}

/** Creates a Timestamp with the specified options. */
export const normalize = timestamp;

/** Converts the specified Timestamp to a count of seconds since the reference
 * Timestamp of midnight on the morning of 1st January, 1 CE. */
export function toReferenceSeconds(timestamp: TimestampOptions): number {
    const year = timestamp.year ?? 1;
    const month = timestamp.month ?? 1;
    const day = timestamp.day ?? 1;
    const hours = timestamp.hours ?? 0;
    const minutes = timestamp.minutes ?? 0;
    const seconds = timestamp.seconds ?? 0;

    return (
        toReferenceDays({year, month, day}) * 86400 +
        timeToReferenceSeconds({hours, minutes, seconds})
    );
}

/** Creates a Timestamp corresponding to the specified count of seconds since
 * the reference Timestamp of midnight on the morning of 1st January, 1 CE. */
export function fromReferenceSeconds(referenceSeconds: number): Timestamp {
    const referenceDays = Math.floor(referenceSeconds / 86400);
    const {year, month, day} = fromReferenceDays(referenceDays);
    const {hours, minutes, seconds} = timeFromReferenceSeconds(
        referenceSeconds - referenceDays * 86400
    );
    return {type: "timestamp", year, month, day, hours, minutes, seconds};
}

/** Tests if two Timestamps are equal. */
export function equal(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) === toReferenceSeconds(b);
}

/** Tests if two Timestamps are equal. */
export function equalFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => equal(a, b);
}

/** Tests if two Timestamps are not equal. */
export function notEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) !== toReferenceSeconds(b);
}

/** Tests if two Timestamps are not equal. */
export function notEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => notEqual(a, b);
}

/** Compares two Timestamps. */
export const compare: Comparator<TimestampOptions> = (a, b) => {
    const as = toReferenceSeconds(a);
    const bs = toReferenceSeconds(b);

    if (as < bs) {
        return Comparison.before;
    } else if (as > bs) {
        return Comparison.after;
    } else if (as === bs) {
        return Comparison.equal;
    } else {
        return Comparison.undefined;
    }
};

/** Compares two Timestamps. */
export function compareFn(b: TimestampOptions): (a: TimestampOptions) => Comparison {
    return a => compare(a, b);
}

/** Tests if the Timestamp a is before the Timestamp b. */
export function before(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) < toReferenceSeconds(b);
}

/** Tests if the Timestamp a is before the Timestamp b. */
export function beforeFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => before(a, b);
}

/** Tests if the Timestamp a is before or equal to the Timestamp b. */
export function beforeOrEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) <= toReferenceSeconds(b);
}

/** Tests if the Timestamp a is before or equal to the Timestamp b. */
export function beforeOrEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => beforeOrEqual(a, b);
}

/** Tests if the Timestamp a is after the Timestamp b. */
export function after(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) > toReferenceSeconds(b);
}

/** Tests if the Timestamp a is after the Timestamp b. */
export function afterFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => after(a, b);
}

/** Tests if the Timestamp a is after or equal to the Timestamp b. */
export function afterOrEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) >= toReferenceSeconds(b);
}

/** Tests if the Timestamp a is after or equal to the Timestamp b. */
export function afterOrEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => afterOrEqual(a, b);
}

/** Returns the earliest of the specified Timestamps. */
export function earliest<T extends TimestampOptions>(timestamps: Iterable<T>): Timestamp | null {
    return mapNullable(minimum(map(timestamps, toReferenceSeconds)), fromReferenceSeconds);
}

/** Returns the earliest of the specified Timestamps. */
export function earliestFn(b: TimestampOptions): (a: TimestampOptions) => Timestamp {
    const bs = toReferenceSeconds(b);
    return a => {
        const as = toReferenceSeconds(a);
        return bs < as ? fromReferenceSeconds(bs) : fromReferenceSeconds(as);
    };
}

/** Returns the latest of the specified Timestamps. */
export function latest<T extends TimestampOptions>(timestamps: Iterable<T>): Timestamp | null {
    return mapNullable(maximum(map(timestamps, toReferenceSeconds)), fromReferenceSeconds);
}

/** Returns the latest of the specified Timestamps. */
export function latestFn(b: TimestampOptions): (a: TimestampOptions) => Timestamp {
    const bs = toReferenceSeconds(b);
    return a => {
        const as = toReferenceSeconds(a);
        return bs > as ? fromReferenceSeconds(bs) : fromReferenceSeconds(as);
    };
}

/** Creates a Timestamp of the current time and date. */
export function now(): Timestamp {
    const now = new JsDate();
    return timestamp({
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() + 1,
        day: now.getUTCDate(),
        hours: now.getUTCHours(),
        minutes: now.getUTCMinutes(),
        seconds: now.getUTCSeconds() + now.getUTCMilliseconds() / 1000
    });
}

/** Parses a Timestamp from text in ISO 8601 format.
 *
 * The ISO 8601 text must specify a time zone offset, which should usually be
 * "Z" for UTC. If any other offset is specified then the date and time will
 * be converted to and stored as UTC.
 *
 * If the specified text is not a valid ISO 8601 date-time then this function
 * returns `null`.
 *
 * Both extended "YYYY-MM-DDTHH:MM:SS.ssss+hh:mm and basic
 * "YYYYMMDDTHHMMSS.ssss+hhmm" ISO 8601 formats are accepted. */
export function parseIso8601(text: string): Timestamp | null {
    const match = /^([+-]?\d{4,})-?(\d{2})-?(\d{2})T(\d{2}):?(\d{2}):?(\d{2}(?:[.,]?\d+)?)(?:Z|([+-][0-9]{2}):?([0-9]{2}))$/.exec(
        text
    );
    if (match == null) {
        return null;
    }

    const offsetHours = match[7] == null ? 0 : parseInt(match[7], 10);
    const offsetMinutes = match[8] == null ? 0 : parseInt(match[8], 10) * Math.sign(offsetHours);

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10) - offsetHours;
    const minutes = parseInt(match[5], 10) - offsetMinutes;
    const seconds = parseFloat(match[6].replace(",", "."));

    return timestamp({year, month, day, hours, minutes, seconds});
}

export function formatIso8601(timestamp: TimestampOptions): string {
    const {minutes, seconds} = normalize(timestamp);
    return (
        padYear(timestamp) +
        "-" +
        padMonth(timestamp) +
        "-" +
        padDay(timestamp) +
        "T" +
        padHours(timestamp) +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).replace(/^\d+/, s => s.padStart(2, "0")) +
        "Z"
    );
}

export function padYear(timestamp: TimestampOptions): string {
    const {year} = normalize(timestamp);
    return String(year).padStart(4, "0");
}

export function padMonth(timestamp: TimestampOptions): string {
    const {month} = normalize(timestamp);
    return String(month).padStart(2, "0");
}

export type MonthName =
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";

const monthNames: readonly MonthName[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export function monthName(timestamp: TimestampOptions): MonthName {
    return monthNames[normalize(timestamp).month - 1];
}

export function padDay(timestamp: TimestampOptions): string {
    const {day} = normalize(timestamp);
    return String(day).padStart(2, "0");
}

export type DayOfWeek =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";

const daysOfWeek: readonly DayOfWeek[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export function dayOfWeek(timestamp: TimestampOptions): DayOfWeek {
    const {year, month, day} = normalize(timestamp);
    return daysOfWeek[(8 + (toReferenceDays({year, month, day}) % 7)) % 7];
}

export function padHours(timestamp: TimestampOptions): string {
    const {hours} = normalize(timestamp);
    return String(hours).padStart(2, "0");
}
