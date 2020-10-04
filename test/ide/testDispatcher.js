/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../js/frontend/lib/dispatcher').dispatcher;
const assert     = require('assert');

describe(
    'Test dispatcher',
    () => {
        it(
            'Should Reset',
            () => {
                let done = false;
                dispatcher.on('Signal', this, () => {
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
