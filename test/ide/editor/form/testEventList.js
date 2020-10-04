/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const EventList           = require('../../../../js/frontend/ide/editor/editors/form/state/EventList').EventList;
const formEditorConstants = require('../../../../js/frontend/ide/editor/editors/form/formEditorConstants');
const assert              = require('assert');

describe(
    'Test EventList',
    () => {
        it(
            'Should create EventList',
            () => {
                let eventList = new EventList({});
                assert.notEqual(eventList, null);
            }
        );
        it(
            'Should get component info',
            () => {
                let eventList = new EventList({
                        component: {
                            id:   13,
                            uid:  '1345445',
                            name: 'btn1',
                            type: formEditorConstants.COMPONENT_TYPE_BUTTON
                        }
                    });
                assert.equal(eventList.getComponentId(),   13);
                assert.equal(eventList.getComponentUid(),  '1345445');
                assert.equal(eventList.getComponentName(), 'btn1');
            }
        );
        it(
            'Should get form name',
            () => {
                let eventList = new EventList({
                        formEditorState: {
                            getFormName() { return 'testForm'; }
                        }
                    });
                assert.equal(eventList.getFormName(), 'testForm');
            }
        );
        it(
            'Should get component info',
            () => {
                let eventList = new EventList({
                        component: {
                            id:   13,
                            uid:  '1345445',
                            name: 'btn1',
                            type: formEditorConstants.COMPONENT_TYPE_BUTTON
                        }
                    });
                let list = eventList.getList();
                assert.equal(list.length,  6);
                assert.equal(list[0].name, 'onClick');
                assert.equal(list[1].name, 'onFocus');
                assert.equal(list[2].name, 'onBlur');
                assert.equal(list[3].name, 'onMouseDown');
                assert.equal(list[4].name, 'onMouseUp');
                assert.equal(list[5].name, 'onMouseOut');
            }
        );
        it(
            'Should get event',
            () => {
                let eventList = new EventList({
                        component: {
                            id:      13,
                            uid:     '1345445',
                            name:    'btn1',
                            type:    formEditorConstants.COMPONENT_TYPE_BUTTON,
                            onClick: 'testEvent'
                        }
                    });
                assert.equal(eventList.getEvent('onClick'), 'testEvent');
            }
        );
        it(
            'Should get event name',
            () => {
                let eventList = new EventList({
                        component: {
                            id:      13,
                            uid:     '1345445',
                            name:    'btn1',
                            type:    formEditorConstants.COMPONENT_TYPE_BUTTON,
                            onClick: 'testEvent'
                        },
                        formEditorState: {
                            getFormName() { return 'testForm'; }
                        }
                    });
                assert.equal(eventList.getEventName('onClick'), 'onTestFormBtn1Click');
            }
        );
        it(
            'Should get updated event',
            () => {
                let eventList = new EventList({
                        component: {
                            id:      13,
                            uid:     '1345445',
                            name:    'btn1',
                            type:    formEditorConstants.COMPONENT_TYPE_BUTTON,
                            onClick: 'testEvent'
                        },
                        formEditorState: {
                            getFormName() { return 'testForm'; }
                        }
                    });
                assert.deepEqual(
                    eventList.getUpdatedEvents(),
                    {
                        onClick:     'onTestFormBtn1Click',
                        onFocus:     'onTestFormBtn1Focus',
                        onBlur:      'onTestFormBtn1Blur',
                        onMouseDown: 'onTestFormBtn1MouseDown',
                        onMouseUp:   'onTestFormBtn1MouseUp',
                        onMouseOut:  'onTestFormBtn1MouseOut'
                    }
                );
            }
        );
    }
);
