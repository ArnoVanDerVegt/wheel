/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const Http      = require('../Http').Http;
const path      = require('../path');
const ideRoutes = require('../../../browser/routes/ide').ideRoutes;

let pathByIndex = {};

const getPathByIndex = function(index) {
        if (index in pathByIndex) {
            return pathByIndex[index];
        }
        pathByIndex[index] = 'Wheel';
        return pathByIndex[index];
    };

const routes = {
        'ide/files':            ideRoutes.files,
        'ide/file':             ideRoutes.file,
        'ide/file-save':        ideRoutes.fileSave,
        'ide/file-delete':      ideRoutes.fileDelete,
        'ide/files-in-path':    ideRoutes.filesInPath,
        'ide/settings-load':    ideRoutes.settingsLoad,
        'ide/settings-save':    ideRoutes.settingsSave,
        'ide/changes':          ideRoutes.changes,
        'ide/path-create':      ideRoutes.pathCreate,
        'ide/directory-create': ideRoutes.directoryCreate,
        'ide/directory-delete': ideRoutes.directoryDelete
    };

exports.HttpDataProvider = class {
    getData(method, uri, params, callback) {
        let currentPath;
        let files = require('./js/frontend/ide/data/templates').files;
        if (uri in routes) {
            setTimeout(
                function() {
                    routes[uri](params, callback);
                },
                1
            );
            return;
        }
        console.error('Unknown route:', uri);
    }
};
