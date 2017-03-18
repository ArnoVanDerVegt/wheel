(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'simulator.Light',
        wheel.Class(function() {
            this.init = function(opts) {
                this._element = opts.nodesById.light;
                wheel.vm.modules.LightModule.setLight(this);
            };

            this.setColorAndFlash = function(color, flash) {
                this._element.className = 'ev3-light ' + ['off', 'red', 'yellow', 'green'][color] + ' ' + ['', 'flash'][flash];
            };

            this.off = function(color, flash) {
                this._element.className = 'ev3-light';
            };
        })
    );
})();
