(function() {
	function init() {
		var registers = [
				{name: 'REG_OFFSET_STACK',		type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_OFFSET_SRC',		type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_OFFSET_DEST',		type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_E',					type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_NE',				type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_L',					type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_LE',				type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_G',					type: wheel.compiler.command.T_NUMBER_REGISTER},
				{name: 'REG_GE',				type: wheel.compiler.command.T_NUMBER_REGISTER}
			],
			compiler 	= new wheel.compiler.Compiler({registers: registers}),
			motors 		= new wheel.vm.Motors({}),
			vm 			= new wheel.vm.VM({registers: registers, motors: motors}),
			files		= new wheel.Files({});

		ReactDOM.render(
			utilsReact.fromJSON({
				props: {
					className: 'container-events'
				},
				children: [
					{
						type: wheel.components.editor.EditorComponent,
						props: {
							compiler: 	compiler,
							vm: 		vm,
							files: 		files,
							motors: 	motors
						}
					}
				]
			}),
			document.getElementById('container')
		);
	}

	window.addEventListener(
		'load',
		function() {
			init();
		}
	);
})();