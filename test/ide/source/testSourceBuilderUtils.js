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
                let includes = sourceBuilderUtils.generateIncludesFromComponents([{type: 'BUTTON'}, {type: 'CHECKBOX'}]);
                assert.deepEqual(includes, ['lib/components/button.whl', 'lib/components/checkbox.whl']);
            }
        );
        it(
            'Should get defines from components',
            () => {
                let components = [
                        {type: 'form',     name: 'myForm',   uid: '0x123'},
                        {type: 'checkbox', name: 'checkbox', uid: '0x005'},
                        {type: 'button',   name: 'button1',  uid: '0x913'}
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
    }
);
