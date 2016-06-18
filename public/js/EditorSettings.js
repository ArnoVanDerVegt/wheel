(function() {
    var EditorSettings = Class(Emitter, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

                var localStorage = LocalStorage.getInstance();

                /* Motors */
                this._motorProperties = localStorage.get(
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

                this._standardMotorSettings = localStorage.get(
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

                this._i2cMotorSettings = localStorage.get('i2cMotorSettings', []);

                /* Sensors */
                this._sensorProperties = localStorage.get(
                    'sensorProperties',
                    {
                        type:  true,
                        value: true
                    }
                );

                this._standardSensorSettings = localStorage.get(
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

                this._i2cSensorSettings = localStorage.get('i2cSensorSettings', []);

                /* Active file in editor */
                this._activeFilename = localStorage.get('activeFilename', null);

                /* UI settings */
                this._uiSettings = localStorage.get(
                    'uiSettings',
                    {
                        console: true,
                        small:   true
                    }
                );
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
                this._i2cSensorSettings = i2cSensorSettings;
                LocalStorage.getInstance().set('i2cSensorSettings', i2cSensorSettings);
                this.emit('I2cSensorSettingsChanged');
            };

            /* Active file in editor */
            this.getActiveFilename = function() {
                return this._activeFilename;
            };

            this.setActiveFilename = function(activeFilename) {
                this._activeFilename = activeFilename;
                LocalStorage.getInstance().set('activeFilename', activeFilename);
            };

            /* UI settings */
            this.getUISettings = function() {
                return this._uiSettings;
            };

            this.getUISetting = function(key) {
                return this._uiSettings[key];
            };

            this.setUISetting = function(key, value) {
                console.log('set', key, value);
                this._uiSettings[key] = value;
                LocalStorage.getInstance().set('uiSettings', this._uiSettings);
            };
        });

    wheel('editorSettings', new EditorSettings({}));
})();