import test from "ava";
import {dayOfWeek, formatIso8601, parseIso8601, timestamp} from "./index";

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

test("formatIso8601", t => {
    t.is(
        formatIso8601({year: 2021, month: 4, day: 30, hours: 13, minutes: 11, seconds: 27.25}),
        "2021-04-30T13:11:27.25Z"
    );
    t.is(formatIso8601({year: 10000}), "10000-01-01T00:00:00Z");
    t.is(
        formatIso8601({year: 1994, month: 11, day: 5, hours: 13, minutes: 15, seconds: 30}),
        "1994-11-05T13:15:30Z"
    );
});

test("dayOfWeek", t => {
    t.is(dayOfWeek({year: 2021, month: 3, day: 29}), "Monday");
    t.is(dayOfWeek({year: 2021, month: 3, day: 30}), "Tuesday");
    t.is(dayOfWeek({year: 2021, month: 3, day: 31}), "Wednesday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 1}), "Thursday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 2}), "Friday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 23}), "Friday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 24}), "Saturday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 25}), "Sunday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 26}), "Monday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 27}), "Tuesday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 28}), "Wednesday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 29}), "Thursday");
    t.is(dayOfWeek({year: 2021, month: 4, day: 30}), "Friday");
});
