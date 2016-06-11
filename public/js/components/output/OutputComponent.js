(function() {
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

                ctx.globalAlpha = alpha;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.arc(16, 16, 11, start, end);
                ctx.lineWidth = 8;
                ctx.stroke();
                ctx.globalAlpha = 1;
            };

            this.render = function(state) {
                var ctx = this._ctx;

                ctx.clearRect(0, 0, 32, 32);

                var perc     = 0.5;//0.1 + Math.random() * 0.8;
                var range    = Math.abs(state.max - state.min);
                var target   = state.target;
                var position = state.position;

                this.renderBar(0, 1, '#FFFFFF', 1);
                this.renderBar(0, target / range, '#1976D2', 1);
                this.renderBar(position / range, target / range, '#FF5252', 0.8);

                ctx.strokeStyle = '#000000';
                ctx.lineWidth     = 1;

                ctx.beginPath();
                ctx.arc(16, 16, 15, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(16, 16, 7.5, 0, Math.PI * 2);
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
                var props  = this.props;
                //var motors = props.motors;
                //var motor  = motors.getMotor(props.index);
                return {
                    i2c:        props.i2c,
                    position:   0,//motor.getPosition(),
                    target:     0,//motor.getTarget(),
                    power:      0,//motor.getPower(),
                    speed:      0,//motor.getSpeed(),
                    min:        0,//motor.getMin(),
                    max:        0,//motor.getMax()
                };
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

                propertiesChildren.push({ type: EV3StatusRow, props: { name: 'I2C', value: state.i2c }});

                motorProperties.type      && propertiesChildren.push({ type: EV3StatusRow, props: { name: 'Type',     value: 'Small' }});
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
                                width:     32,
                                height:    32,
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
                /*var motors = this.props.motors;
                for (var i = 0; i < changed.length; i++) {
                    var motor = motors.getMotor(changed[i]);
                        motorComponent = this.refs['motor' + changed[i]];

                    motorComponent && motorComponent.setState({
                        position: motor.getPosition(),
                        target:   motor.getTarget(),
                        power:    motor.getPower(),
                        speed:    motor.getSpeed(),
                        min:      motor.getMin(),
                        max:      motor.getMax()
                    });
                }*/
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
                var editorSettings  = wheel.editorSettings;
                var motors          = editorSettings.getI2cMotorSettings();
                var motorProperties = editorSettings.getMotorProperties();
                var motorChildren   = [];
                var toString        = function() { return this.props.title + '_' + this.props.i2c };

                for (var i = 0; i < motors.length; i++) {
                    var motor = motors[i];
                    var title = 'Port' + motor.port + ' Motor' + motor.motorNumber;
                    motorChildren.push({
                        type: EV3MotorComponent,
                        props: {
                            motors:          this.props.motors,
                            index:           i,
                            ref:             'motor' + i,
                            title:           title,
                            motorProperties: motorProperties,
                            i2c:             motor.i2c
                        },
                        toString: toString
                    });
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
                                ref:             'screen',
                                onRun:             this.props.onRun,
                                onStop:         this.props.onStop,
                                onShowConsole:     this.props.onShowConsole,
                                onSmall:         this.onSmall,
                                onLarge:         this.onLarge
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