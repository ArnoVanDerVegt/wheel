/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Emitter = require('../../js/frontend/lib/Emitter').Emitter;
const assert  = require('assert');

describe(
    'Test Emitter',
    function() {
        it(
            'Should Emit',
            function() {
                let emitter = new Emitter();
                let done    = false;
                emitter.addEventListener('Signal', this, function() {
                    done = true;
                });
                emitter.emit('Signal');
                assert.equal(done, true);
            }
        );
        it(
            'Should Emit with parameter',
            function() {
                let emitter = new Emitter();
                let done    = false;
                let p       = null;
                emitter.addEventListener('Signal', this, function(param) {
                    done = true;
                    p    = param;
                });
                emitter.emit('Signal', 1234);
                assert.equal(done, true);
                assert.equal(p,    1234);
            }
        );
        it(
            'Should Emit with parameters',
            function() {
                let emitter = new Emitter();
                let done    = false;
                let p1      = null;
                let p2      = null;
                emitter.addEventListener('Signal', this, function(param1, param2) {
                    done = true;
                    p1   = param1;
                    p2   = param2;
                });
                emitter.emit('Signal', 1234, 456);
                assert.equal(done, true);
                assert.equal(p1,   1234);
                assert.equal(p2,   456);
            }
        );
        it(
            'Should add multiple listeners',
            function() {
                let emitter = new Emitter();
                let done    = false;
                let p1      = null;
                let p2      = null;
                emitter.addEventListener('Signal', this, function(param) {
                    done = true;
                    p1   = param;
                });
                emitter.addEventListener('Signal', this, function(param) {
                    done = true;
                    p2   = param;
                });
                emitter.emit('Signal', 1234);
                assert.equal(done, true);
                assert.equal(p1,   1234);
                assert.equal(p2,   1234);
            }
        );
        it(
            'Should remove a listener',
            function() {
                let emitter = new Emitter();
                let done    = false;
                emitter.addEventListener('Signal', this, function() {
                    done = true;
                })();
                emitter.emit('Signal');
                assert.equal(done, false);
            }
        );
        it(
            'Should remove one listener',
            function() {
                let emitter = new Emitter();
                let p1      = null;
                let p2      = null;
                emitter.addEventListener('Signal', this, function(param) {
                    p1 = param;
                });
                emitter.addEventListener('Signal', this, function(param) {
                    p2 = param;
                })();
                emitter.emit('Signal', 1234);
                assert.equal(p1,   1234);
                assert.equal(p2,   null);
            }
        );
    }
);
