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
        this._layerTools = [];
        this.initWindow({
            showSignal: 'Dialog.Graph.New.Show',
            width:      640,
            height:     256,
            className:  'graph-dialog new-graph',
            title:      'Graph'
        });
    }

    initWindowContent(opts) {
        let children = [];
        for (let i = 1; i < 6; i++) {
            let options = [];
            for (let j = 0; j < i; j++) {
                options.push((j + 1) + '');
            }
            children.push(this.addToolOptions({
                ref:      'layers' + i,
                tabIndex: 1 + i,
                title:    'Layer',
                options:  options,
                onSelect: this.onSelectLayer.bind(this)
            }));
        }
        [4, 6].forEach((portCount) => {
            let options = [];
            for (let i = 0; i < portCount; i++) {
                options.push((i + 1) + '');
            }
            children.push(this.addToolOptions({
                ref:      'ports' + portCount,
                tabIndex: 10 + portCount,
                title:    'Port',
                options:  options,
                onSelect: this.onSelectPort.bind(this)
            }));
        });
        children.push(
            this.addToolOptions({
                tabIndex: 41,
                title:   'Sample rate',
                options: ['1/sec', '2/sec', '5/sec', '10/sec', '20/sec'],
                onSelect: this.onSelectSampleRate.bind(this)
            })
        );
        return [
            {
                className: 'abs dialog-cw dialog-lt input-row graph-dialog-text',
                children:  children
            },
            this.initButtons([
                {
                    ref:      this.setRef('buttonApply'),
                    tabIndex: 128,
                    value:    'Ok',
                    onClick:  this.onApply.bind(this)
                },
                {
                    tabIndex: 129,
                    value:    'Cancel',
                    color:    'dark-green',
                    onClick:  this.hide.bind(this)
                }
            ])
        ];
    }

    addToolOptions(opts) {
        let options = [];
        opts.options.forEach((option) => {
            options.push({value: option});
        });
        return {
            ref:       this.setRef(opts.ref),
            className: 'flt max-w input-row graph-dialog-row',
            children: [
                super.addToolOptions({
                    color:    'green',
                    tabIndex: opts.tabIndex,
                    label:    opts.title,
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
        let refs = this._refs;
        for (let i = 1; i < 6; i++) {
            refs['layers' + i].style.display = (i === opts.deviceCount) ? 'block' : 'none';
        }
        [4, 6].forEach((portCount) => {
            refs['ports' + portCount].style.display = (portCount === opts.portsPerLayer) ? 'block' : 'none';
        });
        refs.title.innerHTML = opts.title;
        this._onApply        = opts.onApply;
    }
};
