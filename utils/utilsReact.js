var utilsReact = {
		fromJSON: function(json) {
			var children = [];
			if (typeof json === 'string') {
				return React.createElement('span', {}, json);
			}
			if (json.children) {
				for (var i = 0; i < json.children.length; i++) {
					json.children[i] && children.push(utilsReact.fromJSON(json.children[i]));
				}
			}
			if (json.props) {
				if ('innerHTML' in json.props) {
					children.push(json.props.innerHTML);
					json.props._innerHTML = json.props.innerHTML;
					delete json.props.innerHTML;
				} else if ('_innerHTML' in json.props) {
					children.push(json.props._innerHTML);
				}
			}
			var args = [json.type || 'div', json.props || {}].concat(children);
			return React.createElement.apply(React, args);
		}
	};