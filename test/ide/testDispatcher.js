/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../js/frontend/lib/dispatcher').dispatcher;
const assert     = require('assert');

describe(
    'Test dispatcher',
    function() {
        it(
            'Should Reset',
            function() {
                let done = false;
                dispatcher.on('Signal', this, function() {
                    done = true;
                });
                dispatcher.dispatch('Signal');
                assert.equal(done, true);
                done = false;
                dispatcher.reset();
                dispatcher.dispatch('Signal');
                assert.equal(done, false);
            }
        );
    }
);
