let nativeWarn = console.warn;
console.warn = function ()
{
    if (
        (arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("[xmldom ") !== -1)
    )
    {
        return;
    }
    nativeWarn.apply(console, arguments);
};

let nativeError = console.error;
console.error = function ()
{
    if (
        (arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("entity not found") !== -1)
    )
    {
        return;
    }
    nativeError.apply(console, arguments);
};
