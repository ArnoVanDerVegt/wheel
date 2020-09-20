/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FormResource     = require('../../../js/frontend/compiler/resources/FormResource').FormResource;
const dispatcher       = require('../../../js/frontend/lib/dispatcher').dispatcher;
const MockDataProvider = require('./MockDataProvider').MockDataProvider;
const assert           = require('assert');

afterEach(() => {
    dispatcher.reset();
});

describe(
    'Test FormResource',
    () => {
        it(
            'Should get data from editor',
            (done) => {
                let mockDataProvider = new MockDataProvider();
                let formResource     = new FormResource({
                        filename:          'test.wfrm',
                        getDataProvider:   () => { return mockDataProvider; },
                        getEditorFileData: (filename, callback) => {
                            callback([{type: 'form', name: 'testForm'}]);
                        }
                    });
                formResource.getData((data) => {
                    assert.deepEqual(data, [{type: 'form', name: 'testForm'}]);
                    done();
                });
            }
        );
        it(
            'Should get data from data provider',
            (done) => {
                let mockDataProvider = new MockDataProvider();
                console.log('mockDataProvider:', mockDataProvider);
                let formResource     = new FormResource({
                        filename:        'test.wfrm',
                        getDataProvider: () => { return mockDataProvider; }
                    });
                formResource.getData((data) => {
                    data.data.wfrm = JSON.parse(data.data.wfrm);
                    assert.deepEqual(
                        data,
                        {
                            success: true,
                            data: {
                                wfrm: {
                                    filename: 'test.wfrm'
                                }
                            }
                        }
                    );
                    done();
                });
            }
        );
    }
);
