import * as difflib from "difflib";
import { MatchesXMLSnapshot } from "../src/index";

declare var fail: (message: string) => void;

describe("xml test", () =>
{
    beforeAll(() =>
    {
        fail = jest.fn();
        console.error = jest.fn();
    });

    beforeEach(() =>
    {
        jest.resetAllMocks();
    });

    it("Matches complex html", () =>
    {
        // tslint:disable-next-line:max-line-length
        let snapshot = `{ "div": { "_class": "Select Select--single is-searchable", "div": { "_class": "Select-control", "_id": "duck", "span": [ { "_class": "Select-multi-value-wrapper", "_id": "react-select-#--value", "div": [ { "__text": "Select...", "_class": "Select-placeholder" }, { "_class":"Select-input", "_id": "yourface", "_style": "display:inline-block;", "div": { "_style": "position:absolute;top:0;left:0;visibility:hidden;height:0;overflow:scroll;white-space:pre;" }, "input": { "_aria-activedescendant": "react-select-#--value", "_aria-expanded": "false", "_aria-haspopup": "false", "_aria-owns": "", "_role": "combobox", "_style": "width:5px;box-sizing:content-box;", "_value": "" } } ] }, { "_class": "Select-arrow-zone", "span": { "_class": "Select-arrow" } } ] } }}`;

        let actual = `
<div class="Select Select--single is-searchable">
    <div id="duck" class="Select-control">
        <span class="Select-multi-value-wrapper" id="react-select-#--value">
            <div class="Select-placeholder">Select...</div>
            <div class="Select-input" id="yourface" style="display:inline-block;">
                <input role="combobox" aria-expanded="false" aria-owns="" aria-haspopup="false" aria-activedescendant="react-select-#--value" value="" style="width:5px;box-sizing:content-box;"/>
                <div style="position:absolute;top:0;left:0;visibility:hidden;height:0;overflow:scroll;white-space:pre;"></div>
            </div>
        </span>
        <span class="Select-arrow-zone">
            <span class="Select-arrow"></span>
        </span>
    </div>
</div>`;

        MatchesXMLSnapshot(snapshot, actual);

        expect(fail).not.toHaveBeenCalled();
    });

    it("matches complex html two", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        // tslint:disable-next-line:max-line-length
        let snapshot = `{ "div": { "_class": "Select Select--single is-open is-searchable", "div": [ { "_class": "Select-control", "span": [ { "_class": "Select-multi-value-wrapper", "_id": "react-select-#--value", "div": [ { "__text": "Select...", "_class": "Select-placeholder" }, { "_class": "Select-input", "_style": "display: inline-block;", "div": { "_style": "position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px; overflow: scroll; white-space: pre;" }, "input": { "_aria-activedescendant": "react-select-#--option-0", "_aria-expanded": "true", "_aria-haspopup": "true", "_aria-owns": "react-select-#--list", "_role": "combobox", "_style": "width: 5px; box-sizing: content-box;", "_value": "" } } ] }, { "_class": "Select-arrow-zone", "span": { "_class": "Select-arrow" } } ] }, { "_class": "Select-menu-outer", "div": { "_class": "Select-menu", "_id": "react-select-#--list", "_role": "listbox", "div": [ { "__text": "IGLOO Ice Home for Men of The North", "_class": "Select-option is-focused", "_id": "react-select-#--option-0", "_role": "option" }, { "__text": "MOOSE The Moose shall be loose", "_class": "Select-option", "_id": "react-select-#--option-1", "_role": "option" } ] } } ] }}`;

        // tslint:disable-next-line:max-line-length
        let actual = `<div class="Select Select--single is-open is-searchable"><div class="Select-control"><span class="Select-multi-value-wrapper" id="react-select-#--value"><div class="Select-placeholder">Select...</div><div class="Select-input" style="display: inline-block;"><input role="combobox" aria-expanded="true" aria-owns="react-select-#--list" aria-haspopup="true" aria-activedescendant="react-select-#--option-0" value="" style="width: 5px; box-sizing: content-box;"><div style="position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px; overflow: scroll; white-space: pre;"></div></div></span><span class="Select-arrow-zone"><span class="Select-arrow"></span></span></div><div class="Select-menu-outer"><div role="listbox" class="Select-menu" id="react-select-#--list"><div class="Select-option is-focused" role="option" id="react-select-#--option-0">IGLOO Ice Home for Men of The North</div><div class="Select-option" role="option" id="react-select-#--option-1">MOOSE The Moose shall be loose</div></div></div></div>`;

        MatchesXMLSnapshot(snapshot, actual);

        expect(fail).not.toHaveBeenCalled();
    });

    it("matches complex string", () =>
    {
        let mock = jest.fn();
        mock.mockReturnValue(["tyler", "moose"]);
        difflib.default = { unifiedDiff: mock };

        let snapshot = `
        {
            "html": {
                "div": {
                    "id": "fart",
                    "name": "knocker",
                    "span": "some text"
                }
            }
        }`;

        MatchesXMLSnapshot(snapshot, `<html><div name="knocker" id="fart">some text</div></html>`);

        expect(fail).toHaveBeenCalledTimes(1);
    });
});
