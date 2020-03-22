/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Dialog     = require('../../lib/components/Dialog').Dialog;
const dispatcher = require('../../lib/dispatcher').dispatcher;

exports.GraphDialog = class extends Dialog {
    constructor(opts) {
        super(opts);
        this._layer      = 0;
        this._port       = 0;
        this._sampleRate = 0;
        this.createWindow(
            'graph-dialog new-graph',
            'New EV3 graph',
            [
                {
                    className: 'graph-dialog-text',
                    children: [
                        this.addToolOptions({
                            tabIndex: 1,
                            title:    'Layer',
                            options:  ['1', '2', '3', '4'],
                            onSelect: this.onSelectLayer.bind(this)
                        }),
                        this.addToolOptions({
                            tabIndex: 2,
                            title:    'Port',
                            options:  ['1', '2', '3', '4'],
                            onSelect: this.onSelectPort.bind(this)
                        }),
                        this.addToolOptions({
                            tabIndex: 3,
                            title:   'Sample rate',
                            options: ['1/sec', '2/sec', '5/sec', '10/sec', '20/sec'],
                            onSelect: this.onSelectSampleRate.bind(this)
                        })
                    ]
                },
                {
                    className: 'buttons',
                    children: [
                        this.addButton({
                            ref:      this.setRef('buttonApply'),
                            tabIndex: 128,
                            value:    'Ok',
                            onClick:  this.onApply.bind(this)
                        }),
                        this.addButton({
                            tabIndex: 129,
                            value:    'Cancel',
                            color:    'dark-green',
                            onClick:  this.hide.bind(this)
                        })
                    ]
                }
            ]
        );
        dispatcher.on('Dialog.Graph.New.Show', this, this.onShow);
    }

    addToolOptions(opts) {
        let options = [];
        opts.options.forEach(function(option) {
            options.push({value: option});
        });
        return {
            className: 'graph-dialog-row',
            children: [
                super.addToolOptions({
                    tabIndex: opts.tabIndex,
                    label:    opts.title,
                    color:    'green',
                    onSelect: opts.onSelect || function() {},
                    options:  options
                })
            ]
        };
    }

    onSelectLayer(layer) {
        this._layer = layer;
    }

    onSelectPort(port) {
        this._port = port;
    }

    onSelectSampleRate(sampleRate) {
        this._sampleRate = sampleRate;
    }

    onApply() {
        this._onApply({
            layer:    this._layer,
            port:     this._port,
            interval: [1000, 500, 200, 100, 50][this._sampleRate]
        });
        this.hide();
    }

    onShow(opts) {
        super.show();
        this._onApply = opts.onApply;
    }
};
