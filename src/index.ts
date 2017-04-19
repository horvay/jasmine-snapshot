import difflib from "difflib";
import { xml, json } from "vkbeautify";

// Add more entries to this array if you have other exclusions for snapshot checks
export let KeyExceptionList = ["typeof"];

export let MatchesSnapshot = (snapshot: string, actual: string) =>
{
    if (actual !== snapshot)
    {
        let diff: string[] = difflib.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        diff.forEach(d => console.error(d));

        fail("See diff above. Consider updating snapshot (if valid) to:\n\n" + actual);
    }
};

/**
 * compares an HTML or XML values to a snapshot
 * @param snapshot the snapshot to compare the actual to
 * @param actual the actual xml/html string to compare to the snapshot
 */
export let MatchesXMLSnapshot = (snapshot: string, actual: string) =>
{
    let prettyActual = xml(actual);
    let prettySnapshot = xml(snapshot);

    MatchesSnapshot(prettySnapshot, prettyActual);
};

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

/**
 * Compares the snapshot to the actual option. Note this method will stringify
 * the actual value for the snnapshot compare and remove any key/values that contain the
 * strings in the KeyExceptionList
 * @param snapshot the snapshot to compare the actual to
 * @param actual The actual JS object to compare to the snapshot
 */
export let MatchesJSSnapshot = (snapshot: string, actual: any) =>
{
    let removeIEPoo = (key, value) => {
        if (typeof key === "string" && key.indexOf("typeof") > 0)
        {
            return undefined;
        }

        return value;
    };

    let prettyActual = json(JSON.stringify(actual, removeIEPoo));
    let prettySnapshot = json(snapshot);

    MatchesSnapshot(prettySnapshot, prettyActual);
};
