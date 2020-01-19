/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const sensorModuleConstants = require('../../../../../shared/vm/modules/sensorModuleConstants');
const dispatcher            = require('../../../../lib/dispatcher').dispatcher;
const DOMNode               = require('../../../../lib/dom').DOMNode;
const Button                = require('../../../../lib/components/Button').Button;
const CloseButton           = require('../../../../lib/components/CloseButton').CloseButton;
const Component             = require('../../../../lib/components/Component').Component;
const getImage              = require('../../../data/images').getImage;
const SimulatorPlugin       = require('../SimulatorPlugin').SimulatorPlugin;
const CircularBuffer        = require('./io/CircularBuffer').CircularBuffer;
const ChartDrawer           = require('./io/ChartDrawer').ChartDrawer;
const BarChartDrawer        = require('./io/BarChartDrawer').BarChartDrawer;
const BinaryChartDrawer     = require('./io/BinaryChartDrawer').BinaryChartDrawer;
const ColorBarChartDrawer   = require('./io/ColorBarChartDrawer').ColorBarChartDrawer;
const FillChartDrawer       = require('./io/FillChartDrawer').FillChartDrawer;
const LineChartDrawer       = require('./io/LineChartDrawer').LineChartDrawer;
const PointChartDrawer      = require('./io/PointChartDrawer').PointChartDrawer;
const SplineChartDrawer     = require('./io/SplineChartDrawer').SplineChartDrawer;

class Chart extends DOMNode {
    constructor(opts) {
        super(opts);
        this._parentNode          = opts.parentNode;
        this._plugin              = opts.plugin;
        this._sensorPlugin        = opts.sensorPlugin;
        this._layer               = opts.layer;
        this._port                = opts.port;
        this._interval            = opts.interval;
        this._ui                  = opts.ui;
        this._type                = null;
        this._time                = null;
        this._deltaTime           = 0;
        this._maxValue            = 1;
        this._canvasBuffer        = document.createElement('canvas');
        this._canvasBuffer.width  = 260 + 13;
        this._canvasBuffer.height = 96;
        this._context             = null;
        this.initDOM(opts.parentNode);
        this._plugin.addChart(this);
        window.requestAnimationFrame(this.onAnimate.bind(this));
    }

    remove() {
        this._parentNode.removeChild(this._refs.chart);
    }

    initDOM(parentNode) {
        this.create(
            parentNode,
            {
                className: 'chart',
                ref:       this.setRef('chart'),
                children:
                [
                    {
                        ref:    this.setRef('canvas'),
                        type:   'canvas',
                        width:  260,
                        height: 96
                    },
                    {
                        className: 'chart-title',
                        children: [
                            {
                                ref:  this.setRef('img'),
                                type: 'img',
                                style: {
                                    display: 'none'
                                }
                            },
                            {
                                type: 'h3',
                                innerHTML: 'Layer ' + (this._layer + 1) + ', port ' + (this._port + 1)
                            },
                            {
                                type:    CloseButton,
                                onClick: this.onClose.bind(this),
                                ui:      this._ui
                            }
                        ]
                    }
                ]
            }
        );
        this._fillDrawer     = new FillChartDrawer    ({canvas: this._canvasBuffer});
        this._lineDrawer     = new LineChartDrawer    ({canvas: this._canvasBuffer});
        this._barDrawer      = new BarChartDrawer     ({canvas: this._canvasBuffer});
        this._colorBarDrawer = new ColorBarChartDrawer({canvas: this._canvasBuffer});
        this._pointDrawer    = new PointChartDrawer   ({canvas: this._canvasBuffer});
        this._binaryDrawer   = new BinaryChartDrawer  ({canvas: this._canvasBuffer});
        this._buffer         = new CircularBuffer({size: 23});
        this._gridDrawer     = null;
        this._chartDrawers   = [];
    }

    initType(type) {
        let img   = this._refs.img;
        let image = null;

        switch (type) {
            case sensorModuleConstants.SENSOR_TYPE_NXT_TOUCH:
            case sensorModuleConstants.SENSOR_TYPE_TOUCH:
                image = 'images/ev3/touch.png';
                this._gridDrawer   = this._binaryDrawer;
                this._chartDrawers = [this._binaryDrawer];
                this._maxValue     = 1;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_COLOR:
            case sensorModuleConstants.SENSOR_TYPE_COLOR:
                image = 'images/ev3/color.png';
                this._gridDrawer   = this._colorBarDrawer;
                this._chartDrawers = [this._colorBarDrawer];
                this._maxValue     = 7;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_ULTRASONIC:
            case sensorModuleConstants.SENSOR_TYPE_ULTRASONIC:
                image = 'images/ev3/ultrasonic.png';
                this._gridDrawer   = this._fillDrawer;
                this._chartDrawers = [this._fillDrawer, this._lineDrawer];
                this._maxValue     = 255;
                break;
            case sensorModuleConstants.SENSOR_TYPE_GYRO:
                image = 'images/ev3/gyro.png';
                this._gridDrawer   = this._splineLineDrawer;
                this._chartDrawers = [this._splineFillDrawer];
                this._maxValue     = 255;
                break;
            case sensorModuleConstants.SENSOR_TYPE_INFRARED:
                image = 'images/ev3/infrared.png';
                this._gridDrawer   = this._splineLineDrawer;
                this._chartDrawers = [this._splineFillDrawer];
                this._maxValue     = 255;
                break;
            case sensorModuleConstants.SENSOR_TYPE_NXT_SOUND:
                image = 'images/ev3/sound.png';
                this._gridDrawer   = this._splineLineDrawer;
                this._chartDrawers = [this._splineFillDrawer];
                this._maxValue     = 100;
                break;
        }

        if (image) {
            img.src           = getImage(image);
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
            this._gridDrawer  = null;
        }
        this._type = type;
    }

    getLayer() {
        return this._layer;
    }

    getPort() {
        return this._port;
    }

    onClose() {
        this.remove();
        this._plugin.removeChart(this);
    }

    onAnimate(time) {
        if (this._time === null) {
            this._time = Date.now();
        }
        let interval  = this._interval;
        let deltaTime = Date.now() - this._time;
        this._deltaTime += deltaTime;
        if (this._deltaTime > interval) {
            let sensor = this._sensorPlugin.getSensor(this._layer, this._port);
            if (sensor.getType() !== this._type) {
                this.initType(sensor.getType());
            }
            this._buffer.add(sensor.read());
            while (this._deltaTime > interval) {
                this._deltaTime -= interval;
            }
            if (this._gridDrawer) {
                this._gridDrawer
                    .clear()
                    .drawValueGrid();
                this._chartDrawers.forEach(
                    function(drawer) {
                        drawer.draw(this._buffer, this._maxValue);
                    },
                    this
                );
            }
        }
        if (this._context === null) {
            this._context = this._refs.canvas.getContext('2d');
        }
        this._context.clearRect(0, 0, 260, 96);
        let x = this._buffer.getFull() ? -this._deltaTime / interval * 13 : 0;
        this._context.drawImage(this._canvasBuffer, x, 0);
        this._time = Date.now();
        window.requestAnimationFrame(this.onAnimate.bind(this));
    }
}

exports.Plugin = class extends SimulatorPlugin {
    constructor(opts) {
        super(opts);
        this._charts              = [];
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
                                ref:      this.setRef('charts'),
                                children: []
                            }
                        ].concat(this.initTitle())
                    }
                ]
            }
        );
    }

    initChart(opts) {
        opts.plugin       = this;
        opts.type         = Chart;
        opts.ui           = this._ui;
        opts.sensorPlugin = this._simulator.getPluginByUuid('b643ac7c-3886-11ea-a137-2e728ce88125'); // Sensor plugin...
        this.create(this._refs.charts, opts);
    }

    onAddChart() {
        dispatcher.dispatch(
            'Dialog.Graph.New.Show',
            {
                onApply: this.initChart.bind(this)
            }
        );
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

    addChart(chart) {
        this._charts.push(chart);
    }

    removeChart(chart) {
        let charts = this._charts;
        for (let i = 0; i < charts.length; i++) {
            if (charts[i] === chart) {
                charts.splice(i, 1);
                break;
            }
        }
    }

    reset() {
    }
};
