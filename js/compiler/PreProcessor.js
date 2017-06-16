(function() {
    var wheel = require('../utils/base.js').wheel;
    var path  = require('path');

    var ReplaceTree = wheel.Class(function() {
            this.init = function(opts) {
                this.reset();
            };

            this.reset = function() {
                this._root = {
                    value:    '',
                    children: {}
                };
            };

            this.add = function(key, value) {
                var node = this._root;
                for (var i = 0, j = key.length - 1; i <= j; i++) {
                    var c = key[i];
                    if (c in node.children) {
                        node = node.children[c];
                    } else {
                        var child = {
                                children: {},
                                value:    ''
                            };
                        node.children[c] = child;
                        node             = child;
                    }
                }
                node.value = value;
            };

            this.update = function(line) {
                var i = 0;
                while (i < line.length) {
                    var c = line[i++];
                    if (c in this._root.children) {
                        var node = this._root.children[c];
                        var j    = i;

                        while (j < line.length) {
                            c = line[j++];
                            if (c in node.children) {
                                node = node.children[c];
                            } else {
                                break;
                            }
                        }
                        line = line.substr(0, i - 1) + node.value + line.substr(j - 1 - line.length);
                        i    = i + node.value.length;
                    }
                }

                return line;
            };
        });


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

    wheel(
        'compiler.PreProcessor',
        wheel.Class(wheel.Emitter, function(supr) {
            this.init = function init(opts) {
                supr(this, this.init, arguments);

                var config = opts.config || {};

                this._basePath = opts.basePath || '';
                this._path     = [];

                var p = [''].concat(config.path || []);
                p.forEach(
                    function(p) {
                        this._path.push(path.join(this._basePath, p));
                    },
                    this
                );

                this._files         = opts.files;
                this._filesDone     = {};
                this._fileCount     = 0;
                this._replaceTree   = new ReplaceTree({});
                this._fileProcessor = new FileProcessor({
                    preProcessor: this,
                    files:        this._files,
                    replaceTree:  this._replaceTree
                });
            };

            this.getPath = function() {
                return this._path;
            };

            this.getFileData = function(filename, callback) {
                var index = this._files.exists(this.getPath(), filename);
                var file  = this._files.getFile(index);

                return callback ? file.getData(callback) : file.getData();
            };

            this.processFile = function(filename, depth, finishedCallback) {
                var filesDone = this._filesDone;

                (filename in filesDone) || (filesDone[filename] = {depth: depth, index: 0});

                this._fileCount++;
                this.getFileData(
                    filename,
                    function(data) {
                        var lines    = data.split('\n');
                        var includes = this._fileProcessor.processIncludes(lines);

                        for (var i = 0; i < includes.length; i++) {
                            var include = includes[i];
                            if (include in filesDone) {
                                var fileDone = filesDone[include];
                                fileDone.depth += depth;
                                fileDone.index += i;
                            } else {
                                this.processFile(include, depth + 1, finishedCallback);
                            }
                        }

                        this._fileCount--;
                        (this._fileCount === 0) && finishedCallback();
                    }.bind(this)
                );
            };

            this.process = function(filename, finishedCallback) {
                this._replaceTree.reset();

                this._filesDone = {};
                this._fileCount = 0;
                this.processFile(
                    filename,
                    0,
                    function() {
                        var filesDone = this._filesDone;
                        var includes  = [];
                        for (var filename in filesDone) {
                            var fileDone = filesDone[filename];
                            var lines    = this.getFileData(filename).split('\n');
                            includes.push({
                                filename: filename,
                                depth:    fileDone.depth,
                                index:    fileDone.index,
                                lines:    this._fileProcessor.process(lines),
                                toString: function() {
                                    var d = ('000000' + (this.depth * 10240)).substr(-6);
                                    var i = ('000000' + (this.index * 10240)).substr(-6);
                                    return d + i;
                                }
                            });
                        }
                        includes.sort();
                        for (var i = includes.length - 1; i >= 0; i--) {
                            var include = includes[i];
                            var lines   = this.getFileData(include.filename).split('\n');
                            include.lines = this._fileProcessor.process(lines);
                        }

                        finishedCallback(includes);
                    }.bind(this)
                );
            };
        })
    );
})();