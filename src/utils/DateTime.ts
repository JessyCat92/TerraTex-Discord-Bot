import {matchAll} from "./Strings";

export interface CalcDateOps {
    /**
     * Timestring like 1w2h3m
     * years    y
     * months    M
     * weeks    w
     * days    d
     * hours    h
     * minutes    m
     * seconds    s
     */
    timeString: string,

    /**
     * Operations:
     * - add
     * - sub
     * default: add
     */
    operation?: string;
}

/**
 * Calculate Date based on a timeString
 * @param date
 * @param opts
 * @return resultDate
 */
export function calcDate(date: Date, opts: CalcDateOps): Date {
    const calcTime = parseTimeString(opts.timeString) * 1000;
    const baseDateTime = date.getTime();

    if (!opts.operation || opts.operation === "add") {
        return new Date(calcTime + baseDateTime);
    } else {
        return new Date(baseDateTime - calcTime);
    }
}

/**
 * years    y
 * months    M
 * weeks    w
 * days    d
 * hours    h
 * minutes    m
 * seconds    s
 * @param timeString
 * @return seconds
 */
export function parseTimeString(timeString: string): number {
    const regexp = /(?<time>[0-9]+)(?<unit>[yMwdhms])/;
    const extendedRegExp = /^((?<time>[0-9]+)(?<unit>[yMwdhms]))+$/;

    if (!extendedRegExp.test(timeString)) {
        throw new Error(`'${timeString}' is not a timeString`);
    }

    const matches = matchAll(timeString, regexp);
    let time = 0;
    for (const m of matches) {
        if (!m.groups || !m.groups.time || !m.groups.unit) continue;
        time += parseInt(m.groups.time, 10) * getTimeGroupInSeconds(m.groups.unit);
    }

    return time;
}

/**
 *
 * @param base
 * @param groupIdentifier can be:
 * years    y
 * months    M
 * weeks    w
 * days    d
 * hours    h
 * minutes    m
 * seconds    s
 */
export function getTimeGroupInSeconds(groupIdentifier: string): number {
    const daysToSeconds = 24 * 60 * 60;

    switch (groupIdentifier) {
        case "y": return 365 * daysToSeconds;
        case "M": return 30 * daysToSeconds;
        case "w": return 7 * daysToSeconds;
        case "d": return daysToSeconds;
        case "h": return 60 * 60;
        case "m": return 60;
        case "s": return 1;
        default: throw new Error(`unknown time string group identifier ${groupIdentifier}`);
    }
}