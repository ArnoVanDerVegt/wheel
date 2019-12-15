/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const errors          = require('../errors');
const ProjectResource = require('./ProjectResource').ProjectResource;
const ImageResource   = require('./ImageResource').ImageResource;
const TextResource    = require('./TextResource').TextResource;

exports.ProjectResources = class {
    constructor(projectFilename) {
        this._projectFilename = projectFilename;
        this._resources       = [];
    }

    add(filename, data, token) {
        let resources = this._resources;
        for (let i = 0; i < resources.length; i++) {
            let projectResource = resources[i];
            if (projectResource.getFilename() === filename) {
                throw errors.createError(err.DUPLICATE_RESOURCE, token, 'Duplicate resource "' + filename + '".');
            }
        }
        if (data) {
            switch (filename.substr(-4)) {
                case '.rgf':
                    resources.push(new ImageResource(filename, data));
                    break;
                case '.rtf':
                    resources.push(new TextResource(filename, data));
                    break;
                default:
                    resources.push(new ProjectResource(filename, data));
                    break;
            }
        } else {
            resources.push(new ProjectResource(filename, data));
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
