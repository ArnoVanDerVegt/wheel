(function() {
    var Sensor = Class(function() {
            this.init = function(opts) {
                this._index = opts.index;
                this.reset();
            };

            this.reset = function() {
                this._value = 0;
            };

            this.update = function() {
            };

            this.getValue = function() {
                return this._value;
            };

            this.setValue = function(value) {
                this._value = value;
            };
        });

    wheel(
        'vm.Sensors',
        Class(Emitter, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

                this._sensors = [];
                for (var i = 0; i < 24; i++) {
                    this._sensors.push(new Sensor({index: 0}));
                }
            };

            this.update = function() {
                //var updated = [];
                //var sensors = this._sensors;
                //for (var i = 0; i < 24; i++) {
                //    sensors[i].update() && updated.push(i);
                //}
                //updated.length && this.emit('Changed', updated);
            };

            this.reset = function() {
                //var updated = [];
                var sensors = this._sensors;
                for (var i = 0; i < 24; i++) {
                    sensors[i].reset();
                    //updated.push(i);
                }
                //this.emit('Changed', updated);
            };

            this.getSensor = function(index) {
                return this._sensors[index] || null;
            };

            this.getLength = function() {
            	return this._sensors.length;
            };
        })
    );
})();