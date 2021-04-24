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
     * BCE was immediately followed by 1 CE. */
    readonly year: number;

    /** The month of the year. Should be an integer in the range 1-12. */
    readonly month: number;

    /** The day of the month. Should be an integer in the range 1-31. */
    readonly day: number;

    /** The hours component of the time of day. Should be an integer in the
     * range 0-23. */
    readonly hours: number;

    /** The minutes component of the time of day. Should be an integer in the
     * range 0-59. */
    readonly minutes: number;

    /** The seconds component of the time of day. Should be in the range 0-60,
     * inclusive of 0 but exclusive of 60. May be fractional to represent an
     * instant in time with sub-second accuracy. */
    readonly seconds: number;
}
