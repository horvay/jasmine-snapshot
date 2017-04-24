import * as difflib from "difflib";
import { MatchesJSSnapshot, KeyExceptionList, ResetExceptionList } from "../src/index";

declare var fail: (message: string) => void;

describe("js test", () =>
{
    beforeAll(() =>
    {
        fail = jest.fn();
        console.error = jest.fn();
    });

    beforeEach(() =>
    {
        ResetExceptionList();
        jest.resetAllMocks();
    });

    it("matches for simple object", () =>
    {
        MatchesJSSnapshot(`{"greg":    "was here"   }`, { greg: "was here" });
        expect(fail).not.toBeCalled();
    });

    it("does not match for empty object", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        MatchesJSSnapshot(``, { greg: "was here" });
        expect(fail).toBeCalled();
    });

    it("removes circular dependency and matches", () =>
    {
        let js_object = { greg: "was here", mom: {} };

        js_object.mom = js_object;

        MatchesJSSnapshot(`{"greg": "was here"}`, js_object);
        expect(fail).not.toBeCalled();
    });

    it("removes key exceptions and matches", () =>
    {
        let js_object = { greg: "was here", mom: { sid: "bad" } };
        KeyExceptionList.push("mom");

        MatchesJSSnapshot(`{"greg": "was here"}`, js_object);
        expect(fail).not.toBeCalled();
    });

    it("does not match snapshot", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        let js_object = { greg: "was here", mom: { sid: "bad" } };

        MatchesJSSnapshot(`{"greg": "was here"}`, js_object);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(fail).toBeCalled();
    });
});