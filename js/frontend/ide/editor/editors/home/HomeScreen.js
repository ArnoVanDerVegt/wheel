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
                icon:     getImage('images/files/whlp.svg'),
                title:    'Create new project &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 2,
                onClick: function() {
                    dispatcher.dispatch('Dialog.File.New.Show', 'Project', activeDirectory);
                }
            }),
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/whl.svg'),
                title:    'New file &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 3,
                onClick: function() {
                    dispatcher.dispatch('Dialog.File.New.Show', 'File', activeDirectory);
                }
            }),
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/rgf.svg'),
                title:    'New image EV3 &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 4,
                onClick: function() {
                    dispatcher.dispatch('Dialog.Image.New.Show', activeDirectory, settings.getDocumentPath());
                }
            }),
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/form.svg'),
                title:    'New form &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 5,
                onClick: function() {
                    dispatcher.dispatch('Dialog.Form.New.Show', activeDirectory, settings.getDocumentPath());
                }
            }),
            {
                id:       addTile(),
                ui:       ui,
                icon:     getImage('images/files/ev3.svg'),
                title:    'Connect to EV3 &raquo;',
                type:     HomeScreenConnectEV3Tile,
                tabIndex: tabIndex.HOME_SCREEN + 6,
                ev3:      this._ev3,
                onClick: function() {
                    if (platform.isElectron()) {
                        dispatcher.dispatch('Dialog.ConnectEV3.Show');
                    } else {
                        dispatcher.dispatch(
                            'Dialog.Alert.Show',
                            {
                                title: (platform.isNode() ? 'Node' : 'Browser') + ' version',
                                lines: [
                                    'The browser version can not connect to your EV3...',
                                    'Please install the (free) <a href="../../site/install.html" target="_download">Electron version</a> to use all features.'
                                ]
                            }
                        );
                    }
                }
            },
            {
                id:        addTile(),
                ui:        ui,
                icon:      getImage('images/files/poweredUp.svg'),
                title:     'Connect to Powered Up &raquo;',
                type:      HomeScreenConnectPoweredUpTile,
                tabIndex:  tabIndex.HOME_SCREEN + 7,
                poweredUp: this._poweredUp,
                onClick: function() {
                    if (platform.isElectron() || platform.isNode()) {
                        dispatcher.dispatch('Dialog.ConnectPoweredUp.Show');
                    } else {
                        dispatcher.dispatch(
                            'Dialog.Alert.Show',
                            {
                                title: 'Browser version',
                                lines: [
                                    'The browser version can not connect to your Powered Up devices...',
                                    'Please install the (free) <a href="../../site/install.html" target="_download">Electron version</a> to use all features.'
                                ]
                            }
                        );
                    }
                }
            },
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/help.svg'),
                title:    'Open documentation &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 8,
                onClick: function() {
                    dispatcher.dispatch('Dialog.Help.Show', {documentPath: settings.getDocumentPath()});
                }
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
                        ref:       this.setRef('homeScreenContentWrapper'),
                        className: 'home-screen-content-wrapper',
                        children: [
                            {
                                ref:       this.setRef('homeScreenContent'),
                                className: 'home-screen-content',
                                children:  this.initTiles()
                            }
                        ]
                    }
                ]
            }
        );
        let height = (Math.ceil(this._tileCount / 2) * 96 + 48) + 'px';
        this._refs.homeScreenContentWrapper.style.height = height;
        this._refs.homeScreenContent.style.height        = height;
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
