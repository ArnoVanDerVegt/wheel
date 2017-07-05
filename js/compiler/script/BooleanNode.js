(function() {
    var wheel = require('../../utils/base.js').wheel;

    var labelIndex = 0;

    wheel(
        'compiler.script.BooleanNode',
        wheel.Class(function() {
            this.init = function(opts) {
                this._scriptCompiler = opts.scriptCompiler;
                this._result         = opts.result;
                this._label          = opts.label;
                this._labels         = opts.labels;
                this._src            = opts.src;
                this._parent         = null;
                this._index          = labelIndex++;
                this._left           = opts.left  || false;
                this._right          = opts.right || false;
                this._value          = opts.value || false;
            };

            this.getIndex = function() {
                return this._index;
            };

            this.getRightSrc = function() {
                return (this._src === 'right');
            };

            this.getParent = function() {
                return this._parent;
            };

            this.setParent = function(parent) {
                this._parent = parent;
                return this;
            };

            this.getOrType = function() {
                return (this._type === 'or');
            };

            this.getAndType = function() {
                return (this._type === 'and');
            };

            this.getValue = function() {
                return this._value;
            };

            this.compileJumpParts = function(s) {
                var compare = {
                        je:  '!=',
                        jne: '==',
                        jl:  '>=',
                        jg:  '<=',
                        jle: '>',
                        jge: '<'
                    };
                var jumps = ['je', 'jne', 'jl', 'jg', 'jle', 'jge'];
                var jump  = null;
                var cmp;
                var k;
                for (var j = 0; j < jumps.length; j++) {
                    jump = jumps[j];
                    cmp  = compare[jump];
                    k    = s.indexOf(cmp);
                    if (k !== -1) {
                        break;
                    }
                }
                var parts;
                if (k === -1) {
                    parts = [s, '0'];
                    jump  = 'je';
                    cmp   = '==';
                } else {
                    parts = s.split(compare[jump]);
                }
                return {
                    start: parts[0].trim(),
                    end:   parts[1].trim(),
                    jump:  jump,
                    cmp:   cmp
                };
            };

            this.addLines = function(lines) {
                lines.forEach(function(line) { this.addLine(line); }, this);
            };

            this.addLine = function(line) {
                this._result.push(line);
            };

            this.addJumpTrue = function() {
                this.addLine('jmp ' + this._label + '_true');
            };

            this.addExitLabelLine = function(line) {
                this._labels.push({offset: this._result.length, type: 'exit'});
                this._result.push(line);
            };

            this.addIndexLabel = function() {
                this.addLine(this._label + '_' + this._index + ':');
            };

            this.compile = function() {
                var jumpParts = this.compileJumpParts(this._value);
                var ifLine    = jumpParts.start + jumpParts.cmp + jumpParts.end;
                var operator  = {command: 'cmp', operator: jumpParts.cmp, pos: jumpParts.start.length};
                var result    = this._scriptCompiler.compileOperator(ifLine, operator);
                this.addLines(result);

                return jumpParts;
            };
        })
    );
})();

