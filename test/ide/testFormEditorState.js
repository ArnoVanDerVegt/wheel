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

const EMPTY_FORM = [
            {
                type:   'form',
                name:   'label',
                id:     1,
                uid:    0x843532C2,
                title:  'Label example',
                width:  280,
                height: 70
            }
        ];

const FORM_WITH_ONE_COMPONENT = [
        {
            type:     'form',
            name:     'label',
            id:       1,
            uid:      0x843532C2,
            title:    'Label example',
            width:    280,
            height:   70
        },
        {
            type:     'label',
            name:     'Label',
            parentId: 1,
            id:       2,
            uid:      0x3B44B2E3,
            x:        40,
            y:        20,
            tabIndex: 0,
            hidden:   false,
            disabled: false,
            text:     'Count:',
            halign:   'left'
        }
    ];

const FORM_WITH_TWO_COMPONENTS = [
        {
            type:     'form',
            id:       1,
            uid:      0x843532C2,
            name:     'label',
            title:    'Label example',
            width:    280,
            height:   70
        },
        {
            type:     'label',
            name:     'Label',
            parentId: 1,
            id:       2,
            uid:      0x3B44B2E3,
            x:        40,
            y:        20,
            tabIndex: 0,
            hidden:   false,
            disabled: false,
            text:     'Count:'
        },
        {
            id:       3,
            uid:      0x5EF685C3,
            parentId: 1,
            x:        110,
            y:        20,
            tabIndex: 0,
            hidden:   false,
            disabled: false,
            type:     'label',
            name:     'Count',
            text:     0
        }
    ];

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
                                data:     EMPTY_FORM
                            });
                        formEditorState.on(
                            'AddForm',
                            this,
                            () => {
                                assert.equal(formEditorState.getLoading(),  false);
                                assert.equal(formEditorState.peekId(),      2);
                                assert.equal(formEditorState.getFormName(), 'label'); // Form name is only ready after init!
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(),      1);
                        assert.equal(formEditorState.getLoading(),  true);
                        assert.equal(formEditorState.getPath(),     'hello/world');
                        assert.equal(formEditorState.getFilename(), 'test.wfrm');
                    }
                );
                it(
                    'Should load a form with one component',
                    function(done) {
                        let formEditorState = new FormEditorState({
                                getOwnerByParentId: () => { return 1; },
                                initTime:           2,
                                path:               'hello/world',
                                filename:           'test.wfrm',
                                data:               FORM_WITH_ONE_COMPONENT
                            });
                        formEditorState.on(
                            'AddForm',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 4);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should load a form with two components',
                    function(done) {
                        let formEditorState = new FormEditorState({
                                getOwnerByParentId: () => { return 1; },
                                initTime:           2,
                                path:               'hello/world',
                                filename:           'test.wfrm',
                                data:               FORM_WITH_TWO_COMPONENTS
                            });
                        formEditorState.on(
                            'AddForm',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 5);
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
