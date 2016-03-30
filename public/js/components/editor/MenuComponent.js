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
