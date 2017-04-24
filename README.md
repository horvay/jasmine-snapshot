# jasmine-snapshot
This allows you to compare snapshots to html or javascript objects, and gives a diff when they don't match - similar to what jest snapshots do. The purpose of this library is to take away the effort of making "expected" results for your test.

I made this library because my company needed to be able to test on a browser, and facebook's jest (which has snapshots) does not allow you to do this.

This library will not manage your snapshots like jest does, which makes it slightly less accomidating. However, if your snapshot is out of date, it will give you a diff between the old and the new, and will tell what to copy and paste into your  snapshots.

# Basic Strings
The most basic feature is to compare a string to a snapshot. This isn't very useful on its own but if it fails, it will give a nice diff between the two strings in the output log.

```ts
import { MatchesSnapshot } from "jasmine-snapshot";

it("matces simple snapshot", () => {
    let actual = "fried chicken";

    // do stuff . . .

    let snapshot = "fried chicken";
    MatchesSnapshot(snapshot, actual);
});

```

# Javascript objects
The much more useful feature is to compare javascript objects to a snapshot. It will take any JS object, remove circular references, and stringify the JS object. Then it will prettify both the snapshot and the actual JS stringified object. If they don't match, it will give you a diff of the two prettified JSON strings and tell you what to put in your snapshot if you want to update it.

First some examples of successfully matching compares.

```ts
import { MatchesJSSnapshot } from "jasmine-snapshot";

it("matces JS snapshot ", () =>
{
    let actual = { chicken_type: "fried" };

    // do stuff . . .

    MatchesJSSnapshot(`{"chicken_type" :   "fried" }`, actual);
});

it("matces complex JS snapshot ", () =>
{
    let actual = {
        chicken_type: "fried",
        your: "mother",
        circular: {},
        complex: {
            woahwoah: "woah",
            array: ["woah", "woah", "woah", "watch the magic"]
        }
    };

    actual.circular = actual;

    // Do real stuff . . .

    let snapshot = `{
        "chicken_type": "fried",
        "complex": {
            "array": [
                "woah",
                "woah",
                "woah",
                "watch the magic"
            ],
            "woahwoah": "woah"
        },
        "your": "mother"
    }`;

    MatchesJSSnapshot(snapshot, actual);
});
```

Note that the circular property was removed since it was a circular reference and you can't stringify it. Also note that the snapshot will be arranged in alphabetical order, so the order of properties in a complex object do not matter.

Next these will fail with the diff informations showing in the log.

```ts
it("Does not match snapshot ", () =>
{
    let actual = {
        chicken_type: "fried",
        your: "mother",
        complex: {
            woahwoah: "woah",
            array: ["woah", "woah", "woah", "watch the magic"]
        }
    };

    // Do real stuff . . .

    let snapshot = `{
            "chicken_type": "fried",
            "complex": {
                "array": ["yeah","yeah","yeah","watch the magic"],
                "woahwoah": "woah"
            },
            "your": "mother"
        }`;

    MatchesSnapshot(snapshot, actual);
});
```

This will produce the following output:

```sh
*************************************************************
* Snapshot did not match Actual. Here is the diff ***********
*************************************************************

---

+++

@@ -2,9 +2,9 @@

     "chicken_type": "fried",
     "complex": {
         "array": [
-            "yeah",
-            "yeah",
-            "yeah",
+            "woah",
+            "woah",
+            "woah",
             "watch the magic"
         ],
         "woahwoah": "woah"

*************************************************************
* If the Actual is valid, update the snapshot with this     *
*************************************************************

 ----- Formatted ------
{
    "chicken_type": "fried",
    "complex": {
        "array": [
            "woah",
            "woah",
            "woah",
            "watch the magic"
        ],
        "woahwoah": "woah"
    },
    "your": "mother"
}

 ----- Single Line ------
{ "chicken_type": "fried", "complex": { "array": [ "woah", "woah", "woah", "watch the magic" ], "woahwoah": "woah" }, "your": "mother"}'
Chrome 57.0.2987 (Windows 10 0.0.0) uscodetabledropdown  Does not match snapshot  FAILED
        Failed: Actual does not match snapshot. See above.
            at o (C:/Users/GREGOR~1/AppData/Local/Temp/karma-typescript-bundle-46320RrUeuBnxAz8b.js:37879:2002)
            at Object.p [as MatchesJSSnapshot] (C:/Users/GREGOR~1/AppData/Local/Temp/karma-typescript-bundle-46320RrUeuBnxAz8b.js:37879:2590)
            at Object.<anonymous> (spec/uscodetabledropdown.spec.js:36:28)
```

Also, you can do checks with XML and XML'ish type things. Here is an example checking HTML generated by react checked using Enzyme.

```ts
import * as React from "react";
import * as Enzyme from "enzyme";
import { FormControl } from "react-bootstrap";
import { MatchesXMLSnapshot } from "jasmine-snapshot";

it("Render basic text area with bootstrap ", () =>
{
    const elem = Enzyme.shallow(
        <FormControl componentClass="textarea" value={"aoeu"} />
    );

    let snapshot = `
    {
        "textarea": {
            "__text": "aoeu",
            "_class": "form-control"
        }
    }`;

    MatchesXMLSnapshot(snapshot, elem.html());
});
```

Note that the snapshot is JSON formed from the HTML. That is because the JSON can be ordered alphabetically so the order of HTML tag attributes will not affect the result.