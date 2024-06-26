import * as date from "@softwareventures/date";
import {daysInMonth, fromReferenceDays, toReferenceDays} from "@softwareventures/date";
import * as format from "@softwareventures/format-timestamp";
import {
    fromReferenceSeconds as timeFromReferenceSeconds,
    toReferenceSeconds as timeToReferenceSeconds
} from "@softwareventures/time";
import type {Comparator} from "@softwareventures/ordered";
import {Comparison} from "@softwareventures/ordered";
import {notNull} from "@softwareventures/nullable";
import {hasProperty} from "unknown";
import isInteger = require("is-integer");
import isIntegerInRange from "is-integer-in-range";
import {JsDate} from "./js-date";

/** An instant in time, represented as a date and time in the Gregorian
 * Calendar, UTC. */
export interface Timestamp {
    /** Type discriminator identifying the object as a `Timestamp`. */
    readonly type: "Timestamp";

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
     * BCE was immediately followed by 1 CE. */
    readonly year: number;

    /** The month of the year. Should be an integer in the range `1`-`12`. */
    readonly month: number;

    /** The day of the month. Should be an integer in the range `1`-`31`. */
    readonly day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range `0`-`23`. */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range `0`-`59`. */
    readonly minutes: number;

    /** The seconds component of the time of day. Should be in the range `0`-`60`,
     * inclusive of `0` but exclusive of `60`. May be fractional to represent an
     * instant in time with sub-second accuracy. */
    readonly seconds: number;
}

/** Options for creating a `Timestamp`.
 *
 * An instance of {@link Timestamp} may always be used in place of
 * `TimestampOptions`. */
export interface TimestampOptions {
    /** Type discriminator identifying the object as a `Timestamp`.
     *
     * If specified, must be the string `"Timestamp"`. This is to prevent errors
     * caused by a `Timestamp` being accidentally passed to functions that
     * operate on other types. */
    readonly type?: "Timestamp";

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
     * BCE was immediately followed by 1 CE. */
    readonly year: number;

    /** The month of the year. Should be an integer in the range `1`-`12`. */
    readonly month: number;

    /** The day of the month. Should be an integer in the range `1`-`31`. */
    readonly day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range `0`-`23`. */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range `0`-`59`.
     *
     * @default 0 */
    readonly minutes?: number;

    /** The seconds component of the time of day. Should be in the range `0`-`60`,
     * inclusive of `0` but exclusive of `60`. May be fractional to represent an
     * instant in time with sub-second accuracy.
     *
     * @default 0 */
    readonly seconds?: number;
}

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
    return (
        (!hasProperty(timestamp, "type") || timestamp.type === "Timestamp") &&
        isInteger(timestamp.year) &&
        isIntegerInRange(timestamp.month, JANUARY, DECEMBER) &&
        isIntegerInRange(timestamp.day, 1, daysInMonth(timestamp.month, timestamp.year)) &&
        isIntegerInRange(timestamp.hours, 0, 23) &&
        isIntegerInRange(timestamp.minutes ?? 0, 0, 59) &&
        (timestamp.seconds ?? 0) >= 0 &&
        (timestamp.seconds ?? 0) < 60
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
 * month or year.
 *
 * @throws {Error} if any of the numeric fields are non-finite. */
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

export function timestampFromJsDate(date: JsDate): Timestamp {
    return fromJsDate(date);
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
 * `Timestamp` object.
 *
 * @throws {Error} if any of the numeric fields are non-finite. */
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
 * `Timestamp` object.
 *
 * @throws {Error} if any of the numeric fields are non-finite. */
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
 * 1 CE.
 *
 * @throws {Error} if `referenceSeconds` is non-finite. */
export function fromReferenceSeconds(referenceSeconds: number): Timestamp {
    if (!isFinite(referenceSeconds)) {
        throw new Error("Invalid timestamp");
    }
    const referenceDays = Math.floor(referenceSeconds / 86400);
    const {year, month, day} = fromReferenceDays(referenceDays);
    const {hours, minutes, seconds} = timeFromReferenceSeconds(
        referenceSeconds - referenceDays * 86400
    );
    return {type: "Timestamp", year, month, day, hours, minutes, seconds};
}

/** Creates a {@link Timestamp} corresponding to the specified count of seconds
 * since the reference Timestamp of midnight on the morning of 1st January,
 * 1 CE.
 *
 * Alias of {@link fromReferenceSeconds}, useful for disambiguation from
 * similar functions that operate on other types.
 *
 * @throws {Error} if `referenceSeconds` is non-finite. */
export const timestampFromReferenceSeconds = fromReferenceSeconds;

/** Returns `true` if `a` and `b` refer to the same timestamp. */
export function equal(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) === toReferenceSeconds(b);
}

/** Returns `true` if `a` and `b` refer to the same timestamp.
 *
 * Alias of {@link equal}, for disambiguation from other equality functions. */
export const timestampsEqual = equal;

/** Returns `true` if `a` and `b` refer to the same timestamp.
 *
 * Curried variant of {@link equal}. */
export function equalFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => equal(a, b);
}

/** Returns `true` if `a` and `b` refer to the same timestamp.
 *
 * Curried variant of {@link timestampsEqual}. */
export const timestampsEqualFn = equalFn;

/** Returns `true` if `a` and `b` refer to a different timestamp. */
export function notEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) !== toReferenceSeconds(b);
}

/** Returns `true` if `a` and `b` refer to a different timestamp.
 *
 * Alias of {@link notEqual}, for disambiguation from other inequality
 * functions. */
export const timestampsNotEqual = notEqual;

/** Returns `true` if `a` and `b` refer to a different timestamp.
 *
 * Curried variant of {@link notEqual}. */
export function notEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => notEqual(a, b);
}

/** Returns `true` if `a` and `b` refer to a different timestamp.
 *
 * Curried variant of {@link timestampsNotEqual}. */
export const timestampsNotEqualFn = notEqualFn;

/** Compares two {@link Timestamp}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`. */
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

/** Compares two {@link Timestamp}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`.
 *
 * Alias of {@link compare}, useful for disambiguation from other comparison
 * functions. */
export const compareTimestamps = compare;

/** Compares two {@link Timestamp}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`.
 *
 * Curried variant of {@link compare}. */
export function compareFn(b: TimestampOptions): (a: TimestampOptions) => Comparison {
    return a => compare(a, b);
}

/** Compares two {@link Timestamp}s and returns a {@link Comparison} specifying
 * if `a` is before, equal to, or after `b`.
 *
 * Curried variant of {@link compareTimestamps}. */
export const compareTimestampsFn = compareFn;

/** Returns `true` if `a` refers to a timestamp before `b`. */
export function before(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) < toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a timestamp before `b`.
 *
 * Alias of {@link before}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const timestampBefore = before;

/** Returns `true` if `a` refers to a date and time before `b`.
 *
 * Curried variant of {@link before}. */
export function beforeFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => before(a, b);
}

/** Returns `true` if `a` refers to a timestamp before `b`.
 *
 * Curried variant of {@link timestampBefore}. */
export const timestampBeforeFn = beforeFn;

/** Returns `true` if `a` refers to a timestamp before or the same as `b`. */
export function beforeOrEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) <= toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a timestamp before or the same as `b`.
 *
 * Alias of {@link beforeOrEqual}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const timestampBeforeOrEqual = beforeOrEqual;

/** Returns `true` if `a` refers to a timestamp before or the same as `b`.
 *
 * Curried variant of {@link beforeOrEqual}. */
export function beforeOrEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => beforeOrEqual(a, b);
}

/** Returns `true` if `a` refers to a timestamp before or the same as `b`.
 *
 * Curried variant of {@link timestampBeforeOrEqual}. */
export const timestampBeforeOrEqualFn = beforeOrEqualFn;

/** Returns `true` if `a` refers to a timestamp after `b`. */
export function after(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) > toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a timestamp after `b`.
 *
 * Alias of {@link after}, useful for disambiguation from similar functions
 * that operate on other date/time types. */
export const timestampAfter = after;

/** Returns `true` if `a` refers to a date and time after `b`.
 *
 * Curried variant of {@link after}. */
export function afterFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => after(a, b);
}

/** Returns `true` if `a` refers to a timestamp after `b`.
 *
 * Curried variant of {@link timestampAfter}. */
export const timestampAfterFn = afterFn;

/** Returns `true` if `a` refers to a timestamp after or the same as `b`. */
export function afterOrEqual(a: TimestampOptions, b: TimestampOptions): boolean {
    return toReferenceSeconds(a) >= toReferenceSeconds(b);
}

/** Returns `true` if `a` refers to a timestamp after or the same as `b`.
 *
 * Alias of {@link afterOrEqual}, useful for disambiguation from similar
 * functions that operate on other date/time types. */
export const timestampAfterOrEqual = afterOrEqual;

/** Returns `true` if `a` refers to a timestamp after or the same as `b`.
 *
 * Curried variant of {@link afterOrEqual}. */
export function afterOrEqualFn(b: TimestampOptions): (a: TimestampOptions) => boolean {
    return a => afterOrEqual(a, b);
}

/** Returns `true` if `a` refers to a timestamp after or the same as `b`.
 *
 * Curried variant of {@link timestampAfterOrEqual}. */
export const timestampAfterOrEqualFn = afterOrEqualFn;

/** Compares two {@link Timestamp}s and returns the earlier of the two.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export function earliest(a: TimestampOptions, b: TimestampOptions): Timestamp {
    const as = toReferenceSeconds(a);
    const bs = toReferenceSeconds(b);
    return fromReferenceSeconds(as < bs ? as : bs);
}

/** Compares two {@link Timestamp}s and returns the earlier of the two.
 *
 * Alias of {@link earliest}, useful for disambiguation from similar functions
 * that operate on other date/time types.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export const earliestTimestamp = earliest;

/** Compares two {@link Timestamp}s and returns the earlier of the two.
 *
 * Curried variant of {@link earliest}.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export function earliestFn(b: TimestampOptions): (a: TimestampOptions) => Timestamp {
    return a => earliest(a, b);
}

/** Compares two {@link Timestamp}s and returns the earlier of the two.
 *
 * Curried variant of {@link earliestTimestamp}.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export const earliestTimestampFn = earliestFn;

/** Compares two {@link Timestamp}s and returns the later of the two.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export function latest(a: TimestampOptions, b: TimestampOptions): Timestamp {
    const as = toReferenceSeconds(a);
    const bs = toReferenceSeconds(b);
    return fromReferenceSeconds(as > bs ? as : bs);
}

/** Compares two {@link Timestamp}s and returns the later of the two.
 *
 * Alias of {@link latest}, useful for disambiguation from similar functions
 * that operate on other date/time types.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export const latestTimestamp = latest;

/** Returns the latest of the specified {@link Timestamp}s.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export function latestFn(b: TimestampOptions): (a: TimestampOptions) => Timestamp {
    return a => latest(a, b);
}

/** Compares two {@link Timestamp}s and returns the later of the two.
 *
 * Curried variant of {@link latestTimestamp}.
 *
 * @throws {Error} if both specified `Timestamp`s contain numeric fields that
 *   are non-finite. */
export const latestTimestampFn = latestFn;

/** Creates a {@link Timestamp} of the current time and date. */
export function now(): Timestamp {
    return fromJsDate(new JsDate());
}

/** Creates a {@link Timestamp} of the current time and date.
 *
 * Alias of {@link now}, useful for disambiguation from similar functions that
 * operate on other date/time types. */
export const timestampNow = now;

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
 * `YYYYMMDDTHHMMSS.ssss+hhmm` ISO 8601 formats are accepted.
 *
 * As an exception to ISO8601, the `"T"` delimiter between the date and time
 * may be replaced by any sequence of whitespace characters. */
export function parseIso8601(text: string): Timestamp | null {
    const match =
        /^([+-]?\d{4,})-?(\d{2})-?(\d{2})(?:T|\s+)(\d{2}):?(\d{2}):?(\d{2}(?:[.,]?\d+)?)(?:Z|([+-][0-9]{2}):?([0-9]{2}))$/iu.exec(
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
 * `YYYYMMDDTHHMMSS.ssss+hhmm` ISO 8601 formats are accepted.
 *
 * As an exception to ISO8601, the `"T"` delimiter between the date and time
 * may be replaced by any sequence of whitespace characters.
 *
 * Alias of {@link parseIso8601}, useful for disambiguation from similar
 * functions that operate on other date/time types.*/
export const parseTimestampIso8601 = parseIso8601;

/** Formats the specified {@link Timestamp} as IS0 8601 extended, rounded down
 * to the next lower second e.g. `2021-05-01T11:57:23Z`.
 *
 * For other formats, see @softwareventures/format-timestamp. */
export const formatIso8601 = format.iso8601;

/** Formats the specified {@link Timestamp} as IS0 8601 extended, rounded down
 * to the next lower second e.g. `2021-05-01T11:57:23Z`.
 *
 * Alias of {@link formatIso8601}, useful for disambiguation from similar
 * functions that operate on other date/time types.
 *
 * For other formats, see @softwareventures/format-timestamp. */
export const formatTimestampIso8601 = format.iso8601;
