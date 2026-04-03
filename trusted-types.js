(function () {
    if (!window.trustedTypes || typeof trustedTypes.createPolicy !== "function") return;
    try {
        trustedTypes.createPolicy("default", {
            createHTML: function (input) { return input; },
            createScript: function (input) { return input; },
            createScriptURL: function (input) { return input; }
        });
    } catch (e) {
        /* default policy already registered */
    }
})();
