/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../lib/dispatcher').dispatcher;
const DOMNode    = require('../../../lib/dom').DOMNode;
const tabIndex   = require('../../tabIndex');
const Event      = require('./Event').Event;
const Container  = require('./Container').Container;

exports.Events = class extends Container {
    constructor(opts) {
        opts.firstChild = 1;
        super(opts);
        this._events      = [];
        this._eventByName = {};
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('container'),
                className: 'abs max-w event-container',
                children:  [
                    {
                        className: 'abs max-h event-separator'
                    }
                ]
            }
        );
    }

    initEvents(eventList, formEditorState) {
        this._events.length = 0;
        let eventContainer = this._refs.container;
        let id             = eventList.getComponentId();
        let eventByName    = {};
        let component      = formEditorState.getComponentById(id);
        this.clear();
        eventList.getList().forEach(
            function(event) {
                if (!event) {
                    console.warn('Warning invalid event:', event, 'eventList:', eventList);
                    return;
                }
                eventByName[event.name] = new Event({
                    eventList:     eventList,
                    parentNode:    eventContainer,
                    events:        this,
                    ui:            this._ui,
                    name:          event.name,
                    value:         component[event.name] || '',
                    onChange: function(value) {
                        dispatcher.dispatch('Properties.Event.Change', id, event.name, value);
                    }
                });
            },
            this
        );
        this._eventByName = eventByName;
    }

    addEvent(event) {
        this._events.push(event);
    }

    focusEvent(event) {
        this._events.forEach((e) => {
            if ((e !== event) && e.setFocus) {
                e.setFocus(false);
            }
        });
    }
};
