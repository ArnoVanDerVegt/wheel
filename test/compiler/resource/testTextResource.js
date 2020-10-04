/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const TextResource     = require('../../../js/frontend/compiler/resources/TextResource').TextResource;
const dispatcher       = require('../../../js/frontend/lib/dispatcher').dispatcher;
const RgfImage         = require('../../../js/shared/lib/RgfImage').RgfImage;
const MockDataProvider = require('./MockDataProvider').MockDataProvider;
const assert           = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test TextResource',
    () => {
        it(
            'Should save text',
            () => {
                let mockDataProvider = new MockDataProvider();
                let imageResource    = new TextResource({
                        filename:        'test.rgf',
                        data:            'Hello world',
                        getDataProvider: () => { return mockDataProvider; }
                    });
                imageResource.save('outputpath');
                assert.equal(mockDataProvider.getFilename(), 'outputpath/test.rgf');
                assert.deepEqual(mockDataProvider.getDataV(), 'Hello world');
            }
        );
    }
);
