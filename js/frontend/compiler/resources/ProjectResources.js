/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors          = require('../errors');
const ProjectResource = require('./ProjectResource').ProjectResource;
const ImageResource   = require('./ImageResource').ImageResource;
const TextResource    = require('./TextResource').TextResource;
const FormResource    = require('./FormResource').FormResource;
const path            = require('../../lib/path');

exports.ProjectResources = class {
    constructor(opts) {
        this._getFileData       = opts.getFileData;
        this._getEditorFileData = opts.getEditorFileData;
        this._getDataProvider   = opts.getDataProvider || false;
        this._projectFilename   = opts.projectFilename;
        this._resources         = [];
    }

    add(filename, data, token) {
        let resources = this._resources;
        for (let i = 0; i < resources.length; i++) {
            let projectResource = resources[i];
            if (projectResource.getFilename() === filename) {
                throw errors.createError(errors.DUPLICATE_RESOURCE, token, 'Duplicate resource "' + filename + '".');
            }
        }
        if (data) {
            switch (path.getExtension(filename)) {
                case '.rgf':
                    resources.push(new ImageResource({
                        filename:        filename,
                        data:            data,
                        getDataProvider: this._getDataProvider
                    }));
                    break;
                case '.rtf':
                    resources.push(new TextResource({
                        filename:        filename,
                        data:            data,
                        getDataProvider: this._getDataProvider
                    }));
                    break;
                default:
                    resources.push(new ProjectResource({
                        filename:        filename,
                        data:            data,
                        getDataProvider: this._getDataProvider
                    }));
                    break;
            }
        } else if (path.getExtension(filename) === '.wfrm') {
            resources.push(new FormResource({
                filename:          filename,
                data:              null,
                getDataProvider:   this._getDataProvider,
                getFileData:       this._getFileData,
                getEditorFileData: this._getEditorFileData
            }));
        } else {
            resources.push(new ProjectResource({
                filename:        filename,
                data:            data,
                getDataProvider: this._getDataProvider
            }));
        }
    }

    get(filename) {
        let resources = this._resources;
        let f         = '/' + filename;
        for (let i = 0; i < resources.length; i++) {
            if ((resources[i].getFilename() === filename) ||
                (resources[i].getFilename().substr(-f.length) === f)) {
                return resources[i];
            }
        }
        return null;
    }

    getProjectFilename() {
        return this._projectFilename;
    }

    getFilenameList() {
        let list = [];
        this._resources.forEach(function(projectResource) {
            list.push(projectResource.getFilename());
        });
        list.sort();
        return list;
    }

    getResources() {
        return this._resources;
    }

    save(outputPath) {
        this._resources.forEach(function(projectResource) {
            projectResource.save(outputPath);
        });
    }
};
