/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher                     = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                        = require('../../../../lib/dom').DOMNode;
const path                           = require('../../../../lib/path');
const getImage                       = require('../../../data/images').getImage;
const tabIndex                       = require('../../../tabIndex');
const HomeScreenTile                 = require('./HomeScreenTile').HomeScreenTile;
const HomeScreenConnectEV3Tile       = require('./HomeScreenConnectEV3Tile').HomeScreenConnectEV3Tile;
const HomeScreenConnectPoweredUpTile = require('./HomeScreenConnectPoweredUpTile').HomeScreenConnectPoweredUpTile;
const HomeScreenThemeTile            = require('./HomeScreenThemeTile').HomeScreenThemeTile;
const HomeScreenRecentProjectTile    = require('./HomeScreenRecentProjectTile').HomeScreenRecentProjectTile;

exports.HomeScreen = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui           = opts.ui;
        this._settings     = opts.settings;
        this._ev3          = opts.ev3;
        this._poweredUp    = opts.poweredUp;
        this._onGlobalUIId = this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
        dispatcher.dispatch('Settings.Set.DontShowThemeTile', true);
    }

    initDOM(parentNode) {
        let ui              = this._ui;
        let settings        = this._settings;
        let activeDirectory = settings.getDocumentPath();
        let showThemeTile   = !settings.getDontShowThemeTile();
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'home-screen',
                children: [
                    {
                        className: 'home-screen-image-clip',
                        children: [
                            {
                                type:      'img',
                                src:       getImage('images/logos/wheelBlack.svg'),
                                className: 'home-screen-image'
                            }
                        ]
                    },
                    {
                        className: 'home-screen-content' + (showThemeTile ? ' with-theme' : ''),
                        children: [
                            {
                                type:      'h1',
                                children: [
                                    {
                                        type:      'img',
                                        src:       getImage('images/logos/wheelWhite.svg'),
                                        width:     32,
                                        height:    32
                                    },
                                    {
                                        type:      'span',
                                        innerHTML: 'Wheel'
                                    }
                                ]
                            },
                            (settings.getRecentProject() ?
                                {
                                    ref:      this.setRef('firstTile'),
                                    ui:       ui,
                                    icon:     getImage('images/files/recentWhlp.svg'),
                                    title:    'Open recent project &raquo;',
                                    settings: this._settings,
                                    type:     HomeScreenRecentProjectTile,
                                    tabIndex: tabIndex.HOME_SCREEN
                                } :
                                null),
                            this.addHomeScreenTile({
                                icon:     getImage('images/files/whlp.svg'),
                                title:    'Create new project &raquo;',
                                tabIndex: tabIndex.HOME_SCREEN + 1,
                                onClick: function() {
                                    dispatcher.dispatch('Dialog.File.New.Show', 'Project', activeDirectory);
                                }
                            }),
                            this.addHomeScreenTile({
                                icon:     getImage('images/files/whl.svg'),
                                title:    'New file &raquo;',
                                tabIndex: tabIndex.HOME_SCREEN + 2,
                                onClick: function() {
                                    dispatcher.dispatch('Dialog.File.New.Show', 'File', activeDirectory);
                                }
                            }),
                            this.addHomeScreenTile({
                                icon:     getImage('images/files/rgf.svg'),
                                title:    'New image &raquo;',
                                tabIndex: tabIndex.HOME_SCREEN + 3,
                                onClick: function() {
                                    dispatcher.dispatch('Dialog.Image.New.Show', activeDirectory, settings.getDocumentPath());
                                }
                            }),
                            {
                                ui:       ui,
                                icon:     getImage('images/files/ev3.svg'),
                                title:    'Connect to EV3 &raquo;',
                                type:     HomeScreenConnectEV3Tile,
                                tabIndex: tabIndex.HOME_SCREEN + 4,
                                ev3:      this._ev3,
                                onClick: function() {
                                    if ('electron' in window) {
                                        dispatcher.dispatch('Dialog.ConnectEV3.Show');
                                    } else {
                                        dispatcher.dispatch(
                                            'Dialog.Alert.Show',
                                            {
                                                title: 'Browser version',
                                                lines: [
                                                    'The browser version can not connect to your EV3...',
                                                    'Please install the (free) Electron version to use all features.'
                                                ]
                                            }
                                        );
                                    }
                                }
                            },
                            {
                                ui:        ui,
                                icon:      getImage('images/files/poweredUp.svg'),
                                title:     'Connect to Powered Up &raquo;',
                                type:      HomeScreenConnectPoweredUpTile,
                                tabIndex:  tabIndex.HOME_SCREEN + 5,
                                poweredUp: this._poweredUp,
                                onClick: function() {
                                    if ('electron' in window) {
                                        dispatcher.dispatch('Dialog.ConnectPoweredUp.Show');
                                    } else {
                                        dispatcher.dispatch(
                                            'Dialog.Alert.Show',
                                            {
                                                title: 'Browser version',
                                                lines: [
                                                    'The browser version can not connect to your Powered Up devices...',
                                                    'Please install the (free) Electron version to use all features.'
                                                ]
                                            }
                                        );
                                    }
                                }
                            },
                            this.addHomeScreenTile({
                                icon:     getImage('images/files/help.svg'),
                                title:    'Open documentation &raquo;',
                                tabIndex: tabIndex.HOME_SCREEN + 6,
                                onClick: function() {
                                    dispatcher.dispatch('Dialog.Help.Show', {documentPath: settings.getDocumentPath()});
                                }
                            }),
                            showThemeTile ?
                                {
                                    ui:       ui,
                                    icon:     getImage('images/misc/theme.svg'),
                                    title:    'Theme',
                                    settings: this._settings,
                                    type:     HomeScreenThemeTile,
                                    tabIndex: tabIndex.HOME_SCREEN + 7
                                } :
                                null
                        ]
                    }
                ]
            }
        );
    }

    addHomeScreenTile(opts) {
        opts.type = HomeScreenTile;
        opts.ui   = this._ui;
        return opts;
    }

    setElement(element) {
        this._element = element;
    }

    onGlobalUIId() {
        if ((this._ui.getActiveUIId() === 1) && this._refs.firstTile) {
            this._refs.firstTile.focus();
        }
    }

    show() {
        if (!this._onGlobalUIId) {
            this._onGlobalUIId = this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        }
        super.show();
        if (this._refs.firstTile) {
            this._refs.firstTile.focus();
        }
    }

    hide() {
        if (this._onGlobalUIId) {
            this._onGlobalUIId();
            this._onGlobalUIId = null;
        }
        super.hide();
    }
};
