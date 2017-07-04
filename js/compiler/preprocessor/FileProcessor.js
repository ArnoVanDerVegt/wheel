(function() {
    var wheel = require('../../utils/base.js').wheel;

    var FileProcessor = wheel.Class(function() {
            this.init = function(opts) {
                this._preProcessor = opts.preProcessor;
                this._files        = opts.files;
                this._replaceTree  = opts.replaceTree;
            };

            this.removeMeta = function(line, meta) {
                var i = line.indexOf(meta);
                return (i === -1) ? line : line.substr(0, i);
            };

            this.checkTabs = function(line) {
                var result = '';
                for (var i = 0; i < line.length; i++) {
                    var c = line[i];
                    result += (c === '\t') ? '    ' : c;
                }
                return result;
            };

            this.checkRemark = function(line) {
                for (var i = 0; i < line.length; i++) {
                    var c = line[i];
                    switch (c) {
                        case '"':
                            while ((i < line.length) && (line[i++] !== '"')) {}
                            break;

                        case ';':
                            return line.substr(0, i);
                    }
                }

                return line;
            };

            this.checkDefine = function(line) {
                var i = line.indexOf('#define');
                if (i === -1) {
                    return line;
                }
                line = line.substr(i + 8 - line.length);
                var j     = line.indexOf(' ');
                var cnst  = line.substr(0, j);
                var value = line.substr(j - line.length).trim();
                this._replaceTree.add(cnst, value);

                return line.substr(0, i);
            };

            this.checkDefines = function(line) {
                return this._replaceTree.update(line);
            };

            this.checkInclude = function(line) {
                return this.removeMeta(line, '#include');
            };

            this.checkProject = function(line) {
                return this.removeMeta(line, '#project');
            };

            this.process = function(lines) {
                var result = [];
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    line = this.checkTabs(line);
                    line = this.checkProject(line);
                    line = this.checkRemark(line);
                    line = this.checkDefine(line);
                    line = this.checkDefines(line);
                    line = this.checkInclude(line);
                    result.push(line);
                }

                return result;
            };

            this.processIncludes = function(lines) {
                var result = [];
                var path   = this._preProcessor.getPath();
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    var j    = line.indexOf('#include');
                    if (j !== -1) {
                        var filename = line.substr(j + 8 - line.length).trim();
                        if ((filename.length > 2) && (filename[0] === '"') && (filename[filename.length - 1] === '"')) {
                            filename = filename.substr(1, filename.length - 2);
                            if (result.indexOf(filename) === -1) {
                                if (this._files.exists(path, filename) !== false) {
                                    result.push(filename);
                                } else {
                                    throw new Error('File not found "' + filename + '".');
                                }
                            }
                        } else {
                            throw new Error('Include file error.');
                        }
                    }
                }

                return result;
            };
        });

    wheel('compiler.preprocessor.FileProcessor', FileProcessor);
})();