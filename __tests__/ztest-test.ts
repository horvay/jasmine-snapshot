import { snapshots } from "./test-test.snapshots";
import { expectjs, registerSnapshots } from "../src/index";

describe("level 1", () =>
{
    beforeAll(() =>
    {
        registerSnapshots(snapshots, "ztesttest");
    });

    describe("level 2", () =>
    {
        it("creates snapshot json ", () =>
        {
            let greg = { fred: "\"greg\"" };
            let fred = { greg: "greg" };

            expectjs(greg).toMatchSnapshot();
            expectjs(fred).toMatchSnapshot();
        });
    });
});
