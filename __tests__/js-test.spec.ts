import * as difflib from "difflib";
import { MatchesJSSnapshot, KeyExceptionList, ResetExceptionList, expectjs, registerSnapshots } from "../src/index";
import { snapshots } from "./js-test.snapshots";

declare var fail: (message: string) => void;

describe("js test", () =>
{
    let failedCalledAmount = 0;
    let consoleErrorCalled = 0;

    beforeAll(() =>
    {
        fail = (message: string) => failedCalledAmount++;
        let old_console = console.error;
        console.error = (error: string) => { consoleErrorCalled++; old_console(error); };

        registerSnapshots(snapshots, "js-test");
    });

    beforeEach(() =>
    {
        ResetExceptionList();

        failedCalledAmount = 0;
        consoleErrorCalled = 0;
    });

    it("matches for simple object", () =>
    {
        expectjs({ greg: "was here" }).toMatchSnapshot();
        expect(failedCalledAmount).toBe(0);
    });

    it("does not match for empty object", () =>
    {
        expectjs({ greg: "was here" }).toMatchSnapshot(``);
        expect(failedCalledAmount).toBe(1);
    });

    it("removes circular dependency and matches", () =>
    {
        let js_object = { greg: "was here", mom: {} };

        js_object.mom = js_object;

        expectjs(js_object).toMatchSnapshot(`{"greg": "was here"}`);
        expect(failedCalledAmount).toBe(0);
    });

    it("removes key exceptions and matches", () =>
    {
        let js_object = { greg: "was here", mom: { sid: "bad" } };
        KeyExceptionList.push("mom");

        expectjs(js_object).toMatchSnapshot(`{"greg": "was here"}`);
        expect(failedCalledAmount).toBe(0);
    });

    it("does not match snapshot", () =>
    {
        let js_object = { greg: "was here", mom: { sid: "bad" } };

        expectjs(js_object).toMatchSnapshot();
        expect(consoleErrorCalled).toBe(1);
        expect(failedCalledAmount).toBe(1);
    });

    it("removes circular dependency even when having key with same name that is not circular", () =>
    {
        let js_object = { greg: "was here", mom: {}, fred: { mom: "perfectly valid" } };

        js_object.mom = js_object;

        expectjs(js_object).toMatchSnapshot(`{"fred": {"mom": "perfectly valid"}, "greg": "was here"}`);
        expect(failedCalledAmount).toBe(0);
    });
});