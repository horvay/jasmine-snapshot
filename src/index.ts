import difflib from "difflib";
import { xml, json } from "vkbeautify";
import X2JS = require("x2js");

/**
 * Add more entries to this array if you have other exclusions for snapshot checks
 */
export let KeyExceptionList = ["typeof"];

export function ResetExceptionList()
{
    KeyExceptionList = ["typeof"];
}

declare var console;

export function MatchesSnapshot(snapshot: string, actual: string)
{
    if (actual !== snapshot)
    {
        let diff: string[] = difflib.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        let diff_string = "\n*************************************************************\n";
        diff_string += "* Snapshot did not match Actual. Here is the diff ***********\n";
        diff_string += "*************************************************************\n\n";
        diff.forEach(d => diff_string += d + "\n");
        diff_string += "\n";

        let one_line_actual = actual.replace(/\n/g, "").replace(/\t/g, "");
        while (one_line_actual.indexOf("  ") !== -1)
        {
            one_line_actual = one_line_actual.replace(/(  )/g, " ");
        }

        diff_string += "*************************************************************\n";
        diff_string += "* If the Actual is valid, update the snapshot with this     *\n";
        diff_string += "*************************************************************\n\n";
        diff_string += ` ----- Formatted ------\n${actual}\n\n ----- Single Line ------\n${one_line_actual}`;

        console.error(diff_string);

        fail(`Actual does not match snapshot. See above. `);
    }
};

/**
 * compares an HTML or XML values to a snapshot
 * @param snapshot the snapshot to compare the actual to
 * @param actual the actual xml/html string to compare to the snapshot
 */
export function MatchesXMLSnapshot(snapshot: string, actual: string)
{
    const X2JS2 = X2JS as any; // don't hate me, their typings suck
    const x2js = new X2JS2();

    let js_actual = x2js.xml2js(actual);
    MatchesJSSnapshot(snapshot, js_actual);
}

/**
 * compares a snapshot to a json string
 * @param snapshot the snapshot to compare the actual to
 * @param actual the json string to compare to the snapshot
 */
export function MatchesJSONSnapshot(snapshot: string, actual: string)
{
    let prettyActual = actual ? json(actual) : actual;
    let prettySnapshot = snapshot ? json(snapshot) : snapshot;

    MatchesSnapshot(prettySnapshot, prettyActual);
};

let parsed_values = new Array<object>();
function IsCurcularDependency(value: any)
{
    if (typeof value === "object" && value)
    {
        if (parsed_values.indexOf(value) === -1)
        {
            parsed_values.push(value);
            return false;
        }
        else
        {
            return true;
        }
    }

    return false;
};

function collectAllKeys(js_object: any)
{
    const allKeys = new Array<string>();

    JSON.stringify(js_object, (key: string, val: any) =>
    {
        if (isIEPooOrCurcularReferences(key, val))
        {
            return;
        }

        allKeys.push(key);
        return val;
    });

    return allKeys.sort((a: string, b: string) => (a > b) ? 1 : -1);
}

function isIEPooOrCurcularReferences(key, value)
{
    if (typeof key === "string" && KeyExceptionList.some((ex) => key.indexOf(ex) !== -1))
    {
        return true;
    }
    else if (IsCurcularDependency(value))
    {
        return true;
    }

    return false;
}

function orderedStringifyAndClean(js_object: any)
{
    let keys = collectAllKeys(js_object);
    return JSON.stringify(js_object, keys);
}

/**
 * Compares the snapshot to the actual option. Note this method will stringify
 * the actual value for the snnapshot compare and remove any key/values that contain the
 * strings in the KeyExceptionList
 * @param snapshot the snapshot to compare the actual to
 * @param actual The actual JS object to compare to the snapshot
 */
export function MatchesJSSnapshot(snapshot: string, actual: any)
{
    parsed_values = new Array<object>();
    let prettyActual = actual ? json(orderedStringifyAndClean(actual)) : actual;
    let prettySnapshot = snapshot ? json(snapshot) : snapshot;

    MatchesSnapshot(prettySnapshot, prettyActual);
};
