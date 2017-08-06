(function() {
    var wheel              = require('../utils/base.js').wheel;
    var compilerMetaHelper = wheel.compiler.helpers.compilerMetaHelper;

    wheel(
        'compiler.CompilerDirective',
        wheel.Class(wheel.WheelClass, function(supr) {
            this.init = function(opts) {
                var config     = opts.config || {};
                var directives = config.directives || {};

                this._ret      = ('ret'      in directives) ? (directives.ret      === 'on') : true;
                this._call     = ('call'     in directives) ? (directives.call     === 'on') : true;
                this._optimize = ('optimize' in directives) ? (directives.optimize === 'on') : true;
                this._heap     = ('heap'     in directives) ? parseInt(directives, 10) : 128;
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

            this.getHeap = function() {
                return this._heap;
            };

            this.setHeap = function(heap) {
                this._heap = heap;
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
                        var p;
                        if (param.indexOf('=') === -1) {
                            // throw error
                        } else {
                            p = param.split('=');
                            if (p.length !== 2) {
                                // error...
                            }
                        }

                        var value;
                        switch (p[1]) {
                            case 'on':
                                value = true;
                                break;

                            case 'off':
                                value = false;
                                break;

                            default:
                                value = p[1];
                                break;
                        }

                        switch (p[0]) {
                            case 'ret':
                                this._ret = value;
                                break;

                            case 'call':
                                this._call = value;
                                break;

                            case 'optimize':
                                this._optimize = value;
                                break;

                            case 'heap':
                                if (isNaN(value)) {
                                    // error...
                                }
                                this._heap = value;
                                break;

                            default: // error
                        }
                    },
                    this
                );
            };
        })
    );
})();