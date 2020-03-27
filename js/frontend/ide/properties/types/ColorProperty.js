/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const IconSelect = require('../../../lib/components/IconSelect').IconSelect;
const getImage   = require('../../data/images').getImage;
const Property   = require('../Property').Property;

exports.ColorProperty = class extends Property {
    constructor(opts) {
        super(opts);
    }

    initPropertyValue() {
        return {
            className: 'property-value',
            children: [
                {
                    ref:      this.setRef('colorList'),
                    type:     IconSelect,
                    ui:       this._ui,
                    onFocus:  this.onFocus.bind(this),
                    onBlur:   this.onBlur.bind(this),
                    options: [
                        {value: 0, icon: getImage('images/constants/colorNone.svg')},
                        {value: 1, icon: getImage('images/constants/colorBlack.svg')},
                        {value: 2, icon: getImage('images/constants/colorBlue.svg')},
                        {value: 3, icon: getImage('images/constants/colorGreen.svg')},
                        {value: 4, icon: getImage('images/constants/colorYellow.svg')},
                        {value: 5, icon: getImage('images/constants/colorRed.svg')},
                        {value: 6, icon: getImage('images/constants/colorWhite.svg')},
                        {value: 7, icon: getImage('images/constants/colorBrown.svg')}
                    ]
                    //ref:      this.setRef('specialValueInput'),
                    //tabIndex: this._tabIndex,
                    //onChange: this.onChangeColorValue.bind(this),
                    //disabled: this._state.getConnected()
                }
            ]
        };
    }

    onClick(event) {
        this._refs.colorList.focus();
        this._properties.focusProperty(this);
    }
};
