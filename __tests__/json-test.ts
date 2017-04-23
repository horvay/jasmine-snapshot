import * as difflib from "difflib";
import { MatchesJSSnapshot } from "../src/index";

declare var fail: (message: string) => void;
declare var console: any;

describe("diff test", () =>
{
    beforeAll(() =>
    {
        fail = jest.fn();
        console.error = jest.fn();
    });

    it("matches simple string", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        // MatchesJSSnapshot("greg", "greg");
        // expect(fail).not.toBeCalled();
    });
});
