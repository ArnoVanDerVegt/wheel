let fs         = require('fs');
let filelist   = [];
let fileByName = {};

// List all files in a directory in Node.js recursively in a synchronous fashion
let getFileList = function(dir) {
        let files = fs.readdirSync(dir);
        files.forEach(function(file) {
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                getFileList(dir + '/' + file, filelist);
            } else {
                let extension = file.substr(-3);
                if (['svg', 'png'].indexOf(extension) !== -1) {
                    let s = dir + '/' + file;
                    let data;
                    if (extension === 'svg') {
                        data = 'data:image/svg+xml,' + fs.readFileSync(s).toString().split('\n').join('');
                    } else {
                        data = 'data:image/' + extension + ';base64,' + fs.readFileSync(s).toString('base64');
                    }
                    let item = {
                        extension: extension,
                        import:    s,
                        export:    s.substr(10 - s.length),
                        data:      data
                    };
                    filelist.push(item);
                    fileByName[item.export] = item;
                }
            }
        });
    };

getFileList('../assets/images');

let output = 'let files = {};\n';
filelist.forEach(function(file) {
    let s = ('\'' + file.export + '\'                                               ').substr(0, 44);
    output += 'files[' + s.toLowerCase() + '] = \'' + file.data + '\';\n';
});

output += 'exports.getImage = function(src) { return files[src.toLowerCase()] || \'\'; };\n';

fs.writeFileSync('../js/frontend/ide/data/images.js', output);

let css = fs.readFileSync('../css/components/button.css').toString();
for (let file in fileByName) {
    let i = css.indexOf(file);
    console.log('Check:', file);
    if (i !== -1) {
        css = css.substr(0, i - 1) + '\'' + fileByName[file].data + '\'' + css.substr(i + 1 + file.length - css.length);
    }
}
fs.writeFileSync('../css/components/button.css', css);