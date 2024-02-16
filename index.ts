import * as date from "@softwareventures/date";
import {daysInMonth, fromReferenceDays, toReferenceDays} from "@softwareventures/date";
import * as format from "@softwareventures/format-timestamp";
import {
    fromReferenceSeconds as timeFromReferenceSeconds,
    toReferenceSeconds as timeToReferenceSeconds
} from "@softwareventures/time";
import type {Comparator} from "@softwareventures/ordered";
import {Comparison} from "@softwareventures/ordered";
import {map, maximum, minimum} from "@softwareventures/iterable";
import {map as mapNullable, notNull} from "@softwareventures/nullable";
import {hasProperty} from "unknown";
import isInteger = require("is-integer");
import isIntegerInRange from "is-integer-in-range";
import {JsDate} from "./js-date";

/** An instant in time, represented as a date and time in the Gregorian
 * Calendar, UTC. */
export interface Timestamp {
    /** Type discriminator identifying the object as a `Timestamp`. */
    readonly type: "timestamp";

    /** The year.
     *
     * Should be an integer.
     *
     * Positive values represent years in the Common Era (CE/AD). For example,
     * `2021` represents 2021 CE, the year this module was first published to
     * npm.
     *
     * Negative values or zero represent years before the Common Era (BCE/BC).
     * Zero represents 1 BCE, `-1` represents 2 BCE, `-2` represents 3 BCE, and
     * so on.
     *
     * Note that there is no year zero in the Gregorian Calendar. The year 1
     * BCE was immediately followed by 1 CE.
     *
     * @default 1 */
    readonly year: number;

    /** The month of the year. Should be an integer in the range `1`-`12`.
     *
     * @default 1 */
    readonly month: number;

    /** The day of the month. Should be an integer in the range `1`-`31`.
     *
     * @default 1 */
    readonly day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range `0`-`23`.
     *
     * @default 0 */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range `0`-`59`.
     *
     * @default 0 */
    readonly minutes: number;

    /** The seconds component of the time of day. Should be in the range `0`-`60`,
     * inclusive of `0` but exclusive of `60`. May be fractional to represent an
     * instant in time with sub-second accuracy.
     *
     * @default 0 */
    readonly seconds: number;
}

/** Options for creating a `Timestamp`.
 *
 * An instance of {@link Timestamp} may always be used in place of
 * `TimestampOptions`. */
export type TimestampOptions = Partial<Timestamp>;

/** The numeric representation of the month of January. */
export const JANUARY = date.JANUARY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of February. */
export const FEBRUARY = date.FEBRUARY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of March. */
export const MARCH = date.MARCH; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of April. */
export const APRIL = date.APRIL; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of May. */
export const MAY = date.MAY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of June. */
export const JUNE = date.JUNE; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of July. */
export const JULY = date.JULY; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of August. */
export const AUGUST = date.AUGUST; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of September. */
export const SEPTEMBER = date.SEPTEMBER; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of October. */
export const OCTOBER = date.OCTOBER; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of November. */
export const NOVEMBER = date.NOVEMBER; // eslint-disable-line @typescript-eslint/naming-convention

/** The numeric representation of the month of December. */
export const DECEMBER = date.DECEMBER; // eslint-disable-line @typescript-eslint/naming-convention

/** Returns `true` if the specified value has the shape of a {@link Timestamp}
 * object.
 *
 * The `year`, `month`, `day`, `hours`, and `minutes` fields may be
 * non-integers or outside the valid range, meaning that the object may not
 * represent a valid timestamp.
 *
 * The `seconds` field may be non-finite, meaning that the object may not
 * represent a valid timestamp. */
export function isTimestamp(value: unknown): value is Timestamp {
    return (
        typeof value === "object" &&
        value != null &&
        hasProperty(value, "type") &&
        value.type === "timestamp" &&
        hasProperty(value, "year") &&
        typeof value.year === "number" &&
        hasProperty(value, "month") &&
        typeof value.month === "number" &&
        hasProperty(value, "day") &&
        typeof value.day === "number" &&
        hasProperty(value, "hours") &&
        typeof value.hours === "number" &&
        hasProperty(value, "minutes") &&
        typeof value.minutes === "number" &&
        hasProperty(value, "seconds") &&
        typeof value.seconds === "number"
    );
}

/** Tests if the specified value is a {@link Timestamp} object representing a
 * valid timestamp.
 *
 * Returns `true` if the value has the shape of a `Timestamp` object, the
 * `year`, `month`, `day`, `hours` and `minutes` fields are all integers inside
 * the valid range, and the `seconds` field is a finite number inside the valid
 * range.
 *
 * {@link Timestamp}s returned by functions in this library are always valid. */
export function isValidTimestamp(value: unknown): value is Timestamp {
    return isTimestamp(value) && isValid(value);
}

/** Tests if the specified {@link Timestamp} object represents a valid
 * timestamp.
 *
 * Returns `true` if the `year`, `month`, `day`, `hour`, and `minute` fields
 * are all integers inside the valid range, and the `seconds` field is a finite
 * number inside the valid range.
 *
 * {@link Timestamp}s returned by functions in this library are always valid. */
export function isValid(timestamp: TimestampOptions): boolean {
    const year = timestamp.year ?? 1;
    const month = timestamp.month ?? 1;
    const day = timestamp.day ?? 1;
    const hours = timestamp.hours ?? 0;
    const minutes = timestamp.minutes ?? 0;
    const seconds = timestamp.seconds ?? 0;

    return (
        (!hasProperty(timestamp, "type") || timestamp.type === "timestamp") &&
        isInteger(year) &&
        isIntegerInRange(month, JANUARY, DECEMBER) &&
        isIntegerInRange(day, 1, daysInMonth(month, year)) &&
        isIntegerInRange(hours, 0, 23) &&
        isIntegerInRange(minutes, 0, 59) &&
        seconds >= 0 &&
        seconds < 60
    );
}

/** Tests if the specified {@link Timestamp} object represents a valid
 * timestamp.
 *
 * Returns `true` if the `year`, `month`, `day`, `hour`, and `minute` fields
 * are all integers inside the valid range, and the `seconds` field is a finite
 * number inside the valid range.
 *
 * Alias of {@link isValid}, useful for disambiguation from similar functions
 * that operate on other types.
 *
 * {@link Timestamp}s returned by functions in this library are always valid. */
export const isTimestampValid = isValid;

/** Asserts that the specified {@link Timestamp} object represents a valid
 * timestamp.
 *
 * {@link Timestamp}s returned by functions in this library are always valid.
 *
 * @throws {Error} if any of the `year`, `month`, `day`, `hours`, or `minutes`
 * fields are non-integers or outside the valid range, or if the `seconds`
 * field is non-finite or outside the valid range. */
export function validate(timestamp: TimestampOptions): void {
    if (!isValid(timestamp)) {
        throw new Error("Invalid timestamp");
    }
}

/** Asserts that the specified {@link Timestamp} object represents a valid
 * timestamp.
 *
 * {@link Timestamp}s returned by functions in this library are always valid.
 *
 * Alias of {@link validate}, useful for disambiguation from similar functions
 * that operate on other types.
 *
 * @throws {Error} if any of the `year`, `month`, `day`, `hours`, or `minutes`
 * fields are non-integers or outside the valid range, or if the `seconds`
 * field is non-finite or outside the valid range. */
export const validateTimestamp = validate;

/** Constructs a normalized {@link Timestamp} object from the specified options.
 *
 * If the `month`, `day`, `hour`, `minute` or `seconds` fields are outside the
 * valid range, then they will roll over into the next minute, hours, day,
 * month or year. */
export function timestamp(options: TimestampOptions): Timestamp {
    return fromReferenceSeconds(toReferenceSeconds(options));
}

export function fromJsDate(date: JsDate): Timestamp {
    return timestamp({
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hours: date.getUTCHours(),
        minutes: date.getUTCMinutes(),
        seconds: date.getUTCSeconds() + date.getUTCMilliseconds() / 1000
    });
}

/** Normalizes the specified {@link Timestamp} object so that it represents a
 * valid timestamp.
 *
 * If the `month`, `day`, `hour`, `minute` or `seconds` fields are outside the
 * valid range, then they will roll over into the next minute, hours, day,
 * month or year.
 *
 * Alias of {@link timestamp}. Calling the function by this name instead might
 * make code clearer in cases where the purpose is to normalize an existing
 * `Timestamp` object. */
export const normalize = timestamp;

/** Normalizes the specified {@link Timestamp} object so that it represents a
 * valid timestamp.
 *
 * If the `month`, `day`, `hour`, `minute` or `seconds` fields are outside the
 * valid range, then they will roll over into the next minute, hours, day,
 * month or year.
 *
 * Alias of {@link timestamp}. Calling the function by this name instead might
 * make code clearer in cases where the purpose is to normalize an existing
 * `Timestamp` object. */
export const normalizeTimestamp = timestamp;

/** Converts the specified {@link Timestamp} to a count of seconds since the
 * reference Timestamp of midnight on the morning of 1st January, 1 CE. */
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

/** Converts the specified {@link Timestamp} to a count of seconds since
 * the reference timestamp of midnight on the morning of 1st January, 1 CE.
 *
 * Alias of {@link toReferenceSeconds}, useful for disambiguation from similar
 * functions that operate on other types. */
export const timestampToReferenceSeconds = toReferenceSeconds;

/** Creates a {@link Timestamp} corresponding to the specified count of seconds
 * since the reference Timestamp of midnight on the morning of 1st January,
 * 1 CE. */
export function fromReferenceSeconds(referenceSeconds: number): Timestamp {
    const referenceDays = Math.floor(referenceSeconds / 86400);
    const {year, month, day} = fromReferenceDays(referenceDays);
    const {hours, minutes, seconds} = timeFromReferenceSeconds(
        referenceSeconds - referenceDays * 86400
    );
    return {type: "timestamp", year, month, day, hours, minutes, seconds};
}

/** Creates a {@link Timestamp} corresponding to the specified count of seconds
 * since the reference Timestamp of midnight on the morning of 1st January,
 * 1 CE.
 *
 * Alias of {@link fromReferenceSeconds}, useful for disambiguation from
 * similar functions that operate on other types. */
export const timestampFromReferenceSeconds = fromReferenceSeconds;

/** Returns `true` if `a` and `b` refer to the same timestamp. */
export function equal(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) === toReferenceSeconds(b);
}

/** Returns `true` if `a` and `b` refer to the same timestamp.
 *
 * Curried variant of {@link equal}. */
export function equalFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => equal(a, b);
}

/** Tests if two {@link Timestamp}s are not equal. */
export function notEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) !== toReferenceSeconds(b);
}

/** Tests if two {@link Timestamp}s are not equal. */
export function notEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => notEqual(a, b);
}

/** Compares two {@link Timestamp}s. */
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

/** Compares two {@link Timestamp}s. */
export function compareFn(b: TimestampOptions): (a: TimestampOptions) => Comparison {
    return a => compare(a, b);
}

/** Tests if the {@link Timestamp} `a` is before the {@link Timestamp} `b`. */
export function before(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) < toReferenceSeconds(b);
}

/** Tests if the {@link Timestamp} `a` is before the {@link Timestamp} `b`. */
export function beforeFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => before(a, b);
}

/** Tests if the {@link Timestamp} `a` is before or equal to the
 * {@link Timestamp} `b`. */
export function beforeOrEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) <= toReferenceSeconds(b);
}

/** Tests if the {@link Timestamp} `a` is before or equal to the
 * {@link Timestamp} `b`. */
export function beforeOrEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => beforeOrEqual(a, b);
}

/** Tests if the {@link Timestamp} `a` is after the {@link Timestamp} `b`. */
export function after(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) > toReferenceSeconds(b);
}

/** Tests if the {@link Timestamp} `a` is after the {@link Timestamp} `b`. */
export function afterFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => after(a, b);
}

/** Tests if the {@link Timestamp} `a` is after or equal to the
 * {@link Timestamp} `b`. */
export function afterOrEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) >= toReferenceSeconds(b);
}

/** Tests if the {@link Timestamp} `a` is after or equal to the {@link Timestamp} `b`. */
export function afterOrEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => afterOrEqual(a, b);
}

/** Returns the earliest of the specified {@link Timestamp}s. */
export function earliest<T extends TimestampOptions>(timestamps: Iterable<T>): Timestamp | null {
    return mapNullable(minimum(map(timestamps, toReferenceSeconds)), fromReferenceSeconds);
}

/** Returns the earliest of the specified {@link Timestamp}s. */
export function earliestFn(b: TimestampOptions): (a: TimestampOptions) => Timestamp {
    const bs = toReferenceSeconds(b);
    return a => {
        const as = toReferenceSeconds(a);
        return bs < as ? fromReferenceSeconds(bs) : fromReferenceSeconds(as);
    };
}

/** Returns the latest of the specified {@link Timestamp}s. */
export function latest<T extends TimestampOptions>(timestamps: Iterable<T>): Timestamp | null {
    return mapNullable(maximum(map(timestamps, toReferenceSeconds)), fromReferenceSeconds);
}

/** Returns the latest of the specified {@link Timestamp}s. */
export function latestFn(b: TimestampOptions): (a: TimestampOptions) => Timestamp {
    const bs = toReferenceSeconds(b);
    return a => {
        const as = toReferenceSeconds(a);
        return bs > as ? fromReferenceSeconds(bs) : fromReferenceSeconds(as);
    };
}

/** Creates a {@link Timestamp} of the current time and date. */
export function now(): Timestamp {
    return fromJsDate(new JsDate());
}

/** Parses a {@link Timestamp} from text in ISO 8601 format.
 *
 * The ISO 8601 text must specify a time zone offset, which should usually be
 * `Z` for UTC. If any other offset is specified then the date and time will
 * be converted to and stored as UTC.
 *
 * If the specified text is not a valid ISO 8601 date-time then this function
 * returns `null`.
 *
 * Both extended `YYYY-MM-DDTHH:MM:SS.ssss+hh:mm` and basic
 * `YYYYMMDDTHHMMSS.ssss+hhmm` ISO 8601 formats are accepted. */
export function parseIso8601(text: string): Timestamp | null {
    const match =
        /^([+-]?\d{4,})-?(\d{2})-?(\d{2})T(\d{2}):?(\d{2}):?(\d{2}(?:[.,]?\d+)?)(?:Z|([+-][0-9]{2}):?([0-9]{2}))$/iu.exec(
            text
        );
    if (match == null) {
        return null;
    }

    const offsetHours = match[7] == null ? 0 : parseInt(match[7], 10);
    const offsetMinutes = match[8] == null ? 0 : parseInt(match[8], 10) * Math.sign(offsetHours);

    const year = parseInt(notNull(match[1]), 10);
    const month = parseInt(notNull(match[2]), 10);
    const day = parseInt(notNull(match[3]), 10);
    const hours = parseInt(notNull(match[4]), 10) - offsetHours;
    const minutes = parseInt(notNull(match[5]), 10) - offsetMinutes;
    const seconds = parseFloat(notNull(match[6]).replace(",", "."));

    return timestamp({year, month, day, hours, minutes, seconds});
}

/** Formats the specified {@link Timestamp} as IS0 8601 extended, rounded down
 * to the next lower second e.g. `2021-05-01T11:57:23Z`.
 *
 * For other formats, see @softwareventures/format-timestamp. */
export const formatIso8601 = format.iso8601;
