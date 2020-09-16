/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher            = require('../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../lib/dom').DOMNode;
const Button                = require('../../../lib/components/Button').Button;
const Dropdown              = require('../../../lib/components/Dropdown').Dropdown;
const WizardSteps           = require('../../../lib/components/WizardSteps').WizardSteps;
const getImage              = require('../../data/images').getImage;
const PoweredUpStep1Start   = require('./components/PoweredUpStep1Start').PoweredUpStep1Start;
const PoweredUpStep2Device  = require('./components/PoweredUpStep2Device').PoweredUpStep2Device;
const PoweredUpStep3Ports   = require('./components/PoweredUpStep3Ports').PoweredUpStep3Ports;
const PoweredUpStep4Form    = require('./components/PoweredUpStep4Form').PoweredUpStep4Form;
const PoweredUpStep5Include = require('./components/PoweredUpStep5Include').PoweredUpStep5Include;
const PoweredUpStep6Finish  = require('./components/PoweredUpStep6Finish').PoweredUpStep6Finish;
const DeviceListState       = require('./state/DeviceListState').DeviceListState;
const FileDialog            = require('./FileDialog').FileDialog;

exports.FilePoweredUpProjectDialog = class extends FileDialog {
    constructor(opts) {
        super(opts);
        this._deviceList          = new DeviceListState();
        this._currentStep         = 0;
        this._stepContentElements = [];
        this.initWindow('file-new-dialog file-new-powered-up-project', 'New Powered Up project', this.initWindowContent(opts));
        dispatcher.on('Dialog.File.PoweredUpProject', this, this.onShow);
        this.showStep(0);
    }

    initWindowContent(opts) {
        return [
            {
                type:       WizardSteps,
                ref:        this.setRef('wizardSteps'),
                steps:      ['Start', 'Devices', 'Ports', 'Form', 'Include', 'Finish']
            },
            this.addStep({type: PoweredUpStep1Start}),
            this.addStep({type: PoweredUpStep2Device, ports: false}),
            this.addStep({type: PoweredUpStep3Ports,  ports: true}),
            this.addStep({type: PoweredUpStep4Form}),
            this.addStep({type: PoweredUpStep5Include}),
            this.addStep({type: PoweredUpStep6Finish}),
            {
                className: 'buttons',
                children: [
                    this.addButton({
                        id:        this.setButtonPreviousElement.bind(this),
                        tabIndex:  1024,
                        disabled:  false,
                        className: 'left previous',
                        value:     'Previous',
                        onClick:   this.onPrevious.bind(this)
                    }),
                    this.addButton({
                        id:        this.setButtonNextElement.bind(this),
                        tabIndex:  1025,
                        disabled:  false,
                        className: 'left',
                        value:     'Next',
                        onClick:   this.onNext.bind(this)
                    }),
                    this.addButton({
                        tabIndex:  1026,
                        value:     'Cancel',
                        color:     'dark-green',
                        onClick:   this.hide.bind(this)
                    })
                ]
            }
        ];
    }

    addStep(opts) {
        opts.dialog     = this;
        opts.id         = this.addStepContentElement.bind(this);
        opts.ui         = this._ui;
        opts.uiId       = this._uiId;
        opts.deviceList = this._deviceList;
        opts.settings   = this._settings;
        opts.hidden     = true;
        return opts;
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

    setNextEnabled(enabled) {
        this._nextButtonElement.setDisabled(!enabled);
    }

    showStep(step) {
        let stepContentElements = this._stepContentElements;
        for (let i = 0; i < stepContentElements.length; i++) {
            let stepContentElement = stepContentElements[i];
            if (i === step) {
                stepContentElement
                    .update()
                    .show();
            } else {
                stepContentElement.hide();
            }
        }
        this._currentStep = step;
        this._refs.wizardSteps.setActiveStep(step);
    }

    onNext() {
        if (!this._stepContentElements[this._currentStep].validate()) {
            return;
        }
        this._previousButtonElement.setDisabled(false);
        this._nextButtonElement.setDisabled(false);
        switch (this._currentStep) {
            case 4:
                this.showStep(5);
                this._nextButtonElement.setValue('Finish');
                break;
            case 5:
                this.hide();
                break;
            default:
                this._nextButtonElement.setValue('Next');
                this.showStep(this._currentStep + 1);
                break;
        }
    }

    onPrevious() {
        this._previousButtonElement.setDisabled(false);
        this._nextButtonElement.setDisabled(false);
        switch (this._currentStep) {
            case 1:
                this._previousButtonElement.setDisabled(true);
                this.showStep(0);
                break;
            default:
                this.showStep(this._currentStep - 1);
                break;
        }
    }

    onShow() {
        this._stepContentElements.forEach((stepContentElements) => {
            stepContentElements.reset();
        });
        this._deviceList.reset();
        this._previousButtonElement.setDisabled(true);
        this._nextButtonElement.setDisabled(false);
        this.showStep(0);
        this.show();
        this._nextButtonElement.focus();
    }
};
