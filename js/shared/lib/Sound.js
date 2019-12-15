/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Sound = class {
    constructor() {
        this._wav = null;
    }

    dec2hex(n, l) {
        n = n.toString(16);
        return new Array(l * 2 - n.length + 1).join('0') + n;
    }

    hex2str(hex) {
        let str = [];
        for (let i = 0; i < hex.length; i += 2) {
            str.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)));
        }
        return str.reverse().join('');
    }

    put(n, l) {
        return this.hex2str(this.dec2hex(n,l));
    }

    create(opts) {
        const DUR = 1;     // Duration in seconds
        const NCH = 1;     // Number of channels
        const SPS = 8000;  // Samples per second
        const BPS = 1;     // Bytes per sample

        // PCM Data
        // --------------------------------------------
        // Field           | Bytes | Content
        // --------------------------------------------
        // CkID            |     4 | "fmt "
        // Cksize          |     4 | 0x0000010 (16)
        // WFormatTag      |     2 | 0x0001 (PCM)
        // NChannels       |     2 | NCH
        // NSamplesPerSec  |     4 | SPS
        // NAvgBytesPerSec |     4 | NCH * BPS * SPS
        // NBlockAlign     |     2 | NCH * BPS * NCH
        // WBitsPerSample  |     2 | BPS * 8

        // Data_size = DUR * NCH * SPS * BPS
        // File_size = 44 (Header) + data_size

        let size = opts.offset2 - opts.offset1; // DUR * NCH * SPS * BPS;
        let data = 'RIFF' + this.put(44 + size, 4) + 'WAVEfmt ' + this.put(16, 4);

        data += this.put(1,               2); // WFormatTag (pcm)
        data += this.put(NCH,             2); // NChannels
        data += this.put(SPS,             4); // NSamplesPerSec
        data += this.put(NCH * BPS * SPS, 4); // NAvgBytesPerSec
        data += this.put(NCH * BPS,       2); // NBlockAlign
        data += this.put(BPS * 8,         2); // WBitsPerSample
        data += 'data' + this.put(size, 4);
        if ('volume' in opts) {
            let volume = opts.volume / 100;
            for (let i = opts.offset1; i < opts.offset2; i++) {
                data += String.fromCharCode(Math.round(opts.data[i] * volume));
            }
        } else {
            for (let i = opts.offset1; i < opts.offset2; i++) {
                data += String.fromCharCode(opts.data[i]);
            }
        }
        let wav = new Audio('data:Audio/WAV;base64,' + btoa(data));
        wav.addEventListener(
            'ended',
            function() {
                document.body.removeChild(wav);
                opts.onFinished();
            }
        );
        wav.play();
        document.body.appendChild(wav);
        this._wav = wav;
        return this;
    }

    getCurrentTime() {
        return this._wav ? this._wav.currentTime : 0;
    }
};
