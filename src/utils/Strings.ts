export function matchAll(text: string, regExp: RegExp): RegExpMatchArray[] {
    const checkRegExpNonGlobal = new RegExp(regExp.source, regExp.flags.replace("g", ""));
    const checkRegExpGlobal = new RegExp(regExp.source, `${checkRegExpNonGlobal.flags}g`);

    const matchAll: RegExpMatchArray[] = [];
    const results = text.match(checkRegExpGlobal);

    if (results === null) {
        return [];
    }

    for (const result of results) {
        const nextResult = result.match(checkRegExpNonGlobal);

        if (!nextResult) continue;

        matchAll.push(nextResult);
    }

    return matchAll;
}