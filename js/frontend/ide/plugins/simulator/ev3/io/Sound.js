/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Sound = class {
    constructor() {
        this._ctx = null;
    }

    createAudio() {
        if (this._ctx) {
            return this._ctx;
        }
        let CtxClass   = window.audioContext || window.AudioContext || window.AudioContext || window.webkitAudioContext;
        this._ctx      = new CtxClass();
        this._gainNode = this._ctx.createGain();
        this._gainNode.connect(this._ctx.destination);
        return this._ctx;
    }

    playTone(tone) {
        let ctx        = this.createAudio();
        let oscillator = ctx.createOscillator();
        this._gainNode.gain.value = tone.volume / 100;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(tone.frequency, ctx.currentTime);
        oscillator.connect(ctx.destination);
        if (oscillator.noteOn) {
            oscillator.noteOn(0);
        }
        if (oscillator.start) {
            oscillator.start();
        }
        setTimeout(
            function() {
                if (oscillator.noteOff) {
                    oscillator.noteOff(0);
                }
                if (oscillator.stop) {
                    oscillator.stop();
                }
            },
            Math.abs(tone.duration)
        );
    }
};
