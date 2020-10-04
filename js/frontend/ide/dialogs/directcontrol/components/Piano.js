/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const soundModuleConstants = require('../../../../../shared/vm/modules/soundModuleConstants');
const DOMNode              = require('../../../../lib/dom').DOMNode;
const PianoKey             = require('./PianoKey').PianoKey;

exports.Piano = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._device          = opts.device;
        this._dialog          = opts.dialog;
        this._uiId            = opts.uiId;
        this._keyElements     = [];
        this._elementByHotKey = {};
        this.initDOM(opts.parentNode, opts.dialog);
    }

    initDOM(parentNode, dialog) {
        let children = [];
        let hotkeys1 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];
        let hotkeys2 = ['W', 'E', 'T', 'Y', 'U', 'O', 'P'];
        let tabIndex = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 11, 13, 17, 19, 21, 25, 27];
        for (let key = 0; key < 10; key++) {
            children.push({
                className: 'flt rel key max-h',
                children: [
                    {
                        type:      PianoKey,
                        piano:     this,
                        className: 'flt rel key max-h',
                        key:       key,
                        hotkey:    hotkeys1[key],
                        tabIndex:  tabIndex[key]
                    }
                ]
            });
        }
        for (let key = 0; key < 7; key++) {
            children.push({
                className: 'abs key max-h half half' + key,
                children: [
                    {
                        type:      PianoKey,
                        piano:     this,
                        className: 'abs key max-h half half' + key,
                        key:       10 + key,
                        hotkey:    hotkeys2[key],
                        tabIndex:  tabIndex[10 + key]
                    }
                ]
            });
        }
        this.create(
            parentNode,
            {
                ref:       dialog.setRef('piano'),
                className: 'piano hidden',
                children:  children
            }
        );
    }

    setKeyElement(element, key, hotkey, className) {
        this._keyElements.push(element);
        this._elementByHotKey[hotkey] = {
            element:   element,
            key:       key,
            className: className
        };
        element.addEventListener('keydown',   this.onKeyDown.bind(this, key, hotkey, className));
        element.addEventListener('keyup',     this.onKeyUp.bind(this, key, hotkey, className));
        element.addEventListener('mousedown', this.onMouseDown.bind(this, key, className));
        element.addEventListener('mouseup',   this.onMouseUp.bind(this, key, className));
        element.addEventListener('mouseout',  this.onMouseUp.bind(this, key, className));
        element.addEventListener('click',     this.onClick.bind(this));
    }

    onKeyDown(key, hotkey, className, event) {
        let ch      = (event.keyCode === 186) ? ';' : String.fromCharCode(event.keyCode);
        let element = this._elementByHotKey[ch];
        if (element) {
            this.onCancelEvent(event);
            element.element.parentNode.className = element.className + ' down';
            this.playTone(element.key);
        }
    }

    onKeyUp(key, hotkey, className, event) {
        let ch      = (event.keyCode === 186) ? ';' : String.fromCharCode(event.keyCode);
        let element = this._elementByHotKey[ch];
        if (element) {
            this.onCancelEvent(event);
            element.element.parentNode.className = element.className;
        }
    }

    onMouseDown(key, className, event) {
        this.onCancelEvent(event);
        event.target.focus();
        event.target.parentNode.className = className + ' down';
        this.playTone(key);
    }

    onMouseUp(key, className, event) {
        this.onCancelEvent(event);
        event.target.parentNode.className = className;
    }

    onClick(event) {
        this.onCancelEvent(event);
    }

    playTone(key) {
        let volume = this._dialog.getVolumeSliderElement().getValue();
        let tones  = [262, 294, 330, 349, 392, 440, 494, 523, 587, 659, 277, 311, 370, 415, 466, 554, 622];
        let sound  = {frequency: tones[key], duration: 500, volume: volume};
        this._device.module(soundModuleConstants.MODULE_SOUND, soundModuleConstants.SOUND_PLAY_TONE, sound);
    }
};
