import difflib from "difflib";
import { xml, json } from "vkbeautify";
import X2JS = require("x2js");

let current_spec = "";
let level = 0;
jasmine.getEnv().addReporter({
    suiteStarted: function (result)
    {
        level++;
    },
    specStarted: function (result)
    {
        current_spec = result.fullName;
    },
    suiteDone: function (result)
    {
        level--;

        if (level < snapshot_level)
        {
            snapshot_level = 0;
            current_snapshot_object = {};
            reportSnapshotFile();
        }
    },
    jasmineDone: function (results)
    {
        if (new_snapshot_object)
        {
            reportSnapshotFile();
        }
    }
});

function reportSnapshotFile()
{
    let snapshot_file_text = "\n**** If actual is valid, update your snapshot with the following ****\n{";

    let has_snapshots = false;
    // tslint:disable-next-line:forin
    for (let snapshot in new_snapshot_object)
    {
        has_snapshots = true;
        snapshot_file_text += `\n\t"${snapshot}": \`${new_snapshot_object[snapshot]}\`,`;
    }

    if (has_snapshots)
    {
        snapshot_file_text = snapshot_file_text.slice(0, snapshot_file_text.length - 1);
        snapshot_file_text += "\n}\n\n";
    }

    console.error(snapshot_file_text);
    new_snapshot_object = {};
}

let current_snapshot_object: { [key: string]: string } = {};
let new_snapshot_object: { [key: string]: string } = {};
let snapshot_level = 0;
export function registerSnapshots(snapshot_object: { [key: string]: string })
{
    current_snapshot_object = snapshot_object;
    snapshot_level = level;
}

let lastAutomagicSnapshot = 0;
function getSnapshotAutomagically_saveActual(actual: string)
{
    let one_line_actual = create_one_liner(actual);

    let snapshot_name = `${current_spec} ${++lastAutomagicSnapshot}`;
    new_snapshot_object[snapshot_name] = one_line_actual;

    let snapshot = current_snapshot_object[snapshot_name];
    return snapshot ? snapshot : "";
}

/**
 * Add more entries to this array if you have other exclusions for snapshot checks
 */
export let KeyExceptionList = ["typeof"];

export function ResetExceptionList()
{
    KeyExceptionList = ["typeof"];
}

declare var console;

export function MatchesSnapshot(snapshot: string, actual: string, automagic?: boolean)
{
    if (actual !== snapshot)
    {
        let diff: string[] = difflib.unifiedDiff(snapshot.split("\n"), actual.split("\n"));
        let diff_string = "\n";
        diff_string += `**** ${current_spec} diff *****\n\n`;

        diff.forEach(d =>
        {
            if (d !== "--- \n" && d !== "+++ \n" &&
            !(d.length > 5 && d.slice(0, 2) === "@@"))
            {
                diff_string += d + "\n";
            }
        });

        diff_string += "\n";

        if (!automagic)
        {
            let one_line_actual = create_one_liner(actual);

            diff_string += "**** If the Actual is valid, update the snapshot with this ****\n";
            diff_string += ` ----- Formatted ------\n${actual}\n\n ----- Single Line ------\n${one_line_actual}`;
        }
        console.error(diff_string);

        fail(`Actual does not match snapshot. See above. `);
    }
}

function create_one_liner(actual: string)
{
    let one_line_actual = actual.replace(/\n/g, "").replace(/\t/g, "");
    while (one_line_actual.indexOf("  ") !== -1)
    {
        one_line_actual = one_line_actual.replace(/(  )/g, " ");
    }

    return one_line_actual;
}

/**
 * compares an HTML or XML values to a snapshot
 * @param snapshot the snapshot to compare the actual to
 * @param actual the actual xml/html string to compare to the snapshot
 */
export function MatchesXMLSnapshot(snapshot: string, actual: string)
{
    expectxml(actual).toMatchSnapshot(snapshot);
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
    expectjs(actual).toMatchSnapshot(snapshot);
}

export function expectjs(actual: Object)
{
    return new SnapshotJSInner(actual);
}

export function expectxml(xml_actual: string)
{
    return new SnapshotXMLInner(xml_actual);
}

abstract class SnapshotInner<T extends Object | string>
{
    protected actual: T;

    constructor(actual: T)
    {
        this.actual = actual;
    }

    public afterApplying(transformFunction: (actual: T) => T)
    {
        this.actual = transformFunction(this.actual);
        return this;
    }
}

export class SnapshotJSInner extends SnapshotInner<Object>
{
    private parsed_values = new Array<object>();

    constructor(actual: Object)
    {
        super(actual);
        this.actual = actual;
    }

    public toMatchSnapshot(snapshot?: string): void
    {
        let prettyActual = this.actual ? json(this.getOrderedStringifyAndClean()) : "";

        let prettySnapshot = snapshot;
        let use_autosnapshot = false;
        if (snapshot === null || snapshot === undefined)
        {
            use_autosnapshot = true;
            let auto_snapshot = getSnapshotAutomagically_saveActual(prettyActual);
            prettySnapshot = auto_snapshot ? json(auto_snapshot) : "";
        }
        else
        {
            prettySnapshot = snapshot ? json(snapshot) : snapshot;
        }

        MatchesSnapshot(prettySnapshot, prettyActual, use_autosnapshot);
    }

    private getOrderedStringifyAndClean()
    {
        let keys = this.collectAllKeysAndRemoveCircular(this.actual);
        return JSON.stringify(this.actual, keys);
    }

    private collectAllKeysAndRemoveCircular(js_object: any)
    {
        const allKeys = new Array<string>();

        let json = JSON.stringify(js_object, (key: string, val: any) =>
        {
            if (this.isIEPooOrCurcularReferences(key, val))
            {
                return;
            }

            allKeys.push(key);
            return val;
        });

        this.actual = JSON.parse(json);

        return allKeys.sort((a: string, b: string) => (a > b) ? 1 : -1);
    }

    private isIEPooOrCurcularReferences(key, value)
    {
        if (typeof key === "string" && KeyExceptionList.some((ex) => key.indexOf(ex) !== -1))
        {
            return true;
        }
        else if (this.IsCurcularDependency(value))
        {
            return true;
        }

        return false;
    }

    private IsCurcularDependency(value: any)
    {
        if (value && typeof value === "object")
        {
            if (this.parsed_values.indexOf(value) === -1)
            {
                this.parsed_values.push(value);
                return false;
            }
            else
            {
                return true;
            }
        }

        return false;
    }
}

export class SnapshotXMLInner extends SnapshotInner<string>
{
    constructor(xml_actual: string)
    {
        super(xml_actual);
        this.actual = xml_actual;
    }

    public toMatchSnapshot(snapshot?: string): void
    {
        const X2JS2 = X2JS as any; // don't hate me, their typings suck
        const x2js = new X2JS2();

        let js_actual = x2js.xml2js(this.actual);
        expectjs(js_actual).toMatchSnapshot(snapshot);
    }
}

let nativeWarn = window.console.warn;
window.console.warn = function ()
{
    if (
        (arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("[xmldom ") !== -1)
    )
    {
        return;
    }
    nativeWarn.apply(window.console, arguments);
};

let nativeError = window.console.error;
window.console.error = function ()
{
    if (
        (arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("entity not found") !== -1)
    )
    {
        return;
    }
    nativeError.apply(window.console, arguments);
};
