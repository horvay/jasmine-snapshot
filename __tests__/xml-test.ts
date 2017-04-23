import * as difflib from "difflib";
import { MatchesXMLSnapshot } from "../src/index";

declare var fail: (message: string) => void;
declare var console: any;

describe("diff test", () =>
{
    beforeAll(() =>
    {
        fail = jest.fn();
        console.error = jest.fn();
    });

    it("matches simple string", async () =>
    {
        jest.resetAllMocks();

        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        let snapshot = `
        {
            "html": {
                "div": [
                    {
                        "_": "some text",
                        "$": {
                            "name": "knocker",
                            "id": "fart"
                        }
                    }
                ],
                "aoue": "aoeu"
            }
        }`;

        await MatchesXMLSnapshot(snapshot, `<html><div name="knocker" id="fart">some text</div></html>`);

        expect(fail).toHaveBeenCalledTimes(1);
    });
});
