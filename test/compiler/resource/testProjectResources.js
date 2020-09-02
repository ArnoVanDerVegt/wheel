/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ProjectResources = require('../../../js/frontend/compiler/resources/ProjectResources').ProjectResources;
const ProjectResource  = require('../../../js/frontend/compiler/resources/ProjectResource').ProjectResource;
const dispatcher       = require('../../../js/frontend/lib/dispatcher').dispatcher;
//const RgfImage         = require('../../../js/shared/lib/RgfImage').RgfImage;
const MockDataProvider = require('./MockDataProvider').MockDataProvider;
const assert           = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test ProjectResources',
    () => {
        it(
            'Should create resources',
            () => {
                let projectResources = new ProjectResources({projectFilename: 'testProject'});
                assert.equal(projectResources.getResources().length, 0);
                assert.equal(projectResources.getProjectFilename(),  'testProject');
            }
        );
        it(
            'Should add a resource',
            () => {
                let projectResources = new ProjectResources({});
                projectResources.add('test.rsf', [1, 2, 3, 4], {})
                assert.equal(projectResources.getResources().length, 1);
                assert.equal(projectResources.get('test.rsf') instanceof ProjectResource, true);
            }
        );
        it(
            'Should add two resources',
            () => {
                let projectResources = new ProjectResources({});
                projectResources.add('test1.rsf', [1, 2, 3, 4], {})
                projectResources.add('test2.rsf', [1, 2, 3, 4, 5, 6], {})
                assert.equal(projectResources.getResources().length, 2);
                assert.equal(projectResources.get('test1.rsf') instanceof ProjectResource, true);
                assert.equal(projectResources.get('test2.rsf') instanceof ProjectResource, true);
                assert.deepEqual(projectResources.getFilenameList(), ['test1.rsf', 'test2.rsf']);
            }
        );
        it(
            'Should save two resources',
            () => {
                let mockDataProvider = new MockDataProvider();
                let projectResources = new ProjectResources({getDataProvider: () => { return mockDataProvider; }});
                projectResources.add('test1.rtf', 'abc', {})
                projectResources.add('test2.rtf', 'def', {})
                projectResources.save('test_output/');
                assert.deepEqual(mockDataProvider.getFilenames(), ['test_output/test1.rtf', 'test_output/test2.rtf']);
            }
        );
        it(
            'Should throw an error on duplicate resources',
            () => {
                assert.throws(
                    () => {
                        let mockDataProvider = new MockDataProvider();
                        let projectResources = new ProjectResources({});
                        projectResources.add('test.rsf', [1, 2, 3, 4], {})
                        projectResources.add('test.rsf', [1, 2, 3, 4], {})
                    },
                    function(error) {
                        return (error.toString() === 'Error: #undefined Duplicate resource "test.rsf".');
                    }
                );
            }
        );
    }
);
