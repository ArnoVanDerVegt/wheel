/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path         = require('../../../../shared/lib/path');
const dispatcher   = require('../../../lib/dispatcher').dispatcher;
const DOMNode      = require('../../../lib/dom').DOMNode;
const Files        = require('../../../lib/components/files/Files').Files;
const Dialog       = require('../../../lib/components/Dialog').Dialog;
const WizardSteps  = require('../../../lib/components/WizardSteps').WizardSteps;
const Button       = require('../../../lib/components/input/Button').Button;
const ImagePreview = require('./components/ImagePreview').ImagePreview;
const Step         = require('./components/Step').Step;
const StepSelect   = require('./components/StepSelect').StepSelect;
const StepScale    = require('./components/StepScale').StepScale;
const StepContrast = require('./components/StepContrast').StepContrast;
const StepFilename = require('./components/StepFilename').StepFilename;

const SHOW_SIGNAL = 'Dialog.Image.Load.Show';

exports.ImageLoadDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._currentStep         = 0;
        this._stepContentElements = [];
        this.initWindow({
            showSignal: SHOW_SIGNAL,
            width:      800,
            height:     640,
            className:  'image-load-dialog',
            title:      'Load image file'
        });
    }

    initWindowContent(opts) {
        return [
            {
                type:  WizardSteps,
                ref:   this.setRef('wizardSteps'),
                steps: ['Select', 'Scale', 'Contrast', 'Filename']
            },
            {
                id:     this.addStepContentElement.bind(this),
                type:   StepSelect,
                ui:     this._ui,
                uiId:   this._uiId,
                hidden: false,
                dialog: this
            },
            {
                id:     this.addStepContentElement.bind(this),
                type:   StepScale,
                ui:     this._ui,
                uiId:   this._uiId,
                hidden: true,
                dialog: this
            },
            {
                id:     this.addStepContentElement.bind(this),
                type:   StepContrast,
                ui:     this._ui,
                uiId:   this._uiId,
                hidden: true,
                dialog: this
            },
            {
                id:     this.addStepContentElement.bind(this),
                type:   StepFilename,
                ui:     this._ui,
                uiId:   this._uiId,
                hidden: true,
                dialog: this
            },
            this.initButtons([
                {
                    id:        this.setButtonPreviousElement.bind(this),
                    tabIndex:  1024,
                    disabled:  false,
                    className: 'left previous',
                    value:     'Previous',
                    onClick:   this.onPrevious.bind(this)
                },
                {
                    id:        this.setButtonNextElement.bind(this),
                    tabIndex:  1025,
                    disabled:  false,
                    className: 'left',
                    value:     'Next',
                    onClick:   this.onNext.bind(this)
                },
                {
                    tabIndex:  1026,
                    value:     'Cancel',
                    color:     'dark-green',
                    onClick:   this.hide.bind(this)
                }
            ])
        ];
    }

    addStepContentElement(element) {
        this._stepContentElements.push(element);
    }

    getButtonNextElement() {
        return this._nextButtonElement;
    }

    setButtonNextElement(element) {
        this._nextButtonElement = element;
    }

    setButtonPreviousElement(element) {
        this._previousButtonElement = element;
    }

    showStep(step, opts) {
        let stepContentElements = this._stepContentElements;
        for (let i = 0; i < stepContentElements.length; i++) {
            let stepContentElement = stepContentElements[i];
            if (i === step) {
                stepContentElement.show(opts);
            } else {
                stepContentElement.hide();
            }
        }
        this._currentStep = step;
        this._refs.wizardSteps.setActiveStep(step);
    }

    onNext() {
        let stepContentElements = this._stepContentElements;
        this._previousButtonElement.setDisabled(false);
        this._nextButtonElement.setDisabled(false);
        switch (this._currentStep) {
            case 0:
                this._opts.selectedCanvas = stepContentElements[0].getCanvas();
                this.showStep(1, this._opts);
                break;
            case 1:
                this._opts.scaledCanvas = stepContentElements[1].getCanvas();
                this.showStep(2, this._opts);
                break;
            case 2:
                this._opts.data         = stepContentElements[2].getData();
                this._opts.resultCanvas = stepContentElements[2].getCanvas();
                this.showStep(3, this._opts);
                break;
            case 3:
                let result = {
                        value:    stepContentElements[2].getValue(),
                        filename: stepContentElements[3].getFilename()
                    };
                this.hide();
                dispatcher.dispatch('ImageLoader.Loaded', result);
                break;
        }
    }

    onPrevious() {
        let stepContentElements = this._stepContentElements;
        this._previousButtonElement.setDisabled(false);
        this._nextButtonElement.setDisabled(false);
        switch (this._currentStep) {
            case 1:
                this.showStep(0, this._opts);
                this._previousButtonElement.setDisabled(true);
                break;
            case 2:
                this.showStep(1, this._opts);
                break;
            case 3:
                this.showStep(2, this._opts);
                break;
        }
    }

    onShow(opts) {
        this._opts = opts;
        this._previousButtonElement.setDisabled(true);
        this._stepContentElements[0].init(opts);
        this.showStep(0, opts);
        this.show();
        this._nextButtonElement.focus();
    }
};

exports.ImageLoadDialog.SHOW_SIGNAL = SHOW_SIGNAL;
