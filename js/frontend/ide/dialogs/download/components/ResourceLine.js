/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../../lib/dom').DOMNode;

exports.ResourceLine = class extends DOMNode {
    constructor(opts) {
        super(opts);
        if (opts.elementId) {
            opts.elementByFilename[opts.elementId] = this;
        } else {
            opts.elementByFilename[opts.filename] = this;
        }
        this._filename = opts.filename;
        this.initDOM(opts.parentNode);
    }

    setResult(result) {
        let refs = this._refs;
        if (result.error) {
            if (result.message) {
                refs.errorLine.className    = 'download-line fail';
                refs.errorMessage.innerHTML = result.message;
            } else {
                refs.line.className = 'download-line fail';
            }
        } else {
            refs.line.className = 'download-line success';
        }
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                children: [
                    {
                        ref:       this.setRef('line'),
                        className: 'download-line',
                        children: [
                            {
                                type:      'span',
                                className: 'icon'
                            },
                            {
                                type:      'span',
                                className: 'filename',
                                innerHTML: this._filename
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('errorLine'),
                        className: 'download-line fail hidden',
                        children: [
                            {
                                type:      'span',
                                className: 'icon'
                            },
                            {
                                ref:       this.setRef('errorMessage'),
                                type:      'span',
                                className: 'message'
                            }
                        ]
                    }
                ]
            }
        );
    }
};
