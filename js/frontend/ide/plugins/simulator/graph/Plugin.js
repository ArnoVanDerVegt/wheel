/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher          = require('../../../../lib/dispatcher').dispatcher;
const DOMNode             = require('../../../../lib/dom').DOMNode;
const Button              = require('../../../../lib/components/Button').Button;
const CloseButton         = require('../../../../lib/components/CloseButton').CloseButton;
const Component           = require('../../../../lib/components/Component').Component;
const SimulatorPlugin     = require('../SimulatorPlugin').SimulatorPlugin;
const getImage            = require('../../../data/images').getImage;

const CircularBuffer      = require('./io/CircularBuffer').CircularBuffer;
const ChartDrawer         = require('./io/ChartDrawer').ChartDrawer;
const BarChartDrawer      = require('./io/BarChartDrawer').BarChartDrawer;
const BinaryChartDrawer   = require('./io/BinaryChartDrawer').BinaryChartDrawer;
const ColorBarChartDrawer = require('./io/ColorBarChartDrawer').ColorBarChartDrawer;
const FillChartDrawer     = require('./io/FillChartDrawer').FillChartDrawer;
const LineChartDrawer     = require('./io/LineChartDrawer').LineChartDrawer;
const PointChartDrawer    = require('./io/PointChartDrawer').PointChartDrawer;
const SplineChartDrawer   = require('./io/SplineChartDrawer').SplineChartDrawer;

class Chart extends DOMNode {
    constructor(opts) {
        super(opts);
        this._ui = opts.ui;
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'chart',
                children:
                [
                    {
                        className: 'chart-title',
                        children: [
                            {
                                type: 'img',
                                src:  getImage('images/ev3/color.png')
                            },
                            {
                                type: 'h3',
                                innerHTML: 'Layer 1, port 2'
                            },
                            {
                                type:    CloseButton,
                                onClick: this.onClose.bind(this),
                                ui:      this._ui
                            }
                        ]
                    },
                    {
                        ref:    this.setRef('canvas'),
                        type:   'canvas',
                        width:  260,
                        height: 96
                    }
                ]
            }
        );
        let canvas = this._refs.canvas;
        this._splineDrawer   = new FillChartDrawer    ({canvas: canvas});
        this._barDrawer      = new BarChartDrawer     ({canvas: canvas});
        this._colorBarDrawer = new ColorBarChartDrawer({canvas: canvas});
        this._pointDrawer    = new PointChartDrawer   ({canvas: canvas});
        this._buffer         = new CircularBuffer({});
    }

    addValue(value) {
        this._buffer.add(value, 7);

        this._splineDrawer
            .clear()
            .drawValueGrid();
        //1    .draw(this._buffer);
        this._colorBarDrawer
            .draw(this._buffer, 7);
        //2 this._pointDrawer
        //3    .draw(this._buffer);
    }

    onClose() {
    }
}

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        this._baseClassName       = 'graph';
        this._disconnectedTimeout = null;
        this.initDOM(opts.parentNode);
        this._brick
            .addEventListener('Brick.Connected',    this, this.onBrickConnected)
            .addEventListener('Brick.Disconnected', this, this.onBrickDisconnected);
        opts.settings.on('Settings.Plugin', this, this.onPluginSettings);
    }

    initTitle() {
        return [
            {
                className: 'title',
                children: [
                    {
                        type:      'span',
                        innerHTML: 'Graph'
                    },
                    {
                        type:    Button,
                        value:   'Add',
                        color:   'gray',
                        ui:      this._ui,
                        onClick: this.onAddChart.bind(this)
                    }
                ]
            }
        ];
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                ref:       this.setRef('graph'),
                className: this.getClassName(),
                children: [
                    {
                        className: 'chart-container',
                        children: [
                            {
                                ref: this.setRef('charts'),
                                children: [
                                    // {
                                    //     ref:  this.setRef('chart1'),
                                    //     type: Chart,
                                    //     ui:   this._ui
                                    // },
                                    // {
                                    //     ref:  this.setRef('chart2'),
                                    //     type: Chart,
                                    //     ui:   this._ui
                                    // }
                                ]
                            }
                        ].concat(this.initTitle())
                    }
                ]
            }
        );
        setInterval(this.onDraw.bind(this), 100);
    }

    onAddChart() {
    }

    onBrickConnected() {
        if (this._disconnectedTimeout) {
            clearTimeout(this._disconnectedTimeout);
            this._disconnectedTimeout = null;
        }
    }

    onBrickDisconnected() {
    }

    onPluginSettings() {
        this._refs.graph.className = this.getClassName();
    }

    onDraw() {
        let value = 0;
        let plugin = this._simulator.getPluginByUuid('b643ac7c-3886-11ea-a137-2e728ce88125'); // Sensor plugin...
        if (plugin) {
            value = plugin.getSensor(0, 1).read();
        }
        //this._refs.chart1.addValue(value);
        //this._refs.chart2.addValue(value);
    }

    reset() {
    }
};
