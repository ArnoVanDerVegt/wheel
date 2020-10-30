/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicHub = require('./BasicHub').BasicHub;

exports.Hub = class extends BasicHub {
    constructor(opts) {
        super(opts);
        this._buttons = 0;
        opts.plugin.setHub(this);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                children: [
                    {
                        ref:       this.setRef('hubBody'),
                        className: 'hub-hub-body small-hub',
                        children: [
                            {
                                className: 'abs hub-box',
                                children: [
                                    {
                                        className: 'abs hub-button'
                                    },
                                    {
                                        className: 'abs hub-light',
                                        ref:       this.setRef('hubLight')
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('hubState'),
                        className: 'hub-state',
                        children:  [].concat(this.getDirectControlRow())
                    }
                ]
            }
        );
    }

    hide() {
        this._refs.hubBody.className = 'hub-hub-body small-hub';
    }

    show() {
        this._refs.hubBody.className = 'hub-hub-body small-hub visible';
    }
};
