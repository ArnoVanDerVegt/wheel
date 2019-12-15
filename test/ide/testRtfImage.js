/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const RgfImage = require('../../js/shared/lib/RgfImage').RgfImage;
const assert   = require('assert');

describe(
    'Test RgfImage',
    function() {
        it(
            'Should pack',
            function() {
                let rgfImage = new RgfImage();
                let data     = rgfImage.pack({
                        width:  10,
                        height: 5,
                        image: [
                            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                        ]
                    });
                assert.equal(data.toString(), '10,5,170,2,85,1,170,2,85,1,170,2');
            }
        );
        it(
            'Should unpack',
            function() {
                let rgfImage = new RgfImage();
                let data     = rgfImage.unpack([10, 5, 170, 2, 85, 1, 170, 2, 85, 1, 170, 2]);
                assert.deepEqual(
                    data,
                    {
                        width:  10,
                        height: 5,
                        image: [
                            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
                        ]
                    }
                );
            }
        );
    }
);
