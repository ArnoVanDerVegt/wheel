/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher     = require('../../../../lib/dispatcher').dispatcher;
const path           = require('../../../../lib/path');
const HomeScreenTile = require('./HomeScreenTile').HomeScreenTile;

exports.HomeScreenNewProjectTile = class extends HomeScreenTile {
    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('homeScreenTile'),
                className: 'home-screen-tile',
                children: [
                    {
                        className: 'flt max-w max-h home-screen-tile-content',
                        children: [
                            this.getIcon(),
                            {
                                ref:       this.setRef('homeScreenTileText'),
                                className: 'frt max-h home-screen-tile-text',
                                children: [
                                    {
                                        id:        this.setTitle1Element.bind(this),
                                        tabIndex:  this._tabIndex,
                                        className: 'flt max-w title1',
                                        type:      'a',
                                        innerHTML: 'New project &raquo;'
                                    },
                                    {
                                        id:        this.setTitle2Element.bind(this),
                                        tabIndex:  this._tabIndex,
                                        className: 'flt max-w title2',
                                        type:      'a',
                                        innerHTML: 'New Powered Up project &raquo;'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
        let visible = this._settingsGetter ? this._settingsGetter() : true;
        this._refs.homeScreenTile.style.display = visible ? 'block' : 'none';
    }

    setTitle1Element(element) {
        this._title1Element = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',   this.onCancelEvent.bind(this));
        element.addEventListener('keydown',   this.onTitle1KeyDown.bind(this));
        element.addEventListener('click',     this.onTitle1Click.bind(this));
    }

    setTitle2Element(element) {
        this._title2Element = element;
        element.addEventListener('mousedown', this.onCancelEvent.bind(this));
        element.addEventListener('mouseup',   this.onCancelEvent.bind(this));
        element.addEventListener('keydown',   this.onTitle2KeyDown.bind(this));
        element.addEventListener('click',     this.onTitle2Click.bind(this));
    }

    onTitle1KeyDown(event) {
        if ([13, 32].indexOf(event.keyCode) !== -1) {
            dispatcher.dispatch('Dialog.File.New.Show', 'Project', this._settings.getDocumentPath());
        }
    }

    onTitle1Click(event) {
        this.onCancelEvent(event);
        dispatcher.dispatch('Dialog.File.New.Show', 'Project', this._settings.getDocumentPath());
        this._title1Element.focus();
    }

    onTitle2KeyDown(event) {
        if ([13, 32].indexOf(event.keyCode) !== -1) {
            dispatcher.dispatch('Dialog.File.PoweredUpProject');
        }
    }

    onTitle2Click(event) {
        this.onCancelEvent(event);
        dispatcher.dispatch('Dialog.File.PoweredUpProject');
        this._title2Element.focus();
    }

    onGlobalUIId() {
        if (this._uiId === this._ui.getActiveUIId()) {
            this._title1Element.tabIndex = this._tabIndex;
            this._title2Element.tabIndex = this._tabIndex + 1;
        } else {
            this._title1Element.tabIndex = -1;
            this._title2Element.tabIndex = -1;
        }
    }
};
