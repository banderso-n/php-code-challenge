define(
    function() {

        var Controller = function Controller() {
            this.$element = null;
            this.events = {};
        };

        Controller.prototype.setElement = function(selector) {
            this.$element = $(selector);
            return this;
        };

        Controller.prototype.$ = function() {
            return this.$element.find.apply(this.$element, arguments);
        };

        Controller.prototype.bindEventHandlers = function(_events) {
            for (var i in _events) {
                _events[i] = _events[i].bind(this);
            }
        };

        return Controller;
    }
);