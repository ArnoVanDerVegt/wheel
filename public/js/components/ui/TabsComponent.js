var TabsComponent = React.createClass({
		getInitialState: function() {
			var props = this.props;
			return {
				activePage: ('activePage' in props) ? props.activePage : 0
			};
		},

		onSelectPage: function(activePage) {
			var state = this.state;
			state.activePage = activePage;
			this.setState(state);
		},

		render: function() {
			var state 	= this.state,
				props 	= this.props,
				pages	= props.pages || [],
				tabs 	= {
					type: 'ul',
					props: {
						className: 'tabs-titles'
					},
					children: []
				},
				content = {
					props: {
						className: 'tabs-content'
					},
					children: []
				};

			for (var i = 0; i < pages.length; i++) {
				(function(pageIndex, page) {
					tabs.children.push({
						type: 'li',
						props: {
							className: 	'tab' + (state.activePage === pageIndex ? ' active' : ''),
							innerHTML: 	page.title || ('page' + i),
							onClick: 	(function() { this.onSelectPage(pageIndex); }).bind(this)
						}
					});
				}).call(this, i, pages[i]);
				content.children.push({
					props: {
						className: 'tab-content' + (state.activePage === i ? ' active' : ''),
					},
					children: pages[i].content
				});
			}

			return 	utilsReact.fromJSON({
				props: {
					className: 'tabs'
				},
				children: [tabs, content]
			});
		}
	});
