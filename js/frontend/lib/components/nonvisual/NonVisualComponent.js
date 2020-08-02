/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Component = require('../Component');

exports.NonVisualComponent = class extends Component.Component {
    constructor(opts) {
        super(opts);
        this._name = opts.name;
    }

    onMouseMove(event) {
        if (typeof WebKitCSSMatrix === 'undefined') {
            return; // No support, don't show the hint...
        }
        let hintDiv;
        if (this._hintDiv) {
            hintDiv = this._hintDiv;
        } else {
            hintDiv = this.getHintDiv();
            if (!hintDiv) {
                return;
            }
            this._hintDiv     = hintDiv;
            hintDiv.innerHTML = this._name;
        }
        let element  = this._element;
        let position = this.getElementPosition();
        hintDiv.style.zIndex = 99999;
        hintDiv.style.display = 'block';
        hintDiv.style.left    = position.x + (-hintDiv.offsetWidth / 2 + 24) + 'px';
        hintDiv.style.top     = (position.y + 32) + 'px';
    }

    onMouseOut() {
        this.hideHintDiv();
        this.onCancelEvent(event);
    }
};
