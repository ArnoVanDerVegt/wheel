/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const DOMNode = require('../../../lib/dom').DOMNode;
const H       = require('../../../lib/components/basic/H').H;

class HelpLink {
    constructor(opts) {
        this._dialog  = opts.dialog;
        this._title   = opts.name;
        this._index   = opts.index;
        this._device  = opts.device;
        this._subject = opts.subject;
    }

    getOutput() {
        const HelpBuilderText = require('../../help/HelpBuilderText');
        let output = [
                '            <div class="link">',
                '                <a href="' + HelpBuilderText.getFilename(this._subject) + '">' + this._title + '</a>'
            ];
        if (this._device) {
            this._device.split(',').forEach(function(device) {
                if (!device) {
                    return;
                }
                output.push('                <span class="device ' + device.toLowerCase() + '">' + device + '</span>');
            });
        }
        output.push('            </div>');
        return output;
    }
}

exports.IndexListText = class extends DOMNode {
    constructor(opts) {
        super(opts);
        this._dialog    = opts.dialog;
        this._title     = opts.title;
        this._helpFiles = opts.helpFiles;
        this._helpFiles.sort();
    }

    getOutput() {
        let output = [
                '<div class="third">',
                '    <h3>' + this._title + '</h3>',
                '    <ul>'
            ];
        this._helpFiles.forEach(
            function(helpFile) {
                output.push('        <li>');
                output.push.apply(output, new HelpLink(helpFile).getOutput());
                output.push('        </li>');
            },
            this
        );
        output.push(
            '    </ul>',
            '</div>'
        );
        return output;
    }
};
