/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const load = function(files, onLoaded) {
    let fileIndex    = 0;
    let exportsByUrl = {};

    function getExtension(filename) {
        let f = filename.substr(-5);
        let i = f.lastIndexOf('.');
        if (f.indexOf('.') === -1) {
            return '';
        }
        let extension = f.substr(i + 1 - f.length);
        return extension;
    }

    function requestFile(url, callback) {
        let request = new XMLHttpRequest();
        request.onload = function(deps, count) {
            switch (request.status) {
                case 200:
                    callback(url, request.response);
                    break;
                case 404:
                    console.error('File not found:', url);
                    break;
            }
        };
        request.open('GET', url + '.js', true);
        request.send();
    }

    function getFullPath(id, url) {
        let u = url;
        let i;
        let done = false;
        if (id.substr(0, 2) === './') {
            i    = url.lastIndexOf('/');
            u    = u.substr(0, i);
            id   = id.substr(2 - id.length);
            done = true;
        }
        if (id.substr(0, 3) === '../') {
            if (!done) {
                i = u.lastIndexOf('/');
                u = u.substr(0, i);
            }
            i  = u.lastIndexOf('/');
            u  = u.substr(0, i);
            id = id.substr(3 - id.length);
            while (id.substr(0, 3) === '../') {
                i  = u.lastIndexOf('/');
                u  = u.substr(0, i);
                id = id.substr(3 - id.length);
            }
        }
        u += '/' + id;
        return u;
    }

    function onLoadFile(url, text) {
        let exports = {};
        let require = function(id) {
                let origId = id;
                let r      = exportsByUrl[getFullPath(id, url)];
                if (r) {
                    return r;
                }
                while (id.substr(0, 2) === './') {
                    id = id.substr(2 - id.length);
                }
                while (id.substr(0, 3) === '../') {
                    id = id.substr(3 - id.length);
                }
                for (let i in exportsByUrl) {
                    if (i.substr(-id.length) === id) {
                        return exportsByUrl[i];
                    }
                }
                console.error('Failed to load:', origId, id);
                return {};
            };

        eval('(function(require,exports){' + text + '\n})//# sourceURL=' + url)(require, exports);
        exportsByUrl[url] = exports;

        if (fileIndex < files.length) {
            let perc            = (fileIndex + 1) * 100 / files.length;
            let currentProgress = document.getElementById('currentProgress');
            currentProgress.innerHTML = Math.round(perc) + '%';
            let bar = document.getElementById('progressBar');
            bar.style.width = perc + '%';
            requestFile(files[fileIndex++], onLoadFile);
        } else {
            onLoaded(exportsByUrl);
            document.body.removeChild(document.getElementById('setupWrapper'));
        }
    }
    requestFile(files[fileIndex++], onLoadFile);
};
