(function() {
    var wheel = require('../../utils/base.js').wheel;

    var MOTOR_STATUS_SIZE = 48;

    var MotorStatus = wheel.Class(function() {
            this.init = function(opts) {
                this._canvas = opts.canvas;
                this._ctx    = this._canvas.getContext('2d');
            };

            this.renderBar = function(start, end, color, alpha) {
                var ctx = this._ctx;

                if (start > end) {
                    var n = start;
                    start = end;
                    end   = n;
                }

                start = Math.min(Math.max(start, 0), 1);
                end   = Math.min(Math.max(end, 0), 1);
                start = Math.PI * 1.5 + start * Math.PI * 2;
                end   = Math.PI * 1.5 + end * Math.PI * 2;

                var half = MOTOR_STATUS_SIZE / 2;

                ctx.globalAlpha = alpha;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.arc(half, half, half - 4, start, end);
                ctx.lineWidth = 8;
                ctx.stroke();
                ctx.globalAlpha = 1;
            };

            this.render = function(state) {
                var ctx = this._ctx;

                ctx.clearRect(0, 0, MOTOR_STATUS_SIZE, MOTOR_STATUS_SIZE);

                var range    = Math.abs(state.max - state.min);
                var target   = state.target;
                var position = state.position;

                this.renderBar(0, 1, 'WhiteSmoke', 1);
                this.renderBar(0, target / range, 'LimeGreen', 1);
                this.renderBar(position / range, target / range, 'PaleVioletRed', 0.8);

                ctx.strokeStyle = '#000000';
                ctx.lineWidth     = 1;

                var half = MOTOR_STATUS_SIZE / 2;

                ctx.beginPath();
                ctx.arc(half, half, half - 1, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(half, half, half - 7.5, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
            };
        });

    var EV3StatusRow = React.createClass({
            render: function() {
                return utilsReact.fromJSON({
                    props: {
                        className: 'status-row',
                    },
                    children: [
                        {
                            type: 'div',
                            props: {
                                className: 'status-name',
                                innerHTML: this.props.name + ':'
                            }
                        },
                        {
                            type: 'div',
                            props: {
                                className: 'status-value',
                                innerHTML: this.props.value
                            }
                        }
                    ]
                });
            }
        });

    var EV3IOComponent = React.createClass({
            getInitialState: function() {
                var props   = this.props;
                var device  = props.device;

                return {
                    id:           props.id || 1,
                    type:         props.type || 'medium',
                    i2c:          props.i2c || false,
                    value:        device.getValue    ? device.getValue()    : 0,
                    position:     device.getPosition ? device.getPosition() : 0,
                    target:       device.getTarget   ? device.getTarget()   : 0,
                    power:        device.getPower    ? device.getPower()    : 0,
                    speed:        device.getSpeed    ? device.getSpeed()    : 0,
                    min:          device.getMin      ? device.getMin()      : 0,
                    max:          device.getMax      ? device.getMax()      : 0,
                    _motorStatus: null
                };
            },

            update: function(settings, device) {
                var state = this.state;

                state.id        = settings.id;
                state.type      = settings.type || 'medium';
                state.i2c       = settings.i2c || false;
                state.value     = device.getValue    ? device.getValue()    : 0;
                state.position  = device.getPosition ? device.getPosition() : 0;
                state.target    = device.getTarget   ? device.getTarget()   : 0;
                state.power     = device.getPower    ? device.getPower()    : 0;
                state.speed     = device.getSpeed    ? device.getSpeed()    : 0;
                state.min       = device.getMin      ? device.getMin()      : 0;
                state.max       = device.getMax      ? device.getMax()      : 0;

                this.setState(state);
            },

            onMouseDown: function() {
                var state = this.state;
                state.value = 1;
                this.setState(state);
                this.props.device.setValue(1);
            },

            onMouseUp: function() {
                var state = this.state;
                state.value = 0;
                this.setState(state);
                this.props.device.setValue(0);
            },

            componentDidMount: function() {
                if (this.props.deviceProperties.isMotor) {
                    if (!this.state._motorStatus) {
                        this.state._motorStatus = new MotorStatus({canvas: this.refs.canvas});
                    }
                    this.state._motorStatus.render(this.state);
                }
            },

            componentDidUpdate: function() {
                if (this.props.deviceProperties.isMotor) {
                    if (!this.state._motorStatus) {
                        this.state._motorStatus = new MotorStatus({canvas: this.refs.canvas});
                    }
                    this.state._motorStatus.render(this.state);
                }
            },

            render: function() {
                var state              = this.state;
                var propertiesChildren = [];
                var deviceProperties   = this.props.deviceProperties;

                deviceProperties.i2c       && state.i2c && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'I2C', value: state.i2c }});
                deviceProperties.type      && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Type',     value: state.type }});
                deviceProperties.value     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Value',    value: state.value }});
                deviceProperties.position  && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Position', value: state.position }});
                deviceProperties.target    && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Target',   value: state.target }});
                deviceProperties.power     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Power',    value: state.power + '%' }});
                deviceProperties.speed     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Speed',    value: '~' + state.speed + ' rpm' }});
                deviceProperties.range     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Range',    value: state.min + '..' + state.max }});

                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow io ' + (this.props.className || '')
                    },
                    children: [
                        (deviceProperties.isMotor ?
                            {
                                type: 'canvas',
                                props: {
                                    className: 'status-canvas',
                                    width:     48,
                                    height:    48,
                                    ref:       'canvas'
                                }
                            } :
                            {
                                type: 'button',
                                props: {
                                    className:   'status-button button',
                                    innerHTML:   state.id,
                                    onMouseDown: this.onMouseDown,
                                    onMouseUp:   this.onMouseUp,
                                    onMouseOut:  this.onMouseUp
                                }
                            }
                        ),
                        {
                            props: {
                                className: 'title',
                                innerHTML: this.props.title
                            },
                        },
                        {
                            props: {
                                className: 'status'
                            },
                            children: propertiesChildren
                        },
                        {
                            props: {
                                className: state.type
                            }
                        },
                        {
                            props: {
                                className: 'status-id',
                                innerHTML: state.id
                            }
                        }
                    ]
                });
            }
        });

    var EV3ButtonsComponent = React.createClass({
            getInitialState: function() {
                this.props.editor.getEmitter().on('Stop', this, this.onStop);

                return {
                    animation:  '',
                    flash:      false,
                    _pressed:   0
                };
            },

            setLight: function(color, flash) {
                var state = this.state;
                switch (color) {
                    case 0: // Off
                        state.animation = '';
                        state.flash     = false;
                        break;

                    case 1: // Red
                        state.animation = 'red';
                        state.flash     = flash;
                        break;

                    case 2: // Yellow
                        state.animation = 'yellow';
                        state.flash     = flash;
                        break;

                    case 4: // Green
                        state.animation = 'green';
                        state.flash     = flash;
                        break;
                }
                this.setState(state);
            },

            getButton: function() {
                return this.state._pressed;
            },

            onMouseDown: function(button) {
                this.state._pressed = button;
            },

            onMouseUp: function() {
                this.state._pressed = 0;
            },

            onStop: function() {
                this.setLight(0, false);
            },

            render: function() {
                var state = this.state;
                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow io ev3-buttons'
                    },
                    children: [
                        {
                            props: {
                                className: 'ev3-light ' + (state.animation + (state.flash ? '-flash' : ''))
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                className: 'button left icon-chevron-left',
                                onMouseDown:    (function() { this.onMouseDown(1); }).bind(this),
                                onMouseUp:      this.onMouseUp,
                                onMouseOut:     this.onMouseUp
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                className: 'button center icon-circle',
                                onMouseDown:    (function() { this.onMouseDown(2); }).bind(this),
                                onMouseUp:      this.onMouseUp,
                                onMouseOut:     this.onMouseUp
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                className: 'button right icon-chevron-right',
                                onMouseDown:    (function() { this.onMouseDown(3); }).bind(this),
                                onMouseUp:      this.onMouseUp,
                                onMouseOut:     this.onMouseUp
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                className: 'button up icon-chevron-up',
                                onMouseDown:    (function() { this.onMouseDown(4); }).bind(this),
                                onMouseUp:      this.onMouseUp,
                                onMouseOut:     this.onMouseUp
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                className: 'button down icon-chevron-down',
                                onMouseDown:    (function() { this.onMouseDown(5); }).bind(this),
                                onMouseUp:      this.onMouseUp,
                                onMouseOut:     this.onMouseUp
                            }
                        }
                    ]
                });
            }
        });

    wheel(
        'components.output.OutputComponent',
        React.createClass({
            getInitialState: function() {
                var props = this.props;
                props.motors.on('Changed', this.onUpdateMotors);

                var editorSettings = wheel.editorSettings;
                editorSettings.on('MotorPropertiesChanged',  this, this.onUpdateMotors);
                editorSettings.on('I2cMotorSettingsChanged', this, this.onUpdateMotors);

                return {
                    small: !props.small // If editor is large then OutputComponent is small...
                };
            },

            setMotorInfo: function() {
                this.setState(this.state);
            },

            onUpdateMotors: function(changed) {
                var editorSettings = wheel.editorSettings;
                var standardMotors = editorSettings.getStandardMotorSettings();
                var i2cMotors      = editorSettings.getI2cMotorSettings();
                var motors         = this.props.motors;
                var refs           = this.refs;

                for (var i = 0; i < standardMotors.length; i++) {
                    var standardMotor = standardMotors[i];
                    var motor         = motors.getMotor(standardMotor.id - 1);
                    var ref           = 'motor' + standardMotor.id;
                    refs[ref] && refs[ref].update(standardMotor, motor);
                }
                for (var i = 0; i < i2cMotors.length; i++) {
                    var i2cMotor = i2cMotors[i];
                    var motor    = motors.getMotor(i2cMotor.id - 1);
                    var ref      = 'motor' + i2cMotor.id;
                    refs[ref] && refs[ref].update(i2cMotor, motor);
                }

                this.forceUpdate();
            },

            onSmall: function() {
                var state = this.state;
                state.small = true;
                this.setState(state);
                this.props.onLarge && this.props.onLarge(); // If output is small then editor and console are large...
            },

            onLarge: function() {
                var state = this.state;
                state.small = false;
                this.setState(state);
                this.props.onSmall && this.props.onSmall(); // If output is large then editor and console are small...
            },

            renderMotors: function() {
                var editorSettings   = wheel.editorSettings;
                var standardMotors   = editorSettings.getStandardMotorSettings();
                var i2cMotors        = editorSettings.getI2cMotorSettings();
                var motors           = this.props.motors;
                var motorProperties  = editorSettings.getMotorProperties();
                var motorChildren    = [];
                var toString         = function() { return ('00000000' + this.props.id).substr(-8); };

                motorProperties.isMotor = true;
                for (var i = 0; i < standardMotors.length; i++) {
                    var standardMotor = standardMotors[i];
                    if (standardMotor.display) {
                        var title = 'Motor Out' + String.fromCharCode(64 + standardMotor.out);
                        motorChildren.push({
                            type: EV3IOComponent,
                            props: {
                                device:           motors.getMotor(standardMotor.id - 1),
                                deviceProperties: motorProperties,
                                type:             standardMotor.type,
                                index:            i,
                                ref:              'motor' + standardMotor.id,
                                id:               standardMotor.id,
                                title:            title
                            },
                            toString: toString
                        });
                    }
                }
                for (var i = 0; i < i2cMotors.length; i++) {
                    var i2cMotor = i2cMotors[i];
                    if (i2cMotor.display) {
                        var title = 'Motor ' + i2cMotor.motorNumber + ' In' + i2cMotor.port;
                        motorChildren.push({
                            type: EV3IOComponent,
                            props: {
                                device:           motors.getMotor(i2cMotor.id - 1),
                                deviceProperties: motorProperties,
                                type:             i2cMotor.type,
                                index:            i,
                                ref:              'motor' + i2cMotor.id,
                                id:               i2cMotor.id,
                                title:            title,
                                i2c:              i2cMotor.i2c
                            },
                            toString: toString
                        });
                    }
                }
                motorChildren.sort();

                motorChildren.unshift({
                    type: EV3ButtonsComponent,
                    props: {
                        ref:    'buttons',
                        editor: this.props.editor
                    }
                });

                return motorChildren;
            },

            renderSensors: function() {
                var editorSettings   = wheel.editorSettings;
                var standardSensors  = editorSettings.getStandardSensorSettings();
                var i2cSensors       = editorSettings.getI2cSensorSettings();
                var sensors          = this.props.sensors;
                var sensorProperties = editorSettings.getSensorProperties();
                var sensorChildren   = [];
                var toString         = function() { return ('00000000' + this.props.id).substr(-8); };

                for (var i = 0; i < standardSensors.length; i++) {
                    var standardSensor = standardSensors[i];
                    if (standardSensor.display) {
                        var title = 'Sensor In' + standardSensor.out;
                        sensorChildren.push({
                            type: EV3IOComponent,
                            props: {
                                device:           sensors.getSensor(standardSensor.id - 1),
                                deviceProperties: sensorProperties,
                                type:             standardSensor.type,
                                index:            i,
                                ref:              'sensor' + standardSensor.id,
                                id:               standardSensor.id,
                                title:            title
                            },
                            toString: toString
                        });
                    }
                }
                for (var i = 0; i < i2cSensors.length; i++) {
                    var i2cSensor = i2cSensors[i];
                    if (i2cSensor.display) {
                        var title = 'Sensor ' + i2cSensor.sensorNumber + ' In' + i2cSensor.port;
                        sensorChildren.push({
                            type: EV3IOComponent,
                            props: {
                                device:           sensors.getSensor(i2cSensor.id - 1),
                                deviceProperties: sensorProperties,
                                type:             i2cSensor.type,
                                index:            i,
                                ref:              'sensor' + i2cSensor.id,
                                id:               i2cSensor.id,
                                title:            title,
                                i2c:              i2cSensor.i2c
                            },
                            toString: toString
                        });
                    }
                }
                sensorChildren.sort();

                return sensorChildren;
            },

            render: function() {
                var props = this.props;
                var state = this.state;

                return utilsReact.fromJSON({
                    props: {
                        className: 'output ' + (state.small ? ' small' : ' large')
                    },
                    children: [
                        {
                            type: wheel.components.output.EV3ScreenComponent,
                            props: {
                                editor:         props.editor,
                                ref:            'screen',
                                small:          state.small,
                                onRun:          props.onRun,
                                onStop:         props.onStop,
                                onShowConsole:  props.onShowConsole,
                                onShowHelp:     props.onShowHelp,
                                onSmall:        this.onSmall,
                                onLarge:        this.onLarge
                            }
                        },
                        {
                            props: {
                                className: 'io-wrapper',
                            },
                            children: [
                                {
                                    props: {
                                        className: 'motor-container',
                                    },
                                    children: this.renderMotors()
                                },
                                {
                                    props: {
                                        className: 'sensor-container'
                                    },
                                    children: this.renderSensors()
                                }
                            ]
                        }
                    ]
                });
            },
        })
    );
})();