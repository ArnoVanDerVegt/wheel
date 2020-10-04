/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const PropertyList        = require('../../../../js/frontend/ide/editor/editors/form/state/PropertyList').PropertyList;
const formEditorConstants = require('../../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test PropertyList',
    () => {
        it(
            'Should create PropertyList',
            () => {
                let propertyList = new PropertyList({});
                assert.notEqual(propertyList, null);
            }
        );
        it(
            'Should get component list',
            () => {
                let propertyList = new PropertyList({componentList: 'test'});
                assert.equal(propertyList.getComponentList(), 'test');
            }
        );
        it(
            'Should get component uid',
            () => {
                let propertyList = new PropertyList({component: {uid: 'test'}});
                assert.equal(propertyList.getComponentUid(), 'test');
            }
        );
        it(
            'Should get existing property',
            () => {
                let propertyList = new PropertyList({component: {type: formEditorConstants.COMPONENT_TYPE_TABS, tabs: ['Tab(1)', 'Tab(2)']}});
                assert.deepEqual(propertyList.getProperty('tabs'), ['Tab(1)', 'Tab(2)']);
            }
        );
        it(
            'Should get new number property',
            () => {
                let propertyList = new PropertyList({component: {type: formEditorConstants.COMPONENT_TYPE_TABS}});
                assert.strictEqual(propertyList.getProperty('x'), 0);
            }
        );
        it(
            'Should get new boolean property',
            () => {
                let propertyList = new PropertyList({component: {type: formEditorConstants.COMPONENT_TYPE_TABS}});
                assert.strictEqual(propertyList.getProperty('hidden'), false);
            }
        );
        it(
            'Should get unknown property',
            () => {
                let propertyList = new PropertyList({component: {type: formEditorConstants.COMPONENT_TYPE_TABS}});
                assert.strictEqual(propertyList.getProperty('unknown'), '');
            }
        );
    }
);
