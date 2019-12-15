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
                        icon:      'icon-left',
                        title:     'Undo',
                        disabled:  true,
                        onClick:   soundEditor.onUndo.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('play'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_PLAY,
                        icon:      'icon-play',
                        title:     'Play',
                        onClick:   soundEditor.onPlay.bind(soundEditor)
                    }),
                    // Copy, paste, delete...
                    this.addButton({
                        ref:       soundEditor.setRef('copy'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_COPY,
                        icon:      'icon-copy',
                        title:     'Copy',
                        disabled:  true,
                        onClick:   soundEditor.onCopy.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('paste'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_PASTE,
                        icon:      'icon-paste',
                        title:     'Paste',
                        disabled:  true,
                        onClick:   soundEditor.onPaste.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('delete'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_DELETE,
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
                        icon:      'icon-volume',
                        title:     'Volume',
                        onClick:   soundEditor.onVolume.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('fadeIn'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_FADE_IN,
                        icon:      'icon-fade-in',
                        title:     'Fade in',
                        onClick:   soundEditor.onFadeIn.bind(soundEditor)
                    }),
                    this.addButton({
                        ref:       soundEditor.setRef('fadeOut'),
                        uiId:      soundEditor.getUIId.bind(soundEditor),
                        tabIndex:  tabIndex.SOUND_FADE_OUT,
                        icon:      'icon-fade-out',
                        title:     'Fade out',
                        onClick:   soundEditor.onFadeOut.bind(soundEditor)
                    })
                ]
            }
        );
    }
};
