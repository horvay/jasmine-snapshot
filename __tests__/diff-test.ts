import * as difflib from "difflib";
import { MatchesSnapshot } from "../src/index";

declare var fail: (message: string) => void;
declare var console: any;

describe("diff test", () =>
{
    let lastFailedWith = "";
    let consoleErrorCalled = 0;

    beforeAll(() =>
    {
        fail = (message: string) => lastFailedWith = message;
        console.error = (error: string) => consoleErrorCalled++;
    });

    beforeEach(() =>
    {
        lastFailedWith = "";
        consoleErrorCalled = 0;
    });

    it("matches simple string", () =>
    {
        MatchesSnapshot("greg", "greg");
        expect(lastFailedWith).toBe("");
    });

    it("fails with diff", () =>
    {
        MatchesSnapshot("tyler", "moose");
        expect(lastFailedWith).toBe("Actual does not match snapshot. See above. ");
        expect(consoleErrorCalled).toBe(1);
    });
});
