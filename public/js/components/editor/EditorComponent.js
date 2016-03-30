var EditorComponent = React.createClass({
		getInitialState: function() {
			this.props.files.on(
				'Loaded',
				function() {
					this.setState(this.state);
				}.bind(this)
			);
			return {
				small: 				false,
				activeFileIndex: 	0
			}
		},

		getActiveFile: function() {
			var state 	= this.state,
				files 	= this.props.files;
			return files.getFile(state.activeFileIndex);
		},

		updateFiles: function() {
			var files = this.refs.files;
			files.setState(files.state);
		},

		onRun: function() {
			var refs 			= this.refs,
				props 			= this.props,
				compiler		= props.compiler,
				vm 				= props.vm,
				files 			= props.files,
				filename,
				outputCommands	= null;

			try {
				var preProcessor = new PreProcessor({files: files});

				if (files.exists('test')) {
					includes 		= preProcessor.process('test');
					outputCommands 	= compiler.compile(includes);

					vm.setEV3Screen(refs.output.refs.screen.getEV3Screen());
					vm.run(outputCommands);
				}
			} catch (error) {
				console.error(error);
			}
		},

		onFile: function() {
			var state 	= this.state,
				files 	= this.props.files,
				file 	= this.getActiveFile(),
				newFile = {
					name: files.newName(file.getPath() + '/file', '.asm'),
					data: 'number a',
					open: true
				},
				index 	= 1,
				found 	= true,
				name;

			file && file.setData(this.refs.codeMirror.getCode());

			files.createFile(newFile);
			state.activeFileIndex = files.exists(newFile.name);
			this.refs.codeMirror.setCode(newFile.data);

			this.setState(state);
		},

		onSave: function() {
			var file = this.getActiveFile();
			if (file) {
				file.setData(this.refs.codeMirror.getCode(), true);
				file.save();
				this.updateFiles();
			}
		},

		onFormat: function() {
			var file = this.getActiveFile();
			if (file) {
				file.setData(this.refs.codeMirror.formatCode());
				this.updateFiles();
			}
		},

		onMotors: function() {
			var output = this.refs.output;
			this.refs.motorsDialog.show(
				output.state.motors,
				output.state.motorProperties,
				output.setMotorInfo
			);
		},

		onSensors: function() {
			this.refs.sensorsDialog.show();
		},

		onExamples: function() {
			this.refs.examplesDialog.show((function(example) {
				this.openFile(example.filename, example.code, false);
			}).bind(this));
		},

		onSmall: function() {
			var state = this.state;
			state.small = true;
			this.setState(state);
			this.refs.codeMirror.setLarge();
		},

		onLarge: function() {
			var state = this.state;
			state.small = false;
			this.setState(state);
			this.refs.codeMirror.setSmall();
		},

		onSelectFile: function(filename) {
			var codeMirror 	= this.refs.codeMirror,
				state 		= this.state,
				files 		= this.props.files,
				index 		= files.exists(filename),
				file 		= files.getFile(state.activeFileIndex),
				changed;

			file.getDir() || file.setData(this.refs.codeMirror.getCode(), true);
			changed 				= (state.activeFileIndex !== index);
			state.activeFileIndex 	= index;
			file 					= files.getFile(index);

			if (file.getDir()) {
				changed || file.setOpen(!file.getOpen());
				codeMirror.setReadOnly(true);
				codeMirror.setCode('');
				this.setState(this.state);
			} else {
				file.getData(function(data) {
					codeMirror.setReadOnly(false);
					codeMirror.setCode(data);
					this.setState(this.state);
				}.bind(this));
			}
		},

		onDeleteFile: function(index) {
			var state 			= this.state,
				files 			= this.props.files,
				file 			= files.getFile(index),
				confirmDialog 	= this.refs.confirmDialog;
			confirmDialog.setState({
				visible: 	true,
				icon: 		'mdi-alert',
				content: 	'Are you sure you want to delete the file "' + file.getName() + '"?',
				title: 		'Delete file',
				onConfirm: 	function() {
					files.removeFile(
						file.getName(),
						function() {
							state.activeFileIndex 	= 0;
							file 					= files.getFile(0);
							if (file) {
								file.getData(function(data) {
									this.refs.codeMirror.setCode(data);
									this.setState(state);
								}.bind(this));
							}
						}.bind(this)
					);
				}.bind(this)
			});
		},

		onDeleteDir: function(index) {
			var state 			= this.state,
				files 			= this.props.files,
				file 			= files.getFile(index),
				confirmDialog 	= this.refs.confirmDialog;
			confirmDialog.setState({
				visible: 	true,
				icon: 		'mdi-alert',
				content: 	'Are you sure you want to delete the directory "' + file.getName() + '"?',
				title: 		'Delete directory',
				onConfirm: 	function() {
					files.removeDir(
						file.getName(),
						function() {
							state.activeFileIndex 	= 0;
							file 					= files.getFile(0);
							if (file) {
								file.getData(function(data) {
									this.refs.codeMirror.setCode(data);
									this.setState(state);
								}.bind(this));
							}
						}.bind(this)
					);
				}.bind(this)
			});
		},

		onRenameFile: function(index) {
			var state 			= this.state,
				files 			= this.props.files,
				file 			= files.getFile(index),
				name 			= file.getName(),
				dirname,
				filename,
				promptDialog 	= this.refs.promptDialog,
				i;

			i 			= name.lastIndexOf('/');
			dirname 	= name.substr(0, i + 1);
			filename 	= name.substr(i + 1 - name.length);

			promptDialog.show(
				'Rename file',
				'Rename "' + name + '" to:',
				'Enter filename...',
				filename,
				function(value) {
					file.setName(dirname + value, this.updateFiles.bind(this));
				}.bind(this)
			);
		},

		onChange: function() {
			var file = this.getActiveFile();
			if (file && !file.getChanged()) {
				file.setChanged(true);
				this.updateFiles();
			}
		},

		openFile: function(filename, data, canRename) {
			var state 	= this.state,
				files 	= this.props.files,
				file 	= files.getFile(state.activeFileIndex),
				index 	= files.exists(filename);

			file.setData(this.refs.codeMirror.getCode());

			if (index === false) {
				var newFile = {
						name: 		filename,
						canRename: 	canRename,
						data: 		data,
						open: 		true
					};
				files.createFile(newFile);
				state.activeFileIndex = files.getLength() - 1;
				this.setState(this.state);
			} else {
				state.activeFileIndex = index;
				this.setState(this.state);
			}

			file = files.getFile(state.activeFileIndex);
			if (file) {
				file.getData(function(data) {
					this.refs.codeMirror.setCode(data);
				}.bind(this));
			}
		},

		render: function() {
			var files 	= this.props.files,
				file 	= files.getFile(this.state.activeFileIndex),
				data 	= '';

			if (file) {
				if (file.getHasData()) {
					data = file.getData();
				} else {
					file.getData(function(data) {
						this.refs.codeMirror.setCode(data);
					}.bind(this));
				}
			}

			return utilsReact.fromJSON({
				props: {
					id: 'main'
				},
				children: [
					{
						type: HeaderComponent,
						props: {
							onFile: 	this.onFile,
							onSave: 	this.onSave,
							onFormat: 	this.onFormat,
							onMotors: 	this.onMotors,
							onSensors: 	this.onSensors,
							onExamples: this.onExamples
						}
					},
					{
						type: FilesComponent,
						props: {
							ref: 				'files',
							activeFileIndex: 	this.state.activeFileIndex,
							files: 				files,
							onSelectFile: 		this.onSelectFile,
							onDeleteFile: 		this.onDeleteFile,
							onDeleteDir: 		this.onDeleteDir,
							onRenameFile: 		this.onRenameFile
						}
					},
					{
						type: CodeMirrorComponent,
						props: {
							defaultValue: 	data,
							ref: 			'codeMirror',
							onChange: 		this.onChange
						}
					},
					{
						type: OutputComponent,
						props: {
							ref: 		'output',
							onRun: 		this.onRun,
							onSmall: 	this.onSmall,
							onLarge: 	this.onLarge,
							motors: 	this.props.motors
						}
					},

					{
						type: ConfirmDialog,
						props: {
							ref: 'confirmDialog'
						}
					},
					{
						type: MotorsDialog,
						props: {
							ref: 'motorsDialog'
						}
					},
					{
						type: SensorsDialog,
						props: {
							ref: 'sensorsDialog'
						}
					},
					{
						type: ExamplesDialog,
						props: {
							ref: 'examplesDialog'
						}
					},
					{
						type: PromptDialog,
						props: {
							ref: 'promptDialog'
						}
					},
				]
			});
		}
	});
