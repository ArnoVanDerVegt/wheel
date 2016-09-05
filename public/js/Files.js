(function() {
    var File = Class(function() {
            this.init = function(opts) {
                this._dir       = opts.dir;
                this._files     = opts.files;
                this._local     = ('local' in opts) ? opts.local : this._files.getLocal();
                this._name      = opts.name || this._files.createNewName('File');
                this._canRename = ('canRename' in opts) ? opts.canRename : true;
                this._data      = opts.data || '';
                this._hasData   = ('data' in opts) || this._dir;
                this._changed   = ('saved' in opts) ? !opts.saved : true;
                this._open      = false;
                this._meta      = {};
            };

            this.getName = function() {
                return this._name;
            };

            this.setNameLocal = function(name) {
                this._name = name;
            };

            this.setName = function(name, callback) {
                ajaxUtils.send(
                    '/api/rename?oldFilename=' + encodeURIComponent(this._name) + '&newFilename=' + encodeURIComponent(name),
                    function(error, data) {
                        if (error) {
                            console.error(error, data);
                        } else {
                            if (this._dir) {
                                this._files.renameDir(this._name, name);
                            }
                            this._name = name;
                            callback && callback();
                        }
                    }.bind(this)
                );
            };

            this.getData = function(callback) {
                if (callback) {
                    if (this._hasData) {
                        callback(this._data);
                        return;
                    }
                    var uri;
                    if (this._local) {
                        uri = '/api/file?filename=' + encodeURIComponent(this._name);
                    } else {
                        // Check if there's a version of this file in local storage...
                        var files = LocalStorage.getInstance().get('files', {});
                        if (this._name in files) {
                            this._changed = false;
                            this._hasData = true;
                            this._data    = files[this._name];
                            callback(this._data);
                            return;
                        }

                        uri = 'http://arnovandervegt.github.io/wheel/wheel' + this._name;
                    }

                    ajaxUtils.send(
                        uri,
                        function(error, data) {
                            if (error) {
                                console.error(error, data);
                            } else {
                                this._changed = false;
                                this._hasData = true;
                                this._data    = data;
                                callback(data);
                            }
                        }.bind(this)
                    );
                } else {
                    return this._data;
                }
            };

            this.setData = function(data, noChange) {
                if (!noChange) {
                    this._changed = true;
                }
                this._hasData = true;
                this._data    = data;
            };

            this.getHasData = function() {
                return this._hasData;
            };

            this.getCanRename = function() {
                return this._canRename;
            };

            this.getDir = function() {
                return this._dir;
            };

            this.getPath = function() {
                if (this._dir) {
                    return this._name;
                }
                var i = this._name.lastIndexOf('/');
                return this._name.substr(0, i);
            };

            this.getChanged = function() {
                return this._changed;
            };

            this.setChanged = function(changed) {
                this._changed = changed;
            };

            this.getOpen = function() {
                return this._open;
            };

            this.setOpen = function(open) {
                this._open = open;
            };

            this.getMeta = function() {
                return this._meta;
            };

            this.setMeta = function(meta) {
                this._meta = meta;
            };

            this.toString = function() {
                return this._name;
            };

            this.save = function() {
                if (!this._changed) {
                    return;
                }
                this._changed = false;
                if (this._local) {
                    // Running a node server...
                    ajaxUtils.send(
                        '/api/file?filename=' + encodeURIComponent(this._name),
                        function(error, data) {
                            if (error) {
                                console.error(error, data);
                                this._changed = true;
                            }
                        }.bind(this),
                        {
                            data: this._data
                        }
                    );
                } else {
                    // Not running a node server, store in local storage...
                    var localStorage = LocalStorage.getInstance();
                    var files        = localStorage.get('files', {});
                    files[this._name] = this._data;
                    localStorage.set('files', files);
                }
            };
        });

    wheel('File', File);

    wheel(
        'Files',
        Class(Emitter, function(supr) {
            this.init = function(opts) {
                supr(this, 'init', arguments);

                this._local             = (document.location.href.indexOf('github') === -1);
                this._savedLocalStorage = false;
                this._files             = [];

                if (this._local) {
                    // Running a node server...
                    ajaxUtils.send('/api/dir', this.onDir.bind(this));
                } else {
                    var dir = LocalStorage.getInstance().get('dir', null);
                    if (dir) {
                        this._savedLocalStorage = true;
                        setTimeout(
                            function() {
                                this.onDir(false, {files: dir});
                            }.bind(this),
                            1
                        );
                    } else {
                        ajaxUtils.send('dir.json', this.onDir.bind(this));
                    }
                }
            };

            this.onDir = function(error, data) {
                this._files = [];

                if (error) {
                    return;
                }
                var files    = data.files;
                var toString = function() { return this.name; };
                for (var i = 0; i < files.length; i++) {
                    files[i].toString = toString;
                }
                files.sort();

                if (!this._local && !this._savedLocalStorage) {
                    this._savedLocalStorage = true;
                    LocalStorage.getInstance().set('dir', files);
                }

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    this.createFile({
                        name:    file.name,
                        dir:     !!file.dir,
                        hasData: false,
                        saved:   true
                    });
                }

                this.emit('Loaded');
            };

            this.exists = function(name) {
                if (!(typeof name === 'string')) {
                    return false;
                }
                if (name[0] !== '/') {
                    name = '/' + name;
                }

                var files = this._files;
                for (var i = 0; i < files.length; i++) {
                    if (files[i].getName() === name) {
                        return i;
                    }
                }
                return false;
            };

            this.newName = function(start, end) {
                var files = this._files;
                var name;
                var index = 1;

                while (true) {
                    name = start + index + end;
                    if (this.exists(name) === false) {
                        break;
                    }
                    index++;
                }

                return name;
            };

            this.getLocal = function() {
                return this._local;
            };

            this.getFile = function(index) {
                return this._files[index] || null;
            };

            this.getLength = function() {
                return this._files.length;
            };

            this.createFile = function(fileOpts) {
                fileOpts.files = this;
                fileOpts.local = this._local;
                var file = new File(fileOpts);
                file.save();
                this._files.push(file);
                this._files.sort();
            };

            this.renameDir = function(oldName, newName) {
                var files  = this._files;
                var length = oldName.length;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i],
                        name = file.getName();
                    if (name.substr(0, length) === oldName) {
                        file.setNameLocal(newName + name.substr(length - name.length));
                    }
                }
            };

            this.removeFile = function(name, callback) {
                ajaxUtils.send(
                    '/api/remove-file?filename=' + encodeURIComponent(name),
                    function(error, data) {
                        if (error) {
                            console.error(error, data);
                            this._changed = true;
                        } else {
                            var files = this._files;
                            for (var i = 0; i < files.length; i++) {
                                if (files[i].getName() === name) {
                                    files.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        callback && callback();
                    }.bind(this),
                    {
                        post: true
                    }
                );
            };

            this.removeDir = function(name, callback) {
                ajaxUtils.send(
                    '/api/remove-dir?path=' + encodeURIComponent(name),
                    function(error, data) {
                        if (error) {
                            console.error(error, data);
                            this._changed = true;
                        } else {
                            var length = name.length;
                            var files  = this._files;
                            var i      = 0;

                            while (i < files.length) {
                                var filename = files[i].getName();
                                if (filename.substr(0, length) === name) {
                                    files.splice(i, 1);
                                } else {
                                    i++;
                                }
                            }
                            callback && callback();
                        }
                    }.bind(this),
                    {
                        post: true
                    }
                );
            };
        })
    );
})();