/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher         = require('../../dispatcher').dispatcher;
const NonVisualComponent = require('./NonVisualComponent').NonVisualComponent;

exports.AlertDialog = class extends NonVisualComponent {
    constructor(opts) {
        super(opts);
        this._title         = opts.title;
        this._text          = opts.text;
        this._baseClassName = 'non-visual component-alert-dialog';
        this.initDOM(opts.parentNode);
    }

    onEvent(opts) {
        if ('show' in opts) {
            dispatcher.dispatch(
                'Dialog.Alert.Show',
                {
                    title: this._title,
                    lines: [this._text]
                }
            );
        }
        super.onEvent(opts);
    }
};

exports.Component = exports.AlertDialog;
