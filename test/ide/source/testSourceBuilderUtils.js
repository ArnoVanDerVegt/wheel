/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sourceBuilderUtils  = require('../../../js/frontend/ide/source/sourceBuilderUtils');
const formEditorConstants = require('../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test sourceBuilderUtils',
    () => {
        it(
            'Should not get define info',
            () => {
                assert.strictEqual(sourceBuilderUtils.getDefineInfo('#include "test.whl"'), null);
            }
        );
        it(
            'Should get define info',
            () => {
                assert.deepStrictEqual(sourceBuilderUtils.getDefineInfo('#define BUTTON1 123'), {key: 'BUTTON1', value: '123'});
            }
        );
        it(
            'Should get constant from name',
            () => {
                assert.equal(sourceBuilderUtils.getConstantFromName('button1'),   'BUTTON1');
                assert.equal(sourceBuilderUtils.getConstantFromName('myButton1'), 'MY_BUTTON1');
            }
        );
        it(
            'Should get form name from components',
            () => {
                let components = [
                        {type: 'button', name: 'button1'},
                        {type: 'form',   name: 'helloWorld'}
                    ];
                assert.equal(sourceBuilderUtils.getFormNameFromComponents(components), 'helloWorld');
            }
        );
        it(
            'Should get show proc name from formName',
            () => {
                assert.equal(sourceBuilderUtils.getShowProcNameFromFormName('testForm'), 'showTestFormForm');
                assert.equal(sourceBuilderUtils.getShowProcNameFromFormName('a'),        'showAForm');
            }
        );
        it(
            'Should get show proc name from filename',
            () => {
                assert.equal(sourceBuilderUtils.getProcNameFromFilename('testForm.whl'), 'TestFormForm');
                assert.equal(sourceBuilderUtils.getProcNameFromFilename('a.whl'),        'AForm');
            }
        );
        it(
            'Should get form code from filename',
            () => {
                assert.deepEqual(
                    sourceBuilderUtils.getFormCode('testForm.whl'),
                    [
                        '',
                        '#resource "testForm.wfrm"',
                        '',
                        '; @proc                   Show the form.',
                        '; @ret                    The handle to the form.',
                        'proc showTestFormForm()',
                        '    ret components.form.show("testForm.wfrm")',
                        'end',
                        ''
                    ]
                );
            }
        );
        it(
            'Should get includes from components',
            () => {
                let components = [
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
                let includes = sourceBuilderUtils.generateIncludesFromComponents(components);
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
            'Should remove first duplicate empty lines',
            () => {
                assert.deepEqual(
                    sourceBuilderUtils.removeDuplicateEmptyLines([
                        '',
                        '',
                        'proc test()'
                    ]),
                    [
                        '',
                        'proc test()'
                    ]
                );
            }
        );
        it(
            'Should remove middle duplicate empty lines',
            () => {
                assert.deepEqual(
                    sourceBuilderUtils.removeDuplicateEmptyLines([
                        '#include "lib/standard.whl',
                        '',
                        '',
                        'proc test()'
                    ]),
                    [
                        '#include "lib/standard.whl',
                        '',
                        'proc test()'
                    ]
                );
            }
        );
        it(
            'Should remove last duplicate empty lines',
            () => {
                assert.deepEqual(
                    sourceBuilderUtils.removeDuplicateEmptyLines([
                        '#include "lib/standard.whl',
                        '',
                        'proc test()',
                        '',
                        ''
                    ]),
                    [
                        '#include "lib/standard.whl',
                        '',
                        'proc test()',
                        ''
                    ]
                );
            }
        );
        it(
            'Should generate an include list from components',
            () => {
                let includes = sourceBuilderUtils.generateIncludesFromComponents([
                        {type: formEditorConstants.COMPONENT_TYPE_BUTTON},
                        {type: formEditorConstants.COMPONENT_TYPE_CHECKBOX}
                    ]);
                assert.deepEqual(includes, ['lib/components/button.whl', 'lib/components/checkbox.whl']);
            }
        );
        it(
            'Should get defines from components',
            () => {
                let components = [
                        {type: formEditorConstants.COMPONENT_TYPE_FORM,     name: 'myForm',   uid: '0x123'},
                        {type: formEditorConstants.COMPONENT_TYPE_CHECKBOX, name: 'checkbox', uid: '0x005'},
                        {type: formEditorConstants.COMPONENT_TYPE_BUTTON,   name: 'button1',  uid: '0x913'}
                    ];
                let defines = sourceBuilderUtils.generateDefinesFromComponents('myForm', components);
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
        describe(
            'Test update includes',
            () => {
                it(
                    'Should add new include',
                    () => {
                        let lines = [];
                        sourceBuilderUtils.updateLinesWithIncludes(
                            lines,
                            {
                                components: [
                                    {type: 'BUTTON'}
                                ]
                            }
                        );
                        assert.deepEqual(['#include "lib/components/button.whl"'], lines);
                    }
                );
                it(
                    'Should ignore existing include',
                    () => {
                        let lines = ['#include "lib/components/button.whl"'];
                        sourceBuilderUtils.updateLinesWithIncludes(
                            lines,
                            {
                                components: [
                                    {type: 'BUTTON'}
                                ]
                            }
                        );
                        assert.deepEqual(['#include "lib/components/button.whl"'], lines);
                    }
                );
                it(
                    'Should add to existing includes',
                    () => {
                        let lines = ['#include "lib/components/button.whl"'];
                        sourceBuilderUtils.updateLinesWithIncludes(
                            lines,
                            {
                                components: [
                                    {type: 'checkbox'} // Test lowercase
                                ]
                            }
                        );
                        assert.deepEqual(
                            lines,
                            [
                                '#include "lib/components/button.whl"',
                                '#include "lib/components/checkbox.whl"'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test create project',
            () => {
                it(
                    'Should create a basic project',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.createProjectFile({
                                filename:     'testProject.whlp',
                                description:  'Basic project',
                                includeFiles: []
                            }),
                            [
                                '#project "Basic project"',
                                '',
                                'proc main()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should create a basic project with include files',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.createProjectFile({
                                filename:     'testProject.whlp',
                                description:  'Basic project',
                                includeFiles: ['lib/standard.whl']
                            }),
                            [
                                '#project "Basic project"',
                                '',
                                '#include "lib/standard.whl"',
                                '',
                                'proc main()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should create a project with a form',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.createProjectFile({
                                filename:     'testProject.whlp',
                                description:  'Basic project',
                                includeFiles: [],
                                createForm:   true
                            }),
                            [
                                '#project "Basic project"',
                                '',
                                '#include "lib/standard.whl"',
                                '#include "lib/components/component.whl"',
                                '#include "lib/components/form.whl"',
                                '',
                                '#resource "testProject.wfrm"',
                                '',
                                '; @proc                   Show the form.',
                                '; @ret                    The handle to the form.',
                                'proc showTestProjectForm()',
                                '    ret components.form.show("testProject.wfrm")',
                                'end',
                                '',
                                'proc main()',
                                '    showTestProjectForm()',
                                '    halt()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should create a project with a form and a standard form include file',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.createProjectFile({
                                filename:     'testProject.whlp',
                                description:  'Basic project',
                                includeFiles: ['lib/standard.whl'],
                                createForm:   true
                            }),
                            [
                                '#project "Basic project"',
                                '',
                                '#include "lib/standard.whl"',
                                '#include "lib/components/component.whl"',
                                '#include "lib/components/form.whl"',
                                '',
                                '#resource "testProject.wfrm"',
                                '',
                                '; @proc                   Show the form.',
                                '; @ret                    The handle to the form.',
                                'proc showTestProjectForm()',
                                '    ret components.form.show("testProject.wfrm")',
                                'end',
                                '',
                                'proc main()',
                                '    showTestProjectForm()',
                                '    halt()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should create a project with a form and an additional include file',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.createProjectFile({
                                filename:     'testProject.whlp',
                                description:  'Basic project',
                                includeFiles: ['lib/math.whl'],
                                createForm:   true
                            }),
                            [
                                '#project "Basic project"',
                                '',
                                '#include "lib/math.whl"',
                                '#include "lib/standard.whl"',
                                '#include "lib/components/component.whl"',
                                '#include "lib/components/form.whl"',
                                '',
                                '#resource "testProject.wfrm"',
                                '',
                                '; @proc                   Show the form.',
                                '; @ret                    The handle to the form.',
                                'proc showTestProjectForm()',
                                '    ret components.form.show("testProject.wfrm")',
                                'end',
                                '',
                                'proc main()',
                                '    showTestProjectForm()',
                                '    halt()',
                                'end'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test generate source from components',
            () => {
                it(
                    'Should generate with form without project',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateSourceFromComponents({
                                project:             false,
                                createEventComments: false,
                                components:          [
                                    {type: formEditorConstants.COMPONENT_TYPE_FORM, name: 'test'}
                                ]
                            }),
                            [
                                '#include "lib/components/form.whl"',
                                '',
                                '#resource "test.wfrm"',
                                '',
                                'proc showTestForm()',
                                '    ret components.form.show("test.wfrm")',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should generate with form and project',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateSourceFromComponents({
                                project:             true,
                                createEventComments: false,
                                components:          [
                                    {type: formEditorConstants.COMPONENT_TYPE_FORM, name: 'test'}
                                ]
                            }),
                            [
                                '#project "test"',
                                '',
                                '#include "lib/standard.whl"',
                                '#include "lib/components/component.whl"',
                                '#include "lib/components/form.whl"',
                                '',
                                '#resource "test.wfrm"',
                                '',
                                'proc showTestForm()',
                                '    ret components.form.show("test.wfrm")',
                                'end',
                                '',
                                'proc main()',
                                '    showTestForm()',
                                '    halt()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should generate with form, project and comments',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateSourceFromComponents({
                                project:             true,
                                createEventComments: true,
                                components:          [
                                    {type: formEditorConstants.COMPONENT_TYPE_FORM, name: 'test'}
                                ]
                            }),
                            [
                                '#project "test"',
                                '',
                                '#include "lib/standard.whl"',
                                '#include "lib/components/component.whl"',
                                '#include "lib/components/form.whl"',
                                '',
                                '#resource "test.wfrm"',
                                '',
                                '; @proc                   Show the form.',
                                '; @ret                    The handle to the form.',
                                'proc showTestForm()',
                                '    ret components.form.show("test.wfrm")',
                                'end',
                                '',
                                'proc main()',
                                '    showTestForm()',
                                '    halt()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should generate with form and button',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateSourceFromComponents({
                                project:             true,
                                createEventComments: true,
                                components:          [
                                    {type: formEditorConstants.COMPONENT_TYPE_FORM,   name: 'test'},
                                    {type: formEditorConstants.COMPONENT_TYPE_BUTTON, name: 'btn1', uid: 75}
                                ]
                            }),
                            [
                                '#project "test"',
                                '',
                                '#include "lib/standard.whl"',
                                '#include "lib/components/component.whl"',
                                '#include "lib/components/button.whl"',
                                '#include "lib/components/form.whl"',
                                '',
                                '#define TEST_BTN1 75',
                                '',
                                '#resource "test.wfrm"',
                                '',
                                '; @proc                   Show the form.',
                                '; @ret                    The handle to the form.',
                                'proc showTestForm()',
                                '    ret components.form.show("test.wfrm")',
                                'end',
                                '',
                                'proc main()',
                                '    showTestForm()',
                                '    halt()',
                                'end'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test generate event proc',
            () => {
                it(
                    'Should not generate event proc because of unknown event',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateEventProc({
                                componentName:       'Btn1',
                                componentType:       formEditorConstants.COMPONENT_TYPE_BUTTON,
                                eventType:           'onWrong',
                                procName:            'btn1OnClick',
                                createEventComments: false,
                                database:            { findProc(procName) { return false; }} // Not found, create a new procedure...
                            }),
                            []
                        );
                    }
                );
                it(
                    'Should not generate event proc because of unknown missing proc name',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateEventProc({
                                componentName:       'Btn1',
                                componentType:       formEditorConstants.COMPONENT_TYPE_BUTTON,
                                eventType:           'onWrong',
                                createEventComments: false,
                                database:            { findProc(procName) { return false; }} // Not found, create a new procedure...
                            }),
                            []
                        );
                    }
                );
                it(
                    'Should generate event proc without comments',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateEventProc({
                                componentName:       'Btn1',
                                componentType:       formEditorConstants.COMPONENT_TYPE_BUTTON,
                                eventType:           'onClick',
                                procName:            'btn1OnClick',
                                createEventComments: false,
                                database:            { findProc(procName) { return false; }} // Not found, create a new procedure...
                            }),
                            [
                                'proc btn1OnClick(number windowHandle)',
                                '    printS("Click Btn1 button.")',
                                'end',
                                ''
                            ]
                        );
                    }
                );
                it(
                    'Should generate event proc with comments',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.generateEventProc({
                                componentName:       'Btn1',
                                componentType:       formEditorConstants.COMPONENT_TYPE_BUTTON,
                                eventType:           'onClick',
                                procName:            'btn1OnClick',
                                createEventComments: true,
                                database:            { findProc(procName) { return false; }} // Not found, create a new procedure...
                            }),
                            [
                                '; @proc                   Button onClick event.',
                                '; @param windowHandle     The handle to the active window.',
                                'proc btn1OnClick(number windowHandle)',
                                '    printS("Click Btn1 button.")',
                                'end',
                                ''
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test find procedure',
            () => {
                it(
                    'Should not find procedure',
                    () => {
                        assert.equal(sourceBuilderUtils.findProcedure([], 'test'), null);
                    }
                );
                it(
                    'Should find procedure',
                    () => {
                        assert.equal(sourceBuilderUtils.findProcedure([{name: 'test'}], 'test'), 'test');
                    }
                );
            }
        );
        describe(
            'Test find procedures',
            () => {
                it(
                    'Should not find procedures in lines',
                    () => {
                        assert.equal(sourceBuilderUtils.findProcedures([]).length, 0);
                    }
                );
                it(
                    'Should not find invalid procedure',
                    () => {
                        assert.equal(
                            sourceBuilderUtils.findProcedures([
                                'proc test',
                                'end'
                            ]).length,
                            0
                        );
                    }
                );
                it(
                    'Should find one procedure',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.findProcedures([
                                'proc test()',
                                'end'
                            ]),
                            [{
                                name:  'test',
                                index: 0
                            }]
                        );
                    }
                );
                it(
                    'Should find two procedures',
                    () => {
                        assert.deepEqual(
                            sourceBuilderUtils.findProcedures([
                                'proc test1()',
                                'end',
                                '',
                                'proc test2()',
                                'end'
                            ]),
                            [
                                {name: 'test1', index: 0},
                                {name: 'test2', index: 3}
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test insert procedure',
            () => {
                it(
                    'Should insert after existing procedure',
                    () => {
                        let lines = [
                                'proc a()',
                                'end'
                            ];
                        let newProc = [
                                'proc b()',
                                'end'
                            ];
                        let procedures = sourceBuilderUtils.findProcedures(lines);
                        sourceBuilderUtils.insertProc(lines, procedures, 'b', newProc);
                        assert.deepEqual(
                            lines,
                            [
                                'proc a()',
                                'end',
                                '',
                                'proc b()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should insert before existing procedure',
                    () => {
                        let lines = [
                                'proc b()',
                                'end'
                            ];
                        let newProc = [
                                'proc a()',
                                'end'
                            ];
                        let procedures = sourceBuilderUtils.findProcedures(lines);
                        sourceBuilderUtils.insertProc(lines, procedures, 'a', newProc);
                        assert.deepEqual(
                            lines,
                            [
                                'proc a()',
                                'end',
                                '',
                                'proc b()',
                                'end'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test update event names',
            () => {
                it(
                    'Should not update event name',
                    () => {
                        let lines = [
                                'proc hello()',
                                'end'
                            ];
                        sourceBuilderUtils.updateEventNames({
                            lines: lines,
                            renameEvents: [
                                {oldName: 'x', newName: 'world'}
                            ]
                        });
                        assert.deepEqual(
                            lines,
                            [
                                'proc hello()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should update event name',
                    () => {
                        let lines = [
                                'proc hello()',
                                'end'
                            ];
                        sourceBuilderUtils.updateEventNames({
                            lines: lines,
                            renameEvents: [
                                {oldName: 'hello', newName: 'world'}
                            ]
                        });
                        assert.deepEqual(
                            lines,
                            [
                                'proc world()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should update event names',
                    () => {
                        let lines = [
                                'proc hello()',
                                'end',
                                '',
                                'proc world()',
                                'end'
                            ];
                        sourceBuilderUtils.updateEventNames({
                            lines: lines,
                            renameEvents: [
                                {oldName: 'hello', newName: 'world'},
                                {oldName: 'world', newName: 'hello'}
                            ]
                        });
                        assert.deepEqual(
                            lines,
                            [
                                'proc world()',
                                'end',
                                '',
                                'proc hello()',
                                'end'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test update component name',
            () => {
                it(
                    'Should not update component name',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN 0x0345'
                            ];
                        sourceBuilderUtils.updateComponentName({
                            formName: 'testForm',
                            oldName:  'btn1',
                            newName:  'btn2',
                            lines:    lines
                        });
                        assert.deepEqual(lines, ['#define TEST_FORM_BTN 0x0345']);
                    }
                );
                it(
                    'Should update component name',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN 0x0345'
                            ];
                        sourceBuilderUtils.updateComponentName({
                            formName: 'testForm',
                            oldName:  'btn',
                            newName:  'btn1',
                            lines:    lines
                        });
                        assert.deepEqual(lines, ['#define TEST_FORM_BTN1 0x0345']);
                    }
                );
                it(
                    'Should update component name and align defines',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN 0x0345',
                                '#define TEST_FORM_A 0x1234'
                            ];
                        sourceBuilderUtils.updateComponentName({
                            formName: 'testForm',
                            oldName:  'btn',
                            newName:  'btn1',
                            lines:    lines
                        });
                        assert.deepEqual(
                            lines,
                            [
                                '#define TEST_FORM_BTN1 0x0345',
                                '#define TEST_FORM_A    0x1234'
                            ]
                        );
                    }
                );
                it(
                    'Should update component name and remove duplicate define',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN 0x0345',
                                '#define TEST_FORM_A 0x1234',
                                '#define TEST_FORM_A 0x1234'
                            ];
                        sourceBuilderUtils.updateComponentName({
                            formName: 'testForm',
                            oldName:  'btn',
                            newName:  'btn1',
                            lines:    lines
                        });
                        assert.deepEqual(
                            lines,
                            [
                                '#define TEST_FORM_BTN1 0x0345',
                                '#define TEST_FORM_A    0x1234'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test delete component',
            () => {
                it(
                    'Should not delete component',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN 0x0345'
                            ];
                        sourceBuilderUtils.deleteComponent({
                            formName:   'testForm',
                            components: [{name: 'btn1'}],
                            lines:      lines
                        });
                        assert.deepEqual(lines, ['#define TEST_FORM_BTN 0x0345']);
                    }
                );
                it(
                    'Should delete component',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN  0x0345',
                                '#define TEST_FORM_BTN1 0x0347'
                            ];
                        sourceBuilderUtils.deleteComponent({
                            formName:   'testForm',
                            components: [{name: 'btn'}],
                            lines:      lines
                        });
                        assert.deepEqual(lines, ['#define TEST_FORM_BTN1 0x0347']);
                    }
                );
                it(
                    'Should delete components',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN  0x0345',
                                '#define TEST_FORM_BTN1 0x0347'
                            ];
                        sourceBuilderUtils.deleteComponent({
                            formName:   'testForm',
                            components: [{name: 'btn'}, {name: 'btn1'}],
                            lines:      lines
                        });
                        assert.deepEqual(lines, []);
                    }
                );
            }
        );
        describe(
            'Test update form name and remove defines',
            () => {
                it(
                    'Should not delete define and rename show proc',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN1 0x0347',
                                '#define KEEP_FORM_BTN1 0x0347',
                                '',
                                'proc showTestFormForm()',
                                'end'
                            ];
                        sourceBuilderUtils.updateFormNameAndRemoveDefines({
                            lines:      lines,
                            oldName:    'noForm',
                            newName:    'newName',
                            components: [
                                {type: formEditorConstants.COMPONENT_TYPE_BUTTON, name: 'btn1'}
                            ]
                        });
                        assert.deepEqual(
                            lines,
                            [
                                '#define TEST_FORM_BTN1 0x0347',
                                '#define KEEP_FORM_BTN1 0x0347',
                                '',
                                'proc showTestFormForm()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should delete define and rename show proc',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN1 0x0347',
                                '#define KEEP_FORM_BTN1 0x0347',
                                '',
                                'proc showTestFormForm()',
                                'end'
                            ];
                        sourceBuilderUtils.updateFormNameAndRemoveDefines({
                            lines:      lines,
                            oldName:    'testForm',
                            newName:    'newName',
                            components: [
                                {type: formEditorConstants.COMPONENT_TYPE_BUTTON, name: 'btn1'}
                            ]
                        });
                        assert.deepEqual(
                            lines,
                            [
                                '#define KEEP_FORM_BTN1 0x0347',
                                '',
                                'proc showNewNameForm()',
                                'end'
                            ]
                        );
                    }
                );
                it(
                    'Should delete define and rename show proc, only delete known component',
                    () => {
                        let lines = [
                                '#define TEST_FORM_BTN1 0x0347',
                                '#define TEST_FORM_BTN2 0x0123',
                                '#define KEEP_FORM_BTN1 0x0789',
                                '',
                                'proc showTestFormForm()',
                                'end'
                            ];
                        sourceBuilderUtils.updateFormNameAndRemoveDefines({
                            lines:      lines,
                            oldName:    'testForm',
                            newName:    'newName',
                            components: [
                                {type: formEditorConstants.COMPONENT_TYPE_BUTTON, name: 'btn1'}
                            ]
                        });
                        assert.deepEqual(
                            lines,
                            [
                                '#define TEST_FORM_BTN2 0x0123',
                                '#define KEEP_FORM_BTN1 0x0789',
                                '',
                                'proc showNewNameForm()',
                                'end'
                            ]
                        );
                    }
                );
            }
        );
        describe(
            'Test remove existing defines',
            () => {
                it(
                    'Should not remove existing define',
                    () => {
                        let lines = [
                                '',
                                '#define TEST_FORM_BTN2 0x0123',
                                ''
                            ];
                        let insertPosition = sourceBuilderUtils.removeExistingDefines({
                                lines: lines,
                                defines: {
                                    definesByName: {}
                                }
                            });
                        assert.equal(insertPosition, -1);
                        assert.deepEqual(
                            lines,
                            [
                                '',
                                '#define TEST_FORM_BTN2 0x0123',
                                ''
                            ]
                        );
                    }
                );
                it(
                    'Should remove existing define',
                    () => {
                        let lines = [
                                '',
                                '#define TEST_FORM_BTN2 0x0123',
                                ''
                            ];
                        let insertPosition = sourceBuilderUtils.removeExistingDefines({
                                lines: lines,
                                defines: {
                                    definesByName: {
                                        TEST_FORM_BTN2: true
                                    }
                                }
                            });
                        assert.equal(insertPosition, 1);
                        assert.deepEqual(lines, ['', '']);
                    }
                );
                it(
                    'Should not remove existing define, get insert position',
                    () => {
                        let lines = [
                                '#include "lib/standard.whl',
                                ''
                            ];
                        let insertPosition = sourceBuilderUtils.removeExistingDefines({
                                lines: lines,
                                defines: {
                                    definesByName: {}
                                }
                            });
                        assert.equal(insertPosition, 2);
                        assert.deepEqual(
                            lines,
                            [
                                '#include "lib/standard.whl',
                                ''
                            ]
                        );
                    }
                );
            }
        );
    }
);
