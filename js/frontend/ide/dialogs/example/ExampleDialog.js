/**
 * Wheel, copyright (c) 2021 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher      = require('../../../lib/dispatcher').dispatcher;
const Dialog          = require('../../../lib/components/Dialog').Dialog;
const Img             = require('../../../lib/components/basic/Img').Img;
const getImage        = require('../../data/images').getImage;
const ExampleCategory = require('./components/ExampleCategory').ExampleCategory;
const examples        = require('./constants').examples;

exports.ExampleDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this.initWindow({
            showSignal: 'Dialog.Example.Show',
            width:      754,
            height:     530,
            className:  'no-select example-dialog',
            title:      'Open an example'
        });
    }

    initWindowContent(opts) {
        return [
            {
                ref:       this.setRef('text'),
                className: 'dialog-lt dialog-cw abs ui1-box example vertical-list',
                children:  this.initCategories()
            },
            this.initButtons([
                {
                    value:    'Close',
                    tabIndex: 512,
                    onClick:  this.hide.bind(this)
                }
            ])
        ];
    }

    initCategories() {
        let result = [];
        examples.forEach((example, index) => {
            result.push({
                type:     ExampleCategory,
                example:  example,
                tabIndex: index * 8,
                dialog:   this
            });
        });
        return result;
    }

    onOpenExample(filename) {
        dispatcher.dispatch('Dialog.File.Open', filename);
        this.hide();
    }

    onShow(opts) {
        this.show();
    }
};
