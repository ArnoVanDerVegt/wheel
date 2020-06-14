const express    = require('express');
const ideRoutes  = require('./js/backend/routes/ide').ideRoutes;
const app        = express();
const bodyParser = require('body-parser');
const port       = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

ideRoutes.setNode(true);

app.get ('/ide/file',                       ideRoutes.file.bind(ideRoutes));
app.post('/ide/file-save',                  ideRoutes.fileSave.bind(ideRoutes));
app.post('/ide/file-save-base64-as-binary', ideRoutes.fileSaveBase64AsBinary.bind(ideRoutes));
app.post('/ide/file-append',                ideRoutes.fileAppend.bind(ideRoutes));
app.post('/ide/file-delete',                ideRoutes.fileDelete.bind(ideRoutes));
app.post('/ide/file-size',                  ideRoutes.fileSize.bind(ideRoutes));
app.get ('/ide/files',                      ideRoutes.files.bind(ideRoutes));
app.get ('/ide/files-in-path',              ideRoutes.filesInPath.bind(ideRoutes));
app.post('/ide/directory-create',           ideRoutes.directoryCreate.bind(ideRoutes));
app.post('/ide/directory-delete',           ideRoutes.directoryDelete.bind(ideRoutes));
app.post('/ide/path-create',                ideRoutes.pathCreate.bind(ideRoutes));
app.get ('/ide/path-exists',                ideRoutes.pathExists.bind(ideRoutes));
app.post('/ide/rename',                     ideRoutes.rename.bind(ideRoutes));
app.get ('/ide/settings-load',              ideRoutes.settingsLoad.bind(ideRoutes));
app.post('/ide/settings-save',              ideRoutes.settingsSave.bind(ideRoutes));
app.get ('/ide/changes',                    ideRoutes.changes.bind(ideRoutes));
app.get ('/ide/user-info',                  ideRoutes.userInfo.bind(ideRoutes));
app.post('/ide/exec',                       ideRoutes.exec.bind(ideRoutes));

app.use(express.static('./'));

app.listen(
    port,
    function() {
        console.log('');
        console.log('Wheel IDE is running.');
        console.log('You can start Wheel at http://127.0.0.1:' + port + '/index.html in your browser...');
        console.log('');
    }
);