var fs 			= require('fs'),
	path 		= require('path'),
	express 	= require('express'),
	bodyParser 	= require('body-parser'),
	app 		= express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
	// Set permissive CORS header - this allows this server to be used only as
	// an API server in conjunction with something like webpack-dev-server.
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Disable caching so we'll always get the latest comments.
	res.setHeader('Cache-Control', 'no-cache');
	next();
});

app.get('/api/dir', function(req, res) {
	var basePath = path.join(__dirname, 'projects');

	function getFiles(dir, files) {
		files = files || [];
		var list 	= fs.readdirSync(dir),
			extList = ['.mvm', '.mvmp', '.rgf'];
		for (var i in list){
			var name = dir + '/' + list[i];
			if (fs.statSync(name).isDirectory()) {
				files.push({
					name: 	name.substr(basePath.length - name.length),
					dir: 	true
				});
				getFiles(name, files);
			} else {
				var filename 	= name.substr(basePath.length - name.length),
					j 			= filename.indexOf('.');
				if (j !== -1) {
					var ext = filename.substr(j - filename.length);
					if (extList.indexOf(ext) !== -1) {
						files.push({
							name: filename
						});
					}
				}
			}
		}
		return files;
	}

	res.json({
		basePath: 	basePath,
		files: 		getFiles(basePath)
	});
});

app.get('/api/file', function(req, res) {
	if (req.query.filename) {
		var filename = path.join(__dirname, 'projects', req.query.filename);
		if (filename.substr(-4) === '.rgf') {
			var data 	= fs.readFileSync(filename),
				width 	= data[0],
				height 	= data[1],
				offset  = 16,
				readBit = function() {
					var offsetByte 	= offset >> 3,
						offsetBit 	= 1 << (offset & 7),
						result 		= ((data[offsetByte] & offsetBit) === offsetBit) ? 1 : 0;
					offset++;
					return result;
				};
				var file = '';
				for (var y = 0; y < height; y++) {
					var line = '';
					for (var x = 0; x < width; x++) {
						line += readBit().toString();
					}
					while ((offset & 7) !== 0) {
						offset++;
					}
					file += line + "\n";
				}

			res.send(file);
		} else {
			res.send(fs.readFileSync(filename));
		}
	} else {
		res.send('');
	}
});

app.post('/api/file', function(req, res) {
	fs.writeFileSync(path.join(__dirname, 'projects', req.query.filename), req.body.data);
	res.json({result: 'success'});
});

app.post('/api/remove-file', function(req, res) {
	fs.unlinkSync(path.join(__dirname, 'projects', req.query.filename));
	res.json({result: 'success'});
});

app.post('/api/remove-dir', function(req, res) {
	var deleteFolderRecursive = function(path) {
			if (fs.existsSync(path)) {
				fs.readdirSync(path).forEach(function(file,index){
					var curPath = path + '/' + file;
					if (fs.lstatSync(curPath).isDirectory()) {
						deleteFolderRecursive(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		};

	deleteFolderRecursive(path.join(__dirname, 'projects', req.query.path));
	res.json({result: 'success'});
});

app.get('/api/rename', function(req, res) {
	fs.renameSync(
		path.join(__dirname, 'projects', req.query.oldFilename),
		path.join(__dirname, 'projects', req.query.newFilename)
	);
	res.json({result: 'success'});
});

app.listen(app.get('port'), function() {
	console.log('Server started: http://localhost:' + app.get('port') + '/');
});