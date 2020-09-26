/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const File = require('./File');

exports.FileDetail = class extends File.File {
    constructor(opts) {
        opts.className = 'file detail';
        super(opts);
    }

    initDOM(parentNode) {
        let file = this._file;
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this._className,
                children: [
                    File.getIcon(this._getImage, file),
                    {
                        id:        this.setLinkElement.bind(this),
                        type:      'a',
                        href:      '#',
                        className: 'no-select name',
                        innerHTML: file.name
                    },
                    !file.directory && file.size ?
                        {
                            type:      'span',
                            href:      '#',
                            className: 'no-select size',
                            innerHTML: file.size + ' - ' + this.bytesToSize(file.size)
                        } :
                        null,
                    (file.modified || file.hash) ?
                        {
                            type:      'span',
                            href:      '#',
                            className: 'no-select modified',
                            innerHTML: file.modified || file.hash
                        } :
                        null
                ]
            }
        );
    }

    /**
     * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    **/
    bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (parseInt(bytes, 10) === 0) {
            return '0 Byte';
        }
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
};
