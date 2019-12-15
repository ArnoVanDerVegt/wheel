/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../../../lib/dispatcher').dispatcher;
const path       = require('../../../../lib/path');

exports.SoundLoader = class {
    constructor() {
        dispatcher.on('SoundLoader.Loaded', this, this.onSelectedChannel);
    }

    load(opts, callback) {
        this._callback     = callback;
        this._audioContext = null;
        this._opts         = opts;
        this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this._audioContext.decodeAudioData(opts.value, this.onDecodeAudioData.bind(this));
    }

    onDecodeAudioData(buffer) {
        this._buffer = buffer;
        let list = [];
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            list.push('Channel(' + (i + 1) + ')');
        }
        dispatcher.dispatch(
            'Dialog.List.Show',
            {
                title:         'Load ' + path.getExtension(this._opts.filename) + ', select channel',
                applyTitle:    'Load',
                list:          list,
                dispatchApply: 'SoundLoader.Loaded'
            }
        );
    }

    onSelectedChannel(channel) {
        let buffer      = this._buffer;
        let channelData = buffer.getChannelData(channel);
        let length      = channelData.length;
        let output      = [0, 1, 2, 3, 4, 5, 6, 7];
        let step        = (this._audioContext.sampleRate / 8000) * 2;
        let i           = 0;
        let j           = 0;
        while (i < length) {
            j += step;
            let min0     =  0;
            let min1     =  0;
            let min2     = -1;
            let max0     =  0;
            let max1     =  0;
            let max2     =  1;
            let minCount =  0;
            let maxCount =  0;
            while ((i < j) && (i < length)) {
                let c = channelData[i];
                if (c < 0) {
                    min0 += c;
                    min1 = Math.min(c, min1);
                    min2 = Math.max(c, min2);
                    minCount++;
                } else {
                    max0 += c;
                    max1 = Math.max(c, max1);
                    max2 = Math.min(c, max2);
                    maxCount++;
                }
                i++;
            }
            let a;
            if (minCount > 0) {
                a = (min1 + min2) * 0.2 + (min0 / minCount) * 0.4;
            } else {
                a = 0;
            }
            let b;
            if (maxCount > 0) {
                b = (max1 + max2) * 0.2 + (max0 / maxCount) * 0.4;
            } else {
                b = 0;
            }
            output.push(
                Math.floor(Math.min(Math.max(128 + a * 256, 0), 255)),
                Math.floor(Math.min(Math.max(128 + b * 256, 0), 255))
            );
        }
        this._opts.value = {data: output};
        this._callback(this._opts);
    }
};
