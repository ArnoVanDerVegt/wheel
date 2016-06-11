(function() {
    var EditorSettings = Class(Emitter, function(supr) {
            this.init = function() {
                supr(this, 'init', arguments);

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

                this._standardMotorSettings = LocalStorage.getInstance().get('standardMotorSettings', []);
                this._i2cMotorSettings = LocalStorage.getInstance().get('i2cMotorSettings', []);
            };

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
        });

    wheel('editorSettings', new EditorSettings({}));
})();