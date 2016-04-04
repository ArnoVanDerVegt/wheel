var CodeMirrorComponent = React.createClass({
		getInitialState: function() {
			return {
				left: 		360,
				small: 		false,
				console: 	true,
				readOnly: 	false,
				highlight: 	{}
			};
		},

		createCodeMirror: function(textarea, value) {
			var grammar = mvmGrammar;
				lang 	= 'mvm';

			if (this._filename) {
				var filename = this._filename;
				if ((filename.substr(-5) === '.mvmp') || (filename.substr(-4) === '.mvm')) {
					grammar = mvmGrammar;
					lang 	= 'mvm';
				} else if (filename.substr(-4) === '.rgf') {
					grammar = rgfGrammar;
					lang 	= 'rgf';
				}
			}

			var mode = CodeMirrorGrammar.getMode(grammar);

			CodeMirror.defineMode(lang, mode);
			mode.supportGrammarAnnotations = true;
			CodeMirror.registerHelper('lint', lang, mode.linter);
			mode.supportCodeFolding = true;
			CodeMirror.registerHelper('fold', mode.foldType, mode.folder);
			// enable autocomplete, have a unique cmd to not interfere with any default autocompletes
			var autocomplete_cmd = 'autocomplete_grammar_' + lang;
			mode.supportAutoCompletion = true;
			mode.autocompleter.options =  {prefixMatch:true, caseInsensitiveMatch:false};
			CodeMirror.commands[autocomplete_cmd] = function(cm) {
				CodeMirror.showHint(cm, mode.autocompleter);
			};

			var editor = CodeMirror.fromTextArea(
					textarea,
					{
						mode: 			lang,
						lineNumbers: 	true,
						indentUnit: 	4,
						indentWithTabs: false,
						extraKeys: 		{'Ctrl-Space': autocomplete_cmd, 'Ctrl-L': 'toggleComment'},
						gutters: 		['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-guttermarker'],
						foldGutter: 	true,
						lint: 			true,
						readOnly: 		this.state.readOnly
					}
				);

			editor.setSize(null, '100%');
/*
			editor.addLineClass(6, 'background', 'line-step');

			var div = document.createElement('div');
			div.style.position = 'relative';
			div.style.left = '-50px';
			div.style.color = 'white';

			var span = document.createElement('span');
			span.className = 'mdi mdi-arrow-right-bold';
			div.appendChild(span);

			editor.setGutterMarker(6, 'CodeMirror-guttermarker', div);
*/
			editor.setValue(value);

			this._allowPublish = true;
			editor.on(
				'change',
				function() {
					this._allowPublish && this.props.onChange && this.props.onChange();
				}.bind(this)
			);

			this._editor = editor;
		},

		componentDidMount: function() {
			this.createCodeMirror(this.refs.textarea, this.props.defaultValue || this.props.value || '');
		},

		componentDidUpdate: function() {
			if (this._editor) {
				var value = this._editor.getValue();
				this._editor.toTextArea();
				this.createCodeMirror(this.refs.textarea, value);
				setTimeout(
					function() {
						this._editor.focus();


					var highlight = this.state.highlight;
					for (var lineNumber in highlight) {
						lineNumber = parseInt(lineNumber, 10);
						this._editor.removeLineClass(lineNumber, 'background', highlight[lineNumber].className || 'line-error');
						this._editor.addLineClass(lineNumber, 'background', highlight[lineNumber].className || 'line-error');
					}

					}.bind(this),
					50
				);
			}
		},

		componentWillUnmount: function() {
			this._editor && this._editor.toTextArea();
		},

		render: function() {
			//React.createElement('textarea', {ref: 'textarea', defaultValue: 'code'})
			return utilsReact.fromJSON({
				props: {
					className: 'editor' + (this.state.console ? ' show-console' : '') + (this.state.small ? ' small' : ' large'),
					style: {
						left: this.state.left + 'px'
					}
				},
				children: [
					{
						type: 'textarea',
						props: {
							ref: 			'textarea',
							defaultValue: 	'code'
						}
					}
				]
			});
		},

		highlightLine: function(lineNumber, className) {
			var state = this.state;
			state.highlight[lineNumber] = { className: className || 'line-error' };
			this._editor && this._editor.addLineClass(lineNumber, 'background', className || 'line-error');
		},

		getCode: function() {
			return this._editor.getValue();
		},

		setCode: function(code, filename) {
			this._filename 		= filename;
			this._allowPublish 	= false;
			this._editor.setValue(code);
			this._allowPublish 	= true;
		},

		setHighlight: function(highlight) {
			var state 	= this.state,
				same 	= true;
			if (Object.keys(highlight).length === Object.keys(state.highlight).length) {
				for (var i in highlight) {
					if (!state.highlight[i]) {
						same = false;
						break;
					} else if (state.highlight[i].className !== highlight[i].className) {
						same = false;
						break;
					}
				}
			} else {
				same = false;
			}
			if (!same) {
				this.state.highlight = highlight;
				this.setState(this.state);
			}
		},

		setLeft: function(left) {
			var state = this.state;
			state.left = left;
			this.setState(state);
		},

		setSmall: function() {
			var state = this.state;
			state.small = true;
			this.setState(state);
		},

		setLarge: function() {
			var state = this.state;
			state.small = false;
			this.setState(state);
		},

		setReadOnly: function(readOnly) {
			var state = this.state;
			state.readOnly = readOnly;
			this.setState(state);
		},

		setConsole: function(console) {
			var state = this.state;
			state.console = console;
			this.setState(state);
		},

		selectAll: function() {
			this._editor && this._editor.execCommand('selectAll');
		},

		find: function() {
			this._editor && this._editor.execCommand('find');
		},

		findNext: function() {
			this._editor && this._editor.execCommand('findNext');
		},

		findPrev: function() {
			this._editor && this._editor.execCommand('findPrev');
		},

		undo: function() {
			this._editor && this._editor.execCommand('undo');
		},

		redo: function() {
			this._editor && this._editor.execCommand('redo');
		},

		formatCode: function() {
			var lines = this.getCode().split("\n");
			for (var i = 0; i < lines.length; i++) {
				var s 		= lines[i],
					line 	= s.trim();

				if (line.substr(0, 4) === 'proc') {
				} else if (line.substr(0, 4) === 'endp') {
				} else if (line[0] === '#') {
				} else if (line.indexOf(':') !== -1) {
					s = line;
				} else if (line.indexOf('(') !== -1) {
					s = '    ' + line;
				} else {
					var j = line.indexOf(' '),
						k = line.indexOf("\t"),
						l;

					if ((j === -1) && (k === -1)) {
						s = '    ' + line;
					} else {
						if (j === -1) {
							l = k;
						} else if (k === -1) {
							l = j;
						} else {
							l = Math.min(j, k);
						}
						s 		= '    ' + (line.substr(0, l) + '       ').substr(0, 8);
						line 	= line.substr(l - line.length).trim();
						j 		= line.indexOf(',');
						if (j === -1) {
							s += line;
						} else {
							var p = line.substr(0, j) + ',';
							while (p.length < 24) {
								p += ' ';
							}
							s += p;
							line = line.substr(j + 1 - line.length).trim();
							s += line;
						}
					}
				}

				j = s.indexOf(';');
				if (j !== -1) {
					k = s.trim().indexOf(';');
					if (k === 0) {
						s = s.trim();
						s = '; ' + s.substr(2 - s.length).trim();
					} else {
						var comment = s.substr(j + 1 - s.length).trim();
						s = s.substr(0, j);
						while (s.length && (s.substr(-1) === ' ')) {
							s = s.substr(0, s.length - 1);
						}
						while (s.length < 44) {
							s += ' ';
						}
						s += '; ' + comment;
					}
				}

				lines[i] = s;
			}

			var result = lines.join("\n");
			this.setCode(result);
			return result;
		}
	});
