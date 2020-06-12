/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const RgfImage   = require('../../shared/lib/RgfImage').RgfImage;
const dispatcher = require('./dispatcher').dispatcher;
const path       = require('./path');

class DropHandler {
    constructor(opts) {
        this._settings = opts.settings;
        document.body.addEventListener('dragover', this.onDragOver.bind(this));
        document.body.addEventListener('drop',     this.onDropFiles.bind(this));
    }

    addEventListeners() {
        document.body.addEventListener('dragover', this.onDragOver.bind(this));
        document.body.addEventListener('drop',     this.onDropFiles.bind(this));
    }

    readData(data) {
        if (typeof data !== 'string') {
            return null;
        }
        let i = data.indexOf('base64,');
        try {
            return atob(data.substr(i + 7 - data.length));
        } catch (error) {
        }
        return null;
    }

    readRsfData(data) {
        let sound = [];
        for (let i = 0; i < data.length; i++) {
            sound.push(data.charCodeAt(i));
        }
        return {type: 'Buffer', data: sound};
    }

    readFile(file) {
        let reader = new FileReader();
        reader.addEventListener(
            'load',
            (function() {
                let data = this.readData(reader.result);
                if (data === null) {
                    return;
                }
                let filename = path.getPathAndFilename(file.name).filename;
                filename = path.join(this._settings.getDocumentPath(), filename);
                let extension = path.getExtension(filename);
                switch (extension) {
                    case '.jpg':
                    case '.jpeg':
                    case '.png':
                    case '.bmp':
                    case '.gif':
                        dispatcher.dispatch('FileDrop.Open', filename, 'data:image/' + extension.substr(1 - extension.length) + ';base64,' + btoa(data), false);
                        break;
                    case '.woc':
                    case '.whl':
                    case '.whlp':
                    case '.wfrm':
                        dispatcher.dispatch('FileDrop.Open', filename, data, false);
                        break;
                    case '.rgf':
                        dispatcher.dispatch('FileDrop.Open', filename, new RgfImage().unpack(data), false);
                        break;
                    case '.rsf':
                        dispatcher.dispatch('FileDrop.Open', filename, this.readRsfData(data), false);
                        break;
                }
            }).bind(this)
        );
        reader.readAsDataURL(file);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDropFiles(event) {
        event.preventDefault();
        let files = [];
        let i;
        if (event.dataTransfer.items) {
            let items = event.dataTransfer.items;
            for (i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    files.push(items[i].getAsFile());
                }
            }
        } else {
            for (i = 0; i < event.dataTransfer.files.length; i++) {
                files.push(event.dataTransfer.files[i]);
            }
        }
        if (files.length) {
            for (i = 0; i < files.length; i++) {
                this.readFile(files[i]);
            }
        }
    }
}

exports.init = function(settings) {
    new DropHandler({settings: settings});
};
