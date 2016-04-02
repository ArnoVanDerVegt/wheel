var FilesComponent = React.createClass({
		getInitialState: function() {
			this.props.files.on('Loaded', function() { this.setState({a:Math.random()}); }.bind(this) );
			return {};
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
					var icon = 'mdi-package-variant';

					if (node.path) {
						if (node.dir) {
							icon = 'mdi-folder-outline';
						} else {
							if (node.path.substr(-5) === '.mvmp') {
								icon = 'mdi-package-variant';
							} else if (node.path.substr(-4) === '.mvm') {
								icon = 'mdi-code-brackets';
							} else if (node.path.substr(-4) === '.rgf') {
								icon = 'mdi-file-image';
							} else {
								icon = 'mdi-file-outline';
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
													className: 	'mdi ' + icon
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
												className: 	'mdi mdi-close',
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
												className: 	'mdi mdi-pencil',
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
					className: 'files'
				},
				children: [addNode(root, 0)]
			});
		}
	});
