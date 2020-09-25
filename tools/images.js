let fs         = require('fs');
let filelist   = [];
let fileByName = {};

const removeWhitespace = (s) => {
        let lines  = s.split('\n');
        let result = '';
        for (let i = 0; i < lines.length; i++) {
            result += lines[i].trim();
        }
        return result;
    };

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
                        data = fs.readFileSync(s).toString();
                        if ((data.indexOf('&') !== -1) || (data.indexOf('#') !== -1)) {
                           data = 'data:image/svg+xml;base64,' + Buffer.from(removeWhitespace(data)).toString('base64');
                           console.log(data);
                        } else {
                            data = 'data:image/svg+xml,' + removeWhitespace(data);
                        }
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

const updateCssImages = (inputFilename, outputFilename) => {
        console.log('============= Process images =============');
        console.log('Input:  ', inputFilename);
        console.log('output: ', outputFilename);
        console.log('Images:');
        let css = fs.readFileSync(inputFilename).toString();
        for (let file in fileByName) {
            console.log('    >', file);
            let i = css.indexOf(file);
            while (i !== -1) {
                css = css.substr(0, i - 1) + '\'' + fileByName[file].data + '\'' + css.substr(i + 1 + file.length - css.length);
                i   = css.indexOf(file);
            }
        }
        fs.writeFileSync(outputFilename, css);
    };
updateCssImages(
    '../css/components/button.temp.css',
    '../css/components/button.css'
);
updateCssImages(
    '../css/components/nonVisual.temp.css',
    '../css/components/nonVisual.css'
);
updateCssImages(
    '../css/ide/components.temp.css',
    '../css/ide/components.css'
);
updateCssImages(
    '../css/ide/icon.temp.css',
    '../css/ide/icon.css'
);

