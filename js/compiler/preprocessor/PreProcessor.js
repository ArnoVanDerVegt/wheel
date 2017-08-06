(function() {
    var wheel = require('../../utils/base.js').wheel;
    var path  = require('path');
    // var fs    = require('fs'); // For image converter...

/*
    var RgfBuilder = wheel.Class(function() {
            this.init = function(opts) {
                this._image = null;
            };

            ***
             * The image parameter is expected to be an array of strings, all with the same length,
             * filled with 0 or 1 to indicate the pixel value.
            ***
            this.build = function(image) {
                if (!image.length) {
                    throw new Error('Image has no size.');
                }

                var width = image[0].length;
                for (var y = 0; y < image.length; y++) {
                    var line = image[y].trim();
                    if (image[y].length !== width) {
                        throw new Error('All image lines should be the same width.');
                    }
                }

                var bytesPerLine = Math.ceil(width / 8);
                var bytes        = [];

                for (var y = 0; y < image.length; y++) {
                    bytes[y] = [];
                    for (var x = 0; x < bytesPerLine; x++) {
                        bytes[y][x] = 0;
                    }
                    var line   = image[y];
                    var value  = 1;
                    var offset = 0;
                    for (var x = 0; x < line.length; x++) {
                        (line[x] === '1') && (bytes[y][offset] |= value);
                        value <<= 1;
                        if (value === 256) {
                            offset++;
                            value = 1;
                        }
                    }
                }

                this._image = [width, image.length].concat(bytes);

                return this;
            };

            this.writeFile = function(filename) {
                var image  = this._image;
                var buffer = new Buffer(image.length);

                image.forEach(function(value, index) {
                    buffer[index] = value;
                });

                fs.writeFileSync(filename, buffer, 'binary');
            };
        });
*/

    wheel(
        'compiler.preprocessor.PreProcessor',
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
                this._replaceTree   = new wheel.compiler.preprocessor.ReplaceTree({});
                this._fileProcessor = new wheel.compiler.preprocessor.FileProcessor({
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