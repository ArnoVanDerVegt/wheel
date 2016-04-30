(function() {
	function init() {
		var registers = [
				{name: 'REG_OFFSET_STACK',		type: T_NUMBER_REGISTER},
				{name: 'REG_OFFSET_SRC',		type: T_NUMBER_REGISTER},
				{name: 'REG_OFFSET_DEST',		type: T_NUMBER_REGISTER},
				{name: 'REG_E',					type: T_NUMBER_REGISTER},
				{name: 'REG_NE',				type: T_NUMBER_REGISTER},
				{name: 'REG_L',					type: T_NUMBER_REGISTER},
				{name: 'REG_LE',				type: T_NUMBER_REGISTER},
				{name: 'REG_G',					type: T_NUMBER_REGISTER},
				{name: 'REG_GE',				type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_X1',			type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_Y1',			type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_X2',			type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_Y2',			type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_WIDTH',		type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_HEIGHT',		type: T_NUMBER_REGISTER},
				{name: 'REG_DRAW_RADIUS',		type: T_NUMBER_REGISTER},
				{name: 'REG_MOTOR_TARGET',		type: T_NUMBER_REGISTER},
				{name: 'REG_MOTOR_POSITION',	type: T_NUMBER_REGISTER},
				{name: 'REG_MOTOR_POWER',		type: T_NUMBER_REGISTER}
			],
			compiler 	= new Compiler({registers: registers}),
			motors 		= new Motors({}),
			vm 			= new VM({registers: registers, motors: motors}),
			files		= new Files({});

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