/*
function highlightLine(lineNumber) {

    //Line number is zero based index
    var actualLineNumber = lineNumber - 1;

    //Select editor loaded in the DOM
    var myEditor = $("#body_EditorSource .CodeMirror");

    //Write the item to the console window, for debugging
    console.log(myEditor);

    //Select the first item (zero index) just incase more than one found & get the CodeMirror JS object
    var codeMirrorEditor = myEditor[0].CodeMirror;

    //Write the item to the console window, for debugging
    console.log(myEditor[0].CodeMirror);

    //Set line CSS class to the line number & affecting the background of the line with the css class of line-error
    codeMirrorEditor.setLineClass(actualLineNumber, 'background', 'line-error');
}
*/

var CodeMirrorComponent = React.createClass({
		getInitialState: function() {
			return {
				small: 		false,
				readOnly: 	false
			};
		},

		createCodeMirror: function(textarea, value) {
			var grammar = ev3_grammar,
				lang 	= 'ev3'
				mode 	= CodeMirrorGrammar.getMode(grammar);

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
			editor.addLineClass(6, 'background', 'line-step');

			var div = document.createElement('div');
			div.style.position = 'relative';
			div.style.left = '-50px';
			div.style.color = 'white';

			var span = document.createElement('span');
			span.className = 'mdi mdi-arrow-right-bold';
			div.appendChild(span);

			editor.setGutterMarker(6, 'CodeMirror-guttermarker', div);
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
					}.bind(this),
					50
				);
			}
		},

		componentWillUnmount: function() {
			this._editor && this._editor.toTextArea();
		},

		render: function() {
			return React.createElement(
				'div',
				{
					className: 'editor' + (this.state.small ? ' small' : ' large')
				},
				React.createElement('textarea', {ref: 'textarea', defaultValue: 'code'})
			);
		},

		getCode: function() {
			return this._editor.getValue();
		},

		setCode: function(code) {
			this._allowPublish = false;
			this._editor.setValue(code);
			this._allowPublish = true;
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
		}
	});
