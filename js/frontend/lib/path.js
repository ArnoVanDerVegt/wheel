/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
let sep = '/';

exports.sep = sep;
exports.setSep = function(s) {
    sep         = s;
    exports.sep = s;
};

exports.getExtension = function(filename) {
    let i = filename.lastIndexOf('/');
    if (i !== -1) {
        filename = filename.substr(i + 1 - filename.length);
    }
    i = filename.lastIndexOf('.');
    if ([-1, 0].indexOf(filename.indexOf('.')) !== -1) {
        return '';
    }
    let extension = filename.substr(i - filename.length);
    return extension;
};

exports.getPathAndFilename = function(f) {
    let i = f.lastIndexOf('/');
    if (i === -1) {
        return {path: '', filename: f};
    }
    if (i === f.length - 1) {
        return {path: f.substr(0, i), filename: ''};
    }
    return {
        path:     exports.removeRightSlashes(f.substr(0, i + 1)),
        filename: exports.removeSlashes(f.substr(i - f.length + 1))
    };
};

exports.getPath = function(f) {
    return exports.getPathAndFilename(f).path;
};

exports.replaceExtension = function(filename, extension) {
    let e = exports.getExtension(filename);
    if (e === '') {
        return filename;
    }
    return filename.substr(0, filename.length - e.length) + extension;
};

exports.removeLeftSlashes = function(path) {
    if (path.substr(0, 1) === '/') {
        path = path.substr(1 - path.length);
    }
    return path;
};

exports.removeRightSlashes = function(path) {
    if (path.substr(-1) === '/') {
        path = path.substr(0, path.length - 1);
    }
    return path;
};

exports.removeSlashes = function(path) {
    return exports.removeLeftSlashes(exports.removeRightSlashes(path));
};

exports.makePlatformPath = function(path) {
    if (sep === '/') {
        return path;
    }
    return path.split('/').join('\\');
};

exports.addPath = function(p1, p2) {
    if (p1 === '') {
        return p2;
    }
    if (p2 === '') {
        return p1;
    }
    return exports.removeSlashes(p1) + '/' + exports.removeSlashes(p2);
};

exports.join = function() {
    if (arguments.length === 1) {
        return arguments[0];
    }
    let result = [];
    for (let i = 0, j = arguments.length - 1; i <= j; i++) {
        if (i === 0) {
            result.push(exports.removeRightSlashes(arguments[i]));
        } else if (i === j) {
            result.push(exports.removeLeftSlashes(arguments[i]));
        } else {
            result.push(exports.removeSlashes(arguments[i]));
        }
    }
    return result.join('/');
};

exports.isWindowsRootPath = function(path) {
    return ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(path[0].toUpperCase()) !== -1) &&
        ((path.substr(1, 2) === ':\\') || (path.substr(1, 2) === ':/'));
};

exports.addRootPath = function(path) {
    if (sep === '/') {
        if (path[0] !== '/') {
            return '/' + path;
        }
        return path;
    }
    if (exports.isWindowsRootPath(path)) {
        return path;
    }
    return sep + path;
};

exports.removePath = function(path, filename) {
    if ((path !== '') && (filename.indexOf(path) === 0)) {
        return filename.substr(path.length + 1 - filename.length);
    }
    return filename;
};
