var ReplaceTree = Class(function() {
		this.init = function(opts) {
			this.reset();
		};

		this.reset = function() {
			this._root = {
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
							children: 	{}
						};
					node.children[c] 	= child;
					node 				= child;
				}
			}
			node.value = value;
		};

		this.update = function(line) {
			var i = 0;
			while (i < line.length) {
				var c = line[i++];
				if (c in this._root.children) {
					var node 	= this._root.children[c],
						j 		= i;

					while (j < line.length) {
						c = line[j++];
						if (c in node.children) {
							node = node.children[c];
						} else {
							break;
						}
					}
					if (node.value) {
						line 	= line.substr(0, i - 1) + node.value + line.substr(j - 1 - line.length);
						i 		= i + node.value.length;
					}
				}
			}

			return line;
		};
	});


var FileProcessor = Class(function() {
		this.init = function(opts) {
			this._files 		= opts.files;
			this._replaceTree 	= opts.replaceTree;
		};

		this.checkRemark = function(line) {
			for (var i = 0; i < line.length; i++) {
				var c = line[i++];
				switch (c) {
					case '"':
						while ((i < line.length) && (line[i++] !== '"')) {}
						break;

					case ';':
						return line.substr(0, i - 2);
						break;
				}
			}
			return line;
		};

		this.checkDefine = function(line) {
			var i = line.indexOf('#define');
			if (i === -1) {
				return line;
			}
			line 	= line.substr(i + 8 - line.length);
			i 		= line.indexOf(' ');
			var cnst 	= line.substr(0, i),
				value 	= line.substr(i - line.length).trim();
			this._replaceTree.add(cnst, value);

			return line.substr(0, i);
		};

		this.checkDefines = function(line) {
			return this._replaceTree.update(line);
		};

		this.checkInclude = function(line) {
			var i = line.indexOf('#include');
			if (i === -1) {
				return line;
			}

			return line.substr(0, i);
		};

		this.process = function(lines) {
			var result = [];
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
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
			for (var i = 0; i < lines.length; i++) {
				var line 	= lines[i],
					j 		= line.indexOf('#include');
				if (j !== -1) {
					var filename = line.substr(j + 8 - line.length).trim();
					if ((filename.length > 2) && (filename[0] === '"') && (filename[filename.length - 1] === '"')) {
						filename = filename.substr(1, filename.length - 2);
						if (result.indexOf(filename) === -1) {
							if (this._files.exists(filename) === false) {
								throw new Error('File not found "' + filename + '".');
							} else {
								result.push(filename);
							}
						}
					} else {
						throw new Error('Include file error "' + filename + '".');
					}
				}
			}

			return result;
		};
	});

var PreProcessor = Class(function() {
		this.init = function(opts) {
			this._files 		= opts.files;
			this._filesDone 	= {};
			this._replaceTree 	= new ReplaceTree({});
			this._fileProcessor = new FileProcessor({
				preProcessor: 	this,
				files: 			this._files,
				replaceTree: 	this._replaceTree
			});
		};

		this.getFileData = function(filename) {
			var index = this._files.exists(filename);
			if (index !== false) {
				var file = this._files.getFile(index);
				if (file) {
					return file.getData().split("\n");
				}
			}
			return [''];
		};

		this.processFile = function(filename, depth) {
			var filesDone = this._filesDone;
			filesDone[filename] = {depth: depth, index: 0};

			var lines 			= this.getFileData(filename),
				includes 		= this._fileProcessor.processIncludes(lines),
				allFilesDone 	= false;

			for (var i = 0; i < includes.length; i++) {
				var include = includes[i];
				if (include in filesDone) {
					var fileDone = filesDone[filename];
					if (depth > fileDone[filename].depth) {
						fileDone[filename].depth = depth;
						fileDone[filename].index = i;
					}
				} else {
					this.processFile(include, depth + 1);
				}
			}
		}

		this.process = function(filename) {
			this._replaceTree.reset();

			this._filesDone = {};
			this.processFile(filename, 0);

			var filesDone 	= this._filesDone,
				includes 	= [];
			for (var filename in filesDone) {
				var fileDone = filesDone[filename];
				includes.push({
					filename: 	filename,
					depth: 		fileDone.depth,
					index: 		fileDone.index,
					lines: 		this._fileProcessor.process(this.getFileData(filename)),
					toString: 	function() {
						var d = ('000000' + (this.depth * 10240)).substr(-6),
							i = ('000000' + (this.index * 10240)).substr(-6);
						return d + i;
					}
				});
			}
			includes.sort();
			for (var i = includes.length - 1; i >= 0; i--) {
				var include = includes[i];
				include.lines = this._fileProcessor.process(this.getFileData(include.filename));
			}

			return includes;
		};
	});
