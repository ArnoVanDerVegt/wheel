/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform                       = require('../../../../lib/platform');
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
const HomeScreenRecentFormTile       = require('./HomeScreenRecentFormTile').HomeScreenRecentFormTile;
const HomeScreenDocumentationTile    = require('./HomeScreenDocumentationTile').HomeScreenDocumentationTile;

exports.HomeScreen = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui           = opts.ui;
        this._settings     = opts.settings;
        this._ev3          = opts.ev3;
        this._poweredUp    = opts.poweredUp;
        this._tileCount    = 0;
        this._onGlobalUIId = this._ui.addEventListener('Global.UIId', this, this.onGlobalUIId);
        this.initDOM(opts.parentNode);
        dispatcher.dispatch('Settings.Set.DontShowThemeTile', true);
    }

    initTiles() {
        let ui              = this._ui;
        let settings        = this._settings;
        let activeDirectory = settings.getDocumentPath();
        let showThemeTile   = !settings.getDontShowThemeTile();
        const addTile = () => {
                this._tileCount++;
            };
        return [
            {
                type:      'h1',
                className: 'max-w',
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
                    id:       addTile(),
                    ref:      this.setRef('firstTile'),
                    ui:       ui,
                    icon:     getImage('images/files/recentWhlp.svg'),
                    title:    'Open recent project &raquo;',
                    settings: this._settings,
                    type:     HomeScreenRecentProjectTile,
                    tabIndex: tabIndex.HOME_SCREEN
                } :
                null),
            (settings.getRecentForm() ?
                {
                    id:       addTile(),
                    ref:      this.setRef(settings.getRecentProject() ? 'secondTile' : 'firstTile'),
                    ui:       ui,
                    icon:     getImage('images/files/recentWFrm.svg'),
                    title:    'Open recent form &raquo;',
                    settings: this._settings,
                    type:     HomeScreenRecentFormTile,
                    tabIndex: tabIndex.HOME_SCREEN + 1
                } :
                null),
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/homeWhlp.svg'),
                title:    'Create new project &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 2,
                onClick:  dispatcher.dispatch.bind(dispatcher, 'Dialog.File.New.Show', 'Project', activeDirectory)
            }),
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/homeWhl.svg'),
                title:    'New file &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 3,
                onClick:  dispatcher.dispatch.bind(dispatcher, 'Dialog.File.New.Show', 'File', activeDirectory)
            }),
            platform.isElectron() ?
                this.addHomeScreenTile({
                    id:             addTile(),
                    icon:           getImage('images/files/homeRgf.svg'),
                    title:          'New image EV3 &raquo;',
                    tabIndex:       tabIndex.HOME_SCREEN + 4,
                    settings:       settings,
                    settingsGetter: settings.getShowEV3ImageTile.bind(settings),
                    onClick:        dispatcher.dispatch.bind(dispatcher, 'Dialog.Image.New.Show', activeDirectory, settings.getDocumentPath())
                }) :
                null,
            this.addHomeScreenTile({
                id:             addTile(),
                icon:           getImage('images/files/homeForm.svg'),
                title:          'New form &raquo;',
                settings:       settings,
                settingsGetter: settings.getShowNewFormTile.bind(settings),
                tabIndex:       tabIndex.HOME_SCREEN + 5,
                onClick:        dispatcher.dispatch.bind(dispatcher, 'Dialog.Form.New.Show', activeDirectory, settings.getDocumentPath())
            }),
            platform.isElectron() ?
                {
                    id:             addTile(),
                    ui:             ui,
                    icon:           getImage('images/files/homeEv3.svg'),
                    title:          'Connect to EV3 &raquo;',
                    type:           HomeScreenConnectEV3Tile,
                    tabIndex:       tabIndex.HOME_SCREEN + 6,
                    settings:       settings,
                    settingsGetter: settings.getShowEV3Tile.bind(settings),
                    ev3:            this._ev3,
                    onClick:        dispatcher.dispatch.bind(dispatcher, 'Dialog.ConnectEV3.Show')
                } :
                null,
            {
                id:             addTile(),
                ui:             ui,
                icon:           getImage('images/files/homePoweredUp.svg'),
                title:          'Connect to Powered Up &raquo;',
                type:           HomeScreenConnectPoweredUpTile,
                tabIndex:       tabIndex.HOME_SCREEN + 7,
                settings:       settings,
                settingsGetter: settings.getShowPoweredUpTile.bind(settings),
                poweredUp:      this._poweredUp,
                onClick: function() {
                    if (!window.PoweredUP || !window.PoweredUP.isWebBluetooth) {
                        dispatcher.dispatch('Dialog.ConnectPoweredUp.Show');
                    } else {
                        dispatcher.dispatch(
                            'Dialog.Alert.Show',
                            {
                                title: 'Bluetooth not supported',
                                lines: [
                                    'Your browser does not support the Web Bluetooth specification.'
                                ]
                            }
                        );
                    }
                }
            },
            this.addHomeScreenTile({
                id:       addTile(),
                type:     HomeScreenDocumentationTile,
                icon:     getImage('images/files/homeHelp.svg'),
                title:    'Open documentation &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 8,
                onClick:  dispatcher.dispatch.bind(dispatcher, 'Dialog.Help.Show', {documentPath: settings.getDocumentPath()})
            }),
            showThemeTile ?
                {
                    id:       addTile(),
                    ui:       ui,
                    icon:     getImage('images/misc/theme.svg'),
                    title:    'Theme',
                    settings: this._settings,
                    type:     HomeScreenThemeTile,
                    tabIndex: tabIndex.HOME_SCREEN + 9
                } :
                null
        ];
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: 'flt rel max-w max-h home-screen',
                children: [
                    {
                        className: 'abs max-w max-h home-screen-image-clip',
                        children: [
                            {
                                type:      'img',
                                src:       getImage('images/logos/wheelBlack.svg'),
                                className: 'home-screen-image'
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('homeScreenContentWrapper'),
                        className: 'flt rel max-w max-h home-screen-content-wrapper',
                        children: [
                            {
                                ref:       this.setRef('homeScreenContent'),
                                className: 'abs home-screen-content',
                                children:  this.initTiles()
                            }
                        ]
                    }
                ]
            }
        );
        let height = (Math.ceil(this._tileCount / 2) * 96 + 48) + 'px';
        this._refs.homeScreenContentWrapper.style.minHeight = height;
        this._refs.homeScreenContent.style.height           = height;
    }

    addHomeScreenTile(opts) {
        opts.type = opts.type || HomeScreenTile;
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
