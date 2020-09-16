/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../dom').DOMNode;

exports.WizardSteps = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._stepElements = [];
        this._steps        = opts.steps;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let children = [];
        this._steps.forEach((step, index) => {
            children.push({
                id:        this.addStepElement.bind(this),
                className: 'step' + (index ? '' : ' active'),
                innerHTML: step
            });
        });
        this.create(
            parentNode,
            {
                className: 'wizard-steps count' + this._steps.length,
                children:  children
            }
        );
    }

    addStepElement(element) {
        this._stepElements.push(element);
    }

    setActiveStep(activeStep) {
        this._stepElements.forEach((stepElement, index) => {
            stepElement.className = 'step' + ((index === activeStep) ? ' active' : '');
        });
    }
};
