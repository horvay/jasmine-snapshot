import * as difflib from "difflib";
import { MatchesJSSnapshot } from "../src/index";

declare var fail: (message: string) => void;

describe("js test", () =>
{
    beforeAll(() =>
    {
        fail = jest.fn();
        console.error = jest.fn();
    });

    it("matches for simple object", () =>
    {
        MatchesJSSnapshot(`{"greg":    "was here"   }`, { greg: "was here" });
        expect(fail).not.toBeCalled();
    });

    it("removes circular dependency and matches", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        let js_object = {greg: "was here", mom: {}};
        js_object.mom = js_object;

        MatchesJSSnapshot(`{"greg": "was here"}`, js_object);
        expect(fail).not.toBeCalled();
    });
});
