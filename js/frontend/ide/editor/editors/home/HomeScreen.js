/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const path                           = require('../../../../../shared/lib/path');
const platform                       = require('../../../../../shared/lib/platform');
const dispatcher                     = require('../../../../lib/dispatcher').dispatcher;
const DOMNode                        = require('../../../../lib/dom').DOMNode;
const getImage                       = require('../../../data/images').getImage;
const tabIndex                       = require('../../../tabIndex');
const connectionHelper               = require('../../../helper/connectionHelper');
const HomeScreenTile                 = require('./components/HomeScreenTile').HomeScreenTile;
const HomeScreenConnectNXTTile       = require('./components/HomeScreenConnectNXTTile').HomeScreenConnectNXTTile;
const HomeScreenConnectEV3Tile       = require('./components/HomeScreenConnectEV3Tile').HomeScreenConnectEV3Tile;
const HomeScreenConnectPoweredUpTile = require('./components/HomeScreenConnectPoweredUpTile').HomeScreenConnectPoweredUpTile;
const HomeScreenConnectSpikeTile     = require('./components/HomeScreenConnectSpikeTile').HomeScreenConnectSpikeTile;
const HomeScreenThemeTile            = require('./components/HomeScreenThemeTile').HomeScreenThemeTile;
const HomeScreenRecentProjectTile    = require('./components/HomeScreenRecentProjectTile').HomeScreenRecentProjectTile;
const HomeScreenRecentFormTile       = require('./components/HomeScreenRecentFormTile').HomeScreenRecentFormTile;
const HomeScreenDocumentationTile    = require('./components/HomeScreenDocumentationTile').HomeScreenDocumentationTile;
const HomeScreenNewProjectTile       = require('./components/HomeScreenNewProjectTile').HomeScreenNewProjectTile;

exports.HomeScreen = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui           = opts.ui;
        this._settings     = opts.settings;
        this._devices      = opts.devices;
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
            {
                className: 'flt max-w home-title',
                innerHTML: 'Explore'
            },
            this.addHomeScreenTile({
                id:       addTile(),
                type:     HomeScreenDocumentationTile,
                icon:     getImage('images/files/homeHelp.svg'),
                title:    'Open documentation &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 2,
                onClick:  dispatcher.dispatch.bind(dispatcher, 'Dialog.Help.Show', {documentPath: settings.getDocumentPath()})
            }),
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/recentWhlp.svg'),
                title:    'Open an example &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 4,
                onClick:  dispatcher.dispatch.bind(dispatcher, 'Dialog.Example.Show')
            }),
            {
                className: 'flt max-w home-title',
                innerHTML: 'Create'
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
                    tabIndex: tabIndex.HOME_SCREEN + 6
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
                    tabIndex: tabIndex.HOME_SCREEN + 8
                } :
                null),
            {
                id:             addTile(),
                ui:             ui,
                uiId:           1,
                icon:           getImage('images/files/homeWhlp.svg'),
                type:           HomeScreenNewProjectTile,
                tabIndex:       tabIndex.HOME_SCREEN + 10,
                settings:       settings
            },
            this.addHomeScreenTile({
                id:       addTile(),
                icon:     getImage('images/files/homeWhl.svg'),
                title:    'New file &raquo;',
                tabIndex: tabIndex.HOME_SCREEN + 12,
                onClick:  dispatcher.dispatch.bind(dispatcher, 'Dialog.File.New.Show', 'File', activeDirectory)
            }),
            this.addHomeScreenTile({
                id:             addTile(),
                icon:           getImage('images/files/homeRgf.svg'),
                title:          'New image EV3 &raquo;',
                tabIndex:       tabIndex.HOME_SCREEN + 14,
                settings:       settings,
                settingsGetter: settings.getShowEV3ImageTile.bind(settings),
                onClick:        dispatcher.dispatch.bind(dispatcher, 'Dialog.Image.New.Show', activeDirectory, settings.getDocumentPath())
            }),
            this.addHomeScreenTile({
                id:             addTile(),
                icon:           getImage('images/files/homeForm.svg'),
                title:          'New form &raquo;',
                settings:       settings,
                settingsGetter: settings.getShowNewFormTile.bind(settings),
                tabIndex:       tabIndex.HOME_SCREEN + 16,
                onClick:        dispatcher.dispatch.bind(dispatcher, 'Dialog.Form.New.Show', activeDirectory, settings.getDocumentPath())
            }),
            (settings.getShowNXTTile() || settings.getShowEV3Tile || settings.getShowPoweredUpTile() || settings.getShowSpikeTile()) ?
                {
                    className: 'flt max-w home-title',
                    innerHTML: 'Connect device'
                } :
                null,
            {
                id:             addTile(),
                ui:             ui,
                icon:           getImage('images/files/homeNxt.svg'),
                title:          'Connect NXT &raquo;',
                type:           HomeScreenConnectNXTTile,
                tabIndex:       tabIndex.HOME_SCREEN + 18,
                settings:       settings,
                settingsGetter: settings.getShowNXTTile.bind(settings),
                nxt:            this._devices.nxt,
                onClick:        connectionHelper.connectNXT.bind(this, this._settings, this._devices.nxt)
            },
            {
                id:             addTile(),
                ui:             ui,
                icon:           getImage('images/files/homeEv3.svg'),
                title:          'Connect EV3 &raquo;',
                type:           HomeScreenConnectEV3Tile,
                tabIndex:       tabIndex.HOME_SCREEN + 20,
                settings:       settings,
                settingsGetter: settings.getShowEV3Tile.bind(settings),
                ev3:            this._devices.ev3,
                onClick:        connectionHelper.connectEV3.bind(this, this._settings, this._devices.ev3)
            },
            {
                id:             addTile(),
                ui:             ui,
                icon:           getImage('images/files/homePoweredUp.svg'),
                title:          'Connect Powered Up &raquo;',
                type:           HomeScreenConnectPoweredUpTile,
                tabIndex:       tabIndex.HOME_SCREEN + 22,
                settings:       settings,
                settingsGetter: settings.getShowPoweredUpTile.bind(settings),
                poweredUp:      this._devices.poweredUp,
                onClick:        connectionHelper.connectPoweredUp.bind(this, this._settings, this._devices.poweredUp)
            },
            {
                id:             addTile(),
                ui:             ui,
                icon:           getImage('images/files/homeSpike.svg'),
                title:          'Connect Spike &raquo;',
                type:           HomeScreenConnectSpikeTile,
                tabIndex:       tabIndex.HOME_SCREEN + 24,
                settings:       settings,
                settingsGetter: settings.getShowSpikeTile.bind(settings),
                spike:          this._devices.spike,
                onClick:        connectionHelper.connectSpike.bind(this, this._settings, this._devices.spike)
            },
            showThemeTile ?
                {
                    className: 'flt max-w home-title',
                    innerHTML: 'Setup'
                } :
                null,
            showThemeTile ?
                {
                    id:       addTile(),
                    ui:       ui,
                    icon:     getImage('images/misc/theme.svg'),
                    title:    'Theme',
                    settings: this._settings,
                    type:     HomeScreenThemeTile,
                    tabIndex: tabIndex.HOME_SCREEN + 26
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
                                src:       getImage('images/logos/wheelHome.svg'),
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
