export interface Timestamp {
    readonly type: "timestamp";
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
}
