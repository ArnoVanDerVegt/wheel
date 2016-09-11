(function() {
    var wheel = require('../../utils/base.js').wheel;

    var Dispatcher = wheel.Class(wheel.Emitter, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);
            };
        });

    wheel('dispatcher', new Dispatcher({}));
})();