/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../js/frontend/lib/dispatcher').dispatcher;
const FormEditorState = require('../../js/frontend/ide/editor/editors/form/state/FormEditorState').FormEditorState;
const assert          = require('assert');

afterEach(function() {
    dispatcher.reset();
});

describe(
    'Test FormEditorState',
    function() {
        describe(
            'Test constructor',
            function() {
                it(
                    'Should create FormEditorState instance',
                    function() {
                        let formEditorState = new FormEditorState({path: 'hello/world', filename: 'test.wfrm'});
                        assert.equal(formEditorState instanceof FormEditorState, true);
                    }
                );
                it(
                    'Should peek initial Id',
                    function(done) {
                        let formEditorState = new FormEditorState({
                                initTime: 2,
                                path:     'hello/world',
                                filename: 'test.wfrm'
                            });
                        formEditorState.on(
                            'AddForm',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 2);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
            }
        );
        describe(
            'Test loading',
            function() {
                it(
                    'Should load an empty form',
                    function(done) {
                        let formEditorState = new FormEditorState({
                                initTime: 2,
                                path:     'hello/world',
                                filename: 'test.wfrm',
                                data: [
                                    {
                                        type:   'form',
                                        uid:    0x843532C2,
                                        name:   'label',
                                        title:  'Label example',
                                        width:  280,
                                        height: 70,
                                        id:     1
                                    }
                                ]
                            });
                        formEditorState.on(
                            'AddForm',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 2);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
            }
        );
    }
);
