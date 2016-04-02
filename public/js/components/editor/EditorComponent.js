var EditorComponent = React.createClass({
		getInitialState: function() {
			this.props.files.on(
				'Loaded',
				function() {
					this.setState(this.state);
				}.bind(this)
			);
			return {
				small: 					false,
				console: 				false,
				activeFileIndex: 		0,
				activeProject: 			null
			}
		},

		getActiveFile: function() {
			var state 	= this.state,
				files 	= this.props.files;
			return files.getFile(state.activeFileIndex);
		},

		getMotorSettings: function() {
			var localStorage 	= LocalStorage.getInstance(),
				motorSettings 	= localStorage.get(
					'motorSettings',
					{
						motors: {
							motor1_A: 	true,
							motor1_B: 	true,
							motor1_C: 	true,
							motor1_D: 	true,
							motor2_A: 	false,
							motor2_B: 	false,
							motor2_C: 	false,
							motor2_D: 	false,
							motor3_A: 	false,
							motor3_B: 	false,
							motor3_C: 	false,
							motor3_D: 	false,
							motor4_A: 	false,
							motor4_B: 	false,
							motor4_C: 	false,
							motor4_D: 	false,
							motor1_1: 	false,
							motor1_2: 	false,
							motor2_1: 	false,
							motor2_2: 	false,
							motor3_1: 	false,
							motor3_2: 	false,
							motor4_1: 	false,
							motor4_2: 	false,
						},
						motorProperties: {
							type: 		true,
							position: 	true,
							target: 	true,
							power: 		true,
							speed: 		true,
							range: 		true
						}
					}
				);

			return motorSettings;
		},

		getSensorSettings: function() {
			var localStorage 	= LocalStorage.getInstance(),
				sensorSettings 	= localStorage.get(
					'sensorSettings',
					{
						sensor1: true,
						sensor2: true,
						sensor3: true,
						sensor4: true
					}
				);

			return sensorSettings;
		},

		updateFiles: function() {
			var files = this.refs.files;
			files.setState(files.state);
		},

		onShowProject: function() {
			if (this.state.activeProject === null) {
				return;
			}
			this.onSelectFile(this.state.activeProject.filename);
		},

		onRun: function() {
			if (this.state.activeProject === null) {
				var alertDialog = this.refs.alertDialog;
				alertDialog.setState({
					visible: 	true,
					icon: 		'mdi-alert',
					content: 	'There is no project selected yet. You can select a project by finding a .mvmp file in the project folders.',
					title: 		'Run - No project selected',
				});
				return;
			}

			var file = this.getActiveFile();
			if (file) {
				file.setData(this.refs.codeMirror.getCode(), true);
			}

			this.refs.console.clearMessages();

			var refs 			= this.refs,
				props 			= this.props,
				compiler		= props.compiler,
				vm 				= props.vm,
				files 			= props.files,
				activeProject 	= this.state.activeProject,
				path 			= activeProject.path,
				filename 		= activeProject.filename,
				outputCommands	= null;

			//try {
				var preProcessor = new PreProcessor({files: files});

				if (files.exists(filename)) {
					preProcessor.process(
						path,
						filename,
						function(includes) {
							try {
								outputCommands = compiler.compile(includes);
								this.refs.codeMirror.setHighlight({});
							} catch (error) {
								console.log('error', error);
								var index = files.exists(error.filename);
								if (index !== false) {
									var file = files.getFile(index),
										meta = file.getMeta();
									if (!('highlightLines' in meta)) {
										meta.highlightLines = {};
									}
									meta.highlightLines[error.lineNumber] = { className: 'line-error' };
								}

								this.onSelectFile(error.filename);

								this.refs.console.addError(error);

								outputCommands = null;
							}
							if (outputCommands !== null) {
								var compilerData = compiler.getCompilerData();
								this.refs.console.setGlobals(compilerData.getGlobalList());
								vm.setEV3Screen(refs.output.refs.screen.getEV3Screen());
								vm.run(outputCommands);
							}
						}.bind(this)
					);
				}
			//} catch (error) {
			//	console.error(error);
			//}
		},

		onNew: function() {
			var newDialog = this.refs.newDialog;
			newDialog.setState({
				visible: 	true,
				activeFile: this.getActiveFile(),
				onConfirm: 	function(filename) {
					var state 	= this.state,
						files 	= this.props.files,
						file 	= this.getActiveFile(),
						newFile = {
							name: filename,
							data: 'number a',
							open: true
						};

					file && file.setData(this.refs.codeMirror.getCode());

					files.createFile(newFile);
					state.activeFileIndex = files.exists(newFile.name);
					this.refs.codeMirror.setCode(newFile.data, filename);

					this.setState(state);


				}.bind(this)
			});
		},

		onSave: function() {
			var file = this.getActiveFile();
			if (file) {
				file.setData(this.refs.codeMirror.getCode(), true);
				file.save();
				this.updateFiles();
			}
		},

		onFormatCode: function() {
			var file = this.getActiveFile();
			if (file) {
				file.setData(this.refs.codeMirror.formatCode());
				this.updateFiles();
			}
		},

		onSelectAll: function() {
			this.refs.codeMirror.selectAll();
		},

		onFind: function() {
			this.refs.codeMirror.find();
		},

		onFindNext: function() {
			this.refs.codeMirror.findNext();
		},

		onFindPrev: function() {
			this.refs.codeMirror.findPrev();
		},

		onUndo: function() {
			this.refs.codeMirror.undo();
		},

		onRedo: function() {
			this.refs.codeMirror.redo();
		},

		onMotors: function() {
			var output 			= this.refs.output,
				motorSettings 	= this.getMotorSettings();
			this.refs.motorsDialog.show(output.setMotorInfo);
		},

		onSensors: function() {
			this.refs.sensorsDialog.show(this.refs.output.setMotorInfo);
		},

		onExamples: function() {
			this.refs.examplesDialog.show((function(example) {
				console.log('example.filename:', example.filename);
				this.openFile(example.filename);
			}).bind(this));
		},

		onSmall: function() {
			var state = this.state;
			state.small = true;
			this.setState(state);
			this.refs.codeMirror.setLarge();
			this.refs.console.setLarge();
		},

		onLarge: function() {
			var state = this.state;
			state.small = false;
			this.setState(state);
			this.refs.codeMirror.setSmall();
			this.refs.console.setSmall();
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
				codeMirror.setCode('', '');
				this.setState(this.state);
			} else {
				file.getData(function(data) {
					codeMirror.setReadOnly(false);
					codeMirror.setCode(data, file.getName());
					codeMirror.setHighlight(file.getMeta().highlightLines || {});
					var filename = file.getName();
					if (filename.substr(-5) == '.mvmp') {
						var lines 	= data.split("\n"),
							name 	= 'Project';
						for (var i = 0; i < lines.length; i++) {
							var line = lines[i].trim();
							if (line.substr(0, 8) === '#project') {
								line = line.substr(8 - line.length).trim();
								if (line[0] === '"') {
									var j 		= 1,
										name 	= '';
									while (j < line.length) {
										if (line[j] === '"') {
											break;
										}
										name += line[j++];
									}
								}
								break;
							}
						}

						state.activeProject = {
							path: 		file.getPath(),
							filename: 	filename,
							name: 		name
						}
					}
					this.setState(state);
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
							var refs = this.refs;
							state.activeFileIndex 	= 0;
							file 					= files.getFile(0);
							if (file) {
								if (file.getDir()) {
									refs.files.setState(refs.files.state);
									refs.codeMirror.setReadOnly(true);
								} else {
									file.getData(function(data) {
										refs.files.setState(refs.files.state);
										refs.codeMirror.setReadOnly(false);
										refs.codeMirror.setCode(data, file.getName());
									}.bind(this));
								}
							} else {
								refs.files.setState(refs.files.state);
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
									this.refs.codeMirror.setCode(data, file.getName());
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

		onShowError: function(filename, lineNumber) {
			this.onSelectFile(filename);
			this.refs.codeMirror.highlightLine(lineNumber);
		},

		onCloseConsole: function() {
			this.refs.codeMirror.setConsole(false);
		},

		onShowConsole: function() {
			this.refs.console.show() && this.refs.codeMirror.setConsole(true);
		},

		onClearMessages: function() {
			var props 		= this.props,
				files 		= props.files,
				includes 	= props.compiler.getIncludes() || [];
			for (var i = 0; i < includes.length; i++) {
				var filename 	= includes[i].filename,
					index 		= files.exists(filename);
				if (index !== false) {
					var file = files.getFile(index);
					file.getMeta().highlightLines = {};
				}
			}
			this.refs.codeMirror.setHighlight({});
		},

		openFile: function(filename) {
			var state 	= this.state,
				files 	= this.props.files,
				file 	= files.getFile(state.activeFileIndex),
				index 	= files.exists(filename);

			if (index === false) {
				return;
			}
			file.setData(this.refs.codeMirror.getCode());

			state.activeFileIndex = index;
			this.setState(this.state);
			file = files.getFile(state.activeFileIndex);
			if (file) {
				file.getData(function(data) {
					this.refs.codeMirror.setCode(data, file, getName());
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
						this.refs.codeMirror.setCode(data, file.getName());
					}.bind(this));
				}
			}

			return utilsReact.fromJSON({
				props: {
					id: 'main'
				},
				children: [
					{
						type: MenuComponent,
						props: {
							activeProject: this.state.activeProject,
							callbacks: {
								onShowProject: 	this.onShowProject,
								onNew: 			this.onNew,
								onSave: 		this.onSave,
								onSelectAll: 	this.onSelectAll,
								onFormatCode: 	this.onFormatCode,
								onFind: 		this.onFind,
								onFindNext: 	this.onFindNext,
								onFindPrev: 	this.onFindPrev,
								onUndo: 		this.onUndo,
								onRedo: 		this.onRedo,
								onMotors: 		this.onMotors,
								onSensors: 		this.onSensors,
								onExamples: 	this.onExamples,
								onRun: 			this.onRun
							}
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
							ref: 			'output',
							editor: 		this,
							onRun: 			this.onRun,
							onSmall: 		this.onSmall,
							onLarge: 		this.onLarge,
							onShowConsole: 	this.onShowConsole,
							motors: 		this.props.motors
						}
					},
					{
						type: ConsoleComponent,
						props: {
							ref: 				'console',
							onShowError: 		this.onShowError,
							onClearMessages: 	this.onClearMessages,
							onClose: 			this.onCloseConsole,
							editor: 			this
						}
					},
					{
						type: AlertDialog,
						props: {
							ref: 'alertDialog'
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
							editor: this,
							ref: 	'motorsDialog'
						}
					},
					{
						type: SensorsDialog,
						props: {
							editor: this,
							ref: 	'sensorsDialog'
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
					{
						type: NewDialog,
						props: {
							files: 	this.props.files,
							ref: 	'newDialog'
						}
					},
				]
			});
		}
	});
