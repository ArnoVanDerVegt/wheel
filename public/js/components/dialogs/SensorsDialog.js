(function() {
    var I2CSensorHeader = React.createClass({
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
                                innerHTML: 'Sensor'
                            }
                        },
                        {
                            props: {
                                className: 'type',
                                innerHTML: 'Sensor type'
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

    function sensorSettingGenerator() {
        if (!sensorSettingGenerator._data) {
            sensorSettingGenerator._data = {
                display:      true,
                port:         1,
                i2c:          6,
                sensorNumber: 1,
                type:         'touch'
            };
        }
        var data     = sensorSettingGenerator._data;
        var result   = JSON.parse(JSON.stringify(data));

        data.sensorNumber++;
        if (data.sensorNumber > 2) {
            data.sensorNumber = 1;
            data.port++;
            if (data.port > 4) {
                data.port = 1;
                data.i2c++;
            }
        }
        return result;
    }

    var I2CSensorRow = React.createClass({
            getInitialState: function() {
                return {
                    settings: this.props.sensorSettings
                };
            },

            onRemove: function() {
                var props = this.props;
                props.list.onRemoveSensor(props.index);
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

            onChangeSensor: function() {
                this.state.settings.sensorNumber = this.refs.sensor.getValue();
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
                                        ref:   'sensor',
                                        value: state.settings.sensorNumber,
                                        options: [
                                            {value: '1', text: '1'},
                                            {value: '2', text: '2'},
                                            {value: '3', text: '3'}
                                        ],
                                        onChange: this.onChangeSensor
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

    var I2CSensorList = React.createClass({
            getInitialState: function() {
                return {
                    sensors: this.props.sensors || []
                };
            },

            getSettings: function() {
                return this.state.sensors;
            },

            onAddSensor: function() {
                var state           = this.state;
                var sensors         = state.sensors;
                var sensorSettings  = sensorSettingGenerator();
                var maxId           = 0;
                var standardSensors = this.props.standardSensors;

                for (var i = 0; i < standardSensors.length; i++) {
                    maxId = Math.max(maxId, standardSensors[i].id)
                }
                for (var i = 0; i < sensors.length; i++) {
                    maxId = Math.max(maxId, sensors[i].id)
                }

                sensorSettings.id = maxId + 1;
                sensors.push(sensorSettings);
                this.onChange();

                this.setState(state);
            },

            onRemoveSensor: function(index) {
                var state   = this.state;
                var sensors = state.sensors;

                sensors.splice(index, 1);
                this.onChange();

                this.setState(state);
            },

            onChange: function() {
            },

            render: function() {
                var state        = this.state;
                var sensors      = state.sensors;
                var listChildren = [];

                for (var i = 0; i < sensors.length; i++) {
                    listChildren.push({
                        type: I2CSensorRow,
                        props: {
                            list:           this,
                            index:          i,
                            sensorSettings: sensors[i],
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
                            type: I2CSensorHeader
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
                                        innerHTML: 'Add sensor',
                                        onClick:   this.onAddSensor
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
        });

    var SensorRow = React.createClass({
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

    var SensorHeader = React.createClass({
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
                                innerHTML: 'Sensor type'
                            }
                        }
                    ]
                });
            }
        });

    var StandardSensorList = React.createClass({
            getInitialState: function() {
                return {
                    sensors: this.props.sensors
                }
            },

            getSettings: function() {
                return this.state.sensors;
            },

            onChange: function() {
            },

            render: function() {
                var state        = this.state;
                var sensors      = state.sensors;
                var listChildren = [];

                for (var i = 0; i < 4; i++) {
                    listChildren.push({
                        type: SensorRow,
                        props: {
                            list:       this,
                            index:      i,
                            out:        String.fromCharCode(65 + i),
                            settings:   state.sensors[i] || {},
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
                            type: SensorHeader
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
        'components.dialogs.SensorsDialog',
        React.createClass({
            getInitialState: function() {
                var editorSettings  = wheel.editorSettings;
                return {
                    visible:          false,
                    title:            'Sensors setup',
                    sensorProperties: editorSettings.getSensorProperties(),
                    standardSensors:  editorSettings.getStandardSensorSettings(),
                    i2cSensors:       editorSettings.getI2cSensorSettings()
                };
            },

            show: function() {
                var state = this.state;
                state.visible = true;

                var sensorProperties = state.sensorProperties;
                for (var i in sensorProperties) {
                    state.sensorProperties[i] = sensorProperties[i];
                    this.refs.tabs.refs[i] && this.refs.tabs.refs[i].setState({checked: sensorProperties[i]});
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
                var editorSettings   = wheel.editorSettings;
                var sensorProperties = editorSettings.getSensorProperties();
                for (var i in sensorProperties) {
                    sensorProperties[i]            = this.refs.tabs.refs.page2.refs[i].getChecked();
                    this.state.sensorProperties[i] = sensorProperties[i];
                }
                editorSettings.setSensorProperties(sensorProperties);
                editorSettings.setStandardSensorSettings(this.refs.tabs.refs.page0.refs.standardSensors.getSettings());
                editorSettings.setI2cSensorSettings(this.refs.tabs.refs.page1.refs.i2cSensors.getSettings());

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
                var sensors            = state.sensors;
                var sensorProperties   = state.sensorProperties;
                var properties         = ['i2c', 'type', 'value'];
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
                                        checked:  sensorProperties[properties[i]],
                                        onChange: function(checked) {
                                            this.state.sensorProperties[property] = checked;
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

                var sensorProperties = {
                        props: {
                            className: 'io-content',
                        },
                        children: propertiesChildren
                    };

                return utilsReact.fromJSON(
                    wheel.components.dialogs.createDialog(
                        this,
                        'io',
                        'icon-sensor',
                        [
                            {
                                type: wheel.components.ui.TabsComponent,
                                props: {
                                    ref: 'tabs',
                                    pages: [
                                        {
                                            title: 'Standard sensors',
                                            content: [
                                                {
                                                    type: StandardSensorList,
                                                    props: {
                                                        ref:     'standardSensors',
                                                        sensors: state.standardSensors
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            title:  'I2C Sensors',
                                            content: [
                                                {
                                                    type: I2CSensorList,
                                                    props: {
                                                        ref:             'i2cSensors',
                                                        sensors:         state.i2cSensors,
                                                        standardSensors: state.standardSensors
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            title:   'Properties',
                                            content: [sensorProperties]
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