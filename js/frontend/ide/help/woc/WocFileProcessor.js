/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const FileProcessor = require('./FileProcessor').FileProcessor;
const getImage      = require('../../data/images').getImage;

exports.WocFileProcessor = class extends FileProcessor {
    saveWoc(wocByName, woc, wocName) {
        if (!wocName) {
            return woc;
        }
        while (woc.text.length && (woc.text[woc.text.length - 1].trim() === '')) {
            woc.text.pop();
        }
        while (woc.example.length && (woc.example[woc.example.length - 1].trim() === '')) {
            woc.example.pop();
        }
        wocName = wocName.trim();
        if (wocName.indexOf(',') === -1) {
            wocByName[wocName.trim()] = woc;
        } else {
            wocName = wocName.split(',');
            wocName.forEach(function(wocName) {
                if (wocName.trim() !== '') {
                    wocByName[wocName.trim()] = woc;
                }
            });
        }
        return {text: [], example: []};
    }

    process(wocByName) {
        let mode    = null;
        let wocName = null;
        let woc     = {text: [], example: []};
        while (this._index < this._lines.length) {
            let line = this.readLine();
            if (line.indexOf('@for') === 0) {
                woc     = this.saveWoc(wocByName, woc, wocName);
                wocName = line.substr(5, line.length - 5).trim();
                mode    = 'text';
            } else if (line.indexOf('@example') === 0) {
                mode = 'example';
            } else if (mode === 'text') {
                if (line.indexOf('@image') === 0) {
                    let src = line.substr(6 - line.length).trim();
                    line = '<img src="' + (getImage(src) || src) + '"/>';
                } else {
                    line = line.split('@br').join('<br/>');
                }
                woc.text.push(line);
            } else if (mode === 'example') {
                woc.example.push(line);
            }
        }
        this.saveWoc(wocByName, woc, wocName);
    }
};
