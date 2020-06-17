/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SourceBuilder       = require('../../js/frontend/ide/editor/editors/form/SourceBuilder').SourceBuilder;
const formEditorConstants = require('../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test SourceBuilder',
    function() {
        it(
            'Should set and get lines',
            function() {
                let sourceBuilder = new SourceBuilder({});
                assert.equal(sourceBuilder.setSource('a\nb\n').getSource(), 'a\nb\n');
            }
        );
        it(
            'Should not get define info',
            function() {
                let sourceBuilder = new SourceBuilder({});
                assert.strictEqual(sourceBuilder.getDefineInfo('#include "test.whl"'), null);
            }
        );
        it(
            'Should get define info',
            function() {
                let sourceBuilder = new SourceBuilder({});
                assert.deepStrictEqual(sourceBuilder.getDefineInfo('#define BUTTON1 123'), {key: 'BUTTON1', value: '123'});
            }
        );
        it(
            'Should get constant from name',
            function() {
                let sourceBuilder = new SourceBuilder({});
                assert.deepEqual(sourceBuilder.getConstantFromName('button1'),   'BUTTON1');
                assert.deepEqual(sourceBuilder.getConstantFromName('myButton1'), 'MY_BUTTON1');
            }
        );
        it(
            'Should get includes from components',
            function() {
                let sourceBuilder = new SourceBuilder({});
                let components    = [
                        {type: formEditorConstants.COMPONENT_TYPE_CHECKBOX},
                        {type: formEditorConstants.COMPONENT_TYPE_FORM},
                        {type: formEditorConstants.COMPONENT_TYPE_BUTTON},
                        {type: formEditorConstants.COMPONENT_TYPE_SELECT_BUTTON},
                        {type: formEditorConstants.COMPONENT_TYPE_LABEL},
                        {type: formEditorConstants.COMPONENT_TYPE_CHECKBOX},
                        {type: formEditorConstants.COMPONENT_TYPE_STATUS_LIGHT},
                        {type: formEditorConstants.COMPONENT_TYPE_PANEL},
                        {type: formEditorConstants.COMPONENT_TYPE_TABS}
                    ];
                let includes      = sourceBuilder.generateIncludesFromComponents(components);
                assert.deepStrictEqual(
                    includes,
                    [
                        'lib/components/button.whl',
                        'lib/components/checkbox.whl',
                        'lib/components/form.whl',
                        'lib/components/label.whl',
                        'lib/components/panel.whl',
                        'lib/components/selectButton.whl',
                        'lib/components/statusLight.whl',
                        'lib/components/tabs.whl'
                    ]
                );
            }
        );
        it(
            'Should get defines from components',
            function() {
                let sourceBuilder = new SourceBuilder({});
                let components    = [
                        {type: 'form',     name: 'myForm',   uid: '0x123'},
                        {type: 'checkbox', name: 'checkbox', uid: '0x005'},
                        {type: 'button',   name: 'button1',  uid: '0x913'}
                    ];
                let defines       = sourceBuilder.generateDefinesFromComponents('myForm', components);
                assert.deepEqual(
                    defines.definesByName,
                    {
                        MY_FORM_CHECKBOX: '0x005',
                        MY_FORM_BUTTON1:  '0x913'
                    }
                );
                assert.equal(defines.list[0].line, '#define MY_FORM_BUTTON1  0x913');
                assert.equal(defines.list[0].name, 'MY_FORM_BUTTON1');
                assert.equal(defines.list[0].uid,  '0x913');
                assert.equal(defines.list[1].line, '#define MY_FORM_CHECKBOX 0x005');
                assert.equal(defines.list[1].name, 'MY_FORM_CHECKBOX');
                assert.equal(defines.list[1].uid,  '0x005');
            }
        );
    }
);
