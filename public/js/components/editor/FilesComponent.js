var ResizeComponent = React.createClass({
		getInitialState: function() {
			return {
				resizing: false
			};
		},

		onStartResize: function(event) {
			this.props.editor.setResizeListener(this);
			var state = this.state;
			state.resizing = true;
			this.setState(state);

			event.preventDefault();
		},

		onResize: function(pageX, pageY) {
			this.props.owner.onResize(pageX, pageY);
		},

		onEndResize: function() {
			var state = this.state;
			state.resizing = false;
			this.setState(state);
		},

		render: function() {
			return utilsReact.fromJSON({
				type: 'li',
				props: {
					className: 		'dotted resizer' + (this.state.resizing ? ' resizing' : ''),
					onMouseDown: 	this.onStartResize,
				}
			});
		}
	});

var FilesComponent = React.createClass({
		getInitialState: function() {
			this.props.files.on('Loaded', function() { this.setState({a:Math.random()}); }.bind(this) );
			return {
				width: 360
			};
		},

		setWidth: function(width) {
			var state = this.state;
			width = Math.min(Math.max(width, 100), 400);
			if (state.width !== width) {
				state.width = width;
				this.setState(state);
			}
		},

		onResize: function(pageX, pageY) {
			this.setWidth(pageX);
			this.props.editor.refs.codeMirror.setLeft(pageX);
			this.props.editor.refs.console.setLeft(pageX);
		},

		showPath: function(filename) {
			var files 	= this.props.files,
				i 		= filename.lastIndexOf('/');
			while (i !== -1) {
				filename = filename.substr(0, i);
				var j = files.exists(filename);
				if (j !== false) {
					file = files.getFile(j);
					file.setOpen(true);
				}
				i = filename.lastIndexOf('/');
			}
			this.setState(this.state);
		},

		render: function() {
			var props 			= this.props,
				fileChildren 	= [],
				files 			= [];
			for (var i = 0, j = props.files.getLength(); i < j; i++) {
				var file = props.files.getFile(i);
				files.push({
					index: 		i,
					active: 	(props.activeFileIndex === i),
					canRename: 	file.getCanRename(),
					name: 		file.getName(),
					dir: 		file.getDir(),
					open: 		file.getOpen(),
					changed: 	file.getChanged(),
					toString: 	function() {
						return this.name;
					}
				});
			}
			files.sort();

			var p = '';
				root = {
					children: 	{},
					name: 		'Projects'
				},
				activeFile = props.files.getFile(props.activeFileIndex),
				activePath = activeFile ? activeFile.getName() : '',
				addPath = function(path, dir, changed, active) {
					if (path[0] === '/') {
						path = path.substr(1 - path.length);
					}
					var parts 	= path.split('/'),
						node 	= root;
					for (var i = 0; i < parts.length; i++) {
						var part = parts[i];
						if (part in node.children) {
							node 				= node.children[part];
						} else {
							var newNode = {
									children: 	[],
									name: 		part,
									path: 		path,
									active: 	active,
									dir: 		dir,
									changed: 	changed
								};
							node.children[part] = newNode;
							node 				= newNode;
						}
					}
				};

			var i = 0;
			while (i < files.length) {
				var file = files[i];
				if (file.dir) {
					addPath(file.name, file.dir, file.changed, i === props.activeFileIndex);
					if (!file.open) {
						var name 	= file.name,
							length 	= name.length;
						while (i < files.length) {
							if (files[i].name.substr(0, length) === name) {
								i++;
							} else {
								i--;
								break;
							}
						}
					}
				} else {
					addPath(file.name, file.dir, file.changed, i === props.activeFileIndex);
				}
				i++;
			}

			var addNode = function(node, depth) {
					var icon = 'icon-project';

					if (node.path) {
						if (node.dir) {
							icon = 'icon-folder';
						} else {
							if (node.path.substr(-5) === '.whlp') {
								icon = 'icon-project';
							} else if (node.path.substr(-4) === '.whl') {
								icon = 'icon-bracket';
							} else if (node.path.substr(-4) === '.rgf') {
								icon = 'icon-file';
							} else {
								icon = 'icon-file';
							}
						}
					}

					var hasChildren = Object.keys(node.children).length,
						result = {
							type: 		'li',
							children: 	[
								{
									props: {
										onClick: 	(function() { node.path && this.props.onSelectFile(node.path); }).bind(this),
										className: (node.active ? 'active' : '') + (node.changed ? ' changed' : ''),
										style: {
											paddingLeft: (depth * 16) + 'px'
										}
									},
									children: [
										(node.name === null) ?
											null :
											{
												props: {
													className: 	'icon ' + icon
												}
											},

										(node.name === null) ?
											null :
											{
												type: 'span',
												props: {
													innerHTML: 	node.name
												}
											},

										{
											props: {
												className: 	'icon-close',
												onClick: 	(function() {
													var index = props.files.exists(node.path);
													if (index === props.activeFileIndex) {
														if (node.dir) {
															this.props.onDeleteDir(index);
														} else {
															this.props.onDeleteFile(index);
														}
													} else {
														this.props.onSelectFile(node.path);
													}
												}).bind(this)
											}
										},
										{
											props: {
												className: 	'icon-pen',
												onClick: 	(function() {
													var index = props.files.exists(node.path);
													if (index === props.activeFileIndex) {
														this.props.onRenameFile(index);
													} else {
														this.props.onSelectFile(node.path);
													}
												}).bind(this)
											}
										}
									]
								}
							]
						};
					if (hasChildren) {
						result.children.push({
							type: 		'ul',
							props: 		{},
							children: 	[]
						});
						for (var i in node.children) {
							result.children[1].children.push(addNode(node.children[i], depth + 1));
						}
					}
					return result;
				}.bind(this);

			return utilsReact.fromJSON({
				type: 'ul',
				props: {
					className: 'files',
					style: {
						width: this.state.width + 'px'
					}
				},
				children: [
					addNode(root, 0),
					{
						type: ResizeComponent,
						props: {
							editor: 		this.props.editor,
							owner: 			this,
							className: 		'resizer',
							onMouseDown: 	this.onStartResize,
							onMouseUp: 		this.onEndResize
						}
					}
				]
			});
		}
	});
