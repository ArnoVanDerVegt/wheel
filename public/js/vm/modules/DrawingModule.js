wheel(
	'vm.modules.DrawingModule',
	Class(wheel.vm.modules.VMModule, function(supr) {
		this.setEV3Screen = function(ev3Screen) {
			this._ev3Screen = ev3Screen;
		};

		this.run = function(commandId) {
			var vmData 		= this._vmData,
				ev3Screen 	= this._ev3Screen;

			switch (commandId) {
				case 0: // SCREEN_CLEAR
					ev3Screen.clearScreen();
					break;

				case 1: // SCREEN_DRAW_PIXEL
					var pixelRecord = vmData.getRecordFromRegOffset(['x', 'y']);
					ev3Screen.drawPixel(pixelRecord.x, pixelRecord.y, 0);
					break;

				case 2: // SCREEN_DRAW_NUM
					var drawNumRecord = vmData.getRecordFromRegOffset(['x', 'y', 'num']);
					ev3Screen.drawText(drawNumRecord.x, drawNumRecord.y, drawNumRecord.num, 0);
					break;

				case 3: // SCREEN_DRAW_TEXT
					var drawTextRecord = vmData.getRecordFromRegOffset(['x', 'y', 'text']);
					ev3Screen.drawText(drawTextRecord.x, drawTextRecord.y, drawTextRecord.text, 0);
					break;

				case 4: // SCREEN_DRAW_LINE
					var drawLineRecord = vmData.getRecordFromRegOffset(['x1', 'y1', 'x2', 'y2']);
					ev3Screen.drawText(drawLineRecord.x1, drawLineRecord.y1, drawLineRecord.x2, drawLineRecord.y1, 0);
					break;

				case 5: // SCREEN_DRAW_RECT
					var drawRectRecord = vmData.getRecordFromRegOffset(['x', 'y', 'width', 'height']);
					ev3Screen.drawText(drawRectRecord.x, drawRectRecord.y, drawRectRecord.width, drawRectRecord.height, 0);
					break;

				case 6: // SCREEN_DRAW_CIRCLE
					var drawCircleRecord = vmData.getRecordFromRegOffset(['x', 'y', 'radius']);
					ev3Screen.drawText(drawCircleRecord.x, drawCircleRecord.y, drawCircleRecord.radius, 0);
					break;

				default:
					console.error('Unknown drawing command "' + commandId + '".');
					break;
			}
		};
	})
);