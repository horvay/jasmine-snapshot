let nativeWarn = window.console.warn;
window.console.warn = function ()
{
    if (
        (arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("[xmldom ") !== -1)
    )
    {
        return;
    }
    nativeWarn.apply(window.console, arguments);
};

let nativeError = window.console.error;
window.console.error = function ()
{
    if (
        (arguments.length > 0)
        && (typeof arguments[0] === "string")
        && (arguments[0].indexOf("entity not found") !== -1)
    )
    {
        return;
    }
    nativeError.apply(window.console, arguments);
};
