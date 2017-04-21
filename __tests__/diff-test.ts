jest.autoMockOff();
jest.dontMock("difflib");
jest.dontMock("vkbeautify");

import difflib from "difflib";
import { MatchesSnapshot } from "../src/index";

let last_failed_message: string;
let fail = (message: string) =>
{
    last_failed_message = message;
}

beforeEach(() =>
{
    last_failed_message = "";
    console.error = jest.fn();

});

it("matches simple string", () =>
{
    difflib.unifiedDiff("", "");
    MatchesSnapshot("greg", "greg");
    expect(last_failed_message).toBe("");
});

it("fails with diff", () =>
{
    MatchesSnapshot("tyler", "moose");
    expect(last_failed_message).toBe("");
    expect(console.error).toBeCalledWith("");
});