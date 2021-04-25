import {fromReferenceDays, toReferenceDays} from "@softwareventures/date";
import {
    fromReferenceSeconds as timeFromReferenceSeconds,
    toReferenceSeconds as timeToReferenceSeconds
} from "@softwareventures/time/time";
import {Comparator, Comparison} from "@softwareventures/ordered";

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
