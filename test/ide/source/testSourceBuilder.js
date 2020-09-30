/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const SourceBuilder       = require('../../../js/frontend/ide/source/SourceBuilder').SourceBuilder;
const formEditorConstants = require('../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test SourceBuilder',
    () => {
        it(
            'Should set and get lines',
            () => {
                let sourceBuilder = new SourceBuilder({});
                assert.equal(sourceBuilder.setSource('a\nb\n').getSource(), 'a\nb\n');
            }
        );
        it(
            'Should update empty source',
            () => {
                let sourceBuilder = new SourceBuilder({});
                let lines         = sourceBuilder
                        .setSource([
                            '#project "Test project"'
                        ].join('\n')).
                        generateUpdatedSource({
                            components: [
                                {type: formEditorConstants.COMPONENT_TYPE_FORM,     name: 'myForm',   uid: '0x123'},
                                {type: formEditorConstants.COMPONENT_TYPE_CHECKBOX, name: 'checkbox', uid: '0x005'},
                                {type: formEditorConstants.COMPONENT_TYPE_BUTTON,   name: 'button1',  uid: '0x913'}
                            ]
                        })
                        .getSource().split('\n');
                assert.deepEqual(
                    lines,
                    [
                        '#project "Test project"',
                        '',
                        '#include "lib/components/form.whl"',
                        '#include "lib/components/checkbox.whl"',
                        '#include "lib/components/button.whl"',
                        '',
                        '#define MY_FORM_BUTTON1  0x913',
                        '#define MY_FORM_CHECKBOX 0x005'
                    ]
                );
            }
        );
        it(
            'Should add include and define',
            () => {
                let sourceBuilder = new SourceBuilder({});
                let lines         = sourceBuilder
                        .setSource([
                            '#project "Test project"',
                            '',
                            '#include "lib/components/form.whl"',
                            '#include "lib/components/button.whl"',
                            '#include "lib/components/radio.whl"',
                            '',
                            '#define MY_FORM_BUTTON1  0x913',
                            '#define MY_FORM_RADIO2   0x418'
                        ].join('\n')).
                        generateUpdatedSource({
                            components: [
                                {type: formEditorConstants.COMPONENT_TYPE_FORM,     name: 'myForm',   uid: '0x123'},
                                {type: formEditorConstants.COMPONENT_TYPE_CHECKBOX, name: 'checkbox', uid: '0x005'},
                                {type: formEditorConstants.COMPONENT_TYPE_BUTTON,   name: 'button1',  uid: '0x913'},
                                {type: formEditorConstants.COMPONENT_TYPE_RADIO,    name: 'radio2',   uid: '0x418'}
                            ]
                        })
                        .getSource().split('\n');
                assert.deepEqual(
                    lines,
                    [
                        '#project "Test project"',
                        '',
                        '#include "lib/components/form.whl"',
                        '#include "lib/components/button.whl"',
                        '#include "lib/components/radio.whl"',
                        '#include "lib/components/checkbox.whl"',
                        '',
                        '#define MY_FORM_BUTTON1  0x913',
                        '#define MY_FORM_CHECKBOX 0x005',
                        '#define MY_FORM_RADIO2   0x418'
                    ]
                );
            }
        );
    }
);
