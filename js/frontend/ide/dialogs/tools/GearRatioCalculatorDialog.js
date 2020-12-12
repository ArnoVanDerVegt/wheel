/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode      = require('../../../lib/dom').DOMNode;
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const Dialog       = require('../../../lib/components/Dialog').Dialog;
const Img          = require('../../../lib/components/basic/Img').Img;
const Dropdown     = require('../../../lib/components/input/Dropdown').Dropdown;
const getImage     = require('../../data/images').getImage;
const GearSettings = require('./components/GearSettings').GearSettings;
const GearList     = require('./components/GearList').GearList;
const GearResult   = require('./components/GearResult').GearResult;

const GEARS = [
        {value: 'w1',   gear:  1, image: 'images/gears/w1.png',   color: '#E74C3C', title: '1',  subTitle: 'Worm gear'},
        {value: 'g8',   gear:  8, image: 'images/gears/g8.png',   color: '#9B59B6', title: '8',  subTitle: 'Gear'},
        {value: 'g12a', gear: 12, image: 'images/gears/g12a.png', color: '#2ECC71', title: '12', subTitle: 'Gear'},
        {value: 'g12b', gear: 12, image: 'images/gears/g12b.png', color: '#2ECC71', title: '12', subTitle: 'Gear'},
        {value: 'g14',  gear: 14, image: 'images/gears/g14.png',  color: '#F1C40F', title: '14', subTitle: 'Gear'},
        {value: 'g16',  gear: 16, image: 'images/gears/g16.png',  color: '#9B59B6', title: '16', subTitle: 'Gear'},
        {value: 'g20a', gear: 20, image: 'images/gears/g20a.png', color: '#2ECC71', title: '20', subTitle: 'Gear'},
        {value: 'g20b', gear: 20, image: 'images/gears/g20b.png', color: '#2ECC71', title: '20', subTitle: 'Gear'},
        {value: 'g24',  gear: 24, image: 'images/gears/g24.png',  color: '#9B59B6', title: '24', subTitle: 'Gear'},
        {value: 'g28a', gear: 28, image: 'images/gears/g28a.png', color: '#2ECC71', title: '28', subTitle: 'Gear'},
        {value: 'g28b', gear: 28, image: 'images/gears/g28b.png', color: '#9B59B6', title: '28', subTitle: 'Gear'},
        {value: 'g36',  gear: 36, image: 'images/gears/g36.png',  color: '#2ECC71', title: '36', subTitle: 'Gear'},
        {value: 'g40',  gear: 40, image: 'images/gears/g40.png',  color: '#9B59B6', title: '40', subTitle: 'Gear'},
        {value: 'g56a', gear: 56, image: 'images/gears/g56a.png', color: '#9B59B6', title: '56', subTitle: 'Gear'},
        {value: 'g56b', gear: 56, image: 'images/gears/g56b.png', color: '#9B59B6', title: '56', subTitle: 'Differential gear'},
        {value: 'd16',  gear: 16, image: 'images/gears/d16.png',  color: '#9B59B6', title: '16', subTitle: 'Differential gear'},
        {value: 'd24',  gear: 24, image: 'images/gears/d24.png',  color: '#9B59B6', title: '24', subTitle: 'Differential gear'},
        {value: 'd28a', gear: 28, image: 'images/gears/d28a.png', color: '#F1C40F', title: '28', subTitle: 'Differential gear'},
        {value: 'd28b', gear: 28, image: 'images/gears/d28b.png', color: '#2ECC71', title: '28', subTitle: 'Differential gear'}
    ];

const MOTORS = [
        {value: 0, t: 4.08, rpm9:  270, rpm7:  201, image: 'images/poweredup/motor64.png',   color: '#D0D4D8', title: 'Powered up', subTitle: 'Basic motor'},
        {value: 1, t: 4.08, rpm9:  171, rpm7:  126, image: 'images/poweredup/motorM64.png',  color: '#D0D4D8', title: 'Powered up', subTitle: 'Medium motor'},
        {value: 2, t: 8.81, rpm9:  198, rpm7:  141, image: 'images/poweredup/motorL64.png',  color: '#D0D4D8', title: 'Powered up', subTitle: 'Technic L motor'},
        {value: 3, t: 8.81, rpm9:  198, rpm7:  147, image: 'images/poweredup/motorXL64.png', color: '#D0D4D8', title: 'Powered up', subTitle: 'Technic XL motor'},
        {value: 4, t: 0.88, rpm9: 1242, rpm7:  855, image: 'images/poweredup/train64.png',   color: '#D0D4D8', title: 'Powered up', subTitle: 'Train motor'},
        {value: 5, t: 4.08, rpm9:  264, rpm7:  201, image: 'images/poweredup/moveHub64.png', color: '#D0D4D8', title: 'Powered up', subTitle: 'MoveHub motor'},
        {value: 6, t: 6.64, rpm9:  165, rpm7:  120, image: 'images/ev3/motorMedium64.png',   color: '#D0D4D8', title: 'EV3',        subTitle: 'Medium motor'},
        {value: 7, t: 17.3, rpm9:  105, rpm7:   78, image: 'images/ev3/motorLarge64.png',    color: '#D0D4D8', title: 'EV3',        subTitle: 'Large motor'}
    ];

exports.GearRatioCalculatorDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._gearByValue = {};
        GEARS.forEach((gear) => {
            this._gearByValue[gear.value] = gear;
        });
        this.initWindow({
            showSignal: 'Dialog.GearRatioCalculator.Show',
            width:      680,
            height:     600,
            className:  'gear-ratio-calculator-dialog',
            title:      'Gear ratio calculator'
        });
    }

    initWindowContent(opts) {
        return [
            {
                type:        GearList,
                ref:         this.setRef('gearList'),
                dialog:      this,
                ui:          this._ui,
                uiId:        this._uiId,
                gearByValue: this._gearByValue,
                onSelect:    this.onSelect.bind(this)
            },
            {
                type:        GearSettings,
                gears:       GEARS,
                ref:         this.setRef('gearSettings'),
                ui:          this._ui,
                uiId:        this._uiId,
                gearByValue: this._gearByValue,
                onAdd:       this.onAdd.bind(this),
                onUpdate:    this.onUpdate.bind(this)
            },
            {
                type:        GearResult,
                motors:      MOTORS,
                dialog:      this,
                ref:         this.setRef('gearResult'),
                ui:          this._ui,
                uiId:        this._uiId
            },
            this.initButtons([
                {
                    value:    'Close',
                    onClick:  this.hide.bind(this),
                    tabIndex: 512
                },
                {
                    type:      'div',
                    className: 'frt inspired-by',
                    innerHTML: 'Data from: https://www.philohome.com/motors/motorcomp.htm - Inspired by http://gears.sariel.pl'
                }
            ])
        ];
    }

    onAdd(opts) {
        let refs = this._refs;
        refs.gearList.add(opts);
        refs.gearResult.update();
    }

    onUpdate(opts) {
        let refs = this._refs;
        refs.gearList.update(opts);
        refs.gearResult.update();
    }

    onSelect(opts) {
        let refs = this._refs;
        refs.gearSettings.setValues(opts);
        refs.gearResult.update();
    }

    onShow(opts) {
        this.show();
    }

    getList() {
        return this._refs.gearList;
    }

    toFixed(value, precision) {
        let result = value.toFixed(precision) + '';
        switch (precision) {
            case 2:
                if (result.substr(-3) === '.00') {
                    result = result.substr(0, result.length - 3);
                }
                break;
            case 3:
                if (result.substr(-4) === '.000') {
                    result = result.substr(0, result.length - 4);
                }
                break;
        }
        return result;
    }
};
