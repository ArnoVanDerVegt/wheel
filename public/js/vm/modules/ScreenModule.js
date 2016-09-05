wheel(
	'vm.modules.ScreenModule',
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
					var pixelRecord = vmData.getRecordFromAtOffset(['x', 'y']);
					ev3Screen.drawPixel(pixelRecord.x, pixelRecord.y, 0);
					break;

				case 2: // SCREEN_DRAW_NUM
					var drawNumRecord = vmData.getRecordFromAtOffset(['x', 'y', 'num']);
					ev3Screen.drawText(drawNumRecord.x, drawNumRecord.y, drawNumRecord.num, 0);
					break;

				case 3: // SCREEN_DRAW_TEXT
					var drawTextRecord = vmData.getRecordFromAtOffset(['x', 'y', 'text']);
					ev3Screen.drawText(drawTextRecord.x, drawTextRecord.y, vmData.getStringList()[drawTextRecord.text], 0);
					break;

				case 4: // SCREEN_DRAW_LINE
					var drawLineRecord = vmData.getRecordFromAtOffset(['x1', 'y1', 'x2', 'y2']);
					ev3Screen.drawLine(drawLineRecord.x1, drawLineRecord.y1, drawLineRecord.x2, drawLineRecord.y2, 0);
					break;

				case 5: // SCREEN_DRAW_RECT
					var drawRectRecord = vmData.getRecordFromAtOffset(['x', 'y', 'width', 'height']);
					ev3Screen.drawRect(drawRectRecord.x, drawRectRecord.y, drawRectRecord.width, drawRectRecord.height, 0);
					break;

				case 6: // SCREEN_DRAW_CIRCLE
					var drawCircleRecord = vmData.getRecordFromAtOffset(['x', 'y', 'radius']);
					ev3Screen.drawCircle(drawCircleRecord.x, drawCircleRecord.y, drawCircleRecord.radius, 0);
					break;

				case 7: // SCREEN_DRAW_IMAGE
					var drawImageRecord = vmData.getRecordFromAtOffset(['x', 'y', 'filename']);
					console.log(drawImageRecord);
					var filename 		= vmData.getStringList()[drawImageRecord.filename];
					console.log('filename', filename);
					var resource 		= this._resources[filename];
					console.log(resource);
					if (resource) {
						ev3Screen.drawImage(drawImageRecord.x, drawImageRecord.y, resource, 0);
					}
					break;

				default:
					console.error('Unknown drawing command "' + commandId + '".');
					break;
			}
		};
	})
);