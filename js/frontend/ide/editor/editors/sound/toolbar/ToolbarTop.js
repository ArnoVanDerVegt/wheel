/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode  = require('../../../../../lib/dom').DOMNode;
const Button   = require('../../../../../lib/components/Button').Button;
const Toolbar  = require('../../../../../lib/components/Toolbar').Toolbar;
const tabIndex = require('../../../../tabIndex');

exports.ToolbarTop = class extends Toolbar {
    constructor(opts) {
        super(opts);
        this._ui          = opts.ui;
        this._parentNode  = opts.parentNode;
        this._soundEditor = opts.soundEditor;
        this.initDOM();
    }

    initDOM() {
        let soundEditor = this._soundEditor;
        this.create(
            this._parentNode,
            {
                className: 'resource-options top',
                children: [
                    this.addButton({
                        ref:       soundEditor.setRef('undo'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_UNDO,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-undo',
                        title:     'Undo',
                        disabled:  true,
                        onClick:   soundEditor.onUndo.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('play'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_PLAY,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-play',
                        title:     'Play',
                        onClick:   soundEditor.onPlay.bind(soundEditor)
                    }),
                    // Copy, paste, delete...
                    this.addButton({
                        ref:       soundEditor.setRef('copy'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_COPY,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-copy',
                        title:     'Copy',
                        disabled:  true,
                        onClick:   soundEditor.onCopy.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('paste'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_PASTE,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-paste',
                        title:     'Paste',
                        disabled:  true,
                        onClick:   soundEditor.onPaste.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('delete'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_DELETE,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-delete',
                        title:     'Delete',
                        disabled:  true,
                        onClick:   soundEditor.onDelete.bind(soundEditor)
                    }),
                    // Volumne...
                    this.addLabel('Volume:'),
                    this.addButton({
                        ref:       soundEditor.setRef('volume'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_VOLUME,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-volume',
                        title:     'Volume',
                        onClick:   soundEditor.onVolume.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('fadeIn'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_FADE_IN,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-fade-in',
                        title:     'Fade in',
                        onClick:   soundEditor.onFadeIn.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('fadeOut'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_FADE_OUT,
                        className: 'toolbar-button',
                        color:     ' ',
                        icon:      'icon-fade-out',
                        title:     'Fade out',
                        onClick:   soundEditor.onFadeOut.bind(soundEditor)
                    })
                ]
            }
        );
    }
};
