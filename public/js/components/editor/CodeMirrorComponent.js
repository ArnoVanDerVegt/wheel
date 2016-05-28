(function() {
	var CodeMirrorHintComponent = React.createClass({
			getInitialState: function() {
				return {
					x: 			0,
					y: 			0,
					visible: 	false,
					label: 		'',
					title: 	null
				}
			},

			setInfo: function(info) {
				var state = this.state;
				state.type 			= info.type || false;
				state.title 		= info.title;
				state.x 			= info.x;
				state.y 			= info.y;
				state.filename 		= info.filename;
				state.lineNumber 	= info.lineNumber;
				state.typeInfo 		= info.typeInfo || false;
				state.visible 		= true;
				this.setState(state);
			},

			hide: function() {
				var state = this.state;
				if (state.visible) {
					this._hintTimeout && clearTimeout(this._hintTimeout);
					this._hintTimeout	= null;
					state.visible 		= false;
					this.setState(state);
				}
			},

			show: function(info) {
				this._hintTimeout && clearTimeout(this._hintTimeout);
				this._hintTimeout = setTimeout(
					function() {
						this.setInfo(info);
					}.bind(this),
					400
				);
			},

			render: function() {
				var state = this.state;
				return utilsReact.fromJSON({
					props: {
						id: 'codeHint',
						style: 	{
							display: 	state.visible ? 'block' : 'none',
							left: 		state.x + 'px',
							top: 		state.y + 'px'
						}
					},
					children: [
						{
							props: {
								className: 'code-hint-title'
							},
							children: [
								state.type ?
									{
										type: 	'span',
										props: 	{
											innerHTML: state.type
										}
									} :
									null,
								{
									type: 	'strong',
									props: 	{
										innerHTML: state.title
									}
								}
							]
						},
						{
							props: {
								className: 	'code-hint-position',
								innerHTML: 	state.filename + ':' + state.lineNumber
							}
						},
					].concat(
						state.typeInfo ?
						[
							{
								props: {
									className: 	'code-hint-title'
								},
								children: [
									{
										type: 'span',
										props: {
											innerHTML: 	state.typeInfo.type
										}
									},
									{
										type: 'strong',
										props: {
											innerHTML: 	state.typeInfo.title
										}
									}
								]
							},
							{
								props: {
									className: 	'code-hint-position',
									innerHTML: 	state.typeInfo.filename + ':' + state.typeInfo.lineNumber
								}
							}
						] :
						[]
					)
				});
			}
		});

	wheel(
		'components.editor.CodeMirrorComponent',
		React.createClass({
			getInitialState: function() {
				this._currentTarget = null;
				return {
					left: 		360,
					small: 		false,
					console: 	true,
					readOnly: 	false,
					highlight: 	{}
				};
			},

			getActiveWheelGrammar: function() {
				var result = wheelGrammar;

				var compilerData 	= this.props.compiler.getCompilerData(),
					structList 		= compilerData.getStructList(),
					labelList 		= compilerData.getLabelList(),
					lex 			= wheelGrammar['Lex'],
					tokens;

				tokens 						= lex.struct_variable.tokens;
				tokens.length 				= 1;
				lex.struct_variable.tokens 	= tokens.concat(Object.keys(structList));

				tokens 						= lex.label_param.tokens;
				tokens.length 				= 1;
				lex.label_param.tokens 		= tokens.concat(Object.keys(labelList));

				return result;
			},

			onMouseMove: function(event) {
				var target = event.target;
				if (this._currentTarget === target) {
					return;
				}
				this._currentTarget = target;

				var compilerData 	= this.props.compiler.getCompilerData(),
					x 				= event.pageX - this.state.left + 8,
					y 				= event.pageY - 80,
					className 		= target.className.trim(),
					innerHTML 		= target.innerHTML.trim(),
					codeHint 		= this.refs.codeHint,
					info 			= null;

				if (innerHTML.length) {
					switch (className) {
						case 'cm-label':
							var labelList = compilerData.getLabelList();
							if (innerHTML in labelList) {
								var label = labelList[innerHTML];
								info = {
									title: 		innerHTML,
									filename: 	label.filename,
									lineNumber: label.lineNumber
								};
							}
							break;

						case 'cm-identifier':
							var globalList = compilerData.getGlobalList();
							if (innerHTML in globalList) {
								var global = globalList[innerHTML];
								info = {
									title: 		innerHTML,
									filename: 	global.filename,
									lineNumber: global.lineNumber
								};
								var struct = global.struct;
								if (struct) {
									info.typeInfo = {
										type: 		'struct',
										title: 		struct.name,
										filename: 	struct.filename,
										lineNumber: struct.lineNumber
									}
								} else {
									info.type = 'number';
								}
							}
							break;
					}
				}

				if (info) {
					info.x 		= x;
					info.y 		= y;
					info.target = target;
					codeHint.show(info);
				} else {
					codeHint.hide();
				}
			},

			createCodeMirror: function(textarea, value) {
				var grammar = wheelGrammar;
					lang 	= 'wheel';

				if (this._filename) {
					var filename = this._filename;
					if ((filename.substr(-5) === '.whlp') || (filename.substr(-4) === '.whl')) {
						grammar = this.getActiveWheelGrammar();
						lang 	= 'whl';
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
					console.log(cm);
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
				return utilsReact.fromJSON({
					props: {
						className: 'box-shadow editor' + (this.state.console ? ' show-console' : '') + (this.state.small ? ' small' : ' large'),
						style: {
							left: this.state.left + 'px'
						},
						onMouseMove: this.onMouseMove
					},
					children: [
						{
							type: 'textarea',
							props: {
								ref: 			'textarea',
								defaultValue: 	'code',
							}
						},
						{
							type: 	CodeMirrorHintComponent,
							props: 	{
								ref: 'codeHint'
							}
						}
					]
				});
			},

			highlightLine: function(lineNumber, className, clear) {
				var state = this.state;
				if (clear) {
					for (var i in state.highlight) {
						var highlight = state.highlight[i];
						if (highlight.className && (highlight.className.indexOf(className) !== -1)) {
							delete state.highlight[i];
						}
					}
				}
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
				if (same) {
					return false;
				}
				this.state.highlight = highlight;
				this.setState(this.state);
				return true;
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

			update: function() {
				this.setState(this.state);
			},

			formatCode: function() {
				var lines 		= this.getCode().split("\n"),
					inBlock 	= 0,
					blockIndent = function() {
						var s = '';
						for (var j = 0; j < inBlock; j++) {
							s += '    ';
						}
						return s;
					};

				for (var i = 0; i < lines.length; i++) {
					var s 		= lines[i],
						line 	= s.trim();

					if ((line.substr(0, 4) === 'proc') || (line.substr(0, 6) === 'struct')) {
						s = blockIndent() + line;
						var j = line.indexOf(' ');
						(i === -1) || (s = blockIndent() + line.substr(0, j).trim() + ' ' + line.substr(j - line.length).trim());
						inBlock++;
					} else if ((line.substr(0, 4) === 'endp') || (line.substr(0, 4) === 'ends')) {
						inBlock--;
						s = blockIndent() + line.trim();
					} else if ((line.substr(0, 6) === 'number') || (line.substr(0, 6) === 'string') || (line.split(',') > 2)) {
						var j 		= line.indexOf(' '),
							type 	= line.substr(0, j),
							params 	= line.substr(j - line.length).split(',');

						for (var j = 0; j < params.length; j++) {
							params[j] = params[j].trim();
						}
						while (type.length < 8) {
							type += ' ';
						}
						s = blockIndent() + type + ' ' + params.join(', ');
					} else if (line[0] === '#') {
						s = line.trim();
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

							var p = line.substr(0, l);
							while (p.length < 8) {
								p += ' ';
							}
							p += ' ';

							s 		= (inBlock ? '    ' : '') + p;
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
		})
	);
})();