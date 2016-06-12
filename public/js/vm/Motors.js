(function() {
    var Motor = Class(function() {
            this.init = function(opts) {
                this._index = opts.index;
                this.reset();
            };

            this.reset = function() {
                this._startTime     = 0;
                this._endTime       = 0;
                this._position      = 0;
                this._target        = 0;
                this._startPosition = 0;
                this._power         = 50;
                this._min           = 0;
                this._max           = 7200;
                this.setRpm(203);
            };

            this.update = function() {
                if (this._target === this._position) {
                    return false;
                }
                var time = Date.now();
                if (time > this._endTime) {
                    this._position = this._target;
                } else {
                    var delta = this._target - this._startPosition;
                    this._position = Math.round(this._startPosition + (delta * (time - this._startTime) / (this._duration || 1)));
                }
                return true;
            };

            this.setRpm = function(rpm) {
                this._rmp = rpm;
                this._dpm = rpm * 360;     // Degrees per minute
                this._dps = rpm * 60;    // Degrees per second
            };

            this.getTarget = function() {
                return this._target;
            };

            this.setTarget = function(target) {
                target = Math.round(target);
                if (this._target === target) {
                    return;
                }
                target = Math.min(Math.max(this._min, target), this._max);
                var delta = this._position - target;
                this._startPosition = this._position;
                this._startTime     = Date.now();
                this._endTime       = this._startTime + Math.round(Math.abs(delta) / this._dps * 1000 / (this._power / 100));
                this._duration      = this._endTime - this._startTime;
                this._target        = target;
            };

            this.setPower = function(power) {
                this._power = Math.max(Math.min(power, 100), 0);
            };

            this.getPower = function() {
                return this._power;
            };

            this.setPosition = function(position) {
                this._position = position;
            };

            this.getPosition = function() {
                return this._position;
            };

            this.getSpeed = function() {
                return Math.round(this._power * this._rmp / 100);
            };

            this.getMin = function() {
                return this._min;
            };

            this.setMin = function(min) {
                this._min = min;
            };

            this.getMax = function() {
                return this._max;
            };

            this.setMin = function(max) {
                this._max = max;
            };
        });

    wheel(
        'vm.Motors',
        Class(Emitter, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

                this._motors = [];
                for (var i = 0; i < 24; i++) {
                    this._motors.push(new Motor({index: 0}));
                }
            };

            this.update = function() {
                var updated = [];
                var motors  = this._motors;
                for (var i = 0; i < 24; i++) {
                    motors[i].update() && updated.push(i);
                }
                updated.length && this.emit('Changed', updated);
            };

            this.reset = function() {
                var updated = [];
                var motors  = this._motors;
                for (var i = 0; i < 24; i++) {
                    motors[i].reset();
                    updated.push(i);
                }
                this.emit('Changed', updated);
            };

            this.getMotor = function(index) {
                return this._motors[index] || null;
            };

            this.getLength = function() {
            	return this._motors.length;
            };
        })
    );
})();