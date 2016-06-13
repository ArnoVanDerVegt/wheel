(function() {
    var MOTOR_STATUS_SIZE = 48;

    var MotorStatus = Class(function() {
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

    var EV3MotorComponent = React.createClass({
            getInitialState: function() {
                var props = this.props;
                var motor = props.motor;

                return {
                    id:         props.id || 1,
                    type:       props.type || 'medium',
                    i2c:        props.i2c || false,
                    position:   motor.getPosition(),
                    target:     motor.getTarget(),
                    power:      motor.getPower(),
                    speed:      motor.getSpeed(),
                    min:        motor.getMin(),
                    max:        motor.getMax()
                };
            },

            update: function(settings, motor) {
                var state = this.state;

                state.id        = settings.id;
                state.type      = settings.type || 'medium';
                state.i2c       = settings.i2c || false;
                state.position  = motor.getPosition();
                state.target    = motor.getTarget();
                state.power     = motor.getPower();
                state.speed     = motor.getSpeed();
                state.min       = motor.getMin();
                state.max       = motor.getMax();

                this.setState(state);
            },

            componentDidMount: function() {
                if (!this._motorStatus) {
                    this._motorStatus = new MotorStatus({canvas: this.refs.canvas});
                }
                this._motorStatus.render(this.state);
            },

            componentDidUpdate: function() {
                if (!this._motorStatus) {
                    this._motorStatus = new MotorStatus({canvas: this.refs.canvas});
                }
                this._motorStatus.render(this.state);
            },

            render: function() {
                var state              = this.state;
                var propertiesChildren = [];
                var motorProperties    = this.props.motorProperties;

                motorProperties.i2c       && state.i2c && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'I2C', value: state.i2c }});
                motorProperties.type      && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Type',     value: state.type }});
                motorProperties.position  && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Position', value: state.position }});
                motorProperties.target    && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Target',   value: state.target }});
                motorProperties.power     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Power',    value: state.power + '%' }});
                motorProperties.speed     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Speed',    value: '~' + state.speed + ' rpm' }});
                motorProperties.range     && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Range',    value: state.min + '..' + state.max }});

                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow motor ' + (this.props.className || '')
                    },
                    children: [
                        {
                            type: 'canvas',
                            props: {
                                className: 'status-canvas',
                                width:     48,
                                height:    48,
                                ref:       'canvas'
                            }
                        },
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

    var EV3SensorComponent = React.createClass({
            render: function() {
                return utilsReact.fromJSON({
                    props: {
                        className: 'box-shadow sensor ' + (this.props.className || '')
                    },
                    children: [
                        {
                            type: 'img',
                            props: {
                                src: '/images/Hardware_NXT_Touch.png'
                            }
                        },
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
                            children: [
                                { type: EV3StatusRow, props: { name: 'Type',  value: 'Button' }},
                                { type: EV3StatusRow, props: { name: 'Value', value: 0 }},
                            ]
                        }
                    ]
                });
            }
        });

    wheel(
        'components.output.OutputComponent',
        React.createClass({
            getInitialState: function() {
                this.props.motors.on('Changed', this.onUpdateMotors);

                var editorSettings = wheel.editorSettings;
                editorSettings.on('MotorPropertiesChanged',  this, this.onUpdateMotors);
                editorSettings.on('I2cMotorSettingsChanged', this, this.onUpdateMotors);

                return {
                    small: true
                }
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
                    var ref = 'motor' + i2cMotor.id;
                    refs[ref] && refs[ref].update(i2cMotor, motor);
                }

                this.forceUpdate();
            },

            onSmall: function() {
                var state = this.state;
                state.small = true;
                this.setState(state);
                this.props.onSmall && this.props.onSmall();
            },

            onLarge: function() {
                var state = this.state;
                state.small = false;
                this.setState(state);
                this.props.onLarge && this.props.onLarge();
            },

            render: function() {
                var editorSettings   = wheel.editorSettings;
                var standardMotors   = editorSettings.getStandardMotorSettings();
                var i2cMotors        = editorSettings.getI2cMotorSettings();
                var motors           = this.props.motors;
                var motorProperties  = editorSettings.getMotorProperties();
                var motorChildren    = [];
                var toStringStandard = function() { return 'AA' + this.props.title; };
                var toStringI2c      = function() { return this.props.title + '_' + this.props.i2c; };

                for (var i = 0; i < standardMotors.length; i++) {
                    var standardMotor = standardMotors[i];
                    if (standardMotor.display) {
                        var title = 'Out' + String.fromCharCode(64 + standardMotor.out);
                        motorChildren.push({
                            type: EV3MotorComponent,
                            props: {
                                motor:           motors.getMotor(standardMotor.id - 1),
                                type:            standardMotor.type,
                                index:           i,
                                ref:             'motor' + standardMotor.id,
                                id:              standardMotor.id,
                                title:           title,
                                motorProperties: motorProperties
                            },
                            toString: toStringStandard
                        });
                    }
                }
                for (var i = 0; i < i2cMotors.length; i++) {
                    var i2cMotor = i2cMotors[i];
                    if (i2cMotor.display) {
                        var title = 'In' + i2cMotor.port + ' Motor' + i2cMotor.motorNumber;
                        motorChildren.push({
                            type: EV3MotorComponent,
                            props: {
                                motor:           motors.getMotor(i2cMotor.id - 1),
                                type:            i2cMotor.type,
                                index:           i,
                                ref:             'motor' + i2cMotor.id,
                                id:              i2cMotor.id,
                                title:           title,
                                motorProperties: motorProperties,
                                i2c:             i2cMotor.i2c
                            },
                            toString: toStringI2c
                        });
                    }
                }
                motorChildren.sort();

                var sensorSettings = this.props.editor.getSensorSettings();
                var sensorChildren = [];
/*
                for (var i in sensorSettings) {
                    if (sensorSettings[i]) {
                        sensorChildren.push({ type: EV3SensorComponent, props: { ref: i, title: i }});
                    }
                }
*/
                return utilsReact.fromJSON({
                    props: {
                        className: 'output ' + (this.state.small ? ' small' : ' large')
                    },
                    children: [
                        {
                            type: wheel.components.output.EV3ScreenComponent,
                            props: {
                                ref:            'screen',
                                onRun:          this.props.onRun,
                                onStop:         this.props.onStop,
                                onShowConsole:  this.props.onShowConsole,
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
                                    children: motorChildren
                                },
                                {
                                    props: {
                                        className: 'sensor-container'
                                    },
                                    children: sensorChildren
                                }
                            ]
                        }
                    ]
                });
            },
        })
    );
})();