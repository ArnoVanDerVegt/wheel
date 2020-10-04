/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;

exports.PianoKey = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._className = opts.className;
        this._tabIndex  = opts.tabIndex;
        this._piano     = opts.piano;
        this._key       = opts.key;
        this._hotkey    = opts.hotkey;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let piano = this._piano;
        this.create(
            parentNode,
            {
                id: (element) => {
                    piano.setKeyElement(element, this._key, this._hotkey, this._className);
                },
                type:     'a',
                href:     '#',
                className: 'flt rel max-w max-h',
                tabIndex: this._tabIndex,
                children: [
                    {
                        type:      'span',
                        className: 'no-select abs max-w',
                        innerHTML: this._hotkey
                    }
                ]
            }
        );
    }
};
