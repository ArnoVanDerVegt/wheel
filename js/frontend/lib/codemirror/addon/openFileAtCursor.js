/* eslint-disable */
(function(mod) { mod(CodeMirror); })((CodeMirror) => {
    const findFilename = (line, ch) => {
            let i = ch;
            let j = ch;
            while (i > 0) {
                if (line[i] === '"') {
                    break;
                }
                i--;
            }
            while (j < line.length) {
                if (line[j] === '"') {
                    break;
                }
                j++;
            }
            return line.substr(i, j + 1 - i);
        };

    const fileExists = (dataProvider, filename, callback) => {
            dataProvider.getData(
                'get',
                'ide/path-exists',
                {path: filename},
                (data) => {
                    let exists = false;
                    try {
                        exists = JSON.parse(data).exists;
                    } catch (error) {
                    }
                    callback(exists);
                }
            );
        };

    CodeMirror.commands.openFileAtCursor = function(cm) {
        let line = findFilename(cm.getLine(cm.getCursor().line), cm.getCursor().ch);
        if ((line.length < 1) || (line[0] !== '"') || (line[line.length - 1] !== '"')) {
            return;
        }
        let codeDatabase = cm.getCodeDatabase();
        let dispatcher   = cm.getDispatcher();
        let settings     = cm.getSettings();
        let dataProvider = cm.getDataProvider();
        let fileIndex    = 0;
        let filename     = line.substr(1, line.length - 2);
        let files        = [settings.getDocumentPath() + '/' + filename];
        if (codeDatabase && codeDatabase.files && codeDatabase.files.length) {
            codeDatabase.files.forEach((file) => {
                if (file.filename.substr(-filename.length) === filename) {
                    files.push(file.filename);
                }
            });
        }
        const findFile = () => {
                fileExists(
                    dataProvider,
                    files[fileIndex],
                    (exists) => {
                        if (exists) {
                            dispatcher.dispatch('Dialog.File.Open', files[fileIndex]);
                        } else if (fileIndex < files.length - 1) {
                            fileIndex++;
                            findFile();
                        }
                    }
                );
            };
        findFile();
    };

    CodeMirror.keyMap['default']['Ctrl-Enter'] = 'openFileAtCursor';
});
