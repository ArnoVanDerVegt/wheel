(function() {
    var wheel = require('../utils/base.js').wheel;

    wheel(
        'compiler.CompilerRecord',
        wheel.Class(function() {
            this.init = function(opts) {
                this._compiler     = opts.compiler;
                this._compilerData = opts.compilerData;
                this.reset();
            };

            this.reset = function() {
                this._list         = {};
                this._activeRecord = null;
                this._recordLocal  = {};
            };

            this.declareRecord = function(name, command) {
                var result = {
                        name: name,
                        list: new wheel.compiler.CompilerList({compiler: this._compiler, compilerData: this._compilerData}),
                        size: 0
                    };
                var compiler = this._compiler;
                var list     = this._list;
                if (!wheel.compiler.helpers.compilerHelper.validateString(name)) {
                    throw compiler.createError(wheel.compiler.error.SYNTAX_ERROR_INVALID_STRUCS_CHAR, 'Syntax error.');
                }

                wheel.compiler.helpers.compilerHelper.checkDuplicateIdentifier(compiler, name, list);

                list[name]         = result;
                this._activeRecord = result;

                if (compiler.getInProc()) {
                    this._recordLocal[name] = true;
                }

                return result;
            };

            this.declareRecordField = function(name, type, arrayType, size, recordType) {
                var record      = this._activeRecord;
                var recordField = record.list.declareItem(name, type, arrayType, recordType, false);
                record.size = record.list.getOffset();

                return recordField;
            };

            this.findRecord = function(name) {
                return this._list[name] || null;
            };

            this.removeLocalRecords = function() {
                for (var name in this._recordLocal) {
                    delete this._list[name];
                }
                this._recordLocal = {};
            };
        })
    );
})();