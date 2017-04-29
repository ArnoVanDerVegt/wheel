(function() {
    var wheel = require('../utils/base.js').wheel;
    var $;

    wheel(
        'compiler.CompilerRecord',
        wheel.Class(function() {
            this.init = function(opts) {
                $ = wheel.compiler.command;

                this._compiler     = opts.compiler;
                this._compilerData = opts.compilerData;
                this.reset();
            };

            this.reset = function() {
                this._recordOffset      = 0;
                this._recordList        = {};
                this._record            = null;
                this._recordLocal       = {};
            };

            this.declareRecord = function(name, command, location) {
                var result = {
                        name:     name,
                        size:     0,
                        fields:   {},
                        location: location
                    };
                var compiler   = this._compiler;
                var recordList = this._recordList;
                if (!wheel.compiler.compilerHelper.validateString(name)) {
                    throw compiler.createError(wheel.compiler.error.SYNTAX_ERROR_INVALID_STRUCS_CHAR, 'Syntax error.');
                }

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(compiler, name, recordList);

                recordList[name]   = result;
                this._record       = result;
                this._recordOffset = 0;

                if (compiler.getInProc()) {
                    this._recordLocal[name] = true;
                }

                return result;
            };

            this.declareRecordField = function(name, type, arrayType, size, recordType) {
                (size   === undefined) && (size   = 1);
                var compilerData = this._compilerData;
                var metaType     = compilerData.getPointerVar(name) ? $.T_META_POINTER : null;
                var record       = this._record;

                name = compilerData.getNameWithoutPointer(name);

                wheel.compiler.compilerHelper.checkDuplicateIdentifier(this._compiler, name, record);

                var vr          = compilerData._parseVariable(name);
                var recordField = {
                        type:     (vr.length === 1) ? type : arrayType,
                        record:   recordType || false,
                        metaType: metaType,
                        offset:   this._recordOffset,
                        size:     size,
                        length:   vr.length
                    };
                record.fields[vr.name] = recordField;

                this._recordOffset += vr.length * size;
                record.size = this._recordOffset;

                return recordField;
            };

            this.getOffset = function() {
                return this._offset;
            };

            this.findRecord = function(name) {
                return this._recordList[name] || null;
            };

            this.removeLocalRecords = function() {
                for (var name in this._recordLocal) {
                    delete this._recordList[name];
                }
                this._recordLocal = {};
            };
        })
    );
})();

