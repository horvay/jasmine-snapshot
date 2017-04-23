import * as difflib from "difflib";
import { MatchesSnapshot } from "../src/index";

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
        MatchesSnapshot("greg", "greg");
        expect(fail).not.toBeCalled();
    });

    it("fails with diff", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        MatchesSnapshot("tyler", "moose");
        expect(fail).lastCalledWith("See diff above. Consider updating snapshot (if valid) to:\n\nmoose");
        expect(console.error).toHaveBeenCalledTimes(2);
    });
});
