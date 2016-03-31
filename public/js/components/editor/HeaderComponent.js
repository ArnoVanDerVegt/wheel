var HeaderComponent = React.createClass({
		render: function() {
			return utilsReact.fromJSON({
				props: {
					className: 'header'
				},
				children: [
					{
						type: MenuComponent,
						props: {
							callbacks: this.props.callbacks
						}
					}
				]
			});
		}
	});
