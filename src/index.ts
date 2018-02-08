import * as difflib from "difflib";
import { xml, json } from "vkbeautify";
import X2JS = require("x2js");
import "./overrideconsole";

let current_snapshot_object: { [key: string]: string } = {};
export function registerSnapshots(snapshot_object: { [key: string]: string }, name: string)
{
    current_snapshot_object = snapshot_object;
    current_suite = new AutoSnapshotSuite(current_level, name);
}

class AutoSnapshot
{
    public key: string;
    public text: string;
    public diff: Array<string>;
}

let auto_snapshot_siute_history = new Array<AutoSnapshotSuite>();
class AutoSnapshotSuite
{
    public snapshots = Array<AutoSnapshot>();
    public level = 0;
    private fail_counter_for_autosnapshot = 0;
    private last_automagic_snapshot_spec = "";
    private last_automagic_snapshot_number = 0;
    private name: string;

    constructor(snapshot_level: number, suite_name: string)
    {
        this.level = snapshot_level;
        this.name = suite_name;
    }

    public getSnapshotAutomagically_saveActual(actual: string): string
    {
        let auto_snapshot = new AutoSnapshot();

        if (current_spec === this.last_automagic_snapshot_spec)
        {
            this.last_automagic_snapshot_number++;
        }
        else
        {
            this.last_automagic_snapshot_number = 1;
            this.last_automagic_snapshot_spec = current_spec;
        }

        auto_snapshot.key = create_one_liner(`${current_spec} ${this.last_automagic_snapshot_number}`);
        auto_snapshot.text = create_one_liner(actual);
        this.snapshots.push(auto_snapshot);

        let snapshot = current_snapshot_object[auto_snapshot.key];
        return snapshot ? snapshot : "";
    }

    public hasFailure(): boolean
    {
        return this.fail_counter_for_autosnapshot > 0;
    }

    public reportFailure(diff: Array<string>)
    {
        this.snapshots[this.snapshots.length - 1].diff = diff;
        this.fail_counter_for_autosnapshot++;
    }

    public getText(): string
    {
        let snapshot_file_text = "\n**** If actual is valid, update your snapshot with the following ****\n{";

        let has_snapshots = false;

        for (let snapshot of this.snapshots)
        {
            has_snapshots = true;
            snapshot_file_text += `\n\t"${snapshot.key}": \`${snapshot.text}\`,`;
        }

        if (has_snapshots)
        {
            snapshot_file_text = snapshot_file_text.slice(0, snapshot_file_text.length - 1);
            snapshot_file_text += "\n}\n\n";
        }

        return snapshot_file_text;
    }

    public pushToHistory()
    {
        auto_snapshot_siute_history.push(this);
    }

    public getHTML(): string
    {
        document.body.style.fontFamily = "Courier New";
        document.body.style.whiteSpace = "nowrap";
        if (!this.name) { throw "name not defined for snapshot suite"; }

        if (!this.hasFailure())
        {
            return `<p style="color: green; font-size: 25px; font-weight: bold;">===Auto snapshot suite, ${this.name}, has no problems!===</p>`;
        }

        let snapshot_file_html = `<p style="color: red; font-size: 25px; font-weight: bold;">===Suite, ${this.name}, had problems===</p>`;

        this.snapshots.forEach((snapshot) =>
        {
            if (snapshot.diff)
            {
                snapshot_file_html += `<div>>Test: "${snapshot.key}" did not match the snapshot:</div><br //>`;
                snapshot.diff.forEach((d) =>
                {
                    if (d.length >= 3 && (d.slice(0, 3) === "---" || d.slice(0, 3) === "+++") || d.slice(0, 2) === "@@")
                    {
                        return;
                    }
                    else if (d.charAt(0) === "-")
                    {
                        snapshot_file_html += `<span style="color: red">${d.replace(/&nbsp;/g, "&amp;nbsp;").replace(/ /g, "&nbsp;")}</span><br //>`;
                    }
                    else if (d.charAt(0) === "+")
                    {
                        snapshot_file_html += `<span style="color: green">${d.replace(/&nbsp;/g, "&amp;nbsp;").replace(/ /g, "&nbsp;")}</span><br //>`;
                    }
                    else
                    {
                        snapshot_file_html += `${d.replace(/&nbsp;/g, "&amp;nbsp;").replace(/ /g, "&nbsp;")}<br //>`;
                    }
                });
            }
        });

        snapshot_file_html += `<p style="text-decoration: underline; font-weight: bold;">If actual is valid, update your snapshot with the following <//p>`;
        snapshot_file_html += "<div style='color: blue;'>{";

        let has_snapshots = false;

        for (let snapshot of this.snapshots)
        {
            has_snapshots = true;
            snapshot_file_html += `<br //>&nbsp;&nbsp;&nbsp;&nbsp;"${snapshot.key}": \`${snapshot.text.replace(/&nbsp;/g, "&amp;nbsp;")}\`,`;
        }

        if (has_snapshots)
        {
            snapshot_file_html = snapshot_file_html.slice(0, snapshot_file_html.length - 1);
            snapshot_file_html += "<br //>}</div></p>";
        }

        return snapshot_file_html;
    }
}

/************ Jasmine Reporter ************/

let current_suite: AutoSnapshotSuite | null;
let current_spec = "";
let current_level = 0;
jasmine.getEnv().addReporter({
    suiteStarted: function (result)
    {
        current_level++;
    },
    specStarted: function (result)
    {
        current_spec = result.fullName;
    },
    suiteDone: function (result)
    {
        current_level--;

        if (current_suite && current_level < current_suite.level)
        {
            if (current_suite.hasFailure)
            {
                // console.error(current_suite.getText());
            }

            current_suite.pushToHistory();
            current_suite = null;
        }
    },
    jasmineDone: function (results)
    {
        if (current_suite)
        {
            if (current_suite.hasFailure)
            {
                // console.error(current_suite.getText());
            }

            current_suite.pushToHistory();
            current_suite = null;
        }

        if (auto_snapshot_siute_history.length === 0)
        {
            return;
        }

        let html_summary = auto_snapshot_siute_history.reduce(
            (prev_html, curr_suite) =>
            {
                return prev_html + "<br //>" + curr_suite.getHTML();
            }, "");

        document.body.innerHTML = html_summary + document.body.innerHTML;
    }
});

/*************** Matching logic ***************/

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

        if (automagic)
        {
            if (!current_suite) { throw "autoagic snapshot with no registered snapshot object"; }

            current_suite.reportFailure(diff);
        }

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
    let one_line_actual = actual.replace(/\n/g, "").replace(/\t/g, "").replace(/\\"/g, `\\\\\\"`);
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
            if (!current_suite) { throw "Use of autosnapshot without registering snapshot object"; }

            use_autosnapshot = true;
            let auto_snapshot = current_suite.getSnapshotAutomagically_saveActual(prettyActual);
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
