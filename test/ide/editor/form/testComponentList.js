/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const ComponentList       = require('../../../../js/frontend/ide/editor/editors/form/state/ComponentList').ComponentList;
const formEditorConstants = require('../../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test ComponentList',
    () => {
        it(
            'Should create ComponentList',
            () => {
                let componentList = new ComponentList({});
                assert.notEqual(componentList, null);
            }
        );
        it(
            'Should set and get component by Id',
            () => {
                let componentList = new ComponentList({});
                componentList.setComponentById({test: true}, 13);
                assert.deepEqual(componentList.getComponentById(13), {test: true});
            }
        );
        it(
            'Should get new component uid',
            () => {
                let componentList = new ComponentList({});
                componentList.setComponentById({test: true, uid: componentList.generateComponentUid()}, 13);
                assert.equal(componentList.getNewComponentUid().length, 10);
            }
        );
        it(
            'Should get name exists',
            () => {
                let componentList = new ComponentList({});
                let component     = {test: true, uid: componentList.generateComponentUid(), name: 'test', id: 13};
                componentList.setComponentById(component, component.id);
                assert.equal(componentList.getNameExists(null, 'test'), true);
            }
        );
        it(
            'Should not get name exists, component is equal to its self',
            () => {
                let componentList = new ComponentList({});
                let component     = {test: true, uid: componentList.generateComponentUid(), name: 'test', id: 13};
                componentList.setComponentById(component, component.id);
                assert.equal(componentList.getNameExists(component, 'test'), false);
            }
        );
        it(
            'Should not get name exists, unknown name',
            () => {
                let componentList = new ComponentList({});
                let component     = {test: true, uid: componentList.generateComponentUid(), name: 'test', id: 13};
                componentList.setComponentById(component, component.id);
                assert.equal(componentList.getNameExists(component, 'unknown'), false);
            }
        );
        it(
            'Should set and get active component id',
            () => {
                let componentList = new ComponentList({});
                componentList.setActiveComponentId(14);
                assert.equal(componentList.getActiveComponentId(), 14);
            }
        );
        it(
            'Should select component by id',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13};
                let component2    = {uid: uid2, name: 'test2', id: 14};
                let expected      = {uid: uid1, name: 'test1', id: 13};
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                assert.deepEqual(componentList.selectComponentById(13), expected);
            }
        );
        it(
            'Should not select component by id',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13};
                let component2    = {uid: uid2, name: 'test2', id: 14};
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                assert.equal(componentList.selectComponentById(1), false);
            }
        );
        it(
            'Should not delete component by unknown id',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13};
                let component2    = {uid: uid2, name: 'test2', id: 14};
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                assert.equal(componentList.deleteComponentById(1), null);
            }
        );
        it(
            'Should not delete active component by unknown id',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13};
                let component2    = {uid: uid2, name: 'test2', id: 14};
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                componentList.setActiveComponentId(1);
                assert.equal(componentList.deleteActiveComponent(), null);
            }
        );
        it(
            'Should get list',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13};
                let component2    = {uid: uid2, name: 'test2', id: 14};
                let expected      = [
                        {name: 'test1', id: 13},
                        {name: 'test2', id: 14}
                    ];
                expected[0].uid = uid1;
                expected[1].uid = uid2;
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                assert.deepEqual(componentList.getList(), expected);
            }
        );
        it(
            'Should get items by parentId',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let uid3          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13, parentId: 55, parentId: 24};
                let component2    = {uid: uid2, name: 'test2', id: 14, parentId: 55, parentId: 67, containerIds: [24]};
                let component3    = {uid: uid3, name: 'test3', id: 15, parentId: 56, containerIds: [67]};
                let expected      = [
                        {name: 'test2', id: 14, parentId: 67, containerIds: [24]},
                        {name: 'test1', id: 13, parentId: 24}
                    ];
                expected[0].uid = uid2;
                expected[1].uid = uid1;
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                componentList.setComponentById(component3, component3.id);
                assert.deepEqual(componentList.getChildComponents(component3), expected);
            }
        );
        it(
            'Should get data',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let uid3          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13, parentId: 55, parentId: 24};
                let component2    = {uid: uid2, name: 'test2', id: 14, parentId: 55, parentId: 67, containerIds: [24]};
                let component3    = {uid: uid3, name: 'test3', id: 15, parentId: 56, containerIds: [67]};
                let expected      = [
                        {name: 'test1', id: 13, parentId: 24},
                        {name: 'test2', id: 14, parentId: 67, containerIds: [24]},
                        {name: 'test3', id: 15, parentId: 56, containerIds: [67]}
                    ];
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                componentList.setComponentById(component3, component3.id);
                let data = componentList.getData(false);
                for (let i = 0; i < data.length; i++) {
                    delete data[i].toString;
                    delete data[i].uid;
                }
                assert.deepEqual(data, expected);
            }
        );
        it(
            'Should get data, renum ids',
            () => {
                let componentList = new ComponentList({});
                let uid1          = componentList.generateComponentUid();
                let uid2          = componentList.generateComponentUid();
                let uid3          = componentList.generateComponentUid();
                let component1    = {uid: uid1, name: 'test1', id: 13, parentId: 55, parentId: 24};
                let component2    = {uid: uid2, name: 'test2', id: 14, parentId: 55, parentId: 67, containerIds: [24]};
                let component3    = {uid: uid3, name: 'test3', id: 15, parentId: 56, containerIds: [67]};
                let expected      = [
                        {name: 'test1', id: 1, parentId: 3},
                        {name: 'test2', id: 2, parentId: 5, containerIds: [3]},
                        {name: 'test3', id: 4, parentId: 56, containerIds: [5]}
                    ];
                componentList.setComponentById(component1, component1.id);
                componentList.setComponentById(component2, component2.id);
                componentList.setComponentById(component3, component3.id);
                let data = componentList.getData(true);
                for (let i = 0; i < data.length; i++) {
                    delete data[i].toString;
                    delete data[i].uid;
                }
                assert.deepEqual(data, expected);
            }
        );
    }
);
