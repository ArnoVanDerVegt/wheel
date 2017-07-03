(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'compiler.commands.Label',
        wheel.Class(wheel.compiler.commands.CommandCompiler, function(supr) {
            /**
             * Check if a line starts with a label...
            **/
            this.hasLabel = function(line) {
                var i = line.indexOf(':');
                if ((line.length > 1) && (i !== -1)) {
                    return wheel.compiler.helpers.compilerHelper.validateString(line.substr(0, i));
                }
                return false;
            };

            /**
             * When the compilation is done all label addresses are known,
             * each label has a list of associated jumps, set the jump value
             * to the correct label index...
            **/
            this.updateLabels = function() {
                var compilerData   = this._compilerData;
                var outputCommands = this._compiler.getOutput().getBuffer();
                var labelList      = compilerData.getLabelList();
                var $              = wheel.compiler.command;

                for (var i in labelList) {
                    var label = labelList[i];
                    var jumps = label.jumps;
                    for (var j = 0; j < jumps.length; j++) {
                        var jump = jumps[j];
                        if (outputCommands[jump].code === $.jmpc.code) {
                            outputCommands[jump].params[0].value = label.index;
                        } else {
                            outputCommands[jump] = {code: $.set.code, params: [$.CODE(), $.CONST(label.index)]};
                        }
                    }
                }
            };

            /**
             * Collect all labels from the lines,
             * check if they are unique and create a declaration...
            **/
            this.compile = function(lines) {
                var sourceMap    = lines.sourceMap;
                var compilerData = this._compilerData;

                for (var i = 0; i < lines.output.length; i++) {
                    this._lineNumber = i;

                    var line     = lines.output[i].trim();
                    var location = sourceMap[i];

                    if (this.hasLabel(line)) {
                        var j = line.indexOf(':');
                        if (compilerData.declareLabel(line.substr(0, j), location)) {
                            throw this._compiler.createError(wheel.compiler.error.DUPLICATE_IDENTIFIER_LABEL, 'Duplicate label "' + line + '".');
                        }
                    }
                }
            };
        })
    );
})();