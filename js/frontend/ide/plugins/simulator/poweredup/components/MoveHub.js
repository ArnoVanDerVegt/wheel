/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const BasicHub = require('./BasicHub').BasicHub;

exports.MoveHub = class extends BasicHub {
    constructor(opts) {
        super(opts);
        this._buttons = 0;
        opts.plugin.setMoveHub(this);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                children: [
                    {
                        ref:       this.setRef('hubBody'),
                        className: 'move-hub-body',
                        children: [
                            {
                                className: 'hub-top'
                            },
                            {
                                className: 'hub-bottom'
                            },
                            {
                                className: 'hub-box',
                                children: [
                                    {
                                        className: 'hub-button'
                                    },
                                    {
                                        className: 'hub-light',
                                        ref:       this.setRef('hubLight')
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('hubStatus'),
                        className: 'hub-status',
                        children: []
                            .concat(this.getVectorRow('tilt', 'Tilt'))
                    }
                ]
            }
        );
    }

    hide() {
        this._refs.hubBody.className   = 'move-hub-body';
        this._refs.hubStatus.className = 'hub-status';
    }

    show() {
        this._refs.hubBody.className   = 'move-hub-body visible';
        this._refs.hubStatus.className = 'hub-status visible';
    }
};
