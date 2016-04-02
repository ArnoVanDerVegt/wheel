var NewDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'Create a new file'
			};
		},

		onClose: function() {
			this.setState({
				visible: false
			});
		},

		onSelect: function(file) {
			var activeFile 	= this.state.activeFile,
				path 		= activeFile ? activeFile.getPath() : '/',
				files 		= this.props.files,
				filename 	= files.newName(path + '/file', file.ext);

			this.state.onConfirm && this.state.onConfirm(filename);
			this.setState({
				visible: false
			});
		},

		render: function() {
			var files = [
					{
						icon: 			'mdi-package-variant',
						ext: 			'.mvmp',
						title: 			'Mvmp',
						description: 	'Mindstorms VM project file.'
					},
					{
						icon: 			'mdi-code-brackets',
						ext: 			'.mvm',
						title: 			'Mvm',
						description: 	'Mindstorms VM include file.'
					},
					{
						icon: 			'mdi-file-image',
						ext: 			'.rgf',
						title: 			'Rgf',
						description: 	'Robot graphics file.'
					}
				],
				fileChildren = [];

			for (var i = 0; i < files.length; i++) {
				(function(file) {
					fileChildren.push({
						type: 'li',
						props: {
							onClick: function() { this.onSelect(file); }.bind(this)
						},
						children: [
							{
								props: {
									className: 	'mdi ' + file.icon,
								}
							},
							{
								props: {
									className: 'new-item-details'
								},
								children: [
									{
										type: 'h4',
										props: {
											className: 'new-item-title',
											innerHTML: file.title
										}
									},
									{
										type: 'span',
										props: {
											className: 'new-item-description',
											innerHTML: file.description
										}
									}
								]
							}
						]
					});
				}).call(this, files[i]);
			}


			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'new',
					this.state.icon || 'mdi-file-outline',
					[
						{
							props: {
								className: 'new-content'
							},
							children: [
								{
									type: 		'ul',
									children: 	fileChildren
								}
							]
						}
					],
					[
						{
							type: 'button',
							props: {
								className: 	'button',
								innerHTML: 	'Cancel',
								onClick: 	this.onClose
							}
						}
					]
				)
			);
		}
	});