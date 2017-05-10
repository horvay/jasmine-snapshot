// tslint:disable:max-line-length
import { expectjs, registerSnapshots, expectxml } from "../src/index";

describe("sample snapshotting", () =>
{
    describe("basic examples", () =>
    {
        let snapshots = {
            "sample snapshotting basic examples does a basic js snapshot 1": `{ "chicken_type": "fried"}`,
            "sample snapshotting basic examples does a basic html snapshot 1": `{ "div": { "_class": "ribbit frogs", "_id": "freddy", "span": "hails yeahs" }}`
        };

        beforeAll(() =>
        {
            registerSnapshots(snapshots, "basic examples suite");
        });

        it("does a basic js snapshot", () =>
        {
            let actual = { chicken_type: "fried" };

            expectjs(actual).toMatchSnapshot();
        });

        it("does a basic html snapshot", () =>
        {
            let actual = `<div id="freddy" class="ribbit frogs"><span>hails yeahs</span></div>`;

            expectxml(actual).toMatchSnapshot();
        });
    });

    describe("complex examples", () =>
    {
        let snapshots = {
            "sample snapshotting complex examples does a more complex js snapshot 1": `{ "DEFAULT_TIMEOUT_INTERVAL": 5000, "MAX_PRETTY_PRINT_ARRAY_LENGTH": 100, "MAX_PRETTY_PRINT_DEPTH": 40, "currentEnv_": { "clock": {} }, "errors": {}, "matchers": {}, "matchersUtil": {}, "util": {}, "version": "2.6.1"}`,
            "sample snapshotting complex examples does a more complex html snapshot 1": `{ "script": { "__text": "window.__karma__.loaded();", "_type": "text/javascript" }}`
        };

        beforeAll(() =>
        {
            registerSnapshots(snapshots, "complex examples suite");
        });

        it("does a more complex js snapshot", () =>
        {
            let actual = jasmine as any;
            actual.location = document.location;
            delete actual.errors;

            expectjs(actual).toMatchSnapshot();
        });

        it("does a more complex html snapshot", () =>
        {
            let actual = window.document.body.innerHTML;

            expectxml(actual).toMatchSnapshot();
        });
    });
});