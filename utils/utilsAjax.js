var ajaxUtils = {
		send: function(url, callback, postData) {
			var xmlHttpRequest = null;
			if (window.XMLHttpRequest) {
				xmlHttpRequest = new XMLHttpRequest();
			} else {
				try {
					xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
				} catch (e) {
					xmlHttpRequest = null;
				}
			}

			if (!xmlHttpRequest) {
				return;
			}

			xmlHttpRequest.open(postData ? 'POST' : 'GET', url, true);
			if (postData) {
				if (typeof postData === 'object') {
					var s = '';
					for (var i in postData) {
						s += ((s === '') ? '' : '&') + i + '=' + encodeURIComponent(postData[i]);
					}
					postData = s;
				}
				xmlHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xmlHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			}
			xmlHttpRequest.onreadystatechange = function () {
				if (xmlHttpRequest.readyState != 4) {
					return;
				}
				if ([200, 304, 422].indexOf(xmlHttpRequest.status) === -1) {
					callback(true, {status: xmlHttpRequest.status});
					return;
				}
				var responseText = xmlHttpRequest.responseText,
					data;
				try {
					data = JSON.parse(responseText);
				} catch (error) {
					data = responseText;
				}
				callback(false, data);
			};
			if (xmlHttpRequest.readyState == 4) {
				setTimeout(
					function() {
						ajaxUtils.send(url, callback, postData);
					},
					1000
				);
				return;
			}

			xmlHttpRequest.send(postData);
		}
	};
