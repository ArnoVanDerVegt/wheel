/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher        = require('../../../lib/dispatcher').dispatcher;
const tabIndex          = require('../../tabIndex');
const BooleanProperty   = require('./types/BooleanProperty').BooleanProperty;
const DropdownProperty  = require('./types/DropdownProperty').DropdownProperty;
const TextProperty      = require('./types/TextProperty').TextProperty;
const TextAreaProperty  = require('./types/TextAreaProperty').TextAreaProperty;
const TextListProperty  = require('./types/TextListProperty').TextListProperty;
const HAlignProperty    = require('./types/HAlignProperty').HAlignProperty;
const ColorProperty     = require('./types/ColorProperty').ColorProperty;
const RgbProperty       = require('./types/RgbProperty').RgbProperty;
const IconProperty      = require('./types/IconProperty').IconProperty;
const Container         = require('./Container').Container;

exports.Properties = class extends Container {
    constructor(opts) {
        opts.firstChild = 1;
        super(opts);
        this._properties     = [];
        this._propertyByName = {};
        dispatcher.on('Properties.ChangePosition', this, this.onChangePosition);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('container'),
                className: 'abs max-w property-container',
                children:  [
                    {
                        className: 'abs max-h property-separator'
                    }
                ]
            }
        );
    }

    initProperties(propertyList, formEditorState) {
        let propertyContainer = this._refs.container;
        let id                = propertyList.getComponentId();
        let propertyByName    = {};
        let component         = formEditorState.getComponentById(id);
        let tab               = tabIndex.PROPERTIES_CONTAINER;
        this._properties.length           = 0;
        this.clear();
        propertyList.getList().forEach((property) => {
            if (!property || (property.name === null)) {
                return;
            }
            let propertyConstructor = null;
            let opts                = {
                    parentNode:    propertyContainer,
                    properties:    this,
                    ui:            this._ui,
                    name:          property.name,
                    options:       property.options,
                    value:         propertyList.getProperty(property.name),
                    componentList: propertyList.getComponentList(),
                    component:     component,
                    onChange:      dispatcher.dispatch.bind(dispatcher, 'Properties.Property.Change', id, property.name),
                    tabIndex:      tab
                };
            switch (property.type) {
                case 'boolean':  propertyConstructor = BooleanProperty;  break;
                case 'text':     propertyConstructor = TextProperty;     break;
                case 'textarea': propertyConstructor = TextAreaProperty; break;
                case 'textList': propertyConstructor = TextListProperty; break;
                case 'hAlign':   propertyConstructor = HAlignProperty;   break;
                case 'color':    propertyConstructor = ColorProperty;    break;
                case 'rgb':      propertyConstructor = RgbProperty;      break;
                case 'dropdown': propertyConstructor = DropdownProperty; break;
                case 'icon':     propertyConstructor = IconProperty;     break;
            }
            if (propertyConstructor) {
                let propertyComponent = new propertyConstructor(opts);
                propertyByName[property.name] = propertyComponent;
                tab += propertyComponent.getTabCount();
            }
        });
        this._propertyByName = propertyByName;
    }

    addProperty(property) {
        this._properties.push(property);
    }

    focusProperty(property) {
        this._properties.forEach((p) => {
            if ((p !== property) && p.setFocus) {
                p.setFocus(false);
            }
        });
    }

    onChangePosition(position) {
        if (this._propertyByName.x) {
            this._propertyByName.x.setValue(position.x);
        }
        if (this._propertyByName.y) {
            this._propertyByName.y.setValue(position.y);
        }
    }
};
