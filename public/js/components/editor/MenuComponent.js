(function() {
    var wheel = require('../../utils/base.js');

	wheel(
		'components.editor.MenuComponent',
		React.createClass({
			createCallback: function(callback) {
				var props = this.props;
				return function() {
					props.callbacks && props.callbacks[callback] && props.callbacks[callback]();
				};
			},

			render: function() {
				var props 			= this.props,
					projectName 	= '',
					projectTitle 	= '';

				if (props.activeProject) {
					projectName 	= props.activeProject.name;
					projectTitle 	= props.activeProject.filename;
				} else {
					projectName = 'No project selected';
				}

				return 	utilsReact.fromJSON({
					props: {
						className: 'header'
					},
					children: [
						{
							type: 'ul',
							props: {
								className: 	'menu',
							},
							children: [
								{
									type: 'li',
									props: {
										className: 'active-project'
									},
									children: [
										{
											type: 'span',
											props: {
												innerHTML: 	projectName,
												title: 		projectTitle,
												onClick: 	this.createCallback('onShowProject')
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
												innerHTML: 	'File'
											}
										},
										{
											type: 'ul',
											props: {
												className: 'dropdown box-shadow'
											},
											children: [
												{
													type: 'li',
													props: {
														innerHTML: 'New...',
														onClick: 	this.createCallback('onNew')
													}
												},
												{
													type: 'li',
													props: {
														innerHTML: 'Save file',
														onClick: 	this.createCallback('onSave')
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
												className: 'dropdown box-shadow'
											},
											children: [
												{
													type: 'li',
													props: {
														innerHTML: 	'Undo',
														onClick: 	this.createCallback('onUndo')
													}
												},
												{
													type: 'li',
													props: {
														innerHTML: 	'Redo',
														onClick: 	this.createCallback('onRedo')
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
														onClick: 	this.createCallback('onSelectAll')
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
														innerHTML: 	'Format code',
														onClick: 	this.createCallback('onFormatCode')
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
												className: 'dropdown box-shadow'
											},
											children: [
												{
													type: 'li',
													props: {
														innerHTML: 	'Find',
														onClick: 	this.createCallback('onFind')
													}
												},
												{
													type: 'li',
													props: {
														innerHTML: 	'Find next',
														onClick: 	this.createCallback('onFindNext')
													}
												},
												{
													type: 'li',
													props: {
														innerHTML: 	'Find previous',
														onClick: 	this.createCallback('onFindPrev')
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
												className: 'dropdown box-shadow'
											},
											children: [
												{
													type: 'li',
													props: {
														innerHTML: 'Run',
														onClick: 	this.createCallback('onRun')
													}
												},
												{
													type: 'li',
													props: {
														innerHTML: 'Stop',
														onClick: 	this.createCallback('onStop')
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
												className: 'dropdown box-shadow'
											},
											children: [
												{
													type: 'li',
													props: {
														innerHTML: 	'Motors',
														onClick: 	this.createCallback('onMotors')
													}
												},
												{
													type: 'li',
													props: {
														innerHTML: 	'Sensors',
														onClick: 	this.createCallback('onSensors')
													}
												}
											]
										}
									]
								}
							]
						}
					]
				});
			}
		})
	);
})();