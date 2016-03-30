(function() {
	function init() {
		var registers = {
				REG_EQ: 			'br',
				REG_NEQ: 			'br',
				REG_L: 				'br',
				REG_LE: 			'br',
				REG_G: 				'br',
				REG_GE: 			'br',
				REG_DRAW_X: 		'nr',
				REG_DRAW_Y: 		'nr',
				REG_DRAW_X1: 		'nr',
				REG_DRAW_Y1: 		'nr',
				REG_DRAW_X2: 		'nr',
				REG_DRAW_Y2: 		'nr',
				REG_DRAW_WIDTH: 	'nr',
				REG_DRAW_HEIGHT: 	'nr',
				REG_DRAW_RADIUS: 	'nr',
				REG_MOTOR_TARGET: 	'nr',
				REG_MOTOR_POSITION: 'nr',
				REG_MOTOR_POWER: 	'nr',
			},
			compiler 	= new Compiler({registers: registers}),
			motors 		= new Motors({}),
			vm 			= new VM({registers: registers, motors: motors}),
			files		= new Files({}),
			newFile;

		/*files.createFile({
			name: 'standard',
			data: STANDARD_FILE,
			open: true
		});
		files.createFile({
			name: 'test',
			data: TEST_FILE,
			open: true
		});*/

		ReactDOM.render(
			React.createElement(
				EditorComponent,
				{
					compiler: 	compiler,
					vm: 		vm,
					files: 		files,
					motors: 	motors
				}
			),
			document.getElementById('container')
		);
	}

	window.addEventListener(
		'load',
		function() {
			init(document.getElementById('code'), 'ev3', ev3_grammar);
		}
	);
})();