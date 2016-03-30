var MenuComponent = React.createClass({
		render: function() {
			return 	utilsReact.fromJSON({
				type: 'ul',
				props: {
					className: 	'menu',
				},
				children: [
					{
						type: 'li',
						props: {
							className: 	'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'File'
								}
							},
							{
								type: 'ul',
								props: {
									className: 'dropdown'
								},
								children: [
									{
										type: 'li',
										props: {
											innerHTML: 'New project'
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'New file',
											onClick: 	(function() { this.props.onFile && this.props.onFile() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 'Save file',
											onClick: 	(function() { this.props.onSave && this.props.onSave() }).bind(this)
										}
									}
								]
							}
						]
					},
					{
						type: 'li',
						props: {
							className: 	'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'Edit'
								}
							},
							{
								type: 'ul',
								props: {
									className: 'dropdown'
								},
								children: [
									{
										type: 'li',
										props: {
											innerHTML: 	'Undo',
											onClick: 	(function() { this.props.onUndo && this.props.onUndo() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'Redo',
											onClick: 	(function() { this.props.onRedo && this.props.onRedo() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											className: 'separator'
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'Select all',
											onClick: 	(function() { this.props.onSelectAll && this.props.onSelectAll() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'Format code',
											onClick: 	(function() { this.props.onFormat && this.props.onFormat() }).bind(this)
										}
									}
								]
							}
						]
					},
					{
						type: 'li',
						props: {
							className: 	'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'Find'
								}
							},
							{
								type: 'ul',
								props: {
									className: 'dropdown'
								},
								children: [
									{
										type: 'li',
										props: {
											innerHTML: 	'Find',
											onClick: 	(function() { this.props.onFind && this.props.onFind() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'Find next',
											onClick: 	(function() { this.props.onFindNext && this.props.onFindNext() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'Find previous',
											onClick: 	(function() { this.props.onFindPrev && this.props.onFindPrev() }).bind(this)
										}
									}
								]
							}
						]
					},
					{
						type: 'li',
						props: {
							className: 	'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'Run',
								}
							},
							{
								type: 'ul',
								props: {
									className: 'dropdown'
								},
								children: [
									{
										type: 'li',
										props: {
											innerHTML: 'Run'
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 'Stop'
										}
									}
								]
							}
						]
					},
					{
						type: 'li',
						props: {
							className: 	'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'Setup',
								}
							},
							{
								type: 'ul',
								props: {
									className: 'dropdown'
								},
								children: [
									{
										type: 'li',
										props: {
											innerHTML: 	'Motors',
											onClick: 	(function() { this.props.onMotors && this.props.onMotors() }).bind(this)
										}
									},
									{
										type: 'li',
										props: {
											innerHTML: 	'Sensors',
											onClick: 	(function() { this.props.onSensors && this.props.onSensors() }).bind(this)
										}
									}
								]
							}
						]
					},
					{
						type: 'li',
						props: {
							className: 	'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'View',
								}
							},
							{
								type: 'ul',
								props: {
									className: 'dropdown'
								},
								children: [
									{
										type: 'li',
										props: {
											innerHTML: 'Large output'
										}
									}
								]
							}
						]
					},
					{
						type: 'li',
						props: {
							className: 'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 'Examples',
									onClick: 	(function() { this.props.onExamples && this.props.onExamples() }).bind(this)
								}
							}
						]
					}
				]
			});
		}
	});
