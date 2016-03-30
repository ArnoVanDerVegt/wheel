var examples = [
		{
			group: 'Variables',
			examples: [
				{
					title: 		'Numbers',
					filename: 	'Number example',
					code: 		[
						'	number n',
						'	set 	n, 14',
						'	print 	n'
					].join("\n")
				}
			]
		},
		{
			group: 'Conditions',
			examples: [
				{
					title: 		'Equal',
					filename: 	'Equal example',
					code: 		[
						'	number n',
						'	set 	n, 1',
						'	cmp 	n, 0',
						'	je 	nEquals0',
						'	print 	"n is not 0"',
						'nEquals0:'
					].join("\n")
				},
				{
					title: 		'Not equal',
					filename: 	'Not equal example',
					code: [
						'	number n',
						'	set 	n, 1',
						'	cmp 	n, 0',
						'	jne 	nNotEqual0',
						'	print 	"n is 0"',
						'nNotEqual0:'
					].join("\n")
				}
			]
		},
		{
			group: 'Loops',
			examples: [
				{
					title: 		'Infinite loop',
					filename: 	'Infinite loop example',
					code: 		[
						'loopForever:',
						'	; this code will repeat...',
						'	jmp loopForever'
					].join("\n")
				},
				{
					title: 		'For count loop',
					filename: 	'For count loop example',
					code: 		[
						'	number 	n',
						'	set 	n, 0',
						'lessThan10:',
						'	; this code will repeat 10 times...',
						'	inc		n',
						'	cmp		n, 10',
						'	jl	 	lessThan10'
					].join("\n")
				},
			]
		},
		{
			group: 'Procedures',
			examples: [
				{
					title: 		'Procedure',
					filename: 	'Procedure example',
					code: 		[
						'proc demoProcedure()',
						'	print "demo"',
						'endp',
						'',
						'demoProcedure()'
					].join("\n")
				},
			]
		}
	];

var ExamplesDialog = React.createClass({
		getInitialState: function() {
			return {
				visible: 	false,
				title: 		'Examples'
			};
		},

		show: function(onShowExample) {
			this.state.visible 			= true;
			this.state.onShowExample 	= onShowExample;
			this.setState(this.state);
		},

		hide: function() {
			this.state.visible = false;
			this.setState(this.state);
		},

		onClose: function() {
			this.setState({
				visible: false
			});
		},

		onShowExample: function(example) {
			this.state.onShowExample && this.state.onShowExample(example);
			this.hide();
		},

		render: function() {
			var exampleChildren = [];

			for (var i = 0; i < examples.length; i++) {
				var exampleChild = {
						type: 'ul',
						children: [
							{
								type: 'li',
								children: [
									{
										type: 'h3',
										props: {
											innerHTML: examples[i].group
										}
									},
									{
										type: 'ul',
										children: []
									}
								]
							}
						]
					};
				for (var j = 0; j < examples[i].examples.length; j++) {
					(function(example) {
						exampleChild.children[0].children[1].children.push({
							type: 'li',
							children: [
								{
									type: 'span',
									props: {
										className: 	'example-title',
										innerHTML: 	example.title,
										onClick: 	(function() {
											this.onShowExample(example);
										}).bind(this)
									}
								}
							]
						});
					}).call(this, examples[i].examples[j]);
				}
				exampleChildren.push(exampleChild);
			}

			return 	utilsReact.fromJSON(
				createDialog(
					this,
					'examples',
					'mdi-cube-outline',
					[
						{
							props: {
								className: 'examples-content',
							},
							children: exampleChildren
						}
					]
				)
			);
		}
	});
