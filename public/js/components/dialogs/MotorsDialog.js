(function() {
    var wheel = require('../../utils/base.js');

    var I2CMotorHeader = React.createClass({
            render: function() {
                return utilsReact.fromJSON({
                    props: {
                        className: 'io-header'
                    },
                    children: [
                        {
                            props: {
                                className: 'id',
                                innerHTML: '#'
                            }
                        },
                        {
                            props: {
                                className: 'display',
                                innerHTML: 'Visible'
                            }
                        },
                        {
                            props: {
                                className: 'port',
                                innerHTML: 'Port'
                            }
                        },
                        {
                            props: {
                                className: 'i2c',
                                innerHTML: 'I2C Address'
                            }
                        },
                        {
                            props: {
                                className: 'io-number',
                                innerHTML: 'Motor'
                            }
                        },
                        {
                            props: {
                                className: 'type',
                                innerHTML: 'Motor type'
                            }
                        },
                        {
                            props: {
                                className: 'remove'
                            }
                        }
                    ]
                });
            }
        });

    function motorSettingGenerator() {
        if (!motorSettingGenerator._data) {
            motorSettingGenerator._data = {
                display:     true,
                port:        1,
                i2c:         6,
                motorNumber: 1,
                type:        'medium'
            };
        }
        var data     = motorSettingGenerator._data;
        var result   = JSON.parse(JSON.stringify(data));

        data.motorNumber++;
        if (data.motorNumber > 2) {
            data.motorNumber = 1;
            data.port++;
            if (data.port > 4) {
                data.port = 1;
                data.i2c++;
            }
        }
        return result;
    }

    var I2CMotorRow = React.createClass({
            getInitialState: function() {
                return {
                    settings: this.props.motorSettings
                };
            },

            onRemove: function() {
                var props = this.props;
                props.list.onRemoveMotor(props.index);
            },

            onChangeId: function() {
                var id = this.refs.id.getValue();
                if (id !== '') {
                    id = parseInt(id, 10);
                    if (!isNaN(id)) {
                        this.state.settings.id = id;
                        this.props.onChange();
                    }
                }
            },

            onChangeDisplay: function() {
                this.state.settings.display = this.refs.display.getChecked();
                this.props.onChange();
            },

            onChangePort: function() {
                this.state.settings.port = this.refs.port.getValue();
                this.props.onChange();
            },

            onChangeI2c: function() {
                var i2c = this.refs.i2c.getValue();
                if (i2c !== '') {
                    if (!isNaN(parseInt(i2c, 10))) {
                        this.state.settings.i2c = i2c;
                        this.props.onChange();
                    }
                }
            },

            onChangeMotor: function() {
                this.state.settings.motorNumber = this.refs.motor.getValue();
                this.props.onChange();
            },

            onChangeType: function() {
                this.state.settings.type = this.refs.type.getValue();
                this.props.onChange();
            },

            render: function() {
                var state = this.state;

                return utilsReact.fromJSON({
                    props: {
                        className: 'io-row'
                    },
                    children: [
                        {
                            props: {
                                className: 'id',
                            },
                            children: [
                                {
                                    type: wheel.components.ui.TextInputComponent,
                                    props: {
                                        ref:      'id',
                                        value:    state.settings.id,
                                        onChange: this.onChangeId
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'display'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.CheckboxComponent,
                                    props: {
                                        ref:      'display',
                                        slider:   true,
                                        checked:  state.settings.display,
                                        onChange: this.onChangeDisplay
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'port'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.SelectComponent,
                                    props: {
                                        ref:   'port',
                                        value: state.settings.port,
                                        options: [
                                            {value: '1', text: '1'},
                                            {value: '2', text: '2'},
                                            {value: '3', text: '3'},
                                            {value: '4', text: '4'}
                                        ],
                                        onChange: this.onChangePort
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'i2c',
                            },
                            children: [
                                {
                                    type: wheel.components.ui.TextInputComponent,
                                    props: {
                                        ref:      'i2c',
                                        value:    state.settings.i2c,
                                        onChange: this.onChangeI2c
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'io-number'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.SelectComponent,
                                    props: {
                                        ref:   'motor',
                                        value: state.settings.motorNumber,
                                        options: [
                                            {value: '1', text: '1'},
                                            {value: '2', text: '2'}
                                        ],
                                        onChange: this.onChangeMotor
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'type'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.SelectComponent,
                                    props: {
                                        ref:    'type',
                                        value:  state.settings.type,
                                        options: [
                                            {value: 'medium', text: 'Medium'},
                                            {value: 'large',  text: 'Large'}
                                        ],
                                        onChange: this.onChangeType
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'remove',
                                onClick:   this.onRemove
                            },
                            children: [
                                {
                                    props: {
                                        className: 'icon-close'
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
        });

    var I2CMotorList = React.createClass({
            getInitialState: function() {
                return {
                    motors: this.props.motors || []
                };
            },

            getSettings: function() {
                return this.state.motors;
            },

            onAddMotor: function() {
                var state           = this.state;
                var motors          = state.motors;
                var motorSettings   = motorSettingGenerator();
                var maxId           = 0;
                var standardMotors  = this.props.standardMotors;

                for (var i = 0; i < standardMotors.length; i++) {
                    maxId = Math.max(maxId, standardMotors[i].id)
                }
                for (var i = 0; i < motors.length; i++) {
                    maxId = Math.max(maxId, motors[i].id)
                }

                motorSettings.id = maxId + 1;
                motors.push(motorSettings);
                this.onChange();

                this.setState(state);
            },

            onRemoveMotor: function(index) {
                var state  = this.state;
                var motors = state.motors;

                motors.splice(index, 1);
                this.onChange();

                this.setState(state);
            },

            onChange: function() {
            },

            render: function() {
                var state        = this.state;
                var motors       = state.motors;
                var listChildren = [];

                for (var i = 0; i < motors.length; i++) {
                    listChildren.push({
                        type: I2CMotorRow,
                        props: {
                            list:           this,
                            index:          i,
                            motorSettings:  motors[i],
                            onChange:       this.onChange
                        }
                    });
                }

                return utilsReact.fromJSON({
                    props: {
                        className: 'io-content',
                    },
                    children: [
                        {
                            type: I2CMotorHeader
                        },
                        {
                            props: {
                                className: 'io-container'
                            },
                            children: listChildren
                        },
                        {
                            props: {
                                className: 'io-add'
                            },
                            children: [
                                {
                                    type: 'button',
                                    props: {
                                        className: 'button choice icon-cirle-plus',
                                        innerHTML: 'Add motor',
                                        onClick:   this.onAddMotor
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
        });

    var MotorRow = React.createClass({
            getInitialState: function() {
                return {
                    settings: this.props.settings || {}
                };
            },

            onChangeId: function() {
                var id = this.refs.id.getValue();
                if (id !== '') {
                    id = parseInt(id, 10);
                    if (!isNaN(id)) {
                        this.state.settings.id = id;
                        this.props.onChange();
                    }
                }
            },

            onChangeDisplay: function() {
                this.state.settings.display = this.refs.display.getChecked();
                this.props.onChange();
            },

            onChangeType: function() {
                this.state.settings.type = this.refs.type.getValue();
                this.props.onChange();
            },

            render: function() {
                var state = this.state;

                return utilsReact.fromJSON({
                    props: {
                        className: 'io-row'
                    },
                    children: [
                        {
                            props: {
                                className: 'id',
                            },
                            children: [
                                {
                                    type: wheel.components.ui.TextInputComponent,
                                    props: {
                                        ref:      'id',
                                        value:    state.settings.id,
                                        onChange: this.onChangeId
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'display'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.CheckboxComponent,
                                    props: {
                                        ref:      'display',
                                        slider:   true,
                                        checked:  state.settings.display,
                                        onChange: this.onChangeDisplay
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'out'
                            },
                            children: [
                                {
                                    props: {
                                        innerHTML: this.props.out
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                className: 'type'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.SelectComponent,
                                    props: {
                                        ref:   'type',
                                        value: state.settings.type,
                                        options: [
                                            {value: 'medium', text: 'Medium'},
                                            {value: 'large',  text: 'Large'}
                                        ],
                                        onChange: this.onChangeType
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
        });

    var MotorHeader = React.createClass({
            render: function() {
                return utilsReact.fromJSON({
                    props: {
                        className: 'io-header'
                    },
                    children: [
                        {
                            props: {
                                className: 'id',
                                innerHTML: '#'
                            }
                        },
                        {
                            props: {
                                className: 'display',
                                innerHTML: 'Visible'
                            }
                        },
                        {
                            props: {
                                className: 'port',
                                innerHTML: 'Out'
                            }
                        },
                        {
                            props: {
                                className: 'type',
                                innerHTML: 'Motor type'
                            }
                        }
                    ]
                });
            }
        });

    var StandardMotorList = React.createClass({
            getInitialState: function() {
                return {
                    motors: this.props.motors
                }
            },

            getSettings: function() {
                return this.state.motors;
            },

            onChange: function() {
            },

            render: function() {
                var state        = this.state;
                var motors       = state.motors;
                var listChildren = [];

                for (var i = 0; i < 4; i++) {
                    listChildren.push({
                        type: MotorRow,
                        props: {
                            list:       this,
                            index:      i,
                            out:        String.fromCharCode(65 + i),
                            settings:   state.motors[i] || {},
                            onChange:   this.onChange
                        }
                    });
                }

                return utilsReact.fromJSON({
                    props: {
                        className: 'io-content'
                    },
                    children: [
                        {
                            type: MotorHeader
                        },
                        {
                            props: {
                                className: 'io-container'
                            },
                            children: listChildren
                        }
                    ]
                });
            }
        });

    wheel(
        'components.dialogs.MotorsDialog',
        React.createClass({
            getInitialState: function() {
                var editorSettings  = wheel.editorSettings;
                return {
                    visible:         false,
                    title:           'Motors setup',
                    motorProperties: editorSettings.getMotorProperties(),
                    standardMotors:  editorSettings.getStandardMotorSettings(),
                    i2cMotors:       editorSettings.getI2cMotorSettings()
                };
            },

            show: function() {
                var state = this.state;
                state.visible = true;

                var motorProperties = state.motorProperties;
                for (var i in motorProperties) {
                    state.motorProperties[i] = motorProperties[i];
                    this.refs.tabs.refs[i] && this.refs.tabs.refs[i].setState({checked: motorProperties[i]});
                }

                this.setState(this.state);
            },

            hide: function() {
                this.state.visible = false;
                this.setState(this.state);
            },

            onClose: function() {
                this.hide();
            },

            onConfirm: function() {
                var editorSettings  = wheel.editorSettings;
                var motorProperties = editorSettings.getMotorProperties();
                for (var i in motorProperties) {
                    motorProperties[i]            = this.refs.tabs.refs.page2.refs[i].getChecked();
                    this.state.motorProperties[i] = motorProperties[i];
                }
                editorSettings.setMotorProperties(motorProperties);
                editorSettings.setStandardMotorSettings(this.refs.tabs.refs.page0.refs.standardMotors.getSettings());
                editorSettings.setI2cMotorSettings(this.refs.tabs.refs.page1.refs.i2cMotors.getSettings());

                this.hide();
            },

            render: function() {
                var formatTitle = function(title) {
                        title = title.substr(0, 1).toUpperCase() + title.substr(1 - title.length);
                        var i = title.indexOf('_');
                        if (i !== -1) {
                            title = title.substr(0, i) + '(' + title[i + 1] + ')';
                        }
                        return title;
                    };
                var state              = this.state;
                var motors             = state.motors;
                var motorProperties    = state.motorProperties;
                var properties         = ['i2c', 'type', 'position', 'target', 'power', 'speed', 'range'];
                var propertiesChildren = [];

                for (var i = 0; i < properties.length; i++) {
                    (function(property) {
                        propertiesChildren.push({
                            props: {
                                className: 'row'
                            },
                            children: [
                                {
                                    type: wheel.components.ui.CheckboxComponent,
                                    props: {
                                        ref:      property,
                                        checked:  motorProperties[properties[i]],
                                        onChange: function(checked) {
                                            this.state.motorProperties[property] = checked;
                                            this.setState(this.state);
                                        }.bind(this)
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        className: 'label',
                                        innerHTML: formatTitle(properties[i])
                                    }
                                }
                            ]
                        });
                    }).call(this, properties[i]);
                }

                var motorProperties = {
                        props: {
                            className: 'io-content',
                        },
                        children: propertiesChildren
                    };

                return utilsReact.fromJSON(
                    wheel.components.dialogs.createDialog(
                        this,
                        'io',
                        'icon-settings',
                        [
                            {
                                type: wheel.components.ui.TabsComponent,
                                props: {
                                    ref: 'tabs',
                                    pages: [
                                        {
                                            title: 'Standard motors',
                                            content: [
                                                {
                                                    type: StandardMotorList,
                                                    props: {
                                                        ref:    'standardMotors',
                                                        motors: state.standardMotors
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            title:  'I2C Motors',
                                            content: [
                                                {
                                                    type: I2CMotorList,
                                                    props: {
                                                        ref:            'i2cMotors',
                                                        motors:         state.i2cMotors,
                                                        standardMotors: state.standardMotors
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            title:   'Properties',
                                            content: [motorProperties]
                                        }
                                    ]
                                }
                            }
                        ],
                        [
                            {
                                type: 'button',
                                props: {
                                    className:   'button cancel icon-close',
                                    innerHTML:   'Cancel',
                                    onClick:     this.onClose
                                }
                            },
                            {
                                type: 'button',
                                props: {
                                    className:   'button accept icon-check',
                                    innerHTML:   'Save',
                                    onClick:     this.onConfirm
                                }
                            }
                        ]
                    )
                );
            }
        })
    );
})();