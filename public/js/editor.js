(function() {
	function init() {
		var registers = {
				REG_OFFSET: 		T_NUMBER_REGISTER,
				REG_E: 				T_NUMBER_REGISTER,
				REG_NE: 			T_NUMBER_REGISTER,
				REG_L: 				T_NUMBER_REGISTER,
				REG_LE: 			T_NUMBER_REGISTER,
				REG_G: 				T_NUMBER_REGISTER,
				REG_GE: 			T_NUMBER_REGISTER,
				REG_DRAW_X: 		T_NUMBER_REGISTER,
				REG_DRAW_Y: 		T_NUMBER_REGISTER,
				REG_DRAW_X1: 		T_NUMBER_REGISTER,
				REG_DRAW_Y1: 		T_NUMBER_REGISTER,
				REG_DRAW_X2: 		T_NUMBER_REGISTER,
				REG_DRAW_Y2: 		T_NUMBER_REGISTER,
				REG_DRAW_WIDTH: 	T_NUMBER_REGISTER,
				REG_DRAW_HEIGHT: 	T_NUMBER_REGISTER,
				REG_DRAW_RADIUS: 	T_NUMBER_REGISTER,
				REG_MOTOR_TARGET: 	T_NUMBER_REGISTER,
				REG_MOTOR_POSITION: T_NUMBER_REGISTER,
				REG_MOTOR_POWER: 	T_NUMBER_REGISTER,
			},
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
						type: EditorComponent,
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