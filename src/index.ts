import difflib from "difflib";
import { xml, json } from "vkbeautify";
import { parseString } from "xml2js";

/**
 * Add more entries to this array if you have other exclusions for snapshot checks
 */
export let KeyExceptionList = ["typeof"];

export let ResetExceptionList = () =>
{
    KeyExceptionList = ["typeof"];
};

declare var console;

export let MatchesSnapshot = (snapshot: string, actual: string) =>
{
    if (actual !== snapshot)
    {
        let diff: string[] = difflib.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        diff.forEach(d => console.error(d));

        fail("See diff above. Consider updating snapshot (if valid) to:\n\n" + actual);
    }
};

function getJSFromXML(xml: string)
{
    return new Promise<object>((resolve, reject) =>
    {
        parseString(xml, { async: true }, (err: any, result: any) =>
        {
            resolve(result);
        });
    });
}

async function returnJSFromXMLAsync(xml: string)
{
    let js_promise = getJSFromXML(xml);
    let js_object = await js_promise;
    return js_object;
}

/**
 * compares an HTML or XML values to a snapshot
 * @param snapshot the snapshot to compare the actual to
 * @param actual the actual xml/html string to compare to the snapshot
 */
export async function MatchesXMLSnapshot(snapshot: string, actual: string)
{
    let jsXML = await returnJSFromXMLAsync(actual);
    MatchesJSSnapshot(snapshot, jsXML);
}

/**
 * compares a snapshot to a json string
 * @param snapshot the snapshot to compare the actual to
 * @param actual the json string to compare to the snapshot
 */
export let MatchesJSONSnapshot = (snapshot: string, actual: string) =>
{
    let prettyActual = json(actual);
    let prettySnapshot = json(snapshot);

    MatchesSnapshot(prettySnapshot, prettyActual);
};

let parsed_values = new Array<object>();
let IsCurcularDependency = (value: any) =>
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

    return allKeys;
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
export let MatchesJSSnapshot = (snapshot: string, actual: any) =>
{
    parsed_values = new Array<object>();
    let prettyActual = json(orderedStringifyAndClean(actual));
    let prettySnapshot = json(snapshot);

    MatchesSnapshot(prettySnapshot, prettyActual);
};
