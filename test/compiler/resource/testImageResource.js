/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ImageResource    = require('../../../js/frontend/compiler/resources/ImageResource').ImageResource;
const dispatcher       = require('../../../js/frontend/lib/dispatcher').dispatcher;
const RgfImage         = require('../../../js/shared/lib/RgfImage').RgfImage;
const MockDataProvider = require('./MockDataProvider').MockDataProvider;
const assert           = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test ImageResource',
    () => {
        it(
            'Should save image',
            () => {
                let mockDataProvider = new MockDataProvider();
                let imageResource    = new ImageResource({
                        filename:        'test.rgf',
                        data:            [[0, 1, 2], [2, 3, 4]],
                        getDataProvider: () => { return mockDataProvider; }
                    });
                imageResource.save('outputpath');
                assert.equal(mockDataProvider.getFilename(), 'outputpath/test.rgf');
                assert.deepEqual(mockDataProvider.getDataV(), {width: 3, height: 2, image: [[0, 1, 2], [2, 3, 4]]});
            }
        );
        it(
            'Should get download data',
            () => {
                let mockDataProvider = new MockDataProvider();
                let testImage        = [[0, 1, 2], [2, 3, 4]];
                let imageResource    = new ImageResource({
                        filename:        'test.rgf',
                        data:            [[0, 1, 2], [2, 3, 4]],
                        getDataProvider: () => { return mockDataProvider; }
                    });
                imageResource.getDownloadData(function(data) {
                    let rgfImage = new RgfImage();
                    let s        = rgfImage.toString(rgfImage.pack({width: testImage[0].length, height: testImage.length, image: testImage}));
                    assert.strictEqual(data, s);
                });
            }
        );
    }
);
