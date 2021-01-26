let fs       = require('fs');
let filelist = {};

// List all files in a directory in Node.js recursively in a synchronous fashion
let maxFileLength = 0;
let getFileList   = function(dir) {
        let files = fs.readdirSync(dir);
        files.forEach(function(file) {
            if (file === '.DS_Store') {
                return;
            }
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                getFileList(dir + '/' + file, filelist);
            } else {
                let extension    = file.substr(-3);
                let s            = dir + '/' + file;
                let templateFile = 'Wheel' + s.substr(18 - s.length);
                maxFileLength          = Math.max(maxFileLength, templateFile.length);
                filelist[templateFile] = fs.readFileSync(s).toString('base64');
            }
        });
    };

getFileList('../assets/template');

let output = 'let files = {};\n';
for (let file in filelist) {
    output += 'files[\'' + (file + '\'                                                          ').substr(0, maxFileLength + 1) + '] = \'' + filelist[file] + '\';\n';
}
output += 'exports.files = files;\n';
fs.writeFileSync('../js/frontend/ide/data/templates.js', output);
