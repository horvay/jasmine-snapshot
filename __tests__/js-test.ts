import * as difflib from "difflib";
import { MatchesJSSnapshot, KeyExceptionList, ResetExceptionList, expectjs } from "../src/index";

declare var fail: (message: string) => void;

describe("js test", () =>
{
    let failedCalledAmount = 0;
    let consoleErrorCalled = 0;

    beforeAll(() =>
    {
        fail = (message: string) => failedCalledAmount++;
        console.error = (error: string) => consoleErrorCalled++;
    });

    beforeEach(() =>
    {
        ResetExceptionList();

        failedCalledAmount = 0;
        consoleErrorCalled = 0;
    });

    it("matches for simple object", () =>
    {
        expectjs({ greg: "was here" }).toMatchSnapshot(`{"greg":    "was here"   }`);
        expect(failedCalledAmount).toBe(0);
    });

    it("does not match for empty object", () =>
    {
        // let mock = (one: string, two: string) =>
        // mock.mockReturnValue(["tyler", "moose"]);
        // difflib.default = { unifiedDiff: mock };

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
        // let mock = jest.fn();
        // mock.mockReturnValue(["tyler", "moose"]);
        // difflib.default = { unifiedDiff: mock };

        let js_object = { greg: "was here", mom: { sid: "bad" } };

        expectjs(js_object).toMatchSnapshot(`{"greg": "was here"}`);
        expect(consoleErrorCalled).toBe(1);
        expect(failedCalledAmount).toBe(1);
    });

    it("removes circular dependency even when having key with same name that is not circular", () =>
    {
        // let mock = jest.fn();
        // mock.mockReturnValue(["tyler", "moose"]);
        // difflib.default = { unifiedDiff: mock };
        let js_object = { greg: "was here", mom: {}, fred: { mom: "perfectly valid" } };

        js_object.mom = js_object;

        expectjs(js_object).toMatchSnapshot(`{"fred": {"mom": "perfectly valid"}, "greg": "was here"}`);
        expect(failedCalledAmount).toBe(0);
    });
});