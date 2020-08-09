/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ProjectResource  = require('../../../js/frontend/compiler/resources/ProjectResource').ProjectResource;
const dispatcher       = require('../../../js/frontend/lib/dispatcher').dispatcher;
const RgfImage         = require('../../../js/shared/lib/RgfImage').RgfImage;
const MockDataProvider = require('./MockDataProvider').MockDataProvider;
const assert           = require('assert');

afterEach(function() {
    dispatcher.reset();
});

describe(
    'Test ProjectResource',
    function() {
        it(
            'Should get rsf resource',
            function() {
                let mockDataProvider = new MockDataProvider();
                let projectResource  = new ProjectResource({
                        filename:        'test.rsf',
                        data:            [65, 66, 67, 68],
                        getDataProvider: function() { return mockDataProvider; }
                    });
                projectResource.getDownloadData(function(data) {
                    assert.equal(data, 'ABCD');
                });
            }
        );
        it(
            'Should get gsf resource',
            function() {
                let mockDataProvider = new MockDataProvider();
                let testImage        = [[0, 1, 2], [2, 3, 4]];
                let projectResource  = new ProjectResource({
                        filename:        'test.rgf',
                        data:            testImage,
                        getDataProvider: function() { return mockDataProvider; }
                    });
                projectResource.getDownloadData(function(data) {
                    let rgfImage = new RgfImage();
                    let s        = rgfImage.toString(rgfImage.pack({width: testImage[0].length, height: testImage.length, image: testImage}));
                    assert.strictEqual(data, s);
                });
            }
        );
    }
);
