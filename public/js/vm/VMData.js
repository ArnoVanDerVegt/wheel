var VMData = Class(function() {
        this.init = function(opts) {
            this._data           = [];
            this._stringList     = [];
            this._regOffsetStack = [];

            for (var i = 0; i < wheel.compiler.command.REGISTER_COUNT; i++) {
                this._data[i] = 0;
            }
        };

        /* Global */
        this.setGlobalNumber = function(offset, value) {
            this._data[offset] = value;
        };

        this.getGlobalNumber = function(offset) {
            return this._data[offset];
        };

        this.setStringList = function(stringList) {
            this._stringList = JSON.parse(JSON.stringify(stringList));
        };

        this.getStringList = function() {
            return this._stringList;
        };

        /* Local */
        this.setLocalNumber = function(offset, value) {
            var offsetStack = this._data[wheel.compiler.command.REG_OFFSET_STACK];
            this._data[offsetStack + offset] = value;
        };

        this.getLocalNumber = function(offset) {
            var offsetStack = this._data[wheel.compiler.command.REG_OFFSET_STACK];
            return this._data[offsetStack + offset];
        };

        /* Local offset */
        this.pushRegOffsetStack = function(count) {
            var regIndex = wheel.compiler.command.REG_OFFSET_STACK;
            this._regOffsetStack.push(this._data[regIndex]);
            this._data[regIndex] += count;
        };

        this.popRegOffsetStack = function() {
            this._data[wheel.compiler.command.REG_OFFSET_STACK] = this._regOffsetStack.pop();
        };

        this.setGlobalConstants = function(globalConstants, stackOffset) {
            var globalData = this._data;
            for (var i = 0; i < globalConstants.length; i++) {
                var globalConstant = globalConstants[i];
                var offset         = globalConstant.offset;
                var data           = globalConstant.data;
                for (var j = 0; j < data.length; j++) {
                    globalData[offset + j] = data[j];
                }
            }
            this._data[wheel.compiler.command.REG_OFFSET_STACK] = stackOffset;
        };

        this.getDataAtRegOffset = function(count) {
            var regOffsetSrc = this._data[wheel.compiler.command.REG_OFFSET_SRC];
            var result       = [];

            for (var i = 0; i < count; i++) {
                result[i] = this._data(regOffsetSrc + i);
            }
            return result;
        };

        this.getRecordFromAtOffset = function(recordFields) {
            var regOffsetSrc = this._data[wheel.compiler.command.REG_OFFSET_SRC];
            var result       = {};

            for (var i = 0; i < recordFields.length; i++) {
                result[recordFields[i]] = this._data[regOffsetSrc + i];
            }
            return result;
        };

        this.getNumberAtRegOffset = function() {
            var data = this._data;
            return data[data[wheel.compiler.command.REG_OFFSET_SRC]];
        };

        this.setNumberAtRegOffset = function(value) {
            var data = this._data;
            data[data[wheel.compiler.command.REG_OFFSET_SRC]] = value;
        };
    });