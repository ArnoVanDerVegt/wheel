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
                        className: 'flt rel move-hub-body',
                        children: [
                            {
                                className: 'abs hub-top'
                            },
                            {
                                className: 'abs hub-bottom'
                            },
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
                        children:  [].concat(
                            this.getVectorRow('tilt', 'Tilt'),
                            this.getDirectControlRow()
                        )
                    }
                ]
            }
        );
    }

    hide() {
        this._refs.hubBody.className  = 'flt rel move-hub-body';
        this._refs.hubState.className = 'hub-state';
    }

    show() {
        this._refs.hubBody.className  = 'flt rel move-hub-body visible';
        this._refs.hubState.className = 'hub-state visible';
    }
};
