(function() {
    var EditorSettings = Class(Emitter, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

                /* Motors */
                this._motorProperties = LocalStorage.getInstance().get(
                    'motorProperties',
                    {
                        type:       true,
                        position:   true,
                        target:     true,
                        power:      true,
                        speed:      true,
                        range:      true
                    }
                );

                this._standardMotorSettings = LocalStorage.getInstance().get(
                    'standardMotorSettings',
                    [
                        {
                            id:      1,
                            out:     1,
                            display: true,
                            type:    'medium'
                        },
                        {
                            id:      2,
                            out:     2,
                            display: true,
                            type:    'medium'
                        },
                        {
                            id:      3,
                            out:     3,
                            display: true,
                            type:    'medium'
                        },
                        {
                            id:      4,
                            out:     4,
                            display: true,
                            type:    'medium'
                        }
                    ]
                );

                this._i2cMotorSettings = LocalStorage.getInstance().get('i2cMotorSettings', []);

                /* Sensors */
                this._sensorProperties = LocalStorage.getInstance().get(
                    'sensorProperties',
                    {
                        type:  true,
                        value: true
                    }
                );

                this._standardSensorSettings = LocalStorage.getInstance().get(
                    'standardSensorSettings',
                    [
                        {
                            id:      1,
                            out:     1,
                            display: true,
                            type:    'touch'
                        },
                        {
                            id:      2,
                            out:     2,
                            display: true,
                            type:    'touch'
                        },
                        {
                            id:      3,
                            out:     3,
                            display: true,
                            type:    'touch'
                        },
                        {
                            id:      4,
                            out:     4,
                            display: true,
                            type:    'touch'
                        }
                    ]
                );

                this._i2cSensorSettings = LocalStorage.getInstance().get('i2cSensorSettings', []);
            };

            /* Motors */
            this.getMotorProperties = function() {
                return JSON.parse(JSON.stringify(this._motorProperties));
            };

            this.setMotorProperties = function(motorProperties) {
                this._motorProperties = motorProperties;
                LocalStorage.getInstance().set('motorProperties', motorProperties);
                this.emit('MotorPropertiesChanged', motorProperties);
            };

            this.getStandardMotorSettings = function() {
                return JSON.parse(JSON.stringify(this._standardMotorSettings));
            };

            this.setStandardMotorSettings = function(standardMotorSettings) {
                this._standardMotorSettings = standardMotorSettings;
                LocalStorage.getInstance().set('standardMotorSettings', standardMotorSettings);
                this.emit('StandardMotorSettingsChanged')
            };

            this.getI2cMotorSettings = function() {
                return JSON.parse(JSON.stringify(this._i2cMotorSettings));
            };

            this.setI2cMotorSettings = function(i2cMotorSettings) {
                this._i2cMotorSettings = i2cMotorSettings;
                LocalStorage.getInstance().set('i2cMotorSettings', i2cMotorSettings);
                this.emit('I2cMotorSettingsChanged');
            };

            /* Sensors */
            this.getSensorProperties = function() {
                return JSON.parse(JSON.stringify(this._sensorProperties));
            };

            this.setSensorProperties = function(sensorProperties) {
                this._sensorProperties = sensorProperties;
                LocalStorage.getInstance().set('sensorProperties', sensorProperties);
                this.emit('SensorPropertiesChanged', sensorProperties);
            };

            this.getStandardSensorSettings = function() {
                return JSON.parse(JSON.stringify(this._standardSensorSettings));
            };

            this.setStandardSensorSettings = function(standardSensorSettings) {
                this._standardSensorSettings = standardSensorSettings;
                LocalStorage.getInstance().set('standardSensorSettings', standardSensorSettings);
                this.emit('StandardSensorSettingsChanged')
            };

            this.getI2cSensorSettings = function() {
                return JSON.parse(JSON.stringify(this._i2cSensorSettings));
            };

            this.setI2cSensorSettings = function(i2cSensorSettings) {
console.log('i2cSensorSettings:', i2cSensorSettings);
                this._i2cSensorSettings = i2cSensorSettings;
                LocalStorage.getInstance().set('i2cSensorSettings', i2cSensorSettings);
                this.emit('I2cSensorSettingsChanged');
            };
        });

    wheel('editorSettings', new EditorSettings({}));
})();