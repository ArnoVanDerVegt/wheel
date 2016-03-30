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
											innerHTML: 'Close file'
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
							className: 'menu-item'
						},
						children: [
							{
								type: 'span',
								props: {
									className: 	'menu-item-title',
									innerHTML: 	'Motors',
									onClick: 	(function() { this.props.onMotors && this.props.onMotors() }).bind(this)
								}
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
									innerHTML: 	'Sensors',
									onClick: 	(function() { this.props.onSensors && this.props.onSensors() }).bind(this)
								}
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
