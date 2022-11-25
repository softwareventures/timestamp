import test from "ava";
import {JsDate} from "./js-date";
import {fromJsDate, parseIso8601, timestamp} from "./index";

test("fromJsDate", t => {
    const a = new JsDate();
    a.setUTCFullYear(2021, 3, 30);
    a.setUTCHours(13, 11, 27, 245);
    t.deepEqual(
        fromJsDate(a),
        timestamp({year: 2021, month: 4, day: 30, hours: 13, minutes: 11, seconds: 27.245})
    );

    const b = new JsDate();
    b.setUTCFullYear(10000, 0, 1);
    b.setUTCHours(0, 0, 0, 0);
    t.deepEqual(
        fromJsDate(b),
        timestamp({year: 10000, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0})
    );

    t.deepEqual(
        fromJsDate(new JsDate("1994-11-05T08:15:30-05:00")),
        timestamp({year: 1994, month: 11, day: 5, hours: 13, minutes: 15, seconds: 30})
    );
});

test("parseIso8601", t => {
    t.deepEqual(
        parseIso8601("2021-04-30T13:11:27.245Z"),
        timestamp({year: 2021, month: 4, day: 30, hours: 13, minutes: 11, seconds: 27.245})
    );
    t.deepEqual(parseIso8601("10000-01-01T00:00:00Z"), timestamp({year: 10000}));
    t.deepEqual(
        parseIso8601("1994-11-05T08:15:30-05:00"),
        timestamp({
            year: 1994,
            month: 11,
            day: 5,
            hours: 13,
            minutes: 15,
            seconds: 30
        })
    );
});
