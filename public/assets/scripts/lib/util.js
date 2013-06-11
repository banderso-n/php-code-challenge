define(
    function() {
        "use strict";
        var Util = {};

        Util.isControlKey = function(keyCode) {
            return keyCode <= 46;
        };

        return Util;
    }
);