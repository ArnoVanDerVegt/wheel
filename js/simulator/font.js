window.addEventListener(
	'DOMContentLoaded',
	function() {
		new wheel.simulator.Simulator({canvas: document.getElementById('display')});

		var image1 = new Image();
		image1.addEventListener(
			'load',
			function() {
				var canvas = document.createElement('canvas');
				canvas.width = image1.width;
				canvas.height = image1.height;
				var context = canvas.getContext('2d');
				context.drawImage(image1, 0, 0);

				var w = 8;
				var h = 9;

				var outputCanvas = document.createElement('canvas');
				outputCanvas.width = w;
				outputCanvas.height = 94 * h;
				var outputContext = outputCanvas.getContext('2d');

				context.strokeStyle = 'red';
				var div = document.createElement('div');
				var s = '';
				for (var i = 0; i < 94; i++) {
					var x = 22 + i * w;
					if (i > 21) {
						x += 49;
					}
					if (i > 43) {
						x += 49;
					}
					if (i > 65) {
						x += 49;
					}
					if (i > 79) {
						x += 113;
					}
					//context.strokeRect(x + 0.5, 10.5, w, h);
					outputContext.drawImage(
						image1,
						x, 11, w, h,
						0, i * h, w, h
					);
					s += String.fromCharCode(33 + i);
				}

				var imageData = outputContext.getImageData(0, 0, w, 94 * h);
				var data = imageData.data;
				var offset = 0;
				for (var y = 0; y < 94 * h; y++) {
					for (var x = 0; x < w; x++) {
						if (data[offset] === 0) {
							offset += 4;
						} else {
							data[offset++] = 255;
							data[offset++] = 255;
							data[offset++] = 255;
							offset++;
						}
					}
				}
				outputContext.putImageData(imageData, 0, 0);

				var input = document.createElement('input');
				input.type = 'text';
				input.value = outputCanvas.toDataURL('image/png');
				document.body.appendChild(input);
			}
		);
		image1.src = 'simulator/small.png';


		var image2 = new Image();
		image2.addEventListener(
			'load',
			function() {
				var canvas = document.createElement('canvas');
				canvas.width = image2.width;
				canvas.height = image2.height;
				var context = canvas.getContext('2d');
				context.drawImage(image2, 0, 0);

				var w = 8;
				var h = 9;

				var outputCanvas = document.createElement('canvas');
				outputCanvas.width = w;
				outputCanvas.height = 94 * h;
				var outputContext = outputCanvas.getContext('2d');

				context.strokeStyle = 'red';
				var div = document.createElement('div');
				var s = '';
				for (var i = 0; i < 94; i++) {
					var x = 23 + i * w;
					if (i > 21) {
						x += 49;
					}
					if (i > 43) {
						x += 49;
					}
					if (i > 65) {
						x += 49;
					}
					if (i > 79) {
						x += 113;
					}
					//context.strokeRect(x + 0.5, 8.5, w, h);
					outputContext.drawImage(
						image2,
						x, 9, w, h,
						0, i * h, w, h
					);
					s += String.fromCharCode(33 + i);
				}

				var imageData = outputContext.getImageData(0, 0, w, 94 * h);
				var data = imageData.data;
				var offset = 0;
				for (var y = 0; y < 94 * h; y++) {
					for (var x = 0; x < w; x++) {
						if (data[offset] === 0) {
							offset += 4;
						} else {
							data[offset++] = 255;
							data[offset++] = 255;
							data[offset++] = 255;
							offset++;
						}
					}
				}
				outputContext.putImageData(imageData, 0, 0);

				var input = document.createElement('input');
				input.type = 'text';
				input.value = outputCanvas.toDataURL('image/png');
				document.body.appendChild(input);
			}
		);
		image2.src = 'simulator/medium.png';

		var image3 = new Image();
		image3.addEventListener(
			'load',
			function() {
				var canvas = document.createElement('canvas');
				canvas.width = image3.width;
				canvas.height = image3.height;
				var context = canvas.getContext('2d');
				context.drawImage(image3, 0, 0);

				var w = 16;
				var h = 16;

				var outputCanvas = document.createElement('canvas');
				outputCanvas.width = w;
				outputCanvas.height = 94 * h;
				var outputContext = outputCanvas.getContext('2d');

				context.strokeStyle = 'red';
				var div = document.createElement('div');
				var s = '';
				for (var i = 0; i < 94; i++) {
					var x = 11 + i * w;
					if (i > 10) {
						x += 16;
					}
					if (i > 21) {
						x += 14;
					}
					if (i > 32) {
						x += 18;
					}
					if (i > 43) {
						x += 15;
					}
					if (i > 54) {
						x += 14;
					}
					if (i > 65) {
						x += 23;
					}
					if (i > 76) {
						x += 49;
					}
					if (i > 87) {
						x += 49;
					}
					//context.strokeRect(x + 0.5, 12.5, w, h);
					outputContext.drawImage(
						image3,
						x, 13, w, h,
						0, i * h, w, h
					);
					s += String.fromCharCode(33 + i);
				}

				var imageData = outputContext.getImageData(0, 0, w, 94 * h);
				var data = imageData.data;
				var offset = 0;
				for (var y = 0; y < 94 * h; y++) {
					for (var x = 0; x < w; x++) {
						if (data[offset] === 0) {
							offset += 4;
						} else {
							data[offset++] = 255;
							data[offset++] = 255;
							data[offset++] = 255;
							offset++;
						}
					}
				}
				outputContext.putImageData(imageData, 0, 0);

				var input = document.createElement('input');
				input.type = 'text';
				input.value = outputCanvas.toDataURL('image/png');
				document.body.appendChild(input);
			}
		);
		image3.src = 'simulator/large.png';
	}
)
