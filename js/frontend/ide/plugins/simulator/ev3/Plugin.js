/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const platform        = require('../../../../lib/platform');
const dispatcher      = require('../../../../lib/dispatcher').dispatcher;
const DOMNode         = require('../../../../lib/dom').DOMNode;
const Button          = require('../../../../lib/components/Button').Button;
const SettingsState   = require('../../../settings/SettingsState');
const SimulatorPlugin = require('../lib/SimulatorPlugin').SimulatorPlugin;
const Display         = require('./io/Display').Display;
const Buttons         = require('./io/Buttons').Buttons;
const EV3Button       = require('./io/Buttons').Button;
const Sound           = require('./io/Sound').Sound;

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        this._baseClassName = 'ev3';
        this._sound         = new Sound();
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('ev3'),
                className: this.getClassName(),
                children: [
                    {
                        className: 'ev3-left'
                    },
                    {
                        className: 'flt max-w ev3-body',
                        children: [
                            {
                                className: 'flt ev3-display',
                                children: [
                                    {
                                        className: 'flt rel display-border',
                                        children: [
                                            {
                                                id:   this.setDisplayElement.bind(this),
                                                type: 'canvas',
                                                ui:   this._ui
                                            },
                                            (platform.isElectron()) ?
                                                {
                                                    type:     Button,
                                                    ui:       this._ui,
                                                    color:    'blue',
                                                    value:    'Copy',
                                                    onClick:  this.onCopyDisplay.bind(this)
                                                } :
                                                null
                                        ]
                                    }
                                ]
                            },
                            {
                                className: 'flt rel ev3-panel',
                                children: [
                                    {
                                        id:   this.setButtons.bind(this),
                                        type: Buttons,
                                        ui:   this._ui
                                    },
                                    {
                                        type:      EV3Button,
                                        ui:        this._ui,
                                        className: 'abs ev3-button-stop',
                                        up:        'abs ev3-button-stop',
                                        down:      'abs ev3-button-stop pressed',
                                        onClick:   this._onStop
                                    }
                                ]
                            },
                            {
                                className: 'flt ev3-bottom',
                                children: [
                                    {
                                        className: 'flt ev3-log-text',
                                        innerHTML: 'WHL'
                                    },
                                    {
                                        className: 'frt ev3-logo'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        className: 'ev3-right'
                    }
                ]
            }
        );
    }

    getButtons() {
        return this._buttons;
    }

    setButtons(buttons) {
        this._buttons = buttons;
    }

    setDisplayElement(element) {
        this._canvas  = element;
        this._display = new Display({canvas: element});
    }

    getDisplay() {
        return this._display;
    }

    getSound() {
        return this._sound;
    }

    getLight() {
        return require('./io/Light').light;
    }

    onPluginSettings() {
        this._refs.ev3.className = this.getClassName();
    }

    onCopyDisplay() {
        const clipboard   = require('electron').clipboard;
        const nativeImage = require('electron').nativeImage;
        clipboard.writeImage(nativeImage.createFromDataURL(this._canvas.toDataURL('image/png')));
        dispatcher.dispatch(
            'Console.Log',
            {
                type:    SettingsState.CONSOLE_MESSAGE_TYPE_INFO,
                message: 'Copied display to clipboard.'
            }
        );
    }
};
