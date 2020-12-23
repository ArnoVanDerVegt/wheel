/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode    = require('../../../../lib/dom').DOMNode;
const Dropdown   = require('../../../../lib/components/input/Dropdown').Dropdown;
const getImage   = require('../../../data/images').getImage;

exports.GearResult = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui     = opts.ui;
        this._uiId   = opts.uiId;
        this._motors = opts.motors;
        this._dialog = opts.dialog;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'abs dialog-cw dialog-l gear-result',
                children: [
                    {
                        type:      Dropdown,
                        ref:       this.setRef('motor'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  320,
                        images:    true,
                        getImage:  getImage,
                        items:     this._motors,
                        onChange:  this.onChangeMotor.bind(this)
                    },
                    {
                        className: 'no-select frt ui1-box gear-overview',
                        ref:       this.setRef('overview')
                    }
                ]
            }
        );
    }

    update() {
        let dialog = this._dialog;
        let from   = 1;
        let to     = 1;
        this._dialog.getList().getList().forEach((item) => {
            from *= item.getFrom().gear;
            to   *= item.getTo().gear;
        });
        let motorInfo = this._motors[this._refs.motor.getValue()];
        let info      = '';
        if ((to !== 1) || (from !== 1)) {
            let f1 = to / from;
            let f2 = from / to;
            if (f1 >= 1) {
                info = 'The gear ratio is <b>1:' + dialog.toFixed(to / from, 3) + '</b><br/>' +
                    'The speed is decreased ' + dialog.toFixed(f1, 3) + ' times.<br/>' +
                    'The torque is increased ' + dialog.toFixed(f1, 3) + ' times.<br/>' +
                    'The follower gear rotates ' + dialog.toFixed(f2, 3) + ' time per each revolution of the driver gear.<br/>';
            } else {
                f1 = 1 / f1;
                info = 'The gear ratio is <b>1:' + dialog.toFixed(to / from, 3) + '</b><br/>' +
                    'The speed is increased ' + dialog.toFixed(f1, 3) + ' times.<br/>' +
                    'The torque is decreased ' + dialog.toFixed(f1, 3) + ' times.<br/>' +
                    'The follower gear rotates ' + dialog.toFixed(f2, 3) + ' time per each revolution of the driver gear.<br/>';
            }
            info += '<br/>' +
                'The theoretical output speed will be ' + dialog.toFixed(motorInfo.rpm7 * f2, 2) + ' RPM at 7.5V and ' + dialog.toFixed(motorInfo.rpm9 * f2, 2) + ' RPM at 9V.<br/>' +
                'The theoretical output torque will be ' + dialog.toFixed(motorInfo.t * f1, 2) + ' N.cm.';
        }
        this._refs.overview.innerHTML = info;
    }

    onChangeMotor(value) {
        this.update();
    }
};
