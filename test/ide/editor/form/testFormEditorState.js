/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../js/frontend/lib/dispatcher').dispatcher;
const ContainerIdsForForm = require('../../../../js/frontend/ide/editor/editors/form/ContainerIdsForForm').ContainerIdsForForm;
const FormEditorState     = require('../../../../js/frontend/ide/editor/editors/form/state/FormEditorState').FormEditorState;
const formEditorConstants = require('../../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

afterEach(() => {
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
            hAlign:   'left'
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
            name:     'Label1',
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

const getFormEditorState0 = () => {
        return new FormEditorState({
            containerIdsForForm: new ContainerIdsForForm(),
            initTime:            2,
            path:                'hello/world',
            filename:            'test.wfrm',
            data:                EMPTY_FORM,
            settings:            {getFormGridSize() { return 10; }}
        });
    };

const getFormEditorState1 = () => {
        return new FormEditorState({
            containerIdsForForm: new ContainerIdsForForm(),
            initTime:            2,
            path:                'hello/world',
            filename:            'test.wfrm',
            data:                FORM_WITH_ONE_COMPONENT,
            settings:            {getFormGridSize() { return 10; }}
        });
    };

const getFormEditorState2 = () => {
        return new FormEditorState({
            containerIdsForForm: new ContainerIdsForForm(),
            initTime:            2,
            path:                'hello/world',
            filename:            'test.wfrm',
            data:                FORM_WITH_TWO_COMPONENTS,
            settings:            {getFormGridSize() { return 10; }}
        });
    };

describe(
    'Test FormEditorState',
    () => {
        describe(
            'Test constructor',
            () => {
                it(
                    'Should create FormEditorState instance',
                    () => {
                        let formEditorState = new FormEditorState({
                                containerIdsForForm: new ContainerIdsForForm(),
                                path:                'hello/world',
                                filename:            'test.wfrm'
                            });
                        assert.equal(formEditorState instanceof FormEditorState, true);
                        formEditorState.remove();
                    }
                );
                it(
                    'Should peek initial Id',
                    (done) => {
                        let formEditorState = new FormEditorState({
                                containerIdsForForm: new ContainerIdsForForm(),
                                initTime:            2,
                                path:                'hello/world',
                                filename:            'test.wfrm'
                            });
                        formEditorState.on(
                            'AddForm',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 1);
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
            () => {
                it(
                    'Should load an empty form',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(),      2);
                                assert.equal(formEditorState.getFormName(), 'label');
                                let data = formEditorState.getData();
                                assert.equal(data[0].id, 1);
                                assert.equal(formEditorState.getFormComponent().name, 'label');
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
                    (done) => {
                        let formEditorState = getFormEditorState1();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 3);
                                let data = formEditorState.getData();
                                assert.equal(data[0].id,       1);
                                assert.equal(data[1].parentId, 1);
                                assert.equal(data[1].id,       2);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should load a form with two components',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.peekId(), 4);
                                let data = formEditorState.getData();
                                assert.equal(data[0].id,       1);
                                assert.equal(data[1].parentId, 1);
                                assert.equal(data[1].id,       2);
                                assert.equal(data[2].parentId, 1);
                                assert.equal(data[2].id,       3);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
            }
        );
        it(
            'Should get a component by id',
            (done) => {
                let formEditorState = getFormEditorState1();
                formEditorState.on(
                    'Loaded',
                    this,
                    () => {
                        let component = formEditorState.getComponentById(1);
                        assert.equal(component.type,     'form');
                        component = formEditorState.getComponentById(2);
                        assert.equal(component.id,       2);
                        assert.equal(component.parentId, 1);
                        assert.equal(formEditorState.getComponentById(3), undefined);
                        done();
                    }
                );
                assert.equal(formEditorState.peekId(), 1);
            }
        );
        it(
            'Should get a component texts',
            (done) => {
                let formEditorState = getFormEditorState2();
                formEditorState.on(
                    'Loaded',
                    this,
                    () => {
                        // There's a label caller "Label1"...
                        assert.equal(formEditorState.getComponentList().findComponentText('label', 'name', 'Label'), 'Label2');
                        // There's no input yet...
                        assert.equal(formEditorState.getComponentList().findComponentText('input', 'name', 'Input'), 'Input1');
                        done();
                    }
                );
                assert.equal(formEditorState.peekId(), 1);
            }
        );
        describe(
            'Test deleting',
            () => {
                it(
                    'Should delete a component',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.deleteComponentById(2, false);
                                let data = formEditorState.getData();
                                assert.equal(data.length, 2);
                                assert.equal(data[0].id,  1);
                                assert.equal(data[1].id,  3);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should delete a component, get renumbered ids',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.deleteComponentById(2, false);
                                let data = formEditorState.getData(true);
                                assert.equal(data.length, 2);
                                assert.equal(data[0].id,  1);
                                assert.equal(data[1].id,  2); // <-- This one!!!
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should delete a component, save undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length,     3);
                                assert.equal(formEditorState.getUndoStackLength(), 0);
                                assert.equal(formEditorState.getHasUndo(),         false);
                                formEditorState.deleteComponentById(2, true);
                                assert.equal(formEditorState.getUndoStackLength(), 1);
                                assert.equal(formEditorState.getHasUndo(),         true);
                                let data = formEditorState.getData(true);
                                assert.equal(data.length, 2);
                                assert.equal(data[0].id,  1);
                                assert.equal(data[1].id,  2); // <-- This one!!!
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should delete a component, apply undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length,     3);
                                assert.equal(formEditorState.getUndoStackLength(), 0);
                                let component0 = formEditorState.getComponentById(2);
                                formEditorState.deleteComponentById(2, true);
                                assert.equal(formEditorState.getUndoStackLength(), 1);
                                formEditorState.undo();
                                let component1 = formEditorState.getComponentById(2);
                                for (let i in component0) {
                                    // The parentId is based on the owner which is the DOM node, ignore it here:
                                    if ((typeof component0[i] !== 'object') && (i !== 'parentId')) {
                                        assert.equal(component0[i], component1[i]);
                                    }
                                }
                                assert.equal(formEditorState.getUndoStackLength(), 0);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should delete active component',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.deleteActiveComponent();
                                assert.equal(formEditorState.getData().length, 2);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a tabs component and add a child component and delete tabs',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                formEditorState.addComponent({
                                    type:     formEditorConstants.COMPONENT_TYPE_LABEL,
                                    parentId: 3
                                });
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.deleteComponentById(2);
                                assert.equal(formEditorState.getData().length, 1);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a tabs component, add a child component, delete tabs and undo',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                formEditorState.addComponent({
                                    type:     formEditorConstants.COMPONENT_TYPE_LABEL,
                                    parentId: 3
                                });
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.deleteComponentById(2, true);
                                assert.equal(formEditorState.getData().length, 1);
                                formEditorState.undo();
                                assert.equal(formEditorState.getData().length, 3);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a tabs component, add a panel with child component, delete tabs and undo',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                formEditorState.addComponent({
                                    type:     formEditorConstants.COMPONENT_TYPE_PANEL,
                                    parentId: 3
                                });
                                formEditorState.addComponent({
                                    type:     formEditorConstants.COMPONENT_TYPE_LABEL,
                                    parentId: 6
                                });
                                let data = formEditorState.getData();
                                assert.equal(data.length, 4);
                                assert.deepEqual(data[1].containerIds, [3, 4]);
                                assert.equal(data[2].parentId, 3);
                                assert.deepEqual(data[2].containerIds, [6]);
                                assert.equal(data[3].parentId, 6);
                                formEditorState.deleteComponentById(2, true);
                                assert.equal(formEditorState.getData().length, 1);
                                formEditorState.undo();
                                data = formEditorState.getData();
                                assert.equal(data.length, 4);
                                assert.deepEqual(data[1].containerIds, [3, 4]);
                                assert.equal(data[2].parentId, 3);
                                assert.deepEqual(data[2].containerIds, [6]);
                                assert.equal(data[3].parentId, 6);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
            }
        );
        describe(
            'Test adding',
            () => {
                it(
                    'Should add a component',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                assert.equal(formEditorState.getData().length, 4);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a component and undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                let data = formEditorState.getData();
                                assert.equal(data[0].id,  1);
                                assert.equal(data[1].id,  2);
                                assert.equal(data[2].id,  3);
                                assert.equal(data[3].id,  4);
                                assert.equal(data.length, 4);
                                formEditorState.undo();
                                data = formEditorState.getData();
                                assert.equal(data.length, 3);
                                assert.equal(data[0].id,  1);
                                assert.equal(data[1].id,  2);
                                assert.equal(data[2].id,  3);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a component check active component',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                let activeComponent = formEditorState.getActiveComponent();
                                assert.equal(activeComponent.type, formEditorConstants.COMPONENT_TYPE_LABEL);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a component check active component type',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                assert.equal(formEditorState.getActiveComponentType(), formEditorConstants.COMPONENT_TYPE_LABEL);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a component, can copy',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                assert.equal(formEditorState.getCanCopy(), true);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a component, can not copy',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                assert.equal(formEditorState.getCanCopy(), false);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a component and check component list',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                let activeComponent = formEditorState.getActiveComponent();
                                let list            = activeComponent.propertyList.getList();
                                let types           = {};
                                list.forEach((propery) => {
                                    types[propery.type] = true;
                                });
                                assert.equal('id'       in types, true);
                                assert.equal('uid'      in types, true);
                                assert.equal('parentId' in types, true);
                                assert.strictEqual(formEditorState.getActiveComponentParentId(), null);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a tabs component check container ids',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                let activeComponent = formEditorState.getActiveComponent();
                                assert.deepEqual(activeComponent.containerIds, [5, 6]);
                                assert.deepEqual(formEditorState.getActiveComponentParentId(), [5, 6]);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
                it(
                    'Should add a panel component check container ids',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getData().length, 3);
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_PANEL
                                });
                                let activeComponent = formEditorState.getActiveComponent();
                                assert.deepEqual(activeComponent.containerIds, [5]);
                                assert.deepEqual(formEditorState.getActiveComponentParentId(), [5]);
                                done();
                            }
                        );
                        assert.equal(formEditorState.peekId(), 1);
                    }
                );
            }
        );
        describe(
            'Test setting a position',
            () => {
                it(
                    'Should set component position',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                delete component.uid;
                                assert.deepEqual(
                                    component,
                                    {
                                        type:       'label',
                                        id:         4,
                                        tabIndex:   0,
                                        hidden:     false,
                                        disabled:   false,
                                        name:       'Label2',
                                        zIndex:     0,
                                        text:       'Label2',
                                        fontSize:   16,
                                        hAlign:     'left',
                                        x:          10,
                                        y:          20
                                    }
                                );
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should set component position, align to grid',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 15, y: 25});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                delete component.uid;
                                assert.deepEqual(
                                    component,
                                    {
                                        type:       'label',
                                        id:         4,
                                        tabIndex:   0,
                                        hidden:     false,
                                        disabled:   false,
                                        name:       'Label2',
                                        zIndex:     0,
                                        text:       'Label2',
                                        fontSize:   16,
                                        hAlign:     'left',
                                        x:          20,
                                        y:          30
                                    }
                                );
                                done();
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test changing a property',
            () => {
                it(
                    'Should change position',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.x, 10);
                                assert.equal(component.y, 20);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change position and undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.x, 10);
                                assert.equal(component.y, 20);
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.x, 0);
                                assert.equal(component.y, 0);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change position twice and undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                formEditorState.setComponentPositionById(newId, {x: 40, y: 30});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.x, 40);
                                assert.equal(component.y, 30);
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.x, 0);
                                assert.equal(component.y, 0);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change zIndex',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                dispatcher.dispatch('Properties.Property.Change', newId, 'zIndex', 123);
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 123);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change zIndex and undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                // Set position to add an extra item on the undo stack...
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 0);
                                dispatcher.dispatch('Properties.Property.Change', newId, 'zIndex', 123);
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 123);
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 0);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change zIndex twice and undo',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                // Set position to add an extra item on the undo stack...
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 0);
                                dispatcher.dispatch('Properties.Property.Change', newId, 'zIndex', 456);
                                dispatcher.dispatch('Properties.Property.Change', newId, 'zIndex', 123);
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 123);
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.zIndex, 0);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change component name',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                formEditorState.setComponentPositionById(newId, {x: 10, y: 20});
                                dispatcher.dispatch('Properties.Property.Change', newId, 'name', 'newName');
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.name, 'newName');
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change form name',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_BUTTON
                                });
                                dispatcher.dispatch('Properties.Event.Change', newId, 'onClick', 'onLabelButton1Click');
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.onClick, 'onLabelButton1Click');
                                dispatcher.dispatch('Properties.Property.Change', 1, 'name', 'newName');
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.onClick, 'onNewNameButton1Click');
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should change form name and undo',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_BUTTON
                                });
                                dispatcher.dispatch('Properties.Event.Change', newId, 'onClick', 'onLabelButton1Click');
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.onClick, 'onLabelButton1Click');
                                dispatcher.dispatch('Properties.Property.Change', 1, 'name', 'newName');
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.onClick, 'onLabelButton1Click');
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should remove tab and undo',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.deepEqual(component.tabs,         ['Tab(1)', 'Tab(2)']);
                                assert.deepEqual(component.containerIds, [3, 4]);
                                dispatcher.dispatch('Properties.Property.Change', newId, 'tabs', ['Test']);
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.deepEqual(component.tabs,         ['Test']);
                                assert.deepEqual(component.containerIds, [3]);
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.deepEqual(component.tabs,         ['Tab(1)', 'Tab(2)']);
                                assert.deepEqual(component.containerIds, [3, 6]);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should remove tab with child component and undo',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                formEditorState.addComponent({
                                    type:     formEditorConstants.COMPONENT_TYPE_LABEL,
                                    parentId: 4
                                });
                                let data = formEditorState.getData();
                                assert.deepEqual(data.length,          3);
                                assert.deepEqual(data[1].tabs,         ['Tab(1)', 'Tab(2)']);
                                assert.deepEqual(data[1].containerIds, [3, 4]);
                                assert.deepEqual(data[2].parentId,     4);
                                dispatcher.dispatch('Properties.Property.Change', newId, 'tabs', ['Test']);
                                data = formEditorState.getData();
                                assert.deepEqual(data.length,          2);
                                assert.deepEqual(data[1].tabs,         ['Test']);
                                assert.deepEqual(data[1].containerIds, [3]);
                                formEditorState.undo();
                                data = formEditorState.getData();
                                assert.deepEqual(data.length,          3);
                                assert.deepEqual(data[1].tabs,         ['Tab(1)', 'Tab(2)']);
                                assert.deepEqual(data[1].containerIds, [3, 7]);
                                assert.deepEqual(data[2].parentId,     7);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should add a tab and undo',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_TABS
                                });
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.deepEqual(component.tabs,         ['Tab(1)', 'Tab(2)']);
                                assert.deepEqual(component.containerIds, [3, 4]);
                                dispatcher.dispatch('Properties.Property.Change', newId, 'tabs', ['A', 'B', 'C']);
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.deepEqual(component.tabs,         ['A', 'B', 'C']);
                                assert.deepEqual(component.containerIds, [3, 4, 5]);
                                formEditorState.undo();
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.deepEqual(component.tabs,         ['Tab(1)', 'Tab(2)']);
                                assert.deepEqual(component.containerIds, [3, 4]);
                                done();
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test changing an event',
            () => {
                it(
                    'Should change event',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                dispatcher.dispatch('Properties.Event.Change', newId, 'onClick', 'onClickEvent');
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.onClick, 'onClickEvent');
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should remove event',
                    (done) => {
                        let formEditorState = getFormEditorState2();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                let newId = formEditorState.peekId();
                                formEditorState.addComponent({
                                    type: formEditorConstants.COMPONENT_TYPE_LABEL
                                });
                                dispatcher.dispatch('Properties.Event.Change', newId, 'onClick', 'onClickEvent');
                                let component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal(component.onClick, 'onClickEvent');
                                dispatcher.dispatch('Properties.Event.Change', newId, 'onClick', false);
                                component = formEditorState.getComponentList().getComponentClone(newId);
                                assert.equal('onClick' in component, false);
                                done();
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Test clipboard',
            () => {
                it(
                    'Should not be able to copy',
                    (done) => {
                        let formEditorState = getFormEditorState0();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getCanCopy(), false);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should be able to copy',
                    (done) => {
                        let formEditorState = getFormEditorState1();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getCanCopy(), true);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should copy',
                    (done) => {
                        let formEditorState = getFormEditorState1();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getCanPaste(), false);
                                formEditorState.copy();
                                assert.equal(formEditorState.getCanPaste(), true);
                                done();
                            }
                        );
                    }
                );
                it(
                    'Should paste',
                    (done) => {
                        let formEditorState = getFormEditorState1();
                        formEditorState.on(
                            'Loaded',
                            this,
                            () => {
                                assert.equal(formEditorState.getCanPaste(), false);
                                let data = formEditorState.getData();
                                assert.equal(data.length, 2);
                                formEditorState.copy();
                                formEditorState.paste(1, null);
                                data = formEditorState.getData();
                                assert.equal(data.length, 3);
                                assert.equal(data[2].type, data[1].type);
                                assert.equal(data[2].x,    data[1].x + 32);
                                assert.equal(data[2].y,    data[1].y + 32);
                                done();
                            }
                        );
                    }
                );
            }
        );
    }
);
