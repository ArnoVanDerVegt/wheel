(function() {
    var wheel              = require('../utils/base.js').wheel;
    var compilerMetaHelper = wheel.compiler.helpers.compilerMetaHelper;

    wheel(
        'compiler.CompilerDirective',
        wheel.Class(wheel.WheelClass, function(supr) {
            this.init = function() {
                this._ret      = true;
                this._call     = true;
                this._optimize = true;
            };

            this.getRet = function() {
                return this._ret;
            };

            this.setRet = function(ret) {
                this._ret = ret;
            };

            this.getCall = function() {
                return this._call;
            };

            this.setCall = function(call) {
                this._call = call;
            };

            this.getOptimize = function() {
                return this._optimize;
            };

            this.setOptimize = function(optimize) {
                this._optimize = optimize;
            };

            this.compile = function(line) {
                line = line.trim();
                var i = line.indexOf('#directive');
                if (line.indexOf(' ') === -1) {
                    // throw param error
                }
                var params = line.split(' ')[1].split(',');
                params.forEach(
                    function(param) {
                        if (param.indexOf('=') === -1) {
                            // throw error
                        } else {
                            var p = param.split('=');
                            if (p.length === 2) {
                                var value;
                                switch (p[1]) {
                                    case 'on':  value = true;  break;
                                    case 'off': value = false; break;
                                    default: // error
                                }
                                switch (p[0]) {
                                    case 'ret':      this._ret      = value; break;
                                    case 'call':     this._call     = value; break;
                                    case 'optimize': this._optimize = value; break;
                                    default: // error
                                }
                            } else {
                                // error...
                            }
                        }
                    },
                    this
                );
            };
        })
    );
})();