/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path         = require('../../../../shared/lib/path');
const DOMNode      = require('../../../lib/dom').DOMNode;
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const Dialog       = require('../../../lib/components/Dialog').Dialog;
const TextArea     = require('../../../lib/components/input/TextArea').TextArea;
const WheelSyntax  = require('../..//help/woc/WheelSyntax').WheelSyntax;

exports.WheelToSVGDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._ide = opts.ide;
        this.initWindow({
            showSignal: 'Dialog.WheelToSVG.Show',
            width:      680,
            height:     460,
            className:  'wheel-to-svg-dialog',
            title:      'Wheel code to SVG'
        });
    }

    initWindowContent(opts) {
        return [
            {
                className: 'abs dialog-lt wheel-input-label',
                innerHTML: 'Wheel code'
            },
            {
                className: 'abs dialog-l dialog-r wheel-input',
                children: [
                    {
                        type:      TextArea,
                        className: 'flt',
                        ref:       this.setRef('wheelInput'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  1
                    }
                ]
            },
            {
                className: 'abs dialog-l svg-output-label',
                innerHTML: 'SVG Image'
            },
            {
                className: 'abs dialog-l dialog-r svg-output',
                children: [
                    {
                        type:      TextArea,
                        className: 'flt',
                        ref:       this.setRef('svgOutput'),
                        ui:        this._ui,
                        uiId:      this._uiId,
                        tabIndex:  2
                    }
                ]
            },
            this.initButtons([
                {
                    value:    'Create SVG image from code',
                    onClick:  this.onCreateImage.bind(this),
                    tabIndex: 512
                },
                {
                    value:    'Close',
                    onClick:  this.hide.bind(this),
                    tabIndex: 513
                }
            ])
        ];
    }

    onCreateImage() {
        let refs  = this._refs;
        let value = refs.wheelInput.getValue().trim();
        if (value === '') {
            return;
        }
        let lines = value.split('\n');
        if (lines.length) {
            refs.svgOutput.setValue(new WheelSyntax('svg').parseLines(lines));
        }
    }

    onShow(opts) {
        let refs         = this._refs;
        let activeEditor = this._ide.getActiveEditor();
        let value        = '';
        if (activeEditor) {
            let filename = activeEditor.getFilename();
            if (['.whl', '.whlp'].indexOf(path.getExtension(filename)) !== -1) {
                value = activeEditor.getValue();
            }
        }
        refs.wheelInput.setValue(value);
        if (value === '') {
            refs.svgOutput.setValue('');
        } else {
            this.onCreateImage();
        }
        this.show();
    }
};
