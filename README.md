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

it("matces JS snapshot ", () => {

    let actual = { chicken_type: "fried" };

    // do stuff . . .

    MatchesSnapshot(`{"chicken_type" :   "fried" }`, actual);
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
        chicken_type: "fried",
        your: "mother",
        complex: {  woahwoah: "woah",
        array: ["woah", "woah", "woah", "watch the magic"]
         }  }`;

    MatchesSnapshot(snapshot, actual);
});
```

Note that the circular property was removed since it was a circular reference and you can't stringify it.

Next these will fail with the diff informations

```ts
it("Does not match snapshot ", () =>
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
        chicken_type: "fried",

        complex: {  woahwoah: "woah",
        array: ["yeah", "yeah", "yeah", "watch the magic"]
         }  }`;

    MatchesSnapshot(snapshot, actual);
});
```

This will produce the following output:

```

```