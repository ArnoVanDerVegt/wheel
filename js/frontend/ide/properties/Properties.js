/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../lib/dispatcher').dispatcher;
const Tabs              = require('../../lib/components/input/Tabs').Tabs;
const DOMNode           = require('../../lib/dom').DOMNode;
const tabIndex          = require('../tabIndex');
const PropertiesToolbar = require('./PropertiesToolbar').PropertiesToolbar;
const Events            = require('./components/Events').Events;
const Properties        = require('./components/Properties').Properties;
const Form              = require('./components/Form').Form;
const Components        = require('./components/Components').Components;

exports.Properties = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._opts                    = opts;
        this._ui                      = opts.ui;
        this._settings                = opts.settings;
        this._value                   = opts.value;
        this._activeProperties        = null;
        this._changeComponentDebounce = null;
        this.initDOM(opts.parentNode);
        dispatcher
            .on('Properties.Clear',             this, this.onClear)
            .on('Properties.Select.Properties', this, this.onSelectProperties)
            .on('Properties.Select.Events',     this, this.onSelectEvent)
            .on('Properties.ComponentList',     this, this.onChangeComponentList)
            .on('Properties.ShowForm',          this, this.onShowForm);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('property'),
                className: 'abs properties',
                children: [
                    {
                        type:      PropertiesToolbar,
                        ui:        this._ui,
                        ev3:       this._ev3,
                        settings:  this._settings,
                        simulator: this
                    },
                    {
                        type: Tabs,
                        ref:  this.setRef('tabs'),
                        ui:   this._ui,
                        uiId: 1,
                        tabs: [
                            {
                                title:   'Form',
                                onClick: this.setPanelVisible.bind(this, 0)
                            },
                            {
                                title:   'Property',
                                onClick: this.setPanelVisible.bind(this, 1)
                            },
                            {
                                title:   'Event',
                                onClick: this.setPanelVisible.bind(this, 2)
                            },
                            {
                                title:   'Components',
                                onClick: this.setPanelVisible.bind(this, 3)
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('componentUid'),
                        className: 'no-select abs max-w component-uid',
                        innerHTML: '0x00000000'
                    },
                    {
                        ref:       this.setRef('formContainer'),
                        type:      Form
                    },
                    {
                        type:      Properties,
                        ref:       this.setRef('propertyContainer'),
                        ui:        this._ui,
                        uiId:      this._uiId
                    },
                    {
                        type:      Events,
                        ref:       this.setRef('eventContainer'),
                        ui:        this._ui,
                        uiId:      this._uiId
                    },
                    {
                        type:      Components,
                        ref:       this.setRef('componentsContainer'),
                        ui:        this._ui,
                        uiId:      this._uiId
                    }
                ]
            }
        );
        dispatcher.dispatch('Settings.UpdateViewSettings');
    }

    setPanelVisible(panelIndex) {
        let refs = this._refs;
        [refs.formContainer, refs.propertyContainer, refs.eventContainer, refs.componentsContainer].forEach((container, index) => {
            container.setVisible(panelIndex === index);
        });
    }

    selectPropertiesTab() {
        if (['Properties', 'Event'].indexOf(this._refs.tabs.getActiveTab().title) === -1) {
            this.setPanelVisible(1);
            this._refs.tabs.setActiveTab('Property');
        }
    }

    onSelectEvent(eventList, formEditorState) {
        let refs = this._refs;
        refs.componentUid.innerHTML = eventList.getComponentUid() || '0x00000000';
        refs.eventContainer.initEvents(eventList, formEditorState);
        this.selectPropertiesTab();
    }

    onSelectProperties(propertyList, formEditorState) {
        if (this._activeProperties === propertyList.getComponentUid()) {
            return;
        }
        let refs = this._refs;
        refs.componentUid.innerHTML = propertyList.getComponentUid() || '0x00000000';
        this._activeProperties      = propertyList.getComponentUid();
        refs.propertyContainer.initProperties(propertyList, formEditorState);
        this.selectPropertiesTab();
    }

    onChangeComponentList(opts) {
        if (this._changeComponentDebounce) {
            clearTimeout(this._changeComponentDebounce);
        }
        this._changeComponentDebounce = setTimeout(
            () => {
                this._changeComponentDebounce = null;
                if (opts.value === null) {
                    this.onClear();
                }
                if (this._settings.getAutoSelectProperties()) {
                    this.selectPropertiesTab();
                }
                if ('items' in opts) {
                    this._refs.formContainer.setItems(opts.items);
                }
            },
            25
        );
        return this;
    }

    onShowForm(opts) {
        this
            .onChangeComponentList(opts)
            .onClickForm();
    }

    onClear() {
        this._activeProperties = null;
        let refs = this._refs;
        refs.componentUid.innerHTML = '0x00000000';
        refs.propertyContainer.clear();
        refs.eventContainer.clear();
        refs.formContainer.clear();
    }
};
